/**
 * © Ipvision
 */


    angular.module('ringid.shared')
            .factory('CommentHttpService', CommentHttpService)
            .controller('CommentsController', CommentsController)
            .directive('rgComments', rgComments)
            .directive('rgImageComments', rgImageComments);
    CommentHttpService.$inject = ['$$connector', 'OPERATION_TYPES']
    function CommentHttpService($$connector, OPERATION_TYPES) {
        var OTYPES = OPERATION_TYPES.SYSTEM, ob;
        ob = {
            getComment: getComment,
            getComments: getComments,
            // likeUnlike : likeUnlike,
            addComment: addComment,
            updateComment: updateComment,
            deleteComment: deleteComment,
            //  fetchWhoLikes : fetchWhoLikes,
            getUpdateFilter: getUpdateFilter
        };
        /**
         * @descripion : for failure test this code can be blocked after testing
         * @return {[type]} [description]
         */
        // function fakePromise(){
        //     var defer = $q.defer();
        //     setTimeout(function(){
        //         defer.reject({
        //             sucs : false,
        //             mg : "not processed successfully"
        //         });
        //     });
        //     return defer.promise;
        //  }



        function getComment(ob) {
            var payload = {};
            switch (ob.type) {
                case 'feed':
                    payload.cmntT = 1;
                    payload.nfId = ob.key;
                    break;
                case 'image':
                    payload.cmntT = 2;
                    payload.imgId = ob.key;
                    break;
                case 'media':
                    payload.cmntT = 3;// note : make sure for media its three
                    payload.cntntId = ob.key;
                    break;
                default:
                    throw new Error("comment type not familiar");
            }
            payload.actn = OTYPES.ACTION_GET_FULL_COMMENT;
            payload.cmnId = ob.commentId;
            return $$connector.request(payload, OTYPES.REQUEST_TYPE.REQUEST);
        }
        function getComments(ob, timeOffset, before) {
            var scl,
                    payload = {};
            if (!ob.key || !ob.type) {
                throw new Error("key and type must needed for fetcing comment");
            }
            switch (ob.type) {
                case 'feed':
                    payload.actn = OTYPES.TYPE_COMMENTS_FOR_STATUS;
                    payload.nfId = ob.key;
                    break;
                case 'image':
                    payload.actn = OTYPES.IMAGE.TYPE_COMMENTS_FOR_IMAGE;
                    payload.imgId = ob.key;
                    if (ob.target.getFeedKey()) {
                        payload.nfId = ob.target.getFeedKey();
                    }
                    break;
                case 'media':
                    payload.actn = OTYPES.MEDIA.ACTION_MEDIA_COMMENT_LIST;
                    payload.cntntId = ob.key;
                    if (ob.target.getFeedKey()) {
                        payload.nfId = ob.target.getFeedKey();
                    }
                    break; // check for media fetch comment
                default:
                    throw new Error("comment type not familiar");
            }

            if (timeOffset) {
                // 1 for b efore currentTm Comments, 2 for bellow currentTm Comments note : but in this case somehow its inverse lol
                payload.scl = !!before ? before : 1;
                payload.tm = timeOffset;
            } else {
                payload.st = ob.st || 0;
            }
            return $$connector.pull(payload, OTYPES.REQUEST_TYPE.REQUEST,true);
        }
        // function likeUnlike(ob){
        //     var payload = {};
        //         switch(ob.type){
        //             case 'feed':
        //                 payload.actn = ob.il ? OTYPES.TYPE_LIKE_COMMENT : OTYPES.TYPE_UNLIKE_COMMENT;
        //                 payload.nfId = ob.key;
        //                 break;
        //             case 'image':
        //                 payload.actn = OTYPES.IMAGE.TYPE_LIKE_UNLIKE_IMAGE_COMMENT;
        //                 payload.imgId = ob.key;
        //                 payload.lkd = ob.il;
        //                 if(ob.target.getFeedKey()){
        //                   payload.nfId = ob.target.getFeedKey();
        //                 }
        //                 break;
        //             case 'media':
        //                 payload.actn = OTYPES.MEDIA.ACTION_LIKE_UNLIKE_MEDIA_COMMENT;
        //                 payload.cntntId= ob.key;
        //                 payload.lkd = ob.il;
        //                 if(ob.target.getFeedKey()){
        //                   payload.nfId = ob.target.getFeedKey();
        //                 }
        //                 break;
        //             default:
        //                throw new Error("comment type not familiar");
        //          };
        //     payload.cmnId = ob.commentId;
        //     return $$connector.request(payload,OTYPES.REQUEST_TYPE.UPDATE);
        //  }
        function addComment(ob) {
            var payload = {};
            switch (ob.type) {
                case 'feed':
                    payload.actn = OTYPES.TYPE_ADD_STATUS_COMMENT;
                    payload.nfId = ob.key;
                    break;
                case 'image':
                    payload.actn = OTYPES.IMAGE.TYPE_ADD_IMAGE_COMMENT;
                    payload.imgId = ob.key;
                    if (ob.target.getFeedKey()) {
                        payload.nfId = ob.target.getFeedKey();
                    }
                    break;
                case 'media':
                    payload.actn = OTYPES.MEDIA.ACTION_ADD_COMMENT_ON_MEDIA;
                    payload.cntntId = ob.key;
                    if (ob.target.getFeedKey()) {
                        payload.nfId = ob.target.getFeedKey();
                    }
                    break;
                default:
                    throw new Error("comment type not familiar");
            }
            payload.cmn = ob.text.utf8Encode();
            return $$connector.request(payload, OTYPES.REQUEST_TYPE.UPDATE,true);
        }
        function updateComment(ob) {
            var payload = {};
            switch (ob.type) {
                case 'feed':
                    payload.actn = OTYPES.TYPE_EDIT_STATUS_COMMENT;
                    payload.nfId = ob.key;
                    break;
                case 'image':
                    payload.actn = OTYPES.IMAGE.TYPE_EDIT_IMAGE_COMMENT;
                    payload.imgId = ob.key;
                    break;
                case 'media':
                    payload.actn = OTYPES.MEDIA.ACTION_EDIT_COMMENT_ON_MEDIA;
                    payload.cntntId = ob.key;
                    break;
                    //case 'media':break; // check for media fetch comment
                default:
                    throw new Error("comment type not familiar");
            }
            payload.cmnId = ob.commentId;
            payload.cmn = ob.text.utf8Encode();
            ;
            return $$connector.request(payload, OTYPES.REQUEST_TYPE.UPDATE);
        }
        function deleteComment(ob) {
            var payload = {};
            switch (ob.type) {
                case 'feed':
                    payload.actn = OTYPES.TYPE_DELETE_STATUS_COMMENT;
                    payload.nfId = ob.key;
                    break;
                case 'image':
                    payload.actn = OTYPES.IMAGE.TYPE_DELETE_IMAGE_COMMENT;
                    payload.imgId = ob.key;
                    break;
                case 'media':
                    payload.actn = OTYPES.MEDIA.ACTION_DELETE_COMMENT_ON_MEDIA;
                    payload.cntntId = ob.key;
                    break;
                    //case 'media':break; // check for media fetch comment
                default:
                    throw new Error("comment type not familiar");
            }
            payload.cmnId = ob.commentId;
            return $$connector.request(payload, OTYPES.REQUEST_TYPE.UPDATE,true);
        }
        // function fetchWhoLikes(ob){
        //     var payload = {};
        //     switch(ob.type){
        //         case 'feed':
        //             payload.actn = OTYPES.TYPE_LIST_LIKES_OF_COMMENT;
        //             payload.nfId = ob.key;
        //             break;
        //         case 'image':
        //             payload.actn = OTYPES.IMAGE.TYPE_IMAGE_COMMENT_LIKES;
        //             payload.imgId = ob.key;
        //             if(ob.target.getFeedKey()){
        //                payload.nfId = ob.target.getFeedKey();
        //             }
        //             break;
        //         case 'media':
        //             payload.actn = OTYPES.MEDIA.ACTION_MEDIACOMMENT_LIKE_LIST;
        //             payload.cntntId = ob.key;
        //             if(ob.target.getFeedKey()){
        //                   payload.nfId = ob.target.getFeedKey();
        //             }
        //             break;
        //         //case 'media':break; // check for media fetch comment
        //         default:
        //            throw new Error("comment type not familiar");
        //      }
        //     payload.cmnId = ob.commentId;
        //     return $$connector.pull(payload,OTYPES.REQUEST_TYPE.REQUEST);
        //  }



        function getUpdateFilter(type, value) {
            var mainActionsSet, key,
                    actionUpdateFeedSet = [OTYPES.TYPE_UPDATE_ADD_STATUS_COMMENT, OTYPES.TYPE_UPDATE_LIKE_COMMENT, OTYPES.TYPE_UPDATE_UNLIKE_COMMENT, OTYPES.TYPE_UPDATE_DELETE_STATUS_COMMENT, OTYPES.TYPE_UPDATE_EDIT_STATUS_COMMENT],
                    actionUpdateImageSet = [OTYPES.IMAGE.TYPE_UPDATE_ADD_IMAGE_COMMENT, OTYPES.IMAGE.TYPE_UPDATE_LIKE_UNLIKE_IMAGE_COMMENT, OTYPES.IMAGE.TYPE_UPDATE_EDIT_IMAGE_COMMENT, OTYPES.IMAGE.TYPE_UPDATE_DELETE_IMAGE_COMMENT],
                    actionUpdateMediaSet = [OTYPES.MEDIA.ACTION_UPDATE_ADD_MEDIA_COMMENT, OTYPES.MEDIA.ACTION_UPDATE_LIKE_UNLIKE_MEDIA_COMMENT, OTYPES.MEDIA.ACTION_UPDATE_EDIT_MEDIA_COMMENT, OTYPES.MEDIA.ACTION_UPDATE_DELETE_MEDIA_COMMENT];
            switch (type) {
                case 'feed' :
                    mainActionsSet = actionUpdateFeedSet;
                    key = 'nfId';
                    break;
                case 'image' :
                    mainActionsSet = actionUpdateImageSet;
                    key = 'imgId';
                    break;
                case 'media' :
                    mainActionsSet = actionUpdateMediaSet;
                    key = 'cntntId';
                    break;
                default :
                    return [1111111];// a never matching action
            }
            ;
            return function (message) {
                return mainActionsSet.indexOf(message.actn) !== -1 && message[key] === value;
            }
        }



        return ob;
    }

    CommentsController.$inject = ['$scope', '$$connector', 'Ringalert', 'Utils', 'CommentHttpService', 'Auth',
        '$$stackedMap', '$$commentMap', 'rgDropdownService', 'OPERATION_TYPES', 'rgScrollbarService', 'feedFactory', 'SystemEvents']

    function CommentsController($scope, $$connector, Ringalert, Utils, CommentHttpService, Auth,
            $$stackMap, $$commentMap, rgDropdownService, OPERATION_TYPES, rgScrollbarService, feedFactory, SystemEvents) {

        var commentSubsriberKey, OTYPES = OPERATION_TYPES.SYSTEM, loadingTimeout, firstTimeChangedTarget = false;
        $scope.comments = $$stackMap.createNew(true, 'asc');//comment map for feed initialization//$scope.target.getComments();// every
        $scope.loadingComment = false;
        $scope.canComment = true;
        $scope.commentEditorEnabled = false;
        $scope.commentKey = '';
        $scope.commenttext = '';
        $scope.ddCommentHtml = 'templates/dropdowns/comment-edit-dropdown.html';//$templateCache.get('comment-edit-dropdown.html');
        $scope.previousComment = !!$scope.target.getTotalComment();
        $scope.afterComment = true;
        $scope.models = {
            commentedittext: ""
        };
        $scope.currentUser = Auth.currentUser();
        $scope.openRingboxLike = function (comment) {
            return comment.getTotalLikes() > 0;
        }
        $scope.loadMoreComment = loadMoreComment;
        $scope.loadPreviousComment = loadPreviousComment;
        $scope.addComment = addComment;
        $scope.updateComment = updateComment;

        if ($scope.commentType === 'feed' && $scope.target.isSingleContentFeed()) {
            if ($scope.target.getMedias().length() || $scope.target.getAudios().length()) {
                $scope.likeType = 'media';
            } else if ($scope.target.getImages(true).length()) {
                $scope.likeType = 'image';
            }
            $scope.parentKey = $scope.target.getSingleContent().getKey();
        } else {
            $scope.likeType = $scope.commentType;
            $scope.parentKey = $scope.target.getKey();
        }

        //  $scope.like = likeUnlikeComment;
        //    $scope.fetchWhoLikes = fetchWhoLikes;
        $scope.hideScroll = !!$scope.hideScroll && $scope.hideScroll !== 'false';
        $scope.showPreviousButton = function () {
            return ($scope.target.getTotalComment() > $scope.comments.length() && $scope.previousComment) && !$scope.loadingComment;
        };
        $scope.showMoreButton = function () {
            return ($scope.target.getTotalComment() > $scope.comments.length() && $scope.afterComment) && !$scope.loadingComment;
        };
        $scope.cancelEdit = function () {
            $scope.commentEditorEnabled = false;
            safeDigest()
        };
        $scope.commentContentEdit = function (com) {
            return function () {
                return com.getDynamicText();
            };
        };
        $scope.actionCommentDropdown = function (actionObj) {
            rgDropdownService.close(actionObj.event);
            //actionObj.event.preventDefault();
            switch (actionObj.action) {
                case 'edit':
                    //console.log('edit');
                    enableCommentEditor(actionObj.commentMap.getKey(), actionObj.commentMap.text());
                    break;
                case 'delete':
                    //console.log(actionObj.commentInfo);
                    deleteComment(actionObj.commentMap);
                    break;
                default:
            }
            // $scope.$parent.$rgDigest();
        };

        //replaced
        function safeDigest() {
            if ($scope.$parent && $scope.$parent.$id !== 1) {
                $scope.$parent.$rgDigest();
            } else {
                $scope.$rgDigest();
            }
        }
        function enableCommentEditor(commentKey, commentText) {
            if (commentKey) {
                $scope.commentEditorEnabled = true;
                $scope.commentKey = commentKey;
                $scope.models.commentedittext = commentText;
                safeDigest();
            }
        }
        ;

        function setLoading(val) {
            $scope.loadingComment = val;
            if (loadingTimeout) {
                window.clearTimeout(loadingTimeout);
                loadingTimeout = undefined;
            }
        }



        function setupInitials() {
            commentSubsriberKey = $$connector.subscribe(function (json) {
                switch (json.actn) {
                    case OTYPES.TYPE_UPDATE_ADD_STATUS_COMMENT :
                    case OTYPES.IMAGE.TYPE_UPDATE_ADD_IMAGE_COMMENT :
                    case OTYPES.MEDIA.ACTION_UPDATE_ADD_MEDIA_COMMENT :
                        pushComments({comments: [json]});
                        break;
                    case OTYPES.TYPE_UPDATE_EDIT_STATUS_COMMENT:
                    case OTYPES.IMAGE.TYPE_UPDATE_EDIT_IMAGE_COMMENT:
                    case OTYPES.MEDIA.ACTION_UPDATE_EDIT_MEDIA_COMMENT:
                        var com = $scope.comments.get(json.cmnId);
                        if (com) {
                            com.setComment(json.cmn);
                        }
                        break;
                    case OTYPES.TYPE_UPDATE_LIKE_COMMENT:
                    case OTYPES.TYPE_UPDATE_UNLIKE_COMMENT:
                    case OTYPES.IMAGE.TYPE_UPDATE_LIKE_UNLIKE_IMAGE_COMMENT:
                    case OTYPES.MEDIA.ACTION_UPDATE_LIKE_UNLIKE_MEDIA_COMMENT:
                        var com = $scope.comments.get(json.cmnId);
                        if (com) {
                            com.incomingLike(json.loc);
                        }
                        break;
                    case OTYPES.TYPE_UPDATE_DELETE_STATUS_COMMENT:
                    case OTYPES.IMAGE.TYPE_UPDATE_DELETE_IMAGE_COMMENT:
                    case OTYPES.MEDIA.ACTION_UPDATE_DELETE_MEDIA_COMMENT:
                        $scope.comments.remove(json.cmnId);

                }
                ;
                safeDigest();
            }, {
                filter: CommentHttpService.getUpdateFilter($scope.commentType, $scope.target.getKey())
            });
            $scope.$on("$destroy", function () {
                if (commentSubsriberKey) {
                    $$connector.unsubscribe(commentSubsriberKey);
                }
                commentSubsriberKey = false;
            });
        }


        function loadPreviousComment(force) {
            var comment, timeOffset = false;
            if ($scope.comments.length()) {
                comment = $scope.comments.getByIndex(0);
                timeOffset = comment.getTimestamp();
            }
            fetchComments(timeOffset, 2, force);
        }
        function processPreviousComment(json) {
            var arr = [], lowestComment;
            if (!json.comments) {
                return;
            }
            if (json.comments.length > 5 && $scope.target.getTotalComment() > ($scope.comments.length() + json.comments.length)) {
                json.comments.sort(function (a, b) {
                    return a.tm > b.tm ? 1 : -1;
                });
                json.comments.splice(0, 1);
                pushComments({comments: json.comments});
                $scope.previousComment = true;
            } else {
                $scope.previousComment = false;
                pushComments(json);
            }
        }

        function loadMoreComment() {
            var timeOffset = false;
            if (parseInt($scope.activeCommentId) > 0) {
                var comment;
                if ($scope.comments.length()) {
                    comment = $scope.comments.getByIndex(($scope.comments.length() - 1));
                    timeOffset = comment.getTimestamp();
                }
            }
            fetchComments(timeOffset, 1);
        }

        function processAfterComment(json) {
            var arr = [], lowestComment;
            if (!json.comments) {
                return;
            }
            if (json.comments.length > 5 && $scope.target.getTotalComment() > ($scope.comments.length() + json.comments.length)) {
                json.comments.sort(function (a, b) {
                    return a.tm < b.tm ? 1 : -1;
                });
                json.comments.splice(0, 1);
                pushComments({comments: json.comments});
                $scope.afterComment = true;
            } else {
                $scope.afterComment = false;
                pushComments(json);
            }
        }
        function initialCommentRequest() {
            if (parseInt($scope.activeCommentId) > 0) {
                var type = $scope.commentType, target = $scope.target;

                if ($scope.commentType === 'feed' && $scope.target.isSingleContentFeed()) {
                    target = $scope.target.getSingleContent();
                    type = $scope.target.getContentType();
                }
                CommentHttpService.getComment({
                    key: target.getKey(),
                    type: type,
                    commentId: parseInt($scope.activeCommentId)

                }).then(function (json) {
                    if (json.sucs) {
                        pushComments({comments: [json.cmntDTO]});
                        loadMoreComment();
                        setTimeout(function () {
                            loadPreviousComment(true);
                        }, 500);

                    } else {
                        $scope.activeCommentId = 0;
                        fetchComments();
                    }
                    safeDigest();
                }, function (reason) {
                    fetchComments();
                });
            } else {
                fetchComments();
                $scope.afterComment = false;
            }
        }
        function fetchComments(timeOffset, before, force) {
            if (!$scope.target.getTotalComment() || ((before === 2 && !$scope.showPreviousButton()) || (before === 1 && !$scope.showMoreButton())) && !force) {
                RingLogger.print("fetched all comments or already loading or no comments", 'rgcomments');
                return;
            }
            setLoading(true);
            var type = $scope.commentType, target = $scope.target;

            if ($scope.commentType === 'feed' && $scope.target.isSingleContentFeed()) {
                target = $scope.target.getSingleContent();
                type = $scope.target.getContentType();
            }

            loadingTimeout = setTimeout(setLoading.bind($scope, false),
                    3000);
            CommentHttpService.getComments({
                key: target.getKey(),
                type: type,
                st: $scope.comments.length(),
                target: target
            }, timeOffset, before).then(function (json) {
                if (json.sucs) {
                    if (parseInt($scope.activeCommentId)) {
                        if (before === 2) { // previous comment
                            processPreviousComment(json);
                        } else { // after comment
                            processAfterComment(json);
                        }
                    } else {
                        pushComments(json);
                    }
                }
                setLoading(false);
                safeDigest();
                $scope.$emit(SystemEvents.RINGBOX.UPDATE);
            }, function (json) {
            }, function (json) {
            });
            safeDigest();
        }
        function pushComments(message) {
            var commentMap, i;
            for (i = 0; i < message.comments.length; i++) {
                commentMap = $$commentMap.create(message.comments[i]);
                $scope.comments.save(commentMap.getKey(), commentMap);
            }
        }

        // function faildAddComment(){
        //        $scope.comments.remove(cmnId);
        //        $scope.canComment = true;
        //        Ringalert.show(json,'error');
        //        $scope.commenttext = text;
        //        safeDigest();
        // }

        function addComment() {
            var text = $scope.commenttext, cmnId, commData, target = $scope.target, type = $scope.commentType;
            $scope.canComment = false;
            if (validateComment()) {
                cmnId = Utils.getUniqueID();//generating unique key for further identification
                commData = {
                    cmnId: cmnId,
                    cmn: text,
                    deleted: false,
                    isNew: true,
                    edited: false,
                    //nfId: key,
                    pending: true// setting status pending to showing 50% opacity
                };
                if ($scope.commentType === 'feed' && $scope.target.isSingleContentFeed()) {
                    target = $scope.target.getSingleContent();
                    type = $scope.target.getContentType();
                }
                $scope.comments.add(cmnId, $$commentMap.create(commData, $scope.currentUser));
                CommentHttpService.addComment({
                    key: target.getKey(),
                    type: type,
                    text: text,
                    target: target
                }).then(function (json) {
                    if (json.sucs === true) {
                        $scope.comments.remove(cmnId);
                        commData.cmnId = json.cmnId;
                        commData.pending = false;
                        angular.extend(json, commData);
                        var comment = $$commentMap.create(json, $scope.currentUser);
                        $scope.comments.add(comment.getKey(), comment);
                        $scope.target.setTotalComment(json.loc, 1);
                        if ($scope.commentType === 'feed' && $scope.target.isSingleContentFeed()) {
                            target.setTotalComment(json.loc, 1);
                        } else if ($scope.commentType !== 'feed') {
                            var sc = feedFactory.synchComment($scope.target.getFeedKey(), json.loc, 1);
                            sc && sc.$rgDigest();
                        }
                        $scope.canComment = true;
                        $scope.commenttext = "";
                        safeDigest();
                        rgScrollbarService.scrollTo($scope, ".com-" + comment.getKey());
                        rgScrollbarService.recalculate($scope);
                        $scope.$emit(SystemEvents.RINGBOX.UPDATE);
                    } else {
                        $scope.comments.remove(cmnId);
                        $scope.canComment = true;
                        Ringalert.show(json, 'error');
                        $scope.commenttext = text;
                        safeDigest();
                    }
                    ;

                }, function (reason) {
                    $scope.comments.remove(cmnId);
                    $scope.canComment = true;
                    Ringalert.show(reason, 'error');
                    $scope.commenttext = text;
                    safeDigest();
                });

                rgScrollbarService.scrollTo($scope, ".com-" + cmnId);
                rgScrollbarService.recalculate($scope);

            }

        }
        function updateComment(comment) {
            if (!comment.user().isCurrentUser()) {
                $scope.commentEditorEnabled = false;
                return;
            }
            var text = $scope.models.commentedittext.trim(),
                    type = $scope.commentType,
                    target = $scope.target,
                    oldText = comment.text();
            comment.setComment(text);
            comment.isPending(true);
            if ($scope.commentType === 'feed' && $scope.target.isSingleContentFeed()) {
                target = $scope.target.getSingleContent();
                type = $scope.target.getContentType();
            }
            if (text !== '') {
                CommentHttpService.updateComment({
                    key: target.getKey(),
                    type: type,
                    commentId: comment.getKey(),
                    text: $scope.models.commentedittext
                }).then(function (json) {
                    if (!json.sucs) {
                        comment.setComment(oldText);
                        Ringalert.show(json, 'error');
                    }
                    comment.isPending(false);
                    $scope.models.commentedittext = "";
                    safeDigest();
                    $scope.$emit(SystemEvents.RINGBOX.UPDATE);
                }, function (reason) {
                    comment.setComment(oldText);
                    Ringalert.show(json, 'error');
                    safeDigest();
                });
                $scope.commentEditorEnabled = false;
            } else {
                Ringalert.show("Please write something", 'error');
                // show the error message
            }
            safeDigest();
        }
        ;

        // function likeUnlikeComment(comm){
        //     var il = comm.like(true);

        //     CommentHttpService.likeUnlike({
        //         key : $scope.target.getKey(),
        //         type : $scope.commentType,
        //         commentId : comm.getKey(),
        //         il : il,
        //         target : $scope.target
        //     }).then(function(json){
        //         if(!json.sucs){
        //             comm.like(true);
        //             Ringalert.show(json, 'error');
        //         }

        //     },function(reason){
        //         comm.like(true);
        //         Ringalert.show(reason, 'error');
        //     });
        // }
        function deleteComment(comm) {
            var type = $scope.commentType, target = $scope.target;
            comm.isPending(true);
            if ($scope.commentType === 'feed' && $scope.target.isSingleContentFeed()) {
                target = $scope.target.getSingleContent();
                type = $scope.target.getContentType();
            }
            CommentHttpService.deleteComment({
                key: target.getKey(),
                type: type,
                commentId: comm.getKey()
            }).then(function (json) {
                if (json.sucs) {
                    $scope.comments.remove(json.cmnId);
                    $scope.target.setTotalComment(json.loc, json.ic);
                    if ($scope.commentType === 'feed' && $scope.target.isSingleContentFeed()) {
                        target.setTotalComment(json.loc, json.ic);
                    } else if ($scope.commentType !== 'feed') {
                        var sc = feedFactory.synchComment($scope.target.getFeedKey(), json.loc, json.ic);
                        sc && sc.$rgDigest();
                    }
                    //todo : decrease the target nc by one
                } else {
                    comm.isPending(false);
                    Ringalert.show(json, 'error');
                }
                safeDigest();
                $scope.$emit(SystemEvents.RINGBOX.UPDATE);
            }, function (json) {
                comm.isPending(false);
                Ringalert.show(json, 'error');
                safeDigest();
            });
            safeDigest();
        }
        // function fetchWhoLikes(comment) {
        //     var defer = $q.defer(),dorequest = true;
        //     if (comment.getTotalLikes() === comment.getWhoLikes().length) {
        //             $timeout(function(){
        //                 defer.resolve({sucs: true});
        //             });
        //             dorequest = false;
        //     }
        //     if(dorequest){
        //         CommentHttpService.fetchWhoLikes({
        //             key : $scope.target.getKey(),
        //             type : $scope.commentType,
        //             commentId : comment.getKey(),
        //             target : $scope.target
        //         }).then(function(json){
        //             if (json.sucs === true) {
        //                 var likes = json.likes || [];
        //                 for (var i = 0; i < likes.length; i++) {
        //                     comment.incomingWhoLikes(likes[i]);
        //                 }
        //                 defer.resolve(json);
        //             } else {
        //                 defer.reject(json);
        //             }
        //         },function(reason){
        //             defer.reject(reason);
        //         });
        //     }
        //         return {
        //             data: function () {
        //                 return {
        //                     target: comment
        //                 };
        //             },
        //             promise: defer.promise
        //         };
        //  }

        function validateComment() {
            if ($scope.commenttext.length < 1) {
                $scope.commentErrorClass = "inputerror";
                $scope.canComment = true;
                return false;
            } else {
                $scope.commentErrorClass = "";
                return true;
            }
        }

        $scope.$watch('showCommentBox', function (newVal) {
            if (newVal) {
                if (!commentSubsriberKey) {
                    setupInitials();
                }
                if (!$scope.comments.length()) {
                    initialCommentRequest();
                }
            }
        });

        $scope.$watch('target.getKey()', function (newVal) { // for popup image changes
            if (firstTimeChangedTarget) {
                if (commentSubsriberKey) {
                    $$connector.unsubscribe(commentSubsriberKey);
                    setupInitials();
                    $scope.comments.reset();
                }
                if (!$scope.comments.length()) {
                    initialCommentRequest();
                }
            }
            firstTimeChangedTarget = true;

        });

    }
    function rgComments() {
        return {
            restrict: 'E',
            controller: CommentsController,
            scope: {
                target: '=',
                showCommentBox: '=',
                commentType: '@', // string feed,image,media
                commentOrder: '@', // comment order asc|desc
                activeCommentId: '@', // specific comment id
                hideScroll: '@' // show the scrollbar or not
            },


            //templateUrl: 'templates/partials/comments.html'
			template :  '<div class="feed_comment"><div rg-scrollbar="scrollbar()" disabled="{{::hideScroll}}" ng-class="!hideScroll ? \'comm-scroll-height\':\'\'"><ul class="media-list"><li class="item b-none bd" style="border:none" ng-show="showPreviousButton()"><div class="float-right gray font-12 margin-10"><a class="view_more" rg-click="loadPreviousComment()">load previous comments</a></div><div class="clear"></div></li><li class="item com-{{::comment.getKey()}}" rg-repeat="comm in comments.all() track by comm.key" ng-init="comment = comm.value" ng-class="{ half_opacity:comment.isPending(),comment_blink: (comment.getKey() == activeCommentId)}"><div class="comment-area"><div class="pro_img_bg_30 mar-right-10" style="flex:none"><a ng-href="{{comment.user().link()}}"><img ng-src="{{ comment.user().avatar(\'thumb\')}}" alt=""></a></div><div class="comm-p"><p class="unm"><a ng-href="{{comment.user().link()}}">{{comment.user().getName()}}</a></p><p class="comment_text" ng-hide="(commentEditorEnabled && commentKey == comment.getKey())" ng-bind-html="comment.getDynamicText()"></p><p ng-if="(commentEditorEnabled && commentKey == comment.getKey())"><span class="comment"><rg-editor class="editor" editor-content="$parent.models.commentedittext" new-line="false" on-enter="$parent.updateComment" on-enter-arg="comment" on-escape="cancelEdit" edit-mode="$parent.commentContentEdit(comment)" show-emoji="true" focus="$parent.$parent.commentEditorEnabled" placeholder="Write your comment..."></rg-editor><span class="esc-to-cancel">Press Esc to <a rg-click="cancelEdit()">cancel</a></span></span></p><ul class="comment_like_menu" ng-hide="comment.isPending() || (commentEditorEnabled && commentKey == comment.getKey())"><li rg-likes="" like-type="{{::likeType}}" target="comment" target-parent="parentKey" target-owner="target.getFeedKey()" like-comment="true"></li><li class="mar-top-7 feed-m"><span class="time"><i class="img_sprite icon-dt-ico w-h-13"></i>{{comment.time()}}</span></li></ul></div><div class="comm-sett"><div ng-show="target.user().isCurrentUser() || comment.user().isCurrentUser()" class="" style="position: relative"><div rg-dropdown="dropdown()" dd-html="ddCommentHtml" dd-control="{comment:comment,target:target}" dd-action="actionCommentDropdown" ng-class="target.user().isCurrentUser() || comment.user().isCurrentUser() ? \'img_sprite w-h-13 icon-ds-arrow\' : \'\'" class="ico-f arrow-b"></div></div></div><div class="clear"></div></div></li></ul></div><div ng-show="loadingComment" style="text-align:center;margin-top:10px"><div class="loader-s"><div class="lr1"></div><div class="lr2"></div><div class="lr3"></div></div></div><div class="item b-none" style="border:none" ng-show="showMoreButton()"><div class="float-right gray font-12 margin-10"><a class="view_more" rg-click="loadMoreComment()">More comments</a></div><div class="clear"></div></div><div ng-if="target.getTotalComment() > comments.length()" class="divider"></div><div class="mar-top-10"><div class="comment-w" ng-class="commentErrorClass"><div class="comment-editor"><rg-editor class="editor" editor-content="commenttext" new-line="false" on-enter="addComment" show-emoji="true" is-disabled="!canComment" focus="showCommentBox" placeholder="Write something...."></rg-editor></div></div></div></div>'










			                    };

    }
    function rgImageComments() {
        return {
            restrict: 'E',
            controller: CommentsController,
            scope: {
                target: '=',
                showCommentBox: '=',
                commentType: '@', // string feed,image,media
                commentOrder: '@', // comment order asc|desc
                activeCommentId: '@' // specific comment id
            },

            //templateUrl: 'templates/partials/image-comments.html'
			template :  '<div class="feed-comment-wrapper" style="height:calc(100% - 165px)"><div class="feed_comment" rg-scrollbar="scrollbar()"><ul class="feed-img-l"><li class="item b-none" style="border:none" ng-show="showPreviousButton()"><div class="float-right gray font-12 margin-10"><a class="view_more" rg-click="loadPreviousComment()">load previous comments</a></div><div class="clear"></div></li><li class="item pv-item com-{{::comment.getKey()}}" ng-repeat="comm in comments.all()" ng-init="comment = comm.value" ng-class="{ half_opacity:comment.isPending(),active: (comment.getKey() == activeCommentId) }"><div class="comment-area"><div class="pro_img_bg_30 mar-right-10" style="flex:none"><img ng-src="{{::comment.user().avatar(\'thumb\')}}" alt=""></div><div class="comm-p"><p class="unm"><a ng-href="{{::comment.user().link()}}">{{::comment.user().getName()}}</a></p><p class="txt_justify" ng-hide="(commentEditorEnabled && commentKey == comment.getKey())" ng-bind-html="comment.getDynamicText()"></p><p ng-if="(commentEditorEnabled && commentKey == comment.getKey())"><span class="comment"><rg-editor class="editor" editor-content="$parent.models.commentedittext" new-line="false" on-enter="$parent.updateComment" on-enter-arg="comment" on-escape="$parent.cancelEdit" edit-mode="$parent.commentContentEdit(comment)" show-emoji="true" focus="$parent.commentEditorEnabled" placeholder="Write something...." style="width: 94%"></rg-editor><span class="esc-to-cancel">Press Esc to <a rg-click="$parent.cancelEdit()">cancel</a></span></span></p><ul class="comment_like_menu" ng-hide="comment.isPending() || (commentEditorEnabled && commentKey == comment.getKey())"><li rg-likes="" like-type="{{::commentType}}" target="comment" target-parent="target.getKey()" target-owner="target.getFeedKey()" like-comment="true"></li><li class="mar-left-60"><span class="time"><i class="img_sprite icon-dt-ico w-h-13"></i> {{comment.time()}}</span></li></ul></div><div class="comm-sett"><div ng-show="target.user().isCurrentUser() || comment.user().isCurrentUser()" class=""><div rg-dropdown="dropdown()" dd-html="ddCommentHtml" dd-control="{comment:comment,target:target}" dd-action="actionCommentDropdown" ng-class="target.user().isCurrentUser() || comment.user().isCurrentUser() ? \'img_sprite w-h-13 icon-ds-arrow\' : \'\'" class="ico-f arrow-b"></div></div></div><div class="clear"></div></div></li><li ng-show="loadingComment" class="loader-s"><div class="lr1"></div><div class="lr2"></div><div class="lr3"></div></li><li class="item b-none" style="border:none" ng-show="showMoreButton()"><div class="float-right gray font-12 margin-10"><a class="view_more" rg-click="loadMoreComment()">More comments</a></div><div class="clear"></div></li></ul></div><div class="pv-c-top"><div class="width-100-percent"><div class="pv-pro float-left"><img ng-src="{{::currentUser.avatar(\'thumb\')}}" alt=""></div><div class="comment-w" style="width:85%" ng-class="commentErrorClass"><div class="comment-editor popimgcmnt-box"><rg-editor class="editor" editor-content="commenttext" new-line="false" on-enter="addComment" show-emoji="true" is-disabled="!canComment" focus="showCommentBox" placeholder="Write something...."></rg-editor></div></div></div></div></div>'










			                    };
    }

