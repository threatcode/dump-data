
(function(window,DataView){
    'use strict';
// ie8 wat
//    window.ringauthor = 'fish';
//
//    var logFunc = window.console;
//    window.console = function(){
//
//        return {
//            log : function(m,man){
//              return (window.ringauthor && man === window.ringauthor && logFunc.log(m));
//            },
//            dir : function(m){
//                return (window.ringauthor && man === window.ringauthor && logFunc.dir(m));
//            }
//        };
//    }();


    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*/) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
                from += len;
            }

            for (; from < len; from++) {
                if (from in this && this[from] === elt) { return from; }
            }
            return -1;
        };
    }
    if (!String.prototype.repeat) {
        String.prototype.repeat = function(count) {
           return Array(count+1).join(this);

        };
    }

    String.prototype.utf8Encode = function(){
       return unescape(encodeURIComponent(this));
    }

    String.prototype.toCharCodeArray = function(){
        var codes = [];
        for (var i = 0; i < this.length;i++) {
            codes.push(this.charCodeAt(i));
        }
        return codes;
    };
    //{utids : ""} considers all array element is instance of DataView and returns a DataView Object of all element after merge
    Array.prototype.joinAsDataView = function(){
            var self = this,currentIndex=0,dataViewLength= 0,buffer,view;
            if(!self.length)return new DataView(new ArrayBuffer(0)); // if no elements then just returns a DataView
            for(var i=0;i<self.length;i++){
                if(self[i] instanceof DataView){
                    dataViewLength += self[i].byteLength;
                }
            }
            if(!dataViewLength)return new DataView(new ArrayBuffer(0));
              buffer = new ArrayBuffer(dataViewLength);
              view = new DataView(buffer);
            for(var i=0;i<self.length;i++){
                if(self[i] instanceof DataView){
                    for(var j=0;j<self[i].byteLength;j++){
                        view.setUint8(currentIndex++,self[i].getUint8(j));
                    }
                }
            }
        return view;

    };

    Array.prototype.difference = function(elementsToRemove){

        if( !elementsToRemove || !elementsToRemove.length || !this.length){
            return this;
        }

        var mapElementsToRemove = {},
            outputArray = [],
            index = 0;


        /* Cache elementsToRemove Array */
        while( index < elementsToRemove.length ){

            mapElementsToRemove[elementsToRemove[index]] = true;
            index++;
        }

        for(index=0; index < this.length; index++ ){
            if( !mapElementsToRemove[ this[index] ] ){
                outputArray.push( this[index] )
            }
        }

        return outputArray;

    },

    DataView.prototype.copy = function(offset,length){
       //var self = this;
       //offset = offset || 0;
       //length = length || self.byteLength;
       //// var diff = length-offset;
       //var buffer = new ArrayBuffer(length);
       //var view = new DataView(buffer);
       //for(var i=0;i<length;i++){
       //     view.setUint8(i,self.getUint8(offset++));
       //}
       // return view
        return new DataView(this.buffer,offset,length);
    };
    DataView.prototype.merge = function(from,fromLength,toview,to,toLength){
        var self = this, i,j;
          var mergea = new DataView(this.buffer,from,fromLength),
            buf = new ArrayBuffer(mergea.byteLength+(toLength-to+1)),
            view = new DataView(buf);
        for(i=0;i<mergea.byteLength;i++){
            view.setUint8(i,mergea.getUint8(i));
        }
       // console.info("from : "+from +" fl : "+fromLength + " to :"+to + " length : "+toLength +" current : "+i +" to range" +torange);
        for(j=i;j<view.byteLength;j++){
            view.setUint8(j,toview.getUint8(to++));
        }
        return view;


    };
    DataView.prototype.addAttributeInt = function(i,code,len,value){
       // console.info("index : "+ i + " attr : " + code +"\n");
        this.setUint8(i++,code);
       // console.info("index : "+ i + " len : " + len +"\n");
        this.setUint8(i++,len);
        //console.info("index : "+ i + " "+len+"val : " + value +"\n");
        switch(len){
            case 1:
                this.setUint8(i++,value);
                break;
            case 2:
                this.setUint16(i,value);
                i +=2;
                break;
            case 4:
                this.setUint32(i,value);
                i+=4;
                break;
        }
        return i;

    };
    DataView.prototype.addAttributeString = function(i,code,value){
       // console.info("index : "+ i + " attr : " + code +"\n");
        this.setUint8(i++,code);
       // console.info("index : "+ i + " "+value.length+" strval : " + value +"\n");
        this.setUint8(i++,value.length);
        for (var j = 0; j< value.length;j++) {
            this.setUint8(i++,value.charCodeAt(j));
        }
      return i;
    };
    DataView.prototype.addAttributeData = function(i,code,view,fromIndex,length){
        fromIndex = fromIndex || 0;
        length = length || view.byteLength;
        this.setUint8(i++,code);
        this.setUint16(i,length);
        i+=2;
        for(var j=0;j<length;j++){
            this.setUint8(i++,view.getUint8(fromIndex++));
        }
        return i;
    };
    DataView.prototype.print_r = function(debug,starting,length){
        starting = starting || 0;
        length = length || this.byteLength;

        var str = "Index\t\tBinary\t\tInteger\t\tChar\n";
        var full="", c,inte;
        for(var i=starting;i<length;i++){
         inte = this.getUint8(i);
            c = String.fromCharCode(inte);

          str += i + "\t\t \t\t" + inte.toString(2) + "\t\t\t\t"+ inte + "\t\t\t\t"+c+"\n";
            full +=c;
        }
        if(!!debug){
            console.info(str);
            console.info("\n length : "+str.length);
        }

        console.info(full);

    };

    DataView.prototype.getString = function(offset,length){
        var self = this,bitArray = [], firstByte, highSurrogate, lowSurrogate, codePoint;
        length = length || self.byteLength;

         /* utf8 format ref: http://www.fileformat.info/info/unicode/utf8.htm */

         while( length > 0  ) {
            firstByte = self.getUint8(offset);
            if(self.getUint8(offset) <= 127) {
              bitArray.push(self.getUint8(offset++));
              length--;
            }
            else if(self.getUint8(offset) >= 128 && self.getUint8(offset) <= 223) {

              bitArray.push(((self.getUint8(offset++) & 0x1F) << 6) | (self.getUint8(offset++) & 0x3F));
              length -=2;
            }
            else if(self.getUint8(offset) >= 224 && self.getUint8(offset) <= 239) {
              bitArray.push(((self.getUint8(offset++) & 0x1F) << 12) | ((self.getUint8(offset++) & 0x3F) << 6 | (self.getUint8(offset++) & 0x3F)));
              length -=3;
            }
            else {
               /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint */
               codePoint = ((self.getUint8(offset++) & 0x07) << 18) | (((self.getUint8(offset++) & 0x3F) << 12) | ((self.getUint8(offset++) & 0x3F) << 6 | (self.getUint8(offset++) & 0x3F)));
               codePoint -= 0x10000;
               highSurrogate = (codePoint >> 10) + 0xD800;
               lowSurrogate = (codePoint % 0x400) + 0xDC00;
               bitArray.push(highSurrogate, lowSurrogate);
               length -=4;
            }
        }

        //var func =  new Function("function(){ return String.fromCharCode("+bitArray.join(",")+");}");
        return String.fromCharCode.apply(null,bitArray);
        //return bitArray.length ? :'';
    };

    DataView.prototype.getIntByByte = function(offset,length){
        var self = this;
        switch (length){
            case 1:
                return self.getUint8(offset);
            case 2:
                return self.getUint16(offset);
            case 4:
                return self.getUint32(offset);
            case 6:
            case 8://javascript doesn't support 64-bit integer so we assuming first two byte in our system is not used. so we cropping it
                var str="", i,tempInt;
                for(i=offset;i<offset+length;i++){
                    tempInt = self.getUint8(i).toString(2);
                    str += tempInt.length < 8 ? "0".repeat(8-tempInt.length)+tempInt:tempInt;
                }
                return parseInt(str,2);
           default : return self.getUint8(offset);
        }
    };


    DataView.prototype.getBool = function(offset){ // length is always one byte
        return this.getUint8(offset) === 1;
    };

})(window,DataView);

// date custom format extending

/*
 * © Ipvision
 */

