/*jslint bitwise:true */

;(function(PacketIDGenerator){


    var lastTimestamp = 0;
    var LOOP_MAX = 50;
    var START_EPOCH = makeEpoch();
    var GREGORIAN_OFFSET = 122192928000000000;

    function makeEpoch(){
        return Date.UTC(1582, 9, 15);
    }

    function getTimeFieldValues(time) {    
        var ts = fromUnixTimeStamp(time);    
        var hm = ((ts / 0x100000000) * 10000) & 0xFFFFFFF;
        return { low: ((ts & 0xFFFFFFF) * 10000) % 0x100000000,
            mid: hm & 0xFFFF, hi: hm >>> 16, timestamp: ts };
    }

    function fromUnixTimeStamp(currentTime){
        return currentTime - START_EPOCH;
    }

    function getNowTimestamp(){
        //return Date.UTC(2001, 10,10)
         return new Date().getTime();
        // return 1005350400000;
    }

    function getPacketIdTimestampFromCurrentTime(currentTime){
        var now, candidate;

        var index = 0;

        while(index++ < LOOP_MAX){

            now = currentTime;
            //console.log('Now ', now, makeEpoch());

            if( now > lastTimestamp ){
                // console.log('PAKCETGEN now > lastTimestamp', lastTimestamp, 'CHAT');
                lastTimestamp = now;
                return now;
            }else{

                if( now < lastTimestamp ){
                    // console.log('PAKCETGEN  lastTimestamp + 1', lastTimestamp + 1, 'CHAT');
                    return lastTimestamp + 1;
                }

                candidate = lastTimestamp + 1;

                if( candidate == lastTimestamp ){
                    // console.log('PAKCETGEN candidate == lastTimestamp', lastTimestamp, 'CHAT');
                    lastTimestamp = candidate;
                    return candidate;
                }
            }
        }
        return candidate;
    }

    function create(userId, timestamp, isPacketIdStamp) {
        try{
            userId = parseInt(userId);
        }catch(e){
            console.error('Invalid User Id Provided for PacketIDGenerator');
            return "";
        }

        var packetIdTimeStamp;
        if(!isPacketIdStamp){
            if(!timestamp){
                timestamp = getNowTimestamp();
            }

            packetIdTimeStamp = getPacketIdTimestampFromCurrentTime(timestamp);

        }else{
            packetIdTimeStamp = timestamp;
        }

        var tf = getTimeFieldValues(packetIdTimeStamp);

        tf.hi = (tf.hi | 0x1000);

        //console.log(tf);
        
        return fromParts(tf.low, tf.mid, tf.hi, userId);
    }

    function paddedString(string, length, z) {
        string = String(string);
        z = (!z) ? '0' : z;
        var i = length - string.length;
        for (; i > 0; i >>>= 1, z += z) {
            if (i & 1) {
                string = z + string;
            }
        }
        return string;
    }

    function fromParts(timeLow, timeMid, timeHiAndVersion, userId) {
        if( timeLow < 0 ){
            console.error('Invalid time in packetIdgen');
        }

        var uuid =  paddedString(timeLow.toString(16), 8) +
            '-' + paddedString(timeMid.toString(16), 4) +
            '-' + paddedString(timeHiAndVersion.toString(16), 4) +
            '-' + paddedString((0x0000).toString(16), 4) +
            '-' + paddedString(userId.toString(16), 12);

        //console.log('Time Low ' + timeLow);
        //console.log('Time Mid ' + timeMid);
        //console.log('Time timeHiAndVersion ' + timeHiAndVersion);
        //console.log('UUID', uuid);

        return uuid;
    }

    function getTimestamp(uuidString){
        var uuidArr = uuidString.split( '-' ),
            timeStr = [
                uuidArr[ 2 ].substring( 1 ),
                uuidArr[ 1 ],
                uuidArr[ 0 ]
            ].join( '' );

        var timeInt = parseInt( timeStr, 16 );
        timeInt -= GREGORIAN_OFFSET;

        var timeIntMill = Math.floor(timeInt/10000);
        return timeIntMill;

    }

    function _PacketIDGenerator(){}
    _PacketIDGenerator.prototype.create = create;
    _PacketIDGenerator.prototype.getTimestamp = getTimestamp;

    PacketIDGenerator = PacketIDGenerator || new _PacketIDGenerator();

    window['PacketIDGenerator'] = PacketIDGenerator;

})(window.PacketIDGenerator);

//var timestamp = new Date().getTime();
//console.log(timestamp);
//var id = PacketIDGenerator.create(2110010524, timestamp, true);
//console.log(id);
//timestamp1 = PacketIDGenerator.getTimestamp(id);
//console.log(timestamp1);

/***

var id = PacketIDGenerator.create(2110010524);
console.log(id);

13224643200000
e22c4000-d56d-11d5-0000-00007dc4349c


13671783478602
78e19aa0-b825-11e5-0000-00007dc4349c


13671783503417
87ac1290-b825-11e5-0000-00007dc4349c


13671783517819
9041a4b0-b825-11e5-0000-00007dc4349c

13671783594580
be027140-b825-11e5-0000-00007dc4349c

***/
