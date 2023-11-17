/**
 * © Ipvision
 */


    angular
        .module('ringid.feed')

        .directive('rgNewsFeedMenu', rgNewsFeedMenu);

    rgNewsFeedMenu.$inject = ['$compile','SystemEvents','$templateCache','MESSAGES',"Ringalert"];

    function rgNewsFeedMenu($compile,SystemEvents, $templateCache,MESSAGES,Ringalert) {

        return {
            restrict: 'E',
            template: $templateCache.get('menu.html'),
            link: function(scope, element, attrs) {

                 var comment = null, share = null,
                     eventListner = element[0].querySelector('[data-events]'),
                     wrapper = element[0].closest('[data-feed-bottom]');
              function clickHandler(e) {

                    if(e.target.hasAttribute('data-event-share') || (e.target.parentNode && e.target.parentNode.hasAttribute('data-event-share'))) {
                          e.stopPropagation();
                          var f = scope.feed.hasSharedFeed() ? scope.feed.getOrginalFeed():scope.feed;
                          var shareablle = f.isShareAble(true);
                          if(!shareablle.sucs) {
                              Ringalert.show(MESSAGES[shareablle.rc],'warning');
                              return;
                          }else{
                            shareHandler();
                          }

                       }

                      if(e.target.hasAttribute('data-event-comment') || (e.target.parentNode && e.target.parentNode.hasAttribute('data-event-comment'))) {
                          e.stopPropagation();
                          commentHandler();
                      }

                    scope.$rgDigest();
               }
              eventListner.addEventListener('click', clickHandler);

             function shareHandler() {
                  if(scope.showCommentBox) {
                       wrapper.removeChild(comment);
                       scope.showCommentBox = false;
                  }

                 if(!scope.showShareBox) {
                      share = (share)? share : $compile('<feed-inline-share-view></feed-inline-share-view>')(scope)[0];
                      wrapper.appendChild(share);
                      scope.showShareBox = true;
                      scope.$emit(SystemEvents.FEED.HEIGHT, scope.feed.getMapKey());
                      return;
                   }

                   if(scope.showShareBox) {
                        wrapper.removeChild(share);
                        scope.showShareBox = false;
                        scope.$emit(SystemEvents.FEED.HEIGHT, scope.feed.getMapKey());
                        return;
                    }

                    scope.$emit('$feedHeight', scope.feed.getMapKey());
               }

               function commentHandler() {
                  var templateComment;
                  // if(scope.feed.isSingleContentFeed()){
                  //     templateComment = '<rg-comments target = "feed.getSingleContent()" show-comment-box="showCommentBox" comment-type = "'+scope.feed.getContentType()+'" comment-order = "desc"></rg-comments>';
                  // }else{
                      templateComment = '<rg-comments target = "feed" show-comment-box="showCommentBox" comment-type = "feed" comment-order = "asc"></rg-comments>'
                  //}

                    if(scope.showShareBox) {
                       wrapper.removeChild(share);
                       scope.showShareBox = false;
                    }

                     if(!scope.showCommentBox) {
                        scope.showCommentBox = true;
                        comment = (comment)? comment : $compile(templateComment)(scope)[0];
                        wrapper.appendChild(comment);
                        scope.$emit(SystemEvents.FEED.HEIGHT, scope.feed.getMapKey());
                       // scope.$rgDigest();
                        return;
                    }else {
                         wrapper.removeChild(comment);
                         scope.showCommentBox = false;
                         scope.$emit(SystemEvents.FEED.HEIGHT, scope.feed.getMapKey());
                         return;
                     }
               }
               /*External scope api*/
                scope.closeShareBox = function() {
                   scope.showShareBox = true;
                   shareHandler();
                   scope.$rgDigest();
                }

                scope.closeCommentBox = function() {
                   scope.showCommentBox = true;
                   commentHandler();
                   scope.$rgDigest();
                }

               scope.$on("$destroy", function(){
                 /*clear DOM reference*/
                 eventListner.removeEventListener("click",clickHandler);
                   eventListner = null;
                   wrapper = null;
                   comment = null;
                   share = null;
               });


            }

        };
    }

