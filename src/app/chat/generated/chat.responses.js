;(function(global){
    'use strict';
    //For Main App global == window
    //For Worker global == self

    
    var PACKET_TYPES = global.CHAT_APP.Constants.PACKET_TYPES;
    
    
    var responseMethodMap = {};    
    
    function getPacketProcessorInfo(packetType){
        return responseMethodMap[packetType];
    }

    function processUpdates(responseObject) {

        var packetType = responseObject.packetType;

        var responseMethodMap = getPacketProcessorInfo(packetType);

        if( !packetProcessorInfo ){
            RingLogger.warning('Packet Processor Not Implemented. Packet Type ', packetType, RingLogger.tags.CHAT);
            return false;
        }

        try{
           packetProcessorInfo.processor.call(this, responseObject);
        }catch(e){
           RingLogger.alert('Exception In PACKET Procsessing.', packetType, e , RingLogger.tags.CHAT);
        }

        return true;

    }

    
    //PACKET TYPE(1) : FRIEND_CHAT_REGISTER
    function onFriendChatRegister(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(2) : FRIEND_CHAT_UNREGISTER
    function onFriendChatUnregister(responseObject){      
      var userId       = responseObject.userId,
          friendId     = responseObject.friendId,
          onlineStatus = responseObject.onlineStatus,
          userMood     = responseObject.userMood,
          packetId     = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(3) : FRIEND_CHAT_REGISTER_CONFIRMATION
    function onFriendChatRegisterConfirmation(responseObject){      
      var friendId        = responseObject.friendId,
          chatBindingPort = responseObject.chatBindingPort,
          serverDate      = responseObject.serverDate,
          packetId        = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(4) : FRIEND_CHAT_IDLE
    function onFriendChatIdle(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId;
      
      /* method body */

    }

    //PACKET TYPE(5) : FRIEND_CHAT_TYPING
    function onFriendChatTyping(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId;
      
      /* method body */

    }

    //PACKET TYPE(6) : FRIEND_CHAT_MSG
    function onFriendChatMsg(responseObject){      
      var userId          = responseObject.userId,
          friendId        = responseObject.friendId,
          messageType     = responseObject.messageType,
          timeout         = responseObject.timeout,
          message         = responseObject.message,
          messageDate     = responseObject.messageDate,
          isSecretVisible = responseObject.isSecretVisible,
          packetId        = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(7) : FRIEND_CHAT_MSG_EDIT
    function onFriendChatMsgEdit(responseObject){      
      var userId          = responseObject.userId,
          friendId        = responseObject.friendId,
          messageType     = responseObject.messageType,
          timeout         = responseObject.timeout,
          message         = responseObject.message,
          messageDate     = responseObject.messageDate,
          isSecretVisible = responseObject.isSecretVisible,
          packetId        = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(8) : FRIEND_CHAT_BROKEN_MSG
    function onFriendChatBrokenMsg(responseObject){      
      var userId          = responseObject.userId,
          friendId        = responseObject.friendId,
          sequenceNo      = responseObject.sequenceNo,
          messageType     = responseObject.messageType,
          timeout         = responseObject.timeout,
          message         = responseObject.message,
          messageDate     = responseObject.messageDate,
          isSecretVisible = responseObject.isSecretVisible,
          packetId        = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(9) : FRIEND_CHAT_BROKEN_MSG_EDIT
    function onFriendChatBrokenMsgEdit(responseObject){      
      var userId          = responseObject.userId,
          friendId        = responseObject.friendId,
          sequenceNo      = responseObject.sequenceNo,
          messageType     = responseObject.messageType,
          timeout         = responseObject.timeout,
          message         = responseObject.message,
          messageDate     = responseObject.messageDate,
          isSecretVisible = responseObject.isSecretVisible,
          packetId        = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(10) : FRIEND_CHAT_MULTIPLE_MSG
    function onFriendChatMultipleMsg(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          messages = responseObject.messages,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(15) : FRIEND_CHAT_DELIVERED
    function onFriendChatDelivered(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(16) : FRIEND_CHAT_SENT
    function onFriendChatSent(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(17) : FRIEND_CHAT_SEEN
    function onFriendChatSeen(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          messages = responseObject.messages,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(18) : FRIEND_CHAT_SEEN_CONFIRMATION
    function onFriendChatSeenConfirmation(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(19) : FRIEND_CHAT_MULTIPLE_MSG_DELETE
    function onFriendChatMultipleMsgDelete(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          packets  = responseObject.packets,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(20) : FRIEND_CHAT_MSG_DELETE_CONFIRMATION
    function onFriendChatMsgDeleteConfirmation(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(24) : FRIEND_CHAT_BROKEN
    function onFriendChatBroken(responseObject){      
      var userId      = responseObject.userId,
          friendId    = responseObject.friendId,
          sequenceNo  = responseObject.sequenceNo,
          rawDataByte = responseObject.rawDataByte,
          packetId    = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(25) : FRIEND_CHAT_BROKEN_CONFIRMATION
    function onFriendChatBrokenConfirmation(responseObject){      
      var userId     = responseObject.userId,
          friendId   = responseObject.friendId,
          sequenceNo = responseObject.sequenceNo,
          packetId   = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(27) : FRIEND_CHAT_BLOCK
    function onFriendChatBlock(responseObject){      
      var userId           = responseObject.userId,
          friendId         = responseObject.friendId,
          blockUnblockDate = responseObject.blockUnblockDate,
          isAddToDb        = responseObject.isAddToDb,
          packetId         = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(28) : FRIEND_CHAT_UNBLOCK
    function onFriendChatUnblock(responseObject){      
      var userId           = responseObject.userId,
          friendId         = responseObject.friendId,
          blockUnblockDate = responseObject.blockUnblockDate,
          packetId         = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(29) : FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION
    function onFriendChatBlockUnblockConfirmation(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(41) : TAG_CHAT_TAG_REGISTER
    function onTagChatTagRegister(responseObject){      
      var userId   = responseObject.userId,
          tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(42) : TAG_CHAT_TAG_UNREGISTER
    function onTagChatTagUnregister(responseObject){      
      var userId       = responseObject.userId,
          tagId        = responseObject.tagId,
          onlineStatus = responseObject.onlineStatus,
          userMood     = responseObject.userMood,
          packetId     = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(43) : TAG_CHAT_TAG_REGISTER_CONFIRMATION
    function onTagChatTagRegisterConfirmation(responseObject){      
      var tagId           = responseObject.tagId,
          chatBindingPort = responseObject.chatBindingPort,
          serverDate      = responseObject.serverDate,
          packetId        = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(46) : TAG_CHAT_TAG_INFORMATION
    function onTagChatTagInformation(responseObject){      
      var userId        = responseObject.userId,
          tagId         = responseObject.tagId,
          activityType  = responseObject.activityType,
          tagName       = responseObject.tagName,
          tagPictureUrl = responseObject.tagPictureUrl,
          packetId      = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(47) : TAG_CHAT_TAG_INFORMATION_CONFIRMATION
    function onTagChatTagInformationConfirmation(responseObject){      
      var userId   = responseObject.userId,
          tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(51) : TAG_CHAT_TAG_MEMBER_ADD
    function onTagChatTagMemberAdd(responseObject){      
      var userId     = responseObject.userId,
          tagId      = responseObject.tagId,
          tagMembers = responseObject.tagMembers,
          packetId   = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(52) : TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION
    function onTagChatTagMemberAddConfirmation(responseObject){      
      var userId   = responseObject.userId,
          tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(53) : TAG_CHAT_MEMBER_REMOVE_LEAVE
    function onTagChatMemberRemoveLeave(responseObject){      
      var userId     = responseObject.userId,
          tagId      = responseObject.tagId,
          tagMembers = responseObject.tagMembers,
          packetId   = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(54) : TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION
    function onTagChatMemberRemoveLeaveConfirmation(responseObject){      
      var userId   = responseObject.userId,
          tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(55) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE
    function onTagChatTagMemberTypeChange(responseObject){      
      var userId     = responseObject.userId,
          tagId      = responseObject.tagId,
          tagMembers = responseObject.tagMembers,
          packetId   = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(56) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION
    function onTagChatTagMemberTypeChangeConfirmation(responseObject){      
      var userId   = responseObject.userId,
          tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(61) : TAG_CHAT_IDLE
    function onTagChatIdle(responseObject){      
      var userId = responseObject.userId,
          tagId  = responseObject.tagId;
      
      /* method body */

    }

    //PACKET TYPE(62) : TAG_CHAT_TYPING
    function onTagChatTyping(responseObject){      
      var userId = responseObject.userId,
          tagId  = responseObject.tagId;
      
      /* method body */

    }

    //PACKET TYPE(63) : TAG_CHAT_MSG
    function onTagChatMsg(responseObject){      
      var userId      = responseObject.userId,
          tagId       = responseObject.tagId,
          messageType = responseObject.messageType,
          message     = responseObject.message,
          messageDate = responseObject.messageDate,
          packetId    = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(64) : TAG_CHAT_MSG_EDIT
    function onTagChatMsgEdit(responseObject){      
      var userId      = responseObject.userId,
          tagId       = responseObject.tagId,
          messageType = responseObject.messageType,
          message     = responseObject.message,
          messageDate = responseObject.messageDate,
          packetId    = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(65) : TAG_CHAT_BROKEN_MSG
    function onTagChatBrokenMsg(responseObject){      
      var userId      = responseObject.userId,
          tagId       = responseObject.tagId,
          sequenceNo  = responseObject.sequenceNo,
          messageType = responseObject.messageType,
          message     = responseObject.message,
          messageDate = responseObject.messageDate,
          packetId    = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(66) : TAG_CHAT_BROKEN_MSG_EDIT
    function onTagChatBrokenMsgEdit(responseObject){      
      var userId      = responseObject.userId,
          tagId       = responseObject.tagId,
          sequenceNo  = responseObject.sequenceNo,
          messageType = responseObject.messageType,
          message     = responseObject.message,
          messageDate = responseObject.messageDate,
          packetId    = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(67) : TAG_CHAT_MULTIPLE_MSG
    function onTagChatMultipleMsg(responseObject){      
      var userId      = responseObject.userId,
          tagId       = responseObject.tagId,
          messageType = responseObject.messageType,
          message     = responseObject.message,
          messageDate = responseObject.messageDate,
          packetId    = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(68) : TAG_CHAT_DELIVERED
    function onTagChatDelivered(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(69) : TAG_CHAT_SENT
    function onTagChatSent(responseObject){      
      var tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(70) : TAG_CHAT_SEEN
    function onTagChatSeen(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(71) : TAG_CHAT_SEEN_CONFIRMATION
    function onTagChatSeenConfirmation(responseObject){      
      var tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(72) : TAG_CHAT_MULTIPLE_MSG_DELETE
    function onTagChatMultipleMsgDelete(responseObject){      
      var userId   = responseObject.userId,
          tagId    = responseObject.tagId,
          packets  = responseObject.packets,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(73) : TAG_CHAT_MSG_DELETE_CONFIRMATION
    function onTagChatMsgDeleteConfirmation(responseObject){      
      var userId   = responseObject.userId,
          tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(74) : TAG_CHAT_GENERAL_BROKEN_PACKET
    function onTagChatGeneralBrokenPacket(responseObject){      
      var userId      = responseObject.userId,
          tagId       = responseObject.tagId,
          sequenceNo  = responseObject.sequenceNo,
          rawDataByte = responseObject.rawDataByte,
          packetId    = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(75) : TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION
    function onTagChatGeneralBrokenPacketConfirmation(responseObject){      
      var userId     = responseObject.userId,
          tagId      = responseObject.tagId,
          sequenceNo = responseObject.sequenceNo,
          packetId   = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(91) : OFFLINE_FRIEND_INFORMATION
    function onOfflineFriendInformation(responseObject){      
      var userId            = responseObject.userId,
          friendId          = responseObject.friendId,
          fullName          = responseObject.fullName,
          onlineStatus      = responseObject.onlineStatus,
          friendAppType     = responseObject.friendAppType,
          friendDeviceToken = responseObject.friendDeviceToken,
          userMood          = responseObject.userMood,
          packetId          = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(92) : OFFLINE_FRIEND_INFORMATION_CONFIRMATION
    function onOfflineFriendInformationConfirmation(responseObject){      
      var friendId = responseObject.friendId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(93) : OFFLINE_GET_REQUEST
    function onOfflineGetRequest(responseObject){      
      var userId           = responseObject.userId,
          updateTime       = responseObject.updateTime,
          blockUnblockDate = responseObject.blockUnblockDate,
          packetId         = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(94) : OFFLINE_GET_REQUEST_CONFIRMATION
    function onOfflineGetRequestConfirmation(responseObject){      
      var serverDate = responseObject.serverDate,
          packetId   = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(95) : OFFLINE_FRIEND_UNREAD_MESSAGE
    function onOfflineFriendUnreadMessage(responseObject){      
      var messages = responseObject.messages,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(96) : OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION
    function onOfflineFriendUnreadMessageConfirmation(responseObject){      
      var userId   = responseObject.userId,
          packets  = responseObject.packets,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(97) : OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST
    function onOfflineFriendHistoryMessageRequest(responseObject){      
      var userId        = responseObject.userId,
          friendId      = responseObject.friendId,
          pageDirection = responseObject.pageDirection,
          pageLimit     = responseObject.pageLimit,
          packetId      = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(98) : OFFLINE_FRIEND_HISTORY_MESSAGE
    function onOfflineFriendHistoryMessage(responseObject){      
      var friendId      = responseObject.friendId,
          messages      = responseObject.messages,
          pageDirection = responseObject.pageDirection,
          packetId      = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(99) : OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION
    function onOfflineFriendHistoryMessageConfirmation(responseObject){      
      var friendId = responseObject.friendId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(100) : OFFLINE_GET_FRIEND_MESSAGE_STATUS
    function onOfflineGetFriendMessageStatus(responseObject){      
      var userId   = responseObject.userId,
          friendId = responseObject.friendId,
          packets  = responseObject.packets,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(101) : OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION
    function onOfflineGetFriendMessageStatusConfirmation(responseObject){      
      var friendId = responseObject.friendId,
          packets  = responseObject.packets,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(104) : OFFLINE_TAG_INFORMATION_ACTIVITY
    function onOfflineTagInformationActivity(responseObject){      
      var tagId     = responseObject.tagId,
          noOfItems = responseObject.noOfItems,
          items     = responseObject.items,
          packetId  = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(105) : OFFLINE_MY_TAG_LIST
    function onOfflineMyTagList(responseObject){      
      var noOfItems = responseObject.noOfItems,
          items     = responseObject.items,
          packetId  = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(106) : OFFLINE_TAG_UNREAD_MESSAGE
    function onOfflineTagUnreadMessage(responseObject){      
      var messages = responseObject.messages,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(107) : OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION
    function onOfflineTagUnreadMessageConfirmation(responseObject){      
      var userId   = responseObject.userId,
          packets  = responseObject.packets,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(108) : OFFLINE_TAG_CREATE_TAG
    function onOfflineTagCreateTag(responseObject){      
      var userId        = responseObject.userId,
          tagId         = responseObject.tagId,
          tagName       = responseObject.tagName,
          tagPictureUrl = responseObject.tagPictureUrl,
          tagMembers    = responseObject.tagMembers,
          packetId      = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(109) : OFFLINE_TAG_CREATE_TAG_CONFIRMATION
    function onOfflineTagCreateTagConfirmation(responseObject){      
      var tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(110) : OFFLINE_TAG_HISTORY_MESSAGE_REQUEST
    function onOfflineTagHistoryMessageRequest(responseObject){      
      var userId        = responseObject.userId,
          tagId         = responseObject.tagId,
          pageDirection = responseObject.pageDirection,
          pageLimit     = responseObject.pageLimit,
          packetId      = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(111) : OFFLINE_TAG_HISTORY_MESSAGE
    function onOfflineTagHistoryMessage(responseObject){      
      var tagId         = responseObject.tagId,
          messages      = responseObject.messages,
          pageDirection = responseObject.pageDirection,
          packetId      = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(112) : OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS
    function onOfflineGetTagInformationWithMembers(responseObject){      
      var userId   = responseObject.userId,
          tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(113) : OFFLINE_TAG_INFORMATION_WITH_MEMBERS
    function onOfflineTagInformationWithMembers(responseObject){      
      var tagId         = responseObject.tagId,
          tagName       = responseObject.tagName,
          tagPictureUrl = responseObject.tagPictureUrl,
          tagMembers    = responseObject.tagMembers,
          packetId      = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(117) : OFFLINE_TAG_CONFIRMATION
    function onOfflineTagConfirmation(responseObject){      
      var tagId    = responseObject.tagId,
          packetId = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(118) : OFFLINE_BROKEN_HISTORY_PACKET
    function onOfflineBrokenHistoryPacket(responseObject){      
      var sequenceNo  = responseObject.sequenceNo,
          rawDataByte = responseObject.rawDataByte,
          packetId    = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(119) : OFFLINE_BROKEN_PACKET
    function onOfflineBrokenPacket(responseObject){      
      var sequenceNo  = responseObject.sequenceNo,
          rawDataByte = responseObject.rawDataByte,
          userId      = responseObject.userId,
          packetId    = responseObject.packetId;
      
      /* method body */

    }

    //PACKET TYPE(120) : OFFLINE_BROKEN_PACKET_CONFIRMATION
    function onOfflineBrokenPacketConfirmation(responseObject){      
      var userId     = responseObject.userId,
          sequenceNo = responseObject.sequenceNo,
          packetId   = responseObject.packetId;
      
      /* method body */

    }

    
    //PACKET TYPE(1) : FRIEND_CHAT_REGISTER
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_REGISTER] = {
        processor : onFriendChatRegister
    };

    //PACKET TYPE(2) : FRIEND_CHAT_UNREGISTER
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_UNREGISTER] = {
        processor : onFriendChatUnregister
    };

    //PACKET TYPE(3) : FRIEND_CHAT_REGISTER_CONFIRMATION
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_REGISTER_CONFIRMATION] = {
        processor : onFriendChatRegisterConfirmation
    };

    //PACKET TYPE(4) : FRIEND_CHAT_IDLE
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_IDLE] = {
        processor : onFriendChatIdle
    };

    //PACKET TYPE(5) : FRIEND_CHAT_TYPING
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_TYPING] = {
        processor : onFriendChatTyping
    };

    //PACKET TYPE(6) : FRIEND_CHAT_MSG
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_MSG] = {
        processor : onFriendChatMsg
    };

    //PACKET TYPE(7) : FRIEND_CHAT_MSG_EDIT
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_MSG_EDIT] = {
        processor : onFriendChatMsgEdit
    };

    //PACKET TYPE(8) : FRIEND_CHAT_BROKEN_MSG
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BROKEN_MSG] = {
        processor : onFriendChatBrokenMsg
    };

    //PACKET TYPE(9) : FRIEND_CHAT_BROKEN_MSG_EDIT
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BROKEN_MSG_EDIT] = {
        processor : onFriendChatBrokenMsgEdit
    };

    //PACKET TYPE(10) : FRIEND_CHAT_MULTIPLE_MSG
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_MULTIPLE_MSG] = {
        processor : onFriendChatMultipleMsg
    };

    //PACKET TYPE(15) : FRIEND_CHAT_DELIVERED
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_DELIVERED] = {
        processor : onFriendChatDelivered
    };

    //PACKET TYPE(16) : FRIEND_CHAT_SENT
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_SENT] = {
        processor : onFriendChatSent
    };

    //PACKET TYPE(17) : FRIEND_CHAT_SEEN
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_SEEN] = {
        processor : onFriendChatSeen
    };

    //PACKET TYPE(18) : FRIEND_CHAT_SEEN_CONFIRMATION
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_SEEN_CONFIRMATION] = {
        processor : onFriendChatSeenConfirmation
    };

    //PACKET TYPE(19) : FRIEND_CHAT_MULTIPLE_MSG_DELETE
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_MULTIPLE_MSG_DELETE] = {
        processor : onFriendChatMultipleMsgDelete
    };

    //PACKET TYPE(20) : FRIEND_CHAT_MSG_DELETE_CONFIRMATION
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_MSG_DELETE_CONFIRMATION] = {
        processor : onFriendChatMsgDeleteConfirmation
    };

    //PACKET TYPE(24) : FRIEND_CHAT_BROKEN
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BROKEN] = {
        processor : onFriendChatBroken
    };

    //PACKET TYPE(25) : FRIEND_CHAT_BROKEN_CONFIRMATION
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BROKEN_CONFIRMATION] = {
        processor : onFriendChatBrokenConfirmation
    };

    //PACKET TYPE(27) : FRIEND_CHAT_BLOCK
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BLOCK] = {
        processor : onFriendChatBlock
    };

    //PACKET TYPE(28) : FRIEND_CHAT_UNBLOCK
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_UNBLOCK] = {
        processor : onFriendChatUnblock
    };

    //PACKET TYPE(29) : FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION
    responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION] = {
        processor : onFriendChatBlockUnblockConfirmation
    };

    //PACKET TYPE(41) : TAG_CHAT_TAG_REGISTER
    responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_REGISTER] = {
        processor : onTagChatTagRegister
    };

    //PACKET TYPE(42) : TAG_CHAT_TAG_UNREGISTER
    responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_UNREGISTER] = {
        processor : onTagChatTagUnregister
    };

    //PACKET TYPE(43) : TAG_CHAT_TAG_REGISTER_CONFIRMATION
    responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_REGISTER_CONFIRMATION] = {
        processor : onTagChatTagRegisterConfirmation
    };

    //PACKET TYPE(46) : TAG_CHAT_TAG_INFORMATION
    responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_INFORMATION] = {
        processor : onTagChatTagInformation
    };

    //PACKET TYPE(47) : TAG_CHAT_TAG_INFORMATION_CONFIRMATION
    responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_INFORMATION_CONFIRMATION] = {
        processor : onTagChatTagInformationConfirmation
    };

    //PACKET TYPE(51) : TAG_CHAT_TAG_MEMBER_ADD
    responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_MEMBER_ADD] = {
        processor : onTagChatTagMemberAdd
    };

    //PACKET TYPE(52) : TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION
    responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION] = {
        processor : onTagChatTagMemberAddConfirmation
    };

    //PACKET TYPE(53) : TAG_CHAT_MEMBER_REMOVE_LEAVE
    responseMethodMap[PACKET_TYPES.TAG_CHAT_MEMBER_REMOVE_LEAVE] = {
        processor : onTagChatMemberRemoveLeave
    };

    //PACKET TYPE(54) : TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION
    responseMethodMap[PACKET_TYPES.TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION] = {
        processor : onTagChatMemberRemoveLeaveConfirmation
    };

    //PACKET TYPE(55) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE
    responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE] = {
        processor : onTagChatTagMemberTypeChange
    };

    //PACKET TYPE(56) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION
    responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION] = {
        processor : onTagChatTagMemberTypeChangeConfirmation
    };

    //PACKET TYPE(61) : TAG_CHAT_IDLE
    responseMethodMap[PACKET_TYPES.TAG_CHAT_IDLE] = {
        processor : onTagChatIdle
    };

    //PACKET TYPE(62) : TAG_CHAT_TYPING
    responseMethodMap[PACKET_TYPES.TAG_CHAT_TYPING] = {
        processor : onTagChatTyping
    };

    //PACKET TYPE(63) : TAG_CHAT_MSG
    responseMethodMap[PACKET_TYPES.TAG_CHAT_MSG] = {
        processor : onTagChatMsg
    };

    //PACKET TYPE(64) : TAG_CHAT_MSG_EDIT
    responseMethodMap[PACKET_TYPES.TAG_CHAT_MSG_EDIT] = {
        processor : onTagChatMsgEdit
    };

    //PACKET TYPE(65) : TAG_CHAT_BROKEN_MSG
    responseMethodMap[PACKET_TYPES.TAG_CHAT_BROKEN_MSG] = {
        processor : onTagChatBrokenMsg
    };

    //PACKET TYPE(66) : TAG_CHAT_BROKEN_MSG_EDIT
    responseMethodMap[PACKET_TYPES.TAG_CHAT_BROKEN_MSG_EDIT] = {
        processor : onTagChatBrokenMsgEdit
    };

    //PACKET TYPE(67) : TAG_CHAT_MULTIPLE_MSG
    responseMethodMap[PACKET_TYPES.TAG_CHAT_MULTIPLE_MSG] = {
        processor : onTagChatMultipleMsg
    };

    //PACKET TYPE(68) : TAG_CHAT_DELIVERED
    responseMethodMap[PACKET_TYPES.TAG_CHAT_DELIVERED] = {
        processor : onTagChatDelivered
    };

    //PACKET TYPE(69) : TAG_CHAT_SENT
    responseMethodMap[PACKET_TYPES.TAG_CHAT_SENT] = {
        processor : onTagChatSent
    };

    //PACKET TYPE(70) : TAG_CHAT_SEEN
    responseMethodMap[PACKET_TYPES.TAG_CHAT_SEEN] = {
        processor : onTagChatSeen
    };

    //PACKET TYPE(71) : TAG_CHAT_SEEN_CONFIRMATION
    responseMethodMap[PACKET_TYPES.TAG_CHAT_SEEN_CONFIRMATION] = {
        processor : onTagChatSeenConfirmation
    };

    //PACKET TYPE(72) : TAG_CHAT_MULTIPLE_MSG_DELETE
    responseMethodMap[PACKET_TYPES.TAG_CHAT_MULTIPLE_MSG_DELETE] = {
        processor : onTagChatMultipleMsgDelete
    };

    //PACKET TYPE(73) : TAG_CHAT_MSG_DELETE_CONFIRMATION
    responseMethodMap[PACKET_TYPES.TAG_CHAT_MSG_DELETE_CONFIRMATION] = {
        processor : onTagChatMsgDeleteConfirmation
    };

    //PACKET TYPE(74) : TAG_CHAT_GENERAL_BROKEN_PACKET
    responseMethodMap[PACKET_TYPES.TAG_CHAT_GENERAL_BROKEN_PACKET] = {
        processor : onTagChatGeneralBrokenPacket
    };

    //PACKET TYPE(75) : TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION
    responseMethodMap[PACKET_TYPES.TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION] = {
        processor : onTagChatGeneralBrokenPacketConfirmation
    };

    //PACKET TYPE(91) : OFFLINE_FRIEND_INFORMATION
    responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_INFORMATION] = {
        processor : onOfflineFriendInformation
    };

    //PACKET TYPE(92) : OFFLINE_FRIEND_INFORMATION_CONFIRMATION
    responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_INFORMATION_CONFIRMATION] = {
        processor : onOfflineFriendInformationConfirmation
    };

    //PACKET TYPE(93) : OFFLINE_GET_REQUEST
    responseMethodMap[PACKET_TYPES.OFFLINE_GET_REQUEST] = {
        processor : onOfflineGetRequest
    };

    //PACKET TYPE(94) : OFFLINE_GET_REQUEST_CONFIRMATION
    responseMethodMap[PACKET_TYPES.OFFLINE_GET_REQUEST_CONFIRMATION] = {
        processor : onOfflineGetRequestConfirmation
    };

    //PACKET TYPE(95) : OFFLINE_FRIEND_UNREAD_MESSAGE
    responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_UNREAD_MESSAGE] = {
        processor : onOfflineFriendUnreadMessage
    };

    //PACKET TYPE(96) : OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION
    responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION] = {
        processor : onOfflineFriendUnreadMessageConfirmation
    };

    //PACKET TYPE(97) : OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST
    responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST] = {
        processor : onOfflineFriendHistoryMessageRequest
    };

    //PACKET TYPE(98) : OFFLINE_FRIEND_HISTORY_MESSAGE
    responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE] = {
        processor : onOfflineFriendHistoryMessage
    };

    //PACKET TYPE(99) : OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION
    responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION] = {
        processor : onOfflineFriendHistoryMessageConfirmation
    };

    //PACKET TYPE(100) : OFFLINE_GET_FRIEND_MESSAGE_STATUS
    responseMethodMap[PACKET_TYPES.OFFLINE_GET_FRIEND_MESSAGE_STATUS] = {
        processor : onOfflineGetFriendMessageStatus
    };

    //PACKET TYPE(101) : OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION
    responseMethodMap[PACKET_TYPES.OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION] = {
        processor : onOfflineGetFriendMessageStatusConfirmation
    };

    //PACKET TYPE(104) : OFFLINE_TAG_INFORMATION_ACTIVITY
    responseMethodMap[PACKET_TYPES.OFFLINE_TAG_INFORMATION_ACTIVITY] = {
        processor : onOfflineTagInformationActivity
    };

    //PACKET TYPE(105) : OFFLINE_MY_TAG_LIST
    responseMethodMap[PACKET_TYPES.OFFLINE_MY_TAG_LIST] = {
        processor : onOfflineMyTagList
    };

    //PACKET TYPE(106) : OFFLINE_TAG_UNREAD_MESSAGE
    responseMethodMap[PACKET_TYPES.OFFLINE_TAG_UNREAD_MESSAGE] = {
        processor : onOfflineTagUnreadMessage
    };

    //PACKET TYPE(107) : OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION
    responseMethodMap[PACKET_TYPES.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION] = {
        processor : onOfflineTagUnreadMessageConfirmation
    };

    //PACKET TYPE(108) : OFFLINE_TAG_CREATE_TAG
    responseMethodMap[PACKET_TYPES.OFFLINE_TAG_CREATE_TAG] = {
        processor : onOfflineTagCreateTag
    };

    //PACKET TYPE(109) : OFFLINE_TAG_CREATE_TAG_CONFIRMATION
    responseMethodMap[PACKET_TYPES.OFFLINE_TAG_CREATE_TAG_CONFIRMATION] = {
        processor : onOfflineTagCreateTagConfirmation
    };

    //PACKET TYPE(110) : OFFLINE_TAG_HISTORY_MESSAGE_REQUEST
    responseMethodMap[PACKET_TYPES.OFFLINE_TAG_HISTORY_MESSAGE_REQUEST] = {
        processor : onOfflineTagHistoryMessageRequest
    };

    //PACKET TYPE(111) : OFFLINE_TAG_HISTORY_MESSAGE
    responseMethodMap[PACKET_TYPES.OFFLINE_TAG_HISTORY_MESSAGE] = {
        processor : onOfflineTagHistoryMessage
    };

    //PACKET TYPE(112) : OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS
    responseMethodMap[PACKET_TYPES.OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS] = {
        processor : onOfflineGetTagInformationWithMembers
    };

    //PACKET TYPE(113) : OFFLINE_TAG_INFORMATION_WITH_MEMBERS
    responseMethodMap[PACKET_TYPES.OFFLINE_TAG_INFORMATION_WITH_MEMBERS] = {
        processor : onOfflineTagInformationWithMembers
    };

    //PACKET TYPE(117) : OFFLINE_TAG_CONFIRMATION
    responseMethodMap[PACKET_TYPES.OFFLINE_TAG_CONFIRMATION] = {
        processor : onOfflineTagConfirmation
    };

    //PACKET TYPE(118) : OFFLINE_BROKEN_HISTORY_PACKET
    responseMethodMap[PACKET_TYPES.OFFLINE_BROKEN_HISTORY_PACKET] = {
        processor : onOfflineBrokenHistoryPacket
    };

    //PACKET TYPE(119) : OFFLINE_BROKEN_PACKET
    responseMethodMap[PACKET_TYPES.OFFLINE_BROKEN_PACKET] = {
        processor : onOfflineBrokenPacket
    };

    //PACKET TYPE(120) : OFFLINE_BROKEN_PACKET_CONFIRMATION
    responseMethodMap[PACKET_TYPES.OFFLINE_BROKEN_PACKET_CONFIRMATION] = {
        processor : onOfflineBrokenPacketConfirmation
    };




    global.CHAT_APP['ChatResponses'] = {
        processUpdates : processUpdates
    };

})(window);
