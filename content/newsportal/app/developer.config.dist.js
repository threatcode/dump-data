RingLogger.showFileUrl = false;
RingLogger.tags.AUTH = 'AUTH';
RingLogger.tags.MEDIA= 'MEDIA';
RingLogger.tags.UPLOAD = 'UPLOAD';
RingLogger.tags.CIRCLE = 'CIRCLE';
RingLogger.tags.FRIEND = 'FRIEND';
RingLogger.tags.PROFILE = 'PROFILE';
RingLogger.tags.STICKER = 'STICKER';
RingLogger.tags.CHAT = 'CHAT';
RingLogger.tags.TAG_CHAT = 'TAG_CHAT';
RingLogger.tags.NOTIFICATION= 'NOTIFICATION';
RingLogger.tags.SEARCH= 'SEARCH';
RingLogger.tags.IMAGE= 'IMAGE';
RingLogger.tags.INVITE= 'INVITE';
RingLogger.tags.CONNECTION = 'CONNECTION';
RingLogger.tags.DEFAULT = 'DEFAULT';
RingLogger.tags.DROPDOWN= 'DROPDOWN';
RingLogger.tags.RECEIVED = 'RECEIVED';
RingLogger.tags.SEND = 'SEND';
RingLogger.tags.KEEPALIVE = 'KEEP_ALIVE';
RingLogger.tags.RGREPEAT = 'RGREPEAT';
RingLogger.tags.WATFALL = 'WATFALL';
RingLogger.tags.SOCKETTEST = 'SOCKETTEST';
RingLogger.tags.PARSER = 'Parser';
RingLogger.tags.MERGER = 'Merger';
RingLogger.tags.STSTAG = 'STSTAG';
RingLogger.tags.DIGEST = 'DIGEST';
RingLogger.tags.CHAT_EXCEPTIONS = 'CHAT_EXCEPTIONS';
RingLogger.tags.TAG_CHAT_REQUEST = 'TAG_CHAT_REQUEST';
RingLogger.tags.TAG_CHAT_RESPONSE = 'TAG_CHAT_RESPONSE';
RingLogger.tags.CHAT_REQUEST = 'CHAT_REQUEST';
RingLogger.tags.CHAT_RESPONSE = 'CHAT_RESPONSE';
RingLogger.tags.CHAT_RESPONSE_CACHE = 'CHAT_RESPONSE_CACHE';
RingLogger.tags.CHAT_REQUEST_CACHE = 'CHAT_REQUEST_CACHE';
RingLogger.tags.CHAT_BROKEN_CACHE = 'CHAT_BROKEN_CACHE';
RingLogger.tags.CHAT_STATE_MACHINE = 'CHAT_STATE_MACHINE';
RingLogger.tags.CHAT_SEND_MESSAGE = 'CHAT_SEND_MESSAGE';
RingLogger.tags.scopetest = 'scopetest';
RingLogger.tags.rgLike = 'rgLike';
RingLogger.tags.registered = 'registered';
RingLogger.tags.Ringbox = 'Ringbox';
RingLogger.tags.IMAGEMAP = 'IMAGEMAP';
RingLogger.tags.TAB_DATA_RECEIVED = 'TAB_DATA_RECEIVED';
RingLogger.tags.SHARED_WORKER = 'SHARED_WORKER';
RingLogger.tags.CHAT_HISTORY_DEBUG = 'CHAT_HISTORY_DEBUG';
RingLogger.tags.RG_RECRODER = 'RG_RECRODER';
RingLogger.tags.ROUTE_CHANGE = 'ROUTE_CHANGE';

RingLogger.conditions[RingLogger.tags.RECEIVED] = true;
RingLogger.conditions[RingLogger.tags.SEND] = false;
RingLogger.conditions[RingLogger.tags.KEEPALIVE] = false;
RingLogger.conditions[RingLogger.tags.AUTH] = false;
RingLogger.conditions[RingLogger.tags.MEDIA] = false;
RingLogger.conditions[RingLogger.tags.UPLOAD] = false;
RingLogger.conditions[RingLogger.tags.CIRCLE] = false;
RingLogger.conditions[RingLogger.tags.FRIEND] = false;
RingLogger.conditions[RingLogger.tags.PROFILE] = false;
RingLogger.conditions[RingLogger.tags.STICKER] = false;
RingLogger.conditions[RingLogger.tags.CHAT] = true;
RingLogger.conditions[RingLogger.tags.TAG_CHAT] = false;
RingLogger.conditions[RingLogger.tags.SEARCH] = false;
RingLogger.conditions[RingLogger.tags.IMAGE] = false;
RingLogger.conditions[RingLogger.tags.INVITE] = false;
RingLogger.conditions[RingLogger.tags.NOTIFICATION] = false;
RingLogger.conditions[RingLogger.tags.DEFAULT] = false;
RingLogger.conditions[RingLogger.tags.DROPDOWN] = false;
RingLogger.conditions[RingLogger.tags.CONNECTION] = false;
RingLogger.conditions[RingLogger.tags.RGREPEAT] = false;
RingLogger.conditions[RingLogger.tags.WATFALL] = false;
RingLogger.conditions[RingLogger.tags.PARSER] = false;
RingLogger.conditions[RingLogger.tags.SOCKETTEST] = false;
RingLogger.conditions[RingLogger.tags.MERGER] = false;
RingLogger.conditions[RingLogger.tags.STSTAG] = false;
RingLogger.conditions[RingLogger.tags.DIGEST] = false;
RingLogger.conditions[RingLogger.tags.CHAT_EXCEPTIONS] = false;
RingLogger.conditions[RingLogger.tags.TAG_CHAT_REQUEST] = true;
RingLogger.conditions[RingLogger.tags.TAG_CHAT_RESPONSE] = true;
RingLogger.conditions[RingLogger.tags.CHAT_REQUEST] = false;
RingLogger.conditions[RingLogger.tags.CHAT_RESPONSE] = false;
RingLogger.conditions[RingLogger.tags.CHAT_RESPONSE_CACHE] = false;
RingLogger.conditions[RingLogger.tags.CHAT_REQUEST_CACHE] = false;
RingLogger.conditions[RingLogger.tags.CHAT_BROKEN_CACHE] = false;
RingLogger.conditions[RingLogger.tags.CHAT_STATE_MACHINE] = false;
RingLogger.conditions[RingLogger.tags.CHAT_SEND_MESSAGE] = true;
RingLogger.conditions[RingLogger.tags.scopetest] = false;
RingLogger.conditions[RingLogger.tags.rgLike] = false;
RingLogger.conditions[RingLogger.tags.registered] = false;
RingLogger.conditions[RingLogger.tags.Ringbox] = false;
RingLogger.conditions[RingLogger.tags.IMAGEMAP] = false;
RingLogger.conditions[RingLogger.tags.TAB_DATA_RECEIVED] = false;
RingLogger.conditions[RingLogger.tags.SHARED_WORKER] = false;
RingLogger.conditions[RingLogger.tags.CHAT_HISTORY_DEBUG] = false;
RingLogger.conditions[RingLogger.tags.RG_RECRODER] = false;
RingLogger.conditions[RingLogger.tags.ROUTE_CHANGE] = false;
RingLogger.classNameChanged();





//digest code sample
// ##DIGEST_DEBUG_START##
      // if(RingLogger.tags.DIGEST){
      //     $scope.$watch(function(){
      //          RingLogger.info("from ",RingLogger.tags.DIGEST);
      //      });
      // }
// ##DIGEST_DEBUG_END##
