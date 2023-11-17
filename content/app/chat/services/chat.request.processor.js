
	angular
		.module('ringid.chat')
		.factory('chatRequestProcessor', chatRequestProcessor);

	chatRequestProcessor.$inject = [
		 	'$$connector', '$q', '$timeout',
			'Auth',
			'tagChatFactory',
			'tagChatUI', 'tagChatHelper',
			'ChatFactory', 'chatHistoryFactory',
			'userFactory', 'Utils', 'profileFactory', 'tagChatStorage',
			'OPERATION_TYPES' ,'Ringalert',
			'CHAT_LANG',
			'ChatUtilsFactory', 'ChatConnector' ];

	function chatRequestProcessor (

			 $$connector, $q, $timeout,
			 Auth,
			 tagChatFactory,
			 tagChatUI, tagChatHelper,
			 ChatFactory, chatHistoryFactory,
			 userFactory, Utils, profileFactory, tagChatStorage,
			 OPERATION_TYPES, Ringalert,
			 CHAT_LANG,
			 ChatUtilsFactory, ChatConnector
	) {

		var CHAT_APP 		   = window.CHAT_APP;
		var Constants          = CHAT_APP.Constants;

		var GENERAL_CONSTANTS  = Constants.GENERAL_CONSTANTS;
		var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES;
		var ChatRequests       = CHAT_APP.ChatRequests;
		var SharedHelpers	   = CHAT_APP.SharedHelpers;
		var TAG_CHAT_LANG      = CHAT_LANG.TAG;



		var _getUnreadMessagesMultipleTimes = function(){

			var offlineUpdateTime = CHAT_GLOBAL_VALUES.offlineUpdateTime;
			var requestServerTime = SharedHelpers.getChatServerCurrentTime();

			var requestObject = ChatRequests.getOfflineGetRequestObject(offlineUpdateTime, 0);
			ChatConnector.request(requestObject).then(function(response){
				if( !!response.sucs ){
					CHAT_GLOBAL_VALUES.offlineUpdateTime = requestServerTime;
				}
			});

		};


		var _getTagHistoryMessagesMultipleTimes = function(tagId, pageDirection, packetId, limit){


			packetId =  packetId || CHAT_APP.UTILS.getUUIDPacketId();
			limit = limit || 10;

			var requestObject = ChatRequests.getOfflineTagHistoryMessageRequestObject(tagId, pageDirection, limit, packetId)
			return ChatConnector.request(requestObject);

		};


		var _getFriendHistoryMessagesMultipleTimes = function(friendId, pageDirection, packetId, limit){

			packetId =  packetId || CHAT_APP.UTILS.getUUIDPacketId();
			limit = limit || 10;

			var requestObject = ChatRequests.getOfflineFriendHistoryMessageRequestObject(friendId, pageDirection, limit, packetId)
			return ChatConnector.request(requestObject);

		};


		var _sendTagUnreadMessageConfirmation = function(userId, messagePacketIds){

			var requestObject = ChatRequests.getOfflineTagUnreadMessageConfirmationObject(messagePacketIds);
			ChatConnector.send(requestObject);

		};

		var _sendFriendUnreadMessageOfflineConfirmation = function(userId, packetId, messagePacketIds){

			var requestObject = ChatRequests.getOfflineFriendUnreadMessageConfirmationObject(messagePacketIds, packetId);
			ChatConnector.send(requestObject);

		};

		var getHistoryRequestMethodByBox = function(chatBox){

			var historyRequestMethod;
			if(chatBox.isTagChat){
				historyRequestMethod = _getTagHistoryMessagesMultipleTimes
			}else{
				historyRequestMethod = _getFriendHistoryMessagesMultipleTimes
			}
			return historyRequestMethod
		};


		var _sendFriendInformation = function( friendObj ){
			var requestObject = ChatRequests.getOfflineFriendInformationObject(friendObj.getUId(), friendObj.getName(),
			friendObj.getOnlineStatus(), friendObj.getAppType() || 1, friendObj.getDeviceToken(), friendObj.getUserMood());

			ChatConnector.send( requestObject );
		}

		return {
			getUnreadMessagesMultipleTimes 	: _getUnreadMessagesMultipleTimes,
			getTagHistoryMessagesMultipleTimes : _getTagHistoryMessagesMultipleTimes,
			getFriendHistoryMessagesMultipleTimes : _getFriendHistoryMessagesMultipleTimes,
			getHistoryRequestMethodByBox : getHistoryRequestMethodByBox,
			sendTagUnreadMessageConfirmation : _sendTagUnreadMessageConfirmation,
			sendFriendUnreadMessageOfflineConfirmation : _sendFriendUnreadMessageOfflineConfirmation,

			sendFriendInformation : _sendFriendInformation,
		};

	}

