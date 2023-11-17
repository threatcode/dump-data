
    function utilsFactory($window,$document,APP_CONSTANTS, settings, $filter,StorageFactory,StickerEmoticonFactory, RING_ROUTES, MESSAGES, $ringhttp, $q,Storage){

        var self = this,

            returnOb = {},
        //urlPattern = /((http|ftp|https):)?\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi,
        //    urlPattern = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:\-%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
            urlPattern = /(((http|https):\/{2})?((([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)|(0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])))(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?(\?[\w|\W]+)?)?))\b/gi,

            emopattern = StickerEmoticonFactory.getEmoticonPattern(),

            Emomapper = StickerEmoticonFactory.getEmoticonUrlMapWithHtmlEncode();

        var viewportsize = function() {
            var w = $window,
                d = $document,
                e = d[0].documentElement,
                g = d[0].getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight|| e.clientHeight|| g.clientHeight,
                yo = w.pageYOffset;
            return {x:x,y:y,yo:yo};
        };
        //  console.dir($window.Math);
        /**
         * @description : convert html entity to text.
         */
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
                    return '<a class="feedanchor" target="_blank" href="' + url + '"> ' + match + '</a>';
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

        var getUniqueId = function(prefix){
            if (!prefix){
                prefix = '';
            }

            return prefix + (window._cti|| "") + $window.Math.floor($window.Math.random() * (new $window.Date()).getTime());
        };

        var hasEmoticon = function(text){
            var utfEmo = /\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g;

            if(!text){
                return false;
            }else{
                return utfEmo.test(text) || emopattern.test(text);
            }
        };



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
                url = "http://maps.google.com?q={0}".format(location)
            }else{
                url = "https://maps.google.com/maps?q={0},{1}&hl=en;z=18;iwd=1".format(lat, lng);
            }

            if(!!embed){
                url += "&output=embed";
            }

            return url;
        };



        //};



        function getDefaultColumn(){
            if(!returnOb.viewport){
                returnOb.viewport = viewportsize();
            }
            var windowWidth = returnOb.viewport.x;

            if(windowWidth < 1280) { // device between 720 and 980
                return 1;
            }else if(windowWidth >= 1280 && windowWidth <=1800){
                return 2;
            }else if(windowWidth > 1800){
                return 3;
            }
        }

        function feedColumn(){
            var default_col = getDefaultColumn();
            var col = parseInt(Storage.getCookie('col'));
            if(!col || col > default_col){
                default_col = default_col > 2 ? 2 : default_col;
                //Storage.setCookie('col',default_col);
                return default_col
            }
            return col;

        }

        //function availableCellWidthByWindow(feedCol){
            //return (returnOb.viewport.x - (APP_CONSTANTS.LEFT_BAR_WIDTH + APP_CONSTANTS.RIGHT_BAR_WIDTH + (feedCol * APP_CONSTANTS.CELL_MARGIN)))/feedCol;
        //}

        function cellWidthByCss(col){
            // from media css
            var width = returnOb.viewport.x;
            if(col ===1 && width >=1280){
                return 600;
            }
            if(width >= 768 && width <= 799){ //col =1
                return 329;
            }else if(width >=800 && width <= 979){ // col =1
                return 361;
            }else if(width >=980 && width <= 1279){//col 1 and 2
                return 541;
            }else if(width >=1280 && width <= 1349){//col = 2
                return 423;
            }else if(width >=1350 && width <= 1399){//col = 2
                return 458;
            }else if(width >=1400 && width <= 1499){//col = 2
                return 475;
            }else if(width >=1500 && width <= 1649){//col = 2
                return 510;
            }else if(width >=1650 && width <= 1799){//col = 2
                return 560;
            }else if(width <= 1920){//col 3
                return 487;
            }else if(width <= 2650){//col 3
                return 487;
            }else{
                RingLogger.alert("viewport else occured should not occur",'ERROR');
                return 500;
            }
        }

        function FeedCellWidth(){
            var feedCol = feedColumn();
            feedCol = parseInt(feedCol);
            if(feedCol === 1){
                return 600;
            }else{
                return cellWidthByCss(feedCol);
            }
            //     availableWidthByWindow = cellWidthByCss(feedCol);

            // if(feedCol == 1){
            //     cellWidth = availableWidthByWindow > 500 ? 500 : availableWidthByWindow;
            // }else if(feedCol == 2){
            //     cellWidth = availableWidthByWindow > 475 ? 475 : availableWidthByWindow;
            // }else if(feedCol == 3){
            //     cellWidth = availableWidthByWindow > 440 ? 440 : availableWidthByWindow;
            // }


            // return cellWidth;
        }

        function _getOGDetails(url){
            return $ringhttp.get(settings.ogServiceUrl + '?url=' + encodeURIComponent(url));
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

        function _getImageUrlDimension(imgUrl){
            var defer = $q.defer();

            var img = new Image();
            img.onload = function() {
                defer.resolve({imgUrl: this.src, width : this.width, height: this.height});
            };
            img.src = imgUrl;

            setTimeout(function(){
                defer.resolve({width : 0, height: 0});
            }, 15000);

            return defer.promise;

        }

        function _dataURLToBlob(dataURL) {
            var BASE64_MARKER = ';base64,',
                parts,
                contentType,
                binary;

            if (dataURL.indexOf(BASE64_MARKER) == -1) {
                parts = dataURL.split(',');
                contentType = parts[0].split(':')[1];
                binary = decodeURIComponent(parts[1]);

                return new Blob([binary], {type: contentType});
            }

            parts = dataURL.split(BASE64_MARKER);
            contentType = parts[0].split(':')[1];
            binary = window.atob(parts[1]);

            var uInt8Array = new Uint8Array(binary.length);

            for (var i = 0; i < binary.length; ++i) {
                uInt8Array[i] = binary.charCodeAt(i);
            }

            return new Blob([uInt8Array], {type: contentType});

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
                allImageDimensionPromises.push( _getImageUrlDimension(anImageUrl) );
            });

            $q.all(allImageDimensionPromises).then( function(allImageDimensions){
                console.log(allImageDimensions);
                angular.forEach(allImageDimensions, function(anImageDimension){
                    var widthValid, heightValid;

                    if( !!anImageDimension.width && ( anImageDimension.width >= lowestDimension.width ) ){
                        widthValid = true;
                    }

                    if( !!anImageDimension.height && ( anImageDimension.height >= lowestDimension.height ) ){
                        heightValid = true;
                    }

                    if(!!widthValid && !!heightValid){
                        filteredImages.push(anImageDimension.imgUrl);
                    }
                });

                return defer.resolve(filteredImages);

            });

            setTimeout(function(){ defer.resolve([]); }, 20000);

            return defer.promise;

        }

        function _callXTimeAfterYIntervalStopOnSuccess(callback, successChecker, onFailCallback, maxExecutionCount, interval){
            var currentExecutionCount = 0;

            var doExecute = function(){
                if( !currentExecutionCount || ( currentExecutionCount < maxExecutionCount && !successChecker.call(null, currentExecutionCount) ) ){

                    callback.call();
                    currentExecutionCount++;
                    setTimeout(doExecute, interval);

                }else{

                    if(!successChecker.call(null, currentExecutionCount)){
                        onFailCallback.call();
                    }
                }
            };

            doExecute();
        }

        var _requestMultipleTime = function(func, args){

            var defer = $q.defer();
            var success = false;

            _callXTimeAfterYIntervalStopOnSuccess(function(){

                var response = func.apply(this, args);

                if(!!response.then){

                    response.then(function(response){
                        success = true;
                        defer.resolve(response);

                    }, function(response){
                        success = true;
                        defer.reject(response);
                    });

                }else{
                    defer.reject({sucs :false, rc : 'Invalid' });
                    RingLogger.alert('RequestMultipleTime Expect `func` as promise', RingLogger.tags.DEBUG);
                }

            }, function(){

                return success;

            }, function(){
                if( !success){
                    defer.reject({timeout : true, sucs :false })
                }
            }, 5, 3000);

            return defer.promise;
        };

        function _triggerCustomEvent(eventName, data){
            var event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
            event.data = data;
            document.dispatchEvent(event);
        }

        //function _onCustomEvent(eventName, callback){
        //    document.addEventListener(eventName, function(response){
        //        callback.call(this, response.data);
        //    });
        //
        //}
        function _onCustomEvent(eventName, callback){
            var funcRef = function(response){
                callback.call(this, response.data);
            };

            document.addEventListener(eventName, funcRef);

            return funcRef;

        }

        function _removeCustomEvent(eventName, callback){
            document.removeEventListener(eventName, callback);
        }

        //function _extendIfSet(target, firstSource){
        //    var targetKeys = Object.keys(target);
        //
        //    for(var index = 0; index < targetKeys.length; index++){
        //        var aTargetKey = targetKeys[index];
        //        if( !!firstSource[aTargetKey] ){
        //            target[aTargetKey] = firstSource[aTargetKey];
        //        }
        //    }
        //
        //    return target;
        //
        //}
        /**
         * return current selected range from current input. if nothing selected and cursor focusing some element its return current cursor point
         *
         */
        function getSelection() {
            var sel;
            sel = window.getSelection();
            if (sel.getRangeAt) {

                return sel.getRangeAt(0);

            } else if (document.selection && document.selection.createRange) {
                var range = document.createRange();
                range.setStart(selection.anchorNode, selection.anchorOffset);
                range.setEnd(selection.focusNode, selection.focusOffset);
                return range;
            }
            return null;
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

                if (w1 == w2) {
                    w2 = outer.clientWidth;
                }

                document.body.removeChild(outer);
                inner = outer = null;
                return (w1 - w2);
        }

        function _getUserLocation(){

            var defer = $q.defer();

            // if the browser supports the w3c geo api
            if(navigator.geolocation){
              // get the current position
              navigator.geolocation.getCurrentPosition(

              // if this was successful, get the latitude and longitude
              function(position){
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                var latLng = {lat : lat, lng: lng }

                var geocoder = new google.maps.Geocoder;
                geocoder.geocode({'location': latLng}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {

                        defer.resolve({sucs: true, lat : lat, lng : lng, description : results[1].formatted_address});

                    }else{

                        defer.resolve({sucs: true, lat : lat, lng : lng});
                    }
                });



              },
              // if there was an error
              function(error){
                defer.resolve({sucs: false, error : error })
              });
            }

            return defer.promise;
        }


        returnOb =  {
            generateUUID: generateUUID,

            getRingRoute : getRingRoute,
            getOGDetails : _getOGDetails,
            getReasoneMessage : _getReasonMessage,
            getReasonMessageFromResponse : _getReasonMessageFromResponse,
            debounce : _debounce,
            tabId : window._cti,
            //getTabId : getTabId,
            animateScroll : _animateScroll,
            resetScroll : _resetScroll,

            viewport : viewportsize(),
            viewportsize : viewportsize,
            scrollbarWidth: getScrollBarWidth(),
            feedCellWidth : FeedCellWidth(),
            string2ArrayBuffer : _string2ArrayBuffer,
            arrayBuffer2String : _arrayBuffer2String,

            setFeedCellWidth : function(){
                returnOb.feedCellWidth = FeedCellWidth();
            },
            hasSocket : function(){
                return true;
                //console.log($localStorage.socketon);
                //console.log($localStorage.loginData.socketOn);
                //return $localStorage.loginData && !!$localStorage.loginData.socketOn;
            },
            parseForLE : function(text, flag){ // prases for link and emoticon
                return textParseForLinkAndEmo(text, flag);
            },
            init:function(){
                //returnOb.viewport = viewportsize();
            },
            feedColumn : feedColumn,
            getDefaultColumn : getDefaultColumn,
            setFeedColumn : function(num){
                Storage.setCookie('col',parseInt(num));
            },
            getUniqueID: function (prefix) {
                return getUniqueId(prefix);
            },
            getRandomString: function(length) {
                var result = '',
                    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

                for (var i = length; i > 0; --i) {
                    result += chars[Math.round(Math.random() * (chars.length - 1))];
                }

                return result;
            },
            getToken : '234', //$document[0].getElementById('sectoken').getAttribute('data-sec'),
            chatVerbalDate: function(timestamp){
                //return $filter('date')(timestamp,"MMM d, yyyy 'at' h:mm a");
                return $filter('date')(timestamp,"h:mm a");
            },
            profileVerbalDate: function(timestamp){
                return $filter('date')(timestamp,"yyyy-MM-dd");
            },
            verbalDate : function(timestamp,fromTimeStamp){
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
                if (isNaN(day_diff))
                    return "";
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
            },

            getUserLocation : _getUserLocation,

            getImageUrlDimension : _getImageUrlDimension,
            filterImagesByDimentions : _filterImagesByDimentions,
            dataURLToBlob : _dataURLToBlob,
            callXTimeAfterYIntervalStopOnSuccess : _callXTimeAfterYIntervalStopOnSuccess,
            requestMultipleTime : _requestMultipleTime,
            triggerCustomEvent : _triggerCustomEvent,
            onCustomEvent : _onCustomEvent,
            removeCustomEvent : _removeCustomEvent,
            getSelection : getSelection,
            getGoogleMapStaticUrl : getGoogleMapStaticUrl,
            getGoogleMapJSUrl : getGoogleMapJSUrl,

            hasEmoticon : hasEmoticon,
            safeDigest : safeDigest

        };

        ////////////////////////////


        function getRingRoute(name, params){

            if( !RING_ROUTES[name] )
                return '';

            var routeString = RING_ROUTES[name];

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

                    var commentId;
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

                    var commentId = params['commentId'] || '';
                    routeString =  routeString.replace(':commentId?', commentId);

                    break;


                case 'SINGLE_IMAGE':
                    if( !!params['imageId']){
                        routeString = routeString.replace(':imageId', params['imageId']);
                    }

                    var commentId = params['commentId'] || '';
                    routeString =  routeString.replace(':commentId?', commentId);

                    break;

                case 'SINGLE_MEDIA':
                    if( !!params['mediaId']){
                        routeString = routeString.replace(':mediaId', params['mediaId']);
                    }

                    var commentId = params['commentId'] || '';
                    routeString =  routeString.replace(':commentId?', commentId);

                    break;
                case 'USER_PROFILE':
                    if( !!params['uId']){
                        routeString = routeString.replace(':uId', params['uId']);
                    }else{
                        RingLogger.print(params, RingLogger.tags.PROFILE);
                        RingLogger.print('Invalid Route Params Provided', RingLogger.tags.PROFILE);

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

        return returnOb;
    }

