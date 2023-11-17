/*
 * Md. Ibrahim Rashid
 * © Ipvision
 */



    angular.module('ringid.chat')
    .factory('ChatExceptions', ChatExceptions);

    ChatExceptions.$inject = [];

    function ChatExceptions(){

        function ChatPacketException(msg, code){
            if(!code){
            }else{
            }
        }

        return {
            ChatPacketException : ChatPacketException

        };

    }


