
    var chatApp;
    try {
        chatApp = angular.module('ringid.chat');
    } catch (e) {
      console.log(e);
    }

    chatApp.factory('ChatResponses', ChatResponses);

    ChatResponses.$inject = ['$rootScope', 'chatHistoryFactory', 'SystemEvents',
    'Auth', 'tagChatFactory', 'ChatFactory',  'tagChatManager', 'Utils',
    'userFactory',
    'ChatResponseProcessor', 'ChatSeenSend', 'ChatHelper', 'ChatConnector']

    function ChatResponses($rootScope, chatHistoryFactory, SystemEvents,
      Auth, tagChatFactory, ChatFactory, tagChatManager, Utils,
      userFactory,
      ChatResponseProcessor, ChatSeenSend, ChatHelper, ChatConnector) {

		var CHAT_APP 		   = window.CHAT_APP;
        var PACKET_TYPES = CHAT_APP.Constants.PACKET_TYPES;
        var Constants = CHAT_APP.Constants;
        var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
        var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES;
        var ChatRequests = CHAT_APP.ChatRequests;
        var responseMethodMap = {};

        function getPacketProcessorInfo(packetType){
            return responseMethodMap[packetType];
        }

        function shouldProcessMessage(messageType){
            switch(messageType){
                //0
                case GENERAL_CONSTANTS.MESSAGE_TYPES.DELETE_MESSAGE:
                //2
                case GENERAL_CONSTANTS.MESSAGE_TYPES.TEXT:
                //3
                case GENERAL_CONSTANTS.MESSAGE_TYPES.EMOTICON_MESSAGE:
                //4
                case GENERAL_CONSTANTS.MESSAGE_TYPES.LOCATION_SHARE:
                //5
                case GENERAL_CONSTANTS.MESSAGE_TYPES.LINK_SHARE:
                //6
                case GENERAL_CONSTANTS.MESSAGE_TYPES.STICKER:
                //7
                case GENERAL_CONSTANTS.MESSAGE_TYPES.IMAGE:
                //10
                case GENERAL_CONSTANTS.MESSAGE_TYPES.CAMERA_IMAGE:
                //8
                case GENERAL_CONSTANTS.MESSAGE_TYPES.AUDIO:
                //9
                case GENERAL_CONSTANTS.MESSAGE_TYPES.VIDEO:
                //15
               case GENERAL_CONSTANTS.MESSAGE_TYPES.RING_MEDIA_MESSAGE:
                    return true;
                    break;
                default:
                    return false;
            }
        }

        function processUpdates(responseObject) {

            var packetType = responseObject.packetType;

            var packetProcessorInfo = getPacketProcessorInfo(packetType);

            if( !packetProcessorInfo ){
                
                return false;
            }

            try{
               packetProcessorInfo.processor.call(this, responseObject);
            }catch(e){
               
            }

            return true;

        }


      //PACKET TYPE(1) : FRIEND_CHAT_REGISTER
      function onFriendChatRegister(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(2) : FRIEND_CHAT_UNREGISTER
      function onFriendChatUnregister(responseObject){
        var userId       = responseObject.userId,
            friendId     = responseObject.friendId,
            onlineStatus = responseObject.onlineStatus,
            userMood     = responseObject.userMood,
            packetId     = responseObject.packetId;

        /* method body */

        var box = ChatFactory.getBoxByUId(userId);
        if(userId === box.getKey()){
            ChatFactory.closeChatBox(box.getKey());
        }

      }

      //PACKET TYPE(3) : FRIEND_CHAT_REGISTER_CONFIRMATION
      function onFriendChatRegisterConfirmation(responseObject){
        var friendId        = responseObject.friendId,
            chatBindingPort = responseObject.chatBindingPort,
            serverDate      = responseObject.serverDate,
            packetId        = responseObject.packetId;

        /* method body */

       CHAT_GLOBAL_VALUES.serverTime = serverDate;
       CHAT_GLOBAL_VALUES.serverTimeDiff = Date.now()- serverDate;

       var box = ChatFactory.getBoxByUId(friendId);
        if(!box){
          box = ChatFactory.creatNonDomBox(friendId, false);
        }

      }

      //PACKET TYPE(4) : FRIEND_CHAT_IDLE
      function onFriendChatIdle(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId;

        /* method body */

        var box = ChatFactory.getBoxByUId(userId);
        if(box) box.setFriendTypingBool(false);

      }

      //PACKET TYPE(5) : FRIEND_CHAT_TYPING
      function onFriendChatTyping(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId;

        /* method body */

        var boxId;
        if( responseObject.userId == Auth.currentUser().getKey() ){
            boxId = responseObject.friendId;
        }else{
            boxId = responseObject.userId;
        }

        var box = ChatFactory.getBoxByUId(boxId);

        if(box){ // no need to open box for typing, if box is closed; and for this scenario no need to update box
            box.setFriendTypingBool(true);
            setTimeout(function () {
                box.setFriendTypingBool(false);
                Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_UPDATED, {boxId : boxId});
            },3000);
        }

      }

      //PACKET TYPE(6) : FRIEND_CHAT_MSG
      function onFriendChatMsg(responseObject){
        var userId          = responseObject.userId,
            friendId        = responseObject.friendId,
            messageType     = responseObject.messageType,
            timeout         = responseObject.timeout,
            message         = responseObject.message,
            messageDate     = responseObject.messageDate,
            isSecretVisible = responseObject.isSecretVisible,
            packetId        = responseObject.packetId;

        /* method body */

          if( !shouldProcessMessage(messageType) )return;

          var boxId = responseObject.boxId;
          var currentUserId = Auth.currentUser().getKey();

          var scrollType;

          if( !boxId ){
              boxId = userId;
          }

          if( boxId == currentUserId){
              boxId = friendId;
          }

          boxId = boxId.toString();

          if( chatHistoryFactory.isInLocalStorageChatMsgMap(boxId, packetId) ){
              return;
          }

          var chatBox = ChatFactory.getBoxByUId(boxId);

          if( messageType === GENERAL_CONSTANTS.MESSAGE_TYPES.DELETE_MESSAGE ){

              ChatResponseProcessor.doOnMessageTypeDeleteMessage(boxId, userId, packetId, responseObject, chatBox );

          }else if( responseObject.messageType > GENERAL_CONSTANTS.MESSAGE_TYPES.BLANK_MESSAGE ){

              if( !chatBox){

                  ChatFactory.openChatBox(boxId);

              }else if( !responseObject.fromHistory){

                  if( !chatBox.nonDomBox ){
                    chatBox.nonDomBox = true;
                    chatBox.loadHistoryMessages();
                    Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_OPENNED, {boxId : boxId });
                  }
              }

              chatBox = ChatFactory.getBoxByUId(boxId);

              chatBox.setFriendTypingBool(false);



              if( !responseObject.fromHistory || !responseObject.fromOffline){

                  if( !!chatBox && !chatBox.isFocused && chatBox.latestSeenMessageDate <= messageDate ){
                      responseObject.status = 'Unread';
                      scrollType = 'unread'
                  }else{
                      responseObject.status = responseObject.status || 'Received';
                  }
              }

              if(responseObject.fromHistory){

                  if( responseObject.status != 'Unread'){
                     responseObject.seenSent = true;
                  }

              }else{
                  scrollType = 'bottom'
              }

              responseObject.tag_chat = false;

              var friendId = chatBox.getKey();

              if (responseObject.status == 'Edited' || !chatBox.isSamePacketId(packetId) ) {

                  responseObject.user = userFactory.create({uId: userId, fetchDatails: false});

                  if(responseObject.status == 'Unread') {
                      ChatFactory.increaseUnreadMessageCount(boxId, responseObject.packetId);
                      chatBox.updateUnreadCount();
                  }

                  chatBox.pushMessage(responseObject, chatBox.getKey());

                  if(!responseObject.fromHistory) {

                      if(chatBox.isFocused ){//for sending seen packet if box is on focused
                          //for image and others and secret message seen packet will not be sent for focused box
                          var msgTypes = GENERAL_CONSTANTS.MESSAGE_TYPES;
                          var filteredMessages = [{key: responseObject.packetId, value:chatBox.getMessage(responseObject.packetId)}];

                          if([ msgTypes.IMAGE, msgTypes.AUDIO, msgTypes.VIDEO, msgTypes.CAMERA_IMAGE, msgTypes.RING_MEDIA_MESSAGE ].indexOf(messageType) == -1){
                              ChatSeenSend.sendSeenPacket(chatBox, filteredMessages);

                              if( timeout > 0){
                                  Utils.triggerCustomEvent(SystemEvents.CHAT.WAS_FOCUSED, {box: chatBox, filteredMessages: filteredMessages});
                              }
                          }

                          //if( timeout > 0){
                          //      Utils.triggerCustomEvent(SystemEvents.CHAT.WAS_FOCUSED, {box: chatBox, filteredMessages: filteredMessages});
                          //}
                      }
                  }

                  chatHistoryFactory.updateBox(chatBox);

              }

              //if(!responseObject.fromHistory){
              //    Utils.triggerCustomEvent(SystemEvents.CHAT.MESSAGE_RECEIVED, { boxId : boxId, scroll : scrollType , fromHistoryFlag: false });
              //}


          }
      }

      //PACKET TYPE(7) : FRIEND_CHAT_MSG_EDIT
      function onFriendChatMsgEdit(responseObject){
        var userId          = responseObject.userId,
            friendId        = responseObject.friendId,
            messageType     = responseObject.messageType,
            timeout         = responseObject.timeout,
            message         = responseObject.message,
            messageDate     = responseObject.messageDate,
            isSecretVisible = responseObject.isSecretVisible,
            packetId        = responseObject.packetId;

        /* method body */

        responseObject.status = 'Edited';
        onFriendChatMsg( responseObject );

      }

      //PACKET TYPE(8) : FRIEND_CHAT_BROKEN_MSG
      function onFriendChatBrokenMsg(responseObject){
        var userId          = responseObject.userId,
            friendId        = responseObject.friendId,
            sequenceNo      = responseObject.sequenceNo,
            messageType     = responseObject.messageType,
            timeout         = responseObject.timeout,
            message         = responseObject.message,
            messageDate     = responseObject.messageDate,
            isSecretVisible = responseObject.isSecretVisible,
            packetId        = responseObject.packetId;

        /* method body */

        /*** Packets are merged in worker, it will received the merged packet ***/

        onFriendChatMsg(responseObject)

      }

      //PACKET TYPE(9) : FRIEND_CHAT_BROKEN_MSG_EDIT
      function onFriendChatBrokenMsgEdit(responseObject){
        var userId          = responseObject.userId,
            friendId        = responseObject.friendId,
            sequenceNo      = responseObject.sequenceNo,
            messageType     = responseObject.messageType,
            timeout         = responseObject.timeout,
            message         = responseObject.message,
            messageDate     = responseObject.messageDate,
            isSecretVisible = responseObject.isSecretVisible,
            packetId        = responseObject.packetId;

        /* method body */

        /*** Packets are merged in worker, it will received the merged packet ***/
        onFriendChatMsgEdit( responseObject )

      }

      //PACKET TYPE(10) : FRIEND_CHAT_MULTIPLE_MSG
      function onFriendChatMultipleMsg(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            messages = responseObject.messages,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(15) : FRIEND_CHAT_DELIVERED
      function onFriendChatDelivered(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            packetId = responseObject.packetId;

        /* method body */

        var boxId = ChatResponseProcessor.getFriendBoxId( userId, friendId )
        var box = ChatResponseProcessor.getFriendBox( boxId );

        var msgObj    = box.getMessage( packetId );
        if(!!msgObj){
            ChatResponseProcessor.updateMessageStatusToDelivered( boxId, msgObj );
            box.sendTabUpdate( msgObj );
        }

      }

      //PACKET TYPE(16) : FRIEND_CHAT_SENT
      function onFriendChatSent(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            packetId = responseObject.packetId;

        /* method body */

        var boxId = ChatResponseProcessor.getFriendBoxId( userId, friendId )
        var box = ChatResponseProcessor.getFriendBox( boxId );

        var msgObj    = box.getMessage( packetId );
        if(!!msgObj){
            ChatResponseProcessor.updateMessageStatusToDelivered( box.getKey(), msgObj );
            box.sendTabUpdate( msgObj );
        }

      }

      //PACKET TYPE(17) : FRIEND_CHAT_SEEN
      function onFriendChatSeen(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            messages = responseObject.messages,
            packetId = responseObject.packetId;

        /* method body */
        var boxId = ChatResponseProcessor.getFriendBoxId( userId, friendId )
        var box = ChatResponseProcessor.getFriendBox( boxId );

        for(var index = 0; index < responseObject.messages.length; index++){
            var aBoxMessage = box.getMessage(responseObject.messages[index].packetId);
            if(!!aBoxMessage){
                var doUpdateMessage = false;
                if(responseObject.messages[index].status == GENERAL_CONSTANTS.MESSAGE_STATUS.DELETED){
                  /* Skipping If Message is Deleted */
                }else if(responseObject.messages[index].status == GENERAL_CONSTANTS.MESSAGE_STATUS.SEEN){
                    aBoxMessage.status = 'Seen';
                    Utils.triggerCustomEvent(SystemEvents.CHAT.DO_START_SECRET_TIMER, {boxId : boxId, others: false, messages: [{key:responseObject.messages[index].packetId, value: aBoxMessage}] })
                    doUpdateMessage = true;
                }
                else if (responseObject.messages[index].status == GENERAL_CONSTANTS.MESSAGE_STATUS.VIEWED){
                    aBoxMessage.status = 'Viewed';
                    Utils.triggerCustomEvent(SystemEvents.CHAT.DO_START_SECRET_TIMER, {boxId : boxId, others: true, messages: [{key:responseObject.messages[index].packetId, value: aBoxMessage}] })
                    doUpdateMessage = true;
                }

                if( doUpdateMessage ){
                  chatHistoryFactory.updateMessage(aBoxMessage, box.getKey());
                  box.sendTabUpdate(aBoxMessage);
                }

            }

        }
      }

      //PACKET TYPE(18) : FRIEND_CHAT_SEEN_CONFIRMATION
      function onFriendChatSeenConfirmation(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(19) : FRIEND_CHAT_MULTIPLE_MSG_DELETE
      function onFriendChatMultipleMsgDelete(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            packets  = responseObject.packets,
            packetId = responseObject.packetId;

        /* method body */

        var boxId = ChatResponseProcessor.getFriendBoxId( userId, friendId );
        var box = ChatResponseProcessor.getFriendBox( boxId );

        for (var k = 0; k < packets.length; k++) {
            var msgKey = packets[k].packetId;
            var msgObj    = box.getMessage(msgKey);
            if(!!msgObj){

                if( userId != Auth.currentUser().getKey() ){
                    msgObj.messageType = GENERAL_CONSTANTS.MESSAGE_TYPES.DELETE_MESSAGE;
                    msgObj.text   = 'This message has been deleted';
                    msgObj.setTextPartition();
                    msgObj.status = 'Deleted';

                }else{
                    box.removeMessage(msgKey);
                }

                chatHistoryFactory.updateMessage(msgObj, box.getKey());
                box.sendTabUpdate(msgObj);
            }
        }

      }

      //PACKET TYPE(20) : FRIEND_CHAT_MSG_DELETE_CONFIRMATION
      function onFriendChatMsgDeleteConfirmation(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            packetId = responseObject.packetId;

        /* method body */
          var boxId = ChatResponseProcessor.getFriendBoxId( userId, friendId );
          var box = ChatResponseProcessor.getFriendBox( boxId );

      }

      //PACKET TYPE(24) : FRIEND_CHAT_BROKEN
      function onFriendChatBroken(responseObject){
        var userId      = responseObject.userId,
            friendId    = responseObject.friendId,
            sequenceNo  = responseObject.sequenceNo,
            rawDataByte = responseObject.rawDataByte,
            packetId    = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(25) : FRIEND_CHAT_BROKEN_CONFIRMATION
      function onFriendChatBrokenConfirmation(responseObject){
        var userId     = responseObject.userId,
            friendId   = responseObject.friendId,
            sequenceNo = responseObject.sequenceNo,
            packetId   = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(27) : FRIEND_CHAT_BLOCK
      function onFriendChatBlock(responseObject){
        var userId           = responseObject.userId,
            friendId         = responseObject.friendId,
            blockUnblockDate = responseObject.blockUnblockDate,
            isAddToDb        = responseObject.isAddToDb,
            packetId         = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(28) : FRIEND_CHAT_UNBLOCK
      function onFriendChatUnblock(responseObject){
        var userId           = responseObject.userId,
            friendId         = responseObject.friendId,
            blockUnblockDate = responseObject.blockUnblockDate,
            packetId         = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(29) : FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION
      function onFriendChatBlockUnblockConfirmation(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(41) : TAG_CHAT_TAG_REGISTER
      function onTagChatTagRegister(responseObject){
        var userId   = responseObject.userId,
            tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(42) : TAG_CHAT_TAG_UNREGISTER
      function onTagChatTagUnregister(responseObject){
        var userId       = responseObject.userId,
            tagId        = responseObject.tagId,
            onlineStatus = responseObject.onlineStatus,
            userMood     = responseObject.userMood,
            packetId     = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(43) : TAG_CHAT_TAG_REGISTER_CONFIRMATION
      function onTagChatTagRegisterConfirmation(responseObject){
        var tagId           = responseObject.tagId,
            chatBindingPort = responseObject.chatBindingPort,
            serverDate      = responseObject.serverDate,
            packetId        = responseObject.packetId;

        /* method body */

        CHAT_GLOBAL_VALUES.serverTime = serverDate;
        CHAT_GLOBAL_VALUES.serverTimeDiff = Date.now()- serverDate;

       var box = ChatFactory.getBoxByUId(tagId);
        if(!box){
          box = ChatFactory.creatNonDomBox(tagId, true);
        }

      }

      //PACKET TYPE(46) : TAG_CHAT_TAG_INFORMATION
      function onTagChatTagInformation(responseObject){
        var userId        = responseObject.userId,
            tagId         = responseObject.tagId,
            activityType  = responseObject.activityType,
            tagName       = responseObject.tagName,
            tagPictureUrl = responseObject.tagPictureUrl,
            packetId      = responseObject.packetId;

        /* method body */
        ChatResponseProcessor.processTagInformation( responseObject );

      }

      //PACKET TYPE(47) : TAG_CHAT_TAG_INFORMATION_CONFIRMATION
      function onTagChatTagInformationConfirmation(responseObject){
        var userId   = responseObject.userId,
            tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(51) : TAG_CHAT_TAG_MEMBER_ADD
      function onTagChatTagMemberAdd(responseObject){
        var userId     = responseObject.userId,
            tagId      = responseObject.tagId,
            tagMembers = responseObject.tagMembers,
            packetId   = responseObject.packetId;

        /* method body */
        ChatResponseProcessor.processTagMemberAddUpdate( responseObject );

        Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED, { tagId : tagId });


      }

      //PACKET TYPE(52) : TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION
      function onTagChatTagMemberAddConfirmation(responseObject){
        var userId   = responseObject.userId,
            tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(53) : TAG_CHAT_MEMBER_REMOVE_LEAVE
      function onTagChatMemberRemoveLeave( responseObject ){
        var userId     = responseObject.userId,
            tagId      = responseObject.tagId,
            tagMembers = responseObject.tagMembers,
            packetId   = responseObject.packetId;

        /* method body */
        ChatResponseProcessor.processTagMemberRemoveLeave( responseObject );

        Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED, { tagId : tagId });

      }

      //PACKET TYPE(54) : TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION
      function onTagChatMemberRemoveLeaveConfirmation(responseObject){
        var userId   = responseObject.userId,
            tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */
        if( userId === Auth.currentUser().getKey() ){
            ChatResponseProcessor.doTagUnregisterTask( tagId );
        }

        Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED, { tagId : tagId });

      }

      //PACKET TYPE(55) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE
      function onTagChatTagMemberTypeChange(responseObject){
        var userId     = responseObject.userId,
            tagId      = responseObject.tagId,
            tagMembers = responseObject.tagMembers,
            packetId   = responseObject.packetId;

        /* method body */
        ChatResponseProcessor.processTagMemberStatusChange( responseObject );

        Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED, { tagId : tagId });

      }

      //PACKET TYPE(56) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION
      function onTagChatTagMemberTypeChangeConfirmation(responseObject){
        var userId   = responseObject.userId,
            tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(61) : TAG_CHAT_IDLE
      function onTagChatIdle(responseObject){
        var userId = responseObject.userId,
            tagId  = responseObject.tagId;

        /* method body */
        var box = ChatFactory.getBoxByUId(tagId);
        if(box) box.setFriendTypingBool(false);

      }

      //PACKET TYPE(62) : TAG_CHAT_TYPING
      function onTagChatTyping(responseObject){
        var userId = responseObject.userId,
            tagId  = responseObject.tagId;

        /* method body */

        var chatBox, tagObject;

        chatBox = ChatFactory.getBoxByUId(tagId);
        if( !!chatBox ){

            tagObject = tagChatFactory.getTag(tagId);

            if (!!tagObject) {

                chatBox.showTypingText(userId)

                setTimeout(function () {
                    chatBox.hideTypingText();
                    Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_UPDATED,{ boxId : tagId });

                }, 3000);
            }
        }

      }

      //PACKET TYPE(63) : TAG_CHAT_MSG
      function onTagChatMsg(responseObject){
        var userId      = responseObject.userId,
            tagId       = responseObject.tagId,
            messageType = responseObject.messageType,
            message     = responseObject.message,
            messageDate = responseObject.messageDate,
            packetId    = responseObject.packetId;

        /* method body */

        if( !shouldProcessMessage(messageType) )return;

        tagId = tagId.toString();

        if( !responseObject.fromHistory && chatHistoryFactory.isInLocalStorageChatMsgMap( tagId, packetId ) ){
            return;
        }

        var tagObject = tagChatFactory.getTag( tagId );

        if(!tagObject){

            var requestObject = ChatRequests.getOfflineGetTagInformationWithMembersObject( tagId );
            ChatConnector.send(requestObject);

            tagObject = tagChatFactory.getOrCreateTag(tagId);
        }

        var chatBox = ChatFactory.getBoxByUId(tagId);
        var scrollType;

        if( messageType === GENERAL_CONSTANTS.MESSAGE_TYPES.DELETE_MESSAGE ){

            ChatResponseProcessor.doOnMessageTypeDeleteMessage(tagId, userId, packetId, responseObject, chatBox );

        }else if( messageType > GENERAL_CONSTANTS.MESSAGE_TYPES.BLANK_MESSAGE ){

            chatBox = tagChatManager.openTagChatBoxIfClosed( tagId, chatBox);

            if( !responseObject.fromHistory ){
                    scrollType = 'bottom'
            }

            if( !responseObject.fromHistory || !responseObject.fromOffline){

                if( !!chatBox && !chatBox.isFocused && chatBox.latestSeenMessageDate <= messageDate ){

                    responseObject.status = 'Unread';
                    scrollType = 'unread'

                }else{

                    responseObject.status = responseObject.status || 'Received';
                }
            }

            responseObject.tag_chat = true;

            var tagId = chatBox.getKey();

            if ( !chatBox.isSamePacketId( packetId ) ) {

                // responseObject.user = userFactory.createByUId(userId, function(){
                //     Utils.triggerCustomEvent('SINGLE_MESSAGE_UPDATED', { message : { key : packetId  }} );
                // });

                responseObject.user = userFactory.create({uId: userId, fetchDatails: false});

                if(!responseObject.fromHistory && !!tagObject && tagObject.isTagSafeToShow()){
                    if( !chatBox.nonDomBox ){
                      chatBox.nonDomBox = true;
                      chatBox.loadHistoryMessages();
                      Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_OPENNED, {boxId : tagId });
                    }

                }

                // var tagMessageModelObject = tagChatFactory.getOrCreateMessage( tagId, responseObject );
                // tagMessageModelObject.setStatus( status );

                if(responseObject.fromHistory){
                    if(responseObject.status != 'Unread'){
                        responseObject.seenSent = true;
                    }
                    chatHistoryFactory.removeUnreadMessageInfo(tagId, packetId );
                    chatBox.updateUnreadCount();

                }
                else{

                    if( responseObject.status == 'Unread'){
                        ChatFactory.increaseUnreadMessageCount( tagId, packetId );
                        chatBox.updateUnreadCount();
                    }
                }

                chatBox.pushMessage(responseObject, chatBox.getKey());

                if(!responseObject.fromHistory) {

                    if(chatBox.isFocused ){//for sending seen packet if box is on focused
                        var msgTypes = GENERAL_CONSTANTS.MESSAGE_TYPES;
                        var filteredMessages = [{key: responseObject.packetId, value:chatBox.getMessage(responseObject.packetId)}];

                        if([ msgTypes.IMAGE, msgTypes.AUDIO, msgTypes.VIDEO, msgTypes.CAMERA_IMAGE, msgTypes.RING_MEDIA_MESSAGE ].indexOf(messageType) == -1){
                            ChatSeenSend.sendSeenPacket(chatBox, filteredMessages);
                        }
                    }
                }

                chatHistoryFactory.updateBox(chatBox);

                //if(!responseObject.fromHistory){
                //  Utils.triggerCustomEvent(SystemEvents.CHAT.MESSAGE_RECEIVED, { boxId : tagId, scroll : scrollType, fromHistoryFlag: false } );
               // }

            }

        }

      }

      //PACKET TYPE(64) : TAG_CHAT_MSG_EDIT
      function onTagChatMsgEdit(responseObject){
        var userId      = responseObject.userId,
            tagId       = responseObject.tagId,
            messageType = responseObject.messageType,
            message     = responseObject.message,
            messageDate = responseObject.messageDate,
            packetId    = responseObject.packetId;

        /* method body */
        responseObject.status = 'Edited';
        onTagChatMsg( responseObject );

      }

      //PACKET TYPE(65) : TAG_CHAT_BROKEN_MSG
      function onTagChatBrokenMsg(responseObject){
        var userId      = responseObject.userId,
            tagId       = responseObject.tagId,
            sequenceNo  = responseObject.sequenceNo,
            messageType = responseObject.messageType,
            message     = responseObject.message,
            messageDate = responseObject.messageDate,
            packetId    = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(66) : TAG_CHAT_BROKEN_MSG_EDIT
      function onTagChatBrokenMsgEdit(responseObject){
        var userId      = responseObject.userId,
            tagId       = responseObject.tagId,
            sequenceNo  = responseObject.sequenceNo,
            messageType = responseObject.messageType,
            message     = responseObject.message,
            messageDate = responseObject.messageDate,
            packetId    = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(67) : TAG_CHAT_MULTIPLE_MSG
      function onTagChatMultipleMsg(responseObject){
        var userId      = responseObject.userId,
            tagId       = responseObject.tagId,
            messageType = responseObject.messageType,
            message     = responseObject.message,
            messageDate = responseObject.messageDate,
            packetId    = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(68) : TAG_CHAT_DELIVERED
      function onTagChatDelivered(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */

        var chatBox = ChatResponseProcessor.getTagChatBox( tagId )

        var boxMessageObject = chatBox.getMessage( packetId);
        if (!!boxMessageObject) {

            if( boxMessageObject.status !== 'Seen' ){
                boxMessageObject.status = 'Delivered';
            }

            chatHistoryFactory.updateMessage(boxMessageObject, chatBox.getKey());
        }

        // if(!!tagObject){
        //     var tagMessageObject = tagObject.getMessage( packetId);
        //     if( !!tagMessageObject ){
        //         if( tagMessageObject.getStatus() !== 'Seen'){
        //             tagMessageObject.setStatus('Delivered');
        //         }

        //         //tagMessageObject.addDeliveredUserId( userId);
        //     }
        // }


        chatHistoryFactory.updateBox(chatBox);

      }

      //PACKET TYPE(69) : TAG_CHAT_SENT
      function onTagChatSent(responseObject){
        var tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */

        var chatBox = ChatResponseProcessor.getTagChatBox( tagId );

        var boxMessageObject = chatBox.updateMessageStatus( packetId, 'Sent');
        if (!!boxMessageObject) {
            chatHistoryFactory.updateMessage(boxMessageObject, chatBox.getKey());
        }

        // if(!!tagObject){
        //     var tagMessageObject = tagObject.getMessage( packetId );
        //     if (!!tagMessageObject) {
        //         tagMessageObject.setStatus('Sent');
        //     }
        // }

        chatHistoryFactory.updateBox(chatBox);

      }

      //PACKET TYPE(70) : TAG_CHAT_SEEN
      function onTagChatSeen(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */

        var chatBox = ChatResponseProcessor.getTagChatBox( tagId );

        var boxMessageObject = chatBox.updateMessageStatus( packetId, 'Seen');
        if (!!boxMessageObject) {
            chatHistoryFactory.updateMessage(boxMessageObject, chatBox.getKey());
        }

        // if( !!tagObject){
        //     var tagMessageObject = tagObject.getMessage( packetId );
        //     if (!!tagMessageObject) {
        //         tagMessageObject.setStatus('Seen');
        //     }
        // }

        chatHistoryFactory.updateBox(chatBox);

      }

      //PACKET TYPE(71) : TAG_CHAT_SEEN_CONFIRMATION
      function onTagChatSeenConfirmation(responseObject){
        var tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(72) : TAG_CHAT_MULTIPLE_MSG_DELETE
      function onTagChatMultipleMsgDelete(responseObject){
        var userId   = responseObject.userId,
            tagId    = responseObject.tagId,
            packets  = responseObject.packets,
            packetId = responseObject.packetId;

        /* method body */
        if( !angular.isArray( packets ) ){
            return;
        }

        var chatBox = ChatResponseProcessor.getTagChatBox( tagId );

        for(var index = 0 ; index < packets.length; index++){
            ChatResponseProcessor.doOnMessageTypeDeleteMessage( tagId, userId, packets[index].packetId, null, chatBox )
        }

      }

      //PACKET TYPE(73) : TAG_CHAT_MSG_DELETE_CONFIRMATION
      function onTagChatMsgDeleteConfirmation(responseObject){
        var userId   = responseObject.userId,
            tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */
        // var deleteRequestObject = REQUSET_CACHE.getChatCache(packetId, { packetType : PACKET_TYPES.TAG_CHAT_MULTIPLE_MSG_DELETE })
        // if(!!deleteRequestObject){
        //   var chatBox = ChatResponseProcessor.getTagChatBox( tagId );
        //   for(var index = 0 ; index < deleteRequestObject.packets.length; index++){
        //       ChatResponseProcessor.doOnMessageTypeDeleteMessage( tagId, userId, packets[index].packetId, null, chatBox )
        //   }
        // }
      }

      //PACKET TYPE(74) : TAG_CHAT_GENERAL_BROKEN_PACKET
      function onTagChatGeneralBrokenPacket(responseObject){
        var userId      = responseObject.userId,
            tagId       = responseObject.tagId,
            sequenceNo  = responseObject.sequenceNo,
            rawDataByte = responseObject.rawDataByte,
            packetId    = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(75) : TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION
      function onTagChatGeneralBrokenPacketConfirmation(responseObject){
        var userId     = responseObject.userId,
            tagId      = responseObject.tagId,
            sequenceNo = responseObject.sequenceNo,
            packetId   = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(91) : OFFLINE_FRIEND_INFORMATION
      function onOfflineFriendInformation(responseObject){
        var userId            = responseObject.userId,
            friendId          = responseObject.friendId,
            fullName          = responseObject.fullName,
            onlineStatus      = responseObject.onlineStatus,
            friendAppType     = responseObject.friendAppType,
            friendDeviceToken = responseObject.friendDeviceToken,
            userMood          = responseObject.userMood,
            packetId          = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(92) : OFFLINE_FRIEND_INFORMATION_CONFIRMATION
      function onOfflineFriendInformationConfirmation(responseObject){
        var friendId = responseObject.friendId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(93) : OFFLINE_GET_REQUEST
      function onOfflineGetRequest(responseObject){
        var userId           = responseObject.userId,
            updateTime       = responseObject.updateTime,
            blockUnblockDate = responseObject.blockUnblockDate,
            packetId         = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(94) : OFFLINE_GET_REQUEST_CONFIRMATION
      function onOfflineGetRequestConfirmation(responseObject){
        var serverDate = responseObject.serverDate,
            packetId   = responseObject.packetId;

        /* method body */

        CHAT_GLOBAL_VALUES.serverTime = serverDate;
        CHAT_GLOBAL_VALUES.serverTimeDiff = Date.now()- serverDate;


      }

      //PACKET TYPE(95) : OFFLINE_FRIEND_UNREAD_MESSAGE
      function onOfflineFriendUnreadMessage(responseObject){
        var messages = responseObject.messages,
            packetId = responseObject.packetId;

        /* method body */
        //var boxIds = {};

        for(var index = 0; index < messages.length; index++){
            var anUnreadMessage = messages[index];

            if( anUnreadMessage.messageType != GENERAL_CONSTANTS.MESSAGE_TYPES.DELETE_MESSAGE ){

              anUnreadMessage.status = 'Unread';

            }else{

              anUnreadMessage.status = 'Deleted';

            }

            anUnreadMessage.fromOffline = true;
            anUnreadMessage.fromHistory = false;
            onFriendChatMsg(anUnreadMessage);

          //boxIds[anUnreadMessage.userId] = true;

            //}else{

             // 
           // }
        }

        //var boxIdList = Object.keys(boxIds);
        //boxIdList.forEach(function( aBoxId ){
        //  Utils.triggerCustomEvent('NEW_MESSAGE_PUSHED', { boxId : aBoxId });
        //});

      }

      //PACKET TYPE(96) : OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION
      function onOfflineFriendUnreadMessageConfirmation(responseObject){
        var userId   = responseObject.userId,
            packets  = responseObject.packets,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(97) : OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST
      function onOfflineFriendHistoryMessageRequest(responseObject){
        var userId        = responseObject.userId,
            friendId      = responseObject.friendId,
            pageDirection = responseObject.pageDirection,
            pageLimit     = responseObject.pageLimit,
            packetId      = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(98) : OFFLINE_FRIEND_HISTORY_MESSAGE
      function onOfflineFriendHistoryMessage(responseObject){
        var friendId      = responseObject.friendId,
            messages      = responseObject.messages,
            pageDirection = responseObject.pageDirection,
            packetId      = responseObject.packetId;

        /* method body */
        var currentUserId = Auth.currentUser().getKey();
        var packetIds = [];

        var chatBox = ChatFactory.getBoxByUId( friendId );
        if( !chatBox ){
            chatBox = ChatFactory.creatNonDomBox( friendId );
        }

        if(!messages.length && pageDirection != GENERAL_CONSTANTS.PAGE_DIRECTION.DOWN){
            chatBox.hasHistoryMessage = false;

        }else{

            var processed = false, hasMoreMessage = false;

            // if( messages.length > GENERAL_CONSTANTS.HISTORY_MAX_MESSAGE ){
            //   chatBox.hasHistoryMessage = true;
            //   hasMoreMessage = true;

            // }

            // messages.splice(GENERAL_CONSTANTS.HISTORY_MAX_MESSAGE);



            for(var index = 0; index < messages.length; index++){
                var aHistoryMessage = messages[index];

                if(aHistoryMessage.messageType != GENERAL_CONSTANTS.MESSAGE_TYPES.HISTORY_RE_FETCH
                  && ( aHistoryMessage.messageType != GENERAL_CONSTANTS.MESSAGE_TYPES.DELETE_MESSAGE || aHistoryMessage.userId != currentUserId ) )
                {
                    processed = true;

                    if( aHistoryMessage.userId.toString() == currentUserId ){

                        aHistoryMessage.status = ChatResponseProcessor.getMessageStatus( aHistoryMessage.status ) || 'Delivered';

                        aHistoryMessage.friendId = friendId;

                    }else{

                        if( aHistoryMessage.status == GENERAL_CONSTANTS.MESSAGE_STATUS.DELETED  ){
                            aHistoryMessage.status = 'Deleted';

                        }else{

                            if( aHistoryMessage.status < GENERAL_CONSTANTS.MESSAGE_STATUS.SEEN ){
                              aHistoryMessage.status = 'Unread';
                            }else{
                              aHistoryMessage.status = 'Received';
                            }
                        }


                        aHistoryMessage.friendId = currentUserId;
                    }

                    aHistoryMessage.boxId = friendId;
                    aHistoryMessage.fromOffline = true;
                    aHistoryMessage.fromHistory = true;

                    onFriendChatMsg( aHistoryMessage );

                }

                packetIds.push(aHistoryMessage.packetId);

            }

            if( processed ) {
                chatBox.hasHistoryMessage = true;
                Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_UPDATED, {boxId: friendId, noScroll : true})
            }
        }

      }

      //PACKET TYPE(99) : OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION
      function onOfflineFriendHistoryMessageConfirmation(responseObject){
        var friendId = responseObject.friendId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(100) : OFFLINE_GET_FRIEND_MESSAGE_STATUS
      function onOfflineGetFriendMessageStatus(responseObject){
        var userId   = responseObject.userId,
            friendId = responseObject.friendId,
            packets  = responseObject.packets,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(101) : OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION
      function onOfflineGetFriendMessageStatusConfirmation(responseObject){
        var friendId = responseObject.friendId,
            packets  = responseObject.packets,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(104) : OFFLINE_TAG_INFORMATION_ACTIVITY
      function onOfflineTagInformationActivity(responseObject){
        var tagId     = responseObject.tagId,
            noOfItems = responseObject.noOfItems,
            items     = responseObject.items,
            packetId  = responseObject.packetId;

        /* method body */

        items.forEach(function(anItem){
          ChatResponseProcessor.processAGroupActivity(tagId, packetId, anItem);
        });

      }

      //PACKET TYPE(105) : OFFLINE_MY_TAG_LIST
      function onOfflineMyTagList(responseObject){
        var noOfItems = responseObject.noOfItems,
            items     = responseObject.items,
            packetId  = responseObject.packetId;

        /* method body */

        var aTagObject;

        for(var index = 0; index < responseObject.items.length; index++){
            aTagObject = tagChatFactory.createNewTag(responseObject.items[index]);
            tagChatFactory.addTagObject(aTagObject);
        }

        Utils.triggerCustomEvent(SystemEvents.CHAT.MY_TAG_LIST_RECEIVED);

      }

      //PACKET TYPE(106) : OFFLINE_TAG_UNREAD_MESSAGE
      function onOfflineTagUnreadMessage(responseObject){
        var messages = responseObject.messages,
            packetId = responseObject.packetId;

        /* method body */

        for(var index = 0; index < responseObject.messages.length; index++){
            var anUnreadMessage = responseObject.messages[index];

            if( anUnreadMessage.messageType != GENERAL_CONSTANTS.MESSAGE_TYPES.DELETE_MESSAGE ){
                anUnreadMessage.status = 'Unread';

            }else{
                anUnreadMessage.status = 'Deleted';

            }

            anUnreadMessage.fromUnread = true;
            anUnreadMessage.fromOffline = true;

            if( anUnreadMessage.messageType == GENERAL_CONSTANTS.MESSAGE_TYPES.GROUP_ACTIVITY){
                ChatResponseProcessor.processGroupActivityMessage( anUnreadMessage );
            }else{
                onTagChatMsg( anUnreadMessage );
            }

        }

      }

      //PACKET TYPE(107) : OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION
      function onOfflineTagUnreadMessageConfirmation(responseObject){
        var userId   = responseObject.userId,
            packets  = responseObject.packets,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(108) : OFFLINE_TAG_CREATE_TAG
      function onOfflineTagCreateTag(responseObject){
        var userId        = responseObject.userId,
            tagId         = responseObject.tagId,
            tagName       = responseObject.tagName,
            tagPictureUrl = responseObject.tagPictureUrl,
            tagMembers    = responseObject.tagMembers,
            packetId      = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(109) : OFFLINE_TAG_CREATE_TAG_CONFIRMATION
      function onOfflineTagCreateTagConfirmation(responseObject){
        var tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(110) : OFFLINE_TAG_HISTORY_MESSAGE_REQUEST
      function onOfflineTagHistoryMessageRequest(responseObject){
        var userId        = responseObject.userId,
            tagId         = responseObject.tagId,
            pageDirection = responseObject.pageDirection,
            pageLimit     = responseObject.pageLimit,
            packetId      = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(111) : OFFLINE_TAG_HISTORY_MESSAGE
      function onOfflineTagHistoryMessage(responseObject){
        var tagId         = responseObject.tagId,
            messages      = responseObject.messages,
            pageDirection = responseObject.pageDirection,
            packetId      = responseObject.packetId;

        /* method body */

        var currentUserId = Auth.currentUser().getKey();
        var chatBox = ChatResponseProcessor.getTagChatBox( tagId );

        if(!messages.length && pageDirection != GENERAL_CONSTANTS.PAGE_DIRECTION.DOWN){

            chatBox.hasHistoryMessage = false;

        }else{

            var processed, hasMoreMessage = false;

            // if( messages.length > GENERAL_CONSTANTS.HISTORY_MAX_MESSAGE ){
            //   chatBox.hasHistoryMessage = true;
            //   hasMoreMessage = true;
            // }

            // messages.splice(GENERAL_CONSTANTS.HISTORY_MAX_MESSAGE);


            for(var index = 0; index < messages.length; index++){
                var aHistoryMessage = messages[index];
                aHistoryMessage.tagId = tagId;
                aHistoryMessage.fromHistory = true;
                aHistoryMessage.fromOffline = true;

                if( aHistoryMessage.messageType == GENERAL_CONSTANTS.MESSAGE_TYPES.GROUP_ACTIVITY){

                    processed = true;
                    ChatResponseProcessor.processGroupActivityMessage(aHistoryMessage);

                }
                else if(aHistoryMessage.messageType != GENERAL_CONSTANTS.MESSAGE_TYPES.HISTORY_RE_FETCH
                  && ( aHistoryMessage.messageType != GENERAL_CONSTANTS.MESSAGE_TYPES.DELETE_MESSAGE || aHistoryMessage.userId != currentUserId ) ){
                //else{
                    processed = true;

                    if( aHistoryMessage.status == GENERAL_CONSTANTS.MESSAGE_STATUS.DELETED  ){
                        aHistoryMessage.status = 'Deleted';

                    }else{

                        if (aHistoryMessage.userId == Auth.currentUser().getKey() ) {

                            aHistoryMessage.status = 'Seen';

                        } else {

                          aHistoryMessage.status = 'Received';
                        }
                    }

                    onTagChatMsg( aHistoryMessage );

                }
            }

            if( processed ){

                chatBox.hasHistoryMessage = true;
                Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_UPDATED, { boxId : tagId, noScroll: true});
            }

        }

      }

      //PACKET TYPE(112) : OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS
      function onOfflineGetTagInformationWithMembers(responseObject){
        var userId   = responseObject.userId,
            tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(113) : OFFLINE_TAG_INFORMATION_WITH_MEMBERS
      function onOfflineTagInformationWithMembers(responseObject){
        var tagId         = responseObject.tagId,
            tagName       = responseObject.tagName,
            tagPictureUrl = responseObject.tagPictureUrl,
            tagMembers    = responseObject.tagMembers,
            packetId      = responseObject.packetId;

        /* method body */

        responseObject.tagMembersCount = tagMembers.length;
        var tagObject = tagChatFactory.getOrCreateTag(tagId, responseObject);
        ChatResponseProcessor.addMembersToTagObject(tagObject, responseObject.tagMembers);

        Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED, { tagId : tagId });

      }

      //PACKET TYPE(117) : OFFLINE_TAG_CONFIRMATION
      function onOfflineTagConfirmation(responseObject){
        var tagId    = responseObject.tagId,
            packetId = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(118) : OFFLINE_BROKEN_HISTORY_PACKET
      function onOfflineBrokenHistoryPacket(responseObject){
        var sequenceNo  = responseObject.sequenceNo,
            rawDataByte = responseObject.rawDataByte,
            packetId    = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(119) : OFFLINE_BROKEN_PACKET
      function onOfflineBrokenPacket(responseObject){
        var sequenceNo  = responseObject.sequenceNo,
            rawDataByte = responseObject.rawDataByte,
            userId      = responseObject.userId,
            packetId    = responseObject.packetId;

        /* method body */

      }

      //PACKET TYPE(120) : OFFLINE_BROKEN_PACKET_CONFIRMATION
      function onOfflineBrokenPacketConfirmation(responseObject){
        var userId     = responseObject.userId,
            sequenceNo = responseObject.sequenceNo,
            packetId   = responseObject.packetId;

        /* method body */

      }


      //PACKET TYPE(1) : FRIEND_CHAT_REGISTER
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_REGISTER]                           = {
          processor : onFriendChatRegister
      };

      //PACKET TYPE(2) : FRIEND_CHAT_UNREGISTER
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_UNREGISTER]                         = {
          processor : onFriendChatUnregister
      };

      //PACKET TYPE(3) : FRIEND_CHAT_REGISTER_CONFIRMATION
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_REGISTER_CONFIRMATION]              = {
          processor : onFriendChatRegisterConfirmation
      };

      //PACKET TYPE(4) : FRIEND_CHAT_IDLE
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_IDLE]                               = {
          processor : onFriendChatIdle
      };

      //PACKET TYPE(5) : FRIEND_CHAT_TYPING
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_TYPING]                             = {
          processor : onFriendChatTyping
      };

      //PACKET TYPE(6) : FRIEND_CHAT_MSG
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_MSG]                                = {
          processor : onFriendChatMsg
      };

      //PACKET TYPE(7) : FRIEND_CHAT_MSG_EDIT
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_MSG_EDIT]                           = {
          processor : onFriendChatMsgEdit
      };

      //PACKET TYPE(8) : FRIEND_CHAT_BROKEN_MSG
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BROKEN_MSG]                         = {
          processor : onFriendChatBrokenMsg
      };

      //PACKET TYPE(9) : FRIEND_CHAT_BROKEN_MSG_EDIT
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BROKEN_MSG_EDIT]                    = {
          processor : onFriendChatBrokenMsgEdit
      };

      //PACKET TYPE(10) : FRIEND_CHAT_MULTIPLE_MSG
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_MULTIPLE_MSG]                       = {
          processor : onFriendChatMultipleMsg
      };

      //PACKET TYPE(15) : FRIEND_CHAT_DELIVERED
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_DELIVERED]                          = {
          processor : onFriendChatDelivered
      };

      //PACKET TYPE(16) : FRIEND_CHAT_SENT
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_SENT]                               = {
          processor : onFriendChatSent
      };

      //PACKET TYPE(17) : FRIEND_CHAT_SEEN
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_SEEN]                               = {
          processor : onFriendChatSeen
      };

      //PACKET TYPE(18) : FRIEND_CHAT_SEEN_CONFIRMATION
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_SEEN_CONFIRMATION]                  = {
          processor : onFriendChatSeenConfirmation
      };

      //PACKET TYPE(19) : FRIEND_CHAT_MULTIPLE_MSG_DELETE
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_MULTIPLE_MSG_DELETE]                = {
          processor : onFriendChatMultipleMsgDelete
      };

      //PACKET TYPE(20) : FRIEND_CHAT_MSG_DELETE_CONFIRMATION
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_MSG_DELETE_CONFIRMATION]            = {
          processor : onFriendChatMsgDeleteConfirmation
      };

      //PACKET TYPE(24) : FRIEND_CHAT_BROKEN
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BROKEN]                             = {
          processor : onFriendChatBroken
      };

      //PACKET TYPE(25) : FRIEND_CHAT_BROKEN_CONFIRMATION
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BROKEN_CONFIRMATION]                = {
          processor : onFriendChatBrokenConfirmation
      };

      //PACKET TYPE(27) : FRIEND_CHAT_BLOCK
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BLOCK]                              = {
          processor : onFriendChatBlock
      };

      //PACKET TYPE(28) : FRIEND_CHAT_UNBLOCK
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_UNBLOCK]                            = {
          processor : onFriendChatUnblock
      };

      //PACKET TYPE(29) : FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION
      responseMethodMap[PACKET_TYPES.FRIEND_CHAT_BLOCK_UNBLOCK_CONFIRMATION]         = {
          processor : onFriendChatBlockUnblockConfirmation
      };

      //PACKET TYPE(41) : TAG_CHAT_TAG_REGISTER
      responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_REGISTER]                          = {
          processor : onTagChatTagRegister
      };

      //PACKET TYPE(42) : TAG_CHAT_TAG_UNREGISTER
      responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_UNREGISTER]                        = {
          processor : onTagChatTagUnregister
      };

      //PACKET TYPE(43) : TAG_CHAT_TAG_REGISTER_CONFIRMATION
      responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_REGISTER_CONFIRMATION]             = {
          processor : onTagChatTagRegisterConfirmation
      };

      //PACKET TYPE(46) : TAG_CHAT_TAG_INFORMATION
      responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_INFORMATION]                       = {
          processor : onTagChatTagInformation
      };

      //PACKET TYPE(47) : TAG_CHAT_TAG_INFORMATION_CONFIRMATION
      responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_INFORMATION_CONFIRMATION]          = {
          processor : onTagChatTagInformationConfirmation
      };

      //PACKET TYPE(51) : TAG_CHAT_TAG_MEMBER_ADD
      responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_MEMBER_ADD]                        = {
          processor : onTagChatTagMemberAdd
      };

      //PACKET TYPE(52) : TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION
      responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_MEMBER_ADD_CONFIRMATION]           = {
          processor : onTagChatTagMemberAddConfirmation
      };

      //PACKET TYPE(53) : TAG_CHAT_MEMBER_REMOVE_LEAVE
      responseMethodMap[PACKET_TYPES.TAG_CHAT_MEMBER_REMOVE_LEAVE]                   = {
          processor : onTagChatMemberRemoveLeave
      };

      //PACKET TYPE(54) : TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION
      responseMethodMap[PACKET_TYPES.TAG_CHAT_MEMBER_REMOVE_LEAVE_CONFIRMATION]      = {
          processor : onTagChatMemberRemoveLeaveConfirmation
      };

      //PACKET TYPE(55) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE
      responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE]                = {
          processor : onTagChatTagMemberTypeChange
      };

      //PACKET TYPE(56) : TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION
      responseMethodMap[PACKET_TYPES.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE_CONFIRMATION]   = {
          processor : onTagChatTagMemberTypeChangeConfirmation
      };

      //PACKET TYPE(61) : TAG_CHAT_IDLE
      responseMethodMap[PACKET_TYPES.TAG_CHAT_IDLE]                                  = {
          processor : onTagChatIdle
      };

      //PACKET TYPE(62) : TAG_CHAT_TYPING
      responseMethodMap[PACKET_TYPES.TAG_CHAT_TYPING]                                = {
          processor : onTagChatTyping
      };

      //PACKET TYPE(63) : TAG_CHAT_MSG
      responseMethodMap[PACKET_TYPES.TAG_CHAT_MSG]                                   = {
          processor : onTagChatMsg
      };

      //PACKET TYPE(64) : TAG_CHAT_MSG_EDIT
      responseMethodMap[PACKET_TYPES.TAG_CHAT_MSG_EDIT]                              = {
          processor : onTagChatMsgEdit
      };

      //PACKET TYPE(65) : TAG_CHAT_BROKEN_MSG
      responseMethodMap[PACKET_TYPES.TAG_CHAT_BROKEN_MSG]                            = {
          processor : onTagChatBrokenMsg
      };

      //PACKET TYPE(66) : TAG_CHAT_BROKEN_MSG_EDIT
      responseMethodMap[PACKET_TYPES.TAG_CHAT_BROKEN_MSG_EDIT]                       = {
          processor : onTagChatBrokenMsgEdit
      };

      //PACKET TYPE(67) : TAG_CHAT_MULTIPLE_MSG
      responseMethodMap[PACKET_TYPES.TAG_CHAT_MULTIPLE_MSG]                          = {
          processor : onTagChatMultipleMsg
      };

      //PACKET TYPE(68) : TAG_CHAT_DELIVERED
      responseMethodMap[PACKET_TYPES.TAG_CHAT_DELIVERED]                             = {
          processor : onTagChatDelivered
      };

      //PACKET TYPE(69) : TAG_CHAT_SENT
      responseMethodMap[PACKET_TYPES.TAG_CHAT_SENT]                                  = {
          processor : onTagChatSent
      };

      //PACKET TYPE(70) : TAG_CHAT_SEEN
      responseMethodMap[PACKET_TYPES.TAG_CHAT_SEEN]                                  = {
          processor : onTagChatSeen
      };

      //PACKET TYPE(71) : TAG_CHAT_SEEN_CONFIRMATION
      responseMethodMap[PACKET_TYPES.TAG_CHAT_SEEN_CONFIRMATION]                     = {
          processor : onTagChatSeenConfirmation
      };

      //PACKET TYPE(72) : TAG_CHAT_MULTIPLE_MSG_DELETE
      responseMethodMap[PACKET_TYPES.TAG_CHAT_MULTIPLE_MSG_DELETE]                   = {
          processor : onTagChatMultipleMsgDelete
      };

      //PACKET TYPE(73) : TAG_CHAT_MSG_DELETE_CONFIRMATION
      responseMethodMap[PACKET_TYPES.TAG_CHAT_MSG_DELETE_CONFIRMATION]               = {
          processor : onTagChatMsgDeleteConfirmation
      };

      //PACKET TYPE(74) : TAG_CHAT_GENERAL_BROKEN_PACKET
      responseMethodMap[PACKET_TYPES.TAG_CHAT_GENERAL_BROKEN_PACKET]                 = {
          processor : onTagChatGeneralBrokenPacket
      };

      //PACKET TYPE(75) : TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION
      responseMethodMap[PACKET_TYPES.TAG_CHAT_GENERAL_BROKEN_PACKET_CONFIRMATION]    = {
          processor : onTagChatGeneralBrokenPacketConfirmation
      };

      //PACKET TYPE(91) : OFFLINE_FRIEND_INFORMATION
      responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_INFORMATION]                     = {
          processor : onOfflineFriendInformation
      };

      //PACKET TYPE(92) : OFFLINE_FRIEND_INFORMATION_CONFIRMATION
      responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_INFORMATION_CONFIRMATION]        = {
          processor : onOfflineFriendInformationConfirmation
      };

      //PACKET TYPE(93) : OFFLINE_GET_REQUEST
      responseMethodMap[PACKET_TYPES.OFFLINE_GET_REQUEST]                            = {
          processor : onOfflineGetRequest
      };

      //PACKET TYPE(94) : OFFLINE_GET_REQUEST_CONFIRMATION
      responseMethodMap[PACKET_TYPES.OFFLINE_GET_REQUEST_CONFIRMATION]               = {
          processor : onOfflineGetRequestConfirmation
      };

      //PACKET TYPE(95) : OFFLINE_FRIEND_UNREAD_MESSAGE
      responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_UNREAD_MESSAGE]                  = {
          processor : onOfflineFriendUnreadMessage
      };

      //PACKET TYPE(96) : OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION
      responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION]     = {
          processor : onOfflineFriendUnreadMessageConfirmation
      };

      //PACKET TYPE(97) : OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST
      responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE_REQUEST]         = {
          processor : onOfflineFriendHistoryMessageRequest
      };

      //PACKET TYPE(98) : OFFLINE_FRIEND_HISTORY_MESSAGE
      responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE]                 = {
          processor : onOfflineFriendHistoryMessage
      };

      //PACKET TYPE(99) : OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION
      responseMethodMap[PACKET_TYPES.OFFLINE_FRIEND_HISTORY_MESSAGE_CONFIRMATION]    = {
          processor : onOfflineFriendHistoryMessageConfirmation
      };

      //PACKET TYPE(100) : OFFLINE_GET_FRIEND_MESSAGE_STATUS
      responseMethodMap[PACKET_TYPES.OFFLINE_GET_FRIEND_MESSAGE_STATUS]              = {
          processor : onOfflineGetFriendMessageStatus
      };

      //PACKET TYPE(101) : OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION
      responseMethodMap[PACKET_TYPES.OFFLINE_GET_FRIEND_MESSAGE_STATUS_CONFIRMATION] = {
          processor : onOfflineGetFriendMessageStatusConfirmation
      };

      //PACKET TYPE(104) : OFFLINE_TAG_INFORMATION_ACTIVITY
      responseMethodMap[PACKET_TYPES.OFFLINE_TAG_INFORMATION_ACTIVITY]               = {
          processor : onOfflineTagInformationActivity
      };

      //PACKET TYPE(105) : OFFLINE_MY_TAG_LIST
      responseMethodMap[PACKET_TYPES.OFFLINE_MY_TAG_LIST]                            = {
          processor : onOfflineMyTagList
      };

      //PACKET TYPE(106) : OFFLINE_TAG_UNREAD_MESSAGE
      responseMethodMap[PACKET_TYPES.OFFLINE_TAG_UNREAD_MESSAGE]                     = {
          processor : onOfflineTagUnreadMessage
      };

      //PACKET TYPE(107) : OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION
      responseMethodMap[PACKET_TYPES.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION]        = {
          processor : onOfflineTagUnreadMessageConfirmation
      };

      //PACKET TYPE(108) : OFFLINE_TAG_CREATE_TAG
      responseMethodMap[PACKET_TYPES.OFFLINE_TAG_CREATE_TAG]                         = {
          processor : onOfflineTagCreateTag
      };

      //PACKET TYPE(109) : OFFLINE_TAG_CREATE_TAG_CONFIRMATION
      responseMethodMap[PACKET_TYPES.OFFLINE_TAG_CREATE_TAG_CONFIRMATION]            = {
          processor : onOfflineTagCreateTagConfirmation
      };

      //PACKET TYPE(110) : OFFLINE_TAG_HISTORY_MESSAGE_REQUEST
      responseMethodMap[PACKET_TYPES.OFFLINE_TAG_HISTORY_MESSAGE_REQUEST]            = {
          processor : onOfflineTagHistoryMessageRequest
      };

      //PACKET TYPE(111) : OFFLINE_TAG_HISTORY_MESSAGE
      responseMethodMap[PACKET_TYPES.OFFLINE_TAG_HISTORY_MESSAGE]                    = {
          processor : onOfflineTagHistoryMessage
      };

      //PACKET TYPE(112) : OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS
      responseMethodMap[PACKET_TYPES.OFFLINE_GET_TAG_INFORMATION_WITH_MEMBERS]       = {
          processor : onOfflineGetTagInformationWithMembers
      };

      //PACKET TYPE(113) : OFFLINE_TAG_INFORMATION_WITH_MEMBERS
      responseMethodMap[PACKET_TYPES.OFFLINE_TAG_INFORMATION_WITH_MEMBERS]           = {
          processor : onOfflineTagInformationWithMembers
      };

      //PACKET TYPE(117) : OFFLINE_TAG_CONFIRMATION
      responseMethodMap[PACKET_TYPES.OFFLINE_TAG_CONFIRMATION]                       = {
          processor : onOfflineTagConfirmation
      };

      //PACKET TYPE(118) : OFFLINE_BROKEN_HISTORY_PACKET
      responseMethodMap[PACKET_TYPES.OFFLINE_BROKEN_HISTORY_PACKET]                  = {
          processor : onOfflineBrokenHistoryPacket
      };

      //PACKET TYPE(119) : OFFLINE_BROKEN_PACKET
      responseMethodMap[PACKET_TYPES.OFFLINE_BROKEN_PACKET]                          = {
          processor : onOfflineBrokenPacket
      };

      //PACKET TYPE(120) : OFFLINE_BROKEN_PACKET_CONFIRMATION
      responseMethodMap[PACKET_TYPES.OFFLINE_BROKEN_PACKET_CONFIRMATION]             = {
          processor : onOfflineBrokenPacketConfirmation
      };


      return {
          processUpdates : processUpdates
      }

    }

