

    
    angular.module('ringid.feed')
    .controller('PortalFeedSubController', ['$$feedMap', '$scope','$controller','localData', '$routeParams', 'feedFactory', 'Auth','SystemEvents','$location', '$boxInstance',
        function ($$feedMap, $scope,$controller,localData, $routeParams, feedFactory, Auth,SystemEvents,$location, $boxInstance){
            
            // $scope.feedId = parseInt(localData.target.getKey() || 0);
             
            $scope.feed = localData.target;

            console.log($scope.feed);


            // $scope.isReady = false;
            // $scope.noData = false;

            $scope.singleFeed = true;

            $scope.ogData = {};

            $scope.currentUser = Auth.currentUser();

            $scope.feedstatus = $scope.feed.text();
            $scope.keyid = $scope.feed.getKey();
            $scope.imageslength = $scope.feed.getImages().length;
            $scope.imageShowMoreLength = $scope.feed.getTotalImage()-1;
            $scope.showCommentBox = true;
            $controller('FeedSubController', {$scope: $scope});
            $scope.$rgDigest();

            $boxInstance.hideLoader();


            // getSingleFeed();

            // $scope.setFeed = function (deleted) {

            //     if(deleted){
            //         $location.path("/");
            //     }else{
            //         getSingleFeed();
            //     }
            // };
            // $scope.skipSaveScope = true;


            ////////////////////////////////////////////////////////////
            //$controller('FeedSubController', {$scope: $scope});
            // function getSingleFeed(){

            //     feedFactory.getSingleFeed($scope.feedId, $scope.shared).then(function(feed){
            //         if(!!feed){
            //             $scope.feed = feed;
            //             $scope.isReady = true;
            //             initFeedView();
            //         }else{
            //             $scope.feed = false;
            //             $scope.isReady = true;
            //             $scope.noData = true;

            //         }
            //         $scope.$rgDigest();
            //     });

            // }


            // function initFeedView(){
            //     if($scope.feed){
            //         $scope.serial = $scope.feed.serial;
            //         $scope.feedstatus = $scope.feed.text();
            //         $scope.keyid = $scope.feed.getKey();
            //         $scope.imageslength = $scope.feed.getImages().length;
            //         $scope.imageShowMoreLength = $scope.feed.getTotalImage()-1;
            //         // $scope.shareMenuDisabled = $scope.feed.isCirclePost();
            //         // $scope.ogData = $scope.feed.getOgData();
            //         // $scope.ogShowPreview = $scope.feed.hasOgData();
            //         $scope.showCommentBox = true;
            //         $controller('FeedSubController', {$scope: $scope});
            //         $scope.$rgDigest();
            //         // $scope.$broadcast(SystemEvents.FEED.RESET,$scope.feed);

            //     }
            // }
        }]);



