;(function(global){

    var CHAT_APP                         = global.CHAT_APP;
    var Constants                        = CHAT_APP.Constants;
    var GENERAL_CONSTANTS                = Constants.GENERAL_CONSTANTS;
    var CHAT_SESSION                     = CHAT_APP.CHAT_SESSION;
    var ChatPacketSender                 = CHAT_APP.ChatPacketSender;
    var TEMPORARY_MESSAGES_CACHE         = CHAT_APP.TEMPORARY_MESSAGES_CACHE;
    var CHAT_STATE_INFO                  = Constants.CHAT_STATE_INFO;

    var CHAT_STATES                      = Constants.CHAT_STATES;

    var ChatWorkerCommands               = CHAT_APP.ChatWorkerCommands;

    var ChatOfflinePacketSender          = CHAT_APP.ChatOfflinePacketSender;

    var AuthRequests                     = CHAT_APP.AuthRequests;

    var FRIEND_CHAT_PACKET_TYPE          = Constants.FRIEND_CHAT_PACKET_TYPE;
    var TAG_CHAT_PACKET_TYPE             = Constants.TAG_CHAT_PACKET_TYPE;

    var TAGS                             = CHAT_APP.TAGS;

    var AUTH_REQUEST_TYPE                = Constants.AUTH_REQUEST_TYPE;

    var CHAT_PACKET_INFO                 = CHAT_APP.PacketFormats.CHAT_PACKET_INFO;

    var ResponseHelpers                  = CHAT_APP.ResponseHelpers;
    var sendChatRequestResponseToMainApp = ResponseHelpers.sendChatRequestResponseToMainApp;

    function _doPacketHasConfirmation(packetType){
        try{
            return CHAT_PACKET_INFO[packetType]['CONFIRMATION'];    
        }catch(e){
            Logger.debug('alert', 'Invalid Packet Type in _doPacketHasConfirmation check', 'CHAT');
            return false;
        }    
    }

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
            Logger.debug('debug', currentStateName, JSON.stringify(object) , 'CHAT');

        }else{
            var prevStateName = _getChatStateName( previousState );
            Logger.debug('debug',  prevStateName, ' -> ' ,  currentStateName ,JSON.stringify(object) , 'CHAT');
        }
    };



    function _getSession(requestObject){
        var boxId = Helper.getBoxId( requestObject );
        var sessionInfo = CHAT_SESSION.get( boxId );
        return sessionInfo;
    }

    function _isRegisterPacket( requestObject ){
        if( requestObject.packetType == FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_REGISTER
            || requestObject.packetType == TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_REGISTER ){
            return true;
        }
        return false;
    }

    function injectSessionInRequestObject(requestObject, sessionInfo){
        requestObject.ip = sessionInfo.ip;
        requestObject.port = sessionInfo.bindingPort;

        return requestObject;
    }

    function injectSessionRegisterIpPortInRequestObject(requestObject, sessionInfo){
        requestObject.ip = sessionInfo.ip;
        requestObject.port = sessionInfo.registerPort;   
    
        return requestObject;
    }

    function _refreshSession(boxId, isTagChat, forceRefresh){
        if( isTagChat ){
            var aTag = TAGS.get(boxId);
            if( aTag ){
                var uIds = aTag.memeberUIds;
                Helpers.startChatSession(boxId, GENERAL_CONSTANTS.SESSION_TYPES.TAG, uIds, forceRefresh);    
            }else{
                Logger.debug('information', 'W: No Tag Info found. Requesting for Tag Info', 'CHAT');
                var requestObject = ChatRequests.getOfflineGetTagInformationWithMembersObject(boxId);
                ChatConnector.request(requestObject).then(function(response){
                    if( response.sucs ){
                        setTimeout(function(){
                            if( TAGS.get(boxId) ){
                                _refreshSession( boxId, isTagChat, forceRefresh );    
                            }                        
                        });                        
                    }
                })

            }
            
        }else{
            Helpers.startChatSession(boxId, GENERAL_CONSTANTS.SESSION_TYPES.FRIEND, forceRefresh);                
        }                            
    }

    function _saveTemporaryMessage(boxId, meessageObject, requestResolver){
        var tempMessages = TEMPORARY_MESSAGES_CACHE.get(boxId);
        if( !tempMessages ){
            tempMessages = [];
        }

        meessageObject.resolver = requestResolver;
        
        tempMessages.push(meessageObject);
        TEMPORARY_MESSAGES_CACHE.set(boxId, tempMessages);
        REQUEST_CACHE.deleteChatCache(meessageObject.packetId, meessageObject);
    }

    function _rawSend(requestObject, boxId ){

        if( !!CHAT_SESSION.valid( boxId ) ){
            var sessionInfo = CHAT_SESSION.get( boxId );
            requestObject = injectSessionInRequestObject(requestObject, sessionInfo);
            
            // if( requestObject.packetType == 4){
            //     Logger.debug('information', 'IDLE PACKET SENDING', requestObject, 'CHAT');    
            // }
            
            ChatPacketSender.rawSend( requestObject );
        }
    }


    function _doOfflineIpPortRefreshAndSendAgain( requestObject, retryCount, requestResolver){

        var requestObject = AuthRequests.getOfflineIpPort();
        AuthConnector.request(requestObject).then(function(){

            requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.SECOND_OFFLINE;                                
            ChatOfflinePacketSender.request(requestObject, retryCount).then(function(response){
                requestResolver(response);
            });

        }, function(){

            requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_FAILED;

            requestObject['sucs'] = false;                            
            requestObject['msg'] = "OFFLINE IP PORT UPDATE FAILED.";                            
            sendChatRequestResponseToMainApp(requestObject);

            if( requestResolver ){
                requestResolver({sucs: false, packetId : requestObject.packetId, sendState : requestObject.sendState });    
            }
            

        });
    }

    function _doOnlineIpPortRefreshAndSendAgain( requestObject, boxId, isTagChat, requestResolver ){

        _saveTemporaryMessage(boxId, requestObject, requestResolver);
        _refreshSession( boxId, isTagChat );         

    }

    function _doPresenceRefreshAndSendAgain( requestObject, boxId, isTagChat, requestResolver ){

            
           var presenceRequestObject = AuthRequests.getFriendPresenceObject( requestObject.friendId );
           presenceRequestObject.requestType = AUTH_REQUEST_TYPE.REQUEST;
           AuthConnector.request(presenceRequestObject).then(function(response){

            var previousState = requestObject.sendState;

            if(!!response.sucs && response.psnc == GENERAL_CONSTANTS.USER_PRESENCE.ONLINE){//online

                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.SECOND_ONLINE; 
                _send(requestObject, 'request', 5, true ).then(function(response){
                    requestResolver(response);
                });

            }else{ //sucs false

                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE;
                ChatOfflinePacketSender.request(requestObject).then(function(response){
                    requestResolver(response);
                });

            }

            logSendMessageStateChange(requestObject.sendState, requestObject, previousState);

        }, function(response){

            var previousState = requestObject.sendState;

            requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REFRESH;

            _saveTemporaryMessage(boxId, requestObject, requestResolver);
            _refreshSession( boxId, isTagChat );

            logSendMessageStateChange(requestObject.sendState, requestObject, previousState);

        });
    
    }
    function _sendRegsiterPacket(boxId, requestObject, retryCount, needPromise, resolver){

        var sessionInfo = CHAT_SESSION.get( boxId );
        if( !!sessionInfo ){
            requestObject = injectSessionRegisterIpPortInRequestObject(requestObject, sessionInfo);

            if( needPromise ){
                ChatPacketSender.request( requestObject, retryCount ).then(function(response){ 
                    resolver({sucs: response.sucs, packetId : requestObject.packetId, packetType: requestObject.packetType }); 
                });
            }else{
                ChatPacketSender.send( requestObject, retryCount );
            }
        }
    }

    function _send(requestObject, type, retryCount, needPromise ){

        var returnPromise = new Promise(function(resolve, reject){
                
            var boxId = Helpers.getBoxId(requestObject);
            var isTagChat = isTagChatPacket( requestObject );
            var isRegisterPacket = _isRegisterPacket( requestObject );
            
            if( isRegisterPacket ) {

              _sendRegsiterPacket(boxId, requestObject, retryCount, needPromise, resolve); 
            
            }else{

                 if( !CHAT_SESSION.valid( boxId ) ){
                
                    if( !_doPacketHasConfirmation(requestObject.packetType) ){
                        requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE;

                        ChatOfflinePacketSender.request(requestObject, retryCount).then(function(response){
                            resolve && resolve(response);                    
                            
                            if( response.sucs){
                                logSendMessageStateChange(CHAT_STATES.MESSAGE_SENDING.OFFLINE_SUCCESS, requestObject, requestObject.sendState);    
                            }else{
                                logSendMessageStateChange(CHAT_STATES.MESSAGE_SENDING.FAILED, requestObject, requestObject.sendState);    
                            }
                            
                        });
                    
                    }else{
                                            
                        requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REQUEST;
                        //Session don't exists
                        _saveTemporaryMessage(boxId, requestObject, resolve);
                        _refreshSession( boxId, isTagChat );                                
                    }

                }else{
                    
                    //Session exists 
                    var sessionInfo = CHAT_SESSION.get( boxId );

                    requestObject = injectSessionInRequestObject(requestObject, sessionInfo);
                
                    if( !requestObject.sendState ){
                        requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_ONLINE;    
                    }                

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

                            if( needPromise ){
                                resolve({sucs: true, update: false, packetId : requestObject.packetId, sendState : requestObject.sendState });
                            }

                            logSendMessageStateChange(requestObject.sendState, requestObject, previousState);
                        }

                    }).catch(function(response){

                        var previousState = requestObject.sendState;

                        switch ( requestObject.sendState ){

                            case CHAT_STATES.MESSAGE_SENDING.FIRST_ONLINE:

                                if( isTagChat ){
                                    requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REFRESH;
                                    _doOnlineIpPortRefreshAndSendAgain( requestObject, boxId, isTagChat, resolve );

                                }else{
                                    requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.PRESENCE_REFRESH;
                                    _doPresenceRefreshAndSendAgain( requestObject, boxId, isTagChat, resolve );
                                }

                                break;

                            case CHAT_STATES.MESSAGE_SENDING.SECOND_ONLINE:

                                if( isTagChat ) {
                                    requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_FAILED;

                                    requestObject['sucs'] = false;                            
                                    sendChatRequestResponseToMainApp(requestObject);

                                }else{
                                    requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REFRESH;

                                    _saveTemporaryMessage(boxId, requestObject, resolve);
                                    _refreshSession( boxId, isTagChat , true);
                                    
                                }
                                break;

                            case CHAT_STATES.MESSAGE_SENDING.THIRD_ONLINE:

                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE;                            
                                ChatOfflinePacketSender.request(requestObject, retryCount).then(function(response){
                                    needPromise && resolve(response)
                                });                            

                                break;

                            case CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE:

                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_IP_PORT_REFRESH;                            
                                _doOfflineIpPortRefreshAndSendAgain( requestObject, retryCount, resolve );

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
            }


            
        });

        if( needPromise){            
            return returnPromise;
        }

    }

    _request = function(requestObject, type, retryCount ){
        
        return _send(requestObject, type, retryCount, true);
    }


    

    global.CHAT_APP['ChatOnlinePacketSender'] = {   
        rawSend               : _rawSend,              
        send                  : _send,
        request               : _request,

        isTagChatPacket           : isTagChatPacket,
        logSendMessageStateChange : logSendMessageStateChange
    }


})(self);
