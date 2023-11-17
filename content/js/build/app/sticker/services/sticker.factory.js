 /**
 * © Ipvision
 */


    angular
        .module('ringid.sticker')
        .factory('StickerFactory', StickerFactory)
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

                //
                //
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

    StickerFactory.$inject = ['$$stackedMap', '$$stickerMap', 'stickerHttpService', 'StickerEmoticonFactory', 'StickerHelper',
        'StickerCategoryModel', 'StickerCollectionModel',  'STICKER_IMAGE_TYPE', '$$q', 'Storage'];
    function StickerFactory($$stackedMap, $$stickerMap, stickerHttpService, StickerEmoticonFactory, StickerHelper, // jshint ignore:line
                            StickerCategoryModel, StickerCollectionModel,  STICKER_IMAGE_TYPE, $q, Storage) {

        var localStorageKey = 'stickerData',
            myStickerLocalStorageKey = 'myStickers',
            /* Cashes All FactoryStickerObj By CategoryId */
            allStickerIdMap = {},
            /* Cashes sticker details by catIds */
            stickersByCatIdMap = {},
            /* Stores the sticker categories by group */
            stickerCategories = {
                free : [],
                new : [],
                top : []
            },
            /* Stores sticker categories by collection id */
            stickerCollections = {},
            /* Stores My Sticker CatIds */
            myStickerList = {},
            /* $stickerMap holds the Emoticon and Sticker*/
            /* All Emoticon $stickerMap */
            allEmoticon = StickerEmoticonFactory.getAllEmoticons(),
            emoticonMap = $$stickerMap.create(allEmoticon,true),
            /* All Sticker $stickerMap */
            //var allStickersMap = $$stickerMap.create(allEmoticon,true);
            myStickerRefreshed = false;


        var initStickersByCatId = function(catId){
            var deferred = $q.defer();

            if(!stickersByCatIdMap[catId]){
                stickerHttpService.getStickersByCatId(catId)
                    .success(function(data){
                        if(!!data && data.sucs  === true){
                            StickerHelper.parseCategoryStickerData(data, stickersByCatIdMap, allStickerIdMap);
                            deferred.resolve(data);

                        }else{
                        }

                    }).error(function(response){
                        deferred.reject(response);
                    });
            }

            return deferred.promise;
        };

        function initCollectionCategories(collectionFactoryObject){

            /* Parses Collection Categories To PRE FETCH LIMIT
             *
             * Does API Request To Get Categories under a collections.
             *
             * */
            // todo add limit on this call if there are too many collections, paginate support

            try{

                var collectionId = collectionFactoryObject.getKey();

                stickerHttpService.getStickerCategoriesByCollectionId(collectionId)
                    .success(function(data){
                        if(!!data && data.sucs === true && !!data.categoriesList){

                            var categoryList = data.categoriesList;

                            if(angular.isArray(categoryList)){
                                angular.forEach(categoryList, function(aCategory){

                                    var keyString = aCategory[StickerCategoryModel.getKeyString()];
                                    var stickerCategoryFactoryObject = allStickerIdMap[keyString];

                                    if(!stickerCategoryFactoryObject){
                                        stickerCategoryFactoryObject = StickerCategoryModel.create(aCategory);
                                        allStickerIdMap[stickerCategoryFactoryObject.getKey()] = stickerCategoryFactoryObject;
                                    }

                                    collectionFactoryObject.addCategories(stickerCategoryFactoryObject.getKey());

                                });
                            }

                        }else{
                        }
                    }).error(function(response){
                    });

            }catch(e){
            }

        }

        function initStickerCollectionAndCategories(dataList){

            /* Parse Free Categories */
            try{
                angular.forEach(dataList.freeCategoriesList, function(aCategory){

                    var aStickerCategoryFactoryObject = StickerCategoryModel.create(aCategory);
                    allStickerIdMap[aStickerCategoryFactoryObject.getKey()] = aStickerCategoryFactoryObject;
                    stickerCategories.free.push(aStickerCategoryFactoryObject.getKey());

                });
            }catch(e){
            }

            /* Parse Top Categories */
            try{
                angular.forEach(dataList.topCategoriesList, function(aCategory){

                    var aStickerCategoryFactoryObject = StickerCategoryModel.create(aCategory);
                    allStickerIdMap[aStickerCategoryFactoryObject.getKey()] = aStickerCategoryFactoryObject;
                    stickerCategories.top.push(aStickerCategoryFactoryObject.getKey());

                });
            }catch(e){
            }

            /* Parse New Categories */
            try{
                angular.forEach(dataList.stNewCategoriesList, function(aCategory){

                    var aStickerCategoryFactoryObject = StickerCategoryModel.create(aCategory);
                    allStickerIdMap[aStickerCategoryFactoryObject.getKey()] = aStickerCategoryFactoryObject;
                    stickerCategories.new.push(aStickerCategoryFactoryObject.getKey());

                });
            }catch(e){
            }

            /* Parse Collections */
            try{
                angular.forEach(dataList.stickerCollectionsList, function(aCollection){

                    var aStickerCollectionFactoryObject = StickerCollectionModel.create(aCollection);

                    stickerCollections[aStickerCollectionFactoryObject.getKey()] = aStickerCollectionFactoryObject;

                    initCollectionCategories(aStickerCollectionFactoryObject);

                });
            }catch(e){
            }

        }

        function fetchAllStickerData(){
            stickerHttpService.getAll().
                success(function(data){
                    try{
                        if(!!data && data.sucs === true){
                            saveStickerData(data);
                            initStickerCollectionAndCategories(data);
                            initMyStickers();
                        }
                    }catch(e){
                    }

                }).error(function(response){
                });
        }

        function getStickerData(){
            try{
                return Storage.getData(localStorageKey);
            }catch(e){
                return false;
            }
        }

        function saveStickerData(data){
            Storage.setData(localStorageKey, data);
        }

        function saveMyStickers(){
            Storage.setData(myStickerLocalStorageKey, myStickerList);
        }

        function initMyStickers(){
            myStickerList = Storage.getData(myStickerLocalStorageKey);
            if(!myStickerRefreshed || !myStickerList) {
                myStickerList = {};
                stickerHttpService.getMyStickers().then(function(response){
                    if(response.sucs === true){
                        angular.forEach(response.catIds, function(aCatId){
                            myStickerList[aCatId] = 1;
                            if(!!stickersByCatIdMap[aCatId]) {
                                stickersByCatIdMap[aCatId].setInstalled(true);
                            }
                        });
                        saveMyStickers();
                    }
                });

            }
        }

        function initStickerData(allData){
            try{
                initStickerCollectionAndCategories(allData);
            }catch(e){
            }
        }

        function getStickerObjectById(stickerId) {
            try{
                return allStickerIdMap[stickerId];
            }catch(e){
                return {};
            }
        }

        return {

            initStickerData : function(refresh){
                if(refresh === true){
                    fetchAllStickerData();
                }else{
                    var localData = getStickerData();
                    if(!angular.isObject(localData)){
                        fetchAllStickerData();
                    }else{
                        initStickerData(localData);
                        initMyStickers();
                    }
                }

            },
            getNoOfMyStickers: function () {
                return myStickerList ? Object.keys(myStickerList).length : 0;
            },

            getStickerCategories : function(type){
              return type ? stickerCategories[type] : stickerCategories;
            },

            getStickerCollections : function(){
              return stickerCollections;
            },

            getMyStickerCatIds: function () {
                return myStickerList ? Object.keys(myStickerList) : [];
            },

            getStickerMapByCatId :function(catId){
                var deferred = $q.defer();

                if(!!stickersByCatIdMap[catId]){
                    deferred.resolve(stickersByCatIdMap[catId]);

                }else{
                    initStickersByCatId(catId).then(function(){
                        deferred.resolve(stickersByCatIdMap[catId]);

                    }, function(response){
                        deferred.reject(response);
                    });
                }
                return deferred.promise;

            },
            isDownloaded : function(stickerCatId){
                return !!myStickerList[stickerCatId];
            },

            getStickerCategoryObject: function (key) {
                return getStickerObjectById(key);
            },

            getEmoticonMap: function () {
                return emoticonMap;
            },

            getMyStickers : function(){
                return stickerHttpService.getMyStickers();
            },

            addMySticker: function (stickerCatId) {
                try{
                    myStickerList[stickerCatId] = 1;
                    saveMyStickers();

                    if(!!stickersByCatIdMap[stickerCatId]) {
                        stickersByCatIdMap[stickerCatId].setInstalled(true);
                    }

                }catch(e){
                }

                stickerHttpService.addSticker({catId: stickerCatId}).then(function (data) {
                    if(data.sucs !== true){
                        myStickerList[stickerCatId] = 0;
                        stickersByCatIdMap[stickerCatId].setInstalled(false);
                    }
                },function (errData) {

                });
            },
            removeMySticker: function (stickerCatId) {
                try{
                    delete myStickerList[stickerCatId];
                    saveMyStickers();

                    if(!!stickersByCatIdMap[stickerCatId]) {
                        stickersByCatIdMap[stickerCatId].setInstalled(false);
                    }

                }catch(e){
                }

                stickerHttpService.removeSticker({catId: stickerCatId}).then(function (data) {
                    if(data.sucs !== true){
                        myStickerList[stickerCatId] = 1;
                        stickersByCatIdMap[stickerCatId].setInstalled(true);
                    }
                },function (errData) {
                });

            }

        };
    }


