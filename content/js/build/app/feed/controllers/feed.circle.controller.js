
    angular.module('ringid.feed')
    .controller('FeedCircleController',['$scope','$controller','$routeParams','OPERATION_TYPES', 'feedFactory',
        function($scope,$controller,$routeParams,OPERATION_TYPES, feedFactory){
            //$scope.column = helper.feedColumn();
            var feeds = [],
                page= 'circle',
                cicleId = $routeParams.circleId,
                helperob,
                mapkey = OPERATION_TYPES.SYSTEM.TYPE_GROUP_NEWS_FEED + "." + cicleId;

            $scope.pagekey = mapkey;

            $scope.action = OPERATION_TYPES.SYSTEM.TYPE_GROUP_NEWS_FEED;

            $scope.params = {actn:OPERATION_TYPES.SYSTEM.TYPE_GROUP_NEWS_FEED, grpId:cicleId};

            $scope.forAdd = page;
            $scope.shareMenuDisabled = true;

            $controller('FeedMainController', {$scope: $scope});

        }]);


