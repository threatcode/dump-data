/*
 * © Ipvision
 */
    angular
        .module('ringid.profile')
        .service('profileFactory', profileFactory);

    profileFactory.$inject = ['$routeParams', 'Storage', 'Auth', '$$connector','$$q', 'Ringalert',
        'profileHttpService','userFactory','OPERATION_TYPES', 'fileUploadService', 'Utils'];

    function profileFactory($routeParams, Storage, Auth, $$connector, $q, Ringalert, // jshint ignore:line
                            profileHttpService, userFactory,OPERATION_TYPES, fileUploadService, Utils) {

        var OTYPES = OPERATION_TYPES.SYSTEM.PROFILE,
            _profile = Auth.currentUser(),
            _otherProfile = {},
            _profileData = {};


        function _addEducation(education, utId) {
            var educationObj = education;

            educationObj.fromTime = new Date(educationObj.ft);
            educationObj.toTime = new Date(educationObj.tt);

            educationObj.fromTimeE = Utils.profileVerbalDate(educationObj.ft);

            educationObj.toTimeE = Utils.profileVerbalDate(educationObj.tt);
            _profileData[utId].educationList.push(educationObj) ;
        }

        function _addWork(work, utId) {
            var workObj = work;
            workObj.fromTime = new Date(workObj.ft);
            workObj.toTime = new Date(workObj.tt);

            if(workObj.tt===0){
                workObj.status = true;
                workObj.date_info = 'Present';
            }else{
                workObj.toTimeE = Utils.profileVerbalDate(workObj.tt);
            }
            workObj.fromTimeE = Utils.profileVerbalDate(workObj.ft);
            _profileData[utId].workList.push(workObj);
        }

        function _addSkill(skill, utId) {
            var skillObj = skill;

            _profileData[utId].skillList.push(skillObj);

        }

        function _setProfileData(type, data, utId) {
            if (_profileData.hasOwnProperty(utId)) {
                switch(type) {
                    case 'educationList':
                        _addEducation(data, utId);
                         break;
                    case 'workList':
                        _addWork(data, utId);
                        break;
                    case 'skillList':
                        _addSkill(data, utId);
                        break;
                    default:
                }
                //_profileData[utId][type].push(data);
            }
        }

        function _getProfileData(whatData, utId) {
            if (_profileData.hasOwnProperty(utId)) {
                return _profileData[utId][whatData];
            } else {
                return [];
            }
        }

        function _removeProfileData(utId) {
            delete _profileData[utId];
        }


        var _processResponse = function(json) {
            var i;
            switch(json.actn) {
                //case OTYPES.ACTION_USERS_PRESENCE_DETAILS_DATA:
                    //// update user presence detail
                    //
                    //
                    //if(json.sucs === true) {
                        //userFactory.create(json); //{psnc: json.psnc, lot: json.lot, uId: json.uId, dvc: json.dvc};
                    //}
                    //break;
                // case OTYPES.TYPE_ACTION_GET_WORK:
                //     if (json.sucs === true) {
                //         for(i=0; i<json.workList.length; i++) {
                //             _addWork(json.workList[i], json.workList[i].utId);
                //         }
                //     } else {
                //         
                //         
                //     }
                //     break;
                // case OTYPES.TYPE_ACTION_GET_EDUCATION:
                //     if (json.sucs === true) {
                //         for(i=0; i<json.educationList.length; i++) {
                //             _addEducation(json.educationList[i], json.educationList[i].utId);
                //         }
                //     } else {
                //         
                //         
                //     }
                //     break;
                // case OTYPES.TYPE_ACTION_GET_SKILL:
                //     if (json.sucs === true) {
                //         for(i=0; i<json.skillList.length; i++) {
                //             _addSkill(json.skillList[i], json.skillList[i].utId);
                //         }
                //     } else {
                //         
                //         
                //     }
                //     break;
               //default:
            }
        };

        $$connector.subscribe(_processResponse, {
            action: [
                //OTYPES.ACTION_USERS_PRESENCE_DETAILS,
                OTYPES.ACTION_USERS_PRESENCE_DETAILS_DATA,
                // OTYPES.TYPE_ACTION_GET_WORK,
                // OTYPES.TYPE_ACTION_GET_EDUCATION,
                // OTYPES.TYPE_ACTION_GET_SKILL
            ]
        });

        function getProfile (uId) {
            if( !_profile ) {
                _profile = Auth.currentUser();
            }
            if (uId === _profile.getKey()) {
                return _profile;
            } else {
                _otherProfile = userFactory.create({uId: uId});
                return _otherProfile;
            }

        }

        function init(user) {

            var defer = $q.defer();

            //if (!user.isCurrentUser()) {
                // request for presence details
                //profileHttpService.fetchPresence([user.getKey()]);
            //}
            profileHttpService.basicAndPrivacy(user.getUtId(), user.isCurrentUser()).then(function(response) {
                if (response.sucs === true) {
                    if (user.isCurrentUser()) {
                        _profile = userFactory.create(angular.extend({}, response, {uId: user.getKey()}), true, true);
                    } else {
                        _otherProfile = userFactory.create(response.userDetails, true, false);
                        profileHttpService.fetchPresenceAndMood(user.getKey()).then(function(json) {
                            _otherProfile.updateUserObj(json);
                        });
                    }
                    defer.resolve();
                } else {
                    defer.reject();
                }
            });

            return defer.promise;
        }


        // BELOW TWO FUNCTIONS NO MORE USED. USE userFactory requestUserDetails or Api factory getUserDetails
        //function getUserDetailsByUId (uId){
            //var deferred = $q.defer(),
                //user = userFactory.getUser(uId);
            //uId = uId || $routeParams.uId;
            //
            //if( !user ){

                //
                //var userObj = userFactory.create({uId : uId});
                //profileHttpService.getUserDetails({uId : uId}).then(function(response){
                    //
                    //if(!!response.sucs){
                        //userObj = userFactory.create(response.userDetails);
                        //deferred.resolve(userObj);
                    //}else{
                        //
                        ////deferred.resolve(false);
                        //deferred.reject(false);
                    //}
                //});


            //}else{
                //
                //deferred.resolve(user);
            //}


            //return deferred.promise;
        //}

        //function getUserObjectByUId(uId, callback){

            //var userObj = userFactory.getUser(uId);

            //if( !userObj){

                //userObj = userFactory.create({uId : uId});

                //profileHttpService.getUserDetails({uId : uId}).then(function(response){
                    //if(!!response.sucs){
                        //userFactory.create(response.userDetails);
                        //if( !!callback){
                            //callback.call(this);
                        //}
                    //}
                //});
            //}


            //return userObj;
        //}

        function getMutualFriends(friendId) {
            profileHttpService.getMutualFriends(friendId).then(function(response) {
                if(response.sucs === true) {
                    _otherProfile.updateUserObj({nmf: response.mfIDs.length});
                    //for(var i=0;i< json.mfIDs.length;i++){
                        //friend = User.createByUtId({utId: json.mfIDs[i]});
                        //$scope.friends.add(friend.getKey(), friend);
                    //}
                }
            },function() {
            });
        }

        // get user profile details i.e. skill, work, edu etc
        function getUserProfileData(obj, isCurrent) {
            var user;
            if(isCurrent) {
                user = _profile;
            }else{
                user = userFactory.create(obj);
            }

            // only call for details if not called already
            if (!_profileData.hasOwnProperty(user.getUtId()) ) {
                _profileData[user.getUtId()] = {
                    workList: [],
                    educationList : [],
                    skillList: []
                };
                if (isCurrent) {
                    profileHttpService.getUserProfileData();
                } else {
                    profileHttpService.getUserProfileData(user.getUtId());
                }
            }
        }



        function changeProfilePicture  (obj) {
            var defer = $q.defer();
            if (!obj) {
                // existing image
                obj = {
                    iurl: _profile.avatar('iurl')
                };
            }
            // for getting cimx and cimy
            obj = angular.extend({}, obj, fileUploadService.getReposition('profilephoto'));
            profileHttpService.changeProfilePicture(obj).then(function (data) {
                if (data.sucs === true) {
                    Storage.updateLoginData('prIm', obj.iurl);
                    Storage.updateLoginData('prImId', data.imgId);
                    _profile.setProfileImage(obj.iurl, data.imgId);

                    defer.resolve(data);
                } else {
                    defer.reject(data);
                }
            }, function(errData) {
                defer.reject(errData);
            });
            return defer.promise;
        }

        function changeCoverPicture  (obj) {
            var defer = $q.defer();
            if (!obj) {
                // existing image
                obj = {
                    iurl: _profile.getCover('iurl')
                };
            }
            // for getting cimX and cimY
            obj = angular.extend({}, obj, fileUploadService.getReposition('coverphoto'));
            profileHttpService.changeCoverPicture(obj).then(function (data) {
                if (data.sucs) {
                    _profile.setCover(angular.extend(obj, {cImId: data.imgId}));
                    defer.resolve();
                } else {
                    defer.reject();
                }
            }, function(errData) {
                  defer.reject();
            });
            return defer.promise;
        }


        return {
            // api
            init: init,
            getProfile: getProfile,
            //getUserDetailsByUId: getUserDetailsByUId,
            //getUserObjectByUId : getUserObjectByUId,
            getMutualFriends: getMutualFriends,
            getUserProfileData: getUserProfileData,

            changeProfilePicture: changeProfilePicture,
            changeCoverPicture: changeCoverPicture,

            updateUserProfile: profileHttpService.updateProfile,
            savePvcEdit: profileHttpService.updateUserPrivacy,
            submitNewEducation: profileHttpService.submitNewEducation,

            saveAchatSetting:profileHttpService.saveAchatSetting,
            saveAinfndreqSettings:profileHttpService.saveAinfndreqSettings,
            saveAfamSettings:profileHttpService.saveAfamSettings,
            saveAafSetting:profileHttpService.saveAafSetting,

            getProfileData: _getProfileData,
            setProfileData: _setProfileData,
            removeProfileData: _removeProfileData,
            deleteEducation: profileHttpService.deleteEducation,
            getAllEducation: profileHttpService.getEducationData,
            updateEducation: profileHttpService.updateEducationById,

            submitNewSkill: profileHttpService.submitNewSkill,
            updateSkill: profileHttpService.updateSkill,
            deleteSkill: profileHttpService.deleteSkill,

            submitNewWork: profileHttpService.submitNewWork,
            updateWork: profileHttpService.updateWork,
            deleteWork: profileHttpService.deleteWork,

            changePassword: profileHttpService.changePassword,
            verifyCheck: profileHttpService.verifyCheck,
            sendCode: profileHttpService.sendCode,
            verifyCode: profileHttpService.verifyCode,

            changePrivacy: profileHttpService.changePrivacy,
            saveCallPvcEdit: profileHttpService.saveCallPvcEdit,
            saveChatPvcEdit: profileHttpService.saveChatPvcEdit,
            saveFeedPvcEdit: profileHttpService.saveFeedPvcEdit,
            moodChange: profileHttpService.moodChange,

            addSocialAccount: profileHttpService.addSocialAccount

        };

    }
