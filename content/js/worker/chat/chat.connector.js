(function ChatConnectorIIFE(global) {
    var CHAT_APP = global.CHAT_APP,
        ChatPacketSender = CHAT_APP.ChatPacketSender,
        CHAT_SERVER_TYPES = CHAT_APP.Constants.CHAT_SERVER_TYPES,
        ChatOnlinePacketSender = CHAT_APP.ChatOnlinePacketSender,
        ChatOfflinePacketSender = CHAT_APP.ChatOfflinePacketSender,
        Utils = CHAT_APP.Utils,
        _requestPromises = {},
        _chatConnection,
        _socketErrorInfo = { count: 0, timestamp: 0 },
        _settings = {};

    function _logResponse(responseObject) {
        var packetName;
        if (responseObject.packetType) {
            packetName = CHAT_APP.ChatPacketParser.getPacketName(responseObject.packetType);

            if (!!CHAT_APP.PacketFormats.CHAT_PACKET_INFO[responseObject.packetType].CONFIRMATION) {
                Logger.debug('debug', packetName, responseObject, 'CHAT_RECEIVED');
            } else {
                Logger.debug('debug', packetName, responseObject, 'CHAT_CONFIRMATION_RECEIVED');
            }
        } else {
            Logger.debug('debug', responseObject, 'CHAT_RECEIVED');
        }
    }

    function _setResponseCache(responseObject) {
        RESPONSE_CACHE.setChatCache(responseObject.packetId, responseObject);
    }

    function _isResponseDuplicate(responseObject) {
        if (!responseObject || !responseObject.packetId) return false;
        return !!RESPONSE_CACHE.getChatCache(responseObject.packetId, responseObject);
    }

    function _isSelfRequestResponse(responseObject) {
        return !!REQUEST_CACHE.existsForChat(responseObject.packetId, responseObject);
    }

    function onSocketOpen() {
        _socketErrorInfo.count = 0;
        _socketErrorInfo.timestmap = 0;
    }

    function onSocketError() {
        var now = Date.now();
        if (_socketErrorInfo.count > 10) {
            REQUEST_CACHE.flush();
            TEMPORARY_MESSAGES_CACHE.flush();
            CHAT_SESSION.flush();
        }

        if (_socketErrorInfo.count > 10 || ((_socketErrorInfo.timestamp - now) > 10 * 1000)) {
            _socketErrorInfo.count = 0;
            _socketErrorInfo.timestmap = 0;
        } else {
            _socketErrorInfo.timestmap = now;
            _socketErrorInfo.count++;
        }
    }

    function socketOnMessage(msg) {
        /*

         Types of Data It May Recieved
         1. Response Against Main App Request
         2. Response Against Worker Request
         3. Updates From Chat Server

        ***/

        var arrayBuffer = ArrayBuffer.prototype.slice.call(msg, 8),
            responseObject = ChatPacketParser.parseRawPacket(arrayBuffer);

        if (_isResponseDuplicate(responseObject)) {
            return;
        }

        _setResponseCache(responseObject);

        _logResponse(responseObject);

        if (!_isSelfRequestResponse(responseObject)) {
            if (ChatPacketParser.isPublicChatPacket(responseObject.packetType)) {
                CHAT_APP.PublicChatResponses.processUpdates(responseObject);
            } else {
                ChatResponses.processUpdates(responseObject);
            }
        }
    }

    function _getPacketSenderMethod(type) {
        var method;
        if (type === CHAT_SERVER_TYPES.ONLINE) {
            method = _sendSessionPacket;
        } else {
            method = _sendOfflinePacket;
        }
        return method;
    }

    function _sendOfflinePacket(requestObject, retryCount, requestType) {
        return ChatOfflinePacketSender[requestType].call(null, requestObject, retryCount);
    }

    function _sendSessionPacket(requestObject, retryCount, requestType) {
        return ChatOnlinePacketSender[requestType].call(null, requestObject, retryCount);
    }

    function _getKey(requestObject) {
        return REQUEST_CACHE.getChatCacheKey(requestObject.packetId, requestObject);
    }

    function _setRequestCache(requestObject) {
        REQUEST_CACHE.setChatCache(requestObject.packetId, requestObject);
    }

    function _isDuplicate(requestObject) {
        var key = _getKey(requestObject);
        return REQUEST_CACHE.existsForChat(key, requestObject);
    }


    function _request(requestObject, type, retryCount) {
        var returnPromise,
            sendMethod;

        if (!requestObject.packetId) {
            requestObject.packetId = Utils.getUUIDPacketId();
        } else if (_isDuplicate(requestObject)) {
            returnPromise = new Promise(function promiseHandler(resolve) {
                setTimeout(function setTimeoutHandler() {
                    resolve({
                        sucs: false,
                        duplicate: true,
                        timeout: false,
                        packetId: requestObject.packetId,
                    });
                });
            });
            return returnPromise;
        }

        _setRequestCache(requestObject);

        sendMethod = _getPacketSenderMethod(type);
        returnPromise = sendMethod.call(null, requestObject, retryCount, 'request');

        _requestPromises[_getKey(requestObject)] = returnPromise;
        return returnPromise;
    }

    function _send(requestObject, type, _retryCount) {
        var sendMethod,
            retryCount = _retryCount;

        if (_isDuplicate(requestObject)) return;

        _setRequestCache(requestObject);

        if (!CHAT_APP.PacketFormats.CHAT_PACKET_INFO[requestObject.packetType].CONFIRMATION) {
            retryCount = 1;
        }

        sendMethod = _getPacketSenderMethod(type);
        sendMethod.call(null, requestObject, retryCount, 'send');
    }

    function _rawSend(requestType, retryCount) {
        _sendSessionPacket(requestType, retryCount, 'rawSend');
    }

    function _getConnection() {
        return _chatConnection;
    }

    function _init(initSettings) {
        if (_chatConnection) {
            _chatConnection.close();
        }

        object_extend(_settings, initSettings);

        _chatConnection = new SocketProvider(initSettings.url);
        _chatConnection.onMessage(socketOnMessage);
        _chatConnection.onOpen(onSocketOpen);
        _chatConnection.onError(onSocketError);

        ChatPacketSender.init(_chatConnection);

        REQUEST_CACHE.on('timeout', function onRequestCacheTimeout(key) {
            if (!_requestPromises[key]) return;

            try {
                _requestPromises[key].resolve({
                    sucs: false,
                    timeout: true,
                });
            } catch (e) {
                //
            }


            delete _requestPromises[key];
        });
    }

    global.CHAT_APP.ChatConnector = {
        init: _init,
        request: _request,
        send: _send,
        rawSend: _rawSend,
        getConnection: _getConnection,
    };
})(self);
