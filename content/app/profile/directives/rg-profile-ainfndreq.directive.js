/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfileAinfndreq', rgProfileAinfndreq);


    function rgProfileAinfndreq()  {

        ProfileAinfndreqController.$inject = [ '$scope', 'profileFactory','Auth' ];
        function ProfileAinfndreqController ( $scope, profileFactory,Auth ) {

            $scope.isEditAinfndreq = false;

            $scope.incomingfndreqsettings = {
                ainfndreq : Auth.getPermission().aifr
            };

            $scope.enableAinfndreqEditMode = enableAinfndreqEditMode;
            $scope.saveAinfndreqSettings = saveAinfndreqSettings;
            $scope.cancelAinfndreqSettings = cancelAinfndreqSettings;

            function  enableAinfndreqEditMode ($event) {
                $event.preventDefault();
                $scope.isEditAinfndreq = true;
                $scope.$rgDigest();
            }

            function saveAinfndreqSettings(incomingfndreqsettings) {
                $scope.isEditAinfndreq = false;

                var ainfndreqobj;
                if($scope.profileObj.isCurrentUser()){
                    ainfndreqobj = {
                        sv:incomingfndreqsettings.ainfndreq,
                        sn:11
                    };
                }
                $scope.incomingfndreqsettings.ainfndreqobj = incomingfndreqsettings.ainfndreqobj;
                profileFactory.saveAinfndreqSettings(ainfndreqobj).then(function(data){
                    if(data.sucs===true){
                        $scope.incomingfndreqsettings.ainfndreq = incomingfndreqsettings.ainfndreq;
                        Auth.setAinfndreqPermission(incomingfndreqsettings.ainfndreq);
                    }else{
                        $scope.incomingfndreqsettings.ainfndreq = 0;
                    }
                });
                $scope.$rgDigest();
            }

            function cancelAinfndreqSettings() {
                $scope.isEditAinfndreq = false;
                $scope.$rgDigest();
            }

        } // END CONTROLLER FUNC

        var linkFunc = function() {
        };

        return {
            restrict: 'E',
            //scope: true,
            templateUrl: 'templates/profile/profile.about-incoming-frnd-req.html',
            controller: ProfileAinfndreqController,
            link: linkFunc
        };

    }
