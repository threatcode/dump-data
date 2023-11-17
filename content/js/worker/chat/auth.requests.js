(function(global){
	'use strict';
	//For Main App global == window
    //For Worker global == self

    //Dependencies 
    //- app/chat/shared/chat.constans.js

    var CHAT_APP = global.CHAT_APP;
    var AUTH_REQUEST_TYPE = CHAT_APP.AUTH_REQUEST_TYPE;
	var getCurrentUserId = CHAT_APP.getCurrentUserId;

    function AuthRequests(){


    	var REQUEST_TYPE = CHAT_APP.Constants.AUTH_REQUEST_TYPE;
    	var AUTH_SERVER_ACTIONS = CHAT_APP.Constants.AUTH_SERVER_ACTIONS;

        //ACTION ID(83) : GET_OFFLINE_IP_PORT
		this.getOfflineIpPort = function( packetId ){
 
			

            var requestObject = {
                actn: AUTH_SERVER_ACTIONS.GET_OFFLINE_IP_PORT,
                rid : getCurrentUserId()
            };

            if( !!packetId ){
				requestObject['pckId'] = packetId;
			}


            return requestObject;

		};

		//ACTION ID(134) : START_TAG_CHAT
		this.getTagChatRegisterIpPort = function( tagId, uIds, packetId ){
 
            var requestObject = {
                actn  : AUTH_SERVER_ACTIONS.START_TAG_CHAT,
                tid   : tagId,
                uIds  : uIds                
            };

            if( !!packetId ){
				requestObject['pckId'] = packetId;
			}

            return requestObject;

		};

		//ACTION ID(175) : START_F2F_CHAT
		this.getFriendChatRegisterIpPort = function( friendId, packetId ){			

            var requestObject = {
                actn            : AUTH_SERVER_ACTIONS.START_F2F_CHAT,
                fndId           : friendId,
                uId             : getCurrentUserId()
            };

            if( !!packetId ){
				requestObject['pckId'] = packetId;
			}

            return requestObject;

		};


		//ACTION ID(135) : ADD_TAG_CHAT_MEMBERS
		this.notifyTagChatMembersAdd = function(tagId, uIds, registerIp, registerPort, repacketId){
 
			var requestObject = {

			    actn : AUTH_SERVER_ACTIONS.ADD_TAG_CHAT_MEMBERS,
			    tid  : tagId,			    
			    uIds : uIds,
			    chRp : registerIp,
			    chIp : registerPort,
			};

			if( !!packetId ){
				requestObject['pckId'] = packetId;
			}

			return requestObject;

		};

		//ACTION ID(83) : GET_OFFLINE_IP_PORT
		this.getOfflineIpPort = function(){
			var requestObject = {
                actn        : AUTH_SERVER_ACTIONS.GET_OFFLINE_IP_PORT,
                rid         : getCurrentUserId(),
                requestType : AUTH_REQUEST_TYPE.REQUEST
            };

            return requestObject;
		}


		//ACTION ID(83) : GET_FRIEND_PRESENCE
		this.getFriendPresenceObject = function(friendId){
			var requestObject = {
                actn        : AUTH_SERVER_ACTIONS.GET_USER_MOOD_PRESENCE,
                fndId       :friendId
            };

            return requestObject;
		}

    }
    
    global.CHAT_APP['AuthRequests'] = new AuthRequests();

})(window);
