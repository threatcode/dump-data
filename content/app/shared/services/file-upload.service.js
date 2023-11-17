/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* * Copyright : Ipvision
* _._._._._._._._._._._._._._._._._._._._._.*/


    angular
        .module('ringid.shared')
        .service('fileUploadService', fileUploadService);

        fileUploadService.$inject = [ '$$q', 'Storage', 'settings', '$rootScope', 'SystemEvents', 'Ringalert',  'Utils', '$ringhttp', 'imageQuality', 'mediaMetadata'];
        function fileUploadService( $q, StorageFactory, settings, $rootScope, SystemEvents, Ringalert, Utils, $ringhttp, imageQuality, mediaMetadata) { //jshint ignore:line
            var SCOPES = {};
            function getByteResponse(xhrResponse) {
                var DataViewObject = new DataView(xhrResponse),
                    success,
                    response,
                    responseLength;

                if(!DataViewObject.byteLength){
                    response = {sucs: false, mg: 'Failed. Response unreadable' };
                } else {
                    success = DataViewObject.getBool(0);
                    if(success === false) {
                        responseLength = DataViewObject.getUint8(1);
                        response = {sucs: false, mg: DataViewObject.getString(2, responseLength)};
                    } else if (success === true) {
                        responseLength = DataViewObject.getUint8(1);
                        response = {sucs: true, url: DataViewObject.getString(2, responseLength) };
                    }
                }
                return response;
            }


            // constructor function
            function UploadFile(uploadType, file,safeDigest, resolveFailed) {
                var uploadPath = '',
                    deferred,
                    fileObj = {
                        //uniqueId: file.uniqueId || Utils.getUniqueID(),
                        uniqueId: Utils.getUniqueID(),
                        uploadType: uploadType,
                        file: file || null,
                        fileName: (file.name && file.name.substr(0, file.name.lastIndexOf('.'))) || 'uploadFile',
                        fileType: (file.name && file.type ? file.type.substr(0, file.type.indexOf('/')) : void 0) || 'image',
                        response: {
                            url: ''
                        },
                        //ttl: (uploadType !== 'status' ) ? obj.file.name.substr(0, obj.file.name.lastIndexOf('.')) || obj.file.name : '',
                        meta: {
                            ttl: (uploadType === 'status' || uploadType === 'image' || !file.name ) ? '' : file.name.substr(0, file.name.lastIndexOf('.')) || file.name
                        },
                        gotMeta: false,
                        previewUrl: '',
                        progressVal: 0,
                        queued: false,
                        uploadComplete: false,
                        uploadFail: false
                    };


                    switch(uploadType) {
                        case 'audio':
                            fileObj.fileName += '.mp3';
                            break;
                        case 'video':
                            fileObj.fileName += '.mp4';
                            break;
                        default:
                            //fileObj.meta.ttl = fileObj.fileName;
                            fileObj.meta.ttl = '';
                            fileObj.fileName += '.jpg';

                    }

                fileObj.previewUrl = settings.baseUrl + '/images/default_' + fileObj.fileType + '_image.jpg';
                //fileObj = angular.extend({}, fileObj, obj);

                if(uploadType === 'profilephoto' || uploadType === 'coverphoto') {
                    fileObj.repositionD = {ih: 0, iw: 0, cimX: 0, cimY: 0};
                }


                function onProgress(progress) {

                    //if (e.lengthComputable) {
                        //fileObj.progressVal = Math.round(e.loaded / e.total * 100);
                        fileObj.progressVal = progress;
                        if(fileObj.uploadType === 'coverphoto' || fileObj.uploadType === 'profilephoto') {
                            self.progress = fileObj.progressVal;
                        }
                        $rootScope.$broadcast(SystemEvents.FILE_UPLOAD.PROGRESS_UPDATE);
                        safeDigest();
                    //}
                    RingLogger.information('Upload Progress:' + fileObj.progressVal, RingLogger.tags.UPLOAD);
                }

                function onLoad(responseData) {
                    var response;
                    // upload complete
                    switch(fileObj.uploadType) {
                        case 'chatimage':
                            response = getByteResponse(responseData);
                            if(response.sucs === true) {
                                //response.url = settings.chatImBase + response.url;
                                response.url = response.url;
                            }
                            self.uploadProgress = false;
                            angular.extend(response, fileObj.meta || {});
                            break;
                        case 'tagchatimage':
                            response = angular.fromJson(responseData);
                            if(response.sucs === true) {
                                response.url = response.iurl;
                            }
                            self.uploadProgress = false;
                            angular.extend(response, fileObj.meta || {});
                            break;
                        case 'video':
                            response = getByteResponse(responseData);
                            fileObj.meta.thmbURL = response.url ? response.url.substr(0, response.url.lastIndexOf('.')) + '.jpg' : '';
                            fileObj.previewUrl = response.url ? settings.mediaBase + fileObj.meta.thmbURL : '';
                            break;
                        case 'audio':
                            response = getByteResponse(responseData);
                            break;
                        case 'coverphoto':
                        case 'profilephoto':
                            response =  angular.fromJson(responseData);
                            // readjust ih, iw to image original height and width
                            response.ih =  fileObj.meta.ih;
                            response.iw =  fileObj.meta.iw;
                            self.uploadProgress = false;
                            break;
                        case 'image':
                            response = angular.fromJson(responseData);
                            fileObj.previewUrl = response.iurl ?
                                settings.imBase + response.iurl.substr(0, response.iurl.lastIndexOf('/')+1) + 'pthumb' + response.iurl.substr(response.iurl.lastIndexOf('/')+1)
                                    : '';
                            // revoke
                            break;
                        case 'thumb':
                            response = getByteResponse(responseData);
                            break;
                        default:
                            response =  angular.fromJson(responseData);
                    }


                    fileObj.response = angular.extend({}, fileObj.response, response );


                    if(response.sucs === true) {
                        fileObj.uploadComplete = true;
                    } else {
                        fileObj.uploadFail = true;
                    }
                    // fileObj.file = undefined;
                    fileObj.queued = false;


                    if(response.sucs !== true) {
                        Ringalert.show(response.mg || 'Failed', 'error');
                    }
                    deferred.resolve( response );

                    //safeDigest();
                }

                function onAbort() {
                    safeDigest();
                    deferred.reject();
                }

                function onError(response) {
                    fileObj.uploadFail = true;
                    Ringalert.show('Upload failed!', 'error');
                    //if (response && response.mg) {
                        //Ringalert.show(response.mg, 'error');
                    //}
                    if (resolveFailed) {
                        deferred.resolve();
                    } else {
                         deferred.reject();
                    }
                }


                function fetchMeta(callBack) {
                    switch(fileObj.fileType) {
                        case 'video':
                        case 'audio':
                            mediaMetadata.generateMeta(fileObj.file, fileObj.fileType).then(function(meta) {
                                fileObj.meta = angular.extend({}, meta, fileObj.meta);
                                callBack({success: true});
                                safeDigest();
                            }, function(errMsg) {
                                Ringalert(errMsg, 'error');
                                fileObj.uploadFail = true;
                                if (deferred) {
                                    deferred.reject(errMsg);
                                } else {
                                    callBack({success: false, message: errMsg});
                                }
                                safeDigest();
                            });
                            break;
                        case 'image':
                            imageQuality.resizeImage(fileObj.file, fileObj.uploadType).then(function(meta) {
                                fileObj.file = meta.file;
                                fileObj.meta.ih = meta.ih;
                                fileObj.meta.iw = meta.iw;
                                fileObj.previewUrl = meta.previewUrl;
                                callBack({success: true});
                                safeDigest();
                            }, function(errMsg) {
                                fileObj.uploadFail = true;
                                if (deferred) {
                                    Ringalert.show(errMsg, 'error');
                                    deferred.reject(errMsg);
                                } else {
                                    callBack({success: false, message: errMsg});
                                }
                                safeDigest();
                            });
                            break;
                    }
                    fileObj.gotMeta = true;
                    safeDigest();
                }

                return {
                    getKey: function() {
                        return fileObj.uniqueId;
                    },
                    setRepositionData: function(obj) {
                        fileObj.repositionD  = angular.extend({}, fileObj.repositionD || {}, obj);
                    },
                    getRepositionData: function() {
                        if (fileObj.uploadType === 'profilephoto') {
                            return { pimX: fileObj.repositionD.cimX, pimY: fileObj.repositionD.cimY};
                        } else {
                            return { cimX: fileObj.repositionD.cimX, cimY: fileObj.repositionD.cimY};
                        }
                    },
                    getFile: function() {
                        return fileObj.file;
                    },
                    getName: function() {
                        return fileObj.file.name;
                    },
                    fetchMeta: fetchMeta,
                    initUpload: function() {
                        var formData = new FormData(),
                            responseType = 'text';

                        deferred = $q.defer();
                        fileObj.queued = true;

                        formData.append('sId', StorageFactory.getCookie('sId'));
                        formData.append('uId', StorageFactory.getCookie('uId'));
                        formData.append('authServer', StorageFactory.getCookie('authServer'));
                        formData.append('comPort', StorageFactory.getCookie('comPort'));
                        formData.append('x-app-version', settings.apiVersion);

                        // put additional data for image files
                        switch(fileObj.uploadType) {
                            case 'profilephoto':
                                uploadPath = settings.imServer + 'ImageUploadHandler';
                                break;
                            case 'coverphoto':
                                uploadPath = settings.imServer +  'CoverImageUploadHandler';
                                break;
                            case 'tagchatimage':
                                uploadPath = settings.imServer + 'GroupContentHandler';
                                break;
                            case 'chatimage':
                                uploadPath = settings.imServer + 'ChatImageHandler';
                                responseType = 'arraybuffer';
                                break;
                            case 'image':
                                uploadPath = settings.imServer + 'AlbumImageUploadHandler';
                                break;
                            case 'video':
                                uploadPath = settings.mediaServer + 'Mp4UploadHandler';
                                responseType = 'arraybuffer';
                                break;
                            case 'audio':
                                uploadPath = settings.mediaServer + 'Mp3UploadHandler';
                                responseType = 'arraybuffer';
                                break;
                            case 'thumb':
                                uploadPath = settings.mediaServer + 'ThumbImageHandler';
                                responseType = 'arraybuffer';
                                fileObj.gotMeta = true; // no need to fetch meta of thumb image
                                break;
                            default:

                        }

                        if (fileObj.gotMeta) {
                            sendFile();
                        } else {
                            fetchMeta(sendFile);
                        }

                        function sendFile() {
                            if (fileObj.uploadType === 'coverphoto' || fileObj.uploadType === 'profilephoto' ) {
                                Object.keys(fileObj.repositionD).forEach(function (key) {
                                    formData.append(key, fileObj.repositionD[key]);
                                });

                            }
                            formData.append('file', fileObj.file, fileObj.fileName) ;//(fileObj.file.name.substr(0, fileObj.file.name.lastIndexOf('.')) || 'imagefile')  + '.jpg');
                            fileObj.xhr = $ringhttp.post(uploadPath, formData, responseType)
                                .success(onLoad)
                                .error(onError)
                                .progress(onProgress)
                                .abort(onAbort);
                        }


                        return deferred.promise;
                    },
                    cptn: function(newCaption) {
                        if (arguments.length > 0) {
                            fileObj.meta.ttl = newCaption;
                        }

                        return fileObj.meta.ttl;

                        //if (fileObj.fileType === 'image') {
                            //if (arguments.)
                            //return arguments.length ? (fileObj.meta.ttl = newCaption) : '';
                        //} else {
                            //if (arguments.length > 0) {
                                //fileObj.meta.ttl = newCaption;
                            //}
                            ////return arguments.length ? (fileObj.meta.ttl = newCaption) : fileObj.meta.ttl || fileObj.file.name;
                        //}

                        //return fileObj.meta.ttl;
                        //if (fileObj.meta) {
                        //} else {
                            //return arguments.length ? (fileObj.ttl = newCaption) : fileObj.ttl;
                        //}
                        //if (fileObj.uploadType === 'audio') {
                        //} else {
                            //return arguments.length ? (fileObj.ttl = newCaption) : fileObj.ttl;
                        //}
                    }, // used in rg-upload directive to bind as a caption model for status images and maybe for video captions
                    getPreview: function() {
                        return fileObj.previewUrl;
                    },
                    cancelUpload: function() {
                        fileObj.uploadFail = true;
                        if (fileObj.xhr) {
                            fileObj.xhr.abortRequest();
                        } else if (fileObj.deferred) {
                            fileObj.deferred.reject();
                        }
                    },
                    setPreview: function(previewUrl) {
                        fileObj.previewUrl = previewUrl;
                    },
                    getProgress: function() {
                        return fileObj.progressVal;
                    },
                    uploadCompleted: function() {
                         return fileObj.uploadComplete;
                    },
                    uploadFailed: function() {
                        return fileObj.uploadFail;
                    },
                    getQueued: function() {
                        return fileObj.queued;
                    },
                    setQueued: function(bool) {
                        fileObj.queued = bool || true;
                    },
                    setMeta: function(metaObj) {
                        fileObj.meta =  metaObj;
                    },
                    getMeta: function() {
                        if(fileObj.hasOwnProperty('meta')) {
                            return fileObj.meta;
                        } else {
                            return false;
                        }
                    },
                    getAuthData: function(addTagList) {
                        var returnObj = {};

                        switch(fileObj.fileType) {
                            case 'image':
                                returnObj = {
                                    ih: fileObj.meta.ih,
                                    iw: fileObj.meta.iw,
                                    iurl: fileObj.response.iurl,
                                    cptn: fileObj.meta.ttl.utf8Encode()
                                };
                                break;
                            case 'video':
                                //returnObj =  {
                                    //strmURL: fileObj.response.url
                                //};
                                //returnObj = angular.extend({}, returnObj, fileObj.meta);
                                //returnObj.thmbURL = returnObj.strmURL.substr(0, returnObj.strmURL.lastIndexOf('.')) + '.jpg';
                                ////returnObj.previewURL = settings.imBase + returnObj.thmbURL;
                                //returnObj.ttl = fileObj.meta.ttl.utf8Encode(); // overriting video thumb ttl with user modified caption
                                //break;
                            case 'audio':
                                returnObj = {
                                    strmURL: fileObj.response.url,
                                    tiw: fileObj.meta.tiw,
                                    tih: fileObj.meta.tih,
                                    drtn: fileObj.meta.drtn,
                                    thmbURL: fileObj.meta.thmbURL,
                                    artst: fileObj.meta.artst.utf8Encode(),
                                    //ttl: fileObj.cptn.utf8Encode() //fileObj.meta.ttl
                                    ttl: fileObj.meta.ttl.utf8Encode()
                                };

                                if (addTagList) {
                                    for(var i = 0; i < self.tagList.length; i++) {
                                        self.tagList[i].sk =   self.tagList[i].sk.utf8Encode();
                                    }
                                    returnObj.htgLst = self.tagList;
                                }
                                break;
                            default:
                                returnObj = fileObj.response;
                        }

                        return returnObj;

                    }
                };
            }


            var self = this, // jshint ignore:line
                _albumId = -1;


            self.resetUpload = function resetUpload() {
                self.progress = 0;
                self.tagList = [];
                self.uploadProgress = false;
                self.profileImageFile = null;
                self.coverImageFile = null;
                self.imageFiles = [];
                self.videoFiles = [];
                self.audioFiles = [];
                self.chatImageFiles = {};

                self.selectFromAlbum = false; // from browse album.
            };

            self.resetUpload();

            self.createUploadFile = function(uploadType, obj) {
                return new UploadFile(uploadType, obj,safeDigest);
            };

            //self.statusMediaCount = function(uploadWhat) {
                //if(uploadWhat) {
                    //return self[uploadWhat+'Files'].length;
                //} else {
                    //return 0;
                //}
            //};

            self.setUploadAlbum = function(albumId) {
                _albumId = albumId;
            };
            self.getUploadAlbum = function() {
                return _albumId;
            };

            self.queueFile = function(uploadType, fileObj) {
                //_albumId = -1;
                switch(uploadType) {
                    case 'profilephoto':
                        self.progress = 0;
                        self.profileImageFile = new UploadFile(uploadType, fileObj, safeDigest);
                        return self.profileImageFile;
                    case 'coverphoto':
                        self.progress = 0;
                        self.coverImageFile = new UploadFile(uploadType, fileObj, safeDigest);
                        return self.coverImageFile;
                    case 'tagchatimage':
                    case 'chatimage':
                        return new UploadFile(uploadType, fileObj, safeDigest);
                    case 'image':
                        self.imageFiles.push( new UploadFile(uploadType, fileObj, safeDigest, true));
                        break;
                    case 'video':
                        self.videoFiles.push(new UploadFile(uploadType, fileObj, safeDigest, true));
                        break;
                    case 'audio':
                        self.audioFiles.push(new UploadFile(uploadType, fileObj, safeDigest, true));
                        break;
                    default:
                }
                safeDigest();
            };

            self.setReposition = function(dimension, uploadType) {
                if(uploadType === 'coverphoto') {
                    self.coverImageFile.setRepositionData(dimension);
                } else if (uploadType === 'profilephoto') {
                    self.profileImageFile.setRepositionData(dimension);
                } else {
                }
            };
            // used while changing cover and profile pic
            self.getReposition = function(uploadType) {
                if(uploadType === 'coverphoto') {
                    return self.coverImageFile.getRepositionData();
                } else if (uploadType === 'profilephoto') {
                    return self.profileImageFile.getRepositionData();
                } else {
                    return {};
                }
            };


            self.uploadQueue = function(uploadType, startIndex) {
                // for status videos, images, audios
                var promises = [],
                    endIndex,
                    whichFiles = uploadType + 'Files';

                if (startIndex < self[whichFiles].length) {
                    endIndex = (startIndex+2 < self[whichFiles].length) ? startIndex + 2 : self[whichFiles].length;
                    for (var i = startIndex; i < endIndex; i++) {
                        //reduce size if necessary and put to queue for upload
                        if ( self[whichFiles][i] &&
                            !self[whichFiles][i].getQueued() &&
                            !self[whichFiles][i].uploadFailed() ) {

                            promises.push(self[whichFiles][i].initUpload());
                            //promises.push(imageQuality.resizeImage(self[whichFiles][i].getFile(), $scope.rgUploadType));
                        }
                    }

                    // in case of failed uploads no promises
                    if (promises.length === 0) {
                        self.uploadQueue(uploadType, endIndex );
                        return;
                    }

                    $q.all(promises).then(function() {
                        removeFailed();
                        self.uploadQueue(uploadType, endIndex);
                        // show preview and resize postbox to accomodate image preview area
                    }, function(errData) {
                        endIndex = endIndex - removeFailed();
                        self.uploadQueue(uploadType, endIndex);
                    });

                } else {
                    var interval = setInterval(function() {
                        self.uploadProgress = false;
                        removeFailed(true);
                        for(var i = 0; i < self[whichFiles].length; i++) {
                            if (!self[whichFiles][i].uploadCompleted()) {
                                self.uploadProgress = true;
                                break;
                            }
                        }
                        if (!self.uploadProgress) {
                            clearInterval(interval);
                            $rootScope.$broadcast(SystemEvents.FILE_UPLOAD.QUEUE_COMPLETE, uploadType);
                            // if media
                            //if (self[whichFiles].length > 0) {
                                //All files uploaded
                            //}
                            safeDigest();
                        }
                    }, 2000);
                }

                function removeFailed(startFromZero) {
                    var start = startFromZero ? 0 : startIndex;
                    var removeCounter = 0;
                    for(var i = start, l = self[whichFiles].length; i < l; i++) {
                        if (self[whichFiles][i] && self[whichFiles][i].uploadFailed()) {
                            self[whichFiles].splice(i, 1);
                            removeCounter++;
                            i--;
                            l--;
                        }
                    }
                    if (removeCounter > 0) {
                        safeDigest();
                    }
                    return removeCounter;
                }

            };
                self.setScopeForDigest = function(scope){
                    SCOPES[scope.$id] = scope;
                };
                self.removeScope = function(scope){
                    if(SCOPES[scope.$id]){
                        SCOPES[scope.$id] = null;
                    }
                };
            function safeDigest(){
                var digestScope;
                for(var key in SCOPES){
                    if (SCOPES.hasOwnProperty(key)) {
                        digestScope = SCOPES[key];
                        if(digestScope && digestScope.$id && !digestScope.$$destroyed){
                            digestScope.$rgDigest();
                        }
                    }
                }

            }

        }

