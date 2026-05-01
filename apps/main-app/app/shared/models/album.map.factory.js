/*
 * Ipvision
 */


    angular
        .module('ringid.shared')
        .factory('$$albumMap', $$albumMap);


        $$albumMap.$inject = [ 'settings', '$$imageMap', '$$stackedMap', 'userFactory', 'profileHttpService'];
        function $$albumMap( settings, $$imageMap, $$stackedMap, userFactory, profileHttpService) { // jshint ignore:line

            var album_defaults = {
                        albId: '',
                        timg: '',
                        imageList: [],
                        ut: 0
                    };
            function RingAlbum(album, albumOwnerUid){
                var that = this;
                album = album|| {};
                that.updateAlbum(album, albumOwnerUid);
            }

            function pushImages(ringAlbum, imageList) {
                //if(ringAlbum.imageList && ringAlbum.imageList.length > 0) {
                    var image, imageObj;


                    for( var i = 0, lt = imageList.length; i < lt; i++) {
                        imageObj =  angular.extend({}, imageList[i], {albId: ringAlbum.album.albId});
                        image = $$imageMap(imageObj, ringAlbum._u);
                        ringAlbum.album.images.save(image.getKey(), image);

                        if (ringAlbum.album.ut < imageList[i].tm) {
                            ringAlbum.album.ut = imageList[i].tm;
                        }
                    }
                //}

            }

            RingAlbum.prototype = {
                updateAlbum: function(album, albumOwnerUid) {
                    if(this.album){
                        angular.extend(this.album, album);
                    }else{
                        this.album = angular.extend({}, album_defaults, album);
                    }

                    // set user
                    if (albumOwnerUid) {
                        this._u = userFactory.create({uId: albumOwnerUid});
                    }
                    // set album images if any
                    this.album.images =  $$stackedMap.createNew();
                    if (this.album.imageList && this.album.imageList.length > 0) {
                        pushImages(this, this.album.imageList);
                    }
                },
                pushImages: function(obj) {
                     pushImages(this, obj.imageList);
                },
                getKey: function() {
                    return this.album.albId;
                },
                removeImage: function(imageKey) {
                    if( this.album.images.remove(imageKey)) {
                        // do other stuff
                        this.album.tn = this.album.tn - 1; // decrease total no of image
                        // remove from cover or profile image if necessary
                        if (this.album.albId === 'profileimages' && imageKey === this._u.getProfileImageId()) {
                            // remove profile image
                            this._u.resetAvatar();
                        } else if (this.album.albId === 'coverimages' && imageKey === this._u.getCoverImageId()) {
                            // remove cover image
                            this._u.resetCover();
                        }
                    }

                },
                getName: function() {
                    return this.album.albn;
                },
                getCoverImage: function(size) {
                    var position = this.album.cvImg.lastIndexOf('/') + 1;
                    size = 'p' + size;
                    return [settings.imBase, this.album.cvImg.slice(0, position), size,  this.album.cvImg.slice(position)].join('');
                    //return this.images.top().src(size);
                },
                getTotalImageCount: function() {
                    return this.album.tn;
                },
                getUpdateTime: function() {
                    return this.album.tm;
                },
                getImages: function() {
                    return this.album.images;
                }
            };

            return function(obj, albumOwnerUid) {
                return new RingAlbum(obj, albumOwnerUid);
            };
        }
