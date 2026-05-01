/*
 * © Ipvision
 */


    angular
        .module('ringid.shared')
        .service('businessHttpService', businessHttpService);

    businessHttpService.$inject = ['OPERATION_TYPES', '$$connector'];
    function businessHttpService(OPERATION_TYPES, $$connector) {
        var self = this,
            OTYPES = OPERATION_TYPES.SYSTEM.PORTAL,
            REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE,
            PROFILE_DETAIL = OPERATION_TYPES.SYSTEM.PROFILE.TYPE_ACTION_GET_USER_DETAILS;


        self.getBusinessDiscoverList = function getBusinessDiscoverList(param) {
            var payload = {
                actn: OTYPES.ACTION_NEWSPORTAL_LIST, // 299
                subscType: 1, // 1 = unsubscribed
                st: param || 0,
                pType: 4,
            };
            return $$connector.pull(payload, REQTYPE.REQUEST, true);
        };

        self.getBusinessFollowingList = function getBusinessFollowingList(param) {
            var payload = {
                actn: OTYPES.ACTION_NEWSPORTAL_LIST, // 299
                subscType: 2, // 2 = subscribed
                st: param || 0,
                pType: 4,
            };
            return $$connector.pull(payload, REQTYPE.REQUEST, true);
        };

        self.getBusinessCatList = function getBusinessCatList(param) {
            var payload = {
                actn: OTYPES.ACTION_NEWSPORTAL_CATEGORIES_LIST, // 294
                utId: param,
                pType: 4,
            };
            return $$connector.pull(payload, REQTYPE.REQUEST, true);
        };

        self.searchBusinessPortal = function searchBusinessPortal(param) {
            var payload = {
                actn: OTYPES.ACTION_CONTACT_SEARCH, // 34
                pType: 4,
                schPm: param,
            };
            return $$connector.pull(payload, REQTYPE.REQUEST, true);
        };

        self.doneFollowing = function doneFollowing(key, follow, unfollow, type) {
            var payload = {
                actn: OTYPES.ACTION_SUBSCRIBE_UNSUBSCRIBE_NEWSPORTAL, // 296
                id: key,
                subscType: type,
                npSubIds: follow,
                npUnSubIds: unfollow,
                pType: 4,

            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.unFollowBusiness = function unFollowBusiness(key) {
            var payload = {
                actn: OTYPES.ACTION_SUBSCRIBE_UNSUBSCRIBE_NEWSPORTAL, // 296
                subscType: 1,
                id: key,
                pType: 4,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.getBusinessShortDetails = function getBusinessShortDetails(uid) {
            var payload = {
                actn: PROFILE_DETAIL, // 204
                uId: uid,
                pType: 4,
            };

            return $$connector.request(payload, REQTYPE.REQUEST);
        };
    }

