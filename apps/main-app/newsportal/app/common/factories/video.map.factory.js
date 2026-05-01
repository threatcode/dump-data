/*
 * Ipvision
 */


(function(){
    "use strict";
    angular
        .module('ringid.common.videomap_factory',[
            'ringid.config',
            'ringid.utils',
            'ringid.common.stacked_map',
            'ringid.common.comment_factory',
            'ringid.common.user_factory'
        ])
        .factory('$$videomap', $$videomap);

    $$videomap.$inject = ['settings', '$$stackedMap','$$commentMap', 'userFactory', 'utilsFactory'];
    function $$videomap (settings, $$stackedMap, $$commentMap, userFactory, utilsFactory) {
        return {
            create: function (obj, user) {
                var video = {
                    ac: 0,
                    albId: 0,
                    artst: "",
                    cc: 0,
                    cntntId: 0,
                    drtn: 0,
                    lc: 0,
                    mdaT: 0,
                    strmURL: "",
                    thmbURL: "",
                    tih: 0,
                    tiw: 0,
                    ttl: "",

                    user: null
                };
                //console.log(ob);
                video.key = 'vd'+obj.cntntId;
                //video.whoLikes = $$stackedMap.createNew();


                var updateVideoObj = function(vidObj) {
                    if (angular.isObject(vidObj)) {
                        video = angular.extend({}, video, vidObj);
                    }

                    //if(video.tm){
                    //    video.time = utilsFactory.verbalDate(video.tm);
                    //}else{
                    //    image.time = {};// preventing from throwing error
                    //}

                    //if (imgObj.hasOwnProperty('uId')) {
                    //    image.user = userFactory.create({
                    //        uId: imgObj.uId,
                    //        fn: imgObj.fn || ''
                    //    });
                    //} else if (user) {
                    //    image.user = user;
                    //}

                    // set image url to progressive version
                    //var fileName = image.iurl.slice(image.iurl.lastIndexOf('/') + 1);
                    //image.iurl = image.iurl.replace(fileName, 'p' + fileName);

                };

                updateVideoObj(obj);

                var ObjectToReturn =  {
                    updateVideo: function(obj) {
                        updateVideoObj(obj);
                    },
                    getVideoUrl: function() {
                        console.log(settings.streamServer);
                        console.log(video.strmURL);
                        return settings.streamServer+''+video.strmURL;
                    },
                    getMapKey : function(){
                        return video.key;
                    },
                    thumbOffset : function(){
                        return {width:video.tiw,height:video.tih};
                    }
                    //user: function() {
                    //    return image.user;
                    //},
                    //src: function (size) {
                    //    if (size === 'iurl') {
                    //        return image.iurl;
                    //    }
                    //
                    //    var position = image.iurl.lastIndexOf('/') + 1;
                    //    if(size !== undefined){
                    //        return [settings.imBase, image.iurl.slice(0, position), 'p', size,  image.iurl.slice(position)].join('');
                    //        //return [settings.imBase, image.iurl.slice(0, position), size,  image.iurl.slice(position)].join('');
                    //    } else {
                    //        return [settings.imBase, image.iurl.slice(0, position), 'p',  image.iurl.slice(position)].join('');
                    //        //return [settings.imBase, image.iurl.slice(0, position), image.iurl.slice(position)].join('');
                    //    }
                    //},
                    //getByProperty : function(property_name,returndefault){
                    //    returndefault = returndefault || false;
                    //    return image.hasOwnProperty(property_name)?user[property_name]:returndefault;
                    //},
                    //
                    //sortBy : function(){
                    //    return image.ih;
                    //},
                    //getIh: function() {
                    //    return image.ih;
                    //},
                    //getIw: function() {
                    //    return image.iw;
                    //},
                    //sortByTime : function(){
                    //    return image.tm;
                    //},
                    //getAlbumName : function(){
                    //    return image.albn;
                    //},
                    //getAlbumId: function() {
                    //    return image.albId;
                    //},
                    //getCaption : function(){
                    //    return image.cptn;
                    //},
                    //getKey: function () {
                    //    return image.imgId;
                    //},
                    //getMapKey : function(){
                    //    return image.key;
                    //},
                    //getFeedKey: function(){
                    //    return image.nfId;
                    //},
                    //setFeedKey:function(key){
                    //    image.nfId = key;
                    //},
                    //time : function(){
                    //    return image.time;
                    //},
                    //like : function(dolike){
                    //    if(!dolike)return image.il;
                    //
                    //    image.il = image.il ^ 1;
                    //    image.nl = (image.il == 0) ? image.nl-1 : image.nl+1;
                    //    return image.il;
                    //},
                    //getLikes : function(){
                    //    return image.nl;
                    //},
                    //getImageType : function(){
                    //    return image.imT;
                    //},
                    //getWhoLikes : function() {
                    //    return image.whoLikes.all();
                    //},
                    //getCommentWhoLikes : function(commentKey) {
                    //    var comment = image.comments.get(commentKey);
                    //    if (comment) {
                    //        return comment.getWhoLikes();
                    //    } else {
                    //        return [];
                    //    }
                    //},
                    //incomingLike: function (type) {
                    //    return (type && ++image.nl) || --image.nl;
                    //},
                    //incomingWhoLikes: function (userJson) {
                    //    if (!!userJson.cmnId) {
                    //        var c = image.comments.get(userJson.cmnId);
                    //        if (c !== false) {
                    //            c.incomingWhoLikes(userJson);
                    //        }
                    //    } else {
                    //        var user = userFactory.create(userJson);
                    //        image.whoLikes.save(user.getKey(), user);
                    //    }
                    //
                    //},
                    //getComments : function(){
                    //    return image.comments;
                    //},
                    //getCommentStartingOffset : function(){
                    //    return image.comments.length();
                    //},
                    //getCommentByKey : function(key) {
                    //    return image.comments.get(key);
                    //},
                    //pushComments : function(commentMap, newComment){
                    //    image.comments.save(commentMap.getKey(), commentMap);
                    //    if (newComment) {
                    //        image.nc++; // increment total comments on image
                    //    }
                    //},
                    //editComment : function(){
                    //
                    //},
                    //deleteComment : function(key){
                    //    image.nc = ( image.nc-1 ) > 0 ? image.nc-1 : 0; // decrement total comment on image
                    //    image.comments.remove(key);
                    //},
                    //offset : function(){
                    //    return {width:image.iw,height:image.ih};
                    //},
                    //selfComment: function() {
                    //    return image.ic;
                    //},
                    //getTotalComment: function() {
                    //    return image.nc;
                    //},
                    //setTotalComment: function(total) {
                    //    image.nc = total;
                    //},
                    //getUrl : function(){
                    //    /** Not an ideal place, will be refactored */
                    //    return '/image/' + ObjectToReturn.getKey();
                    //},
                    //getRelativeHeight : function(width){
                    //    //if(width > image.iw) return image.ih;
                    //    try {
                    //        return (image.ih/image.iw) * width;
                    //    }catch(e){
                    //        return image.ih;
                    //    }
                    //
                    //}
                };

                return ObjectToReturn;
            }
        };
    }




})();
