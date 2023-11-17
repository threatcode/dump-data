
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
            BROKEN              : true,
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

