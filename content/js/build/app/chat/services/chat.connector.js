
    var ChatWorker;

    angular.module('ringid.chat')
    .factory('ChatConnector', ChatConnector);

    ChatConnector.$inject = [
        '$rootScope', '$q', 'Auth',
        'ChatUtilsFactory', 'settings'];


    function _updateGobal(key, value){
        CHAT_APP.GLOBALS[key] = value;
    }

    function ChatConnector($rootScope, $q, Auth, ChatUtilsFactory, settings ) {


        var Constants = CHAT_APP.Constants;
        var CHAT_PACKET_INFO = CHAT_APP.PacketFormats.CHAT_PACKET_INFO;
        var WORKER_NOTIFIER_TYPES = Constants.WORKER_NOTIFIER_TYPES;
        var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
        var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES;
		var _callbacks = {};
        var _initialized = false;

        ChatWorker = new Worker(window.location.origin + GENERAL_CONSTANTS.CHAT_WORKER_PATH );

        var _logRequest = function(data, type){
            try{
                var packetName = CHAT_PACKET_INFO[data.packetType]['PACKET_NAME'];
                
            }catch(e){

            }


        };

        var _addCallback = function(packetId, fn, fnContext){

            if(!_callbacks[packetId]){
                _callbacks[packetId] = [];
            }
            fnContext = fnContext || null;
            _callbacks[packetId] = { ctx: fnContext, fn : fn, ct : Date.now() }
        };

        var _init = function(){

            if( _initialized ) return;

            if( !RingMessageChannel.port2 ) {
                setTimeout(_init, 500);
                return;
            }

            var aMessage = {
                command : 'SETTINGS',
                url : settings.socketProtocol + window.location.host +'/ChatSocket/' + window._cti,
                tabId : window._cti,
                salt : Cookies.get('sId'),//auth server sId
                sKey : Cookies.get('sessionID'),//session id webserver
                appVersion : settings.apiVersion,
                CLIENT_DATA_SIZE : 512
            }

            try{

                var currentUserId = Auth.currentUser().getKey();
                if( currentUserId ){
                    aMessage['uId']  = Auth.currentUser().getKey();
                }

                aMessage['oIpPort'] = ChatUtilsFactory.getOfflineIpPort();

            }catch(e){
                
            }

            try{

                ChatWorker.postMessage(aMessage, [RingMessageChannel.port2]);

            }catch(e){
                

            }

            _updateGobal('uId', currentUserId);
            _updateGobal('appVersion', settings.apiVersion);

            _initialized = true;


        };

        var _send = function(data,packId,port){

            if(port && data){
                ChatWorker.postMessage({
                    command : 'SEND',
                    packetId : packId,
                    data : data,
                    port : port,
                    action : data.actn
                });
            }else{
                throw new Error("You must sent data and port");
            }

        };

        ChatWorker.addEventListener('error',function(e){
            
        });

        ChatWorker.addEventListener('message',function(messageEvent){

            switch (messageEvent.data.notifier){

                case WORKER_NOTIFIER_TYPES.DEBUG:

                    try{
                        

                    }catch(e){
                        

                    }
                    break;

                case WORKER_NOTIFIER_TYPES.CHAT_DATA_RECEIVED:

                    if( !!messageEvent.data.object){
                        $rootScope.$broadcast("chatDataReceived",{ 'jsonData' : messageEvent.data.object });

                    }
                    break;

                case WORKER_NOTIFIER_TYPES.AUTH_DATA_RECEIVED:

                    if( !!messageEvent.data.object){
                        $rootScope.$broadcast("authDataReceived",{ 'jsonData' : messageEvent.data.object });

                    }
                    break;

                case WORKER_NOTIFIER_TYPES.CHAT_REQUEST_RESPONSE:

                    var packetId = messageEvent.data.object.packetId;
                    var response = messageEvent.data.object;
                    var callbackObject = _callbacks[packetId];

                    if( !!packetId && !!callbackObject ){
                        if( !!response.notify){
                            callbackObject.fn.notify.call(callbackObject.ctx, response);

                        }else if( response.sucs){
                            callbackObject.fn.resolve.call(callbackObject.ctx, response);

                        }else if ( response.error ){
                            
                            callbackObject.fn.resolve.call(callbackObject.ctx, response);

                        }else if ( !response.sucs ){
                            callbackObject.fn.resolve.call(callbackObject.ctx, response);
                        }
                    }

                    delete _callbacks[packetId]
                    break;

                case WORKER_NOTIFIER_TYPES.AUTH_REQUEST_RESPONSE:
                    break;

                case WORKER_NOTIFIER_TYPES.CHAT_TIMER_UPDATE:
                    var serverTime = messageEvent.data.object.serverTime;
                    CHAT_GLOBAL_VALUES.serverTime = serverTime;
                    break;

               case WORKER_NOTIFIER_TYPES.RE_INIT:
                    _init();
                    break;


                case WORKER_NOTIFIER_TYPES.EXCEPTION:
                    try{
                        

                    }catch(e){
                        

                    }
                    break;

            }

        });

        return {
            initiate: _init,
            sendCommand : function(commandName, params){
                var baseParams = { 'command' : commandName, tabId   : window._cti };
                var message = angular.extend({}, params, baseParams);
                ChatWorker.postMessage(message);

            },
            sendGlobal : function(key, value){
                _updateGobal(key, value);

                var message     = {
                    command : 'UPDATE_GLOBALS',
                    tabId   : window._cti,
                };

                message[key]    = value;
                ChatWorker.postMessage(message);

            },
            rawSend: function ( data ) {

                ChatWorker.postMessage({
                    command : 'RAW_SEND',
                    tabId : window._cti,
                    object : data
                });

            },
            send: function ( data, retryCount ) {
                //todo below line should be deleted in prod
                _logRequest(data, 'send');

                ChatWorker.postMessage({
                    command : 'SEND',
                    tabId : window._cti,
                    object : data,
                    retryCount : retryCount
                });

            },
            request: function ( data, retryCount ) {
                //todo below line should be deleted in prod
                _logRequest(data, 'request');

                var defer = $q.defer();

                if( !data.packetId ){
                    data.packetId = ChatUtilsFactory.getUUIDPacketId()
                }

                _addCallback(data.packetId, defer, this);

                ChatWorker.postMessage({
                    command : 'REQUEST',
                    tabId : window._cti,
                    object : data,
                    retryCount : retryCount

                });

                return defer.promise;

            }
        }
    }

