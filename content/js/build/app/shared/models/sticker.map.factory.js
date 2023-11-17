 /**
 * © Ipvision
 */


    angular
        .module('ringid.shared')
        .factory('$$stickerMap', $$stickerMap)
        .factory('$$stickerImageMap', $$stickerImageMap);

    $$stickerImageMap.$inject = ['settings', 'STICKER_IMAGE_TYPE'];
    function $$stickerImageMap(settings, STICKER_IMAGE_TYPE) { //jshint ignore:line

        return {
            create: function (ob, stickerType, stickerSrcBaseUrl) {
                //var types = {e: 1, el: 2, s: 3}; //emoticon : 1, emoticonlarge : 2 ,sticker 3
                var image = {
                    id: ob.id || 0,
                    name: ob.name || '',
                    symbol: ob.symbol || ob.name,
                    type: ob.type || 0,
                    src: (stickerType === 1) ? settings.emoticonBase + ob.name : stickerSrcBaseUrl + ob.name,
                    isEmoticon: stickerType === STICKER_IMAGE_TYPE.EMOTICON,
                    isLargeEmoticon: stickerType === STICKER_IMAGE_TYPE.LARGE_EMOTICON,
                    isSticker: stickerType === STICKER_IMAGE_TYPE.STICKER
                };

                return {
                    getKey: function () {
                        return image.id;
                    },
                    src: function () {
                        return image.src;
                    },
                    symbol: function () {
                        return image.symbol;
                    },
                    getName: function () {
                        return image.name;
                    },
                    srcWithoutBase: function () {
                        return image.src.replace(settings.stickerBase,'');
                    },
                    isEmoticon: function () {
                        return image.isEmoticon;
                    },
                    isLargeEmoticon: function () {
                        return image.isLargeEmoticon;
                    },
                    isSticker: function () {
                        return image.isSticker;
                    }
                };
            }
        };
    }

    $$stickerMap.$inject = ['$$stackedMap', '$$stickerImageMap', 'settings'];
    function $$stickerMap($$stackedMap, $$stickerImageMap, settings) { //jshint ignore:line


        return {
            create: function (ob, installed) {
                //var stickerSrcBaseUrl = settings.stickerImageBase + ob.collectionId + '/' + ob.categoryId + '/';
                var stickerSrcBaseUrl = settings.stickerBase + ob.collectionId + '/' + ob.categoryId + '/';

                
                
                var image,
                    sticker = {
                        categoryId: ob.categoryId || 0,
                        collectionId: ob.collectionId || 0,
                        imageListMap: $$stackedMap.createNew(),
                        type: ob.type || 0,
                        isEmoticon: (ob.type === 1) ? true : false,
                        isLargeEmoticon: (ob.type === 2) ? true : false,
                        isSticker: (ob.type === 3) ? true : false,
                        regularUrl: (ob.type === 1) ? '/images/emoticon/c.png' :  + stickerSrcBaseUrl + 'c.png',
                        hoverUrl: (ob.type === 1) ? '/images/emoticon/ca.png' : stickerSrcBaseUrl + 'ca.png',
                        installed: installed || false
                    };

                // 
                for (var key=0;key<ob.imageList.length;key++) {
                    image = $$stickerImageMap.create(ob.imageList[key], sticker.type, stickerSrcBaseUrl);
                    sticker.imageListMap.add(image.getKey(), image);
                }

                return {
                    sortBy: function () {
                        return sticker.categoryId;
                    },
                    isInstalled: function () {
                        return sticker.installed;
                    },
                    setInstalled: function (isInstalled) {
                        sticker.installed = isInstalled;
                    },
                    isEmoticon: function () {
                        return sticker.isEmoticon;
                    },
                    isLargeEmoticon: function () {
                        return sticker.isLargeEmoticon;
                    },
                    isSticker: function () {
                        return sticker.isSticker;
                    },
                    getKey: function () {
                        return sticker.categoryId;
                    },
                    getImages: function () {
                        return sticker.imageListMap;
                    },
                    getType: function () {
                        return sticker.type;
                    },
                    link: function () {
                        return sticker.regularUrl;
                    },
                    hoverLink: function () {
                        return sticker.hoverUrl;
                    }
                };
            }
        };
    }


