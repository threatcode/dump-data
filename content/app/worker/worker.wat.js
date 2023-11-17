    
    Array.prototype.joinAsDataView = function(){
            var me = this,currentIndex=0,dataViewLength= 0,buffer,view;
            if(!me.length)return new DataView(new ArrayBuffer(0)); // if no elements then just returns a DataView
            for(var i=0;i<me.length;i++){
                if(me[i] instanceof DataView){
                    dataViewLength += me[i].byteLength;
                }
            }
            if(!dataViewLength)return new DataView(new ArrayBuffer(0));
              buffer = new ArrayBuffer(dataViewLength);
              view = new DataView(buffer);
            for(var i=0;i<me.length;i++){
                if(me[i] instanceof DataView){
                    for(var j=0;j<me[i].byteLength;j++){
                        view.setUint8(currentIndex++,me[i].getUint8(j));
                    }
                }
            }
        return view;

    };
    if (!String.prototype.repeat) {
        String.prototype.repeat = function(count) {
           return Array(count+1).join(this);

        };
    }
    DataView.prototype.copy = function(offset,length){
       var me = this;
       offset = offset || 0;
       length = length || me.byteLength;
       // var diff = length-offset;
       var buffer = new ArrayBuffer(length);
       var view = new DataView(buffer);
       for(var i=0;i<length;i++){
           view.setUint8(i,me.getUint8(offset++));
       }
       return view
       // return new DataView(this.buffer,offset,length);
    };

    DataView.prototype.getString = function(offset,length){
        
          var str = '';
        
        offset = offset || 0;
        length = length || (this.byteLength - offset);

        if(length < 0) {
          length += this.byteLength;
        }

        for(var i = offset; i < (offset + length); i++) {
          str += String.fromCharCode(this.getUint8(i));
        }

        return decodeURIComponent(escape(str));
    };

    DataView.prototype.getIntByByte = function(offset,length){
        var me = this;
        switch (length){
            case 1:
                return me.getUint8(offset);
            case 2:
                return me.getUint16(offset);
            case 4:
                return me.getUint32(offset);
            case 6:
            case 8://javascript doesn't support 64-bit integer so we assuming first two byte in our system is not used. so we cropping it
                var str="", i,tempInt;
                for(i=offset;i<offset+length;i++){
                    tempInt = me.getUint8(i).toString(2);
                    str += tempInt.length < 8 ? "0".repeat(8-tempInt.length)+tempInt:tempInt;
                }
                return parseInt(str,2);
           default : return me.getUint8(offset);
        }
    };
      DataView.prototype.addAttributeInt = function(i,code,len,value){
       // console.info("index : "+ i + " attr : " + code +"\n");
        this.setUint8(i++,code);
       // console.info("index : "+ i + " len : " + len +"\n");
        this.setUint8(i++,len);
        //console.info("index : "+ i + " "+len+"val : " + value +"\n");
        switch(len){
            case 1:
                this.setUint8(i++,value);
                break;
            case 2:
                this.setUint16(i,value);
                i +=2;
                break;
            case 4:
                this.setUint32(i,value);
                i+=4;
                break;
        }
        return i;

    };
    DataView.prototype.addAttributeString = function(i,code,value){
       // console.info("index : "+ i + " attr : " + code +"\n");
        this.setUint8(i++,code);
       // console.info("index : "+ i + " "+value.length+" strval : " + value +"\n");
        this.setUint8(i++,value.length);
        for (var j = 0; j< value.length;j++) {
            this.setUint8(i++,value.charCodeAt(j));
        }
      return i;
    };
    DataView.prototype.addAttributeData = function(i,code,view,fromIndex,length){
        fromIndex = fromIndex || 0;
        length = length || view.byteLength;
        this.setUint8(i++,code);
        this.setUint16(i,length);
        i+=2;
        for(var j=0;j<length;j++){
            this.setUint8(i++,view.getUint8(fromIndex++));
        }
        return i;
    };
    DataView.prototype.getBool = function(offset){ // length is always one byte
        return this.getUint8(offset) === 1;
    };
    DataView.prototype.print_r = function(debug,starting,length){
    starting = starting || 0;
    length = length || this.byteLength;

    var str = "Index\t\tBinary\t\tInteger\t\tChar\n";
    var full="", c,inte;
    for(var i=starting;i<length;i++){
     inte = this.getUint8(i);
        c = String.fromCharCode(inte);

      str += i + "\t\t \t\t" + inte.toString(2) + "\t\t\t\t"+ inte + "\t\t\t\t"+c+"\n";
        full +=c;
    }
    if(!!debug && typeof debug !== 'string'){
        console.log(str);
        console.log("\n length : "+str.length);
    }else{
        return full;
    }

    console.log(full);

};
    // String.prototype.toCharCodeArray = function(){
    //     var codes = [];
    //     for (var i = 0; i < this.length;i++) {
    //         codes.push(this.charCodeAt(i));
    //     }
    //     return codes;
    // };
    function isObject(value) {
      // http://jsperf.com/isobject4
      return value !== null && typeof value === 'object';
    }
    function isDate(value) {
      return toString.call(value) === '[object Date]';
    }
    function isRegExp(value) {
      return toString.call(value) === '[object RegExp]';
    }
    function isFunction(value) {return typeof value === 'function';}
    function isElement(node) {
      return !!(node && node.nodeName);
    }
    function isString(value) {return typeof value === 'string';}
    var objectFreeze  = (Object.freeze) ? Object.freeze : noop;
    function baseExtend(dst, objs, deep) {         // var h = dst.$$hashKey;

          for (var i = 0, ii = objs.length; i < ii; ++i) {
            var obj = objs[i];
            if (!isObject(obj) && !isFunction(obj)) continue;
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
              var key = keys[j];
              var src = obj[key];

              if (deep && isObject(src)) {
                if (isDate(src)) {
                  dst[key] = new Date(src.valueOf());
                } else if (isRegExp(src)) {
                  dst[key] = new RegExp(src);
                } else if (src.nodeName) {
                  dst[key] = src.cloneNode(true);
                }else {
                  if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
                  baseExtend(dst[key], [src], true);
                }
              } else {
                dst[key] = src;
              }
            }
          }

          //setHashKey(dst, h);
          return dst;
     }
    function object_extend(dst) {

      return baseExtend(dst,Array.prototype.slice.call(arguments,1));
    }
    function getUniqueId(prefix){
            if (!prefix){
                prefix = '';
            }
            return prefix + "" + Math.floor(Math.random() * (new Date()).getTime());
        };
