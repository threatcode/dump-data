;(function(CHAT_APP){

    function ChatSessionObject(boxId, type, ip, registerPort, bindingPort ){
        this.ip = ip || '';
        this.registerPort = parseInt(registerPort || 0);
        this.bindingPort = parseInt(bindingPort|| 0);

        /* Internal Configs */
        this.boxId = boxId;
        this.type = type;

        this.keepAliveIntervalId = null;
        this.timerState = 0;
    }

    ChatSessionObject.prototype = {
        update : function(ip, registerPort, bindingPort ){
            this.ip = ip;
            this.registerPort = parseInt(registerPort);
            this.bindingPort = parseInt(bindingPort);                 
        },

        setTimerState : function(timerState){
            this.timerState = timerState;
        },

        getTimerState : function(){
            return this.timerState;
        }
    }


    function ChatMessageObject(){}
    function TagObject(id, name, memeberUIds){
        this.id = id || 0;
        this.name = name || 'Group';
        this.memeberUIds = memeberUIds || [];
        this.memberCount = 0;
    }

    function TagMemberObject(){}


    CHAT_APP['MODELS'] = {};
    CHAT_APP['MODELS']['SESSION_OBJECT'] = ChatSessionObject;
    CHAT_APP['MODELS']['TagObject'] = TagObject;




})(CHAT_APP);    