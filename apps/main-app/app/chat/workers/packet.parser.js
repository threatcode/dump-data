;(function(self){

    var Constants = CHAT_APP.Constants;
    var PacketFormats = CHAT_APP.PacketFormats;

    var CHAT_PACKET_ATTRIBUTE_INFO = Constants.CHAT_PACKET_ATTRIBUTE_INFO;
    var TAG_CHAT_PACKET_TYPE = Constants.TAG_CHAT_PACKET_TYPE;
    var OFFLINE_PACKET_TYPE = Constants.OFFLINE_PACKET_TYPE;
    var FRIEND_CHAT_PACKET_TYPE = Constants.FRIEND_CHAT_PACKET_TYPE;

    var GENERAL_CONSTANTS = Constants.GENERAL_CONSTANTS;
    var PACKET_CONSTANTS = Constants.PACKET_CONSTANTS;

    var CHAT_PACKET_INFO = PacketFormats.CHAT_PACKET_INFO;
    var CHAT_PACKET_ATTRIBUTE = PacketFormats.CHAT_PACKET_ATTRIBUTE;
    var CHAT_PACKET_ATTRIBUTE_INFO = PacketFormats.CHAT_PACKET_ATTRIBUTE_INFO;

    function ChatPacketParser() {

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function isTagPacket( packetType ){
            return !!CHAT_PACKET_INFO[packetType];
        }

        function getPacketFormat( packetType ){
            return CHAT_PACKET_INFO[packetType].FORMAT;
        }

        function getPacketName( packetType ){
            return CHAT_PACKET_INFO[packetType].PACKET_NAME;
        }

        function getAttributeSize( attributeNo ){
            return CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].SIZE;
        }

        function getRawAttributeSize( packetLength, offset ){
            return packetLength - offset;
        }

        function getRawAttributeSizeFromObject(object, attributeNo){
            var rawAttributeName = getAttributeName(attributeNo);
            return object[rawAttributeName].byteLength;
        }

        function getAttributeName( attributeNo ){
            return CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].VAR_NAME;
        }

        function getAttributeType( attributeNo ){
            return CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].VAR_TYPE;
        }

        function isConditionalAttribute( attributeNo ){
            return CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].CONDITIONAL;
        }

        function getSubObjectContainerName( attributeNo ){
            try{
                return CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].VAR_CONTAINER_NAME;
            }catch(e){
                Logger.debug('warning','invalid `attribute no` for `container name` or `container name` not defined for `attribute no` : ', attributeNo);
                return -1;
            }
        }

        function getAttributeValue(object, attributeNo){
            try{

                var variableName = CHAT_PACKET_ATTRIBUTE_INFO[attributeNo].VAR_NAME;

                if( ~variableName.indexOf('Length') ){
                    var VariableNameWithoutLength = variableName.replace('Length', '');
                    return object[variableName] || object[VariableNameWithoutLength].length;
                }else{
                    return object[variableName];
                }

            }catch(e){
                Logger.debug('warning', 'object attribute no not defined : ', attributeNo);
                return '';
            }
        }

        function getDynamicAttributeSize(object, attributeName){
            try{
                return object[attributeName + 'Length'];
            }catch(e){
                Logger.debug('warning','object[attribute_name + Length] not set', attributeName);
                return -1
            }
        }

        function isDynamicAttribute(attributeNo){
            return ( getAttributeSize(attributeNo) == PACKET_CONSTANTS.PACKET_DYNAMIC_ATTRIBUTE );
        }

        function isRawByteAttribute(attributeNo){
            return ( getAttributeSize(attributeNo) == PACKET_CONSTANTS.PACKET_RAW_BYTE_ATTRIBUTE );
        }

        function getIpPortSize(){

            return PACKET_CONSTANTS.PACKET_IP_SIZE + PACKET_CONSTANTS.PACKET_PORT_SIZE;
        }

        function patchObjectForUtf8Encoding(object){

            if(!!object.message ){
                object.message = object.message.utf8Encode();
            }

            if(!!object.fullName){
                object.fullName = object.fullName.utf8Encode().substring(0, 124) + '...';
            }

            return object;
        }

        function getDateViewPacket(packetSize){
            return new DataView(new ArrayBuffer(packetSize));

        }

        function getDataViewByPacket(packet){
            return new DataView(packet);

        }

        function getPacketSize(object, packetType, packetFormat){

            var packetSize = 0;

            var packetFormatLength = packetFormat.length;

            var lastAttributeValue = -1;

            for(var packetFormatIndex = 0; packetFormatIndex < packetFormatLength; packetFormatIndex++ ){

                var anAttributeNoOrSubFormat = packetFormat[packetFormatIndex];

                if( !Array.isArray(anAttributeNoOrSubFormat)){

                    var attributeValue = getAttributeValue( object, anAttributeNoOrSubFormat );

                    if( isDynamicAttribute(anAttributeNoOrSubFormat) ){

                        packetSize += attributeValue.length;

                    }else if( isRawByteAttribute(anAttributeNoOrSubFormat) ){

                        var attributeNo = anAttributeNoOrSubFormat;
                        packetSize += getRawAttributeSizeFromObject( object, attributeNo );

                    }else{

                        //Not Dynamic Length
                        var attributeNo = anAttributeNoOrSubFormat;
                        packetSize += getAttributeSize( attributeNo );

                        if( isConditionalAttribute( attributeNo )){
                            packetFormat = _updatePacketFormat(packetType, packetFormat, packetFormatIndex, attributeValue);
                            packetFormatLength = packetFormat.length;
                        }
                    }

                    lastAttributeValue = attributeValue;

                }else{

                    //SubFormat Length is placed Just Before the Format. So Get the last attribute size
                    var noOfSubFormatPacket = lastAttributeValue;

                    if( noOfSubFormatPacket > 0 ){

                        var previousAttributeNo = packetFormat[packetFormatIndex - 1];

                        var subObjectContainerName = getSubObjectContainerName( previousAttributeNo );

                        var subObjects = object[subObjectContainerName];

                        for( var subFormatPacketIndex = 0; subFormatPacketIndex < noOfSubFormatPacket; subFormatPacketIndex++ ){

                            var subFormatSize = getPacketSize(subObjects[subFormatPacketIndex], packetType, anAttributeNoOrSubFormat );
                            packetSize += subFormatSize;

                        }

                    }
                }

            }

            return packetSize;

        }



        function setDataViewOffset(dataview, offset, size, value, valueType){

            if(valueType == PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER){

                value = parseInt(value);

                if(size == PACKET_CONSTANTS.ONE_BYTE_SIZE){
                    dataview.setUint8(offset, value);

                }else if(size == PACKET_CONSTANTS.TWO_BYTE_SIZE){
                    dataview.setUint16(offset, value);

                }else if(size == PACKET_CONSTANTS.FOUR_BYTE_SIZE){
                    dataview.setUint32(offset, value);

                }else if(size == PACKET_CONSTANTS.EIGHT_BYTE_SIZE){
                    dataview.setUint64(offset, value);
                }

            }else if(valueType == PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING){

                for(var valueIndex = 0; valueIndex < value.length; valueIndex++){
                    dataview.setUint8(offset, value.charCodeAt(valueIndex));

                    offset += 1;
                }
            }else if(valueType == PACKET_CONSTANTS.ATTRIBUTE_TYPE.BYTE){

                for(var valueIndex = 0; valueIndex < size; valueIndex++){
                    dataview.setUint8(offset + valueIndex, value.getUint8(valueIndex) );
                }
            }

        }

        function getValueFromDataView(dataview, offset, size, valueType){
            var value = '';

            if(valueType == PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER){

                value = dataview.getIntByByte(offset, size);

            }else if(valueType == PACKET_CONSTANTS.ATTRIBUTE_TYPE.STRING){

                if( size  > 0){
                    value = dataview.getString(offset, size);
                }
            }else if(valueType == PACKET_CONSTANTS.ATTRIBUTE_TYPE.BYTE){

                if( size  > 0){
                    value = dataview.copy(offset, size);
                }
            }
            return value;
        }

        function getIpParts(ip){
            var ipArray = [];
            try{
                ipArray = ip.split(".");
            }catch(e){
                Logger.debug('warning','Invalid ip provided in object', ip);
            }

            return ipArray;

        }

        function getIpPortFromPacket(packet){
            var ip, port, ipPart = [];
            for(var index = 0; index < 4;index++){
                ipPart.push(getValueFromDataView(packet, index, 1, PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER));
            }

            ip = ipPart.join('.');
            port = getValueFromDataView(packet, 4, 2, PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER);

            return { ip : ip, port : port};

        }

        function getPacketType(packet){
            return getValueFromDataView(packet, 0, 1, PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER);
        }

        function getUserId(packet){
            return getValueFromDataView(packet, 1, 8, PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER);
        }

        function setDataViewWithIpPort(dataview, offset, ip, port){

            var ipArray = getIpParts(ip);

            for(var ipArrayIndex = 0; ipArrayIndex < ipArray.length; ipArrayIndex++ ){

                setDataViewOffset(dataview, offset, PACKET_CONSTANTS.ONE_BYTE_SIZE, ipArray[ipArrayIndex], PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER );
                offset += PACKET_CONSTANTS.ONE_BYTE_SIZE;
            }

            setDataViewOffset(dataview, offset, PACKET_CONSTANTS.TWO_BYTE_SIZE, port, PACKET_CONSTANTS.ATTRIBUTE_TYPE.INTEGER )
            offset += PACKET_CONSTANTS.TWO_BYTE_SIZE;

            return offset;

        }

        function setDataViewWithObject(dataview, offset, object, packetType, packetFormat){

            //Each SubFormat Length is Placed Just Before the SubFormat, So we need to record the last value fetched from dataview.
            var lastAttributeValue = -1;

            var offsetStart = offset;

            for(var packetFormatIndex = 0; packetFormatIndex < packetFormat.length; packetFormatIndex++ ){

                var anAttributeNoOrSubFormat = packetFormat[packetFormatIndex];

                if( !Array.isArray(anAttributeNoOrSubFormat)){
                    //AttributeNumber
                    var attributeNo = anAttributeNoOrSubFormat;

                    var attributeValue = getAttributeValue(object, attributeNo);

                    var attributeType = getAttributeType(attributeNo);

                    var attributeSize;
                    if( isDynamicAttribute(attributeNo)){

                        attributeSize = attributeValue.length
                    }else if( isRawByteAttribute(attributeNo) ){

                        attributeSize = getRawAttributeSizeFromObject( object, attributeNo );
                    }else{
                        attributeSize = getAttributeSize( attributeNo );
                    }

                    setDataViewOffset(dataview, offset, attributeSize, attributeValue, attributeType );

                    offset += attributeSize;

                    lastAttributeValue = attributeValue;

                    if( isConditionalAttribute( attributeNo )){
                        packetFormat = _updatePacketFormat(packetType, packetFormat, packetFormatIndex, attributeValue);
                    }

                }else{

                    //Sub-format
                    var subPacketFormat = anAttributeNoOrSubFormat;

                    var noOfSubFormatPacket = lastAttributeValue ;

                    if( noOfSubFormatPacket > 0 ){

                        var previousAttributeNo = packetFormat[packetFormatIndex - 1];

                        var subObjectContainerName = getSubObjectContainerName( previousAttributeNo );

                        var subObjects = object[subObjectContainerName];

                        for( var subFormatPacketIndex = 0; subFormatPacketIndex < noOfSubFormatPacket; subFormatPacketIndex++ ){

                            var subFormatSize = setDataViewWithObject(dataview, offset, subObjects[subFormatPacketIndex] , packetType, subPacketFormat );
                            offset += subFormatSize;

                        }

                    }

                    //SubFormat Length is placed Just Before the Format. So Get the last attribute size

                    //var previousAttributeNo = packetFormat[packetFormatIndex - 1];
                    //
                    //var previousAttributeValue = getAttributeValue(object, previousAttributeNo);

                }
            }

            return offset - offsetStart;
        }

        function _constructPacket(object, packetType) {

            //If Object contains Unicode Field, Encode It with `utf8` encoding.
            //object = patchObjectForUtf8Encoding(object);

            var packetFormat = getPacketFormat(packetType);

            var packetSize = getPacketSize(object, packetType, packetFormat) + getIpPortSize();

            if(!packetSize){
                Logger.debug('error', 'Unable to define Packet Size, Check Payload', object, 'packetType', packetType, "TAG_CHAT" );
                return false;
            }

            if(packetSize > 512){
                Logger.debug('warn', 'Packet Size > 512', object, 'packetType', packetType, 'packetSize', packetSize, "TAG_CHAT" );
            }

            var dataViewPacket = getDateViewPacket( packetSize );

            var dataViewOffsetIndex = 0;

            dataViewOffsetIndex = setDataViewWithIpPort( dataViewPacket, dataViewOffsetIndex, object.ip, object.port);

            dataViewOffsetIndex = setDataViewWithObject( dataViewPacket, dataViewOffsetIndex, object, packetType, packetFormat);

            return dataViewPacket;
        }

        function _updatePacketFormat(packetType, packetFormat, packetFormatIndex, attributeValue ){
            if( packetType == TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_INFORMATION ){
                packetFormat = Object.assign([], packetFormat);

                switch( attributeValue ) {

                    case GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.TAG_RENAME:
                        packetFormat = packetFormat.slice(0, -2);
                        break;
                    case GENERAL_CONSTANTS.TAG_ACTIVITY_TYPE.TAG_URL_RENAME:
                        packetFormat.splice(packetFormatIndex + 1, 2);
                        break;
                }
            }
            return packetFormat;
        }

        function getObjectFromDataView(dataview, dataViewOffsetIndex, object, packetType, packetFormat){

            //Each SubFormat Length is Placed Just Before the SubFormat, So we need to record the last value fetched from dataview.
            var lastAttributeValue = -1;
            var dataViewOffsetStartIndex = dataViewOffsetIndex;

            var anAttributeNoOrSubFormat, attributeNo,
                attributeName, attributeType,
                attributeSize, attributeValue,
                subPacketFormat, subFormatContainer,
                previousAttributeNo, subObjectContainerName,
                noOfSubFormatPacket, subFormatPacketIndex,
                subFormatSize, subFormatObject;

            for(var packetFormatIndex = 0; packetFormatIndex < packetFormat.length; packetFormatIndex++){

                anAttributeNoOrSubFormat = packetFormat[packetFormatIndex];

                if( !Array.isArray(anAttributeNoOrSubFormat)){

                    //AttributeNumber
                    attributeNo = anAttributeNoOrSubFormat;

                    attributeName = getAttributeName(attributeNo);

                    if( dataViewOffsetIndex >= dataview.byteLength ){
                        object[attributeName] = '';

                    }else{


                        attributeType = getAttributeType(attributeNo);
                        attributeSize =
                            isDynamicAttribute(attributeNo) ?
                                getDynamicAttributeSize(object, attributeName) :
                                isRawByteAttribute(attributeNo) ?
                                    getRawAttributeSize(dataview.byteLength, dataViewOffsetIndex) :
                                    //dataview.byteLength - dataViewOffsetIndex  :
                                    getAttributeSize( attributeNo );


                        attributeValue = getValueFromDataView(dataview, dataViewOffsetIndex, attributeSize, attributeType );

                        dataViewOffsetIndex += attributeSize;

                        object[attributeName] = attributeValue;


                        lastAttributeValue = attributeValue;

                    }

                    if( isConditionalAttribute( attributeNo )){
                        packetFormat = _updatePacketFormat(packetType, packetFormat, packetFormatIndex, attributeValue);
                    }


                }else{

                    //Sub-format


                    subPacketFormat = anAttributeNoOrSubFormat;

                    subFormatContainer = [];

                    previousAttributeNo = packetFormat[packetFormatIndex - 1];

                    subObjectContainerName = getSubObjectContainerName( previousAttributeNo );

                    noOfSubFormatPacket = lastAttributeValue;

                    if( noOfSubFormatPacket > 0 ){

                        for( subFormatPacketIndex = 0; subFormatPacketIndex < noOfSubFormatPacket; subFormatPacketIndex++ ){

                            subFormatObject = {};

                            subFormatSize = getObjectFromDataView(dataview, dataViewOffsetIndex, subFormatObject, packetType, subPacketFormat );
                            dataViewOffsetIndex += subFormatSize;

                            subFormatContainer.push(subFormatObject);

                        }

                    }

                    object[subObjectContainerName] = subFormatContainer;


                }


            }

            return dataViewOffsetIndex - dataViewOffsetStartIndex;
        }

        function _postParseProcess(object){
            if(object.packetType == TAG_CHAT_PACKET_TYPE.TAG_CHAT_SENT){
                object.originalPacketId = object.packetId;

                try{
                    var packetIdSequenceNo = object.packetId.split('_');
                    object.packetId = packetIdSequenceNo[0];
                    object.sequenceNo = packetIdSequenceNo[1];

                }catch(e){
                    object.sequenceNo = 0;
                }

            }
            return object;
        }

        function _parsePacket(packet, packetType, packetFormat){

            if(!packetFormat){
                packetFormat = getPacketFormat( packetType );
            }

            var dataView = getDataViewByPacket( packet );

            var dataViewOffsetIndex = 0;

            var parsedObject = {};

            var parsedObjectSize = getObjectFromDataView(dataView, dataViewOffsetIndex, parsedObject, packetType, packetFormat);

            parsedObject = _postParseProcess(parsedObject);

            return parsedObject;

        }



        function _parseRawPacket( packetData ) {
            //todo need to optimize the double dataView Construction
            var dataView = new DataView(packetData);
            var packetType = dataView.getIntByByte(0, 1);

            try{
                return  _parsePacket(packetData, packetType);
            }catch(e){
                // dataView.print_r(true);
                //console.error('Chat Packet Parse Error', e, ' PacketType ', packetType);
            }

        }

        function _getPacketSizeByObject( object, packetType ){
            var packetFormat = getPacketFormat(packetType);
            return getPacketSize(object, packetType, packetFormat);
        }

        function _getSplittedTagMemberObjects(requestObject, packetType){
            /** todo, generalize please **/

            var objects = [];

            var packetFormat = getPacketFormat(packetType);

            var leftRequestObject = Object.assign({}, requestObject);
            var rightRequestObject = Object.assign({}, requestObject);

            var length = requestObject.tagMembers.length;
            leftRequestObject.tagMembers = requestObject.tagMembers.slice(0, length/2);
            rightRequestObject.tagMembers = requestObject.tagMembers.slice(length/2);

            var leftRequestObjectSize = getPacketSize(leftRequestObject, packetType, packetFormat);
            var rightRequestObjectSize = getPacketSize(rightRequestObject, packetType, packetFormat);

            if(leftRequestObjectSize > PACKET_CONSTANTS.PACKET_MAX_SIZE ){
                objects.concat(_getSplittedTagMemberObjects(leftRequestObject, packetType));
            }else{
                objects.push(leftRequestObject);
            }

            if(rightRequestObjectSize > PACKET_CONSTANTS.PACKET_MAX_SIZE ){
                objects.concat(_getSplittedTagMemberObjects(rightRequestObjectSize, packetType));
            }else{
                objects.push(rightRequestObject);
            }

            return objects;

        }


        function _sliceObjectValue(objectValue, isArray, start, end){
            if( isArray){
                return objectValue.slice(start, end);
            }else{
                return objectValue.substring(start, end);
            }
        }

        function _getSplittedRequestObject(requestObject, packetType, keyToSplit, splittedObjects){

            var packetFormat = getPacketFormat(packetType);

            var requestObjectSize = getPacketSize(requestObject, packetType, packetFormat);

            var isKeyValueArray = Array.isArray(requestObject[keyToSplit]) ? true : false;

            if(requestObjectSize > PACKET_CONSTANTS.PACKET_MAX_SIZE  ){

                var length = requestObject[keyToSplit].length;

                var leftRequestObject = Object.assign({}, requestObject);
                var rightRequestObject = Object.assign({}, requestObject);

                leftRequestObject[keyToSplit] = _sliceObjectValue(requestObject[keyToSplit], isKeyValueArray, 0, length/2);
                rightRequestObject[keyToSplit] = _sliceObjectValue(requestObject[keyToSplit], isKeyValueArray, length/2, length);

                var leftRequestObjectSize = getPacketSize(leftRequestObject, packetType, packetFormat);
                var rightRequestObjectSize = getPacketSize(rightRequestObject, packetType, packetFormat);

                if(leftRequestObjectSize > PACKET_CONSTANTS.PACKET_MAX_SIZE ){
                    splittedObjects.concat(_getSplittedRequestObject(leftRequestObject, packetType, keyToSplit, splittedObjects));
                }else{
                    splittedObjects.push(leftRequestObject);
                }

                if(rightRequestObjectSize > PACKET_CONSTANTS.PACKET_MAX_SIZE ){
                    splittedObjects.concat(_getSplittedRequestObject(rightRequestObject, packetType, keyToSplit, splittedObjects));
                }else{
                    splittedObjects.push(rightRequestObject);
                }

            }else{
                splittedObjects.push(requestObject);
            }

            return splittedObjects;

        }

        function splitAndGetMultipleObjects(requestObject, packetType){

            //var noOfObjects = packetSize / PACKET_CONSTANTS.PACKET_MAX_SIZE;
            var keyToSplit = getBrokenContainerByPacketType(packetType);
            return _getSplittedRequestObject(requestObject, packetType, keyToSplit, []);

        }

        function _splitAndGetBrokenPackets(packet ){

            var packetSize = packet.byteLength,
                packetMaxSize = PACKET_CONSTANTS.PACKET_MAX_SIZE,
                noOfPacket = Math.floor(packetSize/packetMaxSize),
                packets = [],
                index,
                startOffset = 0,
                lastPacketSize,
                aBrokenPacket;


            for(index = 0; index < noOfPacket; index++){

                aBrokenPacket = packet.copy(startOffset, packetMaxSize);
                packets.push({ bytes :  aBrokenPacket});

                startOffset += PACKET_CONSTANTS.PACKET_MAX_SIZE;

            }

            lastPacketSize = packetSize - startOffset;
            if( lastPacketSize > 0){

                aBrokenPacket = packet.copy(startOffset, lastPacketSize);
                packets.push({ bytes: aBrokenPacket});
            }

            return packets;

        }

        function getBrokenContainerByPacketType(packetType){
            switch (packetType){

                case OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_PACKET:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_GENERAL_BROKEN_PACKET:

                    return 'bytes';

                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_MSG_EDIT:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_BROKEN_MSG_EDIT:

                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MSG_EDIT:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_BROKEN_MSG_EDIT:

                    return 'message';

                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN:

                    return 'messages';

                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MULTIPLE_MSG_DELETE:
                case OFFLINE_PACKET_TYPE.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION:
                case OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION:

                    return 'packets'

                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_ADD:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_TAG_MEMBER_TYPE_CHANGE:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MEMBER_REMOVE_LEAVE:

                    return 'tagMembers';


            }
        }

        function getBrokenPacketSplitter(brokenPacketType, packetType, object, packet){


            switch (brokenPacketType){

                case OFFLINE_PACKET_TYPE.OFFLINE_BROKEN_PACKET:
                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_GENERAL_BROKEN_PACKET:

                    return function(){
                        return _splitAndGetBrokenPackets(packet);
                    };

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

                    return function(){
                        return splitAndGetMultipleObjects(object, packetType);
                    }

            }
        }

        function isMultipleBrokenPacket(packetType){
            switch (packetType){

                case TAG_CHAT_PACKET_TYPE.TAG_CHAT_MULTIPLE_MSG_DELETE:

                case OFFLINE_PACKET_TYPE.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION:
                case OFFLINE_PACKET_TYPE.OFFLINE_FRIEND_UNREAD_MESSAGE_CONFIRMATION:
                case OFFLINE_PACKET_TYPE.OFFLINE_TAG_UNREAD_MESSAGE_CONFIRMATION:
                case FRIEND_CHAT_PACKET_TYPE.FRIEND_CHAT_SEEN:
                    return true;

            }
            return false;
        }

        function _mergeBrokenPackets( borkenPackets ){
            totalPacketView = borkenPackets.joinAsDataView();
            packetType = getPacketType( totalPacketView );

            Logger.debug('print', 'Inside Broken Packet: Packet Type ', packetType, 'CHAT_0' );
            var combinedParsedPacketObject = {};

            completePacketObject = _parseRawPacket(totalPacketView.buffer);

            return completePacketObject;
        }

        function _mergeTextBrokenPackets(textBorkenPackets){

            var mergedPacket = {};
            for(var index = 0; index < length; index++){

                if( index === 0){
                    mergedPacket = textBorkenPackets[index];

                }else{
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

            mergeBrokenPackets : _mergeBrokenPackets,
            mergeTextBrokenPackets : _mergeTextBrokenPackets,
            /** Debug **/
            getObjectFromDataView: getObjectFromDataView,
            getIpPortFromPacket: getIpPortFromPacket,
            getPacketType: getPacketType,
            getPacketName: getPacketName,
            getUserId: getUserId,
            getBrokenContainerByPacketType: getBrokenContainerByPacketType,
            getBrokenPacketSplitter: getBrokenPacketSplitter,
            isMultipleBrokenPacket: isMultipleBrokenPacket

        };
    }

    self.CHAT_APP['ChatPacketParser'] = ChatPacketParser();

})(self);
