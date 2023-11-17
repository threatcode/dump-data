(function chatPacketSenderIIFE() {
    var ChatPacketParser = CHAT_APP.ChatPacketParser,
        Constants = CHAT_APP.Constants,
        GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS,
        PLATFORM = Constants.PLATFORM,
        CHAT_PACKET_INFO = CHAT_APP.PacketFormats.CHAT_PACKET_INFO,
        hasReceivedConfirmation = CHAT_APP.RESPONSE_CACHE.hasReceivedConfirmation,
        getUUIDPacketId = CHAT_APP.UTILS.getUUIDPacketId,
        callXTimeAfterYIntervalStopOnSuccess = CHAT_APP.UTILS.callXTimeAfterYIntervalStopOnSuccess,
        _chatConnection;


    function packetHasConfirmation(packetType) {
        return !!CHAT_PACKET_INFO[packetType].CONFIRMATION;
    }

    function ChatPacketException(msg) {
        return new Error(msg);
    }

    function _logRequestedPacketInfo(packetType, packetObject) {
        var packetName = ChatPacketParser.getPacketName(packetType);
        try {
            if (!!CHAT_APP.PacketFormats.CHAT_PACKET_INFO[packetType].CONFIRMATION) {
                Logger.debug('debug', packetName, JSON.stringify(packetObject), 'CHAT_REQUEST');
            } else {
                Logger.debug('debug', packetName, JSON.stringify(packetObject), 'CHAT_CONFIRMATION_REQUEST');
            }
        } catch (e) {
            Logger.debug('alert', packetName, JSON.stringify(packetObject), 'CHAT_REQUEST');
        }
    }


    function _getBrokenPacketObjects(_brokenPacketType, _packet, _requestObject) {
        var packetType,
            packets,
            aBrokenPacket,
            packetsLength,
            brokenContainer,
            brokenPacketSplitter,
            isMultipleBroken,
            packet = _packet,
            index,
            brokenPacketType = _brokenPacketType,
            requestObject = _requestObject,
            brokenPackets = [];

        if (!requestObject) {
            requestObject = ChatPacketParser.parseRawPacket(packet);
        }

        packetType = requestObject.packetType;

        if (!brokenPacketType) {
            brokenPacketType = packetType;
        }

        if (!packet) {
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

        for (index = 0; index < packetsLength; index++) {
            aBrokenPacket = Object.assign({}, requestObject);
            aBrokenPacket.platform = PLATFORM.WEB;
            aBrokenPacket.packetsLength = packetsLength;
            aBrokenPacket[brokenContainer] = packets[index][brokenContainer];
            aBrokenPacket.packetType = brokenPacketType;

            if (!isMultipleBroken) {
                aBrokenPacket.sequenceNo = index;
            } else {
                // If UUID has strict length, then it might cause problem
                aBrokenPacket.packetId = aBrokenPacket.packetId + '_' + index;
            }

            brokenPackets.push(aBrokenPacket);
        }

        return brokenPackets;
    }

    function _getPacket(requestObject, packetType) {
        var packet = ChatPacketParser.constructPacket(requestObject, packetType);
        return packet;
    }

    function BaseChatPacketSender() {
        this._config = this._config || {};
        this._requiredConfigs = this._requiredConfigs || ['packetType'];
        this._callbacks = this._callbacks || {};

        this.init = init;

        function init() {
            this._config = Object.assign(this._config, {
                packetType: 0,
                packet: '',
                packetId: 0,
                sequenceNo: 0,
                packetObject: {},
                sendFailed: false,
                sendSuccess: false,
                isBroken: false,
                isOffline: false,
                terminated: false,
                ignoreConfirmation: false,
                retryCount: GENERAL_CONSTANTS.API_FETCH_RETRY_COUNT,
                retryDelay: GENERAL_CONSTANTS.API_FETCH_RETRY_DELAY,
            });
        }

        this.initCallbacks = initCallbacks;

        function initCallbacks() {
            this._callbacks = Object.assign(this._callbacks, {
                _send: this.onSend,
                _successCheck: this.onSuccessCheck,
                _failure: this.onFailure,
                _success: this.onSuccess,
            });
        }

        this.init.call(this);
        this.initCallbacks.call(this);
    }

    BaseChatPacketSender.prototype = {

        preProcess: function preProcess() {
            if (!this.getPacket() && this.hasPacketObject()) {
                this.setPacketType(this.getPacketObject().packetType);
            }
        },

        on: function on(event, callback) {
            this._callbacks[event] = callback;
        },

        onSend: function onSend() {},

        onSuccessCheck: function onSuccessCheck() {
            return hasReceivedConfirmation(this.getPacketId(), this.getPacketType(), this.getSequenceNo());
        },

        onFailure: function onFailure() {},

        onSuccess: function onSuccess() {},

        setPacketType: function setPacketType(packetType) {
            this._config.packetType = packetType;
        },

        getPacketType: function getPacketType() {
            return this._config.packetType;
        },

        hasPacketType: function hasPacketType() {
            return !!this._config.packetType;
        },

        setSequenceNo: function setSequenceNo(sequenceNo) {
            this._config.sequenceNo = sequenceNo;
        },

        getSequenceNo: function getSequenceNo() {
            return this._config.sequenceNo;
        },

        hasSequenceNo: function hasSequenceNo() {
            return !!this._config.sequenceNo;
        },

        hasPacket: function hasPacket() {
            return this._config.packet !== '';
        },

        getPacket: function getPacket() {
            return this._config.packet;
        },

        setPacket: function setPacket(packet) {
            this._config.packet = packet;
        },

        setPacketObject: function setPacketObject(object) {
            this._config.packetObject = object;
        },

        getPacketObject: function getPacketObject() {
            return this._config.packetObject;
        },

        hasPacketObject: function hasPacketObject() {
            return Object.keys(this._config.packetObject).length > 0;
        },

        setPacketId: function setPacketId(packetId) {
            this._config.packetId = packetId;
        },

        hasPacketId: function hasPacketId() {
            return this._config.packetId !== 0;
        },

        getPacketId: function getPacketId() {
            return this._config.packetId;
        },

        setIgnoreConfirmation: function setIgnoreConfirmation(ignoreConfirmation) {
            this._config.ignoreConfirmation = ignoreConfirmation;
        },

        getIgnoreConfirmation: function getIgnoreConfirmation() {
            return this._config.ignoreConfirmation;
        },

        getRetryCount: function getRetryCount() {
            return this._config.retryCount;
        },

        setRetryCount: function setRetryCount(retryCount) {
            this._config.retryCount = retryCount;
        },

        getRetryDelay: function getRetryDelay() {
            return this._config.retryDelay;
        },

        setRetryDelay: function setRetryDelay(retryDelay) {
            this._config.retryDelay = retryDelay;
        },

        isBroken: function isBroken(_isBroken) {
            if (typeof isBroken !== 'undefined') {
                this._config.isBroken = _isBroken;
            }

            return this._config.isBroken;
        },

        isOffline: function isOffline(_isOffline) {
            if (typeof isOffline !== 'undefined') {
                this._config.isOffline = _isOffline;
            }

            return this._config.isOffline;
        },

        isTerminated: function isTerminated(terminated) {
            if (typeof terminated !== 'undefined') {
                this._config.terminated = terminated;
            }

            return this._config.terminated;
        },

        stop: function stop() {
            this._config.terminated = true;
        },

        isSendSuccess: function isSendSuccess(sendSuccess) {
            if (typeof sendSuccess !== 'undefined') {
                this._config.sendSuccess = sendSuccess;
            }
            return this._config.sendSuccess;
        },

        validateConfig: function validateConfig() {
            var index,
                key;

            if (!this._config.packet && !this._config.packetObject) {
                // eslint-disable-next-line
                throw ChatPacketException('packet or objectToSend needs to be defined');
            }

            if (this._config.packet && !this._config.packetType) {
                // eslint-disable-next-line
                throw ChatPacketException('sending raw packet needs packetType to be given');
            }

            for (index = 0; index < this._requiredConfigs.length; index++) {
                key = this._requiredConfigs[index];
                if (!this._config[key]) {
                    // eslint-disable-next-line
                    throw ChatPacketException(key + ' Not Defined');
                }
            }
        },

        isCallbackDefined: function isCallbackDefined(name) {
            return !!this._callbacks[name];
        },

        getCallback: function getCallback(callbackName) {
            return this._callbacks[callbackName];
        },

        getDefaultCallback: function getDefaultCallback(callbackName) {
            return this._callbacks['_' + callbackName];
        },

        getResponseObject: function getResponseObject(success, tryCount, timeout, terminated) {
            return {
                sucs: success,
                tryCount: tryCount,
                timeout: !!timeout,
                terminated: !!terminated,
            };
        },

        callSuccessCallback: function callSuccessCallback(currentExecutionCount) {
            if (!this.isCallbackDefined('success')) {
                this.getDefaultCallback('success').call(this,
                    this.getResponseObject(true, currentExecutionCount)
                );
            } else {
                this.getCallback('success').call(this,
                    this.getResponseObject(true, currentExecutionCount)
                );
            }
        },
        callFailureCallback: function callFailureCallback() {
            if (!this.isCallbackDefined('failure')) {
                this.getDefaultCallback('failure').call(this,
                    this.getResponseObject(false, GENERAL_CONSTANTS.API_FETCH_RETRY_COUNT, false, this.isTerminated())
                );
            } else {
                this.getCallback('failure').call(null,
                    this.getResponseObject(false, GENERAL_CONSTANTS.API_FETCH_RETRY_COUNT, false, this.isTerminated())
                );
            }
        },

    };

    function ChatSinglePacketSender() {
        var self = this;

        self.onSend = function onSend() {
            var packet;

            if (!self.hasPacket()) {
                if (self.hasPacketObject()) {
                    packet = _getPacket(self.getPacketObject(), self.getPacketType());
                    self.setPacket(packet);

                    if (!self.hasPacketId() && !!self.getPacketObject().packetId) {
                        self.setPacketId(self.getPacketObject().packetId);
                    }
                }
            } else {
                if (!self.hasPacketId()) {
                    self.setPacketId(getUUIDPacketId());
                }
            }

            if (self.hasPacket()) {
                if (self.getPacketObject()) {
                    _logRequestedPacketInfo(self.getPacketType(), self.getPacketObject());
                } else {
                    Logger.debug('info', 'Raw Packet ', self.getPacket(), 'TAG_CHAT_REQUEST');
                }

                _chatConnection.send(self.getPacket());
            } else {
                Logger.debug('alert', 'Skipped empty packet send', self.getPacketObject(), 'TAG_CHAT');
            }
        };

        self.start = function start() {
            var hasReceivedSuccess = false;

            self.preProcess();

            self.validateConfig();


            callXTimeAfterYIntervalStopOnSuccess(
                function sendHandler() {
                    var returnValue;
                    if (self.isCallbackDefined('beforeSend')) {
                        self.getCallback('beforeSend').call();
                    }

                    if (!self.isCallbackDefined('send')) {
                        returnValue = self.getDefaultCallback('send').call(self);
                    } else {
                        returnValue = self.getCallback('send').call();
                    }
                    return returnValue;
                },
                function successCheckHandler(currentExecutionCount) {
                    if (self.getIgnoreConfirmation()) {
                        // Logger.debug('debug', 'Confirmation Ingored', self.getPacketObject(), 'CHAT' );
                        return false;
                    } else if (!self.isTerminated()) {
                        if (self.isCallbackDefined('beforeSuccessCheck')) {
                            self.getCallback('beforeSuccessCheck').call(null, currentExecutionCount);
                        }

                        if (!self.isCallbackDefined('successCheck')) {
                            hasReceivedSuccess = self.getDefaultCallback('successCheck').call(self, currentExecutionCount);
                        } else {
                            hasReceivedSuccess = self.getCallback('successCheck').call(null, currentExecutionCount);
                        }

                        if (self.isCallbackDefined('afterSuccessCheck')) {
                            self.getCallback('afterSuccessCheck').call(null, currentExecutionCount, hasReceivedSuccess);
                        }

                        self.isSendSuccess(hasReceivedSuccess);
                    }

                    if (!!self.isSendSuccess()) {
                        self.callSuccessCallback(currentExecutionCount);
                    }

                    return self.isTerminated() || self.isSendSuccess();
                },

                function failureHandler() {
                    if (self.getIgnoreConfirmation()) {
                        self.isSendSuccess(true);
                        self.callSuccessCallback();
                    } else {
                        self.isSendSuccess(false);
                        self.callFailureCallback();
                    }
                },
                self.getRetryCount(),
                self.getRetryDelay()
            );

            // setTimeout(function(){
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
            // }, GENERAL_CONSTANTS.REQUEST_TIMEOUT);
        };

        BaseChatPacketSender.call(this);
    }

    ChatSinglePacketSender.prototype = BaseChatPacketSender.prototype;


    function ChatBrokenPacketSender() {
        var self = this;

        this._config = {
            packetObjects: [],
            confirmations: {},
        };

        this.setPacketObjects = function setPacketObjects(packetObjects) {
            self._config.packetObjects = packetObjects;
        };

        this.getPacketObjects = function getPacketObjects() {
            return self._config.packetObjects;
        };

        this.hasPacketObjects = function hasPacketObjects() {
            return self._config.packetObjects.length > 0;
        };

        this.onSuccessCheck = function onSuccessCheck() {
            return (Object.keys(self._config.confirmations).length === self._config.packetObjects.length);
        };

        this._checkForSuccess = function _checkForSuccess(currentExecutionCount) {
            var hasBrokenSuccess = self.getDefaultCallback('successCheck').call(self, currentExecutionCount);
            self.isSendSuccess(hasBrokenSuccess);
            return hasBrokenSuccess;
        };


        this.addBrokenConfirmation = function addBrokenConfirmation(packetId, sequenceNo) {
            Logger.debug('debug', 'BROKEN CONFIRMATIONS ', self._config.confirmations);
            self._config.confirmations[packetId + '_' + sequenceNo] = true;
        };

        this.onBrokenSuccess = function onBrokenSuccess(response, packetObject) {
            self.addBrokenConfirmation(packetObject.packetId, packetObject.sequenceNo);
            if (self._checkForSuccess(response.tryCount)) {
                self.callSuccessCallback(response.tryCount);
            }
        };

        this.onBrokenFailure = function onBrokenFailure(response) {
            if (!self.isTerminated() && self._checkForSuccess(response.tryCount)) {
                self.callSuccessCallback(response.tryCount);
            } else {
                if (!self.isTerminated()) {
                    self.isTerminated(true);
                    self.callFailureCallback();
                }
            }
        };

        BaseChatPacketSender.call(this);

        this.setPacketObjects = function setPacketObjects(packetObjects) {
            self._config.packetObjects = packetObjects;
        };


        function _sendABrokenPacket(packetObject) {
            var aChatSinglePacketSender;

            try {
                aChatSinglePacketSender = new ChatSinglePacketSender();
                aChatSinglePacketSender.setPacketType(packetObject.packetType);
                aChatSinglePacketSender.setSequenceNo(packetObject.sequenceNo);
                aChatSinglePacketSender.setPacketObject(packetObject);

                aChatSinglePacketSender.on('afterSuccessCheck',
                    function afterSuccessCheckHandler() {
                        if (self.isTerminated()) {
                            aChatSinglePacketSender.isTerminated(true);
                        }
                    });

                aChatSinglePacketSender.on('success', function onSuccssHandler(response) {
                    if (!packetObject.sequenceNo) {
                        packetObject.sequenceNo = 0;
                    }
                    Logger.debug('debug', 'BROKEN SUCCESS {0}/{1}'.format(packetObject.sequenceNo + 1, packetObject.packetsLength), response, packetObject);
                    if (response.sucs) {
                        self.onBrokenSuccess(response, packetObject);
                    }
                });
                aChatSinglePacketSender.on('failure', function onFailureHandler(response) {
                    if (!packetObject.sequenceNo) {
                        packetObject.sequenceNo = 0;
                    }
                    Logger.debug('debug', 'BROKEN FAILURE {0}/{1}'.format(packetObject.sequenceNo + 1, packetObject.packetsLength), response, packetObject);
                    self.onBrokenFailure(response, packetObject);
                });

                aChatSinglePacketSender.start();
            } catch (e) {
                Logger.debug('print', 'A single broken packet send exception ', e.message, 'TAG_CHAT');
            }
        }


        this.start = function start() {
            var packetObjects,
                index,
                noOfPacketsToSend;

            if (!self.hasPacketObjects()) {
                self.preProcess();
                self.validateConfig();

                packetObjects = _getBrokenPacketObjects(self.getBrokenPacketType(), self.getPacket(), self.getPacketObject());
                self.setPacketObjects(packetObjects);
            } else {
                packetObjects = self.getPacketObjects();
            }

            noOfPacketsToSend = packetObjects.length;

            for (index = 0; index < noOfPacketsToSend; index++) {
                _sendABrokenPacket(packetObjects[index]);
            }
        };
    }

    ChatBrokenPacketSender.prototype = BaseChatPacketSender.prototype;


    function ChatGenericPacketSender() {
        var self = this;

        this._config = {
            brokenPacketType: 0,
            packet: '',
            packetObject: {},
            packetObjects: [],
            ignoreConfirmation: false,

        };

        this.setPacket = function setPacket(packet) {
            self._config.packet = packet;
        };

        this.getPacket = function getPacket() {
            return self._config.packet;
        };

        this.hasPacket = function hasPacket() {
            return !!self.getPacket();
        };

        this.setBrokenPacketType = function setBrokenPacketType(brokenPacketType) {
            self._config.brokenPacketType = brokenPacketType;
        };

        this.getBrokenPacketType = function getBrokenPacketType() {
            return self._config.brokenPacketType;
        };

        this.hasBrokenPacketType = function hasBrokenPacketType() {
            return !!self.getBrokenPacketType();
        };

        this.setPacketObject = function setPacketObject(packetObject) {
            self._config.packetObject = packetObject;
        };

        this.setIgnoreConfirmation = function setIgnoreConfirmation(ignoreConfirmation) {
            self._config.ignoreConfirmation = ignoreConfirmation;
        };

        this.getIgnoreConfirmation = function getIgnoreConfirmation() {
            return self._config.ignoreConfirmation;
        };

        this.getPacketObject = function getPacketObject() {
            return self._config.packetObject;
        };

        this.hasPacketObject = function hasPacketObject() {
            return Object.keys(self._config.packetObject).length > 0;
        };

        this.setPacketObjects = function setPacketObjects(packetObjects) {
            self._config.packetObjects = packetObjects;
        };

        this.getPacketObjects = function getPacketObjects() {
            return self._config.packetObjects;
        };

        this.hasPacketObjects = function hasPacketObjects() {
            return self._config.packetObjects.length > 0;
        };

        function _getSenderInstance(isBroken) {
            return isBroken ? new ChatBrokenPacketSender() : new ChatSinglePacketSender();
        }

        this._validate = function validate(isBroken) {
            if (isBroken && !self.getBrokenPacketType()) {
                // eslint-disable-next-line
                throw ChatPacketException('Broken PacketType needs to be set for When Broken Packet is Set.');
            }
        };

        this.getInstance = function getInstance(_isBroken) {
            var senderInstance,
                isBroken = _isBroken,
                packetObjects;

            self._validate(isBroken);

            packetObjects = _getBrokenPacketObjects(self.getBrokenPacketType(), self.getPacket(), self.getPacketObject());

            if (!packetObjects.length) {
                // eslint-disable-next-line
                throw ChatPacketException('Broken Packet Build Error');
            }

            if (!!isBroken || packetObjects.length > 1) {
                self.setPacketObjects(packetObjects);
                isBroken = true;
            }

            senderInstance = _getSenderInstance(isBroken);
            senderInstance.setIgnoreConfirmation(self.getIgnoreConfirmation());

            if (self.hasPacket() && !isBroken) {
                senderInstance.setPacket(self.getPacket());
            } else {
                if (self.hasPacketObjects()) {
                    senderInstance.setPacketObjects(self.getPacketObjects());
                } else {
                    senderInstance.setPacketObject(self.getPacketObject());
                }
                senderInstance.setPacketType(self.getBrokenPacketType());
            }
            return senderInstance;
        };
    }

    function _rawSend(requestObject) {
        try {
            _chatConnection.send(_getPacket(requestObject, requestObject.packetType));
        } catch (e) {
            Logger.debug('error', e, 'CHAT');
            //             var response = {
            //                 sucs: false,
            //                 error: true,
            //                 packetId: requestObject.packetId
            //             };
        }
    }

    function _send(requestObject, retryCount, needPromise) {
        var done,
            returnPromise,
            packetSender;

        returnPromise = new RgPromise(function PromiseHandler(resolve, reject) {
            try {
                done = false;
                packetSender = new ChatSinglePacketSender();

                packetSender.setPacketId(requestObject.packetId);
                packetSender.setPacketObject(requestObject);

                if (!packetHasConfirmation(requestObject.packetType)) {
                    packetSender.setIgnoreConfirmation(true);
                }

                if (!!retryCount) {
                    packetSender.setRetryCount(retryCount);
                }

                if (!!needPromise) {
                    packetSender.on('success', function packetSenderSuccessHandler(response) {
                        if (!done) {
                            done = true;

                            response.sucs = true;
                            response.packetId = packetSender.getPacketId();

                            if (resolve && needPromise) {
                                resolve(response);
                            }
                        }
                    });
                    packetSender.on('failure', function packetSenderFailureHandler(response) {
                        if (!done) {
                            done = true;

                            response.sucs = false;
                            response.packetId = packetSender.getPacketId();

                            if (reject && needPromise) {
                                reject(response);
                            }
                        }
                    });
                }

                packetSender.start();
            } catch (e) {
                if (needPromise) {
                    resolve({
                        sucs: false,
                        error: true,
                        packetId: requestObject.packetId,
                        msg: e.message,
                    });
                }
            }
        });

        return needPromise && returnPromise;
    }

    function _sendBroken(requestObject, retryCount, needPromise) {
        var returnPromise,
            aChatSender,
            aChatSenderInstance,
            done;

        returnPromise = new Promise(function PromiseHandler(resolve, reject) {
            try {
                aChatSender = new ChatGenericPacketSender();
                aChatSender.setPacketObject(requestObject);
                aChatSender.setBrokenPacketType(requestObject.brokenPacketType);

                if (!packetHasConfirmation(requestObject.packetType)) {
                    aChatSender.setIgnoreConfirmation(true);
                }


                aChatSenderInstance = aChatSender.getInstance();

                if (!!retryCount) {
                    aChatSenderInstance.setRetryCount(retryCount);
                }

                if (!!needPromise) {
                    aChatSenderInstance.on('success', function onSuccessHandler(response) {
                        if (!done) {
                            done = true;
                            response.sucs = true;
                            response.packetId = requestObject.packetId;

                            if (resolve && needPromise) {
                                resolve(response);
                            }
                        }
                    });
                    aChatSenderInstance.on('failure', function onFailureHandler(response) {
                        if (!done) {
                            done = true;
                            response.sucs = false;
                            response.packetId = requestObject.packetId;
                            response.packetType = requestObject.packetType;


                            if (reject && needPromise) {
                                reject(response);
                            }
                        }
                    });
                }

                aChatSenderInstance.start();
            } catch (e) {
                Logger.debug('alert', e.message, 'CHAT_DEBUG');
                resolve({
                    sucs: false,
                    error: true,
                    packetId: requestObject.packetId,
                    msg: e.message,
                });
            }
        });

        return needPromise && returnPromise;
    }

    function isBrokenSendRequired(requestObject) {
        var returnValue;
        try {
            if ('isBroken' in requestObject) {
                returnValue = requestObject.isBroken;
            } else {
                returnValue = !!CHAT_PACKET_INFO[requestObject.packetType].BROKEN;
            }
        } catch (e) {
            returnValue = false;
        }
        return returnValue;
    }

    CHAT_APP.ChatPacketSender = {

        init: function init(chatConnection) {
            _chatConnection = chatConnection;
        },

        rawSend: function rawSend(requestObject) {
            _rawSend(requestObject);
        },

        send: function send(requestObject, retryCount) {
            if (isBrokenSendRequired(requestObject)) {
                _sendBroken(requestObject, retryCount);
            } else {
                _send(requestObject, retryCount);
            }
        },

        sendBroken: function sendBroken(requestObject, retryCount) {
            _sendBroken(requestObject, retryCount);
        },

        request: function request(requestObject, retryCount) {
            var returnValue;
            if (isBrokenSendRequired(requestObject)) {
                returnValue = _sendBroken(requestObject, retryCount, true);
            } else {
                returnValue = _send(requestObject, retryCount, true);
            }
            return returnValue;
        },

        requestBroken: function requestBroken(requestObject, retryCount) {
            return _sendBroken(requestObject, retryCount, true);
        },


    };
})();
