
/*
 * © Ipvision
 */


	angular
		.module('ringid.shared')
        .factory('Media', MediaFactory);


        MediaFactory.$inject = ['mapFilterFilter',  'Utils', 'Ringalert',  'userFactory', 'Auth', '$routeParams','Storage',  'OPERATION_TYPES',
            'APP_CONSTANTS', 'mediaHttpService', '$$mediaAlbumMap', '$$mediaMap', '$$stackedMap', '$$q', '$$connector', 'SystemEvents', '$rootScope'];
        function MediaFactory(mapFilterFilter,  Utils, Ringalert, User, Auth, $routeParams, Storage,  OPERATION_TYPES,
                              APP_CONSTANTS, mediaHttpService, $$mediaAlbumMap, $$mediaMap, $$stackedMap, $q, $$connector, SystemEvents, $rootScope) { // jshint ignore:line
            var _state = {
                    albumsLoading: false,
                    contentsLoading: false,
                    noresultfound:false
                },

                initialized = false,
                _albums = $$stackedMap.createNew(),
                _userAlbums =  $$stackedMap.createNew(),
                _otherAlbums = $$stackedMap.createNew(),

                _searchedAlbums = $$stackedMap.createNew(),
                _searchesongs   = $$stackedMap.createNew(),
                _albumOwner,
                _utId           = 0,
                OTYPES          = OPERATION_TYPES.SYSTEM.MEDIA,
                REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE,
                AC              = APP_CONSTANTS,
                subscriptionKey,
                searchedTagArr  = [],
                contentIdArray  = [],
                albumIdArray    = [];
                //mediaRecent     = Storage.getData('mediaRecent');


            function _processResponse(json) {
                
                var album, i, l, albId;
                switch(json.actn) {
                    case OTYPES.ACTION_MEDIA_ALBUM_LIST:
                        if(json.sucs === true && json.mediaAlbumList) {
                            _albumOwner = (Auth.currentUser().getUtId() === json.utId) ? Auth.currentUser() : User.create({utId: json.utId});
                            for(i = 0, l = json.mediaAlbumList.length; i < l; i++) {
                                albId = json.mediaAlbumList[i].albId || json.mediaAlbumList[i].id;
                                album = _albums.get(albId) || _userAlbums.get(albId);
                                if (album) {
                                    album.updateAlbum(json.mediaAlbumList[i]);
                                } else {
                                    album = $$mediaAlbumMap.createAlbum(json.mediaAlbumList[i], _albumOwner);
                                }

                                if(_albumOwner && _albumOwner.isCurrentUser()) {
                                    _albums.save(album.getKey(), album);
                                } else {
                                    _userAlbums.save(album.getKey(), album);
                                }
                                //_albumList[album.getKey()] = album;
                            }
                        } else {
                        }
                        break;
                    case  OTYPES.ACTION_MEDIA_ALBUM_CONTENT_LIST:
                        if(json.sucs === true && json.mdaCntntLst) {
                            var key = $$mediaAlbumMap.createKey(json);
                            album = _albums.get(key) || _userAlbums.get(key); // || _albumList[key];
                            if(album) {
                                album.pushContent(json.mdaCntntLst);
                            } else {
                            }

                        } else {
                        }
                        break;
                    // case OTYPES.ACTION_SPECIFIC_MEDIA_RESULT://278
                    //     _state.noresultfound = false;var loopLength;
                    //     if ( json.sucs === true ) {
                    //         if(json.tr===10){
                    //             loopLength = json.mdaLst.length-1;
                    //         }else{
                    //             loopLength = json.mdaLst.length;
                    //             _state.noresultfound = true;
                    //         }
                    //         for(i=0;i<loopLength;i++){
                    //             if(json.mdaLst[i].sugt===1){
                    //                 contentIdArray.push(json.mdaLst[i].cntntId);
                    //                 json.mdaLst[i].viewtime = new Date().getTime();
                    //                 obj = $$mediaMap(json.mdaLst[i]);
                    //                 _searchesongs.save(obj.getKey(),obj);
                    //             }
                    //             if(json.mdaLst[i].sugt===2) {

                    //                 albumIdArray.push(json.mdaLst[i].albId);
                    //                 obj = $$mediaAlbumMap.createAlbum(json.mdaLst[i]);
                    //                 _searchedAlbums.save(obj.getKey(),obj);
                    //             }
                    //             if ( json.mdaLst[i].sugt===3 ) {
                    //                 console.log(json.mdaLst[i]);
                    //                 searchedTagArr.push(json.mdaLst[i]);
                    //             }

                    //         }
                    //     } else {
                    //           _state.noresultfound = true;
                    //     }
                    //     break;
                    // case OTYPES.ACTION_GET_TAGGED_MEDIA_SONGS:
                    //      _state.noresultfound = false;
                    //     if(json.sucs===true){
                    //         for(i=0;i<json.mdaLst.length;i++){
                    //             obj = $$mediaMap(json.mdaLst[i]);
                    //             _searchesongs.save(obj.getKey(),obj);
                    //         }
                    //     } else {
                    //          _state.noresultfound = true;
                    //     }
                    //     break;
                    //case OTYPES.ACTION_MEDIA_SEARCH_RESULT:
                    //    if ( json.sucs === true ) {
                    //        for(i=0;i<json.sgstn.length;i++){
                    //            mediaSearchResult.push(json.sgstn[i]);
                    //        }
                    //    }else{
                    //
                    //    }
                    //    break;

                    //case  OTYPES.ACTION_MEDIA_LIKE_LIST:
                        //if (json.sucs === true && json.likes) {
                            //mediaMap = getMediaMap(json.cntntId);
                            //if(mediaMap) {
                                //mediaMap.pushLikes(json);
                            //} else {
                            //}

                        //} else {
                        //}
                        //break;

                    // case  OTYPES.ACTION_MEDIA_COMMENT_LIST:
                    //     if(json.sucs === true && json.comments) {
                    //         mediaMap = getMediaMap(json.cntntId);
                    //         if(mediaMap) {
                    //             mediaMap.pushComments(json);
                    //         } else {
                    //         }
                    //     } else {
                    //     }
                    //     break;
                    default:
                }

            }



            function _fetchAllAlbums(utId, albumType) {
                    _utId = utId || (Auth.currentUser() ? Auth.currentUser().getUtId() : false);

                    switch(albumType) {
                        case 'audio':
                            mediaHttpService.fetchMediaAlbums({utId: _utId, mdaT: AC.NEWS_FEED_MEDIA_TYPE_AUDIO });
                            break;
                        case 'video':
                            setTimeout(function() {
                                mediaHttpService.fetchMediaAlbums({utId: _utId, mdaT: AC.NEWS_FEED_MEDIA_TYPE_VIDEO });
                            }, 500);
                            break;
                        default:
                            mediaHttpService.fetchMediaAlbums({utId: _utId, mdaT: AC.NEWS_FEED_MEDIA_TYPE_AUDIO });
                            setTimeout(function() {
                                mediaHttpService.fetchMediaAlbums({utId: _utId, mdaT: AC.NEWS_FEED_MEDIA_TYPE_VIDEO });
                            }, 500);
                    }

            }


            function getAlbum(albumId) {
                albumId = parseInt(albumId);
                return _albums.get(albumId) || _userAlbums.get(albumId) || _otherAlbums.get(albumId); // || _albumList[albumId]; //_albums.get(albumId) || _userAlbums.get(albumId);
            }






            subscriptionKey = $$connector.subscribe(_processResponse, {
                action:  [
                    OTYPES.ACTION_MEDIA_ALBUM_LIST,
                    //OTYPES.ACTION_MEDIA_ALBUM_CONTENT_LIST,
                    // OTYPES.ACTION_SPECIFIC_MEDIA_RESULT,
                    // OTYPES.ACTION_GET_TAGGED_MEDIA_SONGS,
                    OTYPES.ACTION_MEDIA_SEARCH_RESULT
                ]
            });

            function init() {

                if (!initialized) {
                    initialized = true;
                    _fetchAllAlbums();
                    return true;
                } else {
                     return false;
                }

            }

            function makeApiCall(which, obj) {
                switch(which) {
                    case 'mediaInAlbums':
                        return $$connector.request({
                                    actn: OTYPES.ACTION_CHECK_MEDIA_IN_ALBUMS,
                                    strmURL: obj.strmURL
                                }, REQTYPE.REQUEST);
                }
            }


            return {
                init: init,
                // accessors
                state: _state,
                processResponse: _processResponse,
                getAlbum: getAlbum,
                resetMediaAlbums: function() {
                    _userAlbums.reset();
                     //$$connector.unsubscribe(subscriptionKey);
                },
                getUserAlbums: function(type) {
                    if (type) {
                        return mapFilterFilter(_userAlbums.all(), {mapApi: 'getType', value: type, compare:'regex'});
                    } else {
                        return _userAlbums;
                    }
                },
                getAlbums: function(currentUser, type) {
                    var albums = currentUser ? _albums : _userAlbums;
                    if (type) {
                        return mapFilterFilter(albums.all(), {mapApi: 'getType', value: type, compare:'regex'});
                    } else {
                        return albums;
                    }
                },
                getSearchedSongs: function () {
                    return _searchesongs;
                },
                getSearchedAlbums: function () {
                    return _searchedAlbums;
                },
                getContentIdArray: function () {
                    return contentIdArray;
                },
                resetContentIdArray: function () {
                    contentIdArray = [];
                },
                getAlbumIdArray: function () {
                    return albumIdArray;
                },
                resetAlbumIdArray: function () {
                    albumIdArray = [];
                },
                getSearchedTagArr : function () {
                    return searchedTagArr;
                },
                resetSearchedSongs: function () {
                    return _searchesongs.reset();
                },
                resetSearchedAlbum: function () {
                    return _searchedAlbums.reset();
                },
                resetSearchedTagArr : function () {
                    searchedTagArr = [];
                },

                // api methods
                fetchAllAlbums: _fetchAllAlbums,
                createAlbum: function(albumObj, newAlbum) {
                    var albumMap, defer;

                    if (newAlbum) {
                        albumObj.id =  Utils.getUniqueID();
                        defer = $q.defer();
                    }

                    if(newAlbum) {
                        mediaHttpService.addMediaAlbum(albumObj).then(function(json) {
                            
                            if(json.sucs === true) {
                                albumMap = $$mediaAlbumMap.createAlbum(angular.extend(albumObj, {id: json.albId}), Auth.currentUser());
                                //_albumList[albumMap.getKey()] = albumMap;
                                _albums.save(albumMap.getKey(), albumMap);
                                //albumMap.updateAlbum({id: json.albId});
                                //_albumList[albumMap.getKey()] = albumMap;
                                defer.resolve(albumMap);
                            } else {
                                //_albums.remove(albumObj.id);
                                
                                defer.reject(false);
                            }
                        }, function() {
                            
                            defer.reject(false);
                        });
                    }
                    if (newAlbum) {
                        return defer.promise;
                    } else {
                        return albumMap;
                    }
                },
                deleteAlbum: function(albumMap) {
                    mediaHttpService.deleteAlbum(albumMap.getId()).then(function(json) {
                        
                        if(json.sucs === true) {
                            _albums.remove(albumMap.getKey());
                            //delete _albumList[albumMap.getKey()];
                        } else {
                            
                        }
                    });
                },
                fetchAlbumContents: mediaHttpService.fetchAlbumContents,
                fetchAlbumContentsForpopup: mediaHttpService.fetchAlbumContentsForpopup,
                getSearchTrends : function () {
                   return mediaHttpService.getSearchTrends();
                },
                getTaggedMedia : function (obj) {
                   mediaHttpService.getTaggedMedia(obj);
                },
                fetchSearchResult: function(param) {
                    return mediaHttpService.fetchSearchResult(param);
                },
                fetchSliderImage: function(param) {
                    return mediaHttpService.fetchSliderImage(param);
                },
                fetchHashtagSuggestion: mediaHttpService.fetchHashtagSuggestion,
                fetchContent: function(param) {
                     _state.noresultfound = false;
                    return mediaHttpService.fetchContent(param);
                },
                makeApiCall: makeApiCall,
                // no more used. use mediaMap.fetchDetails or API service directly
                //fetchContentDetails: function(cntntId, forPopup, utId) {
                    //var defer = $q.defer(),
                        //mediaMap,
                        //reqData = {
                            //cntntId: cntntId,
                            //utId:  utId
                        //};

                    //// fetch content detail
                    //mediaHttpService.fetchContentDetails(reqData).then(function(json) {
                        //if (json.sucs === true) {
                            //mediaMap =  $$mediaMap(json.mdaCntntDTO);
                            //mediaMap.updateRecentMedias(json);
                            //defer.resolve(mediaMap);
                        //} else {
                            //defer.reject(json);
                            //Ringalert.show(json,'info');
                        //}
                    //});

                    //return defer.promise;
                //}
            };
        }

