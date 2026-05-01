/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* * Copyright : Ipvision
* _._._._._._._._._._._._._._._._._._._._._.*/



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
            function UploadFile(uploadType, file) {
                var uploadPath = '',
                    deferred,
                    fileObj = {
                        //uniqueId: file.uniqueId || utilsFactory.getUniqueID(),
                        // uniqueId: utilsFactory.getUniqueID(),
                        uploadType: uploadType,
                        file: file || null,
                        fileName: (file.name && file.name.substr(0, file.name.lastIndexOf('.'))) || portalUtils.getUniqueId(),
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
                            fileObj.meta.ttl = fileObj.fileName;
                            fileObj.fileName += '.jpg';

                    }

                fileObj.previewUrl = settings.baseUrl + '/images/' + fileObj.fileType + '-preview.jpg';
                //fileObj = angular.extend({}, fileObj, obj);

                if(uploadType === 'profilephoto' || uploadType === 'coverphoto') {
                    fileObj.repositionD = {ih: 0, iw: 0, cimX: 0, cimY: 0};
                }


                function onProgress(progress) {
                    fileObj.progressVal = progress;
                    fileObj.callBack(fileObj.progressVal,fileObj.file.name);
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
                            //angular.extend(response, fileObj.meta || {});
                            break;
                        // case 'tagchatimage':
                        //     response = angular.fromJson(responseData);
                        //     if(response.sucs === true) {
                        //         response.url = response.iurl;
                        //     }
                        //     self.uploadProgress = false;
                        //     angular.extend(response, fileObj.meta || {});
                        //     break;
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
                            response =  responseData;
                            // readjust ih, iw to image original height and width
                            response.ih =  fileObj.meta.ih;
                            response.iw =  fileObj.meta.iw;
                            self.uploadProgress = false;
                            break;
                        case 'image':
                            // console.log(responseData);
                            response = responseData;
                            fileObj.previewUrl = response.iurl ?
                                settings.imBase + response.iurl.substr(0, response.iurl.lastIndexOf('/')+1) + 'pthumb' + response.iurl.substr(response.iurl.lastIndexOf('/')+1)
                                    : '';
                            // revoke
                            break;
                        case 'thumb':
                            response = getByteResponse(responseData);
                            break;
                        default:
                            response =  responseData;
                    }


                   // fileObj.response = angular.extend({}, fileObj.response, response );


                    if(response.sucs === true) {
                        fileObj.uploadComplete = true;
                    } else {
                        fileObj.uploadFail = true;
                    }
                    // fileObj.file = undefined;
                    fileObj.queued = false;


                    RingLogger.print(angular.toJson(response), RingLogger.tags.UPLOAD);
                    if(response.sucs !== true) {
                        // Ringalert.show(response.mg || 'Failed', 'error');
                        console.log(response.mg || 'Failed', 'error')
                    }
                    deferred.resolve( response );

     
                }

                function onAbort() {
     
                    deferred.reject();
                }

                function onError(response) {
                    if (response && response.mg) {
                        Ringalert.show(response.mg, 'error');
                    }
                    deferred.reject();
                }


                function fetchMeta(callBack,uploadObj) {
                    switch(fileObj.fileType) {
                        case 'video':
                        case 'audio':
                            mediaMetadata.generateMeta(fileObj.file, fileObj.fileType).then(function(meta) {
                                fileObj.meta = fileObj.meta; //angular.extend({}, meta, fileObj.meta);
                                callBack({success: true},uploadObj);
                      
                            }, function(errMsg) {
                                Ringalert(errMsg, 'error');
                                fileObj.uploadFail = true;
                                if (deferred) {
                                    deferred.reject(errMsg);
                                } else {
                                    callBack({success: false, message: errMsg},uploadObj);
                                }
                        
                            });
                            break;
                        case 'image':
                            imageQuality.resizeImage(fileObj.file, fileObj.uploadType).then(function(meta) {
                                fileObj.file = meta.file;
                                fileObj.meta.ih = meta.ih;
                                fileObj.meta.iw = meta.iw;
                                fileObj.previewUrl = meta.previewUrl;
                                callBack({success: true},uploadObj);
                      
                            }, function(errMsg) {
                                fileObj.uploadFail = true;
                                if (deferred) {
                                    Ringalert.show(errMsg, 'error');
                                    deferred.reject(errMsg);
                                } else {
                                    callBack({success: false, message: errMsg},uploadObj);
                                }
                    
                            });
                            break;
                    }
                    fileObj.gotMeta = true;
               
                }

                return {

                    setRepositionData: function(obj) {
                        RingLogger.information( 'Set Reposition to : ' + angular.toJson(obj) , RingLogger.tags.UPLOAD);
                        // fileObj.repositionD  = angular.extend({}, fileObj.repositionD || {}, obj);
                        fileObj.repositionD  = obj;

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
                    initUpload: function(callBack) {
                        fileObj.callBack = callBack;

                        var formData = new FormData(),
                            responseType = 'text';

                        deferred = Q.defer();
                        fileObj.queued = true;

                        formData.append('sId', StorageFactory.getCookie('sId'));
                        formData.append('uId', StorageFactory.getCookie('uId'));
                        formData.append('authServer', StorageFactory.getCookie('authServer'));
                        formData.append('comPort', StorageFactory.getCookie('comPort'));
                        formData.append('x-app-version', '138');

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
                                RingLogger.warning('Can not Determine File upload Path: ' + uploadType, RingLogger.tags.UPLOAD);

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
                            fileObj.xhr = RingHttp.post(uploadPath, formData, responseType)
                                .success(onLoad)
                                .error(onError)
                                .progress(onProgress)
                                .abort(onAbort);
                        }


                        return deferred.promise;
                    },
                    cptn: function(newCaption) {
                        //if (fileObj.meta) {
                            return arguments.length ? (fileObj.meta.ttl = newCaption) : fileObj.meta.ttl || fileObj.file.name;
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
                                RingLogger.warning('File type for getAuthData did not match: ' + fileObj.fileType);
                        }

                        return returnObj;

                    }
                };
            }



