


    angular
        .module('ringid.shared')
        .factory('$$imageMap', $$imageMap);

    $$imageMap.$inject = ['settings', '$$stackedMap', 'userFactory', 'Utils'];
    function $$imageMap (settings, $$stackedMap, userFactory, Utils) {
        var image_defaults = {
                    albId: "",
                    albn: "",
                    cptn: "",
                    nfId : 0,
                    ic: 0,
                    ih: 0,
                    il: 0,
                    imT: 0,
                    imgId: 0,
                    iurl: "",
                    iw: 0,
                    nc: 0,
                    nl: 0,
                    tm: 0,
                    user: null
                };
        function RingImage(image,user){
            var that = this;
            image = image || {};
            if(user){
                that._u = user;
            }
            that.updateImage(image);

             Object.defineProperty(that, 'ddControl', {
                                  enumerable: false,
                                  configurable: false,
                                  writable: false,
                                  value: {
                                        key: that.image.imgId,
                                        showReportButton : function(){
                                            return !that._u.isCurrentUser();
                                        },
                                        getSpamId : function(){
                                            return that.getKey();
                                        },
                                        getSpamType : function(){
                                            return "image";
                                        }
                                    }
                                });

        }

        RingImage.prototype = {
                    updateImage: function(image,user) {
                        if(this.image){
                            angular.extend(this.image,image);
                        }else{
                            this.image = angular.extend({},image_defaults,image);
                        }

                        image = null;
                        this.key = 'im'+this.image.imgId;
                        if(this.image.tm){
                            this._time = Utils.verbalDate(this.image.tm);
                        }else{
                            this._time = {};// preventing from throwing error
                        }
                        if (!this._u && this.image.hasOwnProperty('uId')) {
                            this._u = userFactory.create({
                                uId: this.image.uId,
                                fn: this.image.fn || ''
                            });
                        }
                    },
                    user: function() {
                        return this._u;
                    },
                    src: function (size) {
                        if (size === 'iurl') {
                            return this.image.iurl;
                        }

                        var position = this.image.iurl.lastIndexOf('/') + 1;
                        var progressive = /\/uploaded\//.test(this.image.iurl) ? '': 'p';
                        if(size !== undefined){
                            return [settings.imBase, this.image.iurl.slice(0, position), progressive , size,  this.image.iurl.slice(position)].join('');
                            //return [settings.imBase, image.iurl.slice(0, position), size,  image.iurl.slice(position)].join('');
                        } else {
                            return [settings.imBase, this.image.iurl.slice(0, position), progressive,  this.image.iurl.slice(position)].join('');
                            //return [settings.imBase, image.iurl.slice(0, position), image.iurl.slice(position)].join('');
                        }
                    },
                    getByProperty : function(property_name,returndefault){
                        returndefault = returndefault || false;
                        return this.image.hasOwnProperty(property_name)?user[property_name]:returndefault;
                    },

                    sortBy : function(){
                        return this.image.imgId;
                    },
                    getIh: function() {
                        return this.image.ih;
                    },
                    getIw: function() {
                        return this.image.iw;
                    },
                    sortByTime : function(){
                        return this.image.tm;
                    },
                    getAlbumName : function(){
                        return this.image.albn;
                    },
                    getAlbumId: function() {
                        return this.image.albId;
                    },
                    getCaption : function(){
                        return this.image.cptn;
                    },
                    getKey: function () {
                        return this.image.imgId;
                    },
                    getMapKey : function(){
                        return this.key;
                    },
                    getFeedKey: function(){
                        return this.image.nfId;
                    },
                    setFeedKey:function(key){
                        this.image.nfId = key;
                    },
                    time : function(){
                        return this._time;
                    },
                    like : function(dolike,totalLike){
                        if(!dolike)return this.image.il;

                        this.image.il = this.image.il ^ 1;
                        if(totalLike){
                            this.image.nl  = totalLike;
                        }else{
                            this.image.nl = (this.image.il == 0) ? this.image.nl-1 : this.image.nl+1;
                        }
                        return this.image.il;
                    },
                    getLikes : function(){
                        return this.image.nl;//todo remove the getLikes from templates use getTotalLikes
                    },
                    getTotalLikes : function(){
                        return this.image.nl;
                    },
                    getImageType : function(){
                        return this.image.imT;
                    },
                    // getWhoLikes : function() {
                    //     return image.whoLikes.all();
                    // },
                    incomingLike: function (type) {
                        return (type && ++this.image.nl) || --this.image.nl;
                    },
                    // incomingWhoLikes: function (userJson) {

                    //         var user = userFactory.create(userJson);
                    //         image.whoLikes.save(user.getKey(), user);


                    // },

                    offset : function(){
                        return {width:this.image.iw,height:this.image.ih};
                    },
                    selfComment: function() {
                        return this.image.ic;
                    },
                    getTotalComment: function() {
                        return this.image.nc;
                    },
                    setTotalComment: function(total,ic) {
                        this.image.nc = total;
                        if(angular.isDefined(ic)){
                                this.image.ic = ic;
                            }
                    },
                    getUrl : function(){
                        /** Not an ideal place, will be refactored */
                        return '/image/' + this.getKey();
                    },
                    getRelativeHeight : function(width){
                        //if(width > image.iw) return image.ih;
                        try {
                            return (this.image.ih/this.image.iw) * width;
                        }catch(e){
                            return this.image.ih;
                        }

                    }
                };

        return function (obj, user) {
                return new RingImage(obj,user);
            }

    }



