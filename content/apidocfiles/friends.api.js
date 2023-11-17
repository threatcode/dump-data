



/**
* @api {request} /APIREQUEST/29 Get User's Friends Utid list
* @apiVersion 140.0.0
* @apiDescription This Requests list of Friends utids for logged in user.
* @apiName GetFriendsUtids
* @apiGroup Friends
*
* @apiParam {Number=29} actn TYPE_CONTACT_UTIDS
* @apiParam {Number} cut=-1 Undefined
* @apiParam {Number} ut=-1 Update Time in Timestamp
*
*
* @apiParamExample {json} Request-Example:
*   {
*       actn: 29,
*       cut: -1,
*       ut: -1
*   }
*
* @apiSuccessExample {Byte} Success-Response:
*   {
*       actn: 29,
*       sucs: true,
*       schPm: "Ab",
*       totalRecord: 368,
*       utIds: [
*           0: {
*               key: 390,
*               value: {
*                   ct: 2,
*                   frnS: 3,
*                   mb: 0
*               }
*           }
*       ]
*   }
*/


    /**
    * @api {request} /APIREQUEST/23 Get Friends Details
    * @apiVersion 0.1.0
    * @apiDescription This Requests Gets Friends  Details i.e. name, profileImage etc for logged in user.
    * @apiName GetFriendsDetails
    * @apiGroup Friends
    *
    * @apiParam {Number=23} actn TYPE_CONTACT_LIST
    * @apiParam {Boolean} uo=false Fetch all or only updates
    * @apiParam {Object[]} utIDs Byte array of utids. i.e. 10 utids becomes 10*8(per utid)
    * no of bytes and so 80 items array. each item represends an 8 bit integer
    */

self.getUserContacts = function getUserContacts(utId, st) {
    var payload = {
        actn: OTYPES.TYPE_FRIEND_CONTACT_LIST, // 107,
        utId: utId,
        st: st || 0,
    };
    return $$connector.pull(payload, REQTYPE.REQUEST);
};

    // self.getMutualContacts = function(uId) {
        // var params = {
            // actn: REQPRF.FETCH_FRIEND_MUTUAL_FRIEND_LIST,
            // uId: uId
        // };
        // return $$connector.request(params, REQTYPE.REQUEST)
    // }

    /**
    * @api {request} /APIREQUEST/128 Delete Friend
    * @apiVersion 0.1.0
    * @apiDescription This Requests To Unfriend an existing Friends.
    * @apiName FriendDelete
    * @apiGroup Friends
    *
    * @apiParam {Number=128} actn TYPE_DELETE_FRIEND
    * @apiParam {Number} friendId Friend uid
    */
self.unFriend = function unFriend(obj) {
    var payload = {
        actn: OTYPES.TYPE_DELETE_FRIEND,
        uId: obj.friendId,
    };
    return $$connector.request(payload, REQTYPE.UPDATE, true);
};


    /**
    * @api {request} /APIREQUEST/244 Change Friend Type
    * @apiVersion 0.1.0
    * @apiDescription This Requests To Change Friend Type from Full to Call&Chat only and viceversa
    * @apiName FriendChangeType
    * @apiGroup Friends
    *
    * @apiParam {Number=244} actn TYPE_ACTION_CHANGE_FRIEND_ACCESS
    * @apiParam {Number{1,2}} ct Contact type
    * @apiParam {Number} utId Friend utid
    */
self.changeFriendType = function changeFriendType(obj) {
    var payload = {
        actn: OTYPES.TYPE_ACTION_CHANGE_FRIEND_ACCESS,
        ct: obj.ct,
        utId: obj.utId,
    };
    return $$connector.request(payload, REQTYPE.UPDATE);
};


    /**
    * @api {request} /APIREQUEST/127 New Friend Request
    * @apiVersion 0.1.0
    * @apiDescription This Sends New Friend request
    * @apiName FriendAdd
    * @apiGroup Friends
    *
    * @apiParam {Number=127} actn TYPE_ADD_FRIEND
    * @apiParam {Number{1,2}} ct Contact type
    * @apiParam {Number} uId Contact uId
    */
self.sendFriendRequest = function sendFriendRequest(obj) {
    var payload = {
        actn: OTYPES.TYPE_ADD_FRIEND,
        uId: obj.uId,
            // ct: obj.ct
    };
    return $$connector.request(payload, REQTYPE.UPDATE, true);
};


    /**
    * @api {request} /APIREQUEST/243 Block Unblock Friend
    * @apiVersion 0.1.0
    * @apiDescription This Sends Block Friend request
    * @apiName FriendBlockUnblock
    * @apiGroup Friends
    *
    * @apiParam {Number=243} actn TYPE_ACTION_BLOCK_UNBLOCK_FRIEND
    * @apiParam {Number} utid Friend utid
    * @apiParam {Boolean} block Friend Block/Unblock
    */
self.blockFriend = function blockFriend(obj) {
        // console.log(obj);
    var payload = {
        actn: OTYPES.TYPE_ACTION_BLOCK_UNBLOCK_FRIEND,
        idList: [
            obj.friend.getUtId(),
        ],
        bv: obj.bv,
    };
    return $$connector.request(payload, REQTYPE.REQUEST);
};

self.saveCallPvcEdit = function saveCallPvcEdit(obj) {
    var payload = {
        actn: obj.actn,
        sn: obj.callsn,
        sv: obj.sv,
        utId: obj.friend.getUtId(),
    };
    return $$connector.request(payload, REQTYPE.UPDATE);
};

self.saveChatPvcEdit = function saveChatPvcEdit(obj) {
    var payload = {
        actn: obj.actn,
        sn: obj.chatsn,
        sv: obj.sv,
        utId: obj.friend.getUtId(),
    };
    return $$connector.request(payload, REQTYPE.UPDATE);
};

self.saveFeedPvcEdit = function saveFeedPvcEdit(obj) {
    var payload = {
        actn: obj.actn,
        sn: obj.feedsn,
        sv: obj.sv,
        utId: obj.friend.getUtId(),
    };
    return $$connector.request(payload, REQTYPE.UPDATE);
};


    /**
    * @api {request} /APIREQUEST/129 Friend Request Accept
    * @apiVersion 0.1.0
    * @apiDescription This Sends New Friend request Acceptance
    * @apiName FriendAccept
    * @apiGroup Friends
    *
    * @apiParam {Number=129} actn TYPE_ACCEPT_FRIEND
    * @apiParam {Number{1,2}} ct Contact type
    * @apiParam {Number} friendId Friend uid
    */
self.acceptFriendRequest = function acceptFriendRequest(obj) {
        // console.log(obj);
    var payload = {
        actn: OTYPES.TYPE_ACCEPT_FRIEND, // 129,
            // ct: obj.contactType,
        utId: obj.utId,
    };
    return $$connector.request(payload, REQTYPE.UPDATE, true);
};
