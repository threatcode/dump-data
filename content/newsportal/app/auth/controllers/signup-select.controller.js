/*
 * © Ipvision
 */

(function() {
    'use strict';


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
                        ga('send', 'event', 'Signup Success. ' , 'Auth Method: ' + platform + ' Social Authorization done' );
                        RingLogger.print(authData, RingLogger.tags.AUTH);
                        Auth.openSignup(authData, $scope.credentials).then(angular.noop, function(err) {
                            if (err.rc  === 'dologin') {
                                Ringalert.show("Existing User! Login in as " + authData.name , 'warning');
                                $scope.credentials.authMethod = platform;
                                $boxInstance.showLoader();
                                Auth.login(angular.extend(authData, $scope.credentials), true).then(function() {
                                    ga('send', 'event', 'Signin Success. ' , 'Auth Method: ' + platform );
                                    $scope.closeAll();
                                }, function(err) {
                                    $boxInstance.hideLoader();
                                    $scope.socialRequestFailed(err, platform, 'Social Login Failed');
                                });
                            } else {
                                $boxInstance.hideLoader();
                                $scope.socialRequestFailed(err, platform, 'Authentication Failed');
                            }
                        });
                    }, function(err) {
                        $boxInstance.hideLoader();
                        $scope.socialRequestFailed(err, platform, 'Authentication Failed');
                    });

                }, function(err) {
                    $boxInstance.hideLoader();
                    $scope.socialRequestFailed(err, platform, 'Authentication Failed');
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


})();
