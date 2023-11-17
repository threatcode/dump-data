/*
 * © Ipvision
 */

	angular
		.module('ringid.circle')
		.controller('CirclePopupController', CirclePopupController);

		CirclePopupController.$inject = ['$scope','$rootScope','circlesManager', '$boxInstance', 'friendsFactory', '$$stackedMap', 'localData', 'Ringalert', 'Auth', 'rgScrollbarService','$location','SystemEvents'];
		function CirclePopupController($scope,$rootScope,circlesManager, $boxInstance, friendsFactory, $$stackedMap, localData, Ringalert, Auth, rgScrollbarService,$location,SystemEvents) { // jshint ignore:line
			//load friends
			// $scope.friendlist = friendsFactory.getFriends('friends');
			$scope.circleAddMode = false;

			$scope.selectedMembers = [];

            $scope.state = {
                loading: false,
                noData: false
            };


			$scope.circleNameSection = true;
			$scope.circleMemberSection = false;
			$scope.circleAdminSection = false;
			$scope.friendDropdown = false;

			$scope.$watch('friendsNameFilter',function(newval,oldval){
				if(newval){
					$scope.friendDropdown = true;
				}else{
					$scope.friendDropdown = false;
				}
			});


			$scope.closeFriendDd = function(){
				$scope.friendDropdown = false;
				$scope.$rgDigest();
			};

			$scope.friendlistNameFilter = '';
			$scope.memberfilter = '';

			$scope.nextPart = function (param) {
				switch (param) {
					case 'setname':
						$scope.circleNameSection = true;
						$scope.circleMemberSection = false;
						$scope.circleAdminSection = false;
						$scope.$rgDigest();
						break;
					case 'setmembers':
						$scope.circleNameSection = false;
						$scope.circleMemberSection = true;
						$scope.circleAdminSection = false;
						$scope.$rgDigest();
						break;
					case 'setadmins':
						$scope.circleNameSection = false;
						$scope.circleMemberSection = false;
						$scope.circleAdminSection = true;
						$scope.$rgDigest();
						break;
				}
			};

			$scope.$on('$destroy', function() {
				$scope.friendlist.reset();
				$scope.selectedMembers = [];
			});

			//$scope.friendlist = friendsFactory.getFriends('friends');
			$scope.friendlist = friendsFactory.getFriends('friends');


			$scope.models = {
				errCircleName: false,
				errMemberList: false,
				errAdminList: false
			};

			if( !localData.circleId ) {
				$scope.circleAddMode = true;
			}

			$scope.editMode = false;

			if (localData && localData.circleId) {

				//get circle data
				$scope.circle = circlesManager.getCircle(localData.circleId);

				$scope.memberList = $scope.circle.getMembers();
				$scope.adminList = $scope.circle.getAdmins();

				$scope.isCurrentUserSuperAdmin = $scope.circle.isSuperAdmin(Auth.currentUser().getKey());

				$scope.models.popupTitle = 'Edit Group';
				$scope.models.circleName = $scope.circle.getName();

				$scope.editMode = true;

			}else{

				$scope.models.popupTitle = 'Create New Circle';
				$scope.models.circleName = '';

				// create new stack
				$scope.memberList = $$stackedMap.createNew();
				$scope.adminList = $$stackedMap.createNew();

			}


			$scope.addToCircle = addToCircle;
			$scope.addToAdmin = addToAdmin;
			$scope.removeMember= removeMember;
			$scope.removeAdmin = removeAdmin;
			$scope.createCircle = createCircle;
			$scope.updateCircle = updateCircle;

			$scope.close = $boxInstance.close;
			$scope.validateCircle = validateCircle;
			$scope.loadMoreFriends = loadMoreFriends;


			function createCircle() {
//				if (!validateCircle()) {
//                    return;
//                }

				var frndIds = $scope.memberList.keys();
				var adminIds = $scope.adminList.keys();

				//$scope.memberList.all()[1].value.user.uId

				var frnds = [];
				for(var i=0; i<$scope.memberList.length();i++){
					frnds[i] = {admin:'false',uId:$scope.memberList.all()[i].value.user.uId};
				}

				var admins = [];
				for(var j=0; j<$scope.adminList.length();j++){
					admins[j] = {admin:'true',uId:$scope.adminList.all()[j].value.user.uId};
				}
				var allUser = admins.concat(frnds);

                var circleObj = {
					tg: $scope.models.circleName,
					alluser:allUser,
					uId:Auth.currentUser().getUId()
                };
				//console.log(circleObj);
               	circlesManager.createCircle(circleObj).then(function (data) {
					if(data.sucs===true){
						$boxInstance.closeAll();
						$location.path('/circle/'+data.grpId);
					}
				});

			}

			function updateCircle() {
				if (!validateCircle()) {
                    return;
                }

				var newMemberIds = $scope.memberList.keys();
				var newAdminIds = $scope.adminList.keys();

				var previousMemberIds = $scope.circle.getMemberIds();
				var previousAdminIds = $scope.circle.getAdminIds();

				var newMembersToAdd = newMemberIds.difference(previousMemberIds);
				var previousMembersToRemove  = previousMemberIds.difference(newMemberIds);

				var newAdminsToAdd = newAdminIds.difference(previousAdminIds);
				var previousAdminsToRemove = previousAdminIds.difference(newAdminIds);

				/* Add New Admin and Member */

				var newMemberAndAdminToAdd = [];
				angular.forEach(newMembersToAdd, function(aNewMemberUId){
					newMemberAndAdminToAdd.push({ admin: false, uId : aNewMemberUId });
				});

				angular.forEach(newAdminsToAdd, function(aNewAdminUId){
					newMemberAndAdminToAdd.push({ admin: true, uId : aNewAdminUId });
				});


				if(newMemberAndAdminToAdd.length > 0){
					circlesManager.addMembers(newMemberAndAdminToAdd, $scope.circle);
				}

				/* Remove Old Admin and Member */

				var memberKeysToRemove = previousMembersToRemove;
				memberKeysToRemove = memberKeysToRemove.concat(previousAdminsToRemove);


				if(memberKeysToRemove.length > 0){
					circlesManager.removeMembers(memberKeysToRemove, $scope.circle);
				}

				Ringalert.show('Circle Updated', 'success');

				$scope.close();
			}

            function needMoreFriends() {
                if ( ($scope.memberList.length() + $scope.adminList.length()) > $scope.friendlist.length() - 10) {
                    loadMoreFriends();
                }
            }

			function addToCircle(member) {
                //needMoreFriends();
                // var isAdded = $scope.memberList.get(member.getUtId());
                // if(!isAdded){
                	$scope.memberList.add(member.getKey(), member);
					//$scope.selectedMembers.push(member);
					//$scope.friendlist.remove(member.getUtId());
					$scope.friendDropdown = false;
					$scope.friendsNameFilter = '';
					$scope.$rgDigest();
                // }else{
                // 	Ringalert.show('Already Added', 'info');
                // }

			}

			function removeMember( member) {
				$scope.memberList.remove(member.getKey());
				$scope.$rgDigest();
			}

			function addToAdmin( admin ) {
                //needMoreFriends();
				$scope.adminList.add(admin.getKey(), admin);
				$scope.memberList.remove(admin.getKey());
				$scope.$rgDigest();
			}

			function removeAdmin( admin) {
				$scope.adminList.remove(admin.getKey());
				$scope.memberList.add(admin.getKey(), admin);
				$scope.$rgDigest();
			}

			function toggleLoading(bool) {
                $scope.state.loading = bool;
                if (!bool) {
                    rgScrollbarService.recalculate($scope);
                }
                if (!$scope.$$phase && !$scope.$root.$$phase) {
                    $scope.$digest();
                }
            }

            $scope.$watch('friendName', function(newVal) {
                if (newVal && newVal.length >1) {
                    toggleLoading(true);
                    friendsFactory.searchContact({schPm: newVal}, true).then(function() {
                        //$scope.friends = friendsFactory.getFriends('friends');
                        $scope.friendlist = friendsFactory.getFriends('friends');
                        toggleLoading(false);
						$scope.$rgDigest();
                    }, function() {
                        toggleLoading(false);
						$scope.$rgDigest();
                    });
                }else{
                	$scope.friendlist = friendsFactory.getFriends('friends').copy();
                	$scope.$rgDigest();
                }
            });

            function loadMoreFriends() {
                // no request in progress
                if (!$scope.state.loading && $scope.friendlist.length() !== friendsFactory.totalFriends('friends')) {
                    toggleLoading(true);
                    friendsFactory.getContactDetails().then(function() {
						// $scope.friendlist    = friendsFactory.getFriends('friends');
						$scope.friendlist = friendsFactory.getFriends('friends');
                        
                        toggleLoading(false);
                    }, function() {
                        toggleLoading(false);
                    });

                    // in case the promise never resolves or rejects
                    setTimeout(function() {
                        $scope.state.loading = false;
                    }, 3000);
					$scope.$rgDigest();
                }
            }

			function validateCircle() {
                if ($scope.models.circleName.length > 60) {
                    $scope.models.errCircleName = 'Maximum 60 characters';
                } else if ($scope.models.circleName.length === 0) {
                    $scope.models.errCircleName = 'Name required';
                } else {
                    $scope.models.errCircleName = '';
                }
                $scope.models.errMemberList = ($scope.memberList.length() < 1) ? true : false;

				// no need to check adminLIst. Creator of Circle is Admin automatically
                //$scope.models.errAdminList = ($scope.adminList.length() < 1) ? true : false;

				if($scope.models.errCircleName.length === 0 && !$scope.models.errMemberList) {
					return true;
				} else {
					return false;
				}
                return valid;
			}
		}

