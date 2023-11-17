/**
 * © Ipvision
 */


    angular
        .module('ringid.media')
        .directive('rgMedia', rgMedia);


        rgMedia.$inject = ['$window', '$document', 'Media', '$routeParams'];
        function rgMedia($window, $document, Media, $routeParams) { // jshint ignore:line

            MediaController.$inject = ['profileFactory', 'Auth', 'fileUploadService', 'SystemEvents', '$rootScope', '$scope', 'Media', '$location','$attrs','Storage',
                'OPERATION_TYPES', '$$connector', 'Utils', 'userFactory', '$$mediaAlbumMap', '$$stackedMap', 'mapFilterFilter', '$ringbox'];
            function MediaController (profileFactory, Auth, fileUploadService, SystemEvents, $rootScope, $scope, Media, $location,$attrs,Storage,
                                      OPERATION_TYPES, $$connector, Utils, User, $$mediaAlbumMap, $$stackedMap, mapFilterFilter, $ringbox) { //jshint ignore:line

                var subscriptionKey,
                    isCurrentUser = false,
                    albumTimeout,
                    OTYPES     = OPERATION_TYPES.SYSTEM.MEDIA,
                    profileObj = profileFactory.getProfile($routeParams.uId || 0);

                    $scope.profilePage = $attrs.inProfile;

                $scope.showMediaPreview = false;
                $scope.activeAlbum      = null;
                $scope.state            = Media.state;
                $scope.selectedPlaylist = $$stackedMap.createNew();

                $scope.getAlbums          = getAlbums;
                $scope.deleteMedia        = deleteMedia;
                $scope.toggleAlbumPreview = toggleAlbumPreview;
                $scope.getMediaData       = getMediaData;
                $scope.selectMedia        = selectMedia;
                $scope.loadMoreContent    = loadMoreContent;

                $scope.musicTab = true;
                $scope.showAlbumContents = false;

                if($routeParams.albumId){
                    $scope.showAlbumContents = true;
                    $scope.$rgDigest();
                }

                $scope.showDesiredTab = function(param){
                    switch(param) {
                        case 'music':
                            $scope.musicTab = true;
                            break;
                        case 'video':
                            $scope.musicTab = false;
                            break;
                    };
                    $scope.$rgDigest();
                }


                function toggleLoading(bool, type) {
                    if($scope.profilePage === 'false'){
                        return;
                    }
                    if (type === 'album') {
                        $scope.state.albumsLoading = bool;
                    } else {
                        $scope.state.contentsLoading = bool;
                    }
                    $scope.$rgDigest();
                }

                function getAlbums (type) {
                    if($scope.profilePage === 'true'){
                        return Media.getAlbums(profileObj.isCurrentUser(), type);
                    }else{
                        return Media.getAlbums(true, type);
                    }


                    //if (type) {
                        //return mapFilterFilter(_albums.all(), {mapApi: 'getType', value: type, compare:'regex'});
                    //} else {
                        //return _albums;
                    //}
                }

                function deleteMedia(mediaMap) {
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
                            Media.deleteMedia(mediaMap);
                        }
                    });
                }

                function toggleAlbumPreview(mediaMap,type) {
                    if($scope.profilePage === 'false'){
                        var url;var albumname = [];
                        albumname.push(mediaMap.getName());
                        albumname.push(mediaMap.getContentCount());
                        Storage.setData('albumname',albumname);
                        switch ( type ) {
                            case 'audio':
                                url = 'media/'+type+'/'+mediaMap.getALbumUtId()+'/'+mediaMap.getKey();
                                $location.path(url);
                                break;
                            case 'video':
                                url = 'media/'+type+'/'+mediaMap.getALbumUtId()+'/'+mediaMap.getKey();
                                $location.path(url);
                                break;
                            default :
                                url = 'media';
                                $location.path(url);
                                break;
                        }
                    }else{
                        if (mediaMap) {
                            window.location = mediaMap.link(profileObj);
                        } else {
                            window.location = Utils.getRingRoute('USER_PROFILE', { uId : profileObj.getUId(), utId : profileObj.getUtId(), subpage: 'media'});
                        }
                    }


                }

                function selectMedia(mediaMap, addToSelected) {
                    if (addToSelected) {
                        $scope.selectedPlaylist.add(mediaMap.getKey(), mediaMap);
                    } else {
                        $scope.selectedPlaylist.remove(mediaMap.getKey());
                    }
                }

                function getMediaData (playActive, mediaMap) {
                    var playlist;

                    if (playActive) {
                        playlist =  $scope.activeAlbum.getContents().all();
                    } else {
                        playlist = $scope.selectedPlaylist.all();
                    }
                    mediaMap = mediaMap || playlist[0].value;

                    return {
                            data: function () {
                                return {
                                    media: mediaMap,
                                    playlist: playlist,
                                    popupForm: 'profile'
                                };
                            },
                            promise: mediaMap.fetchDetails(profileObj) //Media.fetchContentDetails(mediaMap.getKey(), true, profileObj)
                        };
                }


                function loadMoreContent (force) {
                    if (force || !$scope.state.contentsLoading &&
                        $scope.activeAlbum &&
                        $scope.activeAlbum.getContents().length() < $scope.activeAlbum.getContentCount() ) {
                        toggleLoading(true);
                        Media.fetchAlbumContents({
                            albId: $scope.activeAlbum.getKey(),
                            utId: profileObj.getUtId(), // optional. maybe without utid just own media album list fetch
                            st: $scope.activeAlbum.getContents().length()
                        });

                    }
                }

                function activate() {
                    //if (Media.init()) {
                        //Media.fetchAllAlbums(profileObj.getUtId());
                    //}

                    //if (!profileObj.isCurrentUser()) {
                    //}


                    subscriptionKey = $$connector.subscribe(function(json) {
                        //var i, _albumOwner, l, album;
                        switch(json.actn) {
                            case OTYPES.ACTION_MEDIA_ALBUM_LIST:
                                //if (!albumTimeout && json.utId === profileObj.getUtId()) {
                                if (json.utId === profileObj.getUtId()) {
                                    setTimeout(function() {
                                        //clearTimeout(albumTimeout);
                                        if (!$scope.showMediaPreview) {
                                            $scope.activeAlbum = Media.getAlbum($routeParams.albumId);
                                            if ($scope.activeAlbum) {
                                                loadMoreContent(true);
                                            }
                                        }
                                        toggleLoading(false, 'album');
                                    }, 2000);
                                }
                                //} else {
                                    //toggleLoading(false, 'album');
                                //}
                                break;
                            case OTYPES.ACTION_MEDIA_ALBUM_CONTENT_LIST:
                                Media.processResponse(json);
                                setTimeout(function() {
                                    toggleLoading(false);
                                }, 1000);
                                break;
                        }

                    }, {
                        action:  [
                            OTYPES.ACTION_MEDIA_ALBUM_LIST,
                            OTYPES.ACTION_MEDIA_ALBUM_CONTENT_LIST,
                        ]
                    });


                    if ($routeParams.albumId) {
                        $scope.showMediaPreview = false;
                        $scope.activeAlbum = Media.getAlbum($routeParams.albumId);
                        if ($scope.activeAlbum) {
                            loadMoreContent(true);
                        }
                        toggleLoading(true);
                    } else {
                        $scope.showMediaPreview = true;
                    }
                    if (!profileObj.isCurrentUser()) {
                        Media.fetchAllAlbums(profileObj.getUtId());
                        toggleLoading(true, 'album');
                    }


                    if (Media.init()) {
                        toggleLoading(true, 'album');
                    }


                }//end activate()

                activate();

                //currently not in use : used for 'view all' purpose
                if($scope.profilePage==='false'){
                    $scope.limitItem = 4;
                }else{
                    $scope.limitItem = 'Infinity';
                }
                //currently not in use

                $scope.$on('$destroy', function() {
                    // reset and unsubscribe media albums
                    $$connector.unsubscribe(subscriptionKey );
                    Media.resetMediaAlbums();
                });

            }


            var linkFunc = function(scope, element, attrs) {
                //var contentLength = 0, totalContentLength = 0;
                function handleScroll () {
                    if (!scope.showMediaPreview) {
                        if ( ($window.innerHeight + $window.scrollY) >= $document[0].body.offsetHeight ) {
                            scope.loadMoreContent(true);
                        }
                    }
                }

                $window.addEventListener('scroll', handleScroll);
                scope.$on('$destroy', function() {
                    $window.removeEventListener('scroll', handleScroll);
                });

            };

            return {
                restrict: 'E',
                controller: MediaController,
                link: linkFunc,
                // templateUrl: 'templates/partials/media.html'
                templateUrl: function(element,attrs) {
                    return attrs.templatepath;
                }
            };
        }


