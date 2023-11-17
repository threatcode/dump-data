/*
 * © Ipvision
 */

	angular
		.module('ringid.chat')
		.controller('TagChatPopupController', TagChatPopupController);

		TagChatPopupController.$inject = [
			'$timeout', '$scope', '$boxInstance', '$$stackedMap',
			'Auth', 'fileUploadService',
			'tagChatFactory', 'tagChatManager', 'friendsFactory',
			'localData', 'Ringalert', 'Utils', 'settings',
			'profileFactory', 'rgScrollbarService', 'CHAT_LANG', 'SystemEvents'
		];

		function TagChatPopupController(
			$timeout, $scope, $boxInstance, $$stackedMap,
			Auth, fileUploadService,
			tagChatFactory, tagChatManager, friendsFactory,
			localData, Ringalert, Utils, settings,
			profileFactory, rgScrollbarService, CHAT_LANG, SystemEvents
		) {

			var TAG_CHAT_LANG = CHAT_LANG.TAG;
			var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;

            $scope.state = {
                loading: false,
                noData: false,
            };
			var oldMemberList = {},
				apiParams = {},
				utId = '',
				memberUtIds = '';

			//$scope.friends = friendsFactory.friends.copy();
            $scope.friends = friendsFactory.getFriends('friends');
            $scope.friendName = '';
			$scope.editMode = false;

			$scope.addToTag = addToTag;
			$scope.removeMember= removeMember;
			$scope.createChatTag = createChatTag;
			$scope.updateChatTag = updateChatTag;
			$scope.loadMoreFriends = loadMoreFriends;
			$scope.cancel = cancel;
			$scope.validateTag = validateTag;

			$scope.newOwnerTagMember = false;

			$scope.models = {
				popupTitle: 'Create New Group Chat',
				tagName: '',
				pictureUrl : '',
				pictureFileName : '',
				tagId : tagChatFactory.generateNewTagId(),
			};

			$scope.uploading = false;

			$scope.selectNewOwner = selectNewOwner;

			$scope.setNewOwner = setNewOwner;

			$scope.isMemberSelected = isMemberSelected;

			$scope.canRemoveMember = canRemoveMember;

			$scope.canUpdateTagInfo = canUpdateTagInfo;

			$scope.getPicturePreviewUrl = function(){
				return settings.tagChatImBase + $scope.models.pictureUrl;
			};

			$scope.contactListAction = function(actionObj) {
                if (!actionObj.friend.isLoading()) {
                    friendsFactory.friendAction(actionObj,true).then(function() {
                        $scope.$rgDigest();
                    }, function() {
                        $scope.$rgDigest();
                    });
                    $scope.$rgDigest();
                }
            };


			$scope.uploadAction = function (actionObj) {
				console.log(actionObj);

				actionObj.uploadFile.fetchMeta(function(){

					$scope.models.pictureUrl = actionObj.uploadFile.getPreview();
					$scope.uploading = true;

					Utils.safeDigest($scope);

					actionObj.uploadFile.initUpload().then(function(imgData){
						$scope.uploading = false;
						console.info("chat image uploaded:" + imgData);
						$scope.models.pictureFileName = imgData.iurl;
						$scope.models.pictureUrl = settings.imBase + imgData.url;

						Utils.safeDigest($scope);

					}, function(response){
						console.log(response);
						$scope.uploading = false;
					});

				});
			};

			var currentUserUId = Auth.currentUser().getKey();

			function initAdminMemberOwnerList(){
				$scope.memberList = $$stackedMap.createNew();
				$scope.adminList = $$stackedMap.createNew();
				//$scope.ownerList = $$stackedMap.createNew();
			}

			if (localData && localData.tagId) {


				//get tag data
				$scope.tag = tagChatFactory.getTag(localData.tagId);

                //take backup
				oldMemberList = $scope.memberList;

				var memberObjectMap = $scope.tag.getMembersObjectMap();

				if( !!memberObjectMap ){
                	$scope.memberAdminList = memberObjectMap.copy();
					initAdminMemberOwnerList();

					$scope.tag.initMemberObjects();

					angular.forEach($scope.memberAdminList.all(), function(aMemberList){

						if( aMemberList.value.isMember() ){
							$scope.memberList.add(aMemberList.key, aMemberList.value);
						}else{
							$scope.adminList.add(aMemberList.key, aMemberList.value);
						}

					});

				}else{
					initAdminMemberOwnerList();

				}

				$scope.models.tagName = $scope.tag.getTagName();
				$scope.models.popupTitle = 'Update Group chat';
				$scope.models.pictureUrl = $scope.tag.getPictureFullUrl();
				$scope.models.pictureFileName = $scope.tag.getPictureUrl();

				// show an existing tag for view/edit
				$scope.editMode = true;

			} else {
				// create new stack
				initAdminMemberOwnerList();
			}


            var memberFetchedEventRef = Utils.onCustomEvent(SystemEvents.CHAT.TAG_MEMBER_FETCHED,  function(data){
            	//RingLogger.debug('TAG CHAT POPUP MEMBER FETCHED', data, 'CHAT');
                $scope.$rgDigest();
            });

            function reInitFriends() {
                $timeout(function() {
			        $scope.friends = friendsFactory.friends.copy();
					Utils.safeDigest($scope);
				}, 2000);

            }


            // search for friend
            $scope.$watch('friendName', function(newVal, oldVal) {
                console.log('search contact: ' + newVal);
                if(newVal != '') {
                    friendsFactory.searchContact({schPm: newVal}, true);
                    reInitFriends();
                }
            });

			$scope.$watch(function(){
				return ($scope.friends.length() - $scope.adminList.length() - $scope.memberList.length());
			}, function(newVal, oldVal){
				if(newVal < 10){
					loadMoreFriends();
				}
			});



			function isCurrentUserOwner(tagObj){

				return !!tagObj && tagObj.getOwnerUserId() === Auth.currentUser().getKey();
			}

			function canAddMember(tagMemberObject){

				return true;
			}

			function canRemoveMember(tagMemberObject){

				if( tagMemberObject.getId() === currentUserUId ){
					return false;
				}

				if( !!$scope.tag && !isCurrentUserOwner($scope.tag)){

					var isAddedByCurrentUser = tagMemberObject.getAddedBy() !== Auth.currentUser().getKey();

					if( $scope.tag.isCurrentUserStatusAdmin(currentUserUId) ){
						if(tagMemberObject.isAdmin() && isAddedByCurrentUser ){

						}else if(!tagMemberObject.isMember()){
							return false;
						}

					}

					if( $scope.tag.isCurrentUserStatusMember(currentUserUId) && isAddedByCurrentUser ){
						return false;
					}
				}

				return true;

			}

			function canUpdateTagInfo(){

				if( !!$scope.editMode && $scope.tag.isCurrentUserStatusMember(currentUserUId) ){
					return false;
				}

				return true;
			}



            $scope.$watch('friendName', function(newVal) {
                if (newVal && newVal.length >1) {
                    toggleLoading(true);
                    friendsFactory.searchContact({schPm: newVal}, true).then(function() {
                        $scope.friends = friendsFactory.getFriends('friends');
                        toggleLoading(false);
                    }, function() {
                        toggleLoading(false);
                    });
                }
            });

            function loadMoreFriends() {
                // no request in progress
                if (!$scope.state.loading && $scope.friends.length() !== friendsFactory.totalFriends('friends')) {
                    toggleLoading(true);
                    friendsFactory.getContactDetails().then(function() {
                        $scope.friends = friendsFactory.getFriends('friends');
                        toggleLoading(false);
                    }, function() {
                        toggleLoading(false);
                    });

                    // in case the promise never resolves or rejects
                    setTimeout(function() {
                        $scope.state.loading = false;
                    }, 3000);
                }
            }

			function createChatTag() {
				if(!validateTag()) {
					Utils.safeDigest($scope);
					return
				}


				var tagName = $scope.models.tagName;

				var memberUIds = $scope.memberList.keys();
				var adminUIds = $scope.adminList.keys();

				var tagId = $scope.models.tagId;
				var pictureFileName = $scope.models.pictureFileName;

				tagChatManager.createTag({ tagName :tagName, memberUIds : memberUIds, adminUIds : adminUIds, tagId : tagId, tagPictureUrl: pictureFileName })
					.then(function(data){

						//if( !!data.sucs){
							////Ringalert.show('Group Created.', 'success');
						//}

					}, function(response){

						Ringalert.show(TAG_CHAT_LANG.DEFAULT_FAILURE_MESSAGE, 'error');


					}, function(response){


					});



				$boxInstance.close();

			}

			function removeTagObjectLock(tagId){
				var oldTagObj = tagChatFactory.getTag($scope.tag.getTagId());
				oldTagObj.removeObjectLock();
			}


			function updateChatTag() {
				if(!validateTag()) {
					Utils.safeDigest($scope);
					return;
				}

				var oldTagObj = tagChatFactory.getTag($scope.tag.getTagId());
				var newTagName = $scope.models.tagName;
				var pictureFileName = $scope.models.pictureFileName;

				var memberUIdsToSet = $scope.memberList.keys();
				var adminUIdsToSet = $scope.adminList.keys();

				$scope.tag.setObjectLock();


				tagChatManager.updateTag(oldTagObj,
					newTagName,
					pictureFileName,
					memberUIdsToSet,
					adminUIdsToSet
				).then(function(response){
						removeTagObjectLock($scope.tag.getTagId());

//						if(!!response.sucs){
//							Ringalert.show(response, 'success');
//						}
//
				}, function(response){
						removeTagObjectLock($scope.tag.getTagId());

						Ringalert.show(TAG_CHAT_LANG.DEFAULT_FAILURE_MESSAGE, 'error');


				}, function(response){
						if(!!response.sucs){
							removeTagObjectLock($scope.tag.getTagId());
							//Ringalert.show(response, 'success');
						}

				});


				$scope.editMode = false;
				Utils.triggerCustomEvent(SystemEvents.CHAT.MY_TAG_LIST_RECEIVED);

				$boxInstance.close();


			}

            function toggleLoading(bool) {
                $timeout(function() {
                    $scope.state.loading = bool;
                    if (!bool) {
                        rgScrollbarService.recalculate($scope);
                    }
                });
                //$scope.$digest();
            }

			function addToTag( member, type) {
                if ( ($scope.memberList.length() + $scope.adminList.length()) > $scope.friends.length() - 10) {
                    loadMoreFriends();
                }

				var tagId = !$scope.tag ? $scope.models.tagId : $scope.tag.getTagId();

				var aTagMemberObject = tagChatFactory.createNewTagMember(
					tagId,
					{ status : type == 'member' ? GENERAL_CONSTANTS.MEMBER_STATUS.MEMBER : GENERAL_CONSTANTS.MEMBER_STATUS.ADMIN, addedBy : currentUserUId },
					false
				);

				if( !canAddMember(aTagMemberObject) ){
					Ringalert.show('Permission Denied', 'error');
					return;
				}


				if( !!$scope.tag ){
					aTagMemberObject.setTagId( $scope.tag.getTagId() );
				}

				aTagMemberObject.initWithUserMapObject( member );

				if( type === 'admin'){
					$scope.adminList.add( aTagMemberObject.getId(), aTagMemberObject);
				}else{
					$scope.memberList.add( aTagMemberObject.getId(), aTagMemberObject);
				}
				Utils.safeDigest($scope);


			}

			function removeMember(tagMemberObj) {

				if(  canRemoveMember(tagMemberObj) ){

					if( tagMemberObj.isAdmin() ){
						$scope.adminList.remove(tagMemberObj.getId());
					}else{
						$scope.memberList.remove(tagMemberObj.getId());
					}
					Utils.safeDigest($scope);


				}else{
					Ringalert.show('Permission Denied', 'error');
				}
			}


			function isMemberSelected(tagMember){
				return ($scope.newOwnerTagMember && tagMember.getId() === $scope.newOwnerTagMember.getId());
			}

			function setNewOwner(tagMember){
				$scope.newOwnerTagMember = tagMember;

				Utils.safeDigest($scope);

			}

			function selectNewOwner(){

				var tagMember = $scope.newOwnerTagMember;
				var tag = $scope.tag;

				$scope.newOwnerTagMember = false;


				var oldTagMemberStatus = tagMember.getStatus();

				tagMember.makeOwner();

				var currentOwner = tag.getMember(Auth.currentUser().getKey());
				currentOwner.makeMember();

				var revertChanges = function(){
					tagMember.setStatus(oldTagMemberStatus);
					currentOwner.makeOwner();
					tag.removeObjectLock();
				};

				var tagMembersStatusToChange = [tagMember.serialize(), currentOwner.serialize()];

				var membersAdminToUpdateOnSuccess = [tagMember, currentOwner];

				tag.setObjectLock();

				tagChatManager.changeTagMemberStatus(tag.getTagId(), tagMembersStatusToChange, membersAdminToUpdateOnSuccess).then(function(){

					tagChatManager.leaveFromTag( tag.getTagId()).then(function(memberLeaveResponse){

						tag.removeObjectLock();
						//Ringalert.show(memberLeaveResponse, 'info');


					}, function(){
						Ringalert.show(TAG_CHAT_LANG.DEFAULT_FAILURE_MESSAGE, 'error');
						revertChanges();
					});


				}, function(){
					Ringalert.show(TAG_CHAT_LANG.DEFAULT_FAILURE_MESSAGE, 'error');
					revertChanges();
				});

				Utils.safeDigest($scope);
				$boxInstance.close();

			}



			function cancel() {
				$scope.newOwnerTagMember = false;
				$boxInstance.close();

				Utils.safeDigest($scope);

			}


			function validateTag() {
                if ($scope.models.tagName.length > 100 ) {
                    $scope.models.errTagName = 'Maximum 100 alpha numeric characters';
                } else {
                    $scope.models.errTagName = '';
                }
				$scope.models.errMemberList = ( ( $scope.memberList.length() + $scope.adminList.length() ) < 2 ) ? true : false;

				if ( !!$scope.models.errMemberList  || !!$scope.models.errTagName) {
					return false;
				} else {
					return true;
				}


			}

			$scope.$on('$destroy', function(){

                Utils.removeCustomEvent(SystemEvents.CHAT.TAG_MEMBER_FETCHED, memberFetchedEventRef);

                $scope.tag.unregisterMemberObjectsListener();

            });

		}

