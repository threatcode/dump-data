//For Generalizsing Shared Global Objects Between App & Worker
self.window = self;

importScripts('shared/chat.app.js');

importScripts('../worker.wat.js');
importScripts('worker.wat.js');

importScripts('shared/chat.constants.js');
importScripts('shared/utils.js');
importScripts('shared/chat.packet.format.js');
importScripts('shared/auth.requests.js');
importScripts('shared/chat.requests.js');
importScripts('shared/packetidgen.js');

importScripts('chat.response.helpers.js');

importScripts('packet.parser.js');
importScripts('chat.models.js');

importScripts('chat.factory.js');

importScripts('chat.packet.sender.js');
importScripts('auth.packet.sender.js');



importScripts('chat.offline.packet.sender.js');
importScripts('chat.online.packet.sender.js');

importScripts('helpers.js');

importScripts('chat.connector.js');

importScripts('shared/helpers.js');

importScripts('chat.requests.helpers.js');

importScripts('chat.responses.js');
importScripts('auth.responses.js');
importScripts('auth.connector.js');
importScripts('../socket.js');


importScripts('logger.js');


if( !CHAT_APP ){
    Logger.debug("alert", 'CHAT_APP WORKER NOT INIT FAILED');
    throw new Error('CHAT_APP WORKER NOT INIT FAILED');
}


var Constants                = CHAT_APP.Constants;
var Helpers                  = CHAT_APP.Helpers;
var ChatResponses            = CHAT_APP.ChatResponses;
var ChatSession              = CHAT_APP.ChatSession;
var AuthRequests             = CHAT_APP.AuthRequests;
var AuthResponses            = CHAT_APP.AuthResponses;
var ChatPacketParser         = CHAT_APP.ChatPacketParser;
var ChatConnector            = CHAT_APP.ChatConnector;
var ChatPacketSender         = CHAT_APP.ChatPacketSender;

var GENERAL_CONSTANTS        = Constants.GENERAL_CONSTANTS;
var REQUEST_CACHE            = CHAT_APP.REQUEST_CACHE;
var RESPONSE_CACHE           = CHAT_APP.RESPONSE_CACHE;
var CHAT_SESSION             = CHAT_APP.CHAT_SESSION;
var TEMPORARY_MESSAGES_CACHE = CHAT_APP.TEMPORARY_MESSAGES_CACHE;

var WORKER_NOTIFIER_TYPES    = Constants.WORKER_NOTIFIER_TYPES;
var OFFLINE_PACKET_TYPE      = Constants.OFFLINE_PACKET_TYPE;
var CHAT_SERVER_TYPES        = Constants.CHAT_SERVER_TYPES;

var isOfflineServerPacket    = Helpers.isOfflineServerPacket;
var AuthConnector            = CHAT_APP.AuthConnector;
var RequestHelpers           = CHAT_APP.RequestHelpers;

var ChatOnlinePacketSender   = CHAT_APP.ChatOnlinePacketSender;
var SharedHelpers            = CHAT_APP.SharedHelpers;



function updateGloabls(config){
    CHAT_APP.GLOBALS['appVersion'] = config.appVersion;
    CHAT_APP.GLOBALS['uId'] = config.uId || 0;
    CHAT_APP.GLOBALS['oIpPort'] = config.oIpPort;
}

function sendAuthRequest(requestObject, requestType){
    if( !requestType){
        requestType = 'send';
    }            

    var returnPromise = AuthConnector[requestType].call(null, requestObject);
    
    if( !!returnPromise ){
        returnPromise.then(function(response){
            Helpers.sendAuthResponseToMainApp(response);
        });                
    }
}

