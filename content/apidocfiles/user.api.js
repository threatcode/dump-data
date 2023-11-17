

/**
* @api {request} /APIREQUEST/34 Search Users
* @apiVersion 140.0.0
* @apiDescription Search Users by Name, phone, email, ringid, location or all
* @apiName SearchUser
* @apiGroup User
*
* @apiParam {Number=34} actn TYPE_CONTACT_SEARCH
* @apiParam {Number{0..5}} scat=0 Search By Category(i.e. All=0, Name=1, Phone=2, Email=3, Roingid=4, Location=5 or all)
* @apiParam {String} schPm Search Value. i.e. name or phone or email or ringid or location or anything
* @apiParam {Number} st=0 Searched Result Pagination
*
* @apiParamExample {json} Request-Example:
*   {
*       actn: 34,
*       scat: 0,
*       schPm: "Ab",
*       st: 0
*   }
*
* @apiSuccessExample {json} Success-Response:
*   {
*       actn: 34,
*       pType: 0,
*       scat: 0,
*       schPm: "Ab",
*       searchedContactlista: [
*           0: {
*               cnty: "ringID",
*               fn: "Abhzxerewz",
*               nmb: 0,
*               uId: "21110013673",
*               utId: 1944
*           }
*       ]
*   }
*/

/**


/**
* @api {request} /APIREQUEST/23 Get Friends Details
* @apiVersion 0.1.0
* @apiDescription This Requests Gets Friends  Details i.e. name, profileImage etc for logged in user.
* @apiName GetFriendsDetails
* @apiGroup Friends
*
* @apiParam {Number=23} actn TYPE_CONTACT_LIST
* @apiParam {Number{0,1}} uo=0 First time request or not
* @apiParam {Object[]} utIDs Byte array of utids. i.e. 10 utids becomes 10
* * 8(per utid) no of bytes and so 80 items array. each item represends an 8 bit integer
*/
self.getContactListDetails = function getContactListDetails(obj) {
var payload = {
actn: OTYPES.TYPE_CONTACT_LIST,
uo: obj.uo || false, // TRUE=only Update, FALSE=Fresh Details //firstRequestForContact ? true : false,
utIDs: obj.utIDs,
};
return $$connector.pull(payload, REQTYPE.REQUEST, true);
};

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
}
