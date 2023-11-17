/*
 * © Ipvision
 */

    angular
        .module('ringid.profile')
        .directive('rgProfileBasic', rgProfileBasic);


    function rgProfileBasic()  {

        ProfileBasicController.$inject = ['Storage', '$scope','Utils', 'profileFactory','Ringalert', '$rootScope'];
        function ProfileBasicController (Storage, $scope,Utils, profileFactory,Ringalert, $rootScope) { //jshint ignore:line

            $scope.isEditProfile = false;
            $scope.processing = false;

            //$scope.$watch('tmpBasic.fn', function (newval, oldval) {
            //    var rexpression =/(!?[\.\-\_\!\@\#\$\%\&\*\{\}\(\)\[\]\:\;\~\,\\\^\/\<\>\?\'\"\|\=\+\`])+/;
            //
            //    $scope.fullnameRegex = rexpression.test(newval);
            //});

            $scope.enableEditBasic = enableEditBasic;
            $scope.updateMyBasicInfo = updateMyBasicInfo;
            $scope.cancelUpdateMyBasicInfo = cancelUpdateMyBasicInfo;

            function enableEditBasic(event) {
                event.preventDefault();
                $scope.tmpBasic = angular.copy($scope.profileObj.getBasicInfo());
                if ($scope.tmpBasic.mDay === 1 || $scope.tmpBasic.mDay === '1') {
                    $scope.tmpBasic.marriageDay = null;
                }
                if ($scope.tmpBasic.birthDay === 1 || $scope.tmpBasic.birthDay === '1') {
                    $scope.tmpBasic.birthday = null;
                }
                //if ($scope.isEditProfile === false) {
                $scope.isEditProfile = true;
                $scope.$rgDigest();
                //}
            }

            function cancelUpdateMyBasicInfo() {
                //$scope.tmpBasic = $scope.tmpBasic;
                $scope.isEditProfile = false;
                $scope.$rgDigest();
                //$scope.isOwner = true;
            }
            function updateMyBasicInfo() {
                $scope.processing = true;
                var mdateobj = $scope.tmpBasic.marriageDay;
                if (mdateobj==null){
                    mdateobj = 1;
                }
                var dateobj;

                var datetype = typeof($scope.tmpBasic.birthday);
                var mdatetype = typeof(mdateobj);
                if (datetype==='string') {
                    var data = $scope.tmpBasic.birthday.split('-');
                    var bdDate = parseInt(data[0])+','+parseInt(data[1])+','+parseInt(data[2]);
                    dateobj = new Date(bdDate);
                } else {
                    dateobj = $scope.tmpBasic.birthday;
                    if($scope.tmpBasic.birthDay !== 1){
                        if($scope.tmpBasic.birthDay !== '1'){
                            var frTime = Utils.profileVerbalDate($scope.tmpBasic.birthDay);
                            $scope.tmpBasic.birthday = frTime;
                        }

                    }

                }

                if(mdatetype === 'string'){
                    var mdata = mdateobj.split('-');
                    var mDate = parseInt(mdata[0])+','+parseInt(mdata[1])+','+parseInt(mdata[2]);
                    mdateobj = new Date(mDate);
                }


                profileFactory.updateUserProfile($scope.uId,$scope.tmpBasic,dateobj,mdateobj).then(function(data){
                    if(data.sucs===true){
                        $scope.tmpBasic.birthDay = dateobj ? dateobj.getTime() : '1';
                        if( typeof(dateobj) ==='object' ){
                            $scope.currentUser.setBirthday($scope.tmpBasic.birthDay);
                        }else{
                            $scope.currentUser.setBirthday('1');
                        }
                        if( mdatetype ==='object' ){
                            $scope.currentUser.setMarriageday(mdateobj.getTime());
                        }else{
                            $scope.currentUser.setMarriageday('1');
                        }


                        $scope.profileObj.getBasicInfo().birthDay = $scope.tmpBasic.birthDay;

                        $scope.currentUser.setName($scope.tmpBasic.fn);
                        $scope.currentUser.setHomeCity($scope.tmpBasic.hc);
                        $scope.currentUser.setCurrentCity($scope.tmpBasic.cc);
                        $scope.currentUser.setAboutMe($scope.tmpBasic.am);
                        Storage.updateLoginData('fn', $scope.tmpBasic.fn);
                        $scope.currentUser.setGender($scope.tmpBasic.gr);

                        Ringalert.show('Successfully updated','success');
                        $scope.isEditProfile = false;
                        //$scope.isOwner = true;
                    }else{
                        $scope.isEditProfile = false;
                        Ringalert.show(data.mg,'error');
                    }
                    $scope.processing = false;
                    $rootScope.$rgDigest();
                });
            }



            //datepicker
            $scope.isDatePickerOpen = false;
            $scope.model = {};

            $scope.open = function($event, elementOpened) {
                $event.preventDefault();
                $event.stopPropagation();
                switch(elementOpened){
                    case 'wcalendar':
                        $scope.model.wcalendarTo = false;
                        break;
                    case 'wcalendarTo':
                        $scope.model.wcalendar = false;
                        break;
                    case 'ecalendar':
                        $scope.model.ecalendarTo = false;
                        break;
                    case 'ecalendarTo':
                        $scope.model.ecalendar = false;
                        break;
                    case 'mcalendar':
                        $scope.model.mcalendar = false;
                        break;
                }
                $scope.model[elementOpened] = !$scope.model[elementOpened];

            };
            $scope.dateOptions = {
                showWeeks:'false',
                startingDay: 1
            };

            var today = new Date();
            today.setMonth(today.getMonth()+6);
            $scope.minDate = new Date();

            $scope.maxBirthDate = new Date(today.getFullYear(),today.getMonth() , today.getDate());
            $scope.maxWeddingDate = new Date(today.getFullYear()+20,today.getMonth() , today.getDate());


        } // END CONTROLLER FUNC


        return {
            restrict: 'E',
            //scope: true,
            templateUrl: 'templates/profile/profile.about-basic.html',
            controller: ProfileBasicController
        };

    }
