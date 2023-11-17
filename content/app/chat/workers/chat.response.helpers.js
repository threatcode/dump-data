;(function(CHAT_APP){

    var Constants                 = CHAT_APP.Constants;    
    var GENERAL_CONSTANTS         = Constants.GENERAL_CONSTANTS;
    var WORKER_NOTIFIER_TYPES     = Constants.WORKER_NOTIFIER_TYPES;


    function _sendToMainApp(type, data){
        postMessage({
            object: data,
            notifier : type
        });
    }

    function _sendAuthResponseToMainApp(data){
        _sendToMainApp(WORKER_NOTIFIER_TYPES.AUTH_DATA_RECEIVED, data);
    }

    function _sendChatResponseToMainApp(data){
        _sendToMainApp(WORKER_NOTIFIER_TYPES.CHAT_DATA_RECEIVED, data);
    }

    function _sendChatExceptionResponseToMainApp(data){
        _sendToMainApp(WORKER_NOTIFIER_TYPES.EXCEPTION, data);  
    }

    function _sendChatRequestResponseToMainApp(data){
        _sendToMainApp(WORKER_NOTIFIER_TYPES.CHAT_REQUEST_RESPONSE, data);      
    }

	
	CHAT_APP['ResponseHelpers'] = {
				
        sendToMainApp                        : _sendToMainApp,
        sendAuthResponseToMainApp            : _sendAuthResponseToMainApp,
        sendChatResponseToMainApp            : _sendChatResponseToMainApp,
        sendChatExceptionResponseToMainApp   : _sendChatExceptionResponseToMainApp,
        sendChatRequestResponseToMainApp     : _sendChatRequestResponseToMainApp,


	}

})(CHAT_APP);