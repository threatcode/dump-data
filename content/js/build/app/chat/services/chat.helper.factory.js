


    angular
        .module('ringid.chat')
        .factory('ChatHelper', ChatHelper);

    ChatHelper.$inject = ['SystemEvents', 'ChatFactory', 'OPERATION_TYPES',
                          'ChatConnector', 'ChatWorkerCommands',
                          'Auth', '$interval',
                          'Utils', 'chatHistoryFactory'];

    function ChatHelper ( SystemEvents, ChatFactory, OPERATION_TYPES,
                          ChatConnector, ChatWorkerCommands,
                          Auth, $interval,
                          Utils, chatHistoryFactory

    ) {

        var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;

        return {
            sendChatSeenConfirmation    : _sendChatSeenConfirmation,
            startTimerText              : _startTimerText,
            startTimerOthers            : _startTimerOthers,
            decreaseUnreadCount         : _decreaseUnreadCount,
            increaseUnreadCount         : _increaseUnreadCount,
            deleteMessageFromOwn        : _deleteMessageFromOwn,
            loadHistoryMessageForF2FChat: _loadHistoryMessageForF2FChat

        };


        ///////////////////



        function _decreaseUnreadCount(box,number){
            if(!number){
                _resetUnreadCount(box);

            }else{
                if((box.unreadCount - number)> 0){
                    box.unreadCount -= number;
                }
                else if ((box.unreadCount - number) < 0){
                    box.unreadCount = 0;
                } else{
                    box.unreadCount = 0;
                }
            }

            chatHistoryFactory.updateBox(box);
            chatHistoryFactory.removeUnreadMessageInfoByBoxId(box.getKey());

            Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_UPDATED, { boxId: box.getKey() });
        }

        function _resetUnreadCount(box){
            box.unreadCount = 0;
        }

        function _increaseUnreadCount(box,number){
            if(!!box && box.isFocused === false){
                box.unreadCount += number;
            }
        }

        function _deleteMessageFromOwn(box,message){
            if(!!box){
                if(!!message.key){
                    //if(message.user.getKey().toString() === Auth.loginData.uId.toString())
                    box.removeMessage(message.key);
                    chatHistoryFactory.removeMessage(message.key, box.getKey());
                    var messages = box.getMessages();
                    for(var k=0,length=messages.length; k<length; k++){
                        messages[k].value.showDate = messages[k].value.takeDecisionForShowingDate();
                        messages[k].value.showAvator = messages[k].value.takeDecisionForShowingMessageUserAvator();
                    }
                    Utils.triggerCustomEvent(SystemEvents.CHAT.BOX_UPDATED, { boxId: box.getKey() });
                }
            }
        }

        function _startTimerText(scope, messages) {
            /*start timer for incoming secret message automatically if box is opened and not minimized: starts*/
            //scope.box.value.startTimer();
            if(messages.length <1){
                return;
            }
            for(var m= 0, l= messages.length; m < l; m++) {
                if (messages[m].value.timeout > 0 && !messages[m].value.timerStartFlag) {
                    switch (messages[m].value.messageType) {
                        case 2:
                        case 3:
                        case 4://this is for location
                        case 5://this is for url
                        case 6:
                            //messages[m].value.text = "Removed...";
                            var timeoutCount = messages[m].value.timeout;
                            var mes = messages[m].value;
                            messages[m].value.timerStartFlag = true;
                            //messages[m].value.timeout = 0;
                            var timoutDeleteFunc = function (me, scope, timeoutCount) {
                                scope.$broadcast('timeoutDelete', me.key, timeoutCount);
                            };
                            var testTimeoutDeleteFunc = function (me, timeoutCount) {
                                scope.$broadcast('timeoutDelete', me.key, timeoutCount);
                            };//this fucking semicolon(;) caused me "TypeError: (intermediate value)(...) is not a function" ggrgrrrrrrr...
                            //$timeout( timoutDeleteFunc.bind(null,messages[m].value,scope), tT * 1000, true);
                            //$interval( function(){ testTimeoutDeleteFunc(mes, timeoutCount--)}, 1000, timeoutCount+1);
                            (function (mes, timeoutCount) {
                                $interval(function () {
                                    testTimeoutDeleteFunc(mes, timeoutCount--);
                                }, 1000, timeoutCount + 1);
                            })(mes, timeoutCount);
                            break;
                    }// end of switch for mesaggetype
                }//end of if timeout>0
            }
            /*start timer for incoming secret message automatically if box is opened and not minimized: ends*/
        }

        function _startTimerOthers(scope, message) {
            // this function will only be called if user clicks on secret image/audio/video
            // so this will always get single messageObject
            /*start timer for incoming secret message automatically if box is opened and not minimized: starts*/
            //scope.box.value.startTimer();
            if (!message[0].value) {
                return;
            }
            if (message[0].value.timeout > 0 && !message[0].value.timerStartFlag) {
                switch (message[0].value.messageType) {
                    case 7://IMAGE_FILE_FROM_GALLERY
                    case 8://AUDIO_FILE
                    case 9://VIDEO_FILE
                    case 10://IMAGE_FILE_FROM_CAMERA
                        //messages[m].value.text = "Removed...";
                        //todo need to reset timeout according to audio/video length
                        var timeoutCount = message[0].value.timeout;
                        var mes = message[0].value;
                        message[0].value.timerStartFlag = true;
                        //messages[m].value.timeout = 0;
                        var timoutDeleteFunc = function (me, scope, timeoutCount) {
                            scope.$broadcast('timeoutDelete', me.key, timeoutCount);
                        };
                        var testTimeoutDeleteFunc = function (me, timeoutCount) {
                            scope.$broadcast('timeoutDelete', me.key, timeoutCount);
                        };//this fucking semicolon(;) caused me "TypeError: (intermediate value)(...) is not a function" ggrgrrrrrrr...
                        //$timeout( timoutDeleteFunc.bind(null,messages[m].value,scope), tT * 1000, true);
                        //$interval( function(){ testTimeoutDeleteFunc(mes, timeoutCount--)}, 1000, timeoutCount+1);
                        (function (mes, timeoutCount) {
                            $interval(function () {
                                testTimeoutDeleteFunc(mes, timeoutCount--);
                            }, 1000, timeoutCount + 1);
                        })(mes, timeoutCount);
                        break;
                }// end of switch for mesaggetype
            }//end of if timeout>0
            /*start timer for incoming secret message automatically if box is opened and not minimized: ends*/
        }



        function _sendChatSeenConfirmation(ip, port, userId, friendId, packetId){

            var seendConfirmationObject = CHAT_APP.ChatRequests.getFriendChatSeenConfirmationObject(friendId, packetType );
            ChatConnector.send(seenConfirmationObject);
        }

        function _loadHistoryMessageForF2FChat(boxId, box){

            if( !box){
                box = ChatFactory.getBoxByUId(boxId);
            }

            if(!box){
                return;
            }

            box.loadHistoryMessages();
        }



    }
