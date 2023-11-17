RingLogger.showFileUrl                                       = false;
RingLogger.tags.AUTH                                         = 'AUTH';
RingLogger.tags.MEDIA                                        = 'MEDIA';
RingLogger.tags.UPLOAD                                       = 'UPLOAD';
RingLogger.tags.CIRCLE                                       = 'CIRCLE';
RingLogger.tags.FRIEND                                       = 'FRIEND';
RingLogger.tags.PROFILE                                      = 'PROFILE';
RingLogger.tags.STICKER                                      = 'STICKER';
RingLogger.tags.NOTIFICATION                                 = 'NOTIFICATION';
RingLogger.tags.SEARCH                                       = 'SEARCH';
RingLogger.tags.IMAGE                                        = 'IMAGE';
RingLogger.tags.INVITE                                       = 'INVITE';
RingLogger.tags.CONNECTION                                   = 'CONNECTION';
RingLogger.tags.DEFAULT                                      = 'DEFAULT';
RingLogger.tags.DROPDOWN                                     = 'DROPDOWN';
RingLogger.tags.RECEIVED                                     = 'RECEIVED';
RingLogger.tags.BROKEN_PACKET                                = 'BROKEN_PACKET';
RingLogger.tags.SEND                                         = 'SEND';
RingLogger.tags.KEEPALIVE                                    = 'KEEP_ALIVE';
RingLogger.tags.RGREPEAT                                     = 'RGREPEAT';
RingLogger.tags.WATFALL                                      = 'WATFALL';
RingLogger.tags.SOCKETTEST                                   = 'SOCKETTEST';
RingLogger.tags.PARSER                                       = 'Parser';
RingLogger.tags.MERGER                                       = 'Merger';
RingLogger.tags.STSTAG                                       = 'STSTAG';
RingLogger.tags.DIGEST                                       = 'DIGEST';
RingLogger.tags.scopetest                                    = 'scopetest';
RingLogger.tags.rgLike                                       = 'rgLike';
RingLogger.tags.rgReport                                     = 'rgReport';
RingLogger.tags.registered                                   = 'registered';
RingLogger.tags.Ringbox                                      = 'Ringbox';
RingLogger.tags.IMAGEMAP                                     = 'IMAGEMAP';
RingLogger.tags.TAB_DATA_RECEIVED                            = 'TAB_DATA_RECEIVED';
RingLogger.tags.SHARED_WORKER                                = 'SHARED_WORKER';
RingLogger.tags.CHAT_HISTORY_DEBUG                           = 'CHAT_HISTORY_DEBUG';
RingLogger.tags.RG_RECRODER                                  = 'RG_RECRODER';
RingLogger.tags.ACKNWOLEDGED                                 = 'ACKNWOLEDGED';
RingLogger.tags.PACKET_DATA                                  = 'PACKET_DATA';
RingLogger.tags.SENDER                                       = 'SENDER';
RingLogger.tags.PACKET_DATA                                  = 'PACKET_DATA';
RingLogger.tags.ACKNOWLDGE                                   = 'ACKNOWLDGE';
RingLogger.tags.WORKER_SETTTING                              = 'WORKER_SETTTING';
RingLogger.tags.CONNECTION_OPEN                              = 'CONNECTION_OPEN';
RingLogger.tags.CONNECTION_CLOSE                             = 'CONNECTION_CLOSE';
RingLogger.tags.DEBUG                                        = 'DEBUG';
RingLogger.tags.REQUEST_STACK                                = 'REQUEST_STACK';
RingLogger.tags.PING                                         = 'PING';
RingLogger.tags.PONG                                         = 'PONG';
RingLogger.tags.PAGETITLE                                    = 'PAGETITLE';


//CHAT DBEUG POINTS 
RingLogger.tags.CHAT                                         = 'CHAT';
RingLogger.tags.CHAT_0                                       = 'CHAT_0';
RingLogger.tags.TAG_CHAT                                     = 'TAG_CHAT';
RingLogger.tags.CHAT_EXCEPTIONS                              = 'CHAT_EXCEPTIONS';
RingLogger.tags.TAG_CHAT_REQUEST                             = 'TAG_CHAT_REQUEST';
RingLogger.tags.TAG_CHAT_RESPONSE                            = 'TAG_CHAT_RESPONSE';
RingLogger.tags.CHAT_REQUEST                                 = 'CHAT_REQUEST';
RingLogger.tags.CHAT_RESPONSE                                = 'CHAT_RESPONSE';
RingLogger.tags.CHAT_RESPONSE_CACHE                          = 'CHAT_RESPONSE_CACHE';
RingLogger.tags.CHAT_REQUEST_CACHE                           = 'CHAT_REQUEST_CACHE';
RingLogger.tags.CHAT_BROKEN_CACHE                            = 'CHAT_BROKEN_CACHE';
RingLogger.tags.CHAT_STATE_MACHINE                           = 'CHAT_STATE_MACHINE';
RingLogger.tags.CHAT_SEND_MESSAGE                            = 'CHAT_SEND_MESSAGE';
RingLogger.tags.CHAT_PACKET_RECEIVED                         = 'CHAT_PACKET_RECEIVED';
RingLogger.tags.CHAT_DEBUG                                   = 'CHAT_DEBUG';
RingLogger.tags.CHAT_TIMER_DEBUG                             = 'CHAT_TIMER_DEBUG';
RingLogger.tags.CHAT_RECEIVED                             	 = 'CHAT_RECEIVED';


