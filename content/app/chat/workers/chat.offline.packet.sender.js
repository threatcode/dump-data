;(function(global){

    var CHAT_APP                 = global.CHAT_APP;
    var Constants                = CHAT_APP.Constants;
    var GENERAL_CONSTANTS        = Constants.GENERAL_CONSTANTS;
    var ChatPacketSender         = CHAT_APP.ChatPacketSender;


    function _injectOfflineIpPort(requestObject){
		
		requestObject.ip = CHAT_APP.getOfflineIp();
        requestObject.port = CHAT_APP.getOfflinePort();

        return requestObject;
	}

    function _sendOfflinePacket(requestObject, retryCount, requestType){

        requestObject = _injectOfflineIpPort(requestObject)

        return ChatPacketSender[requestType].call(null, requestObject, retryCount );            
    }


    function _send(requestObject, retryCount){
		_sendOfflinePacket( requestObject, retryCount, 'send')
    }

    function _request(requestObject, retryCount){
    	return _sendOfflinePacket( requestObject, retryCount, 'request')
    }


    CHAT_APP['ChatOfflinePacketSender'] = {
    	send 	 : _send,
    	request : _request
    }

})(self);