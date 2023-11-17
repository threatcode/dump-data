(function chatRquestHelperIIFE(CHAT_APP) {
    var Constants = CHAT_APP.Constants,
        CHAT_SERVER_TYPES = Constants.CHAT_SERVER_TYPES,
        CHAT_STATES = Constants.CHAT_STATES,
        TEMPORARY_MESSAGES_CACHE = CHAT_APP.TEMPORARY_MESSAGES_CACHE,
        ChatConnector = CHAT_APP.ChatConnector,
        ChatOnlinePacketSender = CHAT_APP.ChatOnlinePacketSender,
        isTagChatPacket = ChatOnlinePacketSender.isTagChatPacket,
        isPublicChatPacket = ChatOnlinePacketSender.isPublicChatPacket,
        logSendMessageStateChange = ChatOnlinePacketSender.logSendMessageStateChange,
        doOfflineIpPortRefreshAndSendAgain = ChatOnlinePacketSender.doOfflineIpPortRefreshAndSendAgain,
        Helpers = CHAT_APP.Helpers,
        sendChatRequestResponseToMainApp = Helpers.sendChatRequestResponseToMainApp;


    /** **********************  Command Helpers  ********************/

    function _makeTemporaryMessagesToFailed(boxId, deleteCache) {
        var tempMessages = TEMPORARY_MESSAGES_CACHE.get(boxId);
        if (!!tempMessages && tempMessages.length > 0) {
            tempMessages.forEach(function aTempMessageHandler(aMessage) {
                var response = {
                    sucs: false,
                    packetId: aMessage.packetId,
                    sendState: CHAT_STATES.MESSAGE_SENDING.OFFLINE_FAILED,
                    packetType: aMessage.packetType,
                };


                if (!!aMessage.friendId) {
                    response.friendId = aMessage.friendId;
                }

                if (!!aMessage.tagId) {
                    response.tagId = aMessage.friendId;
                }

                aMessage.resolver(response);
                sendChatRequestResponseToMainApp(response);
            });

            if (deleteCache) {
                TEMPORARY_MESSAGES_CACHE.delete(boxId);
            }
        }
    }


    function _sendTemporaryMessages(boxId, sendOffline) {
        // Needs to port from Main App
        var tempMessages = TEMPORARY_MESSAGES_CACHE.get(boxId);
        if (!!tempMessages && tempMessages.length > 0) {
            tempMessages.forEach(function aTempMessageHandler(aMessage) {
                var previousState = aMessage.sendState,
                    isTagChat = isTagChatPacket(aMessage),
                    isPublicChat = isPublicChatPacket(aMessage);

                switch (aMessage.sendState) {
                    case CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REFRESH:

                        if (isTagChat || isPublicChat) {
                            aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.SECOND_ONLINE;
                        } else {
                            if (sendOffline) {
                                aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE;
                            } else {
                                aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.THIRD_ONLINE;
                            }
                        }

                        ChatConnector.request(aMessage, CHAT_SERVER_TYPES.ONLINE)
                            .then(function chatRequestSuccessHandler(response) {
                                aMessage.resolver(response);
                            });

                        break;

                    case CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REQUEST:

                        if (isTagChat || isPublicChat || !sendOffline) {
                            aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_ONLINE;
                            ChatConnector.request(aMessage, CHAT_SERVER_TYPES.ONLINE)
                                .then(function chatRequestSuccessHandler(response) {
                                    aMessage.resolver(response);
                                });
                        } else {
                            aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE;
                            ChatConnector.request(aMessage, CHAT_SERVER_TYPES.OFFLINE)
                                .then(function chatRequestSuccessHandler() {
                                    aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_SUCCESS;

                                    aMessage.resolver({
                                        sucs: true,
                                        update: false,
                                        packetId: aMessage.packetId,
                                        sendState: aMessage.sendState,
                                    });

                                    logSendMessageStateChange(aMessage.sendState, aMessage, previousState);
                                }, function chatRequestFailureHandler() {
                                    aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_IP_PORT_REFRESH;
                                    doOfflineIpPortRefreshAndSendAgain(aMessage, 5, aMessage.resolver);
                                    logSendMessageStateChange(aMessage.sendState, aMessage, previousState);
                                });
                        }
                        break;

                    default:
                        break;
                }

                logSendMessageStateChange(aMessage.sendState, aMessage, previousState);
            });

            TEMPORARY_MESSAGES_CACHE.delete(boxId);
        }
    }


    CHAT_APP.RequestHelpers = {

        sendTemporaryMessages: _sendTemporaryMessages,
        makeTemporaryMessagesToFailed: _makeTemporaryMessagesToFailed,

    };
})(CHAT_APP);
