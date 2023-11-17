/*
 * © Ipvision
 */


angular
    .module('ringid.sticker')
    .service('stickerHttpService', stickerHttpService);

stickerHttpService.$inject = ['$ringhttp', '$$connector', 'settings', 'OPERATION_TYPES'];

function stickerHttpService($ringhttp, $$connector, settings, OPERATION_TYPES) {
    var STICKER_OPERATION_TYPES = OPERATION_TYPES.STICKER,
        SYSTEM_REQUEST_TYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE,
        self = this;

    self.go = go;

    function go(url, method, data) {
        return $ringhttp[method || 'get'](url, data || []);
    }

    self.getAll = getAll;

    function getAll() {
        var url = settings.stickerApi + 'all=1';
        return self.go(url);
    }

    self.getStickerCategoriesByCollectionId = getStickerCategoriesByCollectionId;

    function getStickerCategoriesByCollectionId(collectionId) {
        var url = settings.stickerApi + 'collectionId=' + collectionId;
        return self.go(url);
    }

    self.getStickersByCatId = getStickersByCatId;

    function getStickersByCatId(catId) {
        var url = settings.stickerApi + 'categoryId=' + catId;
        return self.go(url);
    }


    self.getMyStickers = getMyStickers;

    function getMyStickers() {
        var payload = {
            actn: STICKER_OPERATION_TYPES.GET_MY_STICKER,
        };
        return $$connector.request(payload, SYSTEM_REQUEST_TYPE.REQUEST);
    }

    self.addSticker = addSticker;

    function addSticker(obj) {
        var payload = {
            actn: STICKER_OPERATION_TYPES.ADD_REMOVE_STICKER,
            catId: obj.catId,
            jt: STICKER_OPERATION_TYPES.ADD_JT_VALUE,
        };

        return $$connector.request(payload, SYSTEM_REQUEST_TYPE.UPDATE);
    }

    self.removeSticker = removeSticker;

    function removeSticker(obj) {
        var payload = {
            actn: STICKER_OPERATION_TYPES.ADD_REMOVE_STICKER,
            catId: obj.catId,
            jt: STICKER_OPERATION_TYPES.REMOVE_JT_VALUE,
        };

        return $$connector.request(payload, SYSTEM_REQUEST_TYPE.UPDATE);
    }
}
