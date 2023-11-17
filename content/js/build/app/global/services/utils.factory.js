


/*jslint bitwise:true*/

angular
.module('ringid.global_services')
.factory('Utils', UtilsFactory);

UtilsFactory.$inject = ['$window','$document', 'RING_ROUTES', '$filter', 'APP_CONSTANTS', 'StickerEmoticonFactory', 'StickerEmoticonService', '$q', 'Storage','$rootScope', 'MESSAGES', 'SystemEvents', 'GlobalEvents', '$ringhttp', 'settings'];
function UtilsFactory($window,$document, RING_ROUTES, $filter, APP_CONSTANTS, StickerEmoticonFactory, StickerEmoticonService, $q, Storage,$rootScope, MESSAGES, SystemEvents, GlobalEvents, $ringhttp, settings) {
            var urlPattern = /(((http|https):\/{2})?((([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)|(0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])))(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\.\+\%@\/&\[\];=_-]+)?(\?[\w|\W]+)?)?))\b/im,

            emopattern = StickerEmoticonFactory.getEmoticonPattern(),
            Emomapper = StickerEmoticonService.getEmoticonMap();

    var _viewport = {x: 0, y:0, yo: 0};


    function viewportsize() {
        var w = $window,
            d = $document,
            e = d[0].documentElement,
            g = d[0].getElementsByTagName('body')[0];

        _viewport.x = w.innerWidth || e.clientWidth || g.clientWidth,
        _viewport.y = w.innerHeight|| e.clientHeight|| g.clientHeight,
        _viewport.yo = w.pageYOffset;

        return _viewport;
    }
    viewportsize();

    /**
     * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
     * images to fit into a certain area.
     *
     * @param {Number} srcWidth Source area width
     * @param {Number} srcHeight Source area height
     * @param {Number} maxWidth Fittable area maximum available width
     * @param {Number} maxHeight Fittable area maximum available height
     * @return {Object} { width, heigth }
     */
    function getScaledImageSize(srcWidth, srcHeight, maxWidth, maxHeight) {
        var ratio = 1;
        if( srcWidth > maxWidth || srcHeight > maxHeight ){
            ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
        }

        return { width: srcWidth*ratio, height: srcHeight*ratio };
    }

    var getUniqueId = function(prefix){
        if (!prefix){
            prefix = '';
        }

        return prefix + (window._cti|| "") + $window.Math.floor($window.Math.random() * (new $window.Date()).getTime());
    };

    var htmlentityencode = function(html){ //
        return String(html).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };


    var addHttps = function(url){
        if (!/^(f|ht)tps?:\/\//i.test(url)) {
            url = "http://" + url;
        }
        return url;
    };
    /**
     * @description text perser for link and emoticon
     * @param text
     * @returns converted text as html
     */
    var textParseForLinkAndEmo = function(text, flag){
        //if(/<[a-z][\s\S]*>/i.test(text)){
        text = htmlentityencode(text);
        //}

        var out=text;
        var utfEmo = /\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g;

        if(!flag){
            flag = 0;
        }

        // for temp uploaded image file starts
        if(out.substring(0,9) === 'blob:http'){// this was for tempImage; actionObj.imageSource was being used
            //if(text.substring(0,22) == 'data:image/jpeg;base64'){// this is now for tempImage; getPreview() is being used
            out = '<img width="100%" src="' + out + '" />';
            flag = 2;
        }
        // for temp uploaded image file ends

        if(flag === 0){
            //replacing the link
            out =  out.replace(urlPattern, function(match) {
                    var url = addHttps(match);
                    return '<a class="feedanchor" target="_blank" href="' + url + '">' + match + '</a>';
                    });//replacing the link
        }

        out =  out.replace(emopattern, function(match) {
                //var img = new Image();
                //img.src = Emomapper[match];
                return '<span class="em_list '+Emomapper[match].replace(/\.[A-Za-z]{3}/,'')+'" data-link="'+match+'" title="' + match + '">&nbsp;</span>';
                });//replacing the emo

        /* utf emoticon */
        if(!window.emojiSupported) {
            out =  out.replace(utfEmo, function(match) {
                    var hi, low, hex;
                    hi = match.charCodeAt(0);
                    low = match.charCodeAt(1);
                    hex = (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000).toString(16);
                    return '<u class="emo_list U_'+hex+'"></u>';
                    });
        }
        if(flag === 1){
            out = text;
        }
        return out;
        };

        function parseForLE(text, flag){ // prases for link and emoticon
            return textParseForLinkAndEmo(text, flag);
        }
        function _triggerCustomEvent(eventName, data){
            var event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
            event.data = data;
            document.dispatchEvent(event);
        }

        function _onCustomEvent(eventName, callback){
            var funcRef = function(response){
                callback.call(this, response.data || {});
            };

            document.addEventListener(eventName, funcRef);
            return funcRef;

       }

        function _removeCustomEvent(eventName, callback){
            document.removeEventListener(eventName, callback);
        }
        function safeDigest($scope){
            if ( $scope.$parent && $scope.$parent.$id !== 1){
                $scope.$parent.$rgDigest();
            }else{
                $scope.$rgDigest();
            }
        }
        function generateUUID() {
            var d = new Date().getTime();
            if(window.performance && typeof window.performance.now === "function"){
                d += performance.now(); //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random()*16)%16 | 0;
                    d = Math.floor(d/16);
                    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                    });
            return uuid;
        }

        function getScrollBarWidth() {
            var inner = document.createElement('p');
            inner.style.width = "100%";
            inner.style.height = "200px";

            var outer = document.createElement('div');
            outer.style.position = "absolute";
            outer.style.top = "0px";
            outer.style.left = "0px";
            outer.style.visibility = "hidden";
            outer.style.width = "200px";
            outer.style.height = "150px";
            outer.style.overflow = "hidden";
            outer.appendChild(inner);

            document.body.appendChild(outer);
            var w1 = inner.offsetWidth;
            outer.style.overflow = 'scroll';
            var w2 = inner.offsetWidth;

            if (w1 === w2) {
                w2 = outer.clientWidth;
            }

            document.body.removeChild(outer);
            inner = outer = null;
            return (w1 - w2);
        }

        function getRingRoute(name, params){

            if( !RING_ROUTES[name] ) {
                return '';
            }

            var routeString = RING_ROUTES[name],
                commentId;

            switch (name){
                case 'HOME':
                case 'FAQ' :
                    break;

                case 'SINGLE_FEED':
                    if( !!params['feedId']){
                        routeString =  routeString.replace(':feedId', params['feedId']);
                    }

                    var shared = !!params['shared'] ? 'shared' : '';
                    routeString =  routeString.replace(':shared?', shared );

                    if( !!shared){
                        commentId = params['commentId'] || 0;
                        routeString =  routeString.replace(':commentId?', commentId);
                    }else{
                        commentId = params['commentId'] || '';
                        routeString =  routeString.replace(':commentId?/', commentId);
                    }


                    break;

                case 'WHO_SHARED_FEED' :
                    if( !!params['feedId']){
                        routeString =  routeString.replace(':feedId', params['feedId']);
                    }

                    commentId = params['commentId'] || '';
                    routeString =  routeString.replace(':commentId?', commentId);

                    break;


                case 'SINGLE_IMAGE':
                    if( !!params['imageId']){
                        routeString = routeString.replace(':imageId', params['imageId']);
                    }

                    commentId = params['commentId'] || '';
                    routeString =  routeString.replace(':commentId?', commentId);

                    break;

                case 'SINGLE_MEDIA':
                    if( !!params['mediaId']){
                        routeString = routeString.replace(':mediaId', params['mediaId']);
                    }

                    commentId = params['commentId'] || '';
                    routeString =  routeString.replace(':commentId?', commentId);

                    break;
                case 'USER_PROFILE':
                    if( !!params['uId']){
                        routeString = routeString.replace(':uId', params['uId']);
                    }else{
                        
                        

                    }

                    if( !!params['utId']){
                        routeString = routeString.replace(':utId', params['utId']);
                    }else{
                        routeString = routeString.replace('/:utId', '');
                    }

                    if( !!params['albumId']){
                        routeString = routeString.replace(':albumId?', params['albumId']);
                    }else{
                        routeString = routeString.replace('/:albumId?', '');
                    }
                    break;

                case 'CIRCLE_HOME':
                    if( !!params['circleId']){
                        routeString = routeString.replace(':circleId', params['circleId']);
                    }
                    break;


            }

            if( !!params['subpage']){
                routeString = routeString.replace(':subpage?', params['subpage']);
            }else{
                routeString = routeString.replace('/:subpage?', '');
            }

            return '/#' + routeString;

        }

        function profileVerbalDate(timestamp){
            return $filter('date')(timestamp,"yyyy-MM-dd");
        }

        function _string2ArrayBuffer(str) {
            var arr = str.split(","),
                view = new Uint8Array( arr );
            return view.buffer;
        }

        function _arrayBuffer2String(buf) {
            var view = new Uint8Array( buf );
            return Array.prototype.join.call(view, ",");
        }

        function hasEmoticon (text){
            var utfEmo = /\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g;

            if(!text){
                return false;
            }else{
                return utfEmo.test(text) || emopattern.test(text);
            }
        }


        function verbalDate(timestamp,fromTimeStamp) {
            var date,diff,day_diff,Math = $window.Math,today = new Date();

            fromTimeStamp = fromTimeStamp || Date.now();

            if(isNaN(timestamp)){
                date = new Date((timestamp || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
                     timestamp = date.getTime();
            }else{
                date = new Date(timestamp);
            }
            diff = ((fromTimeStamp - timestamp) / 1000);//diff in second
            day_diff = Math.floor(diff / 86400);// 1 day = 86400 second// its calculate diff in day
            // if ( isNaN(day_diff) || day_diff < 0 )
            if (isNaN(day_diff)) {
                return "";
            }
            switch (true){
                case day_diff < 1: // time is equal from date
                    switch(true){
                        case diff < 60:
                            return "just now";
                        case diff < 120 :
                            return "1 minute ago";
                        case diff < 3600 : // within a hour
                            return Math.floor( diff / 60 ) + " minutes ago";
                        case diff < 7200 :
                            return "1 hour ago";
                        case diff < 86400 : //within a day show as minute
                            return Math.floor( diff / 3600 ) + " hours ago";
                        default :
                            return $filter('date')(timestamp,"MMM d, h:mm a");
                    }
                    break;
                case day_diff === 1 : // 1 day before from date
                    return "yesterday at "+ $filter('date')(timestamp,"h:mm a");
                case day_diff < 7 :
                    return $filter('date')(timestamp,"EEEE 'at' h:mm a");
                case day_diff < 365 :
                    if(today.getUTCFullYear() === date.getUTCFullYear()){
                        return $filter('date')(timestamp,"MMMM d 'at' h:mm a");
                    }
                    return $filter('date')(timestamp,"MMMM d yyyy 'at' h:mm a");
                default :
                    return $filter('date')(timestamp,"MMM d, yyyy");
            }
        }

        function getDefaultColumn(){
            if(!_viewport){
                viewportsize();
            }
            var windowWidth = _viewport.x;

            if(windowWidth < 1280) { // device between 720 and 980
                return 1;
            }else if(windowWidth >= 1280 && windowWidth <=1800){
                return 2;
            }else if(windowWidth > 1800){
                return 3;
            }
        }

        function _debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate){ func.apply(context, args); }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        }

        function _dataURLToBlob(dataurl) {
            var base64_marker = ';base64,',
                parts,
                contenttype,
                binary;

            if (dataurl.indexOf(base64_marker) === -1) {
                parts = dataurl.split(',');
                contenttype = parts[0].split(':')[1];
                binary = decodeURIComponent(parts[1]);

                return new Blob([binary], {type: contenttype});
            }

            parts = dataurl.split(base64_marker);
            contenttype = parts[0].split(':')[1];
            binary = window.atob(parts[1]);

            var uint8array = new Uint8Array(binary.length);

            for (var i = 0; i < binary.length; ++i) {
                uint8array[i] = binary.charCodeAt(i);
            }

            return new Blob([uint8array], {type: contenttype});

        }


        function chatVerbalDate(timestamp){
            //return $filter('date')(timestamp,"MMM d, yyyy 'at' h:mm a");
            return $filter('date')(timestamp,"h:mm a");
        }

        var getGoogleMapStaticUrl = function (lat, lng, title) {
            if( !title ){
                title = "({0},{1})".format(lat,lng);
            }
            var url = "https://maps.googleapis.com/maps/api/staticmap?center={0},{1}&zoom=18&size=640x170&key={3}&markers=color:orange|label:A|{2}|{0},{1}";
            url = url.format(lat, lng, title, APP_CONSTANTS.GOOGLE_MAP_KEY);
            return url;
        };

        var getGoogleMapJSUrl = function (lat, lng, location, embed) {
            var url;
            if(!lat || !lng){
                url = "http://maps.google.com?q={0}".format(location);
            }else{
                url = "https://maps.google.com/maps?q={0},{1}&hl=en;z=18;iwd=1".format(lat, lng);
            }

            if(!!embed){
                url += "&output=embed";
            }
            return url;
        };

         function _getUserLocation(geocode){

            var defer = $q.defer();
            var returnPromise = defer.promise;

            //Check Local Does Local Storage Contains Values
            var locationInfo = Storage.getData('uLocationInfo');
            if( !!locationInfo && !!locationInfo.lat ){
                locationInfo['sucs'] = true;
                returnPromise = locationInfo;

            }else{

                // if the browser supports the w3c geo api
                if(navigator.geolocation){
                  // get the current position
                  navigator.geolocation.getCurrentPosition(

                  // if this was successful, get the latitude and longitude
                  function(position){
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;

                    var latLng = {lat : lat, lng: lng };
                    if( !!geocode ){
                        var geocoder = new google.maps.Geocoder;
                        geocoder.geocode({'location': latLng}, function(results, status) {
                            if (status === google.maps.GeocoderStatus.OK) {

                                Storage.setData('uLocationInfo', {lat : lat, lng: lng, description : results[1].formatted_address});

                                defer.resolve({sucs: true, lat : lat, lng : lng, description : results[1].formatted_address});

                            }else{

                                Storage.setData('uLocationInfo', {lat : lat, lng: lng});

                                defer.resolve({sucs: true, lat : lat, lng : lng});
                            }
                        });

                    }else{

                        Storage.setData('uLocationInfo', {lat : lat, lng: lng});

                        defer.resolve({sucs: true, lat : lat, lng : lng});
                    }

                  },
                  // if there was an error
                  function(error){
                    defer.resolve({sucs: false, error : error });
                  });
                }

            }

            return $q.when(returnPromise);
        }

		function getCurrentPageTitle(){
		     return document.title;
		}
		function setPageTitle(title,broadcastEv){
		     document.title = title;
		     if(broadcastEv){
		     	 $rootScope.$broadcast("PAGE_TITLE_CHANGE",{title:title});
			 }
		}


        function _getReasonMessageFromResponse(responseObj){
            if(!!responseObj.mg){
                return responseObj.mg;
            }else{
                return _getReasonMessage(responseObj.rc);
            }
        }

        function _getReasonMessage(reasonCode){
            if(!!MESSAGES['RC' + reasonCode]){
                return MESSAGES['RC' + reasonCode];
            }

            return "";
        }


        function feedColumn(){
            var default_col = getDefaultColumn();
            var col = parseInt(Storage.getCookie('col'));
            if(!col || col > default_col){
                default_col = default_col > 2 ? 2 : default_col;
                //Storage.setCookie('col',default_col);
                return default_col;
            }
            return col;

        }

        var animationStart, animationCurrentTime, animationChange, animationDuration = 500;

        function _resetScroll() {
            animationStart = document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop,
            animationCurrentTime = 0,
            animationChange = (-1)*animationStart;
        }

        function _animateScroll() {

                animationCurrentTime += 25;
                var val = Math.easeIn(animationCurrentTime, animationStart, animationChange, animationDuration);

                document.documentElement.scrollTop = val;
                document.body.parentNode.scrollTop = val;
                document.body.scrollTop = val;

                if (animationCurrentTime < animationDuration) {
                     requestAnimationFrame(_animateScroll);
                }
        }

        function _getOGDetails(url){
            return $ringhttp.get(settings.ogServiceUrl + '?url=' + encodeURIComponent(url));
        }



        function _getImageUrlDimension(imgUrl){
            var defer = $q.defer();

            var img = new Image();
            img.onload = function() {
                defer.resolve({imgUrl: this.src, width : this.width, height: this.height});
            };
            img.src = imgUrl;

            setTimeout(function(){
                defer.resolve({width : 0, height: 0});
            }, 30000);

            return defer.promise;

        }

        function _filterImagesByDimentions(imageUrls, lowestDimension){
            var defer = $q.defer();

            var allImageDimensionPromises = [];
            var filteredImages = [];

            if(!lowestDimension.width){
                lowestDimension.width = 0;
            }

            if(!lowestDimension.height){
                lowestDimension.height = 0;
            }


            angular.forEach(imageUrls, function(anImageUrl){
                setTimeout(function(){

                    _getImageUrlDimension(anImageUrl).then(function(anImageDimension){
                        var widthValid, heightValid;

                        if( !!anImageDimension.width && ( anImageDimension.width >= lowestDimension.width ) ){
                            widthValid = true;
                        }

                        if( !!anImageDimension.height && ( anImageDimension.height >= lowestDimension.height ) ){
                            heightValid = true;
                        }

                        if(!!widthValid && !!heightValid){
                            filteredImages.push(anImageDimension.imgUrl);
                            if( filteredImages.length == imageUrls.length ){
                                defer.resolve(anImageDimension.imgUrl);
                            }else{
                                defer.notify(anImageDimension.imgUrl);
                            }
                        }
                    });
                });
            });

            setTimeout(function(){
                if( filteredImages.length == 0){
                    defer.resolve([]);
                }
            },20000);

            return defer.promise;

        }

        function _setFeedColumn(num){
            Storage.setCookie('col',parseInt(num));
        }

        function ResizeProcessor(event) {
        // moved here from rg-resize directive
            requestAnimationFrame(function() {

                viewportsize();
                $rootScope.windowHeight = _viewport.y;
                $rootScope.windowWidth = _viewport.x;

                $rootScope.$broadcast(SystemEvents.COMMON.WINDOW_RESIZED, _viewport);
            });
            event.preventDefault();
        }
        GlobalEvents.bindHandler('window', 'resize', ResizeProcessor);
        GlobalEvents.bindHandler('window', 'scroll', ResizeProcessor);


        return {
                generateUUID: generateUUID,
                tabId : window._cti,
                viewport : _viewport,
                viewportsize : viewportsize,
                scrollbarWidth: getScrollBarWidth(),
                getUniqueID:getUniqueId,
                triggerCustomEvent : _triggerCustomEvent,
                onCustomEvent : _onCustomEvent,
                removeCustomEvent : _removeCustomEvent,
                getRingRoute: getRingRoute,
                profileVerbalDate: profileVerbalDate,
                verbalDate: verbalDate,
                getScaledImageSize : getScaledImageSize,
                debounce : _debounce,
                dataURLToBlob: _dataURLToBlob,
                string2ArrayBuffer : _string2ArrayBuffer,
                arrayBuffer2String  : _arrayBuffer2String,
                safeDigest : safeDigest,
                chatVerbalDate : chatVerbalDate,
                parseForLE : parseForLE,
                getGoogleMapJSUrl : getGoogleMapJSUrl,
                getGoogleMapStaticUrl : getGoogleMapStaticUrl,
                hasEmoticon : hasEmoticon,
                getUserLocation : _getUserLocation,
                getCurrentPageTitle :   getCurrentPageTitle,
                setPageTitle : setPageTitle,

                getReasoneMessage : _getReasonMessage,
                getReasonMessageFromResponse : _getReasonMessageFromResponse,
                getDefaultColumn: getDefaultColumn,
                feedColumn : feedColumn,

                animateScroll : _animateScroll,
                resetScroll : _resetScroll,
                getOGDetails : _getOGDetails,
                filterImagesByDimentions : _filterImagesByDimentions,
                setFeedColumn: _setFeedColumn
        };

    }

