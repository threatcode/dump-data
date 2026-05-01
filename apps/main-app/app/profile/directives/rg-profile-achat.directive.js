/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfileAchat', rgProfileAchat);


    function rgProfileAchat()  {

        ProfileAchatController.$inject = [ '$scope', 'profileFactory','Auth' ];
        function ProfileAchatController ( $scope, profileFactory,Auth ) {

            $scope.isEditAchat = false;

            $scope.chatsettings = {
                achat : Auth.getPermission().ancht
            };

            $scope.enableAchatEditMode = enableAchatEditMode;
            $scope.saveAchatSettings = saveAchatSettings;
            $scope.cancelAchatSettings = cancelAchatSettings;

            function  enableAchatEditMode ($event) {
                $event.preventDefault();
                $scope.isEditAchat = true;
                $scope.$rgDigest();
            }




            function saveAchatSettings(chatsettings) {
                $scope.isEditAchat = false;

                var achatobj;
                if($scope.profileObj.isCurrentUser()){
                    achatobj = {
                        sv:chatsettings.achat,
                        sn:10
                    };
                }
                $scope.chatsettings.achat = chatsettings.achat;
                profileFactory.saveAchatSetting(achatobj).then(function(data){
                    if(data.sucs===true){
                        $scope.chatsettings.achat = chatsettings.achat;
                        Auth.setAchatPermission(chatsettings.achat);
                    }else{
                        $scope.chatsettings.achat = 0;
                    }
                });
                $scope.$rgDigest();

            }

            function cancelAchatSettings() {
                $scope.isEditAchat = false;
                $scope.$rgDigest();
            }



        } // END CONTROLLER FUNC

        var linkFunc = function() {
        };

        return {
            restrict: 'E',
            //scope: true,
            templateUrl: 'templates/profile/profile.about-achat.html',
            controller: ProfileAchatController,
            link: linkFunc
        };

    }
