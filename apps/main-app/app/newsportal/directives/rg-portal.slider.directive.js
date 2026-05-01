

    angular
        .module('ringid.newsportal')
        .directive('rgPortalSlider', rgPortalSlider);

    rgPortalSlider.$inject = [ '$document','SystemEvents','Utils' ];
    function rgPortalSlider( $document, SystemEvents,Utils ) { // jshint ignore:line

        portalSliderController.$inject = [ '$scope','$$stackedMap','Storage','$$newsPortalMap','portalHttpService','SystemEvents','Utils' ];
        function portalSliderController ( $scope, $$stackedMap,Storage,$$newsPortalMap,portalHttpService,SystemEvents,Utils ) { //jshint ignore:line

            $scope.sliderImages = $$stackedMap.createNew();

            $scope.showLeftArrow = false;

            $scope.showRightArrow = false;

            var obj;

            portalHttpService.getPortalDiscoverList().then(function(json){
                if ( json.sucs === true ) {
                    for(var i=0;i<json.npList.length;i++){                        
                        obj = $$newsPortalMap.create(json.npList[i]);
                        $scope.sliderImages.save(obj.getKey(),obj);
                    }
                    $scope.showRightArrow = true;
                }
                $scope.$rgDigest();
            });

            $scope.getPortalCatList = function(portalObj) {
                return{
                    data: function() {
                        return {
                            target: portalObj
                        };
                    },
                    promise: portalHttpService.getPortalCatList(portalObj.getKey())

                };
            };

            $scope.$on(SystemEvents.PORTAL.DONE_FOLLOW_PORTAL, function (event,json) { 
                var thePortal = $scope.sliderImages.get(json.id);
                if(thePortal){
                    thePortal.setIfSubscribed(true);
                }
                
                $scope.$rgDigest();     
            });


            $scope.$rgDigest();
             
            $scope.$on('$destroy', function() {
                $scope.sliderImages.reset();
            });
        }

        var linkFunc = function(scope,element,attrs) {

            // scope.showLeftArrow = false;

            // scope.showRightArrow = true;
            
            var mSDiv = element[0].querySelector('.news_banner_wrap');

            var bannerDiv = element[0].querySelector('.news_banner_con');

            var sliderCounter=1,bannerDivRecal = true, resizeTimer, incrementCounter = 0;

            function calculateImageWidth(){
                var mSDivWidth = mSDiv.clientWidth;

                if(Utils.viewport.x>=1600){
                    scope.imageWidth = mSDivWidth/4;
                    scope.$parent.$rgDigest();
                }
                if(Utils.viewport.x>=1270 && Utils.viewport.x<1600){
                    scope.imageWidth = mSDivWidth/3;
                    scope.$parent.$rgDigest();
                }
                if(Utils.viewport.x>980 && Utils.viewport.x<1270){
                    scope.imageWidth = mSDivWidth/2;
                    scope.$parent.$rgDigest();
                }
            }

            calculateImageWidth();

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

                    calculateImageWidth();
                
                    // mSDivWidth = mSDiv.clientWidth;

                    // if(Utils.viewport.x>=1600){
                    //     scope.imageWidth = mSDivWidth/4;
                    //     scope.$parent.$rgDigest();
                    // }
                    // if(Utils.viewport.x>=1270 && Utils.viewport.x<1600){
                    //     scope.imageWidth = mSDivWidth/3;
                    //     scope.$parent.$rgDigest();
                    // }
                    // if(Utils.viewport.x>980 && Utils.viewport.x<1270){
                    //     scope.imageWidth = mSDivWidth/2;
                    //     scope.$parent.$rgDigest();
                    // }


                    bannerDiv.style.width = (scope.sliderImages.length()*scope.imageWidth)+'px';

                    bannerDiv.style.marginLeft = '-'+(((sliderCounter-incrementCounter)*scope.imageWidth)+(sliderCounter*5))+'px';

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

                bannerDiv.style.marginLeft = '-'+((sliderCounter*scope.imageWidth)+(sliderCounter*5))+'px';
                
                sliderCounter++;

                incrementCounter = 0;

                if(sliderCounter > 1){
                    scope.showLeftArrow = true;
                }

                if(sliderCounter === scope.sliderImages.length()-4){
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

                bannerDiv.style.marginLeft = '-'+(((sliderCounter-1)*scope.imageWidth)+(sliderCounter*5))+'px';

                scope.$parent.$rgDigest();
            }
            
        };

        return {
            restrict: 'E',
            controller: portalSliderController,
            link: linkFunc,
            templateUrl: 'pages/newsportal/portal-slider-directive.html'
        };
    }

