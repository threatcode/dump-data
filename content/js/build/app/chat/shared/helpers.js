;(function(global){

	var CHAT_APP 		   = global.CHAT_APP;
    var Constants          = CHAT_APP.Constants;
    var GENERAL_CONSTANTS  = Constants.GENERAL_CONSTANTS;
    var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES;    
    var ChatConnector	   = CHAT_APP.ChatConnector;

	function _getChatServerCurrentTime() {
        if( CHAT_GLOBAL_VALUES.serverTime > 0){

            var expectedServerTime = Date.now() + CHAT_GLOBAL_VALUES.serverTimeDiff;
            var serverTimeDiff = expectedServerTime - CHAT_GLOBAL_VALUES.serverTime;
            var chatServerCurrentTime = CHAT_GLOBAL_VALUES.serverTime + serverTimeDiff%1000;
            
//            console.info('Expceted Server Time ', expectedServerTime, ' Server TimeDiff ', serverTimeDiff, ' chatServerCurrentTime ', chatServerCurrentTime, 'CHAT');
 //           console.info('CHAT_GLOBAL_VALUES', CHAT_GLOBAL_VALUES, 'CHAT');
            return chatServerCurrentTime;
        }else{
            return Date.now(); 
        }
    };

    function _getClientTimeFromServerTime(serverTime){
        var serverTimeDiff = Date.now() - _getChatServerCurrentTime();
        var clientCurrentTime = serverTime + serverTimeDiff;
        return clientCurrentTime; 
    }

    global.CHAT_APP['SharedHelpers'] = {     	
     	getChatServerCurrentTime  : _getChatServerCurrentTime,
        getClientTimeFromServerTime : _getClientTimeFromServerTime 

    }

})(window);




