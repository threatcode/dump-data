/*
 * © Ipvision
 */


	angular
		.module('ringid.social')
		.provider('$authSocial',['socialConfig', function social(socialConfig) {
          angular.forEach(Object.keys(socialConfig.providers), function(provider) {
            this[provider] = function(params) {
              return angular.extend(socialConfig.providers[provider], params);
            };
          }, this);

          var oauth = function(params) {
            socialConfig.providers[params.name] = socialConfig.providers[params.name] || {};
            angular.extend(socialConfig.providers[params.name], params);
          };

          this.oauth1 = function(params) {
            oauth(params);
            socialConfig.providers[params.name].type = '1.0';
          };

          this.oauth2 = function(params) {
            oauth(params);
            socialConfig.providers[params.name].type = '2.0';
          };

          this.$get = [
            '$$q',
            'socialOauth',
            function($q, oauth) {
                var $authSocial = {};

                $authSocial.login = function(platform) {
                    var deferred = $q.defer();
                    var authData; // = Storage.getData(platform);
                    if (authData) {
                        deferred.resolve(authData);
                    } else {
                        oauth.authenticate(platform, 'login').then(function(authData) {
                            deferred.resolve(authData);
                        }, function(err) {
                            deferred.reject(err);
                        });
                    }
                    return deferred.promise;
                };


                $authSocial.authenticate = function(platform, credentials) {
                    var defer = $q.defer();
                    oauth.authenticate(platform, credentials).then(function(authData) {
                        defer.resolve(authData);
                    }, function(err) {
                        defer.reject(err);
                    });

                    return defer.promise;
                  };

                return $authSocial;
            }];

    	}]);

