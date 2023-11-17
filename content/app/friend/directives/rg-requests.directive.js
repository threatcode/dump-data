/**
 * © Ipvision
 */

    angular
        .module('ringid.friend')
        .directive('rgRequests', rgRequests);

    rgRequests.$inject = ['friendsFactory', '$compile',  '$routeParams', '$window', '$document', '$ringhttp'];
    function rgRequests(friendsFactory,  $compile,  $routeParams, $window, $document, $ringhttp) { // jshint ignore:line

        RequestsController.$inject = ['$scope', 'Api', 'rgScrollbarService', 'Contacts', 'OPERATION_TYPES', '$$connector', 'userFactory', 'Ringalert', 'SystemEvents'];
        function RequestsController($scope, Api, rgScrollbarService, Contacts, OPERATION_TYPES, $$connector, userFactory, Ringalert, SystemEvents) { //jshint ignore:line
            var OTYPES = OPERATION_TYPES.SYSTEM.FRIENDS,
                loadCount = parseInt($scope.loadCount),
                subscriptionKey;
                //intervalCount = 0,
                //intervalTrack;

            $scope.state = {
                loading: false,
                noMoreData: false,
            };

            $scope.requests = friendsFactory.getFriends('incoming');
            $scope.getRequestCount = friendsFactory.getRequestCount;

            $scope.friendAction = friendAction;
            $scope.loadMoreRequests = loadMoreRequests;
            $scope.getMutualFriend = getMutualFriend;




            function friendAction(actionObj) {
                if (!actionObj.friend.isLoading()) {
                    friendsFactory.friendAction(actionObj, true).then(function() {
                        //$scope.requests = friendsFactory.getFriends('incoming');
                        if ($scope.requests.length() < loadCount) {
                            loadMoreRequests();
                        }
                        $scope.$rgDigest();
                    }, function() {
                        //$scope.requests = friendsFactory.getFriends('incoming');
                        if ($scope.requests.length() < loadCount) {
                            loadMoreRequests();
                        }
                        $scope.$rgDigest();
                    });
                }
            }

            function toggleLoading(bool) {
                $scope.state.loading = bool;
                if (!bool) {
                    $scope.state.noMoreData = (Contacts.incomingUtIds().length() === 0);
                    rgScrollbarService.recalculate($scope);
                    $scope.$emit(SystemEvents.FEED.HEIGHT);
                }
                $scope.$rgDigest();
            }


            function loadMoreRequests(force) { // jshint ignore:line
                // no request in progress
                if (force || (!$scope.state.noMoreData && !$scope.state.loading)) {
                    toggleLoading(true);
                    friendsFactory.getContactDetails('incoming', loadCount).then(function() {
                        //$scope.requests = friendsFactory.getFriends('incoming');
                        toggleLoading(false);
                    }, function(json) {
                        if (json.sucs === false && json.rc === 1111) {
                            loadMoreRequests(true);
                        } else {
                            toggleLoading(false);
                            RingLogger.warning('No Friend Request:', RingLogger.tags.FRIEND);
                        }
                    });

                }
            }

            function getMutualFriend(user) { //jshint ignore:line
                return{
                    data: function() {
                        return {
                            target: user
                        };
                    },
                    promise: Api.user.getMutualFriends(user)

                };
            }


            function activate() {

                if (loadCount > 20) {
                    // a loose condition to check if its see all or just the dropdown
                    $scope.$emit(SystemEvents.FEED.HEIGHT);
                }
                if (Contacts.incomingUtIds().length() > 0 && $scope.requests.length() < loadCount) {
                    loadMoreRequests(true);
                }

                // initialization everytime dropdown opens
                subscriptionKey = $$connector.subscribe(function(json) {
                    switch(json.actn) {
                        case OTYPES.TYPE_CONTACT_UTIDS:
                            if (Contacts.incomingUtIds().length() > 0 && $scope.requests.length() < loadCount) {
                                loadMoreRequests(true);
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
                    ]
                });
            }

            activate();


            $scope.$on('$destroy', function() {
                 $$connector.unsubscribe(subscriptionKey);
            });


        }


        function linkFunc(scope, element, attr) {
            var templateUrl =  attr.templateUrl ? attr.templateUrl : 'templates/dropdowns/friend-request-dropdown.html';

            $ringhttp.get(templateUrl).success(function(template) {
                element.append($compile(template)(scope));
                scope.$rgDigest();
            });

        }

        return {
            restrict: 'AE',
            //templateUrl: 'templates/dropdowns/friend-request-dropdown.html', // IMPORTANT this template is preloaded from auth factory
            //template:
                    //'<li  rg-dropdown="dropdown()" dd-html="header.freq.ddHtml"' +
                         //' dd-control="header.freq.ddControl" dd-action="header.freq.ddAction"' +
                         //' dd-opened="header.freq.ddOpened()" dd-before-close="header.freq.ddBeforeClose()"' +
                         //' ng-class="{ active : header.getActiveMenu() == \'friend_request\' }" >' +
                        //' <a  class="showpointer" title="Friend Request">' +
                            //' <div class="tm-ico  icon-contact-b">' +
                                //' <div ng-bind="header.freq.ddControl.friendsFactory.getFriends(\'incoming\').length()" ng-show="header.freq.ddControl.friendsFactory.getFriends(\'incoming\').length() > 0"' +
                                     //' class="ng-cloak counter-not"></div>' +
                            //' </div>' +
                        //' </a>'+
                    //' </li>',
            scope: {
                loadOnScroll: '@',
                loadCount: '@',
                templateUrl: '@'
            },
            link: linkFunc,
            controller: RequestsController
            //transclude: true
        };

    }
