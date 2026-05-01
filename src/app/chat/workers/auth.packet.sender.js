;(function(){

    
    var Constants = CHAT_APP.Constants;    
    var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
    var PACKET_CONSTANTS = Constants.PACKET_CONSTANTS;

    var REQUEST_CACHE = CHAT_APP.REQUEST_CACHE;

    function _sendRequestResponse(packetId, response){
        postMessage({
            object: response,
            packetId : packetId,
            notifier : WORKER_NOTIFIER_TYPES.REQUEST_RESPONSE
        });
    }

    var ChatAuthChannel; 
    try{
        ChatAuthChannel = new MessageChannel();
    }catch(e){
        ChatAuthChannel = new BroadcastChannel('ring_channel'); 
    }

    CHAT_APP['AuthPacketSender'] = {
   
        send : function(data,request_type){ // do not return any promise            
            postMessage({data: data, request_type : request_type}, [ChatAuthChannel.port1]);
        },

        request : function(data, request_type, flooding){//returns a $q promise
            postMessage({data: data, request_type : request_type, flooding: flooding}, [ChatAuthChannel.port1]);  
        },

        pull : function(data, request_type, flooding){//returns a $q promise
            postMessage({data: data, request_type : request_type,flooding: flooding}, [ChatAuthChannel.port1]);
        }
    };

})();
