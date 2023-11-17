/**
 * © Ipvision
 */

(function() {
    'use strict';

    angular
        .module('ringid.newsportal')
        .controller('portalFollowingController',portalFollowingController);

        portalFollowingController.$inject = ['$scope', 'SystemEvents','$$stackedMap','$$newsPortalMap','portalHttpService','$ringbox','rgDropdownService','MESSAGES'];
        function portalFollowingController ($scope, SystemEvents, $$stackedMap,$$newsPortalMap,portalHttpService,$ringbox,rgDropdownService,MESSAGES) {

            $scope.portalFollowMap = $$stackedMap.createNew();
            var obj,st;
            $scope.loadmore = true;
            $scope.showloadmore = false;
            $scope.isEmptyFollow = false;

            $scope.ddActionHtml = 'pages/dropdowns/portal-follow-action-dropdown.html';

            portalHttpService.getPortalFollowingList().then(function(json){
                if ( json.sucs === true ) {
                    for(var i=0;i<json.npList.length;i++){                        
                        obj = $$newsPortalMap.create(json.npList[i]);
                        $scope.portalFollowMap.save(obj.getKey(),obj);
                    }
                    st = $scope.portalFollowMap.length();
                }else{
                    $scope.isEmptyFollow = true;
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

            $scope.loadMoreFollowingPortal = function(){
                $scope.showloadmore = true;
                $scope.$rgDigest();
                portalHttpService.getPortalFollowingList(st).then(function(json){
                    if ( json.sucs === true ) {
                        for(var i=0;i<json.npList.length;i++){                        
                            obj = $$newsPortalMap.create(json.npList[i]);
                            $scope.portalFollowMap.save(obj.getKey(),obj);
                        }
                        st = $scope.portalFollowMap.length();
                        $scope.showloadmore = false;
                        $scope.$rgDigest();
                    }
                    if(json.npList.length<10){
                        $scope.loadmore = false;
                    }
                    $scope.$rgDigest();
                });
            };

            $scope.$rgDigest();

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
                                        target : actionObject.data.portal.value
                                    },
                                    remoteData : function(){
                                        return portalHttpService.getPortalCatList(actionObject.data.portal.value.getKey())
                                    }
                                    
                                },
                                templateUrl : 'pages/newsportal/portal-follow.popup.html'
                        });
                        break;
                    case 'unfollow':
                        rgDropdownService.close(actionObject.event);
                        $scope.$rgDigest();
                        var message = MESSAGES.NEWSPORTAL.C_UNFOLLOW;
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
                                portalHttpService.unFollowPortal(actionObject.data.portal.value.getKey()).then(function(json){
                                    if(json.sucs===true){
                                        $scope.portalFollowMap.remove(json.id);
                                        if($scope.portalFollowMap.length()<1){
                                            $scope.isEmptyFollow = true;
                                            $scope.$rgDigest();
                                        }
                                        $scope.$rgDigest();
                                    }else{
                                        //Ringalert('Operation failed', 'error');
                                    }
                                    $scope.$rgDigest();
                                });
                            }
                        });

                    default:
                        break;
                }
            };

            $scope.$on(SystemEvents.PORTAL.UNFOLLOW_PORTAL, function (event,json) {
                $scope.portalFollowMap.remove(json.id); 
                if($scope.portalFollowMap.length()<1){
                    $scope.isEmptyFollow = true;
                    $scope.$rgDigest();
                }
                //todo: if portalFollowMap.length()<3 then call loadmore
                $scope.$rgDigest();     
            });

            $scope.$on('$destroy',function(){
                $scope.portalFollowMap.reset();
            });

        }

})();
