(function chatOfflinePacketSenderIIFE(global) {
    var CHAT_APP = global.CHAT_APP,
        ChatPacketSender = CHAT_APP.ChatPacketSender;

    function _injectOfflineIpPort(_requestObject) {
        var requestObjectWithIpPort = _requestObject;

        requestObjectWithIpPort.ip = CHAT_APP.getOfflineIp();
        requestObjectWithIpPort.port = CHAT_APP.getOfflinePort();

        return requestObjectWithIpPort;
    }

    function _sendOfflinePacket(_requestObject, retryCount, requestType) {
        var requestObjectWithOfflineIpPort = _injectOfflineIpPort(_requestObject);

        return ChatPacketSender[requestType].call(null, requestObjectWithOfflineIpPort, retryCount);
    }


    function _send(requestObject, retryCount) {
        _sendOfflinePacket(requestObject, retryCount, 'send');
    }

    function _request(requestObject, retryCount) {
        return _sendOfflinePacket(requestObject, retryCount, 'request');
    }


    CHAT_APP.ChatOfflinePacketSender = {
        send: _send,
        request: _request,
    };
})(self);
