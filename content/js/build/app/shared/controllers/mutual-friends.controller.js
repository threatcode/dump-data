/**
 * © Ipvision
 */


    angular
        .module('ringid.shared')
        .controller('mutualFriendsController', mutualFriendsController);

    mutualFriendsController.$inject = [ '$scope','remoteData', 'friendsFactory','userFactory','Api','rgScrollbarService' ];
    function mutualFriendsController( $scope,remoteData, friendsFactory,userFactory,Api,rgScrollbarService ) { // jshint ignore:line

        var mutualIds = remoteData.mfIDs;
        $scope.mutualfriends = [];
        //$scope.state = InviteFactory.state;

        friendsFactory.getContactDetailsByUtIds(mutualIds).then(function(data){
            $scope.mutualfriends = [];
            if(data.sucs===true){
                for(var i=0; i<data.contacts.length; i++){
                    $scope.mutualfriends.push(userFactory.create(data.contacts[i]));
                }
                $scope.$rgDigest();
            }
            rgScrollbarService.recalculate($scope);
            $scope.$rgDigest();
        });

        $scope.getMutualFriend = function(user) {

            return{
                data: function() {
                    return {
                        target: user
                    };
                },
                promise: Api.user.getMutualFriends(user) //InviteFactory.getMutualFriend(user)
            };
        };

        // MUTUAL FRIENDS MEAN USER AND THEY ARE ALREADY FRIENDS NO NEED OF friendsAction
        //$scope.contactListAction = function(actionObj) {
             //if (!actionObj.friend.isLoading()) {
                 //friendsFactory.friendAction(actionObj, true).then(function() {
                     //$scope.$rgDigest();
                 //}, function() {
                     //$scope.$rgDigest();
                 //});
                //$scope.$rgDigest();
             //}
        //};

    }

