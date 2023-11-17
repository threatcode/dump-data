### CHAT REQUEST

REQUEST_ANGULAR_DEPENDENCY_TEMPLATE = \
"""
    var PACKET_TYPES = global.CHAT_APP.Constants.PACKET_TYPES;
    var getUUIDPacketId = ChatFactory.getUUIDPacketId;
    var platform = PLATFORM.WEB;
    var appVersion = settings.apiVersion;
"""

REQUEST_WORKER_DEPENDENCY_TEMPLATE = \
"""
    var PACKET_TYPES     = global.CHAT_APP.Constants.PACKET_TYPES;
    var platform         = global.CHAT_APP.Constants.PLATFORM.WEB;
    var getAppVersion    = global.CHAT_APP.getAppVersion;

    var getCurrentUserId = global.CHAT_APP.getCurrentUserId;
    var getUUIDPacketId  = global.CHAT_APP.UTILS.getUUIDPacketId;
"""

# PACKET_ID_TEMPLATE = "          packetId              : packetId || getUUIDPacketId(),"

A_REQUEST_PARAM_TEMPLATE = "          $PARAM_NAME : $PARAM_VALUE"

METHOD_COMMENT_TEMPLATE = "    //PACKET TYPE($PACKET_TYPE) : $PACKET_NAME"
METHOD_NAME_TEMPLATE = \
"""
    this.${METHOD_NAME} = function($METHOD_PARAMS){
 
      var requestObject = {

          /* GENERAL PARAMS */
          packetType              : PACKET_TYPES.${PACKET_NAME},

          /* SPECIFIC PARAMS */
$REQUEST_PARAMS,			

      }

      return requestObject;

    }

"""

# /* APPLICATION_PARAMS, NOT REQUIRED FOR API */
#           ignoreConfirmation    : $CONFIRMATION,
#           isBroken              : $BROKEN 

#           userId                : currentUserId,

#       var currentUserId = Auth.currentUser.getKey();

#           /* GENERIC PARAMS, NOT REQUIRED FOR ALL API'S */
#           platform              : platform,
#           appVersion            : appVersion,

A_RESPONSE_PUBLIC_METHOD_TEMPALTE = \
"""
    $METHOD_NAME : $METHOD_NAME, 
"""

REQUEST_FILE_ANGULAR_TEMPALTE = \
"""
(function(){
  'use strict';

	angular.module('ringid.chat').service('ChatRequests', ChatRequests);

    ChatRequests.$$inject = [
    	'CHAT_CONSTATNS', 'PLATFORM', 'settings'
    	'ChatFactory'
    ];

    function ChatRequests (
    	CHAT_CONSTATNS, PLATFORM, settings,  
    	ChatFactory	
	) {

$REQUEST_ANGULAR_DEPENDENCY_TEMPLATE
$BODY
	}

})();
"""

REQUEST_FILE_WORKER_TEMPALTE = \
"""(function(global){
  'use strict';
  //For Main App global == window
  //For Worker global == self

  function ChatRequests(){
        $REQUEST_WORKER_DEPENDENCY_TEMPLATE
        $BODY
  }

  global.CHAT_APP['ChatRequests'] = new ChatRequests();

})(window);
"""


### CHAT RSPONSE 

RESPONSE_ANGULAR_DEPENDENCY_TEMPLATE = \
"""
    var PACKET_TYPES = global.CHAT_APP.Constants.PACKET_TYPES;
    var getUUIDPacketId = ChatFactory.getUUIDPacketId;
    var platform = PLATFORM.WEB;
    var appVersion = settings.apiVersion;
"""

RESPONSE_WORKER_DEPENDENCY_TEMPLATE = \
"""
    var PACKET_TYPES = global.CHAT_APP.Constants.PACKET_TYPES;"""

RESPONSE_PROCESSOR_TEMPLATE  = \
"""
    function getPacketProcessorInfo(packetType){
        return responseMethodMap[packetType];
    }

    function processUpdates(responseObject) {

        var packetType = responseObject.packetType;

        var packetProcessorInfo = getPacketProcessorInfo(packetType);

        if( !packetProcessorInfo ){
            RingLogger.warning('Packet Processor Not Implemented. Packet Type ', packetType, RingLogger.tags.CHAT);
            return false;
        }

        try{
           packetProcessorInfo.processor.call(this, responseObject);
        }catch(e){
           RingLogger.alert('Exception In PACKET Procsessing.', packetType, e , RingLogger.tags.CHAT);
        }

        return true;

    }
"""

A_RESPONSE_METHOD_MAP = \
"""
$METHOD_COMMENT_TEMPLATE
    responseMethodMap[PACKET_TYPES.${PACKET_NAME}] = {
        processor : $METHOD_NAME
    };
"""

A_RESPONSE_METHOD_PARAM_ASSIGNMENT_TEMPALTE = \
"""$PARAM_VAR_NAME $SPACES= responseObject.$PARAM_VAR_VALUE"""

