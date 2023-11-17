    angular.module('ringid.feed')
    .controller('FeedWhoShareController',FeedWhoShareController);
    FeedWhoShareController.$inject = ['$$connector','$scope','$$feedMap','feedFactory','OPERATION_TYPES','$rootScope','Ringalert'];

    function FeedWhoShareController($$connector,$scope,$$feedMap,feedFactory,OPERATION_TYPES,$rootScope,Ringalert){
        /**
         *
         * This contrller Has been made abstract and couldn't be used alone, use it by extending
         *
         * See, feed.ringbox.whoshare.controller.js , feed.single.whoshare.controller.js
         *
         * $scope.params will contain the parameters to init the controller
         *
         *
         */


        var subKey,ignoreCommKey,ignoreLikeKey,i,OTYPES=OPERATION_TYPES.SYSTEM;

        $scope.feeds = [];
        $scope.message = "";

        $scope.boxIsLoading = !$scope.params.boxIsLoading ?  true : $scope.params.boxIsLoading;

        var dashboardFeed;
        if(!!$scope.params){
            dashboardFeed = feedFactory.getFeed($scope.params.keyid);
        }


        $scope.showMessage = false  ;
        $scope.shareMenuDisabled = true;
        $scope.singleFeed = true;
        $scope.busy = false;


        $scope.boxHeight = $rootScope.windowHeight - 20;


        /**
         * Prohibiting Main feed subscriber from feedFactory not to process data if this controller scope exist for certain action        *
         *
         */
        subKey = $$connector.subscribe(function(json){
            $scope.boxIsLoading = false;
            $scope.isReady = true;
            $scope.busy = false;

            if(!json.sucs){
                $scope.$close();
                //todo : reason code implementation
                Ringalert.show(json.mg || "Opps ! Looks Like Something Went Wrong ! Please Try Later.",'error');
                return;
            }

            if(json.newsFeedList.length){
                for(i=0;i<json.newsFeedList.length;i++){
                    var aFeedMapObject = $$feedMap.create(json.newsFeedList[i]);

                     if( aFeedMapObject.getKey() === dashboardFeed.getKey()){
                         aFeedMapObject.setIdenticalFeed(dashboardFeed);
                     }
                    // }else{
                    $scope.feeds.push(aFeedMapObject);
                    // }

                }
            }
            $scope.$rgDigest();
        },{
            action : OTYPES.TYPE_WHO_SHARES_LIST
        });



        function startRequest(){
            $scope.boxIsLoading = true;
            if($scope.feeds.length < $scope.params.feed.getTotalShare() && !$scope.busy){
                $$connector.send({
                    actn : OTYPES.TYPE_WHO_SHARES_LIST,
                    nfId : $scope.params.feed.getKey(),
                    st : $scope.feeds.length
                },OTYPES.REQUEST_TYPE.REQUEST);
                $scope.busy = true;
                setTimeout(function(){ // blocking next three second not to send the request
                    $scope.busy = $scope.busy || false;
                    $scope.$rgDigest();
                },3000);
                $scope.$rgDigest();
                /**
                 * for Testing purpose ther service were created in feedFactory
                 * Now its blocked but if you need to retest block the socket sending option
                 * and unblock this one
                 */
                //  $scope.busy = true;
                // feedFactory.fakeFeed($scope.feeds.length,4).then(function(json){
                //    for(var i=0;i<json.length;i++){
                //        //if(findFromFeeds(json[i].getKey())){
                //           // console.log("duplicate Feed :" + json[i].getKey());
                //       // }else{
                //            $scope.feeds.push(json[i]);
                //      //  }

                //    }
                // $scope.busy = false;
                // },function(message){
                //    console.log("Limit Reached");
                // $scope.busy = false;
                // });
                // $scope.$rgDigest();
            }


        }
        $scope.loadMore = startRequest;
        $scope.loadMore();//starting first Request

        $scope.$on('$destroy',function(){
            feedFactory.removeIgnoreFilter(ignoreCommKey);
            feedFactory.removeIgnoreFilter(ignoreLikeKey);
            $$connector.unsubscribe(subKey);
        });
        $scope.skipSaveScope = true;

    }