(function() {
	'use strict';


	angular
		.module('ringid.config', [])
		.value('settings', {
            siteUrl: 'localhost:8080',
			baseUrl: location.protocol + '//' + location.host + '/',
			base : location.host,
            apiUrl: 'http://dev.ringid.com:90/APIRequest?',
			imBase: 'http://image.ringid.com/uploaded/', // for production use:  'http://images.ringid.com/uploaded/'
            chatImBase: 'http://image.ringid.com/chatContens/',
            imServer: 'http://image.ringid.com/ringmarket/', // for production use:  'http://image.ringid.com/ringmarket/'
			//emoticonBase: 'http://38.108.92.154/images/emoticon/',
			emoticonBase: 'http://localhost:8080/images/emoticon/',
			stickerBase: 'http://image.ringid.com/ringmarket/StickerHandler/',
            stickerImageBase : 'http://image.ringid.com/stickermarket/d5/',
			FEED_LIMIT : 10,
            COVER_PIC_UPLOAD_MAXIMUM_WIDTH: 1480, //ALL PLATFORM COMPATIBALE
            COVER_PIC_UPLOAD_MAXIMUM_HEIGHT: 2048, //ALL PLATFORM COMPATIBALE
            COVER_PIC_UPLOAD_MINIMUM_WIDTH: 740, //ALL PLATFORM COMPATIBALE
            COVER_PIC_UPLOAD_MINIMUM_HEIGHT: 280, //ALL PLATFORM COMPATIBALE
            PROFILE_PIC_UPLOAD_MINIMUM_WIDTH: 100, //ALL PLATFORM COMPATIBALE
            PROFILE_PIC_UPLOAD_MINIMUM_HEIGHT: 100, //ALL PLATFORM COMPATIBALE

            COVER_PIC_CROP_WIDTH: 1480,
            COVER_PIC_CROP_HEIGHT: 547,
            PROFILE_PIC_CROP_WIDTH: 200,

            IMAGE_UPLOAD_MIN_WIDTH: 10,
            IMAGE_UPLOAD_MIN_HEIGHT: 10,
            LEFT_BAR_WIDTH : 200,
            RIGHT_BAR_WIDTH : 200,
            CELL_MARGIN : 10
		})
        .constant('RING_ROUTES', {
            HOME : '/',
            USER_PROFILE : '/profile/:utId/:uId/:subpage?',
            CIRCLE_HOME : '/circle/:circleId/:subpage?',
            WHO_SHARED_FEED : '/feed_shares/:feedId',
            SINGLE_FEED : '/feed/:feedId/:shared?',
            SINGLE_IMAGE : '/image/:imageId',
            FAQ : '/faq'

        })
        .constant('REASON_CODES',{
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
        })
        .constant('MESSAGES',{
            REQUEST_PROCESSED : 'Your Request Was Successfully Processed',
            REQUEST_FAILED : 'Your Request Was Failed ! Please Try Later.',
            RC15 : 'You Can\'t Share Your Own Post',
            RC10 : "You are not permitted to share this post" // reason code 10
        })
		.constant('DATA_TYPES',{
			'DT_FEED': 1,//update type for feed previously updated by newsfeed.agent
			'DT_FRIENDS' : 2,// friend list,status previously updated by friends.agent
			'DT_UMAYKNOW' : 3,// people you may know data
			'DT_GROUP' : 4,// group related data previously updated by groups.agent
			'DT_NOTIFICATION':5,
			'DT_ALBUM':6,
			'DT_LOGOUT' : 7,
			'DT_WORK_EDUCATION_SKILL': 8,
			'DT_RING_CALL' : 9
		}).constant('UPDATE_TYPES',{
			'FEED': 1,
			'COMMENT' : 2,
			'LIKE' : 3,
			'SHARE':4,
			'STATUS' : 5,//status edit (response/update)
			'NO_MORE_FEED' : 6

        }).constant('APP_CONSTANTS', {
            NOT_FRIEND: 0,
			FRIEND : 1,
            INCOMING_FRIEND : 2 ,
            OUTGOING_FRIEND : 3,

            TYPE_SEARCH_BY_ALL : 0,
            TYPE_SEARCH_BY_NAME : 1,
            TYPE_SEARCH_BY_PHONE : 2,
            TYPE_SEARCH_BY_EMAIL : 3,
            TYPE_SEARCH_BY_RINGID : 4,
            TYPE_SEARCH_BY_LOCATION : 5
		}).constant('ATTRIBUTE_CODES',{
                AUTHIP: 1001,
                AUTHPORT: 1002,
                AUTH_E_USERNAME : 1003,
                AUTH_E_PASSWORD : 1004,
                AUTH_E_SALT : 1005,
                ACTION: 1,
                SERVER_PACKET_ID: 2,
                SESSION_ID: 3,
                TOTAL_PACKET: 4,
                PACKET_NUMBER: 5,
                UNIQUE_KEY: 6,
                USER_ID: 7,
                FRIEND_ID: 8,
                DEVICE: 9,
                CLIENT_PACKET_ID: 10,
                CALL_ID: 11,
                FRIEND_IDENTITY: 12,
                CALL_TIME: 13,
                PRESENCE: 14,
                IS_DEVIDED_PACKET: 15,
                USER_IDENTITY: 16,
                USER_NAME: 17,
                TOTAL_RECORDS: 18,
                USER_TABLE_IDS: 19,
                SUCCESS: 20,
                MESSAGE: 21,
                REASON_CODE: 22,
                STATUS: 23,
                DELETED: 24,
                WEB_UNIQUE_KEY: 28,
                WEB_TAB_ID: 29,
                DATA: 127,

                /* Contact list constants */
                CONTACT: 101,
                CONTACT_TYPE: 102,
                NEW_CONTACT_TYPE: 103,
                FRIENDSHIP_STATUS: 104,
                BLOCK_VALUE: 105,
                CHANGE_REQUESTER: 106,
                CONTACT_UPDATE_TIME: 107,
                MUTUAL_FRIEND_COUNT : 108,
                CALL_ACCESS: 110,
                CHAT_ACCESS: 111,
                FEED_ACCESS: 112,
                ANONYMOUS_CALL: 9,
                /* USER DETAILS */
                PASSWORD: 128,
                RESET_PASSWORD: 129,
                EMAIL: 130,
                DEVICE_UNIQUE_ID: 131,
                DEVICE_TOKEN: 132,
                MOBILE_PHONE: 133,
                BIRTH_DATE: 134,
                MARRIAGE_DAY: 135,
                GENDER: 136,
                COUNTRY_ID: 137,
                CURRENT_CITY: 138,
                HOME_CITY: 139,
                LANGUAGE_ID: 140,
                REGISTRATION_DATE: 141,
                DIALING_CODE: 142,
                IS_MY_NUMBER_VERIFIED: 143,
                IS_EMAIL_VERIFIED: 145,
                MY_NUMBER_VERIFICATION_CODE: 146,
                MYNUMBER_VERIFICATION_CODE_SENT_TIME: 147,
                EMAIL_VERIFICATION_CODE: 148,
                RECOVERY_VERIFICATION_CODE: 149,
                RECOVERY_VERIFICATION_CODE_SENT_TIME: 150,
                PROFILE_IMAGE: 151,
                PROFILE_IMAGE_ID: 152,
                COVER_IMAGE: 153,
                COVER_IMAGE_ID: 154,
                COVER_IMAGE_X: 155,
                COVER_IMAGE_Y: 156,
                ABOUT_ME: 157,
                TOTAL_FRIENDS: 158,
                RING_EMAIL: 159,
                UPDATE_TIME: 160,
                NOTIFICATION_VALIDITY: 161,
                WEB_LOGIN_ENABLED: 162,
                PC_LOGIN_ENABLED: 163,
                COMMON_FRIEND_SUGGESTION: 164,
                PHONE_NUMBER_SUGGESTION: 165,
                CONTACT_LIST_SUGGESTION: 166
		})
		.constant('OPERATION_TYPES',{
			'SYSTEM': {
				VERSION: 135,
				REQUEST_TYPE: {
	                'KEEP_ALIVE' : 1,
					'CONFIRMATION' : 2,
					'AUTHENTICATION': 3,
					'UPDATE': 4,
					'REQUEST': 5,
					'CALL' : 6,
					'CHAT': 7
				},
				TYPE_KEEP_ALIVE : 26,
				/** News feed list actn start */
                TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS: 114,
				TYPE_NEWS_FEED : 88,
				TYPE_MY_NEWS_FEED : 94,
				TYPE_FRIEND_NEWSFEED : 110,
				TYPE_GROUP_NEWS_FEED : 198,

				TYPE_COMMENTS_FOR_STATUS : 84,

				ACTION_SHARE_STATUS : 191,

				TYPE_ADD_MULTI_IMAGE :117,
				TYPE_ADD_STATUS : 177,

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
                TYPE_LIKES_FOR_IMAGE : 93,
                TYPE_IMAGE_COMMENT_LIKES : 196,
                TYPE_LIST_LIKES_OF_COMMENT : 116,

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

                'ALBUM': {

                    'TYPE_UPLOAD_ALBUM_IMAGE': 85,
                    'TYPE_UPDATE_UPLOAD_ALBUM_IMAGE': 90,
                    'TYPE_DELETE_ALBUM_IMAGE': 176,
                    'TYPE_UPDATE_DELETE_ALBUM_IMAGE': 376,

                    'CREATE_ALBUM': 1,
                    'GET_IMAGE_UPLOAD_INFO': 2,
                    'GET_ALBUM_LIST': 3,
                    'GET_ALBUM_DETAILS': 4,
                    'GET_ALL_IMAGES': 5
                },
				/** News feed list actn end */
				'AUTH': {
                    TYPE_INVALID_LOGIN_SESSION : 19,
					TYPE_SIGN_IN : 20, // login
					TYPE_SIGN_OUT : 22, // logout
					TYPE_SIGN_UP : 21, // register
                    TYPE_SESSION_VALIDATION : 76,
                    TYPE_MULTIPLE_SESSION : 75,
					SIGNUP_INIT: 2,
					SIGNUP_SEND_EMAIL: 3,
					SIGNUP_VERIFY_EMAIL: 4,
					SIGNUP: 5
				},
                FRIENDS : {
                    TYPE_CONTACT_UTIDS: 29, // contact utids
                    TYPE_CONTACT_LIST: 23, // get contact list details with utids
                    TYPE_PEOPLE_YOU_MAY_KNOW: 106,  // people you may know list
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
                'NOTIFICATION': {
                    'TYPE_MY_NOTIFICATIONS': 111, // notification list

                    //todo add replace it in notification factory file
                    TYPE_SINGLE_NOTIFICATION : 113,


                    CLEAR_NOTIFICATION_COUNTER : 195,
                    GET_NOTIFICATION: 4,
                    REDIRECT_INFO: 5,
                    NOTIFICATION_DETAILS: 6,

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
                    MSG_TYPE_UPGRADE_FRIEND_ACCESS: 14,
                    MSG_TYPE_ACCEPT_FRIEND_ACCESS: 15,
                    MSG_TYPE_DOWNGRADE_FRIEND_ACCESS: 16,
                    NOTIFICATION_NOW_FRIEND: 17

                },
                'CIRCLE' : {
                    'TYPE_CREATE_GROUP': 50,
                    'TYPE_LEAVE_GROUP': 53,
                    'TYPE_GROUP_LIST': 70,
                    'TYPE_GROUP_MEMBERS_LIST': 99,
                    'TYPE_DELETE_GROUP': 152,// "delete_group";
                    'TYPE_REMOVE_GROUP_MEMBER': 154,  //"remove_group_member";
                    'TYPE_ADD_GROUP_MEMBER': 156,// "add_group_member";
                    'TYPE_EDIT_GROUP_MEMBER': 158,//  "edit_group_member"; make member/admin

                    'TYPE_UPDATE_ADD_GROUP': 352,// "delete_group";

                    'TYPE_UPDATE_DELETE_GROUP': 352,// "delete_group";
                    'TYPE_UPDATE_REMOVE_GROUP_MEMBER': 354,  //"remove_group_member";
                    'TYPE_UPDATE_ADD_GROUP_MEMBER': 356,// "add_group_member";
                    'TYPE_UPDATE_EDIT_GROUP_MEMBER': 358, //  "edit_group_member";

                    'TYPE_UPDATE_ADD_TO_GROUP_BY_FRIEND': 51//  "friend created group with me.";
                },

                "CHAT_CIRCLE" : {
                    "CREATE_CIRCLE": 105,
                    "EDIT_CIRCLE": 119,
                    "DELETE_CIRCLE": 226,
                    "LIST_CIRCLES": 225,

                    "ADD_MEMBER": 240,
                    "REMOVE_MEMBER": 242,

                    "JOIN_GROUP" : 240,
                    "LEAVE_GROUP" : 242

                },

                'IMAGE' : {
                    PROFILE_IMAGE_ALBUM_ID: "profileimages",
                    COVER_IMAGE_ALBUM_ID: "coverimages",
                    FEED_IMAGE_ALBUM_ID: "default",
                    TYPE_FRIEND_ALBUM_IMAGES: 109,
                    FETCH_ALBUM_LIST: 96,
                    FETCH_FRIEND_ALBUM_LIST: 108,
                    TYPE_ALBUM_IMAGES: 97,
                    TYPE_COMMENTS_FOR_IMAGE: 89,
                    TYPE_LIKES_FOR_IMAGE: 93,
                    TYPE_LIKE_IMAGE: 185,
                    TYPE_IMAGE_DETAILS: 121,
					TYPE_EDIT_IMAGE_COMMENT : 194,
                    TYPE_ADD_IMAGE_COMMENT: 180,
                    TYPE_DELETE_IMAGE_COMMENT: 182,

                    TYPE_UPDATE_ADD_IMAGE_COMMENT: 380,
					TYPE_UPDATE_EDIT_IMAGE_COMMENT : 394,
                    TYPE_UPDATE_DELETE_IMAGE_COMMENT: 382,
                    TYPE_UPDATE_LIKE_IMAGE: 385,
                    TYPE_UNLIKE_IMAGE: 187,
                    TYPE_UPDATE_UNLIKE_IMAGE: 387,
					TYPE_LIKE_UNLIKE_IMAGE_COMMENT : 197,
	                TYPE_UPDATE_LIKE_UNLIKE_IMAGE_COMMENT : 397
                },
                'PROFILE': {
                    'TYPE_ACTION_GET_USER_DETAILS': 204, // user detail with uid
                    'TYPE_USER_DETAILS': 95,
                    'TYPE_CHANGE_COVER_PIC': 103,
                    'TYPE_CHANGE_PROFILE_PIC': 63,
                    'TYPE_REMOVE_PROFILE_IMAGE': 43,
                    'TYPE_REMOVE_COVER_IMAGE': 104,

                    'CHANGE_PASSWORD':130,

                    ACTION_USERS_PRESENCE_DETAILS : 136, // check presence
                    ACTION_USERS_PRESENCE_DETAILS_DATA : 336 // get presence data
                }
			},


			'STICKER': {
				'GET_CATEGORIES': 5,
				'GET_MY_STICKER': 206,
				'ADD_REMOVE_STICKER': 207,
                'ADD_JT_VALUE' : 1,
                'REMOVE_JT_VALUE' : 3
			},
			'SYSTEM_TYPE' : {
                'PHN_MAIL_VERIFICATION_CHECK':28,
                'PHN_MAIL_VERIFICATION_CHECK_FRIEND':95,
				'TYPE_NEWS_FEED' : 88,
				'TYPE_ACTION_GET_USER_DETAILS': 204,
				'TYPE_ACTION_LIST_WORK_AND_EDUCATIONS': 230,
				'TYPE_ACTION_CURRENT_USER_BASICINFO': 21,
				'TYPE_ACTION_OTHER_USER_BASICINFO': 95,
				'TYPE_ACTION_MODIFY_USER_PROFILE': 25,
				'TYPE_ACTION_MODIFY_PRIVACY_SETTINGS': 74,
				'ACTION_UPDATE_LOGIN_SETTINGS': 216,
                'SEND_VERIFICATION_CODE_TO_MAIL':221,
                'SEND_VERIFICATION_CODE_TO_PHONE':212,
				'TYPE_ACTION_ADD_EDUCATION': 231,
				'TYPE_ACTION_UPDATE_EDUCATION': 232,
				'TYPE_ACTION_REMOVE_EDUCATION': 233,
				'TYPE_ACTION_ADD_SKILL': 237,
				'TYPE_ACTION_UPDATE_SKILL':238,
				'TYPE_ACTION_REMOVE_SKILL':239,
				'TYPE_ACTION_ADD_WORK':227,
				'TYPE_ACTION_UPDATE_WORK':228,
				'TYPE_ACTION_REMOVE_WORK':229,
                'TYPE_ACTION_USER_MOOD':193
			}

		}).constant('CUSTOM_PROMISE',{ // used while data sending to socket and received through socket
			'REQUEST_SENT': 'SENT'
		}).constant('MOUSE_CLICK',{
			'LEFT_CLICK': 1,
			'MIDDLE_CLICK' : 2,
			'RIGHT_CLICK' : 3
        }).constant('CLIENT_DATA_SIZE',460)//

        .value("DATE_FORMAT","MMM d, y h:mm a")
        .constant('CHAT_PACKET_FORMAT',{
            'REGISTER_PKT' : {
                'PACKET_NAME': 'REGISTER_PKT',
                'PACKET_TYPE': 1,
                'FORMAT': [1,2,3,4,5,6]
            },
            'FRIEND_UNREGISTER_PKT' : {
                'PACKET_NAME': 'FRIEND_UNREGISTER_PKT',
                'PACKET_TYPE': 2,
                'FORMAT': [1,2,3,9,10]
            },
            'REGISTER_CONFIRM_PKT' : {
                'PACKET_NAME': 'REGISTER_CONFIRM_PKT',
                'PACKET_TYPE': 3,
                'FORMAT': [1,3,4,5,7]
            },
            'CHAT_MSG' : {
                'PACKET_NAME': 'CHAT_MSG',
                'PACKET_TYPE': 5,
                'FORMAT': [1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 16, 17]
            },
            'DELIVER_PKT' : {
                'PACKET_NAME': 'DELIVER_PKT',
                'PACKET_TYPE': 6,
                'FORMAT': [1, 2, 3, 4, 5]
            },
            'SEEN_PKT' : {
                'PACKET_NAME': 'SEEN_PKT',
                'PACKET_TYPE': 7,
                'FORMAT': [1, 2, 3, 4, 5]
            },
            'TYPING_PKT' : {
                'PACKET_NAME': 'TYPING_PKT',
                'PACKET_TYPE': 9,
                'FORMAT': [1, 2, 3]
            },
            'IDLE_PKT' : {
                'PACKET_NAME': 'IDLE_PKT',
                'PACKET_TYPE': 10,
                'FORMAT': [1, 2, 3]
            },
            'DELETE_PKT' : {
                'PACKET_NAME': 'DELETE_PKT',
                'PACKET_TYPE': 24,
                'FORMAT': [1, 2, 3, 4, 5]
            },
            'DELETE_CONFIRM_PKT' : {
                'PACKET_NAME': 'DELETE_CONFIRM_PKT',
                'PACKET_TYPE': 25,
                'FORMAT': [1, 2, 3, 4, 5]
            },
            'TAG_REGISTER_PKT' : {
                'PACKET_NAME': 'TAG_REGISTER_PKT',
                'PACKET_TYPE': 12,
                'FORMAT': [1,2,8,4,5,6]
            },
            'TAG_UNREGISTER_PKT' : {
                'PACKET_NAME': 'TAG_UNREGISTER_PKT',
                'PACKET_TYPE': 4,
                'FORMAT': [1,2,8,9,10]
            },
            'TAG_REGISTER_CONFIRM_PKT' : {
                'PACKET_NAME': 'TAG_REGISTER_CONFIRM_PKT',
                'PACKET_TYPE': 13,
                'FORMAT': [1,8,4,5,7]
            },
            'TAG_CHAT_MSG' : {
                'PACKET_NAME': 'TAG_CHAT_MSG',
                'PACKET_TYPE': 14,
                'FORMAT': [1, 2, 8, 4, 5, 19, 20, 11, 12, 13, 14, 15, 16, 17]
            },
            'TAG_DELIVER_PKT' : {
                'PACKET_NAME': 'TAG_DELIVER_PKT',
                'PACKET_TYPE': 15,
                'FORMAT': [1, 2, 3, 8, 4, 5]
            },
            'TAG_SEEN_PKT' : {
                'PACKET_NAME': 'TAG_SEEN_PKT',
                'PACKET_TYPE': 16,
                'FORMAT': [1, 2, 3, 8, 4, 5]
            },
            'TAG_TYPING_PKT' : {
                'PACKET_NAME': 'TAG_TYPING_PKT',
                'PACKET_TYPE': 18,
                'FORMAT': [1, 2, 8]
            },
            'TAG_IDLE_PKT' : {
                'PACKET_NAME': 'TAG_IDLE_PKT',
                'PACKET_TYPE': 19,
                'FORMAT': [1, 2, 8]
            },
            'TAG_DELETE_PKT' : {
                'PACKET_NAME': 'TAG_DELETE_PKT',
                'PACKET_TYPE': 26,
                'FORMAT': [1, 2, 8, 4, 5]
            },
            'TAG_DELETE_CONFIRM_PKT' : {
                'PACKET_NAME': 'TAG_DELETE_CONFIRM_PKT',
                'PACKET_TYPE': 27,
                'FORMAT': [1, 2, 3, 8, 4, 5]
            },
            'OFFLINE_REGISTER_PKT' : {
                'PACKET_NAME': 'OFFLINE_REGISTER_PKT',
                'PACKET_TYPE': 22,
                'FORMAT': [1, 2, 4, 5]
            },
            // THIS PACKET USER WILL RECEIVE FROM SERVER AFTER SENDING OFFLINE REGISTER PACKET,
            // THEN HE SHOULD STOP SENDING OFFLINE REGISTER PACKET
            'OFFLINE_CONFIRM_PKT' : {
                'PACKET_NAME': 'OFFLINE_CONFIRM_PKT',
                'PACKET_TYPE': 23,
                'FORMAT': [1, 4, 5, 17]
            },
            'FRIEND_OFFLINE_PKT' : {
                'PACKET_NAME': 'FRIEND_OFFLINE_PKT',
                'PACKET_TYPE': 20,
                'FORMAT': [1, 4, 5, 18, 1, 2, 4, 5, 21, 22, 11, 12, 13, 14, 15, 16, 17]
            },
            'TAG_OFFLINE_PKT' : {
                'PACKET_NAME': 'TAG_OFFLINE_PKT',
                'PACKET_TYPE': 21,
                'FORMAT': [1, 4, 5, 18, 1, 2, 8, 4, 5, 21, 22, 19, 20, 11, 12, 13, 14, 15, 16, 17]
            },
            'TAG_FRIEND_LIST_PKT' : {
                'PACKET_NAME': 'TAG_FRIEND_LIST_PKT',
                'PACKET_TYPE': 34,
                'FORMAT': [1, 2, 8, 4, 5, 23, 2]
            },
            // THESE PACKETS(58,59) USER WILL SEND AFTER GETTING OFFLINE MSG PACKETS SO THAT
            // SEVER DOESN'T SEND OFFLINE MESSAGE AGAIN
            'FRIEND_OFFLINE_CONFIRM_PKT' : {
                'PACKET_NAME': 'FRIEND_OFFLINE_CONFIRM_PKT',
                'PACKET_TYPE': 58,
                'FORMAT': [1, 2, 4, 5, 18, 4, 5] //Here noOfPackets is assumed as noOfMessages
            },
            'TAG_OFFLINE_CONFIRM_PKT' : {
                'PACKET_NAME': 'TAG_OFFLINE_CONFIRM_PKT',
                'PACKET_TYPE': 59,
                'FORMAT': [1, 2, 4, 5, 17, 18, 4, 5] //Here noOfPackets is assumed as noOfMessages
            }
        });
})();

/* 
 * © Ipvision 
 */
 
(function() {
	'use strict';

	angular
		.module('ringid.common.rgscrollbar_directive', [])
		.directive('rgScrollbar', rgScrollbar)
        .service('rgScrollbarService', rgScrollbarService);
        
        function rgScrollbar() {
            function linkFunc(scope, element, attr) {
                    // Configuration
                    var config = {
                        scrollbarWidth: 6,
                        scrollbarAlways: false,
                        dragSpeedModifier : 5,
                        minThumbHeight: 25
                    };
                     
                    var scrollbarContainer = null,
                        scrollbarMousedown = false,
                        scrollbarVisible = false,
                        scrollbar = angular.element(document.createElement('div')),
                        scrollbarThumb = angular.element(document.createElement('div')),
                       // elementComputedCSS = element[0].currentStyle || window.getComputedStyle(element[0]),
                        doc = angular.element(document),
                      //  elementMargin = parseFloat(elementComputedCSS.marginTop || 0)+parseFloat(elementComputedCSS.marginBottom || 0),
                        thumbHeight = getThumbHeight();
                        
                    element.wrap('<div class="ringscroll" style="position:relative;width:auto;overflow:hidden;height:100%;"></div>'); 
                    element.css({
                       overflow: 'hidden'   
                    }); 
                //console.log(elementComputedCSS.height+'=='+elementComputedCSS.maxHeight);
                    scrollbarContainer = element.parent();  
                    scrollbarContainer.append(scrollbar[0]);
                    scrollbarContainer.append(scrollbarThumb[0]);
                    scrollbar.addClass('scrollbar');
                    scrollbarThumb.addClass('thumb');
                    scrollbar.css({
                    	position: 'absolute',
                    	width: config.scrollbarWidth+'px',
                    	height: '100%',
                    	right: '1px',
                    	top: '0px',
                    	zIndex: 1
                    });
                    
                    scrollbarThumb.css({
                    	position: 'absolute',
                    	width: config.scrollbarWidth+'px',
                    	right: '1px',
                    	top: '0px',
                    	zIndex: 10
                    });
                    
                   // console.log(element);
                   

                    function scroll(pos) {
                         
                         var ratio, 
                             hiddenHeight, 
                             visibleHeight;
                         
                         hiddenHeight = element[0].scrollHeight - (element[0].offsetHeight);
                         visibleHeight = element[0].offsetHeight - thumbHeight; 
                         ratio = pos/visibleHeight;
                         element[0].scrollTop = hiddenHeight * ratio;
                         pos= Math.min(Math.max(pos, 0), visibleHeight);
                         scrollbarThumb.css('top', pos+'px');
                        
                         /*call bottom reach*/
                         if(pos==visibleHeight && angular.isFunction(scope.bottomReached)) {
                            scope.bottomReached();
                         }
                    }

                    function getThumbHeight() {
                           var display
                           thumbHeight = Math.max((element[0].offsetHeight/element[0].scrollHeight) * element[0].offsetHeight, config.minThumbHeight);
                           if(isNaN(thumbHeight) || thumbHeight=='Infinity') thumbHeight = 0;
                           display = (thumbHeight>=element[0].offsetHeight) ? 'none' : 'block';
                           scrollbarThumb.css({ height: thumbHeight + 'px', display: display});
                           scrollbar.css({ display: display });
                           
                           if(scrollbarContainer) {
                             //scrollbarContainer.css({height: element[0].offsetHeight + 'px'}); 
                           }
                     }
                      
                    function hideScrollbar() {
                       
                       if(config.scrollbarAlways) return ;
                       if(!scrollbarMousedown) {
                       	  scrollbar.css('opacity', 0); 
                      	  scrollbarThumb.css('opacity', 0); 
                      	  scrollbarVisible = false;
                       }
                    }
                    
                    function showScrollbar() {
                       getThumbHeight();
                       scrollbarVisible = true;
                       scrollbar.css('opacity', 1); 
                       scrollbarThumb.css('opacity', 1);
                    }

                    // Scroll on MouseWheel
                    var mousewheel = (typeof InstallTrigger !== 'undefined')?'DOMMouseScroll':'mousewheel';
                    element.on(mousewheel, function(event) {
                        event.preventDefault();
                        if(!scrollbarVisible) showScrollbar();
                        var barTop = parseFloat(scrollbarThumb.css('top'));
                        var delta = (event.wheelDelta)? - 1/40 * event.wheelDelta : event.detail*3;
                        var newPos = barTop + (delta * config.dragSpeedModifier);
                        scroll( newPos );
                    });
                    

                    // Scroll on Drag
                    scrollbarThumb.on('mousedown', function(event) {

                        event.preventDefault();
                        event.stopPropagation();
                        if(!scrollbarVisible) showScrollbar();
                        scrollbarMousedown = true;
                        var mouseY= event.pageY;
                        var barTop = parseFloat(scrollbarThumb.css('top'));

                        doc.on('mousemove', function(event) {
                            var newPos = barTop+event.pageY-mouseY;
                            scroll( newPos );
                        });

                        doc.on('mouseup', function(event) {
                            event.stopPropagation();
                            scrollbarMousedown = false;
                            doc.off('mousemove');
                            doc.off('mouseup');
                        });

                    });
                    
                

                    // Show scrollbar on hover
                    scrollbarContainer.on('mouseenter', showScrollbar);
                    scrollbarContainer.on('mouseleave', hideScrollbar);
                 
                    // manual scroll to top
                    scope.$on('scrollTop', function(event) {
                        setTimeout(function() {
                            scroll(0);
                        }, 10);
                    }); 

                }

            return {
                restrict: 'A',
                scope: {
                    bottomReached: '&'
                },
                link: linkFunc
            };

        }

        function rgScrollbarService() {
            return {
            
                scrollTop: function(scope) {
                    scope.$broadcast('scrollTop');
                }
            };
        }

})();
/*
 * © Ipvision
 */

(function() {
    'use strict';

    angular
            .module('ringid.common.rgdropdown_directive', ['ringid.config', 'ringid.common.rgscrollbar_directive'])
            .service('rgDropdownService', rgDropdownService)
            .directive('rgDropdown', rgDropdown);


    rgDropdownService.$inject = ['$document'];
    function rgDropdownService($document) {
        var self = this, openScope = null;

        self.open = function(dropdownScope) {
            // non existing scope so bind event
            if (!openScope) {
                $document.bind('click', self.closeDropdown);
            }

            // an existing open dropdown and got new dropdownScope. close existing one and proceed to open new one
            if (openScope && openScope.instanceId !== dropdownScope.instanceId) {
                //console.log('opening new while another one open');
                openScope.$parent.showDropdown = false;
            }

            openScope = dropdownScope;
        };

        self.close = function(dropdownScope) {
            if (openScope && openScope.instanceId === dropdownScope.instanceId) {
                //console.log('closing all dropdown and unbinding event');
                openScope = null;
                $document.unbind('click', self.closeDropdown);
            }
        };

        self.closeDropdown = function(event) {


            /*
            * http://ringgit.com/ringID/ringIDWeb/issues/99
            *
            * Firefox right click also detect as click
            *
            * */
            if( event.which == 3){
                return;
            }

            //event.preventDefault();
            openScope.$apply(function() {
                openScope.$parent.showDropdown = false;
            });
        };
    }


    rgDropdown.$inject = ['$http', '$compile', '$timeout', '$parse', 'rgDropdownService', 'rgScrollbarService', '$templateCache'];
    function rgDropdown($http, $compile, $timeout, $parse, rgDropdownService, rgScrollbarService, $templateCache) {

        DropdownController.$inject = ['$scope'];
        return {
            restrict: 'A',
            controller: DropdownController,
            link: linkFunc,
            //templateUrl: function(elem, attrs) {
            //return attrs.ddHtml;
            //},
            scope: {
                ddHtml: '=',
                ddControl: '=',
                ddAction: '&',
                ddOpened: '&',
                ddBeforeClose: '&'
            }
        };


        function DropdownController($scope) {
            var scope = $scope.$new();
            scope.instanceId = Math.floor(Math.random() * (100000 - 1)) + 1;

            scope.$watch('showDropdown', function(isOpen, wasOpen) {
                if (isOpen) {
                    rgDropdownService.open(scope);
                } else {
                    $scope.ddBeforeClose();
                    rgDropdownService.close(scope);
                }
                //rgScrollbarService.recalculate($scope);
            });

            scope.$on('$destroy', function() {
                scope.$destroy();
            });

        }

        function linkFunc(scope, element, attrs) {
            var template,
                onDropdown = false;

            scope.showDropdown = false;


            var handleDropdown = function(event) {
                if (!scope.showDropdown) {
                    $timeout(function() {
                        scope.showDropdown = !scope.showDropdown;

                        if (scope.showDropdown) {
                            scope.ddOpened();
                        }
                    });
                }
                //event.preventDefault();
            };

            var closeDropdown = function() {
                $timeout(function() {
                    //console.warn('CLOSE dropdow');
                    if(!onDropdown)  {
                        scope.showDropdown = false;
                    }

                }, 500);
            };

            element.on('click', handleDropdown);

            $http.get(scope.ddHtml,
                    {cache: $templateCache}).then(function(result) {
                template = $compile(result.data)(scope);
                element.after(template);

                template.on('click', function(event) {
                    console.info('clicked inside dropdown template. do nothing');
                    event.stopPropagation();
                });

                if(scope.ddControl && scope.ddControl.showOnHover) {
                    element.on('mouseleave', closeDropdown);

                    angular.element(template[0]).on('mouseenter', function() {
                        onDropdown = true;
                        //console.info('off mouseleave');
                        element.off('mouseleave', closeDropdown);
                    });
                    angular.element(template[0]).on('mouseleave', function() {
                        if(onDropdown) {
                            closeDropdown();
                        }
                        onDropdown = false;
                        //console.info('on mouseleave');
                        element.on('mouseleave', closeDropdown);
                    });

                }


            });

        }
    }

})();




/*
 * © Ipvision
 */

(function() {
    'use strict';
    angular.module('ringid.common.rgaccordion_directive', [])
        .directive('rgAccordion', function () {
            return {
                link: function (scope, element, atrr) {
                    var accordion_dom = element[0];
                    var title_selector = atrr.titleClass || '';
                    var desc_selector = atrr.descClass || '';
                    var titles = angular.element(accordion_dom.querySelectorAll('.' + title_selector));
                    var descs = angular.element(accordion_dom.querySelectorAll('.' + desc_selector));
                    titles.on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        titles.removeClass('active');
                        descs.removeClass('active');

                        this.className = this.className + ' active';
                        this.nextElementSibling.className = this.nextElementSibling.className + ' active';
                    });
                }
            }
        });
})();
/**
 * © Ipvision
 */

