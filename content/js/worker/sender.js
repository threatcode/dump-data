function buildPacketAndSend(message){
         var data = message.data || {},pack;
          data.pckId = message.packetId;
          if (!!settings.aSkey) {
             data.sId = settings.aSkey;//adding session id for session dependent request
          }
          data.tbid = settings.tabId;//adding tabid for every request
          data.dvc = settings.device;//adding device number for every request
          Logger.log(data,"PACKET_DATA");
          data = JSON.stringify(data);//converting data to string

          if((data.length + 2 > settings.CLIENT_DATA_SIZE) && message.data.actn !== 25 && message.port !== 3){ // including request_type and packet_type
              //sending as broken
              pack = changeMessageToByte(data,1,message.port);//broken packet type is 1
              return sendBrokenPacket(pack,message.action,message.port,message.packetId);
          }else{
            //sending as complete packet
               pack = changeMessageToByte(data,0,message.port);// complete packet type is 0
               sendData(pack,message.action,message.packetId,message.port ==3,message.flooding);//forcing for auth port request
          }

}
/**
 * for keeping track of every request
 * @param  {typedArray} data     [the data to send]
 * @param  {int} action   [current action number]
 * @param  {string} packetId [packet id]
 * @param  {bolean} force    [force sending when socket has stopped sending]
 * @param  {bolean} flooding [request requires flooding facility or not]
 * @return none
 */
function sendData(data,action,packetId,force,flooding){ 
  if(!floodingRequest[action]){
      floodingRequest[action] = [];
  }

  if(!flooding && floodingRequest[action].length){//so its not a flooding request , we cannot allow to send new one until previous one resolved
      Logger.log("already sending a same action request",action,packetId,"FLOODING_ERROR");
      return;
  }

  floodingData[packetId] = {//assigning request data object to global flooding data
      action : action,
      data : data,
      force : !!force,
      ack : false,//server ackknowledged
      responded : false,// server reponded
      scount : 0,// send count
      lrt : 0,   //last request time
      frt : 0,   //first request time
      ttl : 10,
  };
  floodingRequest[action].push(packetId);//pushing packet id to global floodingRequest
   if(!floodingDataInterval){
       floodingDataInterval = setTimeout(processSafeModeSender,300);//firing
    } 
}

function deleteExpiredPacket(){
  var actions = Object.keys(floodingRequest);
  
  var actionsToPurge = [];
  

  actions.forEach(function(anAction){
    
    var packetIdsToPurge = {};

    floodingRequest[anAction].forEach(function(aPacketId){
       if ( !floodingData[aPacketId]  ){
        delete floodingData[aPacketId];                    
        
        packetIdsToPurge[aPacketId] = true;

        responseFalse(anAction,aPacketId);

       }else{
          floodingData[aPacketId]['ttl']--;
       }
    });

    var newFloadingRequestsForAction = [];
    floodingRequest[anAction].forEach(function(aPacketId){
       
       if( !floodingData[aPacketId].ttl) {
          actionsToPurge.push(anAction);
       }

       if( !packetIdsToPurge[aPacketId] ){
          newFloadingRequestsForAction.push(aPacketId);
       }
    });
    
    floodingRequest[anAction] = newFloadingRequestsForAction;

  });

  actionsToPurge.forEach(function(anAction){
    delete floodingRequest[anAction];
  });
}


