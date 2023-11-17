/* * © Ipvision
 */


	angular
		.module('ringid.auth')
		.controller('AuthController', AuthController);

	AuthController.$inject = ['rgDropdownService', 'Storage', 'Auth', '$scope', '$$connector', '$rootScope', 'Ringalert', 'settings', 'MESSAGES'];

	function AuthController(rgDropdownService, Storage, Auth, $scope, $$connector, $rootScope, Ringalert, settings, MESSAGES) { //jshint ignore:line

        // no more needed in worker implementation
            //$$connector.init();
            //$$connector.resume();
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


            function requestFailed (responseData, which, showAlert) {
                if (!responseData) {
                    // reset form related data
                    $scope.disableForm = true;
                    $scope.requestSuccess = true;
                    $scope.errorMsg = '';
                } else {
                    $scope.disableForm = false;
                    if (responseData.sucs === true || responseData.sucs === 'true') {
                        //request success
                        $scope.requestSuccess = true;
                        $scope.errorMsg = responseData.mg || MESSAGES.REQUEST_PROCESSED;
                    } else {
                        // request failed
                        $scope.requestSuccess = false;
                        $scope.errorMsg = (responseData.hasOwnProperty('rc') && responseData.rc > 0) ?
                                            MESSAGES['RC' + responseData.rc] : (responseData.mg || MESSAGES.REQUEST_FAILED);

                        if (settings.analytics) {
                            ga('send', 'event',  which + ' Message:' + $scope.errorMsg + ' RC:' + responseData.rc || 'UNKNOWN');
                        }
                    }

                    if (showAlert) {
                        Ringalert.show($scope.errorMsg, 'error') ;
                    }

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
                            if ($scope.params && $scope.params.fromPopup) {
                                $scope.closeAll();
                                window.location = '/';
                            } else {
                                $rootScope.$rgDigest();
                            }
                        } else {
                            $scope.requestFailed(loginData, 'Signin:' + $scope.credentials.authMethod);
                        }
                    }, function(errData) {
                        $scope.requestFailed(errData, 'Signin:' + $scope.credentials.authMethod);
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

                $scope.$rgDigest();

            }

            activate();

	}