(function() {
    'use strict';

    angular
        .module('ringid.common.rgclick_directive', [])
        .directive('rgImgLoad', rgImgLoad)
        .directive('rgClick', rgClick)
        .directive('rgConditionalClick', rgConditionalClick);

        rgConditionalClick.$inject = [];

        function rgConditionalClick(){

            return function(scope,elem,attrs){
                if(angular.isFunction(attrs.rgConditionalClick)){
                    elem.bind("click", function(e){
                        attrs.rgConditionalClick();
                    });

                    scope.$on('$destroy',function(){
                        elem.unbind("click");
                    });
                }
            };

        }

        rgClick.$inject = ['$parse'];
        function rgClick($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var fn = $parse(attrs['rgClick']);
                    var noapply = attrs['rgClickNoapply'];

                    element.bind('click', function(event) {
                        event.preventDefault();
                        //event.stopPropagation();

                        if (!noapply) {
                            scope.$apply(function() {
                                fn(scope, {$event:event});
                            });
                        } else {
                            fn(scope, {$event:event});
                            scope.$digest();
                        }

                    });
                }
            };
        }

        function rgImgLoad() {
            return {
                restrict: 'A',
                transclude: true,
                link: function(scope, element, attrs) {
                    //var imgSrc = element[0].attr('src');
                    //console.log('image source: ' + imgSrc);
                    //element[0].attr('src', '');
                    element.on('load', function () {
                        console.log('image loaded');
                    });
                }
            };
        }



})();

/**
 * © Ipvision
 */

(function() {
    'use strict';
    angular
        .module('ringid.sticker', ['ringid.config'])
        .value('STICKER_IMAGE_TYPE', {
            EMOTICON  : 1,
            LARGE_EMOTICON : 2,
            STICKER : 3

        })
        .value('STICKER_COLLECTION_CATEGORY_PRE_FETCH_COUNT', 5 );

})();

/*
 * © Ipvision
 */

(function () {
    'use strict';

    angular
        .module('ringid.sticker')
        .service('stickerHttpService', stickerHttpService);

    stickerHttpService.$inject = ['$http', '$$connector', 'settings', 'OPERATION_TYPES'];
    function stickerHttpService($http, $$connector, settings, OPERATION_TYPES) {
        var STICKER_OPERATION_TYPES = OPERATION_TYPES.STICKER;
        var	SYSTEM_REQUEST_TYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE;
        var self = this;
        var stickerBaseUrl = settings.stickerBase.slice(0, -1);

        self.go = function (url, method, data ) {
            method = method || 'get';
            data = data || [];
            return $http[method](url, data);
        };

        self.getAll = function(data){
            var url = stickerBaseUrl + '?all=1';
            return self.go(url);
        };

        self.getStickerCategoriesByCollectionId = function (collectionId) {
            var url = stickerBaseUrl + '?collectionId=' + collectionId;
            return self.go(url);
        };

        self.getStickersByCatId = function (catId) {
            var url = stickerBaseUrl + '?categoryId=' + catId;
            return self.go(url);
        };


        self.getMyStickers = function () {
            var payload = {
                actn: STICKER_OPERATION_TYPES.GET_MY_STICKER
            };
            return $$connector.request(payload, SYSTEM_REQUEST_TYPE.REQUEST);

        };

        self.addSticker = function (obj) {
            var payload = {
                actn: STICKER_OPERATION_TYPES.ADD_REMOVE_STICKER,
                catId: obj.catId,
                jt : STICKER_OPERATION_TYPES.ADD_JT_VALUE
            };

            return $$connector.request(payload, SYSTEM_REQUEST_TYPE.UPDATE);
        };

        self.removeSticker = function (obj) {
            var payload = {
                actn: STICKER_OPERATION_TYPES.ADD_REMOVE_STICKER,
                catId: obj.catId,
                jt : STICKER_OPERATION_TYPES.REMOVE_JT_VALUE
            };

            return $$connector.request(payload, SYSTEM_REQUEST_TYPE.UPDATE);
        };



    }
})();

/**
 * © Ipvision
 */

(function () {
    'use strict';

    angular
        .module('ringid.sticker')
        .factory('StickerFactory', StickerFactory)
        .factory('$$stickerMap', $$stickerMap)
        .factory('$$stickerImageMap', $$stickerImageMap);

    $$stickerImageMap.$inject = ['settings', 'STICKER_IMAGE_TYPE'];
    function $$stickerImageMap(settings, STICKER_IMAGE_TYPE) {

        return {
            create: function (ob, stickerType, stickerSrcBaseUrl) {
                var types = {e: 1, el: 2, s: 3}; //emoticon : 1, emoticonlarge : 2 ,sticker 3
                var image = {
                    id: ob.id || 0,
                    name: ob.name || '',
                    symbol: ob.symbol || ob.name,
                    type: ob.type || 0,
                    src: (stickerType === 1) ? settings.emoticonBase + ob.name : stickerSrcBaseUrl + ob.name,
                    isEmoticon: stickerType === STICKER_IMAGE_TYPE.EMOTICON,
                    isLargeEmoticon: stickerType === STICKER_IMAGE_TYPE.LARGE_EMOTICON,
                    isSticker: stickerType === STICKER_IMAGE_TYPE.STICKER
                };

                return {
                    getKey: function () {
                        return image.id;
                    },
                    src: function () {
                        return image.src;
                    },
                    symbol: function () {
                        return image.symbol;
                    },
                    getName: function () {
                        return image.name;
                    },
                    isEmoticon: function () {
                        return image.isEmoticon;
                    },
                    isLargeEmoticon: function () {
                        return image.isLargeEmoticon;
                    },
                    isSticker: function () {
                        return image.isSticker;
                    }
                };
            }
        };
    }

    $$stickerMap.$inject = ['$$stackedMap', '$$stickerImageMap', 'settings'];
    function $$stickerMap($$stackedMap, $$stickerImageMap, settings) {


        return {
            create: function (ob, installed) {
                var stickerSrcBaseUrl = settings.stickerImageBase + ob.collectionId + '/' + ob.categoryId + '/';
                var image,
                    sticker = {
                        categoryId: ob.categoryId || 0,
                        collectionId: ob.collectionId || 0,
                        imageListMap: $$stackedMap.createNew(),
                        type: ob.type || 0,
                        isEmoticon: (ob.type === 1) ? true : false,
                        isLargeEmoticon: (ob.type === 2) ? true : false,
                        isSticker: (ob.type === 3) ? true : false,
                        regularUrl: (ob.type === 1) ? '/images/emoticon/c.png' :  + stickerSrcBaseUrl + 'c.png',
                        hoverUrl: (ob.type === 1) ? '/images/emoticon/ca.png' : stickerSrcBaseUrl + 'ca.png',
                        installed: installed || false
                    };

                // console.log(ob);
                for (var key in ob.imageList) {
                    image = $$stickerImageMap.create(ob.imageList[key], sticker.type, stickerSrcBaseUrl);
                    sticker.imageListMap.add(image.getKey(), image);
                }

                return {
                    sortBy: function () {
                        return sticker.categoryId;
                    },
                    isInstalled: function () {
                        return sticker.installed;
                    },
                    setInstalled: function (isInstalled) {
                        sticker.installed = isInstalled;
                    },
                    isEmoticon: function () {
                        return sticker.isEmoticon;
                    },
                    isLargeEmoticon: function () {
                        return sticker.isLargeEmoticon;
                    },
                    isSticker: function () {
                        return sticker.isSticker;
                    },
                    getKey: function () {
                        return sticker.categoryId;
                    },
                    getImages: function () {
                        return sticker.imageListMap;
                    },
                    getType: function () {
                        return sticker.type;
                    },
                    link: function () {
                        return sticker.regularUrl;
                    },
                    hoverLink: function () {
                        return sticker.hoverUrl;
                    }
                };
            }
        };
    }

    StickerFactory.$inject = ['$$stackedMap', '$$stickerMap', 'stickerHttpService', 'StickerEmoticonFactory', 'StickerHelper',
        'StickerCategoryModel', 'StickerCollectionModel', '$localStorage', 'STICKER_IMAGE_TYPE', '$q', 'Storage'];
    function StickerFactory($$stackedMap, $$stickerMap, stickerHttpService, StickerEmoticonFactory, StickerHelper,
                            StickerCategoryModel, StickerCollectionModel, $localStorage, STICKER_IMAGE_TYPE, $q, Storage) {

        var localStorageKey = 'stickerData';

        var myStickerLocalStorageKey = 'myStickers';

        /* Cashes All FactoryStickerObj By CategoryId */
        var allStickerIdMap = {};

        /* Cashes sticker details by catIds */
        var stickersByCatIdMap = {};

        /* Stores the sticker categories by group */
        var stickerCategories = {
            free : [],
            new : [],
            top : []
        };

        /* Stores sticker categories by collection id */
        var stickerCollections = {};

        /* Stores My Sticker CatIds */
        var myStickerList = {};


        /* $stickerMap holds the Emoticon and Sticker*/

        /* All Emoticon $stickerMap */
        var allEmoticon = StickerEmoticonFactory.getAllEmoticons();
        var emoticonMap = $$stickerMap.create(allEmoticon,true);

        /* All Sticker $stickerMap */
        //var allStickersMap = $$stickerMap.create(allEmoticon,true);

        var myStickerRefreshed = false;


        var initStickersByCatId = function(catId){
            var deferred = $q.defer();

            if(!stickersByCatIdMap[catId]){
                stickerHttpService.getStickersByCatId(catId)
                    .then(function(response){
                        var data = response.data;
                        if(data.sucs  === true){
                            StickerHelper.parseCategoryStickerData(data, stickersByCatIdMap, allStickerIdMap);
                            deferred.resolve(response);

                        }else{
                            console.log('ERROR IN STICKER DETAIL INIT FOR INVALID DATA');
                        }

                    }, function(response){
                        console.log('ERROR IN STICKER DETAIL INTT BY CAT ID');
                        deferred.reject(response);
                    });
            }

            return deferred.promise;
        };

        function initCollectionCategories(collectionFactoryObject){

            /* Parses Collection Categories To PRE FETCH LIMIT
             *
             * Does API Request To Get Categories under a collections.
             *
             * */
            // todo add limit on this call if there are too many collections, paginate support

            try{

                var collectionId = collectionFactoryObject.getKey();

                stickerHttpService.getStickerCategoriesByCollectionId(collectionId)
                    .then(function(response){
                        var data = response.data;
                        if(!!data && data.sucs === true && !!data['categoriesList']){

                            var categoryList = data['categoriesList'];

                            if(angular.isArray(categoryList)){
                                angular.forEach(categoryList, function(aCategory){

                                    var keyString = aCategory[StickerCategoryModel.getKeyString()];
                                    var stickerCategoryFactoryObject = allStickerIdMap[keyString];

                                    if(!stickerCategoryFactoryObject){
                                        stickerCategoryFactoryObject = StickerCategoryModel.create(aCategory);
                                        allStickerIdMap[stickerCategoryFactoryObject.getKey()] = stickerCategoryFactoryObject;
                                    }

                                    collectionFactoryObject.addCategories(stickerCategoryFactoryObject.getKey());

                                });
                            }

                        }else{
                            console.error("ERROR IN COLLECTION CATEGORY FETCH, INVALID RESPONSE")
                        }
                    }, function(response){
                        console.error("ERROR COLLECTION CATEGORY FETCH", response)
                    });

            }catch(e){
                console.error("PARSING ERROR IN COLLECTION CATEGORY LIST")
            }

        }

        function initStickerCollectionAndCategories(dataList){

            /* Parse Free Categories */
            try{
                angular.forEach(dataList['freeCategoriesList'], function(aCategory){

                    var aStickerCategoryFactoryObject = StickerCategoryModel.create(aCategory);
                    allStickerIdMap[aStickerCategoryFactoryObject.getKey()] = aStickerCategoryFactoryObject;
                    stickerCategories.free.push(aStickerCategoryFactoryObject.getKey());

                });
            }catch(e){
                console.error("PARSING ERROR STICKER FREE CATEGORY LIST", e);
            }

            /* Parse Top Categories */
            try{
                angular.forEach(dataList['topCategoriesList'], function(aCategory){

                    var aStickerCategoryFactoryObject = StickerCategoryModel.create(aCategory);
                    allStickerIdMap[aStickerCategoryFactoryObject.getKey()] = aStickerCategoryFactoryObject;
                    stickerCategories.top.push(aStickerCategoryFactoryObject.getKey());

                });
            }catch(e){
                console.error("PARSING ERROR STICKER Top CATEGORY LIST", e);
            }

            /* Parse New Categories */
            try{
                angular.forEach(dataList['stNewCategoriesList'], function(aCategory){

                    var aStickerCategoryFactoryObject = StickerCategoryModel.create(aCategory);
                    allStickerIdMap[aStickerCategoryFactoryObject.getKey()] = aStickerCategoryFactoryObject;
                    stickerCategories.new.push(aStickerCategoryFactoryObject.getKey());

                });
            }catch(e){
                console.error("PARSING ERROR STICKER New CATEGORY LIST", e);
            }

            /* Parse Collections */
            try{
                angular.forEach(dataList['stickerCollectionsList'], function(aCollection){

                    var aStickerCollectionFactoryObject = StickerCollectionModel.create(aCollection);

                    stickerCollections[aStickerCollectionFactoryObject.getKey()] = aStickerCollectionFactoryObject;

                    initCollectionCategories(aStickerCollectionFactoryObject);

                });
            }catch(e){
                console.error("PARSING ERROR STICKER FREE CATEGORY LIST", e);
            }

        }

        function fetchAllStickerData(){
            stickerHttpService.getAll().
                then(function(response){
                    try{
                        var data = response.data;
                        if(data.sucs === true){
                            saveStickerData(data);
                            initStickerCollectionAndCategories(data);
                            initMyStickers();
                        }
                    }catch(e){
                        console.log(e);
                    }

                }, function(response){
                    console.log(response);
                });
        }

        function getStickerData(){
            try{
                return Storage.getData(localStorageKey);
            }catch(e){
                return false;
            }
        }

        function saveStickerData(data){

            var stickerData = {};
            Storage.setData(localStorageKey, data);

        }

        function saveMyStickers(){
            Storage.setData(myStickerLocalStorageKey, myStickerList);
        }

        function initMyStickers(){
            myStickerList = Storage.getData(myStickerLocalStorageKey);
            if(!myStickerRefreshed || !myStickerList) {
                myStickerList = {};
                stickerHttpService.getMyStickers().then(function(response){
                    if(response.sucs === true){
                        angular.forEach(response.catIds, function(aCatId){
                            myStickerList[aCatId] = 1;
                            if(!!stickersByCatIdMap[aCatId]) {
                                stickersByCatIdMap[aCatId].setInstalled(true);
                            }
                        });
                        saveMyStickers();
                    }
                });

            }
        }

        function initStickerData(allData){
            try{
                initStickerCollectionAndCategories(allData);
            }catch(e){
                console.error('ERROR IN INIT STICKER DATA');
            }
        }

        function getStickerObjectById(stickerId) {
            try{
                return allStickerIdMap[stickerId]
            }catch(e){
                console.log('ERROR IN GETTING STICKER BY ID');
                return {}
            }
        }

        return {

            initStickerData : function(refresh){
                if(refresh === true){
                    fetchAllStickerData();
                }else{
                    var localData = getStickerData();
                    if(!angular.isObject(localData)){
                        fetchAllStickerData();
                    }else{
                        initStickerData(localData);
                        initMyStickers();
                    }
                }

            },
            getNoOfMyStickers: function () {
                return myStickerList ? Object.keys(myStickerList).length : 0;
            },

            getStickerCategories : function(){
              return stickerCategories;
            },

            getStickerCollections : function(){
              return stickerCollections;
            },

            getMyStickerCatIds: function () {
                return myStickerList ? Object.keys(myStickerList) : [];
            },

            getStickerMapByCatId :function(catId){
                var deferred = $q.defer();

                if(!!stickersByCatIdMap[catId]){
                    deferred.resolve(stickersByCatIdMap[catId]);

                }else{
                    initStickersByCatId(catId).then(function(){
                        deferred.resolve(stickersByCatIdMap[catId]);

                    }, function(response){
                        deferred.reject(response);
                    });
                }
                return deferred.promise;

            },
            isDownloaded : function(stickerCatId){
                return !!myStickerList[stickerCatId];
            },

            getStickerCategoryObject: function (key) {
                return getStickerObjectById(key);
            },

            getEmoticonMap: function () {
                return emoticonMap;
            },

            getMyStickers : function(){
                return stickerHttpService.getMyStickers();
            },

            addMySticker: function (stickerCatId) {
                try{
                    myStickerList[stickerCatId] = 1;
                    saveMyStickers();

                    if(!!stickersByCatIdMap[stickerCatId]) {
                        stickersByCatIdMap[stickerCatId].setInstalled(true);
                    }

                }catch(e){
                    console.error("ERROR IN ADD MY STICKER", e);
                }

                stickerHttpService.addSticker({catId: stickerCatId}).then(function (data) {
                    if(data.sucs !== true){
                        myStickerList[stickerCatId] = 0;
                        stickersByCatIdMap[stickerCatId].setInstalled(false);
                    }
                },function (errData) {
                    console.log(errData);

                });
            },
            removeMySticker: function (stickerCatId) {
                try{
                    delete myStickerList[stickerCatId];
                    saveMyStickers();

                    if(!!stickersByCatIdMap[stickerCatId]) {
                        stickersByCatIdMap[stickerCatId].setInstalled(false);
                    }

                }catch(e){
                    console.error("ERROR IN ADD MY STICKER", e);
                }

                stickerHttpService.removeSticker({catId: stickerCatId}).then(function (data) {
                    if(data.sucs !== true){
                        myStickerList[stickerCatId] = 1;
                        stickersByCatIdMap[stickerCatId].setInstalled(true);
                    }
                },function (errData) {
                    console.log(errData);
                });

            }

        };
    }


})();

