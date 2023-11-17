/**
 * Created by mahbubul on 8/23/15.
 */


    var chatApp;

    try {
    chatApp = angular.module('ringid.chat');
    } catch (e) {

    }

    chatApp.directive('chatFocus', chatFocusDirective);

    chatFocusDirective.$inject = ['fileUploadService',
    'chatHistoryFactory', '$document', '$rootScope',
     'Utils','Auth', 'ChatHelper','SystemEvents',
    'settings','ChatSeenSend', 'ChatPacketSenderService', 'chatTabSync', 'Ringalert', 'ChatConnector', 'ChatUtilsFactory', 'rgScrollbarService'];

    function chatFocusDirective(fileUploadService,
         chatHistoryFactory, $document, $rootScope,
         Utils,Auth, ChatHelper,SystemEvents,
         settings,ChatSeenSend, ChatPacketSenderService,  chatTabSync, Ringalert, ChatConnector, ChatUtilsFactory, rgScrollbarService

    ) {

        var Constants =  CHAT_APP.Constants;
        var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES;
        var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
        var SharedHelpers = CHAT_APP.SharedHelpers;

        return {
            controller: ['$scope','ChatSeenSend', 'ChatHelper', 'Auth', 'rgScrollbarService', 'ChatUtilsFactory','SystemEvents',
                function ($scope,ChatSeenSend, ChatHelper, Auth, rgScrollbarService, ChatUtilsFactory, SystemEvents) {
                $scope.onViewedCalled = function (message) {
                    var box = $scope.box.value;
                    var isTagChat = $scope.box.value.isTagChat;
                    var messages = [{key: message.key, value: message}];
                    var filterMessagesByViewPort = function(messages){
                        var filteredMessages = [];
                        for(var index = 0, length = messages.length; index < length; index++){
                            if(messages[index].value.user.getKey() !== Auth.loginData.uId
                                && messages[index].value.status !== "Deleted"
                                && messages[index].value.status !== "Played"
                                && messages[index].value.status !== "Viewed"
                                && messages[index].value.status !== "status_update"
                                && messages[index].value.seenSent != true
                            ) {
                                filteredMessages.push(messages[index]);
                            }
                        }
                        return filteredMessages;
                    };
                    if(angular.isArray(messages) && messages.length>0){
                        //todo filter by viewport
                        messages = filterMessagesByViewPort(messages);
                        //messages = filterMessageByMessageType(messages);
                        if(messages.length <1){
                            return;
                        }
                        //ChatHelper.decreaseUnreadCount(box,messages.length);
                        var promise = ChatSeenSend.sendSeenPacket(box, messages);
                        if(!!promise){
                            promise.then(function(){
                                $scope.$rgDigest();
                            });
                        }

                        if( !isTagChat ){//f2f
                            ChatHelper.startTimerOthers($scope, messages);
                        }
                    }// end of empty message check logic
                };
                $scope.showUnreadMessages = function () {
                    RingLogger.print("Unread Messages shown",RingLogger.tags.CHAT);
                    var box = $scope.box.value;

                    ChatHelper.decreaseUnreadCount(box);

                    Utils.triggerCustomEvent(SystemEvents.CHAT.SCROLL_TO_BOTTOM, {boxId : $scope.box.key, topAlign : true });

                };
            }],
            link: function(scope, element, attrs) {
                var boxId = scope.box.value.getKey();
                scope.uploadBoxValue = scope.box.value.getKey();

                scope.uploadAction = function (actionObj) {

                    RingLogger.print(actionObj,RingLogger.tags.CHAT);

                    var keyOrPacketId = Utils.getUniqueID("ring");


                    var afterUploadCallback = function(imgData) {
                        RingLogger.print(imgData, RingLogger.tags.CHAT);

                        fileUploadService.removeScope(scope);

                        if( !!imgData.sucs ){

                            var box = scope.box.value;
                            var isTagChat = box.isTagChat;
                            var isBoxOffline = box.offlineStatus;
                            var mediaData = { url : imgData.url, caption : imgData.caption, width: imgData.iw, height: imgData.ih };
                            var msg = settings.imBase + imgData.url;


                            box.removeMessage(keyOrPacketId);
                            Utils.safeDigest(scope);

                            ChatPacketSenderService.sendMessage( box, msg, GENERAL_CONSTANTS.MESSAGE_TYPES.IMAGE, {mediaData : mediaData});

                            scope.resetMessageInput();

                            Utils.safeDigest(scope);
                            //Utils.triggerCustomEvent(SystemEvents.CHAT.SCROLL_TO_BOTTOM, {boxId : scope.box.key });


                        }

                    };
                    var uploadFailedCallback = function(response){
                        Ringalert.show({mg:'Image Upload Failed, please try again'}, 'error');
                        box.removeMessage(keyOrPacketId);
                        scope.$rgDigest();

                    };

                    actionObj.uploadFile.fetchMeta(function(data){


                        var dummyMsgObj = {
                            key             :   keyOrPacketId,
                            uploadProgress  :   actionObj.uploadFile.getProgress,
                            uploading       :   true,
                            message         :   ' ',
                            mediaUrl        :   actionObj.uploadFile.getPreview(),
                            messageDate     :   SharedHelpers.getChatServerCurrentTime(),
                            messageType     :   GENERAL_CONSTANTS.MESSAGE_TYPES.IMAGE,
                            packetId        :   keyOrPacketId,
                            sessionId       :   Utils.getToken,
                            timeout         :   0,
                            status          :   0,
                            userId          :  Auth.currentUser().getKey(),
                            getMessageTime  : function(){
                                return  ChatUtilsFactory.getChatVerbalDateFromServerDate(dummyMsgObj.messageDate);
                            },

                            fileUploadObject : actionObj.uploadFile

                        };

                        scope.box.value.pushDummyMessage(dummyMsgObj,Auth.currentUser(),true);

                        //Utils.triggerCustomEvent(SystemEvents.CHAT.SCROLL_TO_BOTTOM, {boxId : scope.box.key });

                        fileUploadService.setScopeForDigest(scope);

                        Utils.safeDigest(scope);

                        actionObj.uploadFile.initUpload().then(function(imgData){
                            dummyMsgObj.uploading = false;
                            afterUploadCallback(imgData);
                        }, function(response){
                            console.log(response);
                            dummyMsgObj.uploading = false;
                            uploadFailedCallback(response);
                        });

                    });
                };

                var boxCamUploadRef = Utils.onCustomEvent(SystemEvents.CHAT.BOX_CAM_UPLOAD, function(data){
                    if( scope.box.value.getKey() == data.boxId ){
                        scope.uploadAction(data);
                    }
                });

                //$document.on('click', function(event) {
                //    //if(scope.box.value.getKey() !== attrs.chatFocus) // can't receive clicked element for other elements, while this event fires double for clicked element
                //    scope.box.value.isFocused = false;
                //    $rootScope.$broadcast("focusOn", null);
                //    //RingLogger.log("removed:"+scope.box.value.getKey() +":"+ scope.box.value.isFocused);
                //});


                var messages = scope.box.value.getMessages();
                var box = scope.box.value;
                var isTagChat = scope.box.value.isTagChat;

                var filterMessageByMessageType = function(messages){
                    var filteredMessages = [];
                    for(var index = 0, length = messages.length; index < length; index++){
                        switch (messages[index].value.messageType){
                            case 2 :
                            case 3 :
                            case 4 :
                            case 5 :
                            case 6 :
                                filteredMessages.push(messages[index]);
                                break;
                        }
                    }
                    return filteredMessages;
                };
                var filterMessagesByViewPort = function(messages){
                    var filteredMessages = [];
                    for(var index = 0, length = messages.length; index < length; index++){
                        if(messages[index].value.user.getKey() !== Auth.loginData.uId
                            && messages[index].value.status !== "Deleted"
                            && messages[index].value.status !== "Played"
                            && messages[index].value.status !== "Viewed"
                            && messages[index].value.status !== "status_update"
                            && messages[index].value.seenSent != true
                        ) {
                            filteredMessages.push(messages[index]);
                        }
                    }
                    return filteredMessages;
                };


                var updateMessagesStatus = function(messages){
                    var messagesToUpdate = [];
                    for(var index = 0, length = messages.length; index < length; index++){
                        if ( messages[index].value.status == 'Unread' && ( !messages[index].value.timeout || messages[index].value.timeout == 0 )  ){
                            messages[index].value.status = 'Received';
                            messagesToUpdate.push(messages[index].value);
                        }
                    }

                    chatHistoryFactory.updateMessages(messagesToUpdate, box.getKey());

                };

                var decreaseGlobalUnreadCount = function(boxId){
                   chatHistoryFactory.removeUnreadMessageInfoByBoxId(boxId)
                };
                /* for handling the focus on another tab : starts*/
                var chatTabSyncNewData = Utils.onCustomEvent(SystemEvents.CHAT.TAB_SYNC_NEW_DATA, function(data){

                    if(GENERAL_CONSTANTS.TAB_SYNC_ACTIONS.SECRET_CHAT_TIMER == data.type){
                        RingLogger.information('TAB_FOCUS_TIMER', data, RingLogger.tags.CHAT);
                        if(data.boxId == box.getKey()){
                            if(angular.isArray(messages) && messages.length>0){

                                //todo filter by viewport
                                var filteredMessages;
                                filteredMessages = filterMessagesByViewPort(messages);
                                filteredMessages = filterMessageByMessageType(filteredMessages);
                                if(filteredMessages.length <1){
                                    return;
                                }

                                updateMessagesStatus(messages);

                                decreaseGlobalUnreadCount(data.boxId);
                                box.updateUnreadCount();

                                //ChatHelper.decreaseUnreadCount(box,messages.length);
                                //ChatSeenSend.sendSeenPacket(box, messages);

                                if( !isTagChat ){//f2f
                                    ChatHelper.startTimerText(scope, filteredMessages);
                                }
                            }// end of empty message check logic
                        }
                    }

                });
                /* for handling the focus on another tab : ends*/
                /*for handling use case when user is focused by default:starts*/
                var wasFocusedRef = Utils.onCustomEvent(SystemEvents.CHAT.WAS_FOCUSED, function (data) {
                    if( !!data && !!data.box){
	                    var chatBox = data.box;
	                    var filteredMessages = data.filteredMessages;
	                    if(chatBox.getKey() == box.getKey()) {
	                        if (!chatBox.isTagChat) {//f2f
	                            ChatHelper.startTimerText(scope, filteredMessages);
	                        }
	                        /* for sending the focus to another tab {secretTimer}*/
	                        chatTabSync.sendData(GENERAL_CONSTANTS.TAB_SYNC_ACTIONS.SECRET_CHAT_TIMER, {boxId: chatBox.getKey()});
	                    }
                    }

                });
                /*for handling use case when user is focused by default:ends*/

                var doStartSecreetTimerRef = Utils.onCustomEvent(SystemEvents.CHAT.DO_START_SECRET_TIMER, function (data) {
                    if( !!data && data.boxId == boxId ){

                        if( data.others){
                            ChatHelper.startTimerOthers(scope, data.messages);
                        }else{
                            ChatHelper.startTimerText(scope, data.messages);
                        }
                    }
                });

                var onFocusCallback = function (event) {
                    event.stopPropagation();

                    var boxId = scope.box.value.getKey();
                    var box = scope.box.value;

                    var needDigest = false;
                    if( box.unreadCount > 0){
                        decreaseGlobalUnreadCount(boxId);
                        box.updateUnreadCount();
                        needDigest = true;
                    }

                    RingLogger.print('Focus Called', RingLogger.tags.CHAT_0);
                    if( !scope.bottomMenuHover && !scope.bottomMenuButtonHover){
                        scope.showBottomMenu = false;
                        needDigest = true;
                    }

                    if(needDigest){
                        Utils.safeDigest(scope);
                    }


                    for(var i=0; i<scope.boxes.length; i++){
                        scope.boxes[i].value.isFocused = false;
                    }
                    //handling the case while user is clicking the minimize button then onclick will fire and for this case we need to make isFocused false for that box

                    if (box.isMinimized === true) {
                        box.isFocused = false;
                    } else {
                        box.isFocused = true;
                    }
                    scope.$broadcast("blinkerOff", boxId);
                    $rootScope.$broadcast("focusOn", boxId);//need to broadcast from rootscope so that all boxes get this event, if we broadcast from scope then only the corresponding box gets event


                    if(angular.isArray(messages) && messages.length>0){

                        //todo filter by viewport
                        var filteredMessages;
                        filteredMessages = filterMessagesByViewPort(messages);
                        filteredMessages = filterMessageByMessageType(filteredMessages);
                        if(filteredMessages.length <1){
                            return;
                        }

                        updateMessagesStatus(messages);

                        //ChatHelper.decreaseUnreadCount(box,messages.length);
                        ChatSeenSend.sendSeenPacket(box, filteredMessages);

                        if( !isTagChat ){//f2f
                            ChatHelper.startTimerText(scope, filteredMessages);
                        }
                        /* for sending the focus to another tab {secretTimer}*/
                        chatTabSync.sendData(GENERAL_CONSTANTS.TAB_SYNC_ACTIONS.SECRET_CHAT_TIMER, {boxId : box.getKey()});
                    }// end of empty message check logic

                };

                element.on('click', onFocusCallback);


                scope.$on('$destroy', function(){
                    Utils.removeCustomEvent(SystemEvents.CHAT.BOX_CAM_UPLOAD, boxCamUploadRef );
                    Utils.removeCustomEvent(SystemEvents.CHAT.DO_START_SECRET_TIMER, doStartSecreetTimerRef );
                    Utils.removeCustomEvent(SystemEvents.WAS_FOCUSED , wasFocusedRef );
                    Utils.removeCustomEvent(SystemEvents.CHAT.TAB_SYNC_NEW_DATA, chatTabSyncNewData );
                });
            }
        };
    }
