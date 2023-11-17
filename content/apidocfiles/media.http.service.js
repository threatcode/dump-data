/*
 * © Ipvision
 */


    angular
        .module('ringid.shared')
        .service('mediaHttpService', mediaHttpService);

    mediaHttpService.$inject = ['OPERATION_TYPES', '$$connector'];
    function mediaHttpService(OPERATION_TYPES, $$connector) {
        var self = this,
            OTYPES = OPERATION_TYPES.SYSTEM.MEDIA,
            REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE,
            PROFILE_TYPES = OPERATION_TYPES.SYSTEM.PROFILE_TYPES,
            PORTAL_OPTIONS = OPERATION_TYPES.SYSTEM.PORTAL;


    // MEDIA ALBUM APIS
        self.fetchMediaAlbums = fetchMediaAlbums;
        self.fetchHashtagSuggestion = fetchHashtagSuggestion;
        self.fetchSearchResult = fetchSearchResult;
        self.fetchContent = fetchContent;
        self.addMediaAlbum = addMediaAlbum;
        self.updateMediaAlbum = updateMediaAlbum;
        self.deleteAlbum = deleteAlbum;

    // MEDIA CONTENT APIS
        self.addMediaToAlbum = addMediaToAlbum;
        self.updateMediaContent = updateMediaContent;
        self.deleteAlbumContent = deleteAlbumContent;

    // CONTENT ACTIVITY APIS
        self.increaseViewCount = increaseViewCount;
        self.getSearchTrends = getSearchTrends;
        self.getTaggedMedia = getTaggedMedia;
        self.fetchSliderImage = fetchSliderImage;
        self.fetchTrendingFeeds = fetchTrendingFeeds;
        self.getMediaDiscoverList = getMediaDiscoverList;
        self.getMediaFollowingList = getMediaFollowingList;
        self.searchPortal = searchPortal;
        self.followPage = followPage;

        self.getShortDetails = getShortDetails;
        self.followMediaPage = followMediaPage;
        self.unFollowMediaPage = unFollowMediaPage;

        function getMediaDiscoverList(params) {
            var payload = {
                actn: PORTAL_OPTIONS.ACTION_NEWSPORTAL_LIST, // 299
                subscType: 1, // 1 = unsubscribed
                lmt: (params && params.lmt) ? params.lmt : 10,
                st: (params && params.st) ? params.st : 0,
                pType: PROFILE_TYPES.MEDIA_PAGE,
            };
            return $$connector.pull(payload, REQTYPE.REQUEST, true);
        }

        function getMediaFollowingList(params) {
            var payload = {
                actn: PORTAL_OPTIONS.ACTION_NEWSPORTAL_LIST, // 299
                subscType: 2, // 2 = subscribed
                lmt: (params && params.lmt) ? params.lmt : 10,
                st: (params && params.st) ? params.st : 0,
                pType: PROFILE_TYPES.MEDIA_PAGE,
            };

            return $$connector.pull(payload, REQTYPE.REQUEST, true);
        }

        function searchPortal(param) {
            var payload = {
                actn: PORTAL_OPTIONS.ACTION_CONTACT_SEARCH, // 34
                pType: PROFILE_TYPES.MEDIA_PAGE,
                schPm: param,
            };
            return $$connector.pull(payload, REQTYPE.REQUEST, true);
        }

        function followPage(key) {
            var payload = {
                actn: PORTAL_OPTIONS.ACTION_SUBSCRIBE_UNSUBSCRIBE_NEWSPORTAL, // 296
                subscType: 2,
                pId: key,
                pType: PROFILE_TYPES.MEDIA_PAGE,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        }

        // function unFollowMediaPage(key) {
        //     var payload = {
        //         actn: PORTAL_OPTIONS.ACTION_SUBSCRIBE_UNSUBSCRIBE_NEWSPORTAL, // 296
        //         subscType: 1,
        //         pId: key,
        //         pType: PROFILE_TYPES.MEDIA_PAGE,
        //     };

        //     return $$connector.request(payload, REQTYPE.UPDATE);
        // }

        function fetchSliderImage(param) {
            var payload = {
                actn: OTYPES.ACTION_GET_MEDIA_SLIDER_IMG, // 1005
                mdaT: param.mdaT,
            };
            return $$connector.pull(payload, REQTYPE.REQUEST, true);
        }
        function getTaggedMedia(param) {
            var payload = {
                actn: OTYPES.ACTION_GET_TAGGED_MEDIA_SONGS, // 279
                htid: param,
                pvtid: 0,
                scl: 2,
            };
            return $$connector.send(payload, REQTYPE.REQUEST);
        }
        function getSearchTrends() {
            var payload = {
                actn: 281,
            };
            return $$connector.pull(payload, REQTYPE.REQUEST);
        }
        function increaseViewCount(cntntId, nfId) {
                // THERE IS AN UPDATE EVENT NOT HANDLED WITH ACTION 472
            var payload = {
                actn: OTYPES.ACTION_INCREASE_MEDIA_CONTENT_VIEW_COUNT, // 272
                cntntId: cntntId,
            };
            if (nfId) {
                payload.nfId = nfId;
            }
            return $$connector.request(payload, REQTYPE.UPDATE);
        }
        function deleteAlbumContent(cntntId) {
            var payload = {
                actn: OTYPES.ACTION_DELETE_MEDIA_CONTENT, // 260
                cntntId: cntntId,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        }
        function updateMediaContent(obj) {
            var payload = {
                actn: OTYPES.ACTION_UPDATE_MEDIA_CONTENT, // 259
                mdaCntntDTO: obj.mdaCntntDTO, // {id,strmURL,albId,drtn,thmbURL,artst,ttl,utId}
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        }
        function addMediaToAlbum(obj) {
            var payload = {
                actn: OTYPES.ACTION_ADD_MEDIA_CONTENT, // 258
                albId: obj.albId,
                mdaLst: obj.mdaLst, // [{strmURL, drtn, tih, tiw, thmbURL, artst, ttl}]
                mdaT: obj.mdaT,
            };

            return $$connector.request(payload, REQTYPE.UPDATE);
        }
        function deleteAlbum(albId) {
            var payload = {
                actn: OTYPES.ACTION_DELETE_MEDIA_ALBUM, // 255
                albId: albId,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        }
        function updateMediaAlbum(obj) {
            var payload = {
                actn: OTYPES.ACTION_UPDATE_MEDIA_ALBUM, // 254
                albId: obj.albId,
                imgURL: obj.imgURL,
                mdaT: obj.mdaT,
                albn: obj.albn.utf8Encode(),
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        }
        function addMediaAlbum(obj) {
            var payload = {
                actn: OTYPES.ACTION_ADD_MEDIA_ALBUM, // 253
                imgURL: obj.imgURL || '',
                albn: obj.albn.utf8Encode(),
                mdaT: obj.mdaT,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        }
        function fetchContent(param) {
            var payload = {
                actn: OTYPES.ACTION_SPECIFIC_MEDIA_RESULT, // 278
                schPm: param.sk.utf8Encode(),
                sugt: param.sugt,
                pvtid: param.pvtid || 0,
                scl: param.scl || 1,
            };
            return $$connector.send(payload, REQTYPE.REQUEST);
        }
        function fetchSearchResult(param) {
            var payload = {
                actn: OTYPES.ACTION_MEDIA_SEARCH_RESULT,
                schPm: param.utf8Encode(),
            };
                // return $$connector.send(payload,REQTYPE.REQUEST);
            return $$connector.pull(payload, REQTYPE.REQUEST);
        }
        function fetchHashtagSuggestion(schPm) {
            return $$connector.pull({
                actn: OTYPES.ACTION_GET_HASHTAG_SUGGESTION,
                schPm: schPm.utf8Encode(),
            }, REQTYPE.REQUEST, true);
        }
        function fetchMediaAlbums(obj) {
            var payload = {
                actn: OTYPES.ACTION_MEDIA_ALBUM_LIST, // 256
                mdaT: obj.mdaT || 1,
                utId: obj.utId, // optional. maybe without utid just own media album list fetch
            };
            $$connector.send(payload, REQTYPE.REQUEST, true);
        }
        function fetchTrendingFeeds() {
            var payload = {
                actn: OPERATION_TYPES.SYSTEM.TYPE_MEDIAS_TRENDING_FEED, // 308,
                lmt: 10,
                st: 0,
                scl: 2,
                mtf: 0,
            };
            return $$connector.pull(payload, REQTYPE.REQUEST, true);
        }
        function getShortDetails(pid) {
            var payload = {
                actn: OPERATION_TYPES.SYSTEM.PROFILE.TYPE_ACTION_GET_USER_DETAILS, // 204
                pId: pid,
                pType: PROFILE_TYPES.MEDIA_PAGE,
            };

            return $$connector.request(payload, REQTYPE.REQUEST, true);
        }

        function followMediaPage(key) {
            var payload = {
                actn: OPERATION_TYPES.SYSTEM.PORTAL.ACTION_SUBSCRIBE_UNSUBSCRIBE_NEWSPORTAL, // 296
                subscType: 2,
                pId: key,
                pType: PROFILE_TYPES.MEDIA_PAGE,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        }

        function unFollowMediaPage(key) {
            var payload = {
                actn: OPERATION_TYPES.SYSTEM.PORTAL.ACTION_SUBSCRIBE_UNSUBSCRIBE_NEWSPORTAL, // 296
                subscType: 1,
                pId: key,
                pType: PROFILE_TYPES.MEDIA_PAGE,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        }
    }

