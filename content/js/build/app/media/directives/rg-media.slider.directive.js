/**
 * © Ipvision
 */


    angular
        .module('ringid.media')
        .directive('rgMediaSlider', rgMediaSlider);

    rgMediaSlider.$inject = [ '$document', 'Media','SystemEvents' ];
    function rgMediaSlider( $document, Media, SystemEvents ) { // jshint ignore:line

        mediaSliderController.$inject = [ '$scope', 'Media','$$mediaAlbumMap','$$stackedMap','Storage' ];
        function mediaSliderController ( $scope, Media, $$mediaAlbumMap, $$stackedMap,Storage ) { //jshint ignore:line

            $scope.sliderImages = $$stackedMap.createNew();
            var objAudio,objVideo;

            Media.fetchSliderImage({mdaT:1}).then(function(json){
                if(json.sucs===true){
                    for( var i=0;i<json.mediaAlbumList.length;i++ ){
                        objAudio = $$mediaAlbumMap.createAlbum(json.mediaAlbumList[i]);
                        $scope.sliderImages.save(objAudio.getKey(),objAudio);
                    }
                }
                $scope.$broadcast(SystemEvents.MEDIA.SLIDER_IMAGE_LOADED);
                $scope.$rgDigest();
            });

            Media.fetchSliderImage({mdaT:2}).then(function(json){
                if(json.sucs===true){
                    for( var i=0;i<json.mediaAlbumList.length;i++ ){
                        objVideo = $$mediaAlbumMap.createAlbum(json.mediaAlbumList[i]);
                        $scope.sliderImages.save(objVideo.getKey(),objVideo);
                    }
                }
                $scope.$broadcast(SystemEvents.MEDIA.SLIDER_IMAGE_LOADED);
                $scope.$rgDigest();
            },function(ejson){

            },function(json){

            });

            $scope.setAlbumName = function(albumObj){
                var albumname = [];

                albumname.push(albumObj.name);

                albumname.push(albumObj.count);

                Storage.setData('albumname',albumname);
            }

            $scope.$rgDigest();

            $scope.$on('$destroy', function() {
                $scope.sliderImages.reset();
            });
        }

        var linkFunc = function(scope,element,attrs) {

            scope.showLeftArrow = false;

            scope.showRightArrow = true;

            var mSDiv = element[0].querySelector('.media-slider');

            var bannerDiv = element[0].querySelector('.photobanner');

            var sliderCounter=1,bannerDivRecal = true, resizeTimer, incrementCounter = 0;

            var mSDivWidth = mSDiv.clientWidth;

            scope.imageWidth = mSDivWidth/2;

            scope.$rgDigest();

            scope.$on(SystemEvents.COMMON.WINDOW_RESIZED,function(event){

                if(resizeTimer){
                    clearTimeout(resizeTimer);
                }
                resizeTimer = setTimeout(function() {

                    incrementCounter = 1;

                    bannerDiv.style.display = 'none';

                    scope.$parent.$rgDigest();

                    bannerDivRecal = true;

                    mSDivWidth = mSDiv.clientWidth;

                    scope.imageWidth = mSDivWidth/2;

                    bannerDiv.style.width = (scope.sliderImages.length()*scope.imageWidth)+'px';

                    bannerDiv.style.marginLeft = '-'+((sliderCounter-incrementCounter)*scope.imageWidth)+'px';

                    bannerDiv.style.display = '';

                    scope.$parent.$rgDigest();

                }, 500);
            });

            scope.$on(SystemEvents.MEDIA.SLIDER_IMAGE_LOADED, function (event,data) {

                bannerDiv.style.display = 'none';

                scope.$parent.$rgDigest();

                bannerDiv.style.width = (scope.sliderImages.length()*scope.imageWidth)+'px';

                bannerDiv.style.display = '';

                scope.$parent.$rgDigest();
            });

            scope.right = function(){

                if(bannerDivRecal){
                    bannerDiv.style.width = (scope.sliderImages.length()*scope.imageWidth)+'px';
                    bannerDivRecal = false;
                }

                bannerDiv.style.marginLeft = '-'+(sliderCounter*scope.imageWidth)+'px';

                sliderCounter++;

                incrementCounter = 0;

                if(sliderCounter > 1){
                    scope.showLeftArrow = true;
                }

                if(sliderCounter === scope.sliderImages.length()-1){
                    scope.showRightArrow = false;
                }

                scope.$parent.$rgDigest();
            }

            scope.left = function(){
                sliderCounter--;

                incrementCounter = 0;

                if(sliderCounter === 1){
                    scope.showLeftArrow = false;
                };

                if(sliderCounter < scope.sliderImages.length()-1){
                    scope.showRightArrow = true;
                }

                bannerDiv.style.marginLeft = '-'+((sliderCounter-1)*scope.imageWidth)+'px';

                scope.$parent.$rgDigest();
            }

        };

        return {
            restrict: 'E',
            controller: mediaSliderController,
            link: linkFunc,
            templateUrl: 'templates/mediasearch/media-slider-directive.html'
        };
    }

