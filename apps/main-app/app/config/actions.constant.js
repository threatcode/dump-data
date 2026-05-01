/*
 * © Ipvision
 */


angular
    .module('ringid.config')
    .constant('OPERATION_TYPES',{
        'SYSTEM': {
            REQUEST_TYPE: {
                'KEEP_ALIVE' : 1,
                'CONFIRMATION' : 2,
                'AUTHENTICATION': 3,
                'UPDATE': 4,
                'REQUEST': 5,
                'CALL' : 6,
                'CHAT': 7
            },
            /** News feed list actn start */
            TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS: 114,
            TYPE_NEWS_FEED : 88,
            TYPE_MY_NEWS_FEED : 94,
            TYPE_FRIEND_NEWSFEED : 110,
            TYPE_GROUP_NEWS_FEED : 198,
            TYPE_MEDIAS_NEWS_FEED : 87,
            TYPE_NEWS_PORTAL_FEED : 295,

            TYPE_COMMENTS_FOR_STATUS : 84,


            ACTION_SHARE_STATUS : 191,
            ACTION_GET_FULL_COMMENT: 137,

            TYPE_ADD_MULTI_IMAGE :117,
            TYPE_ADD_STATUS : 177,

            // todo : replace old use of feed types variable into following #feedtype
            NEWS_FEED_TYPE_IMAGE : 1,
            NEWS_FEED_TYPE_STATUS : 2,
            NEWS_FEED_TYPE_MULTIPLE_IMAGE : 3,
            NEWS_FEED_TYPE_ALBUM : 4,
            NEWS_FEED_TYPE_AUDIO : 5,
            NEWS_FEED_TYPE_VIDEO : 6,

            //#endfeedtype
            //
            //todo : remove after assuring no use #feedtypeold
            TYPE_SINGLE_IMAGE_STATUS : 1,
            TYPE_TEXT_STATUS : 2,
            TYPE_MULTI_IMAGE_STATUS : 3,


            TYPE_DELETE_STATUS : 179,
            TYPE_EDIT_STATUS : 178,
            TYPE_LIKE_STATUS : 184,
            TYPE_UNLIKE_STATUS : 186,

            TYPE_ADD_STATUS_COMMENT : 181,
            TYPE_LIKE_COMMENT : 123,
            TYPE_UNLIKE_COMMENT : 125,
            TYPE_DELETE_STATUS_COMMENT : 183,
            TYPE_EDIT_STATUS_COMMENT : 189,

            TYPE_LIKES_FOR_STATUS : 92,
            TYPE_LIST_LIKES_OF_COMMENT : 116,
            TYPE_TAG_USER_LIST : 274,
            TYPE_WHO_SHARES_LIST : 249,

            TYPE_UPDATE_ADD_STATUS : 377,
            TYPE_UPDATE_EDIT_STATUS : 378,
            ACTION_UPDATE_SHARE_STATUS : 391,
            TYPE_UPDATE_LIKE_STATUS : 384,
            TYPE_UPDATE_UNLIKE_STATUS : 386,
            TYPE_UPDATE_DELETE_STATUS : 379,
            TYPE_UPDATE_ADD_STATUS_COMMENT : 381,
            TYPE_UPDATE_LIKE_COMMENT : 323,
            TYPE_UPDATE_UNLIKE_COMMENT : 325,
            TYPE_UPDATE_DELETE_STATUS_COMMENT : 383,
            TYPE_UPDATE_EDIT_STATUS_COMMENT : 389,

            ALBUM: {
                TYPE_UPLOAD_ALBUM_IMAGE: 85,
                TYPE_UPDATE_UPLOAD_ALBUM_IMAGE: 90,
                TYPE_DELETE_ALBUM_IMAGE: 176,
                TYPE_UPDATE_DELETE_ALBUM_IMAGE: 376,
            },
            /** News feed list actn end */
            AUTH: {
                TYPE_INVALID_LOGIN_SESSION : 19,
                TYPE_SIGN_IN : 20, // login
                TYPE_SIGN_OUT : 22, // logout
                TYPE_SIGN_UP : 21, // register
                PHN_MAIL_VERIFICATION_CHECK:28,
                TYPE_SESSION_VALIDATION : 76,
                TYPE_MULTIPLE_SESSION : 75,

                SIGNUP_SEND_CODE_EMAIL: 220,
                SIGNUP_SEND_CODE_PHONE: 100,
                SIGNUP_REGISTER: 126,

                PASSWORD_RECOVER_OPTIONS: 222,
                PASSWORD_RECOVER_SEND_CODE: 217,
                PASSWORD_RECOVER_VERIFY_CODE: 218,
                PASSWORD_RECOVER: 219,

            },
             FRIENDS : {
                TYPE_CONTACT_UTIDS: 29, // contact utids
                TYPE_CONTACT_LIST: 23, // get contact list details with utids
                //TYPE_PEOPLE_YOU_MAY_KNOW: 106,  // deprecated action number,use 31 istead
                TYPE_PEOPLE_YOU_MAY_KNOW: 31,  // people you may know list
                TYPE_PEOPLE_YOU_MAY_KNOW_DETAILS: 32,  // people you may know list
                TYPE_FRIEND_CONTACT_LIST: 107, // friend's contact list
                TYPE_CONTACT_SEARCH: 34, // search contact
                ACTION_FRIEND_SEARCH: 35, // friend search

                TYPE_ADD_FRIEND : 127, //"add_friend"
                TYPE_UPDATE_ADD_FRIEND : 327, //"add_friend"
                TYPE_DELETE_FRIEND : 128, // "delete_friend"
                TYPE_UPDATE_DELETE_FRIEND : 328, // "delete_friend"
                TYPE_ACCEPT_FRIEND : 129, //"accept_friend"
                TYPE_UPDATE_ACCEPT_FRIEND : 329, //"accept_friend"
                TYPE_ACTION_BLOCK_UNBLOCK_FRIEND : 243,
                TYPE_ACTION_CHANGE_FRIEND_ACCESS : 244
            },
            NOTIFICATION: {
                TYPE_MY_NOTIFICATIONS: 111, // notification list

                //todo add replace it in notification factory file
                TYPE_SINGLE_NOTIFICATION : 113,


                CLEAR_NOTIFICATION_COUNTER : 195,

                MSG_TYPE_UPDATE_PROFILE_IMAGE: 1,// Example: FrinedName(fndN) updated his profile photo.
                MSG_TYPE_UPDATE_COVER_IMAGE: 2,// Example: FrinedName(fndN) updated his cover photo.
                MSG_TYPE_ADD_FRIEND: 3,// Example: FrinedName(fndN) wants to be friends with you.
                MSG_TYPE_ACCEPT_FRIEND: 4,// Example: FrinedName(fndN) has accepted your friend request.
                MSG_TYPE_ADD_GROUP_MEMBER: 5,// Example: FrinedName(fndN) added you in groupName(Using groupId need to find groupName).
                MSG_TYPE_ADD_STATUS_COMMENT: 6,// Example: FriendName(fndN) commented on your status. or Example: FriendName(fndN) & previousFriendName Commented on your status.
                MSG_TYPE_LIKE_STATUS: 7,// Example: FriendName(fndN) liked your status. or Example: FriendName(fndN) & previousFriendName liked your status.
                MSG_TYPE_LIKE_COMMENT: 8,
                MSG_TYPE_ADD_COMMENT_ON_COMMENT: 9,
                MSG_TYPE_SHARE_STATUS: 10,
                MSG_TYPE_LIKE_IMAGE: 11,
                MSG_TYPE_IMAGE_COMMENT: 12,
                MSG_TYPE_LIKE_IMAGE_COMMENT: 13,

                MSG_TYPE_LIKE_AUDIO_MEDIA : 17,
                MSG_TYPE_AUDIO_MEDIA_COMMENT : 18,
                MSG_TYPE_LIKE_AUDIO_MEDIA_COMMENT : 19,
                MSG_TYPE_AUDIO_MEDIA_VIEW : 20,
                MSG_TYPE_LIKE_VIDEO_MEDIA : 21,
                MSG_TYPE_VIDEO_MEDIA_COMMENT : 22,
                MSG_TYPE_LIKE_VIDEO_MEDIA_COMMENT : 23,
                MSG_TYPE_VIDEO_MEDIA_VIEW : 24,
                MSG_TYPE_YOU_HAVE_BEEN_TAGGED: 25,


                // below should be obsolete
                MSG_TYPE_UPGRADE_FRIEND_ACCESS: 14,
                MSG_TYPE_ACCEPT_FRIEND_ACCESS: 15,
                MSG_TYPE_DOWNGRADE_FRIEND_ACCESS: 16

            },
            CIRCLE : {
                TYPE_CREATE_GROUP: 50,
                TYPE_GROUP_DETAILS : 52,
                TYPE_LEAVE_GROUP: 53,
                TYPE_GROUP_LIST: 70,
                TYPE_GROUP_MEMBERS_LIST: 99,
                TYPE_GROUP_MEMBERS_SEARCH_RESULT: 101,
                TYPE_DELETE_GROUP: 152,// "delete_group";
                TYPE_REMOVE_GROUP_MEMBER: 154,  //"remove_group_member";
                TYPE_ADD_GROUP_MEMBER: 156,// "add_group_member";
                TYPE_EDIT_GROUP_MEMBER: 158,//  "edit_group_member"; make member/admin

                TYPE_UPDATE_ADD_GROUP: 352,// "delete_group";

                TYPE_UPDATE_DELETE_GROUP: 352,// "delete_group";
                TYPE_UPDATE_REMOVE_GROUP_MEMBER: 354,  //"remove_group_member";
                TYPE_UPDATE_ADD_GROUP_MEMBER: 356,// "add_group_member";
                TYPE_UPDATE_EDIT_GROUP_MEMBER: 358, //  "edit_group_member";

                TYPE_UPDATE_ADD_TO_GROUP_BY_FRIEND: 51//  "friend created group with me.";
            },

            CHAT : {
                FRIEND_CHAT_REQUEST : 175,
                FRIEND_CHAT_UPDATE : 375
            },

            TAG_CHAT : {
                TAG_CHAT_REQUEST_START : 134,
                TAG_CHAT_UPDATE_START : 334,

                TAG_CHAT_REQUEST_ADD_MEMBER : 135,
                TAG_CHAT_UPDATE_ADD_MEMBER : 335
            },
            PORTAL : {
                ACTION_NEWSPORTAL_LIST : 299,
                ACTION_NEWSPORTAL_CATEGORIES_LIST : 294,
                ACTION_SUBSCRIBE_UNSUBSCRIBE_NEWSPORTAL:296,
                ACTION_SAVE_UNSAVE_NEWSPORTAL_FEED:300,
                ACTION_CONTACT_SEARCH:34
            },
            MEDIA: {
                ACTION_CHECK_MEDIA_IN_ALBUMS: 1006,
                ACTION_ADD_MEDIA_CONTENT : 258,
                ACTION_UPDATE_MEDIA_CONTENT : 259,
                ACTION_DELETE_MEDIA_CONTENT : 260,
                ACTION_MEDIA_ALBUM_CONTENT_LIST : 261,
                ACTION_MEDIA_CONTENT_DETAILS : 262,

                ACTION_ADD_MEDIA_ALBUM : 253,
                ACTION_UPDATE_MEDIA_ALBUM : 254,
                ACTION_DELETE_MEDIA_ALBUM : 255,
                ACTION_MEDIA_ALBUM_LIST : 256,
                ACTION_MEDIA_ALBUM_DETAILS : 257,
                ACTION_MEDIA_SEARCH_RESULT : 277,
                ACTION_SPECIFIC_MEDIA_RESULT:278,
                ACTION_GET_TAGGED_MEDIA_SONGS:279,
                ACTION_GET_MEDIA_SLIDER_IMG:1005,
                ACTION_GET_HASHTAG_SUGGESTION:280,
                ACTION_GET_TRENDING_KEYWORDS:281,

                ACTION_INCREASE_MEDIA_CONTENT_VIEW_COUNT: 272,
                ACTION_ADD_COMMENT_ON_MEDIA: 265,
                ACTION_LIKE_UNLIKE_MEDIA: 264,
                ACTION_EDIT_COMMENT_ON_MEDIA: 266,
                ACTION_MEDIA_COMMENT_LIST: 270,
                ACTION_MEDIA_LIKE_LIST: 269,
                ACTION_DELETE_COMMENT_ON_MEDIA: 267,
                ACTION_LIKE_UNLIKE_MEDIA_COMMENT: 268,
                ACTION_MEDIACOMMENT_LIKE_LIST: 271,

                ACTION_UPDATE_LIKE_UNLIKE_MEDIA: 464, //need work
                ACTION_UPDATE_ADD_MEDIA_COMMENT : 465,
                ACTION_UPDATE_EDIT_MEDIA_COMMENT : 466,
                ACTION_UPDATE_DELETE_MEDIA_COMMENT : 467,
                ACTION_UPDATE_LIKE_UNLIKE_MEDIA_COMMENT : 468,
                ACTION_UPDATE_INCREASE_MEDIA_CONTENT_VIEW_COUNT: 472 // need work
                //find out the action number for delete media comment
            },
            IMAGE : {
                PROFILE_IMAGE_ALBUM_ID: 'profileimages',
                COVER_IMAGE_ALBUM_ID: 'coverimages',
                FEED_IMAGE_ALBUM_ID: 'default',
                TYPE_FRIEND_ALBUM_IMAGES: 109,
                FETCH_ALBUM_LIST: 96,
                FETCH_FRIEND_ALBUM_LIST: 108,
                TYPE_ALBUM_IMAGES: 97,
                TYPE_COMMENTS_FOR_IMAGE: 89,
                TYPE_LIKES_FOR_IMAGE : 93,
                TYPE_IMAGE_COMMENT_LIKES : 196,
                TYPE_LIKE_IMAGE: 185,
                TYPE_UNLIKE_IMAGE: 187,
                TYPE_IMAGE_DETAILS: 121,
                TYPE_EDIT_IMAGE_COMMENT : 194,
                TYPE_ADD_IMAGE_COMMENT: 180,
                TYPE_LIKE_UNLIKE_IMAGE_COMMENT : 197,
                TYPE_DELETE_IMAGE_COMMENT: 182,
                DELETE_IMAGE: 246,

                TYPE_UPDATE_ADD_IMAGE_COMMENT: 380,
                TYPE_UPDATE_EDIT_IMAGE_COMMENT : 394,
                TYPE_UPDATE_DELETE_IMAGE_COMMENT: 382,
                TYPE_UPDATE_LIKE_IMAGE: 385, // no use may be
                TYPE_UPDATE_UNLIKE_IMAGE: 387, // no use may be
                TYPE_UPDATE_LIKE_UNLIKE_IMAGE_COMMENT : 397
            },
            PROFILE: {
                //TYPE_USER_DETAILS: 95,
                TYPE_CHANGE_COVER_PIC: 103,
                TYPE_CHANGE_PROFILE_PIC: 63,
                TYPE_REMOVE_PROFILE_IMAGE: 43,
                TYPE_REMOVE_COVER_IMAGE: 104,
                TYPE_ACTION_USER_MOOD:193, // current user mood change
                TYPE_ACTION_USER_MOOD_PRESENCE:199, // user mood and presence

                FETCH_FRIEND_MUTUAL_FRIEND_LIST: 118,

                CHANGE_PASSWORD:130,

                ACTION_USERS_PRESENCE_DETAILS : 136, // check presence
                ACTION_USERS_PRESENCE_DETAILS_DATA : 336, // get presence data

                TYPE_ACTION_CURRENT_USER_BASICINFO: 21,
                TYPE_ACTION_OTHER_USER_BASICINFO: 95,
                //PHN_MAIL_VERIFICATION_CHECK_FRIEND:95,
                TYPE_ACTION_GET_USER_DETAILS: 204,
                TYPE_ACTION_LIST_WORK_AND_EDUCATIONS: 230,
                TYPE_ACTION_MODIFY_USER_PROFILE: 25,
                TYPE_ACTION_MODIFY_PRIVACY_SETTINGS: 74,
                //ACTION_UPDATE_LOGIN_SETTINGS: 216,
                TYPE_CHANGE_PRIVACY: 216,
                TYPE_CHANGE_FRIEND_PRIVACY: 82,
                SEND_VERIFICATION_CODE_TO_MAIL:221,
                SEND_VERIFICATION_CODE_TO_PHONE:212,
                TYPE_ACTION_ADD_EDUCATION: 231,
                TYPE_ACTION_UPDATE_EDUCATION: 232,
                TYPE_ACTION_REMOVE_EDUCATION: 233,
                TYPE_ACTION_GET_WORK: 234,
                TYPE_ACTION_GET_EDUCATION: 235,
                TYPE_ACTION_GET_SKILL: 236,
                TYPE_ACTION_ADD_SKILL: 237,
                TYPE_ACTION_UPDATE_SKILL:238,
                TYPE_ACTION_REMOVE_SKILL:239,
                TYPE_ACTION_ADD_WORK:227,
                TYPE_ACTION_UPDATE_WORK:228,
                TYPE_ACTION_REMOVE_WORK:229,

                ADD_SOCIAL_NETWORK: 276
            },
            REPORT : {
                ACTION_SPAM_REASON_LIST : 1001,
                ACTION_REPORT_SPAM : 1002
            },
            FETCH_EMOTION_LIST : 273
        },
        STICKER: {
            GET_MY_STICKER: 206,
            ADD_REMOVE_STICKER: 207,
            ADD_JT_VALUE : 1,
            REMOVE_JT_VALUE : 3
        },
    });

