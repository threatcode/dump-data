


    angular.module('ringid.feed')
    .controller('FeedProfileController',['$scope','$controller','$routeParams','OPERATION_TYPES',
        function($scope,$controller,$routeParams,OPERATION_TYPES){

            var uId = $routeParams.uId,
                helperob,
                mapkey = uId,action;

            /* helperob ( Helper Object) sets where to submit the post, my wall or fiends wall
            *  my post : @value : "my"
            *  friend post : @value : "friend
            *
            * */

            if($scope.currentUser && $scope.currentUser.equals(uId)){
                helperob = "my";
                action = OPERATION_TYPES.SYSTEM.TYPE_MY_NEWS_FEED;

            }else{
                helperob = "friend";
                action = OPERATION_TYPES.SYSTEM.TYPE_FRIEND_NEWSFEED;
            }
            mapkey = action +"."+ uId;

            $scope.pagekey = mapkey;
            $scope.action = action;
            $scope.params = {actn:action,fndId:uId};
            $scope.forAdd = helperob;
            $scope.sortBy = 'at';
            $controller('FeedMainController', {$scope: $scope});
        }]);


