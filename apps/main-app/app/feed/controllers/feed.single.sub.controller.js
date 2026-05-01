
    angular.module('ringid.feed')
    .controller('SingleFeedSubController', ['$$feedMap', '$scope','$controller', '$routeParams', 'feedFactory', 'Auth','SystemEvents','Utils','$location',
        function ($$feedMap, $scope,$controller, $routeParams, feedFactory, Auth,SystemEvents,Utils,$location){
            var page= 'singleFeed';

            $scope.feedId = parseInt($routeParams.feedId || 0);

            $scope.shared = !!$routeParams.shared ? true : false;

            $scope.activeCommentId = parseInt($routeParams.commentId || 0);

            //console.log($routeParams);

            $scope.isReady = false;
            $scope.noData = false;

            $scope.pagekey  = feedFactory.getSingleFeedPageKey($scope.feedId);

            feedFactory.setFactoryKey($scope.pagekey);

            //$scope.feed = $$feedMap.create({'nfId' : $scope.feedId });

            $scope.singleFeed = true;  // no use further check then remove
            $scope.hideSerial = true;
            $scope.showFeedFullContent = true;// for not showing the more button from show-more directive

            $scope.ogData = {};

            $scope.currentUser = Auth.currentUser();

            getSingleFeed();

            $scope.setFeed = function (deleted) {

                if(deleted){
                    $location.path("/");
                }else{
                    getSingleFeed();
                }
            };
            $scope.skipSaveScope = true;
             $scope.getFeedInfo = function(feed){
                return{
                    data: function() {
                        return {
                            target: feed
                        };
                    }
                };
            };


            ////////////////////////////////////////////////////////////
            $controller('FeedSubController', {$scope: $scope});
            function getSingleFeed(){

                feedFactory.getSingleFeed($scope.feedId, $scope.shared).then(function(feed){
                    if(!!feed){
                        $scope.feed = feed;
                        $scope.isReady = true;
                        initFeedView();
                    }else{
                        $scope.feed = false;
                        $scope.isReady = true;
                        $scope.noData = true;

                    }
                    $scope.$rgDigest();
                });

            }



            function initFeedView(){
                if($scope.feed){
                    $scope.serial = $scope.feed.serial;
                    $scope.feedstatus = $scope.feed.text();
                    $scope.keyid = $scope.feed.getKey();
                    $scope.imageslength = $scope.feed.getImages().length;
                    $scope.shareMenuDisabled = $scope.feed.isCirclePost();
                    $scope.ogData = $scope.feed.getOgData();
                    $scope.ogShowPreview = $scope.feed.hasOgData();
                    $scope.showCommentBox = true;
                    $controller('FeedSubController', {$scope: $scope});
                    Utils.safeDigest($scope);
                    $scope.$broadcast(SystemEvents.FEED.RESET,$scope.feed);

                }
            }
        }]);

