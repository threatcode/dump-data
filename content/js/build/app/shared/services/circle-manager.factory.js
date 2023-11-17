/*
 * © Ipvision
 */


	angular
		.module('ringid.shared')
		.factory('circlesManager', circlesManager);

	circlesManager.$inject = ['$routeParams', '$location', '$rootScope','$$connector', 'OPERATION_TYPES', 'Storage',
        '$$stackedMap', '$$q', 'circleMap', 'userFactory', 'circleHttpService', 'Notification', 'SystemEvents','Ringalert', 'Auth'];
	function circlesManager($routeParams, $location, $rootScope, $$connector, OPERATION_TYPES, StorageFactory, // jshint ignore:line
                            $$stackedMap, $q, circleMap, UserFactory, circleHttpService, Notification, SystemEvents, Ringalert, Auth) {

        var myCircles = $$stackedMap.createNew(true, 'asc'),
            initialized = false,
            circlesOfMe = $$stackedMap.createNew(true, 'asc'),
            circlesFetchTimeout,
            OTYPES = OPERATION_TYPES.SYSTEM.CIRCLE;
        var maxUserId;
        var stVal;



        function _removeLocalCircle(circleId){
            circlesOfMe.remove(circleId);
            $rootScope.$broadcast(SystemEvents.CIRCLE.MY_CIRCLE_REMOVED, { circleId : circleId});
        }

        function doCreateCircle(circleMapObject, aGroup){

            var circle = circleMapObject.get(aGroup.grpId);
            if( !circle ){
                circle = circleMap.create(aGroup);
            }else{
                circle.update(aGroup);
            }
            circleMapObject.save(circle.getKey(), circle);

            return circle;

        }

        function CreateAndSaveCircle(aGroup){

                var circle;
                if(!aGroup.ists){

                    if (aGroup.sAd == Auth.currentUser().getKey() ) {
                        circle = doCreateCircle(myCircles, aGroup);
                    } else {
                        circle = doCreateCircle(circlesOfMe, aGroup);
                    }
                }
                return circle;
        }

        function _processCircleList(circleList){
            angular.forEach(circleList, CreateAndSaveCircle);
        }

        function redirect(circleId) {
            if ($routeParams.circleId && $routeParams.circleId == circleId) { //jshint ignore:line
                //Circle Deleted
                $location.path('/');
            }
        }

        function redirectHome(){
            Ringalert.show('Circle does not exist!', 'warning');
            $location.path('/');
        }

        function processCircleUpdates (json){
            var circleId,
                circleToUpdate;

            if( json.sucs){
                switch(json.actn){
                    case OTYPES.TYPE_UPDATE_EDIT_GROUP_MEMBER:
                    case OTYPES.TYPE_UPDATE_ADD_GROUP_MEMBER:
                        circleId = json.grpId;
                        circleToUpdate = getCircle(circleId);
                        if(!!circleToUpdate){
                            circleToUpdate.setMembers(json.groupMembers);
                        } else {
                        }
                        break;
                    case OTYPES.TYPE_UPDATE_DELETE_GROUP:
                        circleId = json.grpId;
                        circleToUpdate = getCircle(circleId);
                        if(!!circleToUpdate) {
                            _removeLocalCircle(circleToUpdate.getKey());
                            redirect(json.grpId);
                        } else {
                        }
                        break;
                    case OTYPES.TYPE_UPDATE_REMOVE_GROUP_MEMBER:
                        circleId = json.grpId;
                        circleToUpdate = getCircle(circleId);

                        if(!!json.removedMembers && !!circleToUpdate){
                            angular.forEach(json.removedMembers, function(aMemberUId){
                                circleToUpdate.removeMember(aMemberUId);
                            });
                        } else {
                        }
                        break;
                    case OTYPES.TYPE_UPDATE_ADD_TO_GROUP_BY_FRIEND:
                        json.groupList = [{
                            gNm: json.gNm,
                            grpId: json.grpId,
                            mc: json.mc,
                            sAd: json.sAd
                        }];
                        _processCircleList(json.groupList);
                        processCircleMembersData(json.groupMembers);

                        break;
                }
            }
        }

        function circleUpdateFilter(json){
            return json.actn === OTYPES.TYPE_UPDATE_EDIT_GROUP_MEMBER ||
                   json.actn === OTYPES.TYPE_UPDATE_ADD_GROUP_MEMBER ||
                   json.actn === OTYPES.TYPE_UPDATE_DELETE_GROUP ||
                   json.actn === OTYPES.TYPE_UPDATE_REMOVE_GROUP_MEMBER ||
                   json.actn === OTYPES.TYPE_UPDATE_ADD_TO_GROUP_BY_FRIEND;
        }

            function processCirclesData(json) {
                clearTimeout(circlesFetchTimeout);
                if (json.actn === OTYPES.TYPE_GROUP_LIST && json.sucs === true) {
                    _processCircleList(json.groupList);

                    $rootScope.$broadcast(SystemEvents.CIRCLE.MY_CIRCLE_LIST_PROCESS_COMPLETE);
                }
            }

            function processCircleMembersData(json) {
                if(json.sucs === true) {
                    if(angular.isArray(json.groupMembers) && json.groupMembers.length){
                        for( var j=0; j<json.groupMembers.length; j++ ){
                            maxUserId = json.groupMembers[j].id;
                        }
                        var circle = myCircles.get(json.groupMembers[0].grpId);

                        if (!circle) {
                            circle = circlesOfMe.get(json.groupMembers[0].grpId);
                        }

                        if(!circle){
                           return;
                        }

                        circle.setMembers(json.groupMembers);
                    }
                }
                $rootScope.$broadcast(SystemEvents.CIRCLE.MY_CIRCLE_MEMBER_LIST_PROCESS_COMPLETE,{
                    success : true
                });
            }

        function processCircleSearchMembersData(json) {
            stVal = json.tr;
            if(json.sucs === true) {
                if(angular.isArray(json.groupMembers) && json.groupMembers.length){

                    var circle = myCircles.get(json.groupMembers[0].grpId);

                    if (!circle) {
                        circle = circlesOfMe.get(json.groupMembers[0].grpId);
                    }

                    if(!circle){
                        return;
                    }

                    circle.setMembers(json.groupMembers);
                }
            }
            $rootScope.$broadcast(SystemEvents.CIRCLE.MY_CIRCLE_MEMBER_LIST_PROCESS_COMPLETE,{
                success : json.sucs
            });
        }

            function getSingleCircleInfo(circleid,circleObj) {
                //var defer = $q.defer();
                circleHttpService.getCircle(circleid).then(function(data){
                    if(data.sucs===true){
                        circleObj.setMemberCount(data.mc);
                        //defer.resolve(data);
                        $rootScope.$broadcast(SystemEvents.CIRCLE.MY_CIRCLE_UPDATE_MEMBER_COUNT);
                    }
                });
                //return defer.promise;
            }

            function getCircle(circleKey) {
                return myCircles.get(circleKey) || circlesOfMe.get(circleKey);
            }

            function getCirclePromise(key){
                var circle = getCircle(key),defer = $q.defer();

                if(circle){
                    setTimeout(function(){
                        defer.resolve(circle);
                    });
                }else{
                    circleHttpService.getCircle(key).then(function(json){
                         if(json.sucs){
                            json.grpId = key;
                            json.ists = 0;
                            circle = CreateAndSaveCircle(json);
                            defer.resolve(circle);
                         }else{
                            defer.reject(false);
                         }
                    },function(reason){

                    });
                }
                return defer.promise;
            }

            function getCircles (circleCreatedByMe) {
                if (circleCreatedByMe) {
                    return myCircles;
                } else {
                    return circlesOfMe;
                }
            }

            function createCircle(circleObj) {
                //circleHttpService.createCircle(circleObj);
                var deferred = $q.defer();
                circleHttpService.createCircle(circleObj).then(function(data) {
                    //var response = angular.fromJson(data);
                    if (data.sucs === true) {
                        circleHttpService.getCircles();
                    }
                    // console.log('test');
                    deferred.resolve(data);
                });

                return deferred.promise;

            }

            function addMembers(members,circleid) {

                var deferred = $q.defer();
                var circleObj = {
                    //grpId : circle.getKey(),
                    grpId : circleid,
                    members : members
                };

                circleHttpService.addMembers(circleObj).then(function(data) {
                    var circle = getCircle(circleid);
                    deferred.resolve(data);
                });

                return deferred.promise;

            }

            function getCircleMembers(circleid,pvtid,lim){
                if( pvtid === 0 ){
                    maxUserId = pvtid;
                }
                circleHttpService.getCircleMembers(circleid,maxUserId,lim);
            }

            function getMemberResult(param,cid) {
                circleHttpService.getMemberResult(param,cid,stVal);
            }

            function leaveGroup(circle) {
                var deferred = $q.defer();
                circleHttpService.leaveCircle({grpId: circle.getKey()}).then(function(data) {
                    var response = angular.fromJson(data);
                    if (response.sucs === true) {
                        // remove circle
                        myCircles.remove(circle.getKey());
                        circlesOfMe.remove(circle.getKey());
                        deferred.resolve(response);
                    } else {
                        deferred.reject('Failed');
                    }
                });
                return deferred.promise;
            }

            function deleteCircle(circle) {
                var deferred = $q.defer();
                circleHttpService.deleteCircle({grpId:circle.getKey()}).then(function(response) {
                   // var response = angular.fromJson(data);
                    if (response.sucs === true) {
                        // remove circle
                        myCircles.remove(circle.getKey());
                        circlesOfMe.remove(circle.getKey());
                        deferred.resolve(response);
                    } else {
                        deferred.reject('Failed');
                    }
                });
                return deferred.promise;
            }

            //function addMembers(members, circleid) {
            //
            //    var obj = {
            //        //grpId : circle.getKey(),
            //        grpId : circleid,
            //        members : members
            //    };
            //
            //    angular.forEach(members, function(aMember){
            //        circle.addMember(aMember.uId, aMember.admin);
            //    });
            //
            //    circle.setMemberCount(circle.getMembersObjectCount());
            //
            //    circleHttpService.addMembers(obj).then(function(data) {
            //        
            //
            //        if (data.sucs !== true) {
            //            angular.forEach(members, function(aMember){
            //                circle.removeMember(aMember.uId);
            //            });
            //            circle.setMemberCount(circle.getMembersObjectCount());
            //
            //        }
            //
            //        $rootScope.$broadcast(SystemEvents.CIRCLE.MY_CIRCLE_MEMBER_LIST_UPDATE_COMPLETE);
            //
            //    },function(errData) {
            //        
            //    });
            //}

            function removeMember(memberKey, circle) {
                var param = {
                    grpId: circle.getKey(),
                    uId: memberKey
                };

                var removedMember = circle.removeMember(memberKey);

                circleHttpService.removeMember(param).then(function(data) {
                    if (data.sucs !== true) {

                        circle.addMember(removedMember);
                        Ringalert.show(data, 'error');

                    }
                    $rootScope.$broadcast(SystemEvents.CIRCLE.MY_CIRCLE_MEMBER_LIST_UPDATE_COMPLETE);

                },function(errData) {
                });
            }

            function removeMembers(membersUIds, circle) {
                var param = {
                    grpId: circle.getKey(),
                    members : []
                };

                angular.forEach(membersUIds, function(aMemberUId){
                    param.members.push({uId : aMemberUId } );
                    circle.removeMember(aMemberUId);
                });

                circle.setMemberCount(circle.getMembersObjectCount());

                circleHttpService.removeMembers(param).then(function(data) {
                    if (data.sucs !== true) {

                        angular.forEach(membersUIds, function(aMemberUId){
                            circle.addMember(aMemberUId);
                        });

                        circle.setMemberCount(circle.getMembersObjectCount());

                        Ringalert.show(data, 'error');

                    }

                    $rootScope.$broadcast(SystemEvents.CIRCLE.MY_CIRCLE_MEMBER_LIST_UPDATE_COMPLETE);

                },function(errData) {
                });
            }

            function toggleMembership(obj, circle) {

                circleHttpService.addRemoveAdmin(obj).then(function(data) {

                    if (data.sucs === true) {
                        var groupMember = data.groupMembers[0];

                        if( groupMember.uId === obj.uId && groupMember.admin === true){
                            circle.promoteToAdmin(obj.uId);
                        }else if( groupMember.uId === obj.uId && groupMember.admin === false){
                            circle.removeFromAdmin(obj.uId);
                        }

                        $rootScope.$broadcast(SystemEvents.CIRCLE.MY_CIRCLE_MEMBER_LIST_UPDATE_COMPLETE);
                    }
                },function(errData) {
                });
            }







        function init(force) {
            if (!initialized) {
                $$connector.subscribe(processCircleUpdates, {
                    action: [
                            OTYPES.TYPE_UPDATE_DELETE_GROUP, //352,// "delete_group";
                            OTYPES.TYPE_UPDATE_REMOVE_GROUP_MEMBER, //354,  //"remove_group_member";
                            OTYPES.TYPE_UPDATE_ADD_GROUP_MEMBER, //356,// "add_group_member";
                            OTYPES.TYPE_UPDATE_EDIT_GROUP_MEMBER //358, //  "edit_group_member";
                    ]
                });

                $$connector.subscribe(processCirclesData, {
                    action: [
                        OTYPES.TYPE_GROUP_LIST
                    ]
                });
            }

            if (!initialized || force) {
                initialized = true;
                circleHttpService.getCircles();
            }
        }


        return {
            init: init,
            processCircleUpdates : processCircleUpdates,
            circleUpdateFilter : circleUpdateFilter,
            processCirclesData: processCirclesData,
            processCircleMembersData: processCircleMembersData,
            processCircleSearchMembersData:processCircleSearchMembersData,

            getCircle: getCircle,
            getCirclePromise: getCirclePromise,
            getCircles : getCircles,
            createCircle: createCircle,
            getCircleMembers: getCircleMembers,
            leaveGroup: leaveGroup,
            deleteCircle:deleteCircle,
            addMembers: addMembers,
            removeMember: removeMember,
            removeMembers: removeMembers,
            toggleMembership: toggleMembership,
            redirectHome:redirectHome,
            getMemberResult:getMemberResult,
            getSingleCircleInfo:getSingleCircleInfo
		};


	}

