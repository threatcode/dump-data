/*
 * © Ipvision
 */


    angular.
    module('ringid.notification').
    factory('$$notiMap', $$notiMap);

    // LATER circlesManager need to be added to shared factories
		//$$notiMap.$inject = ['circlesManager', 'OPERATION_TYPES', 'Utils', 'settings'];
		$$notiMap.$inject = ['OPERATION_TYPES', 'Utils', 'settings'];
		//function $$notiMap(circlesManager, OPERATION_TYPES, Utils, settings) { //jshint ignore:line
		function $$notiMap(OPERATION_TYPES, Utils, settings) { //jshint ignore:line
			var OTYPES = OPERATION_TYPES.SYSTEM.NOTIFICATION,
                noti_defaults = {
                            acId: 0,
                            cmnId: 0,
                            fndId: 0,
                            fndN: '',
                            id: 0,
                            imgId: 0,
                            loc: 0,
                            mt: 0,
                            nfId: 0,
                            ut: 0,
                            nt: 0,
                            prIm:0,

                            message: '',
                            updateTime: '',
                            popupType: '',
                            groupId:0,
                            user: null,
							seen: false,
                            // noti merge properties
                            mayMerge: 1, // 0=no merge, 1= merge(increase counter of no of people), 2= (profile/cover update, delete older)
                            othersCounter: 0
                        };


            function setNotiMessage(noti) {
                var gName = '',
                    messageAndPopup = {
                    message: '',
                    popupType: '',
                    mayMerge: 1
                };

                function othersHandler() {
                    //if (noti.othersCounter > 1) {
                        //return ' and ' + noti.othersCounter  + ' others ';
                    //} else if (noti.othersCounter === 1){
                        //return ' and ' + noti.othersCounter  + ' other ';
                    //} else {
                        //return '';
                    //}
                    var counter = noti.uIdList.length - 1;
                    if (counter > 1) {
                        return ' and ' + counter + ' others ';
                    } else if (counter === 1){
                        return ' and ' + counter + ' other ';
                    } else {
                        return '';
                    }
                }

                switch(noti.mt) {
                    case OTYPES.MSG_TYPE_UPDATE_PROFILE_IMAGE: // update profile image
                        messageAndPopup.message =  " changed profile photo";
                        messageAndPopup.popupType = 'image';
                        messageAndPopup.mayMerge = 2;
                        break;
                    case OTYPES.MSG_TYPE_UPDATE_COVER_IMAGE: // update cover image
                        messageAndPopup.message =  " changed cover photo";
                        messageAndPopup.popupType = 'image';
                        messageAndPopup.mayMerge = 2;
                        break;
                    case OTYPES.MSG_TYPE_LIKE_IMAGE: // like image
                        messageAndPopup.message =  othersHandler() + " liked your photo";
                        messageAndPopup.popupType = 'image';
                        break;
                    case OTYPES.MSG_TYPE_IMAGE_COMMENT: // comment image
                        messageAndPopup.message =  othersHandler() +" commented on your photo";
                        messageAndPopup.popupType = 'image';
                        break;
                    case OTYPES.MSG_TYPE_LIKE_IMAGE_COMMENT: // like image comment
                        messageAndPopup.message =  othersHandler() + " liked your comment";
                        messageAndPopup.popupType = 'image';
                        break;

                    case OTYPES.MSG_TYPE_ADD_FRIEND: // add friend request
                        messageAndPopup.message =  " wants to be friends with you";
                        messageAndPopup.popupType = 'profile';
                        break;
                    case OTYPES.MSG_TYPE_ACCEPT_FRIEND: // accept friend
                        messageAndPopup.message =  " has accepted your friend request";
                        messageAndPopup.popupType = 'profile';
                        break;

                    case OTYPES.MSG_TYPE_ADD_GROUP_MEMBER: // add group member
                        // TODO DEPENDENCY_HELL
                        //if ( circlesManager.getCircle(noti.acId) ) {
                            //gName = circlesManager.getCircle(noti.acId).getName();
                        //} else {
                            //gName = '';
                        //}

                        messageAndPopup.message =  " has added you in a group " + gName;
                        messageAndPopup.popupType = 'group';
                        messageAndPopup.mayMerge = 0;
                        break;

                    case OTYPES.MSG_TYPE_ADD_STATUS_COMMENT: // add status comment
                        messageAndPopup.message =  othersHandler() + " commented on your post";
                        messageAndPopup.popupType = 'feed';
                        break;
                    case OTYPES.MSG_TYPE_LIKE_STATUS: // like status
                        messageAndPopup.message =  othersHandler() + " liked your post";
                        messageAndPopup.popupType = 'feed';
                        break;
                    case OTYPES.MSG_TYPE_LIKE_COMMENT: // like comment
                        messageAndPopup.message =  othersHandler() + " liked your comment";
                        messageAndPopup.popupType = 'feed';
                        break;
                    case OTYPES.MSG_TYPE_SHARE_STATUS: // share status
                        messageAndPopup.message =  othersHandler() + " shared your post";
                        messageAndPopup.popupType = 'feed';
                        break;

                    // media type notifications
                    case OTYPES.MSG_TYPE_LIKE_AUDIO_MEDIA :
                        messageAndPopup.message =  othersHandler() + " liked your music";
                        messageAndPopup.popupType = 'media';
                        break;
                    case OTYPES.MSG_TYPE_AUDIO_MEDIA_COMMENT :
                        messageAndPopup.message =  othersHandler() + " commented on your music";
                        messageAndPopup.popupType = 'media';
                        break;
                    case OTYPES.MSG_TYPE_LIKE_AUDIO_MEDIA_COMMENT :
                        messageAndPopup.message =  othersHandler() + " liked your comment";
                        messageAndPopup.popupType = 'media';
                        break;
                    case OTYPES.MSG_TYPE_AUDIO_MEDIA_VIEW :
                        messageAndPopup.message =  othersHandler() + " viewed your music";
                        messageAndPopup.popupType = 'media';
                        break;
                    case OTYPES.MSG_TYPE_LIKE_VIDEO_MEDIA :
                        messageAndPopup.message =  othersHandler() + " liked your video";
                        messageAndPopup.popupType = 'media';
                        break;
                    case OTYPES.MSG_TYPE_VIDEO_MEDIA_COMMENT :
                        messageAndPopup.message =  othersHandler() + " commented on your video";
                        messageAndPopup.popupType = 'media';
                        break;
                    case OTYPES.MSG_TYPE_LIKE_VIDEO_MEDIA_COMMENT :
                        messageAndPopup.message =  othersHandler() + " liked your comment";
                        messageAndPopup.popupType = 'media';
                        break;
                    case OTYPES.MSG_TYPE_VIDEO_MEDIA_VIEW :
                        messageAndPopup.message =  othersHandler() +  " viewed you video";
                        messageAndPopup.popupType = 'media';
                        break;
                    case OTYPES.MSG_TYPE_YOU_HAVE_BEEN_TAGGED :
                        messageAndPopup.message =  " tagged you in a status";
                        messageAndPopup.popupType = 'feed';
                        break;
                    default:
                        messageAndPopup.popupType = 'nomatch';
                        messageAndPopup.mayMerge = 0;

                }
                return messageAndPopup;
            }


            function RingNoti(obj) {
                this.updateNoti(obj);
                //this.setUser(obj,user);
                obj = null;
            }


            RingNoti.prototype = {
				//getSortIndex: function() {
					//return 'ut';
				//},
                updateNoti: function(notiObj) {
                    var msgPopup;
                    if (angular.isObject(notiObj)) {
                        if (this.noti) {
                            angular.extend(this.noti, notiObj);
                        } else {
                            this.noti = angular.extend({}, noti_defaults, notiObj);
                            this.noti.uIdList = [];
                        }

						this.noti.updateTime = Utils.verbalDate(this.noti.ut) || this.noti.ut;

                        msgPopup = setNotiMessage(this.noti);
                        this.noti.message = msgPopup.message;
                        this.noti.popupType = msgPopup.popupType;
                        this.noti.mayMerge = msgPopup.mayMerge;

                        // this below is needed for properly merging notifications
                        if (this.noti.fndId) {
                            this.noti.uIdList.push(this.noti.fndId);
                        }



                    } else {
                        
                        
                    }
                    notiObj = null;
                },
                sortBy: function() {
                    return this.noti.ut;
                },
                getName: function() {
                    return this.noti.fndN;
                },
                isInUidList: function(uId) {
                     return (this.noti.uIdList.indexOf(uId) > -1);
                },
                uIdList: function(uId) {
                    if (uId && uId.length) {
                        for(var i = 0; i < uId.length; i++) {
                            if (this.noti.uIdList.indexOf(uId[i]) === -1) {
                                this.noti.uIdList.push(uId[i]);
                            }
                        }
                        //uId.forEach(function(u) {
                            //if (this.noti.uIdList.indexOf(u) === -1) {
                                //this.noti.uIdList.push(u);
                            //}
                        //});
                    } else {
                        return this.noti.uIdList;
                    }
                },
                getUid: function() {
                    return this.noti.fndId;
                },
                getUserAvatar: function() {
                    if (this.noti.user) {
                        return this.noti.user.avatar('thumb');
                    } else {
                        if(this.noti.prIm){
                            var position = this.noti.prIm.lastIndexOf('/') + 1;
                            return [settings.imBase, this.noti.prIm.slice(0, position), 'pthumb',  this.noti.prIm.slice(position)].join('');
                        }else{
                            return 'images/prof.png';
                        }

                    }
                },
                getMessage: function() {
                    return this.noti.message;
                },
                getTime: function(original) {
                    if (original) {
                        return this.noti.ut;
                    } else {
                        return this.noti.updateTime;
                    }
                },
                updateNotiTime: function () {
                    this.noti.updateTime = Utils.verbalDate(this.noti.ut);
                },
                getKey: function() {
                    return this.noti.id;
                },
                getPopupType: function() {
                    return this.noti.popupType;
                },
                getMessageType: function() {
                    return this.noti.mt;
                },
                getNotiType: function() {
                    return this.noti.nt;
                },
                getActivityId: function() {
                    return this.noti.acId;
                },
                getNewsFeedId: function() {
                    return this.noti.nfId;
                },
                getLink: function() {
                    //var commentTypeNoti = [ MSG_TYPE_ADD_STATUS_COMMENT ,MSG_TYPE_LIKE_COMMENT, MSG_TYPE_ADD_COMMENT_ON_COMMENT ,MSG_TYPE_IMAGE_COMMENT ,MSG_TYPE_LIKE_IMAGE_COMMENT ];
                    var link = '', params = {};
                    switch(this.noti.popupType) {
                        case 'image':
                            params.mediaId = this.noti.imgId;
                            if(!!this.noti.cmnId){
                                params.commentId = this.noti.cmnId;
                            }

                            link = Utils.getRingRoute('SINGLE_IMAGE', params);
                            break;
                        case 'media':
                            params.mediaId = this.noti.imgId;

                            if(!!this.noti.cmnId){
                                params.commentId = this.noti.cmnId;
                            }

                            link = Utils.getRingRoute('SINGLE_MEDIA', params);
                            break;
                        case 'profile':
                            link =  Utils.getRingRoute('USER_PROFILE', { uId : this.noti.fndId });
                            break;
                        case 'group':
                            link =  Utils.getRingRoute('CIRCLE_HOME', { circleId: this.noti.acId });
                            break;
                        case 'feed':
                            params.feedId = this.noti.nfId;

                            if(!!this.noti.cmnId){
                                params.commentId = this.noti.cmnId;
                            }

                            link = Utils.getRingRoute('SINGLE_FEED', params);
                            break;
                        default:
                            link = '';
                    }
                    return link;
                },
                getImgId: function() {
                    return this.noti.imgId;
                },
                getCommentId: function() {
                    return this.noti.cmnId;
                },
                getSeenStatus: function() {
                    return this.noti.seen;
                },
                updateSeenStatus: function(seen) {
                    this.noti.seen = seen;
                },
                canMerge: function() {
                    return this.noti.mayMerge;
                },
                setNotiMessage: function(mergeCounter) {
                    this.noti.othersCounter += mergeCounter;
                    var modified = setNotiMessage(this.noti);
                    this.noti.message = modified.message;
                },
                // ringbox related api
                getRingboxTemplate: function() {
                    var templatePath = '';
                    switch(this.noti.popupType) {
                      case 'image' :
                            templatePath = 'templates/partials/notification/image-popup.html'; // IMPORTANT this template is preloaded inside auth factory
                            break;
                      case 'media' :
                            templatePath = 'templates/partials/notification/media-popup.html'; // IMPORTANT this template is preloaded inside auth factory
                            break;
                      case 'feed' :
                            templatePath = 'templates/partials/notification/feed-popup_with_image.html'; // IMPORTANT this template is preloaded inside auth factory
                            break;
                      default:
                          templatePath = '';
                    }
                    return templatePath;

                },
                getControllerName: function(){
                    return (this.noti.popupType === 'image' && 'RingBoxImageController') ||
                           (this.noti.popupType === 'feed' && 'NotiPopupController') ||
                           (this.noti.popupType === 'media' && 'RingBoxMediaController');
                },
                showRingbox: function (){
                    return this.noti.popupType === 'feed' || this.noti.popupType === 'image' || this.noti.popupType === 'media' ? true : false;
                }
            };

            return function (obj) {
                    return new RingNoti(obj);
            };
		}
