/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfileWork', rgProfileWork);


        function rgProfileWork()  {

            ProfileWorkController.$inject = [  '$scope','Utils', 'profileFactory','$routeParams','rgDropdownService','Ringalert','OPERATION_TYPES','$$connector' ];
            function ProfileWorkController (  $scope,Utils, profileFactory, $routeParams,rgDropdownService,Ringalert,OPERATION_TYPES,$$connector ) { //jshint ignore:line


                var OTYPES = OPERATION_TYPES.SYSTEM.PROFILE;
                // initialization
                if($scope.profileObj.isCurrentUser()){
                    $scope.isOwner = true;
                }else{
                    $scope.isOwner = false;
                }

                profileFactory.getUserProfileData({uId:$routeParams.uId}, $scope.profileObj.isCurrentUser());
                $scope.getProfileData = profileFactory.getProfileData;
                $scope.worklist = [];

                // dropdown
                $scope.ddActionHtml = 'templates/dropdowns/action-dropdown.html';//$templateCache.get('action-dropdown.html');
                $scope.actionWorkDropdown = actionWorkDropdown;

                // models and methods
                $scope.isAddNewWork = false;
                $scope.isEditWork = -1;
                $scope.workObjInfo = {};
                var tmpWork,contentIndex;

                $scope.addNewWork = addNewWork;
                $scope.cancelNewWork = cancelNewWork;
                $scope.submitNewWork = submitNewWork;
                $scope.cancelUpdateWork = cancelUpdateWork;
                $scope.updateWork = updateWork;

                $scope.workcnmerror = false;
                $scope.workpstnerror = false;

                $scope.$watch('workObjInfo.cnm', function (newval,oldval) {
                    if(newval){
                        $scope.workcnmerror = false;
                    }
                });
                $scope.$watch('workObjInfo.pstn', function (newval,oldval) {
                    if(newval){
                        $scope.workpstnerror = false;
                    }
                });

                $scope.$watch('workObjInfo.status', function (newval,oldval) {
                    $scope.workObjInfo.toTimeE = '';
                });

                function addNewWork () {
                    if(tmpWork){
                        $scope.worklist[contentIndex] = tmpWork;
                    }
                    $scope.isEditWork = -1;
                    $scope.workObjInfo.cnm = '';
                    $scope.workObjInfo.pstn = '';
                    $scope.workObjInfo.desc = '';
                    $scope.workObjInfo.fromTimeE = '';
                    $scope.workObjInfo.toTimeE = '';
                    $scope.workObjInfo.ft = '';
                    $scope.workObjInfo.tt = '';
                    $scope.isAddNewWork = true;
                    $scope.$rgDigest();
                }


                function cancelNewWork () {
                    if(tmpWork){
                        $scope.worklist[contentIndex] = tmpWork;
                    }
                    //$scope.workObjInfo.cnm = '';
                    //$scope.workObjInfo.pstn = '';
                    //$scope.workObjInfo.ct = '';
                    //$scope.workObjInfo.desc = '';
                    //$scope.workObjInfo.ft = '';
                    //$scope.workObjInfo.tt = '';
                    $scope.isAddNewWork = false;
                    $scope.$rgDigest();
                }

                function submitNewWork() {

                    if( !$scope.workObjInfo.cnm ){
                        $scope.workcnmerror = true;
                        $scope.$rgDigest();

                    }

                    if( !$scope.workObjInfo.pstn ) {
                        $scope.workpstnerror = true;
                        $scope.$rgDigest();

                    }

                    if( $scope.workcnmerror || $scope.workpstnerror ){
                        return;
                    }

                    $scope.processing = true;

                    if($scope.workObjInfo.fromTimeE && $scope.workObjInfo.toTimeE){
                        if($scope.workObjInfo.fromTimeE > $scope.workObjInfo.toTimeE){
                            Ringalert.show('Your end date can\'t be earlier than your start date. Please try again','info');
                            $scope.processing = false;
                            return;
                        }
                    }

                    //var fromTime = $scope.workObjInfo.ft;
                    //var toTime = $scope.workObjInfo.tt;

                    //var fDate = Utils.profileVerbalDate(fromTime);
                    //$scope.workObjInfo.ft = new Date(fDate).getTime();//will alert something like 1330192800000

                    //to date
                    if($scope.workObjInfo.status === true){
                        $scope.workObjInfo.tt = '0';
                        $scope.workObjInfo.status = true;
                        $scope.workObjInfo.date_info = 'Present';
                        //toTime = 0;

                    }else{

                        if($scope.workObjInfo.toTimeE){
                            $scope.workObjInfo.tt = new Date($scope.workObjInfo.toTimeE).getTime();//will alert something like 1330192800000
                        }else{
                            $scope.workObjInfo.tt = 1;
                        }
                    }

                    if($scope.workObjInfo.fromTimeE){
                        $scope.workObjInfo.ft = new Date($scope.workObjInfo.fromTimeE).getTime();//will alert something like 1330192800000
                    }else{
                        $scope.workObjInfo.ft = 1;
                    }

                    profileFactory.submitNewWork($scope.workObjInfo).then(function(data) {

                        if(data.sucs === true){
                            $scope.workObjInfo.id = data.id;
                            if($scope.workObjInfo.ft){
                                $scope.workObjInfo.fromTimeE = Utils.profileVerbalDate($scope.workObjInfo.ft);
                            }else{
                                $scope.workObjInfo.ft = 1;
                            }
                            if($scope.workObjInfo.tt){
                                $scope.workObjInfo.toTimeE = Utils.profileVerbalDate($scope.workObjInfo.tt);
                            }else{
                                $scope.workObjInfo.tt = 1;
                            }
                            var newWorkObj = angular.copy($scope.workObjInfo);
                            $scope.worklist.push(newWorkObj);

                            // profileFactory.setProfileData('workList', obj, $scope.profileObj.getUtId());

                            Ringalert.show('Career info added successfully','success');
                            $scope.isAddNewWork = false;
                            $scope.isEditWork = -1;

                        }else{
                            Ringalert.show('Request did not process successfully','error');
                            $scope.isAddNewWork = false;
                            $scope.isEditWork = -1;
                        }
                        $scope.processing = false;
                        $scope.$rgDigest();

                    });
                }

                function actionWorkDropdown(actionObj) {

                    //actionObj.event.preventDefault();

                    switch(actionObj.action) {
                        case 'edit':
                            enableWorkEditMode( actionObj.data.index );
                            rgDropdownService.close(actionObj.event);
                            break;
                        case 'delete':
                            deleteWork(actionObj.data.index,actionObj.data.obj);
                            rgDropdownService.close(actionObj.event);
                            break;
                        default:
                    }
                }

                function enableWorkEditMode(index) {
                    contentIndex = index;
                    $scope.workObjInfo = $scope.worklist[index];
                    tmpWork =  angular.copy($scope.worklist[index]);


                    if ($scope.workObjInfo.tt === 1 || $scope.workObjInfo.tt === '0' || $scope.workObjInfo.tt === 0) {
                        $scope.workObjInfo.toTimeE = null;
                    }
                    if ($scope.workObjInfo.ft === 1) {
                        $scope.workObjInfo.fromTimeE = null;
                    }
                    $scope.isAddNewWork = false;
                    $scope.isEditWork = index;
                    $scope.$rgDigest();

                }

                function updateWork() {

                    if( !$scope.workObjInfo.cnm ){
                        $scope.workcnmerror = true;
                        $scope.$rgDigest();

                    }

                    if( !$scope.workObjInfo.pstn ) {
                        $scope.workpstnerror = true;
                        $scope.$rgDigest();

                    }

                    if( $scope.workcnmerror || $scope.workpstnerror ){
                        return;
                    }

                    $scope.processing = true;

                    if($scope.workObjInfo.fromTimeE && $scope.workObjInfo.toTimeE){
                        var workFromTime,workToTime;
                        workFromTime = $scope.workObjInfo.fromTimeE;
                        workToTime   = $scope.workObjInfo.toTimeE;

                        if(typeof(workFromTime)=='string'){
                            workFromTime = new Date(workFromTime);
                        }
                        if(typeof(workToTime)=='string'){
                            workToTime = new Date(workToTime);
                        }
                        if(workFromTime > workToTime){
                            Ringalert.show('Your end date can\'t be earlier than your start date. Please try again','info');
                            $scope.processing = false;
                            return;
                        }
                        $scope.$rgDigest();
                    }

                    if($scope.workObjInfo.fromTimeE){
                        $scope.workObjInfo.ft = new Date($scope.workObjInfo.fromTimeE).getTime();//will alert something like 1330192800000
                    }else{
                        $scope.workObjInfo.ft = 1;
                    }
                    if($scope.workObjInfo.toTimeE){
                        $scope.workObjInfo.tt = new Date($scope.workObjInfo.toTimeE).getTime();//will alert something like 1330192800000
                    }else{
                        $scope.workObjInfo.tt = 1;
                    }
                    if($scope.workObjInfo.status === true){
                        $scope.workObjInfo.tt = '0';
                        $scope.workObjInfo.status = true;
                        $scope.workObjInfo.date_info = 'Present';

                    }

                    profileFactory.updateWork($scope.workObjInfo).then(function(data){
                        if(data.sucs === true){

                            if($scope.workObjInfo.ft){
                                $scope.workObjInfo.fromTimeE = Utils.profileVerbalDate($scope.workObjInfo.ft);
                            }else{
                                $scope.workObjInfo.ft = 1;
                            }
                            if($scope.workObjInfo.tt){
                                $scope.workObjInfo.toTimeE = Utils.profileVerbalDate($scope.workObjInfo.tt);
                            }else{
                                $scope.workObjInfo.tt = 1;
                            }
                            if( $scope.workObjInfo.status === true ) {
                                $scope.workObjInfo.tt = 0;
                                $scope.date_info = 'Present';
                            }
                            Ringalert.show('Updated successfully','success');
                            $scope.isEditWork = -1;
                        }else{
                            $scope.isEditWork = -1;
                            Ringalert.show('Request did not process successfully','error');
                        }
                        $scope.processing = false;
                        $scope.$rgDigest();

                    });
                }

                function cancelUpdateWork() {
                    $scope.worklist[contentIndex] = tmpWork;
                    $scope.isEditWork = -1;
                    $scope.$rgDigest();
                }

                function deleteWork(index,workObject) {
                    $scope.isEditWork = -1;
                    var workId = workObject.id;
                    profileFactory.deleteWork(workId).then(function(data){
                        if(data.sucs===true){
                            $scope.worklist.splice(index, 1);
                            Ringalert.show('Successfully deleted','success');
                        }else{
                            Ringalert.show('Request did not process successfully','error');
                        }
                        $scope.$rgDigest();
                    });
                }


                var workArrayMap = {};
                function processWorkResponse(json){
                    if (json.sucs === true) {
                        for(var i=0; i<json.workList.length; i++) {
                            var anWorkObject = json.workList[i];
                                workArrayMap[anWorkObject.id] = anWorkObject;
                        }
                        var keys = Object.keys(workArrayMap);
                        var obj;
                        var workArray = [];

                        for ( var j = 0; j < keys.length; j++ ) {
                            obj = workArrayMap[keys[j]];

                            obj.fromTime = new Date(obj.ft);
                            obj.toTime = new Date(obj.tt);

                            if(obj.tt===0){
                                obj.status = true;
                                obj.date_info = 'Present';
                            }else{
                                obj.toTimeE = Utils.profileVerbalDate(obj.tt);
                            }
                            obj.fromTimeE = Utils.profileVerbalDate(obj.ft);

                            workArray.push(obj);
                        }
                        $scope.worklist = workArray;
                    } else {
                        RingLogger.warning('failed to get Work list for user :' + json.utId, RingLogger.tags.PROFILE);
                        RingLogger.log(json, RingLogger.tags.PROFILE);
                    }
                    $scope.$rgDigest();
                }

                var workSubscriber = $$connector.subscribe(processWorkResponse, {
                    action: [
                        OTYPES.TYPE_ACTION_GET_WORK
                    ]
                });

                $scope.$on('$destroy', function() {
                    $$connector.unsubscribe(workSubscriber);
                    $scope.worklist = [];
                    //profileFactory.setProfileData('workList', [], $scope.profileObj.getUtId());
                });

            } // END CONTROLLER FUNC

            var linkFunc = function() {
            };

            return {
                restrict: 'E',
                //scope: true,
                templateUrl: 'templates/profile/profile.about-work.html',
                controller: ProfileWorkController,
                link: linkFunc
            };

        }
