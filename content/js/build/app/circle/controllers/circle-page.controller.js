/*
 * © Ipvision
 */

	angular
		.module('ringid.circle')
		.controller('CirclePageController', CirclePageController);

		CirclePageController.$inject = ['$scope', '$routeParams', '$location', 'circlesManager', 'friendsFactory', 'Auth', '$ringbox',
			'SystemEvents',  '$$connector','OPERATION_TYPES','circleHttpService', '$timeout', 'APP_CONSTANTS', 'Ringalert', 'rgDropdownService', '$rootScope','Utils'];
		function CirclePageController($scope, $routeParams, $location, circlesManager, friendsFactory, Auth,  $ringbox, // jshint ignore:line
                                      SystemEvents, $$connector,OPERATION_TYPES,circleHttpService, $timeout, APP_CONSTANTS, Ringalert, rgDropdownService, $rootScope,Utils) {
			var vm = this;

			var circleId = $routeParams.circleId;
			var subpage = $routeParams.subpage;
			$scope.loadMoreCircleMember = false;
			$scope.showSearchLoader = false;
			$scope.hideLoadButton = false;
			$scope.currentUserUId = Auth.currentUser().getUId();
			circlesManager.getCirclePromise(circleId).then(function(circle){
				if(circle){
					vm.circle = circle;
					Utils.setPageTitle(circle.getName(),true);//Changing page title
					$scope.isCurrentUserAdmin = vm.circle.isAdmin();
					$scope.isCurrentUserSuperAdmin = vm.circle.isSuperAdmin($scope.currentUserUId);
					//requestForCircleMembers();
					if(subpage==='members'){
                        $scope.showBackKey = 0;
                        $scope.showBack = function(key, event) {
                            var isAnchor = event.target.getAttribute('data-is-anchor');
                            if (!isAnchor) {
                                $scope.showBackKey = key;
                                event.preventDefault();
                                event.stopPropagation();
                                $scope.$rgDigest();
                            }
                        };
						requestForCircleMembers();
					}
					pageInit();
				}else{
					circlesManager.redirectHome();
				}

			},function (reason){
				   circlesManager.redirectHome();
			});


            $scope.showComingSoon = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                Ringalert.show('Coming soon', 'info');
            };

			/* Fixed Data to Init */
			vm.ddHtml = 'templates/dropdowns/circle-edit-dropdown.html';//$templateCache.get('circle-edit-dropdown.html');
			vm.ddAction = openConfirmation;
			vm.ddControl = {
				isAdmin : $scope.isCurrentUserAdmin,
				isSuperAdmin : $scope.isCurrentUserSuperAdmin,
				getCircleData : function(){
                    rgDropdownService.close();
					return { circleId : circleId };
				}
			};


			vm.ddMemberHtml = 'templates/dropdowns/circle-member-dropdown.html';//$templateCache.get('circle-member-dropdown.html');
			vm.ddMemberAction = circleMemberAction;

			vm.removeMember = removeMember;

			if (angular.isUndefined($routeParams.subpage)) {
				vm.subPage = 'post';
			} else {
				vm.subPage = $routeParams.subpage;
			}

			vm.subPageLink = 'templates/home/circle.' + vm.subPage + '.html';

			/* Dynamic Data */

          //  vm.circle = circlesManager.getCircle(circleId);

			vm.isCurrentUserAdmin = false;
			vm.isCurrentUserSuperAdmin = false;

			vm.getFriendType = function(memberObj){
				return memberObj.friendshipStatus();
			};

			if(!!vm.circle){
				$scope.isPageReady = false;
				if(!$scope.circleMembers.length){
					requestForCircleMembers();
				}

			}else{
				$scope.isPageReady = false;

			}

			vm.shouldShowMemberEditMenu = function(memberObj){

				//console.log( vm.isCurrentUserAdmin ,  vm.isCurrentUserSuperAdmin, !vm.circle.isSuperAdmin(memberObj.getKey()) )

				return  !memberObj.isCurrentUser() &&
					    (( vm.isCurrentUserSuperAdmin ||  (vm.isCurrentUserAdmin && !memberObj.isAdmin(circleId))) ) &&
					    ( !vm.circle.isSuperAdmin(memberObj.getKey()) );

			};

			//vm.getMemberEditMenuControl = function (memberObj) {
			//	return {
			//		isAdmin: memberObj.isAdmin(vm.circle.getKey()),
			//		isSuperAdmin: vm.isCurrentUserSuperAdmin,
			//		member: memberObj,
			//		friendShipType: vm.getFriendshipType(memberObj)
			//	}
			//};

			vm.memberListSubscriptionKey = $$connector.subscribe(circlesManager.processCircleMembersData,
				{action:OPERATION_TYPES.SYSTEM.CIRCLE.TYPE_GROUP_MEMBERS_LIST}
			);
			vm.searchListSubscriptionKey = $$connector.subscribe(circlesManager.processCircleSearchMembersData,
				{action:OPERATION_TYPES.SYSTEM.CIRCLE.TYPE_GROUP_MEMBERS_SEARCH_RESULT}
			);

			$scope.$on(SystemEvents.CIRCLE.MY_CIRCLE_MEMBER_LIST_PROCESS_COMPLETE, function(event,data){
				// $scope.$rgDigest();
				
				$scope.loadMoreCircleMember = false;
				$scope.showSearchLoader = false;
				if(!data.success){
					$scope.hideLoadButton = true;
				}else{
					$scope.hideLoadButton = false;
				}
				// $scope.$rgDigest();
				pageInit();
                $scope.$rgDigest();
			});

			$scope.$on(SystemEvents.CIRCLE.MY_CIRCLE_UPDATE_MEMBER_COUNT, function (event,data) {
				$scope.$rgDigest();
			});

   //     $scope.$on(SystemEvents.CIRCLE.MY_CIRCLE_LIST_PROCESS_COMPLETE, function(){
			// 			if(!vm.circle){
			// 				vm.circle = circlesManager.getCircle(circleId);
			// 				if(vm.circle){
			// 					requestForCircleMembers();
			// 				}

			// 			}

   //       });

      		$scope.$on(SystemEvents.CIRCLE.MY_CIRCLE_MEMBER_LIST_UPDATE_COMPLETE, function(){
				setMembers();
		  		$scope.$rgDigest();
			});


			$scope.$on(SystemEvents.CIRCLE.MY_CIRCLE_REMOVED, function($event, data){
				if(data.circleId === $routeParams.circleId){

					Ringalert.show('Circle has been Removed OR You have been removed from the circle.', 'error');

					$timeout(function(){
						$location.path('/');
					});
				}
			});


			$scope.cMemberSearch = function () {
				if( vm.searchParam ) {
					$scope.showSearchLoader = true;
					//$scope.hideLoadButton = true;
					circlesManager.getMemberResult(vm.searchParam,circleId);
				}else{
					$scope.hideLoadButton = false;
				}
				$scope.$rgDigest();
			};


			$scope.loadMoreMembers = function () {
				if( vm.searchParam ){
					$scope.showSearchLoader = true;
					circlesManager.getMemberResult(vm.searchParam,circleId);
					//console.log('load more search');
				}else{
					var lim = 20;
					$scope.loadMoreCircleMember = true;
					circlesManager.getCircleMembers(circleId,null,lim);
					//console.log('load more member');
				}
				$scope.$rgDigest();

			};

			$scope.getCircleId = function() {
				return{
					data: function() {
						return {
							target: circleId,
							circleObj: vm.circle
						};
					}
				};
			};


			$scope.$on('$destroy', function() {
				if (vm.circle) {
					vm.circle.resetMembers(); //.reset();
				}
				$$connector.unsubscribe(vm.memberListSubscriptionKey);
				$$connector.unsubscribe(vm.searchListSubscriptionKey);
			});



			function pageInit(){
				if( vm.circle ){
					$scope.isPageReady = true;
					setMembers();
					//if($scope.circleMembers.length > 0){
						//setPageSettings();
					//}
					setPageSettings();
				}
				$scope.$rgDigest();
			}

			function setPageSettings(){

				vm.isCurrentUserAdmin = $scope.currentUser.isAdmin(vm.circle.getKey());

				vm.isCurrentUserSuperAdmin = vm.circle.isSuperAdmin(Auth.currentUser().getKey());

				/** For Circle Edit DropDown **/
				vm.ddControl.isAdmin = vm.isCurrentUserAdmin;
				vm.ddControl.isSuperAdmin = vm.isCurrentUserSuperAdmin;

			}

			function setMembers(){
				$scope.circleMembers = vm.circle.getAllMembers();
                $scope.$rgDigest();
			}

			function requestForCircleMembers(){
				circlesManager.getCircleMembers(circleId,0);
			}


			function removeMember(memberKey) {
				circlesManager.removeMember(memberKey, vm.circle);
			}

			function circleMemberAction(actionObj) {
				
                rgDropdownService.close(actionObj.event);
				switch(actionObj.action) {
					case 'remove':
						circlesManager.removeMember(actionObj.member.getKey(), vm.circle);
						break;

					case 'changemember':

						circlesManager.toggleMembership(
                            {
                                grpId: vm.circle.getKey(), uId: actionObj.member.getKey(), admin: Boolean(actionObj.admin)
                            },
                            vm.circle
                        );

						break;

					case 'addfriend' :
                    case 'accept':
                    case 'reject':
                        if (!actionObj.friend.isLoading()) {
                            friendsFactory.friendAction(actionObj, true).then(function() {
                                $scope.$rgDigest();
                            }, function() {
                                $scope.$rgDigest();
                            });
                        }
						break;
					default:
				}
                $scope.$rgDigest();

			}


            function openConfirmation(actionObj) {
                var message = 'Are you sure you want to ' + actionObj.action + ' ' + vm.circle.getName() +'?';

                rgDropdownService.close(actionObj.event);
                var boxInstance = $ringbox.open({
                        type : 'remote',
                        scope:false,
                        controller: 'RingBoxConfirmController',
                        resolve : {
                            localData : {
                                message : message
                            }
                        },
                        templateUrl : 'templates/partials/ringbox-confirm.html'
                });

                boxInstance.result.then(function(confirmed){
                    if(confirmed){
                        circleAction(actionObj);
                    }
                });
            }

			function circleAction (actionObj) {
				switch(actionObj.action) {
					case 'delete':
						circlesManager.deleteCircle(vm.circle).then(function(response) {
							if (response.sucs === true) {
								$location.path('/');
                                // $scope.$parent.$rgDigest();
                            } else {
                                $scope.$rgDigest();
                            }
						}, function(errData) {
                            $scope.$rgDigest();
						});
						break;
					case 'leave':
						circlesManager.leaveGroup(vm.circle).then(function(response) {
							if (response.sucs === true) {
								$location.path('/');
								$rootScope.$rgDigest();
							}
                            $scope.$rgDigest();
						},function(errData) {
                            $scope.$rgDigest();
						});
						break;
					default:
				}

			}



		}

