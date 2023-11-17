// For Generalizsing Shared Global Objects Between App & Worker
self.window = self;

importScripts('shared/chat.app.js');

importScripts('../worker.wat.js');
importScripts('worker.wat.js');

importScripts('shared/chat.constants.js');
importScripts('shared/utils.js');

importScripts('shared/chat.packet.attributes.js');
importScripts('shared/friend_tag.chat.packet.format.js');
importScripts('shared/public.chat.packet.format.js');
importScripts('shared/chat.packet.format.js');
importScripts('shared/auth.requests.js');

importScripts('shared/chat.requests.js');
importScripts('shared/public.chat.requests.js');

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
importScripts('public.chat.responses.js');

importScripts('auth.responses.js'); importScripts('auth.connector.js');
importScripts('../socket.js');


importScripts('logger.js');


if (!CHAT_APP) {
    Logger.debug('alert', 'CHAT_APP WORKER NOT INIT FAILED');
    throw new Error('CHAT_APP WORKER NOT INIT FAILED');
}

// eslint-disable-next-line
var Constants = CHAT_APP.Constants,
    Helpers = CHAT_APP.Helpers,
    ChatResponses = CHAT_APP.ChatResponses,
    ChatSession = CHAT_APP.ChatSession,
    AuthRequests = CHAT_APP.AuthRequests,
    AuthResponses = CHAT_APP.AuthResponses,
    ChatPacketParser = CHAT_APP.ChatPacketParser,
    ChatConnector = CHAT_APP.ChatConnector,
    ChatPacketSender = CHAT_APP.ChatPacketSender,

    GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS,
    REQUEST_CACHE = CHAT_APP.REQUEST_CACHE,
    RESPONSE_CACHE = CHAT_APP.RESPONSE_CACHE,
    CHAT_SESSION = CHAT_APP.CHAT_SESSION,
    TEMPORARY_MESSAGES_CACHE = CHAT_APP.TEMPORARY_MESSAGES_CACHE,

    WORKER_NOTIFIER_TYPES = Constants.WORKER_NOTIFIER_TYPES,
    OFFLINE_PACKET_TYPE = Constants.OFFLINE_PACKET_TYPE,
    CHAT_SERVER_TYPES = Constants.CHAT_SERVER_TYPES,

    isOfflineServerPacket = Helpers.isOfflineServerPacket,
    AuthConnector = CHAT_APP.AuthConnector,
    RequestHelpers = CHAT_APP.RequestHelpers,

    ChatOnlinePacketSender = CHAT_APP.ChatOnlinePacketSender,
    SharedHelpers = CHAT_APP.SharedHelpers;


function updateGloabls(config) {
    CHAT_APP.GLOBALS.appVersion = config.appVersion;
    CHAT_APP.GLOBALS.uId = config.uId || 0;
    CHAT_APP.GLOBALS.utId = config.utId || 0;
    CHAT_APP.GLOBALS.oIpPort = config.oIpPort;
    CHAT_APP.GLOBALS.name = config.name || '';
    CHAT_APP.GLOBALS.profileImage = config.profileImage || '';
}

function sendAuthRequest(requestObject, _requestType) {
    var requestType = _requestType,
        returnPromise;

    if (!requestType) {
        requestType = 'send';
    }

    returnPromise = AuthConnector[requestType].call(null, requestObject);

    if (!!returnPromise) {
        returnPromise.then(function returnPromiseHandler(response) {
            Helpers.sendAuthResponseToMainApp(response);
        });
    }
}

function _getServerType(requestObject) {
    if (isOfflineServerPacket(requestObject.packetType)) {
        return CHAT_SERVER_TYPES.OFFLINE;
    }

    return CHAT_SERVER_TYPES.ONLINE;
}

self.onmessage = WorkerOnMessageProcessor;

