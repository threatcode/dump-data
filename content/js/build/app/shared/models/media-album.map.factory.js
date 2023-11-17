/*
 * Ipvision
 */


    angular
        .module('ringid.shared')
        .factory('$$mediaAlbumMap', $$mediaAlbumMap);

    $$mediaAlbumMap.$inject = ['Ringalert', 'Auth', 'settings', 'fileUploadService', '$$stackedMap', '$$mediaMap', 'APP_CONSTANTS', 'mediaHttpService', 'Utils'];
    function $$mediaAlbumMap (Ringalert, Auth, settings,  fileUploadService, $$stackedMap, $$mediaMap, APP_CONSTANTS, mediaHttpService, Utils) { //jshint ignore:line
        var AC = APP_CONSTANTS;

        function createAlbumKey (obj) {
                //return obj.mdaT + '-' + obj.id;
                return parseInt(obj.id) || parseInt(obj.albId);
        }

        return {
            createKey: function(obj) {
                return createAlbumKey(obj);
            },
            createAlbum: function (obj, user) {
                var album = {
                    albn: '', // album name
                    albId: 0,
                    mc: 0, // total no of content in this album
                    mdc:0,
                    mdaT: 1, // meida time 1=audio, 2=video
                    sts: 0, // do no know
                    utId: 0, // owner user utid
                    imgURL:'',
                    contents: $$stackedMap.createNew(),

                    uniqueKey: Utils.getUniqueID(),
                    // calculated data
                    cover: '',
                    key: 0,
                    type: '',
                    owner: 0
                };


                var updatealbumObj = function(albumObj) {
                    if (angular.isObject(albumObj)) {
                        album = angular.extend({}, album, albumObj);
                        album.albId = parseInt(albumObj.id) || parseInt(albumObj.albId);

                        album.owner = user;
                        album.key = createAlbumKey(albumObj);
                        if (albumObj.imgURL  && albumObj.imgURL.length > 1) {
                            album.cover = settings.imBase + albumObj.imgURL;
                        }else{
                            album.cover = (obj.mdaT === AC.NEWS_FEED_MEDIA_TYPE_AUDIO ) ? 'images/default_audio_image.jpg' : 'images/default_video_image.jpg';
                        }
                        album.type= (obj.mdaT === AC.NEWS_FEED_MEDIA_TYPE_AUDIO ) ? 'audio' : 'video';
                    } else {
                    }
                };

                updatealbumObj(obj);

                function pushContents(contentJson, owner,nfId) {
                    var mediaMap;
                    owner = owner || album.owner;

                    for(var i = 0, l = contentJson.length; i < l; i++) {
                        if(nfId){
                            contentJson[i].nfId = nfId;
                        }
                        mediaMap = $$mediaMap(angular.extend(contentJson[i], {albId: album.id}), owner);
                        album.contents.save(mediaMap.getKey(), mediaMap);
                    }
                    
                    return album; // might not be needed
                }

                return {
                    getKey: function() {
                        return album.key;
                    },
                    getType: function() {
                        return album.type;
                    },
                    isAudio: function() {
                        return (album.mdaT === AC.NEWS_FEED_MEDIA_TYPE_AUDIO);
                    },
                    isVideo: function() {
                        return (album.mdaT === AC.NEWS_FEED_MEDIA_TYPE_VIDEO);
                    },
                    getId: function() {
                        return album.albId;
                    },
                    getName: function() {
                        return album.albn;
                    },
                    getCover: function() {
                        return album.cover;
                    },
                    getContentCount: function() {
                        return album.mc || album.mdc;
                    },
                    getContents: function() {
                        return album.contents;
                    },
                    updateAlbum: function(obj) {
                        updatealbumObj(obj);
                    },
                    pushContent: function(contentJson, owner,nfId,mediaMap) {
                        return pushContents(contentJson, owner,nfId,mediaMap);
                    },
                    getALbumUtId : function () {
                        return album.utId;
                    },
                    link: function (user, onlyPath) {
                        if( !!user.getUId()|| !!user.getUtId()){
                            var link = Utils.getRingRoute('USER_PROFILE', { uId : user.getUId(), utId : user.getUtId(), subpage: 'media', albumId: album.albId});
                            if (onlyPath) {
                                return link.replace('#', '');
                            } else  {
                                return settings.baseUrl + link;
                            }
                        }else{
                            return '';
                        }
                    },
                    // api calls
                    addNewContent: function(mediaMap) {
                        var index, limit,
                            whichFiles = (album.type === 'audio') ? 'audioFiles' : 'videoFiles',
                            payload = {
                            albId: album.albId,
                            mdaLst: [],
                            mdaT: album.mdaT
                        };

                        // new content from status
                        if (!mediaMap) {
                            for(index = 0, limit = fileUploadService[whichFiles].length; index < limit; index++ ) {
                                payload.mdaLst.push(fileUploadService[whichFiles][index].getAuthData());
                            }
                        } else {
                            // check if media already in the album or not
                            if (album.contents.get(mediaMap.getKey())) {
                                Ringalert.show('Content Already Added', 'warning');
                                return;
                            }
                            // new content from other users album
                             payload.mdaLst.push(mediaMap.addToAlbumData());
                        }
                        mediaHttpService.addMediaToAlbum(payload).then(function(json) {
                            if(json.sucs === true) {
                                    album.mc += json.mdaIds.length;
                                for(index = 0, limit = json.mdaIds.length; index < limit; index++) {
                                    //payload.mdaLst[index].id = json.mdaIds[index];
                                    payload.mdaLst[index].cntntId = json.mdaIds[index];
                                }
                                pushContents(payload.mdaLst);
                                //if (mediaMap) {
                                    //Ringalert.show('Content Added to album', 'success');
                                //}
                            } else {
                                
                                //if (mediaMap) {
                                    //Ringalert.show(json.mg || 'Failed to add media', 'error');
                                //}
                            }
                        });
                    },
                    deleteContent: function(mediaMap) {
                        mediaHttpService.deleteAlbumContent(mediaMap.getId()).then(function(json) {
                            if(json.sucs === true) {
                                // remove content from contents map
                               album.contents.remove(mediaMap.getKey());
                               //decrease total content count
                               album.mc--;
                            } else {
                            }
                        });
                    },
                    fetchContentDetails: function() {
                        var items = album.contents.all();
                        function timedCall(mediaMap, time) {
                            setTimeout(function() {
                                mediaHttpService.likeList(mediaMap.getId()).then(function(json) {
                                    // update mediaMap
                                });
                            }, time);
                        }

                        for(var i = 0, l = items.length; i < l; i++) {
                            (timedCall)(items[i].value, (i * 200 + 200) );
                        }
                    }

                };

            }
        };
    }




