
    angular
    .module('ringid.feed')
    .controller('FeedMainController', ['$scope', '$timeout','feedFactory', '$rootScope','SystemEvents',
        function ($scope, $timeout,feedFactory, $rootScope,SystemEvents) {
            // initiate feed binding for scope
            feedFactory.reset();
            $scope.noMoreFeed  = false;
            $scope.showPostBox = $scope.showPostBox || function(){return true;};
            $scope.showSpecialFeed = $scope.showSpecialFeed || function(){return true;};

            $scope.feeds = feedFactory.getFeeds();
            feedFactory.setFactoryKey($scope.pagekey);
            feedFactory.setSortBy($scope.sortBy || 'tm');
            $scope.busy = true;
            // setTimeout(function(){ // first time we are requesting from rg-feed subscriber directive when directive is ready
            //                        // so after 3 second we need to change the busy filter to normal so that we can request for data again
            //     $scope.busy = false;
            //     $scope.$broadcast(SystemEvents.FEED.BUSY, $scope.busy);
            // },3000);

            var feedUpdateTimer = setInterval(function(){
                feedFactory.updateTime();
                $scope.$rgDigest();
            }, 300000);

            $scope.setFeed = function (forceDigest) {
                $scope.feeds = [];
                $scope.feeds = feedFactory.getFeeds();
                if(forceDigest){
                    $scope.$rgDigest();
                }
            };

           // $scope.scopeData = scopeData;
            $scope.forAdd = $scope.forAdd || 'my';
            $scope.getFeeds = function () {
                if (!$scope.feeds || $scope.feeds.length === 0) {
                    $scope.setFeed();
                }
                return $scope.feeds;
            };

            var busyTimer,previousFeedLength;
            $scope.LoadMoreData = function (syncher) {
                previousFeedLength = $scope.feeds.length;
                if ($scope.busy === false && !$scope.noMoreFeed) {
                    $scope.busy = true;
                    feedFactory.requestForMoreFeed($scope.params);

                    $scope.clearRequestTimer();
                    busyTimer = setTimeout(function(){
                        if($scope.busy ){
                            if(previousFeedLength === $scope.feeds.length){
                                $scope.busy = false;
                                $scope.$broadcast(SystemEvents.FEED.BUSY, $scope.busy);

                            }


                         }
                     },6000);
                }

                /*
                else{
                    $scope.busy = false;
                    $scope.$broadcast(SystemEvents.FEED.BUSY, $scope.busy);
                } */

                // request for loading more data
            };
            $scope.clearRequestTimer = function(a){ // a for getting native undefined
                if(!!busyTimer)clearTimeout(busyTimer);
                busyTimer = a;
            };

            $scope.$on("FeedListChanged",function(){
                $scope.setFeed();
            });



            $scope.setNoMoreFeed = function(state){
                $scope.noMoreFeed = state;
                feedFactory.noMoreFeed(state);
                $scope.busy = false;
                $scope.$broadcast(SystemEvents.FEED.BUSY, $scope.busy);
            }
            $scope.noDataYet = function(){
                return $scope.noMoreFeed && $scope.feeds.length == 0;
            }
            $scope.getFeedInfo = function(feed){
                return{
                    data: function() {
                        return {
                            target: feed
                        };
                    }
                };
            };

 
            //$scope.incomingFeed = true;
            //$scope.setIncomingFeed = function(val){
            //        $scope.incomingFeed = !!val;
            //};
            //$scope.loadIncomingFeed = function(){
            //    feedFactory.processIncomingFeed();
            //    $scope.setFeed();
            //    $scope.incomingFeed = false;
            //};

            //feedFactory.requestForFeed($scope.params);
            // var initFeedInterval;
            // function initTialFeedRequest(){
            //     if(!$scope.feeds.length){
            //         feedFactory.initFeedRequest($scope.params);
            //         if(!initFeedInterval){
            //             initFeedInterval = setInterval(initTialFeedRequest,6000);
            //         }
            //     }else{
            //         if(initFeedInterval){
            //             clearInterval(initFeedInterval);
            //             initFeedInterval = null;
            //         }
            //     }
            // }
            // initTialFeedRequest();
            //for faster load dashboard feed
            feedFactory.initFeedRequest($scope.params);
            $scope.$on("$destroy",function(){
                // if(initFeedInterval){
                //     clearInterval(initFeedInterval);
                //     initFeedInterval = null;
                // }
                if(feedUpdateTimer){
                    clearInterval(feedUpdateTimer);
                    feedUpdateTimer = null;
                }
                });

            $scope.$on(SystemEvents.COMMON.COLUMN_CHANGED,function(){
                $scope.$rgDigest();
            });
        }])
       ;

