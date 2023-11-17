    var ringUtilsModule;

    try {
        ringUtilsModule = angular.module('ringid.utils');
    } catch (e) {
        console.warn("Utils Module Not Found");
    }
    ringUtilsModule.directive('rgUrlOgFetcher', rgUrlOgFetcher );

    rgUrlOgFetcher.$inject = ['$compile'];
    function rgUrlOgFetcher($compile) {
        return {
            restrict : 'E',
            scope : {
                fetchedOgInfo : '=',
                editorContent : '=',
                showPreview : '=',
                filterOnProgress : '=',
                loadingData : '='
            },
            link : function(scope, element, attr){

                var previewDom;

                scope.fetchedOgInfo = scope.fetchedOgInfo || {};

                if(!!scope.filterOnProgress)
                    scope.filterOnProgress = false;

            },
            controller : ['$scope', '$rootScope', '$timeout', 'Utils', 'settings', function($scope, $rootScope, $timeout, Utils, settings){
                // var ORIG_URL_DETECTION_REGEX = /(((http|https):\/{2})+(([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?)?))\b/im;

                var REGX_TOP_LEVEL_DOMAINS = "(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)";
                var REGX_HTTP_HTTPS = "((http|https):\/{2})+";
                var REGX_NAME_DOMAIN = "([0-9a-z_-]+\.)+";
                var REGX_PORT = "(:[0-9]+)?";
                var REGX_PATH = "((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?)?";

                var REGX_IP_ADDRESS = "0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])"

                var REGEX_URL_DETECTION_STRING = "(" +  REGX_HTTP_HTTPS +
                                                        "(" + "((" + REGX_NAME_DOMAIN + REGX_TOP_LEVEL_DOMAINS + ")"  + "|" + "(" + REGX_IP_ADDRESS + "))"
                                                        + REGX_PORT + REGX_PATH + ")" + ")\\b";


                var URL_DETECTION_REGEX = /(((http|https):\/{2})?((([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)|(0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])))(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\.\+\%@\/&\[\];=_-]+)?(\?[\w|\W]+)?)?))\b/im;

                var previewDom = '';

                var urlCache = {};

                var debounceLimit = 4000;
                var lastProcessTime = 0;
                var lastSkipTime = 0;
                var lastDetectedUrl = "";
                var idleInterval = null;

                function doDigest(){
                    try{

                        if( !$scope.$parent.$parent ){
                            $scope.$parent.$rgDigest();
                        }else{
                            $scope.$parent.$parent.$rgDigest();
                        }


                    }catch(e){
                        Utils.safeDigest($scope);
                    }
                }
				 // ####
                $scope.$watch('editorContent', Utils.debounce(function(newValue, oldValue){

                    processModelUpdate(newValue, oldValue);

                    doDigest();


                }, 500) );

                //console.log($scope.editorContent);



                function processModelUpdate(newValue, oldValue){

                    if( !shouldProcessModelChange(newValue, oldValue)){
                        return;
                    }

                    if(!!newValue && URL_DETECTION_REGEX.test(newValue)) {
                        console.log('Updated Value ', newValue);
                        var matches = newValue.match(URL_DETECTION_REGEX);
                        var firstUrl = matches[1];
                        if (firstUrl) {
                            var firstUrlDomain = !matches[5] ? '' : matches[5];

                            if(!/^https?:\/\//.test(firstUrl)){
                                firstUrl = 'http://' + firstUrl;
                            }

                                console.log('Detected Url', firstUrl);
                            if( !shouldProcessChange(firstUrl) ) return;

                            console.log('Starting to Fetch Url', firstUrl);
                            // firstUrl = firstUrl.replace('/https/g', function(){ return ''});
                            // console.log(firstUrl);

                            var cachedValue = getFromUrlCache(firstUrl);
                            if(!!cachedValue){

                                setFetchedOgInfo( cachedValue );
                                showUrlOgInfoPreview();
                                emitFeedBoxHeightChange();

                            }else{

                                showLoading();
                                emitFeedBoxHeightChange();

                                doDigest();

                                Utils.getOGDetails(firstUrl).success(function (data) {
                                    hideLoading();
                                    console.log('Server Response :', data);
                                    if (!!data && !!data.sucs) {
                                        setToUrlCache(firstUrl, data);
                                        data['lnkDmn'] = firstUrlDomain;
                                        data['url'] = firstUrl;

                                        data = fixFetchedOgInfo(data, firstUrl);

                                        setFetchedOgInfo(data);
                                        // filterImages();
                                        showUrlOgInfoPreview();

                                    }else{
                                        resetFetchedOgInfo();
                                        // resetFilterOnProgress();
                                        hideUrlOgInfoPreview();
                                    }


                                    emitFeedBoxHeightChange();

                                    doDigest();


                                }).error(function (data) {
                                    resetFetchedOgInfo();
                                    // resetFilterOnProgress();
                                    resetLastDetectedUrl();
                                    hideUrlOgInfoPreview();
                                    hideLoading();
                                    emitFeedBoxHeightChange();

                                    doDigest();
                                });
                            }

                        }



                    }else{
                        resetFetchedOgInfo();
                        hideUrlOgInfoPreview();

                    }
                    $scope.$parent.$rgDigest();
                }

                function fixUrl(url){
                    if(!url) return '';

                    if( url[url.length -1] != '/')
                        return url + '/';
                    return url;
                }
                function shouldProcessChange(url){

                    if(!$scope.fetchedOgInfo || lastDetectedUrl != url){
                        lastDetectedUrl = url;
                        return true;
                    }
                    console.log('Same Url Will Not Fetch');
                    return false;
                }

                function setToUrlCache(url, data){ urlCache[url] = data; }
                function getFromUrlCache(url){ urlCache[url]; }

                function setFetchedOgInfo(fetchedOgInfo) { $scope.fetchedOgInfo = fetchedOgInfo;  }
                function resetFetchedOgInfo() { $scope.fetchedOgInfo = {};  }

                function showLoading(){ $scope.loadingData = true; }
                function hideLoading(){ $scope.loadingData = false; }
                function isLoading(){ return $scope.loadingData; }

                function showUrlOgInfoPreview(){ $scope.showPreview = true; }
                function hideUrlOgInfoPreview(){ $scope.showPreview = false; }

                // function setFilterOnProgress(){ $scope.filterOnProgress = true; }
                // function resetFilterOnProgress(){ $scope.filterOnProgress = false;  }

                function resetLastDetectedUrl(){ lastDetectedUrl = '' }

                function startIdleDetectInterval(){
                    if(!idleInterval){
                        idleInterval = setInterval(function(){
                            if(detectIdleState()){
                                processModelUpdate($scope.editorContent);
                                clearIdleIteterval();
                            }
                        }, 2 * debounceLimit);
                    }

                }

                function clearIdleIteterval(){
                    clearInterval(idleInterval);
                }

                function fixFetchedOgInfo(fetchedOgInfo, requestedUrl) {
                    var fixedOgInfo = angular.extend({}, fetchedOgInfo);
                    if(!fixedOgInfo.url){
                        fixedOgInfo.url = requestedUrl;
                    }
                    if(!fixedOgInfo.title){
                        fixedOgInfo.title = fixedOgInfo.lnkDmn;
                    }

                    if( !!fetchedOgInfo.images ){
                        var len = fetchedOgInfo.images.length;
                        for(var index = 0; index < len; index++){

                            if(settings.secure && /^http:/.test(fetchedOgInfo.images[index])){
                                fetchedOgInfo.images[index] = settings.httpsUrl + '/ImageProxy.png?url=' + fetchedOgInfo.images[index].replace(/http:\/\//,'');
                             }
                        }

                    }
                    fixedOgInfo.title = decodeEntities(fixedOgInfo.title);
                    fixedOgInfo.description = decodeEntities(fixedOgInfo.description);

                    return fixedOgInfo;
                }

                function emitFeedBoxHeightChange(){
                    $timeout(function(){
                        $rootScope.$broadcast('statusHeightChange');
                    });
                }

                // function setActiveImageInOgInfo(images){
                //     if(images.length > 0){
                //         $scope.fetchedOgInfo.image = images[0];
                //     }
                // }

                // function setImagesInOgInfo(images){
                //     $scope.fetchedOgInfo.images = images;
                // }



                function shouldProcessModelChange(newValue, oldValue){
                    // console.log($scope.fetchedOgInfo);

                    if( isLoading() ) return false;

                    if( !$scope.fetchedOgInfo ||
                        ( !$scope.fetchedOgInfo.image && !$scope.fetchedOgInfo.title && !$scope.fetchedOgInfo.description ) ){
                            resetLastDetectedUrl();
                            return true;
                    }

                    return false;

                }

                function detectIdleState(){
                    if( (Date.now() - lastSkipTime) > 1.5 * debounceLimit ){
                        return true;
                    }
                    return false;
                }


            }]
        };
    }

