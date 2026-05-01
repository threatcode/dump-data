/*
 * © Ipvision
 */


	angular
		.module('ringid.shared')
		.factory('circleMap', circleMap);

		circleMap.$inject = ['userFactory',  '$$stackedMap','settings','Utils'];
		function circleMap(userFactory,  $$stackedMap,settings,Utils) { // jshint ignore:line
			return {
				create: function(obj){
					var circle = {
						gNm: '',
						grpId: 0,
						ists: 0, /*  circle delete status , 1: deleted, 0: not deleted */
                        sAd: '',
                        ut: 0,
						mc:'',
						mt:'',

                        groupMembers: '',
						memberList: [],
						members: {},
						allMembersMap: $$stackedMap.createNew(), /** Contains Both Members and Admins **/
						adminIds: [],
						memberIds: []
					};
					if ( angular.isObject(obj) ) {
						circle = angular.extend({}, circle, obj);

					}

					function _log(){
					}

					function _removeAdminId(uId){
						var index = circle.memberIds.indexOf(uId);
						if( index !== -1) {
                            circle.memberIds.splice(index, 1);
                        }
					}

					function _removeMemberId(uId){
						var index = circle.adminIds.indexOf(uId);
						if( index !== -1) {
							circle.adminIds.splice(index, 1);
                        }
					}

					function _refreshLength(){
						circle.mc = circle.allMembersMap.length();
					}

					function _update(obj){
						angular.extend(circle, obj);
					}

					var ObjectToReturn = {
						sortBy: function() {
							return circle.gNm.toLowerCase();
						},

						update  : _update,

             			addMember: function(uId, isAdmin) {
							var user = userFactory.create(uId);

                            circle.allMembersMap.save(user.getKey(), user);

							if(!!isAdmin){
								ObjectToReturn.promoteToAdmin(user.getKey());
							}else{
								ObjectToReturn.removeFromAdmin(user.getKey());
							}

							_refreshLength();

                        },
						isAdmin: function() {
							//if (circle.adminIds.indexOf(key) > -1) {
							if ( circle.mt === 1 ) {
								return true;
							} else {
								return false;
							}
						},

						isMember: function() {
							//if (circle.adminIds.indexOf(key) > -1) {
							if ( circle.mt === 0 ) {
								return true;
							} else {
								return false;
							}
						},

                        isSuperAdmin: function(uId) {
                            if (circle.sAd === uId) {
                                return true;
                            } else {
                                return false;
                            }

                        },

						getSuperAdminUId : function(){
							return circle.sAd;
						},

						promoteToAdmin: function(uId) {
							_removeMemberId(uId);

							circle.adminIds.push(uId);

							circle.allMembersMap.get(uId).setGroupAdmin(circle.grpId);

							_log();
						},
						removeFromAdmin: function(key) {
							_removeAdminId(key);

							circle.memberIds.push(key);

							circle.allMembersMap.get(key).removeGroupAdmin(circle.grpId);

							_log();
						},
						getAdmins: function() {
							var adminsMap = circle.allMembersMap.copy();
							for(var i = 0; i < circle.memberIds.length; i++) {
								adminsMap.remove(circle.memberIds[i]);
							}

							return adminsMap;
						},
						getMember : function(uId){
							return circle.allMembersMap.get(uId);
						},
                        getMembers: function() {
							var membersMap = circle.allMembersMap.copy();
							for(var i = 0; i < circle.adminIds.length; i++) {
								membersMap.remove(circle.adminIds[i]);
							}

							return membersMap;
                        },
						setMembers: function(newMembers) {

							angular.forEach(newMembers, function(aNewMember){
								// console.log('ists:'+aNewMember.ists);
								if(!aNewMember.ists){

									var member = userFactory.create(aNewMember);

									circle.allMembersMap.save(member.getKey(), member);

									if (aNewMember.admin) {
										if( circle.adminIds.indexOf(member.getKey()) !== -1){
											circle.adminIds.push(member.getKey());
										}else{
											ObjectToReturn.promoteToAdmin(member.getKey());
										}
									} else {
										if( circle.memberIds.indexOf(member.getKey()) !== -1){
											circle.memberIds.push(member.getKey());
										}else{
											ObjectToReturn.removeFromAdmin(member.getKey());
										}
									}
								}
							});

							//_refreshLength();

							_log();


						},
						resetMembers: function() {
							circle.allMembersMap.reset();
							circle.adminIds = [];
							circle.memberIds = [];
						},
						removeMember: function(memberKey) {
							var removedMember;
							removedMember = circle.allMembersMap.remove(memberKey);
							_removeAdminId(memberKey);
							_removeMemberId(memberKey);

							_refreshLength();

						},
						getAllMembers: function() {
							return circle.allMembersMap;
						},
						getMemberIds : function(){
							return circle.memberIds.slice();
						},
						getAdminIds : function(){
							return circle.adminIds.slice();
						},

						getMembersObjectCount: function() {
							return circle.allMembersMap.length();
						},
						getMembersCount: function() {
							//return circle.allMembersMap.length();
							return circle.mc;
						},
						getMemberType: function(){
							return circle.mt;
						},
						setMemberCount : function(count){
							circle.mc = count;
						},
						getLink: function(subPage) {
							 subPage = (subPage||'');
							return settings.baseUrl + Utils.getRingRoute('CIRCLE_HOME',{circleId:circle.grpId,subpage : subPage});
						},
						getLinkOnly: function(subPage) {
							subPage = (subPage||'');
							return  Utils.getRingRoute('CIRCLE_HOME',{circleId:circle.grpId,subpage : subPage}).slice(1);
						},
						getKey: function() {
							return circle.grpId;
						},
						getName: function() {
							return circle.gNm;
						},
						getAnchor: function(){
							return '<a class="cir-title" href="/#/circle/' + circle.grpId +'" >'+circle.gNm+'</a>';
						}

					};

					return ObjectToReturn;
				}
			};
		}
