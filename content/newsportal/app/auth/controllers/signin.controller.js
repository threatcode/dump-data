/* * © Ipvision
 */

(function () {
	'use strict';

	angular
		.module('ringid.auth')
		.controller('SignInController', SignInController);

	SignInController.$inject = ['$authSocial', '$controller', '$scope', '$boxInstance', 'Auth', 'Ringalert', '$rootScope'];

	function SignInController($authSocial, $controller, $scope, $boxInstance, Auth, Ringalert, $rootScope) { // jshint ignore:line

            angular.extend(this, $controller('AuthController', {$scope: $scope}));

            $scope.close = $boxInstance.close;
            $scope.closeAll = $boxInstance.closeAll;


            $scope.noSignupAllowed = function() {
                 Ringalert.alert({
                    title : 'Sign Up',
                    message : 'Please sign up from your iOS, Android, Windows enabled device or Desktop prior to logging in from the Web version.',
                    showCancel : false,
                    okCallback : angular.noop//doLogoutTask
                 });
            };

            function authenticateUser(platform) {
                $authSocial.authenticate(platform, $scope.credentials).then(function(authData) {
                    Auth.login(angular.extend(authData, $scope.credentials), true).then(function() {
                        ga('send', 'event', 'Signin Success. ' , 'Auth Method: ' + platform );
                        // now login
                        $scope.close();
                        $rootScope.$rgDigest();
                    }, function(err) {
                        switch(err.rc) {
                            case 'invalidsocialid':
                                $scope.socialRequestFailed(err, platform, 'Unregistered Social ID');
                                $boxInstance.hideLoader();

                                // right now signup is disabled
                                // open signup box
                                //$boxInstance.showLoader();
                                //Auth.sendCode($scope.credentials, true).then(function() {
                                    //$scope.close();
                                    //Auth.openSignup(authData, $scope.credentials);
                                //});
                                break;
                            default:
                                $boxInstance.hideLoader();
                                $scope.socialRequestFailed(err, platform, 'Something went wrong');
                        }
                    });
                }, function(err) {
                    $boxInstance.hideLoader();
                    $scope.socialRequestFailed(err, platform, 'Authentication Failed');
                });

            }
            //social signin
            $scope.socialLogin = function(platform) {
                $scope.credentials.authMethod = platform;
                $boxInstance.showLoader();
                if (platform === 'twitter') {
                    //Auth.sendCode($scope.credentials, true).then(function() {
                        authenticateUser(platform);
                    //});
                } else {
                    authenticateUser(platform);
                }



            };

	}

})();
