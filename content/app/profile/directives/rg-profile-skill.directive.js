/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfileSkill', rgProfileSkill);


        function rgProfileSkill()  {

            ProfileSkillController.$inject = [ '$scope', 'profileFactory','$routeParams','rgDropdownService','Ringalert','$$connector','OPERATION_TYPES' ];
            function ProfileSkillController ( $scope, profileFactory, $routeParams,rgDropdownService,Ringalert,$$connector,OPERATION_TYPES ) { //jshint ignore:line

                var OTYPES = OPERATION_TYPES.SYSTEM.PROFILE;

                $scope.skilllist = [];

                if($scope.profileObj.isCurrentUser()){
                    $scope.isOwner = true;
                    //$scope.showAddButton = true;
                }else{
                    $scope.isOwner = false;
                }

                $scope.skillsklerror = false;
                $scope.skilldescerror = false;

                $scope.$watch('skillObjInfo.skl', function (newval,oldval) {
                    if(newval){
                        $scope.skillsklerror = false;
                    }
                });
                $scope.$watch('skillObjInfo.desc', function (newval,oldval) {
                    if(newval){
                        $scope.skilldescerror = false;
                    }
                });
                // initialize
                profileFactory.getUserProfileData({uId:$routeParams.uId}, $scope.profileObj.isCurrentUser());
                $scope.getProfileData = profileFactory.getProfileData;

                var tmpSkill,contentIndex;

                $scope.addNewSkill = addNewSkill;
                $scope.submitNewSkill = submitNewSkill;
                $scope.cancelNewSkill = cancelNewSkill;
                $scope.updateSkill = updateSkill;
                $scope.cancelUpdateSkill = cancelUpdateSkill;
                $scope.skillObjInfo = {};

                $scope.ddActionHtml = 'templates/dropdowns/action-dropdown.html';
                $scope.actionSkillDropdown = function(actionObj) {
                    switch(actionObj.action) {
                        case 'edit':
                            enableSkillEditMode(actionObj.data.index);
                            break;
                        case 'delete':
                            deleteSkill(actionObj.data.index,actionObj.data.obj);
                            break;
                        default:
                    }
                    rgDropdownService.close(actionObj.event);
                };

                $scope.isAddNewSkill = false;

                function addNewSkill() {
                    if(tmpSkill){
                        $scope.skilllist[contentIndex] = tmpSkill;
                    }
                    $scope.isEditSkill = -1;
                    $scope.skillObjInfo.skl = '';
                    $scope.skillObjInfo.desc = '';
                    $scope.isAddNewSkill = true;
                    $scope.$rgDigest();
                }

                function submitNewSkill() {

                    if( !$scope.skillObjInfo.desc ){
                        $scope.skilldescerror = true;
                        $scope.$rgDigest();

                    }

                    if( !$scope.skillObjInfo.skl ) {
                        $scope.skillsklerror = true;
                        $scope.$rgDigest();

                    }

                    if( $scope.skillsklerror || $scope.skilldescerror ){
                        return;
                    }



                    $scope.processing = true;
                    profileFactory.submitNewSkill($scope.skillObjInfo).then(function(data) {
                        var newSkillObj;
                        if( data.sucs===true ) {
                            $scope.skillObjInfo.id = data.id;
                            newSkillObj = angular.copy($scope.skillObjInfo);
                            $scope.skilllist.push(newSkillObj);

                            // profileFactory.setProfileData('skillList', obj, $scope.profileObj.getUtId());

                            Ringalert.show('Skill info added successfully','success');
                            $scope.isAddNewSkill = false;
                        }else{
                            $scope.isAddNewSkill = false;
                            Ringalert.show('Request did not process successfully','error');
                        }
                        $scope.processing = false;
                        $scope.$rgDigest();

                    });
                }

                function cancelNewSkill() {
                    if(tmpSkill){
                        $scope.skilllist[contentIndex] = tmpSkill;
                    }
                    //$scope.skillObjInfo.skl = '';
                    //$scope.skillObjInfo.desc = '';
                    $scope.isAddNewSkill = false;
                    $scope.$rgDigest();
                }



                function updateSkill() {

                    if( !$scope.skillObjInfo.desc ){
                        $scope.skilldescerror = true;
                        $scope.$rgDigest();

                    }

                    if( !$scope.skillObjInfo.skl ) {
                        $scope.skillsklerror = true;
                        $scope.$rgDigest();

                    }

                    if( $scope.skillsklerror || $scope.skilldescerror ){
                        return;
                    }

                    $scope.processing = true;
                    profileFactory.updateSkill($scope.skillObjInfo).then(function(data){
                        if(data.sucs===true){
                            $scope.isEditSkill = -1;
                            Ringalert.show('Successfully updated','success');
                        }else{
                            $scope.isEditSkill = -1;
                            Ringalert.show('Request did not process successfully','error');
                        }
                        $scope.processing = false;
                        $scope.$rgDigest();
                    });
                }

                function deleteSkill(index,skillobject) {
                    var sid = skillobject.id;
                    $scope.isEditSkill = -1;
                    profileFactory.deleteSkill(sid).then(function(data){
                        if(data.sucs===true){
                            $scope.skilllist.splice(index, 1);
                            Ringalert.show('Successfully deleted','success');
                        }else{
                            Ringalert.show('Request did not process successfully','error');
                        }
                        $scope.$rgDigest();
                    });
                }

                function enableSkillEditMode(index) {
                    contentIndex = index;
                    $scope.skillObjInfo = $scope.skilllist[index];
                    tmpSkill = angular.copy($scope.skilllist[index]);
                    $scope.isAddNewSkill = false;
                    $scope.isEditSkill = index;
                    $scope.$rgDigest();
                    //$scope.showAddButton = false;
                }

                function cancelUpdateSkill() {
                    $scope.skilllist[contentIndex] = tmpSkill;
                    $scope.isEditSkill = -1;
                    $scope.$rgDigest();
                    //$scope.isAddNewSkill = false;
                    //$scope.showAddButton = true;
                }

                var skillArrayMap = {};
                function processSkillResponse(json){
                    if (json.sucs === true) {
                        for(var i=0; i<json.skillList.length; i++) {
                            var anSkillObject = json.skillList[i];
                                skillArrayMap[anSkillObject.id] = anSkillObject;
                        }
                        var keys = Object.keys(skillArrayMap);
                        var obj;
                        var skillArray = [];

                        for ( var j = 0; j < keys.length; j++ ) {
                            obj = skillArrayMap[keys[j]];
                            skillArray.push(obj);
                        }
                        $scope.skilllist = skillArray;
                    } else {
                        RingLogger.warning('failed to get skill list for user :' + json.utId, RingLogger.tags.PROFILE);
                        RingLogger.log(json, RingLogger.tags.PROFILE);
                    }
                    $scope.$rgDigest();
                }

                var skillSubscriber = $$connector.subscribe(processSkillResponse, {
                    action: [
                        OTYPES.TYPE_ACTION_GET_SKILL
                    ]
                });


                $scope.$on('$destroy', function() {
                    $$connector.unsubscribe(skillSubscriber);
                    $scope.skilllist = [];
                    //profileFactory.setProfileData('skillList', [], $scope.profileObj.getUtId());
                });

            } // END CONTROLLER FUNC

            var linkFunc = function() {

            };

            return {
                restrict: 'E',
                //scope: true,
                templateUrl: 'templates/profile/profile.about-skill.html',
                controller: ProfileSkillController,
                link: linkFunc
            };

        }
