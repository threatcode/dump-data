;(function(global){

    var CHAT_APP                = global.CHAT_APP;
    var ChatPacketSender        = CHAT_APP.ChatPacketSender;
    var CHAT_SESSION            = CHAT_APP.CHAT_SESSION;
    
    var CHAT_SERVER_TYPES       = CHAT_APP.Constants.CHAT_SERVER_TYPES;

    var ChatPacketSender        = CHAT_APP.ChatPacketSender;
    var ChatOnlinePacketSender  = CHAT_APP.ChatOnlinePacketSender;
    var ChatOfflinePacketSender = CHAT_APP.ChatOfflinePacketSender;

    var Utils                   = CHAT_APP.Utils;

    var _chatConnection,
        _settings = {};


    function _logResponse( responseObject ){
        if(responseObject.packetType){
            
            var packetName = CHAT_APP.ChatPacketParser.getPacketName(responseObject.packetType)    
            Logger.debug('debug', packetName,  responseObject, 'CHAT_RECEIVED');

        }else{
            Logger.debug('debug', responseObject, 'CHAT_RECEIVED');    
        }
    }

    function _setResponseCache( responseObject ){
        RESPONSE_CACHE.setChatCache(responseObject.packetId, responseObject);
    }

    function _isResponseDuplicate( responseObject ){
        if( !responseObject || !responseObject.packetId) return false;
        return !!RESPONSE_CACHE.getChatCache(responseObject.packetId, responseObject);
    }

    function _isSelfRequestResponse( responseObject ){
        return !!REQUEST_CACHE.existsForChat(responseObject.packetId, responseObject);
    }

    function socketOnMessage(msg){
        /*** 

         Types of Data It May Recieved 
         1. Response Against Main App Request
         2. Response Against Worker Request
         3. Updates From Chat Server

        ***/

        var arrayBuffer = ArrayBuffer.prototype.slice.call( msg, 8 );
        var responseObject = ChatPacketParser.parseRawPacket(arrayBuffer);

        if( _isResponseDuplicate( responseObject ) ){
            return;
        }

        _setResponseCache( responseObject );

        _logResponse( responseObject )

        if( !_isSelfRequestResponse( responseObject ) ){
            ChatResponses.processUpdates(responseObject);
        }
        
    }

    function _getPacketSenderMethod( type ){
        if( type == CHAT_SERVER_TYPES.ONLINE ){
            return _sendSessionPacket;
        }else{
            return _sendOfflinePacket;
        }
    }
    
    function _sendOfflinePacket(requestObject, retryCount, requestType){

        return ChatOfflinePacketSender[requestType].call(null, requestObject, retryCount );            
    }

    function _sendSessionPacket(requestObject, retryCount, requestType){
        
        return ChatOnlinePacketSender[requestType].call(null, requestObject, retryCount );            
    }

    function _getKey(requestObject){
        return REQUEST_CACHE.getChatCacheKey(requestObject.packetId, requestObject);

    }
    function _setRequestCache(requestObject){        
        REQUEST_CACHE.setChatCache(requestObject.packetId, requestObject);
    }

    function _isDuplicate( requestObject ){
        var key = _getKey( requestObject );
        return !!REQUEST_CACHE.existsForChat( key, requestObject )
    }


    function _request(requestObject, type, retryCount ){

       if( !requestObject.packetId ){
            requestObject.packetId = Utils.getUUIDPacketId()

       }else if( _isDuplicate( requestObject )){       
            var returnPromise = new Promise(function(resolve, reject){
                resolve({ sucs : false, duplicate : true, timeout : false,  packetId: requestObject.packetId });    
            });
            return returnPromise;            
        }

        _setRequestCache( requestObject );      
                  
        var sendMethod = _getPacketSenderMethod( type );
        return sendMethod.call(null, requestObject, retryCount, 'request');
    }

    function _send(requestObject, type, retryCount ){    

        if( _isDuplicate( requestObject )) return;

        _setRequestCache( requestObject );   

        var sendMethod = _getPacketSenderMethod( type );
        sendMethod.call(null, requestObject, retryCount, 'send');
    }

    function _rawSend(requestType, retryCount){
        _sendSessionPacket(requestType, retryCount, 'rawSend')
    }

    function _getConnection() {
        return _chatConnection;
    }

    function _init(initSettings){
        
        if (_chatConnection) {
            _chatConnection.close();
        }
        
        object_extend(_settings, initSettings);

        _chatConnection = new SocketProvider(initSettings.url);    
        _chatConnection.onMessage(socketOnMessage);

        ChatPacketSender.init(_chatConnection);

    }

    global.CHAT_APP['ChatConnector'] = {        
        init           : _init,
        request        : _request,
        send           : _send,
        rawSend        : _rawSend,
        getConnection  : _getConnection
    }




})(self);