function processSafeModeSender(){ 
    var packId,pack,floodingFlag=false,actn;
    ProccessRunning = true;
    //Logger.log("process processSafeModeSender called","DEBUG");
    //Logger.log(floodingRequest);
    if(!connection.isOpen() && !connection.isConnecting()){
      deleteExpiredPacket();
      //Logger.log("reconnect requested","DEBUG");
      connection.reconnect();
      setTimeout(processSafeModeSender,1500);
      ProccessRunning = false;
      return;
    }
    for(actn in floodingRequest){
   //   RingLogger.print("inside loop flooding data" ,"SafeModeSender");
        if(floodingRequest.hasOwnProperty(actn) && floodingRequest[actn].length){
            sendCurrentActionRequests(actn,floodingRequest[actn]);
		  Logger.log("current stack actn =>" + actn + " : "+floodingRequest[actn].length,"REQUEST_STACK");
            if( floodingRequest[actn].length ){
              floodingFlag = true;
            }else{
              delete floodingRequest[actn];
            }
            
        }
    }

    ProccessRunning = false;
    if(floodingFlag){
      floodingDataInterval = setTimeout(processSafeModeSender,300);
    }else{
      floodingDataInterval = null;
    }
    
}
function sendCurrentActionRequests(actn,actnDataArr){ 
    var i,packId,pack,currentTime = Date.now();
    for(i=0;i < actnDataArr.length;i++){
                packId = actnDataArr[i];
                pack = floodingData[packId];
                if(!pack){actnDataArr.splice(i,1); return sendCurrentActionRequests(actn,actnDataArr);}
                if(pack.ack || pack.responded){
                    if(pack.responded){
                      delete floodingData[packId];
                      actnDataArr.splice(i,1);
                    }else{
                      if(currentTime - pack.frt > 60000){
                        delete floodingData[packId];
                        actnDataArr.splice(i,1);
                        responseFalse(actn,packId);
                      }

                    }
                    
                }else{

                  if(pack.scount > 9){
                    delete floodingData[packId];                    
                    actnDataArr.splice(i,1);
                    responseFalse(actn,packId);
                    continue;
                  }
                  if(pack.scount > 0 && currentTime - pack.lrt < 3000){
                    continue;
                  }
                  Logger.log("action => "+actn +" packId =>"+ packId +" time : => "+ (currentTime - pack.lrt) + "  count => "+ pack.scount,"SENDER");
                  connection.send(pack.data,pack.force);
                  pack.scount++;
                  pack.lrt = currentTime;
                  if(pack.scount === 1){
                    pack.frt = currentTime;
                  }                  
                  
                  break;
                }
    }

}


 function changeMessageToByte(message,packetType,request_type){ // message as string/object
         if (!isString(message)) {
            message = JSON.stringify(message);
         }

         var buffer,messageViewArray,index= 0,len = packetType ? message.length : message.length + 2;
         buffer = new ArrayBuffer(len);
         messageViewArray = new DataView(buffer);
         if(!packetType){ // for broken packet 1, else 0 so we have to add two byte if its complete packet
             messageViewArray.setUint8(index++,request_type);
             messageViewArray.setUint8(index++,0);
         }
         if(message.length){
          
          for(i=0;i<message.length;i++){
                 messageViewArray.setUint8(index++,message.charCodeAt(i));
          }
         }
         return messageViewArray;
     }
function keepAlive(){
       if (!settings.aSkey) {
         return false;
          }
       var dataTosend = new ArrayBuffer(settings.aSkey.length +2),index=2;
          keepAlivePacket  = new DataView(dataTosend);

       keepAlivePacket.setUint8(0,1);// 1 is keep alive port
       keepAlivePacket.setUint8(1,0);//complete packet

       for(i=0;i<settings.aSkey.length;i++){
            keepAlivePacket.setUint8(index++,settings.aSkey.charCodeAt(i));
        }

        if(KeepAliveInterval){
          clearInterval(KeepAliveInterval);
        }
          
      KeepAliveInterval =  setInterval(function(){
            if(PingPongMap.last_sent > PingPongMap.last_received){
              if(PingPongMap.sc - PingPongMap.rc > 3){
                postMessage({name:"NET_ERROR",notifier : "event"});
                PingPongMap.sc = 0;
                PingPongMap.sc = 0;
                PingPongMap.last_sent=0;
                PingPongMap.last_received=0;
                PingPongMap.net_error = true;
                return stopKeepAlive();
              }
            }
            if(connection.isOpen()){
              connection.send(keepAlivePacket);
            }
            PingPongMap.last_sent = Date.now();
            PingPongMap.sc++;
            
            // clearing packetIds From IgnoreList
            var key,now_time = Date.now();
            for(key in toIgnorePacketIds){
              if(toIgnorePacketIds.hasOwnProperty(key)){
                if(now_time - toIgnorePacketIds[key] > 5000){
                  delete toIgnorePacketIds[key];
                }
              }
            }


          Logger.log(keepAlivePacket.print_r("return"),"PING");

          //Clear chatRequestMap 
          try{

              Object.keys( chatRequestMap ).forEach(function(aRequestKey){
                if( Date.now() - chatRequestMap[aRequestKey] > 10000){
                  delete chatRequestMap[aRequestKey];
                }
              });  
              
          }catch(e){
            Logger.log('Clear Request Map Error', e, 'CHAT');
          }

       },10000);
        
}

