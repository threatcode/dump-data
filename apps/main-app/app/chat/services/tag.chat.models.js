/*
 * © Ipvision
 */


	var tagChatApp = angular.module('ringid.chat');

	tagChatApp.factory('tagChatModels', tagChatModels);


	tagChatModels.$inject = ['$$stackedMap',
         'userFactory', 'userService', 'Utils', 'Auth',
		'settings', 'SystemEvents'];


	function tagChatModels($$stackedMap,
                            userFactory, userService, Utils, Auth,
							settings, SystemEvents){

		var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;


		var LOCAL_CHAT = GENERAL_CONSTANTS.LOCAL_CHAT;
		var API_VERSION_PORT_OFFSET = GENERAL_CONSTANTS.API_VERSION_PORT_OFFSET;

		function TagObject(){

            var self = this;

			var tag = {
				id : 0,
				name : 'Group',
				pictureUrl : '',
				userId : 0,
				packetId : 0,
				memberCount : 0, /*** Received From Server With Tag Object **/
                serverDate : 0,
				serverDateDiff : 0,

                /** Members means admin, member, owner **/
				members : $$stackedMap.createNew(),
				messages : $$stackedMap.createNew(),


                /*** our property ***/
                objectLock : false,
				ownerUserId : 0,

				creationTime : 0

			};



			this.getTagId = function(){
				return tag.id;
			};

			this.setTagId = function(tagId){
				tag.id = tagId;
				tag.creationTime = tagId.toString().substr(0, GENERAL_CONSTANTS.TAG_ID_NO_OF_TIME_DIGIT);
			};

			this.getTagCreationTime = function(){
				return tag.creationTime;
			};

			this.getUserId = function(){
				return tag.userId;
			};

			this.setUserId = function(userId){
				tag.userId = userId;
			};

			this.getPacketId = function(){
				return tag.packetId;
			};

			this.setPacketId = function(packetId){
				tag.packetId = packetId;
			};

            this.renewPacketId = function(){
                self.setPacketId(Utils.getUniqueID('tgrc'));
            };

			this.getTagName = function(){
				return tag.name;
			};

			this.setTagName = function(tagName){
				tag.name = tagName;
			};

			this.setPictureUrl = function(pictureUrl){
				//Storing Picture File Name
				tag.pictureUrl = pictureUrl;
			};

			this.getPictureUrl = function(){
				//Returns Picture File Name
				return tag.pictureUrl.trim();
			};

			this.getPictureFullUrl = function(){
				if( this.getPictureUrl() != ""){
					return settings.imBase + this.getPictureUrl();
				}else{
					return "images/prof.png";
				}

			};

            this.setServerDate = function (serverDate) {
                tag.serverDate = serverDate;
				self.setServerDateDiff(serverDate - parseInt(new Date().getTime()));
            };

            this.getServerDate = function(){
                return tag.serverDate;
            };

			this.setServerDateDiff = function (serverDateDiff) {
				tag.serverDateDiff = serverDateDiff;
			};

			this.getServerDateDiff = function(){
				return tag.serverDateDiff;
			};


			this.getMembersCount = function(){
				return tag.memberCount;
			};


			this.setMembersCount = function(memberCount){
				tag.memberCount = memberCount;
			};

			this.isTagSafeToShow = function(){
				return tag.memberCount > 0;
			};





			/***************** Members **************/

			this.initMembers = function(){
				tag.members = $$stackedMap.createNew();
			};

			this.addMember = function(memberObj){
				if( !tag.members){
					tag.members = self.initMembers();
				}

				if(memberObj.isOwner()){
					tag.ownerUserId = memberObj.getId();
				}

				tag.members.save( memberObj.getId(), memberObj);
			};

			this.updateMember = function(updatedMemberObj){
				this.addMember( updatedMemberObj );
			};

			this.removeMember = function(memberObjOrId){
                if( memberObjOrId instanceof TagMember){
    				tag.members.remove(memberObjOrId.getId());
                }else{
                    tag.members.remove(memberObjOrId);
                }
			};

			this.membersLength = function(){
                if( !!tag.members ){
    				return tag.members.length();
                }
                return 0;
			};

			this.getMember = function(memberUserId){
				return tag.members.get(memberUserId);
			};

			this.getMemberObjects = function(){
				return tag.members.values();
			};

            this.getMemberUserIds = function(){
                return tag.members.keys();
            };

            this.getMembersObjectMap = function(){
                return tag.members;
            };

            this.setMembersObjectMap = function(memberObj){
                tag.members = memberObj;
            };

			this.initMemberObjects = function(){
				var tagMembers = tag.members.all();
				for(var index = 0; index < tag.members.length(); index++ ){
					var aTagMember = tagMembers[index].value;
					aTagMember.initUserObjects();
				}
			};

			this.unregisterMemberObjectsListener = function(){
				var tagMembers = tag.members.all();
				for(var index = 0; index < tag.members.length(); index++ ){
					var aTagMember = tagMembers[index].value;
					aTagMember.unregisterUserObjectsListener();
				}
			}

			this.getSerializedMembers = function(){
				var allTagMembers = tag.members.all();
				var serializedObjectArray = [];

				for(var tagMembersIndex = 0; tagMembersIndex < allTagMembers.length; tagMembersIndex++ ){
					var aTagMember = allTagMembers[ tagMembersIndex].value;

					serializedObjectArray.push(aTagMember.serialize());
				}

				return serializedObjectArray;
			};

			this.isUserMember = function(userId){
				/*** Returns if userId contains in members list, not actual member status ***/
				if(!tag.members){
					return false;
				}else{
					return !!tag.members.get(userId);
				}
			};

			this.isCurrentUserStatusAdmin = function(userId){
				var userObj = !!tag.members && tag.members.get(userId);
				if(!!userObj){
					return userObj.isAdmin();
				}
				return false;
			};

			this.isCurrentUserStatusMember = function(userId){
				var userObj = !!tag.members && tag.members.get(userId);
				if(!!userObj){
					return userObj.isMember();
				}
				return false;
			};

            this.setObjectLock = function(){
                tag.objectLock = true;
            };

            this.removeObjectLock = function(){
                tag.objectLock = false;
            };

            this.hasObjectLock = function(){
                return tag.objectLock;
            };

			this.setOwnerUserId = function(ownerUserId){
				tag.ownerUserId = ownerUserId;
			};

			this.getOwnerUserId = function(){
				return tag.ownerUserId;
			};

			/*********** *************/

			this.initMessages = function(){
				tag.messages = $$stackedMap.createNew();
			};

			this.addMessage = function(messageObj){
				if( !tag.messages){
					tag.messages = self.initMessages();
				}
				tag.messages.save( messageObj.getPacketId(), messageObj);
			};

			this.removeMessage = function(messageObjOrId){
                if( messageObjOrId instanceof TagMessage){
    				tag.messages.remove(messageObjOrId.getId());
                }else{
                    tag.messages.remove(messageObjOrId);
                }
			};

			this.messagesLength = function(){
                if( !!tag.messages ){
    				return tag.messages.length();
                }
                return 0;
			};

			this.getMessage = function(messagePacketId){
				return tag.messages.get(messagePacketId);
			};

			this.getMessageObjects = function(){
				return tag.messages.values();
			};

            this.getMessageUserIds = function(){
                return tag.messages.keys();
            };

            this.getMessagesObjectMap = function(){
                return tag.messages;
            };

            this.setMessagesObjectMap = function(messageObj){
                tag.messages = messageObj;
            };

			this.debug = function(){
				return tag;
			};


			/**********  *************/

		}

        TagObject.prototype.copy = function(){

              var newTag = new TagObject();
              newTag.setTagId( this.getTagId() );
              newTag.setTagName( this.getTagName() );
              newTag.setPictureUrl( this.getPictureUrl() );
              newTag.setUserId( this.getUserId() );
              newTag.setPacketId( this.getPacketId() );
              newTag.setChatBindingPort( this.getChatBindingPort() );
              newTag.setChatIp( this.getChatIp() );
              newTag.setChatRegisterPort( this.getChatRegisterPort() );
              newTag.setServerDate( this.getServerDate() );

              newTag.setMembersObjectMap( this.getMembersObjectMap().copy() );

              return newTag;

        };

		TagObject.prototype.update = function(newTagObj){

			if( !!newTagObj.getTagName() ){
			  this.setTagName( newTagObj.getTagName() );
			}

			if( !!newTagObj.getPictureUrl() ){
				this.setPictureUrl( newTagObj.getPictureUrl() );
			}

			if( !!newTagObj.getUserId() ){
				this.setUserId( newTagObj.getUserId() );
			}

			if( !!newTagObj.getPacketId() ){
				this.setPacketId(  newTagObj.getPacketId() );
			}

			if( !!newTagObj.getServerDate() ){
				this.setServerDate( newTagObj.getServerDate() );
			}

		};

		TagObject.prototype.sortBy = function(){
			return this.getTagCreationTime();
		};

		function TagMember(){

			var self = this;

			var tagMember = {
				tagId : 0,
				userId : 0,
				fullName : '',
				status : 0,
				statusValue : '',
				addedBy : 0,
				user : {},
				addedByUser : {},

				/** **/
				userRegisterKey : null,
				addedByUserRegisterKey : null
			};

            this.initWithUserMapObject = function(anUserMapObject){

                self.setId( anUserMapObject.getKey() );
                self.setFullName( anUserMapObject.getName() );
                self.setUserObj(anUserMapObject);
            };

			this.setTagId = function(tagId){
				tagMember.tagId = tagId;
			};

			this.getTagId = function(){
				return tagMember.tagId;
			};

			this.setId = function(memberId){
				tagMember.userId = memberId.toString();
			};

			this.getId = function(){
				return tagMember.userId;
			};

			this.getUser = function(){
				return userFactory.getUser(tagMember.userId);
				//return tagMember.user;
			};

			this.setFullName = function(fullName){
				tagMember.fullName = fullName;
			};

			this.getFullName = function(){
				return tagMember.fullName;
			};

			this.getPictureUrl = function(){
				if( !self.getUser().getUserAvatar){
					return 'images/prof.png';
				}else{
					return settings.imBase +  self.getUser().getUserAvatar();
				}
			};

			this.getName = function(){
				if( tagMember.fullName !== ''){

					return tagMember.fullName;

				}else if(!!self.getUser()) {

					  return self.getUser().getName();
				}else{

					return tagMember.userId;
				}

			};

			this.getStatus = function(){
				return tagMember.status;
			};

			this.getStatusValue = function(){
				if( tagMember.status === GENERAL_CONSTANTS.MEMBER_STATUS.ADMIN){
					return 'admin';
				}else if( tagMember.status === GENERAL_CONSTANTS.MEMBER_STATUS.MEMBER){
					return 'member';
				}else{
					return 'owner';
				}
			};

			this.setStatus = function(status){
				tagMember.status = status;
			};

			this.setAddedBy = function(addedBy){
				tagMember.addedBy = addedBy.toString();
			};

			this.getAddedBy = function(){
				return tagMember.addedBy;
			};

			this.getAddedByUser = function(){
				return userFactory.getUser(tagMember.addedBy);
				//return tagMember.addedByUser;
			};

			this.getAddedByUserName = function(){
				return !!self.getAddedByUser() && self.getAddedByUser().getName();
			};

			this.setAddedByUserObj = function(userObj){
				tagMember.addedByUser = userObj;
			};

			this.setUserObj = function(userObj){
				tagMember.user = userObj;
			};

			this.unregisterUserObjectsListener = function(){
				userService.unregister(tagMember.userRegisterKey);
				tagMember.userRegisterKey = null;

				userService.unregister(tagMember.addedByUserRegisterKey);
				tagMember.addedByUserRegisterKey = null;

			};

            this.initUserObjects = function(){


				var user = self.getUser();

            	if( !tagMember.userRegisterKey && ( !user || !user.hasDetails() ) ){


            		tagMember.userRegisterKey = userService.register(tagMember.userId, function(){
	                   Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_MEMBER_FETCHED, {userId : tagMember.userId, tagId : tagMember.tagId });
	                });
            	}


				var addedByUser = self.getAddedByUser();
                if( !tagMember.addedByUserRegisterKey && ( !addedByUser || !addedByUser.hasDetails() ) ){

                	tagMember.addedByUserRegisterKey = userService.register(tagMember.addedBy, function(){
	                    Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_MEMBER_FETCHED, {userId : tagMember.addedBy, tagId : tagMember.tagId });
	            	});
                }


             //    userFactory.createByUId(tagMember.userId, function(){
             //       Utils.triggerCustomEvent('TAG_MEMBER_FETCHED', {userId : tagMember.userId, tagId : tagMember.tagId });
             //    });


            	// userFactory.createByUId(tagMember.addedBy, function(){
             //        Utils.triggerCustomEvent('TAG_MEMBER_FETCHED', {userId : tagMember.addedBy, tagId : tagMember.tagId });
             //    });

			};

			this.isCurrentUser = function(){
				return self.getId() === Auth.currentUser().getKey();
			};

			this.isAdmin = function(){
				return tagMember.status == GENERAL_CONSTANTS.MEMBER_STATUS.ADMIN;
			};

			this.isMember = function(){
				return tagMember.status == GENERAL_CONSTANTS.MEMBER_STATUS.MEMBER;
			};

			this.isOwner = function(){
				return tagMember.status == GENERAL_CONSTANTS.MEMBER_STATUS.OWNER;
			};

			this.isRemoved = function(){
				return tagMember.status == GENERAL_CONSTANTS.MEMBER_STATUS.REMOVED;
			};

			this.makeAdmin = function(){
				tagMember.status = GENERAL_CONSTANTS.MEMBER_STATUS.ADMIN;
			};

			this.makeMember = function(){
				tagMember.status = GENERAL_CONSTANTS.MEMBER_STATUS.MEMBER;
			};

			this.makeOwner = function(){
				tagMember.status = GENERAL_CONSTANTS.MEMBER_STATUS.OWNER;
			};


			this.serialize = function(){
				return {
					userId : self.getId(),
					fullName : self.getName().utf8Encode(),
					status : self.getStatus(),
					addedBy : self.getAddedBy()
				};
			};
		}

		function TagMessage(){

			var self = this;

			var tagMessage = {
				tagId : 0,
				text: '',
				hrtime: '',
				status: '',
				messageDate: '',
				isDeleted: false,
				messageDateString: '',
				timeout: 0,
				userId : 0,
				fullName : '',
				type : 0,
				packetId : 0,


				/***** Derived *****/
				user : {},

				seenPacketSent : false,
				deliveredPacketSent : false,
				statusType : '',

				seenUsers : [],
				deliveredUsers : [],

				usersToChange : {},
				usersToChangeName : {},

				/*** Helper ****/
				tagName : '',
				allStatusUserFetched : false,
				statusUsersFetchCount : 0,


				userRegisterKey : null

			};

			this.getTagId = function(){
				return tagMessage.tagId;
			};

			this.setTagId = function(tagId){
				tagMessage.tagId = tagId;
			};

			this.getHumanReadableTime = function(){
				return tagMessage.hrtime;
			};

			this.setHumanReadableTime = function(hrtime){
				tagMessage.hrtime = hrtime;
			};

			this.setFullName = function(fullName){
				tagMessage.fullName = fullName.substring(0, 127);;
			};

			this.getFullName = function(){
				return tagMessage.fullName;
			};

			this.getPacketId = function(){
				return tagMessage.packetId;
			};

			this.setPacketId = function(packetId){
				tagMessage.packetId = packetId;
			};

			this.getMessageText = function(messageText){
				return tagMessage.text;
			};

			this.setMessageText = function(messageText){
				tagMessage.text = messageText;
			};

			this.setStatus = function(messageStatus){
				tagMessage.status = messageStatus;
			};

			this.getStatus = function(){
				return tagMessage.status;
			};

			this.setMessageDate = function(messageDate){
				tagMessage.messageDate = messageDate;
			};

			this.getMessageDate = function(){
				return tagMessage.messageDate;
			};

			this.markAsDeleted = function(){
				tagMessage.isDeleted = true;
			};

			this.unMarkFromDeleted = function(){
				tagMessage.isDeleted = false;
			};

			this.getIsDeleted = function(){
				return tagMessage.isDeleted;
			};

			this.setMessageDateString= function(messageDateString){
				tagMessage.messageDateString = messageDateString;
			};
			this.setTimeout = function(timeout){
				tagMessage.timeout = timeout;

			};
			this.setUserId = function(userId){
				tagMessage.userId = userId;
			};

			this.getMessageDateString= function(){
				return tagMessage.messageDateString;
			};

			this.getTimeout = function(){
				return tagMessage.timeout;
			};

			this.getUserId = function(){
				return tagMessage.userId;
			};

			this.getUser = function(){
				return userFactory.getUser(tagMessage.userId);
			};

			this.getMessageType = function(){
				return tagMessage.type;
			};

			this.setMessageType = function(messageType){
				return tagMessage.type = messageType;
			};

			this.initUserObjects = function() {

				var user = self.getUser();

				if( !tagMessage.userRegisterKey && ( !user || !user.hasDetails() ) ){

					tagMessage.userRegisterKey = userService.register(tagMessage.userId, function(){
	                   Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_MEMBER_FETCHED, {userId : tagMessage.userId, tagId : tagMessage.tagId });
	                });

				}

			};

			this.unregisterUserObjectsListener = function(){
				userService.unregister(tagMessage.userRegisterKey);
				tagMessage.userRegisterKey = null;

			};

			this.getSeenPacketSent = function(){
				return tagMessage.seenPacketSent;
			};

			this.getDeliveredPacketSent = function(){
				return tagMessage.deliveredPacketSent;
			};

			this.setSeenPacketSent = function(seenPacketSent){
				tagMessage.seenPacketSent = seenPacketSent;
			};

			this.setDeliveredPacketSent = function( deliveredPacketSent ){
				tagMessage.deliveredPacketSent = deliveredPacketSent;
			};

			this.addSeenUserId = function(userId){
				tagMessage.seenUsers.push(userId);
			};

			this.addDeliveredUserId = function(userId){
				tagMessage.deliveredUsers.push(userId);
			};

			this.setUsersToChange = function(usersToChange){
				tagMessage.usersToChange = usersToChange;
			};

			this.getUsersToChange = function(){
				return tagMessage.usersToChange;
			};

			this.setUsersToChangeName = function(usersToChangeName){
				tagMessage.usersToChangeName = usersToChangeName;
			};

			this.getUsersToChange = function(){
				return tagMessage.usersToChangeName;
			};

			this.setStatusType = function(statusType){
				tagMessage.statusType = statusType;
			};

			this.getStatusType = function(){
				return tagMessage.statusType;
			};

			this.getTagName = function(){
				return tagMessage.tagName;
			};

			this.setTagName = function(tagName){
				tagMessage.tagName = tagName;
			};


			this.serialize = function(){
				return {
					tagId : self.getTagId(),
					userId : self.getUserId(),
					user : self.getUserId(),
					packetId : self.getPacketId(),
					fullName : self.getFullName().utf8Encode(),
					status : self.getStatus(),
					statusType : self.getStatusType(),
					type : self.getMessageType(),
					hrtime : self.getHumanReadableTime(),
					messageDate : self.getMessageDate(),
					isDeleted : tagMessage.isDeleted,
					timeout : self.getTimeout(),
					text : self.getMessageText().utf8Encode(),

					seenPacketSent : self.getSeenPacketSent(),
					deliveredPacketSent : self.getDeliveredPacketSent(),
					usersToChange : Object.keys(tagMessage.usersToChange),
					allStatusUserFetched : tagMessage.allStatusUserFetched,

					messageType: self.getMessageType(),
					tag_chat : true,
					tagName : self.getTagName()

				};
			};
		}

		TagMessage.prototype.update = function(newTagMessageObj){

			if( !!newTagMessageObj.getFullName() ){
				this.setFullName( newTagMessageObj.getFullName() );
			}

			if( !!newTagMessageObj.getStatus() ){
				this.setStatus( newTagMessageObj.getStatus() );
			}

			if( !!newTagMessageObj.getStatusType() ){
				this.setStatusType( newTagMessageObj.getStatusType() );
			}

			if( !!newTagMessageObj.getMessageType() ){
				this.setMessageType( newTagMessageObj.getMessageType() );
			}

			if( !!newTagMessageObj.getMessageDate() ){
				this.setMessageDate( newTagMessageObj.getMessageDate() );
			}

			if( !!newTagMessageObj.getMessageText() ){
				this.setMessageText( newTagMessageObj.getMessageText() );
			}

			if( !!newTagMessageObj.getUsersToChange() ){
				this.setUsersToChange( newTagMessageObj.getUsersToChange() );
			}

			if( !!newTagMessageObj.getMessageType() ){
				this.setMessageType( newTagMessageObj.getMessageType() );
			}

			if( !!newTagMessageObj.getSeenPacketSent() ){
				this.setSeenPacketSent( newTagMessageObj.getSeenPacketSent() );
			}

			if( !!newTagMessageObj.getDeliveredPacketSent() ){
				this.setDeliveredPacketSent( newTagMessageObj.getDeliveredPacketSent() );
			}

			if( !!newTagMessageObj.getDeliveredPacketSent() ){
				this.setDeliveredPacketSent( newTagMessageObj.getDeliveredPacketSent() );
			}

			if( !!newTagMessageObj.getTimeout() ){
				this.setTimeout( newTagMessageObj.getTimeout() );
			}

			if( !!newTagMessageObj.getIsDeleted()){
				this.markAsDeleted();
			}

			if( !newTagMessageObj.getHumanReadableTime() ){
				this.setHumanReadableTime(newTagMessageObj.getHumanReadableTime());
			}
		};

		return {

			TagObject : TagObject,
			TagMember : TagMember,
			TagMessage: TagMessage

		};
	}


