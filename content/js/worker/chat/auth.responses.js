(function authResposnesIIFE(global) {
    // For Main App global == window
    // For Worker global == self

    var Constants = CHAT_APP.Constants,
        GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS,
        USER_PRESENCE = Constants.GENERAL_CONSTANTS.USER_PRESENCE,
        CHAT_SESSION = CHAT_APP.CHAT_SESSION,
        REQUEST_CACHE = CHAT_APP.REQUEST_CACHE,
        RESPONSE_CACHE = CHAT_APP.RESPONSE_CACHE,
        AUTH_SERVER_ACTIONS = Constants.AUTH_SERVER_ACTIONS,
        SESSION_OBJECT = CHAT_APP.MODELS.SESSION_OBJECT,
        CHAT_SERVER_TYPES = CHAT_APP.Constants.CHAT_SERVER_TYPES,
        ChatRequests = CHAT_APP.ChatRequests,
        ChatConnector = CHAT_APP.ChatConnector,
        TAGS = CHAT_APP.TAGS,
        Helpers = CHAT_APP.Helpers,
        RequestHelpers = CHAT_APP.RequestHelpers,
        getChatBlankMessageObject = CHAT_APP.Helpers.getChatBlankMessageObject,
        AUTH_SERVER_REQUEST_UPDATE_MAP = Constants.AUTH_SERVER_REQUEST_UPDATE_MAP,
        responseMethodMap = {};

    function getPacketProcessorInfo(actionId) {
        return responseMethodMap[actionId];
    }

    function checkForDuplicateOrSelfRequest(responseObject) {
        var boxId;
        if (!!responseObject.duplicate) return true;

        boxId = responseObject.futId || responseObject.tid || responseObject.rid || 0;

        /* Self Request */
        if (REQUEST_CACHE.existsForAuth(boxId, AUTH_SERVER_REQUEST_UPDATE_MAP[responseObject.actn])) {
            Logger.debug('warning', 'Self Request Response, Skipping Response', responseObject.actn, 'CHAT');
            return true;
        }

        /* Duplicate Response */
        if (RESPONSE_CACHE.existsForAuth(boxId, responseObject.actn)) {
            Logger.debug('warning', 'Duplicate Response, Skipping Response', responseObject.actn, 'CHAT');
            return true;
        }

        RESPONSE_CACHE.setAuthCache(boxId, responseObject.actn, true);

        return false;
    }

    function processUpdates(responseObject) {
        var actionId,
            packetProcessorInfo;

        if (responseObject.rc === 1111) {
            Logger.debug('alert', 'W: Auth Request Failed', responseObject, 'CHAT');
            return false;
        }

        if (checkForDuplicateOrSelfRequest(responseObject)) {
            return false;
        }

        actionId = responseObject.actn;
        packetProcessorInfo = getPacketProcessorInfo(actionId);

        if (!packetProcessorInfo) {
            Logger.debug('warning', 'W: Packet Processor Not Implemented. Response', responseObject, 'CHAT');
            return false;
        }

        try {
            packetProcessorInfo.processor.call(this, responseObject);
        } catch (e) {
            Logger.debug('alert', 'W: Exception In PACKET Procsessing.', actionId, e, 'CHAT');
        }

        return true;
    }


    // PACKET TYPE(334) : RECEIVED_TAG_CHAT
    function onReceivedTagChat(responseObject) {
        /* method body */
        var boxId,
            aSssionObject,
            aTagObject,
            requestObject,
            registerObject;

        Logger.debug('debug', 'W: Received RECEIVED_TAG_CHAT', responseObject, 'CHAT');

        if (!!responseObject.sucs) {
            boxId = responseObject.tid;
            aSssionObject = CHAT_SESSION.get(boxId);

            if (!aSssionObject) {
                aSssionObject = new SESSION_OBJECT(
                    boxId, GENERAL_CONSTANTS.SESSION_TYPES.TAG,
                    responseObject.chIp, parseInt(responseObject.chRp, 10), 0, responseObject.tm);

                CHAT_SESSION.set(boxId, aSssionObject);
            } else {
                aSssionObject.update(responseObject.chIp, parseInt(responseObject.chRp, 10), 0, responseObject.tm);
            }


            registerObject = ChatRequests.getTagChatTagRegisterObject(boxId);
            ChatConnector.request(registerObject, CHAT_SERVER_TYPES.ONLINE).then(function afterRegisterSuccessHandler() {
                // Notify App that connection is established
            });

            aTagObject = TAGS.get(boxId);
            if (!aTagObject) {
                requestObject = ChatRequests.getOfflineGetTagInformationWithMembersObject(boxId);
                ChatConnector.send(requestObject);
            }

            delete responseObject.chIp;
            delete responseObject.chRp;

            Helpers.sendAuthResponseToMainApp(responseObject);
        }
    }

    // PACKET TYPE(335) : TAG_CHAT_UPDATE_ADD_MEMBER
    function onReceivedTagMemeberAdd(responseObject) {
        /* method body */

        Logger.debug('debug', 'W: Received TAG_CHAT_UPDATE_ADD_MEMBER ', responseObject, 'CHAT');

        Helpers.sendAuthResponseToMainApp(responseObject);
    }

    // PACKET TYPE(375) : RECEIVED_F2F_CHAT
    function onReceivedF2FChat(responseObject) {
        /* method body */
        var friendId,
            chatSessionObject,
            requestObject,
            registerObject,
            userPresence,
            chatIp,
            chatRp,
            boxId;

        Logger.debug('debug', 'W: Received RECEIVED_F2F_CHAT', responseObject, 'CHAT');

        friendId = responseObject.futId;
        boxId = friendId;
        userPresence = parseInt(responseObject.psnc, 10);
        chatIp = responseObject.chIp;
        chatRp = parseInt(responseObject.chRp, 10);

        if (responseObject.sucs === true && userPresence === USER_PRESENCE.ONLINE) {
            // if this sucs is false then user is not logged in with whom user is trying to chat
            chatSessionObject = CHAT_SESSION.get(boxId);

            if (!chatSessionObject) {
                chatSessionObject = new SESSION_OBJECT(boxId, GENERAL_CONSTANTS.SESSION_TYPES.FRIEND,
                    chatIp, chatRp, 0, responseObject.tm
                );
                CHAT_SESSION.set(boxId, chatSessionObject);
            } else {
                chatSessionObject.update(chatIp, chatRp, 0, responseObject.tm);
            }

            registerObject = ChatRequests.getFriendChatRegisterObject(boxId);
            ChatConnector.send(registerObject, CHAT_SERVER_TYPES.ONLINE);
        } else {
            // when responseObject.sucs !== true
            // if the user isn't logged in with whom user is trying to chat
            if (responseObject.rc === 1) {
                // this is the case where user is blocked(either by him or by friend), permission is denied
            } else {
                if (userPresence === USER_PRESENCE.OFFLINE || userPresence === USER_PRESENCE.AWAY) {
                    requestObject = getChatBlankMessageObject(boxId);
                    ChatConnector.send(requestObject, CHAT_SERVER_TYPES.OFFLINE);
                }

                RequestHelpers.sendTemporaryMessages(boxId, true);
            }
        }

        delete responseObject.chIp;
        delete responseObject.chRp;

        Helpers.sendAuthResponseToMainApp(responseObject);
    }

    function onReceivedOfflineIpPort(responseObject) {
        responseObject.fromWorker = true;
        Helpers.sendAuthResponseToMainApp(responseObject);
        if (!!responseObject.oIP && !!responseObject.oPrt) {
            CHAT_APP.setOfflineIp(responseObject.oIP);
            CHAT_APP.setOfflinePort(responseObject.oPrt);
        } else {
            RingLogger.alert('Response Object do not have offline ip port', 'CHAT');
        }
    }


    // PACKET TYPE(175) : START_F2F_CHAT
    function onReceivedStartF2FChat(responseObject) {
        /* method body */
        Logger.debug('debug', 'W: Received START_F2F_CHAT', responseObject, 'CHAT');

        onReceivedF2FChat(responseObject);
    }

    // PACKET TYPE(134) : START_TAG_CHAT
    function onReceivedStartTagChat(responseObject) {
        Logger.debug('debug', 'W: Received Auth START_TAG_CHAT', responseObject, 'CHAT');

        onReceivedTagChat(responseObject);
    }

    // PACKET TYPE(199) : GET_USER_MOOD_PRESENCE
    function onReceivedFriendMoodPresence(responseObject) {
        Logger.debug('debug', 'W: Received Auth USER_MOOD_PRESENCE', responseObject, 'CHAT');

        Helpers.sendAuthResponseToMainApp(responseObject);
    }

    // PACKET TYPE(83) : GET_OFFLINE_IP_PORT
    responseMethodMap[AUTH_SERVER_ACTIONS.GET_OFFLINE_IP_PORT] = {
        processor: onReceivedOfflineIpPort,
    };

    // PACKET TYPE(175) : START_F2F_CHAT
    responseMethodMap[AUTH_SERVER_ACTIONS.START_F2F_CHAT] = {
        processor: onReceivedStartF2FChat,
    };

    // PACKET TYPE(199) : GET_USER_MOOD_PRESENCE
    responseMethodMap[AUTH_SERVER_ACTIONS.GET_USER_MOOD_PRESENCE] = {
        processor: onReceivedFriendMoodPresence,
    };

    // PACKET TYPE(134) : START_TAG_CHAT
    responseMethodMap[AUTH_SERVER_ACTIONS.START_TAG_CHAT] = {
        processor: onReceivedStartTagChat,
    };


    // PACKET TYPE(334) : RECEIVED_TAG_CHAT
    responseMethodMap[AUTH_SERVER_ACTIONS.RECEIVED_TAG_CHAT] = {
        processor: onReceivedTagChat,
    };

    // PACKET TYPE(335) : TAG_CHAT_UPDATE_ADD_MEMBER
    responseMethodMap[AUTH_SERVER_ACTIONS.ADD_TAG_CHAT_MEMBERS] = {
        processor: onReceivedTagMemeberAdd,
    };

    // PACKET TYPE(375) : RECEIVED_F2F_CHAT
    responseMethodMap[AUTH_SERVER_ACTIONS.RECEIVED_F2F_CHAT] = {
        processor: onReceivedF2FChat,
    };


    global.CHAT_APP.AuthResponses = {
        processUpdates: processUpdates,
    };
})(window);
