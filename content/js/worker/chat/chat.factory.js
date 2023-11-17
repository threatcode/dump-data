(function chatFactoryIIFE(CHAT_APP) {
    /* ***************************** Chat Request Cache Start ******************************* */

    var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS,
        ChatPacketParser = CHAT_APP.ChatPacketParser,
        _chatClockInstance = null;

    function _getChatClock() {
        if (!_chatClockInstance) {
            _chatClockInstance = new CHAT_APP.UTILS.ChatClock();
        }
        return _chatClockInstance;
    }

    function BaseCacheObject() {
        var that = this;

        that.KEYS = {
            CACHE_TIME_KEY: '_cTime',
        };

        that._cache = {};
        that._cacheClearKeys = {};
        that._callbacks = {};

        that.cacheName = 'DEFAULT';
        that.clearCacheTimerId = null;
        that.cacheValidityTime = GENERAL_CONSTANTS.REQUEST_CACHE_VALIDITY;

        that.stopClearCacheTimer = stopClearCacheTimer;

        function stopClearCacheTimer() {
            var timer;
            if (!that.clearCacheTimerId) return;

            timer = _getChatClock();
            timer.clearInterval(that.clearCacheTimerId);
            that.clearCacheTimerId = null;

            Logger.debug('debug', that.cacheName + ' TIMER STOPPED', 'CHAT_TIMER_DEBUG');
        }

        that.hasCache = hasCache;

        function hasCache() {
            return Object.keys(that._cacheClearKeys).length > 0;
        }

        that.hasActiveTimer = hasActiveTimer;

        function hasActiveTimer() {
            return that.clearCacheTimerId != null;
        }

        that.isCacheValid = isCacheValid;

        function isCacheValid(timeKey) {
            return Date.now() - timeKey < that.cacheValidityTime;
        }

        that._deleteCache = _deleteCache;

        function _deleteCache(timeKey) {
            var cacheKey = that._cacheClearKeys[timeKey];
            delete that._cacheClearKeys[timeKey];
            delete that._cache[cacheKey];
        }

        that._onTimeout = _onTimeout;

        function _onTimeout(key) {
            var timeoutCallbacks = that.getCallback('timeout'),
                ctx;

            if (timeoutCallbacks) {
                ctx = this;
                timeoutCallbacks.forEach(function timeoutCallbackHandler(aTimeoutCallback) {
                    aTimeoutCallback.call(ctx, key);
                });
            }
        }

        that.startClearCacheTimer = startClearCacheTimer;

        function startClearCacheTimer() {
            var timer;

            Logger.debug('debug', that.cacheName + ' TIMER STARTED', 'CHAT_TIMER_DEBUG');

            timer = _getChatClock();
            that.clearCacheTimerId = timer.setInterval(function setIntervalHandler() {
                if (!that.hasCache()) {
                    that.stopClearCacheTimer();
                } else {
                    that.flush(true);
                }
            }, that.cacheValidityTime);
        }

        that.flush = flush;

        function flush(preserveValidCaches) {
            var cacheTimeKeys = Object.keys(that._cacheClearKeys);

            Logger.debug('debug', that.cacheName + ' ' + cacheTimeKeys.length + ' ITEMS ', 'CHAT_DEBUG');

            cacheTimeKeys.forEach(function cacheTimeKeysHandler(aTimeKey) {
                if (!preserveValidCaches || !that.isCacheValid(aTimeKey)) {
                    that._onTimeout(that._cacheClearKeys[aTimeKey]);
                    that._deleteCache(aTimeKey);
                }
            });
        }

        that.deleteCache = deleteCache;

        function deleteCache(key) {
            var cachedObject = that._cache[key],
                timeKey;

            if (!cachedObject) return;

            timeKey = cachedObject._cTime;
            that._deleteCache(timeKey);
        }

        that.setCache = setCache;

        function setCache(key, requestObject) {
            var _hasCache = that.hasCache(),
                time = Date.now();

            requestObject[that.KEYS.CACHE_TIME_KEY] = time;

            that._cache[key] = requestObject;
            that._cacheClearKeys[time] = key;

            if (!_hasCache && !that.hasActiveTimer()) {
                that.startClearCacheTimer();
            }

            // Logger.debug('debug','SET : KEY {0} : VALUE: {1}'.format(key, requestObject), 'CHAT_'+ that.cacheName +'_CACHE');
        }

        that.refreshCache = refreshCache;

        function refreshCache(key) {
            var cacheObject = that.getCache(key);
            if (cacheObject) {
                cacheObject[that.KEYS.CACHE_TIME_KEY] = Date.now();
                return true;
            }
            return false;
        }

        that.getCache = getCache;

        function getCache(key) {
            return that._cache[key];
        }

        that.on = on;

        function on(name, callback) {
            if (!that._callbacks[name]) {
                that._callbacks[name] = [];
            }

            that._callbacks[name].push(callback);
        }

        that.getCallback = getCallback;

        function getCallback(name) {
            return this._callbacks[name];
        }
    }

    BaseCacheObject.prototype = {

        getAuthCacheKey: function getAuthCacheKey(boxId, actionId, packetId) {
            return boxId + '-' + actionId + '-' + packetId;
        },

        setAuthCache: function setAuthCache(boxId, actn, objectToCache) {
            var key = this.getAuthCacheKey(boxId, actn, objectToCache.packetId);
            this.setCache(key, objectToCache);
        },

        getAuthCache: function getAuthCache(boxId, actionId, packetId) {
            var key = this.getAuthCacheKey(boxId, actionId, packetId);
            return this.getCache(key);
        },

        deleteAuthCache: function deleteAuthCache(boxId, actn) {
            var key = this.getAuthCacheKey(boxId, actn);
            this.deleteCache(key);
        },

        existsForAuth: function existsForAuth(boxId, actn, packetId) {
            return !!this.getAuthCache(boxId, actn, packetId);
        },

        getChatCacheKey: function getChatCacheKey(key) {
            return key;
        },

        setChatCache: function setChatCache(key, objectToCache) {
            var cachekey = this.getChatCacheKey(key, objectToCache);
            this.setCache(cachekey, objectToCache);
        },

        getChatCache: function getChatCache(key, objectToCache) {
            var cachekey = this.getChatCacheKey(key, objectToCache);
            return this.getCache(cachekey);
        },

        deleteChatCache: function deleteChatCache(key, objectToCache) {
            var cachekey = this.getChatCacheKey(key, objectToCache);
            this.deleteCache(cachekey);
        },

        existsForChat: function existsForChat(key, objectToCache) {
            return !!this.getChatCache(key, objectToCache);
        },
    };

    function RequestCache() {
        var that = this;

        BaseCacheObject.call(that);

        that.cacheName = 'REQUEST';

        that.getChatCacheKey = getChatCacheKey;

        function getChatCacheKey(packetId, requestObject) {
            if (!requestObject.sequenceNo) {
                requestObject.sequenceNo = 0;
            }

            return packetId + '_' + requestObject.sequenceNo + '_' + requestObject.packetType;
        }
    }

    RequestCache.prototype = BaseCacheObject.prototype;


    function ResponseCache() {
        var that = this;

        BaseCacheObject.call(this);

        that.cacheName = 'RESPONSE';
        that.cacheValidityTime = GENERAL_CONSTANTS.RESPONSE_CACHE_VALIDITY;

        that.getChatCacheKey = getChatCacheKey;

        function getChatCacheKey(packetId, responseObject) {
            var packetIdParts;

            if (responseObject.packetType === CHAT_APP.Constants.TAG_CHAT_PACKET_TYPE.TAG_CHAT_DELIVERED ||
                responseObject.packetType === CHAT_APP.Constants.FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_DELIVERED ||
                responseObject.packetType === CHAT_APP.Constants.FRIEND_CHAT_PACKET_TYPE.TAG_CHAT_SENT ||
                responseObject.packetType === CHAT_APP.Constants.FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SENT
            ) {
                packetIdParts = packetId.split('_');
                if (packetIdParts.length === 2) {
                    responseObject.packetId = packetIdParts[0];
                    responseObject.sequenceNo = packetIdParts[1];
                }
            }

            if (!responseObject.sequenceNo) {
                responseObject.sequenceNo = 0;
            }

            return packetId + '_' + responseObject.sequenceNo + '_' + responseObject.packetType;
        }

        function __hasReceivedConfirmationByConfirmationPacketType(confirmationPacketType, packetId, sequenceNo) {
            return !!that.getChatCache(packetId, {
                packetType: confirmationPacketType,
                sequenceNo: sequenceNo,
            });
        }

        that.hasReceivedConfirmation = hasReceivedConfirmation;

        function hasReceivedConfirmation(packetId, packetType, _sequenceNo) {
            var shouldReceiveConfirmation,
                sequenceNo = _sequenceNo,
                receivedConfirmation,
                packetName,
                index,
                length,
                confirmationPacketType;

            try {
                shouldReceiveConfirmation = CHAT_APP.PacketFormats.CHAT_PACKET_INFO[packetType].CONFIRMATION;
                if (!shouldReceiveConfirmation) {
                    // Logger.debug('debug', 'Confirmation Ingored From Map', packetType, 'CHAT' );
                    return false;
                }
            } catch (e) {
                Logger.log('debug', e, 'CHAT');
            }

            if (!sequenceNo) {
                sequenceNo = 0;
            }

            receivedConfirmation = false;
            confirmationPacketType = CHAT_APP.Constants.CONFIRMATION_MAP[packetType];

            if (!confirmationPacketType) {
                packetName = ChatPacketParser.getPacketName(packetType);
                Logger.debug('warning', 'Confirmation Packet Type Not Defined for ', packetName, '(' + packetType + ')', 'CHAT_TIMER_DEBUG');
            } else {
                if (Array.isArray(confirmationPacketType)) {
                    for (index = 0, length = confirmationPacketType.length; index < length; index++) {
                        if (__hasReceivedConfirmationByConfirmationPacketType(confirmationPacketType[index], packetId, sequenceNo)) {
                            receivedConfirmation = true;
                            break;
                        }
                    }
                } else {
                    receivedConfirmation = __hasReceivedConfirmationByConfirmationPacketType(confirmationPacketType, packetId, sequenceNo);
                }
            }

            return receivedConfirmation;
        }
    }

    ResponseCache.prototype = BaseCacheObject.prototype;

    function ChatBrokenPacketCache() {
        var that = this;

        BaseCacheObject.call(this);

        that.cacheName = 'BROKEN_PACKET_CACHE';
        that.cacheValidityTime = GENERAL_CONSTANTS.BROKEN_CACHE_VALIDITY;
    }

    ChatBrokenPacketCache.prototype = {

        getBrokenCacheKey: function getBrokenCacheKey(packetId, sequenceNo) {
            return packetId + '_' + sequenceNo;
        },

        setBrokenCache: function setBrokenCache(packetId, sequenceNo, objectToCache) {
            var key = this.getBrokenCacheKey(packetId, sequenceNo);
            this.setCache(key, objectToCache);
        },

        getBrokenCache: function getBrokenCache(packetId, sequenceNo) {
            var key = this.getBrokenCacheKey(packetId, sequenceNo);
            return this.getCache(key);
        },

        deleteBrokenCache: function deleteBrokenCache(packetId, sequenceNo) {
            var key = this.getBrokenCacheKey(packetId, sequenceNo);
            this.deleteCache(key);
        },

        exists: function exists(packetId, sequenceNo) {
            return !!this.getBrokenCache(packetId, sequenceNo);
        },

        process: function process(packetId, packetsLength, isTextBroken) {
            var completePacket,
                index;

            for (index = 0; index < packetsLength; index++) {
                if (!this.exists(packetId, index)) {
                    return;
                }
            }

            completePacket = this.getCompletePacket(packetId, packetsLength, isTextBroken);

            if (ChatPacketParser.isPublicChatPacket(completePacket.packetType)) {
                CHAT_APP.PublicChatResponses.processUpdates(completePacket);
            } else {
                ChatResponses.processUpdates(completePacket);
            }

            for (index = 0; index < packetsLength; index++) {
                this.deleteCache(packetId, index);
            }
        },

        getCompletePacket: function getCompletePacket(packetId, packetsLength, isTextBroken) {
            var brokenPacketDataViewArray = [],
                index,
                aBrokenCachePacket,
                completePacketObject;

            for (index = 0; index < packetsLength; index++) {
                aBrokenCachePacket = this.getBrokenCache(packetId, index);

                if (!aBrokenCachePacket) Logger.debug('alert', 'Broken Cache Object Not Exists', 'CHAT');

                if (!isTextBroken) {
                    brokenPacketDataViewArray.push(aBrokenCachePacket.bytes);
                } else {
                    brokenPacketDataViewArray.push(aBrokenCachePacket);
                }
            }

            if (!isTextBroken) {
                completePacketObject = ChatPacketParser.mergeBrokenPackets(brokenPacketDataViewArray);
            } else {
                completePacketObject = ChatPacketParser.mergeTextBrokenPackets(brokenPacketDataViewArray);
            }

            completePacketObject.fromBrokenPacket = true;

            return completePacketObject;
        },
    };


    function ChatTemporaryMessageCache() {
        var that = this,
            key;

        BaseCacheObject.call(this);

        that.cacheName = 'TEMPORARY_MESSAGES_CACHE';
        that.cacheValidityTime = GENERAL_CONSTANTS.TEMP_MESSAGE_CACHE_VALIDITY;

        that.getKey = getKey;

        function getKey(boxId) {
            return boxId;
        }

        that.set = set;

        function set(boxId, objectToCache) {
            key = this.getKey(boxId);
            this.setCache(boxId, objectToCache);
        }

        that.get = get;

        function get(boxId) {
            key = this.getKey(boxId);
            return this.getCache(key);
        }

        that.delete = _delete;

        function _delete(boxId) {
            key = this.getKey(boxId);
            this.deleteCache(key);
        }

        that.exists = exists;

        function exists(boxId) {
            return !!this.get(boxId);
        }
    }


    function ChatSession() {
        /*
         *   Keeps Chat Sessions, Sends Idle Packet, Deletes Session Upon Timeout
         *   It Don't Send Register/UnRegister Packet
         */

        var that = this,
            _clearKeepAliveTimer;

        BaseCacheObject.call(this);

        that.cacheName = 'SESSION';
        that.cacheValidityTime = GENERAL_CONSTANTS.TAG_REGISTER_TIMEOUT * 1000;

        function idlePacketSender(boxId) {
            var _sessionItem = that.get(boxId),
                callbacks;

            if (!_sessionItem) return;

            callbacks = that.getCallback('idlePacketSend');
            callbacks.forEach(function aCallbackHandler(aCallback) {
                aCallback.call(that, boxId, _sessionItem.type);
            });
        }

        _clearKeepAliveTimer = function clearKeepAliveTimer(keepAliveIntervalId) {
            _getChatClock().clearInterval(keepAliveIntervalId);
        };

        that.on('timeout', function onTimeoutHandler(boxId) {
            var _sessionItem = this.get(boxId);
            if (!!_sessionItem && !!_sessionItem.keepAliveIntervalId)
                _clearKeepAliveTimer(_sessionItem.keepAliveIntervalId);
        });

        this.startSessionTimer1 = startSessionTimer1;

        function startSessionTimer1(boxId) {
            var _sessionItem,
                counter = 0,
                lastIncrement = 1,
                hitValue = 1,
                timer = _getChatClock();

            _sessionItem = this.get(boxId);

            if (!!_sessionItem && !!_sessionItem.keepAliveIntervalId) {
                _clearKeepAliveTimer(_sessionItem.keepAliveIntervalId);
            }


            _sessionItem.timerState = 1;
            _sessionItem.keepAliveIntervalId = timer.setInterval(function setIntervalHandler() {
                if (lastIncrement > 15) {
                    timer.clearInterval(_sessionItem.keepAliveIntervalId);
                    that.startSessionTimer2.call(this, boxId);
                }

                if (!counter || counter === hitValue) {
                    idlePacketSender(boxId);

                    lastIncrement++;
                    hitValue = hitValue + lastIncrement;
                }

                counter++;
            }, 1000);
        }

        this.startSessionTimer2 = startSessionTimer2;

        function startSessionTimer2(boxId) {
            var _sessionItem = that.get(boxId),
                timer;

            if (!_sessionItem) {
                return;
            }

            timer = _getChatClock();

            _sessionItem.timerState = 2;
            _sessionItem.keepAliveIntervalId = timer.setInterval(function setIntervalHandler() {
                idlePacketSender(boxId);
            }, CHAT_APP.Constants.GENERAL_CONSTANTS.UDP_SERVER_KEEP_ALIVE_INTERVAL);
        }
    }

    ChatSession.prototype = {

        getKey: function getKey(boxId) {
            return boxId;
        },

        set: function set(boxId, objectToCache) {
            Logger.debug('information', 'Session Updated', objectToCache, 'CHAT');
            this.setCache(boxId, objectToCache);
        },

        get: function get(boxId) {
            var key = this.getKey(boxId);
            return this.getCache(key);
        },

        refresh: function refresh(boxId) {
            var key = this.getKey(boxId);
            return this.refreshCache(key);
        },

        delete: function _delete(boxId) {
            var key = this.getKey(boxId);
            this.deleteCache(key);
        },

        exists: function exists(boxId) {
            return !!this.get(boxId);
        },

        valid: function valid(boxId) {
            var _session = this.get(boxId);
            return !!_session && !!_session.ip && !!_session.registerPort && !!_session.bindingPort;
        },

        register: function register(boxId, chatBindingPort) {
            var chatSessionObject = this.get(boxId);

            if (!chatSessionObject) {
                Logger.debug('alert', 'Chat Session not exists in register confirmation time.', 'CHAT');
                return;
            }

            chatSessionObject.bindingPort = chatBindingPort;
            // this.set( tagId, chatSessionObject );

            this.startSessionTimer1(boxId);
        },

        UnRegister: function UnRegister(boxId) {
            this.delete(boxId);
        },
    };

    function Tags() {
        var _holder = {};

        this.add = add;

        function add(tagId, aTag) {
            _holder[tagId] = aTag;
        }

        this.remove = remove;

        function remove(tagId) {
            delete _holder[tagId];
        }

        this.getAll = getAll;

        function getAll() {
            var allTags = [],
                keys = Object.keys(_holder);

            keys.forEach(function aKeyHandler(aKey) {
                allTags.push(_holder[aKey]);
            });
            return allTags;
        }

        this.getTagIdsToUpdate = getTagIdsToUpdate;

        function getTagIdsToUpdate() {
            var allTagsToUpdate = [],
                keys = Object.keys(_holder);

            keys.forEach(function aKeyHandler(aKey) {
                if (_holder[aKey].memberUtIds.length === 0) {
                    allTagsToUpdate.push(aKey);
                }
            });
            return allTagsToUpdate;
        }

        this.get = get;

        function get(tagId) {
            return _holder[tagId];
        }

        this.getTagMemberUtIds = getTagMemberUtIds;

        function getTagMemberUtIds(tagId) {
            return this.get(tagId).memberUtIds;
        }
    }

    CHAT_APP.CHAT_CLOCK = _getChatClock();
    CHAT_APP.REQUEST_CACHE = new RequestCache();
    CHAT_APP.RESPONSE_CACHE = new ResponseCache();
    CHAT_APP.BROKEN_PACKET_CACHE = new ChatBrokenPacketCache();
    CHAT_APP.TEMPORARY_MESSAGES_CACHE = new ChatTemporaryMessageCache();
    CHAT_APP.CHAT_SESSION = new ChatSession();

    CHAT_APP.TAGS = new Tags();
})(CHAT_APP);
