/**
 * © Ipvision
 */


    angular
        .module('ringid.sticker')
        .factory('StickerCategoryModel', StickerCategoryModel);


    StickerCategoryModel.$inject = ['settings'];
    function StickerCategoryModel(settings){
        return {
            keyString : 'sCtId',
            getKeyString : function(){
                return StickerCategoryModel.keyString;
            },
            create : function(apiObject) {



                var factoryObject = {
                    sCtId: 0,
                    sctName: "",
                    sClId: 0,
                    cgBnrImg: "",
                    rnk: 1,
                    dtlImg: "",
                    thmColor: "",
                    txtColor: "",
                    cgNw: 0,
                    icn: "",
                    prz: 0,
                    free: 0,
                    dcpn: ""
                };

                var collectionObjectAdaptor = function (apiObject) {
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

                    getCategoryId: function () {
                        return factoryObject.sCtId;
                    },

                    setCategoryId: function (sCategoryId) {
                        factoryObject.sCtId = sCategoryId;
                    },

                    getCollectionId: function(){
                        return factoryObject.sClId;
                    },

                    setCollectionId : function(collectionId){
                      factoryObject.sClId = collectionId;
                    },

                    getKey: function () {
                        return this.getCategoryId()
                    },

                    setKey: function (sCategoryId) {
                        this.setCategoryId(sCategoryId);
                    },

                    getName: function () {
                        return factoryObject.sctName
                    },

                    setName: function (sCategoryName) {
                        factoryObject.sctName = sCategoryName;
                    },

                    getTextColor: function () {
                        return factoryObject.txtColor;
                    },

                    setTextColor: function (textColor) {
                        factoryObject.txtColor = textColor;
                    },

                    getBannerImage: function () {
                        return factoryObject.bnrImg;
                    },

                    setBannerImage: function (bannerImage) {
                        factoryObject.cgBnrImg = bannerImage;
                    },

                    getRank: function () {
                        return factoryObject.rnk;
                    },

                    setRank: function (rank) {
                        factoryObject.rnk = rank;
                    },

                    getDetailImage: function () {
                        return factoryObject.dtlImg;
                    },

                    getDetailImageUrl : function(){
                        var url = settings.stickerBase + this.getCollectionId() + '/' +  this.getCategoryId() + '/' + this.getDetailImage();
                        return url;
                    },

                    setDetailImage: function (detailImage) {
                        factoryObject.dtlImg = detailImage;
                    },

                    getNewCategory: function () {
                        return factoryObject.cgNw;
                    },

                    setNewCategory: function (newCategory) {
                        factoryObject.cgNw = newCategory;
                    },

                    getIconImage: function () {
                        return factoryObject.icn;
                    },
                    setIconImage: function (iconImage) {
                        factoryObject.icn = iconImage;
                    },

                    getIconImageUrl : function(){
                        var url = settings.stickerBase + this.getCollectionId() + '/' +  this.getCategoryId() + '/' + this.getIconImage();
                        return url;
                    },

                    getCaptionImageUrl :function(isHover){
                        var url = settings.stickerBase + this.getCollectionId() + '/' +  this.getCategoryId() + '/';
                        if(!!isHover){
                            return url + 'ca.png';
                        }else{
                            return url + 'c.png';
                        }
                    },

                    getPrice: function () {
                        return factoryObject.prz;
                    },
                    setPrice: function (price) {
                        factoryObject.prz = price;
                    },

                    isFree: function () {
                        return factoryObject.free;
                    },

                    setIsFree: function (isFree) {
                        factoryObject.free = isFree;
                    },

                    getDescription: function () {
                        return factoryObject.dcpn;
                    },

                    setDescription: function (description) {
                        factoryObject.dcpn = description;
                    },

                    getThumbColor: function () {
                        return factoryObject.thmColor;
                    },

                    setThumbColor: function (thumbColor) {
                        factoryObject.thmColor = thumbColor;
                    }
                }

            }



        }


    }


