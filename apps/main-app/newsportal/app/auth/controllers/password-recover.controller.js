/* * © Ipvision
 */

(function () {
	'use strict';

	angular
		.module('ringid.auth')
		.controller('PasswordRecoverController', PasswordRecoverController);

	PasswordRecoverController.$inject = ['$controller', 'Auth', '$scope', '$boxInstance', 'authHttpService', 'Ringalert'];

	function PasswordRecoverController( $controller, Auth, $scope, $boxInstance, authHttpService, Ringalert) { // jshint ignore:line

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
            $scope.sendCode = sendCode;
            $scope.verifyCode = verifyCode;
            $scope.resetPassword = resetPassword;





            function sendCode(formValid, $event, phone) {
                sendSms = phone;
                $event.preventDefault();
                if(!$scope.disableForm) {
                    $scope.requestFailed(false);
                    RingLogger.information($scope.credentials, RingLogger.tags.AUTH);
                    authHttpService.recoverySendCode($scope.credentials, sendSms).then(function(json){
                        if(json.sucs === true) {
                            $scope.activeForm = 'verifycode';
                            $scope.credentials.uId = json.uId;
                        }
                        $scope.requestFailed(json, sendSms ?  'phone' : 'email', 'recovery', true);
                    },function(errData){
                        $scope.requestFailed(angular.extend(errData, {sucs: false}), sendSms ?  'phone' : 'email', 'recovery');
                    });
                }

            }


            function verifyCode(formValid, $event) {
                $event.preventDefault();
                if(!$scope.disableForm) {
                    $scope.requestFailed(false);
                    RingLogger.information( $scope.credentials, RingLogger.tags.AUTH);
                    authHttpService.recoveryVerifyCode($scope.credentials).then(function(json){
                        if(json.sucs === true) {
                            $scope.activeForm = 'resetpassword';
                        }
                        $scope.requestFailed(json, 'verify', 'recovery', true);
                    },function(errData){
                        $scope.requestFailed(angular.extend(errData, {sucs: false}), 'verify', 'recovery', true);
                    });
                }

            }


            function resetPassword(formValid, $event) {
                $event.preventDefault();
                if(!$scope.disableForm && $scope.credentials.password === $scope.credentials.repassword ) {
                    $scope.requestFailed(false);
                    RingLogger.information( $scope.credentials, RingLogger.tags.AUTH);
                    authHttpService.resetPassword($scope.credentials).then(function(json){
                        RingLogger.print( json, RingLogger.tags.AUTH);
                        $scope.disableForm = false;
                        $scope.errorMsg = json.mg;
                        if(json.sucs === true) {
                            Ringalert.show('Reset succesful. You can login now', 'success');
                            $scope.close();
                            RingLogger.print('PASSWORD RESET SUCCESSFUL. YOU CAN LOGIN NOW', RingLogger.tags.AUTH);
                        }
                        $scope.requestFailed(json, 'reset', 'recovery', true);
                    },function(errData){
                        $scope.requestFailed(angular.extend(errData, {sucs: false}), 'reset', 'recovery', true);
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

	}

})();
