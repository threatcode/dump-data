

    angular.module('ringid.chat')
        .directive('rgImageCapture', rgImageCapture);

        //.directive('rgAudioCapture', rgAudioCapture)
        //.directive('rgVideoCapture', rgVideoCapture);

    rgImageCapture.$inject = ['Utils', 'rgRecorderService'];
    function rgImageCapture(Utils, rgRecorderService){
        return {
            link : function(scope, elem, attr){

                var _TEXT = {
                    CAPTURE : 'Capture',
                    RETAKE : 'ReTake'
                };

                scope.videoId = Utils.getUniqueID('rgRec');
                scope.showLoader = true;
                scope.media = null;
                scope.errorText = "";
                scope.connected = false;
                scope.captureText = _TEXT.CAPTURE;


                var getVideoContainerElement = function(){
                    return document.querySelector('#' + scope.videoId);
                };

                var props = {
                    text : {
                        PERMISSION_DENINED : 'Please enable webcam permission',
                        WEBCAM_DISCONNECTED : 'Please connect webcam.',
                        GUM_NOT_SUPPORTED : 'Webcam capture not supported in your browser. Please use upgraded browser.'
                    }
                };

                var recorder = rgRecorderService.getRecorderInstance(props);

                recorder.on('streamReady', function(data){

                    scope.showLoader = false;
                    scope.connected = true;

                    scope.$rgDigest();

                    try{

                        getVideoContainerElement().appendChild(data.media);
                        scope.media = data.media;

                        data.media.play();

                    }catch(e){
                        RingLogger.alert('Stream Ready Exception', e);
                    }


                });

                recorder.on('error', function(e){
                    scope.errorText = e.text;
                    scope.showLoader = false;
                    scope.connected = false;
                    scope.$rgDigest();
                });

                scope.connect = function(){
                    scope.showLoader = true;
                    scope.connected = false;
                    recorder.openMedia({video: true, audio : false});
                };

                setTimeout(function(){
                    scope.connect();
                },500);


                scope.doCapture = function(){

                    if( scope.captureText == _TEXT.CAPTURE){

                        var image = recorder.captureImage();
                        if( !!image ){
                            scope.capturedMedia = image;
                            scope.captureText = _TEXT.RETAKE;
                        }

                        if(!!scope.media){
                            scope.media.pause();
                        }

                    }else{
                        scope.capturedMedia = null;
                        scope.captureText = _TEXT.CAPTURE;

                        scope.media.play();

                    }

                    scope.$rgDigest();

                };

                scope.$on('$destroy', function(){

                    recorder.destroy();


                });
            },
            templateUrl : 'templates/partials/recorder/image.html'
        }

    }



    //rgAudioCapture.$inject = ['Utils'];
    //function rgAudioCapture(Utils){
    //    return{
    //        link : function(scope, elem, attr){
    //
    //        },
    //        templateUrl : 'templates/partials/recorder/audio.html'
    //
    //    }
    //
    //
    //}
    //
    //rgVideoCapture.$inject = ['Utils'];
    //function rgVideoCapture(Utils){
    //    return {
    //        link : function(scope, elem, attr){
    //
    //            var _TEXT = {
    //                CAPTURE : 'Record',
    //                STOP : 'STOP',
    //                RETAKE : 'Restart'
    //            };
    //
    //            var _VIDEO_STATES = {
    //                PLAYING : 0,
    //                PAUSED : 1
    //            };
    //
    //            scope.videoId = Utils.getUniqueID('rgRec');
    //            scope.previewVideoId = Utils.getUniqueID('rgRec');
    //            scope.showLoader = true;
    //            scope.errorText = "";
    //            scope.media = null;
    //            scope.videoState = _VIDEO_STATES.PAUSED;
    //            scope.captureText = _TEXT.CAPTURE;
    //
    //            var getVideoContainerElement = function(){
    //                return document.querySelector('#' + scope.videoId);
    //            };
    //
    //            var getPreviewVideoContainerElement = function(){
    //                return document.querySelector('#' + scope.previewVideoId);
    //            };
    //
    //            var pauseMedia = function(){
    //                if( !!scope.media){
    //                    scope.media.pause();
    //                    scope.videoState = _VIDEO_STATES.PAUSED;
    //                }
    //            };
    //
    //            var playMedia = function(){
    //                if( !!scope.media){
    //                    scope.media.play();
    //                    scope.videoState = _VIDEO_STATES.PLAYING;
    //                }
    //            };
    //
    //            var toggleMedia = function(){
    //                if( scope.videoState == _VIDEO_STATES.PAUSED ){
    //                    playMedia();
    //                }else{
    //                    pauseMedia();
    //                }
    //            };
    //
    //            var getMediaProps = function(){
    //                return {video: true, audio : true}
    //            };
    //
    //            var recorder = new rgRecorder();
    //            recorder.openMedia(getMediaProps());
    //
    //            recorder.on('error', function(e){
    //                scope.errorText = e.text;
    //                scope.showLoader = false;
    //            });
    //
    //
    //            recorder.on('streamReady', function(data){
    //
    //                scope.showLoader = false;
    //                scope.$rgDigest();
    //
    //                getVideoContainerElement().appendChild(data.media);
    //                scope.media = data.media;
    //
    //                playMedia();
    //
    //            });
    //
    //            scope.doCapture = function(){
    //
    //                if( scope.captureText == _TEXT.CAPTURE){
    //
    //                    recorder.startRecording();
    //                    scope.captureText = _TEXT.STOP;
    //
    //
    //                }else{
    //                    recorder.stopRecording();
    //
    //                    recorder.getMediaPreview(function(data){
    //                        var aPreviewVideo = document.createElement('video');
    //                        aPreviewVideo.src = data;
    //                        aPreviewVideo.width = "400";
    //                        aPreviewVideo.height = "400";
    //                        aPreviewVideo.autoPlay = true;
    //                        getPreviewVideoContainerElement().appendChild(aPreviewVideo);
    //
    //                    });
    //
    //
    //                    scope.captureText = _TEXT.CAPTURE;
    //
    //                    playMedia();
    //
    //                }
    //
    //                scope.$rgDigest();
    //
    //            };
    //
    //            scope.$on('togglePlayPause', function(){
    //                toggleMedia();
    //            });
    //
    //            scope.$on('$destroy', function(){
    //
    //                var element = getVideoContainerElement();
    //                recorder.destroy();
    //            });
    //        },
    //        templateUrl : 'templates/partials/recorder/video.html'
    //    }
    //
    //}

