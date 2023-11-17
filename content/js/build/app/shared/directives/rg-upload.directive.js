/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
 * * Copyright : Ipvision
 * _._._._._._._._._._._._._._._._._._._._._.*/


    angular
            .module('ringid.shared')
            .directive('rgUpload', rgUpload);

    rgUpload.$inject = ['$compile', 'fileUploadService', 'Media'];
    function rgUpload($compile, fileUploadService, Media) { // jshint ignore:line

        UploadController.$inject = ['Auth', '$scope', 'mediaMetadata', 'imageQuality', 'APP_CONSTANTS', 'SystemEvents', 'Ringalert', '$$q', '$rootScope', 'rgDropdownService'];
        function UploadController(Auth, $scope, mediaMetadata, imageQuality, APP_CONSTANTS, SystemEvents, Ringalert, $q, $rootScope, rgDropdownService) { // jshint ignore:line
            var AC = APP_CONSTANTS,
                totalFileSize = 0;


            $scope.uploadProgress = fileUploadService.uploadProgress;
            $scope.previewStartAt = 0;
            //$scope.statusMediaCount = fileUploadService.statusMediaCount;
            $scope.tagList = fileUploadService.tagList;

            // album list dropdown
            $scope.ddHtml = 'templates/dropdowns/album-dropdown.html';
            $scope.ddControl = {
                Media: Media,
                uploadWhat: 'image',
                createAlbum: false,
                albumName: '',
                selectedAlbum: 0
            };
            //$scope.ddAction = selectAlbum;

            $scope.selectAlbum = function() {
                return {
                        data: function () {
                            return {
                                from: 'feedpost',
                                mediaType: $scope.ddControl.uploadWhat
                            };
                        },
                    };
            };



            $scope.getMedia = getMedia;
            $scope.removeMedia = removeMedia;
            $scope.loadPrevious = loadPrevious;
            $scope.loadNext = loadNext;

            $scope.disableUpload = disableUpload;

            $scope.uploadAudio = uploadAudio;
            $scope.uploadVideo = uploadVideo;
            $scope.uploadImage = uploadImage;


            function resetUpload() {
                totalFileSize = 0;
                $scope.previewStartAt = 0;
                $scope.ddControl.uploadWhat = 'image';
                $scope.ddControl.createAlbum = false;
                $scope.ddControl.albumName = '';
                $scope.ddControl.selectedAlbum = 0;
                fileUploadService.resetUpload();
                fileUploadService.tagList = [];
                $scope.tagList = fileUploadService.tagList;
                $scope.$rgDigest();
            }


            //$rootScope.$on(SystemEvents.FILE_UPLOAD.QUEUE_COMPLETE, resetUpload);
            $scope.$on(SystemEvents.FILE_UPLOAD.UPLOADS_POSTED, resetUpload);

            // PREVIEW RELATED CODE
            function getMedia(returnAll) { // jshint ignore:line
                if (returnAll) {
                    return fileUploadService[$scope.ddControl.uploadWhat + 'Files'];
                } else {
                    return fileUploadService[$scope.ddControl.uploadWhat + 'Files'].slice($scope.previewStartAt, $scope.previewStartAt + 3);
                }
            }

            function removeMedia(index) { // jshint ignore:line
                // abort upload request if queued or remove from queuelist
                if (fileUploadService[$scope.ddControl.uploadWhat + 'Files'][index].getQueued()) {
                    fileUploadService[$scope.ddControl.uploadWhat + 'Files'][index].cancelUpload();
                } else {
                    fileUploadService[$scope.ddControl.uploadWhat + 'Files'].splice($scope.previewStartAt + index, 1);
                }

                if (fileUploadService[$scope.ddControl.uploadWhat + 'Files'].length === 0) { // all images removed from upload queue
                    
                    resetUpload();
                } else {
                    $scope.previewStartAt = $scope.previewStartAt > 0 ? $scope.previewStartAt - 1 : $scope.previewStartAt;
                }
            }

            function loadPrevious() { // jshint ignore:line
                $scope.previewStartAt = ($scope.previewStartAt - 3 > 0) ? $scope.previewStartAt - 3 : 0;
            }

            function loadNext() { // jshint ignore:line
                $scope.previewStartAt = ($scope.previewStartAt + 3 <= fileUploadService[$scope.ddControl.uploadWhat + 'Files'].length - 4) ?
                $scope.previewStartAt + 3 : fileUploadService[$scope.ddControl.uploadWhat + 'Files'].length - 3;

            }
            // END PREVIEW CODE


            function disableUpload(uploadType) {
                //if ($scope.uploadProgress) {
                    //if ($scope.ddControl.uploadWhat !== uploadType) {
                        //return false;
                    //} else {
                        //return false;
                    //}
                //} else {
                    if (fileUploadService[$scope.ddControl.uploadWhat + 'Files'].length > 0) {
                        if ($scope.ddControl.uploadWhat === uploadType) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }
                    //return ($scope.ddControl.uploadWhat === uploadType);
                    //if ($scope.ddControl.uploadWhat !== uploadType && getMedia(true).length > 0) {
                        //return true;
                    //} else {
                        //return false;
                    //}
                //}

                $scope.$rgDigest();

            }

            function uploadAudio() { // jshint ignore:line

                fileUploadService.videoFiles = [];
                fileUploadService.imageFiles = [];
                var i,
                        l,
                        input = this; // jshint ignore:line

                // upload size limit check
                for(i = 0; i < input.files.length; i++) {
                    totalFileSize += input.files[i].size;
                }

                if ((input.files.length + fileUploadService.audioFiles.length) > AC.AUDIO_UPLOAD_LIMIT) {
                    Ringalert.show('Maximum upload limit ' + AC.AUDIO_UPLOAD_LIMIT, 'warning');
                } else if ( totalFileSize > AC.MEDIA_UPLOAD_SIZE_LIMIT ) {
                    Ringalert.show('Maximum allowed total upload files size 500MB!', 'warning');
                    // remove new uploaded file sizes
                    for(i = 0; i < input.files.length; i++) {
                        totalFileSize -= input.files[i].size;
                    }
                } else {

                    if ($scope.hasOwnProperty('rgUploadAction')) {
                        $scope.rgUploadAction('audio');
                    }
                    // if fresh new upload
                    if (fileUploadService.audioFiles.length === 0) {
                        $scope.ddControl.uploadWhat = 'audio';
                        //$scope.uploadProgress = true;
                        $scope.ddControl.selectedAlbum = null;
                        fileUploadService.setUploadAlbum(-1);
                    }
                    //for every file.push to upload Queue
                    var startIndex = fileUploadService.audioFiles.length;
                    for (i = 0, l = input.files.length; i < l; i++) {
                        if (validateUpload('audio', input.files[i])) {
                            fileUploadService.queueFile('audio', input.files[i]);
                        } else {
                            Ringalert.show('Invalid Audio File: ' + input.files[i].name, 'error');
                        }
                    }
                    $rootScope.$broadcast(SystemEvents.FILE_UPLOAD.QUEUE_START);
                    // now upload images queue
                    fileUploadService.uploadQueue('audio', startIndex);
                }
                input.value = null;
                $scope.$rgDigest();
            }

            function uploadVideo() {  // jshint ignore:line

                var i, l,
                        input = this; // jshint ignore:line
                //thumbsUploadPromises = [];

                // upload size limit check
                for(i = 0; i < input.files.length; i++) {
                    totalFileSize += input.files[i].size;
                }

                if ((input.files.length + fileUploadService.videoFiles.length) > AC.VIDEO_UPLOAD_LIMIT) {
                    Ringalert.show('Maximum upload limit ' + AC.VIDEO_UPLOAD_LIMIT, 'warning');
                } else if ( totalFileSize > AC.MEDIA_UPLOAD_SIZE_LIMIT ) {
                    Ringalert.show('Maximum allowed total upload files size 500MB!', 'warning');
                    // remove new uploaded file sizes
                    for(i = 0; i < input.files.length; i++) {
                        totalFileSize -= input.files[i].size;
                    }
                } else {

                    // if fresh new upload
                    if (fileUploadService.videoFiles.length === 0) {
                        $scope.ddControl.uploadWhat = 'video';
                        //$scope.uploadProgress = true;
                        $scope.ddControl.selectedAlbum = null;
                        fileUploadService.setUploadAlbum(-1);
                    }
                    if ($scope.hasOwnProperty('rgUploadAction')) {
                        $scope.rgUploadAction('video');
                    }
                    //for every file.push to upload Queue
                    var startIndex = fileUploadService.videoFiles.length;
                    for (i = 0, l = input.files.length; i < l; i++) {
                        if (validateUpload('video', input.files[i])) {
                            fileUploadService.queueFile('video', input.files[i]);
                        } else {
                            Ringalert.show('Invalid Video File: ' + input.files[i].name, 'error');
                        }
                    }


                    // now upload videos queue
                    fileUploadService.uploadQueue('video', startIndex);
                    $rootScope.$broadcast(SystemEvents.FILE_UPLOAD.QUEUE_START);
                }
                input.value = null;
                $scope.$rgDigest();
            }


            function uploadImage() { // jshint ignore:line
                $scope.ddControl.uploadWhat = 'image';

                var input = this; // jshint ignore:line
                switch ($scope.rgUploadType) {
                    case 'coverphoto':
                    case 'profilephoto':
                    case 'tagchatimage':
                    case 'chatimage':
                        if (validateUpload('image', input.files[0])) {
                            var uploadFile = fileUploadService.queueFile($scope.rgUploadType, input.files[0]);
                            if ($scope.hasOwnProperty('rgUploadAction')) {
                                $scope.rgUploadAction()({action: $scope.rgUploadType, uploadFile: uploadFile});
                            }

                        } else {
                            Ringalert.show('Invalid Image File: ' + input.files[0].name, 'error');
                        }
                        input.value = null;
                        break;
                    case 'status':
                        // check maximum no of files upload
                        if (input.files.length + fileUploadService.imageFiles.length > AC.IMAGE_UPLOAD_LIMIT) {
                            Ringalert.show('Maximum upload limit ' + AC.IMAGE_UPLOAD_LIMIT, 'warning');
                            break;
                        }

                        var startIndex = fileUploadService.imageFiles.length;
                        for (var i = 0; i < input.files.length; i++) {
                            //reduce size if necessary and put to queue for upload
                            if (validateUpload('image', input.files[i])) {
                                fileUploadService.queueFile('image', input.files[i]);
                            } else {
                                Ringalert.show('Invalid Image File: ' + input.files[i].name, 'error');
                            }
                        }

                        $rootScope.$broadcast(SystemEvents.FILE_UPLOAD.QUEUE_START);
                        // now upload images queue
                        fileUploadService.uploadQueue('image', startIndex);
                        input.value = null;
                        break;
                }
                $scope.$rgDigest();
                // empty element
            }

            function validateUpload(fileType, inputFile) {
                var regEx;
                switch (fileType) {
                    case 'image':
                        regEx = new RegExp('image\/*');
                        break;
                    case 'audio':
                        regEx = new RegExp('audio\/mp3*');
                        break;
                    case 'video':
                        regEx = new RegExp('video\/mp4');
                        break;
                    case 'default':

                }

                return regEx.test(inputFile.type);
            }


            $scope.$on('$destroy', function() {
                var i, l;
                switch ($scope.rgUploadType) {
                    case 'coverphoto':
                        if (fileUploadService.coverImageFile) {
                            fileUploadService.coverImageFile.cancelUpload();
                            fileUploadService.coverImageFiles = null;
                        }
                        break;
                    case 'profilephoto':
                        if (fileUploadService.profileImageFile) {
                            fileUploadService.profileImageFile.cancelUpload();
                            fileUploadService.profileImageFiles = null;
                        }
                        break;
                    case 'tagchatimage':
                    case 'chatimage':
                        if (fileUploadService.chatImageFiles[$scope.rgUploadBoxValue]) {
                            fileUploadService.chatImageFiles[$scope.rgUploadBoxValue].cancelUpload();
                            delete  fileUploadService.chatImageFiles[$scope.rgUploadBoxValue];
                        }
                        break;
                    case 'status':
                        if (fileUploadService.imageFiles.length > 0) {
                            for (i = 0, l = fileUploadService.imageFiles.length; i < l; i++) {
                                fileUploadService.imageFiles[i].cancelUpload();
                            }
                            fileUploadService.imageFiles = [];
                        } else if (fileUploadService.videoFiles.length > 0) {
                            for (i = 0, l = fileUploadService.videoFiles.length; i < l; i++) {
                                fileUploadService.videoFiles[i].cancelUpload();
                            }
                            fileUploadService.videoFiles = [];
                        } else if (fileUploadService.audioFiles.length > 0) {
                            for (i = 0, l = fileUploadService.audioFiles.length; i < l; i++) {
                                fileUploadService.audioFiles[i].cancelUpload();
                            }
                            fileUploadService.audioFiles = [];
                        }
                        break;
                }
            });

        }

        var linkFunc = function(scope, element, attr) {

            var
                //tagDropdownElement,
                //hashTagTimeout,
                uploadType = attr.rgUploadType,
                    //tagInputElement,
                    imgPreviewElem,
                    template = '',
                    inputFile = '',
                    inputVideo,
                    inputAudio,
                    imgPreviewTmpl =
                    '<div class="to-add" ng-show="ddControl.uploadWhat !== \'image\' && getMedia(true).length > 0" >' +
                        //'<span rg-dropdown dd-html="ddHtml" dd-control="ddControl" dd-action="ddAction">' +
                      //  '<div class="addalbum"><input  name="" placeholder="Add Album Title" /></div>'+
                        '<span >' +
                            '<a  class="img_sprite btn-share vid top-l" data-tooltip-post="Add to album"  ' +
                                'rg-ringbox="true" ringbox-controller="RingBoxAlbumlistController" ringbox-animation="true" ' +
                                'ringbox-type="remote" ringbox-target="templates/dropdowns/popup-album-dropdown.html" ringbox-data="selectAlbum(media.value)" ></a> ' +

                            //'<a data-tooltip-post="Add to Album"><label class="btn-share"></label></a>
                        '</span>' +
                    '</div>' +
                    '<rg-hashtag></rg-hashtag>' +
                    '<div class="status-photo-view" style="border-bottom:1px solid #ebebeb;margin:0;padding:0;margin-bottom:10px;" id="img-height" ng-show="getMedia(true).length > 0">' +
                        '<div id="sts-img-preview" style="text-align:center;" class="scroll">' +
                            '<div ng-show="previewStartAt+3 < getMedia(true).length" class="np-box img_sprite icon-right-arrow"  style="right:0;margin-top:60px;" rg-click="loadNext()"></div>' +
                            '<div ng-show="previewStartAt > 0" class="np-box  img_sprite icon-left-arrow" style="left:0;margin-top:60px;"  rg-click="loadPrevious()"></div>' +
                            '<div style="margin-top:3px;" class="status-photo-view-thumb" ng-repeat="image in getMedia()">' +
                                '<div ng-show="image.getProgress() !== 100" class="progress-bar-placement" style="position:absolute;width:100%;text-align:center;">' +
                                    '<div class="percent">{{image.getProgress()}}%</div>' +
                                    '<div class="progress-bar">' +
                                        '<div class="uploaded" ng-style="{\'width\': image.getProgress()+ \'%\'}"></div>' +
                                    '</div>' +
                                '</div>' +
                            '<div  id="singleImage{{$index}}"  style="position:absolute;width:100%;text-align:center;">' +
                                '<input class="add-title" ng-model="image.cptn" ng-model-options="{ getterSetter: true }" type="text" name="" placeholder="Add Photo Title" ng-show="!image.progressVisible" />' +
                                '<div class="photo-view" style="background-image: url({{image.getPreview()}}); background-position:50% 50%; background-size:100% 100%; background-repeat:no-repeat; cursor: pointer;">' +
                                    '<div class="status-photo-view-thumb-hover">' +
                                        '<span id="closebtn0" class="close" style="display: block;" rg-click="removeMedia($index)" inc="0">' +
                                            '<div class=" up-p"></div>' +
                                        '</span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    //'</div>' +
                    '</div>';



            switch (uploadType) {
                case 'coverphoto':
                case 'profilephoto':
                    template = '<input  id="' + uploadType + '" type="file" name="' + uploadType + '"  accept="image/*" >';
                    element.append($compile(template)(scope));
                    break;
                case 'tagchatimage':
                case 'chatimage':
                    template = '<label  class="img_sprite icon-camera ico-sty ng-binding ng-scope">' +
                            '<input  id="' + uploadType + '" type="file" style="display:none;" accept="image/*" ></label>';
                    element.append($compile(template)(scope));
                    break;
                case 'audio':
                    template = '<a data-tooltip-post="Add Audios" href="javascript:void(0)"><label  class="audio-ico ng-binding ng-scope" ng-show="rgUploadEnabled">' +
                            '<input ng-disabled="uploadProgress" id="audio" type="file" style="display:none;" multiple="multiple" accept="audio/mp3"></label></a>';
                    element.append($compile(template)(scope));
                    break;
                case 'video':
                    template = '<a data-tooltip-post="Add Videos" href="javascript:void(0)"><label  class="video-ico ng-binding ng-scope" ng-show="rgUploadEnabled">' +
                            '<input ng-disabled="uploadProgress" id="video" type="file" style="display:none;" multiple="multiple" accept="video/mp4"></label></a>';
                    element.append($compile(template)(scope));
                    break;
                case 'status':
                    template =
                            //'<div ng-show="rgUploadEnabled" class="post-b-ico"><a data-tooltip-post="Add Photos"  href="javascript:void(0)" class="p-ab"><label  class="status-ico camera-ico ng-binding ng-scope" >' +
                            //'<input ng-disabled="disableUpload(\'image\')" id="' + uploadType + '" type="file" style="display:none;" multiple="multiple" accept="image/*"></label></a></div>' +
                            '<div ng-show="rgUploadEnabled "class="post-b-ico"><a data-tooltip-post="Add Videos" href="javascript:void(0)" class="p-ab"><label  class="img_sprite status-ico video-ico ng-binding ng-scope" >' +
                            '<input ng-disabled="disableUpload(\'video\')" id="video"type="file" style="display:none;" multiple="multiple" accept="video/mp4"></label></a></div>' +
                            '<div ng-show="rgUploadEnabled" class="post-b-ico"><a data-tooltip-post="Add Audios" href="javascript:void(0)" class="p-ab"><label  class="img_sprite status-ico audio-ico ng-binding ng-scope" >' +
                            '<input ng-disabled="disableUpload(\'audio\')" id="audio" type="file" style="display:none;" multiple="multiple" accept="audio/mp3"></label></a></div>';

                    if (attr.rgUploadFeed && attr.rgUploadFeed == 'true') {
                        template = '<div ng-show="rgUploadEnabled" class="post-b-ico"><a data-tooltip-post="Add Photos"  href="javascript:void(0)" class="p-ab"><label  class="img_sprite status-ico camera-ico ng-binding ng-scope" >' +
                                    '<input ng-disabled="disableUpload(\'image\')" id="' + uploadType + '" type="file" style="display:none;" multiple="multiple" accept="image/*"></label></a></div>' +
                                    template;
                    }

                    element.append($compile(template)(scope));

                    imgPreviewElem = element.parent().prepend($compile(imgPreviewTmpl)(scope)); // image preview template added for status
                    break;
            }



            //inputFile = angular.elementent( element[0].querySelector('input#' + uploadType) );
            inputFile = element[0].querySelector('input#' + uploadType);

            if (uploadType === 'status') {
                if (attr.rgUploadFeed && attr.rgUploadFeed == 'true') {
                    inputFile.addEventListener('change', scope.uploadImage);
                }
                // grab video input element
                //inputVideo = angular.element( element[0].querySelector('input#video') );
                inputVideo = element[0].querySelector('input#video');
                inputVideo.addEventListener('change', scope.uploadVideo);

                //inputAudio = angular.element( element[0].querySelector('input#audio') );
                inputAudio = element[0].querySelector('input#audio');
                inputAudio.addEventListener('change', scope.uploadAudio);

            } else if (uploadType === 'audio') {
                inputFile.addEventListener('change', scope.uploadAudio);
            } else if (uploadType === 'video') {
                inputFile.addEventListener('change', scope.uploadVideo);
            } else {
                // image, chatimage, tagchatimage upload
                inputFile.addEventListener('change', scope.uploadImage);
            }

            scope.$rgDigest();

            scope.$on('$destroy', function() {
                switch (uploadType) {
                    case 'status':
                        if (attr.rgUploadFeed && attr.rgUploadFeed == 'true') {
                            inputFile.removeEventListener('change', scope.uploadImage);
                        }
                        inputAudio.removeEventListener('change', scope.uploadAudio);
                        inputVideo.removeEventListener('change', scope.uploadVideo);
                        break;
                    case 'image':
                        inputFile.removeEventListener('change', scope.uploadImage);
                        break;
                    case 'audio':
                        inputFile.removeEventListener('change', scope.uploadAudio);
                        break;
                    case 'video':
                        inputFile.removeEventListener('change', scope.uploadVideo);
                        break;
                }

                fileUploadService.removeScope(scope);
            });



            fileUploadService.setScopeForDigest(scope);


        };  // LINK function END

        return {
            restrict: 'AE',
            scope: {
                rgUploadEnabled: '=',
                rgUploadType: '@',
                rgUploadAction: '&',
                rgUploadBoxValue: '='
            },
            link: linkFunc,
            controller: UploadController
        };
    }

