(function(me){
    "use strict";
var ATTRIBUTE_CODES = {
                AUTHIP: 1001,
                AUTHPORT: 1002,
                AUTH_E_USERNAME : 1003,
                AUTH_E_PASSWORD : 1004,
                AUTH_E_SALT : 1005,
                ACTION: 1,
                SERVER_PACKET_ID: 2,
                SESSION_ID: 3,
                TOTAL_PACKET: 4,
                PACKET_NUMBER: 5,
                UNIQUE_KEY: 6,
                USER_ID: 7,
                FRIEND_ID: 8,
                DEVICE: 9,
                CLIENT_PACKET_ID: 10,
                CALL_ID: 11,
                FRIEND_IDENTITY: 12,
                CALL_TIME: 13,
                PRESENCE: 14,
                IS_DEVIDED_PACKET: 15,
                USER_IDENTITY: 16,
                USER_NAME: 17,
                TOTAL_RECORDS: 18,
                USER_TABLE_IDS: 19,
                SUCCESS: 20,
                MESSAGE: 21,
                REASON_CODE: 22,
                STATUS: 23,
                DELETED: 24,
                WEB_UNIQUE_KEY: 28,
                WEB_TAB_ID: 29,
                DATA: 127,

                /* Contact list constants */
                CONTACT: 101,
                CONTACT_TYPE: 102,
                NEW_CONTACT_TYPE: 103,
                FRIENDSHIP_STATUS: 104,
                BLOCK_VALUE: 105,
                CHANGE_REQUESTER: 106,
                CONTACT_UPDATE_TIME: 107,
                MUTUAL_FRIEND_COUNT : 108,
                CALL_ACCESS: 110,
                CHAT_ACCESS: 111,
                FEED_ACCESS: 112,
                ANONYMOUS_CALL: 9,
                /* USER DETAILS */
                PASSWORD: 128,
                RESET_PASSWORD: 129,
                EMAIL: 130,
                DEVICE_UNIQUE_ID: 131,
                DEVICE_TOKEN: 132,
                MOBILE_PHONE: 133,
                BIRTH_DATE: 134,
                MARRIAGE_DAY: 135,
                GENDER: 136,
                COUNTRY_ID: 137,
                CURRENT_CITY: 138,
                HOME_CITY: 139,
                LANGUAGE_ID: 140,
                REGISTRATION_DATE: 141,
                DIALING_CODE: 142,
                IS_MY_NUMBER_VERIFIED: 143,
                IS_EMAIL_VERIFIED: 145,
                MY_NUMBER_VERIFICATION_CODE: 146,
                MYNUMBER_VERIFICATION_CODE_SENT_TIME: 147,
                EMAIL_VERIFICATION_CODE: 148,
                RECOVERY_VERIFICATION_CODE: 149,
                RECOVERY_VERIFICATION_CODE_SENT_TIME: 150,
                PROFILE_IMAGE: 151,
                PROFILE_IMAGE_ID: 152,
                COVER_IMAGE: 153,
                COVER_IMAGE_ID: 154,
                COVER_IMAGE_X: 155,
                COVER_IMAGE_Y: 156,
                ABOUT_ME: 157,
                TOTAL_FRIENDS: 158,
                RING_EMAIL: 159,
                UPDATE_TIME: 160,
                NOTIFICATION_VALIDITY: 161,
                WEB_LOGIN_ENABLED: 162,
                PC_LOGIN_ENABLED: 163,
                COMMON_FRIEND_SUGGESTION: 164,
                PHONE_NUMBER_SUGGESTION: 165,
                CONTACT_LIST_SUGGESTION: 166
    };
function parserService( ATCODE) { //jshint ignore:line
        var me = this, //jshint ignore:line
            attrMap =  [];

            /*
             * ATTRIBUTE CODE 108 missing. got data for actn 23
             */
            attrMap[ATCODE.SUCCESS] =  'sucs';
            attrMap[ATCODE.REASON_CODE] = 'reasonCode';
            attrMap[ATCODE.MESSAGE] = 'message';
            attrMap[ATCODE.TOTAL_PACKET] = 'totalPacket';
            attrMap[ATCODE.PACKET_NUMBER] = 'packetNo';
            attrMap[ATCODE.TOTAL_RECORDS] =  'totalRecord';
            attrMap[ATCODE.USER_TABLE_IDS] = 'utIds';
            attrMap[ATCODE.USER_ID] = 'utId';
            attrMap[ATCODE.USER_IDENTITY] =  'uId';
            attrMap[ATCODE.USER_NAME] = 'fn';
            attrMap[ATCODE.PROFILE_IMAGE] = 'prIm';
            attrMap[ATCODE.PROFILE_IMAGE_ID] = 'prImId';
            attrMap[ATCODE.UPDATE_TIME] = 'ut';
            attrMap[ATCODE.CONTACT_UPDATE_TIME] = 'cut';
            attrMap[ATCODE.CONTACT_TYPE] = 'ct';
            attrMap[ATCODE.NEW_CONTACT_TYPE] = 'nct';
            attrMap[ATCODE.DELETED] = 'deleted';
            attrMap[ATCODE.BLOCK_VALUE] = 'bv';
            attrMap[ATCODE.FRIENDSHIP_STATUS] = 'frnS';
            attrMap[ATCODE.CHANGE_REQUESTER] = 'changeRequester';
            attrMap[ATCODE.CONTACT] = 'contacts';
            attrMap[ATCODE.CALL_ACCESS] = 'cla';
            attrMap[ATCODE.CHAT_ACCESS] = 'chta';
            attrMap[ATCODE.FEED_ACCESS] = 'fda';
            attrMap[ATCODE.ANONYMOUS_CALL] = 'anc';


            attrMap[ATCODE.SESSION_ID] = 'sessionId';
            attrMap[ATCODE.MUTUAL_FRIEND_COUNT] = 'mutualFriends';

        return function parse(dataView, offset) {
            var attribute,
                length,
                Data = {};

            for (var index = offset; index < dataView.byteLength; ) {
                if(index + 1 >= dataView.byteLength){
                    break;
                }
                attribute = dataView.getUint16(index);
                index += 2;
                length = 0;

                switch(attribute) {
                    case ATCODE.SUCCESS:
                        length = dataView.getUint8(index++);
                        Data[attrMap[attribute]] = dataView.getBool(index);
                        break;
                    case ATCODE.REASON_CODE://1
                    case ATCODE.TOTAL_PACKET://1
                    case ATCODE.PACKET_NUMBER://1
                    case ATCODE.TOTAL_RECORDS://1
                    case ATCODE.USER_ID://1
                    case ATCODE.PROFILE_IMAGE_ID://1
                    case ATCODE.UPDATE_TIME:
                    case ATCODE.CONTACT_UPDATE_TIME:
                    case ATCODE.CONTACT_TYPE:
                    case ATCODE.NEW_CONTACT_TYPE:
                    case ATCODE.DELETED:
                    case ATCODE.BLOCK_VALUE:
                    case ATCODE.FRIENDSHIP_STATUS:
                    case ATCODE.CHANGE_REQUESTER:
                    case ATCODE.MUTUAL_FRIEND_COUNT:
                    case ATCODE.CALL_ACCESS:
                    case ATCODE.CHAT_ACCESS:
                    case ATCODE.FEED_ACCESS:
                        length = dataView.getUint8(index++);
                        Data[attrMap[attribute]] = dataView.getIntByByte(index, length);
                        break;
                    case ATCODE.MESSAGE:
                    case ATCODE.USER_NAME:
                    case ATCODE.USER_IDENTITY:
                    case ATCODE.PROFILE_IMAGE:
                    case ATCODE.SESSION_ID:
                        length = dataView.getUint8(index++);
                        Data[attrMap[attribute]] = dataView.getString(index, length);
                        break;
                    case ATCODE.USER_TABLE_IDS:
                        length = dataView.getUint16(index);
                        index += 2;
                        Data[attrMap[attribute]] = []; //$$stackedMap.createNew();
                        var utId, contactType, matchBy, frnS;

                        for(var i = index; i < index+length; ) {
                            utId = dataView.getIntByByte(i, 8);
                            i += 8;
                            contactType = dataView.getUint8(i++);
                            matchBy = dataView.getUint8(i++);
                            frnS = dataView.getUint8(i++);
                            Data[attrMap[attribute]].push({
                                    key: utId,
                                    value: {
                                        ct: contactType,
                                        mb: matchBy,
                                        frnS: frnS
                                    }
                                });
                                ////Data[attrMap[attribute]].save(
                                //utId, {
                                    //'ct': contactType,
                                    //'matchBy': matchBy
                                //}
                            //);
                        }
                        break;
                    case ATCODE.CONTACT:
                       // console.info('CONTACT');
                        // LONG PROCESS
                        length = dataView.getUint16(index);
                        index += 2;
                        if (! Array.isArray(Data[attrMap[attribute]])) {
                            Data[attrMap[attribute]] = [];
                        }
                        Data[attrMap[attribute]].push( parse(dataView.copy(index, length), 0) );
                        break;
                    default:
                        length = dataView.getUint8(index++);
                        break;
                }
                index += length;
            }

            return Data;
        };
    }(ATTRIBUTE_CODES);

   function RingParser(ATTRIBUTE_CODES, parserService){ //jshint ignore:line
        var ReturnObject,packetDataStorage={};// for accessing from self property assigning to be returned object to a variable
        var ByteParsers = {};

        function parseHeader(dataViewObject, offset){
            var index,len,attribute,headerObject={},val;//offset = offset || 1;

            for(index=offset;index<dataViewObject.byteLength;){
                attribute = dataViewObject.getUint16(index);// reading int from 2 byte
                index +=2;// so increasing the index to two
                len = dataViewObject.getUint8(index++);// one byte of length
                //val = dataViewObject.getInt16(index);
                val = dataViewObject.getIntByByte(index,len);
                switch(attribute){
                    case ATTRIBUTE_CODES.ACTION:// one byte
                        headerObject.actn = val;
                        break;
                    case ATTRIBUTE_CODES.SERVER_PACKET_ID:
                        headerObject.pckFs = val;
                        break;
                    case ATTRIBUTE_CODES.CLIENT_PACKET_ID:
                        headerObject.pckId = dataViewObject.getString(index,len);
                        break;
                    case ATTRIBUTE_CODES.WEB_UNIQUE_KEY:// TODO : find use
                        break;
                    case ATTRIBUTE_CODES.WEB_TAB_ID:
                        headerObject.tabId = val;
                        break;
                    case ATTRIBUTE_CODES.AUTHIP:
                        headerObject.authServer = dataViewObject.getString(index,len);
                        break;
                    case ATTRIBUTE_CODES.AUTHPORT:
                        headerObject.comPort = val;
                        break;
                    case ATTRIBUTE_CODES.AUTH_E_USERNAME:
                        headerObject.authEUsername = dataViewObject.getString(index,len);
                        break;
                    case ATTRIBUTE_CODES.AUTH_E_PASSWORD:
                        headerObject.authEPassword = dataViewObject.getString(index,len);
                        break;
                    case ATTRIBUTE_CODES.AUTH_E_SALT:
                        headerObject.authESalt = dataViewObject.getString(index,len);
                        break;

                    default:
                        index -=3;// we readed attribute and len for three byte so fallback three bytes because there is no match for header tag
                        headerObject.headerLength = index;// setting header length
                        return headerObject;
                }
                // if not returning from switch case, its means we find a match for header variable so moving index to len byte
                index += len;
            }
            return headerObject;

        };

        function parseBrokenPacketHeader(dataViewObject,offset){
            var index,len,attribute,
                headerObject = {//defaults values
                    actn : 0,
                    pckFs : 0,
                    total : 0,
                    current:0,
                    key :0
                },val;offset = offset || 1;

            for(index=offset;index<dataViewObject.byteLength;){
                attribute = dataViewObject.getUint8(index++);// reading int from 1 byte

                len = dataViewObject.getUint8(index++);// one byte of length
                val = dataViewObject.getIntByByte(index,len);
                //val = dataViewObject.getInt32(index);
                switch(attribute){
                    case ATTRIBUTE_CODES.ACTION:// one byte
                        headerObject.actn = val;//int
                        break;

                    case ATTRIBUTE_CODES.SERVER_PACKET_ID:
                        headerObject.pckFs = val;//long
                        break;

                    case ATTRIBUTE_CODES.TOTAL_PACKET:
                        headerObject.total = val;//total number of packet int
                        break;

                    case ATTRIBUTE_CODES.PACKET_NUMBER:
                        headerObject.current = val;//current number of packet int
                        break;

                    case ATTRIBUTE_CODES.UNIQUE_KEY:
                        headerObject.key = val;//packet Identification number long
                        break;

                    case ATTRIBUTE_CODES.DATA:
                        // for data len is in two byte so for returning to previsous byte
                        index--;
                        len = dataViewObject.getUint16(index);//reading int from two byte
                        index +=2;//incresing it by two byte
                        headerObject.data = dataViewObject.copy(index,len);
                        break;

                    case ATTRIBUTE_CODES.WEB_UNIQUE_KEY:// TODO : find use
                        break;
                    case ATTRIBUTE_CODES.WEB_TAB_ID:
                        headerObject.tabId = val;
                        break;

                    default:
                        console.log("Attribute COde Not Found" +attribute);
                        //len = (bytes[index++] & 0xFF);
                        break;


                }
                // if not returning from switch case, its means we find a match for header variable so moving index to len byte
                index += len;


            }
            return headerObject;
        };

        function parse(DataViewObject){
            /**
             * Data view object keeps buffer returning from server
             */
            var
                /**
                 * packet_type is the first byte of any packet represents the packet format
                 * 0 : the response contains complete json formatted data
                 * 2 : the response contains complete byte formatted data
                 * 1 : the response contains broken json formatted data needed to merge
                 * 3 : the response contains broken byte formatted data needed to merge
                 * */
                packet_type,
            // to keep header information after parsing
                header,
                bp_header,//broken packet header different from orginal packet header
                return_data,
                full_packet
                ;

            packet_type = DataViewObject.getUint8(0);// first byte represent what type of packet
            //return_data = header;
            switch (packet_type){
                case 0://json complete packet
                case 2://byte complete packet
                    header = parseHeader(DataViewObject,1);
                    if(header.actn === 200) {return header; }
                    if(packet_type === 0){// json complete packet
                        return_data = DataViewObject.getString(header.headerLength,DataViewObject.byteLength-header.headerLength);
                        try{
                            return_data = JSON.parse(return_data);
                            return_data = object_extend({},return_data,header);
                        }
                        catch(e){
                            Logger.log(e,return_data,"PARSE_ERROR");
                            return_data = false;

                        }
                        return return_data;
                        //return return_data ? angular.extend({},header,angular.fromJson(return_data)):false;
                    }else{// byte complete packet
                        // todo : byte processor
                        return_data = parserService(DataViewObject, header.headerLength);
                        return return_data ? object_extend({},return_data,header):false;
                    }

                    break;
                case 1:// json broken data
                case 3://byte broken data
                    bp_header = parseBrokenPacketHeader(DataViewObject,1);//broken packet header
                    //console.dir(bp_header);
                    if(!bp_header.key){ return false; }//returning if header key not found cause if key is not there then we can't identify broken packet
                    if(!packetDataStorage[bp_header.key]) { // packet with this key not present in the map
                        packetDataStorage[bp_header.key] = [];
                        packetDataStorage[bp_header.key].packetLength = 1;
                    }else{
                        packetDataStorage[bp_header.key].packetLength++;
                    }
                    packetDataStorage[bp_header.key][bp_header.current] = bp_header.data;

                    if(bp_header.total === packetDataStorage[bp_header.key].packetLength){ //all packet has arrived so marge it and parse as normal header
                        //if(bp_header.actn === 31)return false;
                        full_packet = packetDataStorage[bp_header.key].joinAsDataView();
                        delete packetDataStorage[bp_header.key];
                        header = parseHeader(full_packet,0);
                        if(packet_type === 1){// json broken packet

                            return_data = full_packet.getString(header.headerLength,full_packet.byteLength-header.headerLength);
                            try{
                                return_data = JSON.parse(return_data);
                                return_data = object_extend({},return_data,header);
                            }
                            catch(e){
                                return_data = false;
                                return false;
                            }
                            return return_data;


                            //return angular.extend({},header,angular.fromJson(return_data));
                        }else{// byte broken packet
                            // todo: byte processor
                            //console.log('broken packet');
                            return_data = parserService(full_packet, header.headerLength);
                            return return_data ? object_extend({},return_data,header):false;
                        }
                    }
                    return false;
            }

            //if(header.pckFs > 0){
            // TODO check if there needs to sent any confirmation message to the server
            //}
        };
        ReturnObject =  {
            parse : function(viewob){
                //viewob.print_r(true);
                //console.log(viewob.getString(0, viewob.byteLength));
                return parse(viewob);
            },
            addParser : function(action,fn){
                ByteParsers[action] = fn;
            }
        };

        return ReturnObject;

    }


    me.RingParser = RingParser(ATTRIBUTE_CODES,parserService(ATTRIBUTE_CODES));
    me.ATTRIBUTE_CODES = ATTRIBUTE_CODES;
}(self))

