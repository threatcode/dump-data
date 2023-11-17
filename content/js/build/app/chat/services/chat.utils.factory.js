
    var chatApp;

    chatApp = angular.module('ringid.chat');

    chatApp.factory('ChatUtilsFactory', ChatUtilsFactory);

    ChatUtilsFactory.$inject = ['Auth', 'Utils'];

    function ChatUtilsFactory(Auth , Utils){

        var Constants = CHAT_APP.Constants;
        var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
        var CHAT_GLOBAL_VALUES = Constants.CHAT_GLOBAL_VALUES;

        var textParseForLinkAndEmo = function(text){
             text = Utils.parseForLE(text, 0);
            return text;
        };

        var _getOfflineIpPort = function(){
            var loginData = Auth.loginData, ip, port;

            var oIpPort = {
                ip : '',
                port : ''
            };

            if( !!loginData ){
                oIpPort.ip = loginData.oIP;
                oIpPort.port = loginData.oPrt;
            }

            return oIpPort;
        };

        var _hasOfflineIpPort = function(){
            var ipPort = _getOfflineIpPort();
            return !(!ipPort || !ipPort.ip  || !ipPort.port);
        };

        var _getChatVerbalDateFromServerDate = function(serverTime){
            var clientTime = CHAT_APP.SharedHelpers.getClientTimeFromServerTime(serverTime);
            return Utils.chatVerbalDate(clientTime);
        }

        return {

            parseForLE : textParseForLinkAndEmo,
            getOfflineIpPort : _getOfflineIpPort,
            hasOfflineIpPort : _hasOfflineIpPort,
            getChatVerbalDateFromServerDate : _getChatVerbalDateFromServerDate
        }

    }

