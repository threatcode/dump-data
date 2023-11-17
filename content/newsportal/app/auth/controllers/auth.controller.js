/* * © Ipvision
 */

(function () {
	'use strict';

	angular
		.module('ringid.auth')
		.controller('AuthController', AuthController);

	AuthController.$inject = ['rgDropdownService', 'Storage', 'Auth', '$scope', '$$connector', 'countryListService','$rootScope', 'Ringalert', 'settings'];

	function AuthController(rgDropdownService, Storage, Auth, $scope, $$connector, countryListService,$rootScope, Ringalert, settings) { //jshint ignore:line

        // no more needed in worker implementation
            //$$connector.init();
            //$$connector.resume();

            $scope.socialRequestFailed = socialRequestFailed;
            $scope.requestFailed = requestFailed;

            // auth data
            $scope.activeTab = 'phone';
			$scope.credentials = {
                username       : '', // only used for AutoFill login form. a placeholder for browser autofill to work properly
                authMethod     : 'phone',
                uId            : '',
                lt             : 2,
                mbl            : '',
                email          : '',
                ringid         : '',
				password       : '',
                remember       : Storage.getData('remember') ? true : false,
                mblDc          : Auth.getCountry().code,
                flagcode       :  Auth.getCountry().flagcode, //'c1'
			};

            $scope.autofill = {
                email : $scope.credentials.email,
                ringid : $scope.credentials.ringid,
                mbl : $scope.credentials.mbl
            };

			$scope.errorMsg = '';
            $scope.requestSuccess = false;
			$scope.disableForm   = false;
            $scope.formStyle = {left: '0px'};

            // auth operations
            $scope.activateTab = activateTab;
			$scope.setPrefix = setPrefix;
            $scope.login = login;

			//$scope.ddHtml = 'pages/dropdowns/country-list-dropdown.html';
            $scope.ddTemplate =
                     '<div class="country-wrapper" >' +
                        '<ul id="countrylist" class="ringdropdown" rg-scrollbar="scrollbar()">' +
                            '<div class="count-s">' +
                            '<input type="text" ng-model="countryName" placeholder="Search Country">' +
                            '</div>' +
                            '<a ng-repeat="item in ddControl.countryList() | filter:countryName" ><li class="flag {{item.flagcode}}" ng-click="ddAction()({event: $event, item: item})" > ' +
                            '<span> {{ item.country }}</span></li></a>' +
                        '</ul>' +
                      '</div>';

			$scope.ddControl = {
                append: false,
                countryList: Auth.getCountryList
			};


            var errMsg = {
                signin: {
                    email: "Login failed. Make sure you're entering your verified email and correct password.",
                    phone: "Login failed. Make sure you're entering your verified phone and correct password.",
                    ringid: "Login failed. Make sure you're entering correct ringID and password.",
                    other: 'Sorry, we are unable to complete your request. Please try again later.'
                },
                signup: {
                    sendcode: "Verification code has been sent to your email. Please check your spam folder also.",
                    verify: "",
                    signup: ''
                },
                recovery: {
                    email: "Sorry! we did not find your email. Make sure you're entering your verified email.",
                    phone: "Sorry! we did not find your phone number. Make sure you're entering your verified phone number."
                },
            };


            function socialRequestFailed (errData, which, whichOf) {
                $scope.disableForm = false;
                if (settings.analytics) {
                    ga('send', 'event',   location.hostname + ':' + which, whichOf + ' Message:' + errData.mg || 'UNKNOWN');
                }
                Ringalert.show(errData.mg || 'Request Failed', 'error');
                RingLogger.print(errData, RingLogger.tags.AUTH);
                $scope.$rgDigest();
            }


            function requestFailed (errData, which, whichOf, showOriginal) {
                var analytics = {
                    signup: {
                        success: {
                            label: 'Signup Success',
                            value: 'Auth Method: ' + $scope.credentials.authMethod
                        },
                        fail: {
                            label: 'Signup Failed',
                            value: 'Auth Method: ' + $scope.credentials.authMethod
                        }
                    },
                    signin: {
                        success: {
                            label: 'Signin Success',
                            value: 'Auth Method: ' + $scope.credentials.authMethod
                        },
                        fail: {
                            label: 'Signin Failed',
                            value: 'Auth Method: ' + $scope.credentials.authMethod
                        }
                    },
                    recovery: {
                        success: {
                            label: 'Recovery Success',
                            value: 'Auth Method: ' + $scope.credentials.authMethod
                        },
                        fail: {
                            label: 'Recovery Failed',
                            value: 'Auth Method: ' + $scope.credentials.authMethod
                        }
                    },
                };

                if (!errData) {
                    // reset form related data
                    $scope.disableForm = true;
                    $scope.requestSuccess = true;
                    $scope.errorMsg = '';
                } else {
                    // success false
                    $scope.disableForm = false;
                    if (errData.sucs === true || errData.sucs === 'true') {
                        // add event for analytics
                        if (settings.analytics) {
                            ga('send', 'event', location.hostname + ':' + analytics[whichOf].success.label + ' :' + which, analytics[whichOf].success.value + ' Message:' + errData.mg || 'UNKNOWN' + ' RC:' + errData.rc || 'UNKNOWN');
                        }
                        $scope.requestSuccess = true;
                    } else {
                        if (settings.analytics) {
                            ga('send', 'event', location.hostname + ':' + analytics[whichOf].fail.label + ' :' + which, analytics[whichOf].fail.value + ' Message:' + errData.mg || 'UNKNOWN' + ' RC:' + errData.rc || 'UNKNOWN');
                        }
                        $scope.requestSuccess = false;
                    }
                    if (showOriginal) {
                        if (errData.hasOwnProperty('sucs') && errData.sucs !== true) {
                            $scope.errorMsg = errData.mg || 'Request Failed'; //loginData.mg || 'Login Failed';
                        } else {
                            $scope.errorMsg = errData.mg || ''; //loginData.mg || 'Login Failed';
                        }
                    } else {
                        $scope.errorMsg = errMsg[whichOf][which] || errData.mg; //loginData.mg || 'Login Failed';
                    }
                    RingLogger.print(errData, RingLogger.tags.AUTH);
                }

                $scope.$rgDigest();
            }





            function activateTab (tabName) {
                if(!$scope.disableForm) { // login not in progress
                    $scope.errorMsg = '';
                    $scope.activeTab = tabName;
                    //Storage.setData('activeTab', tabName); // only succesfull login request should set activeTab to localStorage upon response
                    switch($scope.activeTab) {
                        case 'email':
                            $scope.credentials.authMethod = 'email';
                            $scope.formStyle.left = '-800px';
                            $scope.credentials.lt = 3;
                            break;
                        case 'ringid':
                            $scope.credentials.authMethod = 'ringid';
                            $scope.formStyle.left = '-400px';
                            $scope.credentials.lt = 1;
                            break;
                        case 'facebook':
                            $scope.credentials.authMethod = 'social';
                            $scope.formStyle.left = '-1200px';
                            $scope.credentials.lt = 4; // 4 or 5
                            break;
                        case 'twitter':
                            $scope.credentials.authMethod = 'social';
                            $scope.formStyle.left = '-1200px';
                            $scope.credentials.lt = 5; // 4 or 5
                            break;
                        case 'social':
                            $scope.credentials.authMethod = 'social';
                            $scope.formStyle.left = '-1200px';
                            break;
                        default:
                            $scope.credentials.authMethod = 'phone';
                            $scope.formStyle.left = '0px';
                            $scope.credentials.lt = 2;

                    }
                    $scope.$rgDigest();
                }
            }


            function setPrefix(actionObj) {
                if (actionObj.event) {
                    rgDropdownService.close(actionObj.event);
                }

                Storage.setData('country', actionObj.item);
                $scope.credentials.mblDc =  actionObj.item.code;
                $scope.credentials.flagcode = actionObj.item.flagcode;

                $scope.$rgDigest();
            }


			function login(formValid, event) {
                if(event) {
				    event.preventDefault();
                }
                if (formValid) {
                    switch($scope.credentials.authMethod) {
                        case 'ringid':
                            $scope.credentials.username = $scope.credentials.ringid;
                            break;
                        case 'email':
                            $scope.credentials.username = $scope.credentials.email;
                            break;
                        case 'phone':
                            $scope.credentials.username = $scope.credentials.mbl;
                            break;
                    }
                    $scope.requestFailed(false);
                    Auth.login($scope.credentials).then(function(loginData) {
                        if (loginData.sucs === true || loginData.sucs === 'true'){
                            $rootScope.$rgDigest();
                            $scope.closeAll();
                        }
                        $scope.requestFailed(loginData, $scope.credentials.authMethod, 'signin');
                    }, function(errData) {
                        $scope.requestFailed(errData, $scope.credentials.authMethod, 'signin');
                    });
                }
			}

            function activate() {
                // initialize
                var tempActive =  Storage.getData('activeTab');
                if (tempActive) {
                    // autofill
                    var tempAutofill =  Storage.getData('autoFill');
                    switch(tempActive) {
                        case 'phone':
                            $scope.credentials.mbl = tempAutofill;
                            $scope.credentials.username = tempAutofill;
                            $scope.credentials.lt = 2;
                            break;
                        case 'email':
                            $scope.credentials.lt = 3;
                            $scope.credentials.email = tempAutofill;
                            $scope.credentials.username = tempAutofill;
                            break;
                        case 'ringid':
                            $scope.credentials.ringid = tempAutofill;
                            $scope.credentials.username = tempAutofill;
                            $scope.credentials.lt = 1;
                            break;
                    }
                    activateTab(tempActive);
                }


            }

            activate();

	}

})();
