angular
.module('ringid.directives')
.directive('rgHovercard', rgHovercard);

rgHovercard.$inject = ['$ringhttp', '$templateCache','$compile','$window'];

function rgHovercard($ringhttp, $templateCache,$compile,$window){
    var bodyEl = angular.element(document.querySelector('body'));
    return {
        scope : true,
        link: function($scope, iElm, iAttrs) {
            var hoverEl;
            function initiateHover(data){
                var mouseoutFlag = false,timer;
                function closeHoverELement(){
                    //console.log("closed called");
                    if(mouseoutFlag && hoverEl){
                        hoverEl.off('mouseenter',hoverElementMouseEnter);
                        hoverEl.off('mouseleave',hoverElementMouseLeave);
                        //hoverEl.css("display",'none');
                        hoverEl.remove();
                        hoverEl = undefined;
                        //console.log("close done");
                    }
                    mouseoutFlag = false;
                }
                function hoverElementMouseEnter(){
                    //	console.log("hover element mouse enter");
                    mouseoutFlag = false;
                }
                function hoverElementMouseLeave(){
                    //console.log("hover element mouse leave");
                    mouseoutFlag = true;
                    closeHoverELement();
                }
                function directiveElMouseEnter(e){
                    if(mouseoutFlag){
                        return;
                    }
                    if(!hoverEl){
                        hoverEl = angular.element('<div class="fr-menu"></div>');
                        hoverEl.html(data);
                        iElm.after(hoverEl);
                    }
                    if(iAttrs.onHoverStart && typeof $scope[iAttrs.onHoverStart] === 'function'){
                        $scope[iAttrs.onHoverStart]();
                    }

                    $compile(hoverEl)($scope);
                    //var rect = iElm[0].getBoundingClientRect();
                    hoverEl.css({
                        display : 'block'
                            //left : rect.left +'px',
                            //top : rect.bottom + 'px'
                    });
                    hoverEl.on('mouseleave',hoverElementMouseLeave);
                    hoverEl.on('mouseenter',hoverElementMouseEnter);
                    $scope.$rgDigest();
                }

                function directiveElMouseLeave(e){
                    mouseoutFlag = true;
                    window.setTimeout(closeHoverELement,500);
                    //console.log("directive element mouse leave");
                    window.clearTimeout(timer);
                    timer = false;
                    iElm.off('mouseleave',directiveElMouseLeave);
                }
                function initiate(e){
                    if(!timer){
                        timer = window.setTimeout(directiveElMouseEnter.bind(this,e),1200);
                    }
                    iElm.on("mouseleave",directiveElMouseLeave);
                }
                iElm.on("mouseenter",initiate);

                $scope.$on('$destroy', function(){
                    directiveElMouseLeave();
                    iElm.off('mouseenter',directiveElMouseEnter);
                    iElm.off('mouseleave',directiveElMouseLeave);

                });
            }


            if(iAttrs.rgHovercard !== "false"){
                $ringhttp.get(iAttrs.hoverTemplateUrl).success(function(result) {
                    initiateHover(result);
                });
            }

            if(iAttrs.rgHovercard !== "false"){
                $ringhttp.get(iAttrs.hoverTemplateUrl).success(function(result) {
                    initiateHover(result);
                });
            }
            // ####


        }
    }



}

