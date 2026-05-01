    angular.module('ringid.chat')
        .service('rgRecorderService', rgRecorderService);



    function __getUserMedia(){

        var _gum, _gumVersion;
        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
            _gumVersion = 'old';
            _gum = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        }else{
            _gumVersion = 'new';
            _gum = navigator.mediaDevices.getUserMedia
        }

        return {gum : _gum, version : _gumVersion};
    }

    function rgRecorder(user_props){

        var self = this;

        var _gumVersion = 'old';
        var _gum = null;

        var _props = {
            recordedImage : {
                width : 0,
                height : 0,
                image : ''
            },
            recordedVideo : {
                width : 0,
                height: 0,
                video : ''
            },
            mediaPreview : {
                width : 400,
                height : 400
            },
            mediaStream : '',
            mediaObject : '',
            isStreaming : false,
            text : {
                PERMISSION_DENINED : 'Please enable webcam permission',
                WEBCAM_DISCONNECTED : 'Please connect webcam.',
                GUM_NOT_SUPPORTED : 'Webcam capture not supported in your browser'
            }
        };

        angular.extend(_props, user_props);

        var _streamReady = function(){};
        var _onError = function(){};

        this._callbacks = {
            streamReady : _streamReady,
            error : _onError
        };

        var initNavigatorMedia = function(){
            var userMedia = __getUserMedia();
            _gum = userMedia.gum;
            _gumVersion = userMedia.version;
        };

        var initMediaEvents = function(){
            if( self.getMediaObject().readyState > 3){
                self.onCanPlay();
            }else{
                self.getMediaObject().addEventListener('canplay', self.onCanPlay, false);
            }
        };

        //var setCanvas = function(){
        //    var canvas = self.getCanvas();
        //    canvas.setAttribute('width', self.getMediaPreview().width);
        //    canvas.setAttribute('height', self.getMediaPreview().height);
        //};

        var getVideoObjectFromStream = function(stream){
            var video = document.createElement('video');

            var vendorURL = window.URL || window.webkitURL;
            video.src = vendorURL.createObjectURL(stream);
            video.autoplay = true;
            //video.onloadedmetadata = function(e) {
            //    video.play();
            //    self.onCanPlay();
            //};
            return video;
        };

        var processMediaStream = function(stream){
            _props.mediaStream = stream;
            _props.mediaObject = getVideoObjectFromStream(stream);
            initMediaEvents();
        };

        var onFailure = function(e){
            var errorText;
            if(e.name == "DevicesNotFoundError" || e.name == "OverconstrainedError"){
                errorText = _props.text.WEBCAM_DISCONNECTED;
            }else if(e.name == 'PermissionDeniedError'){
                errorText = _props.text.PERMISSION_DENINED;
            }else{
                errorText = _props.text.GUM_NOT_SUPPORTED;
            }

            self.triggerEvent('error', { text : errorText });
            RingLogger.alert('rgRecorder failure', e, RingLogger.tags.RG_RECRODER);
        };

        self.on = function(eventName, func){
            self._callbacks[eventName] = func;
        };

        self.triggerEvent = function(eventName, data){
            if(!!self._callbacks[eventName]){
                self._callbacks[eventName].call(self, data);
            }
        };

        self.getProps = function(){
            return _props;
        };

        self.getMediaPreview = function(){
            return _props.mediaPreview;
        };

        self.getMediaObject = function(){
            return _props.mediaObject;
        };

        self.getStream = function(){
            return _props.mediaStream;
        };

        self.setStream = function(stream){
            _props.mediaStream = stream;
        };

        self.isStreaming = function(isStreaming){
            if( !isStreaming ){

                return _props.isStreaming;
            }else{
                _props.isStreaming = isStreaming;
            }
        };

        self.startRecording = function(){
            self.getStream().record();
        };

        self.stopRecording = function(){
            var stream = self.getStream();
            if( !stream.getTracks ){
                stream.stop();
            }else{
                var tracks = stream.getTracks();  // if only one media track
                tracks.forEach(function(aTrack){
                    aTrack.stop();
                });
            }
        };

        self.getRecordedMedia = function(callback){
            self.getStream().getRecordedData(callback);
        };

        //self.getRecordedMedia = function(){
        //
        //};

        self.captureImage = function(){
            var mediaObject = self.getMediaObject();
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            if ( mediaObject.width && mediaObject.height) {
                canvas.width = mediaObject.width;
                canvas.height = mediaObject.height;
                context.drawImage(mediaObject, 0, 0, mediaObject.width, mediaObject.height);
                return  canvas.toDataURL('image/jpeg');

            }else{

                return false;
            }
        };

        self.onCanPlay = function(ev){
            var mediaObject = self.getMediaObject();
            var mediaPreview = self.getMediaPreview();

            if (!self.isStreaming()) {
                var height = mediaObject.videoHeight / (mediaObject.videoWidth/mediaPreview.width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4/3);
                }

                mediaObject.setAttribute('width', mediaPreview.width);
                mediaObject.setAttribute('height', height);

                self.isStreaming(true);
                self.triggerEvent('streamReady', { stream : self.getStream(), media : mediaObject });
            }

        };

        self.openMedia = function(props){

            if( !_gum ){

                self.triggerEvent('error', { text : _props.text.GUM_NOT_SUPPORTED });

            }else{

                try{

                    if( _gumVersion == 'old'){
                        _gum.call(navigator, props, processMediaStream, onFailure);
                        //_gum(props, processMediaStream, onFailure);
                    }else{
                        //var constraints = { audio: false, video: { width: 1280, height: 720 } };
                        _gum.call(navigator.mediaDevices, props).then(processMediaStream).catch(onFailure);
                    }

                }catch(e){

                    RingLogger.alert(e, 'WEBCAM');
                }

            }

        };


        self.destroy = function(){
            var mediaObject = self.getMediaObject();
            if( !!mediaObject){
                mediaObject.removeEventListener('canplay', self.onCanPlay);
            }

            if(  self.getStream() ){
                self.stopRecording();
                self.setStream(null);
            }

        };

        var init = function(){
            initNavigatorMedia();
        };

        init();

    }

    function rgRecorderService(){

        var supportChecked = false;
        var _hasUserMediaSupport = false;

        this.getRecorderInstance = function(user_props){
            return new rgRecorder(user_props);
        };

        this.hasUserMediaSupport = function(){
            if( !supportChecked ){
                _hasUserMediaSupport = !!__getUserMedia().gum
                supportChecked = true;
            }

            return _hasUserMediaSupport;
        };
    }






