
    var chatApp;
    try {
        chatApp = angular.module('ringid.chat');
    } catch (e) {}

    chatApp.service('ChatWorkerCommands', ChatWorkerCommands);

    ChatWorkerCommands.$inject = ['ChatConnector'];

    function ChatWorkerCommands( ChatConnector ) {

        var _validateChatSessionType = function(type){

            if( !type){
                Ringlogger.alert('Invalid Chat Session Type', type, Ringlogger.tags.CHAT );
                return false;
            }
            return true;
        }


        this.startChatSession = function(boxId, type, uIds){
            //type == 'friend|tag'
            if(!_validateChatSessionType(type)) return

            ChatConnector.sendCommand('START_CHAT_SESSION', { id : boxId, type : type, uIds : uIds })

        };

        this.endChatSession = function(boxId, type){
            //type == 'friend|tag'
            if(!_validateChatSessionType(type)) return

            ChatConnector.sendCommand('END_CHAT_SESSION', { id : boxId, type : type })

        };

        this.sendAuthRequest = function(requestObject){

           ChatConnector.sendCommand('SEND_AUTH_REQUSET', {object : requestObject, type : 'send'} );
        };

        this.sendTagChatMemberAddAuthRequest = function(requestObject){
            ChatConnector.sendCommand('SEND_TAG_CHAT_MEMBER_ADD_AUTH_REQUEST', {object : requestObject, type : 'send'} );
        };

        this.doGetChatHistoryMessages = function(boxId, pageDirection, limit, type, packetId ){

            ChatConnector.sendCommand('FETCH_HISTORY_MESSAGE',
            {
                id : boxId, type : type, pageDirection : pageDirection,
                limit : limit, packetId : packetId
            });

        };

    }

