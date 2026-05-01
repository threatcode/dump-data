// AngularJS service wrapper for modern WebSocket
// This replaces the legacy worker.js approach

import RingSocket from './websocket.service.js';

export default function RingSocketService($rootScope, $timeout) {
  'ngInject';
  
  const socket = null;
  const service = {
    connect(url) {
      if (socket) {
        socket.disconnect();
      }
      
      socket = new RingSocket(url);
      
      socket.on('open', () => {
        $rootScope.$broadcast('socket:connected');
        $rootScope.$apply();
      });
      
      socket.on('message', (data) => {
        $rootScope.$broadcast('socket:message', data);
        $timeout(() => $rootScope.$apply());
      });
      
      socket.on('close', () => {
        $rootScope.$broadcast('socket:disconnected');
        $rootScope.$apply();
      });
      
      socket.on('error', (error) => {
        $rootScope.$broadcast('socket:error', error);
        $rootScope.$apply();
      });
      
      socket.connect();
      return socket;
    },
    
    send(data) {
      if (socket) {
        return socket.send(data);
      }
      return false;
    },
    
    on(event, callback) {
      if (socket) {
        socket.on(event, callback);
      }
    },
    
    disconnect() {
      if (socket) {
        socket.disconnect();
      }
    },
    
    get isConnected() {
      return socket && socket.isConnected;
    }
  };
  
  return service;
}

// Register with AngularJS
try {
  angular.module('ringid.services');
} catch (e) {
  angular.module('ringid.services', []);
}

angular.module('ringid.services')
  .factory('RingSocketService', ['$rootScope', '$timeout', RingSocketService]);
