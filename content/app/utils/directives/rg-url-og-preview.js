


    angular.module('ringid.utils')
    .directive('ogImageSrc', ogImageSrc )
    .directive('rgUrlOgPreview', rgUrlOgPreview );

    ogImageSrc.$inject = ['SystemEvents'];
    function ogImageSrc(SystemEvents){

        return {
            restrict : 'A',
            link : function(scope,element,attr){
                element[0].onload = function(){
                	if(scope.feedKey){
                        scope.$emit(SystemEvents.FEED.HEIGHT,scope.feedKey);
					} else {
                        scope.$emit(SystemEvents.RINGBOX.UPDATE);
					}
                }

                element[0].src = attr['ogImageSrc'];


            }
        }
    }

    rgUrlOgPreview.$inject = [ '$ringhttp', '$templateCache', '$compile', 'Utils' ];
    function rgUrlOgPreview($ringhttp, $templateCache, $compile, Utils ){
        return {
            restrict : 'E',
            replace : true,
            scope : {
              onClick : '&',
              ogData : '=',
              showPreview : '=',
              loadingData: '=',
             // filterOnProgress : '=',
              editMode : '@',
              feedKey : '@'
            },
            templateUrl: '',
            link : function(scope, element, attr){

                var templateUrl = "templates/partials/url-og-preview.html";

                if( !!attr.template) {
                    templateUrl = attr.template;
                }

                //$http.get(templateUrl, {cache: $templateCache}).success(function(tplContent){
                $ringhttp.get(templateUrl).success(function(tplContent){
                    element.append($compile(tplContent)(scope));
                    scope.$rgDigest();
                });


                //element.on('click', function(e){
                //    if(angular.isFunction(scope.onClick)){
                //        scope.onClick();
                //    }
                //});

            },
            controller : ['$scope' ,'$sce','settings', function($scope, $sce,settings){

                $scope.selectedOgImageIndex = 0;

                $scope.onClick = onClick;
                $scope.onImageCloseClick = onImageCloseClick;
                $scope.onDetailCloseClick = onDetailCloseClick;
                $scope.selectPreviousImage = selectPreviousImage;
                $scope.selectNextImage = selectNextImage;
                $scope.shouldShowNextButton = shouldShowNextButton;
                $scope.shouldShowPreviousButton = shouldShowPreviousButton;

                $scope.isYoutubeUrl = isYoutubeUrl;
                $scope.getYoutubeUrl = getYoutubeUrl;
                $scope.filterOnProgress = false;
                $scope.ogData.title = decodeEntities($scope.ogData.title);
                $scope.ogData.description = decodeEntities($scope.ogData.description);

                $scope.shouldShowNextPreviousButtonContainer = shouldShowNextPreviousButtonContainer;
                $scope.shouldShowImageCloseButton = shouldShowImageCloseButton;

                $scope.init = function(){

                    if( !!$scope.ogData && !!$scope.ogData.url ){

                        initUrlMetaData();
                        processUrl($scope.ogData.url);

                        /**
                         *
                         * while add ssl unblock this code
                         */
                        if(!!$scope.ogData.url){
                            if(!/^https?:\/\//.test($scope.ogData.url)){
                            $scope.ogData.url = "http://" + $scope.ogData.url;
                            }
                        }

                        if(!!$scope.ogData.image){
                            if(!/^https?:\/\//.test($scope.ogData.image)){
                               $scope.ogData.image = "http://" + $scope.ogData.image;
                             }
                             if(settings.secure && /^http:/.test($scope.ogData.image)){
                                $scope.ogData.image = settings.httpsUrl + '/ImageProxy.png?url=' + $scope.ogData.image.replace(/http:\/\//,'');
                             }
                        }

                        if(!!$scope.ogData.images && $scope.ogData.images.length > 0){
                            filterImages();
                        }


                    }

                };

                $scope.$watch('ogData', function(){
                    $scope.init();
                });


                // $scope.init();


                /////////////////////////////

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

                function onClick(){
                    if(!!$scope.ogData && !$scope.ogData.images){
                        var url = $scope.ogData.url;
                        if(!!url){
                            window.open(url, '_blank');
                        }
                    }
                }

                function setImageInOgInfo(){
                    if( !!$scope.ogData.images){
                        $scope.ogData.image = $scope.ogData.images[$scope.selectedOgImageIndex];
                    }
                }
                function resetImageInOgInfo(){ $scope.ogData.image = ""; }
                function resetTitleInOgInfo(){ $scope.ogData.title = ""; }
                function resetDescriptionInOgInfo(){ $scope.ogData.description = ""; }
                function resetUrlInOgInfo(){ $scope.ogData.url = ""; }
                function resetLnkDmnInOgInfo(){ $scope.ogData.lnkDmn = ""; }

                function setUrlMetaData(key, value){
                     $scope.ogData.meta[key] = value;
                 }

                function initUrlMetaData(key, value){

                    $scope.ogData.meta = {
                        youtube : false,
                        youtube_id : ''
                    };
                }

                function selectNextImage(){
                    if( $scope.selectedOgImageIndex < $scope.ogData.images.length -1 ){
                        $scope.selectedOgImageIndex += 1;
                    }
                    setImageInOgInfo();

                    doDigest();
                }
                function selectPreviousImage(){
                    if( $scope.selectedOgImageIndex > 0){
                        $scope.selectedOgImageIndex -= 1;
                    }
                    setImageInOgInfo();

                    doDigest();
                }

                function onImageCloseClick($event){
                    $event.preventDefault();
                    $event.stopPropagation();
                    resetImageInOgInfo();

                    doDigest();
                }

                function onDetailCloseClick($event){
                    $event.preventDefault();
                    $event.stopPropagation();
                    resetTitleInOgInfo();
                    resetDescriptionInOgInfo();
                    resetUrlInOgInfo();
                    resetLnkDmnInOgInfo();

                    doDigest();


                }

                function shouldShowNextButton(){ return !!$scope.ogData.images && $scope.selectedOgImageIndex < $scope.ogData.images.length - 1 }
                function shouldShowPreviousButton(){ return $scope.selectedOgImageIndex > 0 }

                function shouldShowNextPreviousButtonContainer(){
                    return ( !!$scope.editMode
                        && !!$scope.ogData.image
                        && ($scope.ogData.filteredImages.length > 1)
                    );
                }

                function shouldShowImageCloseButton(){
                    return !!$scope.editMode && !$scope.filterOnProgress && !!$scope.ogData.image
                }

                function setFilterOnProgress(){ $scope.filterOnProgress = true; }
                function resetFilterOnProgress(){ $scope.filterOnProgress = false;  }
                function setImagesInOgInfo(images){
                    $scope.ogData.images = images;
                }

                function addFilteredImageInOgInfo(image){

                    $scope.ogData.filteredImages.push(image);
                }

                function resetFilteredImagesInOgInfo(image){

                    $scope.ogData.filteredImages = [];
                }

                function setActiveImageInOgInfo(image){
                    $scope.ogData.image = image;
                }


                function isYoutubeUrl(){
                    if(!$scope.ogData.meta && $scope.ogData.url){
                        initUrlMetaData();
                        processUrl($scope.ogData.url);
                    }

                    return !!$scope.ogData.meta && $scope.ogData.meta.youtube
                }
                function getYoutubeId(){ return $scope.ogData.meta.youtube_id }

                function getYoutubeUrl(){
                    return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + getYoutubeId() + "?autoplay=0&autohide=1&border=0&wmode=opaque&enablejsapi=1");
                }

                function processUrl(url){
                    /*
                        Regx Explaination

                    var REGX_HTTP_HTTPS = "((http|https):\/{2})+";
                    var REGX_NAME_DOMAIN = "((www\.)?youtube.com)";
                    var REGX_PATH = "((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(?:\/|(?<=±@))(.*?=([^?=&]+)(=([^&]*))?(.*?))(?:±@|$|\/(?!.*±@))?)?";
                    var YOUTUBE_URL_REGX_STRING = REGX_HTTP_HTTPS + REGX_NAME_DOMAIN + REGX_PATH;
                    var YOUTUBE_URL_REGX = new RegExp(YOUTUBE_URL_REGX_STRING, "im");

                    */

                    var FULL_YOUTUBE_URL_REGX = /((http|https):\/{2})+((www\.)?youtube\.com)([?&]?([^=]+)=([^&]*))?/im;

                    if(url){
                        var matches = url.match(FULL_YOUTUBE_URL_REGX);
                        if( !!matches && !!matches[3] && !!matches[7] ){
                            setUrlMetaData('youtube', true);
                            setUrlMetaData('youtube_id', matches[7]);
                        }else{
                            setUrlMetaData('youtube', false);
                        }
                    }

                }

                function filterImages(){
                    resetFilteredImagesInOgInfo();
                    setFilterOnProgress();

                    var imageUrls = $scope.ogData.images;

                    Utils.filterImagesByDimentions(imageUrls, {width: 200})
                    .then(function(anImageUrl ){
                        console.log(anImageUrl);
                        console.log(imageUrls);

                        if( !$scope.ogData.image ){
                            setActiveImageInOgInfo(anImageUrl);
                        }

                        addFilteredImageInOgInfo(anImageUrl);

                        if(!!$scope.filterOnProgress){
                            resetFilterOnProgress();
                        }

                        doDigest();

                    }, function(){

                    }, function(anImageUrl){
                        console.log(anImageUrl);
                        addFilteredImageInOgInfo(anImageUrl);

                        if( !$scope.ogData.image ){
                            setActiveImageInOgInfo(anImageUrl);
                        }
                        console.log($scope.ogData.image);
                        doDigest();

                    });
                }

                // function getSelectedImage(){
                //     if(!ogData.image){
                //         if(!!$scope.ogData.images){
                //             ogData.image = $scope.ogData.images[$scope.selectedOgImageIndex];
                //         }
                //     }
                //
                // }



            }]
        }
    }

