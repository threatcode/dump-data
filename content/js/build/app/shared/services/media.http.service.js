/*
 * © Ipvision
 */


	angular
		.module('ringid.shared')
        .service('mediaHttpService', mediaHttpService);

        mediaHttpService.$inject = [ 'OPERATION_TYPES', '$$connector'];
        function mediaHttpService( OPERATION_TYPES, $$connector) {
			var self = this,
				OTYPES = OPERATION_TYPES.SYSTEM.MEDIA,
                REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE;


            // MEDIA ALBUM APIS
            self.fetchMediaAlbums = function(obj) {
                var payload = {
                    actn: OTYPES.ACTION_MEDIA_ALBUM_LIST, // 256
                    mdaT: obj.mdaT || 1,
                    utId: obj.utId // optional. maybe without utid just own media album list fetch
                };
                $$connector.send(payload, REQTYPE.REQUEST, true);
            };


            self.fetchHashtagSuggestion = function(schPm) {
                return $$connector.pull({
                    actn: OTYPES.ACTION_GET_HASHTAG_SUGGESTION,
                    schPm: schPm.utf8Encode()
                }, REQTYPE.REQUEST);
            };

            self.fetchSearchResult = function(param) {
                var payload = {
                    actn : OTYPES.ACTION_MEDIA_SEARCH_RESULT,
                    schPm: param.utf8Encode()
                };
                //return $$connector.send(payload,REQTYPE.REQUEST);
                return $$connector.pull(payload, REQTYPE.REQUEST);
            };

            self.fetchContent = function(param) {
                var payload = {
                    actn : OTYPES.ACTION_SPECIFIC_MEDIA_RESULT,//278
                    schPm: param.sk.utf8Encode(),
                    sugt:param.sugt,
                    pvtid:param.pvtid || 0,
                    scl:param.scl || 1
                };
                return $$connector.send(payload,REQTYPE.REQUEST);
            };
            self.fetchAlbumDetails = function(albId) {
                var payload = {
                    actn: OTYPES.ACTION_MEDIA_ALBUM_DETAILS, // 257
                    albId: albId
                };
                return $$connector.request(payload, REQTYPE.REQUEST);
            };

            self.addMediaAlbum= function(obj) {
                var payload = {
                    actn: OTYPES.ACTION_ADD_MEDIA_ALBUM, // 253
                    imgURL: obj.imgURL || '',
                    albn: obj.albn.utf8Encode(),
                    mdaT: obj.mdaT
                };
                return $$connector.request(payload, REQTYPE.UPDATE);
            };

            self.updateMediaAlbum = function(obj) {
                var payload = {
                    actn: OTYPES.ACTION_UPDATE_MEDIA_ALBUM, // 254
                    albId: obj.albId,
                    imgURL: obj.imgURL,
                    mdaT: obj.mdaT,
                    albn: obj.albn.utf8Encode()
                };
                return $$connector.request(payload, REQTYPE.UPDATE);
            };

            self.deleteAlbum = function(albId) {
                var payload = {
                    actn: OTYPES.ACTION_DELETE_MEDIA_ALBUM, // 255
                    albId: albId
                };
                return $$connector.request(payload, REQTYPE.UPDATE);
            };



           // MEDIA CONTENT APIS
            self.fetchAlbumContents = function(obj) {
                var payload = {
                    actn: OTYPES.ACTION_MEDIA_ALBUM_CONTENT_LIST, // 261
                    albId: obj.albId,
                    utId: obj.utId, // optional. maybe without utid just own media album list fetch
                    st: obj.st || 0
                };
                $$connector.send(payload, REQTYPE.REQUEST);
            };

            self.fetchAlbumContentsForpopup = function(obj) {
                var payload = {
                    actn: OTYPES.ACTION_MEDIA_ALBUM_CONTENT_LIST, // 261
                    albId: obj.albId || obj.id,
                    utId: obj.utId, // optional. maybe without utid just own media album list fetch
                    st: obj.st || 0
                };
                return $$connector.pull(payload, REQTYPE.REQUEST);
            };

            // no more used
            //self.fetchContentDetails= function(obj) {
                //var payload = {
                    //actn: OTYPES.ACTION_MEDIA_CONTENT_DETAILS, // 262,
                    //cntntId: obj.cntntId,
                    //utId: obj.utId
                //};
                //return $$connector.request(payload, REQTYPE.REQUEST);
            //};

            self.addMediaToAlbum = function(obj) {
                var payload = {
                    actn: OTYPES.ACTION_ADD_MEDIA_CONTENT, // 258
                    albId: obj.albId,
                    mdaLst: obj.mdaLst, // [{strmURL, drtn, tih, tiw, thmbURL, artst, ttl}]
                    mdaT: obj.mdaT
                };

                return $$connector.request(payload, REQTYPE.UPDATE);
            };

            self.updateMediaAlbum = function(obj) {
                var payload = {
                    actn: OTYPES.ACTION_UPDATE_MEDIA_CONTENT, // 259
                    mdaCntntDTO: obj.mdaCntntDTO // {id,strmURL,albId,drtn,thmbURL,artst,ttl,utId}
                };
                return $$connector.request(payload, REQTYPE.UPDATE);
            };

            self.deleteAlbumContent = function(cntntId) {
                var payload = {
                    actn: OTYPES.ACTION_DELETE_MEDIA_CONTENT, // 260
                    cntntId: cntntId
                };
                return $$connector.request(payload, REQTYPE.UPDATE);
            };


            // CONTENT ACTIVITY APIS
            self.increaseViewCount = function(cntntId,nfId) {
                // THERE IS AN UPDATE EVENT NOT HANDLED WITH ACTION 472
                var payload = {
                    actn: OTYPES.ACTION_INCREASE_MEDIA_CONTENT_VIEW_COUNT, // 272
                    cntntId: cntntId
                };
                if(nfId){
                    payload.nfId = nfId;
                }
                return $$connector.request(payload, REQTYPE.UPDATE);
            };


            // self.likeUnlikeContent = function(obj) {
            //     // THERE IS AN UPDATE EVENT NOT HANDLED WITH ACTION 464
            //     var payload = {
            //         actn: OTYPES.ACTION_LIKE_UNLIKE_MEDIA, // 264
            //         cntntId: obj.cntntId,
            //         lkd: obj.lkd
            //     };
            //     if(obj.nfId){
            //         payload.nfId = obj.nfId;
            //     }
            //     return $$connector.request(payload, REQTYPE.UPDATE);
            // };

            // self.likeList = function(cntntId,nfId) {
            //     var payload = {
            //         actn: OTYPES.ACTION_MEDIA_LIKE_LIST, // 269,
            //         cntntId: cntntId
            //     };
            //     if(nfId){
            //         payload.nfId = nfId;
            //     }
            //     return $$connector.pull(payload, REQTYPE.REQUEST);
            // };


            self.getSearchTrends = function () {
                var payload = {
                    actn : 281
                };
                return $$connector.pull(payload,REQTYPE.REQUEST);
            };

            self.getTaggedMedia = function (param) {
                var payload = {
                    actn : OTYPES.ACTION_GET_TAGGED_MEDIA_SONGS,//279
                    htid : param,
                    pvtid : 0,
                    scl : 2
                };
                return $$connector.send(payload,REQTYPE.REQUEST);
            };

            self.fetchSliderImage = function (param) {
                var payload = {
                    actn : OTYPES.ACTION_GET_MEDIA_SLIDER_IMG,//1005
                    mdaT : param.mdaT
                };
                return $$connector.pull(payload,REQTYPE.REQUEST,true);
            };

        }

