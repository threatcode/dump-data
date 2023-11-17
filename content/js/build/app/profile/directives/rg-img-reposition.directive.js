/**
 * Copyright 2015 by RingID Inc.
 *
 */



    angular.module("ringid.profile")
            .directive('rgImgReposition', rgImgReposition);

    rgImgReposition.$inject = ['imageQuality', 'fileUploadService', '$document', 'APP_CONSTANTS', 'GlobalEvents'];
    function rgImgReposition(imageQuality, fileUploadService, $document, APP_CONSTANTS, GlobalEvents) {

        // Helper function to guarantee a value between low and hi unless bool is false
        var limit = function (low, hi, value, bool) {
            //console.log('low: ' + low + ' hi: ' + hi+ ' value: ' + value);
            if (arguments.length === 3 || bool) {
                if (value < low) {
                    return low;
                }
                if (value > hi) {
                    return hi;
                }
            }
            return value;
        };


        function linkFunc(scope, element) {
            var elementWidth = element[0].clientWidth,
                elementHeight = element[0].clientHeight,
                cropWidth = (scope.imgType === 'profilephoto') ? APP_CONSTANTS.PROFILE_PIC_CROP_WIDTH : APP_CONSTANTS.COVER_PIC_CROP_WIDTH,
                cropHeight = (scope.imgType === 'profilephoto')? APP_CONSTANTS.PROFILE_PIC_CROP_WIDTH : APP_CONSTANTS.COVER_PIC_CROP_HEIGHT,
                cropToImageRatio = 1,
                bgSrc = '',
                xPos,
                yPos,
                x0,
                y0,
                repositionScale = 1,
                calculate = false,
                options = {"bound": true},
                imageDimensions = {
                    width: 0,
                    height: 0
                };

            scope.selectFromAlbum = fileUploadService.selectFromAlbum;



            function adjustCoverHeight(event) {
                //if (elementWidth !== element[0].clientWidth) {
                    elementWidth = element[0].clientWidth;
                    var adjustedHeight = Math.ceil(
                        ( (APP_CONSTANTS.COVER_PIC_CROP_HEIGHT * elementWidth ) / APP_CONSTANTS.COVER_PIC_CROP_WIDTH )
                                                  );
                    element[0].style.height = adjustedHeight + "px";
                    //scope.elemStyle.height =  adjustedHeight + "px";
                    elementHeight = adjustedHeight;
                    //scope.$rgDigest();
                //}
            }

            if (scope.imgType === 'coverphoto') {
                adjustCoverHeight(true);
                GlobalEvents.bindHandler('window', 'resize', adjustCoverHeight);
            }



            scope.$watch('enabled', function(newVal, oldVal){
                if (newVal) {
                    checkImageDimensions(); // initialize image dimension
                } else {
                    toggleReposition(false);
                }
            });


            function toggleReposition(enable) {
                if (enable || scope.enabled) {
                    element.bind('mousedown', mouseDown);
                    element.bind('mouseup', mouseUp);
                } else {
                    element.unbind('mousedown', mouseDown);
                    element.unbind('mouseup', mouseUp);
                }
                scope.$rgDigest();
            }

            function mouseDown(e) {
                //console.log('MOUSE DOWN');
                if (scope.enabled) {
                    if (e.which === 1) {
                        x0 = e.clientX;
                        y0 = e.clientY;
                        calculate = true;
                    }
                    //angular.element($document).bind('mousemove', mouseMove);
                    element.bind('mousemove', mouseMove);
                }
            }

            function mouseMove(e) {
                var pos, x, y;
                //console.log('MOUSE MOVE');
                if (scope.enabled && calculate) {
                    pos = scope.elemStyle.backgroundPosition.match(/(-?\d+).*?\s(-?\d+)/) || [];
                    x = e.clientX;
                    y = e.clientY;
                    xPos = parseInt(pos[1]) || 0;
                    yPos = parseInt(pos[2]) || 0;

                    xPos = limit(elementWidth - imageDimensions.width, 0, xPos + x - x0, options.bound);
                    yPos = limit(elementHeight - imageDimensions.height, 0, yPos + y - y0, options.bound);

                    
                    element.css({
                        'backgroundPosition': xPos + 'px ' + yPos + 'px'
                    });
                }
            }

            function mouseUp(e) {
                //console.log('MOUSE UP');
//                e.stopPropagation();
                if (scope.enabled && calculate) {
                    if (xPos !== undefined && yPos !== undefined) {
                        scope.elemStyle.backgroundPosition = xPos + 'px ' + yPos + 'px';
                        // reset position with respect to original image dimensions;
                        //xPos = xPos / scale;
                        //yPos = yPos / scale;
                        // set x,y and imh, imw in fileuploader service
                        console.log('%c: ' + 'yPos: ' + yPos + ' xpos: ' + xPos, 'color:red');
                        console.log('%c: ' + 'REPOSITION SCALE: ' + repositionScale, 'color:red');
                        fileUploadService.setReposition({
                            cimX: Math.ceil( Math.abs(xPos) / repositionScale) || 0,
                            cimY: Math.ceil( Math.abs(yPos) / repositionScale ) || 0,
                        }, scope.imgType);
                    }

                    // reset reposition
                    calculate = false;
                    xPos = undefined;
                    yPos = undefined;

                    element.unbind('mousemove', mouseMove);
                }

            }


            var checkImageDimensions = function () {

                var src = scope.elemStyle.backgroundImage;
                bgSrc = (src.match(/^url\(['"]?(.*?)['"]?\)$/i) || [])[1];

                if (!bgSrc) {
                    return;
                }

                var image = new Image();
                image.onload = setDimensions;
                image.src = bgSrc;
            };



            function setDimensions() {
                // disable resize progress show
                scope.toggleResizeShow()(scope.imgType, false);
                var self = this;
                imageDimensions.width = self.width;
                imageDimensions.height = self.height;

                // set width to elementWidth and adjust height
                if ( (imageDimensions.width / cropWidth) <= (imageDimensions.height / cropHeight) ) {
                //if ( Math.abs(elementWidth - imageDimensions.width) < Math.abs(elementHeight - imageDimensions.height) ) {
                    repositionScale = elementWidth / imageDimensions.width;
                    imageDimensions.width = elementWidth;
                    imageDimensions.height = Math.floor(imageDimensions.height * repositionScale);


                    cropToImageRatio = self.width / cropWidth;
                    fileUploadService.setReposition({
                        iw: Math.ceil(self.width),
                        ih: Math.ceil(cropHeight * cropToImageRatio)
                        //scale: repositionScale
                    }, scope.imgType);
                } else {   // set height to elementheight and adjust width
                    repositionScale = elementHeight / imageDimensions.height;
                    imageDimensions.height = elementHeight;
                    imageDimensions.width = Math.floor(imageDimensions.width * repositionScale);

                    cropToImageRatio = self.height / cropHeight;
                    fileUploadService.setReposition({
                        ih: Math.ceil(self.height),
                        iw: Math.ceil(cropWidth * cropToImageRatio)
                        //scale: repositionScale
                    }, scope.imgType);
                }

                // bind events and remove loadder class
                toggleReposition(true);
                //angular.element(element).removeClass('p-loader');
                console.log('repositionScale: ' + repositionScale);
                console.log('elementW: ' + elementWidth + ' elementH: ' + elementHeight);
                console.log('cropMinW: ' + cropWidth + ' cropMinH: ' + cropHeight);
                console.log('imageW: ' + imageDimensions.width + ' imageH: ' + imageDimensions.height );
            }


            function deactivate() {
                if (scope.imgType === 'coverphoto') {
                    GlobalEvents.unbindHandler('window', 'resize', adjustCoverHeight);
                }

                if (scope.enabled) {
                    element.unbind('mousedown', mouseDown);
                    element.unbind('mouseup', mouseUp);
                }
            }

            scope.$on('$destroy', deactivate);


        }

        return {
            restrict: 'A',
            replace: false,
            scope: {
                elemStyle: "=",
                enabled: "=",
                imgType: "@",
                toggleResizeShow: '&'
            },
            link: linkFunc
        };
    }
