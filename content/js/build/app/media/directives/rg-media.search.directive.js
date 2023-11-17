/**
 * © Ipvision
 */


    angular
        .module('ringid.media')
        .directive('rgMediaSearch', rgMediaSearch);

    rgMediaSearch.$inject = [ '$document', 'Media', '$routeParams' ];
    function rgMediaSearch( $document, Media, $routeParams ) { // jshint ignore:line

        MediaSearchController.$inject = ['$$stackedMap','$$mediaMap','Storage', 'OPERATION_TYPES','Auth', '$scope', 'Media','userFactory','$$mediaAlbumMap','$location','rgDropdownService','$ringbox','Ringalert' ];
        function MediaSearchController ($$stackedMap, $$mediaMap,Storage, OPERATION_TYPES,Auth, $scope, Media,userFactory,$$mediaAlbumMap,$location,rgDropdownService,$ringbox,Ringalert ) { //jshint ignore:line

            var albumname = [];
            Storage.setData('albumname',albumname);
            $scope.medias = $$stackedMap.createNew(true,'desc');
            $scope.popupmedias = $$stackedMap.createNew(true,'desc');

            var OTYPES = OPERATION_TYPES.SYSTEM.MEDIA;

            $scope.recentMediaDropdown = 'templates/dropdowns/recent-media-dropdown.html';

            $scope.searchedMedia = $$stackedMap.createNew();
            $scope.trendingArr = [];
            $scope.nodatafound = false;
            $scope.noaudiofound = false;
            $scope.activeNav = 'recent';

            //var uploadProgress = false;

            var userMap = Auth.currentUser();
            $scope.utId =  userMap.getUtId();
            Media.fetchAllAlbums();


            function activate() {
                var mediaArr = Storage.getData('mediaRecent');
                for( var i = 0; i<mediaArr.length; i++ ) {
                    var media = $$mediaMap(mediaArr[i]);
                    $scope.medias.save(media.getKey(), media);
                }
            }
            activate();


            $scope.getRecentMediaData = function( mediaMap) {
                return {
                    data: function () {
                        return {
                            media: mediaMap ,
                            playlist: $scope.medias.all()
                            //popupForm: 'profile'
                        };
                    },
                    promise: mediaMap.fetchDetails() //Media.fetchContentDetails( mediaMap.getKey(), true, albumowner, mediaMap.getMediaUtId() )
                };

            };



            $scope.getTaggedMedia = function (obj) {
                Media.getTaggedMedia(obj);
            };

            $scope.goToMyAlbums = function (param) {
              var path = 'media/'+param;
                $location.path(path);
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

            $scope.actionRecentMediaDropdown = function(actionObject){
                switch(actionObject.action){
                    case 'addtoalbum':
                        console.log('addtoalbum');
                        var boxInstance = $ringbox.open({

                                type : 'remote',
                                scope:false,
                                onBackDropClickClose:true,
                                controller: 'RingBoxAlbumlistController',
                                resolve : {
                                    localData : {
                                        media : actionObject.data.obj
                                    }

                                },
                                templateUrl : 'templates/dropdowns/popup-album-dropdown.html'
                        });
                        break;
                    case 'sendtofriend':
                        console.log('sendtofriend');
                        break;
                    case 'shareatringid':
                    var instance = $ringbox.open({
                        type: 'remote',
                        scope: false,
                        controller: 'feedMediaShareController',
                        scopeData: {
                            media: actionObject.data.obj
                        },
                        onBackDropClickClose: true,
                        templateUrl: 'templates/home/share-media.html',
                    });
                    instance.result.then(function() {
                        $scope.$rgDigest();
                    });
                        console.log('shareatringid');
                        break;
                    case 'shareatfb':
                        console.log('shareatfb');
                        break;
                    case 'download':
                        console.log('download');
                        Ringalert.show('Currently download option is available in ringID desktop and mobile app version only','info');
                        break;
                    default:
                        break;
                }
            };

            // $scope.goToAlbum = function( obj ) {
            //     var url;
            //     albumname.push(obj.name);
            //     albumname.push(obj.mc);
            //     Storage.setData('albumname',albumname);
            //     switch ( obj.type ) {
            //         case 'audio':
            //             url = 'media/'+obj.type+'/'+obj.utid+'/'+obj.albumid;
            //             $location.path(url);
            //             break;
            //         case 'video':
            //             url = 'media/'+obj.type+'/'+obj.utid+'/'+obj.albumid;
            //             $location.path(url);
            //             break;
            //         default :
            //             url = 'media';
            //             $location.path(url);
            //             break;
            //     }
            // };


            // Media.getSearchTrends().then(function(data){
            //     if ( data.sucs === true ) {
            //         for(var i = 0; i < data.sgstn.length; i++) {
            //             //console.log(data.sgstn[i]);
            //             switch (data.sgstn[i].sugt){
            //                 case 1 :
            //                     data.sgstn[i].searchtype = 'songs';
            //                     break;
            //                 case 2 :
            //                     data.sgstn[i].searchtype = 'albums';
            //                     break;
            //                 case 3 :
            //                     data.sgstn[i].searchtype = 'tags';
            //                     break;
            //             }
            //             $scope.trendingArr.push(data.sgstn[i]);
            //         }
            //     }
            //     $scope.$rgDigest();
            // });


            $scope.$on('$destroy', function() {
                // $scope.trendingArr = [];
                Media.resetMediaAlbums();
            });
        }

        var linkFunc = function(scope,element) {
            element.bind('click',function(){
               //console.log(scope.medias.all());
            });
            //var input = element.find('input');
            //
            //input.on('keypress', function(event) {
            //    if(event.keyCode === 13) {
            //        event.preventDefault();
            //    }
            //});

        };

        return {
            restrict: 'E',
            controller: MediaSearchController,
            link: linkFunc,
            templateUrl: 'templates/partials/media-search.html'
        };
    }
