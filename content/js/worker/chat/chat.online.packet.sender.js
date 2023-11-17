(function chatOnlinePacketSenderIIFE(global) {
    var CHAT_APP = global.CHAT_APP,
        CHAT_PACKET_INFO = CHAT_APP.PacketFormats.CHAT_PACKET_INFO,
        Constants = CHAT_APP.Constants,
        GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS,
        CHAT_SESSION = CHAT_APP.CHAT_SESSION,
        ChatConnector = CHAT_APP.ChatConnector,
        ChatRequests = CHAT_APP.ChatRequests,
        ChatPacketSender = CHAT_APP.ChatPacketSender,
        TEMPORARY_MESSAGES_CACHE = CHAT_APP.TEMPORARY_MESSAGES_CACHE,
        CHAT_STATE_INFO = Constants.CHAT_STATE_INFO,
        CHAT_STATES = Constants.CHAT_STATES,
        ChatOfflinePacketSender = CHAT_APP.ChatOfflinePacketSender,
        AuthRequests = CHAT_APP.AuthRequests,
        PACKET_TYPES = Constants.PACKET_TYPES,
        TAGS = CHAT_APP.TAGS,
        AUTH_REQUEST_TYPE = Constants.AUTH_REQUEST_TYPE,
        ResponseHelpers = CHAT_APP.ResponseHelpers,
        sendChatRequestResponseToMainApp = ResponseHelpers.sendChatRequestResponseToMainApp;

    function _doPacketHasConfirmation(packetType) {
        try {
            return CHAT_PACKET_INFO[packetType].CONFIRMATION;
        } catch (e) {
            Logger.debug('alert', 'Invalid Packet Type in _doPacketHasConfirmation check', 'CHAT');
            return false;
        }
    }


    function _getChatStateName(stateNo) {
        try {
            return CHAT_STATE_INFO[stateNo].NAME;
        } catch (e) {
            return '';
        }
    }


    function isTagChatPacket(requestObject) {
        return !!requestObject.tagId;
    }

    function isPublicChatPacket(requestObject) {
        return !!requestObject.roomId;
    }


    function logSendMessageStateChange(currentState, object, previousState) {
        var currentStateName,
            prevStateName;
        if (currentState === previousState) {
            return;
        }

        currentStateName = _getChatStateName(currentState);
        if (!previousState) {
            Logger.debug('debug', currentStateName, JSON.stringify(object), 'CHAT');
        } else {
            prevStateName = _getChatStateName(previousState);
            Logger.debug('debug', prevStateName, ' -> ', currentStateName, JSON.stringify(object), 'CHAT');
        }
    }

    //     function _getSession(requestObject) {
    //         var boxId = Helper.getBoxId(requestObject),
    //             sessionInfo = CHAT_SESSION.get(boxId);
    //         return sessionInfo;
    //     }

    function _isRegisterPacket(requestObject) {
        var packetType = requestObject.packetType;

        if (packetType === PACKET_TYPES.FRIEND_CHAT_REGISTER
                || packetType === PACKET_TYPES.TAG_CHAT_TAG_REGISTER
                || packetType === PACKET_TYPES.PUBLIC_CHAT_REGISTER) {
            return true;
        }
        return false;
    }

    function injectSessionInRequestObject(requestObject, sessionInfo) {
        requestObject.ip = sessionInfo.ip;
        requestObject.port = sessionInfo.bindingPort;

        return requestObject;
    }

    function injectSessionRegisterIpPortInRequestObject(requestObject, sessionInfo) {
        requestObject.ip = sessionInfo.ip;
        requestObject.port = sessionInfo.registerPort;

        return requestObject;
    }

    function _refreshSession(boxId, isTagChat, isPublicChat, forceRefresh) {
        var aTag,
            utIds,
            requestObject;

        if (isTagChat) {
            aTag = TAGS.get(boxId);
            if (aTag) {
                utIds = aTag.memberUtIds;
                CHAT_APP.Helpers.startChatSession(boxId, GENERAL_CONSTANTS.SESSION_TYPES.TAG, utIds, forceRefresh);
            } else {
                Logger.debug('information', 'W: No Tag Info found. Requesting for Tag Info', 'CHAT');
                requestObject = ChatRequests.getOfflineGetTagInformationWithMembersObject(boxId);
                ChatConnector.request(requestObject).then(function requestObjectHandler(response) {
                    if (response.sucs) {
                        setTimeout(function setTimeoutHandler() {
                            if (TAGS.get(boxId)) {
                                _refreshSession(boxId, isTagChat, isPublicChat, forceRefresh);
                            }
                        });
                    }
                });
            }
        } else if (isPublicChat) {
            CHAT_APP.Helpers.startChatSession(boxId, GENERAL_CONSTANTS.SESSION_TYPES.ROOM, {}, forceRefresh);
        } else {
            CHAT_APP.Helpers.startChatSession(boxId, GENERAL_CONSTANTS.SESSION_TYPES.FRIEND, {}, forceRefresh);
        }
    }

    function _saveTemporaryMessage(boxId, meessageObject, requestResolver) {
        var tempMessages = TEMPORARY_MESSAGES_CACHE.get(boxId);
        if (!tempMessages) {
            tempMessages = [];
        }

        meessageObject.resolver = requestResolver;

        tempMessages.push(meessageObject);
        TEMPORARY_MESSAGES_CACHE.set(boxId, tempMessages);
        REQUEST_CACHE.deleteChatCache(meessageObject.packetId, meessageObject);
    }

    function _rawSend(_requestObject, boxId) {
        var sessionInfo,
            requestObject;

        if (!!CHAT_SESSION.valid(boxId)) {
            sessionInfo = CHAT_SESSION.get(boxId);
            requestObject = injectSessionInRequestObject(_requestObject, sessionInfo);

            // if( requestObject.packetType == 4){
            //     Logger.debug('information', 'IDLE PACKET SENDING', requestObject, 'CHAT');
            // }

            ChatPacketSender.rawSend(requestObject);
        }
    }

    function chatOfflinePacketSenderFailureHandler(_requestObject, requestResolver) {
        var requestObject = _requestObject;

        requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_FAILED;
        requestObject.sucs = false;
        requestObject.msg = 'OFFLINE IP PORT UPDATE FAILED.';
        sendChatRequestResponseToMainApp(requestObject);

        if (requestResolver) {
            requestResolver({
                sucs: false,
                packetId: requestObject.packetId,
                sendState: requestObject.sendState,
            });
        }
    }


    function _doOfflineIpPortRefreshAndSendAgain(requestObject, retryCount, requestResolver) {
        var offlineIpPortRefreshRequestObject = AuthRequests.getOfflineIpPort();

        CHAT_APP.AuthConnector.request(offlineIpPortRefreshRequestObject)
            .then(function authRequestSuccessHandler() {
                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.SECOND_OFFLINE;

                ChatOfflinePacketSender.request(requestObject, retryCount)
                    .then(function ChatRequestSuccessHandler(response) {
                        requestResolver(response);
                    }, function chatRequestFailureHandler() {
                        chatOfflinePacketSenderFailureHandler(requestObject, requestResolver);
                    });
            }, function authRequestFailureHandler() {
                chatOfflinePacketSenderFailureHandler(requestObject, requestResolver);
            });
    }

    function _doOnlineIpPortRefreshAndSendAgain(requestObject, boxId, isTagChat, isPublicChat, requestResolver) {
        _saveTemporaryMessage(boxId, requestObject, requestResolver);
        _refreshSession(boxId, isTagChat, isPublicChat, true);
    }

    function _doPresenceRefreshAndSendAgain(requestObject, boxId, isTagChat, isPublicChat, requestResolver) {
        var presenceRequestObject = AuthRequests.getFriendPresenceObject(requestObject.userId);
        presenceRequestObject.requestType = AUTH_REQUEST_TYPE.REQUEST;
        CHAT_APP.AuthConnector.request(presenceRequestObject).then(function AuthConnectorRequestSuccesHandler(response) {
            var previousState = requestObject.sendState;

            if (!!response.sucs && response.psnc === GENERAL_CONSTANTS.USER_PRESENCE.ONLINE) {
                // online

                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.SECOND_ONLINE;
                _send(requestObject, 'request', 5, true).then(function packetSendSuccessHandler(_response) {
                    requestResolver(_response);
                });
            } else {
                // sucs false

                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE;
                ChatOfflinePacketSender.request(requestObject).then(function chatOfflinePacketSenderSuccessHandler(_response) {
                    requestResolver(_response);
                });
            }

            logSendMessageStateChange(requestObject.sendState, requestObject, previousState);
        }, function AuthConnectorRequestFailureHandler() {
            var previousState = requestObject.sendState;

            requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REFRESH;

            _saveTemporaryMessage(boxId, requestObject, requestResolver);
            _refreshSession(boxId, isTagChat, isPublicChat);

            logSendMessageStateChange(requestObject.sendState, requestObject, previousState);
        });
    }

    function _sendRegsiterPacket(boxId, _requestObject, retryCount, needPromise, resolver) {
        var sessionInfo = CHAT_SESSION.get(boxId),
            requestObject;

        if (!!sessionInfo) {
            requestObject = injectSessionRegisterIpPortInRequestObject(_requestObject, sessionInfo);

            if (needPromise) {
                ChatPacketSender.request(requestObject, retryCount).then(function packetSenderSuccessHandler(response) {
                    resolver({
                        sucs: response.sucs,
                        packetId: requestObject.packetId,
                        packetType: requestObject.packetType,
                    });
                });
            } else {
                ChatPacketSender.send(requestObject, retryCount);
            }
        }
    }

    function _send(_requestObject, type, retryCount, needPromise) {
        var returnPromise = new RgPromise(function PromiseHandler(resolve) {
            var boxId = CHAT_APP.Helpers.getBoxId(_requestObject),
                isTagChat = isTagChatPacket(_requestObject),
                isPublicChat = isPublicChatPacket(_requestObject),
                isRegisterPacket = _isRegisterPacket(_requestObject),
                requestObject = _requestObject,
                previousState,
                resolveObject,
                requestResponseObject,
                sessionInfo;

            if (isRegisterPacket) {
                _sendRegsiterPacket(boxId, requestObject, retryCount, needPromise, resolve);
            } else {
                if (!CHAT_SESSION.valid(boxId)) {
                    if (!_doPacketHasConfirmation(requestObject.packetType)) {
                        requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE;

                        ChatOfflinePacketSender.request(requestObject, retryCount)
                            .then(function chatOfflinePacketSenderSuccessHandler(response) {
                                if (resolve) {
                                    resolve(response);
                                }

                                if (response.sucs) {
                                    logSendMessageStateChange(CHAT_STATES.MESSAGE_SENDING.OFFLINE_SUCCESS, requestObject, requestObject.sendState);
                                } else {
                                    logSendMessageStateChange(CHAT_STATES.MESSAGE_SENDING.FAILED, requestObject, requestObject.sendState);
                                }
                            });
                    } else {
                        requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REQUEST;
                        // Session don't exists
                        _saveTemporaryMessage(boxId, requestObject, resolve);
                        _refreshSession(boxId, isTagChat, isPublicChat);
                    }
                } else {
                    // Session exists
                    sessionInfo = CHAT_SESSION.get(boxId);

                    requestObject = injectSessionInRequestObject(requestObject, sessionInfo);

                    if (!requestObject.sendState) {
                        requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_ONLINE;
                    }

                    logSendMessageStateChange(requestObject.sendState, requestObject);

                    ChatPacketSender.request(requestObject, retryCount).then(function ChatPacketSenderHandler(response) {
                        if (response.sucs) {
                            previousState = requestObject.sendState;

                            switch (requestObject.sendState) {

                                case CHAT_STATES.MESSAGE_SENDING.FIRST_ONLINE:
                                case CHAT_STATES.MESSAGE_SENDING.SECOND_ONLINE:
                                case CHAT_STATES.MESSAGE_SENDING.THIRD_ONLINE:

                                    requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_SUCCESS;
                                    break;

                                case CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE:
                                case CHAT_STATES.MESSAGE_SENDING.SECOND_OFFLINE:
                                    requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_SUCCESS;
                                    break;
                                default:
                                    break;
                            }

                            if (needPromise) {
                                resolve({
                                    sucs: true,
                                    update: false,
                                    packetId: requestObject.packetId,
                                    sendState: requestObject.sendState,
                                });
                            }

                            logSendMessageStateChange(requestObject.sendState, requestObject, previousState);
                        }
                    }).catch(function ChatPacketSenderFailureHandler() {
                        previousState = requestObject.sendState;

                        switch (requestObject.sendState) {

                            case CHAT_STATES.MESSAGE_SENDING.FIRST_ONLINE:

                                if (isTagChat || isPublicChat) {
                                    requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REFRESH;
                                    _doOnlineIpPortRefreshAndSendAgain(requestObject, boxId, isTagChat, isPublicChat, resolve);
                                } else {
                                    requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.PRESENCE_REFRESH;
                                    _doPresenceRefreshAndSendAgain(requestObject, boxId, isTagChat, isPublicChat, resolve);
                                }

                                break;

                            case CHAT_STATES.MESSAGE_SENDING.SECOND_ONLINE:

                                if (isTagChat || isPublicChat) {
                                    requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_FAILED;

                                    resolveObject = {
                                        sucs: false,
                                        packetId: requestObject.packetId,
                                        sendState: requestObject.sendState,
                                    };

                                    requestObject.resolver(resolveObject);
                                    resolve(resolveObject);

                                    requestResponseObject = Object.assign({}, requestObject);
                                    requestResponseObject.resolver = null;
                                    requestResponseObject.sucs = false;

                                    sendChatRequestResponseToMainApp(requestResponseObject);
                                } else {
                                    requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REFRESH;

                                    _saveTemporaryMessage(boxId, requestObject, resolve);
                                    _refreshSession(boxId, isTagChat, isPublicChat, true);
                                }
                                break;

                            case CHAT_STATES.MESSAGE_SENDING.THIRD_ONLINE:

                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE;
                                ChatOfflinePacketSender.request(requestObject, retryCount)
                                    .then(function ChatOfflinePacketSenderSuccessHandler(response) {
                                        if (needPromise) {
                                            resolve(response);
                                        }
                                    });

                                break;

                            case CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE:

                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_IP_PORT_REFRESH;
                                _doOfflineIpPortRefreshAndSendAgain(requestObject, retryCount, resolve);

                                break;

                            case CHAT_STATES.MESSAGE_SENDING.SECOND_OFFLINE:

                                requestObject.sendState = CHAT_STATES.MESSAGE_SENDING.OFFLINE_FAILED;

                                requestObject.sucs = false;
                                sendChatRequestResponseToMainApp(requestObject);

                                resolve({
                                    sucs: false,
                                    packetId: requestObject.packetId,
                                    sendState: requestObject.sendState,
                                });
                                break;

                            default:
                                break;
                        }


                        logSendMessageStateChange(requestObject.sendState, requestObject, previousState);
                    });
                }
            }
        });

        if (needPromise) {
            return returnPromise;
        }
        return {};
    }

    function _request(requestObject, type, retryCount) {
        return _send(requestObject, type, retryCount, true);
    }

    global.CHAT_APP.ChatOnlinePacketSender = {
        rawSend: _rawSend,
        send: _send,
        request: _request,

        isTagChatPacket: isTagChatPacket,
        isPublicChatPacket: isPublicChatPacket,
        logSendMessageStateChange: logSendMessageStateChange,
        doOfflineIpPortRefreshAndSendAgain: _doOfflineIpPortRefreshAndSendAgain,
    };
})(self);
