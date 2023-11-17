;(function(){

    var ChatPacketParser                     = CHAT_APP.ChatPacketParser;

    var Constants                            = CHAT_APP.Constants;

    var WORKER_NOTIFIER_TYPES                = Constants.WORKER_NOTIFIER_TYPES;
    var GENERAL_CONSTANTS                    = Constants.GENERAL_CONSTANTS;
    var PACKET_CONSTANTS                     = Constants.PACKET_CONSTANTS;
    var PLATFORM                             = Constants.PLATFORM;

    var REQUEST_CACHE                        = CHAT_APP.REQUEST_CACHE;
    var hasReceivedConfirmation              = CHAT_APP.RESPONSE_CACHE.hasReceivedConfirmation;
    var getUUIDPacketId                      = CHAT_APP.UTILS.getUUIDPacketId;
    var callXTimeAfterYIntervalStopOnSuccess = CHAT_APP.UTILS.callXTimeAfterYIntervalStopOnSuccess;

    var PacketFormats                        = CHAT_APP.PacketFormats;
    var CHAT_PACKET_INFO                     = PacketFormats.CHAT_PACKET_INFO;

    var _chatConnection;


    function packetHasConfirmation( packetType ){
        return !!CHAT_PACKET_INFO[ packetType ].CONFIRMATION;
    }

    function ChatPacketException(msg, code){
        return new Error(msg);
    }

    function _logRequestedPacketInfo(packetType, packetObject){
        var packetName = ChatPacketParser.getPacketName(packetType);
        try{
            Logger.debug('debug', packetName, JSON.stringify(packetObject), "CHAT_REQUEST" );
        }catch(e){
            //console.log(e);
        }


    }


    function _getBrokenPacketObjects(brokenPacketType, packet, requestObject) {

        var ip, port, packetType, userId,
            ipPort, packets,
            aBrokenPacket,
            packetsLength,
            brokenContainer,
            brokenPacketSplitter,
            isMultipleBroken,
            brokenPackets = [];

        if (!requestObject) {
            requestObject = ChatPacketParser.parseRawPacket(packet);
        }

        packetType = requestObject.packetType;

        if( !brokenPacketType ) {
            brokenPacketType = packetType;
        }

        if(!packet){
            packet = _getPacket(requestObject, packetType);
        }

        packet = packet.copy(6, packet.byteLength - 6);

        brokenContainer = ChatPacketParser.getBrokenContainerByPacketType(brokenPacketType);

        brokenPacketSplitter = ChatPacketParser.getBrokenPacketSplitter(
            brokenPacketType, packetType,
            requestObject,
            packet
        );

        isMultipleBroken = ChatPacketParser.isMultipleBrokenPacket(packetType);

        packets = brokenPacketSplitter();

        packetsLength = packets.length;

        for (var index = 0; index < packetsLength; index++) {
            aBrokenPacket = Object.assign({}, requestObject);
            aBrokenPacket['platform'] = PLATFORM.WEB;
            aBrokenPacket['packetsLength'] = packetsLength;
            aBrokenPacket[brokenContainer] = packets[index][brokenContainer];
            aBrokenPacket['packetType'] = brokenPacketType;

            if(!isMultipleBroken){
                aBrokenPacket['sequenceNo'] = index;
            }else{
                //If UUID has strict length, then it might cause problem
                aBrokenPacket['packetId'] = aBrokenPacket['packetId'] + '_' + index;
            }

            brokenPackets.push(aBrokenPacket);
        }

        return brokenPackets;

    }

    function _getPacket(requestObject, packetType){
        var packet = ChatPacketParser.constructPacket(requestObject, packetType);
        return packet
    }

    function BaseChatPacketSender(){

        this._config = this._config || {};
        this._requiredConfigs = this._requiredConfigs || ['packetType'];
        this._callbacks = this._callbacks || {};

        this.init = function() {

            this._config = Object.assign(this._config, {
                packetType: 0,
                packet: '',
                packetId: 0,
                sequenceNo : 0,
                packetObject: {},
                sendFailed: false,
                sendSuccess: false,
                isBroken: false,
                isOffline: false,
                terminated: false,
                ignoreConfirmation : false,
                retryCount : GENERAL_CONSTANTS.API_FETCH_RETRY_COUNT,
                retryDelay : GENERAL_CONSTANTS.API_FETCH_RETRY_DELAY
            });
        };

        this.initCallbacks = function(){
            this._callbacks = Object.assign(this._callbacks, {
                _send : this.onSend,
                _successCheck : this.onSuccessCheck,
                _failure : this.onFailure,
                _success : this.onSuccess
            });
        };

        this.init.call(this);
        this.initCallbacks.call(this);

    }

    BaseChatPacketSender.prototype = {

        preProcess : function(){
            if( !this.getPacket() && this.hasPacketObject()){
                this.setPacketType(this.getPacketObject().packetType);
            }
        },

        on : function(event, callback){
            this._callbacks[event] = callback;
        },

        onSend : function(){},

        onSuccessCheck : function(currentExecutionCount){
            return hasReceivedConfirmation(this.getPacketId(), this.getPacketType(), this.getSequenceNo());
        },

        onFailure : function(){},

        onSuccess : function(){},

        setPacketType : function(packetType){
            this._config.packetType = packetType;
        },

        getPacketType : function(){
            return this._config.packetType;
        },

        hasPacketType : function(){
            return !!this._config.packetType;
        },

        setSequenceNo : function(sequenceNo){
            this._config.sequenceNo = sequenceNo;
        },

        getSequenceNo : function(){
            return this._config.sequenceNo;
        },

        hasSequenceNo : function(){
            return !!this._config.sequenceNo;
        },

        hasPacket : function(){
            return this._config.packet != '';
        },

        getPacket : function(){
            return this._config.packet;
        },

        setPacket : function(packet){
            this._config.packet = packet;
        },

        setPacketObject : function(object){
            this._config.packetObject = object;
        },

        getPacketObject : function(){
            return this._config.packetObject;
        },

        hasPacketObject : function(){
            return Object.keys(this._config.packetObject).length > 0;
        },

        setPacketId : function(packetId){
            this._config.packetId = packetId;
        },

        hasPacketId : function(){
            return this._config.packetId != 0;
        },

        getPacketId : function(){
            return this._config.packetId;
        },

        setIgnoreConfirmation : function(ignoreConfirmation){
            this._config.ignoreConfirmation = ignoreConfirmation;
        },

        getIgnoreConfirmation : function(){
            return this._config.ignoreConfirmation;
        },

        getRetryCount : function(){
            return this._config.retryCount;
        },

        setRetryCount : function(retryCount){
            this._config.retryCount = retryCount;
        },

        getRetryDelay : function(){
            return this._config.retryDelay;
        },

        setRetryDelay : function(retryDelay){
            this._config.retryDelay = retryDelay;
        },

        isBroken : function(isBroken){
            if(typeof(isBroken) != "undefined"){
                this._config.isBroken = isBroken;
            }

            return this._config.isBroken;

        },

        isOffline : function(isOffline){
            if(typeof(isOffline) != "undefined"){
                this._config.isOffline = isOffline;
            }

            return this._config.isOffline;

        },

        isTerminated : function(terminated){
            if(typeof(terminated) != "undefined"){
                this._config.terminated = terminated;
            }

            return this._config.terminated;

        },

        stop : function(){
            this._config.terminated = true;
        },

        isSendSuccess : function(sendSuccess){
            if(typeof(sendSuccess) != "undefined"){
                this._config.sendSuccess = sendSuccess;
            }
            return this._config.sendSuccess;

        },

        validateConfig : function(){

            if( !this._config.packet && !this._config.packetObject){
                throw ChatPacketException('packet or objectToSend needs to be defined');
            }

            if( this._config.packet && !this._config.packetType){
                throw ChatPacketException('sending raw packet needs packetType to be given');
            }

            var index;
            for(index = 0; index < this._requiredConfigs.length; index++ ){
                var key = this._requiredConfigs[index];
                if( !this._config[key]){
                    throw ChatPacketException(key + ' Not Defined');
                }
            }

        },

        isCallbackDefined : function(name){
            return !!this._callbacks[name];
        },

        getCallback : function( callbackName){
            return this._callbacks[callbackName];
        },

        getDefaultCallback : function(callbackName){
            return this._callbacks['_' + callbackName];
        },

        getResponseObject : function(success, tryCount, timeout, terminated){

            return {
                sucs : success,
                tryCount : tryCount,
                timeout : !!timeout,
                terminated : !!terminated
            }
        },

        callSuccessCallback : function(currentExecutionCount){

            if( !this.isCallbackDefined('success') ){
                this.getDefaultCallback('success').call(this,
                    this.getResponseObject(true, currentExecutionCount)
                );


            }else{
                this.getCallback('success').call(this,
                    this.getResponseObject(true, currentExecutionCount)
                );
            }

        },
        callFailureCallback : function(){
            if( !this.isCallbackDefined('failure') ){
                this.getDefaultCallback('failure').call(this,
                    this.getResponseObject(false, GENERAL_CONSTANTS.API_FETCH_RETRY_COUNT, false, this.isTerminated() )
                );

            }else{
                this.getCallback('failure').call(null,
                    this.getResponseObject(false, GENERAL_CONSTANTS.API_FETCH_RETRY_COUNT, false, this.isTerminated() )
                );
            }
        }

    };

    function ChatSinglePacketSender(){

        var self = this;

        self.onSend = function(){
            var packet, packets;

            if(!self.hasPacket()){
                if( self.hasPacketObject() ){
                    packet = _getPacket(self.getPacketObject(), self.getPacketType());
                    self.setPacket(packet);

                    if( !self.hasPacketId() && !!self.getPacketObject().packetId ){
                        self.setPacketId(self.getPacketObject().packetId);
                    }
                }
            }else{
                if( !self.hasPacketId() ){
                    self.setPacketId( getUUIDPacketId() );
                }
            }

            if( self.hasPacket() ){

                if(self.getPacketObject()){
                    _logRequestedPacketInfo(self.getPacketType(), self.getPacketObject());
                }else{
                    Logger.debug('info', 'Raw Packet ', self.getPacket(), "TAG_CHAT_REQUEST");
                }

                _chatConnection.send(self.getPacket());
            }else{
                Logger.debug('alert','Skipped empty packet send', self.getPacketObject(), "TAG_CHAT");
            }

        };

        self.start = function(){

            self.preProcess();

            self.validateConfig();

            var hasReceivedSuccess = false;

            callXTimeAfterYIntervalStopOnSuccess(
                function(){

                    if(self.isCallbackDefined('beforeSend')){
                        self.getCallback('beforeSend').call();
                    }

                    if( !self.isCallbackDefined('send') ){
                        return self.getDefaultCallback('send').call(self);
                    }else{
                        return self.getCallback('send').call();
                    }
                },
                function (currentExecutionCount) {


                    if( self.getIgnoreConfirmation() ){
                        // Logger.debug('debug', 'Confirmation Ingored', self.getPacketObject(), 'CHAT' );
                        return false;

                    }else if( !self.isTerminated() ){

                        if(self.isCallbackDefined('beforeSuccessCheck')){
                            self.getCallback('beforeSuccessCheck').call(null, currentExecutionCount);
                        }

                        if( !self.isCallbackDefined('successCheck') ){
                            hasReceivedSuccess = self.getDefaultCallback('successCheck').call(self, currentExecutionCount);
                        }else{
                            hasReceivedSuccess = self.getCallback('successCheck').call(null, currentExecutionCount);
                        }

                        if(self.isCallbackDefined('afterSuccessCheck')){
                            self.getCallback('afterSuccessCheck').call(null, currentExecutionCount, hasReceivedSuccess);
                        }

                        self.isSendSuccess(hasReceivedSuccess);
                    }

                    if( !!self.isSendSuccess() ){
                        self.callSuccessCallback(currentExecutionCount);
                    }

                    return self.isTerminated() || self.isSendSuccess();

                },
                function(){

                    if( self.getIgnoreConfirmation() ){

                        self.isSendSuccess(true);
                        self.callSuccessCallback();

                    }else{
                        self.isSendSuccess(false);
                        self.callFailureCallback();
                    }

                },
                self.getRetryCount(),
                self.getRetryDelay()
            );

            //setTimeout(function(){
            //
            //    if( !self.isSendSuccess() ){
            //        if( !self.isCallbackDefined('failure') ){
            //            self.getDefaultCallback('failure').call(self,
            //                self.getResponseObject(false, GENERAL_CONSTANTS.API_FETCH_RETRY_COUNT, true, self.isTerminated() )
            //            );
            //
            //        }else{
            //            self.getCallback('failure').call(null,
            //                self.getResponseObject(false, GENERAL_CONSTANTS.API_FETCH_RETRY_COUNT, true, self.isTerminated() )
            //            );
            //        }
            //    }
            //
            //}, GENERAL_CONSTANTS.REQUEST_TIMEOUT);
        };

        BaseChatPacketSender.call(this);
    }

    ChatSinglePacketSender.prototype = BaseChatPacketSender.prototype;


    function ChatBrokenPacketSender(){

        var self = this;

        this._config = {
            packetObjects : [],
            confirmations : {}
        };

        this.setPacketObjects = function(packetObjects){
            self._config.packetObjects = packetObjects;
        };

        this.getPacketObjects = function(){
            return self._config.packetObjects;
        };

        this.hasPacketObjects = function(){
            return self._config.packetObjects.length > 0;
        };

        this.onSuccessCheck = function(currentExecutionCount){
            return ( Object.keys(self._config.confirmations).length === self._config.packetObjects.length );
        };

        this._checkForSuccess = function(currentExecutionCount){
            var hasBrokenSuccess = self.getDefaultCallback('successCheck').call(self, currentExecutionCount);
            self.isSendSuccess(hasBrokenSuccess);
            return hasBrokenSuccess;
        };


        this.addBrokenConfirmation = function(packetId, sequenceNo){
            Logger.debug('debug','BROKEN CONFIRMATIONS ', self._config.confirmations);
            self._config.confirmations[packetId + '_' + sequenceNo] = true;
        };

        this.onBrokenSuccess = function(response, packetObject){
            self.addBrokenConfirmation(packetObject.packetId, packetObject.sequenceNo);
            if( self._checkForSuccess(response.tryCount) ){
                self.callSuccessCallback(response.tryCount);
            }

        };

        this.onBrokenFailure = function(response, packetObject){
            if( !self.isTerminated() && self._checkForSuccess(response.tryCount) ){
                self.callSuccessCallback(response.tryCount);
            }else{
                if( !self.isTerminated() ){
                    self.isTerminated(true);
                    self.callFailureCallback();
                }
            }
        };

        BaseChatPacketSender.call(this);

        this.setPacketObjects = function(packetObjects){
            self._config.packetObjects = packetObjects;
        };


        function _sendABrokenPacket(packetObject){

            var requestObject, aChatSinglePacketSender, hasBrokenSuccess;

            try{

                aChatSinglePacketSender = new ChatSinglePacketSender();
                aChatSinglePacketSender.setPacketType(packetObject['packetType']);
                aChatSinglePacketSender.setSequenceNo(packetObject['sequenceNo']);
                aChatSinglePacketSender.setPacketObject(packetObject);

                aChatSinglePacketSender.on('afterSuccessCheck', function(currentExecutionCount, hasSuccess){

                    if(self.isTerminated()){
                        aChatSinglePacketSender.isTerminated(true);
                    }

                });

                aChatSinglePacketSender.on('success', function(response){
                    if(!packetObject.sequenceNo){
                        packetObject.sequenceNo = 0;
                    }
                    Logger.debug('debug', 'BROKEN SUCCESS {0}/{1}'.format(packetObject.sequenceNo+1, packetObject.packetsLength), response, packetObject);
                    if(response.sucs){
                        self.onBrokenSuccess(response, packetObject);
                    }

                });
                aChatSinglePacketSender.on('failure', function(response){
                    if(!packetObject.sequenceNo){
                        packetObject.sequenceNo = 0;
                    }
                    Logger.debug('debug', 'BROKEN FAILURE {0}/{1}'.format(packetObject.sequenceNo+1, packetObject.packetsLength), response, packetObject);
                    self.onBrokenFailure(response, packetObject);
                });

                aChatSinglePacketSender.start();



            }catch(e){
                Logger.debug('print','A single broken packet send exception ', e.message, "TAG_CHAT");

            }


        }


        this.start = function(){

            var packetObjects;
            if( !self.hasPacketObjects() ){

                self.preProcess();
                self.validateConfig();

                packetObjects = _getBrokenPacketObjects(self.getBrokenPacketType(), self.getPacket(), self.getPacketObject());
                self.setPacketObjects(packetObjects);

            }else{

                packetObjects = self.getPacketObjects();
            }

            var noOfPacketsToSend = packetObjects.length;

            for(var index = 0; index < noOfPacketsToSend; index++){
                _sendABrokenPacket(packetObjects[index]);
            }

        };

    }

    ChatBrokenPacketSender.prototype = BaseChatPacketSender.prototype;



    function ChatGenericPacketSender(){

        var self = this;

        this._config = {
            brokenPacketType : 0,
            packet: '',
            packetObject: {},
            packetObjects : [],
            ignoreConfirmation : false

        };

        this.setPacket = function(packet){
            self._config.packet = packet;
        };

        this.getPacket = function(){
            return self._config.packet;
        };

        this.hasPacket = function(){
            return !!self.getPacket();
        };

        this.setBrokenPacketType = function(brokenPacketType){
            self._config.brokenPacketType = brokenPacketType;
        };

        this.getBrokenPacketType = function(){
            return self._config.brokenPacketType;
        };

        this.hasBrokenPacketType = function(){
            return !!self.getBrokenPacketType();
        };


        this.setPacketObject = function(packetObject){
            self._config.packetObject = packetObject;
        };

        this.setIgnoreConfirmation = function(ignoreConfirmation){
            self._config.ignoreConfirmation = ignoreConfirmation;
        };

        this.getIgnoreConfirmation = function(){
            return self._config.ignoreConfirmation;
        };

        this.getPacketObject = function(){
            return self._config.packetObject;
        };

        this.hasPacketObject = function(){
            return Object.keys(self._config.packetObject).length > 0
        };

        this.setPacketObjects = function(packetObjects){
            self._config.packetObjects = packetObjects;
        };

        this.getPacketObjects = function(packetObjects){
            return self._config.packetObjects;
        };

        this.hasPacketObjects = function(){
            return self._config.packetObjects.length > 0;
        };

        function _getSenderInstance(isBroken){
            return isBroken ? new ChatBrokenPacketSender() : new ChatSinglePacketSender();
        }

        this._validate = function(isBroken){
            if(isBroken && !self.getBrokenPacketType()){
                throw ChatPacketException('Broken PacketType needs to be set for When Broken Packet is Set.');
            }
        };

        this.getInstance = function(isBroken){
            var senderInstance, packetObjects;

            self._validate(isBroken);

            packetObjects = _getBrokenPacketObjects(self.getBrokenPacketType(), self.getPacket(), self.getPacketObject());

            if( !packetObjects.length ){
                throw ChatPacketException('Broken Packet Build Error');
            }

            if( !!isBroken || packetObjects.length > 1){
                self.setPacketObjects(packetObjects);
                isBroken = true;
            }

            senderInstance = _getSenderInstance(isBroken);
            senderInstance.setIgnoreConfirmation(self.getIgnoreConfirmation());

            if( self.hasPacket() && !isBroken ){
                senderInstance.setPacket(self.getPacket());

            }else{
                if( self.hasPacketObjects() ){
                    senderInstance.setPacketObjects(self.getPacketObjects());
                }else{
                    senderInstance.setPacketObject(self.getPacketObject());
                }
                senderInstance.setPacketType(self.getBrokenPacketType());

            }
            return senderInstance;
        }
    }



    var _rawSend = function( requestObject ){
        try{

            _chatConnection.send(_getPacket(requestObject, requestObject.packetType));

        }catch(e){
            Logger.debug('error', e, 'CHAT');
            var response = {sucs: false, error : true, packetId : requestObject.packetId };
        }
    }

    var _send = function( requestObject, retryCount, needPromise ){
        var returnPromise = new Promise(function(resolve, reject){

            try{

                var done = false;
                var packetSender = new ChatSinglePacketSender();
                packetSender.setPacketId(requestObject.packetId);
                packetSender.setPacketObject(requestObject);

                if( !packetHasConfirmation( requestObject.packetType )){
                    packetSender.setIgnoreConfirmation(true);
                }

                if( !!retryCount ){
                    packetSender.setRetryCount(retryCount);
                }

                if( !!needPromise ){

                    packetSender.on('success', function(response){
                        if(!done){
                            done = true;

                            response['sucs'] = true;
                            response['packetId'] = packetSender.getPacketId();

                            resolve && resolve(response);
                        }
                    });
                    packetSender.on('failure', function(response){
                        if(!done) {
                            done = true;

                            response['sucs'] = false;
                            response['packetId'] = packetSender.getPacketId();

                            reject && reject(response);
                        }

                    });

                }

                packetSender.start();

            }catch(e){
                needPromise && resolve({sucs: false, error: true, packetId : requestObject.packetId, msg : e.message });
            }

        });

        return needPromise && returnPromise;
    }

    var _sendBroken = function( requestObject, retryCount, needPromise ){
        var returnPromise = new Promise(function(resolve, reject){

            try{

                var aChatSender,aChatSenderInstance, done=false;

                aChatSender = new ChatGenericPacketSender();
                aChatSender.setPacketObject(requestObject);
                aChatSender.setBrokenPacketType(requestObject.brokenPacketType);

                if( !packetHasConfirmation( requestObject.packetType )){
                    aChatSender.setIgnoreConfirmation(true);
                }


                aChatSenderInstance = aChatSender.getInstance();

                if( !!retryCount ){
                    aChatSenderInstance.setRetryCount(retryCount);
                }

                if( !!needPromise ){
                    aChatSenderInstance.on('success', function(response){
                        if(!done){
                            done = true;
                            response['sucs'] = true;
                            response['packetId'] = requestObject.packetId;

                            resolve(response);
                        }
                    });
                    aChatSenderInstance.on('failure', function(response){
                        if(!done) {
                            done = true;
                            response['sucs'] = false;
                            response['packetId'] = requestObject.packetId;
                            response['packetType'] = requestObject.packetType;

                            reject(response);
                        }

                    });
                }

                aChatSenderInstance.start();


            }catch(e){
                Logger.debug('alert', e.message, 'CHAT_DEBUG');
                resolve({sucs: false, error: true, packetId : requestObject.packetId, msg : e.message });

            }

        });

        return needPromise && returnPromise;
    }

    function isBrokenSendRequired(requestObject){
        try{
            if( 'isBroken' in requestObject){
                return requestObject.isBroken;
            }else{
                return !!CHAT_PACKET_INFO[requestObject.packetType]['BROKEN'];
            }

        }catch(e){
            return false;
        }
    }

    CHAT_APP['ChatPacketSender'] = {

        init : function(chatConnection){
            _chatConnection = chatConnection;
        },

        rawSend : function(requestObject){

            _rawSend( requestObject );
        },

        send : function(requestObject, retryCount){
            if( isBrokenSendRequired(requestObject) ){
                _sendBroken( requestObject, retryCount );
            }else{
                _send(requestObject, retryCount);
            }
        },

        sendBroken : function(requestObject, retryCount){

            _sendBroken( requestObject, retryCount );

        },

        request : function( requestObject, retryCount ){

            if( isBrokenSendRequired(requestObject) ){
                return _sendBroken(requestObject, retryCount, true);
            }else{
                return _send(requestObject, retryCount, true);
            }

        },

        requestBroken : function( requestObject, retryCount ){

            return _sendBroken( requestObject, retryCount, true);
        }


    };

})();
