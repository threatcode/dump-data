/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfileEducation', rgProfileEducation);


        function rgProfileEducation()  {

            ProfileEducationController.$inject = [ 'Ringalert', '$scope','Utils', 'profileFactory','$routeParams','rgDropdownService','OPERATION_TYPES','$$connector' ];
            function ProfileEducationController ( Ringalert, $scope,Utils, profileFactory, $routeParams,rgDropdownService,OPERATION_TYPES,$$connector ) { //jshint ignore:line
                var tmpEducation,contentIndex;
                var OTYPES = OPERATION_TYPES.SYSTEM.PROFILE;

                if($scope.profileObj.isCurrentUser()){
                    $scope.isOwner = true;
                }else{
                    $scope.isOwner = false;
                }

                var tempEduList;

                // initialization
                profileFactory.getUserProfileData({uId:$routeParams.uId}, $scope.profileObj.isCurrentUser());
                $scope.getProfileData = profileFactory.getProfileData;
                $scope.educationlist = [];


                $scope.edusclerror = false;
                $scope.edudgrerror = false;
                $scope.educntnerror = false;

                $scope.$watch('eduObjInfo.scl', function (newval,oldval) {
                    if(newval){
                        $scope.edusclerror = false;
                    }
                });
                $scope.$watch('eduObjInfo.dgr', function (newval,oldval) {
                    if(newval){
                        $scope.edudgrerror = false;
                    }
                });
                $scope.$watch('eduObjInfo.cntn', function (newval,oldval) {
                    if(newval){
                        $scope.educntnerror = false;
                    }
                });


                // dropdown
                $scope.ddActionHtml = 'templates/dropdowns/action-dropdown.html';//$templateCache.get('action-dropdown.html');
                $scope.actionEduDropdown = function(actionObj) {
                    //actionObj.event.preventDefault();
                    rgDropdownService.close(actionObj.event);
                    switch(actionObj.action) {
                        case 'edit':
                            enableEducationEditMode(actionObj.data.index,actionObj.data.obj);

                            break;
                        case 'delete':
                            deleteEducation(actionObj.data.index,actionObj.data.obj);

                            break;
                        default:
                    }
                };

                // models and methods
                $scope.isaddNewEducation = false;
                $scope.isEditEducation = -1;
                $scope.eduObjInfo = {}; // profile education

                $scope.addNewEducation = addNewEducation;
                $scope.submitNewEducation = submitNewEducation;
                $scope.updateEducation = updateEducation;
                $scope.cancelAddEducation = cancelAddEducation;
                $scope.cancelUpdateEducation = cancelUpdateEducation;

                function addNewEducation(){ // profile-education
                    if(tmpEducation){
                        $scope.educationlist[contentIndex] = tmpEducation;
                    }
                    $scope.isEditEducation = -1;
                    $scope.eduObjInfo.scl='';
                    $scope.eduObjInfo.dgr='';
                    $scope.eduObjInfo.cntn='';
                    $scope.eduObjInfo.toTimeE='';
                    $scope.eduObjInfo.fromTimeE='';
                    $scope.isaddNewEducation = true;

                    $scope.$rgDigest();
                }

                function enableEducationEditMode(index,object) {
                    contentIndex = index;
                    $scope.eduObjInfo = $scope.educationlist[index];
                    tmpEducation = angular.copy($scope.educationlist[index]);

                    if ($scope.eduObjInfo.tt === 1) {
                        $scope.eduObjInfo.toTimeE = null;
                    }
                    if ($scope.eduObjInfo.ft === 1) {
                        $scope.eduObjInfo.fromTimeE = null;
                    }
                    $scope.isaddNewEducation = false;
                    $scope.isEditEducation = index;

                    $scope.$rgDigest();

                }

                function cancelAddEducation(){
                    if(tmpEducation){
                        $scope.educationlist[contentIndex] = tmpEducation;
                    }
                    //$scope.educationlist = $scope.getProfileData('educationList', $scope.profileObj.getUtId());
                    //$scope.eduObjInfo.scl='';
                    //$scope.eduObjInfo.dgr='';
                    //$scope.eduObjInfo.cntn='';
                    //$scope.eduObjInfo.toTimeE='';
                    //$scope.eduObjInfo.fromTimeE='';

                    $scope.isaddNewEducation = false;
                    $scope.isEditEducation = -1;

                    $scope.$rgDigest();
                }

                function cancelUpdateEducation() {
                    $scope.educationlist[contentIndex] = tmpEducation;
                    $scope.isEditEducation = -1;
                    //$scope.isaddNewEducation = false;
                    //$scope.showAddButton = true;
                    $scope.$rgDigest();

                }


                function updateEducation() {

                    if( !$scope.eduObjInfo.scl ){
                        $scope.edusclerror = true;
                        $scope.$rgDigest();
                    }

                    if( !$scope.eduObjInfo.dgr ) {
                        $scope.edudgrerror = true;
                        $scope.$rgDigest();
                    }

                    if( !$scope.eduObjInfo.cntn ) {
                        $scope.educntnerror = true;
                        $scope.$rgDigest();
                    }

                    if( $scope.edusclerror || $scope.edudgrerror || $scope.educntnerror ){
                        return;
                    }

                    $scope.processing = true;

                    if($scope.eduObjInfo.fromTimeE && $scope.eduObjInfo.toTimeE){
                        var eduFromTime,eduToTime;
                        eduFromTime = $scope.eduObjInfo.fromTimeE;
                        eduToTime   = $scope.eduObjInfo.toTimeE;

                        if(typeof(eduFromTime)=='string'){
                            eduFromTime = new Date(eduFromTime);
                        }
                        if(typeof(eduToTime)=='string'){
                            eduToTime = new Date(eduToTime);
                        }
                        if(eduFromTime > eduToTime){
                            Ringalert.show('Your end date can\'t be earlier than your start date. Please try again','info');
                            $scope.processing = false;
                            return;
                        }
                        $scope.$rgDigest();
                    }
                    //$scope.eduObjInfo.ft = new Date($scope.eduObjInfo.fromTimeE).getTime();//will alert something like 1330192800000
                   // $scope.eduObjInfo.tt = new Date($scope.eduObjInfo.toTimeE).getTime();//will alert something like 1330192800000

                    if($scope.eduObjInfo.fromTimeE){
                        $scope.eduObjInfo.ft = new Date($scope.eduObjInfo.fromTimeE).getTime();//will alert something like 1330192800000
                    }else{
                        $scope.eduObjInfo.ft = 1;
                    }
                    if($scope.eduObjInfo.toTimeE){
                        $scope.eduObjInfo.tt = new Date($scope.eduObjInfo.toTimeE).getTime();//will alert something like 1330192800000
                    }else{
                        $scope.eduObjInfo.tt = 1;
                    }

                    profileFactory.updateEducation($scope.eduObjInfo).then(function(json){
                        if(json.sucs===true){
                            if($scope.eduObjInfo.fromTimeE){
                                $scope.eduObjInfo.fromTimeE = Utils.profileVerbalDate($scope.eduObjInfo.ft);
                            }else{
                                $scope.eduObjInfo.ft = 1;
                                $scope.eduObjInfo.fromTimeE = '';
                            }
                            if($scope.eduObjInfo.toTimeE){
                                $scope.eduObjInfo.toTimeE = Utils.profileVerbalDate($scope.eduObjInfo.tt);
                            }else{
                                $scope.eduObjInfo.tt = 1;
                                $scope.eduObjInfo.toTimeE = '';
                            }
                            $scope.isEditEducation = -1;

                            Ringalert.show('Successfully updated','success');
                        }else{
                            $scope.isEditEducation = -1;
                            Ringalert.show('Request did not process successfully','error');
                        }
                        $scope.processing = false;
                        $scope.$rgDigest();

                    });
                }


                function submitNewEducation() {

                    if( !$scope.eduObjInfo.scl ){
                        $scope.edusclerror = true;
                        $scope.$rgDigest();
                    }

                    if( !$scope.eduObjInfo.dgr ) {
                        $scope.edudgrerror = true;
                        $scope.$rgDigest();
                    }

                    if( !$scope.eduObjInfo.cntn ) {
                        $scope.educntnerror = true;
                        $scope.$rgDigest();
                    }

                    if( $scope.edusclerror || $scope.edudgrerror || $scope.educntnerror ){
                        return;
                    }

                    $scope.processing = true;

                    if($scope.eduObjInfo.fromTimeE && $scope.eduObjInfo.toTimeE){
                        if($scope.eduObjInfo.fromTimeE > $scope.eduObjInfo.toTimeE){
                            Ringalert.show('Your end date can\'t be earlier than your start date. Please try again','info');
                            $scope.processing = false;
                            return;
                        }
                    }

                    if($scope.eduObjInfo.fromTimeE){
                        $scope.eduObjInfo.ft = new Date(Utils.profileVerbalDate($scope.eduObjInfo.fromTimeE)).getTime();//will alert something like 1330192800000
                    }else{
                        $scope.eduObjInfo.ft = 1;
                    }
                    if($scope.eduObjInfo.toTimeE){
                        $scope.eduObjInfo.tt = new Date(Utils.profileVerbalDate($scope.eduObjInfo.toTimeE)).getTime();//will alert something like 1330192800000
                    }else{
                        $scope.eduObjInfo.tt = 1;
                    }

                    $scope.eduObjInfo.ut = new Date().getTime();
                    $scope.eduObjInfo.af = 1;
                    $scope.eduObjInfo.grtd = false;//have to add in ui
                    $scope.eduObjInfo.iss = true;

                    profileFactory.submitNewEducation($scope.eduObjInfo).then(function(json) {
                        if (json.sucs === true) {
                            // new education
                            $scope.eduObjInfo.id = json.id;
                            var eduObj = angular.copy($scope.eduObjInfo);
                            $scope.educationlist.push(eduObj);

                            // profileFactory.setProfileData('educationList', obj, $scope.profileObj.getUtId());

                            Ringalert.show('Education info added successfully','success');
                            $scope.isaddNewEducation = false;
                            $scope.isEditEducation = -1;
                        }else{
                            Ringalert.show('Request did not process successfully','error');
                            $scope.isaddNewEducation = false;
                            $scope.isEditEducation = -1;
                        }
                        $scope.isaddNewEducation = false;
                        $scope.isEditEducation = -1;
                        $scope.processing = false;
                        $scope.$rgDigest();
                    });
                }


                function deleteEducation(index,eduObject) {
                    var eduId = eduObject.id;
                    $scope.isEditEducation = -1;
                    profileFactory.deleteEducation(eduId).then(function(data){
                        if(data.sucs===true){
                            $scope.educationlist.splice(index, 1);
                            Ringalert.show('Successfully deleted','success');
                        }else{
                            Ringalert.show('Request did not process successfully','error');
                        }
                        $scope.$rgDigest();

                    });
                }

                var eduArrayMap = {};
                function processEduResponse(json){
                    if (json.sucs === true) {
                        for(var i=0; i<json.educationList.length; i++) {
                            var anEduObject = json.educationList[i];
                                eduArrayMap[anEduObject.id] = anEduObject;
                        }
                        var keys = Object.keys(eduArrayMap);
                        var obj;
                        var eduArray = [];

                        for ( var j = 0; j < keys.length; j++ ) {
                            obj = eduArrayMap[keys[j]];

                            obj.fromTime = new Date(obj.ft);
                            obj.toTime = new Date(obj.tt);

                            obj.fromTimeE = Utils.profileVerbalDate(obj.ft);

                            obj.toTimeE = Utils.profileVerbalDate(obj.tt);

                            eduArray.push(obj);
                        }
                        $scope.educationlist = eduArray;
                    } else {
                        
                        
                    }
                    $scope.$rgDigest();
                }

                var eduSubscriber = $$connector.subscribe(processEduResponse, {
                    action: [
                        OTYPES.TYPE_ACTION_GET_EDUCATION
                    ]
                });

                $scope.$on('$destroy', function() {
                    $$connector.unsubscribe(eduSubscriber);
                    $scope.educationlist = [];
                    //profileFactory.setProfileData('educationList', [], $scope.profileObj.getUtId());
                });

            } // END CONTROLLER FUNC

            var linkFunc = function() {
            };

            return {
                restrict: 'E',
                //scope: true,
                templateUrl: 'templates/profile/profile.about-education.html',
                controller: ProfileEducationController,
                link: linkFunc
            };

        }
