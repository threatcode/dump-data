/**
 * © Ipvision
 */


angular
    .module('ringid.directives')
    .directive('rgImg', rgImg)
    .directive('rgImgChange', rgImgChange);

function rgImgChange(){ //jshint ignore:line
    return {
        restrict : 'A',
        controller: ['$element',function( $element) {
            this.setPopupStyle = function(height, width) {
                $element[0].style.height = height + 'px';
                $element[0].style.width = width + 'px';
            };
        }]
    };
}

rgImg.$inject = ['$compile', 'Utils'];
function rgImg($compile, Utils) { //jshint ignore:line
    return {
        restrict: 'A',
        require: '^rgImgChange',
        scope: {
            rgImgObj: '='
        },
        link: function(scope, element, attr, rgImgChangeCntrl) {
            var dH= 500,
                dW = 500,
                minW = 0,
                minH = 0,
                leftbarW = 300,
                imgPadding = 60,
                maxW = 0,
                maxH = 0,
                resizedW = 0,
                resizedH = 0,
                image = $compile('<img src="' + scope.rgImgObj.src() + '" />')(scope);


            maxW = Utils.viewport.x - 40 - leftbarW - imgPadding;
            maxH = Utils.viewport.y - 40 - imgPadding;
            minW = (maxW - dW) > dW? maxW-dW : dW;
            minH =  (maxH - dH) > dH? maxH-dH : dH;

            //element.html(image[0].outerHTML);
            element.append(image);
            //calculateImgSize(scope.rgImgObj.getIh(), scope.rgImgObj.getIw());

            attr.$observe('rgImg', function(newVal) {
                image[0].setAttribute('src', '');
                image[0].setAttribute('src', newVal);
                calculateImgSize(scope.rgImgObj.getIh(), scope.rgImgObj.getIw());
            });

            function calculateImgSize(imgH, imgW) {
                if (imgH > maxH || imgW > maxW) {
                    if ( (imgW/maxW) >= (imgH/maxH) ) {
                        resizedW = maxW;
                        resizedH = Math.floor( (maxW/imgW) * imgH );
                    } else {
                        resizedH = maxH;
                        resizedW = Math.floor( (maxH/imgH) * imgW );
                    }
                } else {
                    // set to image actual height, width
                    resizedH = imgH;
                    resizedW = imgW;
                }

                    image[0].style.width = resizedW + "px";
                    image[0].style.height = resizedH + "px";


                    // below recalculation is for ringbox resize
                    //fix height,width to minimum
                    if (resizedW < minW) {
                        resizedW = minW;
                    }
                    if (resizedH < minH) {
                        resizedH = minH;
                    }

                RingLogger.information('imgW: ' + imgW + ' resizedW: ' + resizedW + ' maxW: ' + maxW, RingLogger.tags.IMAGE);
                RingLogger.information('imgH: ' + imgH + 'resizedH: ' + resizedH + ' maxH: ' + maxH, RingLogger.tags.IMAGE);

                // below recalculation is for ringbox resize
                //fix height,width to minimum
                if (resizedW < minW) {
                    resizedW = minW;
                }
                if (resizedH < minH) {
                    resizedH = minH;
                }

                resizedW = resizedW + leftbarW + imgPadding;
                resizedH = resizedH + imgPadding;

                if(attr.commentsection== 'false'){
                    resizedW = resizedW - 300;
                }

                rgImgChangeCntrl.setPopupStyle(resizedH, resizedW);
                //scope.$broadcast('ringbox.content.changed', {width:resizedW,height:resizedH} );
            }


        }

    };
}
