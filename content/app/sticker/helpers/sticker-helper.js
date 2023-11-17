
//Helpers.js

/**
 * © Ipvision
 */


    angular
        .module('ringid.sticker')
        .factory('StickerHelper', StickerHelper);


    StickerHelper.$inject = ['STICKER_IMAGE_TYPE', '$$stickerMap'];
    function StickerHelper(STICKER_IMAGE_TYPE, $$stickerMap) {

        var parseCategoryStickerData = function(data, stickersByCatIdMap, allStickerIdMap){
            /*
            * Parses Sticker Category Responses and returns a $stickerMap
            * $stickerMap Signature
            *
            * {
            *   collectionId : INT
            *   imageListMap : $stackedMap
            *   type : INT
            *   installed : BOOLEAN
            * }
            *
            * $stackedMap Signature
            * {
            *   name: STRING
            *   symbol : STRING
            *   type : ENUM (STICKER_IMAGE_TYPE)
            *   ID : INT
            * }
            *
            * */

            var allStickers = { type : STICKER_IMAGE_TYPE.STICKER, imageList: [] };
            var stickerImages = data.imagesList;

            if(angular.isArray(stickerImages)){


                var catId = stickerImages[0].sCtId;
                var stickerFactoryObj = allStickerIdMap[catId];

                allStickers['collectionId'] = stickerFactoryObj.getCollectionId();
                allStickers['categoryId'] = catId;

                angular.forEach(stickerImages, function(aStickerObj){

                    allStickers['imageList'].push({
                        name : aStickerObj.imUrl,
                        type: STICKER_IMAGE_TYPE.STICKER,
                        id : aStickerObj.imId
                    });

                    stickersByCatIdMap[aStickerObj.sCtId] =  $$stickerMap.create(allStickers);
                });

            }

            return stickersByCatIdMap;

        };

        return {
            parseCategoryStickerData : parseCategoryStickerData
        }

    }


