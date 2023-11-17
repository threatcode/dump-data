
angular
        .module('ringid.shared')
        .factory('$$newsPortalMap', $$newsPortalMap);

    $$newsPortalMap.$inject = ['settings'];
    function $$newsPortalMap(settings) { //jshint ignore:line

        return {
            create: function (obj) {
                var portal = {
                    fn:obj.fn,
					nPCatId:obj.nPCatId,
					nPCatName:obj.nPCatName,
					nPslgn:obj.nPslgn,
					prIm:obj.prIm,
					subCount:obj.subCount,
					subsc:obj.subsc,
					uId:obj.uId,
					utId:obj.utId
                };


                return {
                    getKey: function () {
                        return portal.utId;
                    },
                    getFullName: function() {
                    	return portal.fn;
                    },
                    getCategoryId: function () {
                        return portal.nPCatId;
                    },
                    getCategoryName: function () {
                        return portal.nPCatName;
                    },
                    getPortalSlogan: function () {
                        return portal.nPslgn;
                    },
                    getProfileImage: function () {
                    	if(portal.prIm){
                    		return settings.imBase+portal.prIm;
                    	}else{
                    		return "../../../images/test/1.png";
                    	}
                    },
                    getFollowAndSliderImage: function () {
                    	if(portal.prIm){
                    		return settings.imBase+portal.prIm;
                    	}else{
                    		return "../../../images/test/2.png";
                    	}
                    },
                    getSubCount: function () {
                        return portal.subCount;
                    },
                    setIfSubscribed:function(status){
                        portal.subsc = status;
                    },
                    isSubscribed: function () {
                        return portal.subsc;
                    },
                    getUid: function () {
                        return portal.uId;
                    }
                };
            }
        };
    }
