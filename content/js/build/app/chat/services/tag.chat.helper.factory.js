
    angular
        .module('ringid.chat')
        .factory('tagChatHelper', tagChatHelper);

    tagChatHelper.$inject = [
            'CHAT_LANG',
            'Auth',
            'tagChatFactory',
            'userFactory',
            'userService',
            'Utils'
        ];

    function tagChatHelper (
            CHAT_LANG,
            Auth,
            tagChatFactory,
            userFactory,
            userService,
            Utils

    ) {

        var Constants = CHAT_APP.Constants;
        var SharedHelpers = CHAT_APP.SharedHelpers;
        var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
        var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES;

        var TAG_CHAT_LANG = CHAT_LANG.TAG;

        return {
            getTagChatStatusMessage : _getTagChatStatusMessage,
            getTagEmptyMessageObject : _getTagEmptyMessageObject,

        };

        ///////////////////

        function _getLanguageTemplate(selfUser, messageUser, memberShipType){


        }

        function __getMemberType(statusType){
            var memberType;

            if( statusType === GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_ADD){

                memberType = 'member';

            }else if(  statusType === GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_ADMIN_ADD){

                memberType = 'admin';
            }
            return memberType;
        }


        function __getTagMemberName(tagObject, userId){
            var memberObject = tagObject.getMember(userId);
            if(!memberObject){
                var user = userFactory.getUser(userId);
                if( !user || user.getName() == ""){
                    return userId;
                }else{
                    return user.getName();
                }

            }else{
                return memberObject.getName();
            }

        }

        function _getTagChatStatusMessage(chatMessageObject){
            var currentUser = Auth.currentUser(),
                currentUserId = currentUser.getKey(),
                statusMessage = "",
                firstName = '',
                allNameJoined = '',
                totalMinusOne = chatMessageObject.usersToChange.length - 1,
                senderFullName = chatMessageObject.fullName,
                senderUserId = chatMessageObject.userId,
                groupNewName = chatMessageObject.tagName,
                tagId,  tagObject,  isSelf;


            tagId = chatMessageObject.tagId;
            tagObject =tagChatFactory.getOrCreateTag(tagId);
            isSelf = currentUser.getKey() === chatMessageObject.userId.toString();

            if(!tagObject){
                return;
            }

            if( !senderFullName){
                senderFullName = __getTagMemberName(tagObject, chatMessageObject.userId);
            }

            var usersToChangeNames = [];
            var usersFetchCount = 0;

            chatMessageObject.usersToChange.forEach(function(aUserToChange){

                var user = userFactory.getUser(aUserToChange);

                if( !!user && user.getName() != ''){

                    usersToChangeNames.push(user.getName());
                    usersFetchCount++;

                }else{

                    var name = __getTagMemberName(tagObject, aUserToChange);
                    usersToChangeNames.push(name);
                }

            });

            

            if( usersFetchCount == chatMessageObject.usersToChange.length){
                chatMessageObject.allStatusUserFetched = true;
            }

            if( usersToChangeNames.length > 0){
                firstName = usersToChangeNames[0];
            }else{
                firstName = chatMessageObject.usersToChange[0];
            }

            allNameJoined = usersToChangeNames.slice(1).join(', ').replace("\"", "'");

            var templateParams = {};
            var langTemplate = TAG_CHAT_LANG.STATUS_MESSAGES;
            var langTemplateString, memberType;

            switch (chatMessageObject.statusType){

                case GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_ADD:

                case GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_ADMIN_ADD:

                    memberType = __getMemberType(chatMessageObject.statusType);

                    templateParams.member_name = senderFullName;
                    templateParams.new_member_name = (firstName == currentUser.getName() ) ? 'you' : firstName;
                    templateParams.new_member_type = memberType;
                    templateParams.rest_count = "<a href='javascript:void(0);' title='{0}'>{1} others</a>".format(allNameJoined, totalMinusOne);

                    if( isSelf ){

                        if(!totalMinusOne){
                            langTemplateString = langTemplate.SELF_ADD_MEMBER;
                        }else{
                            langTemplateString = langTemplate.SELF_ADD_MULTIPLE_MEMBER;
                        }

                    }else{

                        if(!totalMinusOne){
                            langTemplateString = langTemplate.OTHER_ADD_MEMBER;
                        }else{
                            langTemplateString = langTemplate.OTHER_ADD_MULTIPLE_MEMBER;
                        }
                    }


                    break;

                case GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_DELETE:

                    templateParams.member_name = senderFullName;
                    templateParams.old_member_name = (firstName == currentUser.getName() ) ? 'you' : firstName;;
                    templateParams.rest_count = "<a href='javascript:void(0);' title='{0}'>{1} others</a>".format(allNameJoined, totalMinusOne);

                    if( isSelf ){

                        if(!totalMinusOne){

                            if( firstName === senderFullName ){
                                langTemplateString = langTemplate.SELF_LEAVE_GROUP;
                            }else{
                                langTemplateString = langTemplate.SELF_REMOVE_MEMBER;
                            }

                        }else{
                            langTemplateString = langTemplate.SELF_REMOVE_MULTIPLE_MEMBER;
                        }

                    }else{

                        if(!totalMinusOne){

                            if( firstName === senderFullName ){
                                langTemplateString = langTemplate.OTHER_LEAVE_GROUP;
                            }else{
                                langTemplateString = langTemplate.OTHER_REMOVE_MEMBER;
                            }

                        }else{
                            langTemplateString = langTemplate.OTHER_REMOVE_MULTIPLE_MEMBER;
                        }
                    }


                    break;

                case GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_LEAVE:

                    templateParams.member_name = senderFullName;

                    if( isSelf ){

                        langTemplateString = langTemplate.SELF_LEAVE_GROUP;

                    }else{

                       langTemplateString = langTemplate.OTHER_LEAVE_GROUP;
                    }



                    break;

                case GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_STATUS_CHANGE_ADMIN:

                    templateParams.member_name = senderFullName;
                    templateParams.rest_count = "<a href='javascript:void(0);' title='{0}'>{1} others</a>".format(allNameJoined, totalMinusOne);

                    if( firstName !== currentUser.getName() ){
                        templateParams.old_member_name = firstName;
                    }else{
                        templateParams.old_member_name = 'you';
                    }

                    if( isSelf ){

                        if(!totalMinusOne){
                            langTemplateString = langTemplate.SELF_MEMBER_CHANGE_TO_ADMIN;
                        }else{
                            langTemplateString = langTemplate.SELF_MULTIPLE_MEMBER_CHANGE_TO_ADMIN;
                        }

                    }else{

                        if(!totalMinusOne){
                            langTemplateString = langTemplate.OTHER_MEMBER_CHANGE_TO_ADMIN;
                        }else{
                            langTemplateString = langTemplate.OTHER_MULTIPLE_MEMBER_CHANGE_TO_ADMIN;
                        }
                    }


                    break;

                case GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_STATUS_CHANGE_MEMBER:

                    templateParams.admin_name = senderFullName;

                    if( firstName !== currentUser.getName() ){
                        templateParams.old_admin_name = firstName;
                    }else{
                        templateParams.old_admin_name = 'you';
                    }


                    templateParams.rest_count = "<a href='javascript:void(0);' title='{0}'>{1} others</a>".format(allNameJoined, totalMinusOne);


                    if( isSelf ){

                        if(!totalMinusOne){

                            if( firstName === senderFullName ){
                                langTemplateString = langTemplate.SELF_REMOVED_FROM_ADMIN_BY_SELF;
                            }else{
                                langTemplateString = langTemplate.SELF_ADMIN_CHANGE_TO_MEMBER;
                            }


                        }else{
                            langTemplateString = langTemplate.SELF_MULTIPLE_ADMIN_CHANGE_TO_MEMBER;
                        }

                    }else{

                        if(!totalMinusOne){

                            if( firstName === senderFullName ){
                                langTemplateString = langTemplate.OTHER_REMOVED_FROM_ADMIN_BY_SELF;
                            }else{
                                langTemplateString = langTemplate.OTHER_ADMIN_CHANGE_TO_MEMBER;
                            }

                        }else{
                            langTemplateString = langTemplate.OTHER_MULTIPLE_ADMIN_CHANGE_TO_MEMBER;
                        }
                    }

                    break;

                case GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_MEMBER_STATUS_CHANGE_OWNER:

                    templateParams.member_name = senderFullName;
                    templateParams.admin_name = firstName;

                    if( firstName !== currentUser.getName() ){

                        langTemplateString = langTemplate.OTHER_USER_ADDED_AS_OWNER;
                    }else{

                        langTemplateString = langTemplate.SELF_USER_ADDED_AS_OWNER;
                    }


                    break;

                case GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_INFO_UPDATED:

                    templateParams.member_name = senderFullName;
                    templateParams.group_name = groupNewName;

                    if( isSelf ){

                        langTemplateString = langTemplate.SELF_UPDATE_GROUP_INFO;

                    }else{

                        langTemplateString = langTemplate.OTHER_UPDATE_GROUP_INFO;
                    }


                    break;

                case GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_NAME_CHANGE:

                    templateParams.member_name = senderFullName;
                    templateParams.group_name = groupNewName;

                    if( isSelf ){

                        langTemplateString = langTemplate.SELF_RENAME_GROUP;

                    }else{

                        langTemplateString = langTemplate.OTHER_RENAME_GROUP;
                    }

                    break;

                case GENERAL_CONSTANTS.STATUS_MESSAGE_TYPES.TAG_PICTURE_CHANGE:

                    templateParams.member_name = senderFullName;
                    templateParams.group_name = groupNewName;

                    if( isSelf ){

                        langTemplateString = langTemplate.SELF_CHANGE_GROUP_PIC;

                    }else{

                        langTemplateString = langTemplate.OTHER_CHANGE_GROUP_PIC;
                    }

                    break;

            }

            if(!!langTemplateString){
                statusMessage = langTemplateString.supplant(templateParams);
            }

            return statusMessage;

        }

        function _getTagEmptyMessageObject(tagId){
            var currentUser = Auth.currentUser(),
                currentUserId = currentUser.getKey();

            var object = {
                tagId : tagId,
                userId : currentUser.getKey(),
                fullName : currentUser.getName(),
                message : ' ',
                messageDate : new Date().getTime(),
                messageType : GENERAL_CONSTANTS.MESSAGE_TYPES.BLANK_MESSAGE,
                packetId : CHAT_APP.UTILS.getUUIDPacketId()
            };

            var tagMessageObject = tagChatFactory.createNewTagMessage(tagId, object);
            return tagMessageObject;

        }




    }
