
    openBox.$inject = ['ChatFactory', 'tagChatFactory', 'rgDropdownService', 'Utils', 'Auth', 'ChatHelper', 'ChatWorkerCommands', '$rootScope'];
    function openBox( ChatFactory,  tagChatFactory, rgDropdownService , Utils, Auth, ChatHelper, ChatWorkerCommands, $rootScope) {
        return {
            link: function (scope, element, attrs) {

                element.on("click", function (event) {

                    var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;
                    var SESSION_TYPES = GENERAL_CONSTANTS.SESSION_TYPES;

                    var boxId = !attrs.boxId ? false : attrs.boxId;
                    var isTagChat = attrs.isTagChat == "true" ? true : false;

                    if( !boxId ){
                        return;
                    }

                    if( attrs.openChatBox == Auth.currentUser().getKey() ){
                        return;
                    }

                    Utils.safeDigest(scope);
                    rgDropdownService.close(event);

                    var tagObject, tagChatBoxOpened = false;
                    if( isTagChat ){
                        tagObject = tagChatFactory.getTag(boxId);

                        if( !!tagObject && tagObject.isTagSafeToShow()){
                            tagChatBoxOpened = true;

                            var tagObject = tagChatFactory.getTag(boxId);
                            ChatWorkerCommands.startChatSession(boxId, SESSION_TYPES.TAG, tagObject.getMemberUserIds())
                            ChatFactory.openTagChatBox(boxId, true);
                        }

                    }else{

                        ChatWorkerCommands.startChatSession(boxId, SESSION_TYPES.FRIEND)
                        ChatFactory.openChatBox(boxId, true);
                    }

                    var box = ChatFactory.getBoxByUId(boxId);

                    if(!!box){
                        ChatHelper.decreaseUnreadCount(box);

                        if( tagChatBoxOpened ){
                            box.setTitle( tagObject.getTagName() );
                        }

                    }

                    Utils.safeDigest(scope);

                    $rootScope.$broadcast('focusOn',boxId);

                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        };
    }

    openChatBox.$inject = ['ChatFactory', 'Utils', 'Auth', 'ChatHelper', 'ChatWorkerCommands', '$rootScope'];
    function openChatBox(ChatFactory, Utils, Auth, ChatHelper, ChatWorkerCommands, $rootScope) {
        return {
            link: function (scope, element, attrs) {
                element.on("click", function (event) {

                    var boxId = attrs.openChatBox;

                    var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;
                    var SESSION_TYPES = GENERAL_CONSTANTS.SESSION_TYPES;

                    if( !boxId ){
                        
                        return;
                    }
                    if( boxId == Auth.currentUser().getKey() ){
                        
                        return;
                    }

                    Utils.safeDigest(scope);
                    ChatFactory.openChatBox(boxId, true);

                    //PullerSubscriber.requestForIp(attrs.openChatBox);
                    var box = ChatFactory.getBoxByUId(boxId);

                    if(box.getUser().friendshipStatus()==1){
                        //this is friend
                        ChatWorkerCommands.startChatSession(boxId, SESSION_TYPES.FRIEND)
                        // PullerSubscriber.requestForIp(attrs.openChatBox);

                    }else{
                        //this is not friend yet
                        var permission = Auth.getPermission();
                        if(permission.ancht ==1){

                            ChatWorkerCommands.startChatSession(boxId, SESSION_TYPES.FRIEND)
                            // PullerSubscriber.requestForIp(attrs.openChatBox);

                        }else{
                            var box =ChatFactory.getBoxByUId(boxId);
                            box.blocked = true;
                        }
                    }

                    if(!!box){
                        ChatHelper.decreaseUnreadCount(box);
                    }
                    $rootScope.$broadcast('focusOn',boxId);
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        };
    }




    openTagChatBox.$inject =  [ 'ChatFactory', 'tagChatFactory', 'tagChatManager', 'Auth', '$rootScope', 'ChatHelper', 'ChatWorkerCommands'];
    function openTagChatBox( ChatFactory, tagChatFactory, tagChatManager, Auth, $rootScope, ChatHelper, ChatWorkerCommands) {

        return {
            link: function (scope, element, attrs) {
                element.on("click", function () {

                    var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;
                    var SESSION_TYPES = GENERAL_CONSTANTS.SESSION_TYPES;

                    var tagId = attrs.openTagChatBox;

                    if( tagId <= 0){
                        return;
                    }

                    if( attrs.openChatBox == Auth.currentUser().getKey() ){
                        return;
                    }

                    var tagObject = tagChatFactory.getTag(tagId);

                    var box = ChatFactory.openTagChatBox(tagId, true);

                    box.setTitle( tagObject.getTagName() );

                    if( !!tagObject && tagObject.isTagSafeToShow()){

                        if(!!tagObject){

                            ChatWorkerCommands.startChatSession(tagId, SESSION_TYPES.TAG, tagObject.getMemberUserIds())

                        }
                    }

                    if(!!box){
                        box.loadHistoryMessages();
                        ChatHelper.decreaseUnreadCount(box);
                    }
                    $rootScope.$broadcast('focusOn',tagId);
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        };
    }


    makeVisibleChatBox.$inject = ['ChatFactory','$rootScope'];
    function makeVisibleChatBox(ChatFactory,$rootScope) {
        /*
         * Description: directive to make the hidden chatbox visible
         * param: userId (which is the key for the stackmap)
         * Scope: level 2 childscope of chatController scope
         * Event: no event is broadcasting/emitting
         * Dependency: ChatFactory
         * Date: 04-04-15
         * Developed By: rabbi
         * */

        return {
            link: function (scope, element, attrs) {
                element.on("click", function (event) {

                    scope.rbox.value.isFocused = true; // to make reordered box on focused
                    ChatFactory.makeVisibleChatBox(attrs.makeVisibleChatBox);
                    //$rootScope.$broadcast("focusOn", scope.rbox.value.getKey());
                    element.parent().parent().children().eq(0).removeClass('blink'); // for removing blink class when user clicks on hidden box
                    //element.parent().parent().parent().children().eq(3).children().children().eq(0).addClass('chat-active');//lav hoilo na, karon eita(box) remove hoya jay, tai ei line useless
                    event.preventDefault();
                });
            }
        };
    }


    showHiddenBoxes.$inject = ['ChatFactory','$rootScope'];
    function showHiddenBoxes(ChatFactory,$rootScope) {
        return {
            link: function (scope, element, attrs) {
                element.on("click", function () {
                    ChatFactory.openChatBox(attrs.openChatBox);
                });
            }
        };
    }

    closeBox.$inject = ['ChatFactory','chatHistoryFactory', 'tagChatFactory'];
    function closeBox(ChatFactory,chatHistoryFactory, tagChatFactory) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    ChatFactory.closeChatBox(scope.box.value.getKey()); //removes corresponding box from boxes stack using userId which is the key
                    chatHistoryFactory.removeOpenBox(scope.box.value.getKey());

                    var tagObject = tagChatFactory.getTag(scope.box.value.getKey());
                    if( !!tagObject ){
                        tagObject.initMessages();
                    }

                    scope.$parent.$digest();
                });
            }
        }; // return object for directive factory function
    }

    minimizeBox.$inject = ['ChatFactory','$rootScope'];
    function minimizeBox(ChatFactory,$rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function (event) {
                    if(!!scope.box.value.blinkOn && !scope.box.value.isMinimized){//true false: if blinking is on then it won't minimize
                        //blink on and not minimized
                        scope.$broadcast("blinkerOff", scope.box.value.getKey());
                        $rootScope.$broadcast("focusOn", scope.box.value.getKey());
                    } else if(!!scope.box.value.blinkOn && !!scope.box.value.isMinimized){//true true:
                        //blink on and minimized
                        ChatFactory.minimizeBox(scope.box.value.getKey());
                        scope.$broadcast("blinkerOff", scope.box.value.getKey());
                        $rootScope.$broadcast("focusOn", scope.box.value.getKey());//won't work this focus event as the event gets fired before digest is finished so it gets the element hidden
                    } else if(!scope.box.value.blinkOn && !scope.box.value.isMinimized){// false false:
                        //blink off and not minimized
                        ChatFactory.minimizeBox(scope.box.value.getKey());
                        $rootScope.$broadcast("focusOn", null);
                    } else if(!scope.box.value.blinkOn && !!scope.box.value.isMinimized){ // false true:
                        //blink off and minimized
                        ChatFactory.minimizeBox(scope.box.value.getKey());
                        $rootScope.$broadcast("focusOn", scope.box.value.getKey());//won't work this focus event as the event gets fired before digest is finished so it gets the element hidden
                    }
                    //ChatFactory.minimizeBox(scope.box.value.getKey());
                    scope.$digest();
                    event.stopPropagation();
                });
            }
        }; // return object for directive factory function
    }

    maximizeBox.$inject = ['ChatFactory'];
    function maximizeBox(ChatFactory) {
        return {
            scope: false,
            restrict: 'A',
            link: function (scope, element, attrs) {

            }
        }; // return object for directive factory function
    }

    tagChatEdit.$inject = ['ChatFactory', 'rgDropdownService' , '$compile'];
    function tagChatEdit(ChatFactory, rgDropdownService, $compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {


                element.on('click', function (event) {
                    scope.showDropdown = !scope.showDropdown;
                    event.stopPropagation();
                });

            },
            controller : [ '$scope', 'tagChatFactory', 'tagChatManager', 'Auth', 'Ringalert', '$compile',
                function($scope, tagChatFactory, tagChatManager, Auth, Ringalert, $compile){

                    $scope.showDropdown = false;


                    $scope.hasTagObjectLock = function(tagId){

                        var tagObject = tagChatFactory.getTag(tagId);
                        if( !!tagObject){
                            return tagObject.hasObjectLock();
                        }
                        return false;
                    };

                    $scope.getTagDDControl = function(tagId){
                        var tagObject = tagChatFactory.getTag(tagId);
                        //var currentUserMemberObject = tagObject.getMember(Auth.currentUser().getKey());
                        var currentUserMemberObject = tagObject.getMember(Auth.loginData.uId);
                        return {
                            tagId : tagId,
                            isOwner : !!currentUserMemberObject ? currentUserMemberObject.isOwner() : false
                        };
                    };


                    $scope.tagMemberDDActions = tagMemberDDActions;
                    $scope.tagMemberDDHtml = 'templates/partials/tag-chat/member-actions-dropdown.html';

                    // edit, view or delete
                    function tagMemberDDActions(actionObj) {
                        switch(actionObj.action) {
                            case 'edit':
                            case 'view':
                                rgDropdownService.close(actionObj.event);

                                return function() {
                                    return {tagId: actionObj.tagId};
                                };


                                break;
                            case 'delete':

                                rgDropdownService.close(actionObj.event);

                                var tagObject = tagChatFactory.getTag(actionObj.tagId);

                                tagObject.setObjectLock();

                                tagChatManager.leaveFromTag(actionObj.tagId, currentUser.getKey()).then(function(response){

                                    tagObject.removeObjectLock();
                                    Ringalert.show(response, 'info');


                                }, function(response){

                                    tagObject.removeObjectLock();
                                    Ringalert.show(response, 'error');

                                });

                                break;
                            default:
                        }
                    }



                }]
        }; // return object for directive factory function
    }

    chatScrollBottom.$inject = ['$rootScope', '$scrollbar', 'Utils', 'SystemEvents'];
    function chatScrollBottom($rootScope, $scrollbar, Utils, SystemEvents) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
               scope.$on("ScrollToBottom",function(event, userId){
                    if(userId == scope.box.value.getKey()){
                        element[0].scrollTop = element[0].scrollHeight;
                        event.preventDefault();
                        // rgScrollbarService.scrollTo(scope, 100);

                    }
                });

               var option = { minThumbHeight : 20 };
               var scrollbar = $scrollbar.create(element[0],option);
              
               scope.bottomReached = function(){ 
                    ChatHelper.decreaseUnreadCount(box);
                    scope.$rgDigest();
               }

               //scope.scrollbar = scrollbar;
               function doScrollToUnread(){

                    

                    scope.refreshScrollbar(true, function() {
                         
                         var unreadElem = element[0].querySelector('.status-unread-container');
                         
                         if(!unreadElem) {
                            scrollbar.scrollBottom(true);      
                         }
                         else {
                            scrollbar.scrollBySelector('.status-unread-container', true);
                         }                            

                         unreadElem= null;

                         scope.$rgDigest();
                    }); 
               }

               scope.scrollbarFreezed = false;
               
               scope.freezeScrollbar = function(){
                   scope.scrollbarFreezed = true;                 
                   scrollbar.freeze();
               }

               scope.refreshScrollbar = function(force, cb){

                    if( scope.scrollbarFreezed || !!force ){ 
                        scope.scrollbarFreezed = false; 
                        scrollbar.reCalculate(true).then(function(){
                            scope.scroll = scrollbar.hasScroll;
                            if( !!cb ){ 
                               cb.call(this); 
                            }
                        });     
                    }

                    if( !scope.bottomScrolled ){
                        scope.bottomScrolled = true;
                        doScrollToUnread();
                    }
 
               }

 
              var ScrollToBottomRef = Utils.onCustomEvent(SystemEvents.CHAT.SCROLL_TO_BOTTOM, function(data){

                    if(data.boxId == scope.box.value.getKey()){

                        

                        scope.refreshScrollbar(true,function(){
                           scrollbar.scrollBottom(true); 
                           scope.$rgDigest();
                        }); 

                    }
                });

                var ScrollToUnreadRef = Utils.onCustomEvent(SystemEvents.CHAT.SCROLL_TO_UNREAD, function(data){

                    if(data.boxId == scope.box.value.getKey()){

                        doScrollToUnread();

                    }
                });


                scope.$on('$destroy', function(){
                    Utils.removeCustomEvent(SystemEvents.CHAT.SCROLL_TO_BOTTOM, ScrollToBottomRef);
                    Utils.removeCustomEvent(SystemEvents.CHAT.SCROLL_TO_UNREAD, ScrollToUnreadRef);

                });
            }
        }; // return object for directive factory function
    }

    chatBlinker.$inject = ['$window','chatHistoryFactory'];
    function chatBlinker($window,chatHistoryFactory) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                //var blinkerTimerFunction;
                if(scope.box.value.blinkOn === true){
                    element.addClass('blink');
                }
                scope.$on('blinkerEvent', function (event, userId) {
                    if(userId.toString() === scope.box.value.getKey()){
                        //if(!blinkerTimerFunction){
                        if(scope.box.value.isMinimized){
                            //blinkerTimerFunction = $window.setInterval(function () {
                            //    element.css({border: '2px solid red'});
                            if(scope.box.value.isFocused === false) {// doesn't matter it is focused or not if minimised it will blink
                                element.addClass('blink');
                                scope.box.value.blinkOn = true;
                            }
                            //},500);
                        } else {
                            //blinkerTimerFunction = $window.setInterval(function () {
                            //    element.css({border: '2px solid red'});
                            if(scope.box.value.isFocused === false) {
                                element.addClass('blink');
                                scope.box.value.blinkOn = true;
                            }
                            //},500);
                        }
                        chatHistoryFactory.updateBox(scope.box.value);
                        //}
                        //scope.$watch('box.value.isFocused', function (newValue, oldValue ) {
                        //    if(newValue === true && blinkerTimerFunction !== false){
                        //        $window.clearInterval(blinkerTimerFunction);
                        //        blinkerTimerFunction = false;
                        //    }
                        //});
                    }
                    //TODO have to handle blinking for hidden boxes
                    // this has been handled with another directive named chatBlinkerH
                    //if(scope.rbox){
                    //    if(userId === scope.$parent.$parent.rbox.value.getKey()){
                    //        element.addClass('blink');
                    //    }
                    //}
                });
                scope.$on('blinkerOff', function (event, userId) {
                    if(userId.toString() === scope.box.value.getKey()){
                        //element.css({border: 'none'});
                        element.removeClass('blink');
                        scope.box.value.blinkOn = false;
                        chatHistoryFactory.updateBox(scope.box.value);
                        //if(blinkerTimerFunction){
                        //    $window.clearInterval(blinkerTimerFunction);
                        //    blinkerTimerFunction = false;
                        //}
                    }
                });
                scope.$on('focusOn', function(event, userId){
                    if(!!userId && userId.toString() === scope.box.value.getKey()){
                        element.addClass('chat-active');
                    }else{
                        element.removeClass('chat-active');
                        scope.box.value.isFocused = false;
                    }
                });
            }
        }; // return object for directive factory function
    }


    chatBlinkerH.$inject = [ '$window','chatHistoryFactory' ];
    function chatBlinkerH($window,chatHistoryFactory) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$on('blinkerEvent', function (event, userId) {
                    if(userId.toString() === scope.rbox.value.getKey()){
                        element.addClass('blink');
                        element.parent().parent().children().eq(0).addClass('blink');
                        chatHistoryFactory.updateBox(scope.rbox.value);//might cause problem, didn't have enough time to be sure, will dig out later
                    }
                });
            }
        }; // return object for directive factory function
    }

    chatSelectEmo.$inject = ['ChatPacketSenderService'];
    function chatSelectEmo(ChatPacketSenderService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                scope.selectEmoticon = function(emoticon){

                    scope.messageText = scope.messageText + emoticon.symbol();


                };
            }
        }; // return object for directive factory function
    }

    chatBindOutsideClick.$inject = ['$document', 'Utils'];
    function chatBindOutsideClick($document, Utils) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function(e) {
                    e.stopPropagation();
                });
                $document.bind('click', function() {
                    scope.showHidden = false;
                    Utils.safeDigest(scope);
                    //scope.$apply(scope.showHidden);
                });
            }
        }; // return object for directive factory function
    }

    sharedContent.$inject = ['Utils'];
    function sharedContent(Utils){
        return {
            restrict: 'A',
            link : function(scope){

                scope.initMessageData = function(){
                    scope.messageData = {ogData : {}, locationData :{} };
                };

                scope.resetOgInfo = function(){
                    scope.messageData.ogData = {};
                    scope.ogStatus = {preview : false, loading: false, filterOnProgress: false};
                };

                scope.resetMessageLocation = function(){
                    scope.messageData.locationData = { description : '', lat : '', lng: ''};
                };

                scope.resetMessageText = function(){
                    scope.messageText = "";
                };

                scope.resetBottomMenu = function(){
                    scope.showBottomMenu = false;
                };

                scope.resetMessageInput = function(digest){

                    scope.initMessageData();

                    scope.resetBottomMenu();
                    scope.resetMessageText();
                    scope.resetOgInfo();
                    scope.resetMessageLocation();

                    if(!!digest){
                        Utils.safeDigest(scope);

                    }
                };

                scope.resetMessageInput(false);
            }
        };
    }

    

    angular
        .module('ringid.chat')
        .directive('openBox', openBox)
        .directive('openChatBox', openChatBox)
        .directive('openTagChatBox',openTagChatBox)
        .directive('makeVisibleChatBox', makeVisibleChatBox)
        .directive('showHiddenBoxes', showHiddenBoxes)
        .directive('closeBox', closeBox)
        .directive('minimizeBox', minimizeBox)
        .directive('maximizeBox', maximizeBox)
        .directive('tagChatEdit', tagChatEdit)
        .directive('chatScrollBottom', chatScrollBottom)
        .directive('chatBlinker', chatBlinker)
        .directive('chatBlinkerH', chatBlinkerH)
        .directive('chatBindOutsideClick', chatBindOutsideClick)
        .directive('sharedContent', sharedContent);

        // end of module definition
