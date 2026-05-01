
    angular
        .module('ringid.chat')
        .factory('tagChatUI', tagChatUI);

    tagChatUI.$inject = [
            'ChatFactory',
            'Utils',
            'chatHistoryFactory',
            'tagChatFactory',
            'Ringalert'
        ];

    function tagChatUI (

        ChatFactory,
        Utils,
        chatHistoryFactory,
        tagChatFactory,
        Ringalert

    ) {

        var Constants = CHAT_APP.Constants;
        var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;

        return {
            getTagInfoChangeStatusMessage : _getTagInfoChangeStatusMessage,
            showTagInfoChangeStatusMessage : _showTagInfoChangeStatusMessage,

            showMemberTypeChangeStatusMessage: _showMemberTypeChangeStatusMessage,

            showTagMembersAddStatusMessage : _showTagMembersAddStatusMessage,
            showTagMembersRemoveStatusMessage : _showTagMembersRemoveStatusMessage

        };

        ///////////////////

        function __getMemberStatusValue(memberStatusString){
            var memberStatusValue;

            if( memberStatusString=== 'admin'){
                memberStatusValue = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_STATUS_CHANGE_ADMIN;
            }else if( memberStatusString === 'member'){
                memberStatusValue = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_STATUS_CHANGE_MEMBER;
            }else{
                memberStatusValue = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_STATUS_CHANGE_OWNER;
            }

            return memberStatusValue;
        }

        function __getTagMemberByStatusGroup( changedTagMembers ){

            var statusChangeGroup = {};

            for(var index = 0; index < changedTagMembers.length; index++){
                var aTagMember = changedTagMembers[ index ];

                var statusValue;
                if( angular.isString(aTagMember.status)){
                    statusValue = __getMemberStatusValue(aTagMember.status);
                }else{
                    statusValue = aTagMember.status;
                }

                if(!statusChangeGroup[statusValue]){
                    statusChangeGroup[statusValue] = [];
                }

                statusChangeGroup[statusValue].push(aTagMember);
            }

            return statusChangeGroup;
        }


        function _showMemberTypeChangeStatusMessage(tagId, userId, changedTagMembers, messageDate, fromHistory, packetId){


            //if( !tagObject){
            //    tagObject = tagChatFactory.getTag(tagId);
            //}

            var chatBox = ChatFactory.getBoxByUId(tagId);

            var statusChangeGroup = __getTagMemberByStatusGroup(changedTagMembers);

            var restInfo = {};
            if( !!messageDate ){
                packetId = CHAT_APP.UTILS.getUUIDPacketId(messageDate, true);
                restInfo['messageDate'] = messageDate;
            }


            var packetIndex = 1;

            for( var statusType in statusChangeGroup){

                if( statusChangeGroup.hasOwnProperty(statusType) ){

                    if(!packetIndex){
                        packetId = packetId + '_'  + packetIndex;
                    }

                    var statusMessageType = "";

                    statusType = parseInt(statusType);

                    if( statusType === GENERAL_CONSTANTS.MEMBER_STATUS.ADMIN){
                        statusMessageType = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_STATUS_CHANGE_ADMIN;

                    }else if( statusType === GENERAL_CONSTANTS.MEMBER_STATUS.MEMBER ){

                        statusMessageType = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_STATUS_CHANGE_MEMBER;
                    }else{

                        statusMessageType = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_STATUS_CHANGE_OWNER;
                    }

                    var tagStatusMessage = tagChatFactory.createTagStatusMessage(
                        packetId,
                        tagId,
                        userId,
                        statusMessageType,
                        statusChangeGroup[statusType],
                        restInfo
                    );

                    if( !tagStatusMessage){ continue; }

                    var serializedStatusMessageObject = tagStatusMessage.serialize();


                    if(!chatBox){

                        chatHistoryFactory.addMessage(serializedStatusMessageObject, tagId);

                    }else{
                        serializedStatusMessageObject.fromHistory = fromHistory;
                        chatBox.pushMessage(serializedStatusMessageObject, userId);
                    }

                }
            }

        }


        function _getTagInfoChangeStatusMessage(tagId, changedTagInfo, tagObject){

            if( !tagObject){
                tagObject = tagChatFactory.getTag(tagId);
            }

            var tagStatusMessageType = 0;

            if( !!tagObject){

                if( ( !!changedTagInfo.tagName && !!changedTagInfo.tagPictureUrl )
                    &&
                    ( tagObject.getTagName() !== changedTagInfo.tagName
                        && tagObject.getPictureUrl() !== changedTagInfo.tagPictureUrl.trim()
                    )
                ){
                    tagStatusMessageType = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_INFO_UPDATED;

                }else{

                    if( !!changedTagInfo.tagName && tagObject.getTagName() !== changedTagInfo.tagName  ){
                        tagStatusMessageType = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_NAME_CHANGE;
                    }

                    if( !!changedTagInfo.tagPictureUrl && tagObject.getPictureUrl() !== changedTagInfo.tagPictureUrl.trim()  ){
                        tagStatusMessageType = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_PICTURE_CHANGE;
                    }
                }

            }

            return tagStatusMessageType;

        }

        function _showTagInfoChangeStatusMessage(tagId, userId, changedTagInfo, fromHistory, packetId, tagObject){

            if( !tagObject){
                tagObject = tagChatFactory.getTag(tagId);
            }

            if( !packetId ){
                packetId = CHAT_APP.UTILS.getUUIDPacketId();
            }

            var tagStatusMessageType = changedTagInfo.statusMessageType;
            if(!tagStatusMessageType){
                tagStatusMessageType = _getTagInfoChangeStatusMessage(tagId, changedTagInfo, tagObject);
            }

            if(!!changedTagInfo.messageDate){
                packetId = CHAT_APP.UTILS.getUUIDPacketId(changedTagInfo.messageDate, true);
            }

            if(tagStatusMessageType !== 0){

                var chatBox = ChatFactory.getBoxByUId(tagId);

                var tagStatusMessage = tagChatFactory.createTagStatusMessage(
                    packetId,
                    tagId,
                    userId,
                    tagStatusMessageType,
                    [],
                    changedTagInfo
                );

                if( !tagStatusMessage){ return; }

                var serializedStatusMessageObject = tagStatusMessage.serialize();

                if(!chatBox){

                    chatHistoryFactory.addMessage(serializedStatusMessageObject, tagId);

                }else{

                    serializedStatusMessageObject.fromHistory = fromHistory;
                    chatBox.pushMessage(serializedStatusMessageObject, userId);
                }

            }

        }

        function _showTagMembersAddStatusMessage(tagId, userId, changedMembers, messageDate, fromHistory, packetId, tagObject){

            if( !tagObject){
                tagObject = tagChatFactory.getTag(tagId);
            }

            var chatBox = ChatFactory.getBoxByUId(tagId);

            var changedMembersByStatus = __getTagMemberByStatusGroup(changedMembers);

            var restInfo = {};
            if( !!messageDate ){
                restInfo['messageDate'] = messageDate;
            }

            for( var statusType in changedMembersByStatus) {

                if (changedMembersByStatus.hasOwnProperty(statusType)) {

                    var typePacketId = packetId + '_' + statusType;

                    var statusMessageType = "";

                    statusType = parseInt(statusType);

                    if( statusType === GENERAL_CONSTANTS.MEMBER_STATUS.ADMIN){

                        statusMessageType = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_ADMIN_ADD;

                    }else if( statusType === GENERAL_CONSTANTS.MEMBER_STATUS.MEMBER ){

                        statusMessageType = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_ADD;

                    }else if( statusType === GENERAL_CONSTANTS.MEMBER_STATUS.OWNER ){

                        statusMessageType = GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_STATUS_CHANGE_OWNER;
                    }

                    var tagStatusMessage = tagChatFactory.createTagStatusMessage(
                        typePacketId,
                        tagId,
                        userId,
                        statusMessageType,
                        changedMembersByStatus[statusType],
                        restInfo
                    );

                    if( !tagStatusMessage){
                        continue;
                    }

                    var serializedStatusMessageObject = tagStatusMessage.serialize();

                    if(!chatBox){
                        chatHistoryFactory.addMessage(serializedStatusMessageObject, tagId);

                    }else{

                        serializedStatusMessageObject.fromHistory = fromHistory;
                        chatBox.pushMessage(serializedStatusMessageObject, userId);
                    }

                }
            }

        }


        function _showTagMembersRemoveStatusMessage(tagId, userId, changedMembers, messageDate, fromHistory, packetId, tagObject) {

            if (!tagObject) {
                tagObject = tagChatFactory.getTag(tagId);
            }

            if (!packetId) {
                packetId = CHAT_APP.UTILS.getUUIDPacketId(messageDate, true);
            }

            var chatBox = ChatFactory.getBoxByUId(tagId);

            for(var index = 0; index < changedMembers.length; index++){
                var tagMember = tagObject.getMember(changedMembers[index].userId);
                if(!!tagMember){
                    changedMembers[index].fullName = tagMember.getName();
                }

            }

            var restInfo = {};
            if( !!messageDate ){
                restInfo['messageDate'] = messageDate;
                packetId = CHAT_APP.UTILS.getUUIDPacketId(messageDate, true);
            }

            var tagStatusMessage = tagChatFactory.createTagStatusMessage(
                packetId,
                tagId,
                userId,
                GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_DELETE,
                changedMembers,
                restInfo
            );

            if( !tagStatusMessage){ return; }


            var serializedStatusMessageObject = tagStatusMessage.serialize();

            if (!chatBox) {
                chatHistoryFactory.addMessage(serializedStatusMessageObject, tagId);

            } else {
                serializedStatusMessageObject.fromHistory = fromHistory;
                chatBox.pushMessage(serializedStatusMessageObject, userId);
            }
        }





    }
