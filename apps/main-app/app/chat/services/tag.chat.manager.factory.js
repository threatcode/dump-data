

	angular
        .module('ringid.chat')
		.factory('tagChatManager', tagChatManager);

	tagChatManager.$inject = [
		 	'$$connector', '$q', '$timeout',
			'Auth', 'CHAT_LANG',
			'tagChatFactory',
			'ChatWorkerCommands',  'tagChatUI', 'tagChatHelper',
			'ChatFactory', 'chatHistoryFactory',
			'userFactory', 'Utils', 'profileFactory', 'tagChatStorage',
			'OPERATION_TYPES' ,'Ringalert',
			'ChatUtilsFactory', 'ChatConnector', 'SystemEvents'

	];

	function tagChatManager (

			 $$connector, $q, $timeout,
			 Auth, CHAT_LANG,
			 tagChatFactory,
			 ChatWorkerCommands, tagChatUI, tagChatHelper,
			 ChatFactory, chatHistoryFactory,
			 userFactory, Utils, profileFactory, tagChatStorage,
			 OPERATION_TYPES, Ringalert,
			 ChatUtilsFactory, ChatConnector, SystemEvents

	) {


		var Constants                            = CHAT_APP.Constants;
        var SharedHelpers                        = CHAT_APP.SharedHelpers;
		var GENERAL_CONSTANTS                    = Constants.GENERAL_CONSTANTS;

		var AUTH_SERVER_ACTIONS                  = Constants.AUTH_SERVER_ACTIONS;

		var TAG_CHAT_PACKET_TYPE                 = Constants.TAG_CHAT_PACKET_TYPE;
		var OFFLINE_PACKET_TYPE                  = Constants.OFFLINE_PACKET_TYPE;
		var FRIEND_CHAT_PACKET_TYPE              = Constants.FRIEND_CHAT_PACKET_TYPE;

		var TAG_CHAT_LANG                        = CHAT_LANG.TAG;

		var AuthRequests                         = CHAT_APP.AuthRequests;
		var ChatRequests                         = CHAT_APP.ChatRequests;

		var callXTimeAfterYIntervalStopOnSuccess = CHAT_APP.UTILS.callXTimeAfterYIntervalStopOnSuccess;

		/******************************* TAG CRUD Start ******************************/
		function _createTag( object ) {
			/***
			 * @param tagObject
			 * tagObject = { tagId : '', uIds : [] }
			 */

			var currentUser = Auth.currentUser(),
				deferred = $q.defer(),
				aTag,
				aTagMemberObjectParam,
				aTagMemberObject,
				aTagAdminObjectParam,
				aTagAdminObject,
				authFailed;



			/************ Create Tag Object **************/

			object.tagMembersCount =  object.memberUIds.length + object.adminUIds.length +  1;
			aTag = tagChatFactory.createNewTag(object);


			/************ Add Tag Owner Start **************/

			aTagMemberObjectParam = {
				userId : currentUser.getKey(),
				addedBy : currentUser.getKey(),
				status : GENERAL_CONSTANTS.MEMBER_STATUS.OWNER
			};

			aTagMemberObject = tagChatFactory.createNewTagMember(aTag.getTagId(), aTagMemberObjectParam, true);
			aTag.addMember( aTagMemberObject );

			/************ Add Tag Owner End **************/


			/************ Add Tag Members Start **************/

			for(var tagMemberIndex = 0; tagMemberIndex < object.memberUIds.length; tagMemberIndex++ ){
				var aTagMemberUId = object.memberUIds[tagMemberIndex];

				aTagMemberObjectParam = {
					userId : aTagMemberUId,
					addedBy : currentUser.getKey(),
					status : GENERAL_CONSTANTS.MEMBER_STATUS.MEMBER
				};

				aTagMemberObject = tagChatFactory.createNewTagMember(aTag.getTagId(), aTagMemberObjectParam, true);
				aTag.addMember( aTagMemberObject );
			}

			/************ Add Tag Members End **************/

			/************ Add Tag Admins Start **************/

			for(var tagAdminIndex = 0; tagAdminIndex < object.adminUIds.length; tagAdminIndex++ ){
				var aTagAdminUId = object.adminUIds[tagAdminIndex];

				aTagAdminObjectParam = {
					userId : aTagAdminUId,
					addedBy : currentUser.getKey(),
					status : GENERAL_CONSTANTS.MEMBER_STATUS.ADMIN
				};

				aTagAdminObject = tagChatFactory.createNewTagMember(aTag.getTagId(), aTagAdminObjectParam, true);
				aTag.addMember( aTagAdminObject );
			}

			/************ Add Tag Admins End **************/

			/************ Create Tag In Auth Start **************/

			aTag.setObjectLock();
			tagChatFactory.addTagObject(aTag);

			Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED);

            object.uIds = object.adminUIds.concat(object.memberUIds);

			var requestObject = ChatRequests.getOfflineTagCreateTagObject(aTag.getTagId(),
				 aTag.getTagName(), aTag.getPictureUrl(), aTag.getSerializedMembers()
			);

            requestObject.brokenPacketType = OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_PACKET;

			ChatConnector.request(requestObject).then(function(response){
				aTag.removeObjectLock();

				if( !!response.sucs){
					deferred.resolve(response);

					ChatWorkerCommands.startChatSession(aTag.getTagId(),
						GENERAL_CONSTANTS.SESSION_TYPES.TAG, aTag.getMemberUserIds());

				}else if(response.error){
					deferred.error(response);

				}else{
					deferred.reject(response);

				}
			});

			return deferred.promise;

		}

		function __getMembersForCRUD(oldTagObj, memberUIdsToSet, adminUIdsToSet){

			var currentUser = Auth.currentUser(),
				oldTagMemberListCopy,  oldTagMembersAndAdminsMap,
				allOldTagMembersAndAdminsMap, aTagMemberObject,
				statusChanged, aNewMember,
				newTagMemberObject, aNewAdmin,
				newTagAdminObject,
				serializedMemberAdminsToRemove = [],
				serializedMemberAdminsToStatusChange = [],
				serializedNewMemberAdminsToAdd = [],
				membersAdminToAddOnSuccess = [],
				membersAdminToRemoveOnSuccess = [],
				membersAdminToUpdateOnSuccess = [],
				newMemberUIdsToSetCache = {},
				newAdminUIdsToSetCache = {},
				oldMembersUIdCache = {};


			oldTagMemberListCopy = oldTagObj.getMembersObjectMap().copy();
			oldTagMembersAndAdminsMap = oldTagMemberListCopy;
			allOldTagMembersAndAdminsMap = oldTagMembersAndAdminsMap.all();

			angular.forEach(memberUIdsToSet, function(aMemberUId){
				newMemberUIdsToSetCache[aMemberUId] = true;
			});

			angular.forEach(adminUIdsToSet, function(anAdminUId){
				newAdminUIdsToSetCache[anAdminUId] = true;
			});

			for(var oldTagMembersAndAdminsMapIndex = 0; oldTagMembersAndAdminsMapIndex < allOldTagMembersAndAdminsMap.length; oldTagMembersAndAdminsMapIndex++ ){

				aTagMemberObject = allOldTagMembersAndAdminsMap[oldTagMembersAndAdminsMapIndex].value;

				oldMembersUIdCache[ aTagMemberObject.getId() ] = true;

				if( aTagMemberObject.isOwner() ){
					continue;
				}

				if( !newAdminUIdsToSetCache[ aTagMemberObject.getId()] && !newMemberUIdsToSetCache[ aTagMemberObject.getId() ]){
					//Now Not In Member And Admin, remove this user

					//Admin to Remove List
					serializedMemberAdminsToRemove.push(aTagMemberObject.serialize());

					membersAdminToRemoveOnSuccess.push(aTagMemberObject);

				}else
				{

					statusChanged = false;
					if( aTagMemberObject.isAdmin() ){
						//Previously Admin

						if(  !!newMemberUIdsToSetCache[ aTagMemberObject.getId() ] ){
							//Now In Member

							//Change Status To Member
							aTagMemberObject.makeMember();

							statusChanged = true;

						}

					}else if( aTagMemberObject.isMember() ){
						//Previously Member

						if(  !!newAdminUIdsToSetCache[ aTagMemberObject.getId() ] ){
							//Now In Admin

							//Change Status To Member
							aTagMemberObject.makeAdmin();

							statusChanged = true;

						}
					}

					if(statusChanged){

						//Add to Status Change List
						//Only { userId : userId } needed, using serialize for generic interface
						serializedMemberAdminsToStatusChange.push(aTagMemberObject.serialize());

						membersAdminToUpdateOnSuccess.push(aTagMemberObject);
					}

				}

			}

			angular.forEach(memberUIdsToSet, function(aMemberUId){

				if( !oldMembersUIdCache[aMemberUId] && aMemberUId !== currentUser.getKey() ){
					//New Member

					aNewMember = userFactory.getUser(aMemberUId);

					newTagMemberObject = tagChatFactory.createNewTagMember(
						oldTagObj.getTagId(),
						{ 	userId : aMemberUId, addedBy : currentUser.getKey(),
							fullName : aNewMember.getName(),
							status : GENERAL_CONSTANTS.MEMBER_STATUS.MEMBER
						},
						true
					);
					membersAdminToAddOnSuccess.push(newTagMemberObject);

					serializedNewMemberAdminsToAdd.push( newTagMemberObject.serialize() );

				}
			});

			angular.forEach(adminUIdsToSet, function(anAdminUId){

				if( !oldMembersUIdCache[anAdminUId] && anAdminUId !== currentUser.getKey() ){
					//New Admin

					aNewAdmin = userFactory.getUser(anAdminUId);

					newTagAdminObject = tagChatFactory.createNewTagMember(
						oldTagObj.getTagId(),
						{ 	userId : anAdminUId, addedBy : currentUser.getKey(),
							fullName : aNewAdmin.getName(),
							status : GENERAL_CONSTANTS.MEMBER_STATUS.ADMIN
						},
						true
					);

					membersAdminToAddOnSuccess.push(newTagAdminObject);

					serializedNewMemberAdminsToAdd.push( newTagAdminObject.serialize() );

				}
			});


			return {
				serializedMemberAdminsToRemove : serializedMemberAdminsToRemove,
				serializedMemberAdminsToStatusChange : serializedMemberAdminsToStatusChange,
				serializedNewMemberAdminsToAdd : serializedNewMemberAdminsToAdd,
				membersAdminToAddOnSuccess : membersAdminToAddOnSuccess,
				membersAdminToRemoveOnSuccess : membersAdminToRemoveOnSuccess,
				membersAdminToUpdateOnSuccess : membersAdminToUpdateOnSuccess

			};


		}

		function __hasTagUpdated(oldTagObj, newTagName, newPictureFileName,
								 serializedNewMemberAdminsToAdd, serializedMemberAdminsToRemove, serializedMemberAdminsToStatusChange){

			if( (serializedNewMemberAdminsToAdd.length > 0) 		||
				(serializedMemberAdminsToRemove.length > 0) 		||
				(serializedMemberAdminsToStatusChange.length > 0) 	||
				(oldTagObj.getTagName() !== newTagName) 			||
				( oldTagObj.getPictureUrl() !== newPictureFileName)

			){
				return true;
			}
			return false;

		}


		function __addNewMembers(oldTagObj, serializedNewMemberAdminsToAdd, membersAdminToAddOnSuccess){

			var currentUser = Auth.currentUser(),
				deferred = $q.defer(),
				addTagMembersInAuthFailed,
				serializedNewMemberAdminsUserIds,
				addTagMemberInChatServerChatSocketCallPacketId,
				addTagMemberInChatServerChatSocketCallSuccessStatus,
				tagMemberAddConfirmation;

			if( serializedNewMemberAdminsToAdd.length > 0 ){

				/**************************** Handle New Members in Auth *********************************/

				addTagMembersInAuthFailed = false;

				serializedNewMemberAdminsUserIds = serializedNewMemberAdminsToAdd.keyValues('userId');


				var requestObject = AuthRequests.getTagChatMembersAddObject(oldTagObj.getTagId(), serializedNewMemberAdminsUserIds );

				ChatWorkerCommands.sendTagChatMemberAddAuthRequest( requestObject );

				/**************************** Handle New Members in Chat *********************************/

				var requestObject = ChatRequests.getTagChatTagMemberAddObject(oldTagObj.getTagId(),
					serializedNewMemberAdminsToAdd
				);

				var serverCurrentTime = SharedHelpers.getChatServerCurrentTime();

				ChatConnector.request(requestObject).then(function(response){

					if( !!response.sucs ){

						angular.forEach(membersAdminToAddOnSuccess, function(aMemberToAdd){
							oldTagObj.addMember(aMemberToAdd);
						});

						oldTagObj.setMembersCount( oldTagObj.getMembersCount() + membersAdminToAddOnSuccess.length);

						tagChatUI.showTagMembersAddStatusMessage(oldTagObj.getTagId(),
							currentUser.getKey(),
							serializedNewMemberAdminsToAdd,
							serverCurrentTime,
                            false,
							response.packetId /* Need to check this */
						);

						deferred.resolve({ sucs : true , mg : 'Member( '+ membersAdminToAddOnSuccess.length +' ) Added in ' + oldTagObj.getTagName() });

					}

				}, function(response){

					deferred.reject({ sucs : false , mg : 'Unable to send tag new member add packet to chat server.'});
					RingLogger.alert('Unable to send tag new member add packet to chat server', oldTagObj.getTagId(), ' tag-chat-new-member-add-in-chat-retry-count' , RingLogger.tags.TAG_CHAT);

				});

			}else{
				deferred.resolve({ sucs: false});
			}

			return deferred.promise;

		}

		function __removeOldMembers(oldTagObj, serializedMemberAdminsToRemove, membersAdminToRemoveOnSuccess){

			var currentUser = Auth.currentUser(),
				deferred = $q.defer(),
				removeTagMemberInChatServerChatSocketCallPacketId,
				removeTagMemberInChatServerChatSocketCallSuccessStatus;

			if( serializedMemberAdminsToRemove.length > 0){


				/**************************** Handle Old Members Remove in Chat *********************************/

				var serverCurrentTime = SharedHelpers.getChatServerCurrentTime();

				var requestObject = ChatRequests.getTagChatMemberRemoveLeaveObject( oldTagObj.getTagId(),
					serializedMemberAdminsToRemove
				);

				ChatConnector.request(requestObject).then(function(response){

					if( !!response.sucs ){

						angular.forEach(membersAdminToRemoveOnSuccess, function(aMemberToRemove){
							oldTagObj.removeMember(aMemberToRemove);
						});

						oldTagObj.setMembersCount( oldTagObj.getMembersCount() - membersAdminToRemoveOnSuccess.length);

						tagChatUI.showTagMembersRemoveStatusMessage(oldTagObj.getTagId(),
							currentUser.getKey(),
							serializedMemberAdminsToRemove,
							serverCurrentTime,
							response.packetId /* need to check this */

						);

						deferred.resolve({ sucs : true , mg : 'Member( '+ membersAdminToRemoveOnSuccess.length +' ) Removed from ' + oldTagObj.getTagName() });
					}

				}, function(response){

					deferred.reject({ sucs : false , mg : 'Unable to send tag member remove packet to chat server.'});
					RingLogger.alert('Unable to send tag  member remove packet to chat server', oldTagObj.getTagId(), ' tag-chat-new-member-add-in-chat-retry-count' , RingLogger.tags.TAG_CHAT);

				});

			}else{
				deferred.resolve({ sucs: false});
			}

			return deferred.promise;
		}

		function __changeMemberStatus(oldTagObj, serializedMemberAdminsToStatusChange, membersAdminToUpdateOnSuccess){

			var currentUser = Auth.currentUser(),
				deferred = $q.defer();

			var serverCurrentTime = SharedHelpers.getChatServerCurrentTime();
			if( serializedMemberAdminsToStatusChange.length > 0){


				/**************************** Handle Old TagMember Status Change in Chat *********************************/

				var requestObject = ChatRequests.getTagChatTagMemberTypeChangeObject(oldTagObj.getTagId(),
					serializedMemberAdminsToStatusChange
				);

				ChatConnector.request(requestObject).then(function(response){

					if( !!response.sucs ){

						angular.forEach(membersAdminToUpdateOnSuccess, function(aMemberToUpdate){
							oldTagObj.updateMember(aMemberToUpdate);
						});

						tagChatUI.showMemberTypeChangeStatusMessage(oldTagObj.getTagId(),
							currentUser.getKey(),
							serializedMemberAdminsToStatusChange,
							serverCurrentTime,
                            false,
							response.packetId
						);

						deferred.resolve({ sucs : true , mg : 'Member( '+ membersAdminToUpdateOnSuccess.length +' ) Status Updated for ' + oldTagObj.getTagName() });

					}

				}, function(response){

					deferred.reject({ sucs : false , mg : 'Unable to send tag member status change packet to chat server.'});
					RingLogger.alert('Unable to send tag  member status change packet to chat server', oldTagObj.getTagId(), ' tag-chat-member-status-change-in-chat-retry-count' , RingLogger.tags.TAG_CHAT);

				});


			}else{
				deferred.resolve({ sucs: false});
			}

			return deferred.promise;
		}

		function __updateTagInformation(oldTagObj, newTagName, newPictureFileName){

			var currentUser = Auth.currentUser(),
				deferred = $q.defer(),
				oldTagName = oldTagObj.getTagName(),
				oldTagPictureUrl = oldTagObj.getPictureUrl(),
				tagNameUpdated = oldTagObj.getTagName() !== newTagName,
				tagPictureUrlUpdated =oldTagObj.getPictureUrl() !== newPictureFileName,
				tagInfoUpdated = tagNameUpdated || tagPictureUrlUpdated,
				tagInfoChangeStatusMessageType,
				activityType;


			if( tagInfoUpdated  ){

				/**************************** Handle tag info update in Chat *********************************/

				tagInfoChangeStatusMessageType = tagChatUI.getTagInfoChangeStatusMessage(oldTagObj.getTagId(),
					{ tagName : newTagName || "", tagPictureUrl: newPictureFileName || "" }
				);

				//Reflect Changes
				if(tagNameUpdated){
					oldTagObj.setTagName( newTagName );
					activityType = GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.TAG_RENAME;

					var requestObject = ChatRequests.getTagChatTagInformationObject(oldTagObj.getTagId(),
						activityType, newTagName, oldTagPictureUrl
					);

					ChatConnector.request(requestObject).then(function(response){

						if( !!response.sucs ){

							tagChatUI.showTagInfoChangeStatusMessage(oldTagObj.getTagId(),
								currentUser.getKey(),
								{ statusMessageType : tagInfoChangeStatusMessageType, tagName : newTagName },
                                false
							);

							if( !tagPictureUrlUpdated){
								deferred.resolve({ sucs : true , mg : 'Updated Group Info of ' + oldTagObj.getTagName() });
							}

						}

					}, function(response){

						if(tagNameUpdated){
							oldTagObj.setTagName( oldTagName );
						}

						deferred.reject({ sucs : false , mg : 'Unable to send tag info tag name change packet to chat server.'});
						RingLogger.alert('Unable to send tag  member info tag name change packet to chat server', oldTagObj.getTagId(), ' update-tag-tag-chat-info-in-chat-retry-count' , RingLogger.tags.TAG_CHAT);

					});



				}

				if( tagPictureUrlUpdated){

					oldTagObj.setPictureUrl( newPictureFileName );
					activityType = GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.TAG_URL_RENAME;


					var requestObject = ChatRequests.getTagChatTagInformationObject(oldTagObj.getTagId(),
						activityType, oldTagName, newPictureFileName
					);

					ChatConnector.request(requestObject).then(function(response){

						if( !!response.sucs ){

							tagChatUI.showTagInfoChangeStatusMessage(oldTagObj.getTagId(),
								currentUser.getKey(),
								{ statusMessageType : tagInfoChangeStatusMessageType, tagName : newTagName },
                                false
							);

							deferred.resolve({ sucs : true , mg : 'Updated Group Info of ' + oldTagObj.getTagName() });

						}

					}, function(response){

						if( tagPictureUrlUpdated){
							oldTagObj.setPictureUrl( oldTagPictureUrl );
						}

						deferred.reject({ sucs : false , mg : 'Unable to send tag info tag picture url packet to chat server.'});
						RingLogger.alert('Unable to send tag info tag picture url packet to chat server', oldTagObj.getTagId(), ' update-tag-tag-chat-info-in-chat-retry-count' , RingLogger.tags.TAG_CHAT);

					});

				}

			}else{
				deferred.resolve({ sucs: false});
			}

			return deferred.promise;

		}

		function _updateTag(oldTagObj, newTagName, newPictureFileName, memberUIdsToSet, adminUIdsToSet){

			var currentUser = Auth.currentUser(),
				membersForCRUD,
				serializedNewMemberAdminsToAdd,
				membersAdminToAddOnSuccess,
				serializedMemberAdminsToRemove,
				membersAdminToRemoveOnSuccess,
				serializedMemberAdminsToStatusChange,
				membersAdminToUpdateOnSuccess;


			var deferred = $q.defer();

			/****************************  Get MemberUId Diff *********************************/
				membersForCRUD = __getMembersForCRUD(oldTagObj, memberUIdsToSet, adminUIdsToSet);
				serializedNewMemberAdminsToAdd = membersForCRUD.serializedNewMemberAdminsToAdd;
				membersAdminToAddOnSuccess = membersForCRUD.membersAdminToAddOnSuccess;

				serializedMemberAdminsToRemove = membersForCRUD.serializedMemberAdminsToRemove;
				membersAdminToRemoveOnSuccess = membersForCRUD.membersAdminToRemoveOnSuccess;

				serializedMemberAdminsToStatusChange = membersForCRUD.serializedMemberAdminsToStatusChange;
				membersAdminToUpdateOnSuccess = membersForCRUD.membersAdminToUpdateOnSuccess;

				var successCount = 0;

				/****************************  Handle New Members *********************************/
				__addNewMembers(oldTagObj, serializedNewMemberAdminsToAdd, membersAdminToAddOnSuccess).then(function(response){
					if(!!response.sucs){
						successCount++;
						deferred.notify(response);
					}
				}, deferred.reject);



				/**************************** Handle Old Members Remove *********************************/
				__removeOldMembers(oldTagObj, serializedMemberAdminsToRemove, membersAdminToRemoveOnSuccess).then(function(response){
					if(!!response.sucs){
						successCount++;
						deferred.notify(response);
					}
				}, deferred.reject);

				/**************************** Handle Current Member Status Change *********************************/
				__changeMemberStatus(oldTagObj, serializedMemberAdminsToStatusChange, membersAdminToUpdateOnSuccess).then(function(response){
					if(!!response.sucs){
						successCount++;
						deferred.notify(response);
					}
				}, deferred.reject);


				/**************************** Handle Tag Info Update *********************************/
				__updateTagInformation(oldTagObj, newTagName, newPictureFileName).then(function(response){
					if(!!response.sucs){
						successCount++;
						deferred.notify(response);
					}
				}, deferred.reject);


				setTimeout(function(){
					if( !successCount ){
						deferred.reject({ sucs: false });
					}else{
						deferred.resolve({ sucs: true });
					}

				}, 18000);

			Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED);

			return deferred.promise;


		}
		/******************************* TAG CRUD End ******************************/

		/******************************* TAG Member CRUD Start ******************************/

		function _leaveFromTag(tagId){
			var tagObject = tagChatFactory.getTag(tagId);

			var currentOwner = tagObject.getMember(Auth.currentUser().getKey());

			return _removeTagMember(tagId, [ currentOwner.serialize() ], [currentOwner] );
		}

		function _removeTagMember(tagId, tagMemberUserIdsToRemove, membersAdminToRemoveOnSuccess){

			var currentUser = Auth.currentUser(),
				deferred = $q.defer(),
				tagObject = tagChatFactory.getTag(tagId),
				isSuccess = false;


			var requestObject = ChatRequests.getTagChatMemberRemoveLeaveObject( tagId,
				tagMemberUserIdsToRemove
			);

			ChatConnector.request(requestObject).then(function(response){

				if( !!response.sucs ){

					tagObject = tagChatFactory.getTag(tagId);

					var statusMsg = 'Member( '+ membersAdminToRemoveOnSuccess.length +' ) Removed from ' + tagObject.getTagName();

					var tagRemoved = false;

					for(var index = 0; index < membersAdminToRemoveOnSuccess.length; index++ ){
						var aMemberToRemove = membersAdminToRemoveOnSuccess[index];

						if( aMemberToRemove.getId() === currentUser.getKey() ){

							statusMsg = 'You left from (' + tagObject.getTagName() + ') conversation ';

							tagChatFactory.removeTagObject(tagId);

							tagRemoved = true;

							deferred.resolve({ sucs : true , mg :  statusMsg });


						}

						if( tagRemoved ) break;

						tagObject.removeMember(aMemberToRemove);

					}

					if( !tagRemoved ){

						deferred.resolve({ sucs : true , mg :  statusMsg });
					}

				}

			}, function(response){

				deferred.reject({ sucs : false , mg : 'Unable to send tag member remove packet to chat server.'});
				RingLogger.alert('Unable to send tag  member remove packet to chat server', tagObject.getTagId(), ' tag-chat-new-member-add-in-chat-retry-count' , RingLogger.tags.TAG_CHAT);

			});


			Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED);

			return deferred.promise;
		}

		function _changeTagMemberStatus(tagId, serializedStatusToChangeMembers, membersAdminToUpdateOnSuccess){

			var currentUser = Auth.currentUser(),
				deferred = $q.defer(),
				tagObject = tagChatFactory.getTag(tagId),
				isSuccess = false;


			var requestObject = ChatRequests.getTagChatTagMemberTypeChangeObject(tagId,
				serializedStatusToChangeMembers
			);

			ChatConnector.request(requestObject).then(function(response){

				if( !!response.sucs ){
					angular.forEach(membersAdminToUpdateOnSuccess, function(aMemberToUpdate){
						tagObject.updateMember(aMemberToUpdate);
					});

					deferred.resolve({ sucs : true , mg : 'Member( '+ serializedStatusToChangeMembers.length +' ) Status Updated for ' + tagObject.getTagName() });
				}

			}, function(response){

				deferred.reject({ sucs : false , mg : 'Unable to send tag member status change packet to chat server.'});
				RingLogger.alert('Unable to send tag  member status change packet to chat server', tagObject.getTagId(), ' tag-chat-member-status-change-in-chat-retry-count' , RingLogger.tags.TAG_CHAT);

			});

			Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED);

			return deferred.promise;
		}

		function _openPreviouslyOpenedBoxes(tagId){

			callXTimeAfterYIntervalStopOnSuccess(
				function(){

					var tagObject = tagChatFactory.getTag(tagId);

					if( !!tagObject && tagObject.isTagSafeToShow()){
						var tagChatBox = ChatFactory.getBoxByUId(tagId);
						_openTagChatBoxIfClosed(tagId, tagChatBox);
					}

				},
				function(iterationCount){
					//RingLogger.information('TRY BOX OPEN',  tagId,  RingLogger.tags.TAG_CHAT);

					var tagObject = tagChatFactory.getTag(tagId);

					if( !!tagObject && tagObject.isTagSafeToShow()){
						return true;
					}
					return false;
				},
				function(){
					// RingLogger.information('PREVIOUS BOX OPEN FAILED ',  tagId,  RingLogger.tags.TAG_CHAT);
				},
				5,
				5000
			);

		}

		function _openTagChatBoxIfClosed(tagId, box){

			//RingLogger.print('Open Tag chat box', tagId, box, RingLogger.tags.TAG_CHAT);

			var shouldLoadHistory = false;

			if(!box){
				shouldLoadHistory = true;

				var tagObject = tagChatFactory.getOrCreateTag(tagId);

				if( tagObject.isTagSafeToShow()){

					ChatFactory.openTagChatBox(tagId);
					box = ChatFactory.getBoxByUId(tagId);
					box.setTitle(tagObject.getTagName());

				}else{

					box = ChatFactory.creatNonDomBox(tagId, true);
				}

				box.setTitle(tagObject.getTagName());

			}

			if(shouldLoadHistory){
				box.loadHistoryMessages();
			}

			return box;

		}

		return {

			createTag: _createTag,
			updateTag : _updateTag,
			leaveFromTag : _leaveFromTag,
			removeTagMember  : _removeTagMember,
			changeTagMemberStatus : _changeTagMemberStatus,

			openTagChatBoxIfClosed : _openTagChatBoxIfClosed,
			openPreviouslyOpenedBoxes : _openPreviouslyOpenedBoxes,

		};


	}

