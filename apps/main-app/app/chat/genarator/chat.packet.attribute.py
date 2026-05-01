from utils import *
from constants import *
from templates import *
import string
import os, sys


a_conditional_attribute_info_template = string.Template(A_CONDITIONAL_ATTIBUTE_INFO_TEMPLATE)

a_attribute_info_template = string.Template(A_ATTIBUTE_INFO_TEMPLATE)
attribute_info_template = string.Template(ATTIBUTE_INFO_TEMPLATE)

attribute_info_with_broken_container_template = string.Template(A_ATTIBUTE_INFO_WITH_BROKEN_CONTAINER_TEMPLATE)


ATTIBUTE_INFO_LIST = ""
for (attr_no, attr_info) in PACKET_ATTRIBUTE_INFO.iteritems():

	attr_name = PACKET_ATTRIBUTE_NAME_MAP[attr_no];

	template = a_attribute_info_template
	if 'VAR_CONTAINER_NAME' in attr_info:
		template = attribute_info_with_broken_container_template	
	
	elif 'CONDITIONAL' in attr_info:
		template = a_conditional_attribute_info_template


	if 'VAR_NAME' in attr_info:
		variable_name = attr_info['VAR_NAME']
	else:
		variable_name = getCamleCase(attr_name)

	variable_container_name = ""
	if 'VAR_CONTAINER_NAME' in attr_info:
		variable_container_name = attr_info['VAR_CONTAINER_NAME']

	variable_type = CONSTANTS['ATTRIBUTE_TYPE_VALUE'][attr_info["VAR_TYPE"]]
	variable_size = attr_info["SIZE"]

	ATTIBUTE_INFO_LIST += template.substitute({
		"ATTRIBUTE_NO"   : attr_no,
		"ATTRIBUTE_NAME" : attr_name,
		"VARIABLE_NAME"  : variable_name,
		"VARIABLE_TYPE"  : variable_type,
		"VARIABLE_SIZE"  : variable_size,
		"VAR_CONTAINER_NAME" : variable_container_name,		
	})

output = attribute_info_template.substitute({

	"ATTIBUTE_INFO_LIST" : ATTIBUTE_INFO_LIST	
})


DIRPATH = os.getcwd()

FILE_BASE = DIRPATH + '/app/chat/'

if 'webapp' not in FILE_BASE:
	print 'Please Run the file from webapp dir.'
	sys.exit(0)


OUTPUT_FILE_PATH = FILE_BASE + '/generated/chat.attribute.infos.js'


with open(OUTPUT_FILE_PATH, 'w') as a_file:
	a_file.write(output);	