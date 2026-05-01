describe('ChatService', function() {
  var ChatService, httpBackend;

  beforeEach(function() {
    angular.mock.module('ringid.chat');

    angular.mock.inject(function(_ChatService_, $httpBackend) {
      ChatService = _ChatService_;
      httpBackend = $httpBackend;
    });
  });

  it('should exist', function() {
    expect(ChatService).toBeDefined();
  });

  it('should have sendMessage method', function() {
    expect(typeof ChatService.sendMessage).toBe('function');
  });

  it('should have getMessages method', function() {
    expect(typeof ChatService.getMessages).toBe('function');
  });
});
