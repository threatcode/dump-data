    var chatApp;

    try {
        chatApp = angular.module('ringid.chat');
    } catch (e) {}

    chatApp
        .factory('chatTabSync', chatTabSync);


    function CrossTab(){
        var self;

        var callbacks = {},
            lastNewValue,
            lastOldValue,
            tabId;

        function NotSupported() {
            var errorMsg = 'CrossTab not supported';
            var reasons = [];
            if (!localStorage) {
                reasons.push('localStorage not available');
            }
            if (!window.addEventListener) {
                reasons.push('addEventListener not available');
            }

            if (reasons.length > 0) {
                errorMsg += ': ' + reasons.join(', ');
            }

            throw new Error(errorMsg);
        }

        function now(){
            return new Date().getTime();
        }


        function onStorageEvent(event) {
            // Only handle crosstab events
            if (!event || (event.key != '__CROSSTAB') ) {
                return;
            }

            var eventValue;
            try {
                eventValue = event.newValue ? JSON.parse(event.newValue) : {};
            } catch (e) {
                eventValue = {};
            }
            if (!eventValue || !eventValue.id || eventValue.id === CrossTab.id) {
                // This is to force IE to behave properly
                return;
            }
            if (event.newValue === lastNewValue && event.oldValue === lastOldValue) {
                // Fix bug in IE11 where StorageEvents in iframes are sent twice.
                return;
            }
            lastNewValue = event.newValue;
            lastOldValue = event.oldValue;

            if(!!callbacks['message']){
                callbacks['message'].call(this, eventValue.data);
            }else{
            }
        }

        function setLocalStorageItem(key, data) {
            var storageItem = {
                id: tabId,
                data: data,
                timestamp: now()
            };

            localStorage.setItem(key, JSON.stringify(storageItem));
        }

        function getLocalStorageRaw(key) {
            var json = localStorage ? localStorage.getItem(key) : null;
            var item = json ? JSON.parse(json) : {};
            return item;
        }


        function swapUnloadEvents() {
            // `beforeunload` replaced by `unload` (IE11 will be smart now)
            window.removeEventListener('beforeunload', unload, false);
            window.addEventListener('unload', unload, false);
        }

        function unload() {

        }

        function pad(num, width, padChar) {
            padChar = padChar || '0';
            var numStr = (num.toString());

            if (numStr.length >= width) {
                return numStr;
            }

            return new Array(width - numStr.length + 1).join(padChar) + numStr;
        }

        var generateId = function () {
            /*jshint bitwise: false*/
            return now().toString() + pad((Math.random() * 0x7FFFFFFF) | 0, 10);
        };


        function broadcast(data) {
            if (!CrossTab.supported) {
                NotSupported();
            }

            var message = {
                data: data,
                origin: tabId
            };

            setLocalStorageItem('__CROSSTAB', message);

        }

        this.on = function(name, callback){
            callbacks[name] = callback;
        };

        this.setId = function(id){
            tabId = id;
        };

        this.getId = function(){
            return tabId;
        };

        this.broadcast = broadcast;

        this.init = function(){
            // --- Check if crosstab is supported ---
            CrossTab.supported = !!localStorage && window.addEventListener;

            if (!CrossTab.supported) {
                CrossTab.broadcast = NotSupported;
            } else {

                tabId = generateId();
                // ---- Setup Storage Listener
                window.addEventListener('storage', onStorageEvent, false);
                // start with the `beforeunload` event due to IE11
                window.addEventListener('beforeunload', unload, false);
                // swap `beforeunload` to `unload` after DOM is loaded
                window.addEventListener('DOMContentLoaded', swapUnloadEvents, false);
            }
        };


    }


    chatTabSync.$inject = ['Storage', 'Utils', 'SystemEvents'];

        function chatTabSync(Storage, Utils, SystemEvents) {

            var CHAT_GENERAL_CONSTANTS = CHAT_APP.Constants.GENERAL_CONSTANTS;

            var isSharedWorkerSupported = !!window.SharedWorker;
            var isLocalStorageSupported = !!window.localStorage;
            var myTabId, worker, corssTab, tabSender;

            var sendViaSharedWorker = function(type, data){
                try{
                    worker.port.postMessage({origin : myTabId, data : angular.extend(data, { type : type})});
                }catch(e){
                }

            };

            var sendViaLocalStorage = function(type, data){
                try {
                    corssTab.broadcast(angular.extend(data, {type: type}));
                }catch(e){
                }
            };

            var initSharedWorker = function(){
                myTabId = Utils.getUniqueID('t');

                worker = new SharedWorker(CHAT_GENERAL_CONSTANTS.SHARED_WORKER_PATH);

                worker.port.addEventListener('message', function(event) {
                    var message = event.data;
                    if (message.origin !== myTabId) {

                        Utils.triggerCustomEvent(SystemEvents.CHAT.TAB_SYNC_NEW_DATA, message.data);
                    }

                }.bind(this), false);

                worker.port.start();

            };


            var initShareViaLocalStorage = function(){
                corssTab = new CrossTab();
                corssTab.init();

                myTabId = corssTab.getId();

                corssTab.on('message', function (message) {
                    if (message.origin !== myTabId) {


                        Utils.triggerCustomEvent(SystemEvents.CHAT.TAB_SYNC_NEW_DATA, message.data );
                    }
                });
            };

            var _sendData = function(type, data){

                if(!!tabSender ){
                    tabSender.call(this, type, data);
                }

            };

            var _init = function(){

                if( isSharedWorkerSupported ){
                    initSharedWorker();
                    tabSender = sendViaSharedWorker;

                }
                else if( isLocalStorageSupported) {
                    initShareViaLocalStorage();
                    tabSender = sendViaLocalStorage;

                }else{
                    tabSender = function(){};
                }
            };

            return {

                init : _init,
                sendData : _sendData
            }
        }

