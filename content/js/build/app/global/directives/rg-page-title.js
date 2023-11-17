
    angular.module('ringid.global_directives')
    .directive('rgPageTitle', rgPageTitle );

    rgPageTitle.$inject = ['$rootScope', 'chatHistoryFactory', 'Utils', 'SystemEvents'];
    function rgPageTitle($rootScope, chatHistoryFactory, Utils, SystemEvents) {

        var blinkerInterval = 1000;
        var CurrentPageTitle = Utils.getCurrentPageTitle();
        var timerRef;

        var getPageInActiveTitle = function(){
            var unreadMessageCount = chatHistoryFactory.getUnreadConversationCount();
            if(unreadMessageCount > 0){
                return '('+ unreadMessageCount +') ' + CurrentPageTitle;
            }else{
                return CurrentPageTitle;
            }

        };

        var getPageActiveTitle = getPageInActiveTitle;
        

        function initInterval() {
           timerRef = setInterval(function(){
               var inActivePageTitle = getPageInActiveTitle();
               Utils.setPageTitle(Utils.getCurrentPageTitle() === inActivePageTitle ? CurrentPageTitle : inActivePageTitle);
           }, blinkerInterval);
        }
         function removeInterval() {
           clearInterval(timerRef);
           Utils.setPageTitle(getPageActiveTitle());
        }
        $rootScope.$on('ringActive', removeInterval);
        $rootScope.$on('ringInactive',initInterval);
        $rootScope.$on("PAGE_TITLE_CHANGE",function(event,args){
                 
                 CurrentPageTitle = args.title;
        });

        Utils.onCustomEvent(SystemEvents.CHAT.UNREAD_MESSAGE_INFO_UPDATED, function(){
           Utils.setPageTitle(getPageActiveTitle());
        });
               

        Utils.onCustomEvent(SystemEvents.CHAT.CONVERSATION_COUNT_RESETED, function(){
           Utils.setPageTitle(getPageActiveTitle());
        });

        return {
            
        };
    }