/****************************************  ENABLE DATA POINTS ************************************************/

//CHAT DATA POINTS
ALL_CHAT = true;
RingLogger.conditions[RingLogger.tags.CHAT]                  = ALL_CHAT && true;
RingLogger.conditions[RingLogger.tags.CHAT_0]                = ALL_CHAT && false;
RingLogger.conditions[RingLogger.tags.TAG_CHAT]              = ALL_CHAT && true;    
RingLogger.conditions[RingLogger.tags.CHAT_EXCEPTIONS]       = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.TAG_CHAT_REQUEST]      = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.TAG_CHAT_RESPONSE]     = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.CHAT_REQUEST]          = ALL_CHAT && true;    
RingLogger.conditions[RingLogger.tags.CHAT_RESPONSE]         = ALL_CHAT && true;    
RingLogger.conditions[RingLogger.tags.CHAT_RESPONSE_CACHE]   = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.CHAT_REQUEST_CACHE]    = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.CHAT_BROKEN_CACHE]     = ALL_CHAT && false;     
RingLogger.conditions[RingLogger.tags.CHAT_STATE_MACHINE]    = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.CHAT_SEND_MESSAGE]     = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.CHAT_PACKET_RECEIVED]  = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.CHAT_DEBUG]            = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.TAB_DATA_RECEIVED]     = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.CHAT_HISTORY_DEBUG]    = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.SHARED_WORKER]         = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.CHAT_TIMER_DEBUG]      = ALL_CHAT && false;    
RingLogger.conditions[RingLogger.tags.registered]            = ALL_CHAT && false; 
RingLogger.conditions[RingLogger.tags.CHAT_RECEIVED]         = ALL_CHAT && false; 

//AUTH PACKET DATA POINTS 

ALL_AUTH = false;
RingLogger.conditions[RingLogger.tags.RECEIVED]             = ALL_AUTH && true;
RingLogger.conditions[RingLogger.tags.SEND]                 = ALL_AUTH && true;
RingLogger.conditions[RingLogger.tags.BROKEN_PACKET]        = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.KEEPALIVE]            = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.AUTH]                 = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.SOCKETTEST]           = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.PARSER]               = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.MERGER]               = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.SENDER]               = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.PACKET_DATA]          = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.ROUTE_CHANGE]         = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.CONNECTION]           = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.CONNECTION_OPEN]      = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.CONNECTION_CLOSE]      = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.ACKNOWLDGE]           = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.ACKNWOLEDGED]         = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.WORKER_SETTTING]      = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.PONG]                 = ALL_AUTH && false;
RingLogger.conditions[RingLogger.tags.PING]                 = ALL_AUTH && false;

OTHERS = false;
RingLogger.conditions[RingLogger.tags.MEDIA]                 = OTHERS && false;
RingLogger.conditions[RingLogger.tags.UPLOAD]                = OTHERS && false;
RingLogger.conditions[RingLogger.tags.CIRCLE]                = OTHERS && false;
RingLogger.conditions[RingLogger.tags.FRIEND]                = OTHERS && false;
RingLogger.conditions[RingLogger.tags.PROFILE]               = OTHERS && false;
RingLogger.conditions[RingLogger.tags.STICKER]               = OTHERS && false;
RingLogger.conditions[RingLogger.tags.SEARCH]                = OTHERS && false;
RingLogger.conditions[RingLogger.tags.IMAGE]                 = OTHERS && false;
RingLogger.conditions[RingLogger.tags.INVITE]                = OTHERS && false;
RingLogger.conditions[RingLogger.tags.NOTIFICATION]          = OTHERS && false;
RingLogger.conditions[RingLogger.tags.DEFAULT]               = OTHERS && false;
RingLogger.conditions[RingLogger.tags.WATFALL]               = OTHERS && false;
RingLogger.conditions[RingLogger.tags.rgReport]              = OTHERS && false;
RingLogger.conditions[RingLogger.tags.PAGETITLE]             = OTHERS && false;


VIEW = false;
RingLogger.conditions[RingLogger.tags.DROPDOWN]              = VIEW && false;
RingLogger.conditions[RingLogger.tags.RGREPEAT]              = VIEW && false;
RingLogger.conditions[RingLogger.tags.STSTAG]                = VIEW && false;
RingLogger.conditions[RingLogger.tags.DIGEST]                = VIEW && false;
RingLogger.conditions[RingLogger.tags.scopetest]             = VIEW && false;
RingLogger.conditions[RingLogger.tags.rgLike]                = VIEW && false;
RingLogger.conditions[RingLogger.tags.Ringbox]               = VIEW && false;
RingLogger.conditions[RingLogger.tags.IMAGEMAP]              = VIEW && false;
RingLogger.conditions[RingLogger.tags.RG_RECRODER]           = VIEW && false;
RingLogger.conditions[RingLogger.tags.DEBUG]                 = VIEW && false;
RingLogger.conditions[RingLogger.tags.REQUEST_STACK]         = VIEW && false;
RingLogger.classNameChanged();

//digest code sample
