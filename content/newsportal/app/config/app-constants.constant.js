/*
 * © Ipvision
 */

(function(window) {
	'use strict';


    
        window.constant('REASON_CODES',{
            NONE : 	0,
            PERMISSION_DENIED : 	1,
            PASSCODE_SENT_INTERVAL : 	2,
            DONT_DISTURB_MODE : 	3,
            ALREADY_SHARED : 	4,
            NOT_TAG_MEMBER : 	5,
            TAG_DOES_NOT_EXIST : 	6,
            SMS_SENDING_FAILED : 	7,
            EMAIL_SENDING_FAILED : 	8,
            FRIEND_OFFLINE : 	9,
            NOT_FRIEND : 	10,
            USERID_FRIENDID_SAME : 	11,
            ALREADY_FRIEND_REQUESTED : 	12,
            EXCEPTION_OCCURED : 	13,
            DATABASE_ROLL_BACKED : 	14,
            CANT_SHARE_OWN_FEED : 	15,
            FRIEND_DID_NOT_FOUND : 	16,
            SMS_SEND_RETRY_LIMIT_OVER : 	17,
            NO_MORE_FEED : 	18,
            NOT_FOUND : 	404
        });
        window.constant('MESSAGES',{
            REQUEST_PROCESSED : 'Your Request Was Successfully Processed',
            REQUEST_FAILED : 'Your Request Was Failed ! Please Try Later.',
			RC0 : "NONE.", // reason code 0
			RC1 : "PERMISSION_DENIED", // reason code 1
			RC2 : "PASSCODE_SENT_INTERVAL", // reason code 2
			RC3 : "DONT_DISTURB_MODE", // reason code 3
			RC4 : "You have already shared this post.", // reason code 4
			RC5 : "NOT_TAG_MEMBER.", // reason code 5
			RC6 : "TAG_DOES_NOT_EXIST.", // reason code 6
			RC7 : "SMS_SENDING_FAILED.", // reason code 7
			RC8 : "EMAIL_SENDING_FAILED.", // reason code 7
			RC9 : "FRIEND_OFFLINE", // reason code 9
            RC10 : "You are not permitted to share this post", // reason code 10
            RC11: "USERID_FRIENDID_SAME",	// reason code 11
            RC12: "ALREADY_FRIEND_REQUESTED", 	// reason code 12
            RC13: "EXCEPTION_OCCURED", 	// reason code 13
            RC14: "DATABASE_ROLL_BACKED", 	// reason code 14
			RC15: "You Can\'t Share Your Own Post", // reason code 15
            RC16: "FRIEND_DID_NOT_FOUND", 	// reason code  16
            RC17: "SMS_SEND_RETRY_LIMIT_OVER", 	// reason code  17
            RC18: "NO_MORE_FEED", 	// reason code  18

            RC19: "UNKNOWN",
            RC20: "UNKNOWN",
            RC21: "LOGGED_IN_FROM_ANOTHER_DEVICE",
            RC22: "UNKNOWN",
            RC23: "UNKNOWN",
            RC26: "USER_EXIST",
            RC27: "DUPLICATE_DATA",
            RC33: "THIS_IS_SPECIAL_FRIEND",
            RC37: "ANONYMOUS_CHAT_PERMISSION_DENIED",

            // signup and signin related
			RC24: "Wrong Password.", // "PASSWORD_DID_NOT_MATCHED",
			RC38: "Could not find DeviceID!", // "DEVICE_ID_DID_NOT_MATCHED",
			RC39: "This phone number is not verified.", // "PHONE_NUMBER_IS_UNVERIFIED",
			RC40: "This email is not verified.", // "EMAIL_IS_UNVERIFIED",
			RC41: "Your facebook ID is not verified.", // "FACEBOOK_IS_UNVERIFIED",
			RC42: "Your twitter ID is not verified.", //"TWITTER_IS_UNVERIFIED",
			RC43: "Could not find Your facebook ID.", // "FACEBOOK_ID_DID_NOT_MATCHED",
			RC44: "Could not find Your twitter ID.", //"TWITTER_ID_DID_NOT_MATCHED.",
			RC45: "Wrong RingID!",  //"INVALID_RINGID.",
			RC46: "Wrong Phone number!", // "INVALID_PHONE_NUMBER",
            RC47: "Wrong Email!", // "INVALID_EMAIL",
            RC48: "Device Id required!", // "DEVICE_UNIQUE_ID_MENDATORY",
            RC49: "Password required", // "PASSWORD_MENDATORY",
            RC50: "Login Type required", // "LOGIN_TYPE_MENDATORY",
            RC51: "Phone country code required!", // "DIALING_CODE_MENDATORY",
			RC52: "Phone number required!", // "PHONE_NUMBER_MENDATORY",
            RC53: "RingID required!", // "RING_ID_MENDATORY",
            RC54: "Email required!", // "EMAIL_MENDATORY",
            RC55: "Version required!", // "VERSION_MENDATORY",
            RC56: "Device required!", // "DEVICE_MENDATORY",
            RC57: "Wrong information", // "INVALID_INFORMATION",

            RC404: "NOT_FOUND", 	// reason code 404
            CRCFS1 : "Wall post cann't be shared", //custom reason code feed share wall post
            CRCFS2 : "Group post cann't be shared", //custom reason code feed share group post
            CRCFS3 : "You already shared this post", //custom reason code feed already shared post
            FEED : {
                ACT_1 : "{0} liked this post", // {0} is user card
                ACT_2 : "{0} commented on this post",// {0} is user card
                ACT_3 : "{0} shared this post",// {0} is user card
                TYPE_0 : "{0}",//"{0} updated status",//just user name
                TYPE_11 : "{0}", // single image posted by user not in friend's wall or circle
                TYPE_11C : "{0} posted",//"single image posted in circle {0} user {1} circle
                TYPE_11F : "{0} posted",//"single image posted in friend wall {0} user {1} friend's wall
                TYPE_12 : "{0} have||has updated profile picture", //{0}:user|you, {1}:have|has
                TYPE_13 : "{0} have||has updated cover picture", //{0}:user|you, {1}:have|has
                TYPE_2 : "{0}", // normal text post , not in friend's wall or circle
                TYPE_2L : "{0} shared a link", // normal Link post , not in friend's wall or circle
                TYPE_2C : "{0} posted", //normal text post on circle {0}:user,{1} circle name
                TYPE_2CL : "{0} shared a link", //normal Link post on circle {0}:user,{1} circle name
                TYPE_2F : "{0} posted", //normal text post on friend wall, {0}:user,{1} friend wall
                TYPE_2FL : "{0} shared a link", //normal Link post on friend wall, {0}:user,{1} friend wall
                TYPE_3 : "{0} have||has added {1} photos",//{0}:user,{1} number of photo
                TYPE_4 : "{0} created a album",// no use now
                TYPE_50 : "{0} added {1} music",
                TYPE_51 : "{0} shared {1}'s music",
                TYPE_60 : "{0} added {1} video",
                TYPE_62 : "{0} shared {1}'s video",
                TYPE_D : "{0}", // {0} updated status
                C_POSTFIX : " in {0}", //0 is the circle name
                F_POSTFIX : " on {0}'s timeline", // 0 is the friend card
                TYPE_SHARE : "{0} shared {1}'s feed"
            }

        });
        window.constant('APP_CONSTANTS',{
            NOT_FRIEND: 0,
			FRIEND : 1,
            INCOMING_FRIEND : 2 ,
            OUTGOING_FRIEND : 3,

            TYPE_SEARCH_BY_ALL : 0,
            TYPE_SEARCH_BY_NAME : 1,
            TYPE_SEARCH_BY_PHONE : 2,
            TYPE_SEARCH_BY_EMAIL : 3,
            TYPE_SEARCH_BY_RINGID : 4,
            TYPE_SEARCH_BY_LOCATION : 5,

            IMAGE_UPLOAD_LIMIT: 40,
            VIDEO_UPLOAD_LIMIT: 5,
            AUDIO_UPLOAD_LIMIT: 5,

            COVER_PIC_UPLOAD_MAXIMUM_WIDTH: 1480, //ALL PLATFORM COMPATIBALE
            COVER_PIC_UPLOAD_MAXIMUM_HEIGHT: 2048, //ALL PLATFORM COMPATIBALE
            COVER_PIC_UPLOAD_MINIMUM_WIDTH: 740, //ALL PLATFORM COMPATIBALE
            COVER_PIC_UPLOAD_MINIMUM_HEIGHT: 280, //ALL PLATFORM COMPATIBALE
            PROFILE_PIC_UPLOAD_MINIMUM_WIDTH: 100, //ALL PLATFORM COMPATIBALE
            PROFILE_PIC_UPLOAD_MINIMUM_HEIGHT: 100, //ALL PLATFORM COMPATIBALE

            COVER_PIC_CROP_WIDTH: 1480,
            COVER_PIC_CROP_HEIGHT: 450,
            PROFILE_PIC_CROP_WIDTH: 200,

            IMAGE_UPLOAD_MIN_WIDTH: 10,
            IMAGE_UPLOAD_MIN_HEIGHT: 10,

            MEDIA_UPLOAD_SIZE_LIMIT: 524288000,


            FEED_LIMIT : 6,


            LEFT_BAR_WIDTH : 200,
            RIGHT_BAR_WIDTH : 200,
            CELL_MARGIN : 10,

            //Third Party

            //GOOGLE_MAP_KEY : 'AIzaSyDwFgSnjLgWcHLEXS5E1dC8GgWLtxsH0zM'
            GOOGLE_MAP_KEY : 'AIzaSyCHl88HAklaOu6Q0TSfX5N5eA0vjdlBNuE',

            // mdaT
            NEWS_FEED_MEDIA_TYPE_AUDIO : 1,
            NEWS_FEED_MEDIA_TYPE_VIDEO: 2
        });
        window.constant('PrivacySet',{
            PVC1 :{
                icon : 'post-ico only-i',
                iconfeed : 'post-ico-gray only-i',
                text : 'Only me',
                value : 1
            },
            PVC2 : {
                icon : 'post-ico fri-i',
                iconfeed : 'post-ico-gray fri-i',
                text : 'Friends',
                value : 2
              },
            PVC3 : {
                icon : 'post-ico pub-i',
                iconfeed : 'post-ico-gray pub-i',
                text : 'Public',
                value : 3
              }
        });
        window.constant('CLIENT_DATA_SIZE',460);
        window.constant('AUTH_SERVER_CONFIG', {
            REQUEST_DELAY : 200
        });
        //
        window.constant("DATE_FORMAT","MMM d, y h:mm a");
})(window);
