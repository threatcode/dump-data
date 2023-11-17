/* * © Ipvision
 */


	angular
		.module('ringid.auth')
		.controller('PasswordRecoverController', PasswordRecoverController);

	PasswordRecoverController.$inject = ['$controller', 'Auth', '$scope', '$boxInstance'];

	function PasswordRecoverController( $controller, Auth, $scope, $boxInstance) { // jshint ignore:line

            angular.extend(this, $controller('AuthController', {$scope: $scope}));

            // initialization
            $scope.close = $boxInstance.close;

            //signin data
            var sendSms;
            $scope.activeTab = 'email'; // ringid, email, phone
            $scope.activeForm = 'sendcode'; // 'sendcode', 'verifycode', 'resetpassword'

            // override method
            $scope.activateTab = activateTab;
            $scope.activateTab($scope.activeTab);
            // disable autofill
            $scope.credentials.email = '';
            $scope.credentials.mbl = '';

            // forgot pass operation
            $scope.fetchRecoverOptions = fetchRecoverOptions;
            $scope.sendCode = sendCode;
            $scope.verifyCode = verifyCode;
            $scope.resetPassword = resetPassword;

            $scope.verifierEnabled = false;
            $scope.enableVerifier = function() {
                $scope.verifierEnabled = true;
            };

            function fetchRecoverOptions (phoneNo) {
                $scope.verifierEnabled = false;
                Auth.fetchRecoverOptions(phoneNo).then(function(response) {
                    
                    if (response.sucs === true) {
                        $scope.activeForm = 'resetpassword';
                        response.sgtns.forEach(function(option) {
                            if (/^21/.test(option)) {
                                $scope.credentials.uId = option;
                            }
                        });
                    }
                    $scope.requestFailed(response, 'Recovery:verify');
                }, function(err) {
                    
                });
            }



            function resetPassword(formValid, $event) {
                $event.preventDefault();
                if(!$scope.disableForm && $scope.credentials.password === $scope.credentials.repassword ) {
                    $scope.requestFailed(false);
                    
                    Auth.resetPassword($scope.credentials).then(function(json){
                        
                        $scope.disableForm = false;
                        $scope.errorMsg = json.mg;
                        if(json.sucs === true) {
                            $scope.close();
                        }
                        $scope.requestFailed(json, 'Recovery:reset');
                    },function(errData){
                        $scope.requestFailed(angular.extend(errData, {sucs: false}), 'Recovery:reset');
                    });
                }

            }

            // overrided method of AuthController
            function activateTab (tabName) {
                if(!$scope.disableForm && $scope.activeForm === 'sendcode') { // login not in progress
                    $scope.activeTab = tabName;
                    if($scope.activeTab === 'email') {
                        $scope.credentials.authMethod = 'email';
                        $scope.formStyle.left = '0px';
                        //$scope.credentials.login_type = 'Email';
                    } else {
                        $scope.credentials.authMethod = 'phone';
                        $scope.formStyle.left = '-350px';
                        //$scope.credentials.login_type = $scope.country ? $scope.country.login_type : '+880';
                    }
                    $scope.$rgDigest();
                }
            }

            function sendCode(formValid, $event, phone) {
                sendSms = phone;
                $event.preventDefault();
                if(!$scope.disableForm) {
                    $scope.requestFailed(false);
                    

                    Auth.recoverySendCode($scope.credentials, sendSms).then(function(json){
                        if(json.sucs === true) {
                            $scope.activeForm = 'verifycode';
                            $scope.credentials.uId = json.uId;
                        }
                        $scope.requestFailed(json, 'Recovery:' + sendSms ?  'phone' : 'email');
                    },function(errData){
                        $scope.requestFailed(angular.extend(errData, {sucs: false}), 'Recorery:' + sendSms ?  'phone' : 'email');
                    });
                }

            }


            function verifyCode(formValid, $event) {
                $event.preventDefault();
                if(!$scope.disableForm) {
                    $scope.requestFailed(false);
                    
                    Auth.recoveryVerifyCode($scope.credentials).then(function(json){
                        if(json.sucs === true) {
                            $scope.activeForm = 'resetpassword';
                        }
                        $scope.requestFailed(json, 'Recovery:verify');
                    },function(errData){
                        $scope.requestFailed(angular.extend(errData, {sucs: false}), 'Recovery:verify');
                    });
                }

            }

	}

