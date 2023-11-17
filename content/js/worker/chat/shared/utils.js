(function chatUtils(global) {
    var Constants = global.CHAT_APP.Constants,
        GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
    // var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES;

    function _getUniqueId(prefix) {
        // return prefix + (window._cti || '') + $window.Math.floor($window.Math.random() * (new $window.Date()).getTime());
        return (prefix || '') + (global._cti || '') + global.Math.floor(global.Math.random() * (new global.Date()).getTime());
    }

    function _getUUIDPacketId(packetTime, isPacketIdStamp) {
        var timestamp,

            serverTime = CHAT_APP.SharedHelpers.getChatServerCurrentTime(),
            currentUserId = global.CHAT_APP.getCurrentUserId();

        if (!isPacketIdStamp && !packetTime) {
            timestamp = serverTime;
        } else {
            timestamp = packetTime;
        }

        if (!timestamp) {
            Logger.debug('alert', 'Invalid Timestamp', 'CHAT');
        }

        return PacketIDGenerator.create(currentUserId, timestamp, isPacketIdStamp);
    }

    function _callXTimeAfterYIntervalStopOnSuccess(callback, successChecker, onFailCallback, maxExecutionCount, interval) {
        var currentExecutionCount = 0,
            successCheckerInterval = interval;
//             uniqueId = _getUniqueId();

        function doExecute() {
            if (!currentExecutionCount || (currentExecutionCount < maxExecutionCount && !successChecker.call(null, currentExecutionCount))) {
                if (successCheckerInterval >= interval) {
                    callback.call();
                    currentExecutionCount++;
                    successCheckerInterval = 0;

                    // eslint-disable-next-line
                    // console.log('Called for ID', uniqueId);
                }
                successCheckerInterval += 200;
                // eslint-disable-next-line
//                 console.log('uniqueId', uniqueId,
//                             'interval', interval,
//                             'successCheckerInterval', successCheckerInterval,
//                             'currentExecutionCount', currentExecutionCount,
//                             'maxExecutionCount', maxExecutionCount);

                setTimeout(doExecute, 200);
            } else {
                if (!successChecker.call(null, currentExecutionCount)) {
                    onFailCallback.call();
                }
            }
        }

        doExecute();
    }

    function _hasChatSession(serverReceivedTime) {
        var serverTime = CHAT_APP.SharedHelpers.getChatServerCurrentTime();
        return (serverTime - serverReceivedTime) < GENERAL_CONSTANTS.ACTUAL_TAG_REGISTER_TIMEOUT;
    }

    function ChatClock() {
        /** *
         * Clock for Implementing Chat Timers
         * Only Use for wait time multiple of 1sec
         *
         * ***/

        var self = this,
            _callbacks = {},
            _timers = {},
            _listeners = {},
        // var _listenersCount = 0;
        // var _defaultEvents = ['TICK', 'REGISTERED', 'CLEARED'];

            __systemIntervalId = null;
        function _registerTimer(cb, wait, maxIteration) {
            var timerId = _getUniqueId('ctr');
            _callbacks[timerId] = cb;
            _timers[timerId] = { delay: wait, count: wait, maxIteration: maxIteration };
            return timerId;
        }

        function _unRegisterTimer(timerId) {
            delete _callbacks[timerId];
            delete _timers[timerId];
            Logger.debug('debug', 'TIMER DELETED FOR ID ' + timerId, 'CHAT_TIMER_DEBUG');
        }

        function _registerListeners(eventName, cb) {
            var listenerId;
            if (!_listeners[eventName]) {
                _listeners[eventName] = {};
            }

            listenerId = _getUniqueId('ccl');
            _listeners[eventName][listenerId] = cb;
            // _listenersCount++;

            return listenerId;
        }

        function _unRegisterListener(eventName, listenerId) {
            delete _listeners[eventName][listenerId];
            // _listenersCount--;
        }

        self.setTimeout = function selfSetTimeout(cb, wait) {
            var hasTimer,
                timerId = 0;
            if (wait > 999) {
                hasTimer = self.hasTimer();

                timerId = _registerTimer(cb, wait, 1);

                if (!hasTimer) {
                    self.start();
                }
                // !hasTimer ? self.start() : void 0;

                Logger.debug('debug', 'TIMEOUT SET FOR ID ' + timerId, 'CHAT_TIMER_DEBUG');

                // return timerId;
            }
            // else {
            //    Logger.debug('error', 'USE CHAT CLOCK TIMER FOR WAIT TIME > 1000msc, Use Default Timeout/Interval for < 1000msc.', 'CHAT_TIMER_DEBUG');
            //    return 0;
            // }
            return timerId;
        };

        self.setInterval = function selfSetInterval(cb, wait, maxIteration) {
            var hasTimer,
                timerId = 0;
            if (wait > 999) {
                hasTimer = self.hasTimer();

                timerId = _registerTimer(cb, wait, maxIteration || -1);

                if (!hasTimer) {
                    self.start();
                }
                // !hasTimer ? self.start() : void 0;

                Logger.debug('debug', 'INTERVAL SET FOR ID ' + timerId, 'CHAT_TIMER_DEBUG');

                // return timerId;
            }
            // else {
            //    Logger.debug('error', 'USE CHAT CLOCK TIMER FOR WAIT TIME > 1000msc, Use Default Timeout/Interval for < 1000msc.', 'CHAT_TIMER_DEBUG');
            //    return 0;
            // }
            return timerId;
        };

        self.clearTimeout = function selfClearTimeout(timerId) {
            _unRegisterTimer(timerId);
        };

        self.clearInterval = function selfClearInterval(timerId) {
            _unRegisterTimer(timerId);
        };

        self.hasTimer = function hasTimer() {
            return Object.keys(_timers).length > 0;
        };

        self.on = function selfOn(eventName, cb) {
            return _registerListeners(eventName, cb);
        };

        self.off = function selfOff(eventName, listenerId) {
            _unRegisterListener(eventName, listenerId);
        };

        self.trigger = function selfTrigger(eventName, data) {
            var listenerIds;
            if (!_listeners[eventName]) {
                return;
            }

            listenerIds = Object.keys(_listeners[eventName]);
            listenerIds.forEach(function listenerIdsForEachIIFE(aListenerId) {
                _listeners[eventName][aListenerId].call(this, data);
            });
        };

        self.stop = function selfStop() {
            clearInterval(__systemIntervalId);
        };

        self.start = function selfStart() {
            __systemIntervalId = setInterval(function systemIntervalIdIIFE() {
                var allTimerIds,
                    aTimerId,
                    aTimer,
                    index;
//                 self.trigger('TICK');

                //! self.hasTimer() ? self.stop() : void 0;

                allTimerIds = Object.keys(_timers);
                // Logger.debug('debug', allTimerIds, _timers, 'CHAT_TIMER_DEBUG')
                for (index = 0; index < allTimerIds.length; index++) {
                    aTimerId = allTimerIds[index];
                    aTimer = _timers[aTimerId];

                    if (!!aTimer) {
                        // Logger.debug('debug', allTimerIds, _timers, aTimerId, 'CHAT_TIMER_DEBUG')
                        if (aTimer.maxIteration === 0) {
                            _unRegisterTimer(aTimerId);
                        } else {
                            if (aTimer.count === 0 || aTimer.maxIteration === -1) {
                                _callbacks[aTimerId].call();
                                if (aTimer.maxIteration !== -1) {
                                    aTimer.count = aTimer.delay;
                                }
                                // aTimer.maxIteration !== -1 ? aTimer.count = aTimer.delay : void 0;
                            } else {
                                aTimer.count--;
                                if (aTimer.maxIteration !== -1) {
                                    aTimer.maxIteration--;
                                }
                                // aTimer.maxIteration !== -1 ? aTimer.maxIteration-- : void 0;
                            }
                        }
                    }
                }
            }, 1000);
        };
    }

    global.CHAT_APP.UTILS = {
        hasChatSession: _hasChatSession,
        getUUIDPacketId: _getUUIDPacketId,
        callXTimeAfterYIntervalStopOnSuccess: _callXTimeAfterYIntervalStopOnSuccess,
        getUniqueId: _getUniqueId,
        ChatClock: ChatClock,
    };
})(window);

