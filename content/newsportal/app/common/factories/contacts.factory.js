(function () {
    "use strict";
    angular
            .module('ringid.common.contacts_factory', ['ringid.config', 'ringid.common.stacked_map'])
            .factory('Contacts', ContactsFactory);

            ContactsFactory.$inject = ['settings','$$stackedMap', 'utilsFactory', 'Storage'];
            function ContactsFactory(settings, $$stackedMap,  utilsFactory, Storage) {
                var utIdMap = {
                        utIds:  $$stackedMap.createNew(),
                        incomingUtIds: $$stackedMap.createNew(),
                        outgoingUtIds: $$stackedMap.createNew()
                    },
                    removedUtIds = $$stackedMap.createNew();
                    //tempUtIds = $$stackedMap.createNew();

                //function syncStorage(utidType, utid, frnsObj, addNew) {
                        //tempUtIds.setStack(Storage.getData(utidType)); // set from localStorage
                        //if(addNew) {
                            //tempUtIds.save(utid, frnsObj); // modify data
                        //} else {
                            //tempUtIds.remove(utid); // modify data
                        //}

                        //Storage.setData(utidType, tempUtIds.all()); // save changes to localstorage
                        //tempUtIds.reset(); // reset temp variable
                //}

                return {
                    init: function() {
                        //tempUtIds.setStack([]);
                        // all time fresh utid list is taken from server and shown to user
                        //utIdMap.utIds.setStack(Storage.getData('utIds') || []);
                        //utIdMap.incomingUtIds.setStack(Storage.getData('incomingUtIds') || []);
                        //utIdMap.outgoingUtIds.setStack(Storage.getData('outgoingUtIds') || []);
                    },
                    initStorage: function() {
                        //Storage.setData('utIds', utIdMap.utIds.all() );
                        //Storage.setData('incomingUtIds', utIdMap.incomingUtIds.all() );
                        //Storage.setData('outgoingUtIds', utIdMap.outgoingUtIds.all() );
                    },
                    utIds : function() {
                        return utIdMap.utIds; // all friends
                    },
                    outgoingUtIds : function() {
                        return utIdMap.outgoingUtIds; // all friends
                    },
                    incomingUtIds :function() {
                        return utIdMap.incomingUtIds; // all friends
                    },
                    remove: function(utidType, utid) {
                        //syncStorage(utidType, utid);
                        removedUtIds.save(utid, utIdMap[utidType].get(utid));
                        return utIdMap[utidType].remove(utid);
                    },
                    add: function(utidType, utid, frnsObj) {
                        //syncStorage(utidType, utid, frnsObj, true);
                        utIdMap[utidType].save(utid, frnsObj);
                    },
                    getFrns: function(utId) {
                        return utIdMap.utIds.get(utId) ||
                               utIdMap.incomingUtIds.get(utId) ||
                               utIdMap.outgoingUtIds.get(utId) ||
                               removedUtIds.get(utId) ||
                               {frnS: 0};
                    }
                };
            }

})();
