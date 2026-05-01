/**
 * Created by mahbubul on 3/5/15.
 */

    angular.module('ringid.chat')
        //box
        .factory('ChatFactory', ['settings',
            'Storage', '$$stackedMap',
            'ChatMap', 'Auth', 'Utils',
            'ChatConnector',
            'chatHistoryFactory', 'userFactory','friendsFactory',
            'tagChatFactory', '$interval', 'SystemEvents', 'OPERATION_TYPES', '$rootScope',


            function (settings,
                      Storage,  $$stackedMap,
                      ChatMap, Auth, Utils,
                      ChatConnector,
                      chatHistoryFactory,userFactory, friendsFactory,
                      tagChatFactory, $interval, SystemEvents, OPERATION_TYPES, $rootScope

            ) {

                // var Constants = CHAT_APP.Constants;
                var _chatClockInstance = null;
                function _getChatClock(){
                    if( !_chatClockInstance ){
                        _chatClockInstance = new CHAT_APP.UTILS.ChatClock();
                    }
                    return _chatClockInstance;
                }


                var SESSION_TYPES = CHAT_APP.Constants.GENERAL_CONSTANTS.SESSION_TYPES;

                var boxes = $$stackedMap.createNew();


                var getNumberOfAvailableChatBox = function (viewportXValue) { //return 4;

                    // left panel   : 200 px
                    // right panel  : 200 px
                    // hidden list  : 165 px
                    // box width    : 300 px
                    // padding      :  10 px
                    //var avaiable_width = Utils.viewport.x - 400 - 100;
                    if(!!viewportXValue){
                        var avaiable_width = viewportXValue - 400 - 165;
                    }else{
                        var avaiable_width = Utils.viewport.x - 400 - 165;
                    }
                    var box_counter = parseInt(avaiable_width / 310);
                    return box_counter;
                };

                //var numberOfAvailableChatBox = getNumberOfAvailableChatBox();

                var processInMessage = function (message) {// right now it may not in action

                    var friendId = message.friendName.split(",")[0];

                    var box = getBox(friendId);
                    // boxes.add(friendId,box);
                    if (angular.isArray(message.messageList)) {
                        for (var i = 0; i < message.messageList.length; i++) {
                            box.pushMessage(message.messageList[i]);
                        }
                    }
                };

                var getBoxObjectClass = function(userId){
                    var chatBoxClass = {
                        key                 : userId,
                        isMinimized         : false,
                        isHidden            : false,
                        isFocused           : false,
                        blinkOn             : false,
                        timeout             : 5,
                        secretChat          : false,
                        nonDomBox           : false,
                        closedBox           : false,
                        offlineStatus       : false,
                        blocked             : false,
                        blockedByUtId       : [],
                        isSecretVisible     : true,
                        singlePage          : false,
                        lastSeenBar         : true,
                        unreadCount         : 0,
                        bottomScrolled      : false,
                        chatBoxClass        : 'chat-body-opened'
                    };

                    return chatBoxClass;

                };


                var getNewBoxObject = function(userId, isTagChat, boxInfo){
                    userId = userId.toString();

                    if(!boxInfo){
                        boxInfo = {};
                    }

                    var box = boxes.get(userId);
                    if (box !== false) {
                        return box;
                    } else {
                        box = ChatMap.create(userId, isTagChat);
                    }

                    if(!isTagChat){

                        var user = userFactory.create({uId: userId});
                        user.fetchPresence();
                        //profileFactory.getUserObjectByUId(userId);
                        //profileHttpService.fetchPresence([userId]);
                    }

                    var boxChatBoxObject = getBoxObjectClass(userId);
                    boxChatBoxObject.isFocused = true;
                    boxChatBoxObject.nonDomBox = true;
                    boxChatBoxObject.isTagChat = isTagChat;
                    boxChatBoxObject.lastLogin = (!!box.getUser() && box.getUser().lastOnline) ? box.getUser().lastOnline() : '';


                    boxChatBoxObject = angular.extend(box, boxChatBoxObject, boxInfo);

                    return boxChatBoxObject;
                };

                var getBox = function (userId, isTagChat) {

                    var box = getNewBoxObject(userId, isTagChat);

                    boxes.save(userId, box);

                    chatHistoryFactory.addBox(box);    //for adding box to localStorage for saving chatHistory

                    return box;
                };

                var openChatBox = function (userId, sendToTab) {
                    var shouldTriggerBoxOpennedEvent = false;
                    userId = userId.toString();

                    var box = boxes.get(userId);
                    if (box === false) {

                        box = getBox(userId, false);
                        shouldTriggerBoxOpennedEvent = true;

                    } else {

                        if( !box.nonDomBox ){
                            shouldTriggerBoxOpennedEvent = true;
                        }

                        box.isFocused = true;
                        box.nonDomBox = true;
                        box.blinkOn   = false;

                        chatHistoryFactory.updateBox(box);
                    }

                    if(  shouldTriggerBoxOpennedEvent ){
                        Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_OPENNED, {boxId: userId, sendToTab : sendToTab} )
                    }

                };
                var openTagChatBox = function (groupId, sendToTab) {
                    var shouldTriggerBoxOpennedEvent = false;

                    groupId = groupId.toString();

                    var box = boxes.get(groupId);
                    if (box === false) {
                        box = getBox(groupId, true);
                        shouldTriggerBoxOpennedEvent = true;

                    } else {

                        if( !box.nonDomBox ){
                            shouldTriggerBoxOpennedEvent = true;
                        }

                        box.isFocused = true;
                        box.nonDomBox = true;
                        box.blinkOn   = false;
                        chatHistoryFactory.updateBox(box);
                    }

                    if( shouldTriggerBoxOpennedEvent ){
                        Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_OPENNED, {boxId: groupId, sendToTab : sendToTab} )
                    }

                    return box;
                };
                var createNonDomBox = function (userId, isTagChat) {
                    userId = userId.toString();

                    var box = ChatMap.create(userId, isTagChat);

                    var boxChatBoxObject = getBoxObjectClass(userId);
                    boxChatBoxObject.closedBox = true;
                    boxChatBoxObject.isTagChat = isTagChat;

                    boxChatBoxObject = angular.extend(box, boxChatBoxObject);
                    boxes.save(userId, boxChatBoxObject);

                    chatHistoryFactory.addBox(boxChatBoxObject);//for adding box to localStorage for saving chatHistory

                    return box;
                };


                /*
                 * Description: to make the hidden chatbox visible
                 * param: userId (which is the key for the stackmap)
                 * Date: 04-04-15
                 * Developed By: rabbi
                 * */                //
                var makeVisibleChatBox = function (userId) {
                    userId = userId.toString();

                    var boxObject = boxes.get(userId);// get the box object from boxes using key(userId), which returns the only value not the key
                    if (boxObject !== false) {
                        boxes.remove(userId); //remove from the boxes with the key (userId)
                        boxObject.isFocused = true;
                            boxes.save(userId, boxObject);// reAdd the same box object into boxes using key(userId), so it would add at the end of the stack
                        $rootScope.$broadcast("focusOn", userId);
                    }
                };
                var closeChatBox = function (userId) {
                    /* to make the box closed we'll need to change the box close property
                     instead of removing it from the stackMap
                     box.closedBox = false;// will always be true and only be false when user closes box
                     need to send unregister packet only for online users
                     offline box will have no ip/port so in that case we won't send unregister packet */

                    userId = userId.toString();
                    var box = boxes.get(userId);
                    box.closedBox = true;
                    chatHistoryFactory.updateBox(box);

                    // if(!!box.getIp()){
                    //     ChatWorkerCommands.endChatSession(userId, SESSION_TYPES.FRIEND)
                    // }

                    // box.stopInterval();

                    boxes.remove(userId);
                };

                var closeTagChatBox = function (tagId) {
                    tagId = tagId.toString();
                    var box = boxes.get(tagId);
                    box.closedBox = true;
                    chatHistoryFactory.updateBox(box);

                    // box.stopInterval();

                    boxes.remove(tagId);
                };

                var minimizeBox = function (userId) {
                    userId = userId.toString();
                    var box = boxes.get(userId);
                    //if(!!box.blinkOn && !box.isMinimized){//true false: if blinking is on then it won't minimize
                    //
                    //} else if(!!box.blinkOn && !!box.isMinimized){//true true:
                    //
                    //} else if(!box.blinkOn && !box.isMinimized){// false true:
                    //    box.chatBoxClass = 'chat-body';
                    //    box.isMinimized = !box.isMinimized;
                    //} else if(!box.blinkOn && !!box.isMinimized){ // false false:
                    //    box.chatBoxClass = 'chat-body-opened';
                    //    box.isMinimized = !box.isMinimized;
                    //}
                    box.isMinimized = !box.isMinimized;
                    // might need to handle the case where if box is minimized then it will be isFocus false(but will not need 'cause it is handle in chatFocus onclick)
                    if (box.isMinimized){
                        box.isFocused = false;
                        box.chatBoxClass = 'chat-body';
                    }else{
                        box.isFocused = true;
                        box.chatBoxClass = 'chat-body-opened';
                    }
                    chatHistoryFactory.updateBox(box);
                };

                var refreshBox = function(boxId){

                    chatHistoryFactory.loadChatBoxes();

                    var historyBox = chatHistoryFactory.getBox(boxId);

                    var chatbox = boxes.get(boxId);

                    if( !chatbox){

                        if( !historyBox.closedBox ){
                            var boxChatBoxObject = getNewBoxObject(boxId, historyBox.isTagChat, historyBox);
                            boxes.save(boxId, boxChatBoxObject);

                            boxChatBoxObject.loadHistoryMessages();

                        }


                    }else{

                        if( !historyBox.closedBox ){

                            angular.extend(chatbox, historyBox);
                            chatbox.loadHistoryMessages();

                        }else {
                            boxes.remove(boxId);
                        }
                    }

                };

                var openAndAddMessage = function(boxId, message){
                    /*
                    * USED IN `ChatController for chat synced messaged
                    *
                    */

                    if(!message){
                        return;
                    }

                    var currentUser = Auth.currentUser();

                    var box = boxes.get(boxId);

                    if(!box){

                        if(!!message.tag_chat){
                            var tag = tagChatFactory.getTag(boxId);
                            if( tag.isTagSafeToShow()){
                                openTagChatBox(boxId);
                            }
                        }else{
                            openChatBox(boxId);
                        }

                        box = getBox(boxId, message.tag_chat);
                        box.loadHistoryMessages();

                    }else{
                        box.nonDomBox = true;
                        box.pushMessage(message, currentUser);
                    }

                    Utils.triggerCustomEvent(SystemEvents.CHAT.NEW_MESSAGE_PUSHED, {boxId : boxId, scroll : 'bottom'});

                };


                return {
                    openChatBox        : openChatBox,
                    openTagChatBox     : openTagChatBox,
                    closeTagChatBox    : closeTagChatBox,
                    creatNonDomBox     : createNonDomBox,
                    makeVisibleChatBox : makeVisibleChatBox,
                    processInMessage   : processInMessage,
                    closeChatBox       : closeChatBox,
                    refreshBox         : refreshBox,
                    minimizeBox        : minimizeBox,
                    openAndAddMessage  : openAndAddMessage,

                    getBoxes: function () {
                        return boxes.all();
                    },

                    ggg: function () {
                        return boxes.nonClosedLength();
                    },

                    getBoxByUId : function(uId){
                        return boxes.get(uId);
                    },

                    getNumberOfAvailableChatBox: function (viewportXValue) {
                        //return numberOfAvailableChatBox;
                        return getNumberOfAvailableChatBox(viewportXValue);
                    },

                    getNonClosedLength: function () {
                        return boxes.nonClosedLength();
                    },

                    increaseUnreadMessageCount : function(boxId, messageId){
                        chatHistoryFactory.addUnreadMessageInfo(boxId, messageId);
                        chatHistoryFactory.updateUnreadMessageInfos();
                    },

                    decreaseUnreadMessageCount : function(boxId, messageId){
                        chatHistoryFactory.removeUnreadMessageInfo(boxId, messageId);
                        chatHistoryFactory.updateUnreadMessageInfos()
                    },

                    getUnreadMessageCount : function(){
                        return chatHistoryFactory.getUnreadMessageCount();
                    },

                    getUnreadConversationCount : function(){
                        return chatHistoryFactory.getUnreadConversationCount();
                    },

                    getChatClock : _getChatClock

                };
            }
        ]);