(function() {
    'use strict';

    angular
        .module('ringid.utils', ['ringid.config','ringid.common.stacked_map','ringid.sticker']);
            
            
})();
(function() {
    'use strict';
    var app;
    app = angular.module('ringid.utils');

    app.factory('utilsFactory',utilsFactory);

    utilsFactory.$inject = ['$window','$document','settings','$filter','$cookies','StickerEmoticonFactory', 'RING_ROUTES'];

    function utilsFactory($window,$document,settings,$filter,$cookies,StickerEmoticonFactory, RING_ROUTES){
        var self = this,
            returnOb = {},
            //urlPattern = /((http|ftp|https):)?\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi,
            urlPattern = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
            //stickerPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi,
            stickerPattern = /^http:\/\/image\.ringid\.com\/?.*$/,

            emopattern = StickerEmoticonFactory.getEmoticonPattern(),

            Emomapper = StickerEmoticonFactory.getEmoticonUrlMap();

        var viewportsize = function(){
            var w = $window,
                d = $document,
                e = d[0].documentElement,
                g = d[0].getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight|| e.clientHeight|| g.clientHeight;
            return {x:x,y:y};
        };
      //  console.dir($window.Math);
        /**
         * @description : convert html entity to text.
         */
        var htmlentityencode = function(html){ //
            return String(html).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        };
        /**
         * @description text perser for link and emoticon
         * @param text
         * @returns converted text as html
         */
         var textParseForLinkAndEmo = function(text){
            text = htmlentityencode(text);
            var out;
            var flag=0;

            // for temp uploaded image file starts
            if(text.substring(0,9) == 'blob:http'){
                out = '<img title="' + text + '" width="100%" src="' + text + '" />';
                flag = 2;
            }
            // for temp uploaded image file ends
            //replacing the sticker starts
            if(flag !=2){
                out =  text.replace(stickerPattern, function(match) {
                    flag = 1;
                    return '<img title="' + match + '" width="100%" src="' + match + '" />';
                });
            }
            //replacing the sticker ends
            if(flag == 0){
                //replacing the link
                out =  out.replace(urlPattern, function(match) {
                    return '<a class="feedanchor" target="_blank" href="' + match + '"> ' + match.substr(0, 30) + '</a>';
                });//replacing the link
            }

            out =  out.replace(emopattern, function(match) {
                var img = new Image();
                img.src = Emomapper[match];
                return '<img title="' + match + '" src="' + Emomapper[match] + '" />';
            });//replacing the emo
            return out;
         };
         var getUniqueId = function(prefix){
             if (!prefix){
                 prefix = '';
             }
             return prefix + $window.Math.floor($window.Math.random() * (new $window.Date()).getTime());
         };

        var getTabId = function(){
            var currentTopId = $cookies.top,current;
               if(!!currentTopId){
                    current = parseInt(currentTopId) + 1;
                    if(current > 65534){ // tab id on backend is two byte
                        current = 1;
                    }
               } else {
                    current = 1;
               }
            $cookies.top = current;
            return current

        };
        function feedColumn(){

            if(!returnOb.viewport){
                returnOb.viewport = viewportsize();
            }
            var windowWidth = returnOb.viewport.x;

            if(windowWidth <= 1245) { // device between 720 and 980
                return 1;
            }else if(windowWidth >= 1245 && windowWidth <=1800){
                return 2;
            }else if(windowWidth > 1800){
                return 3;
            }
        }

        function FeedCellWidth(){
            var feedCol = feedColumn();
                return (returnOb.viewport.x - (settings.LEFT_BAR_WIDTH + settings.RIGHT_BAR_WIDTH + (feedCol * settings.CELL_MARGIN)))/feedCol;
        }



        returnOb =  {

            getRingRoute : getRingRoute,

            tabId : getTabId(),
            getTabId : getTabId,

            viewport : viewportsize(),
            viewportsize : viewportsize,
            feedCellWidth : FeedCellWidth(),
            setFeedCellWidth : function(){
                returnOb.feedCellWidth = FeedCellWidth();
            },
            hasSocket : function(){
                return true;
                //console.log($localStorage.socketon);
                //console.log($localStorage.loginData.socketOn);
                //return $localStorage.loginData && !!$localStorage.loginData.socketOn;
            },
            parseForLE : function(text){ // prases for link and emoticon
                return textParseForLinkAndEmo(text);
            },
            init:function(){
                //returnOb.viewport = viewportsize();
            },
            feedColumn : function(){
                return feedColumn();
               // return returnOb.viewport.x < 1920 ? 2 :3;
            },
            getUniqueID: function (prefix) {
                return getUniqueId(prefix);
            },
            getToken : '234', //$document[0].getElementById('sectoken').getAttribute('data-sec'),
            verbalDate : function(timestamp,fromTimeStamp){
                var date,diff,day_diff,Math = $window.Math;

                fromTimeStamp = fromTimeStamp || new Date().getTime();

                 if(isNaN(timestamp)){
                     date = new Date((timestamp || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
                     timestamp = date.getTime();
                 }
                    diff = ((fromTimeStamp - timestamp) / 1000);//diff in second
                    day_diff = Math.floor(diff / 86400);// 1 day = 86400 second// its calculate diff in day

                if ( isNaN(day_diff) || day_diff < 0 )
                    return "";


                switch (true){
                    case day_diff === 0: // time is equal from date
                         // when diff ==0
                        switch(true){
                            case diff < 60:
                                return "just now";
                            case diff < 120 :
                                return "1 minute Ago";
                            case diff < 3600 : // within a hour
                                return Math.floor( diff / 60 ) + " minutes ago";
                            case diff < 7200 :
                                return "1 hour ago";
                            case diff < 86400 : //within a day show as minute
                                return Math.floor( diff / 3600 ) + " hours ago";
                            default :
                                return $filter('date')(timestamp,"MMM d, h:mm a");
                        }
                        break;
                    case day_diff === 1 : // 1 day before from date
                          return "yesterday at "+ $filter('date')(timestamp,"h:mm a");
                    case day_diff < 7 :
                        return $filter('date')(timestamp,"EEEE 'at' h:mm a");
                    case day_diff < 365 :
                        return $filter('date')(timestamp,"MMMM d 'at' h:mm a");
                    default :
                        return $filter('date')(timestamp,"MMM d, YYYY");
                }
            }

        };

        ////////////////////////////


        function getRingRoute(name, params){

            if( !RING_ROUTES[name] )
                return '';

            var routeString = RING_ROUTES[name];

            switch (name){
                case 'HOME':
                case 'FAQ' :
                    break;

                case 'SINGLE_FEED':
                    if( !!params['feedId']){
                        routeString =  routeString.replace(':feedId', params['feedId']);
                    }

                    var shared = !!params['shared'] ? 'shared' : '';
                    routeString =  routeString.replace(':shared?', shared );
                    break;

                case 'WHO_SHARED_FEED' :
                    if( !!params['feedId']){
                        routeString =  routeString.replace(':feedId', params['feedId']);
                    }
                    break;


                case 'SINGLE_IMAGE':
                    if( !!params['imageId']){
                        routeString = routeString.replace(':imageId', params['imageId']);
                    }
                    break;

                case 'USER_PROFILE':
                    if( !!params['uId']){
                        routeString = routeString.replace(':uId', params['uId']);
                    }else{
                        console.log(params);
                        console.warn('Invalid Route Params Provided');
                    }

                    if( !!params['utId']){
                        routeString = routeString.replace(':utId', params['utId']);
                    }else{
                        routeString = routeString.replace('/:utId', '');
                    }
                    break;

                case 'CIRCLE_HOME':
                    if( !!params['circleId']){
                        routeString = routeString.replace(':circleId', params['circleId']);
                    }
                    break;


            }

            if( !!params['subpage']){
                routeString = routeString.replace(':subpage?', params['subpage'])
            }else{
                routeString = routeString.replace('/:subpage?', '')
            }

            return '#' + routeString;

        }

      return returnOb;




    };




})();

(function () {
    'use strict';
    var app;
    app = angular.module('ringid.utils');

    app.directive('loadMore', ['$window', '$document', 'utilsFactory', function ($window, $document, utilsFactory) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {

                    var windowEl = angular.element($window);
                    var viewport = utilsFactory.viewport;

                    var loadMoreFunction = function () {

                        //if(windowEl[0].pageYOffset > element[0].scrollHeight-150){
                        //    scope.$apply(attr.loadMore);
                        //}
                        //console.log("window -y : " + windowEl[0].scrollY );
                        //console.log("element height - 500 : "+ element[0].scrollHeight + "  - " +(element[0].scrollHeight - 800 ));
                        //if (windowEl[0].scrollY > element[0].scrollHeight - 800) {
                        //    scope.$apply(attr.loadMore);
                        //}
                        //
                        var diff = (element[0].clientHeight - (viewport.y + windowEl[0].scrollY));
                        var modifier = Math.max((element[0].clientHeight/10000),1);
                        //  console.log("client height : " + element[0].clientHeight + " Viewpot : " +viewport.y + " Scroll y :" + windowEl[0].scrollY +" dif : "+ diff);
                        if (diff < 400*modifier) {
                            scope.$apply(attr.loadMore);
                        }



                    };
                    windowEl.bind("scroll", loadMoreFunction);
                    var cleanupEvents = function () {
                        windowEl.off('scroll', loadMoreFunction);
                    };
                    // console.log(elem.scrollTop);


                    scope.$on('$destroy', cleanupEvents);

                }
            };

        }]);

    //app.directive()
    app.directive('autoGrow', autoGrow);


    //autoGrow.$inject = ['$rootScope'];
    //function autoGrow($rootScope) {
    //    return {
    //        restrict: 'A',
    //        link: function ($scope, elem, attrs) {
    //
    //            var prevValue = '';
    //
    //            $scope.$on('postsubmitted',function(){
    //                elem.css('height','20px');
    //            });
    //
    //
    //            var setBindings = function (event) {
    //
    //
    //
    //                var element = this, diff, lineHeight = 20;
    //
    //                element.style.overflow = 'hidden';
    //
    //                var currentValue = element.value.split('\n').length;
    //                var line = Math.ceil(element.value.length / 47);
    //                currentValue = currentValue + line;
    //                var sch = element.scrollHeight-12;
    //
    //                //console.log(elem.value);
    //                if(elem.value == ''){
    //                    console.log('zero');
    //                }
    //
    //                var setHeight = function () {
    //                    element.style.height = parseInt((sch - (diff * lineHeight))) + 'px';
    //
    //                };
    //                if (currentValue !== prevValue) {
    //                    element.style.height = sch + 'px';
    //                }
    //
    //                if (currentValue < prevValue) {
    //                    diff = prevValue - currentValue;
    //                    setHeight();
    //                }
    //
    //                prevValue = element.value.split('\n').length;
    //
    //                if (elem[0].value == '') {
    //                    element.style.height = '20px';
    //                }
    //
    //                var contentElement = document.getElementById("content");
    //                var ech = element.clientHeight;
    //
    //                var imageel = document.getElementById('img-height').offsetWidth;
    //
    //                $rootScope.$broadcast('elheight', ech);
    //
    //            };
    //            elem.on('keyup keydown keypress change', setBindings);
    //            var cleanUpBindings = function () {
    //                elem.off('keyup keydown keypress change', setBindings);
    //            }
    //
    //
    //
    //            $scope.$on('$destroy', cleanUpBindings);
    //
    //        }
    //    };
    //}

    function autoGrow() {
        return {
            restrict: 'A',
            link: function ($scope, elem, attrs) {

                var statusbox = elem[0], minHeight = 35, outerHeight, diff, imageHeight = 0,
                        autoGrowPost = attrs.autoGrowPost,feedEditGrow = attrs.feedEditGrow;

                //console.log(elem[0]);
                //document.querySelector("div.cell:first-child+div.cell").style.marginTop = elem[0].clientHeight;
                var adjustStatusBox = function () {
                    outerHeight = parseInt(window.getComputedStyle(statusbox).height);
                    diff = outerHeight - statusbox.clientHeight;
                    statusbox.style.height = 0;
                    statusbox.style.height = Math.max(minHeight, statusbox.scrollHeight + diff) + 'px';
                };


                var adjustFeedCell = function () {
                    console.log(elem[0].clientHeight);
                    //if(!elem[0].clientHeight){
                    //    elem[0].clientHeight=42;
                    //}
                    document.querySelector("div.cell:first-child+div.cell").style.marginTop = imageHeight + elem[0].clientHeight + 110 + 'px';
                };

                statusbox.addEventListener('input', function () {
                    adjustStatusBox();
                    if (autoGrowPost === 'true') {
                        adjustFeedCell();
                    }
                });
                var destroyImageAddedListener = $scope.$on('imageAdded', function (event, data) {
                    if (elem[0].attributes['auto-grow-post']) {
                        if (data < 0 && imageHeight > 0) {
                            imageHeight = 0;
                            adjustFeedCell();
                        } else if (data > 0 && imageHeight === 0) {
                            imageHeight = data-40;
                            adjustFeedCell();
                        }
                    }
                });

                //$scope.$on('enableeditor', function (event, data) {
                //    //feedEditBox();
                //    var height;
                //    var numberOfLines = data.feedText.split('\n').length;
                //
                //    if(numberOfLines == 1){
                //        height =  '32px';
                //    }else{
                //        height = numberOfLines*16 + 'px';
                //
                //    }
                //    if (feedEditGrow === 'true') {
                //        elem.css('height', height);
                //    }
                //
                //    //console.log(data.split('\n').length);
                //});

                $scope.$on('postsubmitted', function ($event, data) {
                    elem.css('height', '20px');
                    imageHeight = 0;
                    adjustFeedCell();

                });

                $scope.$on('$destroy', function () {
                    elem.off('imageAdded');
                });
            }
        };

    }


    app.directive("removeMe", function() {
        return {
            link:function(scope,element,attrs)
            {
                element.bind("click",function() {
                    element.remove();
                });
            }
        }

    });

})();
(function () {
    "use strict";
    angular
        .module('ringid.common.stacked_map', [])
        .factory('$$stackedMap', function () {
            return {
                createNew: function (dosort, order) {
                    var stack = [], self = this;
                    dosort = dosort || false;
                    order = order || "desc";

                    //function sortIt(){
                    //    stack.sort(function(a,b){
                    //        return (order === 'desc')? b.value['sortBy']() - a.value['sortBy']():a.value['sortBy']() - b.value['sortBy']();
                    //    });
                    //}
                    function sortIt(prop_index) {
                        prop_index = prop_index || 'sortBy';
                        var gt = -1, lt = 1;
                        if (order === 'desc') {
                            gt = 1;
                            lt = -1;
                        }
                        stack.sort(function (a, b) {
                            if (b.value[prop_index]() > a.value[prop_index]())
                                return gt;
                            if (a.value[prop_index]() > b.value[prop_index]())
                                return lt;
                            return 0;
//                                return (order === 'desc') ? b.value[prop_index]() > a.value[prop_index]() : a.value[prop_index]() > b.value[prop_index]();
                        });
                    }
                    function getIndex(key) {
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                return i;
                            }
                        }
                        return -1;
                    }

                    function navigateNext(key) {
                        var index = getIndex(key);
                        if (index === -1 || index === (stack.length - 1))
                            return false;

                        return stack[index + 1].value;

                    }

                    function navigatePrevious(key) {
                        var index = getIndex(key);
                        if (index === -1 || index === 0)
                            return false;

                        return stack[index - 1].value;

                    }


                     return {
                        concat:  function(stackedMap) {
                            stack = stack.concat(stackedMap);

                        },
                        reset: function () {
                            stack.length = 0;
                        },
                        all: function () {
                            return stack;
                        },
                        setStack: function (st) {
                            stack = st;
                        },
                        add: function (key, value) {
                            stack.push({
                                key: key,
                                value: value
                            });
                            if (dosort !== false) {
                                sortIt();
                            }
                            return false;
                        },
                        next: function (key) {
                            return navigateNext(key);
                        },
                        previous: function (key) {
                            return navigatePrevious(key);
                        },
                        getIndex: function (key) {
                            return getIndex(key);
                        },
                        get: function (key) {
                            var i = getIndex(key);
                            return i >= 0 ? stack[i].value : !1;
                        },
                        save: function (key, value) {
                            var idx;
                            idx = getIndex(key);
                            if (idx === -1) {
                                this.add(key, value);//pushing if not existing index
                            } else {
                                stack[idx] = {key: key, value: value};//saving if existing index
                            }
                            if (dosort !== false) {
                                sortIt();
                            }
                        },
                        sort: function (type, prop_index) {
                            if (type)
                                order = type;
                            sortIt(prop_index);

                        },

                        keys: function () {
                            var keys = [];
                            for (var i = 0; i < stack.length; i++) {
                                keys.push(stack[i].key);
                            }
                            return keys;
                        },
                        top: function (withIndex) {
                            if(!stack.length)return false;
                            withIndex = !!withIndex;//
                            return (withIndex) ?stack[stack.length - 1] : stack[stack.length - 1].value;
                        },
                        bottom: function(withIndex) {
                            if(!stack.length)return false;
                            withIndex = !!withIndex;//
                            return (withIndex) ?stack[0] : stack[0].value;
                        },
                        sliceBy: function (length, starting_index) {
                            //if(!length)return stack;
                            if (!starting_index)starting_index = 0;
                            if (length > stack.length || !length)length = stack.length;
                            return stack.slice(starting_index, length);
                        },


                        remove: function (key) {
                            var idx = getIndex(key);
                            return idx > -1 ? stack.splice(idx, 1)[0]:[];
                        },
                        removeTop: function () {
                            return stack.splice(stack.length - 1, 1)[0];
                        },
                        length: function () {
                            return stack.length;
                        },
                        nonClosedLength: function(){
                            var count = 0;
                            //var boxesArray = boxes.all();
                            angular.forEach(stack, function(box, key){
                                count += box.closedBox ? 1 : 0;
                            });
                            return count;
                        },
                        copy: function () { // shallow copy pushing just into a new stack but the value reference is same
                            var ob = self.createNew(dosort, order);
                            for (var i = 0; i < stack.length; i++) {
                                ob.add(stack[i].key, stack[i].value);
                            }
                            return ob;
                        },
                        doForAll : function(fn){ // looping through all and process a function
                            for (var i = 0; i < stack.length; i++) {
                               fn.call(null,stack[i].value);
                            }
                        }
                    };
                }
            };
        });
})();
//{"dvc":5,"lot":1429161670578,"actn":175,"rc":0,"chIp":"38.127.68.55","sucs":true,"fndId":"2000003519","pckId":"20000045691429161692648","psnc":2,"chRp":1500,"pckFs":172412}
//{"dvc":5,"lot":1429161692821,"actn":175,"rc":0,"chIp":"38.127.68.55","sucs":true,"fndId":"2000004569","psnc":2,"chRp":1500,"pckFs":172412}

