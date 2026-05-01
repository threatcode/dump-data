// Modern WebSocket Service for RingID
// Replaces legacy worker.js, sender.js, parser.js

export class RingSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.ws = null;
    this.handlers = new Map();
    this.reconnectDelay = options.reconnectDelay || 1000;
    this.maxReconnectDelay = options.maxReconnectDelay || 30000;
    this.keepAliveInterval = null;
    this.pingPongMap = new Map();
    this.floodingRequest = {};
    this.floodingData = {};
    this.isConnected = false;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[RingSocket] Connected');
        this.isConnected = true;
        this.reconnectDelay = 1000;
        this.notify('open');
        this.startKeepAlive();
      };

      this.ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          try {
            const data = JSON.parse(event.data);
            this.notify('message', data);
          } catch (e) {
            console.error('[RingSocket] Parse error:', e);
          }
        } else if (event.data instanceof ArrayBuffer) {
          this.handleBinaryData(event.data);
        }
      };

      this.ws.onclose = (event) => {
        console.log('[RingSocket] Disconnected:', event.code, event.reason);
        this.isConnected = false;
        this.stopKeepAlive();
        this.notify('close', event);
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[RingSocket] Error:', error);
        this.notify('error', error);
      };
    } catch (error) {
      console.error('[RingSocket] Connection failed:', error);
      this.scheduleReconnect();
    }
  }

  handleBinaryData(buffer) {
    try {
      const view = new DataView(buffer);
      // TODO: Implement binary protocol parsing based on legacy parser.js
      console.log(
        '[RingSocket] Binary data received:',
        buffer.byteLength,
        'bytes'
      );
    } catch (error) {
      console.error('[RingSocket] Binary parse error:', error);
    }
  }

  send(data) {
    if (!this.isConnected) {
      console.warn('[RingSocket] Cannot send: not connected');
      return false;
    }

    try {
      if (typeof data === 'object') {
        this.ws.send(JSON.stringify(data));
      } else {
        this.ws.send(data);
      }
      return true;
    } catch (error) {
      console.error('[RingSocket] Send error:', error);
      return false;
    }
  }

  startKeepAlive() {
    this.stopKeepAlive();
    this.keepAliveInterval = setInterval(() => {
      if (this.isConnected) {
        const packet = this.buildKeepAlivePacket();
        this.send(packet);
      }
    }, 30000); // 30 seconds
  }

  stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  buildKeepAlivePacket() {
    // TODO: Implement based on legacy sender.js
    return { type: 'ping' };
  }

  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event).push(handler);
  }

  off(event, handler) {
    const handlers = this.handlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  notify(event, data) {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`[RingSocket] Handler error for ${event}:`, error);
      }
    });
  }

  scheduleReconnect() {
    if (this.reconnectDelay <= this.maxReconnectDelay) {
      console.log(`[RingSocket] Reconnecting in ${this.reconnectDelay}ms`);
      setTimeout(() => {
        this.reconnectDelay = Math.min(
          this.reconnectDelay * 2,
          this.maxReconnectDelay
        );
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.error('[RingSocket] Max reconnection attempts reached');
      this.notify('maxReconnect');
    }
  }

  disconnect() {
    this.stopKeepAlive();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

export default RingSocket;
