    angular.module('ringid.feed')
    .controller("PopupSingleFeedController",PopupSingleFeedController);

    PopupSingleFeedController.$inject = ['$scope','remoteData','$boxInstance','$controller','$$feedMap'];
    function PopupSingleFeedController($scope,remoteData,$boxInstance,$controller,$$feedMap){
		$scope.feed = $$feedMap.create(remoteData.newsFeedList[0]);
		$scope.hideSerial= true;
        $scope.showCommentBox = true;
        $scope.showFeedFullContent = true;
		RingLogger.print(remoteData,"FEED_MORE");
		 $controller("FeedSubController",{$scope:$scope});
    }
