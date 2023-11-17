/**
 * © Ipvision
 */


    angular
        .module('ringid.media')
        .controller('mSearchResultController',mSearchResultController);

        mSearchResultController.$inject = [ 'Auth','Storage', 'userFactory', '$routeParams', '$$mediaAlbumMap','$$stackedMap','$$mediaMap','$scope', 'Media','$location','$$connector','OPERATION_TYPES'];
        function mSearchResultController (  Auth,Storage, userFactory, $routeParams, $$mediaAlbumMap,$$stackedMap,$$mediaMap, $scope, Media,$location,$$connector,OPERATION_TYPES ) {

            var albumname         = [];
            Storage.setData('albumname',albumname);
            $scope.stype          = $routeParams.stype;
            $scope.searchkey      = decodeURI($routeParams.sk);
            var sugt;
            var OTYPES             = OPERATION_TYPES.SYSTEM.MEDIA;
            $scope.loadMoreSongs   = false;
            $scope.loadMoreAlbums  = false;
            $scope.showSearchTitle = true;

            var contentIdArray    = [];
            var albumIdArray      = [];
            $scope.searchedTagArr = [];
            var  searchedSongMap    = $$stackedMap.createNew(),
                searchedAlbumsMap   = $$stackedMap.createNew();

            $scope.searchedSongs = function(){
                return searchedSongMap;
            };

            $scope.searchedAlbums = function(){
                return searchedAlbumsMap
            };

            switch ($routeParams.stype) {
                case 'songs':
                    sugt =1;
                    break;
                case 'albums':
                    sugt = 2;
                    break;
                case 'tags':
                    sugt = 3;
                    break;
                default :
                    sugt=1;
                    break;
            }

            $scope.showSearchDropdown = false;

            var userMap = Auth.currentUser();

            $scope.searchsongsection  = false;
            $scope.searchalbumsection = false;
            $scope.searchtagsection   = false;
            $scope.noresultsection    = false;
            // Media.resetSearchedSongs();
            // Media.resetSearchedAlbum();
            // Media.resetSearchedTagArr();

            if ( $scope.stype !== 'tag' ) {
                var obj = {
                    sk:$scope.searchkey,
                    sugt:sugt
                };
                Media.fetchContent( obj );
            }

            switch ( $scope.stype ) {
                case 'songs' :
                    $scope.searchsongsection = true;
                    break;
                case 'albums' :
                    $scope.searchalbumsection = true;
                    break;
                case 'tags' :
                    $scope.searchtagsection = true;
                    break;
                case 'tag' :
                    $scope.searchsongsection = true;
                    $scope.showSearchTitle = false;
                    if( !isNaN( $scope.searchkey ) ){
                        Media.getTaggedMedia(parseInt($scope.searchkey));
                    }
                    break;
            }

            //$scope.searchedSongs  = Media.getSearchedSongs;
            //$scope.searchedAlbums = Media.getSearchedAlbums;
            $scope.searchedTags   = Media.getSearchedTagArr();
            $scope.cntntidarray   = Media.getContentIdArray;
            $scope.albumidarray   = Media.getAlbumIdArray;
            // $scope.state          = Media.state;
            $scope.noresultfound  = false;

            $scope.loadMoreSuggestedSongs = function() {
                $scope.loadMoreSongs = true;
                var reqData = {
                    sk:$scope.searchkey,
                    sugt:sugt,
                    pvtid:contentIdArray.pop(),
                    scl:2
                };
                Media.fetchContent( reqData );
                Media.resetContentIdArray();
                $scope.$rgDigest();
            };

            $scope.loadMoreSuggestedAlbums = function() {
                $scope.loadMoreAlbums = true;
                var reqData = {
                    sk:$scope.searchkey,
                    sugt:sugt,
                    pvtid:albumIdArray.pop(),
                    scl:2
                };
                Media.fetchContent( reqData );
                Media.resetAlbumIdArray();
                $scope.$rgDigest();
            };

            $scope.getTaggedMedia = function ( obj ) {
                var searchurl = 'media/tag/'+obj.htid;
                $location.path(encodeURI(searchurl));
            };

            $scope.goToAlbum = function( obj ) {
                var url;
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

            $scope.getMediaData = function( mediaMap ) {
                return {
                    data: function () {
                        return {
                            media: mediaMap,
                            playlist: [{key: mediaMap.getKey(), value: mediaMap}]
                            //popupForm: 'profile'
                        };
                    },
                    promise: mediaMap.fetchDetails() // Media.fetchContentDetails( mediaMap.getKey(), true, albumowner, mediaMap.getMediaUtId() )
                };
            };

            var subscriptionKey = $$connector.subscribe(searchContentProcess, {
                action: [
                    OTYPES.ACTION_SPECIFIC_MEDIA_RESULT,//278
                    OTYPES.ACTION_GET_TAGGED_MEDIA_SONGS//279
                ]
            });



            function searchContentProcess(json) {
                console.log(json);
                // var i;
                $scope.loadMoreSongs = false;
                $scope.loadMoreAlbums = false;

                switch( json.actn ){
                    case OTYPES.ACTION_SPECIFIC_MEDIA_RESULT://278
                        $scope.noresultfound = false;
                        var loopLength;
                        if ( json.sucs === true ) {
                            if(json.tr===10){
                                loopLength = json.mdaLst.length-1;
                            }else{
                                loopLength = json.mdaLst.length;
                                $scope.noresultfound = true;
                            }
                            for(var i=0;i<loopLength;i++){
                                if(json.mdaLst[i].sugt===1){
                                    contentIdArray.push(json.mdaLst[i].cntntId);
                                    json.mdaLst[i].viewtime = new Date().getTime();
                                    obj = $$mediaMap(json.mdaLst[i]);
                                    searchedSongMap.save(obj.getKey(),obj);
                                }
                                if(json.mdaLst[i].sugt===2) {

                                    albumIdArray.push(json.mdaLst[i].albId);
                                    obj = $$mediaAlbumMap.createAlbum(json.mdaLst[i]);
                                    searchedAlbumsMap.save(obj.getKey(),obj);
                                }
                                if ( json.mdaLst[i].sugt===3 ) {
                                    console.log(json.mdaLst[i]);
                                    $scope.searchedTagArr.push(json.mdaLst[i]);
                                }

                            }
                        } else {
                              $scope.noresultfound = true;
                        }
                        break;

                    case OTYPES.ACTION_GET_TAGGED_MEDIA_SONGS://279
                         $scope.noresultfound = false;
                        if(json.sucs===true){
                            for(i=0;i<json.mdaLst.length;i++){
                                console.log(json.mdaLst[i]);
                                obj = $$mediaMap(json.mdaLst[i]);
                                searchedSongMap.save(obj.getKey(),obj);
                            }
                        } else {
                             $scope.noresultfound = true;
                        }
                        break;
                }

                // if(json.sucs===true){

                // }else{
                //     console.log('no data found');
                // }
                // Media.init();
                 $scope.$rgDigest();
            }

            $scope.$on('$destroy', function() {
                $$connector.unsubscribe(subscriptionKey);
                searchedSongMap.reset();
                searchedAlbumsMap.reset()
                // Media.resetSearchedAlbum;
                // Media.resetSearchedTagArr();
            });

        }

