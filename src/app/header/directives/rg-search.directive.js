/*
 * © Ipvision
 */


	angular
		.module('ringid.header')
		.service('rgSearchService', rgSearchService)
		.directive('rgSearch', rgSearch);

		rgSearchService.$inject = ['GlobalEvents'];
		function rgSearchService(GlobalEvents) {
			var self = this, // jshint ignore:line
                _scope = false,
                _template = false;

			self.close= function() {
                if (_template) {
                    _scope.searchText = '';
                    _template.style.display = 'none';
                    _scope.$rgDigest();
                    _template = false;
                    _scope = false;
                    GlobalEvents.unbindHandler('document', 'click', self.close);
                }
			};
			self.open= function(template, scope) {
                _template = template;
                _scope = scope;
                _template.style.display = 'block';
                GlobalEvents.bindHandler('document', 'click', self.close);
			};

		}

		rgSearch.$inject = [ 'rgSearchService'];
		function rgSearch( rgSearchService) {
			var	linkFunc = function(scope, element) {
                var input = element.find('input');

                scope.template = element[0].querySelector('#search-dropdown');
                scope.template.style.display = 'none';

                input.on('keypress', function(event) {
                    if(event.keyCode === 13) {
                        event.preventDefault();
                    }
                });

                // show search bar and search result box before search result bound to input ng-change attr
                scope.doTheSearch = function() {
                    if( scope.searchText.length > 0 ) {
                        // before every new search string change reset no of result
                        //scope.resetSearch();
                        scope.doSearch();
                    } else {
                        rgSearchService.close();
                    }
                };

                function stopPropagate(event) {
                    if (event.target.tagName.toLowerCase() !== 'a' && event.target.parentNode.tagName.toLowerCase() !== 'a') {
                        event.preventDefault();
                    }
                    event.stopPropagation();
				}


                // this is to prevent clicking on search dropdown and closing it. unless it links to user profile
				element.on('click', stopPropagate);
                scope.$on('$destroy', function() {
                    element.off('click', stopPropagate);
                });

            };

		SearchController.$inject = [ '$scope', '$$stackedMap', 'userFactory', 'friendsFactory', 'friendsHttpService', '$timeout', 'rgScrollbarService', 'Api'];
        function SearchController( $scope,  $$stackedMap, userFactory, friendsFactory, friendsHttpService,  $timeout, rgScrollbarService, Api) {
                var user,
                    searchFailCount = 0,
                    schPm = '',
                    timeOut;

                // initiate dropdown with data
                $scope.searchText = '';
                $scope.gotAllResult = false;
                $scope.showLoadbar = false;
                $scope.noResult = true;
                $scope.listData = $$stackedMap.createNew();

                $scope.resetSearch = function() {
                    searchFailCount = 0;
                    $scope.noResult = false;
                    $scope.gotAllResult = false;
                    //$scope.showLoadbar = false;
                    $scope.listData.reset();

                    $scope.$rgDigest();
                };


                $scope.contactListAction = function(actionObj) {
                    if (!actionObj.friend.isLoading()) {
                        friendsFactory.friendAction(actionObj, true).then(function() {
                            $scope.$rgDigest();
                        }, function() {
                            $scope.$rgDigest();
                        });
                        $scope.$rgDigest();
                    }
                };
                $scope.doSearch = doSearch;

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



                function checkIfNewSearch() {
                    if ( schPm !== $scope.searchText) {
                        $scope.resetSearch();
                        searchFailCount = 0;
                    }
                }

                function searchFail(){
                    $scope.noResult = ($scope.listData.length() === 0);
                    $scope.gotAllResult = ($scope.listData.length() > 0 ) ? true : false;
                    $scope.showLoadbar = false;
                    $scope.$rgDigest();
                }

                function doSearch (force) {
                    checkIfNewSearch();
                    if (force || (!$scope.showLoadbar && !$scope.gotAllResult))   {
                        clearTimeout(timeOut);
                        $scope.showLoadbar = true;
                        if(!$scope.showDropdown) {
                            rgSearchService.open($scope.template, $scope);
                        }
                        schPm = $scope.searchText;
                        friendsHttpService.searchContact({schPm: $scope.searchText, st: $scope.listData.length()})
                        .then(getSearchResult, getSearchResult );

                        timeOut = setTimeout(searchFail, 8000);
                        $scope.$rgDigest();
                    }
                }

                function getSearchResult (json) {
                    clearTimeout(timeOut);
                    if ( json.sucs === true)
                    {
                        for (var i = 0, l = json.searchedcontaclist.length; i < l; i++) {
                            user = userFactory.create(json.searchedcontaclist[i]);
                            if (user) {
                                $scope.listData.save(user.getKey(), user);
                            }
                        }
                        if (json.searchedcontaclist.length > 0) {
                            rgScrollbarService.recalculate($scope);
                        }

                        $scope.showLoadbar = false; // hide loader
                        $scope.noResult = ($scope.listData.length() === 0);
                        $scope.$rgDigest();
                    } else {
                        searchFailCount++;
                        if(searchFailCount < 3) {
                            doSearch(true);
                        } else {
                            clearTimeout(timeOut);
                            searchFail();
                        }
                    }
                }


            }

			return {
				restrict: 'E',
				scope: {
					placeholder: '@'
				},
				templateUrl: 'templates/dropdowns/search-dropdown.html', // IMPORTANT this tempalte is preloaded inside auth factory
				link: linkFunc,
				controller: SearchController
			};

		}

