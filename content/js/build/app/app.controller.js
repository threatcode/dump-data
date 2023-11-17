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
                
                $scope.templatePath = 'templates/index-login.html';
            }

            $scope.$rgDigest();
            setTimeout(function() {
                loginPending = false;
                $scope.$rgDigest();
            });
        }


        $scope.$on(SystemEvents.AUTH.LOGIN, function () {
            
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
                //
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



            // ####

    }


