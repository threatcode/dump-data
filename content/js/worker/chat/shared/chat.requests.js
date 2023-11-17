(function chatRequests(global) {
    'use strict';
    // For Main App global == window
    // For Worker global == self

    function ChatRequests() {
        var PACKET_TYPES = global.CHAT_APP.Constants.PACKET_TYPES,
            platform = global.CHAT_APP.Constants.PLATFORM.WEB,
            getAppVersion = global.CHAT_APP.getAppVersion,

            getCurrentUserId = global.CHAT_APP.getCurrentUserId,
            getUUIDPacketId = global.CHAT_APP.UTILS.getUUIDPacketId;

        // PACKET TYPE(1) : FRIEND_CHAT_REGISTER
        this.getFriendChatRegisterObject = function getFriendChatRegisterObject(friendId, packetId) {
            var requestObject = {
                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_REGISTER,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(2) : FRIEND_CHAT_UNREGISTER
        this.getFriendChatUnregisterObject = function getFriendChatUnregisterObject(friendId, onlineStatus, userMood, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_UNREGISTER,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                platform: platform,
                onlineStatus: onlineStatus,
                userMood: userMood,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(3) : FRIEND_CHAT_REGISTER_CONFIRMATION
        this.getFriendChatRegisterConfirmationObject = function getFriendChatRegisterConfirmationObject(friendId, chatBindingPort, serverDate, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_REGISTER_CONFIRMATION,

                /* SPECIFIC PARAMS */
                friendId: friendId,
                chatBindingPort: chatBindingPort,
                serverDate: serverDate,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(4) : FRIEND_CHAT_IDLE
        this.getFriendChatIdleObject = function getFriendChatIdleObject(friendId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_IDLE,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                platform: platform,

            };

            return requestObject;
        };

        // PACKET TYPE(5) : FRIEND_CHAT_TYPING
        this.getFriendChatTypingObject = function getFriendChatTypingObject(friendId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_TYPING,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                platform: platform,

            };

            return requestObject;
        };

        // PACKET TYPE(6) : FRIEND_CHAT_MSG
        this.getFriendChatMsgObject = function getFriendChatMsgObject(friendId, messageType, timeout, message, messageDate, isSecretVisible, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_MSG,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                messageType: messageType,
                timeout: timeout,
                message: message,
                messageDate: messageDate,
                isSecretVisible: isSecretVisible,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(7) : FRIEND_CHAT_MSG_EDIT
        this.getFriendChatMsgEditObject = function getFriendChatMsgEditObject(friendId, messageType, timeout, message, messageDate, isSecretVisible, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_MSG_EDIT,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                messageType: messageType,
                timeout: timeout,
                message: message,
                messageDate: messageDate,
                isSecretVisible: isSecretVisible,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(8) : FRIEND_CHAT_BROKEN_MSG
        this.getFriendChatBrokenMsgObject =
        function getFriendChatBrokenMsgObject(friendId, sequenceNo, messageType, timeout, message, messageDate, isSecretVisible, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_BROKEN_MSG,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                sequenceNo: sequenceNo,
                messageType: messageType,
                timeout: timeout,
                message: message,
                messageDate: messageDate,
                isSecretVisible: isSecretVisible,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(9) : FRIEND_CHAT_BROKEN_MSG_EDIT
        this.getFriendChatBrokenMsgEditObject =
        function getFriendChatBrokenMsgEditObject(friendId, sequenceNo, messageType, timeout, message, messageDate, isSecretVisible, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_BROKEN_MSG_EDIT,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                sequenceNo: sequenceNo,
                messageType: messageType,
                timeout: timeout,
                message: message,
                messageDate: messageDate,
                isSecretVisible: isSecretVisible,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(10) : FRIEND_CHAT_MULTIPLE_MSG
        this.getFriendChatMultipleMsgObject = function getFriendChatMultipleMsgObject(friendId, messages, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_MULTIPLE_MSG,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                messages: messages,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(15) : FRIEND_CHAT_DELIVERED
        this.getFriendChatDeliveredObject = function getFriendChatDeliveredObject(friendId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_DELIVERED,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(16) : FRIEND_CHAT_SENT
        this.getFriendChatSentObject = function getFriendChatSentObject(friendId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_SENT,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(17) : FRIEND_CHAT_SEEN
        this.getFriendChatSeenObject = function getFriendChatSeenObject(friendId, messages, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_SEEN,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                messages: messages,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(18) : FRIEND_CHAT_SEEN_CONFIRMATION
        this.getFriendChatSeenConfirmationObject = function getFriendChatSeenConfirmationObject(friendId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_SEEN_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(19) : FRIEND_CHAT_MULTIPLE_MSG_DELETE
        this.getFriendChatMultipleMsgDeleteObject = function getFriendChatMultipleMsgDeleteObject(friendId, packets, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_MULTIPLE_MSG_DELETE,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                packets: packets,
                packetId: packetId || getUUIDPacketId(),
                platform: platform,

            };

            return requestObject;
        };

        // PACKET TYPE(20) : FRIEND_CHAT_MSG_DELETE_CONFIRMATION
        this.getFriendChatMsgDeleteConfirmationObject = function getFriendChatMsgDeleteConfirmationObject(friendId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_MSG_DELETE_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(24) : FRIEND_CHAT_BROKEN
        this.getFriendChatBrokenObject = function getFriendChatBrokenObject(friendId, sequenceNo, bytes, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_BROKEN,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                sequenceNo: sequenceNo,
                bytes: bytes,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(25) : FRIEND_CHAT_BROKEN_CONFIRMATION
        this.getFriendChatBrokenConfirmationObject = function getFriendChatBrokenConfirmationObject(friendId, sequenceNo, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_BROKEN_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                sequenceNo: sequenceNo,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(27) : FRIEND_CHAT_BLOCK
        this.getFriendChatBlockObject = function getFriendChatBlockObject(friendId, blockUnblockDate, isAddToDb, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_BLOCK,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                blockUnblockDate: blockUnblockDate,
                isAddToDb: isAddToDb,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(28) : FRIEND_CHAT_UNBLOCK
        this.getFriendChatUnblockObject = function getFriendChatUnblockObject(friendId, blockUnblockDate, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_UNBLOCK,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                blockUnblockDate: blockUnblockDate,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(29) : FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION
        this.getFriendChatBlockUnblockConfirmationObject = function getFriendChatBlockUnblockConfirmationObject(friendId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(41) : TAG_CHAT_TAG_REGISTER
        this.getTagChatTagRegisterObject = function getTagChatTagRegisterObject(tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_TAG_REGISTER,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(42) : TAG_CHAT_TAG_UNREGISTER
        this.getTagChatTagUnregisterObject = function getTagChatTagUnregisterObject(tagId, onlineStatus, userMood, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_TAG_UNREGISTER,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                onlineStatus: onlineStatus,
                userMood: userMood,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(43) : TAG_CHAT_TAG_REGISTER_CONFIRMATION
        this.getTagChatTagRegisterConfirmationObject = function getTagChatTagRegisterConfirmationObject(tagId, chatBindingPort, serverDate, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_TAG_REGISTER_CONFIRMATION,

                /* SPECIFIC PARAMS */
                tagId: tagId,
                chatBindingPort: chatBindingPort,
                serverDate: serverDate,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(46) : TAG_CHAT_TAG_INFORMATION
        this.getTagChatTagInformationObject = function getTagChatTagInformationObject(tagId, activityType, tagName, tagPictureUrl, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_TAG_INFORMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                activityType: activityType,
                tagName: tagName,
                tagPictureUrl: tagPictureUrl,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(47) : TAG_CHAT_TAG_INFORMATION_CONFIRMATION
        this.getTagChatTagInformationConfirmationObject = function getTagChatTagInformationConfirmationObject(tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_TAG_INFORMATION_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(51) : TAG_CHAT_TAG_MEMBER_ADD
        this.getTagChatTagMemberAddObject = function getTagChatTagMemberAddObject(tagId, tagMembers, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_TAG_MEMBER_ADD,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                tagMembers: tagMembers,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(52) : TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION
        this.getTagChatTagMemberAddConfirmationObject = function getTagChatTagMemberAddConfirmationObject(tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(53) : TAG_CHAT_MEMBER_REMOVE_LEAVE
        this.getTagChatMemberRemoveLeaveObject = function getTagChatMemberRemoveLeaveObject(tagId, tagMembers, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_MEMBER_REMOVE_LEAVE,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                tagMembers: tagMembers,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(54) : TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION
        this.getTagChatMemberRemoveLeaveConfirmationObject = function getTagChatMemberRemoveLeaveConfirmationObject(tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(55) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE
        this.getTagChatTagMemberTypeChangeObject = function getTagChatTagMemberTypeChangeObject(tagId, tagMembers, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                tagMembers: tagMembers,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(56) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION
        this.getTagChatTagMemberTypeChangeConfirmationObject = function getTagChatTagMemberTypeChangeConfirmationObject(tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(61) : TAG_CHAT_IDLE
        this.getTagChatIdleObject = function getTagChatIdleObject(tagId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_IDLE,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                platform: platform,

            };

            return requestObject;
        };

        // PACKET TYPE(62) : TAG_CHAT_TYPING
        this.getTagChatTypingObject = function getTagChatTypingObject(tagId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_TYPING,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                platform: platform,

            };

            return requestObject;
        };

        // PACKET TYPE(63) : TAG_CHAT_MSG
        this.getTagChatMsgObject = function getTagChatMsgObject(tagId, messageType, message, messageDate, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_MSG,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                messageType: messageType,
                message: message,
                messageDate: messageDate,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(64) : TAG_CHAT_MSG_EDIT
        this.getTagChatMsgEditObject = function getTagChatMsgEditObject(tagId, messageType, message, messageDate, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_MSG_EDIT,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                messageType: messageType,
                message: message,
                messageDate: messageDate,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(65) : TAG_CHAT_BROKEN_MSG
        this.getTagChatBrokenMsgObject = function getTagChatBrokenMsgObject(tagId, sequenceNo, messageType, message, messageDate, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_BROKEN_MSG,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                sequenceNo: sequenceNo,
                messageType: messageType,
                message: message,
                messageDate: messageDate,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(66) : TAG_CHAT_BROKEN_MSG_EDIT
        this.getTagChatBrokenMsgEditObject = function getTagChatBrokenMsgEditObject(tagId, sequenceNo, messageType, message, messageDate, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_BROKEN_MSG_EDIT,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                sequenceNo: sequenceNo,
                messageType: messageType,
                message: message,
                messageDate: messageDate,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(67) : TAG_CHAT_MULTIPLE_MSG
        this.getTagChatMultipleMsgObject = function getTagChatMultipleMsgObject(tagId, messageType, message, messageDate, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_MULTIPLE_MSG,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                messageType: messageType,
                message: message,
                messageDate: messageDate,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(68) : TAG_CHAT_DELIVERED
        this.getTagChatDeliveredObject = function getTagChatDeliveredObject(friendId, tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_DELIVERED,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                tagId: tagId,
                packetId: packetId || getUUIDPacketId(),
                boxId: tagId,

            };

            return requestObject;
        };

        // PACKET TYPE(69) : TAG_CHAT_SENT
        this.getTagChatSentObject = function getTagChatSentObject(tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_SENT,

                /* SPECIFIC PARAMS */
                tagId: tagId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(70) : TAG_CHAT_SEEN
        this.getTagChatSeenObject = function getTagChatSeenObject(tagId, packets, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_SEEN,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                packets: packets,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(71) : TAG_CHAT_SEEN_CONFIRMATION
        this.getTagChatSeenConfirmationObject = function getTagChatSeenConfirmationObject(tagId, packetId) {
            var requestObject = {

          /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_SEEN_CONFIRMATION,

          /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };
        // PACKET TYPE(72) : TAG_CHAT_MULTIPLE_MSG_DELETE
        this.getTagChatMultipleMsgDeleteObject = function getTagChatMultipleMsgDeleteObject(tagId, packets, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_MULTIPLE_MSG_DELETE,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                packets: packets,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(73) : TAG_CHAT_MSG_DELETE_CONFIRMATION
        this.getTagChatMsgDeleteConfirmationObject = function getTagChatMsgDeleteConfirmationObject(tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_MSG_DELETE_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(74) : TAG_CHAT_GENERAL_BROKEN_PACKET
        this.getTagChatGeneralBrokenPacketObject = function getTagChatGeneralBrokenPacketObject(tagId, sequenceNo, bytes, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_GENERAL_BROKEN_PACKET,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                sequenceNo: sequenceNo,
                bytes: bytes,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(75) : TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION
        this.getTagChatGeneralBrokenPacketConfirmationObject = function getTagChatGeneralBrokenPacketConfirmationObject(tagId, sequenceNo, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                sequenceNo: sequenceNo,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };


        // PACKET TYPE(76) : TAG_CHAT_GET_MESSAGE_SEEN_LIST_REQUEST
        this.getTagChatGetMessageSeenListRequestObject = getTagChatGetMessageSeenListRequestObject;
        function getTagChatGetMessageSeenListRequestObject(tagId, originalPacketid, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_GET_MESSAGE_SEEN_LIST_REQUEST,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                originalPacketid: originalPacketid,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        }

        // PACKET TYPE(77) : TAG_CHAT_MESSAGE_SEEN_LIST
        this.getTagChatMessageSeenListObject = getTagChatMessageSeenListObject;
        function getTagChatMessageSeenListObject(tagId, originalPacketid, members, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_MESSAGE_SEEN_LIST,

                /* SPECIFIC PARAMS */
                tagId: tagId,
                originalPacketid: originalPacketid,
                members: members,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        }

        // PACKET TYPE(78) : TAG_CHAT_MESSAGE_SEEN_LIST_CONFIRMATION
        this.getTagChatMessageSeenListConfirmationObject = getTagChatMessageSeenListConfirmationObject;
        function getTagChatMessageSeenListConfirmationObject(tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.TAG_CHAT_MESSAGE_SEEN_LIST_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        }


        // PACKET TYPE(91) : OFFLINE_FRIEND_INFORMATION
        this.getOfflineFriendInformationObject =
        function getOfflineFriendInformationObject(friendId, fullName, onlineStatus, friendPlatform,
                                        friendAppType, friendDeviceToken, userMood, isVoipCall, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_FRIEND_INFORMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                fullName: fullName,
                onlineStatus: onlineStatus,
                friendPlatform: friendPlatform,
                friendAppType: friendAppType,
                friendDeviceToken: friendDeviceToken,
                userMood: userMood,
                packetId: packetId || getUUIDPacketId(),
                isVoipCall: isVoipCall,
                platform: platform,

            };

            return requestObject;
        };

        // PACKET TYPE(92) : OFFLINE_FRIEND_INFORMATION_CONFIRMATION
        this.getOfflineFriendInformationConfirmationObject = function getOfflineFriendInformationConfirmationObject(friendId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_FRIEND_INFORMATION_CONFIRMATION,

                /* SPECIFIC PARAMS */
                friendId: friendId,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(93) : OFFLINE_GET_REQUEST
        this.getOfflineGetRequestObject = function getOfflineGetRequestObject(updateTime, blockUnblockDate, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_GET_REQUEST,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                updateTime: updateTime,
                blockUnblockDate: blockUnblockDate,
                appVersion: getAppVersion(),
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(94) : OFFLINE_GET_REQUEST_CONFIRMATION
        this.getOfflineGetRequestConfirmationObject = function getOfflineGetRequestConfirmationObject(serverDate, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_GET_REQUEST_CONFIRMATION,

                /* SPECIFIC PARAMS */
                serverDate: serverDate,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(95) : OFFLINE_FRIEND_UNREAD_MESSAGE
        this.getOfflineFriendUnreadMessageObject = function getOfflineFriendUnreadMessageObject(messages, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_FRIEND_UNREAD_MESSAGE,

                /* SPECIFIC PARAMS */
                messages: messages,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(96) : OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION
        this.getOfflineFriendUnreadMessageConfirmationObject = function getOfflineFriendUnreadMessageConfirmationObject(packets, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                packets: packets,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(97) : OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST
        this.getOfflineFriendHistoryMessageRequestObject = function getOfflineFriendHistoryMessageRequestObject(friendId, pageDirection, pageLimit, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                pageDirection: pageDirection,
                pageLimit: pageLimit,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(98) : OFFLINE_FRIEND_HISTORY_MESSAGE
        this.getOfflineFriendHistoryMessageObject = function getOfflineFriendHistoryMessageObject(friendId, messages, pageDirection, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE,

                /* SPECIFIC PARAMS */
                friendId: friendId,
                messages: messages,
                pageDirection: pageDirection,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(99) : OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION
        this.getOfflineFriendHistoryMessageConfirmationObject = function getOfflineFriendHistoryMessageConfirmationObject(friendId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION,

                /* SPECIFIC PARAMS */
                friendId: friendId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(100) : OFFLINE_GET_FRIEND_MESSAGE_STATUS
        this.getOfflineGetFriendMessageStatusObject = function getOfflineGetFriendMessageStatusObject(friendId, packets, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_GET_FRIEND_MESSAGE_STATUS,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                friendId: friendId,
                packets: packets,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(101) : OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION
        this.getOfflineGetFriendMessageStatusConfirmationObject = function getOfflineGetFriendMessageStatusConfirmationObject(friendId, packets, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION,

                /* SPECIFIC PARAMS */
                friendId: friendId,
                packets: packets,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(121) : GET_UNREAD_COUNT
        this.getUnreadCountObject = function getUnreadCountObject(start, limit, conversationType, friendGroupId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.GET_CONVERSATION_REQUEST,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                start: start,
                limit: limit,
                conversationType: conversationType,
                friendGroupId: friendGroupId,
                packetId: packetId || getUUIDPacketId(),
                platform: platform,

            };

            return requestObject;
        };

        // PACKET TYPE(102) : GET_CONVERSATION REQUEST
        this.getConversationRequestObject = function getConversationRequestObject(start, limit, conversationType, friendGroupId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.GET_CONVERSATION_REQUEST,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                startIndex: start,
                pageLimit: limit,
                conversationType: conversationType,
                friendGroupId: friendGroupId,
                packetId: packetId || getUUIDPacketId(),
                platform: platform,

            };

            return requestObject;
        };

        // PACKET TYPE(103) : MESSAGE_CONVERSATION_LIST
        this.getMessageConversationListObject = function getMessageConversationListObject() {
            var requestObject = {
                packetType: PACKET_TYPES.MESSAGE_CONVERSATION_LIST,
            };
            return requestObject;
        };

        // PACKET TYPE(104) : OFFLINE_TAG_INFORMATION_ACTIVITY
        this.getOfflineTagInformationActivityObject = function getOfflineTagInformationActivityObject(tagId, noOfItems, items, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_TAG_INFORMATION_ACTIVITY,

                /* SPECIFIC PARAMS */
                tagId: tagId,
                noOfItems: noOfItems,
                items: items,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(105) : OFFLINE_MY_TAG_LIST
        this.getOfflineMyTagListObject = function getOfflineMyTagListObject(noOfItems, items, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_MY_TAG_LIST,

                /* SPECIFIC PARAMS */
                noOfItems: noOfItems,
                items: items,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(106) : OFFLINE_TAG_UNREAD_MESSAGE
        this.getOfflineTagUnreadMessageObject = function getOfflineTagUnreadMessageObject(messages, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_TAG_UNREAD_MESSAGE,

                /* SPECIFIC PARAMS */
                messages: messages,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(107) : OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION
        this.getOfflineTagUnreadMessageConfirmationObject = function getOfflineTagUnreadMessageConfirmationObject(packets, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                packets: packets,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(108) : OFFLINE_TAG_CREATE_TAG
        this.getOfflineTagCreateTagObject = function getOfflineTagCreateTagObject(tagId, tagName, tagPictureUrl, tagMembers, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_TAG_CREATE_TAG,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                tagName: tagName,
                tagPictureUrl: tagPictureUrl,
                tagMembers: tagMembers,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(109) : OFFLINE_TAG_CREATE_TAG_CONFIRMATION
        this.getOfflineTagCreateTagConfirmationObject = function getOfflineTagCreateTagConfirmationObject(tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_TAG_CREATE_TAG_CONFIRMATION,

                /* SPECIFIC PARAMS */
                tagId: tagId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(110) : OFFLINE_TAG_HISTORY_MESSAGE_REQUEST
        this.getOfflineTagHistoryMessageRequestObject = function getOfflineTagHistoryMessageRequestObject(tagId, pageDirection, pageLimit, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_TAG_HISTORY_MESSAGE_REQUEST,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                pageDirection: pageDirection,
                pageLimit: pageLimit,
                appVersion: getAppVersion(),
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(111) : OFFLINE_TAG_HISTORY_MESSAGE
        this.getOfflineTagHistoryMessageObject = function getOfflineTagHistoryMessageObject(tagId, messages, pageDirection, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_TAG_HISTORY_MESSAGE,

                /* SPECIFIC PARAMS */
                tagId: tagId,
                messages: messages,
                pageDirection: pageDirection,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(112) : OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS
        this.getOfflineGetTagInformationWithMembersObject = function getOfflineGetTagInformationWithMembersObject(tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                tagId: tagId,
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(113) : OFFLINE_TAG_INFORMATION_WITH_MEMBERS
        this.getOfflineTagInformationWithMembersObject =
        function getOfflineTagInformationWithMembersObject(tagId, tagName, tagPictureUrl, tagMembers, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_TAG_INFORMATION_WITH_MEMBERS,

                /* SPECIFIC PARAMS */
                tagId: tagId,
                tagName: tagName,
                tagPictureUrl: tagPictureUrl,
                tagMembers: tagMembers,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(117) : OFFLINE_TAG_CONFIRMATION
        this.getOfflineTagConfirmationObject = function getOfflineTagConfirmationObject(tagId, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_TAG_CONFIRMATION,

                /* SPECIFIC PARAMS */
                tagId: tagId,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(118) : OFFLINE_BROKEN_HISTORY_PACKET
        this.getOfflineBrokenHistoryPacketObject = function getOfflineBrokenHistoryPacketObject(sequenceNo, bytes, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_BROKEN_HISTORY_PACKET,

                /* SPECIFIC PARAMS */
                sequenceNo: sequenceNo,
                bytes: bytes,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(119) : OFFLINE_BROKEN_PACKET
        this.getOfflineBrokenPacketObject = function getOfflineBrokenPacketObject(sequenceNo, bytes, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_BROKEN_PACKET,

                /* SPECIFIC PARAMS */
                sequenceNo: sequenceNo,
                bytes: bytes,
                userId: getCurrentUserId(),
                platform: platform,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };

        // PACKET TYPE(120) : OFFLINE_BROKEN_PACKET_CONFIRMATION
        this.getOfflineBrokenPacketConfirmationObject = function getOfflineBrokenPacketConfirmationObject(sequenceNo, packetId) {
            var requestObject = {

                /* GENERAL PARAMS */
                packetType: PACKET_TYPES.OFFLINE_BROKEN_PACKET_CONFIRMATION,

                /* SPECIFIC PARAMS */
                userId: getCurrentUserId(),
                sequenceNo: sequenceNo,
                packetId: packetId || getUUIDPacketId(),

            };

            return requestObject;
        };
    }

    global.CHAT_APP.ChatRequests = new ChatRequests();
})(window);
