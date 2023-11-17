

    angular.module('ringid.chat').factory('ChatAuthResponses', ChatAuthResponses);

    ChatAuthResponses.$inject = ['$rootScope', 'tagChatFactory', 'ChatFactory',
     'ChatPacketSenderService', 'userFactory', 'friendsFactory', 'chatRequestProcessor',
     'chatHistoryFactory', 'ChatWorkerCommands', 'Auth', 'ChatConnector'];

    function ChatAuthResponses($rootScope, tagChatFactory, ChatFactory,
    	ChatPacketSenderService, userFactory, friendsFactory, chatRequestProcessor,
    	chatHistoryFactory, ChatWorkerCommands, Auth, ChatConnector) {

		var Constants 		      = CHAT_APP.Constants;
		var SESSION_TYPES 	      = Constants.GENERAL_CONSTANTS.SESSION_TYPES;
		var RESPONSE_REASON_CODES = Constants.RESPONSE_REASON_CODES;
		var AUTH_SERVER_ACTIONS   = CHAT_APP.Constants.AUTH_SERVER_ACTIONS;
		var USER_PRESENCE         = Constants.GENERAL_CONSTANTS.USER_PRESENCE;

		var ChatRequests 		  = CHAT_APP.ChatRequests;

    	var _getBox = function(friendId){
            var box = ChatFactory.getBoxByUId(friendId);

            if(!box){
                box = ChatFactory.creatNonDomBox(friendId, false);
                box.loadHistoryMessages();
            }

            return box;
        };

        var responseMethodMap = {};

	    function getPacketProcessorInfo(packetType){
	        return responseMethodMap[packetType];
	    }


		function processUpdates(responseObject) {

			if( responseObject.rc == 1111 ){
                
            }

		    var actionId = responseObject.actn;

		    var packetProcessorInfo = getPacketProcessorInfo(actionId);

		    if( !packetProcessorInfo ){
		        
		        return false;
		    }

		    try{
		       packetProcessorInfo.processor.call(this, responseObject);
		    }catch(e){
		       
		    }

		    return true;

		}


		//PACKET TYPE(334) : RECEIVED_TAG_CHAT
		function onReceivedTagChat(responseObject){
			 /* method body */
			

			var boxId = responseObject.tid;

			var tagObject = tagChatFactory.getTag(boxId);

            if( !tagObject ){

				var openedBox = ChatFactory.getBoxByUId(boxId);
				if( !openedBox){
					openedBox = ChatFactory.creatNonDomBox(boxId, true);
				}

				var requestObject = ChatRequests.getOfflineGetTagInformationWithMembersObject( boxId );
				ChatConnector.request(requestObject).then(function(response){
					if( response.sucs ){
						var tagObject = tagChatFactory.getTag(boxId);
                        if( !!tagObject){
                    	    ChatWorkerCommands.startChatSession(boxId, SESSION_TYPES.TAG, tagObject.getMemberUserIds())
                        }
					}
				});

			}else{

				tagObject = tagChatFactory.getOrCreateTag(boxId);
				//ChatWorkerCommands.startChatSession(boxId, SESSION_TYPES.TAG)
			}



		}

		//PACKET TYPE(335) : TAG_CHAT_UPDATE_ADD_MEMBER
		function onReceivedTagMemeberAdd(responseObject){
			 /* method body */
			

			var tagId = responseObject.tid;
			var boxId = tagId;

			var tagObject = tagChatFactory.getTag(tagId);

			if( !tagObject ){

				var openedBox = ChatFactory.getBoxByUId(tagId);
				if( !openedBox){
					openedBox = ChatFactory.creatNonDomBox(tagId, true);
				}

				var requestObject = ChatRequests.getOfflineGetTagInformationWithMembersObject( tagId );
				ChatConnector.request(requestObject, 10).then(function(response){
					if( response.sucs ){
						var tagObject = tagChatFactory.getTag(tagId);
                    	//ChatWorkerCommands.startChatSession(boxId, SESSION_TYPES.TAG, tagObject.getMemberUserIds())
					}
				});

			}else{

				tagObject = tagChatFactory.getOrCreateTag(tagId);
				ChatWorkerCommands.startChatSession(tagId, SESSION_TYPES.TAG)

				if( !!responseObject.uIds ){
					angular.forEach(responseObject.uIds, function(aMessageUId){

						tagObject.addMember(tagChatFactory.createNewTagMember(tagObject.getTagId(),
							{ userId : aMessageUId }, true
						));
					});

				}else{
					
				}
			}

		}

		//PACKET TYPE(375) : RECEIVED_F2F_CHAT
		function onReceivedF2FChat(responseObject){
			 /* method body */
			

            var friendId 	= responseObject.fndId;
            var boxId = friendId;

            if( boxId == Auth.currentUser().getKey() ){
            	return;
            }

            var box 		= _getBox(boxId);
            box.platform 	= responseObject.dvc;

            var friendObject = userFactory.create({
                uId  : responseObject.fndId,
                utId : responseObject.utId,
                fn   : responseObject.nm
            });

            friendsFactory.getContactDetailsByUtIds([responseObject.utId]);// this is for getting the userobject with detail info and push it in contactlist

            var friendPreviousOnlineStatus = friendObject.getOnlineStatus();

            friendObject.setOnlineStatus(responseObject.psnc);

            if(!!responseObject.mood){
                friendObject.setUserMood(responseObject.mood);
            }
            if(!!responseObject.dt ){
                friendObject.setDeviceToken(responseObject.dt);
            }
            if(!!responseObject.apt){
                friendObject.setAppType(responseObject.apt);
            }
            if(!!responseObject.dvc){
                friendObject.setPlatform(responseObject.dvc);
            }


            if( friendPreviousOnlineStatus != friendObject.getOnlineStatus() ){
                chatRequestProcessor.sendFriendInformation(friendObject);
            }

            if(responseObject.sucs === true && responseObject.psnc == USER_PRESENCE.ONLINE){ // if this sucs is false then user is not logged in with whom user is trying to chat
                box.offlineStatus = false;
            }
            else{ // when responseObject.sucs !== true

                // if the user isn't logged in with whom user is trying to chat
                if(responseObject.rc == RESPONSE_REASON_CODES.PERMISSION_DENIED){
                    // this is the case where user is blocked(either by him or by friend), permission is denied
                    box.blocked = true;
                }else{
                    box.offlineStatus = true;
                }
            }

            chatHistoryFactory.updateBox(box);

		}

		//PACKET TYPE(175) : START_F2F_CHAT
		function onReceivedStartF2FChat(responseObject){
			/* method body */
			onReceivedF2FChat( responseObject );
		}

		function onReceivedStartTagChat(responseObject){

		}

		//PACKET TYPE(199) : GET_USER_MOOD_PRESENCE
		function onReceivedFriendMoodPresence(responseObject){

			

			if( responseObject.fndId ){
				var friendObject = userFactory.getUser(responseObject.fndId);

				if( !!friendObject ){

					if( !!responseObject.psnc ){
						friendObject.setOnlineStatus(responseObject.psnc);
					}

		            if(!!responseObject.mood){
		                friendObject.setUserMood(responseObject.mood);
		            }

		            if(!!responseObject.dvc){
		                friendObject.setPlatform(responseObject.dvc);
		            }
				}

			}else{
				
			}


		}


		//PACKET TYPE(175) : START_F2F_CHAT
		responseMethodMap[AUTH_SERVER_ACTIONS.START_F2F_CHAT] = {
		    processor : onReceivedStartF2FChat
		};


		//PACKET TYPE(199) : GET_USER_MOOD_PRESENCE
		responseMethodMap[AUTH_SERVER_ACTIONS.GET_USER_MOOD_PRESENCE] = {
		    processor : onReceivedFriendMoodPresence
		};


		//PACKET TYPE(134) : START_TAG_CHAT
		responseMethodMap[AUTH_SERVER_ACTIONS.START_TAG_CHAT] = {
		    processor : onReceivedStartTagChat
		};


		//PACKET TYPE(334) : RECEIVED_TAG_CHAT
		responseMethodMap[AUTH_SERVER_ACTIONS.RECEIVED_TAG_CHAT] = {
		    processor : onReceivedTagChat
		};

		//PACKET TYPE(335) : ADD_TAG_CHAT_MEMBERS
		responseMethodMap[AUTH_SERVER_ACTIONS.ADD_TAG_CHAT_MEMBERS] = {
		    processor : onReceivedTagMemeberAdd
		};

		//PACKET TYPE(375) : RECEIVED_F2F_CHAT
		responseMethodMap[AUTH_SERVER_ACTIONS.RECEIVED_F2F_CHAT] = {
		    processor : onReceivedF2FChat
		};



		return {
			processUpdates : processUpdates
		}
	}

