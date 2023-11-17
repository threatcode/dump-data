/**
 * Copyright @ 2015 by RingID Inc.
 *
 */



    angular
            .module('ringid.shared')
            .directive('rgEmoticon', rgEmoticon);

    rgEmoticon.$inject = ['$compile', '$timeout', '$document', 'Utils', 'StickerFactory', 'rgScrollbarService', '$templateCache', '$ringhttp'];
    function rgEmoticon($compile, $timeout, $document, Utils, StickerFactory, rgScrollbarService, $templateCache, $ringhttp) { //jshint ignore:line
        var linkFunc = function (scope, element, attrs) {
            var
                emoticonListTemplate = 'templates/partials/emoticon-window.html',
                showEmoticon = false,
                emoBoxLimit = 400,
                emoBoxWidth = 300,
                emoBoxHeight = (attrs.showSticker == 'true') ? 300 : 260, //jshint ignore:line
                compiledDom,
                openEmoticonEvent;

            scope.emoWindowStyle = {
                height: emoBoxHeight + 'px',
                width: emoBoxWidth + 'px'
            };

            scope.showsticker = (attrs.showSticker == 'true') ? true : false; // jshint ignore:line
            scope.selectedStickerCatId = 0;

            function safeDigest(){
                if(scope.$parent && scope.$parent.$id !==1){
                    scope.$parent.$rgDigest();
                }else{
                    scope.$rgDigest();
                }
            }

            function handleClick(event) {
                // event.stopImmediatePropagation();
                event.preventDefault();
                //if (!showEmoticon) {
                    showEmoticon = !showEmoticon;
                    if (showEmoticon) {
                        openEmoticonPopUp(event);
                    } else {
                        closeEmoticonPopup();
                    }
                    //safeDigest();
                //}
            }

            element[0].addEventListener('click', handleClick);



            function closeEmoticonPopup(e) {
                if(e && e.type === "click"){
                    if(e.target !== element[0] &&
                        e.target.parentNode &&
                        e.target.parentNode !== element[0] &&
                        e.target.parentNode.parentNode !== element[0] &&
                        e.target.className !== 'pt-top') {

                    }else{
                        return;
                    }
                }
                showEmoticon = false;
                document.removeEventListener('click', closeEmoticonPopup);
                document.removeEventListener('scroll', closeEmoticonPopup);
                element[0].removeEventListener('resize', calculatePosition);
                compiledDom[0].parentNode.removeChild(compiledDom[0]);
            }


            function attachTemplate(templateHtml) {
                compiledDom = $compile(templateHtml)(scope);
                element.append(compiledDom);
                calculatePosition();

                document.addEventListener('click', closeEmoticonPopup);
                document.addEventListener('scroll', closeEmoticonPopup);
                window.addEventListener('resize', calculatePosition);
            }

            function openEmoticonPopUp(event) {
                openEmoticonEvent = event; // catch the event for window resize recalculation of position

                if ($templateCache.get( emoticonListTemplate )) {
                    attachTemplate($templateCache.get(emoticonListTemplate));
                } else {
                    $ringhttp.get(emoticonListTemplate).success(function(templateHtml) {
                        attachTemplate(templateHtml);
                    });
                }
            }

            scope.selectEmoOrSticker = selectEmoOrSticker;

            function calculatePosition() {
                console.info('Calculate Emo Position');
                var elemD = 0,
                    elemRect = element[0].getBoundingClientRect(),
                    availWidth = Utils.viewport.x - elemRect.width,
                    availHeight = Utils.viewport.y;
                elemD = Math.floor(elemRect.width / 2);

                if (openEmoticonEvent.clientX + emoBoxLimit < availWidth && openEmoticonEvent.clientY + emoBoxLimit < availHeight) {
                    //console.info('bottom right');
                    scope.emoWindowStyle.top = elemRect.top + (elemD+15) + 'px';
                    scope.emoWindowStyle.left = elemRect.left + (elemD+5) + 'px';
                } else if (openEmoticonEvent.clientX + emoBoxLimit > availWidth && openEmoticonEvent.clientY + emoBoxLimit > availHeight) {
                    //console.info('top left');
                    scope.emoWindowStyle.top = (elemRect.top - emoBoxHeight) + (elemD-5) + 'px';
                    scope.emoWindowStyle.left = (elemRect.left - emoBoxWidth) + (elemD-5) + 'px';
                } else if (openEmoticonEvent.clientX + emoBoxLimit > availWidth) {
                     //console.info('bottom left');
                    scope.emoWindowStyle.top = elemRect.top + (elemD+5) + 'px';
                    scope.emoWindowStyle.left = (elemRect.left - emoBoxWidth) + (elemD-5) + 'px';
                } else if (openEmoticonEvent.clientY + emoBoxLimit > availHeight) {
                    //console.info('top right');
                    scope.emoWindowStyle.top = (elemRect.top - emoBoxHeight) + (elemD-5) + 'px';
                    scope.emoWindowStyle.left = elemRect.left + (elemD+5) + 'px';
                }
                safeDigest();
            }

            function selectEmoOrSticker(emo, $event) {
                $event.stopPropagation();
                //scope.$broadcast('insertEmoji', emo);
                //scope.$emit('insertEmoji', emo); /* don't need broadcast, expensive rather than callback*/
                if(attrs.clicked) {
                  scope.$eval(attrs.clicked)(emo, $event);
                }
                closeEmoticonPopup(); // close emoticon
                safeDigest();
            }

            scope.selectStickerCatId = function (e, stickerKey) {
                e.stopPropagation();
                scope.selectedStickerCatId = stickerKey;
                StickerFactory.getStickerMapByCatId(stickerKey).then(function(data){
                    scope.emoticonMap = data;
                    safeDigest();

                });
                rgScrollbarService.scrollTop(scope);
                safeDigest();
            };

            // most likely not needed
            //scope.selectSticker = function(stickerKey){
                //scope.selectStickerCatId(stickerKey);
                //closeEmoticonPopup(); // close emoticon
                ////safeDigest();
            //};

            scope.showEmoticons = function(e){
                e.stopPropagation();
                scope.emoticonMap = StickerFactory.getEmoticonMap();
                safeDigest();
            };


            scope.$on('$destroy', function() {
                document.removeEventListener('click', closeEmoticonPopup);
                document.removeEventListener('scroll', closeEmoticonPopup);
                element[0].removeEventListener('resize', calculatePosition);
            });

        };

        EmoticonController.$inject = ['$scope'];
        function EmoticonController($scope) {


            function safeDigest(){
                if($scope.$parent && $scope.$parent.$id !==1){
                    $scope.$parent.$rgDigest();
                }else{
                    $scope.$rgDigest();
                }
            }
            $scope.startAt = 0;
            $scope.getMyStickers = function() {
                return $scope.myStickerCatIds().slice($scope.startAt, $scope.startAt+4);
            };
            $scope.getTopStickers = function() {
                return StickerFactory.getStickerCategories('top').slice(0, 4);
            };

            $scope.loadPrevious = function($event) {
                $scope.startAt = ($scope.startAt > 0) ? $scope.startAt-1 : 0;
                $event.stopPropagation();
                safeDigest();
            };
            $scope.loadNext = function($event) {
                $scope.startAt = ( $scope.startAt+3 < $scope.myStickerCatIds().length - 1 ) ? $scope.startAt+1 : $scope.startAt;
                $event.stopPropagation();
                safeDigest();
            };

            $scope.myStickerCatIds = StickerFactory.getMyStickerCatIds;
            $scope.getSticker = StickerFactory.getStickerCategoryObject;
            $scope.emoticonMap = StickerFactory.getEmoticonMap();


        }

        return {
            restrict: 'A',
            link: linkFunc,
            controller: EmoticonController
        };
    }

