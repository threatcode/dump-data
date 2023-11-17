;(function(CHAT_APP){

	var ChatRequests              = CHAT_APP.ChatRequests;
	var Constants                 = CHAT_APP.Constants;
	
	var GENERAL_CONSTANTS         = Constants.GENERAL_CONSTANTS;
	var MESSAGE_TYPES             = Constants.GENERAL_CONSTANTS.MESSAGE_TYPES;
	var CHAT_GLOBAL_VALUES        = Constants.CHAT_GLOBAL_VALUES;
	var OFFLINE_PACKET_TYPE_START = Constants.PACKET_CONSTANTS.OFFLINE_PACKET_TYPE_START;

	var getUUIDPacketId           = CHAT_APP.UTILS.getUUIDPacketId;

	var SESSION_OBJECT            = CHAT_APP.MODELS.SESSION_OBJECT;

	var CHAT_SESSION              = CHAT_APP.CHAT_SESSION;

	var TEMPORARY_MESSAGES_CACHE  = CHAT_APP.TEMPORARY_MESSAGES_CACHE;
    	var TAGS                     = CHAT_APP.TAGS;

	var ChatOnlinePacketSender    = CHAT_APP.ChatOnlinePacketSender;	

	/************************  Command Helpers  ********************/

	function _sendToMainApp(type, data){
		postMessage({
	        object: data,
	        notifier : type
	    });
	}

	function _sendAuthResponseToMainApp(data){
		_sendToMainApp(WORKER_NOTIFIER_TYPES.AUTH_DATA_RECEIVED, data);
	}

	function _sendChatResponseToMainApp(data){
		_sendToMainApp(WORKER_NOTIFIER_TYPES.CHAT_DATA_RECEIVED, data);
	}

	function _sendChatExceptionResponseToMainApp(data){
		_sendToMainApp(WORKER_NOTIFIER_TYPES.EXCEPTION, data);	
	}

	function _sendChatRequestResponseToMainApp(data){
		_sendToMainApp(WORKER_NOTIFIER_TYPES.CHAT_REQUEST_RESPONSE, data);		
	}

    function _sendChatTimerUpdateToMainApp(data){
		_sendToMainApp(WORKER_NOTIFIER_TYPES.CHAT_TIMER_UPDATE, data);		
	}

	function _sendIdlePacketByType( boxId, type){

		if( type == GENERAL_CONSTANTS.SESSION_TYPES.FRIEND ){
			requestMethod = ChatRequests.getFriendChatIdleObject;

		}else if( type == GENERAL_CONSTANTS.SESSION_TYPES.TAG ){
            requestMethod = ChatRequests.getTagChatIdleObject;
        }
                    
        var requestObject = requestMethod.call(null, boxId);
        ChatOnlinePacketSender.rawSend(requestObject, boxId);
	}


	function _doRequestForTagInformationWithMember(tagId){
		
		var requestObject = ChatRequests.getOfflineGetTagInformationWithMembersObject( tagId );
      	
      	// Logger.debug('information', requestObject, 'CHAT');
      	
      	return ChatConnector.request(requestObject, CHAT_SERVER_TYPES.OFFLINE);
	}

	function _startChatSession(boxId, type, uIds, force ){

		var returnPromise = new Promise(function(resolve, reject ){
			
			if( !force && CHAT_SESSION.valid(boxId) ){
				Logger.debug('debug', 'Has Valid Session. Skipping Chat Session Request for ', boxId, 'CHAT');
				return;
			}

			var requestObject;         
	        if( type == GENERAL_CONSTANTS.SESSION_TYPES.FRIEND){
	            requestObject = AuthRequests.getFriendChatRegisterIpPort(boxId);    
	        }else{
	            requestObject = AuthRequests.getTagChatRegisterIpPort(boxId, uIds)
	        }  

	        AuthConnector.request( requestObject ).then(function(response){
	        	if( !response.sucs && response.rc == 1111){
	        		RequestHelpers.makeTemporaryMessagesToFailed( boxId, true );	
	        	}else{
	        		AuthResponses.processUpdates(response);
	        	}

	        	resolve(response);
	        	
	        });			
		});
		
		return returnPromise;

	}

	function _endChatSession(boxId, type){
		ChatSession.unRegister(boxId); 
	}


	function _doChatHistoryMessageRequest(boxId, pageDirection, limit, type, packetId){
		
		var requestObject, requestMethod;

		if( type == GENERAL_CONSTANTS.REQUEST_TYPES.FRIEND ){
			requestMethod = ChatRequests.getOfflineFriendHistoryMessageRequestObject;
		}else{
			requestMethod = ChatRequests.getOfflineTagHistoryMessageRequestObject;
		}

		var requestObject = requestMethod.call(null, 
            boxId, 
            pageDirection || GENERAL_CONSTANTS.PAGE_DIRECTION.UP,
            limit         || GENERAL_CONSTANTS.PAGE_LIMIT,
            packetId      || getUUIDPacketId()
          );

        return ChatConnector.request( requestObject, 5, CHAT_SERVER_TYPES.OFFLINE );
	}

	function __reFetchMemberCountZeroTags(){
		var allTagIdToUpdate = TAGS.getTagIdsToUpdate();
		
		allTagIdToUpdate.forEach(function(aTagId){
			var requestObject = ChatRequests.getOfflineGetTagInformationWithMembersObject(aTagId);
			ChatConnector.send(requestObject);
		});

		return allTagIdToUpdate.length;
	}

	function __fetchAllTagsUntilMaxRetry(){
		var retryCount = GENERAL_CONSTANTS.MAX_TASK_RETRY_COUNT;

		var intervalKey = setInterval(function(){

			var updateLength = __reFetchMemberCountZeroTags();
			Logger.debug('debug', updateLength + " tags to fetch more", 'CHAT');
			retryCount--;

			if( !updateLength || !retryCount ){
				clearInterval(intervalKey);
			}

		}, 10000)
		
	}

    	function __fetchHistoryMessageStatus(){
        
       		var retryCount = GENERAL_CONSTANTS.MAX_TASK_RETRY_COUNT;
		var intervalKey = setInterval(function(){
		
		}, 30000);
    	}
    

	function _startValidityTasks(){
        
        __fetchAllTagsUntilMaxRetry();
		
    }

	/******************  Data Helpers  *******************/

	function _getBoxId( object ){
		return object.boxId || object.friendId || object.tagId;
	}



	function _getChatBlankMessageObject(friendId){
		
		var messageDate = SharedHelpers.getChatServerCurrentTime();
		var packetId = getUUIDPacketId(messageDate)
		
		/* friendId, messageType, 
			timeout, message, messageDate, isSecretVisible, packetId) 
		*/		
		var requestObject = ChatRequests.getFriendChatMsgObject(friendId, MESSAGE_TYPES.BLANK_MESSAGE, 
			0, ' ', messageDate, false, packetId);
                
                requestObject.isBroken = false;
		
                return requestObject;

	}

	function _getChatSessionObject(boxId, type, ip, port, bindingPort){

		var sessionObject = new SESSION_OBJECT(boxId, type, ip, port, bindingPort)
		return sessionObject;
	}	

	function _injectRegisterIpPortToRequestObject( requestObject ){
		var sessionObject = CHAT_SESSION.get(requestObject.tid);
		if( !!sessionObject ){
			
			requestObject.chIp = sessionObject.ip;
			requestObject.chRp = sessionObject.registerPort;

		}else{

			delete requestObject.chIp;
			delete requestObject.chRp;

		}
		return requestObject;
	}


	var _getUnreadMessagesMultipleTimes = function(){
			
		var offlineUpdateTime = CHAT_GLOBAL_VALUES.offlineUpdateTime;
		var requestServerTime = SharedHelpers.getChatServerCurrentTime();

		var requestObject = CHAT_APP.ChatRequests.getOfflineGetRequestObject(offlineUpdateTime, 0);
		ChatConnector.request(requestObject).then(function(response){
			if( !!response.sucs ){
				CHAT_GLOBAL_VALUES.offlineUpdateTime = requestServerTime;
			}
		});

	};


	

	/*************************  Decision Helpers ***************************/

	function _isOfflineServerPacket(packetType){
	    if( packetType < OFFLINE_PACKET_TYPE_START ){
	        return false;
	    }
	    return true;   
	}

	
	CHAT_APP['Helpers'] = {
		
		// Command Helpers 
		sendToMainApp                        : _sendToMainApp,
		sendAuthResponseToMainApp            : _sendAuthResponseToMainApp,
		sendChatResponseToMainApp            : _sendChatResponseToMainApp,
		sendChatExceptionResponseToMainApp   : _sendChatExceptionResponseToMainApp,
		sendChatRequestResponseToMainApp     : _sendChatRequestResponseToMainApp,
        sendChatTimerUpdateToMainApp         : _sendChatTimerUpdateToMainApp, 
		doRequestForTagInformationWithMember : _doRequestForTagInformationWithMember,
		
		sendIdlePacketByType                 : _sendIdlePacketByType,
		doChatHistoryMessageRequest	   	     : _doChatHistoryMessageRequest,

		startChatSession                     : _startChatSession,
		endChatSession                       : _endChatSession,

		startValidityTasks					 : _startValidityTasks,

		getUnreadMessagesMultipleTimes		 : _getUnreadMessagesMultipleTimes,

		// Decision Helpers 	
		isOfflineServerPacket                : _isOfflineServerPacket,

		// Data Helpers 
		getBoxId 							 : _getBoxId,
		getChatBlankMessageObject            : _getChatBlankMessageObject,
		isOfflineServerPacket                : _isOfflineServerPacket,
		getChatSessionObject                 : _getChatSessionObject,

		injectRegisterIpPortToRequestObject : _injectRegisterIpPortToRequestObject,
		


	}

})(CHAT_APP);
