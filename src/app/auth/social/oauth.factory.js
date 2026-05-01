/*
 * © Ipvision
 */


angular
    .module('ringid.social')
    .factory('socialOauth', socialOauth)
    .factory('socialOauth1', socialOauth1)
    .factory('socialOauth2', socialOauth2);

    socialOauth.$inject = ['socialConfig',  'socialOauth1', 'socialOauth2'];
    function socialOauth(socialConfig, socialOauth1, socialOauth2) { //jshint ignore:line
        var Oauth = {};

        Oauth.authenticate = function(name, credentials) {
            var provider = socialConfig.providers[name].type === '1.0' ? new socialOauth1() : new socialOauth2();
            return provider.open(socialConfig.providers[name], credentials);
        };

        return Oauth;
    }


    socialOauth2.$inject = ['$$q', '$window', 'socialUtils','socialConfig','Storage', 'socialPopup', '$ringhttp'];

    function socialOauth2($q, $window, utils, config, Storage, socialPopup, $ringhttp) { //jshint ignore:line

        return function() {
            function buildQueryString () {
                var keyValuePairs = [];
                var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

                angular.forEach(urlParams, function(params) {

                    angular.forEach(defaults[params], function(paramName) {
                        var camelizedName = utils.camelCase(paramName);
                        var paramValue = angular.isFunction(defaults[paramName]) ? defaults[paramName]() : defaults[camelizedName];
                        keyValuePairs.push([paramName, paramValue]);
                    });
                });

                return keyValuePairs.map(function(pair) {
                    return pair.join('=');
                }).join('&');
            }

            var Oauth2 = {};

            var defaults = {
                defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
                responseType: 'token', // code or token or both
                responseParams: {
                    token: 'token',
                    //code: 'code',
                    clientId: 'clientId',
                    redirectUri: 'redirectUri'
                }
            };

            Oauth2.open = function(options, whatFor) {
                var defer = $q.defer();

                //defaults = utils.merge(options, defaults);
                defaults = angular.extend({}, options, defaults);

                var url;
                var openPopup;
                var stateName = defaults.name + '_state';

                if (angular.isFunction(defaults.state)) {
                  Storage.setData(stateName, defaults.state());
                } else if (angular.isString(defaults.state)) {
                  Storage.setData(stateName, defaults.state);
                }

                url = [defaults.authorizationEndpoint, buildQueryString(whatFor)].join('?');
                RingLogger.information('authorization url: ' + url, RingLogger.tags.AUTH);


                openPopup = socialPopup.open(url, defaults.name, defaults.popupOptions, defaults.redirectUri);
                                //pollPopup();

                var interval = setInterval(function() {
                    if (openPopup.popupWindow.closed) {
                        clearInterval(interval);
                        defer.reject({sucs: false, mg: 'Popup Closed unexpectedly!'});
                    }
                }, 1000);

                openPopup.pollPopup().then(function(authData) {
                    clearInterval(interval);
                    $ringhttp.get('https://graph.facebook.com/me' + '?access_token=' + authData.access_token)
                    .success(function(userData) {
                        RingLogger.information('SOCIAL USER DATA: ', RingLogger.tags.AUTH);
                        RingLogger.print(userData, RingLogger.tags.AUTH);
                        if (userData.id) {
                            defer.resolve({
                                    platform: defaults.name,
                                    id: userData.id,
                                    name: userData.name,
                                    access_token: authData.access_token
                            });
                        } else {
                            defer.reject();
                        }
                    })
                    .error(function() {
                        defer.reject();
                    });
                }, function() {
                     defer.reject({mg: 'Popup blocked by Browser. Please unblock.'});
                });

                return defer.promise;

            };


            return Oauth2;
        };
    }


    socialOauth1.$inject = ['$q', 'socialConfig','socialUtils', 'socialPopup', '$ringhttp'];
    function socialOauth1($q, socialConfig, socialUtils, socialPopup, $ringhttp) { //jshint ignore:line
        return function() {

            function exchangeForToken (data, credentials) {
                credentials.uId = credentials.uId.toString();
                var queryString = '?step=3&oauth_token=' + data.oauth_token + '&verifier=' + data.oauth_verifier +
                    ((credentials.uId && credentials.uId.length > 2) ? '&uId=' + credentials.uId : '') +
                        '&time=' + new Date().getTime();

                RingLogger.information('exhcangeForToken URL: ' + defaults.serverUrl + queryString, RingLogger.tags.AUTH);
                return $ringhttp.get(defaults.serverUrl + queryString);
                //return $ringhttp.get(defaults.serverUrl + '?step=3&oauth_token=' + data.oauth_token + '&verifier=' + data.oauth_verifier + '&time=' + new Date().getTime());
            }

            function exchangeForRequest() {
                RingLogger.information('exchangeForRequest URL: ' + defaults.serverUrl + '?step=1&callback=' + defaults.redirectUri, RingLogger.tags.AUTH);
                return $ringhttp.get(defaults.serverUrl + '?step=1&callback=' + encodeURIComponent(defaults.redirectUri) + '&time=' + Date.now());
            }

            function buildQueryString (obj) {
                var str = [];

                angular.forEach(obj, function(value, key) {
                    str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                    //str.push(key + '=' + value);
                });

                return str.join('&');
            }

            var Oauth1 = {};

            var defaults = {
                    url: null,
                    name: null,
                    popupOptions: null,
                    redirectUri: null,
                    authorizationEndpoint: null
            };

            Oauth1.open = function(options, credentials) {
                var defer = $q.defer(),
                    popupWindow;

                angular.extend(defaults, options);
                RingLogger.print(defaults, RingLogger.tags.AUTH);

                popupWindow = socialPopup.open('', defaults.name, defaults.popupOptions, defaults.redirectUri);

                var interval = setInterval(function() {
                    if (popupWindow.popupWindow.closed) {
                        clearInterval(interval);
                        defer.reject({sucs: false, mg: 'Popup Closed unexpectedly!'});
                    }
                }, 1000);

                exchangeForRequest().success(function(response) {
                    if (response.sucs === true) {
                        var tokenData = response.data;
                        var auth_url = [defaults.authorizationEndpoint, buildQueryString({'oauth_token': tokenData.token, 'callback_url': defaults.redirectUri})].join('?');
                        if (popupWindow.popupWindow) {
                            popupWindow.popupWindow.location =  auth_url;

                            RingLogger.information('TWITTER authorize url: ' + auth_url, RingLogger.tags.AUTH);
                            RingLogger.print('REQUEST TOKEN DATA: ', tokenData, RingLogger.tags.AUTH);
                            popupWindow.pollPopup().then(function(authData) {
                                clearInterval(interval);
                                exchangeForToken(authData, credentials).success(function(response) {
                                    if (response.sucs === true || response.rc === 2) {
                                        var accessData = response.data.members;
                                        RingLogger.print('ACCESS TOKEN DATA: ', authData, accessData, RingLogger.tags.AUTH);
                                        var userDetails = JSON.parse(accessData.userDetails);
                                        var accessToken = JSON.parse(accessData.accessToken);
                                            defer.resolve({
                                                platform: defaults.name,
                                                id: userDetails.id_str,
                                                name: userDetails.name,
                                                access_token: accessToken.token,
                                                oauthParameters: accessToken.oauthParameters,
                                                oauth_token: authData.oauth_token,
                                                oauth_verifier: authData.oauth_verifier
                                            });
                                    } else {
                                        defer.reject({mg: 'exchangeForRequest failed'});
                                    }
                                }).error(function() {
                                    defer.reject({mg: 'exchangeForRequest failed. Server error'});
                                });
                            });

                        } else {
                             defer.reject({mg: 'Popup blocked by Browser. Please unblock.'});
                        }

                    } else {
                        defer.reject({mg: 'exchangeForRequest failed'});
                    }

                }).error(function() {
                    RingLogger.alert('twitter oauth request token fetch fail', RingLogger.tags.AUTH);
                    defer.reject({mg: 'exchangeForRequest failed. Server error'});
                });

                return defer.promise;
            };


            return Oauth1;
        };
    }

