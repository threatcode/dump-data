;(function(CHAT_APP){

    /****************************** Chat Request Cache Start *******************************/
    
    var GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;

    var ChatPacketParser = CHAT_APP.ChatPacketParser;
    var ChatRequests = CHAT_APP.ChatRequests;
    var ChatPacketSender = CHAT_APP.ChatPacketSender;   


    var _chatClockInstance = null;
    function _getChatClock(){
        if( !_chatClockInstance ){
            _chatClockInstance = new CHAT_APP.UTILS.ChatClock();
        }
        return _chatClockInstance;
    }

    function BaseCacheObject(){

        var that = this;

        that.KEYS = {
            'CACHE_TIME_KEY' : '_cTime'
        }

        that._cache = {};
        that._cacheClearKeys = {};
        that._callbacks = {};

        that.cacheName = "DEFAULT";
        that.clearCacheTimerId = null;            
        that.cacheValidityTime = GENERAL_CONSTANTS.REQUEST_CACHE_VALIDITY;        



        that.stopClearCacheTimer = function(){
            if(!that.clearCacheTimerId) return;

            var timer = _getChatClock();
            timer.clearInterval(that.clearCacheTimerId);
            that.clearCacheTimerId = null;

            Logger.debug('debug', that.cacheName + ' TIMER STOPPED', 'CHAT_TIMER_DEBUG')
        };
 
        that.hasCache = function(){
            return Object.keys(that._cacheClearKeys).length > 0
        };

        that.hasActiveTimer = function(){
            return that.clearCacheTimerId != null
        };

        that.isCacheValid = function (timeKey){
            return Date.now() - timeKey < that.cacheValidityTime;
        };

        that._deleteCache = function(timeKey){
            var cacheKey = that._cacheClearKeys[timeKey];
            delete that._cacheClearKeys[timeKey];
            delete that._cache[cacheKey];
        };

        that._onTimeout = function(key){
            var timeoutCallbacks = that.getCallback('timeout')
            if( timeoutCallbacks ){
                var ctx = this;
                timeoutCallbacks.forEach(function(aTimeoutCallback){
                    aTimeoutCallback.call(ctx, key);    
                });                
            }
        }

        that.startClearCacheTimer = function(){

            Logger.debug('debug', that.cacheName + ' TIMER STARTED', 'CHAT_TIMER_DEBUG')

            var timer = _getChatClock();
            that.clearCacheTimerId = timer.setInterval(function(){

                if( !that.hasCache() ) {
                    that.stopClearCacheTimer()

                }else{

                    var cacheTimeKeys = Object.keys(that._cacheClearKeys);

                    // Logger.debug('debug', that.cacheName + ' ' + cacheTimeKeys.length + ' ITEMS ', 'CHAT_DEBUG');

                    cacheTimeKeys.forEach(function(aTimeKey){

                        if( !that.isCacheValid(aTimeKey) ){
                            that._onTimeout(aTimeKey);
                            that._deleteCache(aTimeKey);

                        } 
                    });    
                }

                

            }, that.cacheValidityTime);
        };



        that.deleteCache = function deleteCache(key){
            var cachedObject = that._cache[key];
            if( !cachedObject) return;            
            
            var timeKey = cachedObject['_cTime'];            
            that._deleteCache(timeKey);
        };

        that.setCache = function(key, requestObject){
            var hasCache = that.hasCache();

            var time = Date.now();
            requestObject[that.KEYS.CACHE_TIME_KEY] = time;

            that._cache[key] = requestObject;
            that._cacheClearKeys[time] = key;

            !hasCache && !that.hasActiveTimer() ? that.startClearCacheTimer() : void 0;

            //Logger.debug('debug','SET : KEY {0} : VALUE: {1}'.format(key, requestObject), 'CHAT_'+ that.cacheName +'_CACHE');

        };

        that.refreshCache = function(key){
            var cacheObject = that.getCache(key);
            if(cacheObject){
                cacheObject[that.KEYS.CACHE_TIME_KEY] = Date.now();
                return true;
            }
            return false;
        }

        that.getCache = function(key){
            return that._cache[key];
        };

        that.on = function(name, callback){
            if(!that._callbacks[name]){
                that._callbacks[name] = [];
            }

            that._callbacks[name].push(callback);
        };

        that.getCallback = function(name){
            return this._callbacks[name];
        };
    }

    BaseCacheObject.prototype = {
            
        getAuthCacheKey : function (boxId, actionId){
            return boxId + '-' + actionId;
        },

        getChatCacheKey : function(key, objectToCache){
            return key;
        },        

        setChatCache : function(key, objectToCache){
            var key = this.getChatCacheKey(key, objectToCache);
            this.setCache(key, objectToCache)
        },
        setAuthCache : function(boxId, actn, objectToCache){
            var key = this.getAuthCacheKey(boxId, actn);
            this.setCache(key, objectToCache)
        },

        getAuthCache: function(boxId, actionId){
            var key = this.getAuthCacheKey(boxId, actionId);
            return this.getCache(key);
        },

        getChatCache : function(key, objectToCache){
            var key = this.getChatCacheKey(key, objectToCache);
            return this.getCache(key);
        },

        deleteAuthCache : function(boxId, actn){
            var key = this.getAuthCacheKey(boxId, actn);
            this.deleteCache(key);
        },

        deleteChatCache : function(key, objectToCache){

            var key = this.getChatCacheKey(key, objectToCache);
            this.deleteCache(key);
        },

        existsForAuth : function(boxId, actn){
            return !this.getAuthCache(boxId, actn) ? false : true;
        },

        existsForChat : function(key, objectToCache){
            return !this.getChatCache(key, objectToCache) ? false : true;
        }
    };

    function RequestCache(){

        var that = this;
        
        BaseCacheObject.call(that);

        that.cacheName = "REQUEST";

        that.getChatCacheKey = function(packetId, requestObject){


            if(!requestObject.sequenceNo){
                requestObject.sequenceNo = 0;
            }

            return packetId + '_' + requestObject.sequenceNo +'_' + requestObject.packetType;

        };
    }

    RequestCache.prototype = BaseCacheObject.prototype;


    function ResponseCache(){

        var that = this;

        BaseCacheObject.call(this);

        that.cacheName = 'RESPONSE';
        that.cacheValidityTime = GENERAL_CONSTANTS.RESPONSE_CACHE_VALIDITY;      

        that.getChatCacheKey = function(packetId, responseObject){

            if( responseObject.packetType == CHAT_APP.Constants.TAG_CHAT_PACKET_TYPE.TAG_CHAT_DELIVERED       ||
                responseObject.packetType == CHAT_APP.Constants.FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_DELIVERED ||
                responseObject.packetType == CHAT_APP.Constants.FRIEND_CHAT_PACKET_TYPE.TAG_CHAT_SENT         ||
                responseObject.packetType == CHAT_APP.Constants.FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SENT
            ){
                var packetIdParts = packetId.split('_');
                if( packetIdParts.length == 2){
                    responseObject.packetId = packetIdParts[0];
                    responseObject.sequenceNo = packetIdParts[1];
                }
            }

            if(!responseObject.sequenceNo){
                responseObject.sequenceNo = 0;
            }

            return packetId + '_' + responseObject.sequenceNo +'_' + responseObject.packetType;

        };

        function __hasReceivedConfirmationByConfirmationPacketType(confirmationPacketType, packetId, sequenceNo){
            return !!that.getChatCache(packetId, {packetType: confirmationPacketType, sequenceNo : sequenceNo});
        }

        that.hasReceivedConfirmation = function(packetId, packetType, sequenceNo){

            try{
                var shouldReceiveConfirmation = CHAT_APP.PacketFormats.CHAT_PACKET_INFO[packetType]['CONFIRMATION'];
                if(!shouldReceiveConfirmation){ 
                    // Logger.debug('debug', 'Confirmation Ingored From Map', packetType, 'CHAT' );
                    return false;
                }    
            }catch(e){}
        
            if(!sequenceNo){
                sequenceNo = 0;
            }
            var receivedConfirmation = false;

            var confirmationPacketType = CHAT_APP.Constants.CONFIRMATION_MAP[packetType];
            if( !confirmationPacketType ){
                var packetName = ChatPacketParser.getPacketName(packetType);
                Logger.debug('warning','Confirmation Packet Type Not Defined for ', packetName, '('+ packetType +')' , 'CHAT_TIMER_DEBUG');

            }else{

                if( Array.isArray(confirmationPacketType)){
                    for(var index = 0, length = confirmationPacketType.length; index < length; index++){
                        if( __hasReceivedConfirmationByConfirmationPacketType(confirmationPacketType[index], packetId, sequenceNo)){
                            receivedConfirmation = true;
                            break;
                        }
                    }
                }else{
                    receivedConfirmation = __hasReceivedConfirmationByConfirmationPacketType(confirmationPacketType, packetId, sequenceNo);
                }
            }

            return receivedConfirmation;
        }
    }

    ResponseCache.prototype = BaseCacheObject.prototype;

    function ChatBrokenPacketCache(){

        var that = this;

        BaseCacheObject.call(this);

        that.cacheName = 'BROKEN_PACKET_CACHE';
        that.cacheValidityTime = GENERAL_CONSTANTS.BROKEN_CACHE_VALIDITY;      
    }

    ChatBrokenPacketCache.prototype = {

        getBrokenCacheKey : function (packetId, sequenceNo){
            return packetId + '_' + sequenceNo
        },
        
        setBrokenCache : function(packetId, sequenceNo, objectToCache){
            var key = this.getBrokenCacheKey(packetId, sequenceNo);
            this.setCache(key, objectToCache)
        },        

        getBrokenCache: function(packetId, sequenceNo){
            var key = this.getBrokenCacheKey(packetId, sequenceNo);
            return this.getCache(key);
        },

        deleteBrokenCache : function(packetId, sequenceNo){
            var key = this.getBrokenCacheKey(packetId, sequenceNo);
            this.deleteCache(key);
        },

        exists : function(packetId, sequenceNo){
            return !this.getBrokenCache(packetId, sequenceNo) ? false : true;
        },

        process : function(packetId, packetsLength, isTextBroken){

            for(var index = 0; index < packetsLength; index++){                
                if(!this.exists(packetId, index)){
                    return;
                }
            }

            var completePacket = this.getCompletePacket(packetId, packetsLength, isTextBroken);
            ChatResponses.processUpdates(completePacket);

            for(var index = 0; index < packetsLength; index++){                
                this.deleteCache(packetId, index);
            }

        },

        getCompletePacket : function(packetId, packetsLength, isTextBroken){

            var brokenPacketDataViewArray = [],
                index, completePacketObject;

            for(index = 0; index < packetsLength; index++){                
                var aBrokenCachePacket = this.getBrokenCache(packetId, index);
                
                if( !aBrokenCachePacket ) Logger.debug('alert', 'Broken Cache Object Not Exists', 'CHAT');

                if( !isTextBroken ){
                    brokenPacketDataViewArray.push(aBrokenCachePacket.bytes);
                }else{
                    brokenPacketDataViewArray.push(aBrokenCachePacket);
                }                
            }

            if( !isTextBroken ){
                completePacketObject = ChatPacketParser.mergeBrokenPackets(brokenPacketDataViewArray);    
            }else{
                completePacketObject = ChatPacketParser.mergeTextBrokenPackets(brokenPacketDataViewArray);    
            }
            
            completePacketObject.fromBrokenPacket = true;

            return completePacketObject;

        }
    };


    function ChatTemporaryMessageCache(){
        var that = this;

        BaseCacheObject.call(this);
        
        that.cacheName = 'TEMPORARY_MESSAGES_CACHE';
        that.cacheValidityTime = GENERAL_CONSTANTS.TEMP_MESSAGE_CACHE_VALIDITY;
    
        that.getKey = function (boxId){
            return boxId;
        };
    
        that.set = function(boxId, objectToCache){
            var key = this.getKey(boxId);
            this.setCache(boxId, objectToCache)
        };

        that.get = function(boxId){
            var key = this.getKey(boxId);
            return this.getCache(key);
        };
    
        that.delete = function(boxId){
            var key = this.getKey(boxId);
            this.deleteCache(key);
        };
        
        that.exists = function(boxId){
            return !this.get(boxId) ? false : true;
        };        
    }


    function ChatSession(){
        /*
        *   Keeps Chat Sessions, Sends Idle Packet, Deletes Session Upon Timeout
        *   It Don't Send Register/UnRegister Packet
        */

        var that = this;

        BaseCacheObject.call(this);
        
        that.cacheName = 'SESSION';
        that.cacheValidityTime = GENERAL_CONSTANTS.TAG_REGISTER_TIMEOUT * 1000;

        var onIdlePacketSend = function(){};
                    
        var idlePacketSender = function(boxId){
            var _sessionItem = that.get(boxId)            
            if( !_sessionItem ) return;
            
            var callbacks = that.getCallback('idlePacketSend');
            callbacks.forEach(function(aCallback){
                aCallback.call(that, boxId, _sessionItem.type);
            });
          
        };

        var _clearKeepAliveTimer = function(keepAliveIntervalId){
            _getChatClock().clearInterval(keepAliveIntervalId);
        }

        that.on('timeout', function(boxId){
            var _sessionItem = this.get(boxId)            
            if( !!_sessionItem && !!_sessionItem.keepAliveIntervalId )
                _clearKeepAliveTimer(_sessionItem.keepAliveIntervalId);
        });

        this.startSessionTimer1 = function(boxId){
            
            var _sessionItem = this.get(boxId)            

            if( !!_sessionItem && !!_sessionItem.keepAliveIntervalId )
                _clearKeepAliveTimer(_sessionItem.keepAliveIntervalId);

            var counter = 0, lastIncrement = 1, hitValue = 1;
            var timer = _getChatClock();

            _sessionItem.timerState = 1;
            _sessionItem.keepAliveIntervalId = timer.setInterval(function(){
            
                if(lastIncrement > 15){
                    timer.clearInterval(_sessionItem.keepAliveIntervalId);
                    that.startSessionTimer2.call(this, boxId);
                }

                if( !counter || counter == hitValue){
                    
                    idlePacketSender(boxId);

                    lastIncrement++;
                    hitValue = hitValue + lastIncrement
                }

                counter++;

            }, 1000);

        },

        this.startSessionTimer2 = function(boxId){
            var _sessionItem = that.get(boxId);
            if( !_sessionItem){                
                return;
            }           

            var timer = _getChatClock();

            _sessionItem.timerState = 2;
            _sessionItem.keepAliveIntervalId = timer.setInterval(function(){
                
                idlePacketSender(boxId);

            }, CHAT_APP.Constants.GENERAL_CONSTANTS.UDP_SERVER_KEEP_ALIVE_INTERVAL);
        }
    }

    ChatSession.prototype = {

        getKey : function (boxId){
            return boxId;
        },
    
        set : function(boxId, objectToCache){
            Logger.debug('information', 'Session Updated', objectToCache, 'CHAT');
            var key = this.getKey(boxId);
            this.setCache(boxId, objectToCache)
        },

        get : function(boxId){
            var key = this.getKey(boxId);
            return this.getCache(key);
        },

        refresh : function(boxId){
            var key = this.getKey(boxId);
            return this.refreshCache(key);
        },

        delete : function(boxId){

            var key = this.getKey(boxId);
            this.deleteCache(key);
        },
        
        exists : function(boxId){
            return !this.get(boxId) ? false : true;
        },

        valid : function(boxId){
            var _session = this.get(boxId);
            return !!_session && !!_session.ip && !!_session.registerPort  && !!_session.bindingPort;
        },

        register : function(boxId, chatBindingPort ){
            var chatSessionObject = this.get( boxId );

            if( !chatSessionObject ){
                Logger.debug('alert', 'Chat Session not exists in register confirmation time.', 'CHAT');
                return;
            }

            chatSessionObject.bindingPort = chatBindingPort;      
            // this.set( tagId, chatSessionObject );
        
            this.startSessionTimer1(boxId);

        },

        UnRegister : function(boxId){            
            this.delete(boxId);
        }        
    }


    function Tags(){

        _holder = {};

        this.add = function(tagId, aTag){
            _holder[tagId] = aTag;
        };

        this.remove = function(tagId){
            delete _holder[tagId]
        };

        this.getAll = function(){
            var allTags = [];
            var keys = Object.keys(_holder);
            keys.forEach(function(aKey){
                allTags.push(_holder[aKey])
            });
            return allTags;
        };

        this.getTagIdsToUpdate = function(){
            var allTagsToUpdate = [];
            var keys = Object.keys(_holder);
            keys.forEach(function(aKey){
                if( _holder[aKey].memeberUIds.length == 0){
                    allTagsToUpdate.push(aKey);
                }                
            });
            return allTagsToUpdate;

        };

        this.get = function(tagId){
            return _holder[tagId];
        };

        this.getTagMemberUserIds = function(tagId){
            return this.get(tagId).memeberUIds;
        }

    }

    CHAT_APP['CHAT_CLOCK'] = _getChatClock();    
    CHAT_APP['REQUEST_CACHE'] = new RequestCache();
    CHAT_APP['RESPONSE_CACHE'] = new ResponseCache();
    CHAT_APP['BROKEN_PACKET_CACHE'] = new ChatBrokenPacketCache();
    CHAT_APP['TEMPORARY_MESSAGES_CACHE'] = new ChatTemporaryMessageCache();
    CHAT_APP['CHAT_SESSION'] = new ChatSession();
    
    CHAT_APP['TAGS'] = new Tags();


})(CHAT_APP);


