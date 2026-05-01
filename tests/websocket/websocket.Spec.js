describe('RingSocket', function() {
  var RingSocket;

  beforeEach(function() {
    // Load the module
    angular.mock.module('ringid.services');
  });

  it('should connect to WebSocket URL', function() {
    // Mock WebSocket
    var mockWS = {
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
      send: jasmine.createSpy('send'),
      close: jasmine.createSpy('close')
    };

    spyOn(window, 'WebSocket').and.returnValue(mockWS);

    inject(function(RingSocketService) {
      var socket = RingSocketService.connect('ws://localhost:8080');
      expect(window.WebSocket).toHaveBeenCalledWith('ws://localhost:8080');
    });
  });

  it('should handle incoming messages', function() {
    inject(function(RingSocketService) {
      var messageHandler = jasmine.createSpy('messageHandler');
      var socket = RingSocketService.connect('ws://localhost:8080');
      
      RingSocketService.on('message', messageHandler);
      
      // Simulate incoming message
      var mockEvent = { data: JSON.stringify({ type: 'test' }) };
      
      expect(messageHandler).toHaveBeenCalled();
    });
  });
});
