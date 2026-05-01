/**
 * © Ipvision
 */


    angular
        .module('ringid.shared')
        .factory('LikeHttpService',LikeHttpService)
        .controller('LikeController',LikeController)
        .controller('WhoLikeController',WhoLikeController)
        //.directive('rgImageLike', rgImageLike)
        .directive('rgLikes', rgLikes)
        .directive('rgLikerAnchor', rgLikerAnchor)
        .directive('rgWhoLike', rgWhoLike)
        .directive('rgLikerButton', rgLikerButton);



        LikeHttpService.$inject = ['$$connector','OPERATION_TYPES'];
        function LikeHttpService($$connector,OPERATION_TYPES){
                  var OTYPES = OPERATION_TYPES.SYSTEM,ob;

                    ob = {
                        likeUnlike : likeUnlike,
                        likeUnlikeComment : likeUnlikeComment,
                        fetchWhoLikes : fetchWhoLikes,
                        fetchWhoLikesComment : fetchWhoLikesComment
                      //  getPeopleDetails : getPeopleDetails
                    };

                function likeUnlike(ob){
                    var payload = {};
                        switch(ob.type){
                            case 'feed':
                                payload.actn = ob.il === 1 ? OTYPES.TYPE_LIKE_STATUS : OTYPES.TYPE_UNLIKE_STATUS
                                break;
                            case 'image':
                                payload.actn = OTYPES.IMAGE.TYPE_LIKE_IMAGE;
                                payload.imgId = ob.target.getKey();
                                payload.lkd = ob.il;
                                break;
                            case 'media':
                                payload.actn = OTYPES.MEDIA.ACTION_LIKE_UNLIKE_MEDIA;
                                payload.cntntId= ob.target.getKey();
                                payload.lkd = ob.il;
                                break;
                            default:
                               throw new Error("comment type not familiar");
                         };
                         if(ob.target.getFeedKey()){
                           payload.nfId = ob.target.getFeedKey();
                         }
                    return $$connector.request(payload,OTYPES.REQUEST_TYPE.UPDATE);
                 }
                 function likeUnlikeComment(ob){
                     var payload = {};
                        switch(ob.type){
                            case 'feed':
                                  payload.actn = ob.il ? OTYPES.TYPE_LIKE_COMMENT : OTYPES.TYPE_UNLIKE_COMMENT;
                                  payload.nfId = ob.key;
                                break;
                            case 'image':
                                  payload.actn = OTYPES.IMAGE.TYPE_LIKE_UNLIKE_IMAGE_COMMENT;
                                  payload.imgId = ob.key;
                                  payload.lkd = ob.il;
                                break;
                            case 'media':
                                  payload.actn = OTYPES.MEDIA.ACTION_LIKE_UNLIKE_MEDIA_COMMENT;
                                  payload.cntntId= ob.key;
                                  payload.lkd = ob.il;
                                break;
                            default:
                               throw new Error("comment type not familiar");
                         }
                         if(ob.parentKey){
                          payload.nfId = ob.parentKey;
                         }

                      payload.cmnId = ob.target.getKey();
                    return $$connector.request(payload,OTYPES.REQUEST_TYPE.UPDATE);
                 }
                 function fetchWhoLikesComment(ob){
                    var payload = {};
                        switch(ob.type){
                            case 'feed':
                                  payload.actn = OTYPES.TYPE_LIST_LIKES_OF_COMMENT;
                                  payload.nfId = ob.key;
                                break;
                            case 'image':
                                  payload.actn = OTYPES.IMAGE.TYPE_IMAGE_COMMENT_LIKES;
                                  payload.imgId = ob.key;
                                break;
                            case 'media':
                                  payload.actn = OTYPES.MEDIA.ACTION_MEDIACOMMENT_LIKE_LIST;
                                  payload.cntntId= ob.key;
                                break;
                            default:
                               throw new Error("comment type not familiar");
                         }
                         if(ob.parentKey){
                          payload.nfId = ob.parentKey;
                         }

                           payload.st = ob.st || 0;

                      payload.cmnId = ob.target.getKey();
                    return $$connector.pull(payload,OTYPES.REQUEST_TYPE.REQUEST);
                 }
                function fetchWhoLikes(ob){
                    var payload = {};
                    switch(ob.type){
                        case 'feed':
                            payload.actn = OTYPES.TYPE_LIKES_FOR_STATUS;
                            payload.nfId = ob.target.getKey();
                            break;
                        case 'image':
                            payload.actn = OTYPES.IMAGE.TYPE_LIKES_FOR_IMAGE;
                            payload.imgId = ob.target.getKey();
                            break;
                        case 'media':
                            payload.actn = OTYPES.MEDIA.ACTION_MEDIA_LIKE_LIST;
                            payload.cntntId = ob.target.getKey();
                            break;
                        //case 'media':break; // check for media fetch comment
                        default:
                           throw new Error("comment type not familiar");
                     }
                      if(ob.target.getFeedKey()){
                           payload.nfId = ob.target.getFeedKey();
                         }
                         payload.st = ob.st || 0;


                    return $$connector.pull(payload,OTYPES.REQUEST_TYPE.REQUEST);
                 }
                 // function getPeopleDetails(utids){
                 //    return $$connector.pull({
                 //      actn : OTYPES.FRIENDS.TYPE_PEOPLE_YOU_MAY_KNOW_DETAILS,
                 //      idList : utids
                 //    },OTYPES.REQUEST_TYPE.REQUEST);
                 // }

          return ob;
        }

        WhoLikeController.$inject = ['$scope','LikeHttpService','rgScrollbarService','userFactory','friendsFactory','Api','Auth'];
        function WhoLikeController($scope,LikeHttpService,rgScrollbarService,userFactory,friendsFactory,Api,Auth){
             $scope.loading = true;
             $scope.users = [];
             $scope.contactListAction = function(actionObj) {
                 if (!actionObj.friend.isLoading()) {
                     friendsFactory.friendAction(actionObj, true).then(function() {
                         $scope.$rgDigest();
                     }, function() {
                         $scope.$rgDigest();
                     });
                    $scope.$rgDigest();
                 }
             };
             $scope.isCurrentUser = function(user){
                return user.equals(Auth._currentUser);
             };

            $scope.loadmore = function () {
                if(!$scope.loading){
                    loadMoreUser();
                }
            };

             function loadMoreUser(){
              var reqData,reqFn = 'fetchWhoLikes';
                if($scope.users.length < $scope.target.getTotalLikes()){
                  reqData = {
                            target : $scope.target,
                            type : $scope.likeType,
                            st : $scope.users.length
                       };
                    if($scope.likeComment == 'true'){
                      reqFn = 'fetchWhoLikesComment';
                      reqData.parentKey = $scope.targetOwner();
                      reqData.key = $scope.targetParent();
                       // promise = LikeHttpService.fetchWhoLikesComment({
                       //    target : $scope.target,
                       //     type : $scope.likeType,
                       //     key : $scope.targetParent(),
                       //     parentKey : $scope.targetOwner(),
                       //     st : $scope.users.length
                       //   });
                    }
                    $scope.loading = true;
                    // if($scope.likeType === 'feed' && $scope.target.isSingleContentFeed()){
                    //    reqData.target = $scope.target.getSingleContent();
                    //    reqData.type = $scope.target.getContentType();
                    // }
                    LikeHttpService[reqFn](reqData).then(function(json){
                        //console.log(json);
                                  $scope.loading = false;
                                  if(!json.sucs){
                                     $scope.$close();return;
                                  }
                                  var i,usr;
                                  //var utids = [];
                                  for( i=0;i < json.likes.length;i++){
                                     //utids[i] = json.likes[i].utId;
                                     usr = userFactory.createByUtId(json.likes[i],true,true);
                                    $scope.users.push(usr);
                                    usr.commonFriends(true,true).then(function(){
                                       $scope.$rgDigest();
                                     });
                                  }
                                    rgScrollbarService.recalculate($scope);
                                  $scope.$rgDigest();
                                  // LikeHttpService.getPeopleDetails(utids).then(function(json){
                                  // });
                                },function(reason){
                                  $scope.$close();
                                },function(json){
                                  //$scope.$close();
                                });
                }
             }
             loadMoreUser();

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

        }

