  angular
    .module('ringid.header')
    .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$scope', '$rootScope', '$location','rgDropdownService', '$$connector', 'OPERATION_TYPES',
        'friendsFactory', 'NotificationFactory', 'Auth',   'rgScrollbarService', 'chatHistoryFactory','Utils','SystemEvents'];
    function HeaderController( $scope, $rootScope, $location, rgDropdownService,  $$connector, OPERATION_TYPES,  // jshint ignore:line
                              friendsFactory, NotificationFactory, Auth, rgScrollbarService, chatHistoryFactory,Utils,SystemEvents) {
      var vm = this,
          OTYPES = OPERATION_TYPES.SYSTEM,
        active_menu = setActiveMenu();
        vm.getActiveMenu = getActiveMenu;


      /****************************
        LOGOUT Dropdown section
       */
      vm.logout = {
        ddHtml: 'templates/dropdowns/logout-dropdown.html', //$templateCache.get('logout-dropdown.html'),
        ddControl: Auth,
        ddAction: function() {
            rgDropdownService.close();
            Auth.logout();
        },
        ddOpened: function() {
          setActiveMenu('logout');
        },
        ddBeforeClose: function(){
          setActiveMenu('');
        }
      };
      /*****************************
         END LOGOUT Dropdown section
       */



      /********************************
        FRIEND REQUEST Dropdown section
       */
      vm.freq = {
        //ddHtml:'templates/partials/requests-directive.html', // $templateCache.get('friend-request-dropdown.html'),
        ddTemplate:'<rg-requests load-on-scroll="true" load-count="10" ></rg-requests>',
        ddOpened: function() {
          setActiveMenu('friend_request');
        },
        ddBeforeClose: function(){
          setActiveMenu('');
        }
      };


      vm.requestCount = friendsFactory.getRequestCount;

      setTimeout(friendsFactory.initFriends, 2000);
      /*****************************
        END FRIEND REQUEST Dropdown section
       */


        /********************************
         Chat History  Dropdown section
         */
        vm.chatHistory = {
            ddHtml:'templates/partials/chat/chat-history-dropdown.html', // $templateCache.get('friend-request-dropdown.html'),
            ddOpened: function() {
                chatHistoryFactory.resetConversationCount();
                setActiveMenu('chat_history');
                Utils.triggerCustomEvent(SystemEvents.CHAT.CONVERSATION_COUNT_RESETED);
            },
            ddBeforeClose: function(){
                setActiveMenu('');
            }
        };


        vm.unreadChatConversationCount = chatHistoryFactory.getUnreadConversationCount;

        Utils.onCustomEvent(SystemEvents.CHAT.UNREAD_MESSAGE_INFO_UPDATED, function(){
            $scope.$rgDigest();
        });


        /*****************************
         Chat History REQUEST Dropdown section
         */



      /*****************************
         NOTIFICATION Dropdown section
       */

        vm.noti = {
            //ddHtml: 'templates/partials/notification-directive.html',
            ddTemplate: '<rg-notification load-count="10" template-url="templates/dropdowns/notification-dropdown.html"></rg-notification>',
            //ddTemplate: '<rg-notification ></rg-notification>',
            ddOpened: function() {
              NotificationFactory.clearCounter();
              setActiveMenu('notification');
            },
            ddBeforeClose: function(){
              setActiveMenu('');
            }
        };

        vm.notiCount = NotificationFactory.getNotiCount;
        var subscriptionKey = $$connector.subscribe(function() {
            setTimeout(function() {
                $scope.$rgDigest();
            }, 200);

        }, {
            action: [
                //OTYPES.FRIENDS.TYPE_ACCEPT_FRIEND,
                OTYPES.FRIENDS.TYPE_UPDATE_ADD_FRIEND,
                OTYPES.FRIENDS.TYPE_UPDATE_DELETE_FRIEND,
                //OTYPES.FRIENDS.TYPE_DELETE_FRIEND,
                OTYPES.NOTIFICATION.TYPE_MY_NOTIFICATIONS,
                OTYPES.NOTIFICATION.TYPE_SINGLE_NOTIFICATION
            ]
        });

        setTimeout(NotificationFactory.init, 5000);

      /*****************************
         END NOTIFICATION Dropdown section
       */
       $scope.hideColumn = false;

       function setHideColumn(){
          var loc = $location.path();
          if(loc === "/"){
            $scope.hideColumn = false;
          }/*else if(/\/circle\/\d+(\/post|$)/.test(loc)){
            $scope.hideColumn = true;
          }else if(/\/profile\/\d+(\/post|$)/.test(loc)){
            $scope.hideColumn = true;
          }*/else{
            $scope.hideColumn = true;
          }
       }

         $rootScope.$on('$routeChangeStart', function(e) {
               setHideColumn();
          });
      setHideColumn();
      function setActiveMenu(name){
        if( name && name !== ''){
          active_menu = name;
        }else if( $location.path() === '/'){
          active_menu = 'home';
        }else{
          active_menu = 'none';
        }
        $scope.$rgDigest();
      }


      function getActiveMenu(){
        return active_menu;
      }

      vm.defaultSpan = Utils.getDefaultColumn;

      $rootScope.$on('$routeChangeStart', function() {
        setActiveMenu();
        $$connector.unsubscribe(subscriptionKey);
      });

      $scope.$on(SystemEvents.COMMON.WINDOW_RESIZED,function(){
          $scope.$rgDigest();
      });
      $scope.$on(SystemEvents.FRIEND.PENDING_FRIENDS_COUNT_CHANGED, function() {
          $scope.$rgDigest();
      });


    }
