

    angular
        .module('ringid.newsportal')
        .controller('portalDiscoverController',portalDiscoverController);

        portalDiscoverController.$inject = ['$scope', 'SystemEvents','$$newsPortalMap','$$stackedMap','portalHttpService'];
        function portalDiscoverController ($scope, SystemEvents,$$newsPortalMap,$$stackedMap,portalHttpService) {

            $scope.portalDiscoverMap = $$stackedMap.createNew();
        	$scope.searchResultMap = $$stackedMap.createNew();
        	var obj,st;
            $scope.searching = false;
            $scope.nodata = false;
            $scope.loadmore = true;
            $scope.showloadmore = false;
            $scope.selected = null;


            portalHttpService.getPortalDiscoverList().then(function(json){
            	if ( json.sucs === true ) {
                    for(var i=0;i<json.npList.length;i++){                        
                        obj = $$newsPortalMap.create(json.npList[i]);
                        $scope.portalDiscoverMap.save(obj.getKey(),obj);
                    }
                    st = $scope.portalDiscoverMap.length();
                }
                $scope.$rgDigest();
            });

            $scope.$rgDigest();

            $scope.getDiscoverPortalCatList = function(portalObj,index) {
                return{
                    data: function() {
                        return {
                            target: portalObj,
                            index: index
                        };
                    },
                    promise: portalHttpService.getPortalCatList(portalObj.getKey())

                };
            };

            $scope.getSearchPortalCatList = function(portalObj,index) {
                return{
                    data: function() {
                        return {
                            target: portalObj,
                            index: index
                        };
                    },
                    promise: portalHttpService.getPortalCatList(portalObj.getKey())

                };
            };

            $scope.loadMorePortal = function(){
                $scope.showloadmore = true;
                $scope.$rgDigest();
                portalHttpService.getPortalDiscoverList(st).then(function(json){
                    if ( json.sucs === true ) {
                        for(var i=0;i<json.npList.length;i++){                        
                            obj = $$newsPortalMap.create(json.npList[i]);
                            $scope.portalDiscoverMap.save(obj.getKey(),obj);
                        }
                        st = $scope.portalDiscoverMap.length();
                        $scope.showloadmore = false;
                        $scope.$rgDigest();
                    }
                    if(json.npList.length<10){
                        $scope.loadmore = false;
                    }
                    $scope.$rgDigest();
                });
            };

            $scope.doSearch = function () {

                if( !$scope.searchParam ) {
                    $scope.searching = false;
                    $scope.nodata    = false;
                    $scope.$rgDigest();
                }else{
                    $scope.searching = true;
                    $scope.nodata    = false;
                    $scope.searchResultMap.reset();
                    $scope.$rgDigest();
                    portalHttpService.searchNewsPortal($scope.searchParam).then(function(json){
                        if ( json.sucs === true ) {
                            for(var j=0;j<json.searchedcontaclist.length;j++){                        
                                obj = $$newsPortalMap.create(json.searchedcontaclist[j].npDTO);
                                $scope.searchResultMap.save(obj.getKey(),obj);
                            }
                        }else{
                            $scope.nodata = true;
                        }
                        $scope.$rgDigest();
                    });
                }
                
            };

            $scope.$on(SystemEvents.PORTAL.DONE_FOLLOW_PORTAL, function (event,json) {
                $scope.selected = json.index;
                $scope.$rgDigest(); 

                if(removeTimer){
                    clearTimeout(removeTimer)
                }

                var removeTimer = setTimeout(function(){ 
                    if($scope.searchResultMap.length()>0){
                        $scope.searchResultMap.remove(json.id);
                        if($scope.searchResultMap.length()==0){
                            $scope.searchParam = '';
                            $scope.searching = false;
                            $scope.$rgDigest();
                        }
                    }else{
                        $scope.portalDiscoverMap.remove(json.id);
                    }
                    $scope.selected = null;
                    $scope.$rgDigest();
                }, 1000);
                
                
                $scope.$rgDigest();     
            });

            $scope.$on('$destroy',function(){
                $scope.portalDiscoverMap.reset();
            	$scope.searchResultMap.reset();
            });

        }


