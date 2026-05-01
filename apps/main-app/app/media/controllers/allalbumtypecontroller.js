/**
 * © Ipvision
 */


    angular
        .module('ringid.media')
        .controller('allAlbumTypeController',allAlbumTypeController);

    allAlbumTypeController.$inject = ['$$stackedMap','$$mediaMap','$$mediaAlbumMap','Storage','userFactory','Auth','$routeParams','OPERATION_TYPES','$scope','Media','$location','$$connector','Ringalert'];
    function allAlbumTypeController ( $$stackedMap,$$mediaMap,$$mediaAlbumMap,Storage,userFactory, Auth, $routeParams ,OPERATION_TYPES, $scope, Media,$location,$$connector,Ringalert ) {
        $scope.albumName = Storage.getData('albumname')[0];
        $scope.mediaCount = Storage.getData('albumname')[1];
        $scope.albumtype = $routeParams.albumtype;
        $scope.utid = $routeParams.utid;
        $scope.albumid = $routeParams.albumid;
        $scope.songsArray = [];
        $scope.songs = $$stackedMap.createNew();
        $scope.selectedPlaylist = $$stackedMap.createNew();
        $scope.myAlbumsMap = $$stackedMap.createNew();

        var OTYPES = OPERATION_TYPES.SYSTEM.MEDIA;
        $scope.userallalbum = false;
        $scope.showSearchDropdown = false;
        $scope.stoploader = false;
        $scope.loadMoreSong = false;
        var mdaType;

        //var albumOwner = (Auth.currentUser().getUtId() ===  $scope.utid) ? Auth.currentUser() : User.create({utId: json.utId});

        if ( !$routeParams.utid && !$routeParams.albumid ) {

            var currentUser = Auth.currentUser();
            $scope.utid = currentUser.getUtId();
            if($routeParams.albumtype === 'audio'){
                mdaType = 1;
            }else if($routeParams.albumtype === 'video'){
                mdaType = 2;
            }else{
                $location.path('media');
            }
            Media.fetchAllAlbums($scope.utid,$scope.albumtype);
            //$scope.useralbumlist = Media.getAlbums($scope.albumtype);
            $scope.userallalbum = true;
        }
        if ( isNaN($scope.utid) && isNaN($scope.albumid) ) {
            $location.path('media');
        }

        $scope.goToAlbum = function( obj ) {
            var url;
            var albumname = [];
            albumname.push(obj.name);
            albumname.push(obj.mc);
            Storage.setData('albumname',albumname);
            switch ( obj.type ) {
                case 'audio':
                    url = 'media/'+obj.type+'/'+obj.utid+'/'+obj.albumid;
                    $location.path(url);
                    break;
                case 'video':
                    url = 'media/'+obj.type+'/'+obj.utid+'/'+obj.albumid;
                    $location.path(url);
                    break;
                default :
                    url = 'media';
                    $location.path(url);
                    break;
            }
        };

        $scope.loadMoreMedia = function (songcount) {
            $scope.loadMoreSong = true;
            Media.fetchAlbumContents({
                albId: $scope.albumid,
                utId: $scope.utid, // optional. maybe without utid just own media album list fetch
                st: songcount
            });
        };

        if( $scope.utid && $scope.albumid ){
            Media.fetchAlbumContents({
                albId: $scope.albumid,
                utId: $scope.utid // optional. maybe without utid just own media album list fetch
            });
            $scope.albumMap = $$mediaAlbumMap.createAlbum({
                albn: $scope.albumName, // album name
                albId: $scope.albumid,
                //mdaT:have to use conditionaly
                utId: $scope.utid // owner user utid
            });
        }

        $scope.selectMedia = selectMedia;
        function selectMedia(mediaMap, addToSelected) {
            if (addToSelected) {
                $scope.selectedPlaylist.add(mediaMap.getKey(), mediaMap);
            } else {
                $scope.selectedPlaylist.remove(mediaMap.getKey());
            }
        }

        $scope.getMediaData = getMediaData;
        function getMediaData (playActive, mediaMap) {
            var playlist;

            if (playActive) {
                playlist =  $scope.songs.all();
            } else {
                playlist = $scope.selectedPlaylist.all();
            }
            mediaMap = mediaMap || playlist[0].value;

            return {
                    data: function () {
                        return {
                            media: mediaMap,
                            playlist: playlist
                        };
                    },
                    promise: mediaMap.fetchDetails() //Media.fetchContentDetails(mediaMap.getKey(), true, profileObj)
                };
        }



        $scope.$on('$destroy', function() {
            $$connector.unsubscribe(subscriptionKey);
        });

        var subscriptionKey = $$connector.subscribe(albumContentProcess, {
            action: [
                    OTYPES.ACTION_MEDIA_ALBUM_CONTENT_LIST,//261
                    OTYPES.ACTION_MEDIA_ALBUM_LIST//256
                ]
        });

        function albumContentProcess(data){
            var i;
            switch (data.actn) {
                case OTYPES.ACTION_MEDIA_ALBUM_CONTENT_LIST:
                    if( data.sucs === true ){

                        for( i=0;i<data.mdaCntntLst.length;i++ ) {

                            //thealbum.pushContent(data.mdaCntntLst);

                            data.mdaCntntLst[i].utId = $scope.utid;
                            var media = $$mediaMap( data.mdaCntntLst[i] );
                            $scope.songs.save( media.getKey(),media );
                        }
                        //$scope.thealbum = thealbum;
                        $scope.loadMoreSong = false;
                    }else{
                        $scope.loadMoreSong = false;
                        $scope.stoploader = true;
                    }
                    break;
                case OTYPES.ACTION_MEDIA_ALBUM_LIST:
                    if ( data.sucs === true ) {
                        for( i = 0; i < data.mediaAlbumList.length; i++ ) {
                            if( data.mediaAlbumList[i].mdaT===mdaType ){
                                var albumMap = $$mediaAlbumMap.createAlbum( data.mediaAlbumList[i] );
                                $scope.myAlbumsMap.save( albumMap.getKey(), albumMap );
                            }
                        }
                    }else{
                        $scope.stoploader = true;
                    }
                    break;
                default :
                    break;
            }
            $scope.$rgDigest();
        }

    }

