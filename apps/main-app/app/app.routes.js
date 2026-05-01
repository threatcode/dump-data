/*
 * © Ipvision
 */


    angular
        .module('ringid')
        .config(['$compileProvider','$routeProvider', '$locationProvider','$httpProvider' , 'RING_ROUTES', 'settings',
                function ($compileProvider, $routeProvider, $locationProvider,$httpProvider, RING_ROUTES, settings){

                $httpProvider.useApplyAsync(true);
                $compileProvider.debugInfoEnabled(settings.debugEnabled);

                $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

                /**
                 * The workhorse; converts an object to x-www-form-urlencoded serialization.
                 * @param {Object} obj
                 * @return {String}
                 */ 
                var param = function(obj) {
                  var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

                  for(name in obj) {
                    value = obj[name];

                    if(value instanceof Array) {
                      for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                      }
                    }
                    else if(value instanceof Object) {
                      for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                      }
                    }
                    else if(value !== undefined && value !== null)
                      query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                  }

                  return query.length ? query.substr(0, query.length - 1) : query;
                };

                // Override $http service's default transformRequest
                $httpProvider.defaults.transformRequest = [function(data) {
                  return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
                }];


                $routeProvider.
                        when(RING_ROUTES.HOME, {
                            templateUrl: 'templates/index.html',
                            //resolve: {
                                //// load necessary modules
                                //loadFriendsModule: ['$ocLazyLoad', 'Auth', '$q', function($ocLazyLoad, Auth, $q) {
                                    //if (Auth.isLoggedIn()) {
                                        //return $ocLazyLoad.load('ringidFriends');
                                    //} else {
                                        //var defer = $q.defer();
                                        //defer.resolve();
                                        //return defer.promise;
                                    //}

                                //}],
                                //loadFeedModule: ['$ocLazyLoad', 'Auth', '$q', function($ocLazyLoad, Auth, $q) {
                                    //if (Auth.isLoggedIn()) {
                                        //return $ocLazyLoad.load('ringidFeed');
                                    //} else {
                                        //var defer = $q.defer();
                                        //defer.resolve();
                                        //return defer.promise;
                                    //}
                                //}]
                            //}
                        }).when(RING_ROUTES.LOGIN_SOCIAL, {
                            templateUrl: 'templates/index.html'
                            //resolve: {
                                //'urlfix': ['$location', function($location) {
                                //}]
                            //}
                        }).when(RING_ROUTES.SIGNUP_SOCIAL, {
                            templateUrl: 'templates/index.html'
                        }).when(RING_ROUTES.USER_PROFILE, {
                            templateUrl: 'templates/profile/profile.html',
                            resolve: {
                                user: ['Api', 'userFactory', '$route', '$location', '$q', 'Ringalert', 'Auth', function(Api, userFactory, $route, $location, $q, Ringalert, Auth) {
                                    var deferred = $q.defer();
                                    Auth.isPendingAsync().then(function() {
                                        var user = userFactory.getUser($route.current.params.uId);
                                        if (user && user.hasDetails()) {
                                            deferred.resolve(user);
                                        } else {
                                            Api.user.getUserDetails({uId:$route.current.params.uId}).then(function(user){
                                                deferred.resolve(userFactory.create(user.userDetails));
                                            }, function() {
                                                Ringalert.show('User not found', 'error');
                                                // if going to profile redirect to home
                                                if ($location.path().indexOf('profile') > -1) {
                                                    $location.path('/');
                                                }
                                                deferred.reject();
                                            });
                                        }
                                    });

                                    return deferred.promise;
                                }]
                            }
                        }).when(RING_ROUTES.CIRCLE_HOME, {
                            resolve: {
                                pending: ['Auth', function(Auth) {
                                   return Auth.isPendingAsync();
                                }]
                            },
                            templateUrl: 'templates/home/circle.html'
                        }).when(RING_ROUTES.SINGLE_FEED, {
                            resolve: {
                                pending: ['Auth', function(Auth) {
                                   return Auth.isPendingAsync();
                                }]
                            },
                            templateUrl: 'templates/index-singlefeed.html'
                        }).when(RING_ROUTES.MEDIA_FEEDS, {
                            templateUrl: 'templates/home/media.feed.html'
                        }).when(RING_ROUTES.WHO_SHARED_FEED, {
                            resolve: {
                                pending: ['Auth', function(Auth) {
                                   return Auth.isPendingAsync();
                                }]
                            },
                            templateUrl: 'templates/index-who-sharedfeed.html'
                        }).when(RING_ROUTES.MEDIA_CLOUD, {// for media page test pupose
                            resolve: {
                                pending: ['Auth', function(Auth) {
                                   return Auth.isPendingAsync();
                                }]
                            },
                            templateUrl: 'templates/media-list.html'
                        }).when(RING_ROUTES.MEDIA_CLOUD_MYALBUM,{
                            resolve: {
                                pending: ['Auth', function(Auth) {
                                   return Auth.isPendingAsync();
                                }]
                            },
                            templateUrl:'templates/mediasearch/my.albums.html',
                        }).when(RING_ROUTES.MEDIA_POST, {
                            resolve: {
                                pending: ['Auth', function(Auth) {
                                   return Auth.isPendingAsync();
                                }]
                            },
                            templateUrl:'templates/mediasearch/media.upload.html',
                            controller: 'MediaPostController'
                        }).when(RING_ROUTES.MEDIA_CLOUD_ALBUM,{
                            resolve: {
                                pending: ['Auth', function(Auth) {
                                   return Auth.isPendingAsync();
                                }]
                            },
                            templateUrl:'templates/mediasearch/albums.all.html',
                            controller:'allAlbumTypeController'
                        }).when(RING_ROUTES.MEDIA_CLOUD_SEARCH, {// for media page test pupose
                            resolve: {
                                pending: ['Auth', function(Auth) {
                                   return Auth.isPendingAsync();
                                }]
                            },
                            templateUrl: 'templates/mediasearch/search.result.html',
                            controller:'mSearchResultController'
                        }).when(RING_ROUTES.MEDIA_CLOUD_USERMEDIA,{
                            resolve: {
                                pending: ['Auth', function(Auth) {
                                   return Auth.isPendingAsync();
                                }]
                            },
                            templateUrl:'templates/mediasearch/albums.all.html',
                            controller:'allAlbumTypeController'
                        }).when('/chat',{
                            resolve: {
                                pending: ['Auth', function(Auth) {
                                   return Auth.isPendingAsync();
                                }]
                            },
                            templateUrl: 'templates/partials/chat/single-page/home.html',
                            controller : 'ChatHistoryController'
                        }).when(RING_ROUTES.CIRCLE,{
                            templateUrl: 'templates/circle-partials/all-circle.html',
                            controller : 'allCirclePopupController'
                        }).when('/newsportal',{
                            templateUrl :'pages/newsportal/portal-index.html',
                            controller  : 'FeedNewsportalController'
                        }).when('/newsportal/following',{
                            templateUrl : 'pages/newsportal/following.html',
                            controller : 'portalFollowingController'
                        }).when('/newsportal/discover',{
                            templateUrl : 'pages/newsportal/discover.html',
                            controller : 'portalDiscoverController'
                        }).when('/newsportal/saved',{
                            templateUrl : 'pages/newsportal/saved.html',
                            controller : 'portalSaveController'
                        }).when('/newsportal/:uid',{
                            templateUrl : 'pages/newsportal/profilenews.html',
                            controller : 'portalSaveController',
                        }).when('/allnotification',{
                            templateUrl: 'templates/partials/all-notification.html'
                        }).when('/allfriendrequest',{
                            templateUrl: 'templates/partials/all-friend-request.html'
                        }).when('/medianew', {// for media page test pupose
                            resolve: {
                                pending: ['Auth', function(Auth) {
                                   return Auth.isPendingAsync();
                                }]
                            },
                            templateUrl: 'templates/mediapage.html'
                        })

                        // .when(RING_ROUTES.SINGLE_IMAGE, {
                        //     templateUrl: 'templates/index-singleimage.html'

                        // })
                        .when(RING_ROUTES.FAQ, {
                            redirectTo: function(params, currentPath, currentSearch) {
                                window.location.href = location.protocol + '//' + location.host + '/faq.xhtml';
                            }
                        }).when(RING_ROUTES.API_DASHBOARD, {
                            templateUrl: 'app/apidashboard/templates/api.index.html'
                        }).otherwise({
                            redirectTo: '/'
                        });


                //check browser support
                //if(window.history && window.history.pushState){
                    //$locationProvider.html5Mode(true); //will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">

                     //to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase

                     //if you don't wish to set base URL then use this
                    //$locationProvider.html5Mode({
                        //enabled: true,
                        //requireBase: false
                    //});
                //}

            }])
        .run(['$rootScope', '$location', 'Auth', 'rgDropdownService', '$ringbox','PAGE_TITLES','Utils',
             function($rootScope, $location, Auth, rgDropdownService, $ringbox,PAGE_TITLES,Utils) {
                var routeChangeCounter = 0;
                $rootScope.$on('$routeChangeSuccess',function(event,current){
                     RingLogger.print("page title from global change",RingLogger.tags.PAGETITLE);
                     if(PAGE_TITLES[current.$$route.originalPath]){
                     		 Utils.setPageTitle(PAGE_TITLES[current.$$route.originalPath],routeChangeCounter > 0);
					 } else {
                     		 Utils.setPageTitle(PAGE_TITLES.DEFAULT);
					 }
					 routeChangeCounter++;
                });
                $rootScope.$on('$routeChangeStart', function(event, next, current) {
                    //var loginDoneInterval;
                    //function loginDone() {
                        if(!Auth.isPending() && !Auth.isLoggedIn() && !$rootScope.doingSilentLogin &&  $location.url() !==  '/' )  {
                            $location.path('/');
                            revertScopes(true);
                        } else {
                            $ringbox.closeAll();
                            // close any dropdown if any is open
                            rgDropdownService.close();
                            // close search dropdown if open
                            // IMPORTANT BELOW SERVICE NEEDS TO BE DEPENDENCY CLEARED AND USED HERE. module_isolation branch changes
                            //rgSearchService.close();
                            revertScopes(true);
                        }

                    //}
                    //// if not logged in go to login page
                    //if (Auth.isPending() ) {
                        //loginDoneInterval = setInterval(function() {
                            //if (!Auth.isPending()) {
                                //clearInterval(loginDoneInterval);
                                //loginDone();
                            //}
                        //}, 2000);
                    //} else {
                        //loginDone();
                    //}
                });

                //$rootScope.$on('$routeChangeSuccess', function() {
                    //$rootScope.$rgDigest();
                //});


                 requestAnimationFrame(function(){
                    //var loader = document.querySelector('#global-loader');
                    //loader.style.display = 'none';
                    //loader = null;
                 });


                /* $rgGigest start*/


                var $rgQueue =[];
                var $root = Object.getPrototypeOf($rootScope);
                var childHead = [];
                $rootScope.$ignoreScopes = [];
                $root.$coreDigest = $root.$digest;

                function revertScopes(reset) {

                    for(var i=0;i<$rootScope.$ignoreScopes.length;i++) {

                        if(childHead[$rootScope.$ignoreScopes[i].$id]) {
                            $rootScope.$ignoreScopes[i].$$childHead = childHead[$rootScope.$ignoreScopes[i].$id];
                         }
                    }

                    childHead = [];

                    if(reset) {
                      $rootScope.$ignoreScopes = [];
                    }
                }

                function notifyScopes() {
                    revertScopes();
                    for(var i=0;i<$rootScope.$ignoreScopes.length;i++) {

                          if($rootScope.$ignoreScopes[i]) {
                              $rootScope.$ignoreScopes[i].$broadcast('$destroy');
                              //$rootScope.$ignoreScopes[i].$destroy();
                          }
                    }
                }


                $root.$rgDigest = function() {


                    if (!$rootScope.$$phase) {

                        if(this.$id==1 && $rootScope.$ignoreScopes.length > 0) {

                           for(var i=0;i<$rootScope.$ignoreScopes.length;i++) {
                              childHead[$rootScope.$ignoreScopes[i].$id] = $rootScope.$ignoreScopes[i].$$childHead;
                              $rootScope.$ignoreScopes[i].$$childHead = null;
                           }

                          $rootScope.$$postDigest(function() {
                               revertScopes();
                           });
                        }

                        this.$coreDigest();
              	    }
                    else {

                    	if($rgQueue.indexOf(this) ==-1 && this.$id != 1) {
                   		  	  $rgQueue.push(this);
                   		  	  $rgQueue.sort(function(a, b) { return    a.$id - b.$id });

                   	      	var queue = [], target, current, parent;

                   		  	  while($rgQueue.length > 1) {

                   		          target = $rgQueue.pop();
                   			        for(var i=$rgQueue.length-1; i >= 0; i--) {
                       		   		    current = $rgQueue[i];
                       		   		    parent = target.$parent;
                       		    	    while( parent != current && parent != null) {
                       		       	    parent = parent.$parent;
                       			 	      }
                   			 	        if(parent != null)  break;
                   			        }
                   		         if(parent == null) queue.push(target);
                   		      }

                   		      while(target = queue.pop()) {
                   		         $rgQueue.push(target);
                   		      }
                      }

                   	  $rootScope.$$postDigest(function(){
                     	    if($rgQueue.length > 0) $rgQueue.pop().$rgDigest();
                      });
                    }
              };
           /* end of $rgGigest */

           $root.$digest = function() {
               this.$rgDigest();
           };

           $root.addIgnore = function() {
              if($rootScope.$ignoreScopes.indexOf(this) == -1) {
                 $rootScope.$ignoreScopes.push(this);
              }
           }

           $root.removeIgnore = function() {
              var index;
              if ((index = $rootScope.$ignoreScopes.indexOf(this)) > -1) {
                 $rootScope.$ignoreScopes.splice(index, 1);
              }
           }

           /*Utility function that returns total watchers*/
           $root.calc = function() {

          		var total = 0, total_scope=0, target, current, next, t0 = window.performance.now();
           		target = this;
           		current = target;

                do {
             		total += (current.$$watchers)?current.$$watchers.length:0;
             		total_scope++;

             		if (!(next = (current.$$childHead ||
                		(current !== target && current.$$nextSibling)))) {
              			while (current !== target && !(next = current.$$nextSibling)) {
                		 current = current.$parent;
              		    }
            		}
          		 } while ((current = next));

           };

       }
    ]);

