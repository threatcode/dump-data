/*
 * © Ipvision
 */


    angular
        .module('ringid.sticker')
        .service('stickerHttpService', stickerHttpService);

    stickerHttpService.$inject = ['$ringhttp', '$$connector', 'settings', 'OPERATION_TYPES'];
    function stickerHttpService($ringhttp, $$connector, settings, OPERATION_TYPES) {
        var STICKER_OPERATION_TYPES = OPERATION_TYPES.STICKER;
        var	SYSTEM_REQUEST_TYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE;
        var self = this;

        self.go = function (url, method, data ) {
            method = method || 'get';
            data = data || [];
            return $ringhttp[method](url, data);
        };

        self.getAll = function(){
            var url = settings.stickerApi + 'all=1';
            return self.go(url);
        };

        self.getStickerCategoriesByCollectionId = function (collectionId) {
            var url = settings.stickerApi + 'collectionId=' + collectionId;
            return self.go(url);
        };

        self.getStickersByCatId = function (catId) {
            var url = settings.stickerApi + 'categoryId=' + catId;
            return self.go(url);
        };


        self.getMyStickers = function () {
            var payload = {
                actn: STICKER_OPERATION_TYPES.GET_MY_STICKER
            };
            return $$connector.request(payload, SYSTEM_REQUEST_TYPE.REQUEST);

        };

        self.addSticker = function (obj) {
            var payload = {
                actn: STICKER_OPERATION_TYPES.ADD_REMOVE_STICKER,
                catId: obj.catId,
                jt : STICKER_OPERATION_TYPES.ADD_JT_VALUE
            };

            return $$connector.request(payload, SYSTEM_REQUEST_TYPE.UPDATE);
        };

        self.removeSticker = function (obj) {
            var payload = {
                actn: STICKER_OPERATION_TYPES.ADD_REMOVE_STICKER,
                catId: obj.catId,
                jt : STICKER_OPERATION_TYPES.REMOVE_JT_VALUE
            };

            return $$connector.request(payload, SYSTEM_REQUEST_TYPE.UPDATE);
        };



    }
