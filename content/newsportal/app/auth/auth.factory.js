/*
 * © Ipvision
 */

(function() {
	'use strict';

	angular
		.module('ringid.auth')
        .factory('Auth', AuthFactory);


        AuthFactory.$inject = ['SystemEvents', '$rootScope', 'Storage', 'utilsFactory', '$q', '$ringhttp', 'settings', 'OPERATION_TYPES',
                             'userFactory', 'authHttpService', '$ringbox', 'Ringalert', 'profileHttpService', 'countryListService', '$$connector'];
        function AuthFactory(SystemEvents, $rootScope, Storage, utilsFactory, $q, $ringhttp, settings, OPERATION_TYPES,  // jshint ignore:line
                                 userFactory, authHttpService, $ringbox, Ringalert, profileHttpService, countryListService, $$connector) {


            var sessionID = Storage.getCookie('sessionID'),
                pendingLogin = true,
                loginInProgress = false,
                OTYPES = OPERATION_TYPES.SYSTEM.AUTH,
                _permission = {},
                _countryList = [],
                _countryData  = {
				    code : '+880',
                    flagcode  :  'b880'
                    },
                _sId = Storage.getCookie('sId'),
                _uId = Storage.getCookie('uId'),
                _utId = Storage.getCookie('utId'),
                _did = utilsFactory.generateUUID();

             $rootScope.$on('ringActive',function(){
                 RingLogger.print("ringactive Fired "+ sessionID,"ringactiveTest");
                 RingLogger.print("ringactive cookie"+Cookies.get('sessionID'),"ringactiveTest");
                if(Cookies.get('sessionID') !== sessionID){
                    RingLogger.print("ringactive reloaded","ringactiveTest");

                    window.location.reload();
                }

             });






            function save(user) {
                Service._currentUser = user;
                //updateLoginData();
                return user;
            }


            function updateLocalStorageLoginData(loginData){
                if(!!loginData){
                    Service.loginData = loginData;
                    Storage.setData('loginData', loginData);
                }

            }


            var delete_cookie = function(name) {
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            };
            var clearCookies = function(keepSessionId){
                delete_cookie('uId');
                delete_cookie('sId');
                if(!keepSessionId){
                    delete_cookie('sessionID');
                    sessionID = undefined;
                }

                delete_cookie('la'); // last checked for login
                RingLogger.print('cookie deleted : keepSessionId:'+keepSessionId, RingLogger.tags.AUTH);
            };

            var setCookies = function (loginData, days) {
                Storage.setCookie('uId', loginData.uId || '', days);
                Storage.setCookie('sId', loginData.sId || '', days);
                Storage.setCookie('utId', loginData.utId || '', days);
                // from login request
                if (days) {
                    Storage.setCookie('la', new Date().getTime(), days);
                }

                if (loginData.authServer) {
                    Storage.setCookie('authServer', loginData.authServer || '', days);
                }
                if (loginData.comPort) {
                    Storage.setCookie('comPort', loginData.comPort || '', days);
                }

                //var sessionId = Storage.getCookie('sessionID');
                //Storage.setCookie('sessionID', sessionId, 30);

                };

            var reloadHome = function(timeout, withRand) {

                if (!!timeout) {
                    clearCookies();
                    Storage.reset();
                }

                if(withRand) {
                    setTimeout(function() {
                        window.location = '/?rand=' + utilsFactory.getUniqueID();
                    }, timeout);

                } else {
                    setTimeout(function() {
                        window.location = '/';
                    }, timeout);
                }

            };

            function _saveDataForRememberMe(credentials, loginData, days){

                try {
                    var remData = {
                        usrPw : loginData.authEPassword,
                        salt : loginData.authESalt,
                        sId : loginData.sId,
                        lt : credentials.lt

                    };

                    switch(credentials.lt) {
                        case 1:
                            remData.uId = loginData.authEUsername;
                            break;
                        case 2:
                            remData.mbl = loginData.authEUsername;
                            remData.mblDc = credentials.mblDc;
                            break;
                        case 3:
                            remData.el = loginData.authEUsername;
                            break;
                        default:
                            RingLogger.warning('REMEMBER ME DATA SAVE FAILED', RingLogger.tags.AUTH);
                    }

                    Storage.setData('remInfo', remData);

                    var sessionId = Storage.getCookie('sessionID');
                    Storage.setCookie('sessionID', sessionId, days);


                } catch (e) {
                    RingLogger.warning('FAILED REMEMBER ME', RingLogger.tags.AUTH);
                }

            }


            function initializeSignup(credentials, isSocial) {
                var defer = $q.defer();
                // step 1
                authHttpService.signupInit(_did).success(function(response) {
                    if (response.success === true) {
                        // set auth ip and comport
                        setCookies({
                            uId: response.ringID,
                            authServer: response.authServerIP,
                            comPort: response.comPort
                        });
                        // signup step 2
                        credentials = angular.extend(credentials, {uId: response.ringID, did: _did});
                        // non social signup
                        if (!isSocial) {
                            authHttpService.signupSendCode(credentials).then(function(json) {
                                defer.resolve(angular.extend(json, {uId: response.ringID}));
                            }, function(errJson) {
                                RingLogger.print(errJson,RingLogger.tags.AUTH);
                                defer.reject(errJson);
                            });
                        } else {
                        // social signup
                            defer.resolve(credentials);
                        }
                    } else {
                        defer.reject(response);
                    }
                }).error(function() {
                    RingLogger.alert('fetching new ringid failed', RingLogger.tags.AUTH);
                    defer.reject();
                });
                return defer.promise;
            }


            function requestLogin(loginRequestData, defer) {
                loginInProgress = true;
                loginRequestData.did = _did;
                authHttpService.login(loginRequestData).then(function (json) {
                    loginInProgress  = false;
                    if (json.sucs === true) {
                        if (loginRequestData.remember) {
                            _saveDataForRememberMe(loginRequestData, json, 30);
                            Storage.setData('remember', true);
                        } else {
                            // remove remember data if not checked
                            Storage.deleteData('remInfo');
                            Storage.deleteData('remember');

                        }

                        if (loginRequestData.authMethod) {
                            Storage.setData('activeTab', loginRequestData.authMethod); // only succesfull login request should set activeTab to localStorage upon response
                        }

                        doLoginTasks(json, true);
                        defer.resolve(json);
                    } else {
                        defer.reject(json);
                    }
                }, function (json) {
                    if (json.sucs === false && json.rc === 1111){
                        requestLogin(loginRequestData, defer);
                    } else {
                        loginInProgress  = false;
                        defer.reject({sucs: false, mg: 'Reqeust Failed'});
                    }
                });
            }


            function ensureLoginState(sessionCheckDone) {
                var loginData =  Storage.getData('loginData');
                var remInfo = Storage.getData('remInfo');
                // is login possible from localData or remember me ?
                if (loginData || remInfo) {
                    RingLogger.information('LOGIN POSSIBLE', RingLogger.tags.AUTH);
                    // is session check done and session is valid ?
                    if (sessionCheckDone && Service._validSession) {
                        if (loginData) {
                            RingLogger.information('LOGIN USER from localStroage', RingLogger.tags.AUTH);
                            doLoginTasks(loginData);
                        } else {
                            RingLogger.information('LOGIN USER from REMEMBER ME', RingLogger.tags.AUTH);
                            Service.loginFromLocalData();
                        }
                    } else if (!sessionCheckDone) {
                        RingLogger.information('SESSION VALIDATION CHECK', RingLogger.tags.AUTH);
                        checkSession(true);
                    } else {
                        RingLogger.information('LOGING OUT', RingLogger.tags.AUTH);
                        doLogoutTasks();
                    }
                } else {
                    doLogoutTasks();
                }


            }

            function handleInvalidSession(json) {
                RingLogger.warning('SESSION_VIOLATION', RingLogger.tags.AUTH);
                RingLogger.print(json, RingLogger.tags.AUTH);

                if (!loginInProgress && json.actn === OTYPES.TYPE_MULTIPLE_SESSION) {
                     RingLogger.print("multiple session warning",json,RingLogger.tags.AUTH);
                     Ringalert.alert({
                        title : 'Signed Out!',
                        message : 'You are signed in from another device',
                        showCancel : false,
                        okCallback : function() {
                          doLogoutTasks(true);
                        }
                     });
                    // doLogoutTask();

                }
                // NOT SURE WHAT ELSE TO DO
                //else if (!loginInProgress) {
                    //RingLogger.print("invalid session",json,RingLogger.tags.AUTH);
                    ////if (!json.sucs) {
                         //RingLogger.print("Requested for silent Login",RingLogger.tags.AUTH);
                        //if (!Service.isLoggedIn() || json.actn === OTYPES.TYPE_SESSION_VALIDATION ) {
                            //Service.loginFromLocalData();
                        //} else {
                            //doLogoutTasks();
                        //}
                    ////} else {
                         ////RingLogger.print("Not Requested for silent Login",RingLogger.tags.AUTH);
                        //////todo what should be here
                        ////doLogoutTasks();
                    ////}
                //}
            }





            var Service = {


                // holds current user
                _currentUser: null,

                _validSession: false,
                isPendingAsync: function() {
                    var pendingInterval,
                        defer = $q.defer();

                    if (pendingLogin) {
                        pendingInterval = setInterval(function() {
                            if (!pendingLogin) {
                                clearInterval(pendingInterval);
                                if (Service._validSession) {
                                    defer.resolve();
                                } else {
                                    defer.reject();
                                }
                            }
                        }, 1000);
                    } else {
                        defer.resolve();
                    }
                    return defer.promise;
                },
                isPending: function() {
                     return pendingLogin;
                },

                // template for login/ dashboard page
                sendCode: initializeSignup,
                updateLocalStorageLoginData : updateLocalStorageLoginData,
                verifyCode: function(credentials) {
                    credentials = angular.extend({}, credentials, {did: _did});
                    return authHttpService.signupVerifyCode(credentials);
                },
                signup: function(credentials) {
                    var deferred = $q.defer();
                    // TODO BELOW COMMENTED CODE IS NECESSARY. MAKE SURE SERVER SUPPORTS THIS. NOW ALWAYS FALSE IS RETURNED
                    //authHttpService.validMobileNo({mbl: credentials.mbl, mblDc: credentials.mblDc , lt: 1 }).success(function(json) {
                        //if (json.sucs === true) {
                            //RingLogger.print(json, RingLogger.tags.AUTH);
                            angular.extend(credentials, {did: _did});
                            authHttpService.signup(credentials).then(function(json) {
                                RingLogger.print(json, RingLogger.tags.AUTH);
                                deferred.resolve(json);
                            }, function() {
                                deferred.reject();
                            });
                        //} else {
                            //// this mobile no already used in another account. let him signin or change the mobile
                            //deferred.reject({mg: 'This Mobile no is used in another account. If this is yours, try Forgot Password option or change this no'});
                        //}
                    //}).error(function() {
                        //deferred.reject();
                    //});
                    return deferred.promise;
                },
                // facebook and twitter signup
                openSignup: function(socialData, credentials) {
                    var deferred = $q.defer();
                    authHttpService.validSocialId(socialData).success(function(response) {
                        RingLogger.print(response, RingLogger.tags.AUTH);
                        if (response.success === false && response.rc === 2) {
                            // now show signup step 3 in popup
                           $ringbox.open({
                                    type : 'remote',
                                    scope:false,
                                    controller: 'SignUpController',
                                    resolve : {
                                        localData: {
                                            socialData:  socialData,
                                            credentials: credentials
                                        },
                                        remoteData : angular.noop //initializeSignup(socialData, true)
                                    },
                                    templateUrl : 'pages/welcome/ring-signup-popup.html'
                            });
                            deferred.resolve();
                        } else {
                            deferred.reject({rc: 'dologin', mg: 'Already Registered Social ID'});
                            // login anyway
                        }
                    }).error(function() {
                        deferred.reject({rc: 0, mg: 'Request Failed'});
                    });
                    return deferred.promise;
                },

                // login user
                login: function (loginRequestData, isSocial) {
                    var defer = $q.defer();
                    if (isSocial) {
                        authHttpService.validSocialId(angular.extend(loginRequestData, {did: _did})).success(function(json) {
                            RingLogger.print(json, RingLogger.tags.AUTH);
                            if (json.success === true || json.success === 'true')  {
                                setCookies({
                                    uId: json.ringID,
                                    authServer: json.authServerIP,
                                    comPort: json.comPort
                                });
                                // attempt to login
                                loginRequestData.uId = json.ringID;
                                //loginRequestData.lt = loginRequestData.lt;
                                loginRequestData.authMethod = loginRequestData.platform;
                                requestLogin(loginRequestData, defer);
                            } else {
                                defer.reject({rc: 'invalidsocialid', mg: 'Unregistered Social ID. Please Register.'});
                            }
                        }).error(function() {
                            defer.reject({rc: 0, mg: 'Request Failed'});
                        });
                    } else {
                        // set current user auth method email, ringid or phonenumber for autofill
                        switch(loginRequestData.authMethod) {
                            case 'email':
                                Storage.setData('autoFill', loginRequestData.email);
                                break;
                            case 'ringid':
                                Storage.setData('autoFill', loginRequestData.ringid);
                                break;
                            case 'phone':
                                Storage.setData('autoFill', loginRequestData.mbl);

                        }
                        requestLogin(loginRequestData, defer);
                    }

                    return defer.promise;
                },

                // logout user
                logout: function(force) {
                    if(Service.isLoggedIn()) {
                        $rootScope.$broadcast(SystemEvents.LOADING, true);
                        authHttpService.logout().then(function(response) {
                            $rootScope.$broadcast(SystemEvents.LOADING, false);
                            RingLogger.information(response, RingLogger.tags.AUTH);
                            reloadHome(1);
                        });
                    }

                    if(!!force){
                        reloadHome(1);
                    }else{
                        reloadHome(1000);
                    }


                },
                clearCookies : function(keepSessionId){
                    clearCookies(keepSessionId);
                },

                loginFromLocalData: function () {
                    var remInfo = Storage.getData('remInfo');

                    if (!!remInfo && (remInfo.uId || remInfo.el || remInfo.mbl ) ) {
                        RingLogger.information('TRYING REMEMBER ME LOGIN', RingLogger.tags.AUTH);
                        var loginRequestParams = {
                            remember: true,
                            silent : true
                        };
                        angular.extend(loginRequestParams, remInfo);

                        Service.login(loginRequestParams).then(function (json) {
                            if(!!json.sucs){
                                RingLogger.print('Auto Login Success',RingLogger.tags.AUTH);
                                doLoginTasks(json);
                            }else{
                                RingLogger.print('Auto Login Failed',RingLogger.tags.AUTH);
                                doLogoutTasks();
                            }
                        }, function () {
                            doLogoutTasks();
                        });
                    } else {
                        RingLogger.information('NO REMEMBER ME INFORMATION', RingLogger.tags.AUTH);
                        doLogoutTasks();
                    }

                },

                // get current user
                currentUser: function() {
                    return Service._currentUser;
                },

                // checkes login status
                isLoggedIn: function() {
                    return !!Service._currentUser &&  !!Storage.getCookie('sId') && !!Storage.getCookie('sessionID');
                },
                // check Session Validity
                isValidSession: function(){
                   var defer = $q.defer();
                    if (_utId && _sId && _uId) {
                        //return  userLoginFactory.isValidSession(Service._currentUser.getUtId());
                        authHttpService.isValidSession({did: _did, utId: _utId}).then(function(response) {
                            if(response.sucs) {
                                Service._validSession = true;
                                defer.resolve(response);
                            } else {
                                Service._validSession  = false;
                                defer.reject(response);
                            }
                        },function(){
                            defer.reject(Service._validSession);
                        });
                    } else {
                            defer.reject(Service._validSession);

                   }
                    return defer.promise;
                },
                reloadHome : reloadHome,
                getCountry: function() {
                    var countryData = Storage.getData('country');
                    if (countryData && countryData.country) {
                        _countryData.code  = countryData.code;
                        _countryData.flagcode = countryData.flagcode;
                    }

                    return _countryData;
                },
                getCountryList: function() {
                    return _countryList;
                },
                getPermission: function() {
                    return _permission;
                },
                setAchatPermission: function(param) {
                    _permission.ancht = param;
                },

                ensureLoginState: ensureLoginState,
                handleInvalidSession: handleInvalidSession

            };



             // preloading templates
            var preloadTemplates = [
                '/pages/dropdowns/notification-dropdown.html',
                '/pages/dropdowns/friend-request-dropdown.html',
                '/pages/partials/emoticon-window.html',
                '/pages/dropdowns/circle-list-dropdown.html',
                '/pages/dropdowns/search-dropdown.html',
                '/pages/partials/hovercards/profile-hover.html',

                '/pages/partials/notification/image-popup.html',
                '/pages/partials/notification/media-popup.html',
                '/pages/partials/notification/feed-popup_with_image.html',
                '/pages/partials/stickers/popups/sticker-market.html'
            ];

            function preLoad(templateUrl) {
                setTimeout(function() {
                    $ringhttp.get(templateUrl).success(function() {
                        RingLogger.information('TEMPLATE PRELOADED: ' + templateUrl, RingLogger.tags.DEFAULT);
                    });
                }, 100);
            }



            function fetchCountries() {
                if (_countryList.length === 0)  {
                    countryListService.getList().success( function(data) {
                        _countryList = data;
                        var country = Storage.getData('country');
                        if (!country || !country.country) {
                            $ringhttp.get(settings.baseUrl + '/country').success(function(country) {
                                if (country && country.length > 0) {
                                    country = country.toLowerCase();
                                    for (var i = 0; i < _countryList.length; i++) {
                                        if (_countryList[i].country.toLowerCase() === country) {
                                            _countryData.code   = _countryList[i].code;
                                            _countryData.flagcode = _countryList[i].flagcode;
                                            Storage.setData('country', _countryList[i]);
                                            break;
                                        }

                                    }
                                }
                            });
                        } else {
                            _countryData.code = country.code;
                            _countryData.flagcode = country.flagcode;
                        }
                    });
                }
            }

            function doLogoutTasks (reload) {
                RingLogger.print('LOGIN FAIL. LOGGING OUT', RingLogger.tags.AUTH);
                save(null);
                pendingLogin = false;
                Service.clearCookies(true);
                Storage.reset();

                if (reload) {
                    reloadHome();
                } else {
                    fetchCountries();
                    $rootScope.$broadcast(SystemEvents.AUTH.LOGIN, false);
                }
            }

            function doLoginTasks (loginData, fromLogin) {
                pendingLogin = false;
                RingLogger.print('LOGIN SUCCESS', RingLogger.tags.AUTH);

                Service.loginData = loginData;
                setCookies(loginData, fromLogin ? 30 : false);

                // save current user
                save(userFactory.create(loginData, true, true));
                // init localStorage
                Storage.init(loginData);

                // preload templates
                setTimeout(function() {
                  preloadTemplates.forEach(preLoad)   ;
                }, 2000);

                // pull current user permissions
                profileHttpService.verifyCheck().then(function(json) {
                    _permission = json;
                    //Service._currentUser.updateUserObj(json);
                    //
                }, function() {
                    RingLogger.warning('User Permission fetch fail', RingLogger.tags.PROFILE);
                });

                $rootScope.$broadcast(SystemEvents.AUTH.LOGIN, true);
            }

            function checkSession(force) {
                var lastChecked =  parseInt(Storage.getCookie('la')),
                    nowTime = new Date().getTime();

                if (force || (lastChecked &&  (lastChecked + settings.sessionTimeout) < nowTime ) ) { // more than 6 hours old
                    RingLogger.information('VALID SESSION check in progrfess', RingLogger.tags.AUTH);
                    // need to validate session
                    Service.isValidSession(true).then(function(){
                        Storage.setCookie('la', nowTime);
                        if (Service._validSession) {
                            RingLogger.information('Valid Session', RingLogger.tags.AUTH);
                            ensureLoginState(true);
                        } else {
                            doLogoutTasks();
                            RingLogger.information('INValid Session', RingLogger.tags.AUTH);
                        }
                   },function(){
                        RingLogger.information('INValid Session', RingLogger.tags.AUTH);
                        doLogoutTasks();
                    });
                    return false;
                } else {
                    return true;
                }
            }


        return Service;

    }


})();


