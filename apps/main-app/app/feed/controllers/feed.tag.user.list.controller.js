


    angular.module('ringid.feed')
    .controller('feedTagUserListController',feedTagUserListController);

    feedTagUserListController.$inject = ['$scope','remoteData','userFactory','Api'];

    function feedTagUserListController($scope, remoteData ,User,Api){
        var tagUserIds = remoteData.fTgLst;
        $scope.usersUtIds =[];
        $scope.users =[];
        var usercount = tagUserIds.length;
        if(usercount){
            $scope.total = usercount;
            for(var i = 0;i < tagUserIds.length;i++){
                tagUserIds[i].fn = tagUserIds[i].nm;
                $scope.users.push(User.createByUtId(tagUserIds[i],true));
            }
        }

        $scope.getMutualFriend = function(user) {
            return{
                data: function() {
                    return {
                        target: user
                    };
                },
                promise: Api.user.getMutualFriends(user)
            };
        };

    }