LikeController.$inject = ['$scope','LikeHttpService','Ringalert','$ringbox','feedFactory'];
function LikeController($scope,LikeHttpService,Ringalert,$ringbox,feedFactory){

    $scope.anchorCallback = angular.noop;
    $scope.buttonCallback = angular.noop;

    function failedLike(reason){
              $scope.target.like(true,reason.loc ? reason.loc : false);
              Ringalert.show(reason, 'error');
              $scope.anchorCallback.call(null,$scope.target.like());
              $scope.buttonCallback.call(null,$scope.target.like());
              $scope.$rgDigest();
          }
    $scope.LikeUnlike = function(){
          var reqData,reqFn = 'likeUnlike';
             reqData = {
              target : $scope.target,
              type : $scope.likeType
            };
          if($scope.likeComment == 'true'){
              reqFn = 'likeUnlikeComment';
              reqData.parentKey = $scope.targetOwner();
              reqData.key = $scope.targetParent();
             //  promise = LikeHttpService.likeUnlikeComment({
             //       target : $scope.target,
             //       type : $scope.likeType,
             //       key : $scope.targetParent(),
             //       parentKey : $scope.targetOwner()
             // });
          }
          reqData.il = $scope.target.like(true);
          $scope.anchorCallback.call(null,reqData.il);
          $scope.buttonCallback.call(null,reqData.il);
          LikeHttpService[reqFn](reqData).then(function(json){
              if(!json.sucs){
                failedLike(json);
              }else{
                if($scope.likeType !== 'feed' && $scope.likeComment !== 'true'){
                  if(json.nfId){
                   var sc = feedFactory.synchLike(json.nfId,reqData.il,json.loc);
                     if(sc){sc.$rgDigest();}
                  }

                }
              }

          },failedLike);
        $scope.$rgDigest();
    };
    $scope.$watch('target', function(newValue) {
          $scope.anchorCallback.call(null,newValue.like());
          $scope.buttonCallback.call(null,newValue.like(),true);
    });
    $scope.showWhoLike = function(){
      if(!$scope.target.getTotalLikes())return;
        var boxInstance = $ringbox.open({
                              type : 'remote',
                              scope:$scope,
                              controller: 'WhoLikeController',
                              templateUrl : 'templates/home/wholikes.html'
                          });

               // boxInstance.result.then(function(updatedFeed){
               //   if(!!updatedFeed){
               //      $scope.feed = updatedFeed;
               //   }
               // });
    }


}






    rgLikerButton.$inject = [];
    function rgLikerButton(){
        return {
          restrict: 'E',
          require: '^rgLikes',
          replace : true,
          template : '<a><i class="img_sprite lc-ico"></i><b>{{target.getTotalLikes() > 1 ? "Likes":"Like"}}</b></a>',
          link: function(scope, elem, attrs, parentCtrl) {


             function iLikeChange(v,stopAnimation){
                if(v){
                   // elem.addClass('active');
                    //var el = angular.element('');
                    // if(!stopAnimation){
                      elem[0].firstChild.className = elem[0].firstChild.className.replace
      ( "icon-like" , '' ).trim();
      elem[0].firstChild.className = elem[0].firstChild.className.replace
      ( "icon-like-h", '' ).trim();
                       elem[0].firstChild.className += ' icon-like-h';

                       if(!stopAnimation){
                         elem[0].firstChild.innerHTML = '<span class="like-ani"></span>';
                         window.setTimeout(function(){
                            if(elem){
                              elem[0].firstChild.innerHTML = '';
                            }
                         },2000);
                       }

                   //  }

                }else{
                  elem[0].firstChild.className = elem[0].firstChild.className.replace
      ( "icon-like-h", '' ).trim();
      elem[0].firstChild.className = elem[0].firstChild.className.replace
      ( "icon-like", '' ).trim();
      elem[0].firstChild.className += ' icon-like';
                  //elem.removeClass('active');
                }
             }
             scope.buttonCallback = iLikeChange;
             iLikeChange(scope.target.like(),true);
             elem.bind('click',scope.LikeUnlike);
             scope.$on('$destroy',function(){
                elem.unbind("click",scope.likeUnlike);
             });
          }
        }
    }
    rgLikerAnchor.$inject = [];
    function rgLikerAnchor(){
        return {
          restrict: 'E',
          require: '^rgLikes',
          replace : true,
          template : '<a class="lcs_button ">{{target.getTotalLikes() > 1 ? "Likes":"Like"}}</a>',
          link: function(scope, elem, attrs, parentCtrl) {
             elem.bind('click',scope.LikeUnlike);
             scope.$on('$destroy',function(){
                elem.unbind("click",scope.likeUnlike);
             });
          }
        }
    }

    rgWhoLike.$inject = ['$ringbox'];
    function rgWhoLike($ringbox){
        return {
          restrict: 'E',
          require: '^rgLikes',
          replace : true,
          template : '<a class="lcs_button ">{{target.getTotalLikes()}}</a>',
          link: function(scope, elem, attrs, parentCtrl) {
             elem.bind('click',scope.showWhoLike);
             scope.$on('$destroy',function(){
                elem.unbind("click",scope.showWhoLike);
             });
          }
        }
    }



        rgLikes.$inject = [];
        function rgLikes() {
            return {
                restrict: 'EA',
                scope : {
                    target : '=',
                    likeType : '@', // string feed,image,media
                    targetParent : '&',
                    targetOwner : '&',
                    likeComment : '@'
                },
                controller : 'LikeController',
                template : '<rg-liker-button></rg-liker-button><rg-who-like></rg-who-like>',
                link : function(scope,element,attr){
                       function iLikeChange(iLikeValue){ //
                          if(iLikeValue){
                            element.addClass('active');
                          }else{
                            element.removeClass('active');
                          }
                       }
                       scope.anchorCallback = iLikeChange;
                       iLikeChange(scope.target.like());
                       scope.$watch('target.like()',function(){
                          iLikeChange(scope.target.like());
                          scope.buttonCallback.call(null,scope.target.like(),true);
                       });
                }
            };
        }