(function() {
    'use strict';
    var app;
    app = angular.module('ringid.utils');

    app.factory('windowFocusHandler',windowFocusHandler);
    windowFocusHandler.$inject = ['$window','utilsFactory','$$stackedMap'];


    function windowFocusHandler($window,utilsFactory,$$stackedMap){

        var fns = $$stackedMap.createNew();

        var process = function(){
            fns.doForAll(function(fn){
                fn.call(null);
            });
        };

        $window.onfocus = process;

        return {
            add : function(fn){
                var key = utilsFactory.getUniqueID();
                fns.add(key,fn);
                return key
            },
            remove : function(key){
                return fns.remove(key);
            },
            fire : function(){//to manually fire focus event
                process();
            }

        };
    }
    app.factory('windowBlurHandler',windowBlurHandler);
    windowBlurHandler.$inject = ['$window','utilsFactory','$$stackedMap'];


    function windowBlurHandler($window,utilsFactory,$$stackedMap){

        var fns = $$stackedMap.createNew();

        var process = function(){
            fns.doForAll(function(fn){
                fn.call(null);
            });
        };

        $window.onblur = process;

        return {
            add : function(fn){
                var key = utilsFactory.getUniqueID();
                fns.add(key,fn);
                return key
            },
            remove : function(key){
                return fns.remove(key);
            },
            fire : function(){//to manually fire focus event
                process();
            }

        };
    }

})();
'use strict';
angular.module("ringid.ringbox",['ringid.common.stacked_map','ringid.utils'])
    .directive('ringboxOverlay', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'pages/ringbox/ringoverlay.html',
            link: function (scope, element, attrs) {


            }
        };
    }])

    .directive('ringboxContainer', ['$boxStack', '$timeout','utilsFactory', function ($boxStack, $timeout,utilsFactory) {
        return {
            restrict: 'EA',
            scope: {
                index: '@',
                animate: '='
            },
            replace: true,
            transclude: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || 'pages/ringbox/ringbox.html';
            },
            link: function (scope, element, attrs) {
                element.addClass(attrs.windowClass || '');
                scope.size = attrs.size;
                element.on('click', function(evt) {
                    evt.stopPropagation();
                    scope.close(evt);
                });

                $timeout(function () {
                    if (!element[0].querySelectorAll('[autofocus]').length) {
                        element[0].focus();
                    }

                });
              
               /*
                scope.$on('ringbox.content.changed',function($event,$data){

                    if($data.height > 10){
                        var margintop = (utilsFactory.viewport.y - $data.height)/2;
                        element.children().css({'margin-top':margintop +'px'});
                    }
                });
               */ 

                scope.boxIsLoading = function(){
                    var box = $boxStack.getTop();
                   if(box){
                       return box.value.boxScope.boxIsLoading;
                   }
                    return false;

                };

                scope.close = function (evt) {
                    var box = $boxStack.getTop();
    
                    if (box && box.value.backdrop && box.value.backdrop != 'static' && evt.target.className.indexOf('ringbox-outerContainer')>=0) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $boxStack.dismiss(box.key, 'backdrop click');
                    }
                };
                
               /*
                if(element.children()[0].clientHeight > 10){
                    var margintop = (utilsFactory.viewport.y - element.children()[0].clientHeight)/2;
                    element.children().css({'margin-top':margintop +'px'});
                } */
            }
        };
    }])

    .directive('boxTransclude', function () {
        return {
            link: function($scope, $element, $attrs, controller, $transclude) {
                $transclude($scope.$parent, function(clone) {
                    var old = $element.html();
                    $element.empty();
                    $element.append(clone);
                    //$element.append(old);
                });
            }
        };
    })

    .factory('$boxStack', ['$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
        function ( $timeout, $document, $compile, $rootScope, $$stackedMap) {

            var OPENED_BOX_CLASS = 'ringbox-opened';

            var backdropDomEl, backdropScope;
            var openedWindows = $$stackedMap.createNew();
            var $boxStack = {};

            function backdropIndex() {
                var topBackdropIndex = -1;
                var opened = openedWindows.keys();
                for (var i = 0; i < opened.length; i++) {
                    if (openedWindows.get(opened[i]).backdrop) {
                        topBackdropIndex = i;
                    }
                }
                return topBackdropIndex;
            }

            $rootScope.$watch(backdropIndex, function(newBackdropIndex){
                if (backdropScope) {
                    backdropScope.index = newBackdropIndex;
                }
            });

            function removeBoxWindow(boxlInstance) {

                var body = $document.find('body').eq(0);
                var boxWindow = openedWindows.get(boxlInstance);

                //clean up the stack
                openedWindows.remove(boxlInstance);

                //remove window DOM element
                removeAfterAnimate(boxWindow.boxDomEl, function() {
                    boxWindow.boxScope.$destroy();
                    body.toggleClass(OPENED_BOX_CLASS, openedWindows.length() > 0);
                    checkRemoveBackdrop();
                });
            }

            function checkRemoveBackdrop() {
                //remove backdrop if no longer needed
                if (backdropDomEl && backdropIndex() == -1) {
                    var backdropScopeRef = backdropScope;
                    removeAfterAnimate(backdropDomEl, function () {
                        backdropScopeRef.$destroy();
                        backdropScopeRef = null;
                    });
                    backdropDomEl = undefined;
                    backdropScope = undefined;
                }
            }

            function removeAfterAnimate(domEl, done) {



                var asyncFunction = function(){
                    domEl.remove();
                    if (done) {
                        done();
                    }
                };
                $timeout(asyncFunction);
            }

            $document.bind('keydown', function (evt) {
                var box;

                if (evt.which === 27) {
                    box = openedWindows.top(true);// with index
                    if (box && box.value.keyboard) {
                        evt.preventDefault();
                        $rootScope.$apply(function () {
                            $boxStack.dismiss(box.key, 'escape key press');
                        });
                    }
                }
            });

            $boxStack.open = function (boxInstance, box) {

                openedWindows.add(boxInstance, {
                    deferred: box.deferred,
                    boxScope: box.scope,
                    backdrop: box.backdrop,
                    index: openedWindows.length(),
                    keyboard: box.keyboard
                });

                var body = $document.find('body').eq(0),
                    currBackdropIndex = backdropIndex();

                if (currBackdropIndex >= 0 && !backdropDomEl) {
                    backdropScope = $rootScope.$new(true);
                    backdropScope.index = currBackdropIndex;
                    var overlayDom = angular.element('<div ringbox-overlay></div>');
                    overlayDom.attr('backdrop-class', box.backdropClass);
                    backdropDomEl = $compile(overlayDom)(backdropScope);
                    body.append(backdropDomEl);
                }

                var angularDomEl = angular.element('<div ringbox-container></div>');
                angularDomEl.attr({
                    'template-url': box.windowTemplateUrl,
                    'window-class': box.windowClass,
                    'size': box.size,
                    'index': openedWindows.length() - 1,
                    'animate': 'animate'
                }).html(box.content);

                var boxDomEl = $compile(angularDomEl)(box.scope);
                openedWindows.top().boxDomEl = boxDomEl;
                body.append(boxDomEl);
                body.addClass(OPENED_BOX_CLASS);

            };

            $boxStack.close = function (boxlInstance, result) {
                var boxWindow = openedWindows.get(boxlInstance);
                if (boxWindow) {
                    boxWindow.deferred.resolve(result);
                    removeBoxWindow(boxlInstance);
                }
            };

            $boxStack.dismiss = function (boxlInstance, reason) {
                var boxWindow = openedWindows.get(boxlInstance);
                if (boxWindow) {
                    boxWindow.deferred.reject(reason);
                    removeBoxWindow(boxlInstance);
                }
            };

            $boxStack.setContent = function(boxInstance,tpl){
                var boxWindow,body = $document.find('body').eq(0);
                if(boxInstance){
                    boxWindow = openedWindows.get(boxInstance);
                }else{
                    boxWindow = this.getTop().value;
                }
                //boxWindow = boxWindow.value;
                boxWindow.boxDomEl.remove();
                var angularDomEl = angular.element('<div ringbox-container></div>');
                angularDomEl.attr({
                    'index': boxWindow.index,
                    'animate': 'animate'
                }).html(tpl);

                var boxDomEl = $compile(angularDomEl)(boxWindow.boxScope);
                boxWindow.boxDomEl = boxDomEl;
                body.append(boxDomEl);
            };


            $boxStack.dismissAll = function (reason) {
                var topBox = this.getTop();
                while (topBox) {
                    this.dismiss(topBox.key, reason);
                    topBox = this.getTop();
                }
            };

            $boxStack.getTop = function () {
                return openedWindows.top(true);
            };

            return $boxStack;
        }])

    .provider('$ringbox', function () {

        var $ringboxProvider = {
            options: {
                backdrop: true, //can be also false or 'static'
                keyboard: true,
                navigation: false,
                boxIsLoading : true
            },
            $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$boxStack',
                function ($injector, $rootScope, $q, $http, $templateCache, $controller, $boxStack) {

                    var $ringbox = {};

                    function getTemplatePromise(options) {
                        return options.template ? $q.when(options.template) :
                            $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                                {cache: $templateCache}).then(function (result) {
                                    return result.data;
                                });
                    }

                    function getResolvePromises(resolves) {
                        var promisesArr = [];
                        angular.forEach(resolves, function (value) {
                            if(angular.isDefined(value.promise)){
                                promisesArr.push(value.promise);
                            } else if (angular.isFunction(value) || angular.isArray(value)) {
                                promisesArr.push($q.when($injector.invoke(value)));
                            }
                        });
                        return promisesArr;
                    }
                    $ringbox.open = function (boxOptions) {

                        var boxResultDeferred = $q.defer();
                        var boxOpenedDeferred = $q.defer();



                        //merge and clean up options
                        boxOptions = angular.extend({}, $ringboxProvider.options, boxOptions);
                        boxOptions.resolve = boxOptions.resolve || {};
                        var boxScope = (boxOptions.scope || $rootScope).$new();
                        angular.forEach($ringboxProvider.options,function(value,key){
                            boxScope[key] = boxOptions[key];
                        });

                        //verify options
                        if (!boxOptions.template && !boxOptions.templateUrl) {
                            throw new Error('One of template or templateUrl options is required.');
                        }

                        var templateAndResolvePromise =
                            $q.all([getTemplatePromise(boxOptions)].concat(getResolvePromises(boxOptions.resolve)));
                        //prepare an instance of a modal to be injected into controllers and returned to a caller
                        var boxlInstance = {
                            result: boxResultDeferred.promise,
                            opened: boxOpenedDeferred.promise,
                            close: function (result) {
                                $boxStack.close(boxlInstance, result);
                            },
                            loading : function(state){
                                boxScope.boxIsLoading = !!state;
                            },
                            dismiss: function (reason) {
                                $boxStack.dismiss(boxlInstance, reason);
                            },
                            setContent : function(options){
                                var templateAndVarPromise = $q.when(getTemplatePromise(options));
                                templateAndVarPromise.then(function(tpl){
                                    //console.dir(tpl);
                                    $boxStack.setContent(boxlInstance,tpl);
                                });
                            },
                            resize : function(){
                                console.log("The Ring box resize function is deprecated please avoid using it");
                            }
                        };
                        $boxStack.open(boxlInstance, {
                            scope: boxScope,
                            deferred: boxResultDeferred,
                            content:"",
                            backdrop: boxOptions.backdrop,
                            keyboard: boxOptions.keyboard,
                            backdropClass: boxOptions.backdropClass,
                            windowClass: boxOptions.windowClass,
                            windowTemplateUrl: boxOptions.windowTemplateUrl,
                            size: boxOptions.size
                        });

                        templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

                            boxScope.boxIsLoading = false;
                            boxScope.$close = boxlInstance.close;
                            boxScope.$dismiss = boxlInstance.dismiss;

                            var ctrlInstance, ctrlLocals = {};
                            var resolveIter = 1;

                            //controllers
                            if (boxOptions.controller) {
                                ctrlLocals.$scope = boxScope;
                                ctrlLocals.$boxInstance = boxlInstance;
                                angular.forEach(boxOptions.resolve, function (value, key) {
                                    ctrlLocals[key] = tplAndVars[resolveIter++];
                                });

                                ctrlInstance = $controller(boxOptions.controller, ctrlLocals);
                                if (boxOptions.controllerAs) {
                                    boxScope[boxOptions.controllerAs] = ctrlInstance;
                                }
                            }


                            $boxStack.setContent(boxlInstance,tplAndVars[0]);

                        }, function resolveError(reason) {
                            boxResultDeferred.reject(reason);
                        });

                        templateAndResolvePromise.then(function () {
                            boxOpenedDeferred.resolve(true);
                        }, function () {
                            boxOpenedDeferred.reject(false);
                        });

                        return boxlInstance;
                    };

                    return $ringbox;
                }]
        };

        return $ringboxProvider;
    })
    .directive('rgRingbox',['$ringbox','Ringalert',function($ringbox,Ringalert){
        return {
            restrict : 'EA',
            scope:{
                ringboxData : '&',
                onRingBoxOpen : '&',
                onRingBoxClose : '&',
                ringboxFalsyFunc : '&'
            },
            link : function(scope,element,attr){

                function mainFunction(event){
                    event.preventDefault();
                    event.stopPropagation();

                    var type,target,items={};

                    type = attr.ringboxType;// html,remote:require template url
                    if(!type)type='html';//innerhtmlof the provided content or a data content

                    //template = "hello How Are You";
                    if(attr.ringboxData){
                        if(angular.isFunction(scope.ringboxData)){
                            items = scope.ringboxData();
                        }
                    }
                    var tempitems = items.data ? items.data:items;
                  //  promises = items.promise ? items.promise:angular.noop;
                    var ringOb = {
                        type : type,
                        scope : attr.ringboxScope?scope:false,
                        controller: attr.ringboxController || '',
                        resolve : {
                            localData : tempitems,
                            remoteData : items.promise ? items:angular.noop
                        },
                        onBackDropClickClose : attr.ringBackdropClose || true
                    };
                    if(type === 'remote'){
                        ringOb.templateUrl = attr.ringboxTarget || scope.ringboxTarget || attr.href || attr.src;
                    }else if(type === 'video'){

                    }else{
                        type = 'html';
                        target = attr.ringboxTarget || scope.ringboxTarget;
                        if(!target){
                            ringOb.template = element.html();
                        }else{
                            ringOb.template = angular.element(document.querySelector(target));
                            if(ringOb.template.length > 0){
                                ringOb.template = ringOb.template[0].outerHTML;
                            }else{
                                throw new Error("Opps ! Your Provideed Target element Does Not Exist!");
                            }
                        }

                    }
                    var boxInstance = $ringbox.open(ringOb);

                    //boxInstance.resize(1000,1000);

                    boxInstance.result.then(function (selectedItem) {
                        if(angular.isDefined(scope.onRingBoxClose) && angular.isFunction(scope.onRingBoxClose)){
                            scope.onRingBoxClose();
                        }

                        //console.log("closed from directive");
                    }, function () {

                    });
                    boxInstance.opened.then(function(){

                        if(angular.isDefined(scope.onRingBoxOpen) && angular.isFunction(scope.onRingBoxOpen)){
                            scope.onRingBoxOpen();
                        }
                        //console.log("opened from directive");
                    });
                };
                function bindEvent(fn){
                    element.on("click",fn);
                    scope.$on('$destroy',function(){
                        element.off('click', fn);
                    });
                };

                function bindFalsyEvent(e){
                    event.preventDefault();
                    event.stopPropagation();
                    if(angular.isFunction(scope.ringboxFalsyFunc)){
                        scope.ringboxFalsyFunc();
                    }
                }

                if(attr.rgRingbox === "" || attr.rgRingbox === "true" || attr.rgRingbox === true){
                    bindEvent(mainFunction);
                }else{
                    bindEvent(bindFalsyEvent);
                }
            }
        };
    }])
;

(function() {
    'use strict';

    angular
        .module('ringid.syncher',['ringid.common.stacked_map','ringid.utils'])
        .factory('$$rgsyncher',rgSynchar);

        rgSynchar.$inject = ['$$stackedMap','utilsFactory']; // injecting rootscope to digest changes

        function rgSynchar($$stackedMap,utilsFactory){
            /*
            * rgSynchar
            *
            *
            * */

            var syncfns = $$stackedMap.createNew();

            var process = function(){
                var scopeToDigest;
                syncfns.doForAll(function(fn){
                    scopeToDigest = fn.call(null); // fn should return scope to digest if any changes occurs
                    if(!!scopeToDigest && !scopeToDigest.$$phase){
                        scopeToDigest.$digest();//safe digesting the current scope
                    }
                });
            };
            return {
                add : function(fn){
                    var key = utilsFactory.getUniqueID();
                    syncfns.add(key,fn);
                    return key
                },
                remove : function(key){
                    return syncfns.remove(key);
                },
                synch : function(){//to manually fire focus event
                    if(syncfns.length() > 0)
                         process();
                }
            };
        }


})();

(function(DataView,String) {// placing dataview and String globals to locals for better performance
    'use strict';
    angular
        .module('ringid.connector', ['ngWebSocket','ringid.utils','ringid.config','ringid.common.stacked_map','ringid.syncher'])

})(DataView,String);
(function() {// placing dataview and String globals to locals for better performance
    'use strict';
    angular
        .module('ringid.connector')
        .service('RingHttpService',RingHttpService)
    RingHttpService.$inject = ['$rootScope','$http'];
    function RingHttpService($rootScope,$http){
        var fetcher,
            self=this,
            requestConfig1 = {
                transformRequest: function (d) { // sending binary data so forcing angular not to serialize or send as json
                    return d;
                },
                headers: { // see : http://stackoverflow.com/questions/24341290/cors-working-fine-in-jquery-but-not-in-angularjs/30554164
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },// our response type is arraybuffer
                responseType : 'arraybuffer'
            },
            requestConfig2 = {
                transformRequest: function (d) { // sending binary data so forcing angular not to serialize or send as json
                    return d;
                },
                headers: { // see : http://stackoverflow.com/questions/24341290/cors-working-fine-in-jquery-but-not-in-angularjs/30554164
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },// our response type is arraybuffer
                responseType : 'arraybuffer'
            };
        self.UPDATE_URL = 'http://localhost:8080/APIData';
        self.REQUEST_URL = 'http://localhost:8080/APIRequest';
        //self.UPDATE_URL = 'http://192.168.1.101:90/APIData';
        //self.REQUEST_URL = 'http://192.168.1.101:90/APIRequest';
        self.onOpenCallbacks = [];
        self.onMessageCallbacks = [];
        self.onErrorCallbacks = [];
        self.onCloseCallbacks = [];
        self.socket = false;
        self.OPEN = false;
        self.onMessage = function(callback,options){
            if (!angular.isFunction(callback)) {
                throw new Error('Callback must be a function');
            }


            if (options && angular.isDefined(options.filter) && !angular.isString(options.filter) && !(options.filter instanceof RegExp) && !angular.isFunction(options.filter)) {
                throw new Error('Pattern must be a string or regular expression');
            }

            self.onMessageCallbacks.push({
                key : options.key || "" ,
                fn: callback,
                pattern: options ? options.filter : undefined,
                autoApply: options ? options.autoApply : false,
                clearAble : options ? options.clearAble:true,
                dataType : options ? options.dataType:0
            });
            // return this;
        };

        function safeDigest(autoApply) {
            if (autoApply && !$rootScope.$$phase) {
                $rootScope.$apply();
            }
        }

        self._onMessageHandler = function(message){
            var currentCallback,pattern,should_call_with;

            for (var i = 0; i < self.onMessageCallbacks.length; i++) {
                currentCallback = self.onMessageCallbacks[i];
                pattern = currentCallback.pattern;
                if (pattern) {
                    if(angular.isFunction(pattern)){
                        should_call_with = pattern.call(null,message);
                        if(should_call_with !== false){
                            currentCallback.fn.call(self,should_call_with );
                            safeDigest(currentCallback.autoApply);
                        }

                    }
                    else if (angular.isString(pattern) && message.data === pattern) {
                        currentCallback.fn.call(self, message);
                        safeDigest(currentCallback.autoApply);
                    }
                    else if (pattern instanceof RegExp && pattern.exec(message.data)) {
                        currentCallback.fn.call(self, message);
                        safeDigest(currentCallback.autoApply);
                    }

                }
                else {
                    currentCallback.fn.call(self, message);
                    safeDigest(currentCallback.autoApply);
                }
            }
        };
        self._onErrorHandler = function(event){
            for (var i = 0; i < self.onErrorCallbacks.length; i++) {
                self.onErrorCallbacks[i].call(this, event);
            }
        };
        self._onOpenHandler = function () {
            //       this._reconnectAttempts = 0;
            for (var i = 0; i < self.onOpenCallbacks.length; i++) {
                this.onOpenCallbacks[i].call(this);
            }
            //         this.fireQueue();
        };
        self.onOpen = function (cb) {
            this.onOpenCallbacks.push(cb);
            return this;
        };
        var heartBeat = function(ob){
            $http.post(self.UPDATE_URL,ob,requestConfig2).
                success(function(data, status, headers, config) {
                    self._onMessageHandler({data:data,status:status,headers:headers,config:config});
                }).
                error(function(data, status, headers, config) {
                    self._onErrorHandler({data:data,status:status,headers:headers,config:config});
                    throw new Error("error Occured While Pulling");

                });

            //return promise;
        };
        self.fetch = heartBeat;
        self.init = function(ob){ // time in milisecond
            heartBeat(ob);
            self.OPEN = !0;
            self._onOpenHandler();

        };

        self.close  = function(){
            self.OPEN = !1;
        };

        self.send = function(data){
            //if(self.OPEN){
                return $http.post(self.REQUEST_URL,data,requestConfig1);
            //}else{
            //    self.onOpenCallbacks.push(function(){
            //        self.send(data);
            //    });
            //}

        };

        self.reconnect = function(){
            self.close();
            self.init();
        };

        self.isOpen = function(){
            return self.OPEN;
        };
    }
})();

