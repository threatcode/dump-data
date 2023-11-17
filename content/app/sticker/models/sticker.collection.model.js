/**
 * © Ipvision
 */


    angular
        .module('ringid.sticker')
        .factory('StickerCollectionModel', StickerCollectionModel);


    StickerCollectionModel.$inject = ['settings', '$$stackedMap'];
    function StickerCollectionModel(settings, $$stackedMap){
        return {

            create : function(apiObject) {
                var factoryObject = {
                    sClId : 0,
                    name : '',
                    txtColor : '',
                    bnrImg : "",
                    thmColor : "",
                    categories :  []
                };

                var collectionObjectAdaptor = function(apiObject){
                    /*
                     *
                     * @Adaptor
                     *
                     * Converts Collection Object Obtained Via API Methods to Factory Defined Attribute Set
                     *
                     * API PARAMS :
                     *
                     * LIST RESPONSE :
                     *
                     * API OBJECT 2 FACTORY OBJECT SIGNATURE :
                     *
                     * 1. sClId : sClId
                     * 2. name: name
                     * 3. txtColor : txtColor
                     * 4. bnrImg : bnrImg,
                     * 5. thmColor : thmColor
                     *
                     * */

                     var newfactoryObject = angular.extend({}, factoryObject, apiObject);

                     return newfactoryObject

                };

                if (angular.isObject(apiObject)) {
                    factoryObject = collectionObjectAdaptor(apiObject);
                }

                return {
                    getId : function(){
                        return factoryObject.sClId;
                    },

                    setId : function(sClId){
                        factoryObject.sClId = sClId;
                    },

                    getKey : function(){
                        return this.getId();
                    },

                    setKey : function(key){
                        this.setId(key);
                    },

                    getName : function(){
                        return factoryObject.name
                    },

                    setName : function(name){
                        factoryObject.name = name;
                    },

                    getTextColor : function(){
                        return factoryObject.txtColor;
                    },

                    setTextColor : function(textColor){
                        factoryObject.txtColor = textColor;
                    },

                    getBannerImage : function(){
                        return factoryObject.bnrImg;
                    },

                    setBannerImage : function(bannerImage){
                        factoryObject.bnrImg =  bannerImage;
                    },

                    getBannerImageUrl : function(){
                        var url = settings.stickerBase + this.getId() + '/' + this.getBannerImage();
                        return url;
                    },

                    getThumbColor : function(){
                        return factoryObject.thmColor;
                    },

                    setThumbColor : function(thumbColor){
                        factoryObject.thmColor = thumbColor;
                    },

                    addCategories : function(aCategoryId){
                        factoryObject.categories.push(aCategoryId);
                    },

                    removeCategories : function(catId){
                        factoryObject.categories.splice(catId, 1);
                    },

                    getCategories : function(){
                        return factoryObject.categories;
                    }
                }
            }

        }

    }


