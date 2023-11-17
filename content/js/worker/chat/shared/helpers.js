(function sharedHelper(global) {
    var CHAT_APP = global.CHAT_APP,
        Constants = CHAT_APP.Constants,
        // GENERAL_CONSTANTS  = Constants.GENERAL_CONSTANTS,
        CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES,
        PUBLIC_CHAT_OFFSET = Constants.PUBLIC_CHAT_OFFSET;
        // var ChatConnector	   = CHAT_APP.ChatConnector;

//     function _getChatServerCurrentTimeOld() {
//         var expectedServerTime,
//             serverTimeDiff,
//             chatServerCurrentTime;
//
//         if (CHAT_GLOBAL_VALUES.serverTime > 0) {
//             expectedServerTime = Date.now() + CHAT_GLOBAL_VALUES.serverTimeDiff;
//             serverTimeDiff = expectedServerTime - CHAT_GLOBAL_VALUES.serverTime;
//             chatServerCurrentTime = CHAT_GLOBAL_VALUES.serverTime + (serverTimeDiff % 1000);
//
//     // console.info('Expected Server Time ', expectedServerTime, ' Server TimeDiff ', serverTimeDiff, ' chatServerCurrentTime ',
//              chatServerCurrentTime, 'CHAT');
//     // console.info('CHAT_GLOBAL_VALUES', CHAT_GLOBAL_VALUES, 'CHAT');
//             // return chatServerCurrentTime;
//         } else {
//             chatServerCurrentTime = Date.now();
//         }
//         return chatServerCurrentTime;
//     }

//     function _getClientTimeFromServerTimeOld(serverTime) {
//         var serverTimeDiff = Date.now() - _getChatServerCurrentTime(),
//             clientCurrentTime = serverTime + serverTimeDiff;
//
//         return clientCurrentTime;
//     }

    function _getChatServerCurrentTime() {
        var chatServerCurrentTime = Date.now() - CHAT_GLOBAL_VALUES.serverTimeDiff;
        return chatServerCurrentTime;
    }

    function _getClientTimeFromServerTime(serverTime) {
        var clientCurrentTime = serverTime + CHAT_GLOBAL_VALUES.serverTimeDiff;
        return clientCurrentTime;
    }

    function _isPublicChatPacket(data) {
        return data.packetType > PUBLIC_CHAT_OFFSET;
    }

    global.CHAT_APP.SharedHelpers = {
        getChatServerCurrentTime: _getChatServerCurrentTime,
        getClientTimeFromServerTime: _getClientTimeFromServerTime,
        isPublicChatPacket: _isPublicChatPacket,
    };
})(window);
