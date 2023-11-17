(function chatModelsIIFE(CHAT_APP) {
    function ChatSessionObject(boxId, type, ip, registerPort, bindingPort, timestamp) {
//         this.ip = "38.127.68.55";
        this.ip = ip || '';
        this.registerPort = parseInt(registerPort || 0, 10);
        this.bindingPort = parseInt(bindingPort || 0, 10);
        this.timestamp = parseInt(timestamp || Date.now(), 10);

        /* Internal Configs */
        this.boxId = boxId;
        this.type = type;

        this.keepAliveIntervalId = null;
        this.timerState = 0;
    }

    ChatSessionObject.prototype = {
        update: function update(ip, registerPort, bindingPort, timestamp) {
            if (this.timestamp < timestamp) {
                this.ip = ip;
                this.registerPort = parseInt(registerPort, 10);
                this.bindingPort = parseInt(bindingPort, 10);
                this.timestamp = timestamp;
            }
        },

        setTimerState: function setTimerState(timerState) {
            this.timerState = timerState;
        },

        getTimerState: function getTimerState() {
            return this.timerState;
        },
    };

    function TagObject(id, name, memberUtIds) {
        this.id = id || 0;
        this.name = name || 'Group';
        this.memberUtIds = memberUtIds || [];
        this.memberCount = 0;
    }

    CHAT_APP.MODELS = {};
    CHAT_APP.MODELS.SESSION_OBJECT = ChatSessionObject;
    CHAT_APP.MODELS.TagObject = TagObject;
})(CHAT_APP);
