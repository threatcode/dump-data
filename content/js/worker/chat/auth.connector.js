(function authConnectorIIFE(global) {
    var CHAT_APP = global.CHAT_APP,
        UTILS = CHAT_APP.UTILS,
        REQUEST_CACHE = CHAT_APP.REQUEST_CACHE,
        AuthResponses = CHAT_APP.AuthResponses,
        _callbacks = {},
        _authWorkerPort;

    function _getBoxId(requestObject) {
        return requestObject.fndId || requestObject.futId || requestObject.tid || requestObject.rid || 0;
    }

    function _getKey(requestObject) {
        var boxId = _getBoxId(requestObject);
        return REQUEST_CACHE.getAuthCacheKey(boxId, requestObject.actn, requestObject.packetId);
    }

    function _setRequestCache(requestObject) {
        var boxId = _getBoxId(requestObject);
        REQUEST_CACHE.setAuthCache(boxId, requestObject.actn, requestObject);
    }

    function _isDuplicate(requestObject) {
        var boxId = _getBoxId(requestObject);
        return REQUEST_CACHE.existsForAuth(boxId, requestObject.actn);
    }

    function _sendToAuthWorker(requestObject) {
        try {
            if (!!_authWorkerPort) {
                _authWorkerPort.postMessage(requestObject);
            } else {
                CHAT_APP.Helpers.forwardAuthRequestThroughMainApp(requestObject);
            }
        } catch (e) {
            Logger.log('debug', e, 'CHAT');
        }
    }

    function _request(requestObject) {
        var returnPromise = new Promise(function requestPromise(resolve) {
            if (_isDuplicate(requestObject)) {
                resolve({
                    sucs: false,
                    duplicate: true,
                    timeout: false,
                });
            }

            requestObject.packetId = UTILS.getUniqueId();

            _setRequestCache(requestObject);

            _callbacks[_getKey(requestObject)] = resolve;

            _sendToAuthWorker(requestObject);
        });

        return returnPromise;
    }

    function _send(requestObject) {
        if (_isDuplicate(requestObject)) return;

        _setRequestCache(requestObject);

        _sendToAuthWorker(requestObject);
    }

    function onAuthWorkerMessage(event) {
        // Logger.log("debug", "Received From Auth Worker: ", event.data, 'CHAT');
        var data = event.data;

        if (data.type === 'server_time' && !!data.value) {
            CHAT_APP.Constants.CHAT_GLOBAL_VALUES.serverTime = data.value;
            CHAT_APP.Constants.CHAT_GLOBAL_VALUES.serverTimeDiff = data.diff;
            return;
        }

        if (!!_callbacks[data.pckId]) {
            _callbacks[data.pckId].call(null, data);
            // Logger.info("debug", 'Reomving Chat Auth Request Callback', data );
            delete _callbacks[data.pckId];
        }

        AuthResponses.processUpdates(event.data);
    }


    function _init(authWorkerPort) {
        if (authWorkerPort) {
            _authWorkerPort = authWorkerPort;
            _authWorkerPort.onmessage = onAuthWorkerMessage;
        }

        REQUEST_CACHE.on('timeout', function onRequestCacheTimeout(key) {
            if (!_callbacks[key]) return;

            _callbacks[key].call(null, ({
                sucs: false,
                timeout: true,
            }));

            delete _callbacks[key];
        });
    }

    global.CHAT_APP.AuthConnector = {
        init: _init,
        request: _request,
        send: _send,
        onMessage: onAuthWorkerMessage,
    };
})(self);
