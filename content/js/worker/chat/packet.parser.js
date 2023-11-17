(function packetParseIIFE(self) {
    var Constants = CHAT_APP.Constants,
        PacketFormats = CHAT_APP.PacketFormats,
        CHAT_PACKET_ATTRIBUTE_INFO = PacketFormats.CHAT_PACKET_ATTRIBUTE_INFO,
        TAG_CHAT_PACKET_TYPE = Constants.TAG_CHAT_PACKET_TYPE,
        OFFLINE_PACKET_TYPE = Constants.OFFLINE_PACKET_TYPE,
        PACKET_TYPES = Constants.PACKET_TYPES,
        FRIEND_CHAT_PACKET_TYPE = Constants.FRIEND_CHAT_PACKET_TYPE,
        PUBLIC_CHAT_OFFSET = Constants.PUBLIC_CHAT_OFFSET,
        GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS,
        PACKET_CONSTANTS = Constants.PACKET_CONSTANTS,

        CHAT_PACKET_INFO = PacketFormats.CHAT_PACKET_INFO;

    function ChatPacketParser() {
        // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function isTagPacket(packetType) {
            return !!CHAT_PACKET_INFO[packetType];
        }

        function isPublicChatPacket(packetType) {
            return packetType > PUBLIC_CHAT_OFFSET;
        }

        function getPacketFormat(packetType) {
            return CHAT_PACKET_INFO[packetType].FORMAT;
        }

        function getPacketName(packetType) {
            return CHAT_PACKET_INFO[packetType].PACKET_NAME;
        }

        function getAttributeSize(attributeNo) {
            return CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].SIZE;
        }

        function getRawAttributeSize(packetLength, offset) {
            return packetLength - offset;
        }

        function getRawAttributeSizeFromObject(object, attributeNo) {
            var rawAttributeName = getAttributeName(attributeNo);
            return object[rawAttributeName].byteLength;
        }

        function getAttributeName(attributeNo) {
            return CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].VAR_NAME;
        }

        function getAttributeType(attributeNo) {
            return CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].VAR_TYPE;
        }

        function isConditionalAttribute(attributeNo) {
            return CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].CONDITIONAL;
        }

        function getSubObjectContainerName(attributeNo) {
            try {
                return CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].VAR_CONTAINER_NAME;
            } catch (e) {
                Logger.debug('warning', 'invalid `attribute no` for `container name` or `container name` not defined for `attribute no` : ', attributeNo);
                return -1;
            }
        }

        function getAttributeValue(object, attributeNo) {
            var variableName,
                attributeValue,
                variableNameWithoutLength;

            try {
                variableName = CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].VAR_NAME;

                if (~variableName.indexOf('Length')) {
                    variableNameWithoutLength = variableName.replace('Length', '');
                    attributeValue = object[variableName] || object[variableNameWithoutLength].length;
                } else {
                    attributeValue = object[variableName];
                }
            } catch (e) {
                Logger.debug('warning', 'object attribute no not defined : ', attributeNo);
                attributeValue = '';
            }
            return attributeValue;
        }

        function getDynamicAttributeSize(object, attributeName) {
            try {
                return object[attributeName + 'Length'];
            } catch (e) {
                Logger.debug('warning', 'object[attribute_name + Length] not set', attributeName);
                return -1;
            }
        }

        function isDynamicAttribute(attributeNo) {
            return (getAttributeSize(attributeNo) === PACKET_CONSTANTS.PACKET_DYNAMIC_ATTRIBUTE);
        }

        function isRawByteAttribute(attributeNo) {
            return (getAttributeSize(attributeNo) === PACKET_CONSTANTS.PACKET_RAW_BYTE_ATTRIBUTE);
        }

        function getIpPortSize() {
            return PACKET_CONSTANTS.PACKET_IP_SIZE + PACKET_CONSTANTS.PACKET_PORT_SIZE;
        }

        //         function patchObjectForUtf8Encoding(object) {
        //             if (!!object.message) {
        //                 object.message = object.message.utf8Encode();
        //             }
        //
        //             if (!!object.fullName) {
        //                 object.fullName = object.fullName.utf8Encode().substring(0, 124) + '...';
        //             }
        //
        //             return object;
        //         }

        function getDateViewPacket(packetSize) {
            return new DataView(new ArrayBuffer(packetSize));
        }

        function getDataViewByPacket(packet) {
            return new DataView(packet);
        }

        function getPacketSize(object, packetType, _packetFormat) {
            var packetSize = 0,
                packetFormatIndex,
                anAttributeNoOrSubFormat,
                noOfSubFormatPacket,
                attributeNo,
                attributeValue,
                subFormatPacketIndex,
                subFormatSize,
                packetFormatLength = _packetFormat.length,
                previousAttributeNo,
                subObjects,
                subObjectContainerName,
                packetFormat = _packetFormat,
                lastAttributeValue = -1;

            for (packetFormatIndex = 0; packetFormatIndex < packetFormatLength; packetFormatIndex++) {
                anAttributeNoOrSubFormat = packetFormat[packetFormatIndex];

                if (!Array.isArray(anAttributeNoOrSubFormat)) {
                    attributeValue = getAttributeValue(object, anAttributeNoOrSubFormat);

                    if (isDynamicAttribute(anAttributeNoOrSubFormat)) {
                        packetSize += attributeValue.length;
                    } else if (isRawByteAttribute(anAttributeNoOrSubFormat)) {
                        attributeNo = anAttributeNoOrSubFormat;
                        packetSize += getRawAttributeSizeFromObject(object, attributeNo);
                    } else {
                        // Not Dynamic Length
                        attributeNo = anAttributeNoOrSubFormat;
                        packetSize += getAttributeSize(attributeNo);

                        if (isConditionalAttribute(attributeNo)) {
                            packetFormat = _updatePacketFormat(packetType, packetFormat, packetFormatIndex, attributeValue);
                            packetFormatLength = packetFormat.length;
                        }
                    }

                    lastAttributeValue = attributeValue;
                } else {
                    // SubFormat Length is placed Just Before the Format. So Get the last attribute size
                    noOfSubFormatPacket = lastAttributeValue;

                    if (noOfSubFormatPacket > 0) {
                        previousAttributeNo = packetFormat[packetFormatIndex - 1];
                        subObjectContainerName = getSubObjectContainerName(previousAttributeNo);
                        subObjects = object[subObjectContainerName];

                        for (subFormatPacketIndex = 0; subFormatPacketIndex < noOfSubFormatPacket; subFormatPacketIndex++) {
                            subFormatSize = getPacketSize(subObjects[subFormatPacketIndex], packetType, anAttributeNoOrSubFormat);
                            packetSize += subFormatSize;
                        }
                    }
                }
            }

            return packetSize;
        }


        function setDataViewOffset(dataview, _offset, size, _value, valueType) {
            var value = _value,
                offset = _offset,
                valueIndex;

            if (valueType === PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER) {
                value = parseInt(value, 10);

                if (size === PACKET_CONSTANTS.ONE_BYTE_SIZE) {
                    dataview.setUint8(offset, value);
                } else if (size === PACKET_CONSTANTS.TWO_BYTE_SIZE) {
                    dataview.setUint16(offset, value);
                } else if (size === PACKET_CONSTANTS.FOUR_BYTE_SIZE) {
                    dataview.setUint32(offset, value);
                } else if (size === PACKET_CONSTANTS.EIGHT_BYTE_SIZE) {
                    dataview.setUint64(offset, value);
                }
            } else if (valueType === PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING) {
                for (valueIndex = 0; valueIndex < value.length; valueIndex++) {
                    dataview.setUint8(offset, value.charCodeAt(valueIndex));

                    offset += 1;
                }
            } else if (valueType === PACKET_CONSTANTS.ATTRIBUTE_TYPE.BYTE) {
                for (valueIndex = 0; valueIndex < size; valueIndex++) {
                    dataview.setUint8(offset + valueIndex, value.getUint8(valueIndex));
                }
            }
        }

        function getValueFromDataView(dataview, offset, size, valueType) {
            var value = '';

            if (valueType === PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER) {
                value = dataview.getIntByByte(offset, size);
            } else if (valueType === PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING) {
                if (size > 0) {
                    value = dataview.getString(offset, size);
                }
            } else if (valueType === PACKET_CONSTANTS.ATTRIBUTE_TYPE.BYTE) {
                if (size > 0) {
                    value = dataview.copy(offset, size);
                }
            }
            return value;
        }

        function getIpParts(ip) {
            var ipArray = [];
            try {
                ipArray = ip.split('.');
            } catch (e) {
                Logger.debug('warning', 'Invalid ip provided in object', ip);
            }

            return ipArray;
        }

        function getIpPortFromPacket(packet) {
            var ip,
                port,
                index,
                ipPart = [];

            for (index = 0; index < 4; index++) {
                ipPart.push(getValueFromDataView(packet, index, 1, PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER));
            }

            ip = ipPart.join('.');
            port = getValueFromDataView(packet, 4, 2, PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER);

            return {
                ip: ip,
                port: port,
            };
        }

        function getPacketType(packet) {
            return getValueFromDataView(packet, 0, 1, PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER);
        }

        function getUserId(packet) {
            return getValueFromDataView(packet, 1, 8, PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER);
        }

        function setDataViewWithIpPort(dataview, _offset, ip, port) {
            var ipArray = getIpParts(ip),
                offset = _offset,
                ipArrayIndex;

            for (ipArrayIndex = 0; ipArrayIndex < ipArray.length; ipArrayIndex++) {
                setDataViewOffset(dataview, offset, PACKET_CONSTANTS.ONE_BYTE_SIZE, ipArray[ipArrayIndex], PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER);
                offset += PACKET_CONSTANTS.ONE_BYTE_SIZE;
            }

            setDataViewOffset(dataview, offset, PACKET_CONSTANTS.TWO_BYTE_SIZE, port, PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER);
            offset += PACKET_CONSTANTS.TWO_BYTE_SIZE;

            return offset;
        }

        function setDataViewWithPublicChatBit(dataview, offset) {
            setDataViewOffset(dataview, offset, PACKET_CONSTANTS.ONE_BYTE_SIZE, 0);
            return offset + PACKET_CONSTANTS.ONE_BYTE_SIZE;
        }

        function setDataViewWithObject(dataview, _offset, object, packetType, _packetFormat) {
            // Each SubFormat Length is Placed Just Before the SubFormat, So we need to record the last value fetched from dataview.
            var lastAttributeValue = -1,
                packetFormatIndex,
                attributeType,
                attributeNo,
                attributeValue,
                attributeSize,
                offset = _offset,
                packetFormat = _packetFormat,
                anAttributeNoOrSubFormat,
                subPacketFormat,
                noOfSubFormatPacket,
                previousAttributeNo,
                subObjectContainerName,
                subObjects,
                subFormatPacketIndex,
                subFormatSize,
                offsetStart = offset;

            for (packetFormatIndex = 0; packetFormatIndex < packetFormat.length; packetFormatIndex++) {
                anAttributeNoOrSubFormat = packetFormat[packetFormatIndex];

                if (!Array.isArray(anAttributeNoOrSubFormat)) {
                    // AttributeNumber
                    attributeNo = anAttributeNoOrSubFormat;

                    attributeValue = getAttributeValue(object, attributeNo);

                    attributeType = getAttributeType(attributeNo);

                    if (isDynamicAttribute(attributeNo)) {
                        attributeSize = attributeValue.length;
                    } else if (isRawByteAttribute(attributeNo)) {
                        attributeSize = getRawAttributeSizeFromObject(object, attributeNo);
                    } else {
                        attributeSize = getAttributeSize(attributeNo);
                    }

                    setDataViewOffset(dataview, offset, attributeSize, attributeValue, attributeType);

                    offset += attributeSize;

                    lastAttributeValue = attributeValue;

                    if (isConditionalAttribute(attributeNo)) {
                        packetFormat = _updatePacketFormat(packetType, packetFormat, packetFormatIndex, attributeValue);
                    }
                } else {
                    // Sub-format
                    subPacketFormat = anAttributeNoOrSubFormat;

                    noOfSubFormatPacket = lastAttributeValue;

                    if (noOfSubFormatPacket > 0) {
                        previousAttributeNo = packetFormat[packetFormatIndex - 1];

                        subObjectContainerName = getSubObjectContainerName(previousAttributeNo);

                        subObjects = object[subObjectContainerName];

                        for (subFormatPacketIndex = 0; subFormatPacketIndex < noOfSubFormatPacket; subFormatPacketIndex++) {
                            subFormatSize = setDataViewWithObject(dataview, offset, subObjects[subFormatPacketIndex], packetType, subPacketFormat);
                            offset += subFormatSize;
                        }
                    }

                    // SubFormat Length is placed Just Before the Format. So Get the last attribute size

                    // var previousAttributeNo = packetFormat[packetFormatIndex - 1];
                    //
                    // var previousAttributeValue = getAttributeValue(object, previousAttributeNo);
                }
            }

            return offset - offsetStart;
        }

        function _constructPacket(_object, packetType) {
            // If Object contains Unicode Field, Encode It with `utf8` encoding.
            // object = patchObjectForUtf8Encoding(object);

            var packetFormat = getPacketFormat(packetType),
                object = Object.assign({}, _object),
                packetSize = getPacketSize(object, packetType, packetFormat) + getIpPortSize(),
                dataViewPacket,
                // eslint-disable-next-line 
                dataViewOffsetIndex = 0;

            if (!packetSize) {
                Logger.debug('error', 'Unable to define Packet Size, Check Payload', object, 'packetType', packetType, 'TAG_CHAT');
                return false;
            }

            if (packetSize > 512) {
                Logger.debug('warn', 'Packet Size > 512', object, 'packetType', packetType, 'packetSize', packetSize, 'TAG_CHAT');
            }

            if (isPublicChatPacket(packetType)) {
                object.packetType = packetType - PUBLIC_CHAT_OFFSET;
                packetSize += PACKET_CONSTANTS.ONE_BYTE_SIZE;
            }

            dataViewPacket = getDateViewPacket(packetSize);

            dataViewOffsetIndex = setDataViewWithIpPort(dataViewPacket, dataViewOffsetIndex, object.ip, object.port);

            if (isPublicChatPacket(packetType)) {
                dataViewOffsetIndex = setDataViewWithPublicChatBit(dataViewPacket, dataViewOffsetIndex);
            }

            dataViewOffsetIndex = setDataViewWithObject(dataViewPacket, dataViewOffsetIndex, object, packetType, packetFormat);

            return dataViewPacket;
        }

        function _updatePacketFormat(packetType, _packetFormat, packetFormatIndex, attributeValue) {
            var packetFormat = _packetFormat;

            if (packetType === TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_INFORMATION) {
                packetFormat = Object.assign([], packetFormat);

                switch (attributeValue) {

                    case GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.TAG_RENAME:
                        packetFormat = packetFormat.slice(0, -2);
                        break;
                    case GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.TAG_URL_RENAME:
                        packetFormat.splice(packetFormatIndex + 1, 2);
                        break;
                    default:
                        break;
                }
            }
            return packetFormat;
        }

        function getObjectFromDataView(dataview, _dataViewOffsetIndex, object, packetType, _packetFormat) {
            // Each SubFormat Length is Placed Just Before the SubFormat, So we need to record the last value fetched from dataview.
            var lastAttributeValue = -1,
                dataViewOffsetStartIndex = _dataViewOffsetIndex,
                anAttributeNoOrSubFormat,
                attributeNo,
                attributeName,
                attributeType,
                attributeSize,
                attributeValue,
                subPacketFormat,
                subFormatContainer,
                previousAttributeNo,
                subObjectContainerName,
                noOfSubFormatPacket,
                subFormatPacketIndex,
                subFormatSize,
                dataViewOffsetIndex = _dataViewOffsetIndex,
                packetFormat = _packetFormat,
                packetFormatIndex,
                subFormatObject;

            for (packetFormatIndex = 0; packetFormatIndex < packetFormat.length; packetFormatIndex++) {
                anAttributeNoOrSubFormat = packetFormat[packetFormatIndex];

                if (!Array.isArray(anAttributeNoOrSubFormat)) {
                    // AttributeNumber
                    attributeNo = anAttributeNoOrSubFormat;

                    attributeName = getAttributeName(attributeNo);

                    if (dataViewOffsetIndex >= dataview.byteLength) {
                        object[attributeName] = '';
                    } else {
                        attributeType = getAttributeType(attributeNo);

                        if (isDynamicAttribute(attributeNo)) {
                            attributeSize = getDynamicAttributeSize(object, attributeName);
                        } else {
                            if (isRawByteAttribute(attributeNo)) {
                                attributeSize = getRawAttributeSize(dataview.byteLength, dataViewOffsetIndex);
                            } else {
                                // dataview.byteLength - dataViewOffsetIndex  :
                                attributeSize = getAttributeSize(attributeNo);
                            }
                        }


                        attributeValue = getValueFromDataView(dataview, dataViewOffsetIndex, attributeSize, attributeType);

                        dataViewOffsetIndex += attributeSize;

                        object[attributeName] = attributeValue;


                        lastAttributeValue = attributeValue;
                    }

                    if (isConditionalAttribute(attributeNo)) {
                        packetFormat = _updatePacketFormat(packetType, packetFormat, packetFormatIndex, attributeValue);
                    }
                } else {
                    // Sub-format


                    subPacketFormat = anAttributeNoOrSubFormat;

                    subFormatContainer = [];

                    previousAttributeNo = packetFormat[packetFormatIndex - 1];

                    subObjectContainerName = getSubObjectContainerName(previousAttributeNo);

                    noOfSubFormatPacket = lastAttributeValue;

                    if (noOfSubFormatPacket > 0) {
                        for (subFormatPacketIndex = 0; subFormatPacketIndex < noOfSubFormatPacket; subFormatPacketIndex++) {
                            subFormatObject = {};

                            subFormatSize = getObjectFromDataView(dataview, dataViewOffsetIndex, subFormatObject, packetType, subPacketFormat);
                            dataViewOffsetIndex += subFormatSize;

                            subFormatContainer.push(subFormatObject);
                        }
                    }

                    object[subObjectContainerName] = subFormatContainer;
                }
            }

            return dataViewOffsetIndex - dataViewOffsetStartIndex;
        }

        function _postParseProcess(object) {
            var packetIdSequenceNo;
            if (object.packetType === TAG_CHAT_PACKET_TYPE.TAG_CHAT_SENT) {
                object.originalPacketId = object.packetId;

                try {
                    packetIdSequenceNo = object.packetId.split('_');
                    object.packetId = packetIdSequenceNo[0];
                    object.sequenceNo = packetIdSequenceNo[1];
                } catch (e) {
                    object.sequenceNo = 0;
                }
            }
            return object;
        }

        function _parsePacket(packet, _packetType, _packetFormat) {
            var packetFormat = _packetFormat,
                packetType = _packetType,
                dataView = getDataViewByPacket(packet),
                dataViewOffsetIndex = 0,
                parsedObject = {};

            if (packetType === 0) {
                packetType = dataView.getIntByByte(1, 1);
                packetType = PUBLIC_CHAT_OFFSET + packetType;
                dataViewOffsetIndex += PACKET_CONSTANTS.ONE_BYTE_SIZE;
            }

            if (!packetFormat) {
                packetFormat = getPacketFormat(packetType);
            }

            getObjectFromDataView(dataView, dataViewOffsetIndex, parsedObject, packetType, packetFormat);
            parsedObject = _postParseProcess(parsedObject);

            parsedObject.packetType = packetType;

            return parsedObject;
        }

        function _parseRawPacket(packetData) {
            // todo need to optimize the double dataView Construction
            var dataView = new DataView(packetData),
                returnValue,
                packetType = dataView.getIntByByte(0, 1);

            try {
                returnValue = _parsePacket(packetData, packetType);
            } catch (e) {
                // dataView.print_r(true);
                Logger.log('debug', 'Chat Packet Parse Error', e, ' PacketType ', packetType, 'CHAT');
            }
            return returnValue;
        }

        function _getPacketSizeByObject(object, packetType) {
            var packetFormat = getPacketFormat(packetType);
            return getPacketSize(object, packetType, packetFormat);
        }