A_RESPONSE_METHOD = \
"""
$METHOD_COMMENT_TEMPLATE
    function ${METHOD_NAME}(responseObject){      
      var $METHOD_PARAMS_ASSIGNMENTS;
      
      /* method body */

    }
"""

RESPONSE_FILE_ANGULAR_WRAPPER_TEMPLATE = \
"""
(function(){
  'use strict';
  //For Main App global == window
  //For Worker global == self

    angular.module('ringid.chat').factory('ChatResponses', ChatResponses);

    ChatResponses.$$inject = [
        'CHAT_CONSTATNS', 'PLATFORM', 'settings',
        'ChatFactory'
    ];

    function ChatResponses (
        CHAT_CONSTATNS, PLATFORM, settings,  
        ChatFactory 
    ) {
        $RESPONSE_ANGULAR_DEPENDENCY_TEMPLATE
        $RESPONSE_BODY_TEMPLATE
        return {
            processUpdates : processUpdates,
        }

})(window);
"""

RESPONSE_BODY_TEMPLATE = \
"""
    
    var responseMethodMap = {};    
    $RESPONSE_PROCESSOR_TEMPLATE
    $RESPONSE_METHOD_LIST
    $RESPONSE_METHOD_MAP_LIST

"""


RESPONSE_FILE_WORKER_TEMPALTE = \
""";(function(global){
    'use strict';
    //For Main App global == window
    //For Worker global == self

    $RESPONSE_WORKER_DEPENDENCY_TEMPLATE
    $RESPONSE_BODY_TEMPLATE

    global.CHAT_APP['ChatResponses'] = {
        processUpdates : processUpdates
    };

})(window);
"""

A_PACKET_ATTRIBUTE_TEMPLATE = \
"""          CHAT_PACKET_ATTRIBUTE.$ATTRIBUTE_NAME"""


A_PACKET_FORMAT_TEMPLATE = \
"""
      //PACKET TYPE($PACKET_TYPE) : $PACKET_NAME
      CHAT_PACKET_INFO[ $PACKET_TYPE_BASE.$PACKET_NAME ] =
      {
            PACKET_NAME         : "$PACKET_NAME",
            CONFIRMATION        : $CONFIRMATION,
            BROKEN              : $BROKEN,
            FORMAT:[
$FORMAT
            ]
      };
"""

A_BROKEN_PACKET_FORMAT_TEMPLATE = \
"""
      //PACKET TYPE($PACKET_TYPE) : $PACKET_NAME
      CHAT_PACKET_INFO[ $PACKET_TYPE_BASE.$PACKET_NAME ] =
      {
            PACKET_NAME         : "$PACKET_NAME",
            BROKEN_CONTAINER    : "$BROKEN_CONTAINER",
            CONFIRMATION        : $CONFIRMATION,
            BROKEN              : $BROKEN,
            FORMAT:[
$FORMAT
            ]
      };
"""


PACKET_FORMATS_TEMPLATE = \
"""
      var CHAT_PACKET_INFO = {};
$PACKET_FORMAT_TEMPLATE
"""


A_ATTIBUTE_INFO_TEMPLATE = \
"""
      //ATTRIBUTE NO($ATTRIBUTE_NO) : $ATTRIBUTE_NAME
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.$ATTRIBUTE_NAME]                    = {    
            ATTRIBUTE_NAME     : "$ATTRIBUTE_NAME",            
            VAR_NAME           : "$VARIABLE_NAME",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.$VARIABLE_TYPE,
            SIZE               : $VARIABLE_SIZE    
      };
"""

A_ATTIBUTE_INFO_WITH_BROKEN_CONTAINER_TEMPLATE = \
"""
      //ATTRIBUTE NO($ATTRIBUTE_NO) : $ATTRIBUTE_NAME
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.$ATTRIBUTE_NAME]                    = {    
            ATTRIBUTE_NAME     : "$ATTRIBUTE_NAME",            
            VAR_NAME           : "$VARIABLE_NAME",
            VAR_CONTAINER_NAME : "$VAR_CONTAINER_NAME",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.$VARIABLE_TYPE,
            SIZE               : $VARIABLE_SIZE    
      };
"""

A_CONDITIONAL_ATTIBUTE_INFO_TEMPLATE = \
"""
      //ATTRIBUTE NO($ATTRIBUTE_NO) : $ATTRIBUTE_NAME
      CHAT_PACKET_ATTRIBUTE_INFO[CHAT_PACKET_ATTRIBUTE.$ATTRIBUTE_NAME]                    = {    
            ATTRIBUTE_NAME     : "$ATTRIBUTE_NAME",
            VAR_NAME           : "$VARIABLE_NAME",
            VAR_TYPE           : PACKET_CONSTANTS.ATTRIBUTE_TYPE.$VARIABLE_TYPE,
            SIZE               : $VARIABLE_SIZE,
            CONDITIONAL        : true,    
      };
"""

ATTIBUTE_INFO_TEMPLATE = \
"""
        var CHAT_PACKET_ATTRIBUTE_INFO = {};
$ATTIBUTE_INFO_LIST
"""
