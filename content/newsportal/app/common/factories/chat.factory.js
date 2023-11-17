/* 
 * © Ipvision 
 */

(function() {
	'use strict';
	angular
		.module('ringid.common.chat_factory', [])
		.factory('chatFactory', chatFactory);
	
		chatFactory.$inject = ['$rootScope'];
		function chatFactory($rootScope) {
			var chatService = {};
			chatService.friendUid = '';

			chatService.prepareBroadcast = function(friendUid) {
				this.friendUid = friendUid;
				this.broadcastItem();
			};

			chatService.broadcastItem = function() {
				console.log('broadcast openchat');
				$rootScope.$broadcast('openChat');
			};
            //chatService.test = function (obj) {
            //    console.log(obj);
            //    $rootScope.$broadcast('rabbi');
            //}


			return chatService;
		}

		
})();
