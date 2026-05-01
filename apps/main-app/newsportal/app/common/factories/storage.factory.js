
/*
* © Ipvision
*/

(function(window){
    'use strict';
       window.StorageFactory = function () {
            var _storeKey,
                gotStore = false,
                storage;

            var _storageAvailable = function(type) {
                try {
                    var testStorage = window[type],
                        x = '__storage_test__';
                    testStorage.setItem(x, x);
                    testStorage.removeItem(x);
                    gotStore = true;
                    return window[type];
                }
                catch(e) {
                    gotStore = false;
                    return {};
                }
            };

            storage = _storageAvailable('localStorage');

            var _setKey = function(key) {
                _storeKey = key;
                if( angular.isDefined(storage[_storeKey]) )  { // in case localStorage data does not have key/utId
                    _setData(_storeKey, {});
                }
            };

            var _getKey = function(key) {
                switch(key) {
                        //key = 'ngStorage' + '-' + key;
                        //break;
                    case 'loginData':
                    case 'country':
                    case 'remInfo':
                    case 'stickerData':
                        break;

                    case 'chatOpenedBoxes':
                    case 'chatBoxes':
                    case 'cgInf':
                    case 'cts' :
                    case 'unreadMessageIds':

                    case 'mood':
                    case 'utIds':
                    case 'incomingUtIds':
                    case 'outgoingUtIds':
                    case 'suggestionUtIds':
                    case 'contacts':
                    case 'notikeys':
                    case 'notiseen':
                    case 'oldNotiCount':
                    case 'mediaRecent':
                    case 'albumname':
                    case 'circledata':
                    case 'circleut':
                    case 'myStickers':
                        key = _storeKey + '-' + key;
                        break;
                    default:
                        // nothing to do. send key as is
                }
                return key;
            };

            var _setData = function(key, data) {
                key = _getKey(key);
                if(gotStore) {
                    storage.setItem(key, angular.toJson(data));
                } else {
                    storage[key] =  angular.toJson(data);
                }
            };

            var _getData = function(key) {
                key = _getKey(key);
                if(gotStore) {
                    return angular.fromJson(storage.getItem(key));
                } else {
                    return angular.fromJson(storage[key]);
                }
            };

            var _clearData = function(key) {
                key = _getKey(key);
                if(gotStore) {
                    storage.removeItem(key);
                } else {
                    delete storage[key];
                }
            };

            function _init(loginData) {
                var regExMatch;

                function initStorage() {
                    //if( !_getData('utIds') ) { // initialize in case no data from previous login
                        //_setData('utIds', []);
                    //}
                    //if( !_getData('incomingUtIds') ) { // initialize in case no data from previous login
                        //_setData('incomingUtIds', []);
                    //}

                    //if( !_getData('outgoingUtIds') ) { // initialize in case no data from previous login
                        //_setData('outgoingUtIds', []);
                    //}

                    if( !_getData('contacts')) {
                        _setData('contacts', {});
                    }

                    if( !_getData('chatOpenedBoxes')) {
                        _setData('chatOpenedBoxes', {});
                    }

                    if( !_getData('chatBoxes')) {
                        _setData('chatBoxes', {});
                    }

                    if( !_getData('unreadMessageIds')) {
                        _setData('unreadMessageIds', []);
                    }

                    if( !_getData('mediaRecent')) {
                        _setData('mediaRecent', []);
                    }

                    if( !_getData('notiseen')) {
                        _setData('notiseen', []);
                    }

                    if( !_getData('oldNotiCount')) {
                        _setData('oldNotiCount', 0);
                    }
                    // check if other user data present and delete
                    if(gotStore) {
                        var removeKeys = [];
                        for ( var i = 0, len = storage.length; i < len; ++i ) {
                            regExMatch = storage.key(i).match(/(\d+)-([a-z]+)/i);
                            if(regExMatch && regExMatch.length > 1 && regExMatch[1] != _storeKey  ) {
                                // remove this other user data
                                //console.warn('deleted key: ' + storage.key(i));
                                //console.log(regExMatch);
                                removeKeys.push(storage.key(i));

                            }

                        }
                        removeKeys.forEach(function(key) {
                            _clearData(key);
                        });
                    }

                }

                if(loginData) {
                    loginData = angular.fromJson(loginData);
                    _setKey(loginData.utId);
                    _setData('loginData', loginData);
                    initStorage();
                } else  if (Cookies.get('utId')){
                    _setKey(Cookies.get('utId'));
                    initStorage();
                }


            }

            var _asyncSetData = function(key, value){
                setTimeout(function(){
                    _setData(key, value);
                }, 200);
            };

            _init(_getData('loginData'));

            return {
                init: function(loginData) {
                    _init(loginData);
                },
                reset: function() {
                    _clearData('loginData');
                    _clearData('remInfo');
                    _clearData('contacts');
                    _clearData('chatOpenedBoxes');
                    _clearData('suggestionUtIds');
                },
                setData: function(key, value, async) {
                    if( !!async){
                        _asyncSetData(key, value);
                    }else{
                        _setData(key, value);
                    }
                },
                getData: function(key) {
                    return _getData(key);
                },
                deleteData : function(key){
                    _clearData(key);
                },
                // customised setter and getters
                setContact: function(utId, contact) {
                    if (utId) {
                        var contacts = _getData('contacts') || {};
                        if(contacts.hasOwnProperty(utId)) {
                            contacts[utId] = angular.extend({}, contacts[utId], contact);
                        } else {
                            contacts[utId] = contact;
                        }
                        _setData('contacts', contacts);
                    }
                },
                getContact: function(utId) {
                    var contacts =  _getData['contacts'];
                    if(contacts && contacts[utId]) {
                        return contacts[utId];
                    } else {
                        return null;
                    }
                },

                updateLoginData: function(key, value) {
                    var loginData = _getData('loginData');
                    loginData[key] = value;
                    _setData('loginData', loginData);
                },
                //
                setCookie : function(key, val, days){

                    if(!!days){
                        Cookies.set(key, val, { expires: days });
                    }else{
                        Cookies.set(key, val);
                    }
                },

                getCookie : function(key){
                    return Cookies.get(key);

                },
                removeCookie : function(key){
                    return Cookies.remove(key);
                }

            };

            /////////

            function _writeCookie (key, value, days) {
                var date = new Date();

                // Default at 365 days.
                days = days || 365;

                // Get unix milliseconds at current time plus number of days
                date.setTime(+ date + (days * 86400000)); //24 * 60 * 60 * 1000

                window.document.cookie = key + "=" + value + "; expires=" + date.toGMTString() + "; path=/";

                return value;
            }

        }();

})(window);
