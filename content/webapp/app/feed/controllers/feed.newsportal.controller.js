



    angular.module('ringid.feed')
    .controller('FeedNewsportalController',['$scope','$controller','$routeParams','OPERATION_TYPES', 'feedFactory',
        function($scope,$controller,$routeParams,OPERATION_TYPES, feedFactory){
            
            var feeds = [],
                page= 'newsportal',
                helperob,
                mapkey = OPERATION_TYPES.SYSTEM.TYPE_NEWS_PORTAL_FEED + ".newsportal";

            $scope.pagekey = mapkey;

            $scope.action = OPERATION_TYPES.SYSTEM.TYPE_NEWS_PORTAL_FEED;

            $scope.params = {actn:OPERATION_TYPES.SYSTEM.TYPE_NEWS_PORTAL_FEED, scl:2,lmt:10,tm:0};
            

            $scope.forAdd = page;
            $scope.shareMenuDisabled = true;
            $scope.showPostBox = function(){return false;};
            $scope.showSpecialFeed = function(){return false;};
            $controller('FeedMainController', {$scope: $scope});

        }]);


