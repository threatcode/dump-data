/*
 * © Ipvision
 */

(function() {
	'use strict';

	angular
		.module('ringid.common.auth_factory',[
            'ngStorage',
			'ngCookies',
            'ringid.profile.http_service',
            'ringid.common.user_factory',
			'ringid.connector'
        ])
		.factory('authFactory', authFactory);

		authFactory.$inject = ['settings', '$timeout', '$window', '$localStorage', 'userFactory', 'userLoginFactory','$$connector','OPERATION_TYPES','Ringalert'];
		function authFactory(settings, $timeout, $window, $localStorage,userFactory, userLoginFactory,$$connector,OPERATION_TYPES,Ringalert) {
			var auth = {}, currentUser, isLoggedIn = false;

			var delete_cookie = function(name) {
				document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			};

			if ($localStorage.loginData) {
				currentUser = userFactory.create($localStorage.loginData, true, true);
			}

			auth.getCurrentUser = function() {
				return currentUser;
			};
			var clearCookies = function(){
				delete $localStorage.loginData;
				delete_cookie('uId');
				delete_cookie('sId');
				delete_cookie('sessionID');
				delete_cookie('la'); // last checked for login
				//console.log($cookies);
			};

			function redirectToLogin(){
				$timeout(function () {
					$window.location.href = settings.baseUrl+'?rand='+ (new Date().getTime());
				}, 1000);
			}

			auth.logout = function(force) {
				clearCookies();
				if(!!force){
					redirectToLogin();return;
				}
				userLoginFactory.logout().then(function(data) {
					redirectToLogin();
				});
			};

			auth.isLoggedIn = function() {
				return isLoggedIn;
			};

			auth.isValidSession = function(){
					return userLoginFactory.isValidSession(currentUser.getUtId());
			};

			$$connector.subscribe(function(json){
				clearCookies();
				Ringalert.show(json,'error');
				redirectToLogin();
			},{
				key : 'auth',
				action : OPERATION_TYPES.SYSTEM.TYPE_INVALID_LOGIN_SESSION
			});



			return auth;
		}


})();


