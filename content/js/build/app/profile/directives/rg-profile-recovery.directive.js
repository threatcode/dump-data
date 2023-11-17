/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfileRecovery', rgProfileRecovery);


        function rgProfileRecovery()  {

            ProfileRecoveryController.$inject = [ 'rgDropdownService', 'Api', '$scope','Ringalert', 'profileFactory','$routeParams' , 'Auth'];
            function ProfileRecoveryController ( rgDropdownService, Api, $scope,Ringalert, profileFactory, $routeParams, Auth) { //jshint ignore:line

                $scope.emailVerified = false;
                $scope.phoneVerified = false;


                $scope.isAddEmail = false;
                $scope.isAddPhone = false;
                $scope.addEmail = addEmail;
                $scope.isAddCode = false;
                $scope.showAddEmailButton = true;
                $scope.showAddPhoneButton = true;
                $scope.cancelAddEmail = cancelAddEmail;
                $scope.cancelAddPhone = cancelAddPhone;
                $scope.sendCode = sendCode;
                $scope.verifyCode = verifyCode;

                $scope.verifyThePhoneNum = verifyThePhoneNum;
                $scope.verifierEnabled = false;
                $scope.enableVerifier = function() {
                    $scope.verifierEnabled = true;
                };


                var verifyEmail;
                var mblDc;
                $scope.emailValue = 'Verify Email';
                $scope.emailTitle = 'Click here to verify your Email';
                $scope.phoneValue = 'Verify Phone';
                $scope.phoneTitle = 'Click here to verify your Phone';



                if($scope.profileObj.isEmailVerified()){
                    $scope.emailValue = 'Verified Email';
                    $scope.emailTitle = 'Your Email is verified.';
                    $scope.emailVerified = true;
                    $scope.vemail = $scope.profileObj.getEmail();
                }
                if($scope.profileObj.isMobileVerified()){
                    $scope.phoneValue = 'Verified Phone';
                    $scope.phoneTitle = 'Your Phone is verified.';
                    $scope.phoneVerified = true;
                    $scope.vnumber = $scope.profileObj.getMobileNumber();
                }


                $scope.cancelVerification = function(){
                    $scope.isAddCode = false;
                    $scope.isAddPhnCode  = false;
                    $scope.showAddEmailButton  = true;
                    $scope.showAddPhoneButton  = true;
                    $scope.$rgDigest();
                };

                $scope.resendCodeToMail = function () {
                    profileFactory.sendCode({email:verifyEmail}).then(function(data){
                        if(data.sucs===true){
                            verifyEmail = data.el;
                            Ringalert.show(data.mg,'info');
                        }else{
                            Ringalert.show(data.mg,'info');
                        }
                        $scope.$rgDigest();
                    });
                };


                function addEmail(){
                    $scope.isAddEmail = true;
                    $scope.showAddEmailButton = false;
                    $scope.$rgDigest();
                }

                function cancelAddEmail(){
                    $scope.isAddEmail = false;
                    $scope.showAddEmailButton = true;
                    $scope.$rgDigest();
                }

                function cancelAddPhone(){
                    $scope.isAddPhone = false;
                    $scope.showAddPhoneButton = true;
                    $scope.$rgDigest();
                }

                function sendCode(email) {
                    profileFactory.sendCode(email).then(function(data){
                        if(data.sucs===true){
                            verifyEmail = data.el;
                            $scope.isAddEmail = false;
                            $scope.isAddCode = true;
                            $scope.vemail = '';
                            $scope.emailVerified = false;
                            $scope.emailTitle = 'Click here to verify your Email';
                            email.email='';
                            //$scope.resendCodeToMailOption = true;
                        }else{
                            Ringalert.show(data.mg,'info');
                        }
                        $scope.$rgDigest();
                    });
                }

                function verifyThePhoneNum(phoneNo) {
                    $scope.verifierEnabled = false;
                    Api.user.verifyPhoneNo(phoneNo).then(function(data){
                        if(data.sucs===true){
                            $scope.phoneNumber = phoneNo.mblDc + phoneNo.mbl;
                            mblDc = phoneNo.mblDc;
                            $scope.vnumber = $scope.phoneNumber;

                            $scope.phoneVerified = true;
                            $scope.phoneValue = 'Verified Phone';
                            $scope.phoneTitle = 'Your Phone is verified.';
                        }else{
                            Ringalert.show(data.mg,'error');
                        }
                        $scope.$rgDigest();

                    });
                }

                function verifyCode(obj) {
                    obj.email = verifyEmail;
                    profileFactory.verifyCode(obj).then(function(data){
                        if(data.sucs===true){
                            $scope.isAddEmail = false;
                            $scope.isAddCode = false;
                            $scope.showAddEmailButton = true;
                            $scope.emailVerified = true;
                            $scope.emailValue = 'Verified Email';
                            $scope.emailTitle = 'Your Email is verified.';
                            $scope.vemail = data.el;
                            obj.code = '';
                            obj.email = '';
                            Ringalert.show(data.mg,'success');
                        }else{
                            $scope.isAddEmail = false;
                            $scope.isAddCode = false;
                            $scope.showAddEmailButton = true;
                            $scope.emailVerified = false;
                            $scope.vemail = '';
                            Ringalert.show(data.mg,'info');
                        }
                        $scope.$rgDigest();

                    });
                }


            } // END CONTROLLER FUNC

            var linkFunc = function() {
            };

            return {
                restrict: 'E',
                //scope: true,
                templateUrl: 'templates/profile/profile.about-recovery.html',
                controller: ProfileRecoveryController,
                link: linkFunc
            };

        }
