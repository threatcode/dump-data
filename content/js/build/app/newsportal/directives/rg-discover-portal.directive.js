angular
        .module('ringid.newsportal')
        .directive('rgDiscoverPortal', rgDiscoverPortal);

    rgDiscoverPortal.$inject = [ ];
    function rgDiscoverPortal( ) { // jshint ignore:line

        discoverPortalController.$inject = [ '$scope','$$stackedMap','$$newsPortalMap','portalHttpService','SystemEvents','feedFactory','OPERATION_TYPES' ];
        function discoverPortalController ( $scope, $$stackedMap, $$newsPortalMap, portalHttpService,SystemEvents,feedFactory,OPERATION_TYPES ) { //jshint ignore:line
            $scope.portalDiscoverMap = $$stackedMap.createNew();
            var obj,st;
            $scope.nodata = false;
            
            $scope.selected = null;

            $scope.params = {actn:OPERATION_TYPES.SYSTEM.TYPE_NEWS_PORTAL_FEED, scl:2,lmt:10,tm:0};


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

            $scope.getCatList = function(portalObj,index) {
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
            
            $scope.$on(SystemEvents.PORTAL.DONE_FOLLOW_PORTAL, function (event,json) {
                $scope.selected = json.index;
                $scope.$rgDigest(); 

                if(removeTimer){
                    clearTimeout(removeTimer)
                }

                var removeTimer = setTimeout(function(){ 
                    $scope.portalDiscoverMap.remove(json.id);                    
                    $scope.selected = null;
                    feedFactory.initFeedRequest($scope.params);
                    $scope.$rgDigest();
                }, 1000);
                
                
                $scope.$rgDigest();     
            });

            $scope.$on('$destroy',function(){
                $scope.portalDiscoverMap.reset();
            });
      
        }

        var linkFunc = function(scope,element) {
           

        };

        return {
            restrict: 'E',
            controller: discoverPortalController,
            link: linkFunc,
            templateUrl: 'pages/newsportal/discover.portal.directive.html'
        };
    }