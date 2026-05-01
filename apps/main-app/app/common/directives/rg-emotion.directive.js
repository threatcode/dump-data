/**
 * Copyright @ 2015 by RingID Inc.
 *
 */

angular.module('ringid.directives')
    .directive('rgEmotion', rgEmotionDirective)
    .directive('rgEmotionDropdown', rgEmotionDropdown);

rgEmotionDirective.$inject = ['$compile','$document','EmotionFactory'];
function rgEmotionDirective($compile,$document,EmotionFactory) {

    return {
        restrict : 'A',
        scope : {
        //showWhen : '=',
            onSelect : '&'
        },
        //template : '',
        //controller : controllerFn,
        link : function(scope, element){
            var emotionDropdownElement;
            scope.active=false;
            scope.emotionFilterText = '';
               function safeDigest(){
                    if(scope.$parent && scope.$parent.$id !==1){
                        scope.$parent.$rgDigest();
                    }else{
                        scope.$rgDigest();
                    }
                }
            scope.initEMotionList = function(display){
                 EmotionFactory.init();
                if(!emotionDropdownElement){
                    emotionDropdownElement = $compile('<rg-emotion-dropdown filter-text="emotionFilterText" focus-filter="active" on-close="close" on-select="choose"></rg-emotion-dropdown>')(scope);
                    element.after(emotionDropdownElement);
                    //emotionDropdownElement.css({
                    //    top : (event.pageY+10) +'px',
                    //    left : (event.pageX+10) + 'px'
                    //});
                }

                emotionDropdownElement.css('display',display);
            };
            scope.choose = function(subCat,$event){
                scope.onSelect({item:subCat});
                scope.emotionFilterText = '';
                scope.initEMotionList('none',$event);
                scope.active = false;
                //document on lick will close the box so no need to close
                safeDigest();
            };
           // scope.$watch('showWhen',function(newVal){
           //     var display = 'none';
           //     if(newVal){
           //         display = 'block';
           //         scope.initEMotionList(display);
           //     }
           //     //element.css('display',display);
           //});
            function showBox(event){
                event.preventDefault();
                //event.stopPropagation();
                if(scope.active){
                    scope.initEMotionList('none',event);
                }else{
                    scope.initEMotionList('block',event);
                }
                scope.active = !scope.active;
                safeDigest();
            }
            element.on('click',showBox);
            function checkToHide(e){
                 if(e.target !== element[0] &&
                    e.target.parentNode &&
                    e.target.parentNode !== element[0] &&
                    e.target.parentNode.parentNode !== element[0] &&
                    e.target.className !== 'pt-top') {
                    scope.close(e);
                }
            }
            $document.on('click',checkToHide);
            scope.close = function(event){
                if(scope.active){
                    scope.initEMotionList('none',event);
                    scope.active = false;
                }
                safeDigest();
            };
            // ##DIGEST_DEBUG_START##
                  if(RingLogger.tags.DIGEST){
                      scope.$watch(function(){
                           RingLogger.info("from rgEmotionDir",RingLogger.tags.DIGEST);
                       });
                  }
            // ##DIGEST_DEBUG_END##
            scope.$on('$destroy',function(){
                element.off('click',showBox);
                $document.off('click',checkToHide);
                emotionDropdownElement = undefined;
            });

        }
       // template : 'templates/common/emotion-dropdown.html'
    };
}



rgEmotionDropdown.$inject = ['EmotionFactory'];
function rgEmotionDropdown(EmotionFactory){ // jshint ignore:line
    function bindClick(event){
        event.stopPropagation();
    }
    return {
        scope : {
            filterText: '=filterText',
            focusFilter : '=',
            onSelect : '&',
            onClose : '&onClose'
        },
        templateUrl : 'templates/dropdowns/emotion-dropdown.html',
        compile: function compile() {
            return {
                pre: function preLink(scope) {
                    scope.emotions={};
                    scope.emotions[0] = EmotionFactory.getEmotions();
                    scope.setEmotion = function(emotions){
                        scope.emotions[0] = emotions;
                        scope.$rgDigest();
                    };
                    EmotionFactory.setScopeForDigest(scope);
                    scope.updateModel = function(e){
                        scope.filterText = e.target.value;
                        scope.$parent.$rgDigest();
                    }
                    scope.loading = !!scope.emotions.length;
                    scope.choose = angular.isFunction(scope.onSelect)? scope.onSelect() : angular.noop;
                    scope.close = angular.isFunction(scope.onClose)? scope.onClose() : angular.noop;
                    // scope.filterName = function(items) { //no use
                    //     var result = {};
                    //     angular.forEach(items, function(value, key) {
                    //         if (!value.hasOwnProperty('secId')) {
                    //             result[key] = value;
                    //         }
                    //     });
                    //     return result;
                    // }
                    // ##DIGEST_DEBUG_START##
                          if(RingLogger.tags.DIGEST){
                              scope.$watch(function(){
                                   RingLogger.info("from rgEmotionDropdownDir",RingLogger.tags.DIGEST);
                               });
                          }
                    // ##DIGEST_DEBUG_END##
                    scope.$on('$destroy',function () {
                        EmotionFactory.removeScope(scope);
                    });
                },
                post: function postLink(scope, iElement) {
                    iElement.on('click',bindClick);
                    scope.$on("$destroy",function(){
                        iElement.off("click",bindClick);
                    });
                    scope.$rgDigest();
                }
            };
        }
    };
}
