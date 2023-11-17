/*
 * Ipvision
 */


    angular
        .module('ringid.shared')
        .factory('AlbumFactory', AlbumFactory);

        AlbumFactory.$inject = ['$$q', 'settings', 'Auth', '$$albumMap', '$$imageMap', '$$stackedMap', '$$connector', 'OPERATION_TYPES', 'imageHttpService',  'Ringalert'];
        function AlbumFactory($q, settings, Auth, $$albumMap, $$imageMap, $$stackedMap, $$connector, OPERATION_TYPES, imageHttpService,  Ringalert) { // jshint ignore:line

            var _state = {
                    imagesLoading : false,
                    albumsLoading : false
                };

            var albumRequestCount = 0,
                imageRequestCount = 0,
                OTYPES = OPERATION_TYPES.SYSTEM.IMAGE,
                ownAlbums = $$stackedMap.createNew(),
                userAlbums = $$stackedMap.createNew();


            function _processResponse (json, uId) {
                var album, i, len;
                switch(json.actn) {
                    case OTYPES.TYPE_ALBUM_IMAGES:
                        RingLogger.information('got Album images for album: ' + json.albId + ' success: ' + json.sucs, RingLogger.tags.IMAGE);
                        if (json.sucs === true) {
                            if (ownAlbums.get(json.albId)) {
                                ownAlbums.get(json.albId).pushImages(json);
                            } else {
                                album = new $$albumMap(json);
                                ownAlbums.save(album.getKey(), album);
                            }
                        } else if (json.sucs === false && json.rc === 1111){
                            RingLogger.alert('Album request failed', RingLogger.tags.IMAGE);
                        }

                        break;
                    case OTYPES.TYPE_FRIEND_ALBUM_IMAGES:
                        RingLogger.information('got Album images for album: ' + json.albId + ' success: ' + json.sucs, RingLogger.tags.IMAGE);
                        if (json.sucs === true) {
                            if (userAlbums.get(json.albId)) {
                                userAlbums.get(json.albId).pushImages(json);
                            } else {
                                album = new $$albumMap(json);
                                userAlbums.save(album.getKey(), album);
                            }
                        } else {
                        }
                        break;
                    case OTYPES.FETCH_FRIEND_ALBUM_LIST:
                        if(json.sucs === true) {
                            for(i=0, len=json.albumList.length; i<len; i++) {
                                album = new $$albumMap(json.albumList[i], uId);
                                userAlbums.save(album.getKey(), album);
                            }
                        }
                        break;
                    case OTYPES.FETCH_ALBUM_LIST:
                        if(json.sucs === true) {
                            for(i=0, len=json.albumList.length; i<len; i++) {
                                album = new $$albumMap(json.albumList[i], uId);
                                ownAlbums.save(album.getKey(), album);
                            }
                        }
                        break;
                    default:
                        RingLogger.warning('actn Does not match', json, RingLogger.tags.IMAGE);
                }
            }

            function _fetchMoreImage(albId, uId) {
                var fndId = false,
                    st = 0;

                if (Auth.currentUser().getKey() === uId) {
                    st = ownAlbums.get(albId) ? ownAlbums.get(albId).getImages().length() : 0;
                    if (st !== 0 && st >= ownAlbums.get(albId).getTotalImageCount()) { // all images already fetched.
                        return;
                    }
                } else {
                    fndId = uId;
                    st = userAlbums.get(albId) ? userAlbums.get(albId).getImages().length() : 0;
                    if (st !== 0 && st >= userAlbums.get(albId).getTotalImageCount()) { // all images already fetched. no need to request more
                        return;
                    }
                }

                imageHttpService.getAlbumImages({
                    fndId : fndId,
                    albId: albId,
                    st: st
                });
            }

            function _fetchAllAlbums(uId) {
                var fndId = false;

                if (Auth.currentUser().getKey() !== uId) {
                    fndId = uId;
                }

                imageHttpService.fetchAlbumList(fndId);
            }



            return {
                processResponse: _processResponse,
                state: _state,
                resetAlbums: function(own) {
                    if (own) {
                         ownAlbums.reset();
                    } else {
                        userAlbums.reset();
                    }
                },
                deleteImage: function(imageMap) {
                    return imageHttpService.deleteImage(imageMap.getKey());
                },
                getAlbums: function(uId) {
                    if (Auth.currentUser().getKey() === uId) {
                        return ownAlbums;
                    }else {
                        return userAlbums;
                    }
                },
                loadMoreImage: _fetchMoreImage,
                fetchAllAlbums: _fetchAllAlbums,
                getFeedImages : imageHttpService.getFeedImages ,
                getImageDetails: function(imgId,nfId) {
                    var defer = $q.defer(); // this promise is used for popup only
                    imageHttpService.getImageDetails(imgId).then(function(response) {
                        if (response.sucs === true) {
                            //if (imgId) { // no image provided only imgId. so resolve with image obj
                                if(nfId && !response.nfId){
                                    response.nfId = nfId;
                                }
                                defer.resolve($$imageMap(response));
                            //} else {
                                //image.updateImage(response);
                                //defer.resolve();
                            //}
                        } else {
                            Ringalert.show(response,'error');
                        }
                    }, function(errData) {
                        defer.reject();
                    });
                    return defer.promise;
                }
            };
        }