self.onmessage = WorkerOnMessageProcessor;
function WorkerOnMessageProcessor(e){

    if(!e.data.command){
        throw new Error("You must provide a command to operate worker");
    } 
    switch(e.data.command) {
        case 'SETTINGS' :
            
            var authWorkerPort = e.ports[0];                
            AuthConnector.init( authWorkerPort );

            updateGloabls(e.data);
            ChatConnector.init(e.data);
            
                        
            break;


        case 'RAW_SEND' : 

            var requestObject = e.data.object;
            var retryCount = e.data.retryCount;

            var boxId = Helpers.getBoxId( requestObject );
            ChatOnlinePacketSender.rawSend(requestObject, boxId);        
            
            break;

        case 'SEND' : // send data through websocket

            var requestObject = e.data.object;
            var retryCount = e.data.retryCount;

            if( isOfflineServerPacket( requestObject.packetType )){
                ChatConnector.send(requestObject, CHAT_SERVER_TYPES.OFFLINE, retryCount );
            }else{
                ChatConnector.send(requestObject, CHAT_SERVER_TYPES.ONLINE, retryCount );
            }
            break;

        case 'REQUEST' : // send data through websocket

            var requestObject = e.data.object;
            var retryCount = e.data.retryCount;

            if( isOfflineServerPacket( requestObject.packetType )){
                ChatConnector.request(requestObject, CHAT_SERVER_TYPES.OFFLINE, retryCount ).then(function(response){
                    response.packetId = response.packetId || requestObject.packetId;
                    Helpers.sendChatRequestResponseToMainApp(response);
                });
            }else{
                ChatConnector.request(requestObject, CHAT_SERVER_TYPES.ONLINE, retryCount ).then(function(response){
                    response.packetId = response.packetId || requestObject.packetId;
                    Helpers.sendChatRequestResponseToMainApp(response); 
                });
            }
            break;                


        case 'PAUSE' :
            chatConnection && chatConnection.pause(true);
            break;

        case 'RESUME' :
            chatConnection && chatConnection.pause(false);
            break;

        case 'UPDATE_GLOBALS' :
            
            var key = e.data.key;
            var value = e.data.value;

            CHAT_APP.GLOBALS[key] = value;
            break;

        case 'START_CHAT_SESSION' : 
            var boxId = e.data.id;
            var type = e.data.type;
            var uIds = e.data.uIds;
            Helpers.startChatSession(boxId, type, uIds);    
            
            break;

        case 'END_CHAT_SESSION' : 
            var boxId = e.data.id;            
            var type = e.data.type;
            Helpers.endChatSession(boxId, type);    
               
            break;


        case 'SEND_AUTH_REQUSET' :
            var requestObject = e.data.object;
            var requestType = e.data.type;
            sendAuthRequest( requestObject, requestType);

            break;

        case 'SEND_TAG_CHAT_MEMBER_ADD_AUTH_REQUEST':
            var requestObject = e.data.object;
            var requestType = e.data.type;

            requestObject = Helpers.injectRegisterIpPortToRequestObject(requestObject);
            sendAuthRequest( requestObject, requestType);

            break;

        case 'FETCH_HISTORY_MESSAGE' :
            
            var boxId = e.data.id;            
            var type = e.data.type;            
            var pageDirection = e.data.pageDirection;            
            var limit = e.data.limit;            
            var packetId = e.data.packetId;            

            Helpers.doChatHistoryMessageRequest(boxId, pageDirection, limit, type, packetId).then(function(response){
                response.packetId = response.packetId || packetId;
                Helpers.sendChatRequestResponseToMainApp(response);
            });
        
 
        default:
            Logger.debug("debug","command :"+e.data.command+ "not found","WORKER_COMMAND");
            break;
    };
}


CHAT_APP.Init = function(){

    CHAT_SESSION.on('idlePacketSend', Helpers.sendIdlePacketByType);

    CHAT_SESSION.on('timeout', function(){

      //todo send chat session timeout event to main app

    });  

    TEMPORARY_MESSAGES_CACHE.on('timeout', function(boxId){

       Logger.debug('information', 'TEMP MESSAGE TIMEOUT', boxId, 'CHAT');
       RequestHelpers.makeTemporaryMessagesToFailed( boxId, false ); 
      //todo send temporary message list send failure to main app

    });  
    
    CHAT_APP['CHAT_CLOCK'].on('TICK', function(){
        if( Constants.CHAT_GLOBAL_VALUES.serverTime > 0){ 
            Constants.CHAT_GLOBAL_VALUES.serverTime += 1000;  
            Helpers.sendChatTimerUpdateToMainApp({ 'serverTime':  Constants.CHAT_GLOBAL_VALUES.serverTime});
        }
    });
    
}


CHAT_APP.Init();

setTimeout(function(){
    Helpers.startValidityTasks();    
}, 10000);
