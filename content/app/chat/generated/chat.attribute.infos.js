
        var CHAT_PACKET_ATTRIBUTE_INFO = {};

      //ATTRIBUTE NO(1) : PACKET_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.PACKET_TYPE]                    = {    
            ATTRIBUTE_NAME     : "PACKET_TYPE",            
            VAR_NAME           : "packetType",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(2) : USER_ID
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.USER_ID]                    = {    
            ATTRIBUTE_NAME     : "USER_ID",            
            VAR_NAME           : "userId",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(3) : FRIEND_ID
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FRIEND_ID]                    = {    
            ATTRIBUTE_NAME     : "FRIEND_ID",            
            VAR_NAME           : "friendId",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(4) : PACKET_ID_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH]                    = {    
            ATTRIBUTE_NAME     : "PACKET_ID_LENGTH",            
            VAR_NAME           : "packetIdLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(5) : PACKET_ID
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.PACKET_ID]                    = {    
            ATTRIBUTE_NAME     : "PACKET_ID",            
            VAR_NAME           : "packetId",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(6) : PLATFORM
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.PLATFORM]                    = {    
            ATTRIBUTE_NAME     : "PLATFORM",            
            VAR_NAME           : "platform",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(7) : CHAT_BINDING_PORT
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.CHAT_BINDING_PORT]                    = {    
            ATTRIBUTE_NAME     : "CHAT_BINDING_PORT",            
            VAR_NAME           : "chatBindingPort",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 4    
      };

      //ATTRIBUTE NO(8) : TAG_ID
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_ID]                    = {    
            ATTRIBUTE_NAME     : "TAG_ID",            
            VAR_NAME           : "tagId",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(9) : ONLINE_STATUS
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.ONLINE_STATUS]                    = {    
            ATTRIBUTE_NAME     : "ONLINE_STATUS",            
            VAR_NAME           : "onlineStatus",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(10) : USER_MOOD
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.USER_MOOD]                    = {    
            ATTRIBUTE_NAME     : "USER_MOOD",            
            VAR_NAME           : "userMood",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(11) : MESSAGE_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE]                    = {    
            ATTRIBUTE_NAME     : "MESSAGE_TYPE",            
            VAR_NAME           : "messageType",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(12) : TIMEOUT
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TIMEOUT]                    = {    
            ATTRIBUTE_NAME     : "TIMEOUT",            
            VAR_NAME           : "timeout",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(13) : LATITUDE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.LATITUDE]                    = {    
            ATTRIBUTE_NAME     : "LATITUDE",            
            VAR_NAME           : "latitude",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 4    
      };

      //ATTRIBUTE NO(14) : LONGITUDE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.LONGITUDE]                    = {    
            ATTRIBUTE_NAME     : "LONGITUDE",            
            VAR_NAME           : "longitude",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 4    
      };

      //ATTRIBUTE NO(15) : MESSAGE_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH]                    = {    
            ATTRIBUTE_NAME     : "MESSAGE_LENGTH",            
            VAR_NAME           : "messageLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(16) : MESSAGE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.MESSAGE]                    = {    
            ATTRIBUTE_NAME     : "MESSAGE",            
            VAR_NAME           : "message",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(17) : MESSAGE_DATE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE]                    = {    
            ATTRIBUTE_NAME     : "MESSAGE_DATE",            
            VAR_NAME           : "messageDate",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(18) : NO_OF_MESSAGE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.NO_OF_MESSAGE]                    = {    
            ATTRIBUTE_NAME     : "NO_OF_MESSAGE",            
            VAR_NAME           : "messagesLength",
            VAR_CONTAINER_NAME : "messages",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(19) : FULL_NAME_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FULL_NAME_LENGTH]                    = {    
            ATTRIBUTE_NAME     : "FULL_NAME_LENGTH",            
            VAR_NAME           : "fullNameLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(20) : FULL_NAME
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FULL_NAME]                    = {    
            ATTRIBUTE_NAME     : "FULL_NAME",            
            VAR_NAME           : "fullName",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(21) : NO_OF_PACKET
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET]                    = {    
            ATTRIBUTE_NAME     : "NO_OF_PACKET",            
            VAR_NAME           : "packetsLength",
            VAR_CONTAINER_NAME : "packets",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(22) : SEQUENCE_NO
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO]                    = {    
            ATTRIBUTE_NAME     : "SEQUENCE_NO",            
            VAR_NAME           : "sequenceNo",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(23) : NO_OF_MEMBERS
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.NO_OF_MEMBERS]                    = {    
            ATTRIBUTE_NAME     : "NO_OF_MEMBERS",            
            VAR_NAME           : "membersLength",
            VAR_CONTAINER_NAME : "members",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(24) : UPDATE_TIME
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.UPDATE_TIME]                    = {    
            ATTRIBUTE_NAME     : "UPDATE_TIME",            
            VAR_NAME           : "updateTime",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(25) : SERVER_DATE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.SERVER_DATE]                    = {    
            ATTRIBUTE_NAME     : "SERVER_DATE",            
            VAR_NAME           : "serverDate",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(26) : LAST_ONLINE_TIME
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.LAST_ONLINE_TIME]                    = {    
            ATTRIBUTE_NAME     : "LAST_ONLINE_TIME",            
            VAR_NAME           : "lastOnlineTime",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(27) : NO_OF_ITEMS
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.NO_OF_ITEMS]                    = {    
            ATTRIBUTE_NAME     : "NO_OF_ITEMS",            
            VAR_NAME           : "noOfItems",
            VAR_CONTAINER_NAME : "items",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(28) : BLOCK_UNBLOCK_DATE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.BLOCK_UNBLOCK_DATE]                    = {    
            ATTRIBUTE_NAME     : "BLOCK_UNBLOCK_DATE",            
            VAR_NAME           : "blockUnblockDate",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(29) : MESSAGE_STATUS
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.MESSAGE_STATUS]                    = {    
            ATTRIBUTE_NAME     : "MESSAGE_STATUS",            
            VAR_NAME           : "status",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(30) : IS_ADD_TO_DB
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.IS_ADD_TO_DB]                    = {    
            ATTRIBUTE_NAME     : "IS_ADD_TO_DB",            
            VAR_NAME           : "isAddToDb",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(31) : TAG_NAME_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_NAME_LENGTH]                    = {    
            ATTRIBUTE_NAME     : "TAG_NAME_LENGTH",            
            VAR_NAME           : "tagNameLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(32) : TAG_NAME
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_NAME]                    = {    
            ATTRIBUTE_NAME     : "TAG_NAME",            
            VAR_NAME           : "tagName",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(33) : TAG_PICTURE_URL_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL_LENGTH]                    = {    
            ATTRIBUTE_NAME     : "TAG_PICTURE_URL_LENGTH",            
            VAR_NAME           : "tagPictureUrlLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(34) : TAG_PICTURE_URL
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL]                    = {    
            ATTRIBUTE_NAME     : "TAG_PICTURE_URL",            
            VAR_NAME           : "tagPictureUrl",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(35) : TAG_MEMBER_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_MEMBER_TYPE]                    = {    
            ATTRIBUTE_NAME     : "TAG_MEMBER_TYPE",            
            VAR_NAME           : "status",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(36) : TAG_MEMBER_ADDED_BY
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_MEMBER_ADDED_BY]                    = {    
            ATTRIBUTE_NAME     : "TAG_MEMBER_ADDED_BY",            
            VAR_NAME           : "addedBy",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(37) : TAG_NO_OF_MEMBERS
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_NO_OF_MEMBERS]                    = {    
            ATTRIBUTE_NAME     : "TAG_NO_OF_MEMBERS",            
            VAR_NAME           : "tagMembersLength",
            VAR_CONTAINER_NAME : "tagMembers",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(38) : TAG_NO_OF_BROKEN_PKT
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_NO_OF_BROKEN_PKT]                    = {    
            ATTRIBUTE_NAME     : "TAG_NO_OF_BROKEN_PKT",            
            VAR_NAME           : "brokenPacketsLength",
            VAR_CONTAINER_NAME : "brokenPackets",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(39) : TAG_INFORMATION_UPDATE_FLAG
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_INFORMATION_UPDATE_FLAG]                    = {    
            ATTRIBUTE_NAME     : "TAG_INFORMATION_UPDATE_FLAG",            
            VAR_NAME           : "updateFlag",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(40) : TAG_INFORMATION_TAG_NO_OF_MEMBERS
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_INFORMATION_TAG_NO_OF_MEMBERS]                    = {    
            ATTRIBUTE_NAME     : "TAG_INFORMATION_TAG_NO_OF_MEMBERS",            
            VAR_NAME           : "tagMembersCount",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(41) : REGISTRATION_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.REGISTRATION_TYPE]                    = {    
            ATTRIBUTE_NAME     : "REGISTRATION_TYPE",            
            VAR_NAME           : "registrationType",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(42) : PAGE_DIRECTION
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.PAGE_DIRECTION]                    = {    
            ATTRIBUTE_NAME     : "PAGE_DIRECTION",            
            VAR_NAME           : "pageDirection",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(43) : PAGE_LIMIT
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.PAGE_LIMIT]                    = {    
            ATTRIBUTE_NAME     : "PAGE_LIMIT",            
            VAR_NAME           : "pageLimit",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(45) : ACTIVITY_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.ACTIVITY_TYPE]                    = {    
            ATTRIBUTE_NAME     : "ACTIVITY_TYPE",
            VAR_NAME           : "activityType",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1,
            CONDITIONAL        : true,    
      };

      //ATTRIBUTE NO(46) : ACTIVITY_VALUE_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.ACTIVITY_VALUE_LENGTH]                    = {    
            ATTRIBUTE_NAME     : "ACTIVITY_VALUE_LENGTH",            
            VAR_NAME           : "activityValueLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(47) : ACTIVITY_VALUE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.ACTIVITY_VALUE]                    = {    
            ATTRIBUTE_NAME     : "ACTIVITY_VALUE",            
            VAR_NAME           : "activityValue",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(48) : CHANGED_BY_USER_ID
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.CHANGED_BY_USER_ID]                    = {    
            ATTRIBUTE_NAME     : "CHANGED_BY_USER_ID",            
            VAR_NAME           : "changedByUserId",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(60) : FRIEND_APP_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FRIEND_APP_TYPE]                    = {    
            ATTRIBUTE_NAME     : "FRIEND_APP_TYPE",            
            VAR_NAME           : "friendAppType",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(61) : FRIEND_DEVICE_TOKEN_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FRIEND_DEVICE_TOKEN_LENGTH]                    = {    
            ATTRIBUTE_NAME     : "FRIEND_DEVICE_TOKEN_LENGTH",            
            VAR_NAME           : "friendDeviceTokenLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(62) : FRIEND_DEVICE_TOKEN
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FRIEND_DEVICE_TOKEN]                    = {    
            ATTRIBUTE_NAME     : "FRIEND_DEVICE_TOKEN",            
            VAR_NAME           : "friendDeviceToken",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(63) : IS_SECRET_VISIBLE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.IS_SECRET_VISIBLE]                    = {    
            ATTRIBUTE_NAME     : "IS_SECRET_VISIBLE",            
            VAR_NAME           : "isSecretVisible",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(64) : APP_VERSION
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.APP_VERSION]                    = {    
            ATTRIBUTE_NAME     : "APP_VERSION",            
            VAR_NAME           : "appVersion",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(80) : RAW_DATA_BYTE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.RAW_DATA_BYTE]                    = {    
            ATTRIBUTE_NAME     : "RAW_DATA_BYTE",            
            VAR_NAME           : "bytes",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.BYTE,
            SIZE               : -2    
      };

