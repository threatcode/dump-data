(function(window) {// placing dataview and String globals to locals for better performance
    'use strict';

         window.$$connector = function (){
                var ObjectToBeReturn,
                    $q = Q,
                    sessionID = StorageFactory.getCookie('sessionID'),
                    CurrentuId = StorageFactory.getCookie('uId'),
                    socket,
                    keepAliveSender,
                    deferToBeResolved={},
                    resolvedPacket={},
                    stopSending=!1,
                    sendQueue = [],
                    lastSendingTime = Date.now(),
                    timeoutSetted = false,
                    keepAlive = false,
                    subscribers=$$stackedMap(),
                    floodingData = {},
                    floodingDataInterval,
                    reconnectCountError = 0,
                    UnresolvedData = [],
                    intervalFunctions = $$stackedMap();

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
                                 RingLogger.print("No Filter Found",currentCallBackObject,RingLogger.tags.CONNECTION);
                            }

                        });
                      if(!foundSubscriber){
                         RingLogger.print("Not Found Subscriber For" , message,RingLogger.tags.CONNECTION);
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

                    if(!MadeRquest){
                       resolved = broadcastUpdates(json);
                       if(!resolved){
                          UnresolvedData.push(json);
                       }
                    }
                }

             function init(){
                // console.log("socket Init Called");
                 window.onbeforeunload = function(){
                     RingLogger.print("On before unload connection closed",RingLogger.tags.CONNECTION);
                   }
                return;
              }
                  

                function sendData(data,request_type,defer,flooding){
                    var message,packetId;
                    packetId = data.pckId || angular.getUniqueID();
                    //message = buildPacketToSend(packetId,data,request_type);
                    data.pckId = packetId;

                    if(!!defer) {
                        deferToBeResolved[packetId] = defer;//keeping defer to resolve while data catched with this packet Id
                    }
                    if(data){
                        return RingWorker.send(data,packetId,request_type,flooding);
                        //return send(message,request_type === OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION);
                    }
                    // sending through socket or ajax
                }

                function initDeferRequest(data,request_type,flooding){
                    var defer = $q.defer(),res;
                    res = sendData(data,request_type,defer,flooding);
                    return defer.promise;
                 }

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

                    ///
                    send : function(data,request_type, flooding){ // do not return any promise
                        sendData(data,request_type, flooding);
                    },
                    request : function(data, request_type, flooding){//returns a $q promise
                        //if(!flooding){
                            return initDeferRequest(data, request_type,flooding);
                         //}else{
                            //return initFloddingRequest(data,request_type);
                        // }

                    },

                    subscribe : function(callback,options){
                      var i,should_call_with,backUp = [];

                        options = options || {};
                        options.key = options.key || angular.getUniqueID();
                        options.scope = options.scope;
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
                        var key = angular.getUniqueID();
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
                            aSkey : StorageFactory.getCookie('sId'),
                            uKey : StorageFactory.getCookie('uId')
                        });
                    },
                    notifyRouteChange : function(){
                      RingWorker.pushMessage({
                            command : 'ROUTE_CHANGE'
                        });
                    }
                };


             RingWorker.addCallback('received',function(message){
                  processOnMessageListners(message.data);
              });

             RingWorker.addCallback('event',function(message){
        
              });

                return ObjectToBeReturn;
            }();
})(window);



