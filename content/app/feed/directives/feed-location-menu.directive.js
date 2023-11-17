    var feedApp;

    try {
        feedApp = angular.module('ringid.feed');
    } catch (e) {
        console.warn("Feed Module Not Found");
    }

    feedApp.directive('feedLocationMenu', feedLocationMenu);

    feedLocationMenu.$inject = ['$document','$compile', 'Utils'];
    function feedLocationMenu($document,$compile, Utils ) {
        return {
            restrict : 'A',
            scope : {
                onItemSelect : '&feedLocationMenuOnSelect',
                value : '=selectedValue',
                viewWidth : '@',
                viewHeight : '@',
                autoAdjust : '@'
            },
            link : function(scope,element,attr){

                var menuDom, isOpen = false, slackSpaceWidth = 20, directionProvided;

                //scope.mouseInside = true;

                scope.viewDirection = 'right';
                if(!!attr.feedLocationMenuDirection){
                    scope.viewDirection = attr.feedLocationMenuDirection;
                    directionProvided = true;
                }

                scope.viewWidth = scope.viewWidth || 600;
                scope.viewHeight = scope.viewHeight || 466;

                scope.close = function(){
                    if(menuDom) menuDom.remove();
                    menuDom = null;
                    isOpen = false;
                    //scope.mouseInside = true;
                    $document.off("click", checkClickedOnElement);

                };
                scope.$watch('value',function(newval,oldval){
                        if(!!newval.description){
                            element.addClass('active');
                        }else{
                            element.removeClass('active');
                        }
                });


                function checkClickedOnElement(e){

                     if(e.target != element[0] && e.target.parentNode != element[0] && e.target.parentNode.parentNode != element[0] && e.target.className !='pt-top') {
                        //scope.mouseInside = true;
                        scope.close();
                        if(scope.autoAdjust !== "false"){
                            adjustView(event);
                        }
                    }



                }

                function adjustView(event){

                    window.eventFix(event); /** Add Polyfill for `pageX`, `pageY` **/

                    var viewportSize = Utils.viewportsize();

                    if( !directionProvided && (event.pageY + scope.viewHeight + slackSpaceWidth > viewportSize.y) ){
                        window.scrollToYOffset(event.pageY - viewportSize.y/2, 500);
                    }

                    if( event.pageX + scope.viewWidth + slackSpaceWidth > viewportSize.x - 200 ){
                        scope.viewDirection += ' left';
                    }

                }

                element.on("click",function(event){

                        if(isOpen) {
                          scope.close();
                          return '';
                        }
                        if(scope.autoAdjust !== "false"){
                            adjustView(event);
                        }



                    	if(!menuDom){
                        	menuDom = $compile(angular.element('<feed-location-view></feed-location-view>'))(scope);
                    	}
                    	element.after(menuDom);
                    	isOpen = true;

                        $document.on("click", checkClickedOnElement);

                });



                scope.$on('$destroy', function(){
                    if(menuDom) menuDom.remove();
                    element.off('click');
                    $document.off("click", checkClickedOnElement);

                });
                scope.$rgDigest();
            }
        };
    }

