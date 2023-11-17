/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfileAllowaddme', rgProfileAllowaddme);


    function rgProfileAllowaddme()  {

        ProfileAllowaddmeController.$inject = [ '$scope', 'profileFactory','Auth' ];
        function ProfileAllowaddmeController ( $scope, profileFactory,Auth ) {

            $scope.isEditAfam = false;

            $scope.afamsettings = {
                afam : Auth.getPermission().afam
            };

            $scope.enableAfamEditMode = enableAfamEditMode;
            $scope.saveAfamSettings   = saveAfamSettings;
            $scope.cancelAfamSettings = cancelAfamSettings;

            function  enableAfamEditMode ($event) {
                $event.preventDefault();
                $scope.isEditAfam = true;
                $scope.$rgDigest();
            }

            function saveAfamSettings(afamsettings) {
                $scope.isEditAfam = false;

                var afamobj;
                if($scope.profileObj.isCurrentUser()){
                    afamobj = {
                        sv:afamsettings.afam,
                        sn:12
                    };
                }
                $scope.afamsettings.afam = afamsettings.afam;
                profileFactory.saveAfamSettings(afamobj).then(function(data){
                    if(data.sucs===true){
                        $scope.afamsettings.afam = afamsettings.afam;
                        Auth.setAfamPermission(afamsettings.afam);
                    }else{
                        $scope.afamsettings.afam = 0;
                    }
                });
                $scope.$rgDigest();

            }

            function cancelAfamSettings() {
                $scope.isEditAfam = false;
                $scope.$rgDigest();
            }



        } // END CONTROLLER FUNC

        var linkFunc = function() {
        };

        return {
            restrict: 'E',
            //scope: true,
            templateUrl: 'templates/profile/profile.about-afam.html',
            controller: ProfileAllowaddmeController,
            link: linkFunc
        };

    }