(function(DataView,String) {
    'use strict';
    angular
    .module('ringid.connector')
    .factory('RingParser',RingParser) // header parser
    .service('parserService', parserService);//broken packet parser

    RingParser.$inject = ['ATTRIBUTE_CODES', 'parserService'];
    function RingParser(ATTRIBUTE_CODES, parserService){
        var ReturnObject,packetDataStorage={};// for accessing from self property assigning to be returned object to a variable
        var ByteParsers = {};

        var parseHeader = function(dataViewObject, offset){
            var index,len,attribute,headerObject={},val;//offset = offset || 1;

            for(index=offset;index<dataViewObject.byteLength;){
                attribute = dataViewObject.getUint16(index);// reading int from 2 byte
                index +=2;// so increasing the index to two
                len = dataViewObject.getUint8(index++);// one byte of length
                //val = dataViewObject.getInt16(index);
                val = dataViewObject.getIntByByte(index,len);
                switch(attribute){
                    case ATTRIBUTE_CODES.ACTION:// one byte
                        headerObject.actn = val;
                        break;
                    case ATTRIBUTE_CODES.SERVER_PACKET_ID:
                        headerObject.pckFs = val;
                        break;
                    case ATTRIBUTE_CODES.CLIENT_PACKET_ID:
                        headerObject.pckId = dataViewObject.getString(index,len);
                        break;
                    case ATTRIBUTE_CODES.WEB_UNIQUE_KEY:// TODO : find use
                        break;
                    case ATTRIBUTE_CODES.WEB_TAB_ID:
                        headerObject.tabId = val;
                        break;
                    case ATTRIBUTE_CODES.AUTHIP:
                        headerObject.authServer = dataViewObject.getString(index,len)
                        break;
                    case ATTRIBUTE_CODES.AUTHPORT:
                        headerObject.comPort = val;
                        break;
                    case ATTRIBUTE_CODES.AUTH_E_USERNAME:
                        headerObject.authEUsername = dataViewObject.getString(index,len);
                        break;
                    case ATTRIBUTE_CODES.AUTH_E_PASSWORD:
                        headerObject.authEPassword = dataViewObject.getString(index,len);
                        break;
                    case ATTRIBUTE_CODES.AUTH_E_SALT:
                        headerObject.authESalt = dataViewObject.getString(index,len);
                        break;

                    default:
                        index -=3;// we readed attribute and len for three byte so fallback three bytes because there is no match for header tag
                        headerObject.headerLength = index;// setting header length
                        return headerObject;
                };
                // if not returning from switch case, its means we find a match for header variable so moving index to len byte
                index += len;
            }
            return headerObject;

        };

        var parseBrokenPacketHeader = function(dataViewObject,offset){
            var index,len,attribute,
                headerObject = {//defaults values
                    actn : 0,
                    pckFs : 0,
                    total : 0,
                    current:0,
                    key :0
                },val;offset = offset || 1;

            for(index=offset;index<dataViewObject.byteLength;){
                attribute = dataViewObject.getUint8(index++);// reading int from 1 byte

                len = dataViewObject.getUint8(index++);// one byte of length
                val = dataViewObject.getIntByByte(index,len);
                //val = dataViewObject.getInt32(index);
                switch(attribute){
                    case ATTRIBUTE_CODES.ACTION:// one byte
                        headerObject.actn = val;//int
                        break;

                    case ATTRIBUTE_CODES.SERVER_PACKET_ID:
                        headerObject.pckFs = val;//long
                        break;

                    case ATTRIBUTE_CODES.TOTAL_PACKET:
                        headerObject.total = val;//total number of packet int
                        break;

                    case ATTRIBUTE_CODES.PACKET_NUMBER:
                        headerObject.current = val;//current number of packet int
                        break;

                    case ATTRIBUTE_CODES.UNIQUE_KEY:
                        headerObject.key = val;//packet Identification number long
                        break;

                    case ATTRIBUTE_CODES.DATA:
                        // for data len is in two byte so for returning to previsous byte
                        index--;
                        len = dataViewObject.getUint16(index);//reading int from two byte
                        index +=2;//incresing it by two byte
                        headerObject.data = dataViewObject.copy(index,len);
                        break;

                    case ATTRIBUTE_CODES.WEB_UNIQUE_KEY:// TODO : find use
                        break;
                    case ATTRIBUTE_CODES.WEB_TAB_ID:
                        headerObject.tabId = val;
                        break;

                    default:
                        console.log("Attribute COde Not Found" +attribute);
                        //len = (bytes[index++] & 0xFF);
                        break;


                };
                // if not returning from switch case, its means we find a match for header variable so moving index to len byte
                index += len;


            }
            return headerObject;
        };

        var parse = function(DataViewObject){
            /**
             * Data view object keeps beffer returning from server
             */
            var
                /**
                 * packet_type is the first byte of any packet represents the packet format
                 * 0 : the response contains complete json formatted data
                 * 2 : the response contains complete byte formatted data
                 * 1 : the response contains broken json formatted data needed to merge
                 * 3 : the response contains broken byte formatted data needed to merge
                 * */
                packet_type,
            // to keep header information after parsing
                header,
                bp_header,//broken packet header different from orginal packet header
                return_data,
                full_packet
                ;

            packet_type = DataViewObject.getUint8(0);// first byte represent what type of packet
            //return_data = header;
            switch (packet_type){
                case 0://json complete packet
                case 2://byte complete packet
                    header = parseHeader(DataViewObject,1);
                    if(header.actn === 200) return false;
                    if(packet_type == 0){// json complete packet
                        return_data = DataViewObject.getString(header.headerLength,DataViewObject.byteLength-header.headerLength);
                        try{
                            return_data = angular.fromJson(return_data);
                            return_data = angular.extend({},header,return_data)
                        }
                        catch(e){
                            console.warn(return_data);
                            return_data = false;
                            return false;
                        }
                        return return_data;
                        //return return_data ? angular.extend({},header,angular.fromJson(return_data)):false;
                    }else{// byte complete packet
                        // todo : byte processor
                        return_data = parserService.parseData(DataViewObject, header.headerLength);
                        return return_data ? angular.extend({},header,return_data):false;
                    }

                    break;
                case 1:// json broken data
                case 3://byte broken data
                    bp_header = parseBrokenPacketHeader(DataViewObject,1);//broken packet header
                    //console.dir(bp_header);
                    if(!bp_header.key)return false;//returning if header key not found cause if key is not there then we can't identify broken packet
                    if(!packetDataStorage[bp_header.key]) { // packet with this key not present in the map
                        packetDataStorage[bp_header.key] = [];
                        packetDataStorage[bp_header.key].packetLength = 1;
                    }else{
                        packetDataStorage[bp_header.key].packetLength++;
                    }
                    packetDataStorage[bp_header.key][bp_header.current] = bp_header.data;

                    if(bp_header.total === packetDataStorage[bp_header.key].packetLength){ //all packet has arrived so marge it and parse as normal header
                        full_packet = packetDataStorage[bp_header.key].joinAsDataView();
                        delete packetDataStorage[bp_header.key];
                        header = parseHeader(full_packet,0);
                        if(packet_type == 1){// json broken packet
                            return_data = full_packet.getString(header.headerLength,full_packet.byteLength-header.headerLength);
                            try{
                                return_data = angular.fromJson(return_data);
                                return_data = angular.extend({},header,return_data)
                            }
                            catch(e){
                                console.warn(e);
                                console.warn(return_data);
                                return_data = false;
                                return false;
                            }
                            return return_data;


                            //return angular.extend({},header,angular.fromJson(return_data));
                        }else{// byte broken packet
                            // todo: byte processor
                            //console.log('broken packet');
                            return_data = parserService.parseData(full_packet, header.headerLength);
                            return return_data ? angular.extend({},header,return_data):false;
                        }
                    }
                    return false;
            }

            //if(header.pckFs > 0){
            // TODO check if there needs to sent any confirmation message to the server
            //}
        };
        ReturnObject =  {
            parse : function(viewob){
                //viewob.print_r(true);
                //console.log(viewob.getString(0, viewob.byteLength));
                return parse(viewob);
            },
            addParser : function(action,fn){
                ByteParsers[action] = fn;
            }
        };

        return ReturnObject;

    }


    parserService.$inject = ['OPERATION_TYPES', 'ATTRIBUTE_CODES', '$$stackedMap'];
    function parserService(OPERATION_TYPES, ATCODE, $$stackedMap) {
        var self = this,
            dataView,
            OTYPES = OPERATION_TYPES.SYSTEM,
            attrMap =  [];

            /*
             * ATTRIBUTE CODE 108 missing. got data for actn 23
             */
            attrMap[ATCODE.SUCCESS] =  'sucs';
            attrMap[ATCODE.REASON_CODE] = 'reasonCode';
            attrMap[ATCODE.MESSAGE] = 'message';
            attrMap[ATCODE.TOTAL_PACKET] = 'totalPacket';
            attrMap[ATCODE.PACKET_NUMBER] = 'packetNo';
            attrMap[ATCODE.TOTAL_RECORDS] =  'totalRecord';
            attrMap[ATCODE.USER_TABLE_IDS] = 'utIds';
            attrMap[ATCODE.USER_ID] = 'utId';
            attrMap[ATCODE.USER_IDENTITY] =  'uId';
            attrMap[ATCODE.USER_NAME] = 'fn';
            attrMap[ATCODE.PROFILE_IMAGE] = 'prIm';
            attrMap[ATCODE.PROFILE_IMAGE_ID] = 'prImId';
            attrMap[ATCODE.UPDATE_TIME] = 'ut';
            attrMap[ATCODE.CONTACT_UPDATE_TIME] = 'cut';
            attrMap[ATCODE.CONTACT_TYPE] = 'ct';
            attrMap[ATCODE.NEW_CONTACT_TYPE] = 'nct';
            attrMap[ATCODE.DELETED] = 'deleted';
            attrMap[ATCODE.BLOCK_VALUE] = 'bv';
            attrMap[ATCODE.FRIENDSHIP_STATUS] = 'frnS';
            attrMap[ATCODE.CHANGE_REQUESTER] = 'changeRequester';
            attrMap[ATCODE.CONTACT] = 'contacts';
            attrMap[ATCODE.CALL_ACCESS] = 'cla';
            attrMap[ATCODE.CHAT_ACCESS] = 'chta';
            attrMap[ATCODE.FEED_ACCESS] = 'fda';
            attrMap[ATCODE.ANONYMOUS_CALL] = 'anc';


            attrMap[ATCODE.SESSION_ID] = 'sessionId';
            attrMap[ATCODE.MUTUAL_FRIEND_COUNT] = 'mutualFriends';

        self.parseData = function(dataView, offset) {
            var attribute,
                length,
                Data = {};

            for (var index = offset; index < dataView.byteLength; ) {
                attribute = dataView.getUint16(index);
                index += 2;
                length = 0;

                switch(attribute) {
                    case ATCODE.SUCCESS:
                        length = dataView.getUint8(index++);
                        Data[attrMap[attribute]] = dataView.getBool(index);
                        break;
                    case ATCODE.REASON_CODE://1
                    case ATCODE.TOTAL_PACKET://1
                    case ATCODE.PACKET_NUMBER://1
                    case ATCODE.TOTAL_RECORDS://1
                    case ATCODE.USER_ID://1
                    case ATCODE.PROFILE_IMAGE_ID://1
                    case ATCODE.UPDATE_TIME:
                    case ATCODE.CONTACT_UPDATE_TIME:
                    case ATCODE.CONTACT_TYPE:
                    case ATCODE.NEW_CONTACT_TYPE:
                    case ATCODE.DELETED:
                    case ATCODE.BLOCK_VALUE:
                    case ATCODE.FRIENDSHIP_STATUS:
                    case ATCODE.CHANGE_REQUESTER:
                    case ATCODE.MUTUAL_FRIEND_COUNT:
                    case ATCODE.CALL_ACCESS:
                    case ATCODE.CHAT_ACCESS:
                    case ATCODE.FEED_ACCESS:
                        length = dataView.getUint8(index++);
                        Data[attrMap[attribute]] = dataView.getIntByByte(index, length);
                        break;
                    case ATCODE.MESSAGE:
                    case ATCODE.USER_NAME:
                    case ATCODE.USER_IDENTITY:
                    case ATCODE.PROFILE_IMAGE:
                    case ATCODE.SESSION_ID:
                        length = dataView.getUint8(index++);
                        Data[attrMap[attribute]] = dataView.getString(index, length);
                        break;
                    case ATCODE.USER_TABLE_IDS:
                        length = dataView.getUint16(index);
                        index += 2;
                        Data[attrMap[attribute]] = []; //$$stackedMap.createNew();
                        var utId, contactType, matchBy, frnS;

                        for(var i = index; i < index+length; ) {
                            utId = dataView.getIntByByte(i, 8);
                            i += 8;
                            contactType = dataView.getUint8(i++);
                            matchBy = dataView.getUint8(i++);
                            frnS = dataView.getUint8(i++);
                            Data[attrMap[attribute]].push({
                                    key: utId,
                                    value: {
                                        ct: contactType,
                                        mb: matchBy,
                                        frnS: frnS
                                    }
                                });
                                ////Data[attrMap[attribute]].save(
                                //utId, {
                                    //'ct': contactType,
                                    //'matchBy': matchBy
                                //}
                            //);
                        }
                        break;
                    case ATCODE.CONTACT:
                       // console.info('CONTACT');
                        // LONG PROCESS
                        length = dataView.getUint16(index);
                        index += 2;
                        if (! angular.isArray(Data[attrMap[attribute]])) {
                            Data[attrMap[attribute]] = new Array();
                        }
                        Data[attrMap[attribute]].push( self.parseData(dataView.copy(index, length), 0) );
                        break;
                    default:
                        length = dataView.getUint8(index++);
                        break;
                }
                index += length;
            }

            return Data;
        };



    }


})(DataView,String);

(function(DataView,String) {// placing dataview and String globals to locals for better performance
    'use strict';
    angular
        .module('ringid.connector')
        .factory('$$connector',$$connector);

           $$connector.$inject =
                ['settings', 'RingParser','Storage', '$rootScope','$websocket','$$stackedMap','ATTRIBUTE_CODES',
                    'utilsFactory','$q','OPERATION_TYPES','$interval','CLIENT_DATA_SIZE'];
         function $$connector(settings, RingParser,Storage, $rootScope,$websocket,$$stackedMap,ATTRIBUTE_CODES,utilsFactory,$q,OPERATION_TYPES,$interval,CLIENT_DATA_SIZE){
                var ObjectToBeReturn
                    ,sessionID = Storage.getCookie('sessionID')
                    ,socket
                    ,keepAliveSender
                    ,deferToBeResolved={}
                    ,resolvedPacket={}
                    ,stopSending=!1
                    ,sendQueue = []
                    ,lastSendingTime = new Date().getTime()
                    ,timeoutSetted = false
                    ,keepAlive = false
                    ,subscribers=$$stackedMap.createNew()
                    ,intervalFunctions = $$stackedMap.createNew();

                var getMessageFilterByActionNumber = function(action_number){

                    return function(message){// websocket message event
                        if(!message || !message.actn)return false;
                        if(angular.isArray(action_number)){
                            for(var i=0;i<action_number.length;i++){
                                if(message.actn == action_number[i]){
                                    return true;
                                }
                            }
                        }else{
                            return message.actn == action_number
                        }
                        return false;

                    };
                };
               var parseMessageData = function(DataViewObject){
                    if(!DataViewObject)return {};
                     return RingParser.parse(DataViewObject);
                    //if(angular.isString(message.data)){
                    //    return angular.fromJson(message.data);
                    //}else if(angular.isObject(message.data)){
                    //    return message.data;
                    //}else{
                    //    return message;
                    //}
               };
               var resolvePendingRequest = function(message){
                    if(!!deferToBeResolved[message.pckId]){
                        deferToBeResolved[message.pckId].resolve.call(deferToBeResolved[message.pckId],message);
                        delete deferToBeResolved[message.pckId];//deleting after processing
                        return true;
                    }else{
                        return false;
                    }
               };

               var broadcastUpdates = function(message){
                   if(subscribers.length() > 0){
                        subscribers.doForAll(function(currentCallBackObject){
                           var should_call_with,pattern = currentCallBackObject.filter;
                            if (pattern) {
                                if(angular.isFunction(pattern)){
                                    should_call_with = pattern.call(null,message);
                                    if(should_call_with !== false){
                                        currentCallBackObject.fn.call(currentCallBackObject,message);
                                    }
                                }
                            }else{
                                currentCallBackObject.fn.call(self, message);
                            }
                            if (currentCallBackObject.autoApply && !currentCallBackObject.scope.$$phase) {
                                currentCallBackObject.scope.$digest(); // safe digest
                            }
                        });
                   }

               };

                var processOnMessageListners = function(json){
                    if(!json)return;

                    var MadeRquest;
                    if(json.hasOwnProperty('pckId') && json.actn !== OPERATION_TYPES.SYSTEM.AUTH.TYPE_INVALID_LOGIN_SESSION){ // its a response of a request so process resolve the defer of this packet id
                        MadeRquest = resolvePendingRequest(json);
                    }
                    if(json.hasOwnProperty('pckFs')){ // packet id From Server so its update need to process subscriber
                        var pack = json.pckFs;
                        if(!resolvedPacket[pack]){
                            broadcastUpdates(json);
                            resolvedPacket[pack] = true;
                        }
                    }else if(!MadeRquest){
                        broadcastUpdates(json);
                    }
                };

                var MainOnMessageHandler = function(message,skipFirstTwoByte){ // if message has pckId then its a request response, if message has pckFs its a subscriber
                    var DataViewObject,length,tempDataView;
                    try{
                        //if(window.Blob && ((message.data ||message) instanceof Blob)){
                        //
                        //}
                        DataViewObject = new DataView(message.data || message);
                        if(!DataViewObject.byteLength){
                            throw new Error("Byte Length of Zero");
                        }
                    }catch(e){ // buffer is not a arrayBuffer so throws exception
                        // console.dir(e);
                        console.warn("Invalid Array Buffer to Parse : "+ e.message);
                        return;
                    }
                   // DataViewObject.print_r(); //ajax is banned
                   // if(!socket.socket ){ //data coming via ajax so coming as 2-byte integer padded
                   //     for(var i=0;i<DataViewObject.byteLength;){
                   //          length = DataViewObject.getUint16(i,!0); // length as 2-byte integer
                   //           i+=2;
                   //         if(length > 0){
                   //             try{
                   //                 tempDataView = DataViewObject.copy(i,length);
                   //                 message = parseMessageData(tempDataView);
                   //                // tempDataView.print_r();
                   //                 processOnMessageListners(message);
                   //             }catch(e){
                   //                 console.warn("Invalid Array Buffer to Parse : "+ e.message);
                   //             }finally{
                   //                 i+=length;
                   //             }
                   //         }
                   //     }
                   // }else{ // data coming via socket .. so no need to parse as byte array
                        message = parseMessageData(DataViewObject);
                        processOnMessageListners(message);
                  //  }

                    // for broken packets and falsy data

                };

            function getKeepAlivePacket(){

                var sess = Storage.getCookie('sId') || '',index=2;
                if(!sess.length)return false;
                var dataTosend = new ArrayBuffer(sess.length +2),
                    dataview  = new DataView(dataTosend);

                 dataview.setUint8(0,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.KEEP_ALIVE);
                 dataview.setUint8(1,0);//complete packet
                    angular.forEach(sess.toCharCodeArray(),function(val){
                        dataview.setUint8(index++,val);
                    });
                return dataview;
             }

             var init = function(ob){
                // console.log("socket Init Called");
                    if(angular.isObject(socket)){
                        if(!socket.isOpen()){
                            socket.reconnect();
                        }
                        return; // if socket is already initiated then return
                    }
                   if(utilsFactory.hasSocket()){
                       try{
                           socket = $websocket('ws://'+ settings.siteUrl +'/DataSocket/' + utilsFactory.tabId);
                       }catch(e){
                           console.dir(e);
                       }

                   }else{
                       alert("Your browser seem back dated. To use RingId with greater user experience we advice you to use modern browser. ")
                       return; //ajax is removed
                   }
                   socket.onMessage(MainOnMessageHandler,{});
               };
             var initInterval = function(){
                 keepAliveSender = $interval(function(){
                     processIntervals();
                     var kpPacket = getKeepAlivePacket();
                     if(!kpPacket){
                         stopInterVal();return;//sessionId not found so stopping the interval
                     }
                     //if(!socket.socket){ // ajax stop working
                       //  socket.fetch(getKeepAlivePacket());
                    // }else{ // else socket
                         send(kpPacket);
                    // }
                 },5000);
             };
             function connectionReset(){
                // throw new Error("Socket Reset");
                // socket.socket.binaryType = 'arraybuffer';
                 stopInterVal();
                 socket.close();
                 socket = null;
                 stopSending = true;
                 init();
                 stopSending = false;
                 //socket.socket.binaryType = 'arraybuffer';
                 //if(!socket.socket){
                 //  socket.init(getKeepAlivePacket());
                 //}
                 if(keepAlive)initInterval();
             }
             function closeConnection(){
                // throw new Error("Socket Closed");
                 if(keepAliveSender){
                     $interval.cancel(keepAliveSender);
                 }

                 if(socket.isOpen()){
                     socket.close();
                 }else{
                     socket.onOpen(function(){
                        socket.close();
                     });
                 }

             };
             function stopInterVal(){
                 $interval.cancel(keepAliveSender);
             }

             function sendBrokenPacket(request_type,messageViewArray,data,packetId){ //message expected as string
                 var packets = [],hi, i,headerLength=129,full_packet,packet_start=0,packet_end,// with full packet there are two bytes of request type and packet type sp excluding it
                     len = messageViewArray.byteLength,header,headbuf,last_sent = new Date().getTime(),now;

                 var totalPacket = Math.ceil(len/CLIENT_DATA_SIZE),
                     uniqueKey = utilsFactory.getUniqueID().toString(),
                     glu = totalPacket < 128 ? 1:2;//one byte or two byte
                 for(i=0;i<totalPacket;i++){
                     packet_end = (CLIENT_DATA_SIZE*(i+1))-1;
                     if(packet_end > len){
                         packet_end = len-1;//if its over the data
                     }
                     headbuf = new ArrayBuffer(headerLength+(packet_end-packet_start+1));
                     header = new DataView(headbuf);
                     header.setUint8(0,request_type);//setting request type on first byte
                     header.setUint8(1,1);//setting packet type on second byte
                     hi = 2;
                     if(data.actn){
                         hi = header.addAttributeInt(hi,ATTRIBUTE_CODES.ACTION,2,data.actn);
                     }
                     if(!!packetId){
                         packetId = packetId.toString();
                         hi = header.addAttributeString(hi,ATTRIBUTE_CODES.CLIENT_PACKET_ID,packetId);
                     }
                     hi = header.addAttributeInt(hi,ATTRIBUTE_CODES.TOTAL_PACKET,glu,totalPacket);
                     hi = header.addAttributeInt(hi,ATTRIBUTE_CODES.PACKET_NUMBER,glu,i);//current packet number
                     hi = header.addAttributeString(hi,ATTRIBUTE_CODES.UNIQUE_KEY,uniqueKey);
                     hi = header.addAttributeData(hi,ATTRIBUTE_CODES.DATA,messageViewArray,packet_start,(packet_end-packet_start+1));
                     packet_start = packet_end+1;
                     //full_packet = header.merge(0,hi,messageViewArray,packet_start,packet_end);
                     //data_packet = messageViewArray.copy(packet_start,packet_end+1);
                     //console.info("packet Number" + i);
                      full_packet = header.copy(0,hi);
                      // if(!socket.socket){
                          // packets.push(header.copy(0,hi));
                      // }else{

                     packets.push(full_packet);
                      // }
                   }
                // console.log()
                    var sendPacket = function sendPackInner(){
                        while(packets.length){
                            var pack;
                            now = new Date().getTime();
                            if(now - last_sent >=180){
                                pack = packets.shift();
                                send(pack);
                                last_sent = now;
                            }else{
                                setTimeout(sendPackInner,180);
                                return;
                            }
                        }
                    };
                    sendPacket();
                 return false;
             }

             function changeMessageToByte(message,packetType,request_type){ // message as string/object
                 if(!angular.isString(message))message = angular.toJson(message);
                 var buffer,messageViewArray,index= 0,len = packetType ? message.length : message.length + 2;
                 buffer = new ArrayBuffer(len);
                 messageViewArray = new DataView(buffer);
                 if(!packetType){ // for broken packet 1, else 0 so we have to add two byte if its complete packet
                     messageViewArray.setUint8(index++,request_type);
                     messageViewArray.setUint8(index++,0);
                 }
                 if(message.length){
                     angular.forEach(message.toCharCodeArray(),function(val){
                         messageViewArray.setUint8(index++,val);
                     });
                 }
                 return messageViewArray;
             }

                //init(); //initing the socket
             var buildPacketToSend = function(packetId, data,request_type){//append sessionIdBefore Send
                    var message,messageViewArray,sId = Storage.getCookie('sId');
                    data = data || {};
                    data['pckId'] = packetId;
                    if (!!sId) {
                        data['sId'] = sId;
                    }
                    data['tbid'] = utilsFactory.tabId;
                    data['dvc'] = 5;
                    message = angular.toJson(data);
                    if((message.length + 2 > CLIENT_DATA_SIZE) && data.actn !== 23){ // including request_type and packet_type
                        messageViewArray = changeMessageToByte(message,1,request_type);//broken packet type is 1
                        return sendBrokenPacket(request_type,messageViewArray,data,packetId);
                    }else{
                        return changeMessageToByte(message,0,request_type); // complete packet type is 0
                    }
                };

             var send = function sendD(data,force){
                 if(!!data){
                     sendQueue.push(data);
                 }
                 if(stopSending && !force){
                     return;
                 }
                 if(!socket.isOpen() && socket.readyState !== 0){
                    socket.reconnect();
                 }
                 if(socket.readyState === 0){
                     if(!timeoutSetted){
                         setTimeout(function(){
                             timeoutSetted = false;
                             sendD();
                         },1000);
                         timeoutSetted = true;
                     }
                     return;
                 }
                 while (sendQueue.length) {
                     var now = new Date().getTime(),timediff = now - lastSendingTime; // for testing pupose
                   //  if(timediff > 200){ // Auth Server Drop Out Packets if previous packet receives in 200ms
                         var tempdata = sendQueue.shift();
                         tempdata.print_r();
                         console.info("socket state :" + socket.socket.readyState + " time diff : " + (timediff/1000));
                         socket.send(tempdata);
                     lastSendingTime = now;
                    // }else{
                       // setTimeout(function(){
                          //  send();
                        //},200-timediff);
                   //  }
                 }
             };

                var sendData = function(data,request_type,defer){
                    var message,packetId;
                    packetId = utilsFactory.getUniqueID();
                    message = buildPacketToSend(packetId,data,request_type);
                    if(!!defer) {
                        deferToBeResolved[packetId] = defer;//keeping defer to resolve while data catched with this packet Id
                    }
                    if(message){
                        return send(message,request_type === OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION);
                    }

                       // sending through socket or ajax
                };

                var initDeferRequest = function(data,request_type){
                    var defer = $q.defer(),res;
                    res = sendData(data,request_type,defer);
                    //if(!socket.socket){ // for ajax request
                      //  res.success(function(data,status,headers){
                            //response that coming result on request with ajax for example auth request
                      //      MainOnMessageHandler(data,true);
                      //  });//sending byte view data through socket/ajax
                  //  }else{
                        // note : for websocket it just sent the data and waits for receive
                  //  }
                    //setTimeout(function(){
                    //    defer.notify(CUSTOM_PROMISE.REQUEST_SENT);
                    //},10);
                    return defer.promise;
                };

             var processIntervals = function(){
                    intervalFunctions.doForAll(function(f){
                        f.call(null);
                    });
             };


                ObjectToBeReturn = {
                    init : init,
                    close : closeConnection,
                    send : function(data,request_type){ // do not return any promise
                        sendData(data,request_type);
                    },
                    request : function(data, request_type){//returns a $q promise
                        return initDeferRequest(data, request_type);
                    },
                    subscribe : function(callback,options){

                        options = options || {};
                        options.key = options.key || utilsFactory.getUniqueID();
                        options.scope = options.scope || $rootScope;
                        options.autoApply = false;
                        options.fn = callback || angular.noop;
                        // filter must be a function
                        if(!options.filter && !!options.action){
                            options.filter = getMessageFilterByActionNumber(options.action);
                        }
                        subscribers.add(options.key,options);
                        return options.key;// key returned : useful when need to unsubscribe
                    },
                    unsubscribe : function(key){
                        subscribers.remove(key);
                    },
                    stop :function(){
                        stopSending = true;
                    },
                    resume : function(){
                        stopSending = false;
                        if(!socket.isOpen() && socket.readyState !== 0){
                            socket.reconnect();
                        };
                        send();

                    },
                    reset : function(){
                        connectionReset();
                        send();
                    },
                    addInterval : function(func){
                        var key = utilsFactory.getUniqueID();
                        intervalFunctions.add(key,func);
                    },
                    removeInterval :function(key){
                        intervalFunctions.remove(key);
                    },
                    keepAlive : function(){
                        keepAlive = true;
                        initInterval();
                    }
                };

             //$cookies.act = utilsFactory.tabId;
             //$cookies.tt = ($cookies.tt && ($cookies.tt+1)) || 1;

             //var actChecker = setInterval(function(){
             //       if($cookies.a)
             //},1000);
             // we will keep a single connection if multiple tab is opened
             // so on $rootScope ringactive we should re connect and in ringInactive we should close connection

             $rootScope.$on('ringInactive',function(event){
                // console.log("soccket stat : " + socket.isOpen() +" currentTabId :" + utilsFactory.tabId );
                // closeConnection();
                 //setTimeout(function(){
                 //   if($cookies.act === utilsFactory.tabId){
                 //       if(!socket.isOpen()){
                 //           connectionReset();
                 //       }
                 //   }
                 //},3000);
                 //$rootScope.$on('$destroy',function(){
                 //       console.log("hello");
                 //});
                 //console.info("Window Is Not Active");
                 //if($cookies.sessionID != sessionID) {
                     //sessionID = $cookies.sessionID;
                     //connectionReset();
                 //}
             });

             $rootScope.$on('$locationChangeStart', function( event ) {
                 //var answer = confirm("Are you sure you want to leave this page?")
                 //if (!answer) {
                 //    event.preventDefault();
                 //}
             });

                return ObjectToBeReturn;
            }
})(DataView,String);



