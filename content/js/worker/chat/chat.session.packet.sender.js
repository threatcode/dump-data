;(function(global){

    var CHAT_APP                 = global.CHAT_APP;
    var Constants                = CHAT_APP.Constants;
    var GENERAL_CONSTANTS        = Constants.GENERAL_CONSTANTS;
    var CHAT_SESSION             = CHAT_APP.CHAT_SESSION;
    var ChatPacketSender         = CHAT_APP.ChatPacketSender;
    var TEMPORARY_MESSAGES_CACHE = CHAT_APP.TEMPORARY_MESSAGES_CACHE;
    var CHAT_STATE_INFO          = Constants.CHAT_STATE_INFO;

    var CHAT_STATES              = Constants.CHAT_STATES;

    var ChatWorkerCommands       = CHAT_APP.ChatWorkerCommands;

    var RequestHelpers           = CHAT_APP.RequestHelpers;

    var _getChatStateName = function( stateNo ){
        try{
            return CHAT_STATE_INFO[stateNo]['NAME'];    
        }catch(e){
            return '';
        }
        
    }

    var isTagChatPacket = function( requestObject ){
        return !!requestObject.tagId;
    }

    var logSendMessageStateChange = function(currentState, object, previousState){
        if( currentState == previousState){ return; }
            
        var currentStateName = _getChatStateName( currentState );
        if( !previousState){            
            Logger.debug('debug', currentStateName, object , 'CHAT');

        }else{
            var prevStateName = _getChatStateName( previousState );
            Logger.debug('debug',  prevStateName, ' -> ' ,  currentStateName , object , 'CHAT');
        }
    };



    function _getSession(requestObject){
        var boxId = requestObject.friendId || requestObject.tagId;
        var sessionInfo = CHAT_SESSION.get( boxId );
        return sessionInfo;
    }

    function injectSessionInRequestObject(requestObject, sessionInfo){
        requestObject.ip = sessionInfo.ip;
        requestObject.port = sessionInfo.registerPort;
        requestObject.chatBindingPort = sessionInfo.bindingPort;

        return requestObject;
    }

    function _refreshSession(boxId, isTagChat){
        if( isTagChat ){
            Helpers.startChatSession(boxId, GENERAL_CONSTANTS.SESSION_TYPES.TAG);    
        }else{
            Helpers.startChatSession(boxId, GENERAL_CONSTANTS.SESSION_TYPES.FRIEND);                
        }                            
    }

    function _saveTemporaryMessage(boxId, meessageObject){
        var tempMessages = TEMPORARY_MESSAGES_CACHE.get(boxId);
        if( !tempMessages ){
            tempMessages = [];
        }

        tempMessages.push(meessageObject);
        TEMPORARY_MESSAGES_CACHE.set(boxId, tempMessages);
    }

    function _rawSend(requestObject, type, retryCount){

        if( !CHAT_SESSION.valid( boxId ) ){
            var sessionInfo = CHAT_SESSION.get( boxId );
            requestObject = injectSessionInRequestObject(requestObject, sessionInfo);
            ChatPacketSender.rawSend( requestObject );
        }
    }

    function _send(requestObject, type, retryCount, needPromise ){

        var returnPromise = new Promise(function(resolve, reject){
                
            var boxId = requestObject.friendId || requestObject.tagId;
            var isTagChat = isTagChatPacket( requestObject );

            if( !CHAT_SESSION.valid( boxId ) ){
                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REQUEST;
                //Session don't exists
                _saveTemporaryMessage(boxId, requestObject);
                _refreshSession( boxId, isTagChat );            

            }else{
                //Session exists 
                var sessionInfo = CHAT_SESSION.get( boxId );

                requestObject = injectSessionInRequestObject(requestObject, sessionInfo);

                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_ONLINE;

                logSendMessageStateChange(requestObject.sendState, requestObject);

                ChatPacketSender.request( requestObject, retryCount ).then(function(response){
                    
                    if( response.sucs){

                        var previousState = requestObject.sendState;

                        switch ( requestObject.sendState ){

                            case CHAT_STATES.MESSAGE_SENDING.FIRST_ONLINE:
                            case CHAT_STATES.MESSAGE_SENDING.SECOND_ONLINE:
                            case CHAT_STATES.MESSAGE_SENDING.THIRD_ONLINE:

                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_SUCCESS;
                                break;

                            case CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE:
                            case CHAT_STATES.MESSAGE_SENDING.SECOND_OFFLINE:
                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_SUCCESS;
                                break;
                        }


                        resolve.call(null, {sucs: true, update: false, packetId : requestObject.packetId, sendState : requestObject.sendState });

                        logSendMessageStateChange(requestObject.sendState, requestObject, previousState);
                    }

                }, function(response){

                    var previousState = requestObject.sendState;

                    switch ( requestObject.sendState ){

                        case CHAT_STATES.MESSAGE_SENDING.FIRST_ONLINE:

                            if( isTagChat ){
                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REFRESH;

                            }else{
                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.PRESENCE_REFRESH;
                            }

                            afterFailureCallback.call(this, box, msgObj, messageData);

                            break;

                        case CHAT_STATES.MESSAGE_SENDING.SECOND_ONLINE:

                            if( isTagChatPacket(requestObject) ) {
                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_FAILED;

                                requestObject['sucs'] = false;                            
                                sendChatRequestResponseToMainApp(requestObject);

                            }else{
                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REFRESH;

                                _saveTemporaryMessage(boxId, requestObject);
                                _refreshSession( boxId, isTagChat );
                                
                            }
                            break;

                        case CHAT_STATES.MESSAGE_SENDING.THIRD_ONLINE:

                            requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE;
                            _send(requestObject, type, retryCount);

                            break;

                        case CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE:

                            requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_IP_PORT_REFRESH;

                            var requestObject = AuthRequets.getOfflineIpPort();
                            AuthConnector.request(requestObject).then(function(){

                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.SECOND_OFFLINE;
                                _send(requestObject, type, retryCount);

                            }, function(){

                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_FAILED;

                                requestObject['sucs'] = false;                            
                                requestObject['msg'] = "OFFLINE IP PORT UPDATE FAILED.";                            
                                sendChatRequestResponseToMainApp(requestObject);

                                resolve({sucs: false, packetId : requestObject.packetId, sendState : requestObject.sendState });


                            });

                            break;

                        case CHAT_STATES.MESSAGE_SENDING.SECOND_OFFLINE:

                            requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_FAILED;

                            requestObject['sucs'] = false;                            
                            sendChatRequestResponseToMainApp(requestObject);

                            resolve({sucs: false, packetId : requestObject.packetId, sendState : requestObject.sendState });
                            break;

                    }


                    logSendMessageStateChange(requestObject.sendState, requestObject, previousState);

                });                       
                        
            }
        });

        return needPromise && returnPromise;

    }

    _request = function(requestObject, type, retryCount ){
        return _send(requestObject, type, retryCount, true);
    }


    

    global.CHAT_APP['ChatSessionPacketSender'] = {   
        rawSend               : _rawSend,              
        send                  : _send,
        request               : _request,

        isTagChatPacket           : isTagChatPacket,
        logSendMessageStateChange : logSendMessageStateChange
    }


})(self);