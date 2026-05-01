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
 *     # it will not close connection itself until unload occurs, but if server closes the connection(when user is not login after 100s server closes connection) it will not connect until next data connection
 *     # 
 *  8 : it should keep track of all request to reject if server does not reply or in case some packet loss it should handle it via reject or accpet for some cases
 *  9 : it should send keep alive packet on its own via a command from main thread and also stop sending keepalive packet
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
ipip  CLIENT_DATA_SIZE : 460,
  device : 5
};

var connection,
    pendingRequest = {},
    keepAlivePacket, KeepAliveInterval,floodingRequest={},brokenRequest={},brokenData={},floodingData={},floodingDataInterval,brokenRequestInterval,ProccessRunning=false;

importScripts('worker.wat.js');
importScripts("socket.js");
importScripts('sender.js');
importScripts('parser.js');


var AuthChannel = new MessageChannel();

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
        }else{
          if(message.pckId){
              if(floodingData[message.pckId]){
                  floodingData[message.pckId].ack = true;
                  floodingData[message.pckId].responded = true;
              }else if(brokenRequest[message.pckId]){
                brokenRequest[message.pckId].ack = true;
                brokenRequest[message.pckId].responded = true;
              }
            }
          postMessage({data:message,notifier : "received"});              
        }
        Logger.log(message,'RECEIVED');
      }
  }
  function responseFalse(action,packId){
    if(floodingData[packId]){
      floodingData[packId].acknowledged = true;
      floodingData[packId].responded = true;
    }else if(brokenRequest[packId]){
      brokenRequest[packId].ack = true;
      brokenRequest[packId].responded = true;
    }

    postMessage({data:{actn : action,pckId : packId, sucs : false,rc : 1111},notifier : "received"});
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
          connection.onMessage(socketOnMessage);
          Logger.log(settings,"WORKER_SETTTING");
          break;
        case 'UPDATE_SALT' : 
            settings.salt = e.data.salt;
            if(connection.isOpen()){ 
              connection.close();
            }
            stopKeepAlive();
            connection = new SocketProvider(settings.url);
            connection.onMessage(socketOnMessage);
            break;
        case 'SEND' : // send data through websocket
            buildPacketAndSend(e.data);
            if(e.data.identifier){
              pendingRequest[e.data.identifier] =  Date.now();
            }
            break;
        case 'PAUSE' : 
            connection && connection.pause(true);
           break;
        case 'RESUME' : 
            connection && connection.pause(false);
            break;
        case 'KEEPALIVE' :
              if(e.data.salt){
                if(settings.salt !== e.data.salt){
                  settings.salt = e.data.salt;
                  if(connection.isOpen()){ 
                    connection.close();
                  }else if(connection.isConnecting()){
                    connection.onOpen(connection.close);
                  }
                  connection = null;
                  stopKeepAlive();
                  connection = new SocketProvider(settings.url);
                  connection.onMessage(socketOnMessage);
                }
              }
              if(e.data.uKey){
                settings.uKey = e.data.uKey;
              }
              keepAlive();
          break;
        default:
            Logger.log("command :"+e.data.command+ "not found","WORKER_COMMAND");
          break;
      };
        Logger.log(e.data,"WORKER__REQUEST_RECEIVED");
  }

  
