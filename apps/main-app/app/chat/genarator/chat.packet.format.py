from utils import *
from constants import *
from templates import *
import string
import os, sys


packet_formats_template = string.Template(PACKET_FORMATS_TEMPLATE)
a_packet_format_template = string.Template(A_PACKET_FORMAT_TEMPLATE)
a_broken_packet_format_template = string.Template(A_BROKEN_PACKET_FORMAT_TEMPLATE)
a_packet_attribute_template = string.Template(A_PACKET_ATTRIBUTE_TEMPLATE)



def get_packet_format(packet_info):
	packet_format = []	
	for an_attribute_value in packet_info["FORMAT"] :
		if type(an_attribute_value) is int:

			an_attribute_name = a_packet_attribute_template.substitute({
				'ATTRIBUTE_NAME' : PACKET_ATTRIBUTE_NAME_MAP[an_attribute_value]

			}) 
			packet_format.append(an_attribute_name)

		else:
			nested_format = get_packet_format({ "FORMAT" : an_attribute_value })
			packet_format.append( nested_format )
			pass

	return packet_format


PACKET_FORMATS = ""
for (packet_type, packet_info) in PACKET_INFO.iteritems():

	packet_name = PACKET_TYPE_NAME_MAP[packet_type];

	packet_format = get_packet_format( packet_info )

	packet_type_base = get_packet_type_base( packet_type );

	packet_format_string = ""
	n = len(packet_format)
	for index in xrange(n):
		an_item = packet_format[index]
		coma = ","
		if index == n-1:
			coma = ""

		if type(an_item) is str:
	 		packet_format_string += "      " + an_item + coma + ' \n'
	 	else:
	 		packet_format_string += "                [\n" + "        " + an_item[0] + ',\n        ' + ',\n        '.join(an_item[1:]) + "\n                ]"+ coma + "\n"

	template = a_packet_format_template

	brokenContainer = ""
	confirmation = "false"
	broken = "false"

	if 'BROKEN_CONTAINER' in packet_info:
		brokenContainer = packet_info["BROKEN_CONTAINER"]
		template = a_broken_packet_format_template

	if 'BROKEN' in packet_info:
		broken = "true" if packet_info["BROKEN"] else "false"

	if 'CONFIRMATION' in packet_info:
		confirmation = "true" if packet_info['CONFIRMATION'] else "false"

	
	PACKET_FORMATS += template.substitute({
		"PACKET_TYPE"      : packet_type,
		"PACKET_NAME"      : packet_name,
		"PACKET_TYPE_BASE" : packet_type_base,
		"BROKEN_CONTAINER" : brokenContainer,
		"CONFIRMATION"     : confirmation,
		"BROKEN"           : broken,
		"FORMAT"           : packet_format_string
	})

output = packet_formats_template.substitute({

	"PACKET_FORMAT_TEMPLATE" : PACKET_FORMATS	
})


DIRPATH = os.getcwd()

FILE_BASE = DIRPATH + '/app/chat/'

if 'webapp' not in FILE_BASE:
	print 'Please Run the file from webapp dir.'
	sys.exit(0)


OUTPUT_FILE_PATH = FILE_BASE + '/generated/chat.packet.format.js'


with open(OUTPUT_FILE_PATH, 'w') as a_file:
	a_file.write(output);	