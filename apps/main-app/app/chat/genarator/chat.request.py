from utils import *
from constants import *
from templates import *
import string
import os, sys


method_template = string.Template(METHOD_NAME_TEMPLATE)
method_comment_template = string.Template(METHOD_COMMENT_TEMPLATE)
request_angular_template = string.Template(REQUEST_FILE_ANGULAR_TEMPALTE)
request_worker_template = string.Template(REQUEST_FILE_WORKER_TEMPALTE)
a_response_public_method_template = string.Template(A_RESPONSE_PUBLIC_METHOD_TEMPALTE)


BODY = ""
PUBLIC_METHODS = ""
for (packet_type, packet_name) in PACKET_TYPE_NAME_MAP.iteritems():
	methodName = getCamleCase("get_" + packet_name + "_object")
	methodParams = getMethodParams(packet_type)
	requestParams = getRequestParams(packet_type)

	broken = "true" if PACKET_INFO[packet_type]['BROKEN'] else "false"
	confirmation = "true" if PACKET_INFO[packet_type]['CONFIRMATION'] else "false"

	BODY += method_comment_template.substitute({
		"PACKET_TYPE" : packet_type, 
		"PACKET_NAME" : packet_name
	})

	BODY += method_template.substitute({ 
		"METHOD_NAME" : methodName , 
		"PACKET_NAME" : packet_name,
		"METHOD_PARAMS" : ", ".join(methodParams),
		"REQUEST_PARAMS" : ",\n".join(requestParams),
		"BROKEN" : broken,
		"CONFIRMATION" : confirmation
	})

	PUBLIC_METHODS += a_response_public_method_template.substitute({
		"METHOD_NAME" : methodName
	})


angular_output = request_angular_template.substitute({

	"REQUEST_ANGULAR_DEPENDENCY_TEMPLATE" : REQUEST_ANGULAR_DEPENDENCY_TEMPLATE,	
	"BODY" : BODY,
	"PUBLIC_METHODS" : PUBLIC_METHODS
})

output = request_worker_template.substitute({

	"REQUEST_WORKER_DEPENDENCY_TEMPLATE" : REQUEST_WORKER_DEPENDENCY_TEMPLATE,	
	"BODY" : BODY,
	"PUBLIC_METHODS" : PUBLIC_METHODS

})


DIRPATH = os.getcwd()

FILE_BASE = DIRPATH + '/app/chat/'

if 'webapp' not in FILE_BASE:
	print 'Please Run the file from webapp dir.'
	sys.exit(0)


# ANGULAR_WRAPPER_OUTPUT_FILE_PATH = FILE_BASE + '/generated/chat.requests.js'
OUTPUT_FILE_PATH = FILE_BASE + '/generated/chat.requests.js'


# with open(ANGULAR_WRAPPER_OUTPUT_FILE_PATH, 'w') as a_file:
# 	a_file.write(angular_output);

with open(OUTPUT_FILE_PATH, 'w') as a_file:
	a_file.write(output);	