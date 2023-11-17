



    angular.module('ringid.feed')
    .controller('FeedMediasController',['$scope','$controller','$routeParams','OPERATION_TYPES', 'feedFactory',
        function($scope,$controller,$routeParams,OPERATION_TYPES, feedFactory){
            //$scope.column = helper.feedColumn();
            var feeds = [],
                page= 'my',
                // cicleId = $routeParams.circleId,
                helperob,
                mapkey = OPERATION_TYPES.SYSTEM.TYPE_MEDIAS_NEWS_FEED + ".medias";

            $scope.pagekey = mapkey;

            $scope.action = OPERATION_TYPES.SYSTEM.TYPE_MEDIAS_NEWS_FEED;

            $scope.params = {actn:OPERATION_TYPES.SYSTEM.TYPE_MEDIAS_NEWS_FEED, pvtid:0,st:0,mtf:0};
            $scope.a_f_m = 'f';

            $scope.setTrending = function(v){
                $scope.params.mtf = v;
                var pre_v = $scope.a_f_m;//previous value
                if(v === 1){
                    $scope.a_f_m = 't';//trending // a_f_m = active_filter_menu
                }else{
                    $scope.a_f_m = 'f';//friends
                }

                if(pre_v !== $scope.a_f_m){ // filter changed so we need to call
                    feedFactory.reset();
                    feedFactory.initFeedRequest($scope.params);
                    $scope.$rgDigest();
                }

            };

            $scope.forAdd = page;
            $scope.shareMenuDisabled = true;
            $scope.showPostBox = function(){return false;};
            $scope.showSpecialFeed = function(){return false;};
            $controller('FeedMainController', {$scope: $scope});

        }]);


