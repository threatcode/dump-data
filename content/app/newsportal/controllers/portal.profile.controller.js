angular.module('ringid.feed')
    .controller('PortalProfileController',['$scope','$controller','$rootScope','$routeParams','rgDropdownService','OPERATION_TYPES','portalHttpService','$$newsPortalMap','SystemEvents','$ringbox',
        function($scope,$controller,$rootScope,$routeParams,rgDropdownService,OPERATION_TYPES,portalHttpService,$$newsPortalMap,SystemEvents,$ringbox){

           
            var uId = $routeParams.uid,
                helperob,
                mapkey = uId,action;
            
            helperob = "newsportal";
            action = OPERATION_TYPES.SYSTEM.TYPE_FRIEND_NEWSFEED;

            $scope.ddActionHtml = 'pages/dropdowns/portal-cover-follow-action-dropdown.html';
            
            mapkey = action +"."+ uId+".3";

            $scope.pagekey = mapkey;
            $scope.action = action;
            $scope.params = {actn:action,fndId:uId,pType:3};
            $scope.forAdd = helperob;
            $scope.sortBy = 'at';

            portalHttpService.getPortalShortDetails(uId).then(function(json){
                if ( json.sucs === true ) {
                    json.userDetails.npDTO.utId = json.userDetails.utId;
                    json.userDetails.npDTO.prIm = json.userDetails.prIm;
                    $scope.portalMap = $$newsPortalMap.create(json.userDetails.npDTO);
                }
                $scope.$rgDigest();
            });

            $scope.getPortalCatList = function(portalObj) {
                return{
                    data: function() {
                        return {
                            target: portalObj
                        };
                    },
                    promise: portalHttpService.getPortalCatList(portalObj.getKey())

                };
            };

            $scope.actionFollowingDropdown = function(actionObject){
                switch(actionObject.action){
                    case 'edit':
                        rgDropdownService.close(actionObject.event);
                        $scope.$rgDigest();
                        var boxInstance = $ringbox.open({

                                type : 'remote',
                                scope:false,
                                onBackDropClickClose:true,
                                controller: 'portalFollowController',
                                resolve : {
                                    localData : {
                                        target : actionObject.data.portal
                                    },
                                    remoteData : function(){
                                        return portalHttpService.getPortalCatList(actionObject.data.portal.getKey())
                                    }
                                    
                                },
                                templateUrl : 'pages/newsportal/portal-follow.popup.html'
                        });
                        break;
                    case 'unfollow':
                        rgDropdownService.close(actionObject.event);
                        $scope.$rgDigest();
                        portalHttpService.unFollowPortal(actionObject.data.portal.getKey()).then(function(json){
                            if(json.sucs===true){
                                $rootScope.$broadcast(SystemEvents.PORTAL.UNFOLLOW_PORTAL,json);
                                $scope.portalMap.setIfSubscribed(false);
                                $scope.$rgDigest();
                            }else{

                            }
                        });
                    default:
                        break;
                }
            };

            $scope.$on(SystemEvents.PORTAL.DONE_FOLLOW_PORTAL, function (event,json) { 
                $scope.portalMap.setIfSubscribed(true);
                $scope.$rgDigest();     
            });

            $controller('FeedMainController', {$scope: $scope});
        }]);
