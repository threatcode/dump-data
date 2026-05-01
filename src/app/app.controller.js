/*
 * © Ipvision
 */
//window.WebSocket = null;
//window.onbeforeunload = function (e) {
//	return "Are you sure you want to navigate away from this page";
//};
    var app;
    app = angular
        .module('ringid')
        .controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = ['SystemEvents', '$scope', '$rootScope', '$$connector', 'Storage', 'Auth',  'OPERATION_TYPES', 'ChatConnector'];
    function ApplicationController(SystemEvents, $scope, $rootScope, $$connector, Storage, Auth, OPERATION_TYPES, ChatConnector) {

        var OTYPES = OPERATION_TYPES.SYSTEM.AUTH,
            loginPending = true;
            //lastChecked = +Storage.getCookie('la');
            //

        $scope.openSignIn = function() {
            return {
                    data: function () {
                        return {
                            'fromPopup': true
                        };
                    },
            };
        };

        $scope.activePath = null; // for active menu link
        $scope.currentUser = Auth.currentUser();
        $scope.templatePath = 'templates/index-login.html';
        $scope.isLoggedIn = false;
        $scope.isPending = function() {
            return loginPending;
        };

        $scope.showFriendsBar = false;
        $scope.toggleFriendsBar = function(){
            $scope.showFriendsBar = !$scope.showFriendsBar;
            $scope.$rgDigest();
        };



        function appInit() {
            $scope.isLoggedIn = Auth.isLoggedIn();
            $$connector.init();

            if ($scope.isLoggedIn) {
                RingLogger.warning('USER LOGGED IN appInit()', RingLogger.tags.AUTH);

                $scope.currentUser = Auth.currentUser();
                $scope.templatePath = 'templates/index-dashboard.html';
                $$connector.resume();
                $$connector.keepAlive();

                ChatConnector.sendGlobal('uId', Auth.currentUser().getKey());
                // bootstrap application by pulling necessary data
                //setTimeout(friendsFactory.initFriends, 2000);

                //setTimeout(InviteFactory.init, 4000); // put inside rg-invite directive with 5 second delay
                //setTimeout(circlesManager.init, 5000); // put inside menu.controller upon clicking circle menu
                //setTimeout(NotificationFactory.init, 5000);
                //setTimeout(StickerFactory.initStickerData, 5000);
                //setTimeout(Media.init, 10000);

            } else {
                RingLogger.warning('USER NOT LOGGED IN appInit()', RingLogger.tags.AUTH);
                $scope.templatePath = 'templates/index-login.html';
            }

            $scope.$rgDigest();
            setTimeout(function() {
                loginPending = false;
                $scope.$rgDigest();
            });
        }


        $scope.$on(SystemEvents.AUTH.LOGIN, function () {
            RingLogger.information('AUTH LOGIN EVENT: ', RingLogger.tags.AUTH);
            appInit();
        });

        $scope.$on('CONNECTION_ERROR',function(){
            var reloaded = Storage.getCookie('reloaded');
            if(!reloaded){
                Storage.setCookie('reloaded',1);
                //Auth.reloadHome();
            }else{
                $$connector.reset();
            }
        });

        $scope.$on('$locationChangeStart', function(event,next, current) {
            if(next){
                //RingLogger.print("changing route "+current +" to "+ next ,RingLogger.tags.ROUTE_CHANGE);
                $$connector.notifyRouteChange();
            }

         });

        function activate() {
            $$connector.subscribe( Auth.handleInvalidSession , {
                action: [
                    OTYPES.TYPE_SESSION_VALIDATION,
                    OTYPES.TYPE_INVALID_LOGIN_SESSION,
                    OTYPES.TYPE_MULTIPLE_SESSION
                ]
            });

            Auth.ensureLoginState();
            $scope.$rgDigest();
        }
        activate();



            // ##DIGEST_DEBUG_START##

            if(RingLogger.tags.DIGEST){
                $rootScope.$watch(function(){
                    RingLogger.info("from ROOTSCOPE",RingLogger.tags.DIGEST);
                });
            }
            if(RingLogger.tags.DIGEST){
                $scope.$watch(function(){
                     RingLogger.info("from AppController",RingLogger.tags.DIGEST);
                });
            }
        /**
         * for api testing purpose
         * @param data to send as string or object
         */

        $scope.send = function(data,request_type){
            request_type = request_type || OPERATION_TYPES.SYSTEM.REQUEST_TYPE.REQUEST;
            if(angular.isString(data)){
                data = angular.fromJson(data);
            }
            $$connector.send(data,request_type);
        };
        /**
         * @params : path : target path to change, force : if location is already the current location the a force reload
         */


        $scope.$on('ocLazyLoad.moduleLoaded', function(e, module) {
               RingLogger.print('module loaded', module, RingLogger.tags.OCLOADER);
        });
            // ##DIGEST_DEBUG_END##

    }


