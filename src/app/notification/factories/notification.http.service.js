
angular
        .module('ringid.notification')
        .service('notificationHttpService', notificationHttpService);

        notificationHttpService.$inject = ['$$connector', 'settings', 'OPERATION_TYPES'];
        function notificationHttpService($$connector, settings, OPERATION_TYPES) { // jshint ignore:line
            var self = this, // jshint ignore:line
                OTYPES = OPERATION_TYPES.SYSTEM.NOTIFICATION,
                REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE;

            /**
            * @api {request} /APIREQUEST/111 Get Notification list
            * @apiVersion 0.1.0
            * @apiDescription This Requests list of notification for logged in user.
            * @apiName GetNotifications
            * @apiGroup Notification
            *
            * @apiParam {Number=111} actn action constant for this api call
            * @apiParam {Number{1,2}} scl this dictates if Older or Newer notification
            * @apiParam {Number} ut Update Time in Timestamp
            *
            *
            * @apiSuccess {Number} acId Undefined
            * @apiSuccess {Number=111} actn action constant for this api call
            * @apiSuccess {Number} cmnId  Not needed
            * @apiSuccess {Number} headerLength packet header length
            * @apiSuccess {Number} imgId Not Needed
            * @apiSuccess {Number} loc Undefined
            * @apiSuccess {Object[]{1..5}} nList Notification list
            * @apiSuccess {Number} nfId Not needed
            * @apiSuccess {Number} pckFs Server Packet id
            * @apiSuccess {Number} pckId Packet id
            * @apiSuccess {Number{1,2}} scl this dictates if Older or Newer notification
            * @apiSuccess {Number} seq Packet Sequence number
            * @apiSuccess {Boolean} sucs Request successfully processed or not
            * @apiSuccess {Number} tn total notification
            * @apiSuccess {Number} tr Undefined
            *
            * @apiSuccess (nList) {Number} acId Undefined
            * @apiSuccess (nList) {Number} cmnId Comment Id
            * @apiSuccess (nList) {Number} fndId Friend Id
            * @apiSuccess (nList) {String} fndN Friend Name
            * @apiSuccess (nList) {Number} groupId Group Id
            * @apiSuccess (nList) {Number} id Notification Id
            * @apiSuccess (nList) {Number} imgId Image Id
            * @apiSuccess (nList) {Number} loc Undefined
            * @apiSuccess (nList) {Number{1..13}} mt Message Type
            * @apiSuccess (nList) {Number} nfId Feed Id
            * @apiSuccess (nList) {Number{1..5}} nt Notification type
            * @apiSuccess (nList) {Number} ut Update Time in timestamp
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

            self.requestNotification = function(obj){
                var payload = {
                    actn: OTYPES.TYPE_MY_NOTIFICATIONS,
                    //from_index: obj.from_index || 0,
                    //to_index: obj.to_index || 10,
                    //ut: obj.ut || -1,
                    //scl: obj.scl || 2
                };
                if (obj && obj.from_index > 0) {
                    payload = angular.extend({}, payload, obj);
                }
                $$connector.send(payload, REQTYPE.REQUEST);
            };

            self.clearNotiCount = function() {
                var d = new Date();
                var t = d.getTime();
                var payload = {
                    actn: OTYPES.CLEAR_NOTIFICATION_COUNTER,
                    ut: t
                };
                return $$connector.request(payload, REQTYPE.REQUEST);
            };

            self.getNotificationDetails = function (obj) {
                 var payload = {
                        actn: OPERATION_TYPES.SYSTEM.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS,
                        nfId: obj.activityId
                };
                return $$connector.request(payload, REQTYPE.REQUEST);
            };

            self.getImageAlbumDetails = function(obj) {
                var payload = {
                    actn: OPERATION_TYPES.SYSTEM.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS,
                    request_type: REQTYPE.REQUEST,
                    imgId: obj.imgId
                };
                return $$connector.request(payload, REQTYPE.REQUEST);
            };

        }

