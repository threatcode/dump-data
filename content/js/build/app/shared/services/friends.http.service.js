
	angular
		.module('ringid.shared')
		.service('friendsHttpService', friendsHttpService);

		friendsHttpService.$inject = [ '$$connector', 'OPERATION_TYPES', 'APP_CONSTANTS'];
		function friendsHttpService( $$connector, OPERATION_TYPES, APP_CONSTANTS) {
			var self = this,
                firstRequestForContact = false,
				OTYPES = OPERATION_TYPES.SYSTEM.FRIENDS,
                AC = APP_CONSTANTS,
                REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE;


            /**
            * @api {request} /APIREQUEST/34 Search Contacts
            * @apiVersion 0.1.0
            * @apiDescription Search Contacts by Name, phone, email, ringid, location or all
            * @apiName SearchContacts
            * @apiGroup Friends
            *
            * @apiParam {Number=34} actn TYPE_CONTACT_SEARCH
            * @apiParam {Number{0..5}} scat=0 Search By Category(i.e. Name, Phone, Email, Roingid, Location or all)
            * @apiParam {String} Search Value. i.e. name or phone or email or ringid or location or anything
            */

			self.searchContact = function(obj, friendOnly) {

            //TYPE_SEARCH_BY_ALL : 0,
            //TYPE_SEARCH_BY_NAME : 1,
            //TYPE_SEARCH_BY_PHONE : 2,
            //TYPE_SEARCH_BY_EMAIL : 3,
            //TYPE_SEARCH_BY_RINGID : 4,
            //TYPE_SEARCH_BY_LOCATION : 5,
                var payload = {
					actn: friendOnly ? OTYPES.ACTION_FRIEND_SEARCH : OTYPES.TYPE_CONTACT_SEARCH,
                    scat: AC.TYPE_SEARCH_BY_ALL,
					schPm: obj.schPm.utf8Encode(),
                    st: obj.st || 0
				};
                var regexEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
                    regexRingid =  /^10\d{6}/,
                    regexNumber = /^\d{5,}$/i;
                    //regexName = /^[A-Za-z\s]+$/i;

                if (regexEmail.test(obj.schPm)) {
                    // search by email
                    payload.scat = AC.TYPE_SEARCH_BY_EMAIL;
                }
                //else if (regexRingid.test(obj.schPm)) {
                    //// search by ringid
                    //payload.scat = AC.TYPE_SEARCH_BY_RINGID;
                //} else  if (regexNumber.test(obj.schPm)) {
                    //// search by mobile no
                    //payload.scat = AC.TYPE_SEARCH_BY_PHONE;
                //} else {
                    //// search by name
                    //payload.scat = AC.TYPE_SEARCH_BY_NAME;
                //}

				return $$connector.pull(payload, REQTYPE.REQUEST, true);
			};


            /**
            * @api {request} /APIREQUEST/29 Get Friends Utids
            * @apiVersion 0.1.0
            * @apiDescription This Requests list of Friends  utids for logged in user.
            * @apiName GetFriendsUtids
            * @apiGroup Friends
            *
            * @apiParam {Number=29} actn TYPE_CONTACT_UTIDS
            * @apiParam {Number} cut=-1 Undefined
            * @apiParam {Number} ut=-1 Update Time in Timestamp
            */

            self.getContactList = function(ut) {
				var payload = {
					actn: OTYPES.TYPE_CONTACT_UTIDS,
					cut: -1, //timestamp,
					ut: ut || -1 //timestamp
				};
                return $$connector.send(payload, REQTYPE.REQUEST);
            };



            /**
            * @api {request} /APIREQUEST/23 Get Friends Details
            * @apiVersion 0.1.0
            * @apiDescription This Requests Gets Friends  Details i.e. name, profileImage etc for logged in user.
            * @apiName GetFriendsDetails
            * @apiGroup Friends
            *
            * @apiParam {Number=23} actn TYPE_CONTACT_LIST
            * @apiParam {Number{0,1}} uo=0 First time request or not
            * @apiParam {Object[]} utIDs Byte array of utids. i.e. 10 utids becomes 10 * 8(per utid) no of bytes and so 80 items array. each item represends an 8 bit integer
            */
			self.getContactListDetails = function(obj) {
				var payload = {
					actn: OTYPES.TYPE_CONTACT_LIST,
                    uo: obj.uo || false, // TRUE=only Update, FALSE=Fresh Details //firstRequestForContact ? true : false,
                    utIDs: obj.utIDs
				};
                return $$connector.pull(payload, REQTYPE.REQUEST, true);
			};

			self.getUserContacts = function(utId, st){
				var payload = {
					actn:OTYPES.TYPE_FRIEND_CONTACT_LIST,//107,
					utId:utId,
					st: st || 0
				};
				return $$connector.pull(payload, REQTYPE.REQUEST);

			};

            //self.getMutualContacts = function(uId) {
                //var params = {
                    //actn: REQPRF.FETCH_FRIEND_MUTUAL_FRIEND_LIST,
                    //uId: uId
                //};
                //return $$connector.request(params, REQTYPE.REQUEST)
            //}

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
			self.unFriend = function(obj) {
				var payload = {
					actn: OTYPES.TYPE_DELETE_FRIEND,
					uId: obj.friendId
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
			self.changeFriendType = function(obj) {
				var payload = {
					actn: OTYPES.TYPE_ACTION_CHANGE_FRIEND_ACCESS,
					ct: obj.ct ,
                    utId: obj.utId
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
			self.sendFriendRequest = function(obj) {
				var payload = {
                    actn: OTYPES.TYPE_ADD_FRIEND,
                    uId: obj.uId
                    //ct: obj.ct
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
			self.blockFriend = function(obj) {
				//console.log(obj);
				var payload = {
					actn: OTYPES.TYPE_ACTION_BLOCK_UNBLOCK_FRIEND,
					idList: [
						obj.friend.getUtId()
					],
					bv: obj.bv
				};
				return $$connector.request(payload, REQTYPE.REQUEST);
			};

			self.saveCallPvcEdit = function (obj) {
				var payload = {
					actn:obj.actn,
					sn:obj.callsn,
					sv:obj.sv,
					utId:obj.friend.getUtId()
				};
				return $$connector.request(payload, REQTYPE.UPDATE);
			};

			self.saveChatPvcEdit = function (obj) {
				var payload = {
					actn:obj.actn,
					sn:obj.chatsn,
					sv:obj.sv,
					utId:obj.friend.getUtId()
				};
				return $$connector.request(payload, REQTYPE.UPDATE);
			};

			self.saveFeedPvcEdit = function (obj) {
				var payload = {
					actn:obj.actn,
					sn:obj.feedsn,
					sv:obj.sv,
					utId:obj.friend.getUtId()
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
			self.acceptFriendRequest = function(obj) {
				//console.log(obj);
				var payload = {
                    actn: OTYPES.TYPE_ACCEPT_FRIEND,//129,
                    //ct: obj.contactType,
					utId:obj.utId
				};
				return $$connector.request(payload, REQTYPE.UPDATE, true);
			};




		}
