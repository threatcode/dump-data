/**
 *@description : 
 * 1 : worker ensures always connected to server through websocket if user is login and if not login reconnect on demand
 * 2 : worker takes two parameter onmessage (command,input)
 * 3 : from command it should take steps
 * 4 : 1 browser tab have one base worker
 * 5 : it also parse all response before send it to main application
 * 6 : it should reject if in certain time no reponse comes for a request with certain packetId
 * 7 : Reconnect websocket policies : 
 *     # if socket find a exception it will try five time too connect if can't then send a reload request to main application
 *       reload will be taken for first time second time same things happen then its will send a disable request to all input 
 *       from user which may require socket connection(application may show user that he need to upgrade his browser or change network)
 *     # it will not close connection itself until unload occurs, but if server closes the connection(when user is not login after 100s server closes connection) it will not connect until next data send request comes
 *     # 
 *  8 : it should keep track of all request to reject if server does not reply or in case some packet loss it should handle it via reject or accpet for some cases
 *  9 : it should send keep alive packet on its own via a command from main thread and also can stop sending keepalive packet
 */

var Logger = {
   log : function(){
      postMessage({
        notifier : "debug",
        m : Array.prototype.slice.call(arguments)
      });
   }
}

var settings = {
                CLIENT_DATA_SIZE : 460,
                device : 5};

var connection,
    pendingRequest = {},toIgnorePacketIds={},PingPongMap={last_received : 0,last_sent : 0,sc:0,rc:0,net_error:false},
    keepAlivePacket, KeepAliveInterval,floodingRequest={},brokenRequest={},brokenData={},floodingData={},floodingDataInterval,brokenRequestInterval,ProccessRunning=false;

importScripts('worker.wat.js');
importScripts("socket.js");
importScripts('sender.js');
importScripts('parser.js');
//connection = new SocketProvider();
  function socketOnMessage(msg){
      var DataViewObject,message;
      DataViewObject = new DataView(msg);
      if(!DataViewObject.byteLength){
          throw new Error("Invalid Array Buffer to Parse : worker js socket on message");
      }
      message = RingParser.parse(DataViewObject);
      //RingLogger.information(angular.toJson(message),RingLogger.tags.RECEIVED);
      if(message){
        if(message.actn === 200){
            if(message.pckId){
              if(floodingData[message.pckId]){
                  floodingData[message.pckId].ack = true;
              }else if(brokenData[message.pckId]){
                  var wholePacketId = brokenData[message.pckId].packetId;
                  var ind = brokenRequest[wholePacketId].packets.indexOf(message.pckId);
                  if(ind > -1){
                    brokenRequest[wholePacketId].packets.splice(ind,1);
                    brokenRequest[wholePacketId].totalAck++;
                    delete brokenData[message.pckId];
                  }
                  
                  
              }
            }
            Logger.log(message,'ACKNOWLDGE');
        }else if(message.actn === 4000){//pong message from server
            PingPongMap.last_received = Date.now();
            PingPongMap.rc++;
            Logger.log(message,'PONG');
        }else{
          if(message.pckId){
              if(toIgnorePacketIds[message.pckId]){ // the response is for a previous page request so ignoring it
                // the packetIds are cleared in keepalive function
                Logger.log(message,'IGNORING_FOR_ROUTE_CHANGE');
                  return;
              }
              if(floodingData[message.pckId]){
                  floodingData[message.pckId].ack = true;
                  floodingData[message.pckId].responded = true;
              }else if(brokenRequest[message.pckId]){
                brokenRequest[message.pckId].ack = true;
                brokenRequest[message.pckId].responded = true;
              }
            }
          postMessage({data:message,notifier : "received"});
          Logger.log(message,'RECEIVED');
        }
        
      }
  }
  function responseFalse(action,packId){
    //if(floodingData[packId]){
      //floodingData[packId].acknowledged = true;
     // floodingData[packId].responded = true;
    //}else

     if(brokenRequest[packId]){
      brokenRequest[packId].ack = true;
      brokenRequest[packId].responded = true;
    } 

    postMessage({data:{actn : parseInt(action),pckId : packId, sucs : false,rc : 1111},notifier : "received"});
  }
  function socketOnOpen(){
    if(PingPongMap.net_error){
      PingPongMap.net_error = false;
      postMessage({name:"NET_SUCCESS",notifier : "event"});
      if(settings.aSkey){
        keepAlive();
      }
      
    } 
  }
  self.onmessage = WorkerOnMessageProcessor;

  function WorkerOnMessageProcessor(e){
      if(!e.data.command){
          throw new Error("You must provide a command to operate worker");
      }
      switch(e.data.command){
        case 'SETTINGS' :
          if(connection){
            connection.close();
          }
          object_extend(settings,e.data);
          connection = new SocketProvider(settings.url);
          connection.onOpen(socketOnOpen);
          connection.onMessage(socketOnMessage);
          Logger.log(settings,"WORKER_SETTTING");
          break;
        case 'UPDATE_SALT' : 
            stopKeepAlive();
            settings.aSkey = e.data.aSkey;
            keepAlive();
            break;
        case 'SEND' : // send data through websocket
            buildPacketAndSend(e.data);
            // if(e.data.identifier){
            //   pendingRequest[e.data.identifier] =  Date.now();
            // }
            break;
        case 'PAUSE' : 
            connection && connection.pause(true);
           break;
        case 'RESUME' : 
            connection && connection.pause(false);
            break;
        case 'ROUTE_CHANGE' :
            clearPageActions();
            break;
        case 'KEEPALIVE' :
              if(e.data.aSkey){
                if(settings.aSkey !== e.data.aSkey){
                  settings.aSkey = e.data.aSkey;
                }
              }
              if(e.data.uKey){
                settings.uKey = e.data.uKey;
              }
              keepAlive();
          break;
        default:
            //Logger.log("command :"+e.data.command+ "not found","WORKER_COMMAND");
          break;
      };
        //Logger.log(e.data,"WORKER__REQUEST_RECEIVED");
  }
  /**
   * When route changes we need to clear page specific requests like [88,87,110,94,198]//all are feed requests
   */
  function clearPageActions(){
    var actionsToClear = [88,87,110,94,198],i,j;

    for(i=0;i<actionsToClear.length;i++){
      if(floodingRequest[actionsToClear[i]] && floodingRequest[actionsToClear[i]].length){
        for(j=0;j < floodingRequest[actionsToClear[i]].length;j++){
          if(!floodingData[floodingRequest[actionsToClear[i]]].responded){//checking current packet already responded if not then putting packetId to ignoreList
            toIgnorePacketIds[floodingRequest[actionsToClear[i]]] = Date.now();
          }
          delete floodingData[floodingRequest[actionsToClear[i]]];
          floodingRequest[actionsToClear[i]].splice(i,1);
        }
      }
    }


  }

  
