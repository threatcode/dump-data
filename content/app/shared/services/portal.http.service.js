/*
 * © Ipvision
 */



	angular
		.module('ringid.shared')
        .service('portalHttpService', portalHttpService);

        portalHttpService.$inject = [ 'OPERATION_TYPES', '$$connector'];
        function portalHttpService( OPERATION_TYPES, $$connector) {
			var self = this,
				OTYPES = OPERATION_TYPES.SYSTEM.PORTAL,
                REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE,
                PROFILE_DETAIL = OPERATION_TYPES.SYSTEM.PROFILE.TYPE_ACTION_GET_USER_DETAILS ;


            self.getPortalDiscoverList = function(param) {
                var payload = {
                    actn: OTYPES.ACTION_NEWSPORTAL_LIST, // 299
                    subscType: 1, // 1 = unsubscribed
                    st: param||0,
                    pType:3
                };
                return $$connector.pull(payload, REQTYPE.REQUEST, true);
            };

            self.getPortalFollowingList = function(param) {
                var payload = {
                    actn: OTYPES.ACTION_NEWSPORTAL_LIST, // 299
                    subscType: 2, //2 = subscribed
                    st: param||0,
                    pType:3
                };
                return $$connector.pull(payload, REQTYPE.REQUEST, true);
            };

            self.getPortalCatList = function(param) {
                var payload = {
                    actn: OTYPES.ACTION_NEWSPORTAL_CATEGORIES_LIST, // 294
                    utId: param,
                    pType:3
                };
                return $$connector.pull(payload, REQTYPE.REQUEST, true);
            };

            self.searchNewsPortal = function(param) {
                var payload = {
                    actn: OTYPES.ACTION_CONTACT_SEARCH, // 34
                    pType: 3,
                    schPm:param
                };
                return $$connector.pull(payload, REQTYPE.REQUEST, true);
            };

            self.doneFollowing = function(key,follow,unfollow,type) {
                var payload = {
                    actn: OTYPES.ACTION_SUBSCRIBE_UNSUBSCRIBE_NEWSPORTAL, // 296
                    id: key,
                    subscType:type,
                    npSubIds:follow,
                    npUnSubIds:unfollow,
                    pType:3

                };
                return $$connector.request(payload, REQTYPE.UPDATE);
            };

            self.unFollowPortal = function(key){
                var payload = {
                    actn:OTYPES.ACTION_SUBSCRIBE_UNSUBSCRIBE_NEWSPORTAL,//296
                    subscType:1,
                    id:key,
                    pType:3
                };
                return $$connector.request(payload, REQTYPE.UPDATE);
            }

            self.getPortalShortDetails = function(uid){
                var payload = {
                    actn: PROFILE_DETAIL, // 204
                    isnp: true,
                    uId:uid,
                    pType:3
                };

                return $$connector.request(payload, REQTYPE.REQUEST);
            };

        }

