;(function(global){
    	//For Main App global == window
      	//For Worker global == self
      	
		var Constants                 = CHAT_APP.Constants;

		var USER_PRESENCE             = Constants.GENERAL_CONSTANTS.USER_PRESENCE;

		var ChatPacketSender          = CHAT_APP.ChatPacketSender;
		
		var CHAT_SESSION              = CHAT_APP.CHAT_SESSION;
		var REQUEST_CACHE             = CHAT_APP.REQUEST_CACHE;
		var RESPONSE_CACHE            = CHAT_APP.RESPONSE_CACHE;
		var AUTH_SERVER_ACTIONS       = Constants.AUTH_SERVER_ACTIONS;
		var SESSION_OBJECT            = CHAT_APP.MODELS.SESSION_OBJECT;
		var CHAT_SERVER_TYPES         = CHAT_APP.Constants.CHAT_SERVER_TYPES;
		var ChatOnlinePacketSender   = CHAT_APP.ChatOnlinePacketSender;

		var ChatRequests              = CHAT_APP.ChatRequests;
		var ChatConnector             = CHAT_APP.ChatConnector;
		var Helpers                   = CHAT_APP.Helpers;
		var RequestHelpers			  = CHAT_APP.RequestHelpers;		
		var getChatBlankMessageObject = CHAT_APP.Helpers.getChatBlankMessageObject;

		var AUTH_SERVER_REQUEST_UPDATE_MAP = Constants.AUTH_SERVER_REQUEST_UPDATE_MAP;

		var responseMethodMap         = {};
    
		function getPacketProcessorInfo(actionId){
		    return responseMethodMap[actionId];
		}

		function checkForDuplicateOrSelfRequest(responseObject){

			if( !!responseObject.duplicate ) return true;
			    	
			var boxId = responseObject.fndId || responseObject.tid || responseObject.rid || 0;
			
			/* Self Request */
			if ( REQUEST_CACHE.existsForAuth(boxId, AUTH_SERVER_REQUEST_UPDATE_MAP[responseObject.actn] ) ){
				Logger.debug('warning','Self Request Response, Skipping Response', responseObject.actn, "CHAT");
				return true;
			}

			/* Duplicate Response */
			if ( RESPONSE_CACHE.existsForAuth(boxId, responseObject.actn) ){
				Logger.debug('warning','Duplicate Response, Skipping Response', responseObject.actn, "CHAT");
				return true;
			}
			
			RESPONSE_CACHE.setAuthCache(boxId, responseObject.actn, true);

			return false;

		}

		function processUpdates(responseObject) {			

			if( responseObject.rc == 1111 ){
                Logger.debug('alert','W: Auth Request Failed', responseObject, "CHAT")
                return;
            }

			if( checkForDuplicateOrSelfRequest( responseObject ) ){				
				return;
			}
            	
		    var actionId = responseObject.actn;

		    var packetProcessorInfo = getPacketProcessorInfo(actionId);

		    if( !packetProcessorInfo ){
		        Logger.debug('warning','W: Packet Processor Not Implemented. Action Id ', actionId, "CHAT");
		        return false;
		    }

		    try{
		       packetProcessorInfo.processor.call(this, responseObject);
		    }catch(e){
		       Logger.debug('alert', 'W: Exception In PACKET Procsessing.', actionId, e , "CHAT");
		    }

		    return true;

		}

    
		//PACKET TYPE(334) : RECEIVED_TAG_CHAT
		function onReceivedTagChat(responseObject){
			 /* method body */

		 	Logger.debug('debug', 'W: Received RECEIVED_TAG_CHAT', responseObject, "CHAT");		

		 	if( !!responseObject.sucs ){
			 	var boxId = responseObject.tid;
			 	var aSssionObject = CHAT_SESSION.get( boxId );

			 	if ( !aSssionObject ){
			 		
			 		aSssionObject = new SESSION_OBJECT( 
			 			boxId, GENERAL_CONSTANTS.SESSION_TYPES.TAG,
			 			responseObject.chIp, parseInt(responseObject.chRp), 0 );
			 		
			 		CHAT_SESSION.set(boxId, aSssionObject);

			 	}else{

			 		aSssionObject.update( responseObject.chIp, parseInt(responseObject.chRp), 0 );
			 	}


			 	var registerObject = ChatRequests.getTagChatTagRegisterObject(boxId);
			 	ChatConnector.request(registerObject, CHAT_SERVER_TYPES.ONLINE).then(function(){
			 		//Notify App that connection is established
			 	});

				delete responseObject.chIp
				delete responseObject.chRp;

			 	Helpers.sendAuthResponseToMainApp(responseObject);
		 	}			 	
		}

		//PACKET TYPE(335) : TAG_CHAT_UPDATE_ADD_MEMBER
		function onReceivedTagMemeberAdd(responseObject){
			 /* method body */
			
			Logger.debug('debug', 'W: Received TAG_CHAT_UPDATE_ADD_MEMBER ', responseObject, 'CHAT');

			Helpers.sendAuthResponseToMainApp(responseObject);
		}

		//PACKET TYPE(375) : RECEIVED_F2F_CHAT
		function onReceivedF2FChat(responseObject){
			 /* method body */

			Logger.debug('debug', 'W: Received RECEIVED_F2F_CHAT', responseObject, 'CHAT');

            var friendId = responseObject.fndId;			
			var boxId = friendId;
		
		 	if(responseObject.sucs === true && responseObject.psnc == USER_PRESENCE.ONLINE){ // if this sucs is false then user is not logged in with whom user is trying to chat
                
                var chatSessionObject = CHAT_SESSION.get( boxId );

			 	if ( !chatSessionObject ){
			 		
			 		chatSessionObject = new SESSION_OBJECT( boxId, GENERAL_CONSTANTS.SESSION_TYPES.FRIEND,
			 			responseObject.chIp, parseInt(responseObject.chRp), 0 
			 		);
			 		CHAT_SESSION.set(boxId, chatSessionObject);

			 	}else{

			 		chatSessionObject.update( responseObject.chIp, parseInt(responseObject.chRp), 0 );
			 	}

                var registerObject = ChatRequests.getFriendChatRegisterObject(boxId);
	 			ChatConnector.send(registerObject, CHAT_SERVER_TYPES.ONLINE);

            }
            else{ // when responseObject.sucs !== true

                // if the user isn't logged in with whom user is trying to chat
                if(responseObject.rc == 1){                    
                    // this is the case where user is blocked(either by him or by friend), permission is denied                   
                }else{
                                       
                    if( responseObject.psnc == USER_PRESENCE.OFFLINE || responseObject.psnc == USER_PRESENCE.AWAY ){

                        var requestObject = getChatBlankMessageObject(boxId);
                        ChatConnector.request(requestObject, CHAT_SERVER_TYPES.OFFLINE).then(function(response){
                        	if(!response.sucs){
                        		
                        		var response = {sucs: false, packetId : response.packetId,
	                        		 sendState: CHAT_STATES.MESSAGE_SENDING.OFFLINE_FAILED, 
	                        		 packetType : requestObject.packetType  
                        		};

                        	}
                        });
                    }

                    RequestHelpers.sendTemporaryMessages(boxId, true);
                }
            }
		 
			delete responseObject.chIp
			delete responseObject.chRp;

			Helpers.sendAuthResponseToMainApp(responseObject);

		}
 

		//PACKET TYPE(175) : START_F2F_CHAT
		function onReceivedStartF2FChat(responseObject){
			/* method body */

			Logger.debug('debug', 'W: Received START_F2F_CHAT', responseObject, 'CHAT');

			onReceivedF2FChat( responseObject );
		}

		//PACKET TYPE(134) : START_TAG_CHAT
		function onReceivedStartTagChat(responseObject){
			
			Logger.debug('debug', 'W: Received Auth START_TAG_CHAT', responseObject, 'CHAT');

		 	onReceivedTagChat( responseObject )

		}

		//PACKET TYPE(199) : GET_USER_MOOD_PRESENCE
		function onReceivedFriendMoodPresence(responseObject){
			
			Logger.debug('debug', 'W: Received Auth USER_MOOD_PRESENCE', responseObject, 'CHAT');

			Helpers.sendAuthResponseToMainApp(responseObject);

		}

		

		
		//PACKET TYPE(175) : START_F2F_CHAT
		responseMethodMap[AUTH_SERVER_ACTIONS.START_F2F_CHAT] = {
		    processor : onReceivedStartF2FChat
		};

		//PACKET TYPE(199) : GET_USER_MOOD_PRESENCE
		responseMethodMap[AUTH_SERVER_ACTIONS.GET_USER_MOOD_PRESENCE] = {
		    processor : onReceivedFriendMoodPresence
		};

		//PACKET TYPE(134) : START_TAG_CHAT
		responseMethodMap[AUTH_SERVER_ACTIONS.START_TAG_CHAT] = {
		    processor : onReceivedStartTagChat
		};


		//PACKET TYPE(334) : RECEIVED_TAG_CHAT
		responseMethodMap[AUTH_SERVER_ACTIONS.RECEIVED_TAG_CHAT] = {
		    processor : onReceivedTagChat
		};

		//PACKET TYPE(335) : TAG_CHAT_UPDATE_ADD_MEMBER
		responseMethodMap[AUTH_SERVER_ACTIONS.ADD_TAG_CHAT_MEMBERS] = {
		    processor : onReceivedTagMemeberAdd
		};

		//PACKET TYPE(375) : RECEIVED_F2F_CHAT
		responseMethodMap[AUTH_SERVER_ACTIONS.RECEIVED_F2F_CHAT] = {
		    processor : onReceivedF2FChat
		};
	

		global.CHAT_APP['AuthResponses'] = {
		    processUpdates : processUpdates
		};

})(window);
