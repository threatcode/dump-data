


    angular.module('ringid.chat')
    .factory('ChatMap', [ '$$stackedMap','$interval', '$websocket','$rootScope','$sce',
            'Auth', 'ChatConnector',
            'userFactory', 'Utils', 'tagChatFactory',
            'chatHistoryFactory' ,'settings',
            'tagChatHelper', 'tagChatStorage',
            'ChatUtilsFactory', 'rgScrollbarService', 'chatTabSync', '$$mediaMap','SystemEvents',

        function ( $$stackedMap, $interval, $websocket, $rootScope,$sce,
            Auth, ChatConnector, userFactory, Utils, tagChatFactory,
            chatHistoryFactory, settings,
            tagChatHelper, tagChatStorage,
            ChatUtilsFactory, rgScrollbarService, chatTabSync, $$mediaMap, SystemEvents

        ) {

                var Constants =  CHAT_APP.Constants;
                var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES;
                var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
                var SharedHelpers = CHAT_APP.SharedHelpers;

                var getBasicMessageObject = function(message){

                    var key = message.key || message.packetId;
                    var mdate = message.messageDate || new Date().getTime();

                    var basicMsgObj = {
                        key: key.toString(),
                        packetId: key.toString(),
                        text: message.message || message.mg || message.text,
                        hrtime: ChatUtilsFactory.getChatVerbalDateFromServerDate(mdate),
                        status: message.status || 0,
                        fullName : message.fullName,
                        tagName : message.tagName || '',
                        messageDate: mdate,
                        isDeleted: false,
                        messageDateString: message.messageDateString || '',
                        timeout: message.timeout,
                        messageType: message.messageType,
                        tag_chat: message.tag_chat || false,
                        seenSent : message.seenSent || false,
                        isSecretVisible: message.isSecretVisible,
                        secretTimedOut : message.secretTimedOut ? message.secretTimedOut : false,
                        lastUpdateTime : new Date().getTime(),
                        platform: 5,


                        /**UI PROPERTY **/
                        scroll : message.scroll
                    };
                    if(!!message.tag_chat){
                        basicMsgObj.packetType = message.packetType || 63;
                        basicMsgObj.brokenPacketType = message.brokenPacketType;
                    }else{
                        basicMsgObj.packetType = message.packetType || 6;
                        basicMsgObj.brokenPacketType = message.brokenPacketType;
                    }

                    basicMsgObj.status_text = 'Pending';
                    if( message.status ) basicMsgObj.status_text = message.status;

                    return basicMsgObj;

                };

                return {

                    create: function (userId,isTagChat) {
                        var chat, returnob, intervalVar,
                            tagItem, tagId, user,
                            boxId = userId;

                        if(isTagChat){
                            tagId = userId;
                            tagItem = tagChatFactory.getTag(tagId);//pass groupId which is coming here as userId
                        }
                        else{
                            user = userFactory.create({uId: userId});
                        }

                        var isTyping = false,
                        isFriendTyping = false,

                        typingUserIds = {},
                        typingText = "",
                        messages = $$stackedMap.createNew(true, 'asc');

                        var pushMessage = function (message, user, sendToTab) {

                            var tempmesg;
                            if (!!message.type && message.type === 101) { // user is typing
                                isTyping = true;
                                return;
                            }
                            if (message.type == 0 && message.status === 0) { // when message is deleted// set only property to zero
                                tempmesg = messages.get(messages.packetId);
                                tempmesg.isDeleted = true;
                                return;

                            }

                            var parsedMessageText = "";

                            var basicMsgObj = getBasicMessageObject(message);

                            if( !angular.isObject(user)  ){

                               // user = userFactory.createByUId(message.userId, function(){
                               //      Utils.triggerCustomEvent('SINGLE_MESSAGE_UPDATED', { message : basicMsgObj });
                               // });

                               user = userFactory.create({ uId: message.userId, fetchDatails: false});

                            }else{
                                message.userId = user.getKey();
                            }

                            var msgObj = {

                                locationInfo     : {},
                                ogData           : {},
                                seenUserIds      : {},
                                deliveredUserIds : {},
                                user             : user,

                                sortBy: function () {
                                    return message.messageDate;
                                },
                                getTextPartition: function () {
                                    return parsedMessageText;
                                },
                                setTextPartition: function () {
                                    parsedMessageText = ChatUtilsFactory.parseForLE(msgObj.text);
                                    parsedMessageText = $sce.trustAsHtml(parsedMessageText);
                                },
                                getMessageTime: function () {
                                    return Cmessage.hrtime;
                                },
                                seenUsersCount : function(){
                                    return Object.keys(msgObj.seenUserIds).length;
                                },
                                deliveredUsersCount : function(){
                                    return Object.keys(msgObj.deliveredUserIds).length;
                                },
                                addSeenUserId : function(userId){
                                    msgObj.seenUserIds[userId] = true;
                                },
                                addDeliveredUserId : function(userId){
                                    msgObj.deliveredUserIds[userId] = true;
                                },
                                updateLocationInfo : function(){
                                    var locationInfo, latitude, longitude;
                                    try{
                                        locationInfo = angular.fromJson(msgObj.text);
                                        latitude = locationInfo.la; //PacketDataParse.Bytes2Float32
                                        longitude = locationInfo.lo; //PacketDataParse.Bytes2Float32
                                        msgObj.locationInfo = { lat : latitude, long : longitude, description : locationInfo.loc };
                                        msgObj.plainText = locationInfo.loc;
                                    }catch(e){
                                    }
                                },
                                updateLinkShareInfo : function(){
                                    msgObj.ogData = {};
                                    try {
                                        var messageLinkJson = angular.fromJson(msgObj.text);
                                        msgObj.ogData = {
                                            lnkDmn: messageLinkJson.u,
                                            description: messageLinkJson.d,
                                            title: messageLinkJson.t,
                                            url: messageLinkJson.u,
                                            image: messageLinkJson.i,
                                            message : messageLinkJson.m
                                        };
                                        msgObj.plainText = messageLinkJson.m;
                                    }catch (e){
                                    }
                                },
                                updateMediaInfo : function(){
                                    var mediaInfo;
                                    try{
                                        mediaInfo = angular.fromJson(msgObj.text);
                                        msgObj.mediaInfo = { url : mediaInfo.u, caption : mediaInfo.c, width: mediaInfo.w, height: mediaInfo.h };

                                        var scaledDimension = Utils.getScaledImageSize( msgObj.mediaInfo.width, msgObj.mediaInfo.height, Utils.viewport.x, Utils.viewport.y );

                                        var scaledDimensionForThumb = Utils.getScaledImageSize( msgObj.mediaInfo.width, msgObj.mediaInfo.height, 150, 300 );

                                        msgObj.mediaInfo.width = scaledDimension.width;
                                        msgObj.mediaInfo.height = scaledDimension.height;

                                        msgObj.mediaInfo.thumbWidth = scaledDimensionForThumb.width;
                                        msgObj.mediaInfo.thumbHeight = scaledDimensionForThumb.height;


                                        msgObj.plainText = mediaInfo.c;
                                    }catch(e){
                                        RingLogger.alert(e,'CHAT');
                                    }
                                },
                                updateRingMediaInfo : function(){
                                    var mediaInfo;
                                    try{
                                       var mediaInfo = angular.fromJson(msgObj.text);
                                       msgObj.ringMediaObject = $$mediaMap(mediaInfo);
                                    }catch(e){
                                        RingLogger.alert(e,'CHAT');
                                    }
                                },
                                getSafeMapJsUrl : function(){

                                    return $sce.trustAsResourceUrl( msgObj.mapJsEmbededUrl );
                                },

                                refreshStatusMessageText : function(){

                                    parsedMessageText = tagChatHelper.getTagChatStatusMessage(message);
                                    //RingLogger.debug('ChAT Status Message, ', parsedMessageText, 'CHAT_0');
                                    parsedMessageText = $sce.trustAsHtml(parsedMessageText);

                                }

                            };//end of msgObj

                            angular.extend(msgObj, basicMsgObj);

                            message.userId = msgObj.userId = msgObj.user.getKey();

                            if( !!message.usersToChange ){
                                msgObj.usersToChange = message.usersToChange;
                            }

                            if( !!message.statusType){
                                msgObj.statusType = message.statusType;
                            }

                            if( message.status !== 'status_update'){

                                if(!(message.secretTimedOut == true) && message.status === "Deleted") {
                                    //only for non secret delete messages
                                    //we're making them forcefully type text otherwise it won't show 'this message has been deleted'
                                    msgObj.messageType = 2;
                                    parsedMessageText = ChatUtilsFactory.parseForLE(msgObj.text);
                                }
                                else{
                                    switch (message.messageType){
                                        //0
                                        case GENERAL_CONSTANTS.MESSAGE_TYPES.DELETE_MESSAGE:
                                            msgObj.text = 'This msg has been deleted';
                                            msgObj.setTextPartition();
                                            break;
                                        //2
                                        case GENERAL_CONSTANTS.MESSAGE_TYPES.TEXT:
                                        //3
                                        case GENERAL_CONSTANTS.MESSAGE_TYPES.EMOTICON_MESSAGE:
                                            parsedMessageText = ChatUtilsFactory.parseForLE(msgObj.text);
                                            break;

                                        //4
                                        case GENERAL_CONSTANTS.MESSAGE_TYPES.LOCATION_SHARE:
                                            msgObj.updateLocationInfo();
                                            var latitude = msgObj.locationInfo.lat,
                                                longitude = msgObj.locationInfo.long,
                                                mapUrl;

                                            if(latitude !=0 && longitude !=0){

                                                msgObj.mapStaticUrl =  Utils.getGoogleMapStaticUrl(latitude, longitude) ;
                                                msgObj.mapJsUrl = Utils.getGoogleMapJSUrl(latitude, longitude);
                                                msgObj.mapJsEmbededUrl = Utils.getGoogleMapJSUrl(latitude, longitude, "", true);

                                            }else{

                                                parsedMessageText = ChatUtilsFactory.parseForLE(msgObj.text);

                                            }
                                            break;

                                        //5
                                        case GENERAL_CONSTANTS.MESSAGE_TYPES.LINK_SHARE:
                                            msgObj.updateLinkShareInfo();
                                            break;

                                        //6
                                        case GENERAL_CONSTANTS.MESSAGE_TYPES.STICKER:
                                            //parsedMessageText = Utils.parseForLE(settings.imBase + msgObj.text);
                                            msgObj.stickerUrl = settings.stickerBase + msgObj.text;
                                            break;

                                        //7
                                        case GENERAL_CONSTANTS.MESSAGE_TYPES.IMAGE:
                                        //10
                                        case GENERAL_CONSTANTS.MESSAGE_TYPES.CAMERA_IMAGE:
                                            msgObj.updateMediaInfo();

                                            try{

                                                msgObj.mediaUrl = settings.imBase + msgObj.mediaInfo.url;

                                            }catch(e){
                                                msgObj.mediaUrl = ""
                                            }

                                            parsedMessageText = "";

                                            break;

                                        //8
                                        case GENERAL_CONSTANTS.MESSAGE_TYPES.AUDIO:
                                            msgObj.updateMediaInfo();
                                            msgObj.isVideo = false;

                                            try{
                                                msgObj.mediaUrl = settings.mediaBase + msgObj.mediaInfo.url;
                                            }catch(e){
                                                msgObj.mediaUrl = "";
                                            }


                                            break;

                                        //9
                                        case GENERAL_CONSTANTS.MESSAGE_TYPES.VIDEO:
                                            msgObj.updateMediaInfo();
                                            msgObj.isVideo = true;

                                            try{

                                                msgObj.mediaUrl = settings.mediaBase + msgObj.mediaInfo.url;

                                            }catch(e){
                                                msgObj.mediaUrl = ""
                                            }

                                            break;

                                        //15
                                        case GENERAL_CONSTANTS.MESSAGE_TYPES.RING_MEDIA_MESSAGE:
                                            msgObj.updateRingMediaInfo();

                                            try{

                                                msgObj.plainText = msgObj.ringMediaObject.getCaption();
                                                msgObj.thumbURL = msgObj.ringMediaObject.getThumbForMedia();

                                                msgObj.albumName = msgObj.ringMediaObject.getAlbumName();
                                                msgObj.artistName = msgObj.ringMediaObject.getArtistName();

                                                msgObj.durationText = msgObj.ringMediaObject.getDuration(true);


                                            }catch(e){
                                                RingLogger.alert(e,'CHAT');
                                                msgObj.thumbURL = ""
                                            }
                                            break;

                                        default:
                                            RingLogger.log('Skipping UnHandled Chat Message Type.', msgObj.messageType, 'CHAT');
                                            return;
                                    }
                                }
                            }else{
                                if( !!message.usersToChange && message.usersToChange.length > 0){
                                    parsedMessageText = tagChatHelper.getTagChatStatusMessage(message);

                                    if(!parsedMessageText){
                                        return;
                                    }
                                }else{
                                    return;
                                }
                            }

                            parsedMessageText = $sce.trustAsHtml(parsedMessageText);
                            messages.save(msgObj.key, msgObj);

                            if( !message.fromLocalHistory ){
                                updateBoxMessageMinMaxPacketId(msgObj);
                            }

                            var boxId = userId.toString();//here userId contains the boxId
                            chatHistoryFactory.addMessage(msgObj, boxId);//here we have to pass the boxId, and user contains box.getKey() from the different calling portion


                            Utils.triggerCustomEvent(SystemEvents.CHAT.MESSAGE_PUSHED, {
                                    boxId : boxId,
                                    fromLocalHistory : message.fromLocalHistory || false,
                                    fromHistory : message.fromHistory || false,
                                    msg_status : basicMsgObj.status_text.toLowerCase(),
                                    isEdit: message.isEdit
                            });

                            if(!!sendToTab){
                                chatTabSync.sendData(GENERAL_CONSTANTS.TAB_SYNC_ACTIONS.CHAT_MSESSAGE_UPDATE, {boxId : boxId, msg : basicMsgObj, isTagChat : message.tag_chat});
                            }

                        };

                        var pushDummyMessage = function(message, user){
                            var key = message.key || message.packetId;

                            var mdate = SharedHelpers.getChatServerCurrentTime();
                            var parsedMessageText = [];

                            var msgObj = {
                                key               : key,
                                text              : message.message || message.mg || message.text,
                                hrtime            : ChatUtilsFactory.getChatVerbalDateFromServerDate(mdate),
                                status            : message.status || 0,
                                //status          : message.status || 'Received',
                                messageType       : message.messageType,
                                uploading         : message.uploading,
                                uploadProgress    : message.uploadProgress,
                                messageDate       : mdate,
                                isDeleted         : false,
                                messageDateString : message.messageDateString || '',
                                mediaUrl          : message.mediaUrl,
                                mediaInfo         : {thumbWidth: 150, thumbHeight: 63},
                                timeout           : message.timeout,
                                isSecretVisible   : message.isSecretVisible,
                                //progressValue   : message.progressValue,
                                //tempImage       : message.tempImage,
                                //user            : angular.isObject(user) ? user : userFactory.getUser(message.uId),
                                user              : angular.isObject(user) ? user : userFactory.getUser(message.userId),
                                userId            : angular.isObject(user) ? user.getKey() : message.userId,
                                lastUpdateTime    : new Date().getTime(),

                                sortBy: function () {
                                    return message.messageDate;
                                },
                                getTextPartition: function () {
                                    return parsedMessageText;
                                },
                                setTextPartition: function () {
                                    parsedMessageText = ChatUtilsFactory.parseForLE(msgObj.text);
                                    parsedMessageText = $sce.trustAsHtml(parsedMessageText);
                                }
                            };

                            parsedMessageText = ChatUtilsFactory.parseForLE(msgObj.text);
                            parsedMessageText = $sce.trustAsHtml(parsedMessageText);

                            messages.save(msgObj.key, msgObj);

                            Utils.triggerCustomEvent(SystemEvents.CHAT.MESSAGE_PUSHED, {
                                    boxId : boxId,
                                    fromLocalHistory : false,
                                    fromHistory : false,
                                    msg_status : msgObj.status
                            });


                        };
                        var processMessage = function (message, friendId) {
                            //TODO need to process the message both messages that the user sending for show status pending/send/typing and the incoming from server for updating
                            //
                        };

                        var updateBoxMessageMinMaxPacketId = function(aMessageObject){

                            var box = returnob;
                            var packetId = aMessageObject.key || aMessageObject.packetId;

                            if( aMessageObject.status == 'status_update'){
                                try{
                                    packetId = packetId.split('_')[0];
                                }catch(e){
                                    RingLogger.alert(e,'CHAT');
                                }

                            }

                            if( box.messageMaxDate < aMessageObject.messageDate ){
                                box.messageMaxDate = aMessageObject.messageDate;
                                box.messageMaxPacketId = packetId;
                            }

                            if( !box.messageMinDate || box.messageMinDate >= aMessageObject.messageDate ){
                                box.messageMinDate = aMessageObject.messageDate;
                                box.messageMinPacketId = packetId;
                            }

                        };


                        returnob = {
                            isTagChat             : false,
                            boxTitle              : "",
                            unreadCount           : 0,

                            messageMaxPacketId    : '',
                            messageMinPacketId    : '',
                            messageMaxDate        : 0,
                            messageMinDate        : 0,

                            latestSeenMessageDate : 0,

                            hasHistoryMessage     : false,
                            messages              : messages.all(),



                            getTitleString : function(){

                                var box = returnob;
                                //var title = box.getTitle().slice(0, 15);
                                var title = box.getTitle();

                                if( !isTagChat && !title ){
                                    title = box.getKey();
                                }

                                if( box.unreadCount > 0 ){
                                    title = title + ' ('+ box.unreadCount +')';
                                }

                                return title;

                            },
                            updateUnreadCount : function(){
                                var box = returnob;
                                box.unreadCount = chatHistoryFactory.getUnreadMessageCountByBoxId(boxId)
                            },
                            getProfileLink : function () {
                                var box = returnob;
                                if(box.isTagChat){
                                    false;
                                }else{
                                    //return box.getUser().link();
                                    return '/profile/'+box.getUser().getKey();
                                }
                            },
                            checkWaitingTimePassed: function(){
                                var currentTime = Math.floor(Date.now()/1000);
                                if(currentTime - this.lastCommunicationTime > this.waitingTime){
                                    return true;
                                }else {
                                    return false;
                                }
                            },


                            pushMessage: function (message, user, sendToTab) {

                                pushMessage(message, user, sendToTab);
                            },
                            pushDummyMessage: function (message, user) {

                                pushDummyMessage(message, user);
                            },
                            sendTabUpdate : function(message){

                                var basicMsgObj = getBasicMessageObject(message);

                                chatTabSync.sendData(GENERAL_CONSTANTS.TAB_SYNC_ACTIONS.CHAT_MSESSAGE_UPDATE, {boxId : boxId, msg : basicMsgObj, isTagChat : message.tag_chat});
                            },
                            processMessage: function (message, friendId) {
                                processMessage(message, friendId);
                            },
                            getKey: function () {
                                return userId.toString();//this contains either userId or tagId
                            },
                            getTagItem : function(){
                              return tagItem || tagChatFactory.getTag( returnob.getKey());
                            },
                            getUser: function () {
                                if(tagItem)
                                    return tagItem;
                                return user;
                            },
                            getTitle: function () {
                                if(tagItem){
                                    this.boxTitle =  tagItem.getTagName();
                                }else if(user){
                                    this.boxTitle = user.getName();
                                }

                                return this.boxTitle;
                            },
                            setTitle: function(tagTitleForNonInitingUser){
                                this.boxTitle = tagTitleForNonInitingUser;
                            },
                            isConsicutive: function (messageKey) {
                                var currentMessage = messages.get(messageKey);
                                var previousMessage = messages.previous(messageKey);

                                if (previousMessage && previousMessage.status != 'status_update' && previousMessage.user.getKey() === currentMessage.user.getKey()) {
                                    return true;
                                }
                                return false;
                            },
                            isSamePacketId: function (messageKey) {
                                return !!messages.get(messageKey.toString());
                            },
                            getMessages: function () {
                                return messages.all();
                            },
                            getMessage : function(key){
                                return messages.get(key.toString());
                            },
                            getBottomMessage : function(){
                                return messages.bottom();
                            },
                            getTopMessage : function(){
                                return messages.top();
                            },
                            removeMessage: function (key) {
                                messages.remove(key.toString());
                            },
                            updateMessageStatus : function( messageKey, status){
                                var messageObject = messages.get(messageKey);

                                if(!!messageObject){
                                    messageObject.status = status;
                                    return messageObject;
                                }
                                return false;
                            },
                            isTyping: function () {
                                return isTyping;
                            },
                            setTypingBool: function (bool) {
                                isTyping = bool;
                            },
                            isFriendTyping: function () {
                                return isFriendTyping;
                            },

                            showTypingText: function(userId){
                                typingUserIds[userId] = true;
                                isTyping = isFriendTyping = true;
                            },
                            hideTypingText : function(userId){
                                delete typingUserIds[userId];
                                isTyping = isFriendTyping = false;
                            },
                            getTypingText : function(){

                                typingText = "is typing ...";

                                if( isTagChat ){
                                    var tagItem = tagChatFactory.getTag( returnob.getKey());
                                    var userIdsToShow = Object.keys(typingUserIds);
                                    var postfix = " is typing ..."

                                    if (typingUserIds.length > 3){
                                        userIdsToShow = typingUserIds.slice(0, 3);
                                        postfix = " and " + typingUserIds.length - 3 + " others are typing...";
                                    }

                                    var usersNamesToShow = [];
                                    userIdsToShow.forEach(function(anUserId){
                                        var user = tagItem.getMember(anUserId)
                                        usersNamesToShow.push(user.getName())
                                    })

                                    typingText = usersNamesToShow.join(",") + postfix
                                }else{
                                    typingText = returnob.getUser().getName() + ' ' + typingText;
                                }

                                return typingText;
                            },
                            //setAfterRegisterIntervalKey : function(key){
                            //    afterRegisterIntervalKey = key;
                            //},
                            //getAfterRegisterIntervalKey : function(){
                            //    return afterRegisterIntervalKey;
                            //},
                            //clearAfterRegisterInterval : function(){
                            //    if( afterRegisterIntervalKey ){
                            //        RingLogger.print("After Register Interval Cleared :"+intervalVar.$$intervalId, RingLogger.tags.CHAT);
                            //        clearInterval(afterRegisterIntervalKey);
                            //    }
                            //},
                            setFriendTypingBool: function (bool) {
                                isFriendTyping = bool;
                            },

                            startTimer: function () {//need to recheck what the problem is, right now we're going with previous way where timer was started from different places
                                var box = returnob;
                                var messages = box.getMessages();
                                if(angular.isArray(messages) && messages.length>0) {
                                    for(var m = 0; m< messages.length; m++) {
                                        if (messages[m].value.timeout > 0 && box.isMinimized == false && box.isHidden == false && !messages[m].value.timerStartFlag) {
                                            switch (messages[m].value.messageType){
                                                case 2:
                                                case 3:
                                                case 4:
                                                case 5:
                                                case 6:
                                                    var timeoutCount = messages[m].value.timeout;
                                                    var mes = messages[m].value;
                                                    mes.key = mes.packetId;
                                                    messages[m].value.timerStartFlag = true;
                                                    var testTimeoutDeleteFunc = function (me, timeoutCount) {
                                                        $rootScope.$broadcast('timeoutDelete', me.key, timeoutCount);
                                                    };//this fucking semicolon(;) caused me "TypeError: (intermediate value)(...) is not a function" ggrgrrrrrrr...
                                                    (function (mes, timeoutCount) {
                                                        $interval(function () {
                                                            testTimeoutDeleteFunc(mes, timeoutCount--);
                                                        }, 1000, timeoutCount + 1);
                                                    })(mes, timeoutCount);
                                                    break;
                                            }//end of messageType switch

                                        }// end of conditions for starting timer
                                    } // end of for loop for all messages
                                }// end of isArray(messaged)
                            },

                            updateBoxMessageMinMaxPacketId : updateBoxMessageMinMaxPacketId,

                            loadHistoryMessages : function(){
                                var box = returnob;

                                var minDate, maxDate, statsuChanged = false;

                                var historyMessages = chatHistoryFactory.getMessages(boxId);
                                if(historyMessages){
                                    for(var h=0; h<historyMessages.length; h++){
                                        var aHistoryMessage = historyMessages[h];

                                        updateBoxMessageMinMaxPacketId(aHistoryMessage);

                                        aHistoryMessage.fromLocalHistory = true;

                                        var retrySendMessage = false;

                                        if( aHistoryMessage.status == 0){
                                            if( (SharedHelpers.getChatServerCurrentTime() - aHistoryMessage.messageDate)  >  120*1000   ){

                                                aHistoryMessage.status = 'Failed';
                                                statsuChanged = true;
                                            }else{
                                                retrySendMessage=true;

                                            }

                                        }

                                        if( aHistoryMessage.stauts == 'Seen' && aHistoryMessage.messageDate > box.latestSeenMessageDate ){
                                            box.latestSeenMessageDate = aHistoryMessage.messageDate;
                                        }


                                        // var user = userFactory.createByUId(aHistoryMessage.user, function(){
                                        //     Utils.triggerCustomEvent('SINGLE_MESSAGE_UPDATED', { message : aHistoryMessage});
                                        // });

                                        // if(retrySendMessage){

                                           //ChatPacketSenderService.retryMessage(box, aHistoryMessage.text, aHistoryMessage.messageData );

                                        // }
                                    }
                                }

                                if( statsuChanged ){
                                    chatHistoryFactory.updateMessages( historyMessages, boxId )
                                }



                                box.updateUnreadCount();

                                Utils.triggerCustomEvent(SystemEvents.CHAT.HISTORY_LOADED, { boxId : boxId});
                            }




                        };

                        return returnob;

                    }
                };
            }
        ]);
