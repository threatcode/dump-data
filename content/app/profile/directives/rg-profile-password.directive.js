/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfilePassword', rgProfilePassword);


        function rgProfilePassword()  {

            ProfilePasswordController.$inject = [ '$scope','Ringalert', 'profileFactory'];
            function ProfilePasswordController ( $scope,Ringalert, profileFactory) { //jshint ignore:line

                $scope.enablePassEdit = enablePassEdit;
                $scope.updatePassword = updatePassword;
                $scope.cancelUpdatePassword = cancelUpdatePassword;
                $scope.showMessage = true;
                $scope.showPassEdit = false;
                $scope.IsMatch=false;
                $scope.oldError = false;

                function enablePassEdit(event) {
                    event.preventDefault();
                    if ($scope.showPassEdit === false) {
                        $scope.showPassEdit = true;
                        $scope.showMessage = false;
                    }
                    $scope.$rgDigest();
                }

                function cancelUpdatePassword() {
                    $scope.showPassEdit = false;
                    $scope.showMessage = true;
                    $scope.IsMatch=false;
                    $scope.$rgDigest();
                }

                function updatePassword(obj) {
                    if(obj.newpassword != obj.repassword){
                        $scope.IsMatch=true;
                    }else if(obj.newpassword == obj.repassword){
                        $scope.IsMatch=false;
                        $scope.oldError = false;
                        profileFactory.changePassword(obj.oldpassword, obj.newpassword).then(function(data) {
                            if(data.sucs===true) {
                                obj = {
                                    oldpassword : '',
                                    newpassword : '',
                                    repassword : ''
                                };
                                $scope.showPassEdit = false;
                                $scope.showMessage = true;
                                Ringalert.show('Password Changed Successfully', 'success');
                            }else{
                                Ringalert.show(data.mg, 'info');
                            }


                        },function(data){
                            $scope.oldError = true;
                        });
                    }
                    $scope.$rgDigest();
                }

            } // END CONTROLLER FUNC

            var linkFunc = function() {
            };

            return {
                restrict: 'E',
                //scope: true,
                templateUrl: 'templates/profile/profile.about-password.html',
                controller: ProfilePasswordController,
                link: linkFunc
            };

        }
