(function chatPacketFormat(global) {
    // For Main App global == window
    // For Worker global == self

    // Dependencies
    // - app/chat/shared/chat.constants.js

    var FRIEND_TAG_CHAT_PACKET_INFO = global.CHAT_APP.PacketFormats.FRIEND_TAG_CHAT_PACKET_INFO,
        PUBLIC_CHAT_PACKET_INFO = global.CHAT_APP.PacketFormats.PUBLIC_CHAT_PACKET_INFO;

        /** ***********************************************  PACKET ATTRIBUTES **********************************************/

    // Export To global
    global.CHAT_APP.PacketFormats.CHAT_PACKET_INFO = Object.assign({}, FRIEND_TAG_CHAT_PACKET_INFO, PUBLIC_CHAT_PACKET_INFO);
})(window);
