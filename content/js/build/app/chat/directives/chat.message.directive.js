/**
 * Created by mahbubul on 8/23/15.
 */
    var chatApp;

    try {
        chatApp = angular.module('ringid.chat');
    } catch (e) {}

    var ChatRequests = CHAT_APP.ChatRequests;

    chatMessageDirective.$inject = ['Auth', '$compile', 'chatHistoryFactory','$interval', 'ChatHelper', 'Utils', 'userFactory', 'userService', 'SystemEvents'];
    function chatMessageDirective(Auth,  $compile, chatHistoryFactory,$interval, ChatHelper, Utils, userFactory, userService, SystemEvents) {

        return {
            restrict: 'A',
            scope: true,

            link: function (scope, element, attrs) {

                var box = scope.$eval(attrs.messageBox);
                box = box.value;
                var message = scope.$eval(attrs.messageMsg);
                //var first_children = element.children();
                var avatorDom;
                var dateLineDom;

                var takeDecisionForShowingMessageUserAvator  = function(){
                    if(box.isConsicutive(message.key)){
                        return false;
                    }else{
                        return true;
                    }
                };
                scope.message.takeDecisionForShowingMessageUserAvator = takeDecisionForShowingMessageUserAvator;
                scope.message.showAvator = takeDecisionForShowingMessageUserAvator();

                if (message.user.isCurrentUser()) {
                    element.addClass('cm-box-r');
                    if( message.status !== 'status_update') {

                        avatorDom = angular.element('<img ng-show="message.showAvator" title="'+ message.user.getName() +'" class="chat-img-r chat-img" src="' + message.user.avatar('thumb') + '" />');
                        var compiledAvatorDom = $compile(avatorDom)(scope);
                        element.append(compiledAvatorDom);

                    }
                } else {
                    element.addClass('cm-box');
                    if( message.status !== 'status_update') {

                        avatorDom = angular.element('<img ng-show="message.showAvator" title="'+ message.user.getName() +'" class="chat-img-l chat-img" src="' + message.user.avatar('thumb') + '" />');
                        var compiledAvatorDom = $compile(avatorDom)(scope);
                        element.prepend(compiledAvatorDom);

                    }
                }



                var takeDecisionForShowingDate = function () {
                    var currentMessageDate = Math.floor(message.messageDate / (1000*3600*24))
                    if(box.previousDate != currentMessageDate ){
                        box.previousDate = currentMessageDate;

                        return true;
                    } else{
                        return false;
                    }
                };
                scope.message.takeDecisionForShowingDate = takeDecisionForShowingDate;
                scope.message.showDate = takeDecisionForShowingDate();


                dateLineDom = angular.element('<div class="line" ng-show="message.showDate"><div class="line-m">{{ message.messageDate | date }}</div></div><div ng-show="message.showDate" class="clear"></div>');
                var compiledDateLineDom = $compile(dateLineDom)(scope);
                element.prepend(compiledDateLineDom);

                scope.$on('timeoutDelete', function (event,messageKey,timeoutCount) {

                    if(messageKey === message.key){

                        

                        if(timeoutCount>0){
                            scope.message.timeout = timeoutCount;

                        }else{
                            var messageUserKey = message.user.getKey();
                            if(messageUserKey == Auth.loginData.uId){

                                scope.message.timeout = 0;

                                scope.message.secretTimedOut = true;
                                switch (scope.message.messageType) {
                                    case 2:
                                    case 3:
                                    case 4://this is for location
                                    case 5://this is for url
                                    case 6:
                                        scope.message.status = 'Deleted';
                                        break;
                                    case 8:
                                        scope.message.status = 'Played';
                                    case 7:
                                    case 9:
                                    case 10:
                                        scope.message.status = 'Viewed';
                                        break;
                                }// end of switch for messageType

                                chatHistoryFactory.updateMessage(scope.message, box.getKey());

                            }else{

                                ChatHelper.deleteMessageFromOwn(box, message);
                                Utils.triggerCustomEvent( SystemEvents.CHAT.SINGLE_MESSAGE_TIMEOUT, {box: box});

                            }
                        }
                    }
                });


                var allRegisterRefs = [];
                var userDetailsToFetch = [];

                userDetailsToFetch.push(scope.message.userId);

                if( scope.message.status == "status_update"){
                    angular.extend(userDetailsToFetch, scope.message.usersToChange);
                }

                userDetailsToFetch.forEach(function(aUserToChange){
                    var user = userFactory.getUser(aUserToChange);
                    if( !user || !user.hasDetails() ){
                        var registerRef = userService.register(aUserToChange, Utils.debounce(function(){

                            if( scope.message.status == "status_update" ){
                                scope.message.refreshStatusMessageText();
                            }

                            scope.$rgDigest();

                        }, 300, false));

                        allRegisterRefs.push(registerRef)
                    }
                });

                scope.$on('$destroy', function(){
                    allRegisterRefs.forEach(function(aRegisterRef){
                        userService.unregister(aRegisterRef)
                    });
                })


            }
        };
    }


    chatEditMessage.$inject = ['$rootScope'];
    function chatEditMessage($rootScope) {
            return {
                restrict: 'EA',
                link: function (scope, element, attrs) {

                    var SharedHelpers = CHAT_APP.SharedHelpers;
                    var CHAT_GLOBAL_VALUES = CHAT_APP.Constants.CHAT_GLOBAL_VALUES;

                    element.on('click', function (event) {
                        $rootScope.$broadcast('editMessageEvent', attrs.editMessage, scope.message);
                        element.parent().parent().parent().addClass('editing-highlight');
                    });
                    var calculateOneHourFilter = function(messageDate){
                        var messageDateInLocalTime = SharedHelpers.getClientTimeFromServerTime(messageDate);

                        var currentTime = Math.floor(Date.now());
                        var diff = currentTime - messageDateInLocalTime;
                        var oneHour = 1000 * 3600;
                        if(diff > oneHour)
                            return false;
                        else
                            return true;
                    };

                    scope.message.canEdit = function(){
                        return (scope.message.user.isCurrentUser() &&
                        calculateOneHourFilter(scope.message.messageDate) &&
                        ([4, 6, 7, 8, 9, 10].indexOf(scope.message.messageType) === -1) &&
                        !(scope.message.timeout>0 || scope.message.secretTimedOut == true)&&
                        (['Deleted', 'status_update', 'Viewed', 'Played'].indexOf(scope.message.status) === -1));

                    };
                }
            }; // return object for directive factory function

    }


    chatRetryMessage.$inject = ['ChatPacketSenderService'];
    function chatRetryMessage( ChatPacketSenderService) {

        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                element.on('click', function (event) {
                    ChatPacketSenderService.retryMessage(scope.box.value, scope.message, scope.messageData);
                });

            }
        }; // return object for directive factory function

    }

    chatDeleteMessage.$inject = ['Storage', 'Utils', 'Auth', 'ChatConnector', 'ChatHelper', 'tagChatFactory'];
    function chatDeleteMessage(Storage, Utils, Auth, ChatConnector, ChatHelper, tagChatFactory ) {

        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {

                scope.message.canDelete = function(){
                    return (['status_update'].indexOf(scope.message.status) === -1);
                };

                element.on('click', function (event) {
                    ChatHelper.deleteMessageFromOwn(scope.box.value, scope.message);

                    if(scope.message.user.getKey().toString() === Auth.loginData.uId.toString()) {

                        if (scope.box.value.isTagChat) {// for tagChat

                            var tagId = scope.box.value.getKey();
                            var tagObject = tagChatFactory.getTag(tagId);

                            var packets = [{packetId: scope.message.key}]
                            var requestObject = ChatRequests.getTagChatMultipleMsgDeleteObject(tagId, packets);
                            ChatConnector.send(requestObject);


                        } else {// for individual chat
                            if(scope.message.secretTimedOut != true || scope.message.timeout>0){// checking if it was not a secret Message as delete message packet won't be sent for secret message

                                scope.box.value.sendTabUpdate(scope.message);

                                var friendId = scope.box.value.getKey();
                                var packets = [{packetId: scope.message.key}]
                                var requestObject = ChatRequests.getFriendChatMultipleMsgDeleteObject(friendId, packets);
                                ChatConnector.send(requestObject);

                            }
                        }
                    }

                });
            }


        }; // return object for directive factory function
    }


    chatMessageReact.$inject = ['Api', 'userFactory'];
    function chatMessageReact(Api, userFactory) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var message = scope.$eval(attrs.chatMessageReact);

                var SClasses = ['status_pending','status_delivered','status_seen','status_sent'];

                var doUpdateStatus = function(){

                    if( message.status == 'status_update'){
                        element.addClass('status_update');

                    } else{
                        if(message.user.isCurrentUser()){
                            element.addClass('status_received');
                        }else{
                            if(SClasses[message.status]){
                                element.addClass(SClasses[message.status]);
                            }
                        }
                    }
                };

                if(!angular.isObject(message.user)){

                    //{utId : $scope.user.getUtId()}
                    Api.user.getUserDetailsByUId({uId:message.user}).then(function (userObj) {
                        if (!!userObj) {
                            message.user = userFactory.create(userObj);
                            doUpdateStatus();
                            Utils.safeDigest(scope);
                        }
                    });

                }else{
                    doUpdateStatus();
                }
            }
        }; // return object for directive factory function
    }


    sendMessageDirective.$inject = ['ChatFactory','$timeout', 'ChatConnector', 'tagChatFactory', 'tagChatManager','$$connector', 'OPERATION_TYPES', 'ChatPacketSenderService', 'ChatHelper', 'Utils', 'SystemEvents', 'Ringalert'];

    function sendMessageDirective(ChatFactory,$timeout, ChatConnector, tagChatFactory, tagChatManager,$$connector, OPERATION_TYPES,
                      ChatPacketSenderService, ChatHelper, Utils, SystemEvents, Ringalert ) {

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;
                var AUTH_SERVER_ACTIONS = CHAT_APP.Constants.AUTH_SERVER_ACTIONS;

                scope.messageText = "";
                var doGetCaretPosition = function(ctrl) {

                    var CaretPos 						= 0;
                    var caretPositions 					= {
                        startPos			: 0,
                        endPos 				: 0,
                        selectionLength		: 0
                    };
                    // IE Support
                    if (document.selection) {

                        ctrl.focus ();
                        var Sel 						= document.selection.createRange ();

                        Sel.moveStart ('character', -ctrl.value.length);

                        CaretPos 						= Sel.text.length;
                    }
                    // Firefox support
                    else if (ctrl.selectionStart || ctrl.selectionStart == '0'){
                        CaretPos 						= ctrl.selectionStart;
                        caretPositions.startPos 		= ctrl.selectionStart;
                        caretPositions.endPos 			= ctrl.selectionEnd;
                        caretPositions.selectionLength 	= Math.abs(ctrl.selectionStart - ctrl.selectionEnd);
                    }

                    return (caretPositions);

                };
                var setCaretPosition = function(el, caretPositions, st) {
                    //var el = document.getElementById(el);

                    el.value 							= el.value;
                    var tempText 						= el.value;

                    // ^ this is used to not only get "focus", but
                    // to make sure we don't have it everything -selected-
                    // (it causes an issue in chrome, and having it doesn't hurt any other browser)

                    if (el !== null) {

                        if (el.createTextRange) {
                            var range = el.createTextRange();
                            el.value = tempText.slice(0, caretPositions.startPos) + st + tempText.slice(caretPositions.endPos);
                            range.move('character', caretPositions.startPos+st.length);
                            range.select();
                            return true;
                        }

                        else {
                            // (el.selectionStart === 0 added for Firefox bug)
                            if (el.selectionStart || el.selectionStart === 0) {
                                el.focus();

                                el.value = tempText.slice(0, caretPositions.startPos) + st + tempText.slice(caretPositions.endPos);
                                el.setSelectionRange(caretPositions.startPos+st.length, caretPositions.startPos+st.length);
                                return true;
                            }

                            else  { // fail city, fortunately this never happens (as far as I've tested) :)
                                el.focus();
                                return false;
                            }
                        }
                    }
                };

                scope.selectedLocation = function(){

                    Utils.triggerCustomEvent( SystemEvents.CHAT.SCROLL_TO_BOTTOM, {boxId : scope.box.key });


                    Utils.getUserLocation().then(function(location){
                        if( location.sucs ){
                            scope.messageData.locationData = location;

                            if( !!location.lat && location.lat != 9999) {
                                ChatPacketSenderService.sendMessage( scope.box.value, '', GENERAL_CONSTANTS.MESSAGE_TYPES.LOCATION_SHARE, scope.messageData )

                            }else{
                                
                            }

                            scope.$rgDigest();
                            //Utils.triggerCustomEvent(SystemEvents.CHAT.SCROLL_TO_BOTTOM, { boxId : scope.box.key });


                        }else{
                            Ringalert.show({mg: 'Please Enable Browser Location Tracking.'}, 'error');
                            
                        }

                        scope.resetMessageInput(true);
                    })


                };


                scope.selectEmoticonChat = function (emoticon) {

                    if (emoticon.isSticker() || emoticon.isLargeEmoticon()) {
                        scope.resetMessageInput();

                        var requestObject = ChatPacketSenderService.sendMessage( scope.box.value, emoticon.srcWithoutBase(), 6 )


                        Utils.triggerCustomEvent(SystemEvents.CHAT.MESSAGE_SUBMITTED, { boxId : scope.box.value.getKey() });

                        scope.messageText = "";

                        Utils.triggerCustomEvent(SystemEvents.CHAT.SCROLL_TO_BOTTOM, {boxId : scope.box.value.getKey() });


                    }else{

                        scope.messageText = scope.messageText +""+ emoticon.symbol();

                        element[0].focus();
                    }
                };

                var bindEvent = function () {
                    //element.on('keyup', function(event){
                    //    if( event.which === 13  && !(event.which == 13 && event.ctrlKey)){
                    //        scope.messageText = scope.messageText.replace(/^\s+|\s+$/g, '');
                    //        scope.resetMessageInput(true);
                    //    }
                    //});
                    element.on('keyup', function (event) {
                    //element.on('keydown', function (event) {

                        var sendTypingPacket = function(){
                            var doSendTypingPacket = function() {
                                if (scope.box.value.isTyping() === false) {
                                    ChatPacketSenderService.sendTypingPacket(scope.box.value);
                                    scope.box.value.setTypingBool(true);
                                    setTimeout(function () {
                                        scope.box.value.setTypingBool(false);
                                        Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_UPDATED, {boxId : scope.box.key });
                                    }, 5000);
                                }
                            };
                            //checking 3min passed since last communication
                            //if(!scope.box.value.checkWaitingTimePassed()){ // no need to check 3 min passed or not as this is done on worker end
                                if( scope.box.value.isTagChat) {
                                    doSendTypingPacket();
                                }else {
                                    if(scope.box.value.offlineStatus === false) {
                                        doSendTypingPacket();
                                    }
                                }
                            //}
                        };

                        // for enabling multiline in textarea starts
                        if(event.which ==13 && event.ctrlKey){
                            //scope.messageText += '\n';
                            var elem = element[0];
                            var caretPositions = doGetCaretPosition(elem);
                            //var tempText = scope.messageText;
                            //scope.messageText = tempText.slice(0, caretPositions) + "\n" + tempText.slice(caretPositions);

                            setCaretPosition(elem, caretPositions, "\n");
                            scope.messageText = elem.value;
                            //alert("'"+scope.messageText+"'");
                            //scope.$rgDigest();
                        }
                        // for enabling multiline in textarea ends

                        if( event.which === 13  && !(event.which == 13 && event.ctrlKey)){

                            if(element.attr('messageKey')){
                                scope.box.value.editMessageKey = element.attr('messageKey');
                                element.removeAttr('messageKey');
                                scope.box.value.editMessageDate = element.attr('messageDate');
                                element.removeAttr('messageDate');
                                element.removeClass('editing');
                                element.removeClass('editing-highlight');
                            }

                            var messageType = ChatPacketSenderService.getMessageType( scope.messageData );

                            if(scope.messageText !== '' ){
                                scope.messageText = scope.messageText.replace(/^\s+|\s+$/g, '');
                                scope.messageText = scope.messageText.replace(/\n\n+/g, '\n\n');

                                if(!scope.box.value.editMessageKey)
                                    Utils.triggerCustomEvent(SystemEvents.CHAT.SCROLL_TO_BOTTOM,  { boxId : scope.box.key });

                                ChatPacketSenderService.sendMessage(scope.box.value, scope.messageText, messageType, scope.messageData);

                                scope.resetMessageInput(true);

                                //Utils.triggerCustomEvent(SystemEvents.CHAT.SCROLL_TO_BOTTOM,  { boxId : scope.box.key });

                                Utils.triggerCustomEvent(SystemEvents.CHAT.MESSAGE_SUBMITTED, { boxId : scope.box.key });

                            }

                        }else{
                            sendTypingPacket();
                        }

                    });
                };

                var unbindEvent = function () {
                    element.off('keyup');
                    //element.off('keyup keydown');
                };

                bindEvent();

                scope.$on('$destroy', unbindEvent);

                if(scope.box.value.isFocused === true){
                    element[0].focus();
                }


                scope.$on('editMessageEvent', function (event, boxKey, messageObj) {
                    if(scope.box.value.getKey() == boxKey){

                        var messageType = messageObj.messageType;

                        switch (messageType){

                            case GENERAL_CONSTANTS.MESSAGE_TYPES.TEXT:
                                scope.messageText = messageObj.text;
                                break;

                            case GENERAL_CONSTANTS.MESSAGE_TYPES.LOCATION_SHARE:
                                scope.locationData = messageObj.locationInfo;
                                break;

                            case GENERAL_CONSTANTS.MESSAGE_TYPES.LINK_SHARE:
                                var jsonObject = angular.fromJson(messageObj.text);
                                scope.messageText = messageObj.ogData.message || messageObj.ogData.description
                                break;

                            //case GENERAL_CONSTANTS.MESSAGE_TYPES.STICKER:
                            //case GENERAL_CONSTANTS.MESSAGE_TYPES.IMAGE:
                            //case GENERAL_CONSTANTS.MESSAGE_TYPES.CAMERA_IMAGE:
                            //case GENERAL_CONSTANTS.MESSAGE_TYPES.AUDIO:
                            //case GENERAL_CONSTANTS.MESSAGE_TYPES.VIDEO:

                        }

                        element.addClass('editing');
                        element.attr('messageKey', messageObj.key);
                        element.attr('messageDate', messageObj.messageDate);

                        Utils.safeDigest(scope);
                        element[0].focus();
                    }
                });
            }

        }; // return object for directive factory function
    }


    chatImage.$inject = ['Utils', 'SystemEvents'];
    function chatImage(Utils, SystemEvents){
        return {
            restrict : 'A',
            link : function(scope,element,attr){
                element[0].onload = function(){
                    if(!!scope.message.scroll){
                        Utils.triggerCustomEvent( SystemEvents.CHAT.SCROLL_TO_BOTTOM, { boxId : attr['boxid'] });
                    }
                }

                element[0].src = attr['chatimgsrc'];


            }
        };
    }


    chatApp.directive('messageDirective', chatMessageDirective);
    chatApp.directive('editMessage', chatEditMessage);
    chatApp.directive('retryMessage', chatRetryMessage);
    chatApp.directive('deleteMessage', chatDeleteMessage);
    chatApp.directive('chatMessageReact', chatMessageReact);
    chatApp.directive('sendMessageDirective', sendMessageDirective);
    chatApp.directive('chatImage', chatImage);


