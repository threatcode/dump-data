/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfilePrivacy', rgProfilePrivacy);


        function rgProfilePrivacy()  {

            ProfilePrivacyController.$inject = ['Auth', 'Storage',  '$timeout', '$scope', 'friendsFactory', 'profileFactory','languageConstant'];
            function ProfilePrivacyController (Auth, Storage,  $timeout, $scope, friendsFactory, profileFactory, languageConstant) { //jshint ignore:line

                $scope.isEditProfilePrivacy = false;
                $scope.callPvcEdit = false;
                $scope.chatPvcEdit = false;
                $scope.feedPvcEdit = false;

                //default settings
                $scope.fPrivacyInfo = {
                    callPrivacy : 0,
                    chatPrivacy : 0,
                    feedPrivacy : 0
                };

                $scope.enablePrivacyEditMode = enablePrivacyEditMode;
                $scope.savePvcEdit = savePvcEdit;
                $scope.cancelPvcEdit = cancelPvcEdit;

                if($scope.profileObj.isCurrentUser()){
                    Auth.fetchPrivacy().then(function(data){
                        if(data.sucs===true){
                            //$scope.emailVerified = data.iev;
                            //$scope.phoneVerified = data.imnv;

                            $scope.fPrivacyInfo.callPrivacy = data.cla;
                            $scope.fPrivacyInfo.chatPrivacy = data.chta;
                            $scope.fPrivacyInfo.feedPrivacy = data.fda;
                            //$scope.chatsettings.achat = data.ancht;

                            //if($scope.emailVerified){$scope.emailValue = 'Verified Email';$scope.emailTitle = 'Your Email is verified.';}
                            //if($scope.phoneVerified){$scope.phoneValue = 'Verified Phone';$scope.phoneTitle = 'Your Phone is verified.';}

                        }
                        $scope.$rgDigest();
                    });
                }else{
                    $scope.access = $scope.profileObj.getAccess;
                    $scope.fPrivacyInfo.callPrivacy = $scope.profileObj.getAccess().cla;
                    $scope.fPrivacyInfo.chatPrivacy = $scope.profileObj.getAccess().chta;
                    $scope.fPrivacyInfo.feedPrivacy = $scope.profileObj.getAccess().fda;
                    if( !$scope.fPrivacyInfo.callPrivacy && !$scope.fPrivacyInfo.chatPrivacy && !$scope.fPrivacyInfo.feedPrivacy ) {
                        $scope.profileObj.setBlock(1);
                    }
                    $scope.$rgDigest();
                }


                function  enablePrivacyEditMode ($event) {
                    $event.preventDefault();
                    $scope.isEditProfilePrivacy = true;
                    $scope.$rgDigest();
                }


                 function savePvcEdit(fPrivacyInfo) {
                    var callobj;
                    $scope.isEditProfilePrivacy = false;
                    // TODO REFACTOR API CALL FOR SAVING PRIVACY CHANGE
                    //var obj = {
                        //sv: 0,
                        //sn: 0,
                    //};
                    //if (!$scope.profileObj.isCurrentUser()) {
                        //obj.utId = $scope.profileObj.getUtId();
                    //}

                    //$scope.isFrndsPrivacyEdit=false;
                    //call privacy settings
                    if($scope.profileObj.isCurrentUser()){
                        callobj = {
                            actn:216,
                            sv:fPrivacyInfo.callPrivacy,
                            sn:6,
                            isCurrent:true
                        };
                    }else{
                        callobj = {
                            actn:82,
                            sv:fPrivacyInfo.callPrivacy,
                            sn:6,
                            utId:$scope.profileObj.getUtId(),
                            isCurrent:false
                        };
                    }
                    $scope.fPrivacyInfo.callPrivacy = fPrivacyInfo.callPrivacy;
                    // $timeout(function(){
                        profileFactory.saveCallPvcEdit(callobj).then(function(data){
                            if(data.sucs===true){
                                $scope.fPrivacyInfo.callPrivacy = fPrivacyInfo.callPrivacy;
                            }

                            //$scope.callPvcEdit = false;
                        });
                    // },100);

                    //chat privacy settings
                    var chatobj;
                    if($scope.profileObj.isCurrentUser()){
                        chatobj = {
                            actn:216,
                            sv:fPrivacyInfo.chatPrivacy,
                            sn:7,
                            isCurrent:true
                        };
                    }else{
                        chatobj = {
                            actn:82,
                            sv:fPrivacyInfo.chatPrivacy,
                            sn:7,
                            utId:$scope.profileObj.getUtId(),
                            isCurrent:false
                        };
                    }
                    $scope.fPrivacyInfo.chatPrivacy = fPrivacyInfo.chatPrivacy;
                    // $timeout(function(){
                        profileFactory.saveChatPvcEdit(chatobj).then(function(data){
                            if(data.sucs===true){
                                $scope.fPrivacyInfo.chatPrivacy = fPrivacyInfo.chatPrivacy;
                            }

                            //$scope.chatPvcEdit = false;
                        });
                    // },200);

                    //feed privacy settings
                    var feedObj;
                    if($scope.profileObj.isCurrentUser()){
                        feedObj = {
                            actn:216,
                            sv:fPrivacyInfo.feedPrivacy,
                            sn:8,
                            isCurrent:true
                        };
                    }else{
                        feedObj = {
                            actn:82,
                            sv:fPrivacyInfo.feedPrivacy,
                            sn:8,
                            utId:$scope.profileObj.getUtId(),
                            isCurrent:false
                        };
                    }
                    $scope.fPrivacyInfo.feedPrivacy = fPrivacyInfo.feedPrivacy;
                    // $timeout(function(){
                        profileFactory.saveFeedPvcEdit(feedObj).then(function(data){
                            if(data.sucs===true){
                                $scope.fPrivacyInfo.feedPrivacy = fPrivacyInfo.feedPrivacy;
                            }

                            //$scope.feedPvcEdit = false;
                        });
                    // },300);
                     $scope.$rgDigest();

                }

                function cancelPvcEdit() { // profile-privacy
                    $scope.isEditProfilePrivacy = false;
                    //$scope.isFrndsPrivacyEdit = false;
                    $scope.$rgDigest();
                }



            } // END CONTROLLER FUNC

            var linkFunc = function() {
            };

            return {
                restrict: 'E',
                //scope: true,
                templateUrl: 'templates/profile/profile.about-privacy.html',
                controller: ProfilePrivacyController,
                link: linkFunc
            };

        }
