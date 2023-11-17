(function authRequests(global) {
    'use strict';
    // For Main App global == window
    // For Worker global == self
    // Dependencies
    // - app/chat/shared/chat.constants.js

    var CHAT_APP = global.CHAT_APP,
        AUTH_REQUEST_TYPE = CHAT_APP.Constants.AUTH_REQUEST_TYPE,
        getCurrentUserId = CHAT_APP.getCurrentUserId;

    function AuthRequests() {
        // var REQUEST_TYPE = CHAT_APP.Constants.AUTH_REQUEST_TYPE;
        var AUTH_SERVER_ACTIONS = CHAT_APP.Constants.AUTH_SERVER_ACTIONS;

        // ACTION ID(134) : START_TAG_CHAT
        this.getTagChatRegisterIpPort = function getTagChatRegisterIpPort(tagId, utIds, packetId) {
            var requestObject = {
                actn: AUTH_SERVER_ACTIONS.START_TAG_CHAT,
                tid: tagId,
                futIds: utIds,
            };

            if (!!packetId) {
                requestObject.pckId = packetId;
            }

            return requestObject;
        };

        // ACTION ID(175) : START_F2F_CHAT
        this.getFriendChatRegisterIpPort = function getFriendChatRegisterIpPort(friendUtId, packetId) {
            var requestObject = {
                actn: AUTH_SERVER_ACTIONS.START_F2F_CHAT,
                futId: parseInt(friendUtId, 10),
                uId: getCurrentUserId(),
            };

            if (!!packetId) {
                requestObject.pckId = packetId;
            }

            return requestObject;
        };


        // ACTION ID(135) : ADD_TAG_CHAT_MEMBERS
        this.getTagChatMembersAddObject = function getTagChatMembersAddObject(tagId, utIds, registerIp, registerPort, packetId) {
            var requestObject = {

                actn: AUTH_SERVER_ACTIONS.ADD_TAG_CHAT_MEMBERS,
                tid: tagId,
                futIds: utIds,
                chIp: registerIp,
                chRp: registerPort,
            };

            if (!!packetId) {
                requestObject.pckId = packetId;
            }

            return requestObject;
        };

        // ACTION ID(83) : GET_OFFLINE_IP_PORT
        this.getOfflineIpPort = function getOfflineIpPort(packetId) {
            var requestObject = {
                actn: AUTH_SERVER_ACTIONS.GET_OFFLINE_IP_PORT,
                requestType: AUTH_REQUEST_TYPE.REQUEST,
            };

            if (!!packetId) {
                requestObject.pckId = packetId;
            }

            return requestObject;
        };


        // ACTION ID(199) : GET_FRIEND_PRESENCE
        this.getFriendPresenceObject = function getFriendPresenceObject(friendUtId) {
            var requestObject = {
                actn: AUTH_SERVER_ACTIONS.GET_USER_MOOD_PRESENCE,
                futId: friendUtId,
            };

            return requestObject;
        };
    }
    global.CHAT_APP.AuthRequests = new AuthRequests();
})(window);
