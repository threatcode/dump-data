;(function(global){
      //For Main App global == window
      //For Worker global == self

      /*************************************************  PACKET TYPES ****************************************************/
      var FRIEND_CHAT_PACKET_TYPE = {

            FRIEND_CHAT_REGISTER                           : 1,
            FRIEND_CHAT_UNREGISTER                         : 2,
            FRIEND_CHAT_REGISTER_CONFIRMATION              : 3,

            FRIEND_CHAT_IDLE                               : 4,
            FRIEND_CHAT_TYPING                             : 5,

            FRIEND_CHAT_MSG                                : 6,
            FRIEND_CHAT_MSG_EDIT                           : 7,
            FRIEND_CHAT_BROKEN_MSG                         : 8,
            FRIEND_CHAT_BROKEN_MSG_EDIT                    : 9,
            FRIEND_CHAT_MULTIPLE_MSG                       : 10,


            FRIEND_CHAT_DELIVERED                          : 15,
            FRIEND_CHAT_SENT                               : 16,
            FRIEND_CHAT_SEEN                               : 17,
            FRIEND_CHAT_SEEN_CONFIRMATION                  : 18,

            FRIEND_CHAT_MULTIPLE_MSG_DELETE                : 19,

            FRIEND_CHAT_MSG_DELETE_CONFIRMATION            : 20,

            FRIEND_CHAT_BROKEN                             : 24,
            FRIEND_CHAT_BROKEN_CONFIRMATION                : 25,

            FRIEND_CHAT_BLOCK                              : 27,
            FRIEND_CHAT_UNBLOCK                            : 28,
            FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION         : 29
      };

      var TAG_CHAT_PACKET_TYPE = {

            TAG_CHAT_TAG_REGISTER                          : 41,
            TAG_CHAT_TAG_UNREGISTER                        : 42,
            TAG_CHAT_TAG_REGISTER_CONFIRMATION             : 43,

            TAG_CHAT_TAG_INFORMATION                       : 46,
            TAG_CHAT_TAG_INFORMATION_CONFIRMATION          : 47,

            TAG_CHAT_TAG_MEMBER_ADD                        : 51,
            TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION           : 52,

            TAG_CHAT_MEMBER_REMOVE_LEAVE                   : 53,
            TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION      : 54,

            TAG_CHAT_TAG_MEMBER_TYPE_CHANGE                : 55,
            TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION   : 56,


            TAG_CHAT_IDLE                                  : 61,
            TAG_CHAT_TYPING                                : 62,

            TAG_CHAT_MSG                                   : 63,
            TAG_CHAT_MSG_EDIT                              : 64,
            TAG_CHAT_BROKEN_MSG                            : 65,
            TAG_CHAT_BROKEN_MSG_EDIT                       : 66,
            TAG_CHAT_MULTIPLE_MSG                          : 67,


            TAG_CHAT_DELIVERED                             : 68,
            TAG_CHAT_SENT                                  : 69,
            TAG_CHAT_SEEN                                  : 70,
            TAG_CHAT_SEEN_CONFIRMATION                     : 71,

            TAG_CHAT_MULTIPLE_MSG_DELETE                   : 72,

            TAG_CHAT_MSG_DELETE_CONFIRMATION               : 73,


            TAG_CHAT_GENERAL_BROKEN_PACKET                 : 74,
            TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION    : 75
      };

      var OFFLINE_PACKET_TYPE = {

            OFFLINE_FRIEND_INFORMATION                     : 91,
            OFFLINE_FRIEND_INFORMATION_CONFIRMATION        : 92,

            OFFLINE_GET_REQUEST                            : 93,
            OFFLINE_GET_REQUEST_CONFIRMATION               : 94,
            OFFLINE_FRIEND_UNREAD_MESSAGE                  : 95,
            OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION     : 96,
            OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST         : 97,
            OFFLINE_FRIEND_HISTORY_MESSAGE                 : 98,
            OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION    : 99,
            OFFLINE_GET_FRIEND_MESSAGE_STATUS              : 100,
            OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION : 101,

            OFFLINE_TAG_INFORMATION_ACTIVITY               : 104,

            OFFLINE_MY_TAG_LIST                            : 105,

            OFFLINE_TAG_UNREAD_MESSAGE                     : 106,
            OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION        : 107,

            OFFLINE_TAG_CREATE_TAG                         : 108,
            OFFLINE_TAG_CREATE_TAG_CONFIRMATION            : 109,

            OFFLINE_TAG_HISTORY_MESSAGE_REQUEST            : 110,
            OFFLINE_TAG_HISTORY_MESSAGE                    : 111,

            OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS       : 112,
            OFFLINE_TAG_INFORMATION_WITH_MEMBERS           : 113,

            OFFLINE_TAG_CONFIRMATION                       : 117,

            OFFLINE_BROKEN_HISTORY_PACKET                  : 118,
            OFFLINE_BROKEN_PACKET                          : 119,
            OFFLINE_BROKEN_PACKET_CONFIRMATION             : 120
      };


      var PACKET_TYPES = Object.assign( {}, FRIEND_CHAT_PACKET_TYPE, TAG_CHAT_PACKET_TYPE, OFFLINE_PACKET_TYPE );

      /*************************************************  CONFIRAMATION MAPS **********************************************/
      var CONFIRMATION_MAP = {};

      //FRIEND CHAT PACKET CONFIRMATION MAP

      CONFIRMATION_MAP
      [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_REGISTER]                 = FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_REGISTER_CONFIRMATION;

      CONFIRMATION_MAP
      [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG]                      = [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SENT, FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_DELIVERED, FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN];

      CONFIRMATION_MAP
      [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG_EDIT]                 = [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SENT, FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_DELIVERED, FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN ];

      CONFIRMATION_MAP
      [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG]               = [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SENT, FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_DELIVERED, FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN ];

      CONFIRMATION_MAP
      [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG_EDIT]          = [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SENT, FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_DELIVERED, FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN ];

      CONFIRMATION_MAP
      [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_DELIVERED]                = [ FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN, FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN_CONFIRMATION ];

      CONFIRMATION_MAP
      [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN]                     = FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN_CONFIRMATION;

      CONFIRMATION_MAP
      [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN]                   = FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_CONFIRMATION;

      CONFIRMATION_MAP
      [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MULTIPLE_MSG_DELETE]      = FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG_DELETE_CONFIRMATION;


      //CONFIRMATION_MAP
      //    [FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BLOCK]              = FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BLOCK_CONFIRMATION;

      CONFIRMATION_MAP
      [OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_INFORMATION]               = OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_INFORMATION_CONFIRMATION;

      CONFIRMATION_MAP
      [OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_UNREAD_MESSAGE]            = OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION;

      CONFIRMATION_MAP
      [OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST]   = OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION;

      CONFIRMATION_MAP
      [OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_HISTORY_MESSAGE]           = OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION;

      CONFIRMATION_MAP
      [OFFLINE_PACKET_TYPE.OFFLINE_GET_FRIEND_MESSAGE_STATUS]        = OFFLINE_PACKET_TYPE.OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION;

      //TAG CHAT PACKET CONFIRMATION MAP

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_REGISTER]                   = TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_REGISTER_CONFIRMATION;

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_INFORMATION]                = TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_INFORMATION_CONFIRMATION;

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_ADD]                 = TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION;

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_MULTIPLE_MSG_DELETE]            = TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG_DELETE_CONFIRMATION;

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_MEMBER_REMOVE_LEAVE]            = TAG_CHAT_PACKET_TYPE.TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION;

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE]         = TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION;

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_GENERAL_BROKEN_PACKET]          = TAG_CHAT_PACKET_TYPE.TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION;

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG]                            = [ TAG_CHAT_PACKET_TYPE.TAG_CHAT_SENT, TAG_CHAT_PACKET_TYPE.TAG_CHAT_DELIVERED, TAG_CHAT_PACKET_TYPE.TAG_CHAT_SEEN ];

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG_EDIT]                       = [ TAG_CHAT_PACKET_TYPE.TAG_CHAT_SENT, TAG_CHAT_PACKET_TYPE.TAG_CHAT_DELIVERED, TAG_CHAT_PACKET_TYPE.TAG_CHAT_SEEN ];

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG]                     = [ TAG_CHAT_PACKET_TYPE.TAG_CHAT_SENT, TAG_CHAT_PACKET_TYPE.TAG_CHAT_DELIVERED, TAG_CHAT_PACKET_TYPE.TAG_CHAT_SEEN ];

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG_EDIT]                = [ TAG_CHAT_PACKET_TYPE.TAG_CHAT_SENT, TAG_CHAT_PACKET_TYPE.TAG_CHAT_DELIVERED, TAG_CHAT_PACKET_TYPE.TAG_CHAT_SEEN ];

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_DELIVERED]                      = [TAG_CHAT_PACKET_TYPE.TAG_CHAT_SEEN, TAG_CHAT_PACKET_TYPE.TAG_CHAT_SEEN_CONFIRMATION];

      CONFIRMATION_MAP
      [TAG_CHAT_PACKET_TYPE.TAG_CHAT_SEEN]                           = TAG_CHAT_PACKET_TYPE.TAG_CHAT_SEEN_CONFIRMATION;

      //OFFLINE PACKET CONFIRMATION MAP

      CONFIRMATION_MAP
      [OFFLINE_PACKET_TYPE.OFFLINE_TAG_CREATE_TAG]                   = OFFLINE_PACKET_TYPE.OFFLINE_TAG_CREATE_TAG_CONFIRMATION;

      CONFIRMATION_MAP
      [OFFLINE_PACKET_TYPE.OFFLINE_GET_REQUEST]                      = OFFLINE_PACKET_TYPE.OFFLINE_GET_REQUEST_CONFIRMATION;
      CONFIRMATION_MAP

      [OFFLINE_PACKET_TYPE.OFFLINE_TAG_UNREAD_MESSAGE]               = OFFLINE_PACKET_TYPE.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION;

      CONFIRMATION_MAP
      [OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_PACKET]                    = OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_PACKET_CONFIRMATION;
      CONFIRMATION_MAP

      [OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_HISTORY_PACKET]            = OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_PACKET_CONFIRMATION;

      CONFIRMATION_MAP
      [OFFLINE_PACKET_TYPE.OFFLINE_TAG_HISTORY_MESSAGE_REQUEST]      = OFFLINE_PACKET_TYPE.OFFLINE_TAG_CONFIRMATION;

      CONFIRMATION_MAP
      [OFFLINE_PACKET_TYPE.OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS] = OFFLINE_PACKET_TYPE.OFFLINE_TAG_CONFIRMATION;


      /*************************************************  PACKET CONSTANTS **********************************************/

      var PACKET_CONSTANTS = {

            PACKET_IP_SIZE                  :  4,
            PACKET_PORT_SIZE                :  2,

            PACKET_DYNAMIC_ATTRIBUTE        : -1,
            PACKET_RAW_BYTE_ATTRIBUTE       : -2,

            ONE_BYTE_SIZE                   :  1,
            TWO_BYTE_SIZE                   :  2,
            FOUR_BYTE_SIZE                  :  4,
            EIGHT_BYTE_SIZE                 :  8,

            PACKET_MAX_SIZE                 : 512,

            TAG_ID_NO_OF_TIME_DIGIT         : 10,
            TAG_ID_NO_OF_USER_ID_DIGIT      : 6,

            OFFLINE_PACKET_TYPE_START       : 91,


            ATTRIBUTE_TYPE                  : { INTEGER : 1, STRING : 2, BYTE : 3 }

      }

      /*************************************************  GENERAL CONSTANTS **********************************************/

      var GENERAL_CONSTANTS = {


           //Debug
            LOCAL_CHAT                      : false,
            LOCAL_CHAT_REG_IP               : '192.168.1.125',
            LOCAL_CHAT_REG_PORT             : 1500,
            LOCAL_CHAT_OFFLINE_IP           : '192.168.1.125',
            LOCAL_CHAT_OFFLINE_PORT         : 1200,


            API_VERSION                     : 3,
            API_VERSION_PORT_OFFSET         : 0,

            AUTH_UID_LIST_LIMIT             : 15,

            /*** Timing Variables ***/


            ACTUAL_TAG_REGISTER_TIMEOUT     : 180,
            TAG_REGISTER_TIMEOUT            : 160,                // 180 seconds actual value, giving some space
            API_FETCH_RETRY_COUNT           : 5,
            API_FETCH_RETRY_DELAY           : 3000 ,              // 3000 miliseconds
            RETRY_COUNT                     : 5,
            AUTH_REQUEST_TIMEOUT            : 2000,
            REQUEST_TIMEOUT                 : 3000 * 5,

            BOX_WAITING_TIME                : 180,                // seconds

            UDP_SERVER_KEEP_ALIVE_INTERVAL  : 10000,              // miliseconds

            REQUEST_CACHE_VALIDITY          : 15000,              // miliseconds
            RESPONSE_CACHE_VALIDITY         : 4000,               // miliseconds

            BROKEN_CACHE_VALIDITY           : 300000,             //miliseconds
            TEMP_MESSAGE_CACHE_VALIDITY     : 2*60*1000,       //miliseconds

            /** MAPS **/

            SESSION_TYPES                   : { FRIEND : 1, TAG : 2 },
            REQUEST_TYPES                   : { FRIEND : 1, TAG : 2 },

            MEMBER_STATUS                   : { MEMBER : 1, ADMIN : 2,  OWNER   : 3, REMOVED : 4, LEAVE : 5 },

            MEMBER_MOODS                    : { ONLINE : 1, AWAY  : 2,  OFFLINE : 3, DO_NOT_DISTURB : 4 },

            REGISTRATION_TYPES              : { CREATE : 1, ONLY_REGISTER : 2, CHAT_INVITE : 3 },

            MESSAGE_STATUS                  : { UNREAD : -1, DELETED : 0, SENT : 1, DELIVERED  : 2,  SEEN : 3, VIEWED : 4, PLAYED : 4 },

            MESSAGE_TYPES                   : {
                DELETE_MESSAGE              : 0,
                BLANK_MESSAGE               : 1,
                TEXT                        : 2,
                EMOTICON_MESSAGE            : 3,
                LOCATION_SHARE              : 4,
                LINK_SHARE                  : 5,
                STICKER                     : 6,
                IMAGE                       : 7,
                AUDIO                       : 8,
                VIDEO                       : 9,
                CAMERA_IMAGE                : 10,
                FILE_STREAM                 : 11,
                CONTACT_SHARE               : 12,
                FILE_STREAM_MAINIFEST       : 13,
                HISTORY_RE_FETCH            : 14,
                RING_MEDIA_MESSAGE          : 15,
                GROUP_ACTIVITY              : 20,

                TYPING                      : 101
            },



            STATUS_MESSAGE_TYPES            : { TAG_MEMBER_ADD : 1,
                                                TAG_MEMBER_DELETE : 2,
                                                TAG_MEMBER_LEAVE : 3,
                                                TAG_MEMBER_STATUS_CHANGE_OWNER : 4,
                                                TAG_MEMBER_STATUS_CHANGE_ADMIN : 5,
                                                TAG_MEMBER_STATUS_CHANGE_MEMBER : 6,
                                                TAG_NAME_CHANGE : 7,
                                                TAG_PICTURE_CHANGE : 8,
                                                TAG_INFO_UPDATED : 9,
                                                TAG_ADMIN_ADD : 10  },

            PAGE_DIRECTION                  : { UP : 1, DOWN : 2 },
            PAGE_LIMIT                      : 10,

            ONLINE_STATUS                   : { OFFLINE : 1, ONLINE : 2, AWAY : 3},
            ONLINE_MOOD                     : { ALIVE : 1, DONT_DISTURB : 2, BUSY : 3, INVISIBLE: 4},
            SECRET_VISIBILITY               : { NON_VISIBLE : 0, VISIBLE : 1 },

            TAG_ACTIVITY_TYPE               : { DELETED : 0, ADDED : 1, LEAVE : 2, TAG_RENAME: 3, MEMBER_TYPE_CHANGE : 4, TAG_URL_RENAME : 5, TAG_CREATED : 6},

            USER_PRESENCE : {
                OFFLINE : 1,
                ONLINE  : 2,
                AWAY    : 3
            },

            HISTORY_MAX_MESSAGE             :  10,


            /* Internal */
            TAB_SYNC_MAX_TIME               : 180 * 1000,
            TAB_SYNC_ACTIONS                : { AUTH_REQUEST            : 0,
                                                CHAT_REQUEST            : 1,
                                                GENERAL_INFO_UPDATE     : 3,
                                                CHAT_BOX_INFO_UPDATE    : 4,
                                                SECRET_CHAT_TIMER       : 5,
                                                CHAT_HISTORY_REFRESH    : 6,
                                                CHAT_MSESSAGE_UPDATE    : 7
                                              },

            MAX_TASK_RETRY_COUNT            : 15,

            SHARED_WORKER_PATH              : 'js/worker/chat/shared.js',
            CHAT_WORKER_PATH                : '/js/worker/chat/chat.worker.js'

      }

      var AUTH_REQUEST_TYPE  = {

            KEEP_ALIVE     : 1,
            CONFIRMATION   : 2,
            AUTHENTICATION : 3,
            UPDATE         : 4,
            REQUEST        : 5,
            CALL           : 6,
            CHAT           : 7
      }

      var AUTH_SERVER_ACTIONS = {
            START_F2F_CHAT          : 175,
            RECEIVED_F2F_CHAT       : 375,
            START_TAG_CHAT          : 134,
            RECEIVED_TAG_CHAT       : 334,
            ADD_TAG_CHAT_MEMBERS    : 135,
            GET_USER_MOOD_PRESENCE  : 199,
            GET_OFFLINE_IP_PORT     : 83,

      };

      var AUTH_SERVER_REQUEST_UPDATE_MAP = {};
      AUTH_SERVER_REQUEST_UPDATE_MAP[ AUTH_SERVER_ACTIONS.RECEIVED_F2F_CHAT ] =
            AUTH_SERVER_ACTIONS.START_TAG_CHAT;

      AUTH_SERVER_REQUEST_UPDATE_MAP[ AUTH_SERVER_ACTIONS.RECEIVED_TAG_CHAT ] =
            AUTH_SERVER_ACTIONS.START_TAG_CHAT;

      var WORKER_NOTIFIER_TYPES = {
            DEBUG                 : 0,
            AUTH_REQUEST_RESPONSE : 1,
            CHAT_REQUEST_RESPONSE : 2,
            CHAT_DATA_RECEIVED    : 3,
            AUTH_DATA_RECEIVED    : 4,
            EXCEPTION             : 5,
            CHAT_TIMER_UPDATE     : 6,
            RE_INIT               : 7

      };


      var CHAT_GLOBAL_VALUES = {
          serverTimeDiff : 0,
          serverTime : 0,
          offlineUpdateTime : 0
      };

      var CHAT_VERSION_INFO = {
            version        : '2.5',
      }

      var PLATFORM = {
            DESKTOP : 1,
            ANDROID : 2,
            IPHONE : 3,
            WINDOWS : 4,
            WEB : 5
      };

      var CHAT_SERVER_TYPES = {
            OFFLINE : 1,
            ONLINE : 2
      };

      var CHAT_STATES = {
            MESSAGE_SENDING: {

                ONLINE_IP_PORT_REQUEST              : 0,
                FIRST_ONLINE                        : 1,
                PRESENCE_REFRESH                    : 2,
                SECOND_ONLINE                       : 3,
                ONLINE_IP_PORT_REFRESH              : 4,
                THIRD_ONLINE                        : 5,
                ONLINE_SUCCESS                      : 6,
                ONLINE_FAILED                       : 7,


                FIRST_OFFLINE                       : 101,
                OFFLINE_IP_PORT_REFRESH             : 102,
                SECOND_OFFLINE                      : 102,
                OFFLINE_FAILED                      : 104,
                OFFLINE_SUCCESS                     : 105,

                SUCCESS                             : 201,
                FAILED                              : 202

            }
      };

      var RESPONSE_REASON_CODES = {
            PERMISSION_DENIED : 1, // reason code 1
      }

      var CHAT_FLOWS = {
            SEND_MESSAGE : [
                CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REQUEST,
                CHAT_STATES.MESSAGE_SENDING.FIRST_ONLINE,
                CHAT_STATES.MESSAGE_SENDING.PRESENCE_REFRESH,
                CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REFRESH,
                CHAT_STATES.MESSAGE_SENDING.ONLINE_FAILED,

                CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE,
                CHAT_STATES.MESSAGE_SENDING.OFFLINE_IP_PORT_REFRESH
            ]
      };

      var CHAT_STATE_INFO = {};


      /******** Generate Reverse Maps **********/
      (function(GENERAL_CONSTANTS, CHAT_STATES, CHAT_STATE_INFO){

            var isObject = (global.angular && angular.isObject) || global.isObject;

            var itemKey, itemValue, itemPropKey, itemPropValue;
            for(itemKey in GENERAL_CONSTANTS){
                  itemValue = GENERAL_CONSTANTS[itemKey]
                  if(isObject(itemValue)){
                      GENERAL_CONSTANTS[itemKey +'_VALUE'] = [];
                      for( itemPropKey in itemValue){
                          itemPropValue = itemValue[itemPropKey];
                          GENERAL_CONSTANTS[itemKey +'_VALUE'][itemPropValue] = itemPropKey
                      }
                  }
            }

            var chatStates = Object.keys(CHAT_STATES.MESSAGE_SENDING);

            for(var index = 0, length = chatStates.length; index < length; index++){
                  var aChatStateIndex = CHAT_STATES['MESSAGE_SENDING'][ chatStates[index] ];
                  try{
                      CHAT_STATE_INFO [ aChatStateIndex ]['NAME'] = chatStates[index];
                  }catch(e) {

                      CHAT_STATE_INFO [ aChatStateIndex ] = {};
                      CHAT_STATE_INFO [ aChatStateIndex ]['NAME'] = chatStates[index];
                  }
            }


      })(GENERAL_CONSTANTS, CHAT_STATES, CHAT_STATE_INFO)



      //Export To global
      global.CHAT_APP['Constants'] = {
            FRIEND_CHAT_PACKET_TYPE        : FRIEND_CHAT_PACKET_TYPE,
            TAG_CHAT_PACKET_TYPE           : TAG_CHAT_PACKET_TYPE,
            OFFLINE_PACKET_TYPE            : OFFLINE_PACKET_TYPE,
            PACKET_TYPES                   : PACKET_TYPES,
            CONFIRMATION_MAP               : CONFIRMATION_MAP,
            GENERAL_CONSTANTS              : GENERAL_CONSTANTS,
            PACKET_CONSTANTS               : PACKET_CONSTANTS,
            WORKER_NOTIFIER_TYPES          : WORKER_NOTIFIER_TYPES,
            AUTH_SERVER_ACTIONS            : AUTH_SERVER_ACTIONS,
            AUTH_SERVER_REQUEST_UPDATE_MAP : AUTH_SERVER_REQUEST_UPDATE_MAP,
            CHAT_STATES                    : CHAT_STATES,
            CHAT_STATE_INFO                : CHAT_STATE_INFO,
            CHAT_GLOBAL_VALUES             : CHAT_GLOBAL_VALUES,
            AUTH_REQUEST_TYPE              : AUTH_REQUEST_TYPE,
            PLATFORM                       : PLATFORM,
            CHAT_VERSION_INFO              : CHAT_VERSION_INFO,
            RESPONSE_REASON_CODES          : RESPONSE_REASON_CODES,
            CHAT_SERVER_TYPES              : CHAT_SERVER_TYPES
      }


})(window);
