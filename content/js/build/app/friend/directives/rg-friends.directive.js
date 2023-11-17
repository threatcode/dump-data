

    angular
        .module('ringid.friend')
        .directive('rgFriends', rgFriends);

    rgFriends.$inject = ['friendsFactory', '$ringhttp', '$compile',  '$routeParams', '$window', '$document', 'Contacts', 'APP_CONSTANTS'];
    function rgFriends(friendsFactory, $ringhttp, $compile,  $routeParams, $window, $document, Contacts, APP_CONSTANTS) { // jshint ignore:line


        FriendsController.$inject = ['$scope', '$attrs', '$document', 'rgScrollbarService', 'Contacts', 'userFactory', '$$stackedMap', 'rgDropdownService', '$$connector', 'OPERATION_TYPES', 'Ringalert', 'Api'];
        function FriendsController($scope, $attrs, $document, rgScrollbarService, Contacts, User, $$stackedMap, rgDropdownService, $$connector, OPERATION_TYPES, Ringalert, Api) { //jshint ignore:line
            var OTYPES = OPERATION_TYPES.SYSTEM.FRIENDS,
                noFriendsFoundTimeout,
                friendsFetchRetry = 0,
                firstContactsRequest = true,
                subscriptionKey,
                mutualFriends = [];

            $scope.isOwner = false;
            $scope.showMutual = false;
            $scope.showPending = false;
            $scope.friendName = '';

            $scope.state = {
                loading: false,
                noData: false
            };

            $scope.friends = friendsFactory.getFriends($scope.rgFriendsType);
            $scope.totalFriends = friendsFactory.totalFriends;
            $scope.getPendingCount  = friendsFactory.getPendingCount;
            $scope.toggleShowMutual = toggleShowMutual;
            $scope.toggleShowPending = toggleShowPending;
            $scope.loadMoreFriends = loadMoreFriends;
            $scope.getMutualFriend = getMutualFriend;
            $scope.searchContact = searchContact;

            $scope.showComingSoon = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                Ringalert.show('Coming soon', 'info');
            };


            function toggleShowMutual (bool) {
                $scope.showMutual = !!bool;
                if ($scope.showMutual) {
                    loadMutualFriends();
                }
                $scope.$rgDigest();
            }

            function toggleShowPending (bool) {
                $scope.showPending = !!bool;
                if ($scope.showPending) {
                    $scope.friends = friendsFactory.getFriends('outgoing');
                    toggleLoading(true);
                    friendsFactory.getContactDetails('outgoing').then(function() {
                        toggleLoading(false);
                    }, function() {
                        toggleLoading(false);
                    });
                } else {
                    $scope.friends = friendsFactory.getFriends($scope.rgFriendsType);
                }
                $scope.$rgDigest();
            }


            function loadMutualFriends() {
                var friend;
                if (mutualFriends.length > 0) {
                    toggleLoading(true);
                    friendsFactory.getContactDetailsByUtIds(mutualFriends.splice(0, 10), true).then(function(json) {
                        if (json.sucs === true) {
                            for(var i=0;i< json.contacts.length;i++){
                                friend = User.create(json.contacts[i]);
                                $scope.friends.save(friend.getKey(), friend);
                            }
                        }
                        toggleLoading(false);
                    }, function(json) {
                        if (json.sucs === false && json.rc === 1111) {
                            
                            loadMutualFriends();
                        } else {
                            toggleLoading(false);
                            
                        }
                    });
                }
            }



            function toggleLoading(bool) {
                $scope.state.loading = !!bool;
                if (!bool) {
                    rgScrollbarService.recalculate($scope);
                    //$scope.friends = friendsFactory.getFriends($scope.rgFriendsType);
                }
                if (!$scope.state.loading) {
                    $scope.state.noData = ($scope.friends.length() === 0 && Contacts.utIds().length() === 0);
                }
                $scope.$rgDigest();
            }


            function searchContact() {
                if (($scope.rgFriendsType === 'friends' ||  $scope.rgFriendsType === 'friendslist') && $scope.friendName && $scope.friendName.length > 0) {
                    toggleLoading(true);
                    friendsFactory.searchContact({schPm: $scope.friendName}, true).then(function() {
                        toggleLoading(false);
                    }, function() {
                        toggleLoading(false);
                    });
                }
            }

            function loadMoreFriends(force) {
                var whatToCall, param;
                // no request in progress
                if ($scope.showMutual) {
                    loadMutualFriends();
                } else if ($scope.showPending) {
                    toggleLoading(true);
                    friendsFactory.getContactDetails('outgoing').then(function() {
                        toggleLoading(false);
                    }, function() {
                        toggleLoading(false);
                    });
                } else if (force || (!$scope.state.loading && $scope.friends.length() !== $scope.totalFriends($scope.rgFriendsType)) )  {
                    toggleLoading(true);
                    if ($scope.rgFriendsType === 'userfriends') {
                        whatToCall = friendsFactory.getUserContacts;
                        param = $scope.profileObj.getUtId();
                    } else {
                        whatToCall = friendsFactory.getContactDetails;
                    }
                    whatToCall(param).then(function() {
                        //$scope.friends = friendsFactory.getFriends($scope.rgFriendsType);
                        if ($scope.friends.length() < 20 && $scope.friends.length() < $scope.totalFriends($scope.rgFriendsType)) {
                            
                            toggleLoading(false);
                            loadMoreFriends();
                        } else {
                            toggleLoading(false);
                        }
                    }, function(json) {
                        if (json.sucs === false && json.rc === 1111) {
                            loadMoreFriends(force);
                        } else if ($scope.rgFriendsType === 'friendslist') {
                            if (friendsFetchRetry < 5) {
                                friendsFetchRetry++;
                                setTimeout(function() {
                                    loadMoreFriends(force);
                                }, 2000);
                            } else {
                                toggleLoading(false);
                            }
                        } else {
                            toggleLoading(false);
                            

                        }
                    });

                    // in case the promise never resolves or rejects
                    //timeOut = setTimeout(toggleLoading, 5000);
                }
            }

            function getMutualFriend(user) {
                return{
                    data: function() {
                        return {
                            target: user
                        };
                    },
                    promise: Api.user.getMutualFriends(user)

                };
            }



            function setDropdown() {
                // settings dropdown data
                //$scope.ddHtml = 'templates/dropdowns/friend-settings-dropdown.html';
                $scope.ddTemplate =
                    '<div class="action friend-settings-dropdown float-right">' +
                        '<a  ng-if="ddControl.friendshipStatus()==1" rg-click="ddAction()({ action: \'unfriend\', friend: ddControl, event: $event})" href="#"> <span class="img_sprite w-h-13 icon-into-border f-Block"></span><span class="txt">{{consType.unfriend}}</span></a>' +
                        '<a  ng-if="ddControl.isBlocked()===0 && !ddControl.isCurrentUser() && ddControl.friendshipStatus()==1" rg-click="ddAction()({ action: \'block\', friend: ddControl, event:$event})" class="border-0" href="#"><span class="img_sprite w-h-13 icon-block"></span><span class="txt">{{consType.block}}</span></a>' +
                        '<a  ng-if="ddControl.isBlocked()===1 && !ddControl.isCurrentUser() && ddControl.friendshipStatus()==1" rg-click="ddAction()({ action: \'unblock\', friend: ddControl, event:$event})" class="border-0" href="#"><span class="img_sprite w-h-13 icon-right f-Block"></span><span class="txt">{{consType.unblock}}</span></a>' +
                    '</div>';
                $scope.ddAction = function(actionObj) {
                    if (!actionObj.friend.isLoading()) {
                        friendsFactory.friendAction(actionObj, true).then(function() {
                            $scope.$rgDigest();
                        }, function() {
                            $scope.$rgDigest();
                        });
                        rgDropdownService.close(actionObj.event);
                    }
                };


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
            }



            function activate() {
                subscriptionKey = $$connector.subscribe(function(json) {
                    switch(json.actn) {
                        case OTYPES.TYPE_CONTACT_UTIDS:
                            if ( ($scope.rgFriendsType === 'friends' || $scope.rgFriendsType === 'friendslist') && firstContactsRequest ) {
                                firstContactsRequest = false;
                                setTimeout(function() {
                                    if (Contacts.utIds().length() > 0 && $scope.friends.length() < 20  ) {
                                        loadMoreFriends(true);
                                    }
                                    $scope.state.noData = ($scope.friends.length() === 0 && Contacts.utIds().length() === 0);
                                }, 1000);
                            }
                            break;
                        default:
                            toggleLoading(false);

                    }
                }, {
                    action: [
                        OTYPES.TYPE_CONTACT_UTIDS,
                        OTYPES.TYPE_UPDATE_ADD_FRIEND,
                        OTYPES.TYPE_UPDATE_DELETE_FRIEND
                    ],
                    callWithUnresolved : true
                });

                switch($scope.rgFriendsType) {
                    case 'friendslist':
                        //toggleLoading(true);
                        break;
                    case 'friends':
                        friendsFactory.initFriends();
                        $scope.isOwner = true;
                        $scope.pendingRequests = friendsFactory.getFriends('outgoing');
                        setDropdown();
                        noFriendsFoundTimeout = setTimeout($scope.toggleLoading, 60000);
                        break;
                    case 'userfriends':
                        setDropdown();
                        $scope.totalUserFriends = friendsFactory.totalUserFriends;
                        $scope.profileObj = User.getUser($routeParams.uId); //.commonFriends();
                        loadMoreFriends(true);

                        // fetch mutual friend utid list
                        Api.user.getMutualFriends($scope.profileObj).then(function(json) {
                            if (json.sucs === true) {
                                $scope.profileObj.updateUserObj({nmf: json.mfIDs.length});
                                mutualFriends = json.mfIDs;
                                $scope.$rgDigest();
                            }
                        });

                        noFriendsFoundTimeout = setTimeout($scope.toggleLoading, 60000);
                        break;
                    default:
                        
                }


            }

            activate();

            $scope.$on('$destroy', function() {
                clearTimeout(noFriendsFoundTimeout);
                // empty friend list of other user when leaving friends page of other user
                if ($scope.rgFriendsType === 'userfriends') {
                    friendsFactory.resetUserFriends();
                }
                 $$connector.unsubscribe(subscriptionKey);
            });



        }

        function linkFunc(scope, element, attrs) {
            var utids;

            $ringhttp.get(attrs.rgFriendsTpl).success(function(template) {
               element.append( $compile(template)(scope) );
                scope.$rgDigest();
            });

            function loadMore() {
                if ( ($window.innerHeight + $window.scrollY) >= $document[0].body.offsetHeight ) {
                    scope.loadMoreFriends();
                }
            }

            if (scope.rgFriendsType === 'friends' || scope.rgFriendsType === 'userfriends') {
                angular.element($window).on('scroll', loadMore);
            }


            scope.$on('$destroy', function() {

                switch(scope.rgFriendsType) {
                    case 'friends':
                        // put outgoing utids back to utid list and reset outgoing friends
                        utids =  friendsFactory.outgoingFriends.keys();
                        for(var i = 0; i < utids.length; i++) {
                             Contacts.add('outgoingUtIds', utids[i], {frnS: APP_CONSTANTS.INCOMING_FRIEND});
                        }
                        friendsFactory.outgoingFriends.reset();
                    case 'userFriends':
                        angular.element($window).off('scroll', loadMore);
                }


            });

        }

        return {
            restrict: 'AE',
            scope: {
                rgFriendsType: '@'
            },
            controller: FriendsController,
            link: linkFunc
        };

    }
