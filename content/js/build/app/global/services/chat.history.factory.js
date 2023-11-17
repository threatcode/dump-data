    angular
    .module('ringid.global_services')
    .factory('chatHistoryFactory', ['Storage', 'Auth', 'userFactory',  'SystemEvents', 'Utils',
            function (Storage, Auth, userFactory, SystemEvents, Utils) {

                var CHAT_GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;
                var CHAT_VERSION_INFO = CHAT_APP.Constants.CHAT_VERSION_INFO;
                var chatOpenedBoxes= {},
                    chatBoxes = {},
                    unreadMessageInfos = {},
                    unreadMessageCount = 0,
                    coversationCount  = 0;

                var loadChatBoxes = function(){
                    chatOpenedBoxes = Storage.getData('chatOpenedBoxes') || {};
                    chatBoxes = Storage.getData('chatBoxes') || {};

                };

                //var initUnreadMessageCount = function(){

                //var chatOpenedBoxes= {},
                    //chatBoxes = {},
                    //unreadMessageInfos = {},
                    //unreadMessageCount = 0;

                //var loadChatBoxes = function(){
                    //chatOpenedBoxes = Storage.getData('chatOpenedBoxes') || {};
                    //chatBoxes = Storage.getData('chatBoxes') || {};

                //};

                var _getUnreadConversationCount = function(){
                    return coversationCount;
                };

                var _resetConversationCount = function(){
                    coversationCount = 0;
                };

                var initUnreadMessageCount = function(){
                    coversationCount = 0
                    Object.keys(unreadMessageInfos).forEach(function(val, key){
                        unreadMessageCount += Object.keys(val).length;
                        coversationCount++;
                    });
                };

                var loadUnreadMessageInfos = function(){

                    var _unreadMessageInfos = Storage.getData('unreadMessageIds');

                    unreadMessageCount = 0;
                    coversationCount = 0;

                    if( !_unreadMessageInfos ){

                        unreadMessageInfos =  {};

                    }else{

                        Object.keys(_unreadMessageInfos).forEach(function(aBoxId, key){

                            unreadMessageInfos[aBoxId] = {};

                            _unreadMessageInfos[aBoxId].forEach(function(packetId, key){
                                unreadMessageInfos[aBoxId][packetId] = true;
                                unreadMessageCount++;
                            })

                            coversationCount++;

                        });
                    }

                };

                var _updateUnreadMessageInfos = function(async){
                    if(async !== false){
                        async = true
                    }

                    var _unreadMessageInfos = {}
                    Object.keys(unreadMessageInfos).forEach(function(aBoxId, key){
                        _unreadMessageInfos[aBoxId] = Object.keys(unreadMessageInfos[aBoxId]);
                    })

                    Storage.setData('unreadMessageIds', _unreadMessageInfos, async);

                    Utils.triggerCustomEvent(SystemEvents.CHAT.UNREAD_MESSAGE_INFO_UPDATED);

                };

                var migrateLocalDb = function(){
                    chatOpenedBoxes= {};
                    chatBoxes = {};
                    _updateChatBoxes(false);
                    _updateChatOpenBoxes(false);
                    _updateUnreadMessageInfos(false);
                    saveChatGeneralInfo(CHAT_VERSION_INFO, false);
                };

                var loadChatGeneralInfo = function(){

                    var cgInf = Storage.getData('cgInf');

                    if( !cgInf || !cgInf.version || cgInf.version != CHAT_VERSION_INFO.version){
                        migrateLocalDb();
                    }

                    if(!cgInf){
                        saveChatGeneralInfo();
                    }else{
                        angular.extend(CHAT_VERSION_INFO, cgInf);
                    }

                };

                var saveChatGeneralInfo = function(info, async){
                    if(async !== false){
                        async = true
                    }

                    if(!!info){
                        angular.extend(CHAT_VERSION_INFO, info);
                    }

                    Storage.setData('cgInf', CHAT_VERSION_INFO, async);
                };

                var getHistoryMessageObject = function(message){

                    if( !message.user){
                        message.user = userFactory.create(message.user);
                    }

                    var userId = message.user;
                    try{
                        var userId = message.user.getKey();
                    }catch(e){}

                    var messageObject = {
                        key              : message.key,
                        packetId         : message.packetId || message.key,
                        packetType       : message.packetType || 6,
                        brokenPacketType : message.brokenPacketType || 8,
                        platform         : message.platform || 5,
                        text             : message.text || message.message || message.mg,
                        hrtime           : message.hrtime,
                        status           : message.status || 0,
                        //status         : message.status || 'Received',
                        seenSent         : message.seenSent || false,
                        messageDate      : message.messageDate,
                        isDeleted        : message.isDeleted,
                        latitude         : message.latitude,
                        longitude        : message.longitude,
                        messageDateString: message.messageDateString || '',
                        timeout          : message.timeout,
                        messageType      : message.messageType,
                        tag_chat         : message.tag_chat,
                        isSecretVisible  : message.isSecretVisible,
                        secretTimedOut   : message.secretTimedOut ? message.secretTimedOut : false,
                        //user           : angular.isObject(user) ? user : userFactory.getUser(message.uId),
                        user             : userId
                    };

                    if( !!message.usersToChange ){
                        messageObject.usersToChange = message.usersToChange;
                    }

                    if( !!message.statusType){
                        messageObject.statusType = message.statusType;
                    }

                    return messageObject;

                };

                var _updateChatBoxes = function(async){
                    if(async !== false){
                        async = true
                    }

                    Storage.setData('chatBoxes', chatBoxes, async);
                };

                var _updateChatOpenBoxes = function(async){
                    if(async !== false){
                        async = true
                    }

                    Storage.setData('chatOpenedBoxes', chatOpenedBoxes, async);
                };


                var _addOpenBoxes = function (boxId, isTagChat) {
                    var boxId = boxId.toString();

                    if (!chatOpenedBoxes) {
                        chatOpenedBoxes = {};
                    }
                    if(!chatOpenedBoxes[boxId]){
                        chatOpenedBoxes[boxId] = {
                            boxId : boxId,
                            isTagChat : isTagChat
                        };
                    }

                    _updateChatOpenBoxes();
                };

                var _getMessageByPacketId = function(boxId, packetId){
                    if(!!chatBoxes[boxId]){
                        var messages = chatBoxes[boxId]['messages'];
                        if(!!messages){
                            for(var index = 0, length = messages.length; index < length; index++){
                                if( messages[index].key == packetId){
                                    return messages[index];
                                }
                            }
                        }
                    }
                    return false;
                };

                var _addUnreadMessageInfo  = function(boxId, messageId){

                    if(!unreadMessageInfos[boxId]){
                        unreadMessageInfos[boxId] = {};
                        Utils.triggerCustomEvent(SystemEvents.CHAT.UNREAD_MESSAGE_INFO_UPDATED);
                    }

                    if( !unreadMessageInfos[boxId][messageId]){
                        unreadMessageInfos[boxId][messageId] = true;
                        unreadMessageCount++;
                    }

                    coversationCount = Object.keys(unreadMessageInfos).length;

                };



                var _removeUnreadMessageInfo = function(boxId, messageId){
                    if( !unreadMessageInfos[boxId] || !unreadMessageInfos[boxId][messageId]){
                        return;
                    }else{
                        delete unreadMessageInfos[boxId][messageId];
                        unreadMessageCount--;
                    }

                    _updateUnreadMessageInfos();
                };

                var _removeUnreadMessageInfoByBoxId = function(boxId){
                    var aBox = chatBoxes[boxId];
                    if( !unreadMessageInfos[boxId] ){
                        return;
                    }

                    var boxUnreadCount = Object.keys(unreadMessageInfos[boxId]).length;
                    delete unreadMessageInfos[boxId]
                    unreadMessageCount -= boxUnreadCount;

                    if( unreadMessageCount < 0){
                        unreadMessageCount = 0;
                    }

                    _updateUnreadMessageInfos();

                    coversationCount = Object.keys(unreadMessageInfos).length;
                    Utils.triggerCustomEvent(SystemEvents.CHAT.UNREAD_MESSAGE_INFO_UPDATED);


                };

                var _getUnreadMessageInfos = function(){
                    return unreadMessageInfos;
                };

                var _getUnreadMessageCount = function(){
                    return unreadMessageCount;
                };

                var _getUnreadMessageCountByBoxId = function(boxId){
                    if( !unreadMessageInfos[boxId] ){
                        return 0;
                    }

                    return Object.keys(unreadMessageInfos[boxId]).length
                };




                var _init = function(){

                    loadChatGeneralInfo();
                    loadChatBoxes();
                    loadUnreadMessageInfos();

                }

                var ReturnOb =  {

                    init : _init,

                    loadChatBoxes : loadChatBoxes,
                    loadChatGeneralInfo : loadChatGeneralInfo,
                    saveChatGeneralInfo : saveChatGeneralInfo,
                    updateChatOpenBoxes : _updateChatOpenBoxes,
                    updateChatBoxes : _updateChatBoxes,

                    addUnreadMessageInfo : _addUnreadMessageInfo,
                    removeUnreadMessageInfo : _removeUnreadMessageInfo,
                    updateUnreadMessageInfos :_updateUnreadMessageInfos,
                    getUnreadMessageInfos : _getUnreadMessageInfos,
                    getUnreadMessageCount : _getUnreadMessageCount,
                    getUnreadConversationCount : _getUnreadConversationCount,
                    resetConversationCount : _resetConversationCount,
                    getUnreadMessageCountByBoxId : _getUnreadMessageCountByBoxId,
                    removeUnreadMessageInfoByBoxId : _removeUnreadMessageInfoByBoxId,

                    getMessageByPacketId : _getMessageByPacketId,

                    getChatOpenBoxes : function(){
                        return chatOpenedBoxes;
                    },

                    getChatBoxes : function(){
                        return chatBoxes;
                    },

                    addOpenBox: _addOpenBoxes,

                    removeOpenBox: function (boxId) {

                        if(!!chatOpenedBoxes[boxId]){
                            delete chatOpenedBoxes[boxId];
                        }

                        _updateChatOpenBoxes();

                    },

                    countOpenBoxes: function () {

                        if (chatOpenedBoxes) {
                            return Object.keys(chatOpenedBoxes).length;
                        } else {
                            return 0;
                        }
                    },
                    getAllOpenBoxes: function () {

                        if(chatOpenedBoxes && Object.keys(chatOpenedBoxes).length > 0){
                            return chatOpenedBoxes;
                        }else{
                            return false;
                        }
                    },
                    addBox: function (box) {

                        _addOpenBoxes(box.key, box.isTagChat);

                        var box = {
                            key            : box.key,
                            ip             : box.ip,
                            rPort          : box.rPort,
                            closedBox      : box.closedBox,
                            isMinimized    : box.isMinimized,
                            isHidden       : box.isHidden,
                            isFocused      : box.isFocused,
                            blinkOn        : box.blinkOn,
                            timeout        : box.timeout,
                            secretChat     : box.secretChat,
                            nonDomBox      : box.nonDomBox,
                            offlineStatus  : box.offlineStatus,
                            isTagChat      : box.isTagChat,
                            chatBoxClass   : box.chatBoxClass,
                            unreadCount    : box.unreadCount,
                            isSecretVisible: box.isSecretVisible,
                            blocked        : box.blocked,
                            blockedByUtId  : box.blockedByUtId,
                            //serverTimeDiff: box.serverTimeDiff,
                            messages       : []
                        };

                        if (!chatBoxes) {
                            chatBoxes = {};
                        }

                        if(!chatBoxes[box.key]){
                            chatBoxes[box.key] = box;
                        }

                        _updateChatBoxes();

                    },
                    updateBox: function (box) {

                        var box       = {
                            key            : box.key,
                            ip             : box.ip,
                            rPort          : box.rPort,
                            closedBox      : box.closedBox,
                            isMinimized    : box.isMinimized,
                            isHidden       : box.isHidden,
                            isFocused      : box.isFocused,
                            blinkOn        : box.blinkOn,
                            timeout        : box.timeout,
                            secretChat     : box.secretChat,
                            nonDomBox      : box.nonDomBox,
                            offlineStatus  : box.offlineStatus,
                            isTagChat      : box.isTagChat,
                            isSecretVisible: box.isSecretVisible,
                            blocked        : box.blocked,
                            blockedByUtId  : box.blockedByUtId,
                            chatBoxClass   : box.chatBoxClass,
                            unreadCount    : box.unreadCount
                            //serverTimeDiff: box.serverTimeDiff
                        };

                        if (!chatBoxes) {
                            chatBoxes = {};
                        }

                        if(!chatBoxes[box.key]){
                            chatBoxes[box.key] = box;
                        }else{
                            angular.extend(chatBoxes[box.key], box);
                        }

                        _updateChatBoxes();

                    },
                    getBox: function (key) {

                      if(!chatBoxes[key]){
                          return false;
                      }

                      return chatBoxes[key];

                    },
                    addMessage: function (message, boxId) {
                        var boxId = boxId.toString();

                        if(!!chatBoxes[boxId]){

                            if( !message.user || !message.user.getKey){
                                message.user = userFactory.create(message.user);
                            }

                            var messageObject = {
                                key              : message.key || message.packetId,

                                packetId         : message.packetId || message.key,
                                packetType       : message.packetType || 6,
                                brokenPacketType : message.brokenPacketType || 8,
                                platform         : message.platform || 5,

                                text             : message.text || message.message || message.mg,
                                hrtime           : message.hrtime || '',
                                status           : message.status || 0,
                                fullName         : message.fullName || '',
                                tagName          : message.tagName || '',
                                messageDate      : message.messageDate,
                                seenSent         : message.seenSent || false,
                                isDeleted        : message.isDeleted || false,

                                messageDateString: message.messageDateString || '',
                                timeout          : message.timeout || 0,
                                messageType      : message.messageType,
                                tag_chat         : message.tag_chat,
                                isSecretVisible  : message.isSecretVisible,
                                secretTimedOut   : message.secretTimedOut ? message.secretTimedOut : false,
                                user             : message.user.getKey(),
                                userId           : message.user.getKey()
                            };

                            if( !message.user){
                            }


                            if( !!message.statusType){
                                messageObject.statusType = message.statusType;
                            }

                            if( !!message.usersToChange ){
                                messageObject.usersToChange = message.usersToChange;
                            }

                            if(!chatBoxes[boxId].messages){
                                chatBoxes[boxId].messages = [];
                            }

                            //find if that message(check with messageKey/packetId) exists, if exists then dont push otherwise does
                            var messageKeyFlag = 0;
                            try{
                                for(var j=0; j<chatBoxes[boxId].messages.length; j++){
                                    if(chatBoxes[boxId].messages[j].key === messageObject.key){
                                        messageKeyFlag = 1;
                                        break;
                                    }
                                }
                            }catch(e){
                            }


                            if(messageKeyFlag ===0){
                                chatBoxes[boxId].messages.push(messageObject);

                                chatBoxes[boxId].messages.sort(function(aMessage, bMessage){
                                    return aMessage.messageDate - bMessage.messageDate
                                });

                                chatBoxes[boxId].messages.splice(0, chatBoxes[boxId].messages.length - CHAT_GENERAL_CONSTANTS.HISTORY_MAX_MESSAGE);

                            }
                        }


                        _updateChatBoxes();
                    },
                    removeMessage: function (messageKey, boxId) {

                        var boxId = boxId.toString();

                        var removed = false;
                        if(chatBoxes) {
                            if (!!chatBoxes[boxId]) {
                                for (var j = 0; j < chatBoxes[boxId].messages.length; j++) {
                                    if (chatBoxes[boxId].messages[j].key === messageKey) {
                                        chatBoxes[boxId].messages.splice(j, 1);
                                        removed = true;
                                        // _removeUnreadMessageInfo(messageKey);
                                    }
                                }
                            }
                        }

                        if(removed){
                            _updateChatBoxes();
                        }
                    },

                    updateMessage: function (message, boxId) {

                        var boxId = boxId.toString();

                        var currentUserId = Auth.loginData.uId;

                        if(!!chatBoxes[boxId]){

                            if( !angular.isObject(message.user)){
                                message.user = userFactory.create(message.user);
                            }

                            var messageObject = {
                                key              : message.key,

                                packetId         : message.packetId || message.key,
                                packetType       : message.packetType || 6,
                                brokenPacketType : message.brokenPacketType || 8,
                                platform         : message.platform || 5,

                                text             : message.text || message.message || message.mg,
                                hrtime           : message.hrtime,
                                status           : message.status || 0,
                                //status: message.status || 'Received',
                                seenSent         : message.seenSent || false,
                                messageDate      : message.messageDate,
                                isDeleted        : message.isDeleted,
                                latitude         : message.latitude,
                                longitude        : message.longitude,
                                messageDateString: message.messageDateString || '',
                                timeout          : message.timeout,
                                messageType      : message.messageType,
                                isSecretVisible  : message.isSecretVisible,
                                tag_chat         : message.tag_chat,
                                secretTimedOut   : message.secretTimedOut ? message.secretTimedOut : false,
                                //user: angular.isObject(user) ? user : userFactory.getUser(message.uId),
                                user             : message.user.getKey()
                            };

                            if( !!message.usersToChange ){
                                messageObject.usersToChange = message.usersToChange;
                            }

                            if( !!message.statusType){
                                messageObject.statusType = message.statusType;
                            }

                            for(var j=0; j<chatBoxes[boxId].messages.length; j++){
                                if(chatBoxes[boxId].messages[j].key == messageObject.key){
                                    chatBoxes[boxId].messages[j] = messageObject;
                                    break;
                                }
                            }
                        }

                        _updateChatBoxes();
                    },

                    updateMessages: function (messages, boxId) {

                        if(! messages.length ){
                            return;
                        }

                        var boxId = boxId.toString();

                        var messagesCache = {};
                        for(var index = 0, len = messages.length; index < len; index++){
                            messagesCache[messages[index].key] = messages[index];
                        }

                        if(chatBoxes){
                            var currentUserBox = chatBoxes[boxId];

                            for(var j=0; j<currentUserBox.messages.length; j++){
                                var historyMessage = currentUserBox.messages[j];
                                var cachedMessage = messagesCache[historyMessage.key];
                                if( !!cachedMessage){
                                    currentUserBox.messages[j] = getHistoryMessageObject(cachedMessage);
                                }
                            }

                        }

                        _updateChatBoxes();
                    },

                    isInLocalStorageChatMsgMap : function(boxId, packetId){
                       try{
                           return !!chatBoxes[boxId][packetId];
                       }catch(e){
                            return false;
                        }
                    },
                    countMessage: function (boxId) {
                        var currentUserId = Auth.loginData.uId;

                        if(chatBoxes[boxId]){
                            var box = chatBoxes[boxId];
                            return !!box.messages ? box.messages.length : 0;
                        }

                        return false;

                    },
                    getMessages: function (boxId) {

                        if(chatBoxes[boxId]){
                            var box = chatBoxes[boxId];
                            return box.messages;
                        }

                        return [];
                    },

                    getMessage : function(boxId, packetId){
                        if( !!chatBoxes[boxId] && !!chatBoxes[boxId].messages){
                            for(var j=0; j<chatBoxes[boxId].messages.length; j++){
                                if(chatBoxes[boxId].messages[j].key == packetId){
                                    return chatBoxes[boxId].messages[j];
                                }
                            }
                        }
                        return false;
                    }
                };

                return ReturnOb;

            }
        ]);

