/**
 * © Ipvision
 */


    angular
        .module('ringid.shared')
        .controller('allSuggestionController', allSuggestionController);

    allSuggestionController.$inject = [ '$scope', '$boxInstance', 'localData', 'friendsFactory','InviteFactory','OPERATION_TYPES','$$connector','rgScrollbarService', 'Api'];
    function allSuggestionController( $scope, $boxInstance, localData, friendsFactory,InviteFactory,OPERATION_TYPES,$$connector,rgScrollbarService, Api) { // jshint ignore:line

        $scope.users = [];
        var OTYPES = OPERATION_TYPES.SYSTEM.FRIENDS;
        $scope.state = InviteFactory.state;
        $boxInstance.opened.then(function () {

            $scope.users = localData.target.all();
            $scope.$rgDigest();

        });
        var totalFriend = localData.target.length();

        $scope.$watch('state.isRequestsLoading', function (n,o) {
            $scope.$rgDigest();
        });

        $scope.contactListAction = function(actionObj) {
            if (!actionObj.friend.isLoading()) {
                friendsFactory.friendAction(actionObj,true).then(function() {
                    $scope.$rgDigest();
                }, function() {
                    $scope.$rgDigest();
                });
                $scope.$rgDigest();
            }
        };

        $scope.loadmorefriend = function() {
            InviteFactory.getSuggestionContactsDetails(5);
            $scope.$rgDigest();
        };

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

        var subscriptionKey = $$connector.subscribe(processPeople, {action: [
                OTYPES.TYPE_PEOPLE_YOU_MAY_KNOW_DETAILS
            ]
        });

        function processPeople(data){
            if(data){
                if(InviteFactory.noOfSuggestions() > totalFriend){
                    rgScrollbarService.recalculate($scope);
                    $scope.$rgDigest();
                }
                totalFriend = InviteFactory.noOfSuggestions();
            }
        }

        $scope.$on('$destroy', function() {
            $$connector.unsubscribe(subscriptionKey);
        });
    }

