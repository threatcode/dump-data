
    angular.module('ringid.feed')
    .controller('FeedDashboardController', ['$scope','$controller','OPERATION_TYPES','Ringalert',
        function ($scope,$controller,OPERATION_TYPES,Ringalert){
            $scope.pagekey = OPERATION_TYPES.SYSTEM.TYPE_NEWS_FEED + '.all';
            $scope.action = OPERATION_TYPES.SYSTEM.TYPE_NEWS_FEED;
            $scope.params = {actn:OPERATION_TYPES.SYSTEM.TYPE_NEWS_FEED};
            $scope.forAdd = "my";
            $controller('FeedMainController', {$scope: $scope});

        }]);

