;(function(global){
      //For Main App global == window
      //For Worker global == self

      //Dependencies 
      //- app/chat/shared/chat.constans.js

      var ChatConstants           = global.CHAT_APP.Constants;
      var FRIEND_CHAT_PACKET_TYPE = ChatConstants.FRIEND_CHAT_PACKET_TYPE;
      var TAG_CHAT_PACKET_TYPE    = ChatConstants.TAG_CHAT_PACKET_TYPE;
      var OFFLINE_PACKET_TYPE     = ChatConstants.OFFLINE_PACKET_TYPE;
      var PACKET_CONSTANTS        = ChatConstants.PACKET_CONSTANTS

      /*************************************************  PACKET ATTRIBUTES **********************************************/


      var CHAT_PACKET_ATTRIBUTE = {
            PACKET_TYPE                       : 1,
            USER_ID                           : 2,
            FRIEND_ID                         : 3,
            PACKET_ID_LENGTH                  : 4,
            PACKET_ID                         : 5,
            PLATFORM                          : 6,
            CHAT_BINDING_PORT                 : 7,
            TAG_ID                            : 8,
            ONLINE_STATUS                     : 9,
            USER_MOOD                         : 10,
            MESSAGE_TYPE                      : 11,
            TIMEOUT                           : 12,
            LATITUDE                          : 13,
            LONGITUDE                         : 14,
            MESSAGE_LENGTH                    : 15,
            MESSAGE                           : 16,
            MESSAGE_DATE                      : 17,
            NO_OF_MESSAGE                     : 18,
            FULL_NAME_LENGTH                  : 19,
            FULL_NAME                         : 20,
            NO_OF_PACKET                      : 21,
            SEQUENCE_NO                       : 22,
            NO_OF_MEMBERS                     : 23,
            UPDATE_TIME                       : 24,
            SERVER_DATE                       : 25,
            LAST_ONLINE_TIME                  : 26,
            NO_OF_ITEMS                       : 27,
            BLOCK_UNBLOCK_DATE                : 28,
            MESSAGE_STATUS                    : 29,
            IS_ADD_TO_DB                      : 30,

            TAG_NAME_LENGTH                   : 31,
            TAG_NAME                          : 32,
            TAG_PICTURE_URL_LENGTH            : 33,
            TAG_PICTURE_URL                   : 34,
            TAG_MEMBER_TYPE                   : 35,
            TAG_MEMBER_ADDED_BY               : 36,
            TAG_NO_OF_MEMBERS                 : 37,
            TAG_NO_OF_BROKEN_PKT              : 38,
            TAG_INFORMATION_UPDATE_FLAG       : 39,
            TAG_INFORMATION_TAG_NO_OF_MEMBERS : 40,

            REGISTRATION_TYPE                 : 41,
            PAGE_DIRECTION                    : 42,
            PAGE_LIMIT                        : 43,
            ACTIVITY_TYPE                     : 45,
            ACTIVITY_VALUE_LENGTH             : 46,
            ACTIVITY_VALUE                    : 47,
            CHANGED_BY_USER_ID                : 48,

            FRIEND_APP_TYPE                   : 60,
            FRIEND_DEVICE_TOKEN_LENGTH        : 61,
            FRIEND_DEVICE_TOKEN               : 62,
            IS_SECRET_VISIBLE                 : 63,

            APP_VERSION                       : 64,

            RAW_DATA_BYTE                     : 80

      };

      /*************************************************  PACKET ATTRIBUTES DEFINATION ***********************************/
      
      var CHAT_PACKET_ATTRIBUTE_INFO                                                      = {};

      //ATTRIBUTE NO(1) : PACKET_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.PACKET_TYPE]                       = {
            ATTRIBUTE_NAME     : "PACKET_TYPE",            
            VAR_NAME           : "packetType",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(2) : USER_ID
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.USER_ID]                           = {
            ATTRIBUTE_NAME     : "USER_ID",            
            VAR_NAME           : "userId",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(3) : FRIEND_ID
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FRIEND_ID]                         = {
            ATTRIBUTE_NAME     : "FRIEND_ID",            
            VAR_NAME           : "friendId",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(4) : PACKET_ID_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH]                  = {
            ATTRIBUTE_NAME     : "PACKET_ID_LENGTH",            
            VAR_NAME           : "packetIdLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(5) : PACKET_ID
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.PACKET_ID]                         = {
            ATTRIBUTE_NAME     : "PACKET_ID",            
            VAR_NAME           : "packetId",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(6) : PLATFORM
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.PLATFORM]                          = {
            ATTRIBUTE_NAME     : "PLATFORM",            
            VAR_NAME           : "platform",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(7) : CHAT_BINDING_PORT
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.CHAT_BINDING_PORT]                 = {
            ATTRIBUTE_NAME     : "CHAT_BINDING_PORT",            
            VAR_NAME           : "chatBindingPort",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 4    
      };

      //ATTRIBUTE NO(8) : TAG_ID
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_ID]                            = {
            ATTRIBUTE_NAME     : "TAG_ID",            
            VAR_NAME           : "tagId",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(9) : ONLINE_STATUS
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.ONLINE_STATUS]                     = {
            ATTRIBUTE_NAME     : "ONLINE_STATUS",            
            VAR_NAME           : "onlineStatus",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(10) : USER_MOOD
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.USER_MOOD]                         = {
            ATTRIBUTE_NAME     : "USER_MOOD",            
            VAR_NAME           : "userMood",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(11) : MESSAGE_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE]                      = {
            ATTRIBUTE_NAME     : "MESSAGE_TYPE",            
            VAR_NAME           : "messageType",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(12) : TIMEOUT
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TIMEOUT]                           = {
            ATTRIBUTE_NAME     : "TIMEOUT",            
            VAR_NAME           : "timeout",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(13) : LATITUDE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.LATITUDE]                          = {
            ATTRIBUTE_NAME     : "LATITUDE",            
            VAR_NAME           : "latitude",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 4    
      };

      //ATTRIBUTE NO(14) : LONGITUDE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.LONGITUDE]                         = {
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
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.MESSAGE]                           = {
            ATTRIBUTE_NAME     : "MESSAGE",            
            VAR_NAME           : "message",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(17) : MESSAGE_DATE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE]                      = {
            ATTRIBUTE_NAME     : "MESSAGE_DATE",            
            VAR_NAME           : "messageDate",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(18) : NO_OF_MESSAGE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.NO_OF_MESSAGE]                     = {
            ATTRIBUTE_NAME     : "NO_OF_MESSAGE",            
            VAR_NAME           : "messagesLength",
            VAR_CONTAINER_NAME : "messages",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(19) : FULL_NAME_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FULL_NAME_LENGTH]                  = {
            ATTRIBUTE_NAME     : "FULL_NAME_LENGTH",            
            VAR_NAME           : "fullNameLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(20) : FULL_NAME
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FULL_NAME]                         = {
            ATTRIBUTE_NAME     : "FULL_NAME",            
            VAR_NAME           : "fullName",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(21) : NO_OF_PACKET
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET]                      = {
            ATTRIBUTE_NAME     : "NO_OF_PACKET",            
            VAR_NAME           : "packetsLength",
            VAR_CONTAINER_NAME : "packets",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(22) : SEQUENCE_NO
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO]                       = {
            ATTRIBUTE_NAME     : "SEQUENCE_NO",            
            VAR_NAME           : "sequenceNo",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(23) : NO_OF_MEMBERS
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.NO_OF_MEMBERS]                     = {
            ATTRIBUTE_NAME     : "NO_OF_MEMBERS",            
            VAR_NAME           : "membersLength",
            VAR_CONTAINER_NAME : "members",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(24) : UPDATE_TIME
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.UPDATE_TIME]                       = {
            ATTRIBUTE_NAME     : "UPDATE_TIME",            
            VAR_NAME           : "updateTime",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(25) : SERVER_DATE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.SERVER_DATE]                       = {
            ATTRIBUTE_NAME     : "SERVER_DATE",            
            VAR_NAME           : "serverDate",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(26) : LAST_ONLINE_TIME
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.LAST_ONLINE_TIME]                  = {
            ATTRIBUTE_NAME     : "LAST_ONLINE_TIME",            
            VAR_NAME           : "lastOnlineTime",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(27) : NO_OF_ITEMS
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.NO_OF_ITEMS]                       = {
            ATTRIBUTE_NAME     : "NO_OF_ITEMS",            
            VAR_NAME           : "noOfItems",
            VAR_CONTAINER_NAME : "items",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(28) : BLOCK_UNBLOCK_DATE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.BLOCK_UNBLOCK_DATE]                = {
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
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.IS_ADD_TO_DB]                      = {
            ATTRIBUTE_NAME     : "IS_ADD_TO_DB",            
            VAR_NAME           : "isAddToDb",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(31) : TAG_NAME_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_NAME_LENGTH]                   = {
            ATTRIBUTE_NAME     : "TAG_NAME_LENGTH",            
            VAR_NAME           : "tagNameLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(32) : TAG_NAME
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_NAME]                          = {
            ATTRIBUTE_NAME     : "TAG_NAME",            
            VAR_NAME           : "tagName",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(33) : TAG_PICTURE_URL_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL_LENGTH]            = {
            ATTRIBUTE_NAME     : "TAG_PICTURE_URL_LENGTH",            
            VAR_NAME           : "tagPictureUrlLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(34) : TAG_PICTURE_URL
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL]                   = {
            ATTRIBUTE_NAME     : "TAG_PICTURE_URL",            
            VAR_NAME           : "tagPictureUrl",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(35) : TAG_MEMBER_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_MEMBER_TYPE]                   = {
            ATTRIBUTE_NAME     : "TAG_MEMBER_TYPE",            
            VAR_NAME           : "status",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(36) : TAG_MEMBER_ADDED_BY
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_MEMBER_ADDED_BY]               = {
            ATTRIBUTE_NAME     : "TAG_MEMBER_ADDED_BY",            
            VAR_NAME           : "addedBy",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(37) : TAG_NO_OF_MEMBERS
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_NO_OF_MEMBERS]                 = {
            ATTRIBUTE_NAME     : "TAG_NO_OF_MEMBERS",            
            VAR_NAME           : "tagMembersLength",
            VAR_CONTAINER_NAME : "tagMembers",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(38) : TAG_NO_OF_BROKEN_PKT
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_NO_OF_BROKEN_PKT]              = {
            ATTRIBUTE_NAME     : "TAG_NO_OF_BROKEN_PKT",            
            VAR_NAME           : "brokenPacketsLength",
            VAR_CONTAINER_NAME : "brokenPackets",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(39) : TAG_INFORMATION_UPDATE_FLAG
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_INFORMATION_UPDATE_FLAG]       = {
            ATTRIBUTE_NAME     : "TAG_INFORMATION_UPDATE_FLAG",            
            VAR_NAME           : "updateFlag",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(40) : TAG_INFORMATION_TAG_NO_OF_MEMBERS
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.TAG_INFORMATION_TAG_NO_OF_MEMBERS] = {
            ATTRIBUTE_NAME     : "TAG_INFORMATION_TAG_NO_OF_MEMBERS",            
            VAR_NAME           : "tagMembersCount",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(41) : REGISTRATION_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.REGISTRATION_TYPE]                 = {
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
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.PAGE_LIMIT]                        = {
            ATTRIBUTE_NAME     : "PAGE_LIMIT",            
            VAR_NAME           : "pageLimit",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(45) : ACTIVITY_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.ACTIVITY_TYPE]                     = {
            ATTRIBUTE_NAME     : "ACTIVITY_TYPE",
            VAR_NAME           : "activityType",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1,
            CONDITIONAL        : true,    
      };

      //ATTRIBUTE NO(46) : ACTIVITY_VALUE_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.ACTIVITY_VALUE_LENGTH]             = {
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
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.CHANGED_BY_USER_ID]                = {
            ATTRIBUTE_NAME     : "CHANGED_BY_USER_ID",            
            VAR_NAME           : "changedByUserId",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 8    
      };

      //ATTRIBUTE NO(60) : FRIEND_APP_TYPE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FRIEND_APP_TYPE]                   = {
            ATTRIBUTE_NAME     : "FRIEND_APP_TYPE",            
            VAR_NAME           : "friendAppType",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(61) : FRIEND_DEVICE_TOKEN_LENGTH
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FRIEND_DEVICE_TOKEN_LENGTH]        = {
            ATTRIBUTE_NAME     : "FRIEND_DEVICE_TOKEN_LENGTH",            
            VAR_NAME           : "friendDeviceTokenLength",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(62) : FRIEND_DEVICE_TOKEN
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.FRIEND_DEVICE_TOKEN]               = {
            ATTRIBUTE_NAME     : "FRIEND_DEVICE_TOKEN",            
            VAR_NAME           : "friendDeviceToken",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING,
            SIZE               : -1    
      };

      //ATTRIBUTE NO(63) : IS_SECRET_VISIBLE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.IS_SECRET_VISIBLE]                 = {
            ATTRIBUTE_NAME     : "IS_SECRET_VISIBLE",            
            VAR_NAME           : "isSecretVisible",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 1    
      };

      //ATTRIBUTE NO(64) : APP_VERSION
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.APP_VERSION]                       = {
            ATTRIBUTE_NAME     : "APP_VERSION",            
            VAR_NAME           : "appVersion",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER,
            SIZE               : 2    
      };

      //ATTRIBUTE NO(80) : RAW_DATA_BYTE
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.RAW_DATA_BYTE]                     = {
            ATTRIBUTE_NAME     : "RAW_DATA_BYTE",            
            VAR_NAME           : "bytes",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.BYTE,
            SIZE               : -2    
      };


      /*************************************************  PACKET FORMAT DEFINATION ***********************************/


      var CHAT_PACKET_INFO = {};

      //PACKET TYPE(1) : FRIEND_CHAT_REGISTER
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_REGISTER ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_REGISTER",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(2) : FRIEND_CHAT_UNREGISTER
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_UNREGISTER ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_UNREGISTER",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM, 
                CHAT_PACKET_ATTRIBUTE.ONLINE_STATUS, 
                CHAT_PACKET_ATTRIBUTE.USER_MOOD 

            ]
      };

      //PACKET TYPE(3) : FRIEND_CHAT_REGISTER_CONFIRMATION
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_REGISTER_CONFIRMATION ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_REGISTER_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.CHAT_BINDING_PORT, 
                CHAT_PACKET_ATTRIBUTE.SERVER_DATE 

            ]
      };

      //PACKET TYPE(4) : FRIEND_CHAT_IDLE
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_IDLE ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_IDLE",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(5) : FRIEND_CHAT_TYPING
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_TYPING ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_TYPING",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(6) : FRIEND_CHAT_MSG
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_MSG",
            BROKEN_CONTAINER    : "message",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TIMEOUT, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE, 
                CHAT_PACKET_ATTRIBUTE.IS_SECRET_VISIBLE, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(7) : FRIEND_CHAT_MSG_EDIT
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG_EDIT ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_MSG_EDIT",
            BROKEN_CONTAINER    : "message",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TIMEOUT, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE, 
                CHAT_PACKET_ATTRIBUTE.IS_SECRET_VISIBLE, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(8) : FRIEND_CHAT_BROKEN_MSG
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_BROKEN_MSG",
            BROKEN_CONTAINER    : "message",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TIMEOUT, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE, 
                CHAT_PACKET_ATTRIBUTE.IS_SECRET_VISIBLE, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(9) : FRIEND_CHAT_BROKEN_MSG_EDIT
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG_EDIT ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_BROKEN_MSG_EDIT",
            BROKEN_CONTAINER    : "message",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TIMEOUT, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE, 
                CHAT_PACKET_ATTRIBUTE.IS_SECRET_VISIBLE, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(10) : FRIEND_CHAT_MULTIPLE_MSG
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MULTIPLE_MSG ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_MULTIPLE_MSG",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_MESSAGE, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_TYPE,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE,
                  CHAT_PACKET_ATTRIBUTE.TIMEOUT,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE,
                  CHAT_PACKET_ATTRIBUTE.IS_SECRET_VISIBLE
                ]

            ]
      };

      //PACKET TYPE(15) : FRIEND_CHAT_DELIVERED
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_DELIVERED ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_DELIVERED",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(16) : FRIEND_CHAT_SENT
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SENT ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_SENT",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(17) : FRIEND_CHAT_SEEN
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_SEEN",
            BROKEN_CONTAINER    : "messages",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_MESSAGE, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_STATUS
                ],
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(18) : FRIEND_CHAT_SEEN_CONFIRMATION
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN_CONFIRMATION ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_SEEN_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(19) : FRIEND_CHAT_MULTIPLE_MSG_DELETE
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MULTIPLE_MSG_DELETE ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_MULTIPLE_MSG_DELETE",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID
                ]

            ]
      };

      //PACKET TYPE(20) : FRIEND_CHAT_MSG_DELETE_CONFIRMATION
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG_DELETE_CONFIRMATION ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_MSG_DELETE_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(24) : FRIEND_CHAT_BROKEN
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_BROKEN",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO, 
                CHAT_PACKET_ATTRIBUTE.RAW_DATA_BYTE 

            ]
      };

      //PACKET TYPE(25) : FRIEND_CHAT_BROKEN_CONFIRMATION
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_CONFIRMATION ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_BROKEN_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO 

            ]
      };

      //PACKET TYPE(27) : FRIEND_CHAT_BLOCK
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BLOCK ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_BLOCK",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.BLOCK_UNBLOCK_DATE, 
                CHAT_PACKET_ATTRIBUTE.IS_ADD_TO_DB 

            ]
      };

      //PACKET TYPE(28) : FRIEND_CHAT_UNBLOCK
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_UNBLOCK ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_UNBLOCK",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.BLOCK_UNBLOCK_DATE 

            ]
      };

      //PACKET TYPE(29) : FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION
      CHAT_PACKET_INFO[ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION ] =
      {
            PACKET_NAME         : "FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(41) : TAG_CHAT_TAG_REGISTER
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_REGISTER ] =
      {
            PACKET_NAME         : "TAG_CHAT_TAG_REGISTER",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(42) : TAG_CHAT_TAG_UNREGISTER
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_UNREGISTER ] =
      {
            PACKET_NAME         : "TAG_CHAT_TAG_UNREGISTER",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.ONLINE_STATUS, 
                CHAT_PACKET_ATTRIBUTE.USER_MOOD 

            ]
      };

      //PACKET TYPE(43) : TAG_CHAT_TAG_REGISTER_CONFIRMATION
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_REGISTER_CONFIRMATION ] =
      {
            PACKET_NAME         : "TAG_CHAT_TAG_REGISTER_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.CHAT_BINDING_PORT, 
                CHAT_PACKET_ATTRIBUTE.SERVER_DATE 

            ]
      };

      //PACKET TYPE(46) : TAG_CHAT_TAG_INFORMATION
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_INFORMATION ] =
      {
            PACKET_NAME         : "TAG_CHAT_TAG_INFORMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.ACTIVITY_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TAG_NAME_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.TAG_NAME, 
                CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL 

            ]
      };

      //PACKET TYPE(47) : TAG_CHAT_TAG_INFORMATION_CONFIRMATION
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_INFORMATION_CONFIRMATION ] =
      {
            PACKET_NAME         : "TAG_CHAT_TAG_INFORMATION_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(51) : TAG_CHAT_TAG_MEMBER_ADD
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_ADD ] =
      {
            PACKET_NAME         : "TAG_CHAT_TAG_MEMBER_ADD",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_NO_OF_MEMBERS, 
                [
                  CHAT_PACKET_ATTRIBUTE.USER_ID,
                  CHAT_PACKET_ATTRIBUTE.FULL_NAME_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.FULL_NAME,
                  CHAT_PACKET_ATTRIBUTE.TAG_MEMBER_TYPE
                ]

            ]
      };

      //PACKET TYPE(52) : TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION ] =
      {
            PACKET_NAME         : "TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(53) : TAG_CHAT_MEMBER_REMOVE_LEAVE
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_MEMBER_REMOVE_LEAVE ] =
      {
            PACKET_NAME         : "TAG_CHAT_MEMBER_REMOVE_LEAVE",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_NO_OF_MEMBERS, 
                [
                  CHAT_PACKET_ATTRIBUTE.USER_ID,
        
                ]

            ]
      };

      //PACKET TYPE(54) : TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION ] =
      {
            PACKET_NAME         : "TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(55) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE ] =
      {
            PACKET_NAME         : "TAG_CHAT_TAG_MEMBER_TYPE_CHANGE",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_NO_OF_MEMBERS, 
                [
                  CHAT_PACKET_ATTRIBUTE.USER_ID,
                  CHAT_PACKET_ATTRIBUTE.TAG_MEMBER_TYPE
                ]

            ]
      };

      //PACKET TYPE(56) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION ] =
      {
            PACKET_NAME         : "TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(61) : TAG_CHAT_IDLE
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_IDLE ] =
      {
            PACKET_NAME         : "TAG_CHAT_IDLE",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(62) : TAG_CHAT_TYPING
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_TYPING ] =
      {
            PACKET_NAME         : "TAG_CHAT_TYPING",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(63) : TAG_CHAT_MSG
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG ] =
      {
            PACKET_NAME         : "TAG_CHAT_MSG",
            BROKEN_CONTAINER    : "message",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE 

            ]
      };

      //PACKET TYPE(64) : TAG_CHAT_MSG_EDIT
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG_EDIT ] =
      {
            PACKET_NAME         : "TAG_CHAT_MSG_EDIT",
            BROKEN_CONTAINER    : "message",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE 

            ]
      };

      //PACKET TYPE(65) : TAG_CHAT_BROKEN_MSG
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG ] =
      {
            PACKET_NAME         : "TAG_CHAT_BROKEN_MSG",
            BROKEN_CONTAINER    : "message",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE 

            ]
      };

      //PACKET TYPE(66) : TAG_CHAT_BROKEN_MSG_EDIT
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG_EDIT ] =
      {
            PACKET_NAME         : "TAG_CHAT_BROKEN_MSG_EDIT",
            BROKEN_CONTAINER    : "message",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE 

            ]
      };

      //PACKET TYPE(67) : TAG_CHAT_MULTIPLE_MSG
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_MULTIPLE_MSG ] =
      {
            PACKET_NAME         : "TAG_CHAT_MULTIPLE_MSG",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_MESSAGE, 
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE, 
                CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE 

            ]
      };

      //PACKET TYPE(68) : TAG_CHAT_DELIVERED
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_DELIVERED ] =
      {
            PACKET_NAME         : "TAG_CHAT_DELIVERED",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(69) : TAG_CHAT_SENT
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_SENT ] =
      {
            PACKET_NAME         : "TAG_CHAT_SENT",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(70) : TAG_CHAT_SEEN
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_SEEN ] =
      {
            PACKET_NAME         : "TAG_CHAT_SEEN",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(71) : TAG_CHAT_SEEN_CONFIRMATION
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_SEEN_CONFIRMATION ] =
      {
            PACKET_NAME         : "TAG_CHAT_SEEN_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(72) : TAG_CHAT_MULTIPLE_MSG_DELETE
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_MULTIPLE_MSG_DELETE ] =
      {
            PACKET_NAME         : "TAG_CHAT_MULTIPLE_MSG_DELETE",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID
                ]

            ]
      };

      //PACKET TYPE(73) : TAG_CHAT_MSG_DELETE_CONFIRMATION
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG_DELETE_CONFIRMATION ] =
      {
            PACKET_NAME         : "TAG_CHAT_MSG_DELETE_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(74) : TAG_CHAT_GENERAL_BROKEN_PACKET
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_GENERAL_BROKEN_PACKET ] =
      {
            PACKET_NAME         : "TAG_CHAT_GENERAL_BROKEN_PACKET",
            BROKEN_CONTAINER    : "bytes",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO, 
                CHAT_PACKET_ATTRIBUTE.RAW_DATA_BYTE 

            ]
      };

      //PACKET TYPE(75) : TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION
      CHAT_PACKET_INFO[ TAG_CHAT_PACKET_TYPE.TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION ] =
      {
            PACKET_NAME         : "TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO 

            ]
      };

      //PACKET TYPE(91) : OFFLINE_FRIEND_INFORMATION
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_INFORMATION ] =
      {
            PACKET_NAME         : "OFFLINE_FRIEND_INFORMATION",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.FULL_NAME_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.FULL_NAME, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM, 
                CHAT_PACKET_ATTRIBUTE.ONLINE_STATUS, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_APP_TYPE, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_DEVICE_TOKEN_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_DEVICE_TOKEN, 
                CHAT_PACKET_ATTRIBUTE.USER_MOOD 

            ]
      };

      //PACKET TYPE(92) : OFFLINE_FRIEND_INFORMATION_CONFIRMATION
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_INFORMATION_CONFIRMATION ] =
      {
            PACKET_NAME         : "OFFLINE_FRIEND_INFORMATION_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(93) : OFFLINE_GET_REQUEST
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_GET_REQUEST ] =
      {
            PACKET_NAME         : "OFFLINE_GET_REQUEST",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.UPDATE_TIME, 
                CHAT_PACKET_ATTRIBUTE.BLOCK_UNBLOCK_DATE, 
                CHAT_PACKET_ATTRIBUTE.APP_VERSION, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(94) : OFFLINE_GET_REQUEST_CONFIRMATION
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_GET_REQUEST_CONFIRMATION ] =
      {
            PACKET_NAME         : "OFFLINE_GET_REQUEST_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.SERVER_DATE 

            ]
      };

      //PACKET TYPE(95) : OFFLINE_FRIEND_UNREAD_MESSAGE
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_UNREAD_MESSAGE ] =
      {
            PACKET_NAME         : "OFFLINE_FRIEND_UNREAD_MESSAGE",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_MESSAGE, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_TYPE,
                  CHAT_PACKET_ATTRIBUTE.USER_ID,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE,
                  CHAT_PACKET_ATTRIBUTE.TIMEOUT,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE,
                  CHAT_PACKET_ATTRIBUTE.IS_SECRET_VISIBLE
                ]

            ]
      };

      //PACKET TYPE(96) : OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION ] =
      {
            PACKET_NAME         : "OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION",
            BROKEN_CONTAINER    : "packets",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID
                ]

            ]
      };

      //PACKET TYPE(97) : OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST ] =
      {
            PACKET_NAME         : "OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.PAGE_DIRECTION, 
                CHAT_PACKET_ATTRIBUTE.PAGE_LIMIT, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(98) : OFFLINE_FRIEND_HISTORY_MESSAGE
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_HISTORY_MESSAGE ] =
      {
            PACKET_NAME         : "OFFLINE_FRIEND_HISTORY_MESSAGE",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_MESSAGE, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_TYPE,
                  CHAT_PACKET_ATTRIBUTE.USER_ID,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE,
                  CHAT_PACKET_ATTRIBUTE.TIMEOUT,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE,
                  CHAT_PACKET_ATTRIBUTE.IS_SECRET_VISIBLE,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_STATUS
                ],
                CHAT_PACKET_ATTRIBUTE.PAGE_DIRECTION 

            ]
      };

      //PACKET TYPE(99) : OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION ] =
      {
            PACKET_NAME         : "OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(100) : OFFLINE_GET_FRIEND_MESSAGE_STATUS
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_GET_FRIEND_MESSAGE_STATUS ] =
      {
            PACKET_NAME         : "OFFLINE_GET_FRIEND_MESSAGE_STATUS",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID
                ],
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(101) : OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION ] =
      {
            PACKET_NAME         : "OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.FRIEND_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID
                ]

            ]
      };

      //PACKET TYPE(104) : OFFLINE_TAG_INFORMATION_ACTIVITY
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_TAG_INFORMATION_ACTIVITY ] =
      {
            PACKET_NAME         : "OFFLINE_TAG_INFORMATION_ACTIVITY",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_ITEMS, 
                [
                  CHAT_PACKET_ATTRIBUTE.ACTIVITY_TYPE,
                  CHAT_PACKET_ATTRIBUTE.USER_ID,
                  CHAT_PACKET_ATTRIBUTE.ACTIVITY_VALUE_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.ACTIVITY_VALUE,
                  CHAT_PACKET_ATTRIBUTE.TAG_MEMBER_TYPE,
                  CHAT_PACKET_ATTRIBUTE.CHANGED_BY_USER_ID,
                  CHAT_PACKET_ATTRIBUTE.UPDATE_TIME
                ]

            ]
      };

      //PACKET TYPE(105) : OFFLINE_MY_TAG_LIST
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_MY_TAG_LIST ] =
      {
            PACKET_NAME         : "OFFLINE_MY_TAG_LIST",
            BROKEN_CONTAINER    : "items",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_ITEMS, 
                [
                  CHAT_PACKET_ATTRIBUTE.TAG_ID,
                  CHAT_PACKET_ATTRIBUTE.TAG_NAME_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.TAG_NAME,
                  CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL,
                  CHAT_PACKET_ATTRIBUTE.TAG_MEMBER_ADDED_BY,
                  CHAT_PACKET_ATTRIBUTE.TAG_INFORMATION_TAG_NO_OF_MEMBERS
                ]

            ]
      };

      //PACKET TYPE(106) : OFFLINE_TAG_UNREAD_MESSAGE
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_TAG_UNREAD_MESSAGE ] =
      {
            PACKET_NAME         : "OFFLINE_TAG_UNREAD_MESSAGE",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_MESSAGE, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_TYPE,
                  CHAT_PACKET_ATTRIBUTE.USER_ID,
                  CHAT_PACKET_ATTRIBUTE.TAG_ID,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE
                ]

            ]
      };

      //PACKET TYPE(107) : OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION ] =
      {
            PACKET_NAME         : "OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION",
            BROKEN_CONTAINER    : "packets",
            CONFIRMATION        : false,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID
                ]

            ]
      };

      //PACKET TYPE(108) : OFFLINE_TAG_CREATE_TAG
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_TAG_CREATE_TAG ] =
      {
            PACKET_NAME         : "OFFLINE_TAG_CREATE_TAG",
            CONFIRMATION        : true,
            BROKEN              : true,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_NAME_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.TAG_NAME, 
                CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL, 
                CHAT_PACKET_ATTRIBUTE.TAG_NO_OF_MEMBERS, 
                [
                  CHAT_PACKET_ATTRIBUTE.USER_ID,
                  CHAT_PACKET_ATTRIBUTE.FULL_NAME_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.FULL_NAME,
                  CHAT_PACKET_ATTRIBUTE.TAG_MEMBER_TYPE
                ],
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(109) : OFFLINE_TAG_CREATE_TAG_CONFIRMATION
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_TAG_CREATE_TAG_CONFIRMATION ] =
      {
            PACKET_NAME         : "OFFLINE_TAG_CREATE_TAG_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(110) : OFFLINE_TAG_HISTORY_MESSAGE_REQUEST
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_TAG_HISTORY_MESSAGE_REQUEST ] =
      {
            PACKET_NAME         : "OFFLINE_TAG_HISTORY_MESSAGE_REQUEST",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.PAGE_DIRECTION, 
                CHAT_PACKET_ATTRIBUTE.PAGE_LIMIT, 
                CHAT_PACKET_ATTRIBUTE.APP_VERSION, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(111) : OFFLINE_TAG_HISTORY_MESSAGE
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_TAG_HISTORY_MESSAGE ] =
      {
            PACKET_NAME         : "OFFLINE_TAG_HISTORY_MESSAGE",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_MESSAGE, 
                [
                  CHAT_PACKET_ATTRIBUTE.PACKET_TYPE,
                  CHAT_PACKET_ATTRIBUTE.USER_ID,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.PACKET_ID,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_TYPE,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE,
                  CHAT_PACKET_ATTRIBUTE.MESSAGE_DATE
                ],
                CHAT_PACKET_ATTRIBUTE.PAGE_DIRECTION 

            ]
      };

      //PACKET TYPE(112) : OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS ] =
      {
            PACKET_NAME         : "OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 

            ]
      };

      //PACKET TYPE(113) : OFFLINE_TAG_INFORMATION_WITH_MEMBERS
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_TAG_INFORMATION_WITH_MEMBERS ] =
      {
            PACKET_NAME         : "OFFLINE_TAG_INFORMATION_WITH_MEMBERS",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.TAG_NAME_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.TAG_NAME, 
                CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.TAG_PICTURE_URL, 
                CHAT_PACKET_ATTRIBUTE.TAG_NO_OF_MEMBERS, 
                [
                  CHAT_PACKET_ATTRIBUTE.USER_ID,
                  CHAT_PACKET_ATTRIBUTE.FULL_NAME_LENGTH,
                  CHAT_PACKET_ATTRIBUTE.FULL_NAME,
                  CHAT_PACKET_ATTRIBUTE.TAG_MEMBER_TYPE,
                  CHAT_PACKET_ATTRIBUTE.TAG_MEMBER_ADDED_BY
                ]

            ]
      };

      //PACKET TYPE(117) : OFFLINE_TAG_CONFIRMATION
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_TAG_CONFIRMATION ] =
      {
            PACKET_NAME         : "OFFLINE_TAG_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.TAG_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID 

            ]
      };

      //PACKET TYPE(118) : OFFLINE_BROKEN_HISTORY_PACKET
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_HISTORY_PACKET ] =
      {
            PACKET_NAME         : "OFFLINE_BROKEN_HISTORY_PACKET",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO, 
                CHAT_PACKET_ATTRIBUTE.RAW_DATA_BYTE 

            ]
      };

      //PACKET TYPE(119) : OFFLINE_BROKEN_PACKET
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_PACKET ] =
      {
            PACKET_NAME         : "OFFLINE_BROKEN_PACKET",
            BROKEN_CONTAINER    : "bytes",
            CONFIRMATION        : true,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.NO_OF_PACKET, 
                CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO, 
                CHAT_PACKET_ATTRIBUTE.RAW_DATA_BYTE,
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.PLATFORM 
            ]
      };

      //PACKET TYPE(120) : OFFLINE_BROKEN_PACKET_CONFIRMATION
      CHAT_PACKET_INFO[ OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_PACKET_CONFIRMATION ] =
      {
            PACKET_NAME         : "OFFLINE_BROKEN_PACKET_CONFIRMATION",
            CONFIRMATION        : false,
            BROKEN              : false,
            FORMAT:[
                CHAT_PACKET_ATTRIBUTE.PACKET_TYPE, 
                CHAT_PACKET_ATTRIBUTE.USER_ID, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID_LENGTH, 
                CHAT_PACKET_ATTRIBUTE.PACKET_ID, 
                CHAT_PACKET_ATTRIBUTE.SEQUENCE_NO 

            ]
      };




      //Export To global
      global.CHAT_APP['PacketFormats'] = {
          CHAT_PACKET_ATTRIBUTE      : CHAT_PACKET_ATTRIBUTE,
          CHAT_PACKET_ATTRIBUTE_INFO : CHAT_PACKET_ATTRIBUTE_INFO,
          CHAT_PACKET_INFO           : CHAT_PACKET_INFO
      }


})(window);