function stopKeepAlive(){
     clearInterval(KeepAliveInterval);
     KeepAliveInterval = null;
     keepAlivePacket = null;
}


function sendBrokenPacket(messageViewArray,actn,request_type,wholePacketId){ //message expected as string
                   var packets = [],hi, i,headerLength=129,full_packet,packet_start=0,packet_end,// with full packet there are two bytes of request type and packet type sp excluding it
                       len = messageViewArray.byteLength,header,headbuf,last_sent = Date.now(),now;

                   var totalPacket = Math.ceil(len/settings.CLIENT_DATA_SIZE),packetId,
                       uniqueKey =  (settings.aSkey || settings.sKey).substr(1,4) + getUniqueId(settings.tabId).toString(),
                       glu = totalPacket < 128 ? 1:2;//one byte or two byte
				       Logger.log("PacketId : " + wholePacketId + " TotalPacket : "+totalPacket,"BROKEN_PACKET");
                   for(i=0;i<totalPacket;i++){
                       packet_end = (settings.CLIENT_DATA_SIZE*(i+1))-1;
                       if(packet_end > len){
                           packet_end = len-1;//if its over the data
                       }
                       packetId = (settings.aSkey || settings.sKey).substr(-4,4)+"-"+ i +"-" + getUniqueId(settings.tabId).toString();
                       headbuf = new ArrayBuffer(headerLength+(packet_end-packet_start+1));
                       header = new DataView(headbuf);
                       header.setUint8(0,request_type);//setting request type on first byte
                       header.setUint8(1,1);//setting packet type on second byte
                       hi = 2;
                       hi = header.addAttributeInt(hi,ATTRIBUTE_CODES.ACTION,2,actn);
                       hi = header.addAttributeString(hi,ATTRIBUTE_CODES.CLIENT_PACKET_ID,packetId);
                       hi = header.addAttributeInt(hi,ATTRIBUTE_CODES.TOTAL_PACKET,glu,totalPacket);
                       hi = header.addAttributeInt(hi,ATTRIBUTE_CODES.PACKET_NUMBER,glu,i);//current packet number
                       hi = header.addAttributeString(hi,ATTRIBUTE_CODES.UNIQUE_KEY,uniqueKey);
                       if(settings.aSkey){
                         hi = header.addAttributeString(hi,ATTRIBUTE_CODES.WEB_UNIQUE_KEY,settings.aSkey);
                       }
                       hi = header.addAttributeInt(hi,ATTRIBUTE_CODES.WEB_TAB_ID,1,settings.tabId);
                       hi = header.addAttributeData(hi,ATTRIBUTE_CODES.DATA,messageViewArray,packet_start,(packet_end-packet_start+1));
                       packet_start = packet_end+1;
                       //full_packet = header.merge(0,hi,messageViewArray,packet_start,packet_end);
                       //data_packet = messageViewArray.copy(packet_start,packet_end+1);
                       //console.info("packet Number" + i);
                       full_packet = header.copy(0,hi);
                        // if(!socket.socket){
                        // packets.push(header.copy(0,hi));
                        // }else{
                       sendbPacket(wholePacketId,full_packet,packetId,actn);
                       Logger.log("Pushed : "+i,"BROKEN_PACKET");
                        // }
                     }
                     brokenRequest[wholePacketId].timeout = Math.max(Math.min((totalPacket * 1),30*glu),10);
						if(!brokenRequestInterval){
						processBrokenRequest();
						}


                      
  }


/**
 * @description : for sending broken packets
 */

