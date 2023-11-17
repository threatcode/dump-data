
/**
 * © Ipvision
 */


    angular
        .module('ringid.feed')
        .directive('rgIncomingFeed', rgIncomingFeed);


    rgIncomingFeed.$inject = ['feedFactory', '$window','Utils','OPERATION_TYPES'];
    function rgIncomingFeed(feedFactory, $window,Utils,OPERATION_TYPES) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var windowEl = angular.element($window)
                    ,pageValue = feedFactory.getCurrentPageValue()
                    ,extraHeight = 0
                    ,previousScrollTop
                    ,OTYPES = OPERATION_TYPES.SYSTEM;

                switch (pageValue.action) {
                    case OTYPES.TYPE_MY_NEWS_FEED:
                    case OTYPES.TYPE_FRIEND_NEWSFEED:
                         extraHeight = 492;break;
                    case OTYPES.TYPE_GROUP_NEWS_FEED:
                        extraHeight = 250;break;
                    case OTYPES.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS:
                    case OTYPES.TYPE_NEWS_FEED:
                    default :
                        extraHeight = 0;
                }
                function position(){
                    var scrollP = Utils.viewport.yo,diff,top;

                    if(extraHeight > 0){
                        top = extraHeight + 75;
                        diff = top - scrollP;
                        if(diff > 0){
                            if(diff < 75){
                                element.css('top',75+'px');
                            }else{
                                element.css('top',diff+'px');
                            }

                        }
                    }
                }
                function updateClass(){
                    if(feedFactory.hasUnprocessedFeed()){
                        if(!element.hasClass('active')){
                            element.addClass('active');
                        }

                    }else{
                        element.removeClass('active');
                    }

                }

                function update(){

                     if(Utils.viewport.yo >  500){
                            feedFactory.setpushInIncomingFeed(true);
                     }else{
                        if(feedFactory.hasUnprocessedFeed() && previousScrollTop > Utils.viewport.yo){
                           feedFactory.processIncomingFeed();
                           feedFactory.setpushInIncomingFeed(false);
                           updateClass();
                        }else{
                            feedFactory.setpushInIncomingFeed(false);
                        }

                    }
                    if(element.hasClass('active')){
                        position();
                    }
                    previousScrollTop = Utils.viewport.yo;
                }

                scope.$watch(feedFactory.hasUnprocessedFeed,function(newV,oldV){
                    if(newV > oldV){
                        updateClass();
                    }
                });





                element.on("click",function(){
                    feedFactory.processIncomingFeed();
                    feedFactory.setpushInIncomingFeed(false);
                    updateClass();

                    Utils.resetScroll();
                    Utils.animateScroll();

                    scope.setFeed();
                    scope.$rgDigest();
                });


                windowEl.bind("scroll", update);
                var cleanupEvents = function () {
                    windowEl.unbind('scroll', update);
                    element.off("click");
                };
                // console.log(elem.scrollTop);

                updateClass();
                scope.$on('$destroy', cleanupEvents);

            }
        };
    }

