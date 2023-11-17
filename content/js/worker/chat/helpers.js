(function chatHelperIIFE(CHAT_APP) {
    var ChatRequests = CHAT_APP.ChatRequests,
        PublicChatRequests = CHAT_APP.PublicChatRequests,
        ChatConnector = CHAT_APP.ChatConnector,
        Constants = CHAT_APP.Constants,
        CHAT_SERVER_TYPES = Constants.CHAT_SERVER_TYPES,
        GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS,
        MESSAGE_TYPES = Constants.GENERAL_CONSTANTS.MESSAGE_TYPES,
        CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES,
        OFFLINE_PACKETS = Constants.OFFLINE_PACKETS,
        getUUIDPacketId = CHAT_APP.UTILS.getUUIDPacketId,
        SESSION_OBJECT = CHAT_APP.MODELS.SESSION_OBJECT,
        CHAT_SESSION = CHAT_APP.CHAT_SESSION,
        TAGS = CHAT_APP.TAGS,
        ChatOnlinePacketSender = CHAT_APP.ChatOnlinePacketSender;

    /** **********************  Command Helpers  ********************/

    function _sendToMainApp(type, data) {
        postMessage({
            object: data,
            notifier: type,
        });
    }

    function _sendAuthResponseToMainApp(data) {
        _sendToMainApp(WORKER_NOTIFIER_TYPES.AUTH_DATA_RECEIVED, data);
    }

    function _sendChatResponseToMainApp(data) {
        _sendToMainApp(WORKER_NOTIFIER_TYPES.CHAT_DATA_RECEIVED, data);
    }

    function _sendChatExceptionResponseToMainApp(data) {
        _sendToMainApp(WORKER_NOTIFIER_TYPES.EXCEPTION, data);
    }

    function _sendChatRequestResponseToMainApp(data) {
        _sendToMainApp(WORKER_NOTIFIER_TYPES.CHAT_REQUEST_RESPONSE, data);
    }

    function _sendChatTimerUpdateToMainApp(data) {
        _sendToMainApp(WORKER_NOTIFIER_TYPES.CHAT_TIMER_UPDATE, data);
    }

    function _forwardAuthRequestThroughMainApp(data) {
        _sendToMainApp(WORKER_NOTIFIER_TYPES.FORWARD_TO_AUTH, data);
    }

    function _sendIdlePacketByType(boxId, _type) {
        var type = parseInt(_type, 10),
            requestMethod,
            requestObject;

        if (type === GENERAL_CONSTANTS.SESSION_TYPES.FRIEND) {
            requestMethod = ChatRequests.getFriendChatIdleObject;
        } else if (type === GENERAL_CONSTANTS.SESSION_TYPES.TAG) {
            requestMethod = ChatRequests.getTagChatIdleObject;
        } else if (type === GENERAL_CONSTANTS.SESSION_TYPES.ROOM) {
            requestMethod = PublicChatRequests.getPublicChatChatIdelObject;
        }

        requestObject = requestMethod.call(null, boxId);
        ChatOnlinePacketSender.rawSend(requestObject, boxId);
    }


    function _doRequestForTagInformationWithMember(tagId) {
        var requestObject = ChatRequests.getOfflineGetTagInformationWithMembersObject(tagId);

        // Logger.debug('information', requestObject, 'CHAT');

        return CHAT_APP.ChatConnector.request(requestObject, CHAT_SERVER_TYPES.OFFLINE);
    }

    function _startChatSession(boxId, _type, utIds, force) {
        var returnPromise = new Promise(function PromiseHandler(resolve) {
            var requestObject,
                type = parseInt(_type, 10);

            if (!force && CHAT_SESSION.valid(boxId)) {
                Logger.debug('debug', 'Has Valid Session. Skipping Chat Session Request for ', boxId, 'CHAT');
                return;
            }

            if (type === GENERAL_CONSTANTS.SESSION_TYPES.ROOM) {
                requestObject = CHAT_APP.PublicChatRequests.getPublicChatGetRoomIpportObject(boxId);

                CHAT_APP.ChatConnector.request(requestObject, CHAT_SERVER_TYPES.OFFLINE)
                        .then(function requestSuccessHandler(response) {
                            resolve(response);
                        }, function requestFailurehandler(response) {
                            resolve(response);
                        });
            } else {
                if (type === GENERAL_CONSTANTS.SESSION_TYPES.FRIEND) {
                    requestObject = CHAT_APP.AuthRequests.getFriendChatRegisterIpPort(boxId);
                } else {
                    requestObject = CHAT_APP.AuthRequests.getTagChatRegisterIpPort(boxId, utIds);
                }

                CHAT_APP.AuthConnector.request(requestObject)
                    .then(function chatRequestSuccessHandler(response) {
                        if (!!response.sucs) {
                            CHAT_APP.AuthResponses.processUpdates(response);
                        } else {
                            CHAT_APP.RequestHelpers.makeTemporaryMessagesToFailed(boxId, true);
                        }

                        resolve(response);
                    });
            }
        });

        return returnPromise;
    }

    function _endChatSession(boxId) {
        CHAT_APP.ChatSession.unRegister(boxId);
    }


    function _doChatHistoryMessageRequest(boxId, pageDirection, limit, _type, packetId) {
        var requestObject,
            type = parseInt(_type, 10),
            requestMethod;


        if (type === GENERAL_CONSTANTS.REQUEST_TYPES.FRIEND) {
            requestMethod = ChatRequests.getOfflineFriendHistoryMessageRequestObject;
        } else if (type === GENERAL_CONSTANTS.REQUEST_TYPES.FRIEND) {
            requestMethod = PublicChatRequests.getPublicChatGetHistoryObject;
        } else {
            requestMethod = ChatRequests.getOfflineTagHistoryMessageRequestObject;
        }

        requestObject = requestMethod.call(null,
            boxId,
            pageDirection || GENERAL_CONSTANTS.PAGE_DIRECTION.UP,
            limit || GENERAL_CONSTANTS.PAGE_LIMIT,
            packetId || getUUIDPacketId()
        );

        return CHAT_APP.ChatConnector.request(requestObject, 5, CHAT_SERVER_TYPES.OFFLINE);
    }

    function __reFetchMemberCountZeroTags() {
        var allTagIdToUpdate = TAGS.getTagIdsToUpdate();

        allTagIdToUpdate.forEach(function aTagIdUpdateHandler(aTagId) {
            var requestObject = ChatRequests.getOfflineGetTagInformationWithMembersObject(aTagId);
            CHAT_APP.ChatConnector.send(requestObject);
        });

        return allTagIdToUpdate.length;
    }

    function __fetchAllTagsUntilMaxRetry() {
        var retryCount = GENERAL_CONSTANTS.MAX_TASK_RETRY_COUNT,
            updateLength,
            intervalKey;

        intervalKey = setInterval(function setIntervalHandler() {
            updateLength = __reFetchMemberCountZeroTags();
            Logger.debug('debug', updateLength + ' tags to fetch more', 'CHAT'); retryCount--;

            if (!updateLength || !retryCount) {
                clearInterval(intervalKey);
            }
        }, 10000);
    }

    //     function __fetchHistoryMessageStatus() {
    //         var retryCount = GENERAL_CONSTANTS.MAX_TASK_RETRY_COUNT,
    //             intervalKey = setInterval(function setIn() {
    //
    //             }, 30000);
    //     }


    function _startValidityTasks() {
        __fetchAllTagsUntilMaxRetry();
    }

    /** ****************  Data Helpers  *******************/

    function _getBoxId(object) {
        return object.boxId || object.friendId || object.tagId || object.roomId;
    }


    function _getChatBlankMessageObject(friendId) {
        var messageDate = CHAT_APP.SharedHelpers.getChatServerCurrentTime(),
            packetId = getUUIDPacketId(messageDate),
            requestObject;
        /* friendId, messageType,
			timeout, message, messageDate, isSecretVisible, packetId)
		*/
        requestObject = ChatRequests.getFriendChatMsgObject(friendId, MESSAGE_TYPES.BLANK_MESSAGE,
            0, ' ', messageDate, false, packetId);

        requestObject.isBroken = false;

        return requestObject;
    }

    function _getChatSessionObject(boxId, type, ip, port, bindingPort) {
        var sessionObject = new SESSION_OBJECT(boxId, type, ip, port, bindingPort);
        return sessionObject;
    }

    function _injectRegisterIpPortToRequestObject(requestObject) {
        var sessionObject = CHAT_SESSION.get(requestObject.tid);
        if (!!sessionObject) {
            requestObject.chIp = sessionObject.ip;
            requestObject.chRp = sessionObject.registerPort;
        } else {
            delete requestObject.chIp;
            delete requestObject.chRp;
        }
        return requestObject;
    }


    function _getUnreadMessagesMultipleTimes() {
        var offlineUpdateTime = CHAT_GLOBAL_VALUES.offlineUpdateTime,
            requestServerTime = CHAT_APP.SharedHelpers.getChatServerCurrentTime(),
            requestObject = CHAT_APP.ChatRequests.getOfflineGetRequestObject(offlineUpdateTime, 0);

        CHAT_APP.ChatConnector.request(requestObject)
            .then(function chatRequestSuccessHandler(response) {
                if (!!response.sucs) {
                    CHAT_GLOBAL_VALUES.offlineUpdateTime = requestServerTime;
                }
            });
    }

    function _getPublicChatHistoryMessagesMultipleTimes(roomId, pageDirection, _packetId, _limit, month, year) {
        var packetId = _packetId || CHAT_APP.UTILS.getUUIDPacketId(),
            limit = _limit || 10,
            requestObject = PublicChatRequests.getPublicChatGetHistoryObject(roomId, month, year, pageDirection, limit, packetId);
        return ChatConnector.request(requestObject);
    }

    /** ***********************  Decision Helpers ***************************/

    function _isOfflineServerPacket(packetType) {
        return !!OFFLINE_PACKETS[packetType];
    }


    CHAT_APP.Helpers = {

        // Command Helpers
        sendToMainApp: _sendToMainApp,
        sendAuthResponseToMainApp: _sendAuthResponseToMainApp,
        sendChatResponseToMainApp: _sendChatResponseToMainApp,
        sendChatExceptionResponseToMainApp: _sendChatExceptionResponseToMainApp,
        sendChatRequestResponseToMainApp: _sendChatRequestResponseToMainApp,
        sendChatTimerUpdateToMainApp: _sendChatTimerUpdateToMainApp,
        doRequestForTagInformationWithMember: _doRequestForTagInformationWithMember,

        sendIdlePacketByType: _sendIdlePacketByType,
        doChatHistoryMessageRequest: _doChatHistoryMessageRequest,

        startChatSession: _startChatSession,
        endChatSession: _endChatSession,

        startValidityTasks: _startValidityTasks,

        getUnreadMessagesMultipleTimes: _getUnreadMessagesMultipleTimes,
        getPublicChatHistoryMessagesMultipleTimes: _getPublicChatHistoryMessagesMultipleTimes,

        // Decision Helpers
        isOfflineServerPacket: _isOfflineServerPacket,

        // Data Helpers
        getBoxId: _getBoxId,
        getChatBlankMessageObject: _getChatBlankMessageObject,
        getChatSessionObject: _getChatSessionObject,

        injectRegisterIpPortToRequestObject: _injectRegisterIpPortToRequestObject,

        forwardAuthRequestThroughMainApp: _forwardAuthRequestThroughMainApp,


    };
})(CHAT_APP);
