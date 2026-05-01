(function(global){
  'use strict';
  //For Main App global == window
  //For Worker global == self

  function ChatRequests(){
        
    var PACKET_TYPES     = global.CHAT_APP.Constants.PACKET_TYPES;
    var platform         = global.CHAT_APP.Constants.PLATFORM.WEB;
    var getAppVersion    = global.CHAT_APP.getAppVersion;

    var getCurrentUserId = global.CHAT_APP.getCurrentUserId;
    var getUUIDPacketId  = global.CHAT_APP.UTILS.getUUIDPacketId;

    //PACKET TYPE(1) : FRIEND_CHAT_REGISTER
    this.getFriendChatRegisterObject = function(friendId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_REGISTER,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(2) : FRIEND_CHAT_UNREGISTER
    this.getFriendChatUnregisterObject = function(friendId, onlineStatus, userMood, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_UNREGISTER,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          platform                : platform,
          onlineStatus            : onlineStatus,
          userMood                : userMood,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(3) : FRIEND_CHAT_REGISTER_CONFIRMATION
    this.getFriendChatRegisterConfirmationObject = function(friendId, chatBindingPort, serverDate, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_REGISTER_CONFIRMATION,

          /* SPECIFIC PARAMS */
          friendId                : friendId,
          chatBindingPort         : chatBindingPort,
          serverDate              : serverDate,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(4) : FRIEND_CHAT_IDLE
    this.getFriendChatIdleObject = function(friendId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_IDLE,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          platform                : platform,     

      }

      return requestObject;

    }

    //PACKET TYPE(5) : FRIEND_CHAT_TYPING
    this.getFriendChatTypingObject = function(friendId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_TYPING,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          platform                : platform,     

      }

      return requestObject;

    }

    //PACKET TYPE(6) : FRIEND_CHAT_MSG
    this.getFriendChatMsgObject = function(friendId, messageType, timeout, message, messageDate, isSecretVisible, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_MSG,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          messageType             : messageType,
          timeout                 : timeout,
          message                 : message,
          messageDate             : messageDate,
          isSecretVisible         : isSecretVisible,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(7) : FRIEND_CHAT_MSG_EDIT
    this.getFriendChatMsgEditObject = function(friendId, messageType, timeout, message, messageDate, isSecretVisible, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_MSG_EDIT,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          messageType             : messageType,
          timeout                 : timeout,
          message                 : message,
          messageDate             : messageDate,
          isSecretVisible         : isSecretVisible,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(8) : FRIEND_CHAT_BROKEN_MSG
    this.getFriendChatBrokenMsgObject = function(friendId, sequenceNo, messageType, timeout, message, messageDate, isSecretVisible, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_BROKEN_MSG,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          sequenceNo              : sequenceNo,
          messageType             : messageType,
          timeout                 : timeout,
          message                 : message,
          messageDate             : messageDate,
          isSecretVisible         : isSecretVisible,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(9) : FRIEND_CHAT_BROKEN_MSG_EDIT
    this.getFriendChatBrokenMsgEditObject = function(friendId, sequenceNo, messageType, timeout, message, messageDate, isSecretVisible, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_BROKEN_MSG_EDIT,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          sequenceNo              : sequenceNo,
          messageType             : messageType,
          timeout                 : timeout,
          message                 : message,
          messageDate             : messageDate,
          isSecretVisible         : isSecretVisible,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(10) : FRIEND_CHAT_MULTIPLE_MSG
    this.getFriendChatMultipleMsgObject = function(friendId, messages, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_MULTIPLE_MSG,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          messages                : messages,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(15) : FRIEND_CHAT_DELIVERED
    this.getFriendChatDeliveredObject = function(friendId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_DELIVERED,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(16) : FRIEND_CHAT_SENT
    this.getFriendChatSentObject = function(friendId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_SENT,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(17) : FRIEND_CHAT_SEEN
    this.getFriendChatSeenObject = function(friendId, messages, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_SEEN,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          messages                : messages,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(18) : FRIEND_CHAT_SEEN_CONFIRMATION
    this.getFriendChatSeenConfirmationObject = function(friendId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_SEEN_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(19) : FRIEND_CHAT_MULTIPLE_MSG_DELETE
    this.getFriendChatMultipleMsgDeleteObject = function(friendId, packets, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_MULTIPLE_MSG_DELETE,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          packets                 : packets,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(20) : FRIEND_CHAT_MSG_DELETE_CONFIRMATION
    this.getFriendChatMsgDeleteConfirmationObject = function(friendId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_MSG_DELETE_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(24) : FRIEND_CHAT_BROKEN
    this.getFriendChatBrokenObject = function(friendId, sequenceNo, bytes, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_BROKEN,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          sequenceNo              : sequenceNo,
          bytes                   : bytes,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(25) : FRIEND_CHAT_BROKEN_CONFIRMATION
    this.getFriendChatBrokenConfirmationObject = function(friendId, sequenceNo, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_BROKEN_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          sequenceNo              : sequenceNo,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(27) : FRIEND_CHAT_BLOCK
    this.getFriendChatBlockObject = function(friendId, blockUnblockDate, isAddToDb, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_BLOCK,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          blockUnblockDate        : blockUnblockDate,
          isAddToDb               : isAddToDb,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(28) : FRIEND_CHAT_UNBLOCK
    this.getFriendChatUnblockObject = function(friendId, blockUnblockDate, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_UNBLOCK,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          blockUnblockDate        : blockUnblockDate,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(29) : FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION
    this.getFriendChatBlockUnblockConfirmationObject = function(friendId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(41) : TAG_CHAT_TAG_REGISTER
    this.getTagChatTagRegisterObject = function(tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_TAG_REGISTER,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(42) : TAG_CHAT_TAG_UNREGISTER
    this.getTagChatTagUnregisterObject = function(tagId, onlineStatus, userMood, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_TAG_UNREGISTER,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          onlineStatus            : onlineStatus,
          userMood                : userMood,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(43) : TAG_CHAT_TAG_REGISTER_CONFIRMATION
    this.getTagChatTagRegisterConfirmationObject = function(tagId, chatBindingPort, serverDate, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_TAG_REGISTER_CONFIRMATION,

          /* SPECIFIC PARAMS */
          tagId                   : tagId,
          chatBindingPort         : chatBindingPort,
          serverDate              : serverDate,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(46) : TAG_CHAT_TAG_INFORMATION
    this.getTagChatTagInformationObject = function(tagId, activityType, tagName, tagPictureUrl, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_TAG_INFORMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          activityType            : activityType,
          tagName                 : tagName,
          tagPictureUrl           : tagPictureUrl,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(47) : TAG_CHAT_TAG_INFORMATION_CONFIRMATION
    this.getTagChatTagInformationConfirmationObject = function(tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_TAG_INFORMATION_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(51) : TAG_CHAT_TAG_MEMBER_ADD
    this.getTagChatTagMemberAddObject = function(tagId, tagMembers, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_TAG_MEMBER_ADD,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          tagMembers              : tagMembers,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(52) : TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION
    this.getTagChatTagMemberAddConfirmationObject = function(tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(53) : TAG_CHAT_MEMBER_REMOVE_LEAVE
    this.getTagChatMemberRemoveLeaveObject = function(tagId, tagMembers, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_MEMBER_REMOVE_LEAVE,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          tagMembers              : tagMembers,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(54) : TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION
    this.getTagChatMemberRemoveLeaveConfirmationObject = function(tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(55) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE
    this.getTagChatTagMemberTypeChangeObject = function(tagId, tagMembers, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          tagMembers              : tagMembers,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(56) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION
    this.getTagChatTagMemberTypeChangeConfirmationObject = function(tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(61) : TAG_CHAT_IDLE
    this.getTagChatIdleObject = function(tagId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_IDLE,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          platform                : platform,     

      }

      return requestObject;

    }

    //PACKET TYPE(62) : TAG_CHAT_TYPING
    this.getTagChatTypingObject = function(tagId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_TYPING,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          platform                : platform,     

      }

      return requestObject;

    }

    //PACKET TYPE(63) : TAG_CHAT_MSG
    this.getTagChatMsgObject = function(tagId, messageType, message, messageDate, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_MSG,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          messageType             : messageType,
          message                 : message,
          messageDate             : messageDate,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(64) : TAG_CHAT_MSG_EDIT
    this.getTagChatMsgEditObject = function(tagId, messageType, message, messageDate, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_MSG_EDIT,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          messageType             : messageType,
          message                 : message,
          messageDate             : messageDate,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(65) : TAG_CHAT_BROKEN_MSG
    this.getTagChatBrokenMsgObject = function(tagId, sequenceNo, messageType, message, messageDate, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_BROKEN_MSG,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          sequenceNo              : sequenceNo,
          messageType             : messageType,
          message                 : message,
          messageDate             : messageDate,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(66) : TAG_CHAT_BROKEN_MSG_EDIT
    this.getTagChatBrokenMsgEditObject = function(tagId, sequenceNo, messageType, message, messageDate, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_BROKEN_MSG_EDIT,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          sequenceNo              : sequenceNo,
          messageType             : messageType,
          message                 : message,
          messageDate             : messageDate,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(67) : TAG_CHAT_MULTIPLE_MSG
    this.getTagChatMultipleMsgObject = function(tagId, messageType, message, messageDate, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_MULTIPLE_MSG,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          messageType             : messageType,
          message                 : message,
          messageDate             : messageDate,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(68) : TAG_CHAT_DELIVERED
    this.getTagChatDeliveredObject = function(friendId, tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_DELIVERED,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          tagId                   : tagId,
          packetId                : packetId || getUUIDPacketId(),
          boxId                   : tagId,      

      }

      return requestObject;

    }

    //PACKET TYPE(69) : TAG_CHAT_SENT
    this.getTagChatSentObject = function(tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_SENT,

          /* SPECIFIC PARAMS */
          tagId                   : tagId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(70) : TAG_CHAT_SEEN
    this.getTagChatSeenObject = function(friendId, tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_SEEN,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          tagId                   : tagId,
          packetId                : packetId || getUUIDPacketId(),
          boxId                   : tagId,      

      }

      return requestObject;

    }

    //PACKET TYPE(71) : TAG_CHAT_SEEN_CONFIRMATION
    this.getTagChatSeenConfirmationObject = function(tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_SEEN_CONFIRMATION,

          /* SPECIFIC PARAMS */
          tagId                   : tagId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(72) : TAG_CHAT_MULTIPLE_MSG_DELETE
    this.getTagChatMultipleMsgDeleteObject = function(tagId, packets, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_MULTIPLE_MSG_DELETE,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          packets                 : packets,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(73) : TAG_CHAT_MSG_DELETE_CONFIRMATION
    this.getTagChatMsgDeleteConfirmationObject = function(tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_MSG_DELETE_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(74) : TAG_CHAT_GENERAL_BROKEN_PACKET
    this.getTagChatGeneralBrokenPacketObject = function(tagId, sequenceNo, bytes, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_GENERAL_BROKEN_PACKET,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          sequenceNo              : sequenceNo,
          bytes                   : bytes,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(75) : TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION
    this.getTagChatGeneralBrokenPacketConfirmationObject = function(tagId, sequenceNo, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          sequenceNo              : sequenceNo,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(91) : OFFLINE_FRIEND_INFORMATION
    this.getOfflineFriendInformationObject = function(friendId, fullName, onlineStatus, friendAppType, friendDeviceToken, userMood, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_FRIEND_INFORMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          fullName                : fullName,
          platform                : platform,
          onlineStatus            : onlineStatus,
          friendAppType           : friendAppType,
          friendDeviceToken       : friendDeviceToken,
          userMood                : userMood,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(92) : OFFLINE_FRIEND_INFORMATION_CONFIRMATION
    this.getOfflineFriendInformationConfirmationObject = function(friendId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_FRIEND_INFORMATION_CONFIRMATION,

          /* SPECIFIC PARAMS */
          friendId                : friendId,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(93) : OFFLINE_GET_REQUEST
    this.getOfflineGetRequestObject = function(updateTime, blockUnblockDate, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_GET_REQUEST,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          updateTime              : updateTime,
          blockUnblockDate        : blockUnblockDate,
          appVersion              : getAppVersion(),
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(94) : OFFLINE_GET_REQUEST_CONFIRMATION
    this.getOfflineGetRequestConfirmationObject = function(serverDate, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_GET_REQUEST_CONFIRMATION,

          /* SPECIFIC PARAMS */
          serverDate              : serverDate,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(95) : OFFLINE_FRIEND_UNREAD_MESSAGE
    this.getOfflineFriendUnreadMessageObject = function(messages, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_FRIEND_UNREAD_MESSAGE,

          /* SPECIFIC PARAMS */
          messages                : messages,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(96) : OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION
    this.getOfflineFriendUnreadMessageConfirmationObject = function(packets, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          packets                 : packets,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(97) : OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST
    this.getOfflineFriendHistoryMessageRequestObject = function(friendId, pageDirection, pageLimit, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          pageDirection           : pageDirection,
          pageLimit               : pageLimit,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(98) : OFFLINE_FRIEND_HISTORY_MESSAGE
    this.getOfflineFriendHistoryMessageObject = function(friendId, messages, pageDirection, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE,

          /* SPECIFIC PARAMS */
          friendId                : friendId,
          messages                : messages,
          pageDirection           : pageDirection,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(99) : OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION
    this.getOfflineFriendHistoryMessageConfirmationObject = function(friendId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION,

          /* SPECIFIC PARAMS */
          friendId                : friendId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(100) : OFFLINE_GET_FRIEND_MESSAGE_STATUS
    this.getOfflineGetFriendMessageStatusObject = function(friendId, packets, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_GET_FRIEND_MESSAGE_STATUS,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          friendId                : friendId,
          packets                 : packets,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(101) : OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION
    this.getOfflineGetFriendMessageStatusConfirmationObject = function(friendId, packets, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION,

          /* SPECIFIC PARAMS */
          friendId                : friendId,
          packets                 : packets,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(104) : OFFLINE_TAG_INFORMATION_ACTIVITY
    this.getOfflineTagInformationActivityObject = function(tagId, noOfItems, items, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_TAG_INFORMATION_ACTIVITY,

          /* SPECIFIC PARAMS */
          tagId                   : tagId,
          noOfItems               : noOfItems,
          items                   : items,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(105) : OFFLINE_MY_TAG_LIST
    this.getOfflineMyTagListObject = function(noOfItems, items, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_MY_TAG_LIST,

          /* SPECIFIC PARAMS */
          noOfItems               : noOfItems,
          items                   : items,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(106) : OFFLINE_TAG_UNREAD_MESSAGE
    this.getOfflineTagUnreadMessageObject = function(messages, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_TAG_UNREAD_MESSAGE,

          /* SPECIFIC PARAMS */
          messages                : messages,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(107) : OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION
    this.getOfflineTagUnreadMessageConfirmationObject = function(packets, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          packets                 : packets,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(108) : OFFLINE_TAG_CREATE_TAG
    this.getOfflineTagCreateTagObject = function(tagId, tagName, tagPictureUrl, tagMembers, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_TAG_CREATE_TAG,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          tagName                 : tagName,
          tagPictureUrl           : tagPictureUrl,
          tagMembers              : tagMembers,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(109) : OFFLINE_TAG_CREATE_TAG_CONFIRMATION
    this.getOfflineTagCreateTagConfirmationObject = function(tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_TAG_CREATE_TAG_CONFIRMATION,

          /* SPECIFIC PARAMS */
          tagId                   : tagId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(110) : OFFLINE_TAG_HISTORY_MESSAGE_REQUEST
    this.getOfflineTagHistoryMessageRequestObject = function(tagId, pageDirection, pageLimit, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_TAG_HISTORY_MESSAGE_REQUEST,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          pageDirection           : pageDirection,
          pageLimit               : pageLimit,
          appVersion              : getAppVersion(),
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(111) : OFFLINE_TAG_HISTORY_MESSAGE
    this.getOfflineTagHistoryMessageObject = function(tagId, messages, pageDirection, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_TAG_HISTORY_MESSAGE,

          /* SPECIFIC PARAMS */
          tagId                   : tagId,
          messages                : messages,
          pageDirection           : pageDirection,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(112) : OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS
    this.getOfflineGetTagInformationWithMembersObject = function(tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          tagId                   : tagId,
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(113) : OFFLINE_TAG_INFORMATION_WITH_MEMBERS
    this.getOfflineTagInformationWithMembersObject = function(tagId, tagName, tagPictureUrl, tagMembers, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_TAG_INFORMATION_WITH_MEMBERS,

          /* SPECIFIC PARAMS */
          tagId                   : tagId,
          tagName                 : tagName,
          tagPictureUrl           : tagPictureUrl,
          tagMembers              : tagMembers,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(117) : OFFLINE_TAG_CONFIRMATION
    this.getOfflineTagConfirmationObject = function(tagId, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_TAG_CONFIRMATION,

          /* SPECIFIC PARAMS */
          tagId                   : tagId,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(118) : OFFLINE_BROKEN_HISTORY_PACKET
    this.getOfflineBrokenHistoryPacketObject = function(sequenceNo, bytes, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_BROKEN_HISTORY_PACKET,

          /* SPECIFIC PARAMS */
          sequenceNo              : sequenceNo,
          bytes                   : bytes,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(119) : OFFLINE_BROKEN_PACKET
    this.getOfflineBrokenPacketObject = function(sequenceNo, bytes, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_BROKEN_PACKET,

          /* SPECIFIC PARAMS */
          sequenceNo              : sequenceNo,
          bytes                   : bytes,
          userId                  : getCurrentUserId(),
          platform                : platform,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }

    //PACKET TYPE(120) : OFFLINE_BROKEN_PACKET_CONFIRMATION
    this.getOfflineBrokenPacketConfirmationObject = function(sequenceNo, packetId){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.OFFLINE_BROKEN_PACKET_CONFIRMATION,

          /* SPECIFIC PARAMS */
          userId                  : getCurrentUserId(),
          sequenceNo              : sequenceNo,
          packetId                : packetId || getUUIDPacketId(),      

      }

      return requestObject;

    }


  }

  global.CHAT_APP['ChatRequests'] = new ChatRequests();

})(window);
