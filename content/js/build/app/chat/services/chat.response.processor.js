
    var chatApp;
    try {
        chatApp = angular.module('ringid.chat');
    } catch (e) {
      console.log(e);
    }

    chatApp.factory('ChatResponseProcessor', ChatResponseProcessor);

    ChatResponseProcessor.$inject = ['tagChatFactory', 'Auth',
    'ChatFactory', 'chatHistoryFactory', 'CHAT_LANG', 'Utils', 'tagChatUI', 'SystemEvents'];

    function ChatResponseProcessor(tagChatFactory, Auth,
        ChatFactory, chatHistoryFactory, CHAT_LANG, Utils, tagChatUI, SystemEvents) {

        var Constants = window.CHAT_APP.Constants;
        var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;

        var CHAT_LANG = CHAT_LANG.CHAT;

        function _getBox( boxId , nonDomBoxValue, isTagChat){

            var box = ChatFactory.getBoxByUId(boxId);
            //if user closes the box in the mean time then reopen it
            if(!box){
                ChatFactory.creatNonDomBox(boxId, isTagChat);//false for isTagChat flag
                box = ChatFactory.getBoxByUId(boxId);
                box.nonDomBox = nonDomBoxValue || false;//we don't want to reopen and show the box to user for getting deliver/seen/delete packet

                chatHistoryFactory.updateBox(box);
            }

            return box;
        }


        function _doUnRegisterTask( boxId ){
            CHAT_SESSION.UnRegister( boxId );
        }

        function _getMessageStatus(statusNo){

            var statusValue = GENERAL_CONSTANTS.MESSAGE_STATUS_VALUE[statusNo];

            if( !!statusValue){
                statusValue =  statusValue.charAt(0) + statusValue.substr(1).toLowerCase();
            }

            return statusValue
        }

        function _doOnMessageTypeDeleteMessage( boxId, userId, packetId, msgObject, chatBox ){

            if( !chatBox ){
                chatBox = ChatFactory.getBoxByUId( boxId );
            }

            if( userId == Auth.currentUser().getKey() ){

              if( chatBox ){
                  chatBox.removeMessage( packetId );
              }

              chatHistoryFactory.removeMessage( packetId, boxId );

            }else{

              var localMsgObj, needToAdd=false;
              if( chatBox ){
                  localMsgObj = chatBox.getMessage( packetId );

              }else{
                  localMsgObj = chatHistoryFactory.getMessage( boxId, packetId );
              }

              if( !localMsgObj ){

                localMsgObj = msgObject;
                needToAdd  = true;
              }

              localMsgObj.messageType = GENERAL_CONSTANTS.MESSAGE_TYPES.DELETE_MESSAGE;
              localMsgObj.message =  CHAT_LANG.MESSAGE_DELETE_TEXT;
              localMsgObj.status = 'Deleted';


              if( chatBox){
                if( needToAdd ){
                    chatBox.pushMessage(localMsgObj, userId);
                }
              }else{
                chatHistoryFactory.updateMessage(localMsgObj, boxId);
              }

            }
        }



        /**************************** FRIEND RESPONSE PROCESSORS ************************/

        function _getFriendBoxId( userId, friendId ){
            var boxId;
            if( userId == Auth.currentUser().getKey() ){
                boxId = friendId;
            }else{
                boxId = userId;
            }

            return boxId;
        }

        function _getFriendBox( boxId , nonDomBoxValue){
            return _getBox(boxId, nonDomBoxValue, false);
        }

        function _updateMessageStatusToDelivered( boxId, msgObj ){
            if(!!msgObj){
                if( msgObj.status != 'Seen' && msgObj.status != 'Deleted'
                    && msgObj.status != 'Viewed' && msgObj.status != 'Played'){
                    msgObj.status = 'Delivered';
                }
                chatHistoryFactory.updateMessage(msgObj, boxId );
            }
        }

        function _doFriendUnregisterTask( friendId ){
            _doUnRegisterTask( friendId );
        }


        /**************************** GROUP RESPONSE PROCESSORS ************************/

        function _getTagChatBox(tagId, nonDomBoxValue, tagObject){
            if(!tagObject){
                tagObject = tagChatFactory.getTag(tagId);
            }

            var chatBox = _getBox(tagId, nonDomBoxValue, true)

            if( !!tagObject ){
                chatBox.setTitle(tagObject.getTagName());
            }

            return chatBox;
        }

        function _doTagUnregisterTask( tagId ){
            _doUnRegisterTask( tagId );
        }

        function _processTagMemberAddUpdate( responseObject ){
            var userId     = responseObject.userId,
                tagId      = responseObject.tagId,
                tagMembers = responseObject.tagMembers,
                packetId   = responseObject.packetId;

            var tagObject,
                messageDate = responseObject.messageDate || null;

            tagObject = tagChatFactory.getOrCreateTag(tagId);

            tagChatUI.showTagMembersAddStatusMessage(tagId,
                userId,
                tagMembers,
                messageDate,
                responseObject.fromHistory,
                packetId,
                tagObject
            );

            if(!!tagObject && !responseObject.fromHistory){
                _addMembersToTagObject(tagObject, tagMembers, userId);
            }
        }

        function _processTagMemberRemoveLeave( responseObject ){

            var userId     = responseObject.userId,
                tagId      = responseObject.tagId,
                tagMembers = responseObject.tagMembers,
                packetId   = responseObject.packetId;

            var tagObject, currentUserRemoved,
            messageDate = responseObject.messageDate || null;

            delete responseObject.packetId;

            tagObject = tagChatFactory.getOrCreateTag(tagId);

            tagChatUI.showTagMembersRemoveStatusMessage( tagId,
                userId,
                tagMembers,
                messageDate,
                responseObject.fromHistory,
                packetId,
                tagObject
            );

            if( !responseObject.fromHistory ){
                currentUserRemoved = _removeMembersFromTagObject(tagObject, tagMembers);
                if( currentUserRemoved ){
                    _doAfterCurrentUserRemovedFromTag( tagId );
                    //todo do chat unregister task
                    _doTagUnregisterTask( tagId );
                }
            }

        }

        function _processTagInformation( responseObject ){
            var userId        = responseObject.userId,
                tagId         = responseObject.tagId,
                activityType  = responseObject.activityType,
                tagName       = responseObject.tagName,
                tagPictureUrl = responseObject.tagPictureUrl,
                packetId      = responseObject.packetId;

            /* method body */
            var oldTagObject = tagChatFactory.getTag(tagId);
            var aNewTag;

            if(!!oldTagObject){
                tagChatUI.showTagInfoChangeStatusMessage(tagId,
                    responseObject.userId,
                    responseObject,
                    responseObject.fromHistory
                );

                if( !responseObject.fromHistory){
                    aNewTag = tagChatFactory.updateTag(tagId, responseObject, oldTagObject);
                }


            }else{

                if( !responseObject.fromHistory) {
                    aNewTag = tagChatFactory.createNewTag(responseObject);
                    tagChatFactory.addTagObject(aNewTag);
                }
            }

            Utils.triggerCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED);

        }

        function _processTagMemberStatusChange( responseObject ){
            var userId     = responseObject.userId,
            tagId      = responseObject.tagId,
            tagMembers = responseObject.tagMembers,
            packetId   = responseObject.packetId;

            /* method body */
            var tagObject,
                messageDate = responseObject.messageDate || null;


            tagObject = tagChatFactory.getOrCreateTag(tagId);

            tagChatUI.showMemberTypeChangeStatusMessage(tagId,
                userId,
                tagMembers,
                messageDate,
                responseObject.fromHistory,
                packetId
            );

            if( !responseObject.fromHistory){
                _updateMemberStatusInTagObject(tagObject, tagMembers);
            }

            //Utils.triggerCustomEvent(SystemEvents.CHAT.MESSAGE_RECEIVED,{ boxId : tagId });

        }

        function _processTagCreate( responseObject ){

            var box = _getTagChatBox( responseObject.tagId );
            box.updateBoxMessageMinMaxPacketId( responseObject );

        }

        function _processAGroupActivity(tagId, packetId, activityItem){
            /*
            * activityItem signature : { changedByUserId:'', userId : '', status : '', activityValue : '' }
            *
            * */

            if( activityItem.changedByUserId == activityItem.userId
                && activityItem.status == GENERAL_CONSTANTS.MEMBER_STATUS.OWNER ){
                /* case : IbrahimRashid made IbrahimRashid owner */
                return;
            }

            switch (activityItem.activityType){

                case GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.DELETED :
                    _processTagMemberRemoveLeave( {

                        userId : activityItem.changedByUserId,
                        packetId : packetId,
                        tagId : tagId,
                        messageDate : activityItem.activityDate,
                        tagMembers : [{userId: activityItem.userId}],
                        fromHistory : activityItem.fromHistory

                    });
                    break;
                case GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.ADDED :
                    _processTagMemberAddUpdate({

                        userId : activityItem.changedByUserId,
                        packetId : packetId,
                        tagId : tagId,
                        messageDate : activityItem.activityDate,
                        tagMembers : [{userId: activityItem.userId, status : activityItem.status, fullName : activityItem.activityValue}],
                        fromHistory : activityItem.fromHistory
                    });
                    break;
                case GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.LEAVE :
                    _processTagMemberRemoveLeave( {

                        userId : activityItem.changedByUserId,
                        packetId : packetId,
                        tagId : tagId,
                        messageDate : activityItem.activityDate,
                        tagMembers : [{userId: activityItem.userId}],
                        fromHistory : activityItem.fromHistory

                    });
                    break;
                case GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.TAG_RENAME:
                    _processTagInformation({
                        userId : activityItem.changedByUserId,
                        packetId : packetId,
                        tagId : tagId,
                        messageDate : activityItem.activityDate,
                        tagName : activityItem.activityValue,
                        fromHistory : activityItem.fromHistory

                    });
                    break;
                case GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.MEMBER_TYPE_CHANGE :
                    _processTagMemberStatusChange({
                        userId : activityItem.changedByUserId,
                        packetId : packetId,
                        tagId : tagId,
                        messageDate : activityItem.activityDate,
                        tagMembers : [{userId: activityItem.userId, status : activityItem.status }],
                        fromHistory : activityItem.fromHistory
                    });
                    break;
                case GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.TAG_URL_RENAME :
                    _processTagInformation({
                        userId : activityItem.changedByUserId,
                        packetId : packetId,
                        tagId : tagId,
                        messageDate : activityItem.activityDate,
                        tagPictureUrl : activityItem.activityValue,
                        fromHistory : activityItem.fromHistory
                    });

                    break;

                case GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.TAG_CREATED :
                    _processTagCreate({
                        userId : activityItem.changedByUserId,
                        packetId : packetId,
                        tagId : tagId,
                        messageDate : activityItem.activityDate,
                        tagName : activityItem.activityValue,
                        tagMembers : [],
                        fromHistory : activityItem.fromHistory
                    });
                    break;
            }
        }

        function _processGroupActivityMessage(groupActivityMessage){

            

            var activityType = groupActivityMessage.packetType;
            var userId = groupActivityMessage.userId;
            var tagId = groupActivityMessage.tagId;
            var packetId = groupActivityMessage.packetId;
            var activityDate = groupActivityMessage.messageDate;

            var message;
            try{
                message = angular.fromJson(groupActivityMessage.message);
            }catch(e){
                
                return;
            }

            var activityItem = {
                changedByUserId : groupActivityMessage.userId,
                userId          : message.mId,
                status          : message.mT,
                activityValue   : message.n,
                activityType    : activityType,
                activityDate    : activityDate,
                fromHistory     : groupActivityMessage.fromHistory || false
            };

            _processAGroupActivity(tagId, packetId, activityItem);
        }

        function _doAfterCurrentUserRemovedFromTag(tagId){
            var chatBox = ChatFactory.getBoxByUId(tagId);

            if(!!chatBox){
                ChatFactory.closeChatBox(chatBox.getKey()); //removes corresponding box from boxes stack using userId which is the key
                chatHistoryFactory.removeOpenBox(chatBox.getKey());
            }
        }

        function _addMembersToTagObject(aTag, members, addedByUserId){

//            if( members.length == 1){
//                tagChatFactory.removeTagObject(aTag.getTagId());
//                return;
//            }

            for(var tagMemberIndex = 0;tagMemberIndex < members.length; tagMemberIndex++ ){
                var memberObject = members[tagMemberIndex];
                if(!!addedByUserId){
                    memberObject.addedBy = addedByUserId;
                }

                var tagMemberObject = tagChatFactory.createNewTagMember( aTag.getTagId(), memberObject, false );
                if( !tagMemberObject.isRemoved()){
                    aTag.addMember( tagMemberObject );
                }

            }
        }

        function _removeMembersFromTagObject(aTag, tagMembers){
            var hasCurrentUser = false;
            for(var index = 0; index < tagMembers.length; index++){
                var tagMemberObject = aTag.getMember(tagMembers[index].userId);
                if(!!tagMemberObject){
                    hasCurrentUser = tagMemberObject.isCurrentUser();
                    aTag.removeMember(tagMemberObject);
                }
            }
            return hasCurrentUser;
        }

        function _updateMemberStatusInTagObject(aTag, tagMembers){
            for( var index = 0; index < tagMembers.length; index++ ){
                var aTagMember = tagMembers[index];

                if( !!aTag){
                    var tagMemberObject = aTag.getMember(aTagMember.userId);
                    if( !!tagMemberObject){
                        tagMemberObject.setStatus(aTagMember.status);
                    }
                }
            }
        }

        return {

            doFriendUnregisterTask         : _doFriendUnregisterTask,
            getFriendBoxId                 : _getFriendBoxId,
            getFriendBox                   : _getFriendBox,
            updateMessageStatusToDelivered : _updateMessageStatusToDelivered,
            doOnMessageTypeDeleteMessage   : _doOnMessageTypeDeleteMessage,
            getMessageStatus               : _getMessageStatus,

            doTagUnregisterTask            : _doTagUnregisterTask,
            getTagChatBox                  : _getTagChatBox,
            processAGroupActivity          : _processAGroupActivity,
            processGroupActivityMessage    : _processGroupActivityMessage,
            addMembersToTagObject          : _addMembersToTagObject,
            removeMembersFromTagObject     : _removeMembersFromTagObject,
            updateMemberStatusInTagObject  : _updateMemberStatusInTagObject,

            processTagMemberAddUpdate      : _processTagMemberAddUpdate,
            processTagMemberRemoveLeave    : _processTagMemberRemoveLeave,
            processTagInformation          : _processTagInformation,
            processTagMemberStatusChange   : _processTagMemberStatusChange
        }

    }

