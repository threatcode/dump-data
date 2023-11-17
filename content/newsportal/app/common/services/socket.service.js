/**
 * © Ipvision
 */

(function() {
    'use strict';

    angular
        .module('ringid.common.services')
        .service('socketService', socketService);

    socketService.$inject = ['$cookies', '$websocket', 'OPERATION_TYPES'];
    function socketService($cookies, $websocket, OPERATION_TYPES) {
        var self = this,
            OPTSYS = OPERATION_TYPES.SYSTEM,
            ws = null,
            connected = false;

        if ($cookies['socket']) {
            console.log($cookies['socket']);
        }

        // init socket connection
        self.init = function(uId) {
            //if (!ws) {
            //    var socketUrl;
            //    if (uId ) {
            //        socketUrl = 'ws://38.127.68.51:1339/' + uId ;
            //    } else {
            //        socketUrl = 'ws://38.127.68.51:1339/' + $cookies.uId ;
            //    }
            //
            //    console.log('socketUrl: ' + socketUrl);
            //    ws = $websocket(socketUrl);
            //}
            //return ws;
        };

        self.send = function(payload) {

            var packetId = Math.floor((Math.random() * 100000000000) + 1).toString();
            var defaults = {
                pckId: packetId,
                sId: $cookies.sId,
                //vsn: OPTSYS.VERSION, // auth server version
                //dvc: 5
            }
            payload = angular.extend({}, defaults, payload);
            console.log('Payload: ');
            console.log(payload);
            ws.send(payload);
            return packetId;
        };

        self.isConnected = function() {
            return connected;
        };

        return self;

    }

})();
