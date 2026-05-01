
    angular
        .module('ringid.chat')

        .directive('rgTagChatList',
            function () {
                return {
                    restrict: 'E',
                    templateUrl: 'templates/partials/tag-chat/tag-chat-list.html'
                };
            }
        );



