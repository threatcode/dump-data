/*
 * © Ipvision
 */

	angular
		.module('ringid.chat')
		.controller('TagChatDebugInfoController', TagChatDebugInfoController);

	TagChatDebugInfoController.$inject = [
			'$scope', '$boxInstance',
			'Auth', 'ChatFactory',
			'tagChatFactory', 'tagChatManager', 'friendsFactory',
			'localData', 'Ringalert', 'Utils', 'settings',
			'profileFactory'
		];

		function TagChatDebugInfoController(
			$scope, $boxInstance,
			Auth, ChatFactory,
			tagChatFactory, tagChatManager, friendsFactory,
			localData, Ringalert, Utils, settings,
			profileFactory
		) {

			var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;

			$scope.currentUserUId = Auth.currentUser().getKey();

			$scope.registerTag = registerTag;
			$scope.unregisterTag = unregisterTag;


			if (localData && localData.tagId) {

				//get tag data
				$scope.tag = tagChatFactory.getTag(localData.tagId);


				//set Debug Infos Start

				$scope.tagDebugInfo = {};
				$scope.tagDebugInfo.isTagRegistered = tagChatFactory.isTagRegistered(localData.tagId);
				$scope.chatBox = ChatFactory.getBoxByUId(localData.tagId);

			}

			function cancel() {
				$boxInstance.close();
			}

			function registerTag(){
				tagChatManager.registerTag($scope.tag.getTagId());
			}

			function unregisterTag(){
				// tagChatApiService.unRegisterFromChatServer($scope.tag);
			}



		}

