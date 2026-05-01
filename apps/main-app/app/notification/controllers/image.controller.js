/**
 * © Ipvision
 */

    angular
        .module('ringid.notification')
        .controller('ImageController',
        ['$routeParams', '$scope', 'Auth', '$$imageMap', '$$stackedMap', 'AlbumFactory','$$connector','OPERATION_TYPES',
    function ImageController($routeParams, $scope, Auth, $$imageMap, $$stackedMap, AlbumFactory,$$connector,OPERATION_TYPES) { // jshint ignore:line

        /***
         *
         * Base Controller,
         * - Can't be used directly,
         * Need to Use With Wrapper Controller  (i.e, ringbox-image-popup.controller, single-image-controller
         *
         *
         */

        var imageList = $$stackedMap.createNew(),
            OTYPES  = OPERATION_TYPES.SYSTEM.IMAGE,
            imageSubscriptionKey,
            commentUpdateSubcriber;

        //$scope.currentUser = Auth.currentUser();
        //$scope.imageComments = [];
        //$scope.boxIsLoading = true;
        $scope.showCommentBox = true;
        $scope.nextImg = false;
        $scope.prevImg = false;

        $scope.changeImage = changeImage;
        $scope.openRingboxLike = openRingboxLike;
        $scope.actionImageDropdown = angular.noop;
        $scope.showOption = function(){
           return $scope.image.ddControl.showReportButton();
		}
        $scope.ddTemplate =
                '<div class="ng-cloak action-top feed-drop_top float-right">' +
                    '<div class="ac-top-line" ng-if="ddControl.showReportButton()">' +
                        '<span class="report-ico"></span>' +
                    '<a rg-report spam-type="{{ddControl.getSpamType()}}" spam-id="ddControl.getSpamId()">Report</a>' +
                    '</div>',
                '</div>';


        function openRingboxLike() {
            return $scope.image && $scope.image.getLikes() > 0;
        }

        function changeImage(direction) {
            // create image from image list
            if (direction === 'next') {
                if($scope.params.popupFrom === 'profile') {
                    // check if reached end of imagelist then call for more images
                    if( !imageList.previous($scope.image.getKey())) {
                        AlbumFactory.loadMoreImage($scope.image.getAlbumId(), $routeParams.uId);
                        //.then(function() {
                            //imageList = AlbumFactory.getAlbums($routeParams.uId).get($scope.image.getAlbumId()).getImages();
                            //$scope.image = imageList.next($scope.image.getKey()) || imageList.bottom();
                            //$scope.$rgDigest();
                        //});
                    } else {
                        $scope.image = imageList.next($scope.image.getKey()) || imageList.bottom();
                    }
                } else {
                    $scope.image = imageList.next($scope.image.getKey()) || imageList.bottom();
                }
            } else {
                $scope.image = imageList.previous($scope.image.getKey()) || imageList.top(); //$$imageMap.create(imageList[changeTo]);
            }
            //_setRotation(); // rotation need to be checked only once upon receiving image list. because now it'll rotate circular if there are more than one image
            // request comments;
            //initImageDetails();
            _preloadImage(direction);
            $scope.$rgDigest();
        }



        // get image list
        function _getImages(nfId) {
            if (nfId) {
                AlbumFactory.getFeedImages(nfId).then(function(response) {
                    if (response.sucs === true) {
                        var imageArray = response.newsFeedList[0].imageList,
                            image;
                        for(var i = 0, lt = imageArray.length; i < lt; i++) {
                            imageArray[i].nfId = response.nfId;
                            if(imageArray[i].imgId === $scope.image.getKey()){
                                $scope.image.updateImage(imageArray[i]);
                                imageList.save($scope.image.getKey(), $scope.image);
                            }else{
                                image = $$imageMap(imageArray[i], $scope.feed.user());
                                imageList.save(image.getKey(), image);
                            }

                        }
                        _setRotation();
                    }

                });
            } else {
                var albums = AlbumFactory.getAlbums($routeParams.uId);
                imageList = albums.get($scope.image.getAlbumId()).getImages();
                _setRotation();
            }
        }

        function _setRotation() {
            if(imageList.length() > 1) {
                $scope.nextImg = !!imageList.next($scope.image.getKey()) || !!imageList.bottom();
                $scope.prevImg = !!imageList.previous($scope.image.getKey()) || !!imageList.top();
            }
            $scope.$rgDigest();
        }

        function _preloadImage(direction) {
            var img = new Image(),
                imgObj;

            if (direction === 'next') {
                imgObj = imageList.next($scope.image.getKey());
            } else {
                imgObj = imageList.previous($scope.image.getKey());
            }
            setTimeout(function() {
                img.src = imgObj ? imgObj.src() : '';
            }, 200);
        }









        function _activate() {
            commentUpdateSubcriber = $$connector.subscribe(function(message){
                if($scope.image && $scope.image.getKey() === message.imgId){
                    $scope.image.setTotalComment(message.loc);
                    $scope.$rgDigest();
                }

            },{
                action :[OTYPES.TYPE_UPDATE_ADD_IMAGE_COMMENT,OTYPES.TYPE_UPDATE_DELETE_IMAGE_COMMENT]
            });


            imageSubscriptionKey = $$connector.subscribe(function(json) {
                    if (json.sucs === true) {
                        imageList = AlbumFactory.getAlbums($routeParams.uId).get($scope.image.getAlbumId()).getImages();
                        $scope.image = imageList.next($scope.image.getKey()) || imageList.bottom();
                        $scope.$rgDigest();
                    }
                }, {
                action: [
                    OTYPES.TYPE_ALBUM_IMAGES,
                    OTYPES.TYPE_FRIEND_ALBUM_IMAGES
                ]
            });

            if (!!$scope.params.image) { // image popup from profile photos tab
                $scope.image = $scope.params.image;
            } else if (!!$scope.params.imgId) { // image popup from notification dropdown
                    if(!!$scope.remoteData){
                        $scope.image = $scope.remoteData; //imageMap;
                    }else{
                        AlbumFactory.getImageDetails($scope.params.imgId).then(function (imageMap) {
                            $scope.image = imageMap;
                            $scope.$rgDigest();
                        });
                    }
            }

            if ($scope.params.feed) {
                // get list of images for the feed
                $scope.feed = $scope.params.feed;
                _getImages($scope.feed.getKey());
            }

            if ($scope.params.popupFrom === 'profile') { //
                // get album images
                _getImages();
            }

            $scope.$rgDigest();
        }

        _activate();

        $scope.$on('$destroy', function() {
            if(commentUpdateSubcriber){
                $$connector.unsubscribe(commentUpdateSubcriber);
            }
            $$connector.unsubscribe(imageSubscriptionKey);

        });
    }]);


