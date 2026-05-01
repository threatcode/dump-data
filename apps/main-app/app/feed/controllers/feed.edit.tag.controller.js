

    angular.module('ringid.feed')
    .filter("filterUserByName", filterUserByName)
    .controller('feedEditTagController',feedEditTagController);

    function filterUserByName(){
        return function(items, name) {
                            if (items) {
                                var filtered = [];
                                var nameMatch = new RegExp(name, 'i');
                                for (var i = 0; i < items.length; i++) {
                                    if(items[i].getName().match(nameMatch)){
                                        filtered.push(items[i]);
                                    }
                                }
                                return filtered;
                            }
                };
    }

    feedEditTagController.$inject = ['$scope','localData', 'remoteData', '$$connector','feedFactory','OPERATION_TYPES','userFactory','$filter','friendsFactory','Ringalert', 'Auth'];

    function feedEditTagController($scope, localData, remoteData, $$connector,feedFactory,OPERATION_TYPES,User,$filter,friendsFactory,Ringalert, Auth){

        var feed = localData.feed,
            sentRequest=false,
            friends = [], //feed.getTagUsers();
            tagUsers = [],
            tagUsersBackup = [],
            users = [];

        $scope.users = [] ;
        $scope.filterText='';
        $scope.loading = true;
        $scope.currentType = 'a';//all shows at  first

        var currentUser = Auth.currentUser();

        function setUsers(){
            $scope.users = $filter('filterUserByName')(users,$scope.filterText);
        }

        function searchRequest(){
            if(sentRequest)return;
            friendsFactory.searchContact({schPm: $scope.filterText}, true);
            $scope.loading = true;
            sentRequest = true;
        }

        $scope.$watch('filterText', function(newValue, oldValue) {

            setUsers();
            if($scope.users.length < 5 && newValue.length > oldValue.length){ //newValue.length > oldValue.length for making sure not sending request while backspacing
                sentRequest = false;
                searchRequest();
            }else{
                sentRequest = false;
                $scope.loading = false;
            }
        });

        $scope.$watch(friendsFactory.friends.length(), function(newValue, oldValue) {

            crossMatch();
            $scope.loading = false;
            sentRequest = false;

        });

        function crossMatch(){

            if($scope.currentType !== 'a'){
                setUsers();return;
            }

            friendsFactory.friends.doForAll(function(item){

                var liteu = item.getLiteUser();

                if( users.contains( liteu, function(a,b){ return a.equals(b,'utId'); } ) !== -1){
                    return;
                }

                if( tagUsers.contains(liteu,function(a,b){ return a.equals(b,'utId'); }) === -1){
                    users.push(liteu);
                }

            });

            var temp = tagUsers.filter(function(templu){
                return users.contains( templu, function(a,b){ return a.equals(b,'utId'); } ) === -1;
            });

            users = users.concat(temp);
            setUsers();
        }



        if( !!remoteData ){

            if(remoteData.fTgLst && remoteData.fTgLst.length){

                for(var i = 0;i < remoteData.fTgLst.length;i++){

                    remoteData.fTgLst[i].fn = remoteData.fTgLst[i].nm;


                    if( tagUsers.contains(remoteData.fTgLst[i].utId,function(a,b){ return a.equals(b,'utId'); }) === -1)
                    {
                        tagUsers.push(User.createByUtId(remoteData.fTgLst[i],true));//saving the lite user
                        tagUsersBackup.push(tagUsers[i]);
                    }

                }

                crossMatch();

            }
        }

        $scope.loading = false;




        if(!feed.hasTagUsers()){
            crossMatch();
        }

        $scope.toggle = function(type){
            if($scope.currentType == type){
                return;
            }
            $scope.currentType = type;
            if(type == 'a'){
                users = [];
                crossMatch();
            }else{
                users = tagUsers;
                setUsers();
            }

        };

        $scope.checked = function(item){
            return tagUsers.indexOf(item) > -1;
        };

        $scope.loadMore = function(){
            if($scope.filterText.length){
                searchRequest();
            }else{
                friendsFactory.getContactDetails();
                $scope.loading = true;
            }

        };

        $scope.addRemoveTag = function(event,item){
            var index = tagUsers.indexOf(item);
            if(index > -1){
                tagUsers.splice(index, 1);
            }else{
                tagUsers.push(item);
                if(($scope.users.length - tagUsers.length) < 5){
                    $scope.loadMore();
                }
            }
        };

        $scope.saveTagUser = function(){

                var removed = tagUsersBackup.difference(tagUsers),
                    added = tagUsers.difference(tagUsersBackup),
                    index;

                if(!removed.length && !added.length){
                    Ringalert.show("Please Make Your Changes Before Submit",'warning');
                    return;
                 }

                 if(added.length === 0 && removed.length === tagUsersBackup.length){ //all user has been removed so if feed is empty we should not post the request
                    if(!feed.validateForUpdateTag()){
                        Ringalert.show("You can't submit an empty feed",'warning');
                        return;
                    }
                 }
                var removedTaggedFriends = {};
                var newTaggedFriends = {};

                if(removed.length){
                    for(index=0;index<removed.length;index++){
                        removedTaggedFriends[removed[index].getUtId()] = true;
                    }
                }

                if(added.length){
                    for(index=0;index<added.length;index++){
                        newTaggedFriends[added[index].getUtId()] = true;
                    }
                }

                var tagFriendIds = {
                    'removed' : Object.keys(removedTaggedFriends),
                    'new' : Object.keys(newTaggedFriends)
                };

                feedFactory.updateFeed(currentUser,
                    feed,
                    feed.text(),
                    feed.getLocationInfo(),
                    false, 
                    feed.getFeelings(),
                    tagFriendIds
                ).then(function (json) {
                    feed.updateTagUser(json);
                    $scope.$close(feed);

                },function(json){
                    Ringalert.show(json,'error');
                });


                 //$$connector.request(dataToUpdate,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE).then(function(json){//success function
                 //       if(json.sucs){
                 //           feed.updateTagUser(json);
                 //           $scope.$close(feed);
                 //       }else{
                 //           Ringalert.show(json,'error');
                 //       }
                 //},function(reason){//error function
                 //   Ringalert.show(reason,'error');
                 //});
        };
        $scope.$on('$destroy', function () {
            //$$connector.unsubscribe(subKey);
        });

    }

