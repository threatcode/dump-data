(function chatApp(global) {
    global.CHAT_APP = {
        GLOBALS: {
            uId: -1,
            appVersion: -1,
            oIpPort: {},
        },

        Constants: {},
        PacketFormats: {},
        AuthPacketSender: {},
        AuthRequests: {},
        AuthResponses: {},
        ChatPacketSender: {},
        Helpers: {},
        ResponseHelpers: {},
        SharedHelpers: {},
        ChatPacketParser: {},
        PacketSendFlow: {},
        ChatSessionPacketSender: {},
        ChatOnlinePacketSender: {},
        ChatOfflinePacketSender: {},

        MODELS: {
            SESSION_OBJECT: {},
        },

        CHAT_CLOCK: {},
        REQUEST_CACHE: {},
        RESPONSE_CACHE: {},
        CHAT_SESSION: {},
        BROKEN_PACKET_CACHE: {},

        UTILS: {},
        ChatConnector: {},
        AuthConnector: {},

        getCurrentUserId: function getCurrentUserId() {
            return CHAT_APP.GLOBALS.utId;
        },

        getCurrentUserUId: function getCurrentUserUId() {
            return CHAT_APP.GLOBALS.uId;
        },
        getCurrentUserName: function getCurrentUserName() {
            return CHAT_APP.GLOBALS.name;
        },

        getCurrentUserProfileImage: function getCurrentUserProfileImage() {
            return CHAT_APP.GLOBALS.profileImage;
        },

        getAppVersion: function getAppVersion() {
            return CHAT_APP.GLOBALS.appVersion;
        },

        getOfflineIp: function getOfflineIp() {
            return CHAT_APP.GLOBALS.oIpPort.ip;
        },

        getOfflinePort: function getOfflinePort() {
            return CHAT_APP.GLOBALS.oIpPort.port;
        },

        setOfflineIp: function setOfflineIp(ip) {
            CHAT_APP.GLOBALS.oIpPort.ip = ip;
        },

        setOfflinePort: function setOfflinePort(port) {
            CHAT_APP.GLOBALS.oIpPort.port = port;
        },

        Init: function Init() {},
    };
})(window);
