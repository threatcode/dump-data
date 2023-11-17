/*
 * © Ipvision
 */


	angular
    .module('ringid.global_services')
        .factory('Auth', AuthFactory);


        AuthFactory.$inject = ['SystemEvents', '$rootScope', 'Storage', 'Utils', '$q', '$ringhttp', 'settings', 'OPERATION_TYPES',
                             'userFactory', '$ringbox', 'Ringalert',  '$$connector',   '$ocLazyLoad', 'Api'];
        function AuthFactory(SystemEvents, $rootScope, Storage, Utils, $q, $ringhttp, settings, OPERATION_TYPES,  // jshint ignore:line
                                 userFactory, $ringbox, Ringalert,  $$connector,  $ocLazyLoad, Api) {


            var sessionID = Storage.getCookie('sessionID'),
                invalidLoginProcessed = false,
                invalidSesssionProcessed = false,
                pendingLogin = true,
                loginInProgress = false,
                OTYPES = OPERATION_TYPES.SYSTEM.AUTH,
                REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE,
                _permission = {},
                _countryList = [],
                _countryData  = {
				    code : '+880',
                    flagcode  :  'b880'
                    },
                _sId = Storage.getCookie('sId'),
                _uId = Storage.getCookie('uId'),
                _utId = Storage.getCookie('utId'),
                _did = Utils.generateUUID();

             $rootScope.$on('ringActive',function(){
                if(Cookies.get('sessionID') !== sessionID){

                    window.location.reload();
                }

             });



             function prepareApiData(which, obj, optionalParam) {
                 var payload = {
                 };

                switch(which) {
                    case 'fetchRecoverOptions':
                        payload.actn = OTYPES.PASSWORD_RECOVER_OPTIONS;
                        payload.did = _did;
                        payload.rb = obj.mblDc + obj.mbl;
                        payload.mbl = obj.mbl; // udpserver requirement
                        payload.mblDc = obj.mblDc; // udpserver requirement
                        payload.vsn = settings.apiVersion;
                        payload.wk  = Utils.getUniqueID();
                        payload.lt  = 2; // udp server dependency sendSms ? 2 : 3
                        break;
                    case 'recoveryVerifyCode':
                        payload.actn  = OTYPES.PASSWORD_RECOVER_VERIFY_CODE;
                        payload.uId  = obj.uId;
                        payload.vc  = obj.vc;
                        payload.wk  = Utils.getUniqueID();
                        payload.lt  = 1; // server dependency sendSms ? 2 : 3
                        break;
                    case 'recoverySendCode':
                        payload.actn = OTYPES.PASSWORD_RECOVER_SEND_CODE;
                        payload.wk = Utils.getUniqueID();

                        if(optionalParam) {
                            payload.lt = 2;
                            payload.rb = obj.mblDc+obj.mbl;
                            payload.mbl = obj.mbl;
                            payload.mblDc = obj.mblDc;
                        } else {
                            payload.lt = 3;
                            payload.rb = obj.email;
                            payload.el = obj.email.utf8Encode();
                        }
                        break;
                    case 'resetPassword':
                        payload.actn  = OTYPES.PASSWORD_RECOVER;
                        payload.uId  = obj.uId;
                        payload.nPw  = obj.password;
                        payload.wk  = Utils.getUniqueID();
                        payload.lt  = 1; // server dependency  sendSms ? 2 : 3
                        break;
                    case 'isValidSession':
                        payload.actn  = OTYPES.TYPE_SESSION_VALIDATION;
                        payload.dvcc = 5;
                        payload.utId  = _utId;
                        payload.did = _did;
                        break;
                    case 'logout':
                        payload.actn = OTYPES.TYPE_SIGN_OUT;
                        break;
                    case 'validSocialId':
                        var url = (obj.platform === 'facebook') ?
                            settings.signupSocialInit + 'fb=' + obj.id + '&lt=4' : settings.signupSocialInit + 'twtr=' + obj.id + '&lt=5';
                        payload = url + '&time=' + new Date().getTime();
                        break;
                    case 'signupSendCode':
                        payload.wk = Utils.getUniqueID();
                        payload.uId = obj.uId;
                        payload.did = obj.did;
                        payload.lt = 1; // server dependency

                        if (obj.authMethod === 'email') {
                            payload.el = obj.email.utf8Encode();
                            payload.actn = OTYPES.SIGNUP_SEND_CODE_EMAIL;
                        } else {
                            payload.actn = OTYPES.SIGNUP_SEND_CODE_PHONE;
                            payload.mbl = obj.mbl;
                            payload.mblDc = obj.mblDc;
                        }
                        break;
                    case 'signupVerifyCode':
                            payload.wk  = Utils.getUniqueID();
                            payload.uId = obj.uId;
                            payload.did = obj.did;
                            payload.lt = 1; // server dependency

                            if((obj.authMethod === 'email')) {
                                payload.actn = OTYPES.SIGNUP_SEND_CODE_EMAIL;
                                payload.el = obj.email.utf8Encode();
                                payload.evc = obj.vc;
                            } else {
                                payload.actn = OTYPES.SIGNUP_SEND_CODE_PHONE;
                                payload.mbl = obj.mbl;
                                payload.mblDc = obj.mblDc;
                                payload.vc = obj.vc;
                            }
                            break;
                    case 'signup':
                        payload.actn  = OTYPES.SIGNUP_REGISTER;
                        payload.wk  = Utils.getUniqueID();
                        payload.uId = obj.uId;
                        payload.did = obj.did;
                        payload.nm = obj.name.utf8Encode();
                        payload.usrPw = obj.password;
                        payload.lt = 1; // server dependency
                        // for all signup mobile no is required these are new params
                        payload.ispc = 0; // default for auth server
                        payload.mbl  = obj.mbl;
                        payload.mblDc  = obj.mblDc;

                        switch(obj.authMethod) {
                            case 'email':
                                payload.el = obj.email.utf8Encode();
                                payload.evc = obj.vc;
                                break;
                            case 'facebook':
                                payload.fb = obj.id;
                                payload.it = obj.access_token;
                                payload.lt = 4;
                                break;
                            case 'twitter':
                                payload.twtr = obj.id;
                                //var tokenObj = {
                                    //url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
                                    //qs: 'oauth_timestamp=' + obj.oauthParameters.oauth_timestamp + '&oauth_version=' + obj.oauthParameters.oauth_version + '&oauth_consumer_key=' + obj.oauthParameters.oauth_consumer_key +
                                          //'&oauth_signature=' + obj.oauthParameters.oauth_signature + '&oauth_token=' + obj.access_token + '&oauth_nonce=' + obj.oauthParameters.oauth_nonce + '&oauth_signature_method=' + obj.oauthParameters.oauth_signature_method
                                //};
                                //payload.it = JSON.stringify(tokenObj);
                                //payload.it = 'oauth_token=' + obj.oauth_token +  '&verifier=' + obj.oauth_verifier;
                                payload.it = obj.access_token;
                                payload.lt = 5;
                                break;
                            default:
                                // with mobile
                                payload.mbl = obj.mbl;
                                payload.mblDc = obj.mblDc;
                                payload.vc = obj.vc;
                                //payload.lt = 1; // server dependency
                        }
                        break;
                    case 'login':
                            if (obj.hasOwnProperty('silent') && obj.silent === true) {
                                payload.actn = OTYPES.TYPE_SIGN_IN;
                                payload.vsn = settings.apiVersion;
                                payload.wk = Utils.getUniqueID(); // default for auth server
                                payload.dvc = 5;
                                payload.tbid = Utils.tabId;
                                return payload;
                            } else {
                                payload.actn = OTYPES.TYPE_SIGN_IN;
                                payload.vsn = settings.apiVersion;
                                payload.usrPw = obj.password;
                                payload.lt = 1;
                                payload.sn = settings.apiVersion; // auth server version
                                payload.wk = Utils.getUniqueID();
                                payload.dvc = 5;
                                payload.tbid = Utils.tabId;
                                payload.did = obj.did;

                                switch(obj.authMethod) {
                                    //case '+878': // ringid login
                                    case 'ringid': // ringid login
                                        payload.lt = 1;
                                        // URGENT. NEED TO CHECK WHAT IS THE SITUATION WITH BELOW CHECK
                                        payload.uId = !obj.silent ? '21' + obj.ringid : obj.ringid;
                                        //payload.uId = '21' + obj.ringid;
                                        break;
                                    case 'email': // email login
                                        payload.lt = 3;
                                        payload.el = obj.email.utf8Encode();
                                        break;
                                    case 'facebook':
                                        payload.uId = obj.uId;
                                        payload.pen = 1;
                                        payload.lt = 4;
                                        payload.apt = 1;
                                        payload.smid = obj.id;
                                        payload.it = obj.access_token;
                                        delete payload.usrPw;
                                        break;
                                    case 'twitter':
                                        payload.uId = obj.uId;
                                        delete payload.usrPw;

                                        payload.smid = obj.id;
                                        //var tokenObj = {
                                            //url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
                                            //qs: 'oauth_timestamp=' + obj.oauthParameters.oauth_timestamp + '&oauth_version=' + obj.oauthParameters.oauth_version + '&oauth_consumer_key=' + obj.oauthParameters.oauth_consumer_key +
                                                  //'&oauth_signature=' + obj.oauthParameters.oauth_signature + '&oauth_token=' + obj.access_token + '&oauth_nonce=' + obj.oauthParameters.oauth_nonce + '&oauth_signature_method=' + obj.oauthParameters.oauth_signature_method
                                        //};
                                        //payload.it = JSON.stringify(tokenObj);
                                        //payload.it = 'oauth_token=' + obj.oauth_token +  '&verifier=' + obj.oauth_verifier;
                                        payload.it = obj.access_token;
                                        payload.lt = 5;
                                        break;
                                    default: // phone login
                                        payload.lt = 2;
                                        payload.mbl = obj.mbl;
                                        payload.mblDc = obj.mblDc;
                                }

                                /* Remember Me Salt and Previous sID */
                                if( !!obj.salt && !!obj.sId ){
                                    payload.salt = obj.salt;
                                    payload.sId = obj.sId;
                                }
                            }
                            break;
                    default:
                        payload = obj;
                 }

                 return payload;

             }




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
                delete_cookie('utId');
                delete_cookie('sId');
                delete_cookie('authServer');
                delete_cookie('comPort');
                delete_cookie('la');
                delete_cookie('col');
                if(!keepSessionId){
                    delete_cookie('sessionID');
                    sessionID = undefined;
                }

                delete_cookie('la'); // last checked for login
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
                        window.location = '/?rand=' + Utils.getUniqueID();
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
                            
                    }

                    Storage.setData('remInfo', remData);

                    var sessionId = Storage.getCookie('sessionID');
                    Storage.setCookie('sessionID', sessionId, days);


                } catch (e) {
                    
                }

            }


            function initializeSignup(credentials, isSocial) {
                var defer = $q.defer();
                // step 1 ;
			    $ringhttp.get(settings.signupInit + 'did=' + _did + '&time=' + new Date().getTime()).success(function(response) {
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

                            $$connector.request(prepareApiData('signupSendCode', credentials), REQTYPE.AUTHENTICATION).then(function(json) {
                                defer.resolve(angular.extend(json, {uId: response.ringID}));
                            }, function(errJson) {
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
                    defer.reject();
                });
                return defer.promise;
            }


            function requestLogin(loginRequestData, defer) {
                loginInProgress = true;
                loginRequestData.did = _did;

                $$connector.request(prepareApiData('login', loginRequestData), REQTYPE.AUTHENTICATION).then(function (json) {
                    loginInProgress  = false;
                    if (json.sucs === true) {
                        Service._validSession = true;
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
                        Service._validSession = false;
                        defer.reject(json);
                    }
                }, function (json) {
                    if (json.sucs === false && json.rc === 1111){
                        requestLogin(loginRequestData, defer);
                    } else {
                        Service._validSession = false;
                        loginInProgress  = false;
                        defer.reject({sucs: false, mg: 'Reqeust Failed'});
                    }
                });
            }


            //function ensureLoginState(sessionCheckDone) {
            function ensureLoginState() {
                var loginData =  Storage.getData('loginData');
                //var remInfo = Storage.getData('remInfo');
                // is login possible from localData or remember me ?
                if (loginData && (!window.hasOwnProperty('ringLoggedIn') || window.ringLoggedIn)) {
                    
                    //$rootScope.$on('AUTH.LOGIN_REQUIRED', function() {
                        //
                        //Service.loginFromLocalData();
                    //});
                    //$rootScope.$on('AUTH.LOGIN_DONE', function() {
                        //
                        //$rootScope.$broadcast(SystemEvents.AUTH.LOGIN, true);
                    //});
                    doLoginTasks(loginData);
                    // is session check done and session is valid ?
                    //if (sessionCheckDone && Service._validSession) {
                        //if (loginData) {
                            //
                            //doLoginTasks(loginData);
                        //} else {
                            //
                            //Service.loginFromLocalData();
                        //}
                    //} else if (!sessionCheckDone) {
                        //
                        //checkSession(true);
                    //} else {
                        //doLogoutTasks();
                    //}
                } else {
                    doLogoutTasks();
                }


            }

            function handleInvalidSession(json) {
                
                switch(json.actn) {
                    case OTYPES.TYPE_MULTIPLE_SESSION:
                        
                        if (!loginInProgress) {
                             
                             Ringalert.alert({
                                title : 'Signed Out!',
                                message : 'You are signed in from another device',
                                showCancel : false,
                                okCallback : function() {
                                  doLogoutTasks(true);
                                }
                             });
                        }
                        break;
                    case OTYPES.TYPE_INVALID_LOGIN_SESSION:
                        
                        //if (!loginInProgress && !invalidLoginProcessed) {
                        if (!loginInProgress ) {
                            invalidLoginProcessed = true;
                            Service.loginFromLocalData();
                        }
                        break;
                    case OTYPES.TYPE_SESSION_VALIDATION:
                        
                        //if (!loginInProgress && !invalidSesssionProcessed) {
                        if (!loginInProgress ) {
                            invalidSesssionProcessed = true;
                            if (!Service.isLoggedIn()) {
                                Service.loginFromLocalData();
                            } else {
                                doLogoutTasks(true);
                            }
                        }
                        break;

                }

            }



            function fetchPrivacy() {
                return $$connector.request( {
                    actn: OTYPES.PHN_MAIL_VERIFICATION_CHECK//28
                }, REQTYPE.REQUEST);
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
			        return $$connector.request(prepareApiData('signupVerifyCode', credentials), REQTYPE.AUTHENTICATION);
                },
                signup: function(credentials) {
                    var deferred = $q.defer();
                    // TODO BELOW COMMENTED CODE IS NECESSARY. MAKE SURE SERVER SUPPORTS THIS. NOW ALWAYS FALSE IS RETURNED
                    //authHttpService.validMobileNo({mbl: credentials.mbl, mblDc: credentials.mblDc , lt: 1 }).success(function(json) {
                        //if (json.sucs === true) {
                            angular.extend(credentials, {did: _did});

                            $$connector.request(prepareApiData('signup', credentials), REQTYPE.AUTHENTICATION).then(function(json) {
                                
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

                    $ringhttp.get(prepareApiData('socialData')).success(function(response) {
                        
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
                                    templateUrl : 'templates/welcome/ring-signup-popup.html'
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
                        angular.extend(loginRequestData, {did: _did});
                        $ringhttp.get(prepareApiData('validSocialId', loginRequestData)).success(function(json) {
                            
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
			            $$connector.request(prepareApiData('logout'),REQTYPE.AUTHENTICATION).then(function(response) {
                            $rootScope.$broadcast(SystemEvents.LOADING, false);
                            
                            //reloadHome(1);
                            doLogoutTasks(true);
                        });
                    }

                    setTimeout(function() {
                         doLogoutTasks(true);
                    }, 1000);

                    $$connector.stop();

                    //if(!!force){
                        //doLogoutTasks(true);
                        ////reloadHome(1);
                    //}else{
                        //do
                        //reloadHome(1000);
                    //}


                },
                clearCookies : function(keepSessionId){
                    clearCookies(keepSessionId);
                },

                loginFromLocalData: function () {
                    var remInfo = Storage.getData('remInfo');

                    if (!loginInProgress && !!remInfo && (remInfo.uId || remInfo.el || remInfo.mbl ) ) {
                        
                        var loginRequestParams = {
                            remember: true,
                            silent : true
                        };
                        angular.extend(loginRequestParams, remInfo);

                        Service.login(loginRequestParams).then(function (json) {
                            if(!!json.sucs){
                                
                                doLoginTasks(json);
                            }else{
                                
                                doLogoutTasks(true);
                            }
                        }, function () {
                            doLogoutTasks(true);
                        });
                    } else {
                        
                        doLogoutTasks(true);
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
                        $$connector.request(prepareApiData('isValidSession')).then(function(response) {
                            
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
                setAinfndreqPermission: function(param) {
                    _permission.aifr = param;
                },
                setAfamPermission: function(param) {
                    _permission.afam = param;
                },
                setAafPermission: function(param) {
                    _permission.aaf = param;
                },

                ensureLoginState: ensureLoginState,
                handleInvalidSession: handleInvalidSession,
                fetchPrivacy: fetchPrivacy,
                fetchRecoverOptions: function(phoneNo) {
                    return $$connector.request(prepareApiData('fetchRecoverOptions', phoneNo), REQTYPE.AUTHENTICATION);
                },
                recoverySendCode : function(obj, sendSms) {
                    return $$connector.request(prepareApiData('recoverySendCode', obj, sendSms), REQTYPE.AUTHENTICATION);
                },
                recoveryVerifyCode : function(obj) {
                    return $$connector.request(prepareApiData('recoveryVerifyCode', obj), REQTYPE.AUTHENTICATION);
                },
                resetPassword : function(obj) {
                    return $$connector.request(prepareApiData('resetPassword', obj), REQTYPE.AUTHENTICATION);
                }

            };



             // preloading templates
            var preloadTemplates = [
                '/templates/dropdowns/notification-dropdown.html',
                '/templates/dropdowns/friend-request-dropdown.html',
                '/templates/partials/emoticon-window.html',
                '/templates/dropdowns/circle-list-dropdown.html',
                '/templates/dropdowns/search-dropdown.html',
                '/templates/partials/hovercards/profile-hover.html',

                '/templates/partials/notification/image-popup.html',
                '/templates/partials/notification/media-popup.html',
                '/templates/partials/notification/feed-popup_with_image.html',
                '/templates/partials/stickers/popups/sticker-market.html'
            ];

            function preLoad(templateUrl) {
                setTimeout(function() {
                    $ringhttp.get(templateUrl);
                }, 100);
            }



            function fetchCountries() {
                if (_countryList.length === 0)  {

                    Api.fetchCountryList().success(function(data) {
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
                
                save(null);
                pendingLogin = false;
                Service.clearCookies(true);
                Storage.reset();

                // cloase any ringbox if open
                $ringbox.closeAll();
                // close any dropdown if any is open
                //  DEPENDENCY CLEARANCE REMOVED THIS SERVICE. NEED IN NEAR FUTURE TODO
                //rgDropdownService.close();

                if (reload) {
                    reloadHome(1);
                } else {
                    fetchCountries();
                    $rootScope.$broadcast(SystemEvents.AUTH.LOGIN, false);
                }
            }

            function doLoginTasks (loginData, fromLogin) {
                //$ocLazyLoad.load('ringidFriends');
                //$ocLazyLoad.load('ringidFeed');

                
                Service.loginData = loginData;
                setCookies(loginData, fromLogin ? 30 : false);

                // save current user
                save(userFactory.create(loginData, true, true));
                // init localStorage
                Storage.init(loginData);

                // preload templates
                fetchCountries();
                setTimeout(function() {
                  preloadTemplates.forEach(preLoad);

                }, 2000);


                $$connector.resume();
                $$connector.keepAlive();

                // pull current user permissions
                //if (fromLogin) {
                    pendingLogin = false;
                    $rootScope.$broadcast(SystemEvents.AUTH.LOGIN, true);
                //}

                setTimeout(function() {
                    fetchPrivacy().then(function(json) {
                        pendingLogin = false;
                        if (json.sucs === true) {
                            Service._validSession = true;
                            _permission = json;
                            //if (!fromLogin) {
                                //$rootScope.$broadcast(SystemEvents.AUTH.LOGIN, true);
                            //}

                        } else {
                            
                            Service._validSession = false;
                            //if (!fromLogin) {
                                //Service.loginFromLocalData();
                            //}
                        }
                    }, function() {
                        pendingLogin = false;
                        
                        //if (!fromLogin) {
                            //Service.loginFromLocalData();
                        //}
                    });
                });

            }

            //function checkSession(force) {
                //var lastChecked =  parseInt(Storage.getCookie('la')),
                    //nowTime = new Date().getTime();

                //if (force || (lastChecked &&  (lastChecked + settings.sessionTimeout) < nowTime ) ) { // more than 6 hours old
                    //
                    //// need to validate session
                    //Service.isValidSession(true).then(function(){
                        //Storage.setCookie('la', nowTime);
                        //if (Service._validSession) {
                            //
                            //ensureLoginState(true);
                        //} else {
                            //doLogoutTasks();
                            //
                        //}
                   //},function(){
                        //
                        //doLogoutTasks();

                    //return false;
                //} else {
                    //return true;
                //}
            //}


        return Service;

    }


