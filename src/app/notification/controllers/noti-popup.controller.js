/**
 *
 * © Ipvision
 */

    angular
        .module('ringid.notification' )
        .controller('NotiPopupController', NotiPopupController );

    NotiPopupController.$inject =
        ['$$connector', 'OPERATION_TYPES', 'Auth','$scope','localData','remoteData', 'NotificationFactory', '$$feedMap','feedFactory','rgDropdownService','Ringalert','MESSAGES'];
    function NotiPopupController($$connector, OPERATION_TYPES,  Auth, $scope,   localData,remoteData, notificationFactory, $$feedMap, feedFactory,rgDropdownService,Ringalert,MESSAGES) { // jshint ignore:line
        var OTYPES = OPERATION_TYPES.SYSTEM,OTYPES_NOTI = OPERATION_TYPES.SYSTEM.NOTIFICATION,showWhoShare=true;
        //console.warn(localData.notification.value.getCommentId());
        // view model
        $scope.currentUser = Auth.currentUser();
        $scope.feed = {};
        $scope.focused = false;
        $scope.showCommentBox = true;
        $scope.showFeedFullContent = true;

        $scope.nocontent = false;

        // dropdown specific data and methods
        $scope.ddHtml = 'templates/dropdowns/feed-edit-dropdown.html';


        // methods
        //$scope.like = likeFeed;
        $scope.getMediaData = getMediaData;
        // end mothods list



        if (localData && localData.notiKey) {
            $scope.key = localData.notiKey;
            $scope.noti = localData.noti;
            $scope.templateType = localData.templateType;

            // switch(localData.noti.getMessageType()){

            //     case OTYPES_NOTI.MSG_TYPE_LIKE_STATUS:
            //     case OTYPES_NOTI.MSG_TYPE_LIKE_COMMENT:
            //          showWhoShare = false;break;
            //     case OTYPES_NOTI.MSG_TYPE_SHARE_STATUS:

            //     case OTYPES_NOTI.MSG_TYPE_ADD_STATUS_COMMENT:
            //         showWhoShare = true;break;
            // };
        }
        // check what to show using nt, mt value

        $scope.boxIsLoading = false;
        if(remoteData.sucs === false) {
            $scope.nocontent = true;
            Ringalert.show(remoteData,'error');
            $scope.$close();
            return false;
        }else{

            var shareData = angular.fromJson(remoteData.newsFeedList)
            //console.log(remoteData.newsFeedList[0]);
            //

             if(showWhoShare && shareData[0] && shareData[0].orgFd){
                $scope.feed = $$feedMap.create(shareData[0]);
                var _d1 = $$feedMap.create(shareData[0].orgFd);
                $scope.feed.shares(_d1);
            }else{
                $scope.feed = $$feedMap.create(remoteData.newsFeedList[0]);
            }
                $scope.keyid = $scope.feed && $scope.feed.getKey();//used in template as keyid

        }


        // like on a comment in feed
        //if($scope.noti.getMessageType() === 8 && $scope.noti.getNotiType() === 2) {

            //  $$connector.subscribe(function(json) {
            //         console.log(commentJson);
            //         $scope.feed.pushComment(commentJson);
            //  },{
            //     action : OTYPES.ACTION_GET_FULL_COMMENT
            //  });
            // // get specific comment and highlight it
            //  feedFactory.fetchCommentById($scope.noti.getNewsFeedId(), $scope.noti.getCommentId()).then(function(commentJson) {
            //         console.log(commentJson);
            //         $scope.feed.pushComment(commentJson);
            //  });
        //}

        if( $scope.feed.hasMedia() || ( $scope.feed.hasSharedFeed() && $scope.feed.getOrginalFeed().getImages().length )){
            $scope.templateType = 'feed_with_image';
        }



        // function likeFeed (feed){

        //      var key = $scope.feed.getKey();
        //             feedFactory.likeUnlikeFeed(key,$scope.feed).then(function(json){
        //             });
        //             if($scope.feed.like()){
        //                 $scope.$broadcast('LikeChange',true);
        //             }
        // }




        if($scope.noti.getCommentId() > 0){
            $scope.activeCommentId = $scope.noti.getCommentId();
        }




        function getMediaData(media,feed) {
            if(!feed)feed = $scope.feed;
            return {
                    data: function () {
                        return {
                            media: media,
                            album: feed.getAlbum(),
                            feedTime: feed.time()
                        };
                    },
                    promise: media.fetchDetails()//Media.fetchContentDetails(media.getKey(),true, feed.user())
                };
         }




        $scope.shareMenuDisabled = $scope.shareMenuDisabled ? $scope.shareMenuDisabled : false;

        var commentInitialFetch = false;
        $scope.toggleCommentBox = function (event) {
            event.stopPropagation();
            $scope.showCommentBox = !$scope.showCommentBox;
            if($scope.showCommentBox) {
                $scope.showShareBox = false;
            }
        };

        $scope.toggleShareBox = function(event) {
            event.stopPropagation();
            var f = $scope.feed.hasSharedFeed() ? $scope.feed.getOrginalFeed():$scope.feed;
            var shareablle = f.isShareAble(true);
            if(shareablle.sucs) {
                $scope.showShareBox = !$scope.showShareBox;
                if($scope.showShareBox) {
                    $scope.showCommentBox = false;
                }
            } else {
                Ringalert.show(MESSAGES[shareablle.rc],'warning');
            }
        };
        $scope.getImageData = function (image, feed) {

                return function () {
                            return {
                               image: image,
                               feed: feed
                           };
                        };
            };
        //$scope.singleFeed = true;

    }
