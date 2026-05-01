/**
 * © Ipvision
 */

angular
    .module('ringid.directives')
    .directive('rgPhotos', rgPhotos);


    rgPhotos.$inject = ['$window', '$document', 'Utils'];
    function rgPhotos($window, $document, Utils) { //jshint ignore:line

       PhotosController.$inject = ['rgScrollbarService', '$scope', '$rootScope', 'AlbumFactory', '$routeParams', 'userFactory',
           'fileUploadService', 'SystemEvents', 'Auth', '$ringbox', 'Ringalert', '$$connector', 'OPERATION_TYPES'];
       function PhotosController (rgScrollbarService, $scope, $rootScope, AlbumFactory, $routeParams, userFactory,
                                  fileUploadService, SystemEvents, Auth, $ringbox, Ringalert, $$connector, OPERATION_TYPES) { //jshint ignore:line

           var subscriptionKey,
                OTYPES = OPERATION_TYPES.SYSTEM.IMAGE;

            $scope.profileObj = userFactory.getUser($routeParams.uId);
            $scope.showAlbumPreview = true;
            $scope.activeAlbum = null;
            $scope.state = AlbumFactory.state;
            $scope.albums =  AlbumFactory.getAlbums($routeParams.uId);

            // controller methods
            $scope.loadMoreImage = loadMoreImage;
            $scope.deleteImage = deleteImage;
            $scope.getImageData = getImageData;
            $scope.toggleAlbumPreview = toggleAlbumPreview;
            $scope.selectPhoto = selectPhoto;


            function _toggleLoading(bool, type) {
                if (type === 'album') {
                    $scope.state.albumsLoading = bool;
                } else {
                    $scope.state.imagesLoading = bool;
                    rgScrollbarService.recalculate($scope);
                }

                $scope.$rgDigest();
            }

            function loadMoreImage () {
                if (!$scope.state.imagesLoading && $scope.activeAlbum.getImages().length() < $scope.activeAlbum.getTotalImageCount()) {
                    _toggleLoading(true, 'image');
                    AlbumFactory.loadMoreImage($scope.activeAlbum.getKey(), $routeParams.uId);
                    //.then(function() {
                        //_toggleLoading(false, 'image');
                    //}, function() {
                        //_toggleLoading(false, 'image');
                    //});

                }
            }


            function getImageData (imageMap) {
                return function() {
                    return {
                        image: imageMap,
                        popupFrom: 'profile'
                    };
                };
            }

            function deleteImage (imageMap) {
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
                        AlbumFactory.deleteImage(imageMap).then(function(response) {
                            if(response.sucs === true) {
                                // remove image from album image list
                                //AlbumFactory.getAlbums(Auth.currentUser().getKey()).get(imageMap.getAlbumId()).removeImage(imageMap.getKey());
                                $scope.activeAlbum.removeImage(imageMap.getKey());
                            } else {
                                Ringalert('Image delete failed', 'error');
                            }
                            $scope.$rgDigest();
                        });
                    }
                });
            }

            function toggleAlbumPreview(album) {
                if (album) {
                    $scope.activeAlbum  = album;
                    $scope.showAlbumPreview = false;
                    // load more image
                    if ($scope.activeAlbum.getImages().length() < 20) {
                        $scope.loadMoreImage();
                    }
                } else {
                    $scope.showAlbumPreview = true;
                    $scope.activeAlbum = null;
                }
                $scope.$rgDigest();
            }


            function selectPhoto (image){
                RingLogger.print('selected: ' + image.src(), RingLogger.tags.IMAGE);
                if ($scope.forSelection) {
                    $rootScope.$broadcast(SystemEvents.IMAGE.DO_REPOSITION, { image : image.src() });
                }
            }



            function _activate() {
                subscriptionKey = $$connector.subscribe(function(json) {
                        switch(json.actn) {
                            case OTYPES.TYPE_ALBUM_IMAGES:
                            case OTYPES.TYPE_FRIEND_ALBUM_IMAGES:
                                if (json.sucs === false && json.rc === 1111) {
                                    RingLogger.warning('ALBUM FETCH REQUEST REPEAT', RingLogger.tags.IMAGE);
                                    AlbumFactory.fetchAllAlbums($routeParams.uId);
                                } else {
                                    AlbumFactory.processResponse(json);
                                    _toggleLoading(false);
                                }
                                break;
                            case OTYPES.FETCH_FRIEND_ALBUM_LIST:
                            case OTYPES.FETCH_ALBUM_LIST:
                                if (json.sucs === false && json.rc === 1111) {
                                    RingLogger.warning('ALBUM IMAGES FETCH REQUEST REPEAT', RingLogger.tags.IMAGE);
                                    loadMoreImage();
                                } else {
                                    AlbumFactory.processResponse(json, $routeParams.uId);
                                    _toggleLoading(false, 'album');
                                }
                                break;
                        }

                    }, {
                    action: [
                        OTYPES.TYPE_ALBUM_IMAGES,
                        OTYPES.TYPE_FRIEND_ALBUM_IMAGES,
                        OTYPES.FETCH_FRIEND_ALBUM_LIST,
                        OTYPES.FETCH_ALBUM_LIST
                    ]
                });

                _toggleLoading(true, 'album');
                AlbumFactory.fetchAllAlbums($routeParams.uId);
            }
            _activate();

            $scope.$on('$destroy', function() {
                $scope.albums.reset();
                $$connector.unsubscribe(subscriptionKey);
            });

        }


        var linkFunc = function(scope, element) {

            function handleScroll() {
                if (!scope.showAlbumPreview) {
                    if ( ($window.innerHeight + $window.scrollY) >= $document[0].body.offsetHeight ) {
                        scope.loadMoreImage();
                    }
                }
            }

            if (scope.hasOwnProperty('forSelection') && (scope.forSelection === true || scope.forSelection === 'true') ) { //jshint ignore:line
                // add maxheight from utilsfactory
                element[0].children[0].children[0].style.overflow = 'hidden';
                element[0].children[0].children[0].style.maxHeight = Utils.viewportsize().y - 200 + 'px';

            } else {
                scope.forSelection = false;
                // load more image on scroll
                $window.addEventListener('scroll', handleScroll);

            }

            scope.$on('$destroy', function() {
                $window.removeEventListener('scroll', handleScroll);
            });

            scope.$rgDigest();
        };

        return {
            restrict: 'E',
            controller: PhotosController,
            link: linkFunc,
            templateUrl: 'templates/partials/photos.html',
            scope: {
                forSelection: '@forSelection',
                $close : '&boxClose'
            }
        };
    }
