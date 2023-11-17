/*
 * Ipvision
 */


    angular
        .module('ringid.shared')
        .factory('InviteFactory', InviteFactory);

    InviteFactory.$inject = ['$$connector', 'OPERATION_TYPES', 'userFactory', 'Storage', 'friendsFactory', '$$stackedMap', '$$q'];
    function InviteFactory($$connector, OPERATION_TYPES, userFactory, Storage, friendsFactory, $$stackedMap, $q) {
        var _utIds = [], //Storage.getData('suggestionUtIds') || [],
            initialized = false,
            OTYPES = OPERATION_TYPES.SYSTEM.FRIENDS,
            REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE,
            REQPRF = OPERATION_TYPES.SYSTEM.PROFILE,
            user;

        var Factory = {
            init: init,
            state : {
                isRequestsLoading: false
            },
            suggestionFriends: $$stackedMap.createNew(),
            getSuggestionContactsDetails: getSuggestionContactsDetails,
            removeSuggestion: removeSuggestion,
            allSuggestionFriends: $$stackedMap.createNew(),
            noOfSuggestions: function() { // should be removed after refactor done
                return Factory.suggestionFriends.length();
            }
            //getAllsuggestionContactDetails:getAllsuggestionContactDetails
        };

        function _processResponse (json) {
            var i;
            switch(json.actn) {
                case OTYPES.TYPE_PEOPLE_YOU_MAY_KNOW:
                    if (json.sucs===true) {
                        for(i=0; i<json.contactIds.length;i++){
                            _utIds.push(json.contactIds[i]);
                        }
                        getSuggestionContactsDetails();
                    } else if (json.sucs === false && json.rc === 1111) {
                        
                        _getSuggestionUtids();
                    } else {
                        
                    }
                    break;
                case OTYPES.TYPE_PEOPLE_YOU_MAY_KNOW_DETAILS:
                    Factory.state.isRequestsLoading = false;
                    if(json.sucs === true){
                        for(i=0; i<json.contactList.length; i++){
                            //if(json.contactList[i].frnS === undefined){
                                _utIds.splice( _utIds.indexOf(json.contactList[i].utId), 1);
                                user = userFactory.create(json.contactList[i]);
                                if (user.isFriend()) {
                                    continue;
                                } else {
                                    Factory.suggestionFriends.save(user.getUtId(), user);
                                }
                            //}
                        }
                    } else if (json.sucs === false && json.rc === 1111) {
                        
                        getSuggestionContactsDetails();
                    } else{
                        
                    }
                    break;
            }
        }



        function _getSuggestionUtids() {
            //_utIds = [];
            return $$connector.send({
                actn: OTYPES.TYPE_PEOPLE_YOU_MAY_KNOW
            }, REQTYPE.REQUEST);
        }


        function getSuggestionContactsDetails (count){//user details
            count = count || 10;
            if(!Factory.state.isRequestsLoading){
                Factory.state.isRequestsLoading = true;
                return $$connector.send({
                    actn: OTYPES.TYPE_PEOPLE_YOU_MAY_KNOW_DETAILS,
                    idList: _utIds.slice(0, count)
                }, REQTYPE.REQUEST);
            }


        }

        //function getAllsuggestionContactDetails() {
        //    var suggUtIds = Storage.getData('suggestionUtIds');
        //}
        // TODO IMPLEMENTED IN GLOBAL api.factory. should be used everywhere and removed from here

        function removeSuggestion(utid,action){
            var defer = $q.defer();
            var payload = {
                actn:33,
                utId:utid
            };

            $$connector.request(payload, REQTYPE.REQUEST).then(function(json){
                if(json.sucs===true){
                    //Factory.suggestionFriends.remove(json.utId);
                    if(action !=='remove'){
                        friendsFactory.addToUtIdList('outgoingUtIds', json.utId);
                    }

                    Factory.suggestionFriends.remove(utid);

                    if(Factory.suggestionFriends.length() < 5){
                        getSuggestionContactsDetails();
                    }
                    defer.resolve(json);
                }

            }, function(errData) {
                defer.reject(errData);
            });
            return defer.promise;
        }


        function init(force) {

            if (!initialized) {
                $$connector.subscribe(_processResponse, {action: [
                        OTYPES.TYPE_PEOPLE_YOU_MAY_KNOW,
                        OTYPES.TYPE_PEOPLE_YOU_MAY_KNOW_DETAILS
                    ]
                });
            }

            if (!initialized || force) {
                initialized = true;
                _getSuggestionUtids();
            }
        }


        return Factory;

    }


