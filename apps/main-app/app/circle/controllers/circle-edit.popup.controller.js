/*
 * © Ipvision
 */

    angular
        .module('ringid.circle')
        .controller('circleEditPopupController', circleEditPopupController);

    circleEditPopupController.$inject = ['$scope' ,'circlesManager', '$boxInstance', 'friendsFactory', '$$stackedMap', 'localData', 'remoteData', 'Ringalert', 'SystemEvents'];
    function circleEditPopupController($scope,circlesManager, $boxInstance, friendsFactory, $$stackedMap, localData, remoteData, Ringalert, SystemEvents) { // jshint ignore:line

        $scope.selectedMembers = [];
        $scope.state = {
            loading: false,
            noData: false
        };

        $scope.circleMemberSection = false;
        $scope.friendDropdown = false;

        $scope.$watch('friendsNameFilter',function(newval,oldval){
            if(newval){
                $scope.friendDropdown = true;
            }else{
                $scope.friendDropdown = false;
            }
        });

        $scope.closeFriendDd = function(){
            $scope.friendDropdown = false;
            $scope.$rgDigest();
        };

        $scope.friendsNameFilter = '';
        $scope.memberfilter = '';

        $scope.$on('$destroy', function() {
            $scope.friendlist.reset();
            $scope.selectedMembers = [];
        });

        $scope.friendlist = friendsFactory.getFriends('friends').copy();

        //$scope.models = {
        //    errCircleName: false,
        //    errMemberList: false,
        //    errAdminList: false
        //};

        $scope.memberList = $$stackedMap.createNew();
        //  $scope.adminList = $$stackedMap.createNew();
        $scope.addToCircle = addToCircle;
        //$scope.addToAdmin = addToAdmin;
        $scope.removeMember= removeMember;
        //$scope.removeAdmin = removeAdmin;
        $scope.updateCircle = updateCircle;

        $scope.close = $boxInstance.close;
        //$scope.validateCircle = validateCircle;

        function updateCircle() {
            var frnds = [];
            for(var i=0; i<$scope.memberList.length();i++){
                frnds[i] = {admin:'false',uId:$scope.memberList.all()[i].value.user.uId};
            }
            circlesManager.addMembers(frnds, localData.target).then(function(data){
                if(data.sucs===true) {
                    circlesManager.getSingleCircleInfo(localData.target,localData.circleObj);
                    //    .then(function (json) {
                    //    $scope.close();
                    //    $scope.$rgDigest();
                    //});
                }else{
                    Ringalert.show(data.mg, 'error');
                    $scope.$rgDigest();
                }
                $scope.close();
            });

        }

        function addToCircle(member) {
            $scope.memberList.add(member.getUtId(), member);
            $scope.selectedMembers.push(member);
            $scope.friendlist.remove(member.getUtId());
            $scope.friendDropdown = false;
            $scope.friendsNameFilter = '';
            $scope.$rgDigest();
        }

        function removeMember( member) {
            $scope.memberList.remove(member.getUtId());
            $scope.$rgDigest();
        }
        //
        //function addToAdmin( admin ) {
        //    //needMoreFriends();
        //    $scope.adminList.add(admin.getUtId(), admin);
        //    $scope.memberList.remove(admin.getUtId());
        //    $scope.$rgDigest();
        //}

        //function removeAdmin( admin) {
        //    $scope.adminList.remove(admin.getUtId());
        //    $scope.memberList.add(admin.getUtId(), admin);
        //    $scope.$rgDigest();
        //}
        //
    }

