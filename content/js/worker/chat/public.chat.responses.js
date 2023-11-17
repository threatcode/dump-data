(function PublicChatResponseIIFE(global) {
    'use strict';
    // For Main App global == window
    // For Worker global == self

    var PublicChatRequests = CHAT_APP.PublicChatRequests,
        Helpers = CHAT_APP.Helpers,
        Constants = global.CHAT_APP.Constants,
        PACKET_TYPES = Constants.PACKET_TYPES,
        GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS,
        CHAT_SESSION = CHAT_APP.CHAT_SESSION,
        SESSION_OBJECT = CHAT_APP.MODELS.SESSION_OBJECT,
        BROKEN_PACKET_CACHE = CHAT_APP.BROKEN_PACKET_CACHE,
        RequestHelpers = CHAT_APP.RequestHelpers,
        ChatConnector = CHAT_APP.ChatConnector,
        CHAT_SERVER_TYPES = Constants.CHAT_SERVER_TYPES,
        responseMethodMap = {};

    function getPacketProcessorInfo(packetType) {
        return responseMethodMap[packetType];
    }

    function processUpdates(responseObject) {
        var packetType = responseObject.packetType,
            packetProcessorInfo = getPacketProcessorInfo(packetType);

        if (!packetProcessorInfo) {
            RingLogger.warning('Packet Processor Not Implemented. Packet Type ', packetType, RingLogger.tags.CHAT);
            return false;
        }

        try {
            packetProcessorInfo.processor.call(this, responseObject);
        } catch (e) {
            RingLogger.alert('Exception In PACKET Procsessing.', packetType, e, RingLogger.tags.CHAT);
        }

        return true;
    }

    // PACKET TYPE(1003) : PUBLIC_CHAT_REGISTER_CONFIRMATION
    function onPublicChatRegisterConfirmation(responseObject) {
        var roomId = responseObject.roomId,
            chatBindingPort = responseObject.chatBindingPort;

        /* method body */

        CHAT_SESSION.register(roomId, chatBindingPort);

        Helpers.sendChatResponseToMainApp(responseObject);

        RequestHelpers.sendTemporaryMessages(roomId);
    }

    // PACKET TYPE(1004) : PUBLIC_CHAT_CHAT_IDEL
    function onPublicChatChatIdel(responseObject) {
        /* method body */
        Helpers.sendChatResponseToMainApp(responseObject);
    }

    // PACKET TYPE(1005) : PUBLIC_CHAT_CHAT_MESSAGE_TYPING
    function onPublicChatChatMessageTyping(responseObject) {
        /* method body */
        Helpers.sendChatResponseToMainApp(responseObject);
    }

    // PACKET TYPE(1006) : PUBLIC_CHAT_CHAT_MESSAGE
    function onPublicChatChatMessage(responseObject) {
        var roomId = responseObject.roomId,
            messageType = responseObject.messageType,
            messageDate = responseObject.messageDate,
            packetId = responseObject.packetId,
            requestObject;

        /* method body */

        if (messageType === GENERAL_CONSTANTS.MESSAGE_TYPES.BLANK_MESSAGE && CHAT_APP.UTILS.hasChatSession(messageDate)) {
            Helpers.doChatHistoryMessageRequest(roomId,
                    GENERAL_CONSTANTS.PAGE_DIRECTION.UP,
                    GENERAL_CONSTANTS.PAGE_LIMIT,
                    GENERAL_CONSTANTS.REQUEST_TYPES.ROOM);

            return;
        }

        Helpers.sendChatResponseToMainApp(responseObject);
        if (responseObject.fromHistory) {
            return;
        }

        requestObject = PublicChatRequests.getPublicChatChatMessageDeliveredObject(roomId, packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.ONLINE);
    }

    // PACKET TYPE(1007) : PUBLIC_CHAT_CHAT_MESSAGE_EDIT
    function onPublicChatChatMessageEdit(responseObject) {
        /* method body */
        onPublicChatChatMessage(responseObject);
    }

    // PACKET TYPE(1008) : PUBLIC_CHAT_CHAT_MESSAGE_BROKEN
    function onPublicChatChatMessageBroken(responseObject) {
        var roomId = responseObject.roomId,
            sequenceNo = responseObject.sequenceNo,
            packetId = responseObject.packetId,
            packetsLength,
            requestObject;

        /* method body */
        packetsLength = responseObject.packetsLength;

        if (BROKEN_PACKET_CACHE.exists(packetId, sequenceNo)) {
            // duplicate packet
            return;
        }

        if (!responseObject.originPacketType) {
            responseObject.originPacketType = responseObject.packetType;
            responseObject.packetType = PACKET_TYPES.CHAT_MESSAGE_BROKEN;
        }

        BROKEN_PACKET_CACHE.setBrokenCache(packetId, sequenceNo, responseObject);
        BROKEN_PACKET_CACHE.process(packetId, packetsLength, true);

        requestObject = PublicChatRequests.getPublicChatChatMessageDeliveredObject(roomId, packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.ONLINE);
    }

    // PACKET TYPE(1009) : PUBLIC_CHAT_CHAT_MESSAGE_BROKEN_EDIT
    function onPublicChatChatMessageBrokenEdit(_responseObject) {
        var responseObject = _responseObject;

        /* method body */
        responseObject.originPacketType = responseObject.packetType;
        responseObject.packetType = PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_BROKEN_EDIT;

        onPublicChatChatMessageBroken(responseObject);
    }

    // PACKET TYPE(1010) : PUBLIC_CHAT_CHAT_MESSAGE_DELIVERED
    function onPublicChatChatMessageDelivered(responseObject) {
        /* method body */
        Helpers.sendChatResponseToMainApp(responseObject);
    }

    // PACKET TYPE(1011) : PUBLIC_CHAT_CHAT_MESSAGE_SENT
    function onPublicChatChatMessageSent(responseObject) {
        /* method body */
        Helpers.sendChatResponseToMainApp(responseObject);
    }

    // PACKET TYPE(1014) : PUBLIC_CHAT_MEMBER_LIST
    function onPublicChatMemberList(responseObject) {
        var roomId = responseObject.roomId,
            packetId = responseObject.packetId,
            requestObject;
        /* method body */

        Helpers.sendChatResponseToMainApp(responseObject);
        requestObject = PublicChatRequests.getPublicChatMemberListConfirmationObject(roomId, packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.ONLINE);
    }

    // PACKET TYPE(1015) : PUBLIC_CHAT_MEMBER_COUNT_CHANGE
    function onPublicChatMemberCountChange(responseObject) {
        var roomId = responseObject.roomId,
            packetId = responseObject.packetId,
            requestObject;

        /* method body */

        Helpers.sendChatResponseToMainApp(responseObject);
        requestObject = PublicChatRequests.getPublicChatMemberCountChangeConfirmationObject(roomId, packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.ONLINE);
    }

    // PACKET TYPE(1020) : PUBLIC_CHAT_ROOM_LIST
    function onPublicChatRoomList(responseObject) {
        var packetId = responseObject.packetId,
            requestObject;

        /* method body */
        Helpers.sendChatResponseToMainApp(responseObject);
        requestObject = PublicChatRequests.getPublicChatRoomListRequestConfirmationObject(packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.OFFLINE);
    }

    // PACKET TYPE(1022) : PUBLIC_CHAT_ROOM_IPPORT_CONFIRMATION
    function onPublicChatRoomIpportConfirmation(responseObject) {
        var roomId = responseObject.roomId,
            serverIp = responseObject.serverIp,
            serverRegisterPort = responseObject.serverRegisterPort,
//             noOfMember = responseObject.noOfMember,
//             packetId = responseObject.packetId,
            aSssionObject,
            registerObject;

        /* method body */
        Helpers.sendChatResponseToMainApp(responseObject);

        aSssionObject = CHAT_SESSION.get(roomId);
        if (!aSssionObject) {
            aSssionObject = new SESSION_OBJECT(
                    roomId, GENERAL_CONSTANTS.SESSION_TYPES.ROOM,
                    serverIp, parseInt(serverRegisterPort, 10), 0);

            CHAT_SESSION.set(roomId, aSssionObject);
        } else {
            aSssionObject.update(serverIp, parseInt(serverRegisterPort, 10), 0);
        }

        registerObject = PublicChatRequests.getPublicChatRegisterObject(roomId, CHAT_APP.getCurrentUserName(), CHAT_APP.getCurrentUserProfileImage());
        ChatConnector.request(registerObject, CHAT_SERVER_TYPES.ONLINE);
    }

    // PACKET TYPE(1024) : PUBLIC_CHAT_ROOM_INFORMATION
    function onPublicChatRoomInformation(responseObject) {
        var packetId = responseObject.packetId,
            requestObject;

        /* method body */
        Helpers.sendChatResponseToMainApp(responseObject);
        requestObject = PublicChatRequests.getPublicChatRoomListRequestConfirmationObject(packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.OFFLINE);
    }

    // PACKET TYPE(1027) : PUBLIC_CHAT_HISTORY_MESSAGE_LIST
    function onPublicChatHistoryMessageList(responseObject) {
        var packetId = responseObject.packetId,
            messages = responseObject.messages,
            roomId = responseObject.roomId,
            requestObject,
            aHistoryMessage,
            processed = false,
            packetIds = [],
            preProcessMessageDate = CHAT_APP.SharedHelpers.getChatServerCurrentTime(),
            lowestMessageDate = preProcessMessageDate,
            messageType,
            newPacketId,
            index;

        /* method body */
        Helpers.sendChatResponseToMainApp(responseObject);

        for (index = 0; index < messages.length; index++) {
            aHistoryMessage = messages[index];
            messageType = parseInt(aHistoryMessage.messageType, 10);
            if (messageType === GENERAL_CONSTANTS.MESSAGE_TYPES.HISTORY_RE_FETCH) {
                Helpers.doChatHistoryMessageRequest(roomId,
                    GENERAL_CONSTANTS.PAGE_DIRECTION.UP,
                    GENERAL_CONSTANTS.PAGE_LIMIT,
                    GENERAL_CONSTANTS.REQUEST_TYPES.ROOM,
                    aHistoryMessage.packetId
                );
                // else if( aHistoryMessage.messageType != GENERAL_CONSTANTS.MESSAGE_TYPES.DELETE_MESSAGE ){
            } else {
                processed = true;
            }

            if (aHistoryMessage.messageDate < lowestMessageDate) {
                lowestMessageDate = aHistoryMessage.messageDate;
            }

            packetIds.push(aHistoryMessage.packetId);
        }

        if (!processed) {
            if (lowestMessageDate !== preProcessMessageDate) {
                newPacketId = CHAT_APP.UTILS.getUUIDPacketId(lowestMessageDate, true);
                Helpers.doChatHistoryMessageRequest(roomId,
                    GENERAL_CONSTANTS.PAGE_DIRECTION.UP,
                    GENERAL_CONSTANTS.PAGE_LIMIT,
                    GENERAL_CONSTANTS.REQUEST_TYPES.ROOM,
                    newPacketId
                );
            }
        }

        requestObject = PublicChatRequests.getPublicChatRoomListRequestConfirmationObject(packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.OFFLINE);
    }

    // PACKET TYPE(1029) : PUBLIC_CHAT_ROOM_LIST_WITH_HISTORY
    function onPublicChatRoomListWithHistory(responseObject) {
        var packetId = responseObject.packetId,
            requestObject;
        /* method body */

        Helpers.sendChatResponseToMainApp(responseObject);
        requestObject = PublicChatRequests.getPublicChatRoomListRequestConfirmationObject(packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.OFFLINE);
    }

    // PACKET TYPE(1034) : PUBLIC_CHAT_DELETE_MESSAGE
    function onPublicChatDeleteMessage(responseObject) {
        var roomId = responseObject.roomId,
            packetId = responseObject.packetId,
            requestObject;
        /* method body */

        Helpers.sendChatResponseToMainApp(responseObject);
        requestObject = PublicChatRequests.getPublicChatDeleteMessageConfirmationObject(roomId, packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.OFFLINE);
    }

    // PACKET TYPE(1036) : PUBLIC_CHAT_LIKE_A_MESSAGE
    function onPublicChatLikeAMessage(responseObject) {
        var roomId = responseObject.roomId,
            packetId = responseObject.packetId,
            requestObject;

        /* method body */
        Helpers.sendChatResponseToMainApp(responseObject);
        requestObject = PublicChatRequests.getPublicChatLikeUnlikeMessageConfirmationObject(roomId, packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.OFFLINE);
    }

    // PACKET TYPE(1037) : PUBLIC_CHAT_UNLIKE_A_MESSAGE
    function onPublicChatUnlikeAMessage(responseObject) {
        var roomId = responseObject.roomId,
            requestObject,
            packetId = responseObject.packetId;

      /* method body */
        Helpers.sendChatResponseToMainApp(responseObject);
        requestObject = PublicChatRequests.getPublicChatLikeUnlikeMessageConfirmationObject(roomId, packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.OFFLINE);
    }

    // PACKET TYPE(1039) : PUBLIC_CHAT_REPORT_A_MESSAGE
    function onPublicChatReportAMessage(responseObject) {
        var roomId = responseObject.roomId,
            requestObject,
            packetId = responseObject.packetId;

      /* method body */
        Helpers.sendChatResponseToMainApp(responseObject);
        requestObject = PublicChatRequests.getPublicChatReportAMessageConfirmationObject(roomId, packetId);
        ChatConnector.send(requestObject, CHAT_SERVER_TYPES.OFFLINE);
    }

    // PACKET TYPE(1042) : PUBLIC_CHAT_LIKE_MEMBER_LIST
    function onPublicChatLikeMemberList(responseObject) {
        var packetId = responseObject.packetId,
            requestObject;

        /* method body */
        requestObject = REQUEST_CACHE.getChatCache(packetId, {
            sequenceNo: responseObject.sequenceNo,
            packetType: PACKET_TYPES.PUBLIC_CHAT_LIKE_MEMBER_LIST_REQUEST,
        });

        if (!requestObject) return;

        responseObject.originalPacketid = requestObject.originalPacketid;

        Helpers.sendChatResponseToMainApp(responseObject);
    }

    // PACKET TYPE(1044) : PUBLIC_CHAT_CATEGORY_LIST
    function onPublicChatCategoryList(responseObject) {
        Helpers.sendChatResponseToMainApp(responseObject);
    }


    // PACKET TYPE(1001) : PUBLIC_CHAT_REGISTER
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_REGISTER] = {
        processor: function onPublicChatRegister() {},
    };

    // PACKET TYPE(1002) : PUBLIC_CHAT_UNREGISTER
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_UNREGISTER] = {
        processor: function onPublicChatUnregister() {},
    };

    // PACKET TYPE(1003) : PUBLIC_CHAT_REGISTER_CONFIRMATION
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_REGISTER_CONFIRMATION] = {
        processor: onPublicChatRegisterConfirmation,
    };

    // PACKET TYPE(1004) : PUBLIC_CHAT_CHAT_IDEL
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_CHAT_IDEL] = {
        processor: onPublicChatChatIdel,
    };

    // PACKET TYPE(1005) : PUBLIC_CHAT_CHAT_MESSAGE_TYPING
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_TYPING] = {
        processor: onPublicChatChatMessageTyping,
    };

    // PACKET TYPE(1006) : PUBLIC_CHAT_CHAT_MESSAGE
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE] = {
        processor: onPublicChatChatMessage,
    };

    // PACKET TYPE(1007) : PUBLIC_CHAT_CHAT_MESSAGE_EDIT
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_EDIT] = {
        processor: onPublicChatChatMessageEdit,
    };

    // PACKET TYPE(1008) : PUBLIC_CHAT_CHAT_MESSAGE_BROKEN
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_BROKEN] = {
        processor: onPublicChatChatMessageBroken,
    };

    // PACKET TYPE(1009) : PUBLIC_CHAT_CHAT_MESSAGE_BROKEN_EDIT
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_BROKEN_EDIT] = {
        processor: onPublicChatChatMessageBrokenEdit,
    };

    // PACKET TYPE(1010) : PUBLIC_CHAT_CHAT_MESSAGE_DELIVERED
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_DELIVERED] = {
        processor: onPublicChatChatMessageDelivered,
    };

    // PACKET TYPE(1011) : PUBLIC_CHAT_CHAT_MESSAGE_SENT
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_SENT] = {
        processor: onPublicChatChatMessageSent,
    };

    // PACKET TYPE(1012) : PUBLIC_CHAT_GET_MEMBER_LIST
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_GET_MEMBER_LIST] = {
        processor: function onPublicChatGetMemberList() {},
    };

    // PACKET TYPE(1013) : PUBLIC_CHAT_MEMBER_LIST_CONFIRMATION
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_MEMBER_LIST_CONFIRMATION] = {
        processor: function onPublicChatMemberListConfirmation() {},
    };

    // PACKET TYPE(1014) : PUBLIC_CHAT_MEMBER_LIST
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_MEMBER_LIST] = {
        processor: onPublicChatMemberList,
    };

    // PACKET TYPE(1015) : PUBLIC_CHAT_MEMBER_COUNT_CHANGE
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_MEMBER_COUNT_CHANGE] = {
        processor: onPublicChatMemberCountChange,
    };

    // PACKET TYPE(1016) : PUBLIC_CHAT_MEMBER_COUNT_CHANGE_CONFIRMATION
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_MEMBER_COUNT_CHANGE_CONFIRMATION] = {
        processor: function onPublicChatMemberCountChangeConfirmation() {},
    };

    // PACKET TYPE(1017) : PUBLIC_CHAT_ROOM_LIST_REQUEST
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST_REQUEST] = {
        processor: function onPublicChatRoomListRequest() {},
    };

    // PACKET TYPE(1018) : PUBLIC_CHAT_ROOM_LIST_SEARCH_REQUEST
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST_SEARCH_REQUEST] = {
        processor: function onPublicChatRoomListSearchRequest() {},
    };

    // PACKET TYPE(1019) : PUBLIC_CHAT_ROOM_LIST_REQUEST_CONFIRMATION
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST_REQUEST_CONFIRMATION] = {
        processor: function onPublicChatRoomListRequestConfirmation() {},
    };

    // PACKET TYPE(1020) : PUBLIC_CHAT_ROOM_LIST
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST] = {
        processor: onPublicChatRoomList,
    };

    // PACKET TYPE(1021) : PUBLIC_CHAT_GET_ROOM_IPPORT
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_GET_ROOM_IPPORT] = {
        processor: function onPublicChatGetRoomIpport() {},
    };

    // PACKET TYPE(1022) : PUBLIC_CHAT_ROOM_IPPORT_CONFIRMATION
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_ROOM_IPPORT_CONFIRMATION] = {
        processor: onPublicChatRoomIpportConfirmation,
    };

    // PACKET TYPE(1023) : PUBLIC_CHAT_ROOM_INFORMATION_REQUEST
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_ROOM_INFORMATION_REQUEST] = {
        processor: function onPublicChatRoomInformationRequest() {},
    };

    // PACKET TYPE(1024) : PUBLIC_CHAT_ROOM_INFORMATION
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_ROOM_INFORMATION] = {
        processor: onPublicChatRoomInformation,
    };

    // PACKET TYPE(1025) : PUBLIC_CHAT_GET_HISTORY
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_GET_HISTORY] = {
        processor: function onPublicChatGetHistory() {},
    };

    // PACKET TYPE(1026) : PUBLIC_CHAT_GET_HISTORY_CONFIRMATION
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_GET_HISTORY_CONFIRMATION] = {
        processor: function onPublicChatGetHistoryConfirmation() {},
    };

    // PACKET TYPE(1027) : PUBLIC_CHAT_HISTORY_MESSAGE_LIST
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_HISTORY_MESSAGE_LIST] = {
        processor: onPublicChatHistoryMessageList,
    };

    // PACKET TYPE(1028) : PUBLIC_CHAT_ROOM_LIST_WITH_HISTORY_REQUEST
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST_WITH_HISTORY_REQUEST] = {
        processor: function onPublicChatRoomListWithHistoryRequest() {},
    };

    // PACKET TYPE(1029) : PUBLIC_CHAT_ROOM_LIST_WITH_HISTORY
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST_WITH_HISTORY] = {
        processor: onPublicChatRoomListWithHistory,
    };

    // PACKET TYPE(1034) : PUBLIC_CHAT_DELETE_MESSAGE
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_DELETE_MESSAGE] = {
        processor: onPublicChatDeleteMessage,
    };

    // PACKET TYPE(1035) : PUBLIC_CHAT_DELETE_MESSAGE_CONFIRMATION
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_DELETE_MESSAGE_CONFIRMATION] = {
        processor: function onPublicChatDeleteMessageConfirmation() {},
    };

    // PACKET TYPE(1036) : PUBLIC_CHAT_LIKE_A_MESSAGE
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_LIKE_A_MESSAGE] = {
        processor: onPublicChatLikeAMessage,
    };

    // PACKET TYPE(1037) : PUBLIC_CHAT_UNLIKE_A_MESSAGE
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_UNLIKE_A_MESSAGE] = {
        processor: onPublicChatUnlikeAMessage,
    };

    // PACKET TYPE(1038) : PUBLIC_CHAT_LIKE_UNLIKE_MESSAGE_CONFIRMATION
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_LIKE_UNLIKE_MESSAGE_CONFIRMATION] = {
        processor: function onPublicChatLikeUnlikeMessageConfirmatio() {},
    };

    // PACKET TYPE(1039) : PUBLIC_CHAT_REPORT_A_MESSAGE
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_REPORT_A_MESSAGE] = {
        processor: onPublicChatReportAMessage,
    };

    // PACKET TYPE(1040) : PUBLIC_CHAT_REPORT_A_MESSAGE_CONFIRMATION
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_REPORT_A_MESSAGE_CONFIRMATION] = {
        processor: function onPublicChatReportAMessageConfirmation() {},
    };

    // PACKET TYPE(1042) : PUBLIC_CHAT_LIKE_MEMBER_LIST
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_LIKE_MEMBER_LIST] = {
        processor: onPublicChatLikeMemberList,
    };

    // PACKET TYPE(1044) : PUBLIC_CHAT_CATEGORY_LIST
    responseMethodMap[PACKET_TYPES.PUBLIC_CHAT_CATEGORY_LIST] = {
        processor: onPublicChatCategoryList,
    };

    global.CHAT_APP.PublicChatResponses = {
        processUpdates: processUpdates,
    };
})(window);