function sendbPacket(wholePacketId,pack,packId,action){
     

     if(!brokenRequest[wholePacketId]){
        brokenRequest[wholePacketId] = {
          packets : [],
          total : 0,
          totalAck : 0,
          rs : 0,//request start
          responded : false
        }
     }
     brokenRequest[wholePacketId].packets.push(packId);
     brokenRequest[wholePacketId].total++;

     brokenData[packId] = {
      action : action,
      packetId : wholePacketId,
      data : pack,
      ack : false,//server ackknowledged
      scount : 0,// send count
      lrt : 0,   //last request time
      frt : 0   //first request time
     };

}

function processBrokenRequest(){
    var wPacketId,i,tempPacketArray,packet,currentTime=Date.now(),floodingFlag = false;
    Logger.log("Started Sending TimeOut","BROKEN_PACKET");
  if(!connection.isOpen() && !connection.isConnecting()){
      connection.reconnect();
      brokenRequestInterval = setTimeout(processBrokenRequest,1500);
      return;
  }

  for(wPacketId in brokenRequest){
    if(brokenRequest.hasOwnProperty(wPacketId) && brokenRequest[wPacketId].packets.length){
    		Logger.log("Starting For WholePacket : "+wPacketId,"BROKEN_PACKET");
          tempPacketArray = brokenRequest[wPacketId].packets;
          if(!brokenRequest[wPacketId].rs){
            brokenRequest[wPacketId].rs = currentTime;
          }
          if(brokenRequest[wPacketId].responded){
            for(i=0;i < tempPacketArray.length;i++){
                delete brokenRequest[tempPacketArray[i]];
            }
            delete brokenRequest[wPacketId];
            Logger.log("deleted : "+wPacketId+ "Because Its responded","BROKEN_PACKET");
          }else if(!tempPacketArray.length && (currentTime - brokenRequest[wPacketId].rs) > brokenRequest[wPacketId].timeout){
            delete brokenRequest[wPacketId];
            responseFalse(packet.action,wPacketId);
            Logger.log("Responded False cause timeout "+brokenRequest[wPacketId].timeout +"passes","BROKEN_PACKET");
          }else{
            	  var scount =0;
            for(i=0;i < tempPacketArray.length;i++){
                Logger.log("Starting Sub Packet "+tempPacketArray[i],"BROKEN_PACKET");
                if(scount>10){
                   //setTimeout(processBrokenRequest,500);
                   Logger.log("SCOUNT UP LIMIT : " +scount,"BROKEN_PACKET");
                    break;
                 }
                packet = brokenData[tempPacketArray[i]];
                if(!packet){
                  tempPacketArray.splice(i,1);
                  Logger.log("continue cause of packet not found: ",packet,"BROKEN_PACKET");
                  continue;
                }
                // if(packet.ack){
                //   delete brokenData[tempPacketArray[i]];
                //   tempPacketArray.splice(i,1);
                //   brokenRequest[wPacketId].totalAck++;
                //   continue;
                // }
                if(packet.scount > 9){
                  //reponse false break;
                Logger.log("packet tried Timeout response false",packet,"BROKEN_PACKET");
                  for(i=0;i < tempPacketArray.length;i++){
                    delete brokenRequest[tempPacketArray[i]];
                  }
                  delete brokenRequest[wPacketId];
                  responseFalse(packet.action,wPacketId);
                  break;
                }
                if(currentTime - packet.lrt < 1000){
                Logger.log("continue cause last sent less then 1 sec ago : "+ tempPacketArray[i],"BROKEN_PACKET");
                   continue;
                }
                packet.scount++;
                packet.lrt = currentTime;
				Logger.log("sending : "+tempPacketArray[i]+" for "+packet.scount +" time : "+currentTime+" scount : "+scount,"BROKEN_PACKET");
                if(packet.scount === 1){
                  packet.frt = currentTime;
                }  
                connection.send(packet.data);
                scount++;
            }
          }
          floodingFlag = true;
      }
   }
   if(floodingFlag){
    brokenRequestInterval = setTimeout(processBrokenRequest,500);
   }else{
    brokenRequestInterval = null;
   }
   

}
