/*
 * Ipvision
 */


    angular
        .module('ringid.shared')
        .factory('$$mediaMap', $$mediaMap);

    $$mediaMap.$inject = ['userFactory', 'Auth', '$$stackedMap', 'settings', 'APP_CONSTANTS', 'mediaHttpService', '$$q', 'Storage', 'Ringalert', 'Api'];
    function $$mediaMap (User, Auth, $$stackedMap, settings, APP_CONSTANTS, mediaHttpService, $q, Storage, Ringalert, Api) { //jshint ignore:line
        var AC = APP_CONSTANTS,
            media_defaults = {
                    ac: 0, // view count
                    albId: 0,
                    cc: 0,//count count
                    ic: 0,// i comment
                    il: 0,//i like
                    lc: 0,//like count
                    is : 0,// i share
                    ns : 0,//share count
                    // above are from notification for mdaT=2
                    nfId : 0,
                    albn:'',
                    artst: '',
                    cntntId: 0,
                    drtn: 0,
                    mdaT: 1,
                    strmURL: '',
                    thmbURL: '',
                    ttl: '',
                    tih: 0,
                    tiw: 0,
                    user: null,
                    viewtime:0,
                    utId:'',
                    autoplay:false,
                    gotDetails: false
                    //ilkd: 0, // current user liked
                   // likeUsers: $$stackedMap.createNew() // need additional api call to get this
                   // comments: $$stackedMap.createNew()

                };

                function RingMedia(obj,user){
                    var that = this;
                    that.updateMedia(obj);
                    that.setUser(obj,user);
                    obj = null;
                    Object.defineProperty(that, 'ddControl', {
                              enumerable: false,
                              configurable: false,
                              writable: false,
                              value: {
                                    key: that.media.key,
                                    showReportButton : function(){
                                        return !that._u.isCurrentUser();
                                    },
                                    showAddToAlbum : function(){
                                        return !that._u.isCurrentUser();
                                    },
                                    getSpamId : function(){
                                        return that.getKey();
                                    },
                                    getSpamType : function(){
                                        return "media";
                                    },
                                    getRingboxData : function(){
                                        return  function () {
                                                    return {
                                                        media: that
                                                    };
                                                };

                                    }
                                }
                            });



                }


                function updateRecentMedias(json) {
                    var t = new Date(), i, arrIndex = false;
                    var mediaObj = {
                        ac:json.mdaCntntDTO.ac,
                        albId:json.mdaCntntDTO.albId,
                        albn:json.mdaCntntDTO.albn,
                        artst:json.mdaCntntDTO.artst,
                        cntntId:json.mdaCntntDTO.cntntId,
                        mdaT:json.mdaCntntDTO.mdaT,
                        drtn:json.mdaCntntDTO.drtn,
                        strmURL:json.mdaCntntDTO.strmURL,
                        thmbURL:json.mdaCntntDTO.thmbURL,
                        ttl:json.mdaCntntDTO.ttl,
                        utId:json.utId,
                        viewtime: t.getTime()
                    };
                    var mediaRecent = Storage.getData('mediaRecent') || [];

                    // check if same media already exists
                    for (i = 0; i < mediaRecent.length; i++) {
                        if (mediaRecent[i].cntntId === json.mdaCntntDTO.cntntId) {
                            arrIndex = i;
                            break;
                        }
                    }

                    if( arrIndex ) {
                        mediaRecent[arrIndex] = mediaObj;
                    } else  {
                        // check if limit crossed
                        if (mediaRecent.length >= 6) {
                            mediaRecent.shift();
                        }

                        mediaRecent.push(mediaObj);
                    }

                    Storage.setData('mediaRecent',mediaRecent);

                }

                RingMedia.prototype = {
                      updateMedia : function(mediaObj, gotDetails) {
                            if (angular.isObject(mediaObj)) {
                                if(this.media){
                                    angular.extend(this.media, mediaObj);
                                }else{
                                    this.media =  angular.extend({},media_defaults, mediaObj);
                                }

                                this.media.gotDetails = !!gotDetails; // after fetchDetails call this should be true
                                this.media.key = this.media.cntntId || this.media.id;

                                // set cover image for media
                                //if (mediaObj.mdaT === AC.NEWS_FEED_MEDIA_TYPE_VIDEO && mediaObj.thmbURL  && mediaObj.thmbURL.length > 1) {
                                if (mediaObj.thmbURL  && mediaObj.thmbURL.length > 1) {
                                    this.media.poster = settings.mediaBase + mediaObj.thmbURL;
                                    // new api provides video thumb image from server not working from cloud api doc
                                    //media.poster = settings.streamServer + 'media/' + mediaObj.strmURL.substr(0, mediaObj.strmURL.lastIndexOf('.')) + '.jpg';

                                    //media.tih = mediaObj.tih || 600;
                                    //media.tiw = mediaObj.tiw || 600;
                                    //var position = mediaObj.thmbURL.lastIndexOf('/') + 1;
                                        //media.feedThumb = [settings.imBase, mediaObj.thmbURL.slice(0, position), 'p', '600',  mediaObj.thmbURL.slice(position)].join('');
                                        //return [settings.imBase, image.iurl.slice(0, position), image.iurl.slice(position)].join('');

                                } else {
                                    this.media.poster = (this.media.mdaT === AC.NEWS_FEED_MEDIA_TYPE_AUDIO ) ? 'images/default_audio_image.jpg' : 'images/default_video_image.jpg';
                                    this.media.feedThumb =  this.media.poster;
                                    this.media.tih = 330;
                                    this.media.tiw = 600;
                                }



                            } else {
                                
                                
                            }

                            mediaObj = null;
                        },
                    setUser : function(_d,user){
                        if (angular.isDefined(user)) {
                            this._u = user;
                        } else {
                            if(_d.utId){
                                this._u = User.getByUtId(_d.utId);
                            }else if(_d.uId){
                                this._u =  User.getUser(_d.uId);
                            }else{
                                this._u = false;
                            }
                            if(!this._u){
                                var uOb = {};
                                    if(_d.uId){
                                        uOb.uId = _d.uId;
                                    }
                                    if(_d.utId){
                                        uOb.utId = _d.utId;
                                    }
                                    if(_d.fn){
                                        uOb.fn = _d.fn;
                                    }
                                    if(_d.prIm){
                                        uOb.prIm = _d.prIm;
                                    }
                                this._u = User.create(uOb);
                            }
                        }
                    },
                    sortBy: function() {
                        return this.media.viewtime;
                    },
                    getMediaUtId:function () {
                        return this.media.utId;
                    },
                    getAlbumId: function() {
                        return this.media.albId;
                    },
                    getAlbumName: function() {
                        return this.media.albn;
                    },
                    getArtistName: function() {
                        return this.media.artst;
                    },
                    getKey: function() {
                        return this.media.key;
                    },
                    getFeedKey : function(){
                        return this.media.nfId;
                    },
                    setFeedKey : function(nfId){
                        this.media.nfId = nfId;
                        return this.media.nfId;
                    },
                    isAudio : function() {
                        return this.media.mdaT === AC.NEWS_FEED_MEDIA_TYPE_AUDIO;
                    },
                    isVideo : function() {
                       return this.media.mdaT === AC.NEWS_FEED_MEDIA_TYPE_VIDEO;
                    },
                    owner: function() {
                        return this._u;
                    },
                    user: function() {
                        return this._u;
                    },
                    getId: function() {
                        return this.media.cntntId;
                    },
                    setIsAutoPlay: function (param) {
                        this.media.autoplay = param;
                    },
                    getIsAutoPlay: function () {
                        return this.media.autoplay;
                    },
                    getViewCount: function() {
                        if( this.media.ac > 1 ) {
                            return 'Views : '+ this.media.ac;
                        } else {
                            return 'View : '+ this.media.ac;
                        }
                    },
                    getViewCountOnly: function () {
                      return this.media.ac;
                    },
                    getDuration: function(formated) {
                        if (formated) {
                            var minutes =  this.media.drtn/60 === 0 ? '00' : Math.floor(this.media.drtn/60);
                            var seconds =  this.media.drtn%60 === 0 ? '00': Math.floor(this.media.drtn%60);
                            minutes = (minutes < 10 && minutes !== '00') ? '0' + minutes : minutes;
                            seconds = (seconds < 10 && seconds !== '00') ? '0' + seconds : seconds;
                            return minutes + ':' + seconds;
                        } else {
                            return this.media.drtn;
                        }
                    },
                    getCaption: function() {
                        return this.media.ttl;
                    },
                    getStreamUrl: function() {
                        var streamUrl = settings.mediaBase + this.media.strmURL;
                        // check if hd available or not
                        if (this.media.mdaT === 2) {
                            var apiVersion = this.media.strmURL.match(/media-(\d+)/);
                            if (apiVersion && apiVersion.length === 2) {
                                if (parseInt(apiVersion[1]) > 140) {
                                    // got hd video add prefix 'h'
                                    var position = streamUrl.lastIndexOf('/') + 1;
                                    streamUrl = [streamUrl.slice(0, position), 'h',  streamUrl.slice(position)].join('');
                                }
                            }
                        }
                        return streamUrl;
                    },
                    getStreamUrlOnly: function () {
                      return this.media.strmURL;
                    },
                    getThumb: function() {
                        return this.media.poster;
                    },
                    getThumbUrlOnly: function () {
                        return this.media.thmbURL;
                    },
                    getThumbForMedia: function () {
                        if(this.media.thmbURL===''){
                            return this.media.mdaT===1 ? 'images/default_audio_image.jpg':'images/default_video_image.jpg';
                        }else{
                            return this.media.poster;
                        }
                    },
                    getThumbForMediaOnly: function () {
                        if(this.media.thmbURL===''){
                            return this.media.mdaT===1 ? 'images/default_audio_image.jpg':'images/default_video_image.jpg';
                        }else{
                            return this.media.poster;
                        }
                    },
                    feedThumb: function () {
                        return this.media.feedThumb;
                    },
                    iLiked: function() { // todo  : replace use of this , because all other maps(comment,feed,image) has api of self like is like()
                        return this.media.il;
                    },
                    like: function(dolike,totalLike) {
                        if (!dolike) {
                            return this.media.il;
                        }
                        this.media.il = this.media.il ^ 1;
                        if(totalLike){
                            this.media.lc = totalLike;
                        }else{
                            this.media.lc = (this.media.il === 0) ? this.media.lc-1 : this.media.lc+1;
                        }
                        return this.media.il;
                    },
                    getLikes: function() {
                        return this.media.lc;
                    },
                    getTotalLikes : function(){
                        return this.media.lc;
                    },
                    // getWhoLikes: function() {
                    //     return media.likeUsers.all();
                    // },
                    setTotalComment: function(cc,ic) {
                        this.media.cc = cc;
                        if(angular.isDefined(ic)){
                                this.media.ic = ic;
                            }
                    },
                    selfComment : function(){
                        return this.media.ic;
                    },
                    getTotalComment: function() {
                        return this.media.cc;
                    },
                    getTotalShare: function () {
                            return this.media.ns;
                    },
                    setTotalShare: function (v) {
                       this.media.ns = v;
                    },
                    share: function (doShare) {

                            if (!doShare) {
                                return this.media.is;
                            }
                            this.media.is = this.media.is ^ 1;
                            this.media.ns = this.media.is ? this.media.ns+1 : this.media.ns-1;
                            return this.media.is;
                    },
                    thumbOffset : function(dimension){
                        if (!dimension) {
                            return {width : this.media.tiw, height : this.media.tih};
                        } else {
                            return (dimension === 'height') ? this.media.tih : this.media.tiw;
                        }
                    },

                    // pushLikes: function(json) {
                    //     var user;
                    //     if(json.likes && json.likes.length > 0) {
                    //         for(var i = 0, l = json.likes.length; i < l; i++) {
                    //             user = User.create(json.likes[i]);
                    //             media.likeUsers.save(user.getKey(), user);
                    //             // check if current user liked or not
                    //             if(media.ilkd === 0 && user.getKey() === Auth.currentUser().getKey()) {
                    //                 media.ilkd = 1;
                    //             }
                    //         }
                    //     }
                    // },
                    addToAlbumData: function() {
                        return {
                            //cntntId: this.media.cntntId,
                            strmURL: this.media.strmURL,
                            tiw: this.media.tiw,
                            tih: this.media.tih,
                            drtn: this.media.drtn,
                            thmbURL: this.media.thmbURL,
                            artst: this.media.artst,
                            ttl: this.media.ttl.utf8Encode() //fileObj.meta.ttl
                        };
                    },
                    // API CALLS
                    increaseView: function() {
                        var deferred = $q.defer(),that=this;
                        mediaHttpService.increaseViewCount(that.media.cntntId).then(function(json) {
                            
                            if (json.sucs === true) {
                                that.media.ac++;
                            }
                            deferred.resolve();
                        });
                        return deferred.promise;
                    },
                    updateRecentMedias: updateRecentMedias,
                    fetchDetails: function(user) {
                        var deferred = $q.defer(),
                            self = this;

                        if (self.media.gotDetails) {
                            deferred.resolve(self);
                        } else {
                            var reqData = {
                                cntntId: self.getKey(),
                                utId: user ? user.getUtId() : self.owner().getUtId()
                            };
                            Api.media.fetchDetails(reqData).then(function(json) {
                                if (json.sucs === true) {
                                    self.updateMedia(json.mdaCntntDTO, true);
                                    updateRecentMedias(json);
                                    deferred.resolve(self);
                                } else {
                                    deferred.reject(json);
                                    Ringalert.show(json,'info');
                                }
                            });

                        }
                        return deferred.promise;
                    }
                };

        return function (obj, userMap) {
                return new RingMedia(obj,userMap);
        };
    }




