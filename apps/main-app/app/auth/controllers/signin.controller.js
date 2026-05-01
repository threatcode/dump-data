/* * © Ipvision
 */

	angular
		.module('ringid.auth')
		.controller('SignInController', SignInController);

	SignInController.$inject = ['$authSocial', '$controller', '$scope', 'Auth', 'Ringalert', '$rootScope'];

	function SignInController($authSocial, $controller, $scope, Auth, Ringalert, $rootScope) { // jshint ignore:line

            angular.extend(this, $controller('AuthController', {$scope: $scope}));

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
                    if ($scope.params && $scope.params.fromPopup) {
                        $scope.showLoader();
                    }
                    Auth.login(angular.extend(authData, $scope.credentials), true).then(function() {
                        ga('send', 'event', 'Signin Success. ' , 'Auth Method: ' + platform );
                        // now login
                        if ($scope.params && $scope.params.fromPopup) {
                            boxInstance.hideLoader();
                            //$scope.closeAll();
                            window.location = '/';
                        } else {
                            //$scope.close();
                            $rootScope.$rgDigest();
                        }
                    }, function(err) {
                        if ($scope.params && $scope.params.fromPopup) {
                            boxInstance.hideLoader();
                        }
                        switch(err.rc) {
                            case 'invalidsocialid':
                                $scope.requestFailed(err, platform + ': Unregistered Social ID', true);
                                //$boxInstance.hideLoader();

                                // right now signup is disabled
                                // open signup box
                                //$boxInstance.showLoader();
                                //Auth.sendCode($scope.credentials, true).then(function() {
                                    //$scope.close();
                                    //Auth.openSignup(authData, $scope.credentials);
                                //});
                                break;
                            default:
                                $scope.requestFailed(err, platform + ': Something went wrong', true);
                        }
                    });
                }, function(err) {
                    if ($scope.params && $scope.params.fromPopup) {
                        boxInstance.hideLoader();
                    }
                    $scope.requestFailed(err, platform + ': Authentication Failed', true);
                });

            }
            //social signin
            $scope.socialLogin = function(platform) {
                $scope.credentials.authMethod = platform;
                //$boxInstance.showLoader();
                if (platform === 'twitter') {
                    //Auth.sendCode($scope.credentials, true).then(function() {
                        authenticateUser(platform);
                    //});
                } else {
                    authenticateUser(platform);
                }



            };

	}

