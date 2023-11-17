/*
 * © Ipvision
 */


    angular.module('ringid.auth')
        .controller('SignUpSelectController', SignUpSelectController);

        SignUpSelectController.$inject = [ 'Auth', '$scope', '$controller', '$boxInstance', '$authSocial', 'Ringalert',];
        function SignUpSelectController( Auth, $scope, $controller, $boxInstance, $authSocial, Ringalert) { // jshint ignore:line

            angular.extend(this, $controller('AuthController', {$scope: $scope}));

            $scope.close = $boxInstance.close;
            $scope.closeAll = $boxInstance.closeAll;

            // sign up data
            $scope.socialSignup = function(platform) {
                $boxInstance.showLoader();
                // sendCode actually initializes signup and sends code for nonsocial signup
                Auth.sendCode($scope.credentials, true).then(function() {
                    $authSocial.authenticate(platform, $scope.credentials).then(function(authData) {
                        Auth.openSignup(authData, $scope.credentials).then(angular.noop, function(err) {
                            if (err.rc  === 'dologin') {
                                // existing user. loging in
                                $scope.credentials.authMethod = platform;
                                $boxInstance.showLoader();
                                Auth.login(angular.extend(authData, $scope.credentials), true).then(function() {
                                    $scope.closeAll();
                                }, function(err) {
                                    $boxInstance.hideLoader();
                                    $scope.requestFailed(err, platform + ': Social Login Failed', true);
                                });
                            } else {
                                $boxInstance.hideLoader();
                                $scope.requestFailed(err, platform + ': Authentication Failed', true);
                            }
                        });
                    }, function(err) {
                        $boxInstance.hideLoader();
                        $scope.requestFailed(err, platform + ': Authentication Failed', true);
                    });

                }, function(err) {
                    $boxInstance.hideLoader();
                    $scope.requestFailed(err, platform + ': Authentication Failed', true);
                });
            };

            $scope.signupData  = function(type) {
                return  {
                    data: function () {
                            return {
                                signupData: {
                                    signupType: type,
                                    code: type === 'phone' ? Auth.getCountry().code : 'Email',
                                    flagcode: type === 'phone' ? Auth.getCountry().flagcode : 'remail'
                                }
                            };
                        },
                    promise:  Auth.sendCode($scope.credentials)
                };
            };

        }


