	angular
		.module('ringid.chat')
        .controller('ChatController', ChatController);

        ChatController.$inject = ['$scope', '$rootScope', 'ChatFactory','ChatHelper',
            'chatRequestProcessor', 'ChatUtilsFactory', 'ChatResponses', 'ChatAuthResponses',
            'settings','SystemEvents', 'friendsFactory', 'ChatPacketSenderService',
            'chatTabSync', 'Utils',
             'chatHistoryFactory', '$ringhttp',
             '$$connector', 'Auth', 'tagChatManager', '$location', 'ChatConnector', 'ChatWorkerCommands'];

        function ChatController($scope, $rootScope, ChatFactory, ChatHelper,
                                chatRequestProcessor, ChatUtilsFactory, ChatResponses, ChatAuthResponses,
                                settings,SystemEvents,friendsFactory, ChatPacketSenderService,
                                chatTabSync, Utils,
                                chatHistoryFactory, $ringhttp,
                                $$connector, Auth, tagChatManager, $location, ChatConnector, ChatWorkerCommands) {



                var Constants = CHAT_APP.Constants;
                var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;

                var SESSION_TYPES = GENERAL_CONSTANTS.SESSION_TYPES;

                var SharedHelpers = CHAT_APP.SharedHelpers;
                var friendUtIdListReceivedRef;
                var myTagListReceivedRef;

                var  chatAppInitiated = false;
                $scope.boxes = ChatFactory.getBoxes();

                $scope.$on('chatDataReceived', function (event, data) {
                    ChatResponses.processUpdates(data.jsonData);
                    Utils.safeDigest($scope);

                });

                $scope.$on('authDataReceived', function (event, data) {
                    ChatAuthResponses.processUpdates(data.jsonData);
                    Utils.safeDigest($scope);

                });

                $scope.domBoxLength = function () {
                    var count = 0 ;
                    for(var i=0; i< $scope.boxes.length; i++){
                        if($scope.boxes[i].value.nonDomBox == true){
                            count++;
                        }
                    }
                    if(count>10){
                        return 10;
                    }else{
                        return count;
                    }
                };

                $scope.availableNo = ChatFactory.getNumberOfAvailableChatBox();

                $scope.getProfileLink = settings.baseUrl + '/#/profile/';

                //$scope.previousDate = {timestamp:1,date:''};
                $scope.goToProfile = function(event, profileLink){
                    //$location.path('/profile/2110010128');
                    $location.path(profileLink);
                    event.stopPropagation();
                };




                $scope.contactListAction = function(actionObj) {
                    if (!actionObj.friend.isLoading()) {
                        friendsFactory.friendAction(actionObj,true).then(function() {
                            $scope.$rgDigest();
                        }, function() {
                            $scope.$rgDigest();
                        });
                        $scope.$rgDigest();
                    }
                };

                $scope.$on(SystemEvents.COMMON.WINDOW_RESIZED, function(event, viewport){
                    // RingLogger.print("viewport : X: "+viewport.x+" Y:"+viewport.y,RingLogger.tags.CHAT);
                    $scope.availableNo = ChatFactory.getNumberOfAvailableChatBox(viewport.x);
                    Utils.safeDigest($scope);
                });


                var tabSyncNewData = Utils.onCustomEvent(SystemEvents.CHAT.TAB_SYNC_NEW_DATA, function(data){
                    RingLogger.information('TAB SYNC DATA', data, RingLogger.tags.TAB_DATA_RECEIVED);

                    if( data.type == GENERAL_CONSTANTS.TAB_SYNC_ACTIONS.CHAT_BOX_INFO_UPDATE ){
                        ChatFactory.refreshBox(data.boxId);

                    }else if ( data.type == GENERAL_CONSTANTS.TAB_SYNC_ACTIONS.CHAT_MSESSAGE_UPDATE){

                        chatHistoryFactory.loadChatBoxes();
                        ChatFactory.openAndAddMessage(data.boxId, data.msg);
                        //ChatHelper.loadHistoryMessageForF2FChat(data.boxId);
                    }

                });


                var startChatHearBeatInterval = function(){
                    window.addEventListener("online", function(e) {
                        if( window.navigator.onLine){
                            RingLogger.debug('Browser Gets Online From Offline', RingLogger.tags.CHAT);
                            chatRequestProcessor.getUnreadMessagesMultipleTimes();
                        }
                    });

                    var counter = 0;
                    var state = "online";
                    setInterval(function(){

                        $ringhttp.get(settings.chatHeartBeatUrl).success(function(response){

                            if(!!response){
                                if( state == "offline"){
                                    state = "online";
                                    Utils.triggerCustomEvent('online');
                                }
                            }
                        }).error(function(response){
                            if(counter > 3){
                                counter = 0;
                                state = "offline";
                            }else{
                                counter++;
                            }

                        });
                    }, 10000);
                };

                var registerOnNetErrorHandler = function(){

                    $scope.$on('NET_SUCCESS', function(){

                        RingLogger.alert('NET WAS DISCONNECTED, REQUESTING OFFLINE MESSAGES', RingLogger.tags.CHAT);
                        chatRequestProcessor.getUnreadMessagesMultipleTimes();

                    });

                    window.addEventListener("online", function(e) {
                        if( window.navigator.onLine){

                            RingLogger.alert('Browser Gets Online From Offline', RingLogger.tags.CHAT);
                            chatRequestProcessor.getUnreadMessagesMultipleTimes();
                        }
                    });

                }

               var sendOfflineGetRequest = function(){

                    if( !ChatUtilsFactory.hasOfflineIpPort()){

                        ChatPacketSenderService.doUpdateOfflineIpPort().then(function(response){
                            chatRequestProcessor.getUnreadMessagesMultipleTimes();
                        });

                    }else{
                        chatRequestProcessor.getUnreadMessagesMultipleTimes();
                    }
                };

                var openPreviouslyOpenedFriendChatBoxes = function(){
                    var storageBoxes = chatHistoryFactory.getAllOpenBoxes();// previously this was an array but now it is an object
                    if(!!storageBoxes){
                        Object.keys(storageBoxes).forEach(function(anOpenBoxId, key){
                            var box,
                                anOpenBoxInfo = storageBoxes[anOpenBoxId];

                            if(!anOpenBoxInfo.isTagChat){

                                ChatFactory.openChatBox(anOpenBoxInfo.boxId);
                                box = ChatFactory.getBoxByUId(anOpenBoxInfo.boxId);
                                var historyBox = chatHistoryFactory.getBox(anOpenBoxInfo.boxId);
                                angular.extend(box, historyBox);

                                ChatWorkerCommands.startChatSession(anOpenBoxInfo.boxId, SESSION_TYPES.FRIEND);


                                if(!!box){
                                    box.loadHistoryMessages();
                                }
                            }
                        });

                    } // end of if(storageBoxes)
                };

                var openPreviouslyOpenedTagChatBoxes = function(){
                    var storageBoxes = chatHistoryFactory.getAllOpenBoxes();// previously this was an array but now it is an object
                    if(!!storageBoxes){
                        Object.keys(storageBoxes).forEach(function(anOpenBoxId, key){
                            var box, anOpenBoxInfo = storageBoxes[anOpenBoxId];

                            if(!!anOpenBoxInfo.isTagChat){
                                tagChatManager.openPreviouslyOpenedBoxes(anOpenBoxInfo.boxId);
                            }

                        });

                    }
                };

                function initChatApp(){

                    try{

                        ChatConnector.initiate();

                        chatHistoryFactory.init();
                        chatTabSync.init();

                        sendOfflineGetRequest();
                        // startChatHearBeatInterval();
                        registerOnNetErrorHandler();


                        friendUtIdListReceivedRef = Utils.onCustomEvent(SystemEvents.FRIEND.UTID_LIST_RECEIVED, function(){
                            openPreviouslyOpenedFriendChatBoxes();
                        });


                        myTagListReceivedRef = Utils.onCustomEvent(SystemEvents.CHAT.MY_TAG_LIST_RECEIVED, function(){
                            openPreviouslyOpenedTagChatBoxes();
                        });

                    }catch(e){
                        RingLogger.alert('Chat App Init Error', e, RingLogger.tags.CHAT);

                    }

                }

                var registerChatAppInitEvent = function(){
                     $rootScope.$on('FIRST_FEED_RECEIVED', function(){
                        if( !chatAppInitiated){
                            chatAppInitiated = true;
                            initChatApp();
                        }

                    });

                    setTimeout(function(){
                        if( !chatAppInitiated){
                            chatAppInitiated = true;
                            initChatApp();
                        }
                    }, 6000);

                };

                if( Auth.isLoggedIn() ){

                   registerChatAppInitEvent();

                }else{
                    $scope.$on(SystemEvents.AUTH.LOGIN, function (event, data) {
                        if (data === true) {
                            registerChatAppInitEvent();
                        }
                    });
                }


                $scope.$on('$destroy', function(){

                    Utils.removeCustomEvent(SystemEvents.CHAT.TAB_SYNC_NEW_DATA, tabSyncNewData);
                    Utils.removeCustomEvent(SystemEvents.FRIEND.UTID_LIST_RECEIVED, friendUtIdListReceivedRef);
                    Utils.removeCustomEvent(SystemEvents.CHAT.MY_TAG_LIST_RECEIVED, myTagListReceivedRef);

                });




        }