//         function _getSplittedTagMemberObjects(requestObject, packetType) {
//             /** todo, generalize please **/
//
//             var objects = [],
//                 packetFormat = getPacketFormat(packetType),
//                 leftRequestObject = Object.assign({}, requestObject),
//                 rightRequestObject = Object.assign({}, requestObject),
//                 leftRequestObjectSize,
//                 rightRequestObjectSize,
//                 length = requestObject.tagMembers.length;
//
//             leftRequestObject.tagMembers = requestObject.tagMembers.slice(0, length / 2);
//             rightRequestObject.tagMembers = requestObject.tagMembers.slice(length / 2);
//             leftRequestObjectSize = getPacketSize(leftRequestObject, packetType, packetFormat);
//             rightRequestObjectSize = getPacketSize(rightRequestObject, packetType, packetFormat);
//
//             if (leftRequestObjectSize > PACKET_CONSTANTS.PACKET_MAX_SIZE) {
//                 objects.concat(_getSplittedTagMemberObjects(leftRequestObject, packetType));
//             } else {
//                 objects.push(leftRequestObject);
//             }
//
//             if (rightRequestObjectSize > PACKET_CONSTANTS.PACKET_MAX_SIZE) {
//                 objects.concat(_getSplittedTagMemberObjects(rightRequestObjectSize, packetType));
//             } else {
//                 objects.push(rightRequestObject);
//             }
//
//             return objects;
//         }


        function _sliceObjectValue(objectValue, isArray, start, end) {
            var returnValue;
            if (isArray) {
                returnValue = objectValue.slice(start, end);
            } else {
                returnValue = objectValue.substring(start, end);
            }
            return returnValue;
        }

        function _getSplittedRequestObject(requestObject, packetType, keyToSplit, splittedObjects) {
            var packetFormat = getPacketFormat(packetType),
                requestObjectSize = getPacketSize(requestObject, packetType, packetFormat),
                isKeyValueArray = Array.isArray(requestObject[keyToSplit]),
                length,
                rightRequestObject,
                leftRequestObject,
                leftRequestObjectSize,
                rightRequestObjectSize;

            if (requestObjectSize > PACKET_CONSTANTS.PACKET_MAX_SIZE) {
                length = requestObject[keyToSplit].length;

                leftRequestObject = Object.assign({}, requestObject);
                rightRequestObject = Object.assign({}, requestObject);

                leftRequestObject[keyToSplit] = _sliceObjectValue(requestObject[keyToSplit], isKeyValueArray, 0, length / 2);
                rightRequestObject[keyToSplit] = _sliceObjectValue(requestObject[keyToSplit], isKeyValueArray, length / 2, length);

                leftRequestObjectSize = getPacketSize(leftRequestObject, packetType, packetFormat);
                rightRequestObjectSize = getPacketSize(rightRequestObject, packetType, packetFormat);

                if (leftRequestObjectSize > PACKET_CONSTANTS.PACKET_MAX_SIZE) {
                    splittedObjects.concat(_getSplittedRequestObject(leftRequestObject, packetType, keyToSplit, splittedObjects));
                } else {
                    splittedObjects.push(leftRequestObject);
                }

                if (rightRequestObjectSize > PACKET_CONSTANTS.PACKET_MAX_SIZE) {
                    splittedObjects.concat(_getSplittedRequestObject(rightRequestObject, packetType, keyToSplit, splittedObjects));
                } else {
                    splittedObjects.push(rightRequestObject);
                }
            } else {
                splittedObjects.push(requestObject);
            }

            return splittedObjects;
        }

        function splitAndGetMultipleObjects(requestObject, packetType) {
            // var noOfObjects = packetSize / PACKET_CONSTANTS.PACKET_MAX_SIZE;
            var keyToSplit = getBrokenContainerByPacketType(packetType);
            return _getSplittedRequestObject(requestObject, packetType, keyToSplit, []);
        }

        function _splitAndGetBrokenPackets(packet) {
            var packetSize = packet.byteLength,
                packetMaxSize = PACKET_CONSTANTS.PACKET_MAX_SIZE,
                noOfPacket = Math.floor(packetSize / packetMaxSize),
                packets = [],
                index,
                startOffset = 0,
                lastPacketSize,
                aBrokenPacket;


            for (index = 0; index < noOfPacket; index++) {
                aBrokenPacket = packet.copy(startOffset, packetMaxSize);
                packets.push({
                    bytes: aBrokenPacket,
                });

                startOffset += PACKET_CONSTANTS.PACKET_MAX_SIZE;
            }

            lastPacketSize = packetSize - startOffset;
            if (lastPacketSize > 0) {
                aBrokenPacket = packet.copy(startOffset, lastPacketSize);
                packets.push({
                    bytes: aBrokenPacket,
                });
            }

            return packets;
        }

        function getBrokenContainerByPacketType(packetType) {
            var returnValue;
            switch (packetType) {

                case OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_PACKET:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_GENERAL_BROKEN_PACKET:

                    returnValue = 'bytes';
                    break;

                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG_EDIT:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG_EDIT:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG_EDIT:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG_EDIT:
                case PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE:
                case PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_EDIT:
                case PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_BROKEN:
                case PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_BROKEN_EDIT:

                    returnValue = 'message';
                    break;

                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN:

                    returnValue = 'messages';
                    break;

                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MULTIPLE_MSG_DELETE:
                case OFFLINE_PACKET_TYPE.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION:
                case OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION:
                case PACKET_TYPES.PUBLIC_CHAT_DELETE_MESSAGE:

                    returnValue = 'packets';
                    break;

                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_ADD:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MEMBER_REMOVE_LEAVE:

                    returnValue = 'tagMembers';
                    break;

                default:
                    break;

            }
            return returnValue;
        }

        function getBrokenPacketSplitter(brokenPacketType, packetType, object, packet) {
            var returnValue;
            switch (brokenPacketType) {
                case OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_PACKET:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_GENERAL_BROKEN_PACKET:

                    returnValue = function _wrapperFunction() {
                        return _splitAndGetBrokenPackets(packet);
                    };
                    break;

                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG_EDIT:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG_EDIT:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_ADD:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MEMBER_REMOVE_LEAVE:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MULTIPLE_MSG_DELETE:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG_EDIT:
                case OFFLINE_PACKET_TYPE.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION:
                case OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION:
                case PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE:
                case PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_EDIT:
                case PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_BROKEN:
                case PACKET_TYPES.PUBLIC_CHAT_CHAT_MESSAGE_BROKEN_EDIT:
                case PACKET_TYPES.PUBLIC_CHAT_DELETE_MESSAGE:
                    returnValue = function warapperFunction() {
                        return splitAndGetMultipleObjects(object, packetType);
                    };
                    break;

                default:
                    break;
            }
            return returnValue;
        }

        function isMultipleBrokenPacket(packetType) {
            var returnValue = false;
            switch (packetType) {

                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MULTIPLE_MSG_DELETE:
                case OFFLINE_PACKET_TYPE.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION:
                case OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN:
                    returnValue = true;
                    break;
                default:
                    break;
            }
            return returnValue;
        }

        function _mergeBrokenPackets(borkenPackets) {
            var totalPacketView = borkenPackets.joinAsDataView(),
                packetType = getPacketType(totalPacketView),
                completePacketObject;

            Logger.debug('print', 'Inside Broken Packet: Packet Type ', packetType, 'CHAT_0');

            completePacketObject = _parseRawPacket(totalPacketView.buffer);

            return completePacketObject;
        }

        function _mergeTextBrokenPackets(textBorkenPackets) {
            var mergedPacket = {},
                length = textBorkenPackets.length,
                index;

            for (index = 0; index < length; index++) {
                if (index === 0) {
                    mergedPacket = textBorkenPackets[index];
                } else {
                    mergedPacket.message += textBorkenPackets[index].message;
                }
            }

            mergedPacket.messageLength = mergedPacket.message.length;

            return mergedPacket;
        }


        return {
            isTagPacket: isTagPacket,
            constructPacket: _constructPacket,
            parsePacket: _parsePacket,
            parseRawPacket: _parseRawPacket,
            getPacketSizeByObject: _getPacketSizeByObject,
            splitAndGetMultipleObjects: splitAndGetMultipleObjects,
            splitAndGetBrokenPackets: _splitAndGetBrokenPackets,

            mergeBrokenPackets: _mergeBrokenPackets,
            mergeTextBrokenPackets: _mergeTextBrokenPackets,
            /** Debug **/
            getObjectFromDataView: getObjectFromDataView,
            getIpPortFromPacket: getIpPortFromPacket,
            getPacketType: getPacketType,
            getPacketName: getPacketName,
            getUserId: getUserId,
            getBrokenContainerByPacketType: getBrokenContainerByPacketType,
            getBrokenPacketSplitter: getBrokenPacketSplitter,
            isMultipleBrokenPacket: isMultipleBrokenPacket,
            isPublicChatPacket: isPublicChatPacket,

        };
    }

    // eslint-disable-next-line
    self.CHAT_APP.ChatPacketParser = ChatPacketParser();
})(self);
