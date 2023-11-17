/*
 * © Ipvision
 */

	angular
		.module('ringid.chat')
        .controller('ChatHistoryController', ChatHistoryController);

    ChatHistoryController.$inject = ['$scope', '$rootScope', 'ChatFactory', 'Storage',
        'Auth', 'Api', 'tagChatFactory', 'userFactory', 'Utils',
        'chatHistoryFactory',
        '$$stackedMap', 'SystemEvents', 'rgScrollbarService'];
    function ChatHistoryController($scope, $rootScope, ChatFactory, Storage,
                                   Auth, Api, tagChatFactory, userFactory, Utils,
                                   chatHistoryFactory,
                                   $$stackedMap, SystemEvents, rgScrollbarService) {

        var Constants = CHAT_APP.Constants;
        var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
        var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES;
        var SharedHelpers = CHAT_APP.SharedHelpers;

        $scope.selectedLeftBox = {key: 0, messages : []};

        $scope.boxes = $$stackedMap.createNew(true);

        $scope.recentMessages = $$stackedMap.createNew(true);

        $scope.ready = $rootScope.chatHistoryReady || false;

        $scope.selectLeftBox = function(box){
            $scope.selectedLeftBox = box;
        };

        var getMessageTime  = function(messageDate) {
            var localTime = SharedHelpers.getClientTimeFromServerTime(messageDate);
            var localFormatedTime = Utils.verbalDate(localTime);
            return localFormatedTime;
        };

        $scope.getMessageTime = getMessageTime;


        var updateMessageObject = function(messageObject){
            messageObject.user = userFactory.create({uId: messageObject.user});
            messageObject.user.requestUserDetails().then(function() {
                    $scope.$rgDigest();
            });
            //profileFactory.getUserDetailsByUId(messageObject.userId || messageObject.user).then(function(userObj){
                //if(!!userObj){
                    //messageObject.user =  userObj;

                    //$scope.$rgDigest();
                //}

            //});
        };

        var updateUserObject = function(msgObject, userId){
            if( !!userId){
                msgObject.user = userFactory.create({uId: userId});
                msgObject.user.requestUserDetails().then(function(){
                    $scope.$rgDigest();
                });
            }
        };



        var initABox = function(aBox){
            if(!aBox.messages.length){
                return;
            }

            var aBoxObject = {
                key :  aBox.key,
                boxImg : '',
                boxTitle : '',
                boxUser  : '',
                boxLastMessage : '',
                messages : [],
                isTagChat : false,
                sortBy : function(){
                    return this.getLastMessage().messageDate;
                },
                getBoxTitle : function(){
                    return this.boxTitle;
                },
                getLastMessage : function(){
                    if( this.messages.length > 0){
                        return this.messages[this.messages.length-1];
                    }
                },

                getLastMessageText : function(){
                    var lastMessage = this.getLastMessage();
                    if( lastMessage.messageType == 2){
                        return lastMessage.text;
                    }else{
                        return "[MEDIA]";
                    }

                }
            };

            aBoxObject.messages = aBox.messages;

            for(var index = 0, length = aBox.messages.length; index < length; index++){
                aBox.messages[index].userId = aBox.messages[index].user;
                delete aBox.messages[index].user;

                updateUserObject(aBoxObject.messages[index], aBox.messages[index].userId);
            }

            aBoxObject.boxTitle = aBox.key;

            if( !aBox.isTagChat){

                var boxUser = userFactory.getUser(aBox.key);
                if(!!boxUser){

                    aBoxObject.boxTitle = boxUser.getName();
                    aBoxObject.boxImg = boxUser.avatar('thumb');

                }else{

                    var user = userFactory.create({uId: aBox.key});
                    user.requestUserDetails().then(function(){
                        aBoxObject.boxTitle = user.getName();
                        aBoxObject.boxImg = user.avatar();
                        $scope.$rgDigest();
                    });
                    //profileFactory.getUserDetailsByUId(aBox.key).then(function(userObj){
                        //if(!!userObj){
                            //aBoxObject.boxTitle = userObj.getName();
                            //aBoxObject.boxImg = userObj.avatar();
                        //}

                    //});
                }


            }else{

                aBoxObject.isTagChat = true;

                var aTag = tagChatFactory.getOrCreateTag(aBox.key);
                aBoxObject.tag = aTag;
                aBoxObject.boxTitle = aTag.getTagName();
                aBoxObject.boxImg = aTag.getPictureUrl();
            }


            $scope.boxes.save(aBoxObject.key, aBoxObject);

        };


        var getMessageText = function(message){
            if (!!message.statusType){
                return "Activity message.";
            }
            else if( message.messageType == GENERAL_CONSTANTS.MESSAGE_TYPES.PLAIN_MESSAGE){
                return message.text;

            } else {
                return "Received media message.";
            }
        };

        var getUnreadStatus = function(message){

            if( message.status == 'Unread' ){
                return true;
            }else if ( message.status == "Received" && !message.seenSent){
                return true;
            }else{
                return false;
            }

        };

        var getBoxUnreadCount = function(aBox){

            return chatHistoryFactory.getUnreadMessageCountByBoxId(aBox.key);
        };

        var getMessageAdaptorObject = function(aHistoryMessageObject){

            var aMessageObject              = angular.copy(aHistoryMessageObject);
            aMessageObject['date']          = getMessageTime(aMessageObject.messageDate);
            aMessageObject['isUnread']      = function(){ return getUnreadStatus(aMessageObject) };
            aMessageObject['messageText']   = function(){ return getMessageText(aMessageObject) };

            if( !!aMessageObject.user.getKey ){
                updateUserObject(aMessageObject, aMessageObject.user);
            }

            aMessageObject['isSelf'] = function() { return aHistoryMessageObject.userId == Auth.currentUser().getKey() };


            return aMessageObject;
        };

        var getBoxLastMessage = function(aBoxObject){
            var lastMessage = false;
            if( !!aBoxObject.messages && aBoxObject.messages.length > 0){

                aBoxObject.messages.sort(function(a, b){
                    if( a.messageDate > b.messageDate ){
                        return 1
                    }else if( a.messageDate < b.messageDate){
                        return -1
                    }
                    return 0;
                });

                lastMessage = aBoxObject.messages[aBoxObject.messages.length-1];
            }
            return lastMessage;
        };

        var updateBoxLastMessageByBoxId = function(boxId){

            var currentUserBoxes = chatHistoryFactory.getChatBoxes();
            var aHistoryBoxObject =  currentUserBoxes[boxId];

            var aBox = $scope.boxes.get(boxId);
            if( !!aBox){
                aBox.messages = aHistoryBoxObject.messages;

                var lastMessage = getBoxLastMessage(aBox);

                if( lastMessage ){
                    aBox['lastMessage'] = getMessageAdaptorObject(lastMessage);
                }
            }

        };

        var getBoxObject = function(aHistoryBoxObject){

            var aBoxObject = angular.copy(aHistoryBoxObject);

            var lastMessage = getBoxLastMessage(aBoxObject);

            if( lastMessage ){
                aBoxObject['lastMessage'] = getMessageAdaptorObject(lastMessage);
            }

            aBoxObject['unreadCount'] = function(){ return getBoxUnreadCount(aHistoryBoxObject); }

            aBoxObject['sortBy'] = function(){ return this.lastMessage.messageDate; };

            if( aBoxObject.isTagChat ){
                var tagId = aHistoryBoxObject.key;

                var tagObject = tagChatFactory.getTag(tagId);

                aBoxObject['getTitle'] = function() {
                    var tagObject = tagChatFactory.getTag(tagId);
                    return !tagObject ? "" : tagObject.getTagName();
                };

                aBoxObject['getCover']= function(){
                    var tagObject = tagChatFactory.getTag(tagId);
                    return !tagObject ? "" : tagObject.getPictureFullUrl()
                };

                aBoxObject['shouldVisible'] = function(){
                    var tagObject = tagChatFactory.getTag(tagId);
                    return !tagObject ? false : tagObject.isTagSafeToShow();
                };


            }else{

                updateUserObject(aBoxObject, aBoxObject.key);

                aBoxObject['getTitle'] = function(){
                    return aBoxObject.user.getName();
                };

                aBoxObject['getCover']= function(){
                    return aBoxObject.user.avatar('thumb') ;
                };

                aBoxObject['shouldVisible'] = function(){ return true; };

            }


            return aBoxObject;
        };


        $scope.initBoxMessages = function(aBox){
            if( !!aBox.messages ){
                angular.forEach(aBox.messages, function(aBoxMessage, index){
                    var aBoxMessage = getMessageAdaptorObject(aBoxMessage);
                    $scope.recentMessages.add(aBoxMessage.key, aBoxMessage );
                });
            }
        };


        $scope.initRecentMessages = function(){

            var currentUserId = Auth.currentUser().getKey();

            var currentUserBoxes = chatHistoryFactory.getChatBoxes();
            if(!!currentUserBoxes){
                angular.forEach( currentUserBoxes, function(aBox, key){

                    var aBoxObject = getBoxObject(aBox);

                    if( aBoxObject.lastMessage ){
                        $scope.boxes.add(aBox.key, aBoxObject);
                    }

                });
            }

        };

        $scope.clearRecentMessages = function(){
            $scope.recentMessages.clear();
        };

        $scope.openChatBox = function(boxId, isTagChat){

            Utils.triggerCustomEvent(SystemEvents.CHAT.UNREAD_MESSAGE_INFO_UPDATED);

            if( !!isTagChat ){
                ChatFactory.openTagChatBox(boxId);
            }else{
                ChatFactory.openChatBox(boxId);
            }

        };

        $scope.initRecentMessages();

        if(!$rootScope.chatHistoryReady){
            setTimeout(function(){
                $scope.ready = true;
                $rootScope.chatHistoryReady = true;
                $scope.$rgDigest();
                rgScrollbarService.recalculate($scope);
            }, 3000);
        }

        var myTagListReceivedEventListener = Utils.onCustomEvent(SystemEvents.CHAT.MY_TAG_LIST_RECEIVED, function(){
            Utils.safeDigest($scope);
        });

        var taglistupdatedEventListener = Utils.onCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED, function(){
            Utils.safeDigest($scope);
        });

        var messageReceivedEventListener = Utils.onCustomEvent(SystemEvents.CHAT.MESSAGE_RECEIVED, function(data){
            updateBoxLastMessageByBoxId(data.boxId);
            Utils.safeDigest($scope);
        });


        var newMessageSubmittedEventListener = Utils.onCustomEvent( SystemEvents.CHAT.MESSAGE_SUBMITTED , function(data){
            updateBoxLastMessageByBoxId(data.boxId);
            Utils.safeDigest($scope);
        });


        $scope.$on("$destroy", function(){

            Utils.removeCustomEvent(SystemEvents.CHAT.MY_TAG_LIST_RECEIVED, myTagListReceivedEventListener);
            Utils.removeCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED, taglistupdatedEventListener);

            Utils.removeCustomEvent(SystemEvents.CHAT.MESSAGE_SUBMITTED, newMessageSubmittedEventListener);
            Utils.removeCustomEvent(SystemEvents.CHAT.MESSAGE_RECEIVED, messageReceivedEventListener);

        });



    }

