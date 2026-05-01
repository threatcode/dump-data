
angular
    .module('ringid.directives')
    .filter('userListFilter', userListFilter)
    .directive('rgFriendDropdown', rgFriendDropdown);


    function userListFilter() {
            return function(items, name, tagItems) {
                if (items) {
                    var filtered = [], tempu;
                    var nameMatch = new RegExp(name, 'i');
                    for (var i = 0; i < items.length; i++) {
                        if (filtered.length > 10)
                            return filtered;
                        tempu = items[i].value.getLiteUser();
                        if (nameMatch.test(tempu.getName()) && tagItems.indexOf(tempu) === -1) {
                            filtered.push(tempu);
                        }
                    }
                    return filtered;
                }
            };
        }

rgFriendDropdown.$inject = ['friendsFactory', '$filter'];
function rgFriendDropdown(friendsFactory, $filter) {
    return {
        scope: {
            filterText: '=',
            focusFilter: '=',
            onSelect: '&',
            onClose: '&',
            tagItems: '=',
        },
        templateUrl: function(elem,attrs) {
              return attrs.templateUrl || 'templates/dropdowns/tag-friend-dropdown.html';
        },
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    var sentRequest = false;
                    scope.users = [];
                    function setUser() {
                        scope.users = $filter('userListFilter')(friendsFactory.friends.all(), scope.filterText, scope.tagItems);
                        if(scope.activeId >= scope.users.length){
                            scope.activeId = 0;
                        }
                        //scope.loading = !!scope.users.length;
                    }
                    function searchRequest() {
                        if (sentRequest)
                            return;
                        friendsFactory.searchContact({schPm: scope.filterText}, true).then(function(){
                            scope.$rgDigest();
                        });
                        scope.loading = true;
                        sentRequest = true;
                    }
                    scope.$watch(friendsFactory.friends.length, function(newValue, oldValue) {
                        setUser();
                        if (sentRequest) {
                            scope.loading = false;
                            sentRequest = false;
                        }
                    });

                    scope.$watch('filterText', function(newValue, oldValue) {
                         RingLogger.info("newVal : "+ newValue+"   OldValue:  "+ oldValue,"FILTER");
                        setUser();
                        sentRequest = false
                        if (scope.users.length < 5 && oldValue.length < newValue.length) { // oldVal.length < newval.length is for making sure not to send request while backspacing
                            searchRequest();
                        }
                    });
                    scope.$watch('users.length', function(newval, oldVal) { // users is poped from users after selecting and no feed text is set so requesting for more contact
                        if (newval < 5 && newval < oldVal) {
                            if (scope.filterText.length > 0) {
                                searchRequest();
                            } else {
                                friendsFactory.getContactDetails();
                            }
                        }
                        if(newval > 5 && !sentRequest){
                          scope.loading = false;
                        }

                    });
                    scope.loading = !!scope.users.length;
                    scope.choose = function(item, event) {
                        scope.onSelect()(item, event);
                        setUser();
                        scope.$rgDigest();
                    }
                    scope.close = angular.isFunction(scope.onClose) ? scope.onClose() : angular.noop;
                    var ignoreKey = false;
                    scope.processKeyup = function(e){
                        if (ignoreKey)
                        {
                            e.preventDefault();
                            return;
                        }
                        if (e.keyCode == 38 || e.keyCode == 40)
                        {
                            var pos = this.selectionStart;
                            this.value = (e.keyCode == 38?1:-1)+parseInt(this.value,10);
                            this.selectionStart = pos; this.selectionEnd = pos;

                            ignoreKey = true; setTimeout(function(){ignoreKey=false},1);
                            e.preventDefault();
                        }
                     };

                    scope.activeId = 0;
                    scope.setActiveId = function(i){
                      scope.activeId = i;
                    }
                   iElement.bind("keydown",function(e,keyCode){
                     keyCode = keyCode || e.which || e.keyCode || e.key;
                       if(keyCode=== 13){
                          if(scope.users.length){
                            scope.choose(scope.users[scope.activeId],e);
                            scope.filterText = "";
                          }

                       }else if(keyCode === 38){
                         scope.activeId = Math.max(scope.activeId - 1,0);
                       }else if(keyCode === 40){
                          scope.activeId = Math.min(scope.activeId+1,scope.users.length-1);
                       }
                       RingLogger.info("keup from dropdown : "+keyCode,'FILTER');
                       scope.$rgDigest();
                   });
                   iElement.bind("mouseleave",function(){
                    scope.activeId = 0;
                   })
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    iElement.on("click", function(event) {
                        event.stopPropagation();
                    });
                    scope.$rgDigest();

                }
            }
        }
    }
}

