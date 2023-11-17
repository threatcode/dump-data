/**
 * © Ipvision
 */




    angular
        .module('ringid.shared')
        .directive('rgInvite', rgInvite);


    rgInvite.$inject  = ['$$connector', 'OPERATION_TYPES', 'InviteFactory', 'friendsFactory', 'Api'];
    function rgInvite($$connector, OPERATION_TYPES, InviteFactory, friendsFactory, Api) {


            function linkFunc(scope,element) {
                var
                    nameElm,
                    avatarLinkElm,
                    avatarImgElm,
                    mutualElm,
                    addFriendElm,
                    interval,
                    currentSuggestion,
                    timeOut,
                    OTYPES = OPERATION_TYPES.SYSTEM.FRIENDS;


                element[0].style.display = 'none';

                scope.removeOutGoingFriends = function () {
                    var outGoingUtid = [];
                    var findOutGoing = InviteFactory.suggestionFriends.all();
                    var loopLength = InviteFactory.suggestionFriends.length();

                    for( var i = 0; i < loopLength; i++ ){
                        if(findOutGoing[i].value.friendshipStatus() !== 0) {
                            outGoingUtid.push(findOutGoing[i].value.getUtId());
                        }
                    }
                    for(var j=0;j<outGoingUtid.length;j++){
                        InviteFactory.suggestionFriends.remove(outGoingUtid[j]);
                    }
                };

                scope.getSuggestions = function(){
                    scope.removeOutGoingFriends();
                    if(InviteFactory.suggestionFriends.length() < 5){
                        InviteFactory.getSuggestionContactsDetails();
                    }
                    return{
                        data: function() {
                            return {
                                target: InviteFactory.suggestionFriends
                            };
                        }
                    };

                };

                scope.removeSugg = function() {
                    InviteFactory.removeSuggestion(currentSuggestion.getUtId(), 'remove');
                    changeSuggestion();
                };

                scope.getMutualFriend = function() {
                    return{
                        data: function() {
                            return {
                                target: currentSuggestion
                            };
                        },
                        promise: Api.user.getMutualFriends(currentSuggestion)

                    };
                };

                scope.friendRequestAction = function() {
                    var action = currentSuggestion.friendshipStatus() === 3 ? 'remove' : 'addfriend';
                    var friend = currentSuggestion;
                    stopSuggestion();
                    friendsFactory.friendAction({friend: friend, action: action}, true).then(function(json) {
                        changeSuggestion();
                        fixFriendButton(json.sucs);
                        startSuggestion();

                        if (json.sucs === true) {
                            InviteFactory.removeSuggestion(friend.getUtId()).then(function(json){
                                if(json.sucs===true){
                                    InviteFactory.suggestionFriends.remove(friend.getUtId());
                                }

                            });
                        }
                    }, function() {
                        fixFriendButton();
                        startSuggestion();
                    });
                    fixFriendButton();
                };


                function initSuggestion() {
                    nameElm = element[0].querySelector('#invname');
                    avatarLinkElm = element[0].querySelector('#invavatarlink');
                    avatarImgElm = element[0].querySelector('#invavatarimg');
                    mutualElm = element[0].querySelector('#invmutual');
                    addFriendElm = element[0].querySelector('#invaddfriend');

                    element[0].addEventListener('mouseenter', stopSuggestion);
                    element[0].addEventListener('mouseleave', startSuggestion);

                    element[0].style.display = 'block';
                    changeSuggestion();
                    startSuggestion();
                }


                function startSuggestion() {
                    // console.log('START SUGGESTION');
                    stopSuggestion();
                    interval = setInterval(changeSuggestion, 5000);
                }

                function stopSuggestion() {
                    // console.log('STOP SUGGESTION');
                    clearInterval(interval);
                }


                function changeSuggestion() {
                    if (!currentSuggestion) {
                         currentSuggestion = InviteFactory.suggestionFriends.bottom();
                    } else {
                         currentSuggestion = InviteFactory.suggestionFriends.next(currentSuggestion.getUtId()) || InviteFactory.suggestionFriends.bottom();
                    }
                    // set data
                    if (currentSuggestion) {
                        nameElm.textContent = currentSuggestion.getName();
                        nameElm.setAttribute('href', currentSuggestion.link());

                        avatarLinkElm.setAttribute('href', currentSuggestion.link());
                        avatarImgElm.setAttribute('src', currentSuggestion.avatar('thumb'));

                        mutualElm.textContent = currentSuggestion.commonFriends() + ' mutual friends';
                        if (currentSuggestion.commonFriends() > 0) {
                            mutualElm.style.display = 'block';
                        } else {
                            mutualElm.style.display = 'none';
                        }

                        fixFriendButton();
                    } else {
                        element[0].style.display = 'none';
                    }

                }

                function fixFriendButton(force) {
                    //if (force || currentSuggestion.friendshipStatus() === 3) {
                        ////addFriendElm.text = 'Remove';
                        //addFriendElm.classList.add('reject');
                        //addFriendElm.classList.remove('addfnd');
                    //} else {
                        ////addFriendElm.text = 'Add Friend';
                        //addFriendElm.classList.add('addfnd');
                        //addFriendElm.classList.remove('reject');
                    //}

                    if (currentSuggestion.isLoading()) {
                         addFriendElm.parentElement.classList.add('f-loading');
                    } else {
                         addFriendElm.parentElement.classList.remove('f-loading');
                    }

                }

                function activate() {
                    $$connector.subscribe(function() {
                        if (!timeOut) {
                            timeOut = setTimeout(function() {
                                initSuggestion();
                            }, 1000);
                        }
                    },{
                        action: [OTYPES.TYPE_PEOPLE_YOU_MAY_KNOW_DETAILS]
                    });

                    setTimeout(InviteFactory.init, 5000);
                }

                activate();


                scope.$on("$destroy",function(){
                    element[0].removeEventListener("mouseenter", startSuggestion);
                    element[0].removeEventListener("mouseenter", stopSuggestion);
                });
            }



        return {
            restrict: 'A',
            //controller: InviteController,
            templateUrl: 'templates/partials/friend-invite.html',
            link : linkFunc
        };


    }

