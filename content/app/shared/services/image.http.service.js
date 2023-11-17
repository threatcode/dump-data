/*
 * © Ipvision
 */


     angular
        .module('ringid.shared')
        .service('imageHttpService', imageHttpService);

        imageHttpService.$inject = ['$$q', 'settings', '$$connector', 'OPERATION_TYPES'];
        function imageHttpService($q, settings, $$connector, OPERATION_TYPES){ // jshint ignore:line
            var self = this, //jshint ignore:line
                REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE,
                OTYPES = OPERATION_TYPES.SYSTEM.IMAGE;


            self.fetchAlbumList = function(fndId) {
                var payload = {};
                if(fndId) {
                    payload.actn = OTYPES.FETCH_FRIEND_ALBUM_LIST;
                    payload.fndId = fndId;
                } else {
                        payload.actn = OTYPES.FETCH_ALBUM_LIST;
                }
                $$connector.send(payload, REQTYPE.REQUEST);
            };


            /**
            * @api {request} /APIREQUEST/97,109 Get Photos of Album
            * @apiVersion 0.1.0
            * @apiDescription Fetches photos of 3 predefined albums( profileImages, coverImages, feed Images/default)
            * @apiName GetAlbumImages
            * @apiGroup Image
            *
            * @apiParam {Number=97,109} actn TYPE_ALBUM_IMAGES / TYPE_FRIEND_ALBUM_IMAGES
            * @apiParam {Number} [fndId] Friend uId in case of friends photos
            * @apiParam {String='profileImages', 'coverImages', 'default'} albId Album id. predefined for three types of albums
            * @apiParam {Number} st=0 Pagination
            *
            *
            * @apiSuccess {Number} actn TYPE_FRIEND_ALBUM_IMAGES
            * @apiSuccess {String='default','coverImages','profileImages'} Album Id
            * @apiSuccess {Object[]{1..5}} imageList Image list
            * @apiSuccess {Boolean} sucs Request successfully processed or not
            * @apiSuccess {Number} timg No of total Images in Album
            * @apiSuccess {Number} tr No of Image in response
            *
            * @apiSuccess (imageList) {String} cptn Caption
            * @apiSuccess (imageList) {Number=0,1} ic Image have User's comment or not
            * @apiSuccess (imageList) {Number} ih Image height
            * @apiSuccess (imageList) {Number=0,1} il Image have User's Like or not
            * @apiSuccess (imageList) {Number} imT Image Type
            * @apiSuccess (imageList) {Number} imgId Image Id
            * @apiSuccess (imageList) {Number} iw Image Width
            * @apiSuccess (imageList) {Number} nc No of Comments
            * @apiSuccess (imageList) {Number} nl No of Likes
            * @apiSuccess (imageList) {Number} tm Image upload time
            *
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 97
            *       albId: "default"
            *       headerLength: 20
            *       imageList:  [
            *           0: {
            *               cptn: ""
            *               ic: 0
            *               ih: 183
            *               il: 0
            *               imT: 1
            *               imgId: 16343
            *               iurl: "2000001794/1435711880942.jpg"
            *               iw: 275
            *               nc: 0
            *               nl: 0
            *               tm: 1435732845444
            *           }
            *       ]
            *       pckId: "895751887743"
            *       seq: "2/2"
            *       sucs: true
            *       timg: 14
            *       tr: 10
            *     }
            *
            * @apiError Album has no Image
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 200 Not Found
            *     {
            *       "sucs": false
            *     }
            */

            self.getAlbumImages = function (obj) {
                var payload = {};
                if (obj.fndId) {
                    payload.actn = OTYPES.TYPE_FRIEND_ALBUM_IMAGES; // 109
                    payload.fndId  = obj.fndId;
                } else {
                    payload.actn = OTYPES.TYPE_ALBUM_IMAGES; // 97
                }
                payload.st = obj.st || 0;
                payload.albId = obj.albId;

                //return $$connector.pull(payload, REQTYPE.REQUEST, true);
                $$connector.send(payload, REQTYPE.REQUEST, true);
            };


            /**
            * @api {request} /APIREQUEST/89 Get Image Comments
            * @apiVersion 0.1.0
            * @apiDescription Fetches Comments for an Image
            * @apiName GetImageComments
            * @apiGroup Image
            *
            * @apiParam {Number=89} actn TYPE_COMMENTS_FOR_IMAGE
            * @apiParam {Number} imgId Image Id
            * @apiParam {Number} st=0 Pagination
            *
            * @apiSuccess {Number=89} actn TYPE_COMMENTS_FOR_IMAGE
            * @apiSuccess {Object[]{1..5}} comments Comment list
            * @apiSuccess {Number} imgId Image Id
            * @apiSuccess {Boolean} sucs Request successfully processed or not
            *
            * @apiSuccess (comments) {String} cmn Comment Text
            * @apiSuccess (comments) {Number} cmnId Comment Id
            * @apiSuccess (comments) {String} fn User Name
            * @apiSuccess (comments) {il=1,0} il Image have User's Like or not
            * @apiSuccess (comments) {String} prIm Image Url
            * @apiSuccess (comments) {Number} sc Undefined
            * @apiSuccess (comments) {Number} tl Total Like
            * @apiSuccess (comments) {Number} tm Image upload time
            * @apiSuccess (comments) {Number} uId User uId
            *
            *
            *
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 89
            *       comments: [
            *           0: {
            *               cmn: "more comments"
            *               cmnId: 2328
            *               fn: "Spirit Walker"
            *               il: 0
            *               prIm: "2000001794/1428886675955.jpg"
            *               sc: false
            *               tl: 0
            *               tm: 1435747371055
            *               uId: "2000001794"
            *           }
            *       ]
            *       headerLength: 60
            *       imgId: 16339
            *       pckFs: 1161342
            *       pckId: "574746651601"
            *       seq: "1/1"
            *       sucs: true
            *
            *     }
            *
            * @apiError Image has no Comments
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 404 Not Found
            *     {
            *       "sucs": false
            *     }
            */

            // self.getComments = function(obj) {
            //     var payload = {
            //             actn: OTYPES.TYPE_COMMENTS_FOR_IMAGE,
            //             imgId: obj.imgId,
            //             st: obj.st || 0
            //     };
            //     return $$connector.request(payload, REQTYPE.REQUEST);
            // };

            self.deleteImage = function(imgId) {
                return $$connector.request({
                    actn: OTYPES.DELETE_IMAGE,
                    imgIds: [imgId]
                }, REQTYPE.UPDATE);
            };


            // self.getCommentById = function(imgId, commentId) {
            //     $$connector.request({
            //         actn: OTYPES.ACTION_GET_FULL_COMMENT,
            //         imgId: imgId,
            //         cmnId: commentId,
            //         cmntT: 2 // 1=feed comment, 2= image comment

            //     },OTYPES.REQUEST_TYPE.REQUEST);
            // };



            /**
            * @api {request} /APIREQUEST/93 Get Image Likes (INCOMPLETE OR UNUSED)
            * @apiVersion 0.1.0
            * @apiDescription Fetches Likes for an Image
            * @apiName GetImageLikes
            * @apiGroup Image
            *
            * @apiParam {Number=93} actn TYPE_LIKES_FOR_IMAGE
            * @apiParam {Number} imgId Image Id
            * @apiParam {Number} st=0 Pagination
            *
            * @apiSuccess {Number} actn TYPE_FRIEND_ALBUM_IMAGES
            * @apiSuccess {String='default','coverImages','profileImages'} Album Id
            * @apiSuccess {Object[]{1..5}} imageList Image list
            * @apiSuccess {Boolean} sucs Request successfully processed or not
            * @apiSuccess {Number} timg No of total Images in Album
            * @apiSuccess {Number} tr No of Image in response
            *
            *
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 97
            *       albId: "default"
            *       headerLength: 20
            *       pckId: "895751887743"
            *       seq: "2/2"
            *       sucs: true
            *       timg: 14
            *       tr: 10
            *     }
            *
            * @apiError Album has no Image
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 404 Not Found
            *     {
            *       "sucs": false
            *     }
            */

            // self.getLikes = function(obj) {
            //     var payload = {
            //         actn: OTYPES.TYPE_LIKES_FOR_IMAGE,
            //             imgId: obj.imgId,
            //             st: obj.st || 0
            //     };
            //     return $$connector.request(payload, REQTYPE.REQUEST);
            // };



            /**
            * @api {request} /APIREQUEST/121 Get Image Details
            * @apiVersion 0.1.0
            * @apiDescription Get Image Details, i.e who owns, album, no of likes, comments etc
            * @apiName GetImageDetails
            * @apiGroup Image
            *
            * @apiParam {Number=121} actn TYPE_IMAGE_DETAILS
            * @apiParam {Number} imgId Image Id
            *
            *
            * @apiSuccess {Number=121} actn TYPE_IMAGE_DETAILS
            * @apiSuccess {String='default','coverImages','profileImages'} Album Id
            * @apiSuccess {String} albn Album Name i.e. Feed Images, Profile Images, Cover images etc
            * @apiSuccess {String} cptn Caption
            * @apiSuccess {String} fn User Name
            * @apiSuccess {Number=0,1} ic Image have User's comment or not
            * @apiSuccess {Number} ih Image height
            * @apiSuccess {Number=0,1} il Image have User's Like or not
            * @apiSuccess {Number} imT Image Type
            * @apiSuccess {Number} imgId Image Id
            * @apiSuccess {String} iurl Image Url
            * @apiSuccess {Number} iw Image Width
            * @apiSuccess {Number} nc No of Comments
            * @apiSuccess {Number} nl No of Likes
            * @apiSuccess {Boolean} sucs Request successfully processed or not
            * @apiSuccess {Number} tm Image time
            * @apiSuccess {Number} uId User Id
            *
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 121
            *       albId: "default"
            *       albn: "Feed Photos"
            *       cptn: ""
            *       fn: "Spirit Walker"
            *       headerLength: 53
            *       ic: 1
            *       ih: 153
            *       il: 0
            *       imT: 1
            *       imgId: 16339
            *       iurl: "2000001794/1435711441058.jpg"
            *       iw: 300
            *       nc: 2
            *       nl: 0
            *       pckId: "745902702948"
            *       sucs: true
            *       tm: 1435732409019
            *       uId: "2000001794"
            *     }
            *
            */

            self.getImageDetails = function(imgId){
             return  $$connector.request({
                    actn :OTYPES.TYPE_IMAGE_DETAILS,
                    imgId : imgId
                }, REQTYPE.REQUEST);

            };



            /**
            * @api {UPDATE} /APIREQUEST/185 Like/Unlike Image
            * @apiVersion 0.1.0
            * @apiDescription Request to Like or Unlike Image
            * @apiName ImageLikeUnlike
            * @apiGroup Image
            *
            * @apiParam {Number=185} actn TYPE_LIKE_IMAGE
            * @apiParam {Number} imgId Image Id
            * @apiParam {Number=0,1} ikd I like(0)/unlike(1)
            *
            *
            * @apiSuccess {Number=185} actn TYPE_LIKE_IMAGE
            * @apiSuccess {Number} imgId Image Id
            * @apiSuccess {String} mg Message
            * @apiSuccess {Boolean} sucs Request successfully processed or not
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 185
            *       headerLength: 53
            *       imgId: 16339
            *       nfId : 1511
            *       pckId: "770981966122"
            *       sucs: true
            *     }
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 404 Not Found
            *     {
            *       actn: 185
            *       headerLength: 53
            *       imgId: 16339
            *       mg: "Unable to post like/unlike."
            *       pckId: "770981966122"
            *       sucs: false
            *     }
            */


            // self.toggleLike = function(imgId, lkd,nfId) {
            //     var payload = {
            //         actn: OTYPES.TYPE_LIKE_IMAGE,
            //         imgId : imgId,
            //         lkd : lkd
            //     };
            //     if(nfId){
            //         payload.nfId = nfId;
            //     }
            //     return $$connector.request(payload,  REQTYPE.UPDATE );
            // };

            /**
            * @api {UPDATE} /APIREQUEST/180 Comment On Image
            * @apiVersion 0.1.0
            * @apiDescription Request to Add Comment to Image
            * @apiName ImageAddComment
            * @apiGroup Image
            *
            * @apiParam {Number=180} actn TYPE_ADD_IMAGE_COMMENT
            * @apiParam {Number} imgId Image Id
            * @apiParam {String} cmn Comment Text
            *
            *
            * @apiSuccess {Number=180} actn TYPE_ADD_IMAGE_COMMENT
            * @apiSuccess {String} cmn Comment Text
            * @apiSuccess {Number} cmnId Comment Id
            * @apiSuccess {String} fn User Name
            * @apiSuccess {Number} imgId Image Id
            * @apiSuccess {Number} loc Undefined
            * @apiSuccess {Boolean} sc Undefined
            * @apiSuccess {Boolean} sucs Request successfully processed or not
            * @apiSuccess {Number} tm Comment Time
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 180
            *       cmn: "test comment"
            *       cmnId: 2330
            *       fn: "Spirit Walker"
            *       headerLength: 53
            *       imgId: 16339
            *       loc: 3
            *       pckId: "794680017483"
            *       sc: false
            *       sucs: true
            *       tm: 1435752098339
            *     }
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 404 Not Found
            *     {
            *       sucs: false
            *     }
            */
            // self.addComment = function(imgId, comment) {
            //     return $$connector.request({
            //         actn : OTYPES.TYPE_ADD_IMAGE_COMMENT,
            //         imgId : imgId,
            //         cmn : comment.utf8Encode()
            //     }, REQTYPE.UPDATE);
            // };

            /**
            * @api {UPDATE} /APIREQUEST/194 Edit Comment
            * @apiVersion 0.1.0
            * @apiDescription Request to Edit Comment
            * @apiName ImageEditComment
            * @apiGroup Image
            *
            * @apiParam {Number=194} actn TYPE_EDIT_IMAGE_COMMENT
            * @apiParam {Number} imgId Image Id
            * @apiParam {Number} cmnId Comment Id
            * @apiParam {String} cmn Comment Text
            *
            *
            * @apiSuccess {Number=194} actn TYPE_EDIT_IMAGE_COMMENT
            * @apiSuccess {String} cmn Comment Text
            * @apiSuccess {Number} cmnId Comment Id
            * @apiSuccess {String} fn User Name
            * @apiSuccess {Number} imgId Image Id
            * @apiSuccess {Boolean} sc Undefined
            * @apiSuccess {Boolean} sucs Request successfully processed or not
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 194
            *       cmn: "comment again dsfasfas"
            *       cmnId: 2322
            *       fn: "Spirit Walker"
            *       headerLength: 54
            *       imgId: 16340
            *       pckId: "1083486106462"
            *       sc: false
            *       sucs: true
            *     }
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 200 Not Found
            *     {
            *       actn: 194
            *       sucs: false
            *     }
            */
            // self.updateComment = function(imgId, cmnId, cmn) {
            //     return $$connector.request({
            //             actn : OTYPES.TYPE_EDIT_IMAGE_COMMENT,
            //             imgId : imgId,
            //             cmnId :cmnId,
            //             cmn: cmn.utf8Encode()
            //         }, REQTYPE.UPDATE );
            // };

            /**
            * @api {UPDATE} /APIREQUEST/182 Delete Image Comment
            * @apiVersion 0.1.0
            * @apiDescription Request to Delete Image Comment
            * @apiName ImageDeleteComment
            * @apiGroup Image
            *
            * @apiParam {Number=182} actn TYPE_DELETE_IMAGE_COMMENT
            * @apiParam {Number} imgId Image Id
            * @apiParam {Number} cmnId Comment Id
            *
            *
            * @apiSuccess {Number=182} actn TYPE_DELETE_IMAGE_COMMENT
            * @apiSuccess {Number} cmnId Comment Id
            * @apiSuccess {Number} imgId Image Id
            * @apiSuccess {Number} loc Undefined
            * @apiSuccess {Boolean} sc Undefined
            * @apiSuccess {Boolean} sucs Request successfully processed or not
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 182
            *       cmnId: 2322
            *       headerLength: 53
            *       imgId: 16340
            *       loc: 1
            *       pckId: "234858749621"
            *       sc: false
            *       sucs: true
            *     }
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 200 Not Found
            *     {
            *       actn: 182
            *       sucs: false
            *     }
            */
            // self.deleteComment = function(imgId, cmnId) {
            //     return $$connector.request({
            //         actn : OTYPES.TYPE_DELETE_IMAGE_COMMENT,
            //         imgId : imgId,
            //         cmnId :cmnId
            //     }, REQTYPE.UPDATE);
            // };

            /**
            * @api {UPDATE} /APIREQUEST/197 Like/Unlike Image Comment
            * @apiVersion 0.1.0
            * @apiDescription Request to Like or Unlike Image Comment
            * @apiName ImageCommentLikeUnlike
            * @apiGroup Image
            *
            * @apiParam {Number=197} actn TYPE_LIKE_UNLIKE_IMAGE_COMMENT,
            * @apiParam {Number} imgId Image Id
            * @apiParam {Number} cmnId Comment Id
            * @apiParam {Number=0,1} lkd I like(0)/unlike(1) Comment
            *
            *
            * @apiSuccess {Number=185} actn TYPE_LIKE_UNLIKE_IMAGE_COMMENT,
            * @apiSuccess {Number} cmnId Comment Id
            * @apiSuccess {Number} id Undefined
            * @apiSuccess {Number} imgId Image Id
            * @apiSuccess {Number=0,1} lkd Like/Unlike value
            * @apiSuccess {Number} loc Undefined
            * @apiSuccess {Boolean} sucs Request successfully processed or not
            * @apiSuccess {Number} tm Image time
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 197
            *       cmnId: 2321
            *       headerLength: 53
            *       id: 492
            *       imgId: 16340
            *       lkd: 1
            *       loc: 1
            *       pckId: "449485259142"
            *       sucs: true
            *       tm: 1435753240084
            *     }
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 200 Not Found
            *     {
            *       actn: 197
            *       sucs: false
            *     }
            */
            // self.toggleCommentLike = function(imgId, cmnId, lkd) {
            //     return $$connector.request({
            //         actn : OTYPES.TYPE_LIKE_UNLIKE_IMAGE_COMMENT,
            //         imgId : imgId,
            //         cmnId: cmnId,
            //         lkd : lkd
            //     }, REQTYPE.UPDATE );
            // };

            self.getProfilePicORCoverPicImageDetails = function(obj){
                var defer = $q.defer();
                 self.go({
                    actn :OTYPES.GET_CP_OR_PP_DETAIL,
                    type : obj.type
                }).then(function(data){
                        defer.resolve(data);
                 },function(reason){
                    defer.reject(reason);
                 });
                return defer.promise;
            };

             // self.fetchWhoLikes = function(imgId,ulength,nfId){
             //    var requestData = {
             //        actn: OTYPES.TYPE_LIKES_FOR_IMAGE,
             //        imgId: imgId
             //        //st: this parameter is required for load more.have to set.
             //    };
             //    if(nfId){
             //        requestData.nfId = nfId;
             //    }
             //     if ( ulength > 0 ) {
             //         requestData.st = ulength;
             //     }
             //   return $$connector.pull(requestData, REQTYPE.REQUEST);
             // };

            // self.peopleDetails = function ( utids ) {
            //     var payload = {
            //         actn: OTYPEFRIEND.TYPE_PEOPLE_YOU_MAY_KNOW_DETAILS,//OTYPES.FRIENDS.TYPE_PEOPLE_YOU_MAY_KNOW_DETAILS,
            //         idList: utids
            //     };
            //     $$connector.send(payload, REQTYPE.REQUEST);
            // };

             self.getFeedImages= function(nfId) {
                var payload = {
                    actn: OPERATION_TYPES.SYSTEM.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS,
                    nfId: nfId
                };
                return $$connector.request(payload, REQTYPE.REQUEST);
             };

        }


