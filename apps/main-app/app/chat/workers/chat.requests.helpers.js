;(function(CHAT_APP){

	var ChatRequests              = CHAT_APP.ChatRequests;
	var Constants                 = CHAT_APP.Constants;

    var CHAT_PACKET_INFO          = CHAT_APP.PacketFormats.CHAT_PACKET_INFO;
	
	var CHAT_STATES               = Constants.CHAT_STATES;
	var CHAT_STATE_INFO           = Constants.CHAT_STATE_INFO;

	var TEMPORARY_MESSAGES_CACHE  = CHAT_APP.TEMPORARY_MESSAGES_CACHE;

	var ChatConnector             = CHAT_APP.ChatConnector;

	var ChatOnlinePacketSender   = CHAT_APP.ChatOnlinePacketSender;

	var isTagChatPacket           = ChatOnlinePacketSender.isTagChatPacket;
	var logSendMessageStateChange = ChatOnlinePacketSender.logSendMessageStateChange;

    var Helpers                     = CHAT_APP.Helpers;
    var sendChatRequestResponseToMainApp = Helpers.sendChatRequestResponseToMainApp;



	/************************  Command Helpers  ********************/
	
    function _makeTemporaryMessagesToFailed(boxId, deleteCache){



        var tempMessages = TEMPORARY_MESSAGES_CACHE.get(boxId);
        if( !!tempMessages && tempMessages.length > 0){
            tempMessages.forEach(function(aMessage){

                var response = {sucs: false, packetId : aMessage.packetId, sendState: CHAT_STATES.MESSAGE_SENDING.OFFLINE_FAILED, packetType : aMessage.packetType  };
                

                if( !!aMessage.friendId ){
                    response['friendId'] = aMessage.friendId;
                }

                if( !!aMessage.tagId ){
                    response['tagId'] = aMessage.friendId;   
                }

                aMessage.resolver( response );
                sendChatRequestResponseToMainApp( response );

            });
            
            if( deleteCache ){
                TEMPORARY_MESSAGES_CACHE.delete(boxId);    
            }
            

        }
    }


	
	function _sendTemporaryMessages(boxId, sendOffline){
        // Needs to port from Main App
        var tempMessages = TEMPORARY_MESSAGES_CACHE.get(boxId);
        if( !!tempMessages && tempMessages.length > 0){
            tempMessages.forEach(function(aMessage){
                
                var previousState = aMessage.sendState;
                var isTagChat = isTagChatPacket( aMessage );

                switch ( aMessage.sendState ){

                    case CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REFRESH:

                        if( isTagChat ){
                            aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.SECOND_ONLINE;

                        }else{

                            if( sendOffline ){
                                aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE;
                            }else{
                                aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.THIRD_ONLINE;
                            }
                        }
                        
                        ChatConnector.request( aMessage, CHAT_SERVER_TYPES.ONLINE ).then(function(response){
                            aMessage.resolver(response);
                        });

                        break;

                    case CHAT_STATES.MESSAGE_SENDING.ONLINE_IP_PORT_REQUEST:

                        if( isTagChat || !sendOffline) {
                            aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_ONLINE;
                            ChatConnector.request( aMessage, CHAT_SERVER_TYPES.ONLINE ).then(function(response){
                                aMessage.resolver(response);
                            });

                        }else{
                            aMessage.sendState = CHAT_STATES.MESSAGE_SENDING.FIRST_OFFLINE;
                            ChatConnector.request( aMessage, CHAT_SERVER_TYPES.OFFLINE ).then(function(response){
                                aMessage.resolver(response);
                            });
                        }

                        break;
                }

                logSendMessageStateChange(aMessage.sendState, aMessage, previousState);

            });
            
            TEMPORARY_MESSAGES_CACHE.delete(boxId);
        }

    }



	
	CHAT_APP['RequestHelpers'] = {
				
        sendTemporaryMessages : _sendTemporaryMessages,
        makeTemporaryMessagesToFailed : _makeTemporaryMessagesToFailed,

	}

})(CHAT_APP);