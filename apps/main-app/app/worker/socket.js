 (function(self){

    function $WebSocket(url,options){
        var protocols = options && options.protocols;
          if (!!options) {
            protocols = options;
          }

          this.protocols = protocols || 'Sec-WebSocket-Protocol';
          this.url = url || 'Missing URL';
          this.ssl = /(wss)/i.test(this.url);
          // this.binaryType = '';
          // this.extensions = '';
          // this.bufferedAmount = 0;
          // this.trasnmitting = false;
          // this.buffer = [];
          this._pause = false;//yet status is open but using this poperty one cane stop sending data to server
          this._reconnectAttempts = 0;
          this.initialTimeout = 500; // 500ms
          this.maxTimeout = 5 * 60 * 1000; // 5 minutes
          this.sendQueue = [];
          this.forceQueue = [];
          this.onOpenCallbacks = [];
          this.onMessageCallbacks = [];
          this.onErrorCallbacks = [];
          this.onCloseCallbacks = [];
          this._connect();
          this.reconnectRequested = false;
    }
    $WebSocket.prototype._normalCloseCode = 1000;
    $WebSocket.prototype._reconnectableStatusCodes = [
      4000
    ];
    $WebSocket.prototype._readyStateConstants = {
      'CONNECTING': 0,
      'OPEN': 1,
      'CLOSING': 2,
      'CLOSED': 3,
      'RECONNECT_ABORTED': 4
    };
    $WebSocket.prototype._connect = function (force) {
          if ((force || !this.socket || !this.isOpen()) && !this.isConnecting()) {
            if(this.isOpen()){
              this.close();
            }
            if (this.protocols) {
              this.socket = new WebSocket(this.url, this.protocols);
            }else{
              this.socket = new WebSocket(this.url);
            }
            this.socket.binaryType = 'arraybuffer';
            this.socket.onopen = this._onOpenHandler.bind(this);
            this.socket.onmessage = this._onMessageHandler.bind(this);
            this.socket.onerror = this._onErrorHandler.bind(this);
            this.socket.onclose = this._onCloseHandler.bind(this);
            this.socket._emit = this.socket.emit;
            this.socket.emit = function(){
                try{
                  this.socket._emit.apply(this.socket, arguments);
                }catch(e){

                }
            }
          }
          
           
    };
 
    $WebSocket.prototype.fireQueue = function fireQueue() {
      if(!this.isOpen()){
        if(!this.isConnecting()){
          this.reconnect();  
        }
        return;
      }
      if(this._pause){return;}//manually pausing connection still connected to server
      while (this.sendQueue.length) {
        var data = this.sendQueue.shift();
        data = new Uint8Array(data.buffer);
        this.socket.send(data);
      }
    };
    $WebSocket.prototype.fireForceQueue = function fireForceQueue(){
      if(!this.isOpen()){
        if(!this.isConnecting()){
          this.reconnect();  
        }        
        return;
      }
      while (this.forceQueue.length) {
        var data = this.forceQueue.shift();
        data = new Uint8Array(data.buffer);
        this.socket.send(data);
      }
    };

    $WebSocket.prototype.notifyOpenCallbacks = function notifyOpenCallbacks(event) {
      for (var i = 0; i < this.onOpenCallbacks.length; i++) {
        this.onOpenCallbacks[i].call(this, event);
      }
    };

    $WebSocket.prototype.notifyCloseCallbacks = function notifyCloseCallbacks(event) {
      for (var i = 0; i < this.onCloseCallbacks.length; i++) {
        this.onCloseCallbacks[i].call(this, event);
      }
    };

    $WebSocket.prototype.notifyErrorCallbacks = function notifyErrorCallbacks(event) {
      for (var i = 0; i < this.onErrorCallbacks.length; i++) {
        this.onErrorCallbacks[i].call(this, event);
      }
    };
 
    $WebSocket.prototype.onOpen = function onOpen(cb) {
      this.onOpenCallbacks.push(cb);
      return this;
    };

    $WebSocket.prototype.onClose = function onClose(cb) {
      this.onCloseCallbacks.push(cb);
      return this;
    };

    $WebSocket.prototype.onError = function onError(cb) {
      this.onErrorCallbacks.push(cb);
      return this;
    };

    $WebSocket.prototype.isOpen = function isOpen() {
      return this.socket && this.socket.readyState === this._readyStateConstants.OPEN;
    };
    $WebSocket.prototype.isConnecting = function isConnecting() {
      return this.socket && this.socket.readyState === this._readyStateConstants.CONNECTING;
    };
    $WebSocket.prototype.pause = function pause(val) {
      this._pause = val;
      this.fireQueue();
      return this._pause;
    };

    $WebSocket.prototype.onMessage = function onMessage(callback) {
          if (!isFunction(callback)) {
            throw new Error('Callback must be a function');
          }
          this.onMessageCallbacks.push(callback);
          return this;
    };

    $WebSocket.prototype._onOpenHandler = function _onOpenHandler(event) {
      this._reconnectAttempts = 0;
      this.reconnectRequested = false;
      this.notifyOpenCallbacks(event);
      this.fireQueue();
      this.fireForceQueue();
      Logger.log(event.timeStamp,"CONNECTION_OPEN");
    };

    $WebSocket.prototype._onCloseHandler = function _onCloseHandler(event) {
      this.notifyCloseCallbacks(event);
      this.reconnectRequested = false;
      Logger.log(event.code,"CONNECTION_CLOSE");
      // if ((this.reconnectIfNotNormalClose && event.code !== this._normalCloseCode) || this._reconnectableStatusCodes.indexOf(event.code) > -1) {
      //   this.reconnect();
      // }
    };
    $WebSocket.prototype._onMessageHandler = function _onMessageHandler(message) {
      var self = this;
      for (var i = 0; i < self.onMessageCallbacks.length; i++) {
        currentCallback = self.onMessageCallbacks[i];
        currentCallback.call(self, message.data);
      }
    };
    $WebSocket.prototype._onErrorHandler = function _onErrorHandler(event) {
      this.notifyErrorCallbacks(event);
      this.reconnectRequested = false;
    };
    $WebSocket.prototype.send = function send(data,force) {
        var me = this;
        if(force){
            if(me.isOpen()){
              me.socket.send(new Uint8Array(data.buffer));
            }else{
              if(!me.isConnecting()){
                 me.reconnect();  
              }
              me.forceQueue.push(data);
            }
          return;
        }
        me.sendQueue.push(data);
        me.fireQueue();
        return me;
    };


    $WebSocket.prototype.close = function close(force) {
      if (force || !this.socket.bufferedAmount) {
        this.socket.close();
      }else{
        Logger.log("bufferedAmount remains can't close now");
      }
      return this;
    };

    $WebSocket.prototype.reconnect = function reconnect() {
        if(!this.reconnectRequested){
          //this.close();
          var backoffDelay = this._getBackoffDelay(++this._reconnectAttempts);
          var backoffDelaySeconds = backoffDelay / 1000;
          Logger.log('Reconnecting in ' + backoffDelaySeconds + ' seconds');
          setTimeout(this._connect.bind(this),backoffDelay);
          this.reconnectRequested = true;
        }
        

        return this;
    };
    // Exponential Backoff Formula by Prof. Douglas Thain
    // http://dthain.blogspot.co.uk/2009/02/exponential-backoff-in-distributed.html
    $WebSocket.prototype._getBackoffDelay = function _getBackoffDelay(attempt) {
      var R = Math.random() + 1;
      var T = this.initialTimeout;
      var F = 2;
      var N = attempt;
      var M = this.maxTimeout;

      return Math.floor(Math.min(R * T * Math.pow(F, N), M));
    };
    function SocketProvider(url, protocols) {
      var match = /wss?:\/\//.exec(url);
      var Socket, ws;
      if (!match) {
        throw new Error('Invalid url provided');
      }
      if (protocols) {
        return new $WebSocket(url, protocols);
      }
      return new $WebSocket(url);
    }
    self.SocketProvider = SocketProvider;
}(self))
