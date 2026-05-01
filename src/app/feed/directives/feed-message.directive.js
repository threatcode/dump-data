 /**
 * © Ipvision
 */


    angular
        .module('ringid.feed')
        .directive('locationCard',function(){

         return {
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            replace : true,
            scope : {
              feed : '='
            },
            template : '<span class="location">&nbsp;at&nbsp;<a ng-href="{{ ::feed.getLocationUrl() }}"  rg-ringbox="true" ringbox-type="remote" ringbox-target="templates/partials/google-map-preview.html" scope-data="{url : feed.getLocationEmbedUrl() }">{{::feed.getLocationShortText()}}</a></span>'
          };
        })
        .directive('userCard',function(){

         return {
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            replace : true,
            controller : ['$scope','Api','friendsFactory','settings','portalHttpService',function($scope,Api,friendsFactory,settings,portalHttpService){

                $scope.getUserDetail = function(){
                    $scope.showMfc = false;
                    Api.user.getUserDetails({utId : $scope.user.getUtId()},true,$scope.user.isNewsPortalUser()).then(function(json){
                        if(json.sucs){
                            $scope.mfc = json.userDetails.mfc;
                            $scope.showMfc = true;
                            $scope.user.setUid(json.userDetails.uId);
                            if(json.userDetails.npDTO){
                              // $scope.portalFullName = json.userDetails.npDTO.fn;
                              $scope.portalCategory = json.userDetails.npDTO.nPCatName;
                              $scope.follower       = json.userDetails.npDTO.subCount;
                              $scope.isSubscribed   = json.userDetails.npDTO.subsc;
                              $scope.profileImage   = settings.imBase+json.userDetails.prIm;
                            }
                            $scope.$rgDigest();
                        }
                    });
                };
                $scope.getMutualFriend = function(user) {

                    return{
                        data: function() {
                            return {
                                target: user
                            };
                        },
                        promise: Api.user.getMutualFriends(user)

                    };
                };

                $scope.contactListAction = function(actionObj) {
                    if (!actionObj.friend.isLoading()) {
                        friendsFactory.friendAction(actionObj,true).then(function() {
                            $scope.$rgDigest();
                        }, function() {
                            $scope.$rgDigest();
                        });
                        $scope.$rgDigest();
                    }
                };

            }],
            scope : {
              user : '='
            },
            template : '<span class="user"><a ng-href="{{user.link()}}" rg-hovercard="{{::!user.isCurrentUser()}}" on-hover-start="getUserDetail" hover-template-url="{{user.getCardTemplate()}}">{{::user.getName()}}</a></span>'
          };
        })
        .directive('feedMessage',feedMessage)
        .directive('feedTagMoreUser',feedTagMoreUser);

        feedMessage.$inject = ['$compile'];
         function feedMessage($compile) {
            return {
                restrict: 'A',
                //transclude: true,

                scope : {
                      feed : '=feedMessage'
                    },
                link : function(scope, element, attrs) {

                      scope.$watch('feed.checkMessageUpdated()',
                        function(value) {
                           element.html(scope.feed.getMessageText());
                          $compile(element.contents())(scope);
                        }
                      );
                 }
                // link : function(scope,iElement,attrs){
                //     var html = '<div>'+scope.feed.getMessageText()+'</div>';
                //     html = $compile(html)(scope);
                //     iElement.append(html);
                // },

                   // template : '<ng-transclude></ng-transclude>'
            };


    }

  feedTagMoreUser.$inject = [];
  function feedTagMoreUser(){
          // Runs during compile
          return {
             restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
             scope : {
                  feed : '=tagFeed'
                  },
              controller : ['$scope','feedFactory',function(scope,feedFactory){
                //console.log("dreictive controller");


                          scope.getTagUsers = function(feed) {

                              return{
                                  data: function() {
                                      return {
                                          target: feed
                                      };
                                  },
                                  promise: feedFactory.getTagUsers(feed)

                              };
                          };

                  scope.tooltip = '';
                      if(scope.feed.getTotalTag() > 2){
                        var users = scope.feed.getTagUsers();
                        if(users.length > 1){
                          scope.tooltip += users[1].getName();
                          if(!!users[2]){
                            scope.tooltip += "\n"+ users[2].getName();
                            if(scope.feed.getTotalTag() > 3){
                              scope.tooltip += "\nand "+(scope.feed.getTotalTag()- 3) +" others";
                            }
                          // for (var i = 1; i < users.length; i++) {
                          //    scope.tooltip += users[i].getName()+(i<users.length -1 ?"\n":'');
                          // };
                          // if(scope.feed.getTotalTag() > users.length){
                          //     scope.tooltip += "\nand "+(scope.feed.getTotalTag()- users.length) +" others";
                          // }
                        }
                      }
                   }
              }],
             template: '<span class="">with&nbsp;</span>'
                  +'<span class="tag-people"><user-card user="feed.getTagUsers()[0]"></user-card></span>'
                  +'<span ng-if="::feed.getTotalTag() > 1">'
                  +'&nbsp;and&nbsp;<span class="tag-people" ng-if="::feed.getTotalTag() == 2"><user-card user="feed.getTagUsers()[1]"></user-card></span>'
                  +'<span class="" ng-if="::feed.getTotalTag() > 2"><a rg-ringbox="true" ringbox-controller="feedTagUserListController" ringbox-type="remote"'
                  +'ringbox-target="templates/home/tag-user-list.html"'
                  +'ringbox-data="getTagUsers(feed)" class="tag-f-msg" data-tooltip="{{::tooltip}}"'
                  +'>{{::feed.getTotalTag() -1}} others peoples</a></span></span>'


          };
        }
