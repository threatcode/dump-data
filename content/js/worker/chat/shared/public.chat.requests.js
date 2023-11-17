(function publicChatRequests(global) {
    'use strict';
    // For Main App global == window
    // For Worker global == self

    function PublicChatRequests() {
        var PACKET_TYPES = global.CHAT_APP.Constants.PACKET_TYPES,
            platform = global.CHAT_APP.Constants.PLATFORM.WEB,
            getAppVersion = global.CHAT_APP.getAppVersion,
            getCurrentUserId = global.CHAT_APP.getCurrentUserId,
            getUUIDPacketId = global.CHAT_APP.UTILS.getUUIDPacketId;


        // PACKET TYPE(1001) : PUBLIC_CHAT_REGISTER
        this.getPublicChatRegisterObject = function getPublicChatRegisterObject(roomId, fullName, memberUrl, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_REGISTER,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                fullName: fullName,
                memberUrl: memberUrl,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1002) : PUBLIC_CHAT_UNREGISTER
        this.getPublicChatUnregisterObject = function getPublicChatUnregisterObject(roomId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_UNREGISTER,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1003) : PUBLIC_CHAT_REGISTER_CONFIRMATION
        this.getPublicChatRegisterConfirmationObject = function getPublicChatRegisterConfirmationObject(roomId, chatBindingPort, shadowId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_REGISTER_CONFIRMATION,

                /* SPECIFIC PARAMS */
                roomId: roomId,
                chatBindingPort: chatBindingPort,
                shadowId: shadowId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1004) : PUBLIC_CHAT_CHAT_IDEL
        this.getPublicChatChatIdelObject = function getPublicChatChatIdelObject(roomId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_CHAT_IDEL,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                platform: platform,

            };

            return requestObject;
        };

        // PACKET TYPE(1005) : PUBLIC_CHAT_CHAT_MESSAGE_TYPING
        this.getPublicChatChatMessageTypingObject = function getPublicChatChatMessageTypingObject(roomId, fullName) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_TYPING,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                platform: platform,
                fullName: fullName,

            };

            return requestObject;
        };

        // PACKET TYPE(1006) : PUBLIC_CHAT_CHAT_MESSAGE
        this.getPublicChatChatMessageObject = function getPublicChatChatMessageObject(
            roomId, messageType, message, messageDate, fullName, memberUrl, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                messageType: messageType,
                message: message,
                messageDate: messageDate,
                fullName: fullName,
                memberUrl: memberUrl,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1007) : PUBLIC_CHAT_CHAT_MESSAGE_EDIT
        this.getPublicChatChatMessageEditObject = function getPublicChatChatMessageEditObject(
            roomId, messageType, message, messageDate, fullName, memberUrl, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_EDIT,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                messageType: messageType,
                message: message,
                messageDate: messageDate,
                fullName: fullName,
                memberUrl: memberUrl,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1008) : PUBLIC_CHAT_CHAT_MESSAGE_BROKEN
        this.getPublicChatChatMessageBrokenObject = function getPublicChatChatMessageBrokenObject(
            roomId, sequenceNo, messageType, message, messageDate, fullName, memberUrl, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_BROKEN,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                sequenceNo: sequenceNo,
                messageType: messageType,
                message: message,
                messageDate: messageDate,
                fullName: fullName,
                memberUrl: memberUrl,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1009) : PUBLIC_CHAT_CHAT_MESSAGE_BROKEN_EDIT
        this.getPublicChatChatMessageBrokenEditObject = function getPublicChatChatMessageBrokenEditObject(
            roomId, sequenceNo, messageType, message, messageDate, fullName, memberUrl, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_BROKEN_EDIT,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                sequenceNo: sequenceNo,
                messageType: messageType,
                message: message,
                messageDate: messageDate,
                fullName: fullName,
                memberUrl: memberUrl,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1010) : PUBLIC_CHAT_CHAT_MESSAGE_DELIVERED
        this.getPublicChatChatMessageDeliveredObject = function getPublicChatChatMessageDeliveredObject(roomId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_DELIVERED,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1011) : PUBLIC_CHAT_CHAT_MESSAGE_SENT
        this.getPublicChatChatMessageSentObject = function getPublicChatChatMessageSentObject(roomId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_SENT,

                /* SPECIFIC PARAMS */
                roomId: roomId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1012) : PUBLIC_CHAT_GET_MEMBER_LIST
        this.getPublicChatGetMemberListObject = function getPublicChatGetMemberListObject(roomId, pagingState, pageLimit, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_GET_MEMBER_LIST,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                pagingState: pagingState,
                pageLimit: pageLimit,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1013) : PUBLIC_CHAT_MEMBER_LIST_CONFIRMATION
        this.getPublicChatMemberListConfirmationObject = function getPublicChatMemberListConfirmationObject(roomId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_MEMBER_LIST_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1014) : PUBLIC_CHAT_MEMBER_LIST
        this.getPublicChatMemberListObject = function getPublicChatMemberListObject(roomId, pagingState, members, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_MEMBER_LIST,

                /* SPECIFIC PARAMS */
                roomId: roomId,
                pagingState: pagingState,
                members: members,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1015) : PUBLIC_CHAT_MEMBER_COUNT_CHANGE
        this.getPublicChatMemberCountChangeObject = function getPublicChatMemberCountChangeObject(roomId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_MEMBER_COUNT_CHANGE,

                /* SPECIFIC PARAMS */
                roomId: roomId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1016) : PUBLIC_CHAT_MEMBER_COUNT_CHANGE_CONFIRMATION
        this.getPublicChatMemberCountChangeConfirmationObject = function getPublicChatMemberCountChangeConfirmationObject(roomId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_MEMBER_COUNT_CHANGE_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1017) : PUBLIC_CHAT_ROOM_LIST_REQUEST
        this.getPublicChatRoomListRequestObject = function getPublicChatRoomListRequestObject(startIndex, pageLimit, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST_REQUEST,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                startIndex: startIndex,
                pageLimit: pageLimit,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1018) : PUBLIC_CHAT_ROOM_LIST_SEARCH_REQUEST
        this.getPublicChatRoomListSearchRequestObject = function getPublicChatRoomListSearchRequestObject(startIndex, pageLimit,
                                                                                                          searchName, country, category, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST_SEARCH_REQUEST,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                startIndex: startIndex,
                pageLimit: pageLimit,
                searchName: searchName,
                country: country,
                category: category,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1019) : PUBLIC_CHAT_ROOM_LIST_REQUEST_CONFIRMATION
        this.getPublicChatRoomListRequestConfirmationObject = function getPublicChatRoomListRequestConfirmationObject(packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST_REQUEST_CONFIRMATION,

                /* SPECIFIC PARAMS */
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1020) : PUBLIC_CHAT_ROOM_LIST
        this.getPublicChatRoomListObject = function getPublicChatRoomListObject(noOfRoom, rooms, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST,

                /* SPECIFIC PARAMS */
                noOfRoom: noOfRoom,
                rooms: rooms,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1021) : PUBLIC_CHAT_GET_ROOM_IPPORT
        this.getPublicChatGetRoomIpportObject = function getPublicChatGetRoomIpportObject(roomId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_GET_ROOM_IPPORT,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1022) : PUBLIC_CHAT_ROOM_IPPORT_CONFIRMATION
        this.getPublicChatRoomIpportConfirmationObject = function getPublicChatRoomIpportConfirmationObject(
            roomId, serverIp, serverRegisterPort, noOfMember, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_ROOM_IPPORT_CONFIRMATION,

                /* SPECIFIC PARAMS */
                roomId: roomId,
                serverIp: serverIp,
                serverRegisterPort: serverRegisterPort,
                noOfMember: noOfMember,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1023) : PUBLIC_CHAT_ROOM_INFORMATION_REQUEST
        this.getPublicChatRoomInformationRequestObject = function getPublicChatRoomInformationRequestObject(roomId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_ROOM_INFORMATION_REQUEST,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1024) : PUBLIC_CHAT_ROOM_INFORMATION
        this.getPublicChatRoomInformationObject = function getPublicChatRoomInformationObject(roomId, roomName, roomUrl, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_ROOM_INFORMATION,

                /* SPECIFIC PARAMS */
                roomId: roomId,
                roomName: roomName,
                roomUrl: roomUrl,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };


        // PACKET TYPE(1025) : PUBLIC_CHAT_GET_HISTORY
        this.getPublicChatGetHistoryObject = function getPublicChatGetHistoryObject(roomId, month, year, pageDirection, limit, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_GET_HISTORY,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                month: month,
                year: year,
                pageDirection: pageDirection,
                pageLimit: limit,
                platform: platform,
                appVersion: getAppVersion(),
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };


       // PACKET TYPE(1026) : PUBLIC_CHAT_GET_HISTORY_CONFIRMATION
        this.getPublicChatGetHistoryConfirmationObject = function getPublicChatGetHistoryConfirmationObject(roomId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_GET_HISTORY_CONFIRMATION,

                /* SPECIFIC PARAMS */
                roomId: roomId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1027) : PUBLIC_CHAT_HISTORY_MESSAGE_LIST
        this.getPublicChatHistoryMessageListObject = function getPublicChatHistoryMessageListObject(roomId, messages, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_HISTORY_MESSAGE_LIST,

                /* SPECIFIC PARAMS */
                roomId: roomId,
                messages: messages,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1028) : PUBLIC_CHAT_ROOM_LIST_WITH_HISTORY_REQUEST
        this.getPublicChatRoomListWithHistoryRequestObject = function getPublicChatRoomListWithHistoryRequestObject(startIndex, pageLimit, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST_WITH_HISTORY_REQUEST,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                startIndex: startIndex,
                pageLimit: pageLimit,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1029) : PUBLIC_CHAT_ROOM_LIST_WITH_HISTORY
        this.getPublicChatRoomListWithHistoryObject = function getPublicChatRoomListWithHistoryObject(noOfRoom, rooms, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_ROOM_LIST_WITH_HISTORY,

                /* SPECIFIC PARAMS */
                noOfRoom: noOfRoom,
                rooms: rooms,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1030) : PUBLIC_CHAT_BROKEN_PACKET
        this.getPublicChatBrokenPacketObject = function getPublicChatBrokenPacketObject(roomId, sequenceNo, bytes, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_BROKEN_PACKET,

                /* SPECIFIC PARAMS */
                roomId: roomId,
                sequenceNo: sequenceNo,
                bytes: bytes,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1031) : PUBLIC_CHAT_BROKEN_CONFIRMATION
        this.getPublicChatBrokenConfirmationObject = function getPublicChatBrokenConfirmationObject(roomId, sequenceNo, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_BROKEN_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                sequenceNo: sequenceNo,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1032) : PUBLIC_CHAT_SHADOW_IDS_INFO_REQUEST
        this.getPublicChatShadowIdsInfoRequestObject = function getPublicChatShadowIdsInfoRequestObject(noOfIds, ids, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_SHADOW_IDS_INFO_REQUEST,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                noOfIds: noOfIds,
                ids: ids,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1033) : PUBLIC_CHAT_SHADOW_IDS_INFO_RESPONSE
        this.getPublicChatShadowIdsInfoResponseObject = function getPublicChatShadowIdsInfoResponseObject(noOfIds, ids, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_SHADOW_IDS_INFO_RESPONSE,

                /* SPECIFIC PARAMS */
                noOfIds: noOfIds,
                ids: ids,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1034) : PUBLIC_CHAT_DELETE_MESSAGE
        this.getPublicChatDeleteMessageObject = function getPublicChatDeleteMessageObject(roomId, packets, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_DELETE_MESSAGE,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                packets: packets,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1035) : PUBLIC_CHAT_DELETE_MESSAGE_CONFIRMATION
        this.getPublicChatDeleteMessageConfirmationObject = function getPublicChatDeleteMessageConfirmationObject(roomId, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_DELETE_MESSAGE_CONFIRMATION,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

    // PACKET TYPE(1036) : PUBLIC_CHAT_LIKE_A_MESSAGE
        this.getPublicChatLikeAMessageObject = function getPublicChatLikeAMessageObject(roomId, messengerOwnerid, originalPacketid, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_LIKE_A_MESSAGE,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                messengerOwnerid: messengerOwnerid,
                originalPacketid: originalPacketid,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

    // PACKET TYPE(1037) : PUBLIC_CHAT_UNLIKE_A_MESSAGE
        this.getPublicChatUnlikeAMessageObject = function getPublicChatUnlikeAMessageObject(roomId, messengerOwnerid, originalPacketid, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_UNLIKE_A_MESSAGE,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                messengerOwnerid: messengerOwnerid,
                originalPacketid: originalPacketid,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

    // PACKET TYPE(1038) : PUBLIC_CHAT_LIKE_UNLIKE_MESSAGE_CONFIRMATION
        this.getPublicChatLikeUnlikeMessageConfirmationObject = function getPublicChatLikeUnlikeMessageConfirmationObject(roomId, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_LIKE_UNLIKE_MESSAGE_CONFIRMATION,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

    // PACKET TYPE(1039) : PUBLIC_CHAT_REPORT_A_MESSAGE
        this.getPublicChatReportAMessageObject = getPublicChatReportAMessageObject;
        function getPublicChatReportAMessageObject(roomId, messengerOwnerid, originalPacketid, reportMessage, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_REPORT_A_MESSAGE,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                messengerOwnerid: messengerOwnerid,
                originalPacketid: originalPacketid,
                reportMessage: reportMessage,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        }

        // PACKET TYPE(1039) : PUBLIC_CHAT_REPORT_A_MESSAGE_CONFIRMATION
        this.getPublicChatReportAMessageConfirmationObject = function getPublicChatReportAMessageConfirmationObject(roomId, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_REPORT_A_MESSAGE_CONFIRMATION,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(1041) : PUBLIC_CHAT_LIKE_MEMBER_LIST_REQUEST
        this.getPublicChatLikeMemberListRequestObject = getPublicChatLikeMemberListRequestObject;
        function getPublicChatLikeMemberListRequestObject(roomId, originalPacketid, publicChatLastLikerId, pageLimit, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_LIKE_MEMBER_LIST_REQUEST,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                roomId: roomId,
                originalPacketid: originalPacketid,
                publicChatLastLikerId: publicChatLastLikerId,
                pageLimit: pageLimit,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        }

    // PACKET TYPE(1042) : PUBLIC_CHAT_LIKE_MEMBER_LIST
        this.getPublicChatLikeMemberListObject = function getPublicChatLikeMemberListObject(roomId, totalItems, items, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_LIKE_MEMBER_LIST,

          /* SPECIFIC PARAMS */
                roomId: roomId,
                totalItems: totalItems,
                items: items,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

    // PACKET TYPE(1043) : PUBLIC_CHAT_CATEGORY_LIST_REQUEST
        this.getPublicChatCategoryListRequestObject = function getPublicChatCategoryListRequestObject(lastCategory, pageLimit, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_CATEGORY_LIST_REQUEST,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                lastCategory: lastCategory,
                pageLimit: pageLimit,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

    // PACKET TYPE(1044) : PUBLIC_CHAT_CATEGORY_LIST
        this.getPublicChatCategoryListObject = function getPublicChatCategoryListObject(totalItems, items, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.PUBLIC_CHAT_CATEGORY_LIST,

          /* SPECIFIC PARAMS */
                totalItems: totalItems,
                items: items,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };
    }

    global.CHAT_APP.PublicChatRequests = new PublicChatRequests();
})(window);
