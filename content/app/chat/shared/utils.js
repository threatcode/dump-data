;(function(global){

    var Constants = global.CHAT_APP.Constants;
    var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
    var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES

    function _getUUIDPacketId(packetTime, isPacketIdStamp){
        var timestamp;

        var serverTime = CHAT_APP.SharedHelpers.getChatServerCurrentTime();
        var currentUserId = global.CHAT_APP.getCurrentUserId();

        if( !isPacketIdStamp && !packetTime){
            timestamp = serverTime; 

        }else{
            timestamp = packetTime;
        }

        if( !timestamp){
            Logger.debug('alert', 'Invalid Timestamp', 'CHAT');
        }

        return PacketIDGenerator.create(currentUserId, timestamp, isPacketIdStamp);
    }

    function _callXTimeAfterYIntervalStopOnSuccess(callback, successChecker, onFailCallback, maxExecutionCount, interval){
        var currentExecutionCount = 0;

        var doExecute = function(){
            if( !currentExecutionCount || ( currentExecutionCount < maxExecutionCount && !successChecker.call(null, currentExecutionCount) ) ){

                callback.call();
                currentExecutionCount++;
                setTimeout(doExecute, interval);

            }else{

                if(!successChecker.call(null, currentExecutionCount)){
                    onFailCallback.call();
                }
            }
        };

        doExecute();
    }

    function _hasChatSession(serverReceivedTime){

        var serverTime = CHAT_APP.SharedHelpers.getCurrentChatServerTime();
        return ( serverTime - serverReceivedTime ) < GENERAL_CONSTANTS.ACTUAL_TAG_REGISTER_TIMEOUT;

    }

    function ChatClock(){
        /***
         * Clock for Implementing Chat Timers
         * Only Use for wait time multiple of 1sec
         *
         * ***/

        var self = this;
        var _callbacks = {};
        var _timers = {};
        var _listeners = {};
        var _listenersCount = 0;
        var _defaultEvents = ['TICK', 'REGISTERED', 'CLEARED'];

        var __systemIntervalId = null;

        function _registerTimer(cb, wait, maxIteration){
            var timerId = getUniqueId('ctr');
            _callbacks[timerId] = cb;
            _timers[timerId] = { delay : wait, count : wait, maxIteration : maxIteration};
            return timerId;
        }

        function _unRegisterTimer(timerId){
            delete _callbacks[timerId];
            delete _timers[timerId];
            Logger.debug('debug', 'TIMER DELETED FOR ID ' + timerId, 'CHAT_TIMER_DEBUG');
        }

        function _registerListeners(eventName, cb){

            if(!_listeners[eventName]){
                _listeners[eventName] = {};
            }

            var listenerId = getUniqueId('ccl');
            _listeners[eventName][listenerId] = cb;
            //_listenersCount++;

            return listenerId;
        }

        function _unRegisterListener(eventName, listenerId){
            delete _listeners[eventName][listenerId];
            //_listenersCount--;
        }

        self.setTimeout = function(cb, wait){
            if( wait > 999){

                var hasTimer = self.hasTimer();

                var timerId = _registerTimer(cb, wait, 1);

                !hasTimer ? self.start() : void 0;

                Logger.debug('debug', 'TIMETOUT SET FOR ID ' + timerId, 'CHAT_TIMER_DEBUG');

                return timerId;

            }else{
                Logger.debug('error', 'USE CHAT CLOCK TIMER FOR WAIT TIME > 1000msc, Use Default Timeout/Interval for < 1000msc.', 'CHAT_TIMER_DEBUG')
                return 0;
            }

        };

        self.setInterval = function(cb, wait, maxIteration){
            if( wait > 999){

                var hasTimer = self.hasTimer();

                var timerId = _registerTimer(cb, wait, maxIteration || -1);

                !hasTimer ? self.start() : void 0;

                Logger.debug('debug', 'INTERVAL SET FOR ID ' + timerId, 'CHAT_TIMER_DEBUG');

                return timerId;
            }else {
                Logger.debug('error', 'USE CHAT CLOCK TIMER FOR WAIT TIME > 1000msc, Use Default Timeout/Interval for < 1000msc.', 'CHAT_TIMER_DEBUG')
                return 0;
            }
        };

        self.clearTimeout =  function(timerId){
            _unRegisterTimer(timerId)
        };

        self.clearInterval = function(timerId){
            _unRegisterTimer(timerId)
        };

        self.hasTimer = function(){
            return Object.keys(_timers).length > 0;
        };

        self.on = function(eventName, cb){
            return _registerListeners(eventName, cb);
        };

        self.off = function(eventName, listenerId){
            _unRegisterListener(eventName, listenerId);
        };

        self.trigger = function(eventName, data){
            if(!_listeners[eventName]){
                return;
            }

            var listenerIds = Object.keys(_listeners[eventName]);
            listenerIds.forEach(function(aListenerId){
                _listeners[eventName][aListenerId].call(this, data);
            });

        };

        self.stop = function(){
            clearInterval(__systemIntervalId);
        };

        self.start = function(){
            __systemIntervalId = setInterval(function(){
                self.trigger('TICK');

                //!self.hasTimer() ? self.stop() : void 0;

                var allTimerIds = Object.keys(_timers);
                //Logger.debug('debug', allTimerIds, _timers, 'CHAT_TIMER_DEBUG')
                for(var index = 0; index < allTimerIds.length; index++){
                    var aTimerId = allTimerIds[index];
                    var aTimer = _timers[aTimerId];

                    if(!!aTimer){
                        //Logger.debug('debug', allTimerIds, _timers, aTimerId, 'CHAT_TIMER_DEBUG')
                        if( aTimer.maxIteration == 0 ){
                            _unRegisterTimer(aTimerId);
                        }else {

                            if( aTimer.count == 0 || aTimer.maxIteration == -1){
                                _callbacks[aTimerId].call();
                                aTimer.maxIteration != -1 ? aTimer.count = aTimer.delay : void 0;

                            }else{
                                aTimer.count--;
                                aTimer.maxIteration != -1 ? aTimer.maxIteration-- : void 0

                            }
                        }
                    }

                }



            }, 1000)
        };

    }

    global.CHAT_APP['UTILS'] = {
        hasChatSession : _hasChatSession,
        getUUIDPacketId : _getUUIDPacketId,
        callXTimeAfterYIntervalStopOnSuccess : _callXTimeAfterYIntervalStopOnSuccess,
        ChatClock : ChatClock
    }

})(window);