/* 
 * © Ipvision 
 */

(function() {
	'use strict';

	angular
		.module('ringid.common.services', [
			'ringid.config',
			'ngWebSocket',
			'ngCookies'
			])
		.factory('countryListService', countryListService)
		.config(['$httpProvider', function($httpProvider) {
			//$httpProvider.defaults.headers.post['Content-Type'] =  "application/x-www-form-urlencoded; charset=UTF-8";
			//$httpProvider.defaults.headers.post['X-Requested-With'] =  "XMLHttpRequest";

			//$httpProvider.defaults.transformRequest = function(data){
			//	var str = [];
			//	if (data === undefined) {
			//		return data;
			//	}
			//	for(var p in data)
			//		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
			//	return str.join("&");
			//};
		}]);

        // get list of countries with code from a json file
		countryListService.$inject = ['$http', 'settings'];
		function countryListService($http, settings) {
			return { 
					getList: function() {
						return $http.get( settings.baseUrl + '/resources/countries.json');
					}
			};
		}
})();
/*
 * � Ipvision
 */


(function(){
    'use strict';

    angular
        .module('ringid.common.services')
        .factory('$ringhttp', ringhttp);


    ringhttp.$inject = ['$q'];
    function ringhttp($q) {
        var xhr

        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            // ie6
            try {
                return new ActiveXObject('MSXML2.XMLHTTP.6.0');
            } catch (e) {
                try {
                    xhr = new ActiveXObject('MSXML2.XMLHTTP.3.0');
                } catch (e) {
                    // ajax not supported
                    xhr =null;
                }
            }
        }




        var service = {
            send: function(url, callback) {

                if (xhr) {
                    var defer = $q.defer();
                    // proceed with request
                    //xhr.withCredentials = true;
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            console.log(xhr);
                            defer.resolve(xhr.response);
                        }
                    };

                    xhr.open('GET', url, true);
                    xhr.responseType = 'arraybuffer';
                    xhr.send('');
                }else{
                    console.warn('XHR NOT SUPPORTED!')
                }
                return defer.promise;
            }
        };

        return service;

    }


})();
/*
 * © Ipvision
 */

(function() {
	'use strict';

	angular
		.module('ringid.auth', [
			'ngStorage',
			'ngWebSocket',
			'ringid.config',
			'ringid.connector',
            'ringid.common.services'
		]);
})();


/*
 * © Ipvision
 */

(function() {
	'use strict';

	angular
		.module('ringid.auth')
		.service('authHttpService', authHttpService)
		.factory('userLoginFactory', userLoginFactory)
		.factory('userSignupFactory', userSignupFactory);

	authHttpService.$inject = ['$$connector', '$ringhttp', 'settings', 'utilsFactory', '$http', 'OPERATION_TYPES'];
	function authHttpService ($$connector, $ringhttp,  settings, utilsFactory, $http, OPERATION_TYPES) {
		/*jshint validthis: true */
		var self = this,
            REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE,
            OTYPES = OPERATION_TYPES.SYSTEM,
			OTYPES_AUTH = OPERATION_TYPES.SYSTEM.AUTH;

		self.go = function (data,request_type,headers) {
			//return $http[method](settings.baseUrl + 'APILogin', data);
			return $$connector.request(data,request_type,headers);
		};

            /**
            * @api {request} /APIREQUEST/20 Login
            * @apiVersion 0.1.0
            * @apiDescription Login User
            * @apiName Login
            * @apiGroup Auth
            *
            *
            * @apiParam {Number=20} actn AUTH.TYPE_SIGN_IN
            * @apiParam {Number} [dvc=5] Login Device. for Web it's 5
            * @apiParam {Number=1,2} lt Login Type i.e. 1 is Ringid and 2 is Country Code
            * @apiParam {Number} ringID Ring Id
            * @apiParam {Number} ringId Ring Id
            * @apiParam {Number} tbid Browser Tab Id
            * @apiParam {Number} uId Ring Id
            * @apiParam {Number=1015} vsn Version
            * @apiParam {Number} wk Undefined
            *
            * @apiParamExample {json} Request-Example:
            *   {
            *       actn: 20
            *       dvc: 5
            *       lt: 1
            *       ringID: "2110010091"
            *       ringId: "2110010091"
            *       tbid: 1
            *       uId: "2110010091"
            *       usrPw: "aaaaaa"
            *       vsn: 1015
            *       wk: "1177453575210"
            *   }
            *
            *
            * @apiSuccess {Number=20} actn AUTH.TYPE_SIGN_IN
            * @apiSuccess {String} authServer Auth Server Ip Address
            * @apiSuccess {Number} comPort Auth Server Port Number
            * @apiSuccess {String} el User Email Address
            * @apiSuccess {Number} emVsn Undefined
            * @apiSuccess {String} fn First Name
            * @apiSuccess {Number} iev Undefined
            * @apiSuccess {Number} lsts Undefined
            * @apiSuccess {String} mbl Mobile No
            * @apiSuccess {String} mblDc Country code
            * @apiSuccess {Number} mood Mood of User
            * @apiSuccess {String} oIP Undefined
            * @apiSuccess {Number} oPrt Undefined
            * @apiSuccess {String} prIm Profile Image Url
            * @apiSuccess {Number} prImId Profile Image Id
            * @apiSuccess {Boolean} pstd Undefined
            * @apiSuccess {String} sid Auth Session Id
            * @apiSuccess {Boolean} sucs Success or Failure
            * @apiSuccess {Number} uId User Id/ Ring Id
            * @apiSuccess {Number} utId  User Table Id
            *
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 20
            *       authServer: "38.127.68.50"
            *       comPort: 30091
            *       el: ""
            *       emVsn: 1
            *       fn: "showone"
            *       headerLength: 62
            *       iev: 0
            *       imnv: 0
            *       lsts: 2
            *       mbl: ""
            *       mblDc: ""
            *       mood: 1
            *       oIP: "38.127.68.55"
            *       oPrt: 0
            *       pckId: "1036450626207"
            *       prIm: ""
            *       prImId: 0
            *       pstd: true
            *       sId: "10438420939453842110010091"
            *       sucs: true
            *       uId: "2110010091"
            *       utId: 75
            *     }
            *
            * @apiError Album has no Image
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 200 Not Found
            *     {
            *       "sucs": false
            *     }
            */

		self.login = function(obj) {

            var lt = (obj.login_type === '+878') ? 1 : 2,
                wk = utilsFactory.getUniqueID(),
            payload = {
                usrPw: obj.password,
                actn: OTYPES.AUTH.TYPE_SIGN_IN,
                lt: lt,
                vsn: OTYPES.VERSION, // auth server version
                wk: wk,
                dvc: 5,
                tbid: utilsFactory.tabId
            };

            if (lt ===1) {
                payload.uId = obj.username;
            } else {
                payload.mbl = obj.username;
                payload.mblDc = obj.login_type;
                //payload.ringId = obj.username;
                //payload.ringID = obj.username;
            }

			/* Remember Me Salt and Previous sID */
			if( !!obj.salt && !!obj.sId ){
				payload['salt'] = obj.salt;
				payload['sId'] = obj.sId;
			}

			console.log(payload);

            return self.go(payload, REQTYPE.AUTHENTICATION,{
                lt : lt,
                uId : obj.username,
                wk : wk,
                tbid : utilsFactory.tabId
            });

		};

		self.codeEmail = function(obj){
			var wk = utilsFactory.getUniqueID();
			var payload = {
				actn: 217,
				rb: obj.rb,
				el:obj.rb,
				wk:wk,
				lt:obj.lt

				//request_type: REQTYPE.AUTHENTICATION
			};
			console.log(payload);
			console.log(REQTYPE.AUTHENTICATION);
			return $$connector.request(payload,3);
		};

		self.codePhone = function(obj) {
			var wk = utilsFactory.getUniqueID();
			var payload = {
				actn: 217,
				rb: obj.rb,
				mbl:obj.mbl,
				mblDc:obj.mblDc,
				wk:wk,
				lt:obj.lt

				//request_type: REQTYPE.AUTHENTICATION
			};
			console.log(payload);
			console.log(REQTYPE.AUTHENTICATION);
			return $$connector.request(payload,REQTYPE.AUTHENTICATION);
		};

		self.submitCode = function(obj){
			var payload = {
				actn : 218,
				uId : obj.userId,
				vc : obj.code,
				wk : utilsFactory.getUniqueID(),
				lt : 1

				//request_type: REQTYPE.AUTHENTICATION
			};
			console.log(payload);
			console.log(REQTYPE.AUTHENTICATION);
			return $$connector.request(payload,REQTYPE.AUTHENTICATION);
		};

		self.resetPassword = function(obj){
			var payload = {
				actn : 219,
				nPw : obj.newpass,
				uId : obj.userId,
				wk : utilsFactory.getUniqueID(),
				lt : 1

				//request_type: REQTYPE.AUTHENTICATION
			};
			console.log(payload);
			return $$connector.request(payload,REQTYPE.AUTHENTICATION);
		};


            /**
            * @api {request} /APIREQUEST/21 Logout
            * @apiVersion 0.1.0
            * @apiDescription Logout User
            * @apiName Logout
            * @apiGroup Auth
            *
            *
            * @apiParam {Number=21} actn TYPE_SIGN_OUT
            *
            * @apiParamExample {json} Request-Example:
            *   {
            *       actn: 21
            *   }
            *
            *
            * @apiSuccess {Number=21} actn TYPE_SIGN_OUT
            * @apiSuccess {Number} id Undefined
            * @apiSuccess {Number} rc Undefined
            * @apiSuccess {Boolean} sucs Success or Failure
            * @apiSuccess {Number} uId User Id/ Ring Id
            *
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 22
            *       headerLength: 55
            *       id: 75
            *       pckId: "1409303629847"
            *       rc: 0
            *       sucs: true
            *       uId: "2110010091"
            *     }
            *
            * @apiError Album has no Image
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 200 Not Found
            *     {
            *       "sucs": false
            *     }
            */


		self.logout = function() {
			var payload = {
				actn: OTYPES_AUTH.TYPE_SIGN_OUT
				//request_type: REQTYPE.AUTHENTICATION
			};
			console.log(payload);
			return $$connector.request(payload,REQTYPE.AUTHENTICATION);
			//return self.go(payload);
		};

		self.isValidSession = function(utId){
			return $$connector.request({
				actn : OTYPES_AUTH.TYPE_SESSION_VALIDATION,
				utId : utId
			}, REQTYPE.AUTHENTICATION);
		};

		self.signupInit = function() {
			var defaults = {
				operation: OTYPES.SIGNUP_INIT
			};
			return self.go(defaults);
		};

		self.signupSendEmail = function(obj) {
			var defaults = {
				operation: OTYPES.SIGNUP_SEND_EMAIL,
				user_email: obj.email
			};
			obj = angular.extend({}, defaults, obj || {});
			return self.go(obj);
		};

		self.signupVerifyEmail = function(obj) {
			var defaults = {
				operation: OTYPES.SIGNUP_VERIFY_EMAIL,
				code: obj.code
			};
			obj = angular.extend({}, defaults, obj || {});
			return self.go(obj);
		};

		self.signup = function(obj) {
			var defaults = {
				operation: OTYPES.SIGNUP,
				user_full_name: obj.name,
				user_password: obj.password
			};
			obj = angular.extend({}, defaults, obj || {});
			return self.go(obj);
		};

	}


	userLoginFactory.$inject = ['authHttpService'];
	function userLoginFactory(authHttpService) {
		return {
			login: function(credentials) {
                return authHttpService.login(credentials);
			},
			logout: function() {
                return authHttpService.logout();
			},
			isValidSession : function(utId){
				return authHttpService.isValidSession(utId);
			}
		};
	}

	userSignupFactory.$inject = ['authHttpService'];
	function userSignupFactory(authHttpService) {
		return {
			initiateSignup: function() {
				return authHttpService.signupInit();
			},
			sendEmail: function(email) {
				return authHttpService.signupSendEmail({user_email: email});
			},
			verifyEmail: function(code) {
				return authHttpService.signupVerifyEmail({code: code});
			},
			signUp: function(credentials) {
				return authHttpService.signup(credentials);
			}
		};
	}

})();

/*
 actn: 20
 bDay: "1989-09-06"
 blc: 60000
 cIm: "2000001794/1429235666781.jpg"
 cImId: 10851
 cfs: 0
 cimX: 0
 cimY: 12
 cls: 0
 cnty: "ringID"
 del: 0
 el: "sadekul@ipvision.inc"
 emVsn: 1
 fn: "Spirit Walker"
 gr: "Male"
 iev: 0
 imapPrt: 0
 imgIP: "0.0.0.0"
 imnv: 0
 ln: ""
 lsts: 2
 mDay: 0
 mailIP: "0.0.0.0"
 mbl: ""
 mblDc: ""
 mrktIP: "0.0.0.0"
 nvldt: 7
 oIP: "38.127.68.55"
 oPrt: 1200
 pckId: "81310488261"
 ple: 0
 pns: 0
 prIm: "2000001794/1428886675955.jpg"
 prImId: 10852
 pstd: true
 pvc: Array[5]
 re: "2000001794@ringid.com"
 sId: "241435900923962642000001794"
 smtpPrt: 0
 sucs: true
 tf: 58
 uId: "2000001794"
 uIdChng: false
 utId: 2157
 wim: ""
 wle: 1
 */

/*
 * © Ipvision
 */

