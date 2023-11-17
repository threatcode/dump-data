/**
 * © Ipvision
 */

    angular
            .module('ringid.controllers')
            .controller('AlbumlistController', AlbumlistController);


    AlbumlistController.$inject = ['APP_CONSTANTS',  '$scope', 'Media', 'Ringalert', 'OPERATION_TYPES', '$$connector', '$ringbox', 'fileUploadService'];
    function AlbumlistController(APP_CONSTANTS, $scope,  Media,  Ringalert, OPERATION_TYPES, $$connector, $ringbox, fileUploadService) { // jshint ignore:line

        var OTYPES = OPERATION_TYPES.SYSTEM.MEDIA,
            mediaInAlbums = [],
            albumType,
            AC = APP_CONSTANTS,
            subscriptionKey;

        $scope.selectedAlbum = null;
        $scope.albumName = '';
        $scope.media = $scope.params.media;
        $scope.selectAlbum = selectAlbum;
        $scope.createAlbumPopup = createAlbumPopup;



        $scope.existsInAlbum = function(albumId) {
            if ($scope.selectedAlbum) {
                return  $scope.selectedAlbum.getId() === albumId || mediaInAlbums.indexOf(albumId) > -1;
            } else {
                // check if album list
                return mediaInAlbums.indexOf(albumId) > -1;
            }
        };


        $scope.addToAlbum = function() {
            if ($scope.media && $scope.selectedAlbum) {
                $scope.selectedAlbum.addNewContent($scope.media);
            } else if ($scope.selectedAlbum){
                fileUploadService.setUploadAlbum($scope.selectedAlbum.getId());
            }
            $scope.close();
        };

        $scope.getAlbums = function() {
            return Media.getAlbums(true, albumType);
        };

        function createAlbumPopup() {
           var boxInstance = $ringbox.open({
                    type : 'remote',
                    resolve : {
                        localData : {
                            mdaT : (albumType === 'audio') ? AC.NEWS_FEED_MEDIA_TYPE_AUDIO : AC.NEWS_FEED_MEDIA_TYPE_VIDEO
                        }
                    },
                    scope:false,
                    controller: 'AlbumCreateController',
                    templateUrl : "templates/popups/create-album-popup.html"
            });

           boxInstance.result.then(function(albumMap){
            if (albumMap) {
                $scope.selectedAlbum = albumMap;
                //$scope.selectedAlbum.addNewContent($scope.media);
                $scope.$rgDigest();
               }
           });
        }



        function selectAlbum(actionObj) { // jshint ignore:line
            switch (actionObj.action) {
                case 'select':
                    if ( $scope.selectedAlbum && $scope.selectedAlbum.getKey() === actionObj.albumMap.getKey() ) {
                        break;
                    } else if (mediaInAlbums.indexOf(actionObj.albumMap.getKey()) > -1) {
                        $scope.selectedAlbum = null;
                    } else {
                        $scope.selectedAlbum = actionObj.albumMap;
                        //$scope.selectedAlbum.addNewContent($scope.media);
                        RingLogger.information('Selected Album: ' + $scope.selectedAlbum.getName(), RingLogger.tags.UPLOAD);
                    }
                    break;
                //case 'toggleCreate':
                    //$scope.createAlbum = !$scope.createAlbum;
                    //break;
            }
            $scope.$rgDigest();
        }


        function activate() {

            Media.init();
            subscriptionKey = $$connector.subscribe(function() {
                setTimeout(function() {
                    $scope.$rgDigest();
                }, 500);

            }, {
                action:  [
                    OTYPES.ACTION_MEDIA_ALBUM_LIST
                ]
            });

            if ($scope.media) {
                albumType = ($scope.media.isAudio() ? 'audio' : 'video');
                // fetch list of albums media is already part of
                Media.makeApiCall('mediaInAlbums', {strmURL: $scope.media.getStreamUrlOnly()}).then(function(json) {
                     RingLogger.print(json, RingLogger.tags.MEDIA);
                     if (json.sucs === true) {
                          mediaInAlbums = json.albIds;
                          $scope.$rgDigest();
                     }

                });

            } else {
                albumType = $scope.params.mediaType;
            }

        }
        activate();

        $scope.$on('$destroy', function() {
            $$connector.unsubscribe(subscriptionKey);
        });


    }


