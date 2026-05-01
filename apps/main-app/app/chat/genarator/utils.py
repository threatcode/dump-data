from constants import *
from templates import *
import string



def _getParamList(packet_type, exclude_list=[]):
	params = []
	packetInfo = PACKET_INFO[packet_type]
	last = 0	
	isPacketId = False	

	for attr in packetInfo["FORMAT"]:	

		try:
			varName = PACKET_ATTRIBUTE_INFO[attr]["VAR_NAME"]
		except:
			varName = PACKET_ATTRIBUTE_INFO[last]["VAR_CONTAINER_NAME"]

		if attr == PACKET_ATTRIBUTE.PACKET_ID:			
			isPacketId = True

		if (attr != PACKET_ATTRIBUTE.PACKET_ID) and attr not in exclude_list and ("Length" not in varName):			
			params.append(varName)
					
		last = attr

	if isPacketId:
		params.append(PACKET_ATTRIBUTE_INFO[PACKET_ATTRIBUTE.PACKET_ID]["VAR_NAME"])

	return params	

def getMethodParams(packet_type):
	params = _getParamList(packet_type, METHOD_IGNORE_ATTRIBUTE)	
	return params

def getResponseMethodParams(packet_type):
	params = _getParamList(packet_type, [ PACKET_ATTRIBUTE.PACKET_TYPE, PACKET_ATTRIBUTE.APP_VERSION, PACKET_ATTRIBUTE.PLATFORM] )	
	return params

def getRequestParams(packet_type):
	
	a_request_param_template = string.Template(A_REQUEST_PARAM_TEMPLATE)

	params = _getParamList(packet_type)	

	bothFriendIdTagId = 0;
	tagId = 0;

	requestParams = []	
	for a_param in params:
		if a_param == PACKET_ATTRIBUTE_INFO[PACKET_ATTRIBUTE.PACKET_TYPE]["VAR_NAME"]:
			continue
		elif a_param == PACKET_ATTRIBUTE_INFO[PACKET_ATTRIBUTE.PACKET_ID]["VAR_NAME"]:
			paramValue = a_param + " || getUUIDPacketId()"
		elif a_param == PACKET_ATTRIBUTE_INFO[PACKET_ATTRIBUTE.APP_VERSION]["VAR_NAME"]:
			paramValue = "getAppVersion()"
		elif a_param == PACKET_ATTRIBUTE_INFO[PACKET_ATTRIBUTE.USER_ID]["VAR_NAME"]:
			paramValue = "getCurrentUserId()"		
		elif a_param == PACKET_ATTRIBUTE_INFO[PACKET_ATTRIBUTE.FRIEND_ID]["VAR_NAME"]:
			bothFriendIdTagId += 1			
			paramValue = a_param
		elif a_param == PACKET_ATTRIBUTE_INFO[PACKET_ATTRIBUTE.TAG_ID]["VAR_NAME"] :
			bothFriendIdTagId += 1
			tagId = a_param
			paramValue = a_param
		else:
			paramValue = a_param

		requestParams.append(a_request_param_template.substitute({ "PARAM_NAME" : a_param.ljust(23, ' '), "PARAM_VALUE" : paramValue }))	

	if bothFriendIdTagId == 2:
		requestParams.append(a_request_param_template.substitute({ "PARAM_NAME" : 'boxId'.ljust(23, ' '), "PARAM_VALUE" : tagId }))	

	return requestParams


def get_packet_type_base(packetType):

	if packetType in FRIEND_CHAT_PACKET_TYPE_LIST.values():
		return 'FRIEND_CHAT_PACKET_TYPE'
	elif packetType in TAG_CHAT_PACKET_TYPE_LIST.values():
		return 'TAG_CHAT_PACKET_TYPE'
	elif packetType in OFFLINE_PACKET_TYPE_LIST.values():
			return 'OFFLINE_PACKET_TYPE'
