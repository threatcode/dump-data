    var feedApp;

    try {
        feedApp = angular.module('ringid.feed');
    } catch (e) {
        console.warn('Feed Module Not Found');
    }

    feedApp.directive('feedInlineShareView', feedInlineShareView);

    feedInlineShareView.$inject = ['GlobalEvents', '$compile','$ringhttp'];
    function feedInlineShareView(GlobalEvents, $compile,$ringhttp){ //jshint ignore:line
        return {
          restrict : 'E',
          //templateUrl : 'templates/partials/news_feed/inline-share.html',

			template :  '<div class="status-box noselect inline-share"><form enctype="multipart/form-data"><div style="padding:10px"><div class="float-left"><div class="thumbnail"><div class="icon-logo-circle pss-logo"><a><img class="responsive-all" rg-src="currentUser.avatar(\'thumb\')"></a></div></div></div><div class="post-t float-right"><div class="inline-share-box"><rg-editor class="editor" editor-content="feedText" new-line="on" on-escape="closeShareBox" focus="showShareBox" placeholder="Write something...."></rg-editor><span class="esc-cancel" rg-click="closeShareBox()">Press Esc to <a>Cancel</a></span><p ng-if="emotions.length" class="pst-loc-txt"><span class="feelings-text">feeling</span> <img class="feed_emo" rg-src="emotions[0].url"> {{emotions[0].nm}} &nbsp;<span class="icon-close f-12" rg-click="emotions.length = 0"></span></p><div ng-if="tagList.length"><ul class="tag-fnd-lst"><span class="tag-with">With : </span><li ng-repeat="usr in tagList"><span class="tag-title">{{::usr.getName()}}</span>&nbsp;<span class="tag-cros" rg-click="removeTag(usr)">X</span></li></ul></div><p ng-if="feedLocation.description" class="pst-loc-txt">{{ feedLocation.description}} <span class="showpointer icon-close f-12" rg-click="resetFeedLocation()"></span></p><p ng-show="!boxIsLoading && errorMessage" class="s-error">{{errorMessage}}</p><!--<p ng-show="!boxIsLoading && !errorMessage" class="s-info"><b>Enter</b> to SHARE, <b>ESC</b> to Cancel</p>--><rg-loader-view2 is-loading="boxIsLoading"></rg-loader-view2></div></div><div class="clear"></div></div><div class="status-photo-box" style="margin:0;padding:0;border-top:1px solid #ebebeb;width:100%"><div><div class="post-b-ico m-l-5"><a data-tooltip-post="Add Feeling" rg-emotion on-select="chooseEmotion(item)" class="p-ab"><span class="img_sprite status-ico feeling-ico"></span></a></div><div class="post-b-ico m-l-5"><a data-tooltip-post="Tag Friends" rg-tag-friend="" show-if="showAddTag" tag-items="tagList" on-select="addTag(item)" class="p-ab"><span class="img_sprite status-ico tag-f-ico"></span></a></div><div class="post-b-ico m-l-5"><a data-tooltip-post="Add Location" feed-location-menu="" feed-location-menu-on-select="updateFeedLocation(location)" autoAdjust="{{::autoAdjustScroll}}" selected-value="feedLocation" class="p-ab"><span class="img_sprite status-ico location-ico"></span></a></div><div class="float-right pad-7-0"><input type="button" ng-disabled="inputDisabled" rg-click="shareFeed()" class="share_btn float-right" value="Share"></div><!--<p>Press escape to cancel</p>--></div></div></form><div class="clear"></div></div>',
			controller : 'feedInlineShareController',
          link : function(scope,elemnet,attr){

          } /*,
          link : function(scope) {

            var hideShareBox = function(e) {
                var code = e.keyCode || e.which;
                if(code === 27) {
                    scope.closeShareBox();
                }
            };


            scope.closeShareBox = function() {
                $timeout(function() { // ghapla. needs improvement
                    if(scope.hasOwnProperty('showShareBox')) {
                        scope.showShareBox = false;
                    } else {
                        scope.$parent.showShareBox = false;
                    }
                });
            };



            scope.$watch('showShareBox', function(newval) {
                if(newval) {
                    document.addEventListener('keydown', hideShareBox);
                } else {
                    document.removeEventListener('keydown', hideShareBox);
                }
            });

            //element.on('mouseenter', function() {
                //GlobalEvents.unbindHandler('keydown', 'document', hideShareBox);
            //});

            //element.on('mouseleave', function() {
                //GlobalEvents.bindHandler('keydown', 'document', hideShareBox);
            //});
          } */
      };

    }


