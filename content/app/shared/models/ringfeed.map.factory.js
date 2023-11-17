    angular
            .module('ringid.shared')
		    .factory("$$feedMap",$$feedMap);

    $$feedMap.$inject =  ['Auth', 'settings','$$stackedMap', '$$imageMap', 'Media', '$$mediaAlbumMap', '$$mediaMap',
        'userFactory', 'Utils', 'circlesManager', '$sce','EmotionFactory','MESSAGES','OPERATION_TYPES','PrivacySet'];

    function $$feedMap(Auth, settings,$$stackMap, $$imageMap, Media, $$mediaAlbumMap, $$mediaMap,
        User, Utils, circlesManager, $sce,EmotionFactory,MESSAGES,OPERATION_TYPES,PrivacySet){
            var keyPrefix = "nf_",
                sortBy = 'tm',
                messages = MESSAGES.FEED,
                OTYPES = OPERATION_TYPES.SYSTEM,
                userCardString = '<user-card user="feed.user()"></user-card>',
                feed_defaults = {
                        //key: key,
                        nfId: 0, /* News Feed Id */
                        utId : 0,
                        isNew: 0, // when is new one the its needed to add on the first cell top by default it will be on top for tm sorting
                        lctn: '',
                        lat : 9999, //default 9999
                        lng : 9999, //default 9999
                        gNm: "",
                        grpId:  0,
                        sts:  "", // emoticon replace needed here
                        stsTags:  [], // emoticon replace needed here
                        tim:  0,
                        imT:  0,
                       // medias:[],
                       // audios : [],
                        //album: {},
                        fndId: 0,
                        whoShare: {},
                        mdaCntntLst : [],
                        type:  0,
                        mdLst : [],//feeling
                        tm: Date.now(), // tm need to keep raw for sorting
                        //time : $filter('date')(new Date(_d.tm),DATE_FORMAT),
                        at: Date.now(),
                        ic: 0, //current user comment 0/1
                        il: 0, //current user like 0/1
                        is: 0, //current user share
                        nc: 0, //number of comment
                        nl: 0, //number if like
                        ns: 0, //number of share
                        sc: 0, // feed text more than 1000 word/char
                        tfc : 0, //total tag friend count
                        stp : 0, //feed sub type SINGLE_AUDIO_FEED_SHARED = 1; SINGLE_VIDEO_FEED_SHARED = 2; required building feed message
                        fc : 0,//feed category GENERAL_FEED = 0;SPECIAL_FEED = 1;
                       // orginal: {}, // orginal feed if its a shared feed
                       // message : '' ,//tile message assigned in bottom
                       // subMessage : '',//submessage shows last activty message assgined in bottom
                        actvt :  0, //
                        afn :  "", //activity first name
                        auId :  0,//activity utId
                        //pending : _d.pending || false,
                        lnkDmn: '',
                        lnkDsc: '',
                        lnkTtl: '',
                        lnkURL: '',
                        lnlImgURL: '',
                        /** Client Side Property  */
                        //viewColumn : _d.viewColumn || '',
                        fTgLst : []
                    }; //initalize feed basic object on response

        function RingFeed(feed,user){
             var that = this;
            //tagUsers

            that.key = keyPrefix + feed.nfId;
            that.updateRaw(feed);
            that.setFeedUser(user);


            that.feelings = {};
            that.tagUsers = [];
            that.shareUsers = [];
            that.circle = {};
            that.orginal = {};
            that.feedHtml = "";
            that.images = $$stackMap.createNew(true,'asc');//creating empty omage stacked map
            that.medias = $$stackMap.createNew();//creating empty video stacked map
            that.audios = $$stackMap.createNew();
            that.setImages();
            that.initMedias();
             if (!!that._f.fndId) {
                that.friend = User.create({
                    uId: that._f.fndId,
                    fn: that._f.ffn,
                    ln: that._f.fln
                });
            }else{
                that.friend = false;
            }
            that.initOgData();
            that.initLocationData();
            that.update(null,false,true);
            if(that.isSingleContentFeed()){
                var content = that.getSingleContent();
                if(!that.images.length()){
                    that._f.is = content.share();
                    that._f.ns = content.getTotalShare();
                }
                that._f.ic = content.selfComment();
                that._f.nc = content.getTotalComment()
            }

            Object.defineProperty(that, 'ddControl', {
                                  enumerable: false,
                                  configurable: false,
                                  writable: false,
                                  value: {
                                        feedKey: that._f.nfId,
                                        showEdit: function () {
                                            return (that._u.isCurrentUser() && that._f.nl < 1) ? true : false;
                                        },
                                        feedUser: function () {
                                            return that._u;
                                        },
                                        tagButtonText : function(){
                                            return that.tagUsers.length ? 'Edit Tag' : 'Add Tag';
                                        },
                                        showDelete : function(){
                                           return that._u.isCurrentUser() || that.friend && that.friend.isCurrentUser();
                                        },
                                        showTagButton : function(){
                                            return that._u.isCurrentUser() && !that._f.grpId;
                                        },
                                        showReportButton : function(){
                                            return !that._u.isCurrentUser();
                                        },
                                        getSpamId : function(){
                                            return that.isSingleContentFeed()?that.getSingleContent().getKey():that.getKey();
                                        },
                                        getSpamType : function(){
                                            return (that.images.length() && "image") || (that.medias.length() && "media") || (that.audios.length() && "media") || "feed";
                                        },
                                        showSaveOption:function(){
                                            return that._f.type === 7 && !that._f.npFeedInfo.svd;
                                        },
                                        showUnsaveOption:function(){
                                            return that._f.type === 7 && that._f.npFeedInfo.svd;
                                        },
                                        isNewsPortalFeed : function(){
                                            return that._f.type === 7;
                                        }
                                    }
                                });
        }


        RingFeed.prototype = {
                 /** todo : need improvement
                 * @description : updates this feed raw data
                 * @param json : target json object
                 * @param doNotupdateTm : when set true it will not update tm .. useful when we need to update but don't want to change the order in feed
                     */
                updateRaw : function(json,doNotupdateTm){
                    var previousTime;
                        if(this._f){
                            previousTime = (doNotupdateTm || !json.tm) ? this._f.tm : json.tm;
                            angular.extend(this._f,json);
                            this._f.tm = previousTime;
                        }else{
                            this._f = angular.extend({},feed_defaults,json);
                        }

                        if(this._f.lat === 9999){
                            this._f.lctn = "";
                        }
                        json = null;
                },
                update : function(json, doNotupdateTm,doNotUpdateRaw){
                    var that = this;
                    if(!doNotUpdateRaw){
                        that.updateRaw(json,doNotupdateTm);
                    }

                    //Init Feed Feelings

                    if(that._f.mdLst && that._f.mdLst.length){
                        that.feelings = EmotionFactory.getEmotion(that._f.mdLst[0],true);
                    }
                    that.setTagUsers();

                    /**
                     * @note : if order changes of comments stackmap,then in feed factory there is firstComment and lastCommnet Api to be changed
                     */
                    if (that._f.at) {
                        that.vtime = Utils.verbalDate(that._f.at);
                    } else {
                        that.vtime = "";// preventing from throwing error
                    }

                    //set feed top message
                    that.setFeedTopMessage();

                    that.processFeedMessage();

                    that.addPostfixMessage();

                    // linkify or emotify
                    that.parseStatus();//initial parsing
                    json = null;
                },
                getKey: function () {
                    return this._f.nfId;
                },
                sortBy: function () {
                    return this._f[sortBy] || this._f['tm'];
                },
                getMapKey: function () {
                    return this.key;
                },
                setFeedKey: function (key) {
                    this._f.nfId = key;
                },
                getFeedKey: function (key) { // used by rg like. cause all media image have feed key so for keeping same api name this has been added
                    return this._f.nfId;
                },
                getPrivacy : function(){
                    return PrivacySet['PVC'+(this._f.fpvc || 3)];
                },
                getByProperty: function (property_name, return_default) {
                    return_default = return_default || false;
                    return this._f.hasOwnProperty(property_name) ? this._f[property_name] : return_default;
                },

                checkMessageUpdated : function(){
                    return this.message + this._f.lctn + this.tagUsers.reduce(function(prev,curr){
                        return prev.toString() + curr.toString();
                    },"") + this._f.tfc;
                },

                getTargetWall : function(){
                    return this.friend;
                },
                getTargetCircle : function(){
                    return angular.equals({},this.circle) ? this._f.gNm:this.circle;
                },
                setFeedUser : function (user){
                    var that = this;
                    if (angular.isDefined(user)) {
                        that._u = user;
                    } else {
                        if(that._f.utId){
                            that._u = User.getByUtId(that._f.utId);
                        }else if(that._f.uId){
                            that._u =  User.getUser(that._f.uId);
                        }else{
                            that._u = false;
                        }
                        if(!that._u){
                            var uOb = {};
                                if(that._f.uId){
                                    uOb.uId = that._f.uId;
                                }
                                if(that._f.utId){
                                    uOb.utId = that._f.utId;
                                }
                                if(that._f.fn){
                                    uOb.fn = that._f.fn;
                                }
                                if(that._f.prIm){
                                    uOb.prIm = that._f.prIm;
                                }
                                if(that._f.type===7){
                                    that._f.isnp = true;
                                    uOb.isnp = that._f.isnp;
                                }
                            that._u = User.create(uOb);
                        }
                    }//updating feed user

                },
                user: function () {
                    return this._u;
                },
                processFeedMessage : function (){

                    var circleGroupPrefix = '',linkPrefix="",subtype,replacer = [userCardString],that = this;

                    if(!!that.friend){
                        circleGroupPrefix='F';
                    }else if(that._f.grpId){
                        that.circle = circlesManager.getCircle(that._f.grpId);
                        circleGroupPrefix = 'C';
                    }

                    switch(that._f.type){
                        case OTYPES.NEWS_FEED_TYPE_IMAGE://1
                            if(that.images.length() > 0){
                                that.message = messages['TYPE_1' + that.images.top().getImageType() + circleGroupPrefix] || messages['TYPE_D'];
                                that.message = that.feedConditionalReplacer(that.message,[that._u.isCurrentUser()]);
                            }else{
                               that.message = messages['TYPE_D']; //default
                            }
                            break;
                        case OTYPES.NEWS_FEED_TYPE_STATUS://2
                            if(that.hasOgData()){
                                linkPrefix = "L"
                            }
                            that.message = messages['TYPE_2'+circleGroupPrefix+linkPrefix];
                            break;

                        case OTYPES.NEWS_FEED_TYPE_MULTIPLE_IMAGE://3
                            that.message = messages['TYPE_'+that._f.type];
                            that.message = that.feedConditionalReplacer(that.message,[that._u.isCurrentUser()]);
                            replacer.push(that._f.tim);
                            break;
                        case OTYPES.NEWS_FEED_TYPE_ALBUM://4
                        case OTYPES.NEWS_FEED_TYPE_AUDIO://5
                        case OTYPES.NEWS_FEED_TYPE_VIDEO://6
                            subtype = that._f.stp || 0;
                            that.message = messages['TYPE_'+that._f.type+subtype];

                            if(!subtype && (that.medias.length() || that.audios.length())){
                                //if((that.medias.length() || that.audios.length()) > 1){
                                    replacer.push(that.medias.length() || that.audios.length());
                                // }else{
                                //     replacer.push('a');
                                // }

                            }else{
                                replacer.push('<user-card class="share-user" user="feed.getSingleContent().user()"></user-card>');
                            }

                           // replacer.push('<user-card class="share-user" user="feed.getSingleContent().user()"></user-card>')
                            break;
                        default:

                            that.message = messages['TYPE_D'];
                            break;
                    }

                    if(!!that.friend){
                        that.message += " " + messages['F_POSTFIX'].format('<user-card class="wall-user" user="feed.getTargetWall()"></user-card>');
                    }else if(that._f.grpId){
                        that.message += " " + messages['C_POSTFIX'].format('<a class="cir-title" href="/#/circle/' + that._f.grpId +'" >'+that._f.gNm+'</a>');
                    }
                    that.rawmessage = that.message;
                    that.message = that.message.format(replacer);
                    that.oldMessage = that.message;
                },
                updateShareMessage : function(){
                    var temstr = userCardString;
                    if(this.orginal.getTotalShare() > 1){
                        temstr += "and "+(this.orginal.getTotalShare() - 1)+" other people";
                    }
                    var repl = [userCardString];
                    this.message = messages['TYPE_SHARE'];
                    repl.push('<user-card class="share-user" user="feed.getOrginalFeed().user()"></user-card>');
                    this.message = this.message.format(repl);
                    this.oldMessage = this.message;
                    this.addPostfixMessage();
                },
                addPostfixMessage : function(){
                    var that = this;
                    that.message = that.oldMessage;

                    if(that._f.mdLst.length || that.tagUsers.length ||  that.location){
                        if(that.rawmessage !== '{0}'){
                            that.message += " &mdash;";
                        }else{
                            that.message += " is";
                        }

                    }

                    if(!!that._f.mdLst.length){
                        that.message += '<span class="feelings-text">feeling</span> <img class="feed_emo" src="'+that.feelings.url+'" />&nbsp;'+that.feelings.nm;
                    }

                    if(!!that.tagUsers.length){
                        that.message += '&nbsp;<feed-tag-more-user tag-feed="feed"></feed-tag-more-user>';
                    }

                    if(this._f.lctn){
                        that.message += '&nbsp;<location-card feed="feed"></location-card>';
                    }
                },

                getMessageText: function () {
                    return this.message;
                },
                hasActivityMessage : function(){
                    //console.info(feed.subMessage,!!feed.subMessage,"feedMessage");
                  return this._f.actvt > 0 && this._f.fc !==1;// not special feed and has activity message
                },
                setActivity : function(json){
                    this._f.actvt = json.actvt || 0;
                    this._f.afn = json.afn;
                    this._f.auId = json.auId;
                    this.setFeedTopMessage();
                },
                setFeedTopMessage: function(){
                    var that = this;
                    if(that._f.actvt > 0){
                        // todo : when this is a share feed check if afn comes in orginal or whoshare
                        that.subMessage = "";

                        if(that._f.actvt && !!MESSAGES.FEED['ACT_'+that._f.actvt]){
                            var activity_user = User.getByUtId(that._f.auId), acmessage = '<b>You</b>';

                            if(activity_user){
                                if(!activity_user.isCurrentUser()){
                                    acmessage = '<user-card user="feed.getActivityUser()"></user-card>';
                                }
                            }else{

                                if(Auth.currentUser().getUtId() !== that._f.auId){
                                    activity_user = User.createByUtId({fn:that._f.afn,utId:that._f.auId},true);

                                    acmessage = '<user-card user="feed.getActivityUser()"></user-card>';
                                }
                            }

                            that._au = activity_user;

                            that.subMessage = MESSAGES.FEED['ACT_'+that._f.actvt].format(acmessage);
                        }

                        that.subMessage =  $sce.trustAsHtml ( that.subMessage );

                    }
                },
                getActivityMessage : function(i, k, fe){
                   // console.log("scope Id : "+ i +"  parent index : " + k ,"  feed : "+fe.getKey());
                   // console.dir(fe);
                  return this.subMessage;
                },
                getActivityUser : function(){
                    return this._au;
                },
				feedTextParser : function(text,tags,length){
				   var usr,text_spilit = [],that = this,text,returnHtml="";
				   length = length || text.length;
                   tags = tags || [];
                   if(length > 0){
				   		text = text.substr(0,length);
				   }
                    if (text || tags) {
                        if(tags && tags.length){
                            var start=0,end;
                            tags.sort(function(a,b){
                                return b.pstn > a.pstn ? -1:1;
                            });
                            for(var i=0;i<tags.length;i++){
                                // for security make this glue dynamic
                                //end = this._f.stsTags[i].pstn - start+1;
                                if(tags[i].pstn < length){

                                    end = tags[i].pstn - start;
                                    usr = User.create(tags[i]);
								    if(end > 0){
										text_spilit.push(Utils.parseForLE(text.substr(start,end)));
									}
									text_spilit.push(usr.getLink({'class' : 'tag', 'title': usr.getName().trim(), 'data-link':usr.getUtId()}));
									start = tags[i].pstn;
								}else{
									break;// cause tags is sorted array if any one is less then after all less so no need for looping
								}
                            }
                             end = text.length - start;
                             if(end > 0){
                                text_spilit.push(Utils.parseForLE(text.substr(start,end)));
                             }
                             returnHtml = text_spilit.join("");
                        }else{
                            returnHtml = Utils.parseForLE(text);
                        }
                        returnHtml = $sce.trustAsHtml(returnHtml);
                    }
				return returnHtml;
				},
                parseStatus : function () {
				    this.feedHtml = this.feedTextParser(this._f.sts,this._f.stsTags);
                     /*    var usr,text_spilit = [],that = this;*/
                    //if (that._f.sts || that._f.stsTags) {
                        //if(that._f.stsTags && that._f.stsTags.length){
                            //var start=0,end;
                            //that._f.stsTags.sort(function(a,b){
                                //return b.pstn > a.pstn ? -1:1;
                            //});
                            //for(var i=0;i<that._f.stsTags.length;i++){
                                //// for security make this glue dynamic
                                ////end = this._f.stsTags[i].pstn - start+1;
                                //end = that._f.stsTags[i].pstn - start;
                                //usr = User.create(that._f.stsTags[i]);
                                //if(end > 0){
                                    //text_spilit.push(Utils.parseForLE(that._f.sts.substr(start,end)));
                                //}
                                //text_spilit.push(usr.getLink({'class' : 'tag', 'title': usr.getName().trim(), 'data-link':usr.getUtId()}));
                                //start = that._f.stsTags[i].pstn;
                            //}
                             //end = that._f.sts.length - start;
                             //if(end > 0){
                                //text_spilit.push(Utils.parseForLE(that._f.sts.substr(start,end)));
                             //}
                             //that.feedHtml = text_spilit.join("");
                        //}else{
                            //that.feedHtml = Utils.parseForLE(that._f.sts);
                        //}
                        //that.feedHtml = $sce.trustAsHtml(that.feedHtml);
                    //}else{
                        //that.feedHtml = "";
                    /*}*/
                },
                parseMoreText: function (feedObj) {
                    //feed = angular.extend(this._f, feedObj);
                    this._f.sts = feedObj.sts;
                    this.parseStatus();
                },
				getCroppedHtml : function(tempContent){
                        return this.feedTextParser(tempContent,this._f.stsTags,tempContent.length);
				},
                showMore : function(){
                    return !!this._f.sc;
                },
                setText: function (sts,stsTags) {
                    this._f.sts = sts;
                    if(stsTags){
                        this._f.stsTags = stsTags;
                    }
                    this.parseStatus();
                },
                text: function () {
                    return this._f.sts;
                },
                getDynamicText: function () {
                    return this.feedHtml;
                },
                getDynamicTextMore: function (words, uid) {
                    words = parseInt(words)>0 ? parseInt(words): 20;
                    var ptrn = '(', text,
                        fhtml = Utils.parseForLE(this._f.sts);
                    for (var i = words; i > 0; i--) {
                      ptrn += '[\\S]+\\s';
                    }
                    ptrn +=')(.*)';
                    text = fhtml.replace(new RegExp(ptrn),'<span class="with-more"><input id="read'+uid+'" type="checkbox" /><span class="less">$1</span><span class="more">$2</span><label for="read'+uid+'" class="trigger"></label></span>');
                    return $sce.trustAsHtml(text);
                },

                getAtTime: function(){
                    return this._f.at;
                },
                time: function () {
                    return this.vtime;
                },
                updateTime: function () {
                    this.vtime = Utils.verbalDate(this._f.at);
                },
                setTime: function (tm) {
                    this._f.tm = tm;
                    //updateTime();
                },
                getTimestamp: function(){
                    return this._f.tm;
                },
                incomingLike: function (type) {
                    return (type && ++this._f.nl) || --this._f.nl;
                },
                like: function (dolike,totalLike) {
                    if (!dolike) {
                        return this._f.il;
                    }
                    this._f.il = this._f.il ^ 1;
                    if(totalLike){
                       this._f.nl = totalLike;
                    }else{
                       this._f.nl = this._f.il ? this._f.nl+1 : this._f.nl-1;
                    }
                    if(this.identical){
                        this.identical.like(dolike);
                    }
                    return this._f.il;
                },
                setTotalLikes: function (nl,il){
                    this._f.nl = nl;
                    if(angular.isDefined(il)){
                        this._f.il = il;
                    }
                    if(this.identical){
                        this.identical.setTotalLikes(nl,il);
                    }
                },
                setIdenticalFeed : function(f){
                    this.identical = f; //
                },
                getTotalLikes: function () {
                    return this._f.nl;
                },
                setTotalComment :function(loc,ic){
                    this._f.nc = loc;
                    if(angular.isDefined(ic)){
                        this._f.ic = ic;
                    }
                    if(this.identical){
                        this.identical.setTotalComment(loc.ic);
                    }
                },
                getTotalComment: function () {
                    return this._f.nc;
                },
                selfComment: function () {
                    return this._f.ic;
                },

                getTotalShare: function () {
                    return this._f.ns;
                },
                getShareUsers : function(){
                    return this.shareUsers;
                },
                addShareUser : function(usr){
                    if(typeof usr == 'array'){
                        this.shareUsers = this.shareUsers.concat(usr);
                    }else{
                        this.shareUsers.push(usr);
                    }
                    return this.shareUsers;
                },
                share: function (doShare,totalShare) {
                    if (!doShare) {
                        return this._f.is;
                    }
                    this._f.is = this._f.is ^ 1;
                    if(totalShare){
                       this._f.ns = totalShare;
                    }else{
                       this._f.ns = this._f.is ? this._f.ns+1 : this._f.ns-1;
                    }
                    return this._f.is;
                },
                shares: function (mainFeed) { // mainFeed Is The Feed that Shared Current Feed
                    this.orginal = mainFeed;
                    this.orginal.addShareUser(this._u);
                    this.updateShareMessage();
                },
                getWhoShares: function () {
                    return this._f.whoShare;
                },
                getOrginalFeed: function () {
                    return this.orginal;
                },
                hasSharedFeed: function () {
                    return !angular.equals({}, this.orginal);
                },

                getTotalImage : function(){
                  return this._f.tim;
                },
                setImages: function () {
                    var temp,loopIndex = 0,imlength,timg;
                    if (!!this._f.imageList) {
                        try {
                            temp = angular.isString(this._f.imageList) ? angular.fromJson(this._f.imageList): this._f.imageList;
                        } catch (e) {
                        }
                        imlength = temp.length > 3 ? 3 : temp.length;
                        for (loopIndex = 0; loopIndex < imlength; loopIndex++) {
                            // temp[i].link = settings.imBase + temp[i].iurl;
                            temp[loopIndex].nfId = this._f.nfId;
                            timg = $$imageMap(temp[loopIndex],this._u);
                            this.images.add(timg.getMapKey(), timg);
                        }
                            // console.log($images.all());

                        //$images.sort('desc', 'sortByTime');//sort is not needed using default sort by id as image layout requires

                    }//if response have images then pushing into image map

                  switch(this.images.length()){
                      case 1:
                          this.imlayout = 5;
                          break;

                      case 2:
                          this.imlayout = 4;
                          break;
                      default:
                          this.imlayout = this._f.nfId % 4;
                          break;
                  }
                },
                getImages: function (map) {
                  return map ? this.images : this.images.all();
                },
                getImageLayout : function(withCLass){
                    return this.imlayout;
                },


                hasMedia: function() {
                    return this.images.length() > 0 || this.medias.length() > 0 || this.audios.length() > 0;
                },
                getAlbum: function() {
                    return this.album;
                },
                initMedias : function(){
                    if(!!this._f.mdaCntntLst && this._f.mdaCntntLst.length > 0) {
                        var user = this._f.stp > 0?null:this._u,mdaCntntLst = this._f.mdaCntntLst;

                            //feed.album = $$mediaAlbumMap.createAlbum({
                                //albn: mdaCntntLst[0].albn,
                                //albId: mdaCntntLst[0].albId,
                                //mc: mdaCntntLst.length,
                                //mdaT: mdaCntntLst[0].mdaT,
                                //utId: user ? user.getUtId() : 0
                            //}, user);

                            //feed.album.pushContent(mdaCntntLst, user,feed.nfId);

                            //if (feed.album.isAudio()){
                                //$audios = feed.album.getContents();
                            //} else if (albumMap.isVideo()){
                                //$medias = feed.album.getContents();
                            //}
                            //feed.medias = $medias;
                            //feed.audios = $audios;

                            //albumMap = Media.getAlbum(mdaCntntLst[0].albId);
                            //if (!albumMap) {
                                this.album = $$mediaAlbumMap.createAlbum({
                                    albn: mdaCntntLst[0].albn,
                                    albId: mdaCntntLst[0].albId,
                                    mc: mdaCntntLst.length,
                                    mdaT: mdaCntntLst[0].mdaT,
                                    utId: user ? user.getUtId() : 0
                                });

                                this.album.pushContent(mdaCntntLst, user, this._f.nfId);
                            //}
                        if (this.album.isAudio()){
                            this.audios = this.album.getContents(); //albumMap.pushContent(mdaCntntLst, user,this._f.nfId,this.audios);
                        } else if (this.album.isVideo()){
                            this.audios = this.album.getContents(); //.albumMap.pushContent(mdaCntntLst, user,this._f.nfId,this.medias);
                        }
                        //this.album = albumMap;
                    }
                },
                getMedias: function () {
                    return this.medias;
                },
                getAudios : function(){
                    return this.audios;
                },


                setViewColumn : function(column){
                    this.viewColumn = column;
                },
                getViewColumn : function(){
                    return this.viewColumn;
                },
                getUrl : function(){
                    /** Not an ideal place, will be refactored */
                    // var feedId, isShared=false;
                    // if (feedMapObjectToReturn.hasSharedFeed()) {
                    //     feedId = feedMapObjectToReturn.getOrginalFeed().getKey();
                    //     isShared = true;
                    // } else {
                    //     feedId = feedMapObjectToReturn.getKey();
                    // }
                    return Utils.getRingRoute('SINGLE_FEED', {feedId : this._f.nfId, shared: this.hasSharedFeed()});
                },
                getWhoShareUrl : function() {
                    var feedId;
                    if (this.hasSharedFeed()) {
                        feedId = this.getOrginalFeed().getKey();
                    } else {
                        feedId = this.getKey();
                    }
                    return Utils.getRingRoute('WHO_SHARED_FEED', {feedId : feedId});
                },

                hasFeelings : function(){
                    return !!this._f.mdLst.length;
                },
                getFeelings : function(){
                    return this.feelings;
                },

                setFeelings : function(feelings){
                    if(!!feelings && !!feelings.id){
                        this.feelings = feelings;
                        this._f.mdLst[0] = feelings.id;
                    }else{
                        this.feelings = {};
                        this._f.mdLst = [];
                    }
                    this.addPostfixMessage();
                },


                //starts tag user part
                setTagUsers : function (feedTagList, feedTagFriendCount){

                    if(!feedTagList){
                        feedTagList = this._f.fTgLst;
                    }else{
                        this._f.fTgLst = feedTagList;
                    }

                    this.tagUsers.length = 0;
                    if(feedTagList && feedTagList.length){

                        for(var i = 0;i < feedTagList.length;i++){

                            feedTagList[i].fn = feedTagList[i].nm;
                            this.tagUsers.push(User.createByUtId(feedTagList[i]));
                        }
                    }
                    if(angular.isDefined(feedTagFriendCount)){
                        this._f.tfc = feedTagFriendCount;
                    }
                },
                updateTagUser : function(obTag){

                    this.setTagUsers(obTag.fTgLst, obTag.tfc);

                    this.addPostfixMessage();
                },
                hasTagUsers :function(){
                    return !!this.tagUsers.length;
                },
                getTagUsers : function(){
                    return this.tagUsers;
                },
                validateForUpdateTag : function(){
                    return this._f.lctn !== '' || this._f.lnkURL || this._f.sts ||  this.images.length()  || this.medias.length() ||  this.audios.length();
                },
                hasMoreTagUsers : function(){
                    return this._f.tfc > this.tagUsers.length;
                },
                getMoreTagUsers : function(){
                    return this._f.tfc - this.tagUsers.length;
                },
                getTotalTag : function(){
                    return this._f.tfc;
                },
                getLocationText : function(){
                   return this._f.lctn;
                },
                getLocationShortText : function(){
                   if( !!this._f.lctn ){
                      var location = this._f.lctn;
                      var parts = this._f.lctn.split(',');

                      if( parts.length > 2){
                           location = parts[0].replace("(", "");
                      }

                      if( location.length > 30){
                           location = location.substr(0, 30) + '...';
                      }
                      return location;
                   }
                },
                setLocationText : function(location){
                   this._f.lctn = location;
                   this.addPostfixMessage();
                    return location;
                },
                resetLocationText : function(){
                    this._f.lctn = '';
                },


                getContentType : function(){
                    var a;
                    if(this.images.length()){
                        a = 'image';
                    }else if(this.medias.length()){
                        a = 'media';
                    }else if(this.audios.length()){
                        a = 'media';
                    }else {
                        a = 'feed';
                    }
                    return a;
                },
                hasLocationInfo: function(){
                    return this._f.lctn !== '' && !this._f.lnkURL && !this._f.sts && !this.images.length() && !this.medias.length() && !this.audios.length();
                },

                getLocationInfo : function(){
                    return this.locationData;
                },

                getLocationUrl : function(){
                    return $sce.trustAsResourceUrl( Utils.getGoogleMapJSUrl(this._f.lat, this._f.lng, this._f.lctn, false) );
                },

                getLocationEmbedUrl : function(){
                    return $sce.trustAsResourceUrl( Utils.getGoogleMapJSUrl(this._f.lat, this._f.lng, this._f.lctn, true) );
                },
                getLocationStaticEmbedUrl : function(){
                    return $sce.trustAsResourceUrl( Utils.getGoogleMapStaticUrl(this._f.lat, this._f.lng, this._f.lctn) );
                },
                initLocationData : function(){
                    if(this._f.lat !== 9999){
                        this.locationData = { description: this._f.lctn, lat : this._f.lat, lng: this._f.lng };
                    }else{
                        this.locationData = { description: this._f.lctn };
                    }
                },
                setLocationInfo : function(location){
                    this._f.lctn = location.description;
                    this._f.lat = location.lat;
                    this._f.lng = location.lng;
                    this.initLocationData();
                    this.addPostfixMessage();
                },

                getStrmURL: function() {
                  return this._f.strmURL;
                },
                getLinkDomain: function(){
                    return this._f.lnkDmn;
                },
                getLinkUrl : function(){
                    return this._f.lnkURL;
                },
                getLinkTitle : function(){
                    return this._f.lnkTtl;
                },
                getLinkDescription : function(){
                    return this._f.lnkDsc;
                },
                getLinkImageUrl : function(){
                    return this._f.lnlImgURL;
                },
                hasOgData : function(){
                    return !!(this._f.lnlImgURL || this._f.lnkTtl || this._f.lnkDsc)
                },
                getOgData : function(){
                    return this.ogData;
                },
                initOgData : function (){
                    if(!this.ogData){
                        this.ogData = {};
                    }
                    this.ogData['image'] = this._f.lnlImgURL;
                    this.ogData['description'] = this._f.lnkDsc;
                    this.ogData['title'] = this._f.lnkTtl;
                    this.ogData['url'] = this._f.lnkURL;
                    this.ogData['lnkDmn'] = this._f.lnkDmn;
                },
                setOgData : function(ogData){
                    this._f.lnkDsc = ogData.lnkDsc || ogData.description ||'' ;
                    this._f.lnkTtl = ogData.lnkTtl || ogData.title || '' ;
                    this._f.lnkURL = ogData.lnkURL || ogData.url || '' ;
                    this._f.lnlImgURL = ogData.lnlImgURL || ogData.image || '' ;
                    this._f.lnkDmn = ogData.lnkDmn || ogData.domain || '' ;
                    this.initOgData();

                },

                isEmpty : function(ignore){ //ignore is object it should contain the property to ignore check
                    ignore = ignore || {};
                    return !this.text || (ignore.tagUsers && this.tagUsers.length);
                },
                isSpecial : function(){
                    //todo: should write the correct fc for special feed
                    return this._f.fc ===1;
                },
                isFeed : true,
                isTimelinePost : function(){
                            return this.friend && this.friend.isCurrentUser();
                        },
                isWallPost : function(){
                    return !!this.friend;
                },
                isCirclePost : function(){
                    return this._f.grpId > 0;
                },
                isMediaShared : function(){
                    return this._f.stp > 0;
                },
                isSingleContentFeed : function(){
                    return (this.images.length() === 1 || this.medias.length() === 1 || this.audios.length() === 1);
                },
                getSingleContent : function(){
                    return (this.images.length() && this.images.bottom()) || (this.medias.length() && this.medias.bottom()) || (this.audios.length() && this.audios.bottom()) || this;
                },
                //newsportal Api [todo: make api for {npFeedType,wt}]
                hasNewsPortalFeed : function(){
                    return this._f.npFeedInfo;
                },
                hasExternalUrl: function(){
                    return this._f.npFeedInfo.exUrlOp;
                },
                getNewsPortalcatId:function(){
                    return this._f.npFeedInfo.nCatId;
                },
                getNewsPortalDescription:function(){
                    return this._f.npFeedInfo.nDctn;
                },
                getNewsPortalShortDescription:function(){
                    return this._f.npFeedInfo.nSDctn;
                },
                getNewsPortalTitle:function(){
                    return this._f.npFeedInfo.nTtl;
                },
                hasNewsPortalUrl:function(){
                    return !!this._f.npFeedInfo.nUrl;
                },
                getNewsPortalUrl:function(){
                    return this._f.npFeedInfo.nUrl;
                },
                isSavedNewsPortal:function(){
                    return this._f.npFeedInfo.svd;
                },
                setPortalSaveStatus:function(status){
                    this._f.npFeedInfo.svd = status;
                },
                //newsportal Api
                isPending : function(val){
                    if(val !== undefined){
                        this.pending = !!val;
                    }
                    return this.pending;
                },
                isShareAble : function(returnWithMessage){
                    var sucs = true,rc,
                        content = this.isSingleContentFeed() && !this.images.length(),
                        f = this.getSingleContent();
                    if(this._u.isCurrentUser() || (content && f.user().isCurrentUser())){
                        rc = 'RC15';//reason code 15 from setting
                        sucs = false;
                    }else if(!!this.friend){
                        rc = 'CRCFS1';//custom reason code feed share
                        sucs = false;
                    }else if(!!this._f.grpId){
                        rc = 'CRCFS2';
                        sucs = false;
                    }else if(this._f.is && !content){
                        rc = 'CRCFS3';
                        sucs = false;
                    }
                    return !returnWithMessage?sucs:{sucs:sucs,rc:rc};
                },
                // getFeedRaw : function(){ // for debug
                //     return this._f;
                // },
                encodeUtf8Fields : function(){
                    var utf8fields = [
                        'location', 'lctn', 'lnkDmn',  'lnkDsc', 'lnkTtl', 'lnkURL', 'lnlImgURL'
                    ],utf8fieldsIndex,feedUtf8AttributeName;
                    for(utf8fieldsIndex = 0; utf8fieldsIndex < utf8fields.length; utf8fieldsIndex++){
                         feedUtf8AttributeName = utf8fields[utf8fieldsIndex];
                        if(!this._f[ feedUtf8AttributeName ]){
                            this._f[ feedUtf8AttributeName ] = '';
                        }else{
                            this._f[ feedUtf8AttributeName ] = this._f[ feedUtf8AttributeName ].utf8Encode();
                        }
                    }
                },
                feedConditionalReplacer : function(str,conditions){
                    var i=0; conditions = conditions || [];
                        str = str.replace(/(\w+)?\|\|(\w+)?/g,function(match,p1,p2){
                            if(conditions[i] !== undefined){
                                return !!conditions[i]?p1:p2;
                            }else{
                                return "";
                            }
                        });
                        return str.replace(/(\s){2,}/g," ");// replacing two or more spaces into one
                }
        }




        return {
                getPrefix: function () {
                    return keyPrefix;
                },
                setSortKey : function(key){
                    sortBy = key;
                },
                setPrefix: function (prefix) {
                    keyPrefix = prefix;
                },
                getSortIndex: function () {
                    return sortBy;
                },
                makeKey: function (key) {
                    return keyPrefix + key;
                },

                create: function (_d, user) {
                         return new RingFeed(_d,user);
                }
            };
     }




