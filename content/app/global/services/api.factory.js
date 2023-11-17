
/*
 * © Ipvision
 */

	angular
    .module('ringid.global_services')
        .factory('Api', ApiFactory);

        ApiFactory.$inject = ['OPERATION_TYPES', '$$connector', 'settings', '$ringhttp'];
        function ApiFactory (OPERATION_TYPES, $$connector, settings, $ringhttp) {
            var OTYPES = OPERATION_TYPES.SYSTEM,
                REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE;

            function changeMood(mood) {
                return $$connector.request({
                    actn: OTYPES.PROFILE.TYPE_ACTION_USER_MOOD,
                    mood: mood
                }, REQTYPE.AUTHENTICATION);
            }

            function getUserDetails(obj, withMutualFriendCount,isNewsPortaUser) {
                var payload = {
                    actn: OTYPES.PROFILE.TYPE_ACTION_GET_USER_DETAILS,//204
                    wmfc : !!withMutualFriendCount,
                    // isnp : !!isNewsPortaUser
                };
                if(!!isNewsPortaUser){
                        payload.pType = 3;
                }
                angular.extend(payload, obj);

                return $$connector.request(payload, REQTYPE.REQUEST, true);// flooding true
            }

            function getMutualFriends(userMap) {
                return $$connector.pull({
                    actn: OTYPES.PROFILE.FETCH_FRIEND_MUTUAL_FRIEND_LIST,
                    uId: userMap.getUId()
                }, REQTYPE.REQUEST);
            }

            function fetchUserPresence(uIds) {
                var payload = {
                    actn: OTYPES.PROFILE.ACTION_USERS_PRESENCE_DETAILS,
                    uIds: uIds
                };
                return $$connector.request(payload, REQTYPE.REQUEST);
            }

            function fetchCountryList() {
				return $ringhttp.get( settings.baseUrl + '/resources/countries.json');
            }


            function fetchMediaDetails(obj) {
                var payload = {
                    actn: OTYPES.MEDIA.ACTION_MEDIA_CONTENT_DETAILS, // 262,
                    cntntId: obj.cntntId,
                    utId: obj.utId
                };
                return $$connector.request(payload, REQTYPE.REQUEST);
            }


            function removeAvatar (prIm) {
                var payload  = {
                    actn: OTYPES.PROFILE.TYPE_REMOVE_PROFILE_IMAGE,
                    prIm: prIm
                };
                return $$connector.request(payload, REQTYPE.UPDATE);
            }

            function removeCover(cIm) {
                var payload = {
                    actn: OTYPES.PROFILE.TYPE_REMOVE_COVER_IMAGE,
                    cIm: cIm
                };
                return $$connector.request(payload, REQTYPE.UPDATE);
            }

            function verifyPhoneNo(obj) {
                return $$connector.request({
                    actn: OTYPES.PROFILE.SEND_VERIFICATION_CODE_TO_PHONE,//212,
                    mbl : obj.mbl,
                    mblDc :obj.mblDc,
                    pkd:true
                }, REQTYPE.REQUEST);
            }

            return {
                fetchCountryList: fetchCountryList,
                user: {
                    changeMood: changeMood,
                    getUserDetails: getUserDetails,
                    getMutualFriends: getMutualFriends,
                    fetchUserPresence: fetchUserPresence,
                    removeAvatar: removeAvatar,
                    removeCover: removeCover,
                    verifyPhoneNo : verifyPhoneNo
                },
                media: {
                    fetchDetails: fetchMediaDetails
                }
            };
        }

