



    angular.module('ringid.feed')
    .controller("FeedSubController",FeedSubController);
        FeedSubController.$inject = ['rgDropdownService', '$rootScope','$scope', '$location', 'feedFactory', 'Ringalert','MESSAGES', 'SystemEvents','$ringbox','Media', 'Utils', 'APP_CONSTANTS'];
     function FeedSubController(rgDropdownService, $rootScope,$scope, $location, feedFactory, Ringalert,MESSAGES, SystemEvents,$ringbox,Media, Utils, AC) {
            $scope.showdroparrow = 0;
            $scope.showCommentBox = false; // use
            $scope.showShareBox = false; // use
            $scope.showCommentView = true; // do not use
            $scope.showShareForm = false; // do not use
            //$scope.editorEnabled = false;
            //$scope.errorImageEdit = false;

            //$scope.feedLocation = {};
            //$scope.ogData = $scope.ogData || {};
            //$scope.filterOnProgress = false;

            //$scope.ogDataLoading = false;
            //$scope.ogShowPreview = false;

            //$scope.previousFeedLocation = '';

            //$scope.emotions = {};
            var f = $scope.feed && $scope.feed.value ? $scope.feed.value : $scope.feed;
            if(f && f.isSingleContentFeed()){
             if(f.getMedias().length() || f.getAudios().length()){
                $scope.likeType = 'media';
             }else if(f.getImages(true).length()){
                $scope.likeType = 'image';
             }
                $scope.likeTarget =  f.getSingleContent();
             }else{
                 $scope.likeType = 'feed';
                 $scope.likeTarget = f;
             }

            $scope.shareMenuDisabled = $scope.shareMenuDisabled ? $scope.shareMenuDisabled : false;
            $scope.toggleCommentBox = function (event) {
                event.stopPropagation();
                $scope.showCommentBox = !$scope.showCommentBox;
                if($scope.showCommentBox) {
                    $scope.showShareBox = false;
                }
                //$scope.showShareForm = !$scope.showCommentBox;
            };


            /**
             *  For update feed verbal time
             */
            //setInterval(feedFactory.updateTime, 180000 );

             //$scope.feedEditChooseEmotion = function(subCat){
                 //$scope.emotions.length = 0;
                 //$scope.emotions.push(subCat);
                 //$scope.$rgDigest();
             //};

            // $scope.toggleShareBox = function(event) {
            //     event.stopPropagation();
            //     var f = $scope.feed.hasSharedFeed() ? $scope.feed.getOrginalFeed():$scope.feed;
            //     var shareablle = f.isShareAble(true);
            //     if(shareablle.sucs) {
            //         $scope.showShareBox = !$scope.showShareBox;
            //         if($scope.showShareBox) {
            //             $scope.showCommentBox = false;
            //         }
            //         $scope.$rgDigest();
            //     } else {
            //         Ringalert.show(MESSAGES[shareablle.rc],'warning');
            //     }
            // };



            //$scope.hideTheCommentBox = function () {
                //$scope.showCommentBox = false;
                //$scope.showShareForm = !$scope.showCommentBox
            //};

            //$scope.showTheCommentBox = function () {
                //$scope.showCommentBox = true;
                //$scope.showShareForm = !$scope.showCommentBox
            //};

            // feed dropdown data
            //$scope.ddHtml = 'templates/dropdowns/feed-edit-dropdown.html';//$templateCache.get('feed-edit-dropdown.html');
            $scope.ddTemplate =
				'<div class="ng-cloak action feed-ac float-right">' +
					'<div class="feed-line" ng-if="ddControl.showEdit()">' +
						'<span class="drop-sprite w-h-13 edit-ico feed-font"></span>' +
						'<a rg-click="ddAction()({event: $event, action:\'edit\', feedKey: ddControl.feedKey})" href="#">Edit</a>' +
					'</div>' +
                    '<div class="feed-line" ng-if="ddControl.showReportButton()">' +
                        '<span class="drop-sprite add-tag-mar w-h-13 report-ico feed-font"></span>' +
                    '<a rg-report spam-type="{{ddControl.getSpamType()}}" spam-id="ddControl.getSpamId()">Report</a>' +
                    '</div>'+
					'<div class="feed-line" ng-if="ddControl.showTagButton()">' +
						'<span class="drop-sprite add-tag-mar w-h-13 add-tag-ico feed-font"></span>' +
						'<a rg-click="ddAction()({event: $event, action:\'edittag\', feedKey: ddControl.feedKey})" href="#" class="border-0">{{ddControl.tagButtonText()}}</a>' +
					'</div>' +
					'<div class="feed-line"  ng-if="ddControl.showDelete()">' +
                        '<span class="drop-sprite w-h-13 delete-mar delete-ico feed-font"></span>' +
                        '<a rg-click="ddAction()({event: $event, action:\'delete\', feedKey: ddControl.feedKey})" href="#" class="border-0">Delete</a>' +
                    '</div>' +
                    '<div class="feed-line"  ng-if="ddControl.showSaveOption()">' +
						'<span class="drop-sprite follow-drop save-ico w-h-13"></span>' +
						'<a rg-click="ddAction()({event: $event, action:\'save\', feedKey: ddControl.feedKey})" href="#" class="border-0">Save</a>' +
					'</div>' +
                    '<div class="feed-line"  ng-if="ddControl.showUnsaveOption()">' +
                        '<span class="drop-sprite w-h-13 delete-mar delete-ico feed-font"></span>' +
                        '<a rg-click="ddAction()({event: $event, action:\'unsave\', feedKey: ddControl.feedKey})" href="#" class="border-0">Unsave</a>' +
                    '</div>' +
				'</div>';


            $scope.actionFeedDropdown = function (actionObj) {
                rgDropdownService.close(actionObj.event);
                // console.log(actionObj);
                actionObj.event.preventDefault();
                switch (actionObj.action) {
                    case 'edit':
                        $scope.enableEditor(actionObj.feedKey);
                        break;
                    case 'edittag':
                        openRingBoxToEditTag();
                        break;
                    case 'delete':
                        $scope.deleteFeed(actionObj.feedKey);
                        break;
                    case 'save':
                        $scope.saveFeed(actionObj.feedKey,1);
                        break;
                    case 'unsave':
                        $scope.saveFeed(actionObj.feedKey,2);
                        break;
                    default:
                    //   console.log("no action matched");
                }
            };


            $scope.noDownload = function(event) {
                event.preventDefault();
                Ringalert.show('Currently download option is available in ringID desktop and mobile app version only.');
                 //Ringalert.alert({
                    //title : 'Download',
                    //message : 'Currently download option is available in ringID desktop and mobile app version only.',
                    //showCancel : false,
                    //okCallback : angular.noop//doLogoutTask
                 //});
            };


            $scope.selectAlbum = function(mediaMap) {
                return {
                        data: function () {
                            return {
                                media: mediaMap,
                                //album: feed.getAlbum(),
                                //playlist: feed.getAlbum().getContents().all(),
                                //feedTime: feed.time()
                            };
                        },
                        //promise: media.fetchDetails() // Media.fetchContentDetails(media, true, media.user())
                    };

            };

            // add to album dropdown
            //console.log('FEED AUDIOS: ' + $scope.feed.getAudios().length());
            //console.log('FEED VIDEOS: ' + $scope.feed.getVideos().length());
            // $scope.like = function (f) {
            //    // Ringalert.alert();return;
            //     feedFactory.likeUnlikeFeed($scope.keyid,f).then(function(json){ //success so show notification
            //        // Ringalert.show('','success');// passing empty in message to show default message
            //     },function(json){// failed so show notification
            //         Ringalert.show(json,'error');
            //     });
            //     if(f.like()){
            //         $scope.$broadcast('LikeChange',true);
            //     }

            // };


            $scope.enableEditor = function (feedKey) {
                //$scope.showDropdown = false;
                  var feed,boxInstance,requestData={};
                    feed = feedFactory.getFeed(feedKey);
                    requestData.localData = {feed:feed};
                    if(feed.showMore()){
                    		requestData.remoteData = feedFactory.moreFeedText(feed);
					} else {
							requestData.remoteData = false;
					}
 		            boxInstance = $ringbox.open({
                            type : 'remote',
                            scope:false,
                            controller: 'FeedEditController',
                            scrollable: true,
                            resolve :requestData,
                            templateUrl : 'pages/partials/news_feed/edit.html'
                    });

                    boxInstance.result.then(function(confirmed){
									// after edit update current Feed and digest
							if(confirmed.sucs){
									$scope.$rgDigest();
							} else {
									
							}
					});

                //$scope.showdroparrow = feedKey;
                //$scope.editorEnabled = true;
/*                var feedObj = feedFactory.getFeed(feedKey);*/

                //$scope.feedText = feedObj.text();
                //$scope.feedLocation =  angular.copy(feedObj.getLocationInfo());
                //$scope.ogData =  angular.copy(feedObj.getOgData());

                //if( $scope.ogData.image){
                    //$scope.ogData.images = [$scope.ogData.image];
                //}

                //$scope.ogShowPreview = feedObj.hasOgData();

                //$scope.emotions = [feedObj.getFeelings()];


                //var obj = {
                  //feedText:  $scope.feedText,
                  //feedLocation: $scope.feedLocation,
                  //feedKey: feedKey,
                  //ogData: $scope.ogData
                //};
				//if(feedObj.showMore()){
                    //feedFactory.moreFeedText(feedObj).then(function(json) {
						//obj.feedText = $scope.feedText=feedObj.text();
						//$scope.$rgDigest();
                    //});
				//}
                //$rootScope.$broadcast('enableeditor',obj);
                /*$scope.$rgDigest();*/
            };



            //$scope.cancelEdit = function () {
                //$scope.editorEnabled = false;
                //$scope.errorImageEdit = false;
                //$scope.$rgDigest();
            //};
            //function validateUpdate(){
                    //return !$scope.feedText
                        //&& !$scope.feedLocation.description
                        //&& !$scope.ogData.url
                        //&& !($scope.feelings && $scope.feelings.id)
                        //&& !$scope.feed.hasMedia()
                        //&& !$scope.feed.hasTagUsers();
            //}
            //$scope.updateFeed = function () {
                //$scope.feedText = $scope.feedText.trim();

                //if($scope.emotions.length){
                    //$scope.feelings = $scope.emotions[0];// we will support one emotion at a time for now
                    //$scope.emotions.length = 0;//emptying emotion
                //}else{
                    //$scope.feelings = false;
                //}

                ////$scope.showdroparrow = 0;



                //if(validateUpdate()){
                    //$scope.errorImageEdit = true;
                    //$scope.editorEnabled = true;
                //}else{
                    //feedFactory.updateFeed($scope.currentUser, $scope.keyid, $scope.feedText, $scope.feedLocation, $scope.ogData, $scope.feelings  ).then(function (json) {
                        //[> Isolated Directives will update based on this event <]
                        //$scope.editorEnabled = false;
                        //$scope.errorImageEdit = false;

                        //$scope.$rgDigest();

                        //$scope.$broadcast(SystemEvents.FEED.UPDATED, { id: $scope.keyid });

                    //},function(json){
                        //Ringalert.show(json,'error');
                        //$scope.$rgDigest();
                    //});
                //}
             //$scope.$rgDigest();


            //};

            $scope.deleteFeed = function (key) {
                    var message = 'Are you sure you want to delete?';
                    var boxInstance = $ringbox.open({
                            type : 'remote',
                            scope:false,
                            controller: 'RingBoxConfirmController',
                            resolve : {
                                localData : {
                                    message : message
                                }
                            },
                            templateUrl : 'templates/partials/ringbox-confirm.html'
                    });

                    boxInstance.result.then(function(confirmed){
                        if(confirmed){
                            feedFactory.deleteFeed($scope.currentUser, key).then(function (json) {
                                $scope.setFeed(true);
                                Ringalert.show(json,'success');
                            }, function(errJson){
                                $scope.setFeed(true);
                                Ringalert.show(errJson,'error');
                            });
                        }
                    });
            };

            $scope.saveFeed = function(key,optn){
                var status;
                feedFactory.saveFeed(key,optn).then(function(json){
                    if(json.sucs===true){
                        if(optn===1){
                            status = true;
                        }else{
                            status = false;
                        }
                        var feed = feedFactory.getFeed(key);
                        feed.setPortalSaveStatus(status);
                        $scope.$rgDigest();
                    }
                })
            };

            $scope.getShareData = function () {
                return function () {
                    return {keyid: $scope.keyid, feed: $scope.feed.hasSharedFeed() ? $scope.feed.getOrginalFeed():$scope.feed};
                };
            };
            $scope.getImageData = function (image, feed) {

                return function () {
                            return {
                               image: image,
                               feed: feed
                           };
                        };
            };

         $scope.getMediaData = function (media, feed) {

            return {
                    data: function () {
                        return {
                            media: media,
                            //album: feed.getAlbum(),
                            playlist: feed.getAlbum().getContents().all(),
                            feedTime: feed.time()
                        };
                    },
                    promise: media.fetchDetails() // Media.fetchContentDetails(media, true, media.user())
                };

         };
        $scope.getMediaFirstData = function(feed){
        		feed = feed || $scope.feed;
            var media = feed.getMedias().top();
            if(media){
                return $scope.getMediaData(media,feed);
            }
        };

        $scope.getAudioFirstData = function(feed){
        		feed  = feed || $scope.feed;
            var media = feed.getAudios().top();
            if(media){
                return $scope.getMediaData(media,feed);
            }
        };

         //$scope.getFeedHtml = function(){
            //return $scope.feed.getDynamicText();
         //};
            // $scope.fetchWhoLikes = function () {
            //     return {
            //         data: function () {
            //             return {
            //                 target: $scope.feed,
            //                 type:'feed'
            //             };
            //         },
            //         promise: feedFactory.fetchWhoLikesFeed($scope.feed)
            //     };
            // };


             //$scope.selectedFeedLocation = function(location){
                 //$scope.feedLocation = location;

                 //Utils.safeDigest($scope);
             //};

             //$scope.resetFeedLocation = function(){
                 //$scope.feedLocation = {};
             //};

         //setInterval(feedFactory.updateTime, 180000);
         //setInterval(function(){
         //    feedFactory.updateTime();
         //    $scope.$rgDigest();
         //}, 180000);

            $scope.goToFeed = goToFeed;

            $scope.isShareAble= function(f){
                f = f.hasSharedFeed() ? f.getOrginalFeed():f;
                return f.isShareAble();
             // return  f.hasSharedFeed() ?(!f.getOrginalFeed().user().isCurrentUser() && !f.user().isCurrentUser()):!f.user().isCurrentUser();
            };



             ///////////////////////////////


             //------------------ Public -------------------

             function goToFeed(feedUrl){
                 if(!!feedUrl){
                     $location.path(feedUrl);
                 }
             }

            function goToImage($event, imageUrl){
                if(!!imageUrl){
                    $location.path(imageUrl);
                }
            }
            function openRingBoxToEditTag () {

               var boxInstance = $ringbox.open({

                        type : 'remote',
                        scope:false,
                        controller: 'feedEditTagController',
                        resolve : {
                            localData : {
                                feed : $scope.feed
                            },
                            remoteData : function(){
                                if($scope.feed.hasTagUsers()){
                                    return feedFactory.getTagUsers($scope.feed);
                                }else{
                                    return {};
                                }
                            }
                        },
                        templateUrl : 'templates/home/feed-tag-user-edit.html'
                });



               boxInstance.result.then(function(updatedFeed){
                 if(!!updatedFeed){
                    $scope.feed = updatedFeed;
                 }
                 $scope.cancelEdit();
               });
            }

        $scope.openRingBoxLike = function(){
            return $scope.feed.getTotalLikes() > 0;
        };
        $scope.openRingboxShare = function(){

            return (($scope.feed.hasSharedFeed() ? $scope.feed.getOrginalFeed().getTotalShare() > 0 : $scope.feed.getTotalShare()) > 0) && !$scope.feed.isMediaShared() && !$scope.feed.isSingleContentFeed();
        };
        $scope.whoShareFalsyFunc = function(){
            if($scope.feed.isSingleContentFeed()){
                Ringalert.show("Oops! This feature is coming soon",'info');
            }
        };

         if(!$scope.skipSaveScope){
             var key = ($scope.feed.value)? $scope.feed.value.getKey(): $scope.feed.getKey();
             feedFactory.addScope(key,$scope);
             $scope.$on('$destroy',function(){
                 feedFactory.removeScope($scope.feed.getKey());
             });
         }


     }