(function () {
	'use strict';

	angular
		.module('ringid.auth')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$boxInstance', 'Storage', 'Auth', '$location', '$cookies', '$localStorage', 'settings', 'userLoginFactory', 'userSignupFactory', 'countryListService', '$scope', '$timeout', '$window','$$connector','authHttpService'];

	function LoginController($boxInstance, Storage, Auth, $location, $cookies, $localStorage, settings, userLoginFactory, userSignupFactory, countryListService, $scope, $timeout, $window,$$connector,authHttpService) {
            $$connector.init();
            $$connector.resume();
            var vm = $scope,
                country = Storage.getData('country');
			vm.signIn = true;
			vm.signUp = false;
            vm.forgotPassForm = false;
            vm.forgotPhnForm = false;
            vm.submitCodeForm = false;
            vm.resetPassForm = false;
			vm.credentials = {
				username       : '',
				password       : '',
                remember       : false,
				login_type     : country ? country.login_type : '+878'
			};
			vm.countryFlag   = country ? country.countryFlag : 'r878';
			vm.loginError    = false;
			vm.loginErrorMsg = '';
			vm.disableForm   = false;
			vm.loginProgress = false;
			// user login
			vm.login = loginUser;
            vm.showSignup = initSignup;
			vm.setPrefix = setPrefix;
            vm.checkWhichForm = false;


			// dropdown data
			vm.ddHtml = 'pages/dropdowns/country-list-dropdown.html';
			vm.ddControl = {
				listData: []
			};

            vm.openForgotForm = function() {
              vm.forgotPassForm = true;
                vm.checkWhichForm = true;
                vm.forgotPhnForm = true;
                vm.signIn = false;
            };

            vm.cancelForgot = function(){
                vm.forgotPassForm = false;
                vm.checkWhichForm = false;
                vm.forgotPhnForm = false;
                vm.submitCodeForm = false;
                vm.resetPassForm = false;
                vm.signIn = true;

            };

            vm.codeEmail = function(obj){
                obj.lt = 3;
                authHttpService.codeEmail(obj).then(function(data){
                    console.log(data);
                    if(data.sucs===true){
                        vm.submitCodeForm = true;
                        vm.forgotPassForm = false;
                        vm.forgotPhnForm = false;
                        vm.checkWhichForm = false;
                    }else{
                        vm.submitCodeForm = false;
                        vm.forgotPassForm = true;
                    }
                },function(error){
                    console.log(error);
                });


            };

            vm.submitCode = function(obj){
                $$connector.reset();
                console.log(obj);
                vm.submitCodeForm = false;
                vm.resetPassForm = true;
                authHttpService.submitCode(obj).then(function(data){
                    console.log(data);
                    if(data.sucs === true){
                        vm.submitCodeForm = false;
                        vm.resetPassForm = true;
                    }else{
                        //vm.submitCodeForm = false;
                        //vm.resetPassForm = true;
                    }
                });
            };


            vm.submitNumber = function(obj){
                $$connector.reset();
                var creds = {

                    rb :obj.login_type+'-'+obj.number,
                    mbl:obj.number,
                    mblDc:obj.login_type,
                    lt:2

                };
                console.log(creds);
                authHttpService.codePhone(creds).then(function(data){
                    console.log(data);
                    if(data.sucs===true){
                        vm.submitCodeForm = true;
                        vm.forgotPassForm = false;
                        vm.forgotPhnForm = false;
                        vm.checkWhichForm = false;
                    }else{
                        vm.submitCodeForm = false;
                        vm.forgotPhnForm = true;
                    }

                },function(error){
                    console.log(error);
                });
            };

            vm.resetPassword = function(obj){
                $$connector.reset();
                console.log(obj);
                authHttpService.resetPassword(obj).then(function(data){
                    console.log(data);
                    if( data.sucs === true ){
                        vm.forgotPassForm = false;
                        vm.checkWhichForm = false;
                        vm.forgotPhnForm = false;
                        vm.submitCodeForm = false;
                        vm.resetPassForm = false;
                        vm.signIn = true;
                    }else{

                    }
                });
            };

			countryListService.getList().success( function(data) {
				vm.ddControl.countryList = data;
			});

            function setPrefix(actionObj) {
                console.log(actionObj);
                vm.credentials.login_type = actionObj.code;
                vm.countryFlag = actionObj.flagcode;
            }


            function loginFail(loginData) {
                vm.loginError = true;
                vm.disableForm = false;
                vm.loginProgress = false;
                if (loginData.msg) {
                    vm.loginErrorMsg = loginData.msg;
                } else {
                    vm.loginErrorMsg = "Incorrect Phone Number Or Password";
                }
            };

			function loginUser(formValid, event) {
                // save country for user

                /* best to save country info inside loginInfo  */
                Storage.setData('country', {
                    login_type: vm.credentials.login_type,
                    countryFlag: vm.countryFlag},
                    true);

				event.preventDefault();
				if (formValid) {
					vm.loginError = false;
					vm.disableForm = true;
					vm.loginProgress = true;

                    if(!vm.credentials.remember){
                        Storage.deleteData('remInfo');
                    }

                    Auth.login(vm.credentials).then(function(loginData) {
                        if (loginData.sucs === false){
                            loginFail(loginData);
                        } else {
                            $boxInstance.close();
                        }
                    }, function(errData) {
                        loginFail(errData);
                    });
				}

			}

            function initSignup() {
                // initiate signup
                userSignupFactory.initiateSignup().success( function(data) {
                    var response = angular.fromJson(data);
                    if ( response.sucs === true)
                    {
                        vm.signIn = false;
                        vm.signUp = true;
                        //manually remove diplay:none style from signup form
                        //angular.element(document.querySelector('#signupform')).css('display','block');
                    }
                }).error(function(errData) {
                    console.log(errData);
                });
            }


	}

})();

/*
 * © Ipvision
 */

(function() {
    'use strict';


    angular.module('ringid.auth')
        .controller('RegisterController', RegisterController);

        RegisterController.$inject = ['$scope', 'userSignupFactory', '$log'];

        function RegisterController($scope, userSignupFactory, $log) {
            var vm = this;
            vm.email = '';
            vm.verificationCode = '';
            vm.repassword = '';
            vm.credentials = {
                name: '',
                password: ''
            };
            vm.newUid = '';
            //signup steps
            vm.signupStep1 = true;
            vm.signupStep2 = false;
            vm.signupStep3 = false;

            vm.reset = function(event) {
                event.preventDefault();
                vm.credentials.name = '';
                vm.credentials.password = '';
                vm.repassword = '';
            };

            // send email
            vm.sendEmail = function (event) {
                event.preventDefault();
                if (vm.email && vm.email.length > 1) {
                    userSignupFactory.sendEmail(vm.email).success( function(data) {
                        var response = angular.fromJson(data);
                        $log.log(data);
                        if (response.sucs === true) {
                            vm.signupStep1 = false;
                            vm.signupStep2 = true;
                        }
                    }).error(function(data) {
                        $log.error(angular.fromJson(data));
                    });
                }
            };

            // verify email by code
            vm.verifyEmail = function (event) {
                event.preventDefault();
                if (vm.verificationCode.length > 1) {
                    userSignupFactory.verifyEmail(vm.verificationCode).success( function(data) {
                        var response = angular.fromJson(data);
                        if (response.sucs === true) {
                            vm.newUid = response.uId;
                            vm.signupStep2 = false;
                            vm.signupStep3 = true;
                        }
                    }).error(function(data) {
                        $log.error(angular.fromJson(data));
                    });
                }
            };

            // final signup form submit
            vm.signUpUser = function (event) {
                event.preventDefault();
                if (validSignup()) {
                    userSignupFactory.signUp(vm.credentials).success( function(data) {
                        var response = angular.fromJson(data);
                        if (response.sucs  === true) { // success hide signup and show login
                            $scope.login.signIn = true;
                            $scope.login.signUp = false;
                        }
                    }).error(function(data) {
                        $log.error(angular.fromJson(data));
                    });
                }
            };

            function validSignup() {
                if (vm.credentials.name.length > 1 && vm.credentials.password.length > 1 && vm.credentials.password === vm.repassword) {
                    return true;
                } else {
                    return false;
                }
            }
        }


})();

/*
 * © Ipvision
 */
//window.WebSocket = null;
(function() {
    'use strict';
    angular
        .module('ringid', [
            'ngWebSocket',
            'ngStorage',
            'ngCookies',
            'ngAnimate',
            'ngRoute',
            'ringid.config',
            'ringid.auth',
            'ringid.sticker',
            'ringid.common.rgslider_directive',
            'ringid.common.rgscrollbar_directive',
            'ringid.common.rgdropdown_directive',
            //'ringid.common.rgaccordion_directive',
            //'ringid.common.rgscrolltotop_directive',
            'ringid.common.rgclick_directive',
            'ringid.connector',
            'ringid.ringbox'
        ])
        .controller('ApplicationController', ApplicationController)
        //.controller('MediaAcceptController', MediaAcceptController)
        //.controller('ImageController', ImageController)
        //.directive('scrollPosition', scrollPosition)
        .run(['$$connector', function($$connector) {
            $$connector.init({fetch:false});
        }])
        //.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            //$routeProvider.
                //[>when('/mediakit', {
                 //templateUrl: 'pages/mediakit/mediakit-home.html'
                 //}). */
                //when('/features', {
                    //templateUrl: 'pages/welcome/features.html'
                //});
            ////$locationProvider.html5Mode(true);

        //}]);


    ApplicationController.$inject = ['$scope','$cookies'];
    function ApplicationController($scope, $cookies) {

        $scope.accept = false;

        if($cookies['accept'] === "1") {
            $scope.accept = false;
        } else {
            $scope.accept = true;
        }

        $scope.callAccept = function() {
            $cookies['accept'] = 1;
            $scope.accept = false;
        };

        $scope.signIn = true;
        $scope.signUp = false;

        $scope.reloadHome = function() {
            location.href = '/';
        };

        $scope.scroll = 0;
        $scope.ringlogocircle = "images/slider/ring_logo_circle.png";
        $scope.ringlogoleft = "images/slider/ring_logo_left.png";

    }
    // var androidImage = angular.module('androidImage', []);

    //MediaAcceptController.$inject = ['$scope', '$cookies','$boxInstance'];
    //function MediaAcceptController($scope, $cookies,$boxInstance){

        ////$boxInstance.opened.then(function(){
        ////    $boxInstance.resize(700,1000);
        ////});
        ////
        ////$scope.accept = function(event) {
        ////    event.preventDefault();
        ////    $cookies['accept'] = 1;
        ////    location.href = '/mediakit.xhtml';
        ////};
    //}

    //ImageController.$inject = ['$scope', '$http'];

    //function ImageController($scope,$http){
        //$scope.images = [];
        //$scope.loadData = function(url){
            //$http.get(url).success(function(json){
                //$scope.images = json;
                //$scope.selectedImage = $scope.images[0];
            //});
        //};



        //$scope.selected = 0;
        //$scope.selectImage = function(i){
            //$scope.selected = i;
            ////console.log('index: '+i);
            ////console.log('selected: '+$scope.selected);

            //$scope.selectedImage = $scope.images[i];
        //};
    //}

    //scrollPosition.$inject = ['$window'];
    //function scrollPosition($window) {
        //return {
            //scope: {
                //scroll: '=scrollPosition'
            //},
            //link: function(scope, element, attrs) {

                //var windowEl = angular.element($window);
                //function getScrollTop(){
                    //if(typeof pageYOffset!= 'undefined'){
                        //return pageYOffset;
                    //}
                    //else{
                        //var B= document.body; //IE 'quirks'
                        //var D= document.documentElement; //IE with doctype
                        //D= (D.clientHeight)? D: B;
                        //return D.scrollTop;
                    //}
                //}
                //var handler = function() {
                    ////scope.scroll = windowEl.scrollTop;
                    //scope.scroll = getScrollTop();//document.body.scrollTop;
                    ////console.log(scope.scroll);
                //};
                ////console.log('loaded');
                //windowEl.on('scroll', scope.$apply.bind(scope, handler));
                //handler();
            //}
        //};
    //}


})();



/*
 * © Ipvision
 */

(function() {
    'use strict';
      angular.module('ringid.common.rgslider_directive', [] )

       .directive('rgSlider', function () {

    return {

        link: function (scope, element, atrr) {

            var nextSlide = 0,
                autoSlide = true,
                sliderTimer = null,
                navs = [],
                i;


            var slider_dom = element[0];

            var nav_selector = atrr.navClass || '';
            var slide_selector = atrr.slideClass || '';
            var desc_selector = atrr.descClass || '';
            var delay = parseInt(atrr.delay) * 1000 || 3000;

            var slides = angular.element(slider_dom.querySelectorAll('.' + slide_selector));
            var desc = angular.element(slider_dom.querySelectorAll('.' + desc_selector));
            var nav_dom = slider_dom.querySelectorAll('.' + nav_selector) || {};

            /* vars for carousel*/
            var crsl_distance = 120;
            var crsl_distance_multiplier = 0.6;
            var crsl_size_multiplier = 0.6;
            var crsl_opacity_multiplier = 0.8;

            var crsl = slider_dom.querySelector('.nav-carousel');
            var crsl_items = crsl.querySelectorAll('img');
            crsl_items = Array.prototype.slice.call(crsl_items);
            var crsl_data = [];
            var crls_width = crsl.clientWidth;
            var crls_height = crsl.clientHeight;
            var center = Math.floor(crsl_items.length/2);
            /* end of carousel*/

            setupEvent();
            playSlide();

            function playSlide() {

                slides.removeClass('active');
                slides.eq(nextSlide).addClass('active');

                desc.removeClass('active');
                desc.eq(nextSlide).addClass('active');

                for (i = 0; i < navs.length; i++) {
                    navs[i].find('li').removeClass('active');
                    navs[i].find('li').eq(nextSlide).addClass('active');
                }

                /* Move carousel*/
                if(crsl_data[0]) {
                    playCarousel(findMappedItem(nextSlide));
                }


                if (autoSlide) {
                    nextSlide = (nextSlide + 1 == slides.length) ? 0 : nextSlide + 1;
                    setTimer();
                }

            }

            function setTimer() {

                sliderTimer = setTimeout(function () {
                    playSlide();
                }, delay);
            }

            function clearTimer() {
                clearTimeout(sliderTimer);
            }

            function index(node) {

                var children = node.parentNode.childNodes;
                var num = 0;
                for (var i = 0; i < children.length; i++) {

                    if (children[i] == node) return num;
                    if (children[i].nodeType == 1) num++;

                }
                return -1;
            }

            function setupEvent() {
                var nav;
                for (i = 0; i < nav_dom.length; i++) {

                    nav = angular.element(nav_dom[i]);
                    navs.push(nav);
                    nav.find('li').on('click', function (e) {
                        nextSlide = index(this);
                        clearTimer();
                        playSlide();
                    });
                }

                slides.on('mouseenter', function (e) {
                    e.stopPropagation();
                    autoSlide = false;
                    clearTimer();
                });

                slides.on('mouseleave', function (e) {
                    e.stopPropagation();
                    autoSlide = true;
                    setTimer();
                });

                desc.on('mouseenter', function (e) {
                    e.stopPropagation();
                    autoSlide = false;
                    clearTimer();
                });

                desc.on('mouseleave', function (e) {
                    e.stopPropagation();
                    autoSlide = true;
                    setTimer();
                });

            }

             /*function for carousel*/
            function initCarousel() {

                var item_w, item_h, item_opacity, item_left, item_top, depth, separation;

            	/*for centered item*/
            	item_w= crsl_items[0].clientWidth;
            	item_h= crsl_items[0].clientHeight;
            	item_opacity= 1;
            	item_left = Math.round(crls_width/2)-Math.round(item_w/2);
            	item_top = Math.round(crls_height/2)-Math.round(item_h/2);
            	crsl_data[center]={
                 	'w':item_w,
                 	'h':item_h,
                 	'o':item_opacity,
                 	'l':item_left,
                 	't':item_top,
                 	'z':center,
                 	'i':0
                 };

                /* calculate position for right items*/
            	separation = crsl_distance;
            	depth = center;
            	for(i=center+1;i<crsl_items.length;i++) {

               		separation = separation*crsl_distance_multiplier;
              		item_w =	crsl_size_multiplier * crsl_data[i-1].w;
               		item_h =	crsl_size_multiplier * crsl_data[i-1].h;
               		item_opacity = crsl_opacity_multiplier * crsl_data[i-1].o;
               		item_left = crsl_data[i-1].l+crsl_data[i-1].w+separation-item_w;
                	--depth;
                	item_top = Math.round(crls_height/2)-Math.round(item_h/2);

                	crsl_data[i]={
                 		'w':item_w,
                 		'h':item_h,
                 		'o':item_opacity,
                 		'l':item_left,
                 		't':item_top,
                 		'z':depth,
                 		'i':i
                 	};
                }

              /* calculate position for left items*/
               separation = crsl_distance;
               depth = center;
               for(i=center-1;i>=0;i--) {

               		separation = separation*crsl_distance_multiplier;
               		item_w =	crsl_size_multiplier * crsl_data[i+1].w;
               		item_h =	crsl_size_multiplier * crsl_data[i+1].h;
               		item_opacity = crsl_opacity_multiplier * crsl_data[i+1].o;
               		item_left = crsl_data[i+1].l-separation;
                	--depth;
                	item_top = Math.round(crls_height/2)-Math.round(item_h/2);

                	crsl_data[i]={
                 		'w':item_w,
                 		'h':item_h,
                 		'o':item_opacity,
                 		'l':item_left,
                 		't':item_top,
                 		'z':depth,
                 		'i':i
                 	};
               }


             /* set initial position and enable event*/
              for(i=0;i<crsl_items.length;i++) {

                  crsl_items[i].orgPos = i;
                  crsl_items[i].crslPos = i;
                  crsl_items[i].addEventListener('click', function (e) {
                     if (this.crslPos==center) return ;

                     nextSlide = this.orgPos;
                     clearTimer();
                     playSlide();
                     playCarousel(this);


                  });
               }

           }

           function playCarousel(item) {
             moveItem(item);
             setItemPosition();
           }

           function moveItem (item) {

                   var temp, direction = item.crslPos < center ? 'forward' : 'backward';

                   while (item.crslPos != center) {
                        if( direction == 'forward') {
                        	temp = crsl_items.pop();
                        	crsl_items.unshift(temp);
                        } else {
                            temp = crsl_items.shift();
                            crsl_items.push(temp);
                        }

                        //update position
                        for(i=0;i<crsl_items.length;i++) {
                            crsl_items[i].crslPos = i;
                            crsl_items[i].className = '';
                        }
                   }
                 item.className= 'active';
           }


         function setItemPosition() {

             	for(i=0;i<crsl_items.length;i++) {
                	crsl_items[i].style.width =  crsl_data[i].w+'px';
                	crsl_items[i].style.height =  crsl_data[i].h+'px';
                	crsl_items[i].style.opacity =  crsl_data[i].o;
                	crsl_items[i].style.left =  crsl_data[i].l+'px';
                	crsl_items[i].style.top =  crsl_data[i].t+'px';
                	crsl_items[i].style.zIndex =  crsl_data[i].z;
                	crsl_data[i].i = i;
               }

               //console.log(crsl_items);
          }

         function findMappedItem(position) {

            for(i=0;i<crsl_items.length;i++) {
               if(position ==crsl_items[i].orgPos ) {
                  return crsl_items[i];
               }
            }
         }
        
         crsl_items[0].src = crsl_items[0].src; // loading cache issue 
         crsl_items[0].addEventListener('load', function() {
            initCarousel();
            playCarousel(crsl_items[0]);
            
            setTimeout(function(){
               crsl.style.visibility =  'visible'; 
              }, 800);
         });

         /* End of carousel*/

        }
    }
});
})();

/*
 * © Ipvision
 */
(function() {
    'use strict';

angular
    .module('ringid.common.rgscrolltotop_directive', [])
    .directive('scrollTop', scrollTop);

    function scrollTop () {
        
        function getElementYPos(elmId) {
            
            var elm = document.getElementById(elmId);
            var y = elm.offsetTop;
            var node = elm;
            
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } 
            
            return y;
         }
         
        
        function link (scope, element, attrs) {
           
            
            window.onscroll = function () {
    		   if (pageYOffset >= 500) {
        			document.getElementById('back-top').style.opacity = 1;
   				} else {
 				    document.getElementById('back-top').style.opacity = 0;
               }
            }
           
            element.bind('click', function(event) { 
            	
            	event.preventDefault();
            	event.stopPropagation();
            	
            	var offset = attrs.offset || 0;
            	var startY =  self.pageYOffset || document.body.scrollTop ||  document.documentElement.scrollTop || 0;
           		var stopY = getElementYPos(attrs.scrollTop)-parseInt(offset);
            
            	var distance = stopY > startY ? stopY - startY : startY - stopY;
            
        		if (distance < 100) {
            		scrollTo(0, stopY); 
            		return;
        		}
        	
        		var speed = Math.round(distance / 100);
        		if (speed >= 20) speed = 20;
        
        		var step = Math.round(distance / 25);
        		var leapY = stopY > startY ? startY + step : startY - step;
       			var timer = 0;
        
            	if (stopY > startY) {
                
                	for ( var i=startY; i<stopY; i+=step ) {
                		setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                		leapY += step; 
                		if (leapY > stopY) leapY = stopY; 
                    	timer++;		  
            		}
            	 
             	   return;
             
           		}
           
           		for ( var i=startY; i>stopY; i-=step ) {
              
              		setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
              		leapY -= step; 
              		if (leapY < stopY)  leapY = stopY; 
              		timer++;
              
           		}
           }); 
        }
        
        return {
          restrict: 'A',
          link: link
        }
    }

})();