function WorkerOnMessageProcessor(e) {
    var authWorkerPort,
        requestObject,
        retryCount,
        key,
        value,
        utIds,
        type,
        pageDirection,
        limit,
        serverType,
        requestType,
        packetId,
        boxId;

    if (!e.data.command) {
        throw new Error('You must provide a command to operate worker');
    }
    switch (e.data.command) {
        case 'SETTINGS':

            try {
                authWorkerPort = e.ports[0];
            } catch (ex) {
                //
            }

            AuthConnector.init(authWorkerPort);

            updateGloabls(e.data);
            ChatConnector.init(e.data);

            break;
        case 'RAW_SEND':

            requestObject = e.data.object;
            retryCount = e.data.retryCount;
            boxId = Helpers.getBoxId(requestObject);
            ChatOnlinePacketSender.rawSend(requestObject, boxId);

            break;

        case 'SEND': // send data through websocket

            requestObject = e.data.object;
            serverType = _getServerType(requestObject);
            retryCount = e.data.retryCount;

            ChatConnector.send(requestObject, serverType, retryCount);
            break;

        case 'REQUEST': // send data through websocket

            requestObject = e.data.object;
            serverType = _getServerType(requestObject);
            retryCount = e.data.retryCount;

            ChatConnector.request(requestObject, serverType, retryCount)
                .then(function requestHandler(response) {
                    response.packetId = response.packetId || requestObject.packetId;
                    Helpers.sendChatRequestResponseToMainApp(response);
                }, function chatRequestFailurehandler(response) {
                    response.packetId = response.packetId || requestObject.packetId;
                    Helpers.sendChatRequestResponseToMainApp(response);
                });

            break;

        case 'UPDATE_GLOBALS':

            key = e.data.key;
            value = e.data.value;

            CHAT_APP.GLOBALS[key] = value;
            break;

        case 'START_CHAT_SESSION':
            boxId = e.data.id;
            type = e.data.type;
            utIds = e.data.utIds;
            Helpers.startChatSession(boxId, type, utIds);

            break;

        case 'END_CHAT_SESSION':
            boxId = e.data.id;
            type = e.data.type;
            Helpers.endChatSession(boxId, type);

            break;


        case 'SEND_AUTH_REQUSET':
            requestObject = e.data.object;
            requestType = e.data.type;
            sendAuthRequest(requestObject, requestType);

            break;

        case 'SEND_TAG_CHAT_MEMBER_ADD_AUTH_REQUEST':
            requestObject = e.data.object;
            requestType = e.data.type;

            requestObject = Helpers.injectRegisterIpPortToRequestObject(requestObject);
            sendAuthRequest(requestObject, requestType);

            break;

        case 'FETCH_HISTORY_MESSAGE':

            boxId = e.data.id;
            type = e.data.type;
            pageDirection = e.data.pageDirection;
            limit = e.data.limit;
            packetId = e.data.packetId;

            Helpers.doChatHistoryMessageRequest(boxId, pageDirection, limit, type, packetId)
                .then(function requestHandler(response) {
                    response.packetId = response.packetId || packetId;
                    Helpers.sendChatRequestResponseToMainApp(response);
                });
            break;

        case 'FROM_AUTH_WORKER':
            AuthConnector.onMessage(e);
            break;

        default:
            Logger.debug('debug', 'command :' + e.data.command + 'not found', 'WORKER_COMMAND');
            break;
    }
}


CHAT_APP.init = function init() {
    CHAT_SESSION.on('idlePacketSend', Helpers.sendIdlePacketByType);

    CHAT_SESSION.on('timeout', function onTimeout() {

        // todo send chat session timeout event to main app

    });

    TEMPORARY_MESSAGES_CACHE.on('timeout', function ontimeout(boxId) {
        Logger.debug('information', 'TEMP MESSAGE TIMEOUT', boxId, 'CHAT');
        RequestHelpers.makeTemporaryMessagesToFailed(boxId, false);
        // todo send temporary message list send failure to main app
    });


//     CHAT_APP.CHAT_CLOCK.on('TICK', function onTick() {
//         if (Constants.CHAT_GLOBAL_VALUES.serverTime > 0) {
//             Constants.CHAT_GLOBAL_VALUES.serverTime += 1000;
//             Helpers.sendChatTimerUpdateToMainApp({
//                 serverTime: Constants.CHAT_GLOBAL_VALUES.serverTime,
//             });
//         }
//     });
};

CHAT_APP.init();

setTimeout(function setTimeoutHandler() {
    Helpers.startValidityTasks();
}, 30000);

