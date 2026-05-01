    angular
        .module('ringid.connector')
        .factory('$$connector',$$connector);

           $$connector.$inject =
                ['settings','Storage', '$rootScope','$websocket','$$stackedMap','ATTRIBUTE_CODES',
                    'Utils','$$q','OPERATION_TYPES','CLIENT_DATA_SIZE','mergerService'];
         function $$connector(settings,Storage, $rootScope,$websocket,$$stackedMap,ATTRIBUTE_CODES, //jshint ignore:line
                     Utils,$q,OPERATION_TYPES,CLIENT_DATA_SIZE,mergerService){
                var ObjectToBeReturn,
                    sessionID = Storage.getCookie('sessionID'),
                    CurrentuId = Storage.getCookie('uId'),
                    socket,
                    keepAliveSender,
                    deferToBeResolved={},
                    resolvedPacket={},
                    stopSending=!1,
                    sendQueue = [],
                    lastSendingTime = Date.now(),
                    timeoutSetted = false,
                    keepAlive = false,
                    subscribers=$$stackedMap.createNew(),
                    floodingData = {},
                    floodingDataInterval,
                    reconnectCountError = 0,
                    UnresolvedData = [],
                    intervalFunctions = $$stackedMap.createNew();

                function getMessageFilterByActionNumber(action_number){

                    return function(message){// websocket message event
                        if (!message || !message.actn){ return false; }
                        if(angular.isArray(action_number)){
                            for(var i=0;i<action_number.length;i++){
                                if(message.actn === action_number[i]){
                                    return true;
                                }
                            }
                        }else{
                            return message.actn === action_number;
                        }
                        return false;

                    };
                }
               function parseMessageData(DataViewObject){
                    if(!DataViewObject) { return {}; }
                     return RingParser.parse(DataViewObject);
                    //if(angular.isString(message.data)){
                    //    return angular.fromJson(message.data);
                    //}else if(angular.isObject(message.data)){
                    //    return message.data;
                    //}else{
                    //    return message;
                    //}
               }
               function resolvePendingRequest(message){
                    if(deferToBeResolved[message.pckId] === true){
                        return true;
                    }
                    if(!!deferToBeResolved[message.pckId]){
                        var a = deferToBeResolved[message.pckId].resolve.call(deferToBeResolved[message.pckId],message);

                        if(!a){
                            deferToBeResolved[message.pckId] = !!a;
                            setTimeout(function(){
                                delete deferToBeResolved[message.pckId];
                            },3000);
                        }
                        //deleting after processing
                        return true;
                    }else{
                        return false;
                    }
               }

               function broadcastUpdates(message){
                    var foundSubscriber = false;
                   if(subscribers.length() > 0){
                        subscribers.doForAll(function(currentCallBackObject){
                           var should_call_with,pattern = currentCallBackObject.filter;
                            if (pattern) {
                                if(angular.isFunction(pattern)){
                                    should_call_with = pattern.call(null,message);
                                    if(!!should_call_with){
                                        foundSubscriber = true;
                                        currentCallBackObject.fn.call(currentCallBackObject,message);
                                    }
                                }
                            }else{
                                currentCallBackObject.fn.call(null, message);
                            }
                            // if (currentCallBackObject.autoApply && !currentCallBackObject.scope.$$phase) {
                            //     currentCallBackObject.scope.$digest(); // safe digest
                            // }
                        });
                      if(!foundSubscriber){
                      }
                   }
                   return foundSubscriber;

               }

                function processOnMessageListners(json){
                    if(!json){ return; }

                    var MadeRquest,resolved;
                    if(json.actn === OPERATION_TYPES.SYSTEM.AUTH.TYPE_INVALID_LOGIN_SESSION){
                        broadcastUpdates(json);return;
                    }
                    if(json.hasOwnProperty('pckId')){ // its a response of a request so process resolve the defer of this packet id
                        MadeRquest = resolvePendingRequest(json);
                    }
                    //if(json.hasOwnProperty('pckFs')){ // packet id From Server so its update need to process subscriber
                        //var pack = json.pckFs;
                        //if(!resolvedPacket[pack]){
                        //    broadcastUpdates(json);
                           // resolvedPacket[pack] = true;
                        //}
                    //}
                    if(!MadeRquest){
                       resolved = broadcastUpdates(json);
                       if(!resolved){
                          UnresolvedData.push(json);
                       }
                    }
                }

                function MainOnMessageHandler(message){ // if message has pckId then its a request response, if message has pckFs its a subscriber
                    //if(!message.received)return;
                    var DataViewObject;
                    try{
                        //if(window.Blob && ((message.data ||message) instanceof Blob)){
                        //
                        //}
                        DataViewObject = new DataView(message.data || message);
                        if(!DataViewObject.byteLength){
                            throw new Error("Byte Length of Zero");
                        }
                    }catch(e){ // buffer is not a arrayBuffer so throws exception
                        // console.dir(e);
                        return;
                    }
                   // DataViewObject.print_r(); //ajax is banned
                   // if(!socket.socket ){ //data coming via ajax so coming as 2-byte integer padded
                   //     for(var i=0;i<DataViewObject.byteLength;){
                   //          length = DataViewObject.getUint16(i,!0); // length as 2-byte integer
                   //           i+=2;
                   //         if(length > 0){
                   //             try{
                   //                 tempDataView = DataViewObject.copy(i,length);
                   //                 message = parseMessageData(tempDataView);
                   //                // tempDataView.print_r();
                   //                 processOnMessageListners(message);
                   //             }catch(e){
                   //                 console.warn("Invalid Array Buffer to Parse : "+ e.message);
                   //             }finally{
                   //                 i+=length;
                   //             }
                   //         }
                   //     }
                   // }else{ // data coming via socket .. so no need to parse as byte array
                        message = parseMessageData(DataViewObject);
                        processOnMessageListners(message);
                  //  }

                    // for broken packets and falsy data
                }

            // function getKeepAlivePacket(){

            //     var sess = Storage.getCookie('sId') || '',index=2;
            //     if (!sess.length){ return false; }
            //     var dataTosend = new ArrayBuffer(sess.length +2),
            //         dataview  = new DataView(dataTosend);

            //      dataview.setUint8(0,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.KEEP_ALIVE);
            //      dataview.setUint8(1,0);//complete packet
            //         angular.forEach(sess.toCharCodeArray(),function(val){
            //             dataview.setUint8(index++,val);
            //         });
            //     return dataview;
            //  }

             function init(){
                // console.log("socket Init Called");
                             window.onbeforeunload = function(){
                                 RingLogger.print("On before unload connection closed",RingLogger.tags.CONNECTION);

                                 if($rootScope.unloadWarn) {
                                   return "You have unsaved changes.  Do you want to leave this page and lose your changes?";
                                 }
                               }
                return;
              }
                   //  if(angular.isObject(socket)){
                   //      if(!socket.isOpen() && socket.readyState !== 0){
                   //          socket.reconnect();
                   //      }
                   //      return; // if socket is already initiated then return
                   //  }
                   // if(Utils.hasSocket()){
                   //     try{
                   //         socket = $websocket( settings.socketProtocol + settings.siteUrl +'/DataSocket/' + Utils.tabId);
                   //         if(false === socket){
                   //              return;
                   //         }
                   //         socket.onError(function(e){
                   //            if(reconnectCountError > 2){
                   //              $rootScope.$broadcast('CONNECTION_ERROR');
                   //            }else{
                   //              reconnectCountError++;
                   //            }

                   //         });
                   //         socket.onOpen(function(){
                   //             Storage.removeCookie('reloaded');
                   //             if(sendQueue.length){
                   //               send();
                   //             }
                   //            //  var t0 = window.performance().now();
                   //            //  RingLogger.print("socket opened",'CONNECTIONTEST');
                   //            // setInterval(function(){
                   //            //   var t1 = window.performance().now();
                   //            //      RingLogger.print("socket status : "+socket.socket.readyState + "time from start"+(t1-t0),'CONNECTIONTEST');
                   //            // },200);
                   //         });
                   //         socket.onClose(function(e){
                   //               RingLogger.print("SOCKET CLOSED : ",e,RingLogger.tags.CONNECTION);
                   //         });
                   //         window.onbeforeunload = function(){
                   //               RingLogger.print("On before unload connection closed",RingLogger.tags.CONNECTION);

                   //               if($rootScope.unloadWarn) {
                   //                 return "You have unsaved changes.  Do you want to leave this page and lose your changes?";
                   //               }

                   //               closeConnection();

                   //               //return "are You Sure";
                   //         };

                   //     }catch(e){
                   //          //$rootScope.$broadcast('CONNECTION_ERROR');
                   //         RingLogger.alert("CONNECTION_ERROR"+e.message,RingLogger.tags.CONNECTION);
                   //     }
                   //     socket.onMessage(MainOnMessageHandler,{});
                   // }else{
                   //      //$rootScope.$broadcast('CONNECTION_ERROR');
                   //     alert("Your browser seem back dated. To use RingId with greater user experience we advice you to use modern browser. ");
                   //     return; //ajax is removed
                   // }

              // }
             // function initInterval(){
             //    var kpPacket = getKeepAlivePacket();
             //        if (!kpPacket){ return; }
             //        kpPacket.keepalive = true;//for log purpose
             //     keepAliveSender = window.setInterval(function(kpPacket){
             //         processIntervals();
             //         if(!kpPacket){
             //             stopInterVal();return;//sessionId not found so stopping the interval
             //         }
             //         //if(!socket.socket){ // ajax stop working
             //           //  socket.fetch(getKeepAlivePacket());
             //        // }else{ // else socket
             //           //  RingWorker.send(kpPacket,'keepalive');
             //        // }
             //     }.bind(null,kpPacket),5000);
             // }
             // function connectionReset(){
             //    // throw new Error("Socket Reset");
             //    // socket.socket.binaryType = 'arraybuffer';
             //     stopInterVal();
             //     socket.close();
             //     socket = null;
             //     stopSending = true;
             //     init();
             //     stopSending = false;
             //     //socket.socket.binaryType = 'arraybuffer';
             //     //if(!socket.socket){
             //     //  socket.init(getKeepAlivePacket());
             //     //}
             //     if (keepAlive){ initInterval(); }
             // }
             // function closeConnection(){
             //    // throw new Error("Socket Closed");
             //     if(keepAliveSender){
             //         //$interval.cancel(keepAliveSender);
             //         window.clearInterval(keepAliveSender);
             //     }

             //     if(socket.isOpen()){
             //         socket.close();
             //     }else{
             //        if (socket.socket.readyState === 0){
             //            socket.onOpen(function(){
             //            socket.close();
             //         });
             //        }

             //     }

             // }

             // function stopInterVal(){
             //   //  $interval.cancel(keepAliveSender);
             //   window.clearInterval(keepAliveSender);
             // }
             // function sendBrokenPacket(request_type,messageViewArray,data,packetId){ //message expected as string
             //     var packets = [],hi, i,headerLength=129,full_packet,packet_start=0,packet_end,// with full packet there are two bytes of request type and packet type sp excluding it
             //         len = messageViewArray.byteLength,header,headbuf,last_sent = Date.now(),now;

             //     var totalPacket = Math.ceil(len/CLIENT_DATA_SIZE),
             //         uniqueKey =  (CurrentuId || "")  + Utils.tabId + Utils.getUniqueID().toString(),
             //         glu = totalPacket < 128 ? 1:2;//one byte or two byte
             //     for(i=0;i<totalPacket;i++){
             //         packet_end = (CLIENT_DATA_SIZE*(i+1))-1;
             //         if(packet_end > len){
             //             packet_end = len-1;//if its over the data
             //         }
             //         headbuf = new ArrayBuffer(headerLength+(packet_end-packet_start+1));
             //         header = new DataView(headbuf);
             //         header.setUint8(0,request_type);//setting request type on first byte
             //         header.setUint8(1,1);//setting packet type on second byte
             //         hi = 2;
             //         if(data.actn){
             //             hi = header.addAttributeInt(hi,ATTRIBUTE_CODES.ACTION,2,data.actn);
             //         }
             //         if(!!packetId){
             //             packetId = packetId.toString();
             //             hi = header.addAttributeString(hi,ATTRIBUTE_CODES.CLIENT_PACKET_ID,packetId);
             //         }
             //         hi = header.addAttributeInt(hi,ATTRIBUTE_CODES.TOTAL_PACKET,glu,totalPacket);
             //         hi = header.addAttributeInt(hi,ATTRIBUTE_CODES.PACKET_NUMBER,glu,i);//current packet number
             //         hi = header.addAttributeString(hi,ATTRIBUTE_CODES.UNIQUE_KEY,uniqueKey);
             //         hi = header.addAttributeData(hi,ATTRIBUTE_CODES.DATA,messageViewArray,packet_start,(packet_end-packet_start+1));
             //         packet_start = packet_end+1;
             //         //full_packet = header.merge(0,hi,messageViewArray,packet_start,packet_end);
             //         //data_packet = messageViewArray.copy(packet_start,packet_end+1);
             //         //console.info("packet Number" + i);
             //         full_packet = header.copy(0,hi);
             //          // if(!socket.socket){
             //              // packets.push(header.copy(0,hi));
             //          // }else{
             //         packets.push(full_packet);
             //          // }
             //       }
             //    // console.log()
             //        var sendPacket = function sendPackInner(){
             //            while(packets.length){
             //                var pack;
             //                now = Date.now();
             //                if(now - last_sent >=180){
             //                    pack = packets.shift();
             //                    send(pack);
             //                    last_sent = now;
             //                }else{
             //                    setTimeout(sendPackInner,180);
             //                    return;
             //                }
             //            }
             //        };
             //        sendPacket();
             //     return false;
             // }

             // function changeMessageToByte(message,packetType,request_type){ // message as string/object
             //     if (!angular.isString(message)) {
             //        message = angular.toJson(message);
             //     }

             //     var buffer,messageViewArray,index= 0,len = packetType ? message.length : message.length + 2;
             //     buffer = new ArrayBuffer(len);
             //     messageViewArray = new DataView(buffer);
             //     if(!packetType){ // for broken packet 1, else 0 so we have to add two byte if its complete packet
             //         messageViewArray.setUint8(index++,request_type);
             //         messageViewArray.setUint8(index++,0);
             //     }
             //     if(message.length){
             //         angular.forEach(message.toCharCodeArray(),function(val){
             //             messageViewArray.setUint8(index++,val);
             //         });
             //     }
             //     return messageViewArray;
             // }
                //init(); //initing the socket
             // function buildPacketToSend(packetId, data,request_type){//append sessionIdBefore Send
             //        var message,messageViewArray,sId = Storage.getCookie('sId');
             //        data = data || {};
             //        data.pckId = packetId;
             //        if (!!sId) {
             //            data.sId = sId;
             //        }
             //        data.tbid = Utils.tabId;
             //        data.dvc = 5;
             //        message = angular.toJson(data);

             //        //if(data.actn === 134) {
             //        //    //return sendBrokenListPacket(request_type,data,packetId);
             //        //}else

             //        if((message.length + 2 > CLIENT_DATA_SIZE)&& data.actn !== 23 && data.actn !== 25 && request_type !== 3){ // including request_type and packet_type
             //            messageViewArray = changeMessageToByte(message,1,request_type);//broken packet type is 1
             //            return sendBrokenPacket(request_type,messageViewArray,data,packetId);
             //        }else{
             //            return changeMessageToByte(message,0,request_type); // complete packet type is 0
             //        }

             // }

                 // var send = function sendD(data,force){
                 //     if(!!data){
                 //         sendQueue.push(data);
                 //     }
                 //     if(stopSending && !force){
                 //         return;
                 //     }
                 //     if(socket.socket.readyState === 0){
                 //        return;
                 //     }
                 //     if(!socket.isOpen() && socket.socket.readyState !== 0){
                 //        socket.reconnect();return;
                 //     }
                 //     // if(socket.readyState === 0){
                 //     //     if(!timeoutSetted){
                 //     //         setTimeout(function(){
                 //     //             timeoutSetted = false;
                 //     //             sendD();
                 //     //         },1000);
                 //     //         timeoutSetted = true;
                 //     //     }
                 //     //     return;
                 //     // }
                 //     while (sendQueue.length) {
                 //         var now = Date.now(),timediff = now - lastSendingTime; // for testing pupose
                 //       //  if(timediff > 200){ // Auth Server Drop Out Packets if previous packet receives in 200ms
                 //             var tempdata = sendQueue.shift();
                 //             RingLogger.information("socket state :" + socket.socket.readyState + " time diff : " + (timediff/1000),RingLogger.tags.CONNECTION);
                 //             RingLogger.infoblack(tempdata.print_r("return"),!!tempdata.keepalive ? RingLogger.tags.KEEPALIVE : RingLogger.tags.SEND);
                 //             socket.send(tempdata);
                 //             lastSendingTime = now;
                 //        // }else{
                 //           // setTimeout(function(){
                 //              //  send();
                 //            //},200-timediff);
                 //       //  }
                 //     }
                 // };

                function sendData(data,request_type,defer,flooding){
                    var message,packetId;
                    packetId = data.pckId || Utils.getUniqueID();
                    //message = buildPacketToSend(packetId,data,request_type);
                    data.pckId = packetId;
                    RingLogger.print(data,"SEND");

                    if(!!defer) {
                        deferToBeResolved[packetId] = defer;//keeping defer to resolve while data catched with this packet Id
                    }
                    if(data){
                        return RingWorker.send(data,packetId,request_type,flooding);
                        //return send(message,request_type === OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION);
                    }
                    // sending through socket or ajax
                }

                function initDeferRequest(data,request_type,mergeData,flooding){
                    var defer = mergeData ? mergerService.defer():$q.defer(),res;
                    res = sendData(data,request_type,defer,flooding);
                    //if(!socket.socket){ // for ajax request
                      //  res.success(function(data,status,headers){
                      //response that coming result on request with ajax for example auth request
                      //      MainOnMessageHandler(data,true);
                      //  });//sending byte view data through socket/ajax
                  //  }else{
                        // note : for websocket it just sent the data and waits for receive
                  //  }
                    //setTimeout(function(){
                    //    defer.notify(CUSTOM_PROMISE.REQUEST_SENT);
                    //},10);
                    return defer.promise;
                 }
                 // function initDeferRequestSafeMode(data,request_type, mergeData){
                 //    var defer = mergeData ? mergerService.defer():$q.defer();
                 //    if(!floodingData[data.actn]){
                 //      floodingData[data.actn] = [];
                 //    }
                 //    floodingData[data.actn].push(sendData.bind(null,data,request_type,defer));
                 //    if(!floodingDataInterval){
                 //      floodingDataInterval = setInterval(processSafeModeSender,300);
                 //    }
                 //    return defer.promise;
                 // }

                 // function processSafeModeSender(){
                 //   // RingLogger.print("inter val called" , floodingData,"SafeModeSender");
                 //    var actn,fn,floodingFlag=false;
                 //    for(actn in floodingData){
                 //   //   RingLogger.print("inside loop flooding data" ,"SafeModeSender");
                 //        if(floodingData.hasOwnProperty(actn) && floodingData[actn].length){
                 //            fn = floodingData[actn].shift();
                 //            fn.call();
                 //            if(!floodingData[actn].length){
                 //                delete floodingData[actn];
                 //            }else{
                 //              floodingFlag = true;
                 //            }
                 //        }
                 //    }
                 //   // RingLogger.print("values in interval ", floodingFlag ,floodingDataInterval,"SafeModeSender");
                 //    if(!floodingFlag && floodingDataInterval){
                 //        //RingLogger.print("clearing interval ", floodingDataInterval,"SafeModeSender");
                 //        clearInterval(floodingDataInterval);
                 //        floodingDataInterval = angular.noop();
                 //      //  RingLogger.print("after clearing interval ", floodingDataInterval,"SafeModeSender");
                 //    }
                 // }

                 function processIntervals(){
                        intervalFunctions.doForAll(function(f){
                            f.call(null);
                        });
                 }


                ObjectToBeReturn = {
                    init : init,
                    close : function(){
                        RingLogger.alert("connection close request please see condition",RingLogger.tags.CONNECTION);
                    },
                    send : function(data,request_type, flooding){ // do not return any promise
                        sendData(data,request_type, false, flooding);
                    },
                    request : function(data, request_type, flooding){//returns a $q promise
                        //if(!flooding){
                            return initDeferRequest(data, request_type,false,flooding);
                         //}else{
                            //return initFloddingRequest(data,request_type);
                        // }

                    },
                    pull : function(data, request_type, flooding){//returns a $q promise
                       // if(!flooding){
                            return initDeferRequest(data, request_type, true,flooding);
                      //}else{
                         //  return initFloddingRequest(data, request_type, true);
                      //  }
                    },
                    subscribe : function(callback,options){
                      var i,should_call_with,backUp = [];

                        options = options || {};
                        options.key = options.key || Utils.getUniqueID();
                        options.scope = options.scope || $rootScope;
                        options.autoApply = false;
                        options.fn = callback || angular.noop;
                        // filter must be a function
                        if(!options.filter && !!options.action){
                            options.filter = getMessageFilterByActionNumber(options.action);
                        }

                        subscribers.add(options.key,options);
                        if(!!options.callWithUnresolved){
                            for(i = 0;i<UnresolvedData.length;i++){
                                   should_call_with = options.filter.call(null,UnresolvedData[i]);
                                    if(!!should_call_with){
                                        options.fn.call(null,UnresolvedData[i]);
                                    }else{
                                      backUp.push(UnresolvedData[i]);
                                    }
                            }
                            UnresolvedData.length = 0;
                            UnresolvedData = backUp;
                        }
                        return options.key;// key returned : useful when need to unsubscribe
                    },
                    unsubscribe : function(key){
                        subscribers.remove(key);
                    },
                    stop :function(){
                        stopSending = true;
                    },
                    resume : function(){
                         stopSending = false;
                        // if(!socket.isOpen() && socket.socket.readyState !== 0){
                        //     socket.reconnect();
                        // }
                        //send();

                    },
                    reset : function(){
                        //connectionReset();
                       // send();
                    },
                    addInterval : function(func){
                        var key = Utils.getUniqueID();
                        intervalFunctions.add(key,func);
                        return key;
                    },
                    removeInterval :function(key){
                        intervalFunctions.remove(key);
                    },
                    keepAlive : function(){
                        keepAlive = true;
                        //initInterval();
                        RingWorker.pushMessage({
                            command : 'KEEPALIVE',
                            aSkey : Storage.getCookie('sId'),
                            uKey : Storage.getCookie('uId')
                        });
                    },
                    notifyRouteChange : function(){
                      RingWorker.pushMessage({
                            command : 'ROUTE_CHANGE'
                        });
                    }
                };

                // var worker = new Worker(settings.baseUrl+'js/worker/worker.js');
                // var feed = {
                //     a : 1,
                //     b : 2
                // };
                // worker.addEventListener('message',function(message){
                //    RingLogger.print("feed",message.data.feed,'WORKER');
                //    RingLogger.print("local feed",feed,'WORKER');
                //    RingLogger.print("feed equal",feed===message.data.feed,'WORKER');

                // });

                // worker.addEventListener('error',function(e){
                //      RingLogger.alert(e,'WORKER');
                // });
                // worker.postMessage({
                //      command : 'connect',
                //      url : 'ws://'+ settings.siteUrl +'/DataSocket/' + Utils.tabId,
                //      feed  : feed,
                // });



             //$cookies.act = Utils.tabId;
             //$cookies.tt = ($cookies.tt && ($cookies.tt+1)) || 1;

             //var actChecker = setInterval(function(){
             //       if($cookies.a)
             //},1000);
             // we will keep a single connection if multiple tab is opened
             // so on $rootScope ringactive we should re connect and in ringInactive we should close connection

             $rootScope.$on('ringInactive',function(event){
                // console.log("soccket stat : " + socket.isOpen() +" currentTabId :" + Utils.tabId );
                // closeConnection();
                 //setTimeout(function(){
                 //   if($cookies.act === Utils.tabId){
                 //       if(!socket.isOpen()){
                 //           connectionReset();
                 //       }
                 //   }
                 //},3000);
                 //$rootScope.$on('$destroy',function(){
                 //       console.log("hello");
                 //});
                 //console.info("Window Is Not Active");
                 //if($cookies.sessionID != sessionID) {
                     //sessionID = $cookies.sessionID;
                     //connectionReset();
                 //}
             });

             $rootScope.$on('$locationChangeStart', function( event ) {
                 //var answer = confirm("Are you sure you want to leave this page?")
                 //if (!answer) {
                 //    event.preventDefault();
                 //}
             });

             RingWorker.addCallback('received',function(message){
                  processOnMessageListners(message.data);
              });

             RingWorker.addCallback('event',function(message){
                if(message.name){
                  $rootScope.$broadcast(message.name);
                }
              });

                return ObjectToBeReturn;
            }
