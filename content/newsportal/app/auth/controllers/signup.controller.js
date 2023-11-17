/*
 * © Ipvision
 */

(function() {
    'use strict';


    angular.module('ringid.auth')
        .controller('SignUpController', SignUpController);

        SignUpController.$inject = ['countryListService', 'Ringalert', 'Auth', '$scope', '$controller', '$boxInstance', '$authSocial', 'remoteData', 'localData', 'Storage', 'rgDropdownService'];
        function SignUpController(countryListService, Ringalert, Auth, $scope, $controller, $boxInstance, $authSocial, remoteData, localData, Storage, rgDropdownService) { // jshint ignore:line

            angular.extend(this, $controller('AuthController', {$scope: $scope}));

            $scope.close = $boxInstance.close;
            $scope.closeAll = $boxInstance.closeAll;

            // sign up data
            $scope.newUid = '';
            $scope.credentials.repassword = '';
            $scope.credentials.vc = '';
            $scope.credentials.name = '';

            $scope.signupStep = 1;
            // signup operations
            //$scope.signupData = signupData;
            $scope.sendCode = sendCode;
            $scope.verifyCode = verifyCode;
            $scope.signup= signup;




            if (localData) {
                // reset from autofill
                $scope.formStyle.left  = '0px';
                $scope.credentials.mbl = '';
                $scope.credentials.email = '';
                $scope.credentials.ringid = '';
                $scope.credentials.password = '';
                if (localData.signupData) {
                    $scope.credentials.authMethod = localData.signupData.signupType;
                    $scope.credentials.flagcode = localData.signupData.flagcode;
                }

                if (localData.socialData) {
                    angular.extend($scope.credentials, localData.credentials);
                    //$scope.credentials.authMethod = localData.credentials.authMethod;
                    //$scope.credentials.countryFlag = localData.socialData.countryFlag;
                    $scope.newUid = localData.credentials.uId.toString().substr(2);

                    $scope.credentials.authMethod = localData.socialData.platform;
                    $scope.credentials.id= localData.socialData.id;
                    $scope.credentials.name = localData.socialData.name;
                    $scope.credentials.access_token= localData.socialData.access_token;

                    //$scope.credentials.login_type = remoteData.platform;
                    //$scope.credentials.authMethod = localData..platform;

                    $scope.signupStep = 3;
                    $scope.formStyle.left  = '-700px';
                }

                //$scope.credentials.authMethod = localData.signupType;
                //// reset from autofill
                //$scope.formStyle.left  = '0px';
                ////$scope.activateTab($scope.credentials.authMethod);
                //$scope.credentials.mbl = '';
                //$scope.credentials.email = '';
                //$scope.credentials.ringid = '';
            }

            if (remoteData) {
                $scope.newUid = remoteData.uId.toString().substr(2);
            }

            //function signupData(type) {
                //return  {
                    //data: function () {
                        //return {
                            //signupType: type,
                            //login_type: type === 'phone' ? $scope.credentials.mblDc : 'Email',
                            //countryFlag: type === 'phone' ? $scope.credentials.flagcode: 'remail'
                        //};
                    //}
                //};
            //}



            function sendCode(formValid, event) {
                event.preventDefault();
                if(!$scope.disableForm) {
                    $scope.requestFailed(false); // resets form
                    Auth.sendCode($scope.credentials).then(function(json) {
                        if(json.sucs === true) {
                            $scope.credentials.uId = json.uId;
                            $scope.newUid = json.uId.toString().substr(2);
                            $scope.signupStep = 2;
                            $scope.formStyle.left  = '-350px';
                        }
                        $scope.requestFailed(json, 'sendcode', 'signup');
                    }, function(errData) {
                        $scope.requestFailed(angular.extend(errData, {sucs: false}), 'sendcode', 'signup');
                });
                } else {
                    RingLogger.information( 'form already submitted' , RingLogger.tags.AUTH);
                }
            }

            function verifyCode(formValid, event) {
                event.preventDefault();
                if(!$scope.disableForm) {
                    $scope.requestFailed(false); // resets form
                    Auth.verifyCode($scope.credentials).then(function(json) {
                        if(json.sucs === true) {
                            $scope.signupStep = 3;
                            $scope.formStyle.left  = '-700px';
                        }
                        $scope.requestFailed(json, 'verify', 'signup');
                    }, function(errData) {
                        $scope.requestFailed(angular.extend(errData, {sucs: false}), 'verify', 'signup');
                    });
                } else {
                    RingLogger.information('form already submitted' , RingLogger.tags.AUTH);
                }
            }

            function signup(formValid, event) {
                event.preventDefault();
                if(!$scope.disableForm && $scope.credentials.password === $scope.credentials.repassword) {
                    $scope.requestFailed(false);
                    Auth.signup($scope.credentials).then(function(json) {
                        if(json.sucs === true) {
                            $scope.login(true);
                            Ringalert.show('Registraion succesful. You can login now', 'success');
                            $boxInstance.closeAll();
                        }
                        $scope.requestFailed(json, 'sendCode', 'signup');
                    }, function(errData) {
                        $scope.requestFailed(angular.extend(errData, {sucs: false}), 'signup', 'signup');
                    });
                } else {
                    RingLogger.information('form already submitted');
                }

            }
        }


})();
