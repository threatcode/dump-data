/**
 * © Ipvision
 */

    angular
            .module('ringid.notification')
            .controller('MediaController', MediaController);


    MediaController.$inject =
            ['APP_CONSTANTS', 'fileUploadService', '$routeParams', '$scope', 'Auth', 'rgDropdownService', 'Media', '$$connector', 'OPERATION_TYPES', 'Ringalert', 'feedFactory', '$ringbox', '$$mediaMap'];
    function MediaController(APP_CONSTANTS, fileUploadService, $routeParams, $scope, Auth, rgDropdownService, Media, $$connector, OPERATION_TYPES, Ringalert, feedFactory, $ringbox, $$mediaMap) { // jshint ignore:line

        /***
         *
         * Base Controller,
         * - Can't be used directly,
         * Need to Use With Wrapper Controller  (i.e, ringbox-image-popup.controller, single-image-controller
         *
         */
        var OTYPES = OPERATION_TYPES.SYSTEM.MEDIA,
                AC = APP_CONSTANTS,
                commentUpdateSubcriber;

        $scope.currentUser = Auth.currentUser();
        $scope.showCommentBox = true;


        $scope.changeMedia = changeMedia;
        // $scope.fetchWhoLikes = fetchWhoLikes;
        $scope.actionImageDropdown = angular.noop;
        $scope.showOptionMenu = function(){
	    	return $scope.media.ddControl.showReportButton() || $scope.media.ddControl.showAddToAlbum();
		}
        $scope.ddTemplate =
                '<div class="ng-cloak action-top vp-position float-right">' +
                    '<div class="ac-top-line" ng-if="ddControl.showReportButton()">' +
                        '<span class="report-ico"></span>' +
                        '<a rg-report spam-type="{{ddControl.getSpamType()}}" spam-id="ddControl.getSpamId()">Report</a>' +
                    '</div>'+
                    '<div class="ac-top-line" ng-if="ddControl.showAddToAlbum()">'+
                            '<span class="share-ico"></span>'+
                                '<a rg-ringbox="true" ringbox-controller="RingBoxAlbumlistController" ringbox-animation="true"'+
                                    'ringbox-type="remote" ringbox-target="templates/dropdowns/popup-album-dropdown.html" ringbox-data="ddControl.getRingboxData()">Add to Album</a>'+
                    '</div> '+
                '</div>';



        if ($scope.params && $scope.params.popupFrom === 'notification') {
            if ($scope.remoteData && $scope.remoteData.sucs) {
                $scope.media = $$mediaMap($scope.remoteData.mdaCntntDTO);
                $scope.album = Media.getAlbum($scope.media.getAlbumId());
            } else {
                $scope.$close();
            }
        } else {
            $scope.media = $scope.params.media;
            //$scope.album = $scope.params.album;
            $scope.playlist = $scope.params.playlist;
        }

        if ($scope.media && !$scope.media.owner().hasDetails()) {
            $scope.media.owner().requestUserDetails().then(function() {
                $scope.$rgDigest();
            });
        }


        function initMedia() {
            $scope.media.increaseView().then(function() {
                $scope.$rgDigest();
            }, function() {
                $scope.$rgDigest();
            });
        }

        $scope.selectAlbum = selectAlbum;

        function selectAlbum(mediaMap) { // jshint ignore:line
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
        }



        function changeMedia(media) {
            $scope.media = media;
            $scope.media.fetchDetails();
            initMedia();
            $scope.$rgDigest();
        }



        // function fetchWhoLikes () {
        //     return {
        //         data: function () {
        //             return {
        //                 target: $scope.media
        //             };
        //         },
        //         promise:  Media.fetchLikeList($scope.media)
        //     };
        // }

        $scope.shareMedia = function() {
                var instance = $ringbox.open({
                    type: 'remote',
                    scope: false,
                    controller: 'feedMediaShareController',
                    scopeData: {
                        media: $scope.media
                    },
                    onBackDropClickClose: true,
                    templateUrl: 'templates/home/share-media.html',
                });
                instance.result.then(function() {
                    $scope.$rgDigest();
                });
        };


        commentUpdateSubcriber = $$connector.subscribe(function(message) {
            if ($scope.media && $scope.media.getKey() === message.cntntId) {
                $scope.media.setTotalComment(message.loc);
            }
        }, {
            action: [
                OTYPES.ACTION_UPDATE_ADD_MEDIA_COMMENT,
                OTYPES.ACTION_UPDATE_DELETE_MEDIA_COMMENT
            ]
        });

        $scope.$on('$destroy', function() {
            if (commentUpdateSubcriber) {
                $$connector.unsubscribe(commentUpdateSubcriber);
            }
        });
    }

