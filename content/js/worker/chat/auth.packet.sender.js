(function AuthPacketSenderIIFE() {
    var ChatAuthChannel;

//     function _sendRequestResponse(packetId, response) {
//         postMessage({
//             object: response,
//             packetId: packetId,
//             notifier: WORKER_NOTIFIER_TYPES.REQUEST_RESPONSE,
//         });
//     }

    try {
        ChatAuthChannel = new MessageChannel();
    } catch (e) {
        ChatAuthChannel = new BroadcastChannel('ring_channel');
    }

    CHAT_APP.AuthPacketSender = {

        send: function send(data, requestType) { // do not return any promise
            postMessage({
                data: data,
                request_type: requestType,
            }, [ChatAuthChannel.port1]);
        },

        request: function request(data, requestType, flooding) { // returns a $q promise
            postMessage({
                data: data,
                request_type: requestType,
                flooding: flooding,
            }, [ChatAuthChannel.port1]);
        },

        pull: function pull(data, requestType, flooding) { // returns a $q promise
            postMessage({
                data: data,
                request_type: requestType,
                flooding: flooding,
            }, [ChatAuthChannel.port1]);
        },
    };
})();
