"use strict";
(function(){

    angular
        .module('ringid.common.comment_factory',['ringid.config', 'ringid.common.stacked_map'])
        .factory("$$commentMap", ['$$stackedMap','settings','$filter',"DATE_FORMAT",'userFactory','utilsFactory','$$stickerMap','$sce',
            function ($$stackedMap,settings,$filter,DATE_FORMAT,userFactory,utilsFactory,$$stickerMap,$sce) {
                
                var comment_defaults = {
                            cmn: "",
                            cmnId: 0,
                            deleted: false,
                            edited: false,
                            fn: "",
                            il: 0,
                            isNew:1,
                            ln: "",
                            nfId: 0,
                            imageId : 0,
                            tl: 0,
                            tm: "",
                            uId: "",
                            prIm : "",
                            pending : false // for showing half opacity when add comment
                        };

                function RingComment(ob,user){
                    if(user){
                        this._u = user;
                    }
                    this.updateComment(ob);
                }

                RingComment.prototype = {
                            updateComment : function(json){
                                if(this.comment){
                                    angular.extend(this.comment, json);
                                }else{
                                    this.comment = angular.extend({},comment_defaults, json);
                                }
                                
                                this.updateTime();
                                this.setHtml();
                                if(!this._u){
                                    this._u = userFactory.create({
                                                fn : this.comment.fn,
                                                ln : this.comment.ln,
                                                uId : this.comment.uId,
                                                prIm : this.comment.prIm
                                            });
                                }
                            },
                            updateTime : function(){
                                if(!this.comment.tm){
                                    this.comment.tm =  Date.now();
                                }
                                this.vtime = utilsFactory.verbalDate(this.comment.tm);
                            },
                            setHtml : function(){
                                this.html = $sce.trustAsHtml(utilsFactory.parseForLE(this.comment.cmn));
                            },
                            user: function () {
                                return this._u;// instance of $$userMap
                            },
                            isOwner: function(userKey) {
                                return userKey === this._u.getKey() ? true : false;
                            },
                            text : function(){
                               return this.comment.cmn;// here should goes a emoticon filter
                            },
                            setComment: function (commentText) {
                                this.comment.cmn = commentText;
                                this.setHtml();
                            },
                            setText: function (txt) {
                                comment.cmn = txt;
                                this.setHtml();
                            },
                            getDynamicText : function(){
                                return this.html;
                            },
                            getByProperty : function(property_name,return_default){
                                return_default = return_default || false;
                                return this.comment.hasOwnProperty(property_name)?this.comment[property_name]:return_default;
                            },
                            sortBy : function(){
                                return this.comment.cmnId;
                            },
                            getKey: function () {
                                return this.comment.cmnId;
                            },
                            setKey : function(key){
                              this.comment.cmnId = key;
                            },
                            getFeedKey: function(){ // when comment belongs to feed
                                return this.comment.nfId;
                            },
                            setFeedKey:function(key){ // when comment belongs to feed
                                this.comment.nfId = key;
                            },
                            getImageKey: function(){ // when comment belongs to image
                                return this.comment.imageId;
                            },
                            setImageKey:function(key){ // when comment belongs to image
                                this.comment.imageId = key;
                            },
                            getTimestamp: function(){
                                return this.comment.tm;
                            },
                            setTime : function(tm){
                                this.comment.tm = tm;
                                this.updateTime();
                            },
                            getTimeUpdate : function(){
                                this.updateTime();
                                return this.vtime;
                            },
                            time : function(){
                                return this.vtime;
                            },
                            like : function(dolike,totalLike){
                                if(!dolike)return this.comment.il;
                                this.comment.il = this.comment.il ^ 1;
                                if(totalLike){
                                    this.comment.tl = totalLike;
                                }else{
                                    this.comment.tl = (this.comment.il == 0)?this.comment.tl-1:this.comment.tl+1;
                                }
                                return this.comment.il;

                            },
                            getTotalLikes : function(){
                                return this.comment.tl;
                            },
                            incomingLike: function (tl) {
                                    this.comment.tl = tl;
                            },
                            isPending : function(val){
                                if(val !== undefined){
                                    this.comment.pending = !!val;
                                }
                                return this.comment.pending;
                            }
                };



                return {
                    getSortIndex : function(){
                        return 'tm';
                    },
                    create: function (ob,user) { // while user adding comment // user is the second paramter of $$userMap Instance
                        return new RingComment(ob,user);
                    }
                };
            }]);



})();

