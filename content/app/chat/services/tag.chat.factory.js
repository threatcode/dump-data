
	angular
        .module('ringid.chat')
		.factory('tagChatFactory', tagChatFactory);

		tagChatFactory.$inject = [
			'$$stackedMap', '$$connector',
			'userFactory', 'friendsFactory',
			'Auth', 'Utils',
			'tagChatModels'

		];

		function tagChatFactory(
			$$stackedMap, $$connector,
			userFactory, friendsFactory,
			Auth, Utils,
			tagChatModels
		) {

			var Constants               = CHAT_APP.Constants;
            var SharedHelpers           = CHAT_APP.SharedHelpers;

			var GENERAL_CONSTANTS       = Constants.GENERAL_CONSTANTS;
			var PACKET_CONSTANTS       = Constants.PACKET_CONSTANTS;

			var CHAT_GLOBAL_VALUES      = Constants.CHAT_GLOBAL_VALUES;
			var AUTH_SERVER_ACTIONS     = Constants.AUTH_SERVER_ACTIONS;

			var TAG_CHAT_PACKET_TYPE    = Constants.TAG_CHAT_PACKET_TYPE;
			var FRIEND_CHAT_PACKET_TYPE = Constants.FRIEND_CHAT_PACKET_TYPE;
			var CONFIRMATION_MAP        = Constants.CONFIRMATION_MAP;
            var CHAT_APP_UTILS          = CHAT_APP.UTILS;

			var registeredTags          = {};
			var tagInitiator            = {};
			var tagChatRequestCache     = {};
			var tagChatResponseCache    = {};
			var tagIdleIntervals        = {};

			var tagChatTags             = $$stackedMap.createNew(true);
			var _startProcessRequest    = true;

			return {
				createNewTag: _createNewTag,
				createNewTagMember : _createNewTagMember,
				createNewTagMessage : _createNewTagMessage,
				createTagStatusMessage : _createTagStatusMessage,

				addTagObject : _addTagObject,
				removeTagObject : _removeTagObject,

				getTags : _getTags,
				getTag : _getTag,
				generateNewTagId : getTagId,

				getOrCreateTag : _getOrCreateTag,
				getOrCreateMessage : _getOrCreateMessage,

				updateTag : _updateTag,

				getTagLastMessageObject : _getTagLastMessageObject,

            	setTagChatInitiator : _setTagChatInitiator,
				resetTagChatInitiator : _resetTagChatInitiator,
				isTagChatInitiator : _isTagChatInitiator,

				shouldProcessRequest : _shouldProcessRequest,
				startProcessingRequest : _startProcessRequest
				/*** Temp Usages For Testing ***/

			};

			///////////////////////////  ///////////////////////////

			function getTagId(){

				var userId = Auth.currentUser().getKey().toString();

				var currentTime = new Date().getTime().toString();

				var tagId = currentTime.substr(0, PACKET_CONSTANTS.TAG_ID_NO_OF_TIME_DIGIT );

				tagId += userId.substr(userId.length - PACKET_CONSTANTS.TAG_ID_NO_OF_USER_ID_DIGIT );

				return tagId;
			}

			function _getTags(){
				return tagChatTags;
			}

			function _getTag(key){
				return tagChatTags.get(key);
			}

			function _removeTagObject(key){
				return tagChatTags.remove(key);
			}

			function _createNewTag(object, tagObject){

				if( !tagObject){
					tagObject = new tagChatModels.TagObject();
				}

				if( !object.tagId ){
					tagObject.setTagId( getTagId() );
				}else{
					tagObject.setTagId( object.tagId );
				}

				if(!!object.packetId){
					tagObject.setPacketId( object.packetId );
				}

				if(!!object.userId){
				 tagObject.setUserId( object.userId );
				}

				if(!!object.tagName){
					tagObject.setTagName( object.tagName );
				}

				if(!!object.tagPictureUrl){
					tagObject.setPictureUrl( object.tagPictureUrl );
				}


				if(!!object.serverDate){
					tagObject.setServerDate(object.serverDate);
				}

				if(!!object.tagMembersCount){
					tagObject.setMembersCount(object.tagMembersCount);
				}

				return tagObject;
			}

			function _createNewTagMember(tagId, object, userObjectInit){
                    var tagMemberObject = new tagChatModels.TagMember();

                    if( !!tagId){
                        tagMemberObject.setTagId( tagId );
                    }

                    if(!!object){

                        if(!!object.userId){
                            tagMemberObject.setId( object.userId );
                        }

                        if(!!object.fullName){
                            tagMemberObject.setFullName( object.fullName );
                        }

                        if(!!object.addedBy){
                            tagMemberObject.setAddedBy( object.addedBy );
                        }

                        if(!!object.status){
                            tagMemberObject.setStatus( object.status );
                        }else{
                            tagMemberObject.setStatus( GENERAL_CONSTANTS.MEMBER_STATUS.MEMBER );
                        }

                        // if(!!userObjectInit){
                        //    tagMemberObject.initUserObjects();
                        // }
                    }

                    return tagMemberObject;

            }

			function _createNewTagMessage(tagId, object, userObjectInit){

				var tagMessageObject = new tagChatModels.TagMessage();

                if( !!tagId){
				    tagMessageObject.setTagId( tagId );
                }

                if(!!object){

                    if(!!object.userId){
                        tagMessageObject.setUserId( object.userId );
                    }

					if(!!object.user){
						tagMessageObject.setUserId( object.user );
					}

					if(!!object.fullName){
						tagMessageObject.setFullName( object.fullName );
					}

                    if(!!object.message){
                        tagMessageObject.setMessageText( object.message );
                    }

                    if(!!object.hrtime){
                        tagMessageObject.setHumanReadableTime( object.hrtime );
                    }

					if(!!object.messageDate){
                        tagMessageObject.setMessageDate( object.messageDate );
                    }

					if(!!object.isDeleted){
                        tagMessageObject.markAsDeleted( object.isDeleted );
                    }

					if(!!object.messageDateString){
                        tagMessageObject.setMessageDateString( object.messageDateString );
                    }

					if(!!object.timeout){
                        tagMessageObject.setTimeout( object.timeout );
                    }

					if(!!object.messageType){
                        tagMessageObject.setMessageType( object.messageType );
                    }

                    if(!!object.status){
                        tagMessageObject.setStatus( object.status );
                    }

					if(!!object.packetId){
						tagMessageObject.setPacketId( object.packetId );
					}

					if(!!object.usersToChange){
						tagMessageObject.setUsersToChange( object.usersToChange );
					}

					if(!!object.usersToChangeName){
						tagMessageObject.setUsersToChangeName( object.usersToChangeName );
					}

					if(!!object.statusType){
						tagMessageObject.setStatusType( object.statusType );
					}

					if(!!object.tagName){
						tagMessageObject.setTagName( object.tagName );
					}


					/**** ****/

                    // if(!!userObjectInit){
                    //    tagMessageObject.initUserObjects();
                    // }
                }

				return tagMessageObject;

			}

			function _createTagStatusMessage(packetId, tagId, userId, messageType, usersToChangeArray, restInfo){

				var statusMessageObject = {};

				var tagObject = _getTag(tagId);

				if(!!tagObject){
					var messageDate;
					if( !restInfo.messageDate ){

						messageDate = SharedHelpers.getChatServerCurrentTime();
					}else{
						messageDate = restInfo.messageDate;
					}

					var userObject = userFactory.getUser(userId);
                    //userObject.requestUserDetails();

                    var name = "";
                    if( !!userObject && userObject.getName() != ""){
                    	name = userObject.getName();
                    }

					statusMessageObject = {
						message: '',
						fullName : name,
						status: 'status_update',
						statusType : messageType,
						tagName : !!restInfo ? restInfo.tagName : '',
						messageDate: messageDate,
						messageType : 2,
						tag_chat: true,
						userId : userId,
						user : userId,
						packetId : packetId

					};

					statusMessageObject.usersToChange = {};

					if( usersToChangeArray.length > 0) {

						for (var index = 0; index < usersToChangeArray.length; index++) {

							var changedUserObject = usersToChangeArray[index];
							// var tagMemberObject = _createNewTagMember(tagObject.getTagId(), changedUserObject, true);
							statusMessageObject.usersToChange[changedUserObject.userId] = true;

						}
					}

					var tagMessage = _createNewTagMessage(tagId, statusMessageObject);

					return tagMessage;

				}

				return false;

			}

			function _getTagLastMessageObject(messageObject){

				var tagLastMessageObject = {
					key : messageObject.key,
					text : messageObject.text,
					messageType : messageObject.messageType,
					messageDate : messageObject.messageDate

				};

				return tagLastMessageObject;

			}

			function _addTagObject(aNewTagObject){

				if( !(aNewTagObject instanceof tagChatModels.TagObject ) ){
					console.error('Please provide tagChatModels.TagObject() Instance');
					return false;
				}

                var aFactoryTagObj = tagChatTags.get(aNewTagObject.getTagId());
                if( !!aFactoryTagObj ){

                    aFactoryTagObj.update( aNewTagObject );

                }else{
    				tagChatTags.add(aNewTagObject.getTagId(), aNewTagObject);
                }

				return true;

			}

			function _getOrCreateTag(tagId, newTagInfo ){

				if(!newTagInfo){
					newTagInfo = {tagId : tagId};
				}

				var tagObj = _getTag( tagId );
				if( !tagObj ){
					tagObj = _createNewTag(newTagInfo);
				}else{
					tagObj = _createNewTag(newTagInfo, tagObj);
				}

				tagChatTags.save(tagId, tagObj);
				return tagObj;
			}

			function _updateTag(tagId, newTagInfo, oldTagObj ){

				if(!oldTagObj){
					oldTagObj = _getTag( tagId );
				}

				oldTagObj = _createNewTag(newTagInfo, oldTagObj);
				tagChatTags.save(tagId, oldTagObj);

				return oldTagObj;
			}

			function _getOrCreateMessage(tagId, newTagMessageInfo ){

				var newTagInfo = {tagId : tagId};

				if(!newTagMessageInfo){
					newTagMessageInfo = {tagId : tagId};
				}

				var tagObj = _getTag( tagId );

				if( !tagObj ){
					tagObj = _createNewTag(newTagInfo);
					tagChatTags.save(tagId, tagObj);
				}

				var newTagMessageObj = _createNewTagMessage(tagId, newTagMessageInfo, true);

				var oldTagMessageObj = tagObj.getMessage(newTagMessageInfo.packetId);

				if( !oldTagMessageObj){
					oldTagMessageObj = newTagMessageObj;

					tagObj.addMessage(oldTagMessageObj);

				}else{
					oldTagMessageObj.update(newTagMessageObj);
				}

				return oldTagMessageObj;
				//
				//var event = document.createEvent('Event');
				//event.initEvent('tagmessageupdated', true, true);
				//document.dispatchEvent(event);
                //
				//return tagObj;
			}

  		    function _setTagChatInitiator(tagId){
				tagInitiator[tagId] = true;

				// todo need to check race condition
				setTimeout(function(){
					//console.log();

					tagInitiator[tagId] = false;
				}, GENERAL_CONSTANTS.API_FETCH_RETRY_DELAY);
			}

			function _resetTagChatInitiator(tagId){
				tagInitiator[tagId] = false;
			}

			function _isTagChatInitiator(tagId){
				return !!tagInitiator[tagId];
			}


			/****************************** TagChat Should Process Request *******************************/

			function _shouldProcessRequest(request){

				if(!request.actn){
					//Chat Request

				}else{
					//Auth Request
					var tagId = request.tid || request.tagId;

					var isInRequestCache = _isInRequestCacheForAuth(tagId, request.actn);

					return !isInRequestCache;

				}

			}

			function _getRingPacketId(){
				return Utils.getUniqueID('tagc');
			}


        }
