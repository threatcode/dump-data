(function(global){

    var CHAT_APP          = global.CHAT_APP;
    var REQUEST_CACHE 	  = CHAT_APP.REQUEST_CACHE;
    var AuthResponses 	  = CHAT_APP.AuthResponses;

    var _callbacks = {},
    	_authWorkerPort;

    function _getBoxId(requestObject){
    	return requestObject.fndId || requestObject.tid || requestObject.rid || 0
    }

    function _setRequestCache(requestObject){
    	var boxId = _getBoxId(requestObject);
    	REQUEST_CACHE.setAuthCache(boxId, requestObject.actn, requestObject);
    }

    function _isDuplicate( requestObject ){
        var boxId = _getBoxId(requestObject);
    	return !!REQUEST_CACHE.existsForAuth( boxId, requestObject.actn )
    }

    function _request( requestObject ){
    	var returnPromise = new Promise(function(resolve, reject){
    		if( _isDuplicate( requestObject )){
	    		resolve({ sucs : false, duplicate : true, timeout : false });
	    	}

	    	_setRequestCache( requestObject );

	    	requestObject.packetId = getUniqueId();

	    	_callbacks[requestObject.packetId] = resolve;

            try{
			    _authWorkerPort.postMessage( requestObject );
            }catch(e){
                //console.error(e);
            }

    	})

    	return returnPromise;

    }

    function _send( requestObject ){
		if( _isDuplicate( requestObject )) return;

    	_setRequestCache( requestObject );

		try{
            _authWorkerPort.postMessage( requestObject );
        }catch(e){
            //console.error(e);
        }

    }

    function onAuthWorkerMessage( event ){
        //console.log("Received From Auth Worker: ", event.data);
        var data = event.data;


        if( !!_callbacks[data.pckId] ){
            _callbacks[data.pckId].call(null, data);
            //console.info('Reomving Chat Auth Request Callback', data );
            delete _callbacks[data.pckId];

        }

        AuthResponses.processUpdates(event.data);
    }


    function _init( authWorkerPort ){
    	_authWorkerPort = authWorkerPort;

        _authWorkerPort.onmessage = onAuthWorkerMessage;

        REQUEST_CACHE.on('timeout', function(key){
            if(!_callbacks[key])return;

            _callbacks[key].call(null, ({ sucs : false, timeout: true } ));

            delete _callbacks[key];
        });

    }

    global.CHAT_APP['AuthConnector'] = {
    	init : _init,
        request : _request,
        send : _send,
    }

})(self);
