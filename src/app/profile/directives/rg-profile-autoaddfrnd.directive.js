/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfileAutoaddfrnd', rgProfileAutoaddfrnd);


    function rgProfileAutoaddfrnd()  {

        ProfileAafController.$inject = [ '$scope', 'profileFactory','Auth' ];
        function ProfileAafController ( $scope, profileFactory,Auth ) {

            $scope.isEditAaf = false;

            $scope.aafsettings = {
                aaf : Auth.getPermission().aaf
            };

            $scope.enableAafEditMode = enableAafEditMode;
            $scope.saveAafSettings   = saveAafSettings;
            $scope.cancelAafSettings = cancelAafSettings;

            function enableAafEditMode ($event) {
                $event.preventDefault();
                $scope.isEditAaf = true;
                $scope.$rgDigest();
            }

            function saveAafSettings(aafsettings) {
                $scope.isEditAaf = false;

                var aafobj;
                if($scope.profileObj.isCurrentUser()){
                    aafobj = {
                        sv:aafsettings.aaf,
                        sn:13
                    };
                }
                $scope.aafsettings.aaf = aafsettings.aaf;
                profileFactory.saveAafSetting(aafobj).then(function(data){
                    if(data.sucs===true){
                        $scope.aafsettings.aaf = aafsettings.aaf;
                        Auth.setAafPermission(aafsettings.aaf);
                    }else{
                        $scope.aafsettings.aaf = 0;
                    }
                });
                $scope.$rgDigest();

            }

            function cancelAafSettings() {
                $scope.isEditAaf = false;
                $scope.$rgDigest();
            }

        } // END CONTROLLER FUNC

        var linkFunc = function() {
        };

        return {
            restrict: 'E',
            //scope: true,
            templateUrl: 'templates/profile/profile.about-aaf.html',
            controller: ProfileAafController,
            link: linkFunc
        };

    }
