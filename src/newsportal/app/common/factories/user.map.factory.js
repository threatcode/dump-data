(function () {
    "use strict";
    angular
            .module('ringid.common.user_factory', [
                'ringid.config',
                'ringid.common.stacked_map',
                'ringid.common.contacts_factory'
            ]).factory('$$userMap', ['profileHttpService', 'settings','$$stackedMap','$filter',  'utilsFactory', 'Storage', 'Contacts','$$q',
                function (profileHttpService, settings, $$stackedMap,$filter,   utilsFactory, Storage, Contacts,$q) {
                    var DEVICES = {
                        0 : 'p',
                        1 : 'desktop',
                        2 : 'android',
                        3 : 'iphone',
                        4 : 'windows',
                        5 :  'web'
                    };
                    var user_defaults = {
                                fn: "",
                                uId: 0,
                                cnty: "",
                                el: "",
                                gr: "",
                                am: "",
                                mblDc: "",
                                prIm: "images/prof.png",
                                cIm : "images/default_cover.jpg",
                                prImId: 0,
                                cImId: 0,
                                cimX: 0,
                                cimY: 0,
                                bDay: "",
                                blc: 0, // block maybe
                                re: '',
                                utId: 0,
                                tf: 0,
                                nmf: 0, // no of common friends
                                // access parameters
                                chta: 0,
                                cla: 0,
                                fda: 0,
                                cc:"",
                                hc:"",
                                adt: 0, // added time

                                // presence detail
                                psnc: 0, // 1=online, 2=offline, 3=away, 4=do not disturb
                                lot: 0,
                                mood: 0, // 1=alive, 2=do not disturb, 3=busy, 4=invisible
                                apt : 0,
                                dt : "",

                             //   groups: {}, // groups memberships info
                                frnS: 0,
                                ct: 0,
                                nct: 0,
                                pimX: 0,
                                pimY: 0,
                                bv: 0,
                                owner: 0,
                                basicInfo: false,
                                privacyInfo: {}
                            };

                    function RingUser(obj, isProfile, isCurrent,withMfc){
                            this.groups = {};
                            this.updateUserObj(obj);
                            this.isCurrent = isCurrent;
                            this.isProfile = isProfile;
                            this.requestedMutualFriend = false;
                            this.loading = false;
                            this.user.psnc = this.isCurrent ? 2 : this.user.psnc;
                            this.user.dvc =  this.isCurrent ? 5 : this.user.dvc;
                            //if group information present store it
                            if ( obj.hasOwnProperty('grpId') ) {
                                this.groups[obj.grpId] = obj.admin;
                            }
                            obj = null;
                            if(!this.user.prIm || !this.user.uId || !this.user.utId || (!this.user.nmf && withMfc)){
                                this.requestUserDetails(!!withMfc);
                            }
                    }

                    RingUser.prototype = {
                                updateUserObj : function(userObj) {
                                    var userObj = userObj || {};

                                    if(this.user){
                                        angular.extend(this.user, userObj);
                                    }else{
                                        this.user = angular.extend({},user_defaults, userObj);
                                    }
                                    //console.log('info: '+user.gr);
                                    // update group info
                                    if(userObj.grpId) {
                                        this.groups[userObj.grpId] = userObj.admin;
                                    }

                                    // if prIm and cIm is empty string set them to default
                                    if (this.user.prIm === '') {
                                        this.user.prIm =   "images/prof.png";
                                    }
                                    if (this.user.cIm ===  '') {
                                        this.user.cIm = "images/default_cover.jpg";
                                    }

                                    if( this.user.frnS === 0) {
                                        this.user.frnS = Contacts.getFrns(this.user.utId).frnS || this.user.frnS;
                                    }
                                    if(userObj.mfc){
                                        this.user.nmf = userObj.mfc;
                                    }
                                    if(userObj.mutualFriends){
                                        this.user.nmf = userObj.mutualFriends;
                                    }
                                    userObj = null;
                                },
                                requestUserDetails : function (mfc){//mutual Friend count
                                        var reqData = {},that=this,promise;
                                        if(this.user.utId){
                                            reqData.utId = this.user.utId;
                                        }
                                        else if(this.user.uId){
                                            reqData.uId = this.user.uId;
                                        }
                                        if(reqData.utId || reqData.uId){
                                            if(mfc){
                                                this.requestedMutualFriend = true;
                                            }
                                           // RingLogger.print("http Service called : #"+user.utId + " ID:"+ user.uId + " Name"+ user.fn,"SafeModeSender");
                                            promise = profileHttpService.getUserDetails(reqData,!!mfc);
                                            promise.then(function(json){
                                               // RingLogger.print("Response ",json,"SafeModeSender");
                                                if(json.sucs){
                                                    that.updateUserObj(json.userDetails);
                                                }

                                            });
                                            return promise;
                                        }
                                    },
                                getName: function () {
                                    return this.user.fn;
                                },
                                avatar:  function (size){
                                        var imageLink = this.user.prIm || "";
                                        if (size === 'iurl') {
                                            return imageLink;
                                        }

                                        if (size === 'original') {
                                            return settings.imBase + imageLink;
                                        }

                                        // default image
                                        if (imageLink.indexOf('prof.png') > 0) {
                                            return imageLink;
                                        }

                                        imageLink =  imageLink.replace('profileimages/','');
                                        if(size === 'original') {
                                            size = '';
                                        } else if(!size){
                                          size = 'crp';
                                        }
                                        // add progressive prefix
                                        size = (/\/uploaded\//.test(imageLink) ? '': 'p') + size;

                                        var position = imageLink.lastIndexOf('/') + 1;
                                        imageLink = [settings.imBase, imageLink.slice(0, position), size,  imageLink.slice(position)].join('');

                                        return imageLink.indexOf('prof.png') > 0 ? this.user.prIm : imageLink ;
                                },
                                getKey: function () {
                                    return this.user.uId || this.user.utId;
                                },
                                getUId : function(){
                                    return this.user.uId;
                                },
                                setUid : function(uid){
                                    this.user.uId = uid;
                                },
                                getUtId: function () {
                                    return +this.user.utId;
                                },
                                equals: function(u,check){// id or instance of
                                    // for match utId sent utId else sent uId or sent nothing
                                    if (!check){
                                        check = 'uId';
                                    }
                                    if(angular.isObject(u)){
                                        u = (check === 'uId') ? u.getKey() : u.getUtId();
                                    }
                                    return this.user[check] === u;
                                },
                                link: function () {

                                    //if( !!this.user.uId || !!this.user.utId ){
                                    if (!!this.user.uId || this.user.ct !== 3) {
                                        //return settings.baseUrl + utilsFactory.getRingRoute('USER_PROFILE', { uId : user.uId, utId : user.utId }) + (user.frnS !== 1 && !user.isCurrent) ? '/about' : '';
                                        return settings.baseUrl + utilsFactory.getRingRoute('USER_PROFILE', { uId : this.user.uId, utId : this.user.utId }) + ((this.user.frnS !== 1 && !this.isCurrent) ? '/about' : '');
                                    }else{
                                        return '';
                                    }
                                },
                                getRingNumber: function () {
                                   return  (this.user.uId.replace(/(\d{2})(\d{4})(\d+?)/,"$2 $3"));
                                   //return user.uId.substring(2);
                                },
                               navActiveLink: function () {

                                   if( !!this.user.uId || !!this.user.utId ){
                                       var url = '/profile/'+this.user.uId+'/post';
                                       return  url;
                                   }else{
                                       return '';
                                   }
                               },
                                toString : function(){
                                    return this.user.uId;
                                },

                                friendshipStatus: function () {
                                   return this.user.frnS; // 0=not friend, 1=accepted friend, 2=incoming friend request, 3=outgoing friend request
                                },
                                isLoading: function(bool) {
                                    if (typeof bool === 'undefined') {
                                        return this.user.loading;
                                    } else {
                                        this.user.loading = bool;
                                        return this.user.loading;
                                    }
                                },
                                commonFriends: function (force,returnPromise) {
                                    var promise;
                                    if((!this.user.nmf && !this.requestedMutualFriend) || force){
                                        promise = this.requestUserDetails(true);
                                    }
                                    return returnPromise ? (promise || $q.when(this.user.nmf)) : this.user.nmf;
                                },
                                isCurrentUser: function () {
                                   return this.isCurrent;
                                },
                                sortBy: function() {
                                    //return user.fn.toLowerCase();
                                    return this.user.adt;
                                },
                                getLiteUser : function(){
                                    return this;
                                },
                                isAdmin: function(grpId) { // check if user admin of a group
                                    if(this.groups.hasOwnProperty(grpId)) {
                                        return this.groups[grpId];
                                    } else {
                                        return false;
                                    }
                                },
                                setGroupAdmin : function(groupId){
                                    this.groups[groupId]=true;
                                },
                                removeGroupAdmin : function(groupId){
                                    delete this.groups[groupId];
                                },
                                overwriteInfo : function(ob){
                                    this.user.prIm = ob.prIm || this.user.prIm;
                                },
                                haveProfileData: function() {
                                    return this.isProfile;
                                },
                                getBasicInfo: function() {

                                    var frTime = utilsFactory.profileVerbalDate(this.user.bDay);
                                    var mTime = utilsFactory.profileVerbalDate(this.user.mDay);

                                    return {
                                        fn: this.user.fn || '',
                                        birthDay: this.user.bDay || '',
                                        mDay: this.user.mDay || '',
                                        birthday: frTime,
                                        marriageDay: mTime,
                                        el: this.user.el || '',
                                        hc: this.user.hc || '',
                                        cc: this.user.cc || '',
                                        gr: this.user.gr || '',
                                        am: this.user.am || '',
                                        uId: this.user.uId.toString().substring(2) || ''
                                    };
                                },
                                setBasicInfo: function(basicInfoObj) {
                                   // console.log(basicInfoObj);
                                   //return setProfileInfo(basicInfoObj);
                                },
                                resetCover: function() {
                                    this.user.cIm = "images/default_cover.jpg";
                                },
                                getCover: function(size) {
                                    var cIm = this.user.cIm,
                                        prefix,
                                        position;

                                    if (size === 'iurl') {
                                        return cIm;
                                    }

                                    if (size && size === 'original') {
                                        return settings.imBase + cIm;
                                            //prefix = (/\/uploaded\//.test(cIm) ? '': 'p');
                                            //position = cIm.lastIndexOf('/') + 1;
                                            //cIm = [settings.imBase, cIm.slice(0, position), prefix,  cIm.slice(position)].join('');
                                        //return cIm;
                                    }

                                    if (cIm) {
                                        if(cIm.indexOf('default') > 0){
                                            return cIm;
                                        }
                                        else if (cIm.indexOf('web') > 0) {
                                            return settings.imBase + cIm;
                                        } else {

                                            prefix = (/\/uploaded\//.test(cIm) ? '': 'p') + (size || 'crp') ;
                                            position = cIm.lastIndexOf('/') + 1;
                                            cIm = [settings.imBase, cIm.slice(0, position), prefix,  cIm.slice(position)].join('');
                                            return cIm;
                                        }
                                    } else {
                                        return "images/default_cover.jpg";
                                    }
                                },
                                getCoverXY: function() {
                                    return {x:this.user.cimX, y:this.user.cimY};
                                },
                                setCover: function(obj) {
                                    this.user.cIm = obj.iurl;
                                    this.user.cimX = obj.cimX;
                                    this.user.cimY = obj.cimY;
                                    this.user.cImId = obj.cImId;
                                },
                                getAvatarXY: function() {
                                    return {x:this.user.pimX, y:this.user.pimY};
                                },
                                setProfileImage: function (prImg, prImId) {
                                    this.user.prIm = prImg;
                                    this.user.prImId = prImId;
                                },
                                setName: function (fn) {
                                    this.user.fn = fn;
                                },
                                setAboutMe: function (am) {
                                    this.user.am = am;
                                },
                                setHomeCity: function (hc) {
                                    this.user.hc = hc;
                                },
                                setCurrentCity: function (cc) {
                                    this.user.cc = cc;
                                },
                                setGender: function (gr) {
                                    this.user.gr=gr;
                                },
                                setBirthday: function(bd) {
                                   this.user.bDay=bd;
                                },
                                setMarriageday: function(md) {
                                   this.user.mDay=md;
                                },
                                getEmail: function(){
                                  return this.user.el;
                                },
                                getCountry: function () {
                                    return this.user.cnty;
                                },
                                friendType: function () {
                                    return this.user.ct; // 0=not friend, 1=call&chat, 2=fullprofile, 3= special friend
                                },
                                setFriendType: function(ct) {
                                    this.user.ct = ct;
                                },
                                newFriendType: function () {
                                    return this.user.nct; // 0=not friend, 1=call&chat, 2=fullprofile
                                },

                                getLink : function(attrs){
                                    var attrsStr ="";
                                    if(!!attrs){
                                        for(var key in attrs){
                                            if (attrs.hasOwnProperty(key)){
                                                attrsStr += key + '="'+attrs[key]+'" ';
                                            }
                                        }
                                    }

                                  return '<a '+attrsStr+' href="'+ this.link() +'">' + this.user.fn +'</a>';

                                },

                                resetAvatar: function() {
                                    this.user.prIm =  "images/prof.png";
                                },

                                avatarXY: function() {
                                    return {x:this.user.pimX, y:this.user.pimY};
                                },
                                getBday: function() {
                                    return this.user.bDay;
                                },
                                getUserMood: function() {
                                    //switch(user.mood) {
                                        //case 1:
                                            //return 'Available';
                                            //break;
                                        //case 2:
                                            //return 'Do not disturb';
                                            //break;
                                        //case 3:
                                            //return 'Busy';
                                            //break;
                                        //case 4:
                                            //return 'Invisible';
                                            //break;
                                        //default:
                                            return this.user.mood;
                                    //}
                                },
                                setUserMood : function(mood){
                                    this.user.mood = mood;
                                },
                                getAppType : function(){
                                    return this.user.apt;
                                },
                                setAppType : function(appType){
                                    this.user.apt = appType;
                                },
                                getDeviceToken : function(){
                                    return this.user.dt;
                                },
                                setDeviceToken : function(deviceToken){
                                    this.user.dt = deviceToken;
                                },
                                isBlocked: function() {
                                    if(this.user.cla===0 && this.user.chta===0 && this.user.fda===0){
                                        this.user.bv = 1;
                                    }else{
                                        this.user.bv = 0;
                                    }
                                    return this.user.bv;
                                },
                                setBlock: function(block) {
                                    if( block === 1 ) {
                                        var accessVal = 0;
                                    }else{
                                        var accessVal = 1
                                    }
                                    this.user.cla = accessVal;
                                    this.user.chta = accessVal;
                                    this.user.fda = accessVal;
                                    this.user.bv = block;
                                },
                                isFriend: function() {
                                    return this.user.frnS === 1;
                                },
                                unFriend: function() {
                                    this.user.frnS = 0;
                                },
                                getAccess: function() {
                                    return {
                                        chta: this.user.chta,
                                        cla: this.user.cla,
                                        fda: this.user.fda
                                    };
                                },
                                canChat: function() {
                                    if(this.user.chta === 1) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                canSeeFeed: function() {
                                    if(this.user.fda === 1) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                setOnlineStatus: function(status){
                                    this.user.psnc = status;
                                },
                                getOnlineStatus : function(){
                                    return this.user.psnc;
                                },
                                isOnline: function() {
                                    return (this.user.psnc === 2 && this.user.mood === 1);
                                },
                                onlineDevice: function() {
                                    return DEVICES[this.user.dvc];
                                },
                                getPlatform : function(){
                                  return this.user.dvc;
                                },
                                setPlatform : function(platfrom){
                                    this.user.dvc = platfrom;
                                },
                                lastOnline: function() {
                                    if(this.user.lot === 0) {
                                        return false;
                                        //return user.lot;
                                    } else {

                                        return utilsFactory.verbalDate(this.user.lot);
                                    }
                                },
                                getProfileImageId : function () {
                                    return this.user.prImId;
                                },
                                getCoverImageId : function () {
                                    return this.user.cImId;
                                },
                                // api methods
                                toggleMood: function(mood) {
                                    //console.log('mood: ' + mood);
                                    this.user.mood = mood ? 1 : 2;
                                    profileHttpService.changeMood(this.user.mood).then(function(json) {
                                        //console.log('%c' + angular.toJson(json), 'color:green');
                                        if(json.sucs !== true) {
                                            this.user.mood = json.mood;
                                        }
                                    });
                                }
                           };

                    return function (obj, isProfile, isCurrent,usersByUtId,withMfc) {
                            return new RingUser(obj,isProfile,isCurrent,usersByUtId,withMfc);
                          };

                }])
            .factory("userFactory", ['$$userMap', '$$stackedMap', function ($$userMap, $$stackedMap) {
                    var users = $$stackedMap.createNew();

                    var usersByUtId = {};

                    var prefix = "ru_";

                    var ObjectToReturn = {
                        getSortIndex: function() {
                            return 'adt';
                            //return 'fn';
                        },
                        create: function (ob, isProfile, isCurrent) {
                           //console.log(ob);
                             isProfile = !!isProfile;
                             isCurrent = !!isCurrent;

                            //console.log('user:');
                            //console.dir(ob);
                            var key, user;
                            if(angular.isObject(ob)){
                                if (ob.uId) {
                                   key = ob.uId;
                                   key = prefix + key;
                                   user = users.get(key);
                                } else if(ob.utId) {
                                    user = usersByUtId[ob.utId];
                                    if(!user)user=false;
                                }else{
                                    user = false;
                                }
                            }else{
                                   key = prefix + ob;
                                   user = users.get(key);
                            }




                            // existing user in the map?
                            if (user === false ) {
                                if (ob.utId && usersByUtId[ob.utId]){
                                    user = usersByUtId[ob.utId];
                                    key = prefix + ob.uId;
                                    users.save(key, user);
                                    user.updateUserObj(ob);
                                } else {
                                    user = $$userMap(ob, isProfile, isCurrent);
                                    if(user.getUtId()){
                                        usersByUtId[user.getUtId()] = user;
                                    }

                                }
                            } else {
                                user.updateUserObj(ob);
                            }

                          users.save(key, user);
                          return user;
                        },
                        createByUtId : function(ob,returnLite,withMfc){
                            if(!usersByUtId[ob.utId]){
                               usersByUtId[ob.utId]=$$userMap(ob,false,false,withMfc);
                            }
                            return !returnLite ? usersByUtId[ob.utId] : usersByUtId[ob.utId].getLiteUser();
                        },
                        getUser : function(key){
                            key = prefix + key;
                          return users.get(key);
                        },

                        /* get by utId */
                        getByUtId : function(utId){
                           return (utId && usersByUtId[utId]) || false;
                        },
                        getAllUtIds : function(){
                            return Object.keys(usersByUtId);
                        },
                        getUIdByUtId : function(utId){
                            return usersByUtId[utId] && usersByUtId[utId].getUId();
                        },
                        getUtIdByUId : function(uId){
                            var user;
                            try{
                                user = ObjectToReturn.getUser(uId);
                            }catch(e){
                                RingLogger.warn(e, RingLogger.tags.FRIEND);
                            }
                            return user && user.getUtId();
                        }

                    };


                    return ObjectToReturn;

                }]);

})();
