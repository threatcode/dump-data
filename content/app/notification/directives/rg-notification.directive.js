/**
 * © Ipvision
 */


    angular
        .module('ringid.notification')
        .directive('rgNotification', rgNotification);

    rgNotification.$inject = [ '$window', '$document', '$ringhttp', '$compile'];
    function rgNotification( $window, $document, $ringhttp, $compile) { // jshint ignore:line

        NotificationController.$inject = ['NotificationFactory', '$location',  'AlbumFactory', 'Auth',  'rgDropdownService', 'Ringalert', 'Storage', '$scope', 'rgScrollbarService',
                                            'OPERATION_TYPES', '$$connector', 'notificationHttpService', 'SystemEvents', 'Api'];
        function NotificationController(NotificationFactory, $location,  AlbumFactory, Auth,  rgDropdownService, Ringalert, Storage, $scope, rgScrollbarService,
                                            OPERATION_TYPES, $$connector, notificationHttpService, SystemEvents, Api) { //jshint ignore:line

            var loadCount = parseInt($scope.loadCount),
                timeOut,
                OTYPES = OPERATION_TYPES.SYSTEM.NOTIFICATION;

            $scope.state = NotificationFactory.state;
            $scope.notifications = NotificationFactory.getNotifications();
            $scope.loadMoreNotification = loadMoreNotification;
            $scope.getRingboxData = getRingboxData;
            $scope.notificationAction = NotificationFactory.notificationAction;


            function getRingboxData (noti) {
                switch(noti.value.getPopupType()){
                  case 'image' :
                    return notificationAction( { action:'image',noti:noti.value, nfId : noti.value.getNewsFeedId(), imgId: noti.value.getImgId(), templateType : 'image' } );
                  case 'media' :
                    return notificationAction( { action:'media',noti:noti.value, nfId : noti.value.getNewsFeedId(), mediaId: noti.value.getImgId(), templateType : 'media' } );
                  case 'feed' :
                    return notificationAction( {
                        action:'ringbox',
                        nfId : noti.value.getNewsFeedId(),
                        noti:noti.value,
                        templateType : 'feed_with_text'
                      }
                    );
                }
            }

            function notificationAction (actionObj) {
                //rgDropdownService.close(actionObj.event);
                var seenarr = Storage.getData('notiseen');
                if(!seenarr){
                    seenarr = [];
                    Storage.setData('notiseen',seenarr);
                }
                if(seenarr.indexOf(actionObj.noti.getKey()) === -1){
                    seenarr.push(actionObj.noti.getKey());
                    actionObj.noti.updateSeenStatus(true);
                    if(seenarr.length > 150){
                        seenarr.shift();
                    }
                }
                Storage.setData('notiseen',seenarr);
                switch (actionObj.action) {
                        case 'redirect':
                            //TODO DEPENDENCY_HELL
                            //var circle = circlesManager.getCircle(actionObj.circleId);
                            if(circle){
                                var loc = actionObj.link.slice(1);
                                $location.path(loc);
                            }else{
                                Ringalert.show('Circle does not exist!', 'error');
                            }
                            break;
                        case 'ringbox' :
                              return {
                                 data: function () {
                                   return {notiKey: actionObj.noti.getKey(),noti : actionObj.noti, templateType : actionObj.templateType };
                                 },
                                 promise: notificationHttpService.getNotificationDetails({activityId: actionObj.nfId})
                               };
                        case 'media' :
                          return {
                              data: function() {
                                  return {
                                      notiKey: actionObj.noti.getKey(),
                                      noti : actionObj.noti,
                                      mediaId: actionObj.mediaId,
                                      popupFrom: 'notification',
                                      templateType: actionObj.templateType
                                  };
                              },
                              // TODO DEPENDENCY_HELL
                              promise: Api.media.fetchDetails({cntntId:actionObj.mediaId, utId:Auth.currentUser().getUtId()})
                          };
                        case 'image' :
                            return {
                               data: function() {
                                  return {
                                        notiKey: actionObj.noti.getKey(),
                                        noti : actionObj.noti,
                                        imgId: actionObj.imgId,
                                        popupFrom: 'notification',
                                        templateType: actionObj.templateType
                                  };
                                },
                                promise: AlbumFactory.getImageDetails(actionObj.imgId,actionObj.nfId)
                            };
                        default :
                }
            }


            function toggleLoading(bool) {
                $scope.state.loading = bool;
                if (!bool) {
                    rgScrollbarService.recalculate($scope);
                    $scope.$emit(SystemEvents.FEED.HEIGHT);
                }
                $scope.$rgDigest();
            }


            function loadMoreNotification() { // jshint ignore:line
                if (!$scope.state.loading && !$scope.state.noMoreData) {
                    toggleLoading(true);
                    NotificationFactory.loadMoreNoti(loadCount);
                }
            }


            // initialize
            if (loadCount > 20)  {
                // a loose condition to check if its see all or just the dropdown
                $scope.$emit(SystemEvents.FEED.HEIGHT);
            }
            if ($scope.notifications.length() < loadCount) {
                loadMoreNotification();
            }

             var subscriptionKey = $$connector.subscribe(
                            function() {
                                if (!timeOut) {
                                    timeOut = setTimeout(function() {
                                        timeOut = null;
                                        toggleLoading(false);
                                    }, 200);
                                }
                            },
                            { action: [
                                OTYPES.TYPE_MY_NOTIFICATIONS,
                                OTYPES.TYPE_SINGLE_NOTIFICATION
                            ]
                        });

            $scope.$on('$destroy', function() {
                $$connector.unsubscribe(subscriptionKey);
            });

        }

        function linkFunc(scope, element, attr) {
            var templateUrl =  attr.templateUrl ? attr.templateUrl : 'templates/dropdowns/notification-dropdown.html';

            $ringhttp.get(templateUrl).success(function(template) {
                element.append($compile(template)(scope));
                scope.$rgDigest();
            });

        }

        return {
            restrict: 'AE',
            controller: NotificationController,
            //templateUrl: 'templates/dropdowns/notification-dropdown.html', // IMPORTANT template preloaded inside auth factory
            //scope: true,
            scope: {
                 loadCount: '@',
                 templateUrl: '@'
            },
            link: linkFunc

        };

    }
