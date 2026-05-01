;(function(global){

    global.CHAT_APP = {
        GLOBALS           : {
            uId               : -1,
            appVersion        : -1
        },

        Constants               : {},
        PacketFormats           : {},
        PacketFormats           : {},
        AuthPacketSender        : {},
        AuthRequests            : {},
        AuthResponses           : {},
        ChatPacketSender        : {},
        Helpers                 : {},
        ResponseHelpers         : {},
        SharedHelpers           : {},
        ChatPacketParser        : {},
        PacketSendFlow          : {},
        ChatSessionPacketSender : {},
        ChatOnlinePacketSender  : {},
        ChatOfflinePacketSender : {},

        MODELS                  : {
            SESSION_OBJECT          : {}
        },

        CHAT_CLOCK              : {},
        REQUEST_CACHE           : {},
        RESPONSE_CACHE          : {},
        CHAT_SESSION            : {},
        BROKEN_PACKET_CACHE     : {},
        
        UTILS                   : {},
        ChatConnector           : {},
        AuthConnector           : {},

        getCurrentUserId : function(){
            return CHAT_APP.GLOBALS['uId'];
        },

        getAppVersion : function(){
          return CHAT_APP.GLOBALS['appVersion'];  
        },

        getOfflineIp : function(){
          return CHAT_APP.GLOBALS['oIpPort'].ip;
        },

        getOfflinePort : function(){
          return CHAT_APP.GLOBALS['oIpPort'].port;
        },

        Init : function(){}

        
    };

})(window)