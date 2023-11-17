/**
 * © Ipvision
 */


    angular
        .module('ringid.feed')
        .directive('rgPortalNewsFeedMenu', ['$compile', 'SystemEvents', '$templateCache', 'MESSAGES', 'Ringalert', '$ringbox',
            function ($compile, SystemEvents, $templateCache, MESSAGES, Ringalert, $ringbox) {

                return {
                    restrict: 'E',
                    template: $templateCache.get('menu.html'),
                    link: function (scope, element, attrs) {

                        var comment = null, share = null,
                            eventListner = element[0].querySelector('[data-events]'),
                            wrapper = element[0].closest('[data-feed-bottom]');

                        function clickHandler(e) {
                            if (e.target.hasAttribute('data-event-share') || (e.target.parentNode && e.target.parentNode.hasAttribute('data-event-share'))) {
                                e.stopPropagation();

                                var f = scope.feed.hasSharedFeed() ? scope.feed.getOrginalFeed() : scope.feed;
                                var shareablle = f.isShareAble(true);
                                if (!shareablle.sucs) {
                                    Ringalert.show(MESSAGES[shareablle.rc], 'warning');
                                    return;
                                } else {
                                    shareHandler();
                                }

                            }

                            if (e.target.hasAttribute('data-event-comment') || (e.target.parentNode && e.target.parentNode.hasAttribute('data-event-comment'))) {
                                e.stopPropagation();
                                commentHandler();
                            }

                            scope.$rgDigest();
                        }

                        eventListner.addEventListener('click', clickHandler);

                        function shareHandler() {

                            if (scope.showCommentBox) {
                                wrapper.removeChild(comment);
                                scope.showCommentBox = false;
                            }

                            if (!scope.showShareBox) {

                                var instance = $ringbox.open({
                                    type: 'remote',
                                    scope: false,
                                    controller: 'feedNewsPortalShareController',
                                    scopeData: {
                                        feed: scope.feed
                                    },
                                    onBackDropClickClose: true,
                                    templateUrl: 'templates/newsportal/portal-share-news.html'
                                });
                                instance.result.then(function () {
                                    scope.$rgDigest();
                                });

                                return;
                            }

                            if (scope.showShareBox) {
                                wrapper.removeChild(share);
                                scope.showShareBox = false;
                                scope.$emit(SystemEvents.FEED.HEIGHT, scope.feed.getMapKey());
                                return;
                            }

                            scope.$emit('$feedHeight', scope.feed.getMapKey());
                        }

                        function commentHandler() {
                            var templateComment;
                            /* if(scope.feed.isSingleContentFeed()){
                             templateComment = '<rg-comments target = "feed.getSingleContent()" show-comment-box="showCommentBox" comment-type = "'+scope.feed.getContentType()+'" comment-order = "desc"></rg-comments>';
                             }else{ */
                            templateComment = '<rg-comments target = "feed" show-comment-box="showCommentBox" comment-type = "feed" comment-order = "asc"></rg-comments>'
                            /*}*/

                            /*
                            if(scope.showShareBox) {
                                wrapper.removeChild(share);
                                scope.showShareBox = false;
                            }
                            */

                            if (!scope.showCommentBox) {
                                scope.showCommentBox = true;
                                comment = (comment) ? comment : $compile(templateComment)(scope)[0];
                                wrapper.appendChild(comment);
                                scope.$emit(SystemEvents.FEED.HEIGHT, scope.feed.getMapKey());
                                return;
                            } else {
                                wrapper.removeChild(comment);
                                scope.showCommentBox = false;
                                scope.$emit(SystemEvents.FEED.HEIGHT, scope.feed.getMapKey());
                                return;
                            }
                        }

                        /* External scope api */
                        scope.closeShareBox = function () {
                            scope.showShareBox = true;
                            shareHandler();
                            scope.$rgDigest();
                        };

                        scope.closeCommentBox = function () {
                            scope.showCommentBox = true;
                            commentHandler();
                            scope.$rgDigest();
                        };

                        scope.$on("$destroy", function () {
                            /* clear DOM reference */
                            eventListner.removeEventListener("click", clickHandler);
                            eventListner = null;
                            wrapper = null;
                            comment = null;
                            share = null;
                        });
                    }
                };
            }
        ]);

