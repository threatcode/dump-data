    angular.module('ringid.feed')
    .controller("FeedEditController",FeedEditController);
        FeedEditController.$inject = ['Auth','SystemEvents','$scope', 'localData', 'remoteData', 'feedFactory', 'Ringalert'];
     function FeedEditController(Auth,SystemEvents,$scope, localData, remoteData, feedFactory, Ringalert) {
		    var feed = localData.feed;
            $scope.emotions = [];
	        $scope.editorEnabled = false;
            $scope.errorImageEdit = false;

            $scope.feedLocation = {};
            $scope.ogData = $scope.ogData || {};
            $scope.filterOnProgress = false;

            $scope.ogDataLoading = false;
            $scope.ogShowPreview = false;

            $scope.previousFeedLocation = '';
            /**  Functions start */
            $scope.feedEditChooseEmotion = feedEditChooseEmotion;// function
            $scope.cancelEdit = cancelEdit;//function
            $scope.updateFeed = updateFeed;
            $scope.selectedFeedLocation = selectedFeedLocation;
            $scope.resetFeedLocation = resetFeedLocation;
            $scope.getFeedHtml = getFeedHtml;
            //$scope.showdroparrow = feedKey;
            /** function end */
		    if(remoteData){// when feed.shoeMore() then remote data have the all feed text
                    if(remoteData.newsFeedList){
						feed.parseMoreText(remoteData.newsFeedList[0]);
					} else {
						feed.parseMoreText(remoteData);
     				}
	         }
		    //if (!!json.newsFeedList) {
                        //feed.parseMoreText(json.newsFeedList[0]);
                    //} else {
                        //feed.parseMoreText(json);
                    //}

		    $scope.editorEnabled = true;
		    $scope.feedText = feed.text();
		    $scope.feedLocation =  angular.copy(feed.getLocationInfo());
			$scope.ogData =  angular.copy(feed.getOgData());

    		if( $scope.ogData.image){
				$scope.ogData.images = [$scope.ogData.image];
			}

			$scope.ogShowPreview = feed.hasOgData();

			$scope.emotions = feed.hasFeelings()? [feed.getFeelings()] : [];


            function getFeedHtml(){
                return feed.getDynamicText();
            }

            function resetFeedLocation(){
                 $scope.feedLocation = {};
            }
            function selectedFeedLocation(location){
                 $scope.feedLocation = location;
				 $scope.$rgDigest();
            }
            function feedEditChooseEmotion(subCat){
                 $scope.emotions.length = 0;
                 $scope.emotions.push(subCat);
                 $scope.$rgDigest();
            }
            function validateUpdate(){
                    return !$scope.feedText
                        && !$scope.feedLocation.description
                        && !$scope.ogData.url
                        && !($scope.feelings && $scope.feelings.id)
                        && !$scope.feed.hasMedia()
                        && !$scope.feed.hasTagUsers();
            }
             $scope.sentRequest = false;
            function updateFeed() {
                $scope.feedText = $scope.feedText.trim();

                if($scope.emotions.length){
                    $scope.feelings = $scope.emotions[0];// we will support one emotion at a time for now
                    $scope.emotions.length = 0;//emptying emotion
                }else{
                    $scope.feelings = false;
                }

                //$scope.showdroparrow = 0;



                if(validateUpdate()){
                    $scope.errorImageEdit = true;
                    $scope.editorEnabled = true;
                }else{
                     $scope.sentRequest = true;
                    feedFactory.updateFeed(Auth.currentUser(),feed , $scope.feedText, $scope.feedLocation, $scope.ogData, $scope.feelings  ).then(function (json) {
                        /* Isolated Directives will update based on this event */
                         
                         if(json.sucs){
                         		 $scope.$close({sucs:true});
						 }else{
				             $scope.sentRequest = false;
						    Ringalert.show(json,"error");
						    $scope.$rgDigest();
						 }
                        //$scope.$broadcast(SystemEvents.FEED.UPDATED, { id: $scope.keyid });

                    },function(json){
                        Ringalert.show(json,'error');
                        $scope.$rgDigest();
                    });
                }
             $scope.$rgDigest();


            }


            function cancelEdit() {
            		$scope.$close({sucs:false});
            }

             // ####
              $scope.contentHightChanged = function(){
			 		 $scope.$emit(SystemEvents.RINGBOX.UPDATE);
			  };
			 /*$scope.$watch(function(){*/
					  //return $scope.ogData.url + $scope.ogData.image;
			 //},function(){
					  //$scope.$emit(SystemEvents.RINGBOX.UPDATE);
			 /*});*/
	 }

