/*
 * © Ipvision
 */


    angular
        .module('ringid.shared')
        .service('circleHttpService', circleHttpService);

    circleHttpService.$inject = ['$$connector', 'OPERATION_TYPES'];
    function circleHttpService($$connector, OPERATION_TYPES) { // jshint ignore:line
        var self = this, // jshint ignore:line
            OTYPES = OPERATION_TYPES.SYSTEM.CIRCLE,
            REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE;


        self.getCircleMembers = function getCircleMembers(circleId, pvtid, lim) {
            var payload = {
                actn: OTYPES.TYPE_GROUP_MEMBERS_LIST,
                grpId: circleId,
                scl: 1,
                lmt: lim || 40,
                pvtid: pvtid || 0,
            };

            return $$connector.send(payload, REQTYPE.REQUEST);
        };

        self.createCircle = function createCircle(obj) {
            var payload = {
                actn: OTYPES.TYPE_CREATE_GROUP,
                gNm: obj.tg.utf8Encode(),
                utId: obj.utId, // UIDTOUTID
                groupMembers: obj.alluser,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.getCircles = function getCircles() {
            var payload = {
                actn: OTYPES.TYPE_GROUP_LIST, // 70
                ut: -1,
                gpmut: -1,
            };
            return $$connector.send(payload, REQTYPE.REQUEST);
        };

        self.getCircle = function getCircle(key) {
            return $$connector.request({
                actn: OTYPES.TYPE_GROUP_DETAILS,
                grpId: key,
            }, REQTYPE.REQUEST);
        };

        self.getCirclesInfo = function getCirclesInfo() {
            var payload = {
                actn: OTYPES.TYPE_GROUP_LIST, // 70
                ut: -1,
                gpmut: -1,
            };
            return $$connector.request(payload, REQTYPE.REQUEST);
        };

        self.addMembers = function addMembers(obj) { // payload are not checked
            var payload = {
                actn: OTYPES.TYPE_ADD_GROUP_MEMBER,
                grpId: parseInt(obj.grpId, 10),// sometime grpId comes from template binding as string
                groupMembers: obj.members,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.removeMember = function removeMember(obj) {
            var payload = {
                actn: OTYPES.TYPE_REMOVE_GROUP_MEMBER,
                grpId: parseInt(obj.grpId, 10),// sometime grpId comes from template binding as string
                groupMembers: [
                        { uId: obj.uId },
                ],
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.removeMembers = function removeMembers(obj) {
            var payload = {
                actn: OTYPES.TYPE_REMOVE_GROUP_MEMBER,
                grpId: obj.grpId,
                groupMembers: obj.members,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.addRemoveAdmins = function addRemoveAdmins(obj) {
            var payload = {
                actn: OTYPES.TYPE_EDIT_GROUP_MEMBER,
                grpId: obj.grpId,
                groupMembers: obj.members,

            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.addRemoveAdmin = function addRemoveAdmin(obj) {
            var payload = {
                actn: OTYPES.TYPE_EDIT_GROUP_MEMBER,
                grpId: obj.grpId,
                groupMembers: [
                    {
                        admin: obj.admin, // admin = "true",
                        uId: obj.uId, // uId = 2000006232
                    },
                ],

            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.leaveCircle = function leaveCircle(obj) {
            var payload = {
                actn: OTYPES.TYPE_LEAVE_GROUP,
                grpId: obj.grpId,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.deleteCircle = function deleteCircle(obj) {
            var payload = {
                actn: OTYPES.TYPE_DELETE_GROUP,
                grpId: obj.grpId,
            };
            return $$connector.request(payload, REQTYPE.UPDATE);
        };

        self.getMemberResult = function getMemberResult(param, cid, stval) {
            var payload = {
                actn: OTYPES.TYPE_GROUP_MEMBERS_SEARCH_RESULT,
                grpId: cid,
                schPm: param,
                st: stval || 0,
            };
            return $$connector.send(payload, REQTYPE.REQUEST);
        };
    }
