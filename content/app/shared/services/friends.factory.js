    angular
        .module('ringid.shared')
        .factory('friendsFactory', friendsFactory);

		friendsFactory.$inject = ['$rootScope', 'SystemEvents', '$$q', 'Contacts', 'APP_CONSTANTS', 'Auth', 'Storage',  '$$connector', 'OPERATION_TYPES', 'userFactory', 'friendsHttpService', '$$stackedMap', 'Ringalert', 'Utils'];
        function friendsFactory($rootScope, SystemEvents,  $q, Contacts, APP_CONSTANTS, Auth, Storage,  $$connector, OPERATION_TYPES,  userFactory, friendsHttpService, $$stackedMap, Ringalert, Utils) { //jshint ignore:line

            var OTYPES = OPERATION_TYPES.SYSTEM.FRIENDS,
                initialized = false,
                AC = APP_CONSTANTS,
                userFriendsCount = 0,
                userFriendsSt = 0,
                utIdRequest = {
                        totalPacket: 0,
                        complete: false
                };


            var _utIDsToByteArray = function(utIds, doNotFilter) {
                var byteArray = [],
                    contactList = [],
                    i,
                    l,
                    index,
                    requestedUtIds = [];

                if (doNotFilter) {
                    requestedUtIds = utIds;
                } else {
                    // filter utid whose request are already made and data already available in localStorage
                    for(i = 0, l = utIds.length; i < l; i++) {
                        if(utIds[i] === Auth.currentUser().getUtId()) { //already requested. remove this item
                            continue;
                        } else if(Storage.getContact(utIds[i])) { // set contact from localStorage
                            contactList.push(Storage.getContact(utIds[i]));
                        } else {
                            requestedUtIds.push(utIds[i]);
                        }
                    }

                    // already got these contacts from localStorage. so add these to friends lists
                    if (contactList.lenght > 0) {
                        _setContacts(contactList);
                    }
                }

                var buf = new ArrayBuffer(requestedUtIds.length * 8),
                    utIDsArray = new DataView(buf);
                // create byte array
                for(i = 0, index = 0, l = requestedUtIds.length; i < l; i++) {
                    utIDsArray.setInt32(index,0);
                    index += 4;
                    utIDsArray.setInt32(index,requestedUtIds[i]);
                    index += 4;
                }

                for(i = 0; i < utIDsArray.byteLength; i++){
                    byteArray.push(utIDsArray.getInt8(i));
                }

                return byteArray;
            };

            var _clearUtId = function(utId, removeContacts,  removeAll) {
                var success =  Contacts.remove('utIds', utId);
                if (removeContacts) {
                    fFactory.friends.remove(utId);
                }
                if (!success || removeAll) {
                    success = Contacts.remove('incomingUtIds', utId);
                    if (removeContacts) {
                        fFactory.incomingFriends.remove(utId);
                    }
                    if (!success || removeAll) {
                        success = Contacts.remove('outgoingUtIds', utId);
                        if (removeContacts) {
                            fFactory.outgoingFriends.remove(utId);
                        }
                    }
                }
            };

            var _setContacts = function(contactList) {
                var friend, frnS;
                for (var i = 0, l = contactList.length; i < l; i++) {
                    friend = userFactory.create(contactList[i]);
                    frnS = friend.friendshipStatus();

                    if(contactList[i].deleted && contactList[i].deleted === 1) { // if contact is deleted do not save it
                        continue;
                    }

                    if(frnS === AC.FRIEND) { // friend
                        //Contacts.remove('utIds', contactList[i].utId);
                        fFactory.friends.save(friend.getUtId(), friend);
                    } else if (frnS  === AC.INCOMING_FRIEND) { // friend request received
                        //Contacts.remove('incomingUtIds', contactList[i].utId);
                        fFactory.incomingFriends.save(friend.getUtId(), friend);
                    } else if(frnS === AC.OUTGOING_FRIEND){ // friend request sent
                        //Contacts.remove('outgoingUtIds', contactList[i].utId);
                        fFactory.outgoingFriends.save(friend.getUtId(), friend);
                    } else {
                    }

                    _clearUtId(contactList[i].utId, false, true);
                    //Contacts.remove('utIds', contactList[i].utId);
                    //Contacts.remove('incomingUtIds', contactList[i].utId);
                    //Contacts.remove('outgoingUtIds', contactList[i].utId);

                }


            };



            var _requestFailed = function(defer, json) {
                var mg = (json && json.mg) ? json.mg : 'Reqeust Failed';
                Ringalert.show(mg, 'error');
                if (defer) {
                    defer.reject({sucs: false, mg: mg});
                }
            };



            var processResponse = function(json) {
                var friend, i, l;
                switch(json.actn) {
                    case OTYPES.TYPE_CONTACT_UTIDS:
                        if(json.sucs === true) {
                            if (utIdRequest.totalPacket === 0 &&  !utIdRequest.complete) { // check total response
                                utIdRequest.totalPacket = json.totalPacket;
                            }
                            utIdRequest.totalPacket--;
                            for(i = 0, l = json.utIds.length; i < l; i++) {
                                // save new utids in localstorage;
                                switch(json.utIds[i].value.frnS) {
                                    case AC.FRIEND:
                                        Contacts.add('utIds', json.utIds[i].key, json.utIds[i].value);
                                        break;
                                    case AC.INCOMING_FRIEND:
                                        Contacts.add('incomingUtIds', json.utIds[i].key, json.utIds[i].value);
                                        break;
                                    case AC.OUTGOING_FRIEND:
                                        Contacts.add('outgoingUtIds', json.utIds[i].key, json.utIds[i].value);
                                        break;
                                    default:
                                }
                            }

                            if (utIdRequest.totalPacket === 0) { // got all the packets for utid
                                utIdRequest.complete = true;
                                Contacts.initStorage();

                            }

                            Utils.triggerCustomEvent(SystemEvents.FRIEND.UTID_LIST_RECEIVED);


                        } else if (json.sucs === false && json.rc === 1111){
                            RingLogger.warning('Contact List utID REPEAT', RingLogger.tags.FRIEND);
                            friendsHttpService.getContactList() ;
                        } else {
                        }
                        break;

                    //case OTYPES.TYPE_CONTACT_LIST: // fetch own contacts response
                        //fFactory.state.isFriendsLoading = false;
                        //fFactory.state.isRequestsLoading = false;
                        //fFactory.state.noFriends = false;
                        //if (json.sucs === true) {
                            //// get matchby Value and remove this contact from fFactory.utIDs list
                            //for(i = 0; i < json.contacts.length; i++) {
                                //Storage.setContact(json.contacts[i].utId, json.contacts[i]); // store in localStorage
                                //_setContacts(json.contacts[i]);
                            //}
                        //} else {
                        //}
                        //break;
                    //case OTYPES.TYPE_FRIEND_CONTACT_LIST: // fetch friends contacts response
                        //fFactory.state.isUserFriendsLoading = false;
                        //userFriendsCount = json.tf;
                        //if (json.sucs === true) {
                            //for(i = 0; i < json.contactList.length; i++) {
                                //friend = userFactory.create(json.contactList[i]);
                                //fFactory.userFriends.save(friend.getUtId(), friend);
                            //}
                        //}
                        //break;

                    case OTYPES.TYPE_UPDATE_ADD_FRIEND: // 327, //"add_friend"
                        if(json.sucs === true) {
                            Contacts.add('incomingUtIds', json.utId, {frns: AC.INCOMING_FRIEND});
                        }
                    break;
                    case OTYPES.TYPE_UPDATE_DELETE_FRIEND: //328, // "delete_friend"
                        if(json.sucs === true) {
                            if(json.utId) {
                                _clearUtId(json.utId, true, true);
                                //if(!fFactory.friends.remove(json.utId)) { // remove from friend list
                                    //if(!fFactory.incomingFriends.remove(json.utId)) { // remove from incoming friends
                                        //Contacts.remove('outgoingUtIds', json.utId); // remove from outgoing utid list
                                    //} else {
                                        //Contacts.remove('incomingUtIds', json.utId); // remove from incoming utid list
                                    //}
                                //} else {
                                    //Contacts.remove('utIds', json.utId); // remove from friend utid list
                                //}
                                // in case user in in search result or current user visiting his/her profile then we
                                // need to update the userMap object too
                                friend = userFactory.create(json);
                                friend.updateUserObj({frnS: AC.NOT_FRIEND});
                            } else {
                            }
                        }
                        break;
                    case OTYPES.TYPE_UPDATE_ACCEPT_FRIEND: // 329, //"friend accepts me acknowledgement"
                        if(json.sucs === true) {
                            //Contacts.remove('outgoingUtIds', json.utId);
                            //Contacts.add('utIds', json.utId);
                            _clearUtId(json.utId, true);
                            fFactory.friends.add(json.utId, userFactory.create(json));
                        }
                        break;
                    default:
                }

            };

            var getFriends = function(type) {
                switch(type) {
                    case 'friendslist':
                    case 'friends':
                        return fFactory.friends;
                    case 'incoming':
                        return fFactory.incomingFriends;
                    case 'outgoing':
                        return fFactory.outgoingFriends;
                    case 'userfriends':
                        return fFactory.userFriends;
                }
            };

            // when leaving user friends page, empty userFriends
            var resetUserFriends =  function() {
                userFriendsCount = 0;
                fFactory.userFriends.reset();
            };

            // friends contact list of a friend
            var getUserContacts =  function(utId) {
                var defer = $q.defer(), friend;
                friendsHttpService.getUserContacts(utId, userFriendsSt).then(function(json) {
                    userFriendsCount = (userFriendsCount === 0 )? json.tf : userFriendsCount;
                    if (json.sucs === true) {
                        userFriendsSt += json.contactList.length;
                        for(var i = 0; i < json.contactList.length; i++) {
                            friend = userFactory.create(json.contactList[i]);
                            fFactory.userFriends.save(friend.getKey(), friend);
                        }
                        defer.resolve();
                    } else {
                        RingLogger.alert('FRIENDS FRIENDLIST FETCH FAIL', RingLogger.tags.FRIEND);
                        defer.reject(json);
                    }
                }, function(json) {
                    defer.reject(json);
                });
                return defer.promise;
            };

            //current user friend list
            var getContactDetails =  function(type, getRecord) {
                var i,
                    utidByteArray = [],
                    defer = $q.defer();

                getRecord = getRecord ? getRecord : 20;
                type = type ? type : 'utIds';

                switch(type) {
                    case 'friends':
                    case 'friendslist':
                    case 'utIds':
                        utidByteArray = _utIDsToByteArray(Contacts.utIds().keys().slice(0, getRecord) );
                        fFactory.state.isFriendsLoading = utidByteArray.length > 0 ? true : false;
                        break;
                    case 'userfriends':
                        break;
                    case 'incoming':
                    case 'incomingUtIds':
                        utidByteArray = _utIDsToByteArray( Contacts.incomingUtIds().keys().slice(0, getRecord) );

                        break;
                    case 'outgoing':
                    case 'outgoingUtIds':
                        utidByteArray = _utIDsToByteArray( Contacts.outgoingUtIds().keys().slice(0, getRecord) );
                        break;
                }

                if (utidByteArray.length > 0) {
                    friendsHttpService.getContactListDetails({
                        utIDs: utidByteArray,
                        uo: false
                    }).then( function(json) {

                        if (json.sucs === true) {
                            // get matchby Value and remove this contact from fFactory.utIDs list
                            for(i = 0; i < json.contacts.length; i++) {
                                Storage.setContact(json.contacts[i].utId, json.contacts[i]); // store in localStorage
                            }
                            _setContacts(json.contacts);
                            defer.resolve(json);
                        } else {
                            defer.reject(json);
                        }
                    }, function(json) {
                        defer.reject(json);
                    });
                } else {
                    defer.reject({sucs: false});
                }
                return defer.promise;

            };



            //contact details by UtIds
            var getContactDetailsByUtIds =  function(utIds){
                if(utIds.length > 0) {
                    var utidByteArray =  _utIDsToByteArray(utIds, true);

                    if(utidByteArray.length > 0) {
                        return friendsHttpService.getContactListDetails({
                            utIDs: utidByteArray,
                            uo: false
                        });
                    }
                }
            };


            var friendAction = function(obj, returnPromise) { // obj= {friend: userObj, action: 'accept', 'addfriend' etc }
                obj.friend.isLoading(true);
                switch(obj.action) {
                    case 'remove':
                    case 'unfriend': // AC.FRIEND :  // unfriend
                        return removeFriend(obj, returnPromise);
                    case 'add':
                    case 'addfriend': //AC.NOT_FRIEND: // send new friend request
                        return addFriend(obj, returnPromise);
                    case 'accept': // accept friend request
                        return acceptFriendRequest(obj, returnPromise);
                    case 'incoming_reject': // reject or cancel incoming or outgoig friend request
                    case 'outgoing_reject': // reject or cancel incoming or outgoig friend request
                    case 'reject': // reject or cancel incoming or outgoig friend request
                        return rejectFriendRequest(obj, returnPromise);
                    case 'block':
                        obj.block = 1;
                        obj.bv = 0;
                        return blockFriend(obj, returnPromise);
                    case 'unblock':
                        obj.block = 0;
                        obj.bv = 1;
                        return blockFriend(obj, returnPromise);
                    default:
                        obj.friend.isLoading(false);
                        return false;
                }

            };



            var addFriend =  function(obj, returnPromise) {
                var defer = returnPromise ? $q.defer(): false;
                var utId = obj.friend.getUtId();
                if(!utId) {
                }
                friendsHttpService.sendFriendRequest({uId: obj.friend.getKey()}).then(function(json){
                    obj.friend.isLoading(false);
                    if(json.sucs === true) {
                        Contacts.add('outgoingUtIds', utId, {frns: AC.OUTGOING_FRIEND});
                        if(returnPromise) {
                            defer.resolve(json);
                        }
                        obj.friend.updateUserObj( angular.extend({}, json, {frns: AC.OUTGOING_FRIEND}) );
                    } else {
                        _requestFailed(defer, json);
                    }
                }, function(json) {
                    obj.friend.isLoading(false);
                    _requestFailed(defer, json);
                });
                if(returnPromise) {
                    return defer.promise;
                }
            };

            var acceptFriendRequest =  function(obj, returnPromise) {
                var defer = returnPromise ? $q.defer(): false;
                var utId = obj.friend.getUtId();
                friendsHttpService.acceptFriendRequest({friendId: obj.friend.getKey(),utId: obj.friend.getUtId()}).then(function(json) {
                    RingLogger.print(json, RingLogger.tags.FRIEND);
                    obj.friend.isLoading(false);
                    if(json.sucs === true) {
                        _clearUtId(utId, true);
                        $rootScope.$broadcast(SystemEvents.FRIEND.PENDING_FRIENDS_COUNT_CHANGED);
                        //fFactory.incomingFriends.remove(utId);
                        //Contacts.remove('incomingUtIds', utId);

                        obj.friend.updateUserObj( angular.extend({}, json, {frnS: AC.FRIEND}) );
                        fFactory.friends.save(utId, obj.friend);

                        if(returnPromise) {
                            defer.resolve(json);
                        }
                    } else {
                        _requestFailed(defer, json);
                    }
                }, function(json) {
                    obj.friend.isLoading(false);
                    _requestFailed(defer, json);
                });

                if(returnPromise) {
                    return defer.promise;
                }
            };



            // remove existing friend
            var removeFriend =  function(obj, returnPromise) {
                var defer = returnPromise ? $q.defer(): false;
                var utId = obj.friend.getUtId();
                friendsHttpService.unFriend({friendId: obj.friend.getKey()}).then(function(json){
                    RingLogger.print(json, RingLogger.tags.FRIEND);
                    obj.friend.isLoading(false);
                    if (json.sucs === true) {
                        _clearUtId(utId, true, true);
                        $rootScope.$broadcast(SystemEvents.FRIEND.PENDING_FRIENDS_COUNT_CHANGED);
                        //fFactory.friends.remove(utId); // remove from friend list
                        //Contacts.remove('utIds', utId);
                        obj.friend.updateUserObj( angular.extend({}, json, {frnS: AC.NOT_FRIEND}) );
                       if(returnPromise) {
                           defer.resolve(json);
                       }
                    } else {
                        _requestFailed(defer, json);
                    }
                }, function(json) {
                    obj.friend.isLoading(false);
                    _requestFailed(defer, json);
                });

                if(returnPromise) {
                    return defer.promise;
                }
            };


            // remove request incoming,outgoing both
            var rejectFriendRequest = function(obj, returnPromise) {
                var defer = returnPromise ? $q.defer(): false;
                var utId = obj.friend.getUtId();
                if(!utId) {
                }
                friendsHttpService.unFriend({friendId: obj.friend.getKey()}).then(function(json) {
                     obj.friend.isLoading(false);
                    if (json.sucs === true) {
                        obj.friend.updateUserObj( angular.extend({}, json, {frnS: AC.NOT_FRIEND}) );
                        _clearUtId(utId, true, true);
                        $rootScope.$broadcast(SystemEvents.FRIEND.PENDING_FRIENDS_COUNT_CHANGED);
                        //Contacts.remove('incomingUtIds', utId);
                        //fFactory.incomingFriends.remove(utId);
                        //Contacts.remove('outgoingUtIds', utId);
                        if(returnPromise) {
                            defer.resolve(json);
                        }
                    } else {
                        _requestFailed(defer, json);
                    }
                }, function(json) {
                     obj.friend.isLoading(false);
                     _requestFailed(defer, json);
                });

                if(returnPromise) {
                    return defer.promise;
                }
            };
            var blockFriend =  function(obj, returnPromise) {
                var defer = returnPromise ? $q.defer(): false;
                friendsHttpService.blockFriend(obj).then(function (json) {
                     obj.friend.isLoading(false);
                    if (json.sucs === true){
                        obj.friend.setBlock(obj.block);
                    }
                    //else {
                    //}
                    if(returnPromise) {
                        defer.resolve();
                    }
                }, function() {
                    obj.friend.isLoading(false);
                    if(returnPromise) {
                        defer.reject();
                    }
                });

                if(returnPromise) {
                    return defer.promise;
                }
            };


            var getIds =  function() {
                var keys = '';
                for(var i = 0; i < fFactory.friends.size(); i++) {
                    keys = keys + ','.fFactory.friends[i].getKey();
                }
                return keys;
            };


            var searchContact = function(searchVal, friendOnly) {
                if (friendOnly) {
                    var defer = $q.defer();
                    friendsHttpService.searchContact(searchVal, friendOnly).then(function(json) {
                        if (json.sucs) {
                            defer.resolve();
                        } else {
                            defer.reject();
                        }
                    }, function() {
                        defer.reject();
                    }, function(json) {
                        // process json
                        if(json.sucs === true) {
                            for (var i = 0; i < json.searchedcontaclist.length; i++) {
                                Storage.setContact(json.searchedcontaclist[i].utId, json.searchedcontaclist[i]); // store in localStorage
                            }
                            _setContacts(json.searchedcontaclist);
                        } else {
                            defer.reject();
                        }
                    });

                    return defer.promise;

                } else {
                    return friendsHttpService.searchContact(searchVal, false);
                }

            };




            function addToUtIdList(which, utid) {
                switch(which) {
                    case 'utIds':
                        Contacts.utIds().save(utid, {frnS: AC.FRIEND});
                        break;
                    case 'incomingUtIds':
                        Contacts.incomingUtIds().save(utid, {frnS: AC.INCOMING_FRIEND});
                        break;
                    case 'outgoingUtIds':
                        Contacts.outgoingUtIds().save(utid, {frnS: AC.OUTGOING_FRIEND});
                        break;
                }
            }


            var fFactory = {
            // api data
                state : {
                    noFriends : false,
                    isFriendsLoading : false,
                    isUserFriendsLoading : false,
                    isRequestsLoading: false
                },
                getRequestCount: function() {
                    var count =  Contacts.incomingUtIds().length() + fFactory.incomingFriends.length();
                    return  count > 99 ? '99+' : count;
                },
                getPendingCount: function() {
                    return Contacts.outgoingUtIds().length() + fFactory.outgoingFriends.length();
                },
                totalFriends: function(friendType) {
                    if (friendType === 'userfriends' ) {
                        return userFriendsCount;
                    } else {
                        return  Contacts.utIds().length() + fFactory.friends.length();
                    }
                },
                totalUserFriends: function() {
                    return userFriendsCount;
                },
                friends : $$stackedMap.createNew(),
                userFriends : $$stackedMap.createNew(),
                incomingFriends : $$stackedMap.createNew(),
                outgoingFriends : $$stackedMap.createNew(),

            // api methods

                process : processResponse, // processes server response regarding contacts(add, updated, fetch etc)
                getFriends : getFriends, // returns friends, outgoing requests, incoming requests etc
                resetUserFriends : resetUserFriends, // emptyis contacts friendlist once use leaves that users profile page and friends tab
                getUserContacts : getUserContacts, // returns conjtact's friendlist
                getContactDetails : getContactDetails, // fetch given or 20 friends details
                getContactDetailsByUtIds : getContactDetailsByUtIds, // fetch contacts detail of given utIds
                removeFriend : removeFriend, // remove friend from contact list
                friendAction: friendAction, // add friend, accept friend request, reject friend request etc
                addFriend : addFriend, // send friend request
                rejectFriendRequest : rejectFriendRequest, // reject friend request
                acceptFriendRequest : acceptFriendRequest, // accept friend request
                searchContact: searchContact,
                initFriends : initFriends, // initialize friends factory
                addToUtIdList: addToUtIdList,
                // below apis may not be needed anymore
                blockFriend : blockFriend, // block friend
                getIds : getIds, // get friends uids comma seperated list

                utIDsToByteArray : _utIDsToByteArray
            };


            $$connector.subscribe(fFactory.process, {
                action: [
                    OTYPES.TYPE_CONTACT_UTIDS,
                    //OTYPES.TYPE_CONTACT_LIST,
                    //OTYPES.TYPE_FRIEND_CONTACT_LIST,
                    OTYPES.TYPE_UPDATE_ADD_FRIEND,
                    OTYPES.TYPE_UPDATE_DELETE_FRIEND,
                    OTYPES.TYPE_UPDATE_ACCEPT_FRIEND,
                    //OTYPES.ACTION_FRIEND_SEARCH
                ],
                //scope: scope,
                callWithUnresolved : true
            });

            /// initialize friend list and people you may know
            function initFriends(force) {
                if (!initialized || force) {
                    initialized = true;
                    // restore Data from LocalStorage if any
                    Contacts.init();
                    // initial contact list utids request
                    friendsHttpService.getContactList() ;
                }

            }


            return fFactory;


		}
        //merging tool testing

