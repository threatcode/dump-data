


    angular
        .module('ringid.chat')
        .service('ChatPacketSenderService', ChatPacketSenderService);

    ChatPacketSenderService.$inject = ['Auth', 'Utils',
        'ChatFactory',
        'tagChatFactory',
        "ChatUtilsFactory",
        "$q",
        "chatHistoryFactory", "chatTabSync", "ChatConnector", "ChatWorkerCommands", "SystemEvents"

    ];
    function ChatPacketSenderService (Auth, Utils,
                               ChatFactory,
                               tagChatFactory,
                               ChatUtilsFactory,
                               $q,
                               chatHistoryFactory, chatTabSync, ChatConnector, ChatWorkerCommands, SystemEvents

    ) {

        var self = this;

        var Constants = CHAT_APP.Constants;
        var SharedHelpers = CHAT_APP.SharedHelpers;
        var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
        var TAG_CHAT_PACKET_TYPE = Constants.TAG_CHAT_PACKET_TYPE;
        var FRIEND_CHAT_PACKET_TYPE = Constants.FRIEND_CHAT_PACKET_TYPE;
        var OFFLINE_PACKET_TYPE = Constants.OFFLINE_PACKET_TYPE;
        var CHAT_STATES = Constants.CHAT_STATES;

        var PLATFORM = Constants.PLATFORM;
        var SESSION_TYPES = GENERAL_CONSTANTS.SESSION_TYPES;


        var getUUIDPacketId = CHAT_APP.UTILS.getUUIDPacketId;


        var processMsgForLinkShare = function(msgObj, ogData){
            if(!!ogData && !!ogData.url){
                var plainText = msgObj.message;

                var jsonMessage = {
                    u : ogData.url,
                    d: ogData.description,
                    t: ogData.title,
                    i: ogData.image,
                    m : plainText
                };

                msgObj.message = angular.toJson(jsonMessage);

            }
            return msgObj;
        };

        var processMsgForLocationShare = function(msgObj, locationData){
            if( !!locationData && !!locationData.lat){

                msgObj.la = locationData.lat; // PacketDataParse.Float32ToInt();
                msgObj.lo = locationData.lng; //PacketDataParse.Float32ToInt();
                msgObj.loc = locationData.description;

                var jsonMessage = {
                    lo : msgObj.lo,
                    la : msgObj.la,
                    loc : msgObj.loc
                };

                msgObj.message = angular.toJson(jsonMessage);

            }
            return msgObj;
        };

        var processMsgForMedia = function(msgObj, mediaData){
            if( !!mediaData && !!mediaData.url){

                var jsonMessage = {
                    u : mediaData.url,
                    c : mediaData.caption,
                    w : mediaData.width,
                    h : mediaData.height
                };

                msgObj.message = angular.toJson(jsonMessage);

                msgObj.mediaUrl = mediaData.url;

                msgObj.plainText = mediaData.caption;

            }
            return msgObj;
        };

        var getMessageObject = function(box, message, messageType, messageData){
            var msgObj, keyOrPacketId,
                isEditedMessage = false,
                packetType, brokenPacketType,
                currentUser = Auth.currentUser(),
                currentUserId = Auth.currentUser().getKey(),
                messageDate = SharedHelpers.getChatServerCurrentTime(),
                isTagChat = box.isTagChat;

                // ip = box.getIp(),
                // port = box.getPort();


            if(box.editMessageKey){
                keyOrPacketId = box.editMessageKey;
                box.editMessageKey = undefined;
                messageDate = parseInt(box.editMessageDate);
                box.editMessageDate = undefined;

                isEditedMessage = true;

                if( !!isTagChat ){

                    packetType = TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG_EDIT;
                    brokenPacketType = TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG_EDIT;
                }else{

                    packetType = FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG_EDIT;
                    brokenPacketType = FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG_EDIT;
                }


            }else{
                keyOrPacketId = getUUIDPacketId(messageDate, true);

                if( !!isTagChat ){

                    packetType = TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG;
                    brokenPacketType = TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG;
                }else{

                    packetType = FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG;
                    brokenPacketType = FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG;
                }

            }

            msgObj = {
                isEdit              : isEditedMessage,
                tag_chat            : false,
                packetType          : packetType,
                brokenPacketType    : brokenPacketType,
                fullName            : currentUser.getName(),
                userId              : currentUserId,                                     // used to construct packetData for sending
                messageType         : messageType,                                      // 2 for plain text message
                messageDate         : messageDate,                                      //in second instead of millisecond, need to * with 1000 in the receiver end
                message             : message,                                          // used to construct packetData for sending
                key                 : keyOrPacketId,                                    // added "ring" later
                packetId            : keyOrPacketId,                                    // used to construct packetData for sending
                isSecretVisible     : box.isSecretVisible ? 1 : 0,
                timeout             : 0,
                platform            : PLATFORM.WEB
            };

            if( isTagChat ){//for tagChat
                var tagId = box.getKey();
                msgObj.tag_chat = true;
                msgObj.tagId = tagId;

            }else{ //for individual chat
                msgObj.friendId  = box.getUser().getKey();
                if(box.secretChat){
                    msgObj.timeout = box.timeout;
                }else{
                    msgObj.timeout = 0;
                }
            }

            return msgObj;

        };

        var messagePreSendProcess = function(msgObj, messageData){

            if( Utils.hasEmoticon(msgObj.message) ){
                msgObj.messageType = 3;
            }

            switch (msgObj.messageType){
                case GENERAL_CONSTANTS.MESSAGE_TYPES.LOCATION_SHARE:
                    processMsgForLocationShare(msgObj, messageData.locationData);
                    break;
                case GENERAL_CONSTANTS.MESSAGE_TYPES.LINK_SHARE:
                    processMsgForLinkShare(msgObj, messageData.ogData);
                    break;
                case GENERAL_CONSTANTS.MESSAGE_TYPES.IMAGE:
                case GENERAL_CONSTANTS.MESSAGE_TYPES.CAMERA_IMAGE:
                case GENERAL_CONSTANTS.MESSAGE_TYPES.VIDEO:
                    processMsgForMedia(msgObj, messageData.mediaData);
                    break;
            }

        };

        var updateBoxMessageStatus = function(box, msgObj, status){

            var boxMessageObject = box.getMessage(msgObj.packetId);
            if(!!boxMessageObject){
                boxMessageObject.status = status;

                chatHistoryFactory.updateMessage(boxMessageObject, box.getKey());
                Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_UPDATED, { boxId: box.getKey() });
            }
        };

        var pushMessageToBox = function(box, msgObj){
            var currentUser = Auth.currentUser();
            box.pushMessage(msgObj, currentUser, true);
        }

        var getSendMessageObject = function(box, message, messageType, messageData){

            var msgObj = getMessageObject(box, message, messageType, messageData);
            messagePreSendProcess(msgObj, messageData);

            return msgObj;

        }

        function _handleFailedMessageSend( response ){

            var boxId = response.boxId;
            var packetId = response.packetId;

            if( !!boxId && !!packetId){
                var box = ChatFactory.getBoxByUId( boxId );
                if( !box ){
                    var message = chatHistoryFactory.getMessage( boxId, packetId);
                    message.status = 'Failed';
                    chatHistoryFactory.updateMessage( message, boxId );
                }else{

                    updateBoxMessageStatus(box, {packetId : packetId }, 'Failed')
                }

            }else{
                RingLogger.debug('Handle Failed Message has not boxId', response, 'CHAT');
            }
        }

        var sendMessage = function(box, message, messageType, messageData){

            var messageObject = getSendMessageObject( box, message, messageType, messageData);

            doSendMessage(box, messageObject)

        };

        var doSendMessage = function(box, messageObject){

            pushMessageToBox(box, messageObject);

            messageObject.message =  messageObject.message.utf8Encode();

            setTimeout(function(){
                ChatConnector.request(messageObject).then(function(response){
                    if( !response.sucs ){
                        response.boxId = box.getKey();
                        _handleFailedMessageSend( response );
                    }
                });
            });

            return messageObject;

        };

        var retryMessage = function(box, boxMessageObject, messageData){

            if(!!boxMessageObject.tag_chat){
                boxMessageObject.tagId = box.getKey();
            }else {
                boxMessageObject.friendId = box.getKey();
            }

            var messageObject = getSendMessageObject( box, boxMessageObject.text, boxMessageObject.messageType, boxMessageObject.messageData);

            messageObject.message =  messageObject.message.utf8Encode();

            messageObject.packetId = boxMessageObject.packetId;

            messageObject.key = boxMessageObject.packetId;

            boxMessageObject.status = 'Pending';

            setTimeout(function(){
                ChatConnector.request(messageObject).then(function(response){
                    if( !response.sucs ){
                        response.boxId = box.getKey();
                        _handleFailedMessageSend( response );
                    }
                });
            });

        };

        var sendTypingPacket = function (box) {
            var requestObject;
            if(box.isTagChat){
                requestObject = CHAT_APP.ChatRequests.getTagChatTypingObject(box.getKey())
            }else{
                requestObject = CHAT_APP.ChatRequests.getFriendChatTypingObject(box.getKey())
            }

            ChatConnector.rawSend(requestObject);

        };



        var sendChatUnRegisterPacket = function(box){

            var requestObject,
                onilneStatus = 0,
                userMood = 0;
            if(box.isTagChat){
                requestObject = CHAT_APP.ChatRequests.getFriendChatUnregisterObject(box.getKey(), onilneStatus, userMood);
            }else{
                requestObject = CHAT_APP.ChatRequests.getTagChatTagUnregisterObject(box.getKey(), onilneStatus, userMood);
            }

            ChatConnector.send(requestObject);

        };

        var getMessageType = function( messageData ){
            var messageType = GENERAL_CONSTANTS.MESSAGE_TYPES.TEXT;

            if(!!messageData.locationData.lat){
                messageType =  GENERAL_CONSTANTS.MESSAGE_TYPES.LOCATION_SHARE;
            }else if(!!messageData.ogData.url){
                messageType =  GENERAL_CONSTANTS.MESSAGE_TYPES.LINK_SHARE;
            }

            return messageType;
        }


        self.sendMessage = sendMessage;
        self.retryMessage = retryMessage;

        self.sendTypingPacket = sendTypingPacket;
        self.sendChatUnRegisterPacket = sendChatUnRegisterPacket;

        self.getSendMessageObject = getSendMessageObject;

        self.pushMessageToBox = pushMessageToBox;

        self.getMessageType = getMessageType;
        self.doSendMessage = doSendMessage;

    }
