    angular
        .module('ringid.chat')
        .factory('ChatSeenSend', ChatSeenSend);

    ChatSeenSend.$inject = ['ChatWorkerCommands','ChatFactory', 'chatHistoryFactory','Utils', 'Auth',
                            'tagChatFactory', 'tagChatManager', 'ChatHelper', 'tagChatHelper', '$q',
                            'ChatUtilsFactory', 'ChatConnector'];

    function ChatSeenSend ( ChatWorkerCommands, ChatFactory, chatHistoryFactory, Utils, Auth,
                            tagChatFactory, tagChatManager, ChatHelper, tagChatHelper, $q,
                            ChatUtilsFactory, ChatConnector
    ) {


        var Constants = CHAT_APP.Constants;
        var ChatRequests = CHAT_APP.ChatRequests;
        var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES;
        var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
        var TAG_CHAT_PACKET_TYPE = Constants.TAG_CHAT_PACKET_TYPE;
        var FRIEND_CHAT_PACKET_TYPE = Constants.FRIEND_CHAT_PACKET_TYPE;
        var USER_PRESENCE = GENERAL_CONSTANTS.USER_PRESENCE;

        var MESSAGE_STATUS_VALUE = GENERAL_CONSTANTS.MESSAGE_STATUS_VALUE;

        var SharedHelpers = CHAT_APP.SharedHelpers;

        ///////////////////

        var _sendFriendChatSeenPackets = function( boxId, seenPartialMsgObjects, defer ){

            var requestObject = ChatRequests.getFriendChatSeenObject(boxId, seenPartialMsgObjects)
            requestObject.brokenPacketType = FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN;

            var messageDate = SharedHelpers.getChatServerCurrentTime();

            for(var index = 0; index < seenPartialMsgObjects.length; index++){
                requestObject.messages[index]['packetId'] = seenPartialMsgObjects[index].key;
                requestObject.messages[index]['messageDate'] = messageDate;
                requestObject.messages[index]['status'] = getStatusByMessageType(seenPartialMsgObjects[index].messageType);
            }

            ChatConnector.request(requestObject).then(function(response){
                if(!!response.sucs){
                    
                    _updateMessageSeenSentProperty(boxId, seenPartialMsgObjects);
                    defer.resolve('success');
                }

            }, function(){
                
                defer.reject('failed');
            })

        };

        var _sendSeenPacket = function (box, messages){
            if(messages.length <1){
                return;
            }

            var defer = $q.defer();

            //todo store messages reference
            var seenPartialMsgObjects = getSeenPartialMsgObjects(messages);

            var  boxId = box.getKey();

            var requestObject;
            if(box.isTagChat){
                sendTagChatSeenPackets(boxId, seenPartialMsgObjects);
                return defer.resolve({sucs: true})

            }else{
                _sendFriendChatSeenPackets(boxId, seenPartialMsgObjects, defer)
            }

            return defer.promise;

        };

        var _updateMessageSeenSentProperty = function (boxId, seenPartialMsgObjects) {
            var box = ChatFactory.getBoxByUId(boxId);
            var messagesToUpdate = [];
            for(var index = 0; index < seenPartialMsgObjects.length; index++){
                if( !!box){
                    var aMessage = box.getMessage(seenPartialMsgObjects[index].key);
                    if(!!aMessage){
                        aMessage.seenSent = true;
                        aMessage.status = 'Received';
                        messagesToUpdate.push(aMessage);
                    }

                }
            }

            chatHistoryFactory.updateMessages(messagesToUpdate, boxId);

        };

        var sendTagChatSeenPackets = function(tagId, seenPartialMsgObjects){
            var tagObject = tagChatFactory.getTag(tagId);
            var currentUserId = Auth.loginData.uId;
            if(!!tagObject){
                for(var index =0; index < seenPartialMsgObjects.length; index++){
                    var packetId = seenPartialMsgObjects[index].key;
                    var friendId = seenPartialMsgObjects[index].senderId;

                    var requestObject = ChatRequests.getTagChatSeenObject(friendId, tagId, packetId);
                    ChatConnector.send(requestObject);

                }

                _updateMessageSeenSentProperty(tagId,seenPartialMsgObjects);

            }else{

                
            }
        };




        var getSeenPartialMsgObjects = function (messages){
            var seenPartialMsgObjects = [];
            for(var index = 0; index < messages.length; index++){
                seenPartialMsgObjects.push({
                    key: messages[index].key,
                    messageType: messages[index].value.messageType,
                    senderId : messages[index].value.user.getKey()
                });
            }
            return seenPartialMsgObjects;
        };

        var getStatusByMessageType = function(messageType){
            var messageStatus = 0;
            switch (messageType){
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    messageStatus = GENERAL_CONSTANTS.MESSAGE_STATUS.SEEN;
                    break;
                case 7:
                case 8:
                case 9:
                case 10:
                    messageStatus = GENERAL_CONSTANTS.MESSAGE_STATUS.VIEWED;
                    break;
            }
            return messageStatus;
        };


        return {
            sendSeenPacket : _sendSeenPacket
        };

    }
