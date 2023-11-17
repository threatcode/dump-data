from utils import *
from constants import *
from templates import *
import string
import os, sys


method_comment_template = string.Template(METHOD_COMMENT_TEMPLATE)
a_response_method_map = string.Template(A_RESPONSE_METHOD_MAP)
a_response_method = string.Template(A_RESPONSE_METHOD)
a_response_method_param_assignment_template = string.Template(A_RESPONSE_METHOD_PARAM_ASSIGNMENT_TEMPALTE)


angular_response_template = string.Template(RESPONSE_FILE_ANGULAR_WRAPPER_TEMPLATE)
response_body_template = string.Template(RESPONSE_BODY_TEMPLATE)
worker_response_template = string.Template(RESPONSE_FILE_WORKER_TEMPALTE)


METHOD_LIST = ""
METHOD_MAP_LIST = ""
for (packet_type, packet_name) in PACKET_TYPE_NAME_MAP.iteritems():
	methodName = getCamleCase("on_" + packet_name)
	methodParams = getResponseMethodParams(packet_type)	

	mthodParamsAssignments = []
	
	max_param_size = 0
	for param in methodParams:
		max_param_size = max(max_param_size, len(param))		

	for param in methodParams:
		mthodParamsAssignments.append( a_response_method_param_assignment_template.substitute({
			'PARAM_VAR_NAME' : param,
			'PARAM_VAR_VALUE' : param,
			'SPACES' : ' ' * ( max_param_size - len(param) )
		}) )


	method_comment = method_comment_template.substitute({
		"PACKET_TYPE" : packet_type, 
		"PACKET_NAME" : packet_name
	});

	METHOD_MAP_LIST += a_response_method_map.substitute({
		'METHOD_COMMENT_TEMPLATE' : method_comment,
		"METHOD_NAME" : methodName , 
		"PACKET_NAME" : packet_name
	})
	

	METHOD_LIST += a_response_method.substitute({ 
		'METHOD_COMMENT_TEMPLATE' : method_comment,
		"METHOD_NAME" : methodName , 		
		"METHOD_PARAMS_ASSIGNMENTS" : ",\n          ".join(mthodParamsAssignments)		
	})



response_body = response_body_template.substitute({

	"RESPONSE_PROCESSOR_TEMPLATE" : RESPONSE_PROCESSOR_TEMPLATE,
	"RESPONSE_METHOD_MAP_LIST" : METHOD_MAP_LIST,
	"RESPONSE_METHOD_LIST" : METHOD_LIST,	

})

# angular_output = angular_response_template.substitute({
# 	"RESPONSE_ANGULAR_DEPENDENCY_TEMPLATE" : RESPONSE_ANGULAR_DEPENDENCY_TEMPLATE,	
# 	"RESPONSE_BODY_TEMPLATE" : response_body

# })

output = worker_response_template.substitute({
	"RESPONSE_WORKER_DEPENDENCY_TEMPLATE" : RESPONSE_WORKER_DEPENDENCY_TEMPLATE,	
	"RESPONSE_BODY_TEMPLATE" : response_body,	
})


DIRPATH = os.getcwd()

FILE_BASE = DIRPATH + '/app/chat/'

if 'webapp' not in FILE_BASE:
	print 'Please Run the file from webapp dir.'
	sys.exit(0)


# ANGULAR_WRAPPER_OUTPUT_FILE_PATH = FILE_BASE + '/generated/chat.responses.js'
OUTPUT_FILE_PATH = FILE_BASE + '/generated/chat.responses.js'


# with open(ANGULAR_WRAPPER_OUTPUT_FILE_PATH, 'w') as a_file:
# 	a_file.write(angular_output);

with open(OUTPUT_FILE_PATH, 'w') as a_file:
	a_file.write(output);	