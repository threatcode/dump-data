/*
 * © Ipvision
 */


    angular
        .module('ringid.profile')
        .service('profileHttpService', profileHttpService);

    profileHttpService.$inject = [ '$$connector','OPERATION_TYPES', 'Utils'];
    function profileHttpService( $$connector, OPERATION_TYPES, Utils) { //jshint ignore:line
        var self = this, //jshint ignore:line
            OTYPES = OPERATION_TYPES.SYSTEM.PROFILE,
            REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE;


        /**
         * @api {request} /APIREQUEST/21 Get profile info
         * @apiVersion 0.1.0
         * @apiDescription Profile INfo for logged in user.
         * @apiName GetProfileInfo
         * @apiGroup Profile
         *
         * @apiParam {Number=21} actn action constant for this api call
         *
         *
         * @apiSuccess {Number=21} actn action constant for this api call
         * @apiSuccess {Number} bDay  timestamp
         * @apiSuccess {Number} mDay  timestamp
         * @apiSuccess {Number} cIm cover image
         * @apiSuccess {Number} cImId cover image id
         * @apiSuccess {string} cc current city
         * @apiSuccess {string} cnty country
         * @apiSuccess {string} fn Fullname
         * @apiSuccess {string} gr gender
         * @apiSuccess {string} prIm Profile Image
         * @apiSuccess {string} hc home city
         * @apiSuccess {array} pvc Privacy setting
         * @apiSuccess {Boolean} sucs Request successfully processed or not
         * @apiSuccess {Number} uId User Id
         *
         *
         *
         *
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
            *       acId: 0,
            *       actn: 111,
            *       cmnId: 0,
            *       headerLength: 62,
            *       imgId: 0,
            *       loc: 0,
            *       nList: [
            *           0: {
            *               acId: 0,
            *               cmnId: 0,
            *               fndId: "2000002368",
            *               fndN: "Wasif Islam",
            *               id: 368516,
            *               imgId: 14628,
            *               loc: 0mt: 1,
            *               nfId: 16103,
            *               nt: 5,
            *               ut: 1433832601723
            *           }
            *       ],
            *       nfId: 0,
            *       pckFs: 257739,
            *       pckId: "250085192336",
            *       scl: 1,
            *       seq: "4/7",
            *       sucs: true,
            *       tn: 32,
            *       tr: 32
            *     }
         *
         * @apiError Notification list not found
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
            *       "sucs": false
            *     }
         */


        // dependonUtId
        self.basicAndPrivacy = function (utId,iscurrent) {
            var payload;
            if (!iscurrent) {
                payload = {
                    actn: OTYPES.TYPE_ACTION_OTHER_USER_BASICINFO,
                    utId: utId
                };
            } else {
                payload = {
                    actn : OTYPES.TYPE_ACTION_CURRENT_USER_BASICINFO
                };
            }

            return $$connector.request(payload, REQTYPE.REQUEST);
        };

        self.getUserDetails = function (obj,withMutualFriendCount) {
            var payload = {
                actn: OTYPES.TYPE_ACTION_GET_USER_DETAILS,//204
                wmfc : !!withMutualFriendCount
            };
            angular.extend(payload, obj);

            return $$connector.request(payload, REQTYPE.REQUEST, true);// flooding true
        };



        /**
        * @api {request} /APIREQUEST/136 Check Presence of user
        * @apiVersion 0.1.0
        * @apiDescription Check Presence(i.e. online, away, offline ) of user/users
        * @apiName FriendPresence
        * @apiGroup Friends
        *
        * @apiParam {Number=136} actn
        * @apiParam {Number[]} uIds
        */
       // NO MORE USED. USE Api.user.fetchUserPresence or UserMap.fetchPresence instead
        //self.fetchPresence = function(uIds) {
            //var payload = {
                //actn: OTYPES.ACTION_USERS_PRESENCE_DETAILS,
                //uIds: uIds
            //};
            //return $$connector.send(payload, REQTYPE.REQUEST);
        //};

        self.fetchPresenceAndMood = function(fndId) {
            var payload = {
                actn: OTYPES.TYPE_ACTION_USER_MOOD_PRESENCE,
                fndId: fndId
            };
            return $$connector.request(payload, REQTYPE.REQUEST);
        };

        self.changeMood = function(mood){
            var payload = {
                actn: OTYPES.TYPE_ACTION_USER_MOOD,
                mood: mood
            };
            return $$connector.request(payload, REQTYPE.AUTHENTICATION);
        };

        self.getMutualFriends = function(friendId) {
            var payload = {
                actn: OTYPES.FETCH_FRIEND_MUTUAL_FRIEND_LIST,
                uId: friendId
            };

            return $$connector.request(payload, REQTYPE.REQUEST);
        };

        //requesting other users profile data
        //dependonUtId
        self.getUserProfileData =function(utId) {
            var payload;
            if(utId){
                payload = {
                    actn:OTYPES.TYPE_ACTION_LIST_WORK_AND_EDUCATIONS,//230 :Work-education-skill list
                    utId:utId
                };
            }else{
                payload = {
                    actn:OTYPES.TYPE_ACTION_LIST_WORK_AND_EDUCATIONS//230 :Work-education-skill list
                };
            }
            return $$connector.send(payload, REQTYPE.REQUEST);

        };


        self.updateProfile = function (userId,obj,dateObj,mobj) {

            if(mobj!==1){
                mobj = mobj.getTime();
            }
            var payload = {
                actn: OTYPES.TYPE_ACTION_MODIFY_USER_PROFILE,
                //gr: obj.gr,
                nOfHd: 7,
                fn: obj.fn.utf8Encode(),
                hc: obj.hc ? obj.hc.utf8Encode() : ' ',
                cc: obj.cc ? obj.cc.utf8Encode() : ' ',
                gr: obj.gr,
                am: obj.am.utf8Encode(),
                bDay: dateObj ? dateObj.getTime() : 1,
                mDay: mobj
            };
            return $$connector.request(payload, REQTYPE.UPDATE);

        };


        self.updateProfilePrivacy = function () {
            var payload = {
                actn: OTYPES.TYPE_ACTION_MODIFY_PRIVACY_SETTINGS,
                pvc:[
                    3,3,3,3,3
                ]
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        //self.frndSuggestion = function(obj){
            //var payload = {
                //actn:OTYPES.ACTION_UPDATE_LOGIN_SETTINGS,
                //sn:obj.sn,
                //sv:obj.sv
            //};
            //return $$connector.request(obj, REQTYPE.REQUEST);
        //};

        self.submitNewEducation = function(obj) {

            var payload = {
                actn: OTYPES.TYPE_ACTION_ADD_EDUCATION,
                request_type:REQTYPE.UPDATE,
                edu : {
                    af : 1,
                    cntn : obj.cntn? obj.cntn.utf8Encode() : '',
                    desc : obj.desc ? obj.desc.utf8Encode() : '',
                    dgr :  obj.dgr ? obj.dgr.utf8Encode() : '',
                    grtd : obj.grtd,
                    iss : obj.iss,
                    scl : obj.scl.utf8Encode(),
                    ft : obj.ft ? obj.ft : 1,
                    tt : obj.tt ? obj.tt : 1,
                    ut : 0
                }
            };
            return $$connector.request(payload, REQTYPE.UPDATE);

        };

        self.deleteEducation = function(id) {
            var payload = {
                actn: OTYPES.TYPE_ACTION_REMOVE_EDUCATION,
                id : id
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.updateEducationById = function (obj) {
            var payload = {
                actn: OTYPES.TYPE_ACTION_UPDATE_EDUCATION,
                edu:{
                    id: obj.id,
                    scl: obj.scl.utf8Encode(),
                    ft: obj.ft ? obj.ft : 1,
                    tt: obj.tt ? obj.tt : 1,
                    desc: obj.desc ? obj.desc.utf8Encode() : "",
                    af: obj.af,
                    grtd: obj.grtd,
                    iss: obj.iss,
                    cntn: obj.cntn ? obj.cntn.utf8Encode() : "",
                    dgr: obj.dgr ? obj.dgr.utf8Encode() : ""
                }
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.getAllSkill = function() {
            var payload = {
                actn: 230
            };
            return $$connector.request(payload, REQTYPE.REQUEST);
        };

        self.submitNewSkill = function(obj) {
            var payload = {
                actn: OTYPES.TYPE_ACTION_ADD_SKILL,
                skill:
                {
                    skl : obj.skl.utf8Encode(),
                    desc: obj.desc.utf8Encode()
                }
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.updateSkill = function(obj) {
            var payload = {
                actn: OTYPES.TYPE_ACTION_UPDATE_SKILL,
                skill:{
                    id  : obj.id,
                    skl : obj.skl.utf8Encode(),
                    desc: obj.desc.utf8Encode()
                }

            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.deleteSkill = function(sid) {
            var payload = {
                actn: OTYPES.TYPE_ACTION_REMOVE_SKILL,
                id  : sid
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };


        self.submitNewWork = function(obj) {
            var payload = {
                actn     : OTYPES.TYPE_ACTION_ADD_WORK,
                request_type:REQTYPE.UPDATE,
                wrk      :{
                    pstn  :obj.pstn ? obj.pstn.utf8Encode() : '',
                    desc  :obj.desc ? obj.desc.utf8Encode() :'',
                    //ct    :obj.ct ? obj.ct.utf8Encode() :'',
                    cnm   :obj.cnm.utf8Encode(),
                    tt    :obj.tt || 1,
                    ft    :obj.ft || 1
                }
            };
            return $$connector.request(payload, REQTYPE.UPDATE);

        };

        self.updateWork = function (obj) {
            var payload = {
                actn     : OTYPES.TYPE_ACTION_UPDATE_WORK,
                wrk:{
                    id       : obj.id,
                    pstn     : obj.pstn.utf8Encode(),
                    cnm      : obj.cnm.utf8Encode(),
                    desc     : obj.desc.utf8Encode(),
                    //ct       : obj.ct.utf8Encode(),
                    tt       :obj.tt || 1,
                    ft       :obj.ft || 1
                }

            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.deleteWork = function (workid) {
            var payload = {
                actn: OTYPES.TYPE_ACTION_REMOVE_WORK,
                id  : workid
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.changeProfilePicture = function(obj) {
            var payload = {
                    actn: OTYPES.TYPE_CHANGE_PROFILE_PIC,
                    type: 1,
                    imT: 2,
                    pimX : obj.pimX,
                    pimY : obj.pimY,
                    ih: obj.ih,
                    iw: obj.iw,
                    iurl: obj.iurl,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.changeCoverPicture = function(obj) {
            var payload = {
                    actn: OTYPES.TYPE_CHANGE_COVER_PIC, // 103
                    type: 1,
                    imT: 3,
                    cimX : obj.cimX,
                    cimY : obj.cimY,
                    ih: obj.ih,
                    iw: obj.iw,
                    iurl: obj.iurl
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };


        self.changePassword = function (oldPass,newPass) {
            var payload = {
                actn: OTYPES.CHANGE_PASSWORD,
                oPw:oldPass,
                nPw:newPass
            };
            return $$connector.request(payload, REQTYPE.UPDATE);

        };

        self.sendCode = function(obj){
            var payload = {
                actn: OTYPES.SEND_VERIFICATION_CODE_TO_MAIL,//221
                el: obj.email
            };

            return $$connector.request(payload, REQTYPE.REQUEST);
        };


        self.verifyCode = function (obj) {
            var payload = {
                actn:OTYPES.SEND_VERIFICATION_CODE_TO_MAIL,//221,
                el:obj.email,
                vc:obj.code
            };
            return $$connector.request(payload, REQTYPE.REQUEST);
        };


        //self.verifyCheck = function(){
            //var payload = {
                //actn:OTYPES.PHN_MAIL_VERIFICATION_CHECK//28
            //};
            //return $$connector.request(payload, REQTYPE.REQUEST);
        //};


        self.changePrivacy = function(obj) {
            var payload = {
                actn: obj.utId,
                sn:obj.sn,
                sv:obj.sv
            };

            if (obj.hasOwnProperty('utId')) {
                payload.utId = obj.utId;
            }
            return $$connector.request(payload, REQTYPE.UPDATE, true);
        };

        self.saveCallPvcEdit = function (obj) {
            var payload = {
                actn:obj.actn,
                sn:obj.sn,
                sv:obj.sv
            };
            if(!obj.isCurrent){
                payload.utId = obj.utId;
            }
            return $$connector.request(payload, REQTYPE.UPDATE,true);
        };

        self.saveChatPvcEdit = function (obj) {
            var payload = {
                actn:obj.actn,
                sn:obj.sn,
                sv:obj.sv
            };
            if(!obj.isCurrent){
                payload.utId = obj.utId;
            }
            return $$connector.request(payload, REQTYPE.UPDATE,true);
        };

        self.saveFeedPvcEdit = function (obj) {
            var payload = {
                actn:obj.actn,
                sn:obj.sn,
                sv:obj.sv
            };
            if(!obj.isCurrent){
                payload.utId = obj.utId;
            }
            return $$connector.request(payload, REQTYPE.UPDATE,true);
        };

        self.addSocialAccount = function(obj) {
            var payload = {
                actn: OTYPES.ADD_SOCIAL_NETWORK,
                it : obj.access_token,
                smid: obj.id,
                wk: Utils.getUniqueID() // webserver dependency
            };

            if (obj.platform === 'facebook') {
                payload.smt = 4;
            } else if (obj.platform === 'twitter') {
                payload.smt = 5;
            }

            return $$connector.request(payload, REQTYPE.AUTHENTICATION);

        };

        self.saveAchatSetting = function (obj) {
            var payload = {
                actn:OTYPES.TYPE_CHANGE_PRIVACY,
                sn:obj.sn,
                sv:obj.sv
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.saveAinfndreqSettings = function (obj) {
            var payload = {
                actn:OTYPES.TYPE_CHANGE_PRIVACY,
                sn:obj.sn,
                sv:obj.sv
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.saveAfamSettings = function (obj) {
            var payload = {
                actn:OTYPES.TYPE_CHANGE_PRIVACY,
                sn:obj.sn,
                sv:obj.sv
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.saveAafSetting = function (obj) {
            var payload = {
                actn:OTYPES.TYPE_CHANGE_PRIVACY,
                sn:obj.sn,
                sv:obj.sv
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };
    }
