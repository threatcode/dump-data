/*
 * © Ipvision
 */

angular
    .module('ringid.social')
    .factory('socialShared', ['$q', '$window', 'socialConfig', 'Storage', function($q, $window, socialConfig, Storage) {

        var socialShared = {};

        var tokenName = socialConfig.tokenPrefix ? [socialConfig.tokenPrefix, socialConfig.tokenName].join('_') : socialConfig.tokenName;

        socialShared.getToken = function() {
            return Storage.getData(tokenName);
        };

        socialShared.getPayload = function() {
            var token = Storage.getData(tokenName);

            if (token && token.split('.').length === 3) {
                try {
                    var base64Url = token.split('.')[1];
                    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
                } catch(e) {
                    return undefined;
                }
            }
        };

        socialShared.setToken = function(response) {
            if (!response) {
            }

            var accessToken = response && response.access_token;
            var token;

            if (accessToken) {
                if (angular.isObject(accessToken) && angular.isObject(accessToken.data)) {
                    response = accessToken;
                } else if (angular.isString(accessToken)) {
                    token = accessToken;
                }
            }

            if (!token && response) {
                var tokenRootData = socialConfig.tokenRoot && socialConfig.tokenRoot.split('.').reduce(function(o, x) { return o[x]; }, response.data);
                token = tokenRootData ? tokenRootData[socialConfig.tokenName] : response.data[socialConfig.tokenName];
            }

            if (!token) {
                var tokenPath = socialConfig.tokenRoot ? socialConfig.tokenRoot + '.' + socialConfig.tokenName : socialConfig.tokenName;
            }

            Storage.setData(tokenName, token);
        };

        //socialShared.removeToken = function() {
            //Storage.removeData(tokenName);
        //};

        /**
         * @returns {boolean}
         */
        socialShared.isAuthenticated = function() {
            var token = Storage.getData(tokenName);

            // A token is present
            if (token) {
                // Token with a valid JWT format XXX.YYY.ZZZ
                if (token.split('.').length === 3) {
                // Could be a valid JWT or an access token with the same format
                    try {
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        var exp = JSON.parse($window.atob(base64)).exp;
                        // JWT with an optonal expiration claims
                        if (exp) {
                            var isExpired = Math.round(new Date().getTime() / 1000) >= exp;
                            if (isExpired) {
                                // FAIL: Expired token
                                Storage.removeData(tokenName);
                                return false;
                            } else {
                                // PASS: Non-expired token
                                return true;
                            }
                        }
                    } catch(e) {
                    // PASS: Non-JWT token that looks like JWT
                        return true;
                    }
                }
                // PASS: All other tokens
                return true;
            }
                // FAIL: No token at all
            return false;
        };

        socialShared.logout = function() {
            Storage.removeData(tokenName);
            return $q.when();
        };

        //socialShared.setStorageType = function(type) {
            //socialConfig.StorageType = type;
        //};

        return socialShared;
    }]);

