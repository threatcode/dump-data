
    /** Helpers **/
    function getMessagePacketIdForHistoryRequest(message){
        var packetId = message.key;

        if( message.status == 'status_update'){
            try{
                packetId = packetId.split('_')[0];
            }catch(e){
            }
        }

        return packetId;
    }

    var doHistoryRequest = function(scope, chatRequestProcessor, chatBox, direction, newPacketId ){

        var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;

        if(!!chatBox && !!chatBox.nonDomBox ){

            var bottomMessage = chatBox.getBottomMessage();
            var topMessage = chatBox.getTopMessage();

            //var bottomPacketId = chatBox.messageMaxPacketId,
            //    topPacketId = chatBox.messageMinPacketId;

            var topPacketId, bottomPacketId;

            if( !topMessage && !bottomMessage){

                topPacketId = bottomPacketId = newPacketId;

            }else{
                //bottomPacketId = getMessagePacketIdForHistoryRequest(bottomMessage);
                //topPacketId = getMessagePacketIdForHistoryRequest(topMessage);
                bottomPacketId = chatBox.messageMinPacketId;
                topPacketId = chatBox.messageMaxPacketId
            }

            var historyRequestMethod = chatRequestProcessor.getHistoryRequestMethodByBox(chatBox);

            var isSameMessage = ( topPacketId == bottomPacketId );

            var limit = GENERAL_CONSTANTS.HISTORY_MAX_MESSAGE + 2;

            if( !direction || direction == GENERAL_CONSTANTS.PAGE_DIRECTION.UP )
            {
                doSendHistoryRequest(scope, historyRequestMethod, chatBox, GENERAL_CONSTANTS.PAGE_DIRECTION.UP, bottomPacketId, limit);
            }

            if(!isSameMessage){

                if( !direction || direction == GENERAL_CONSTANTS.PAGE_DIRECTION.DOWN ){
                    doSendHistoryRequest(scope, historyRequestMethod, chatBox, GENERAL_CONSTANTS.PAGE_DIRECTION.DOWN, topPacketId, limit);
                }
            }

        }
    };


    function doSendHistoryRequest(scope, requestMethod, chatBox, direction, packetId, limit){

        var boxId = chatBox.getKey();

        scope.historyLoading = true;

        requestMethod.call(this, boxId, direction, packetId, limit)
            .then(function(response){
                if(!!response.sucs){
                    scope.historyLoading = false;
                }
                scope.refreshScrollbar(); 

            }, function(){
                scope.historyLoading = false;
                chatBox.hasHistoryMessage = true;
                scope.refreshScrollbar(); 
            });

        setTimeout(function(){
            if( !scope.historyLoading ){
                scope.historyLoading = false;
                scope.refreshScrollbar();
            }
        }, 10000);
    }

    /** **/


    chatBoxUi.$inject = ['Utils', 'SystemEvents', 'ChatFactory', '$rootScope', 'chatRequestProcessor', 'chatTabSync', 'StickerFactory', '$document'];
    function chatBoxUi(Utils, SystemEvents, ChatFactory, $rootScope, chatRequestProcessor, chatTabSync, StickerFactory, $document){

        var templateUrl = 'templates/chatbox.html';

        return {
            restrict: 'E',
            replace: true,
            scope : true,
            templateUrl  : templateUrl,
            link : function(scope){
                setTimeout(StickerFactory.initStickerData, 5000);

                var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;

                var boxOpennedRef = Utils.onCustomEvent(SystemEvents.CHAT.BOX_OPENNED, function(data){

                    /*** 
                    ** Fires, when 
                    ** 1. User Opens a closed box,
                    ** 2. An `chatbox` gets nonDomBox=true
                    ***/
                    var chatBox = ChatFactory.getBoxByUId(data.boxId);

                    if(!!chatBox){

                        if( chatBox.messages.length < GENERAL_CONSTANTS.HISTORY_MAX_MESSAGE ){

                            setTimeout(function(){

                                chatBox.loadHistoryMessages();

                                setTimeout(function(){
                                    if( !chatBox.bottomScrolled ){
                                        chatBox.bottomScrolled = true;
                                        Utils.triggerCustomEvent(SystemEvents.CHAT.SCROLL_TO_BOTTOM, {boxId : data.boxId });
                                    }
                                }, 500);

                            }, 500);


                            // if( chatBox.messages.length < GENERAL_CONSTANTS.HISTORY_MAX_MESSAGE ){

                            //     var newPacketId = CHAT_APP.UTILS.getUUIDPacketId();

                            //     doHistoryRequest( scope, chatRequestProcessor, chatBox, GENERAL_CONSTANTS.PAGE_DIRECTION.UP, newPacketId );
                            // }
                        }

                    }


                    if(!!data.sendToTab){
                        chatTabSync.sendData(GENERAL_CONSTANTS.TAB_SYNC_ACTIONS.CHAT_BOX_INFO_UPDATE, {boxId : data.boxId});
                    }

                    scope.$rgDigest();
                    scope.$parent.$rgDigest();
                });

                $document.on('click', function(event) {
                    //if(scope.box.value.getKey() !== attrs.chatFocus) // can't receive clicked element for other elements, while this event fires double for clicked element
                    //scope.box.value.isFocused = false;
                    $rootScope.$broadcast("focusOn", null);
                    //RingLogger.log("removed:"+scope.box.value.getKey() +":"+ scope.box.value.isFocused);
                });

                scope.$on('$destroy', function(){
                    Utils.removeCustomEvent(SystemEvents.CHAT.BOX_OPENNED, boxOpennedRef);
                    Utils.removeCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED, tagListUpdatedFuncRef);
                });

            }


        };
    }

    function extraChatBoxes(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/partials/chat/extra-chatboxes.html'

        };
    }

    singleChatBox.$inject = ['Utils', '$rootScope', 'SystemEvents', 'chatTabSync', 'ChatFactory', 'chatRequestProcessor'];
    function singleChatBox(Utils, $rootScope, SystemEvents, chatTabSync, ChatFactory, chatRequestProcessor){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/partials/chat/single-chatbox.html',
            link : function(scope, elem, attr){

                    var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;

                    var boxCallbacks = {};

                    var boxCallback = function(data){
                        RingLogger.log('BOX CALLBACK', data, 'CHAT'); 

                        scope.refreshScrollbar(true);

                        Utils.safeDigest(scope);

                        if( !data.noScroll && scope.bottomScrolled){
                            Utils.triggerCustomEvent(SystemEvents.CHAT.SCROLL_TO_UNREAD, {boxId : data.boxId });
                        }                        

                        if( data.blink ){
                           $rootScope.$broadcast('blinkerEvent',data.boxId);
                        }
                    }

                    var doSomethingOnMessageReceived = function(data){
                        var boxId = data.boxId.toString();

                        if( boxId == scope.box.key){

                            if( !boxCallbacks[boxId] ){
                                boxCallbacks[boxId] = {};
                            }

                            if( !boxCallbacks[boxId][data.type] ){

                                boxCallbacks[boxId][data.type] = Utils.debounce(function(_data){
                                    boxCallback(_data);
                                }, 500, false);
                            }

                            boxCallbacks[boxId][data.type].call(this, data);
                        }
                    };


                    var chatHistoryLoadedRef = Utils.onCustomEvent(SystemEvents.CHAT.HISTORY_LOADED, function(data){
                        var boxId = data.boxId.toString();

                        if( boxId == scope.box.key){

                            var newPacketId = CHAT_APP.UTILS.getUUIDPacketId();

                            doHistoryRequest(scope, chatRequestProcessor, scope.box.value, null, newPacketId);

                            Utils.safeDigest(scope);

                        }

                    });

                    var tagListUpdatedFuncRef = Utils.onCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED, function(data){
                        data['type'] = 'tag_updated';
                        data['noScroll'] = true;
                        data['blink'] = false;
                        data['boxId'] = data.tagId;
                        doSomethingOnMessageReceived(data);
                    });

                    //var newMessagePushedRef = Utils.onCustomEvent('NEW_MESSAGE_PUSHED', function(data){
                    //    data['type'] = 'pushed';
                    //    doSomethingOnMessageReceived(data);
                    //});

                    var messageReceivedRef = Utils.onCustomEvent(SystemEvents.CHAT.MESSAGE_PUSHED, function(data){                        
                        /** 
                        ** Fires when 
                        ** 1. non history message has been received for tag/friend.
                        **/

                        data['type'] = 'pushed';
                        data['noScroll'] = data.noScroll || data.fromLocalHistory || data.fromHistory || data.isEdit || false;
                        data['blink'] = !data.fromLocalHistory || !data.fromHistory || true;
                        doSomethingOnMessageReceived(data);
                    });

                    var chatBoxUpdatedRef  = Utils.onCustomEvent(SystemEvents.CHAT.BOX_UPDATED,function(data){
                        /** 
                            Event will be fired on, 
                            1. Typing Change
                            2. Unread Count Change
                            3. Delete Message From Own, 
                            4. Update Message Status after packet send
                            5. Typing Received 
                        **/
                        if(data.boxId == scope.box.key){
                            Utils.safeDigest(scope);
                        }
                    });

                    scope.$on('$destroy', function(){

                        Utils.removeCustomEvent(SystemEvents.CHAT.HISTORY_LOADED, chatHistoryLoadedRef );
                       // Utils.removeCustomEvent('NEW_MESSAGE_PUSHED', newMessagePushedRef );
                        Utils.removeCustomEvent(SystemEvents.CHAT.MESSAGE_RECEIVED, messageReceivedRef );
                        Utils.removeCustomEvent(SystemEvents.CHAT.BOX_UPDATED, chatBoxUpdatedRef );
                        Utils.removeCustomEvent(SystemEvents.CHAT.TAG_LIST_UPDATED, tagListUpdatedFuncRef);

                    });
                }

            };
        }

        function chatBoxTopBar(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/chatbox-topbar.html'

            };
        }
        function chatBoxTopBarMenu(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/chatbox-topbar-menu.html',
                link : function(scope){

                    var box = scope.box.value;

                    scope.hideTopbar = true;

                    setTimeout(function(){
                        scope.hideTopbar = false;
                        scope.$rgDigest();
                    }, 3000);

                    //box.hideSuggestion = true;
                    //
                    //setTimeout(function(){
                    //    if(box.value ){
                    //        box.hideSuggestion = false;
                    //        scope.$rgDigest();
                    //    }
                    //}, 10000);

                    scope.shouldShowLastOnlineBar = function(){
                        return ( box.offlineStatus && box.lastSeenBar && !!box.getUser().lastOnline && box.getUser().lastOnline() );
                    };

                    scope.shouldShowFriendSuggestion = function(){
                        return (!box.hideSuggestion & !box.isTagChat && !!box.getUser() && box.getUser().friendshipStatus() != 1 ) && !box.offlineStatus;
                    };

                    scope.shouldShowChatBoxTopbarMenu = function(){
                        return !box.isTagChat && ( scope.shouldShowLastOnlineBar() || scope.shouldShowFriendSuggestion() );
                    };


                }

            };
        }
        function chatBoxUrlPreview(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/chatbox-url-preview.html'

            };
        }
        chatBoxBottom.$inject = ['Utils', '$document'];
        function chatBoxBottom(Utils, $document){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/chatbox-bottom.html',
                link : function(scope, elem, attr){

                    scope.toggleMenu = function(){
                        scope.showBottomMenu = !scope.showBottomMenu;
                        Utils.safeDigest(scope);
                    };

                    //elem.on('mouseover', function(){
                    //    scope.showBottomHover = true;
                    //    Utils.safeDigest(scope);
                    //
                    //});
                    //
                    //elem.on('mouseleave', function(){
                    //    scope.showBottomHover = false;
                    //    Utils.safeDigest(scope);
                    //
                    //});

                }

            };
        }

        function chatBoxLocationInfo(){
            return {
                restrict: 'E',
                replace: true,
                link : function(scope){

                },
                templateUrl: 'templates/partials/chat/chatbox-location-info.html'

            };
        }


        chatBoxBottomMenu.$inject = ['Utils', 'rgRecorderService'];
        function chatBoxBottomMenu(Utils, rgRecorderService){
            return {
                restrict: 'E',
                replace: true,
                link : function(scope, elem, attr){

                    scope.showMediaButton = rgRecorderService.hasUserMediaSupport();

                    elem.on('mouseover', function(){
                        scope.$parent.bottomMenuHover = true;

                    });

                    elem.on('mouseleave', function(){
                        scope.$parent.bottomMenuHover = false;

                    });

                },
                templateUrl: 'templates/partials/chat/chatbox-bottom-menu.html'

            };
        }

        chatBoxMiddle.$inject = ['$rootScope', 'Utils']
            function chatBoxMiddle($rootScope, Utils){
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'templates/partials/chat/chatbox-middle.html',
                    link : function(scope){


                    }

                };
            }
        chatSingleMessage.$inject = ['Utils', '$ringbox', 'SystemEvents', '$$mediaMap'];
        function chatSingleMessage(Utils, $ringbox, SystemEvents, $$mediaMap){
            return {
                restrict: 'E',
                replace: true,
                link : function(scope,element, attr){
                    
                    var singleMessageUpdatedEventReference = Utils.onCustomEvent(SystemEvents.CHAT.SINGLE_MESSAGE_UPDATED ,function(data){
                    
                        var message = data.message;
                        if(message.key == scope.message.key){
                            Utils.safeDigest(scope);
                        }
                    });

                    // var tagStatuMessageUpdatedRef = Utils.onCustomEvent('TAG_STATUS_MESSAGE_UPDATED',  function(data){
                    //     if( !!data.userId && !!data.tagId ){
                    //         if( scope.box.key == data.tagId && scope.message.key == data.messageKey ){
                    //             scope.message.refreshStatusMessageText();
                    //             scope.$rgDigest();

                    //             if( !!scope.message.allStatusUserFetched ){
                    //                 Utils.removeCustomEvent('TAG_STATUS_MESSAGE_UPDATED', tagStatuMessageUpdatedRef);
                    //             }
                    //         }
                    //     }                        
                    // });

                    var boxInstance;
                    scope.openRingboxContent = function (message) {
                        boxInstance = $ringbox.open({
                            type : 'remote',
                            scopeData:{
                                message : message,
                                viewport : Utils.viewport
                            },
                            resolve: {
                                data : {}
                            },
                            onBackDropClickClose: true,
                            templateUrl : 'templates/partials/chat/media-preview.html'
                        });
                    };

                    scope.getMediaData = function (mediaObject) {

                        return {
                                data: function () {
                                    return {
                                        media: mediaObject
                                    };
                                },
                                promise: mediaObject.fetchDetails() // Media.fetchContentDetails(media, true, media.user())
                            };

                    };

                    var singleMessageTimeoutRef = Utils.onCustomEvent(SystemEvents.CHAT.SINGLE_MESSAGE_TIMEOUT, function(data){
                        var box = data.box;
                        if(!!boxInstance){
                            boxInstance.close();
                        }
                    });

                    scope.$on("$destroy", function () {
                        Utils.removeCustomEvent(SystemEvents.CHAT.SINGLE_MESSAGE_UPDATED, singleMessageUpdatedEventReference);
                        Utils.removeCustomEvent(SystemEvents.CHAT.SINGLE_MESSAGE_TIMEOUT, singleMessageTimeoutRef);
                        // Utils.removeCustomEvent('TAG_STATUS_MESSAGE_UPDATED', tagStatuMessageUpdatedRef);

                    });

                },
                templateUrl: 'templates/partials/chat/message/single.html'

            };
        }

        function chatFileUploadProgress(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/message/upload-progress.html'

            };
        }

        singleMessageStatus.$inject = ['Utils', 'ChatUtilsFactory'];
        function singleMessageStatus(Utils, ChatUtilsFactory){

            var CHAT_GLOBAL_VALUES = CHAT_APP.Constants.CHAT_GLOBAL_VALUES;
            var SharedHelpers = CHAT_APP.SharedHelpers;


            var getMessageStatusText = function(isTagChat, messageStatus){
                var statusText = !messageStatus ? 'Pending' : messageStatus;

                if(statusText === 'Sent') {
                    statusText = 'Delivered';
                }

                //statusText += ' ' + messageTime;

                return statusText;

            };

            var getMessageTime = function(messageDate){
                return  ChatUtilsFactory.getChatVerbalDateFromServerDate(messageDate);
            };

            return {
                restrict: 'E',
                replace: true,
                link : function(scope, elem, attrs){

                    scope.$watch("message.status", function(){

                        scope.message.statusText = getMessageStatusText(
                                scope.box.value.isTagChat,
                                scope.message.status
                                );
                        scope.message.statusDate = getMessageTime(scope.message.messageDate);
                        scope.message.statusUserName = scope.message.user.getName();

                    });

                },
                templateUrl: 'templates/partials/chat/message/status.html'
            };
        }

        chatHistoryLoader.$inject = ['chatRequestProcessor', 'tagChatFactory', 'ChatFactory'];
        function chatHistoryLoader(chatRequestProcessor, tagChatFactory, ChatFactory){

            return {
                restrict: 'E',
                replace: true,
                link : function(scope, elem, attrs){

                    var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;

                    scope.historyLoading = false;
                    //scope.noMoreHistoryMessageText = "Group conversion has not yet started";

                    elem.on('click', function(){

                        var newPacketId = CHAT_APP.UTILS.getUUIDPacketId();
                        scope.freezeScrollbar(); 
                        
                        doHistoryRequest(scope, chatRequestProcessor, scope.box.value, GENERAL_CONSTANTS.PAGE_DIRECTION.UP, newPacketId);


                    });
                },
                templateUrl: 'templates/partials/chat/history-loader-view.html'

            };
        }

        /* Single Page Directives */

        function singlePageChatUI(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/single-page/home.html',
                controller : 'ChatHistoryController'

            };
        }

        function chatSinglePageTop(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/single-page/top.html'

            };
        }

        function chatSinglePageLeft(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/single-page/left.html'

            };
        }

        function chatSinglePageRight(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/single-page/right.html'

            };
        }

        function chatLeftSingleBox(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/single-page/left-single-box.html'

            };
        }

        function chatRightSingleBox(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/single-page/right-single-box.html'

            };
        }

        function chatMessageBox(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/single-page/message-box.html'

            };
        }

        function chatBoxTopBarStatus(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/partials/chat/chatbox-topbar-status.html',
                link : function(scope, elem){

                }

            };
        }

        angular
            .module('ringid.chat')
            .directive('chatBoxUi', chatBoxUi)
            .directive('chatBoxTopBar', chatBoxTopBar)
            .directive('chatBoxMiddle', chatBoxMiddle)
            .directive('chatBoxBottom', chatBoxBottom)
            .directive('extraChatBoxes', extraChatBoxes)
            .directive('chatBoxUrlPreview', chatBoxUrlPreview)

            .directive('chatBoxTopBarStatus', chatBoxTopBarStatus)
            .directive('chatBoxTopBarMenu', chatBoxTopBarMenu)
            .directive('chatBoxBottomMenu', chatBoxBottomMenu)
            .directive('chatBoxLocationInfo', chatBoxLocationInfo)

            .directive('chatSingleMessage', chatSingleMessage)
            .directive('chatFileUploadProgress', chatFileUploadProgress)

            .directive('singleMessageStatus', singleMessageStatus)
            .directive('chatHistoryLoader', chatHistoryLoader)

            .directive('singleChatBox', singleChatBox)

            /* Single Page Directives */

            .directive('chatSinglePageTop', chatSinglePageTop)

            .directive('chatSinglePageLeft', chatSinglePageLeft)
            .directive('chatLeftSingleBox', chatLeftSingleBox)

            .directive('chatSinglePageRight', chatSinglePageRight)
            .directive('chatRightSingleBox', chatRightSingleBox)

            .directive('chatMessageBox', chatMessageBox)

            .directive('singlePageChatUI', singlePageChatUI);


