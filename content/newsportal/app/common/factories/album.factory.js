/*
 * Ipvision
 */


(function(){
    'use strict';
    angular
        .module('ringid.common.album_factory',[
            'ringid.config',
            'ringid.common.imagemap_factory',
            'ringid.common.stacked_map',
            'ringid.utils','ringid.connector',
            'ringid.common.services',
            'ringid.profile'
        ])
        .factory('$$albumMap', $$albumMap)
        .factory('AlbumFactory', AlbumFactory);


        $$albumMap.$inject = [ 'settings', '$$imageMap', '$$stackedMap', 'profileFactory'];
        function $$albumMap( settings, $$imageMap, $$stackedMap, profileFactory) { // jshint ignore:line

            // constructor
            function Album (obj, albumOwnerUid) {
                var image,
                    albumOwner,
                    album = {
                        albId: obj.albId,
                        timg: obj.timg,
                        images: $$stackedMap.createNew(),
                        ut: 0
                    };

                albumOwner = profileFactory.getProfile(albumOwnerUid);
                album = angular.extend({}, album, obj);

                function pushImages(obj) {
                    var imageObj;
                    for( var i = 0, lt = obj.imageList.length; i < lt; i++) {
                        imageObj =  angular.extend({}, obj.imageList[i], {albId: album.albId});
                        image = $$imageMap(imageObj, albumOwner);
                        album.images.save(image.getKey(), image);

                        if (album.ut < obj.imageList[i].tm) {
                            album.ut = obj.imageList[i].tm;
                        }
                    }
                    //RingLogger.print('total img:' + album.images.length(), RingLogger.tags.IMAGE);
                    //RingLogger.print('album: ' + album.albId, RingLogger.tags.IMAGE);
                }
                if(obj.imageList && obj.imageList.length > 0) {
                    pushImages(obj);
                }

                return {
                    getKey: function() {
                        return album.albId;
                    },
                    pushImages: function(obj) {
                        pushImages(obj);
                    },
                    removeImage: function(imageKey) {
                        if( album.images.remove(imageKey)) {
                            // do other stuff
                            album.tn = album.tn - 1; // decrease total no of image
                        }
                    },
                    getName: function() {
                        return album.albn;
                    },
                    getCoverImage: function(size) {
                        var position = album.cvImg.lastIndexOf('/') + 1;
                        size = 'p' + size;
                        return [settings.imBase, album.cvImg.slice(0, position), size,  album.cvImg.slice(position)].join('');
                        //return album.images.top().src(size);
                    },
                    getTotalImageCount: function() {
                        return album.tn;
                    },
                    getUpdateTime: function() {
                        return album.tm;
                    },
                    getImages: function() {
                        return album.images;
                    }

                };
            }

            return function(obj, albumOwnerUid) {
                return new Album(obj, albumOwnerUid);
            };
        }

        AlbumFactory.$inject = ['$$q', 'settings', 'Auth', '$$albumMap', '$$imageMap', '$$stackedMap', '$$connector', 'OPERATION_TYPES', 'imageHttpService', 'profileFactory', 'Ringalert'];
        function AlbumFactory($q, settings, Auth, $$albumMap, $$imageMap, $$stackedMap, $$connector, OPERATION_TYPES, imageHttpService, profileFactory, Ringalert) { // jshint ignore:line

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
                            RingLogger.alert('Album request failed', RingLogger.tags.IMAGE);
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
})();
