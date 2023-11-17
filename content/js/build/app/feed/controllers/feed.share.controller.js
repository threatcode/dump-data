
    angular.module('ringid.feed')
    .controller("feedShareController",feedShareController);

    feedShareController.$inject = ['$scope', 'Auth', 'feedFactory','$rootScope','Ringalert', 'Utils'];
    function feedShareController($scope,AuthFactory, feedFactory,$rootScope,Ringalert, Utils) {
            /**
                This will act as a abstract base controller,
                Usage Example :
                  `feed.inline.share.controller`
                  `feed.ringbox.share.controller`

                params:
                    $scope.params = {
                      `feed` : FEED_MAP_OBJECT
                      `afterShareCallback` : `Callback FUNCTION AFTER SHARE`
                  }
            */

            $scope.feed = $scope.params.feed;
            $scope.afterShareCallback = $scope.afterShareCallback || $scope.params.afterShareCallback;
            $scope.updateFeedLocation = updateFeedLocation;
            $scope.resetFeedLocation = resetFeedLocation;
            $scope.currentUser = AuthFactory.currentUser();

            resetFeedLocation();
            resetFeedText();
            resetErrorMessage();
            enablePostInput();
            hideLoader();

            $scope.shareFeed = shareFeed;

            ///////////////// SCOPE FUNCTIONS ////////////////////

            function shareFeed(ob) {
                var data = getFeedShareData();

                disablePostInput();
                showLoader();
                resetErrorMessage();

                feedFactory.shareFeed(data).then(function (json) {
                    hideLoader();
                    resetFeedText();
                    enablePostInput();
                    resetErrorMessage();
                    resetFeedLocation();

                    emitFeedListChangedEvent();

                    afterShareCallback();
                    showSuccessMsg(json);
                    if($scope.media){
                        $scope.media.share(true);
                        $scope.$close();
                    }else if($scope.popup){
                       $scope.$close();		
					}else{
                        $scope.$parent.$rgDigest();
                    }

                },function(responseObj){
                    hideLoader();
                    enablePostInput();
                    processErorr(responseObj);
                    $scope.$parent.$rgDigest();
                });
                $scope.$rgDigest();
            }

            ///////////////////////////////////////////////////////////////

            function disablePostInput(){ $scope.inputDisabled = true; }
            function enablePostInput(){ $scope.inputDisabled = false; }

            function showLoader(){ $scope.boxIsLoading = true; }
            function hideLoader(){ $scope.boxIsLoading = false; }

            function setErrorMessage(msg){ $scope.errorMessage = msg; }
            function resetErrorMessage(){ $scope.errorMessage = ""; }

            function resetFeedText(){ $scope.feedText = ""; }
            function setFeedText(text){ $scope.feedText = text;  }

            function setFeedLocation(location){ $scope.feedLocation = location; }
            function resetFeedLocation(location){ $scope.feedLocation = ""; }

            function updateFeedLocation(location){
                //$scope.$apply(function(){
                    setFeedLocation(location);
                    $scope.$rgDigest();
                //})
                // $scope.$digest();
            }

            function emitFeedListChangedEvent(){
              $rootScope.$broadcast("FeedListChanged");
              $scope.$broadcast('cleareditor');
            }

            function showSuccessMsg(json){ Ringalert.show(json,'success'); }

            function showErrorMsg(msg){ Ringalert.show(msg,'error'); }

            function getFeedShareData(){
                var feed = $scope.media ? null:$scope.feed;
              var data =  { text: $scope.feedText,
                  feed: feed && feed.hasSharedFeed()? feed.getOrginalFeed() : feed,
                  location : $scope.feedLocation
              },content = $scope.media,i;

              if($scope.emotions.length){
                  data.mdIds = [$scope.emotions[0].id];// we will support one emotion at a time for now
                  $scope.emotions.length = 0;//emptying emotion
              }

              if($scope.tagList.length){
                  data.tFrndIds = [];
                  for(i=0;i<$scope.tagList.length;i++){
                      data.tFrndIds.push($scope.tagList[i].getUtId());
                  }
                  $scope.tagList.length = 0;
              }
            if(content || (feed  && feed.isSingleContentFeed() && (feed.getMedias().length() || feed.getAudios().length())) ){
                 content = content || feed.getSingleContent();
                 data.audio = content.isAudio();
                 data.cntntIDLst = [content.getKey()];
                 data.addShare = true;
                 data.user = $scope.currentUser;
            }

              return data;

            }


            function afterShareCallback(){
                if(!!$scope.afterShareCallback){
                  $scope.afterShareCallback();
                }
            }

            function processErorr(responseObj){

                var msg = Utils.getReasonMessageFromResponse(responseObj);
                if(msg == ""){
                    msg = "Unable To Share Status. Please Try Again Later";
                }

                $scope.errorMessage = msg;
            }


            $scope.emotions = [];
            $scope.tagList = [];

            $scope.addTag = function(item){
                var index = $scope.tagList.indexOf(item);
                if(index === -1){
                    $scope.tagList.push(item);
                }

            }
            $scope.removeTag = function(usr){
                    var index = $scope.tagList.indexOf(usr);
                    if(index >=0){
                        $scope.tagList.splice(index, 1);
                    }
            };
            $scope.chooseEmotion = function(subCat){
                $scope.emotions.length = 0;//note : now we only support one media at a limt
                $scope.emotions.push(subCat);
            }



        }

