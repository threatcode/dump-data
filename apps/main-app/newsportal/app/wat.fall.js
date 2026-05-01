
(function(window,DataView){
    'use strict';
// ie8 wat
//    /**
//      window.emojiSupported
//      window.eventFix
//      window.scrollToYOffset
//      Function.prototype.bind
//
//      ##string features
//      String.prototype.format
//      String.prototype.supplant
//      String.prototype.repeat
//      String.prototype.trim
//      String.prototype.utf8Encode
//      String.prototype.toCharCodeArray
//
//      ##array feature added##
//      Array.prototype.indexOf
//      Array.prototype.contains
//      Array.prototype.filter
//      Array.prototype.difference
//      Array.prototype.joinAsDataView
//
//      ## dataview feature added
//      DataView.prototype.copy
//      DataView.prototype.merge
//      DataView.prototype.addAttributeInt
//      DataView.prototype.addAttributeString
//      DataView.prototype.addAttributeData
//      DataView.prototype.print_r
//      DataView.prototype.getString
//      DataView.prototype.getIntByByte
//      DataView.prototype.setUint64
//      DataView.prototype.getBool
//      DataView.prototype.getUint24
//    */

    window.emojiSupported = (function() {
  	  var node = document.createElement('canvas');
  	  if (!node.getContext || !node.getContext('2d') || typeof node.getContext('2d').fillText !== 'function') return false;
  	  var ctx = node.getContext('2d');
  	  ctx.textBaseline = 'top';
  	  ctx.font = '32px Arial';
  	  ctx.fillText('\ud83d\ude03', 0, 0);
  	  return ctx.getImageData(16, 16, 1, 1).data[0] !== 0;
	})();

    window.eventFix = function(e){

        e = e || window.event;

        var pageX = e.pageX;
        var pageY = e.pageY;
        if (pageX === undefined) {
            pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            pageY = e.clientY + document.body.scrollTop + document.documentElerment.scrollTop;
        }
    }

    window.scrollToYOffset = function(targetYOffset, scrollDuration) {
        console.log(targetYOffset);
        var scrollStep = targetYOffset / (scrollDuration / 15),
        scrollInterval = setInterval(function(){
            console.log(window.scrollY," tar",targetYOffset);
            if ( window.scrollY < targetYOffset ) {
                window.scrollBy( 0, scrollStep );
            }else clearInterval(scrollInterval);
        }, 15);
    };

    if (!Function.prototype.bind) {
      Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
          // closest thing possible to the ECMAScript 5
          // internal IsCallable function
          throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
              return fToBind.apply(this instanceof fNOP
                     ? this
                     : oThis,
                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
          // native functions don't have a prototype
          fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();

        return fBound;
      };
    }

   if (!String.prototype.format) {
        String.prototype.format = function() {
          var args = Object.prototype.toString.call(arguments[0] ) === '[object Array]' ?arguments[0]:arguments;
          return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
          });
        };
      }

    if (!String.prototype.supplant) {
        String.prototype.supplant = function (o) {
            return this.replace(
                /\{([^{}]*)\}/g,
                function (a, b) {
                    var r = o[b];
                    return typeof r === 'string' || typeof r === 'number' ? r : a;
                }
            );
        };
    }

    if (!String.prototype.repeat) {
        String.prototype.repeat = function(count) {
           return Array(count+1).join(this);

        };
    }
    if (!String.prototype.trim) {
          String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
          };
     }

    String.prototype.utf8Encode = function(){
       return unescape(encodeURIComponent(this));
    };

    String.prototype.toCharCodeArray = function(){
        var codes = [];
        for (var i = 0; i < this.length;i++) {
            codes.push(this.charCodeAt(i));
        }
        return codes;
    };

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*/) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
                from += len;
            }

            for (; from < len; from++) {
                if (from in this && this[from] === elt) { return from; }
            }
            return -1;
        };
    }
    if (!Array.prototype.contains) {
        Array.prototype.contains = function(val,fn) { // fn is the function for equality match function if provided else it will macth whole object
            if(!fn)return this.indexOf(val);
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
                from += len;
            }

            for (; from < len; from++) {
                if (from in this && fn.call(this,this[from],val)){ return from; }
            }
            return -1;

        };
    }
    if (!Array.prototype.filter) {
          Array.prototype.filter = function(fun/*, thisArg*/) {
            'use strict';

            if (this === void 0 || this === null) {
              throw new TypeError();
            }

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== 'function') {
              throw new TypeError();
            }

            var res = [];
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
              if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                  res.push(val);
                }
              }
            }

            return res;
          };
    }

    if(!Array.prototype.keyValues){
        Array.prototype.keyValues = function(key){
            var index, values = [];
            for( index = 0; index < this.length; index++){
                if(!!this[index][key]){
                    values.push(this[index][key]);
                }

            }
            return values;
        };
    }

    if(!Array.prototype.values){
        Array.prototype.values = function(){
            var index, values = [];
            for( index = 0; index < this.length; index++){
                values.push(this[index]);
            }
            return values;
        };
    }


    //{utids : ""} considers all array element is instance of DataView and returns a DataView Object of all element after merge
    Array.prototype.joinAsDataView = function(){
            var self = this,currentIndex=0,dataViewLength= 0,buffer,view;
            if(!self.length)return new DataView(new ArrayBuffer(0)); // if no elements then just returns a DataView
            for(var i=0;i<self.length;i++){
                if(self[i] instanceof DataView){
                    dataViewLength += self[i].byteLength;
                }
            }
            if(!dataViewLength)return new DataView(new ArrayBuffer(0));
              buffer = new ArrayBuffer(dataViewLength);
              view = new DataView(buffer);
            for(var i=0;i<self.length;i++){
                if(self[i] instanceof DataView){
                    for(var j=0;j<self[i].byteLength;j++){
                        view.setUint8(currentIndex++,self[i].getUint8(j));
                    }
                }
            }
        return view;

    };

    Array.prototype.difference = function(elementsToRemove){
        if( !elementsToRemove || !elementsToRemove.length || !this.length){
            return this;
        }

        var mapElementsToRemove = {},
            outputArray = [],
            index = 0;


        /* Cache elementsToRemove Array */
        while( index < elementsToRemove.length ){

            mapElementsToRemove[elementsToRemove[index]] = true;
            index++;
        }

        for(index=0; index < this.length; index++ ){
            if( !mapElementsToRemove[ this[index] ] ){
                outputArray.push( this[index] )
            }
        }
        return outputArray;

    };

    DataView.prototype.copy = function(offset,length){
       //var self = this;
       //offset = offset || 0;
       //length = length || self.byteLength;
       //// var diff = length-offset;
       //var buffer = new ArrayBuffer(length);
       //var view = new DataView(buffer);
       //for(var i=0;i<length;i++){
       //     view.setUint8(i,self.getUint8(offset++));
       //}
       // return view
        return new DataView(this.buffer,offset,length);
    };
    DataView.prototype.merge = function(from,fromLength,toview,to,toLength){
        var self = this, i,j;
          var mergea = new DataView(this.buffer,from,fromLength),
            buf = new ArrayBuffer(mergea.byteLength+(toLength-to+1)),
            view = new DataView(buf);
        for(i=0;i<mergea.byteLength;i++){
            view.setUint8(i,mergea.getUint8(i));
        }
       // console.info("from : "+from +" fl : "+fromLength + " to :"+to + " length : "+toLength +" current : "+i +" to range" +torange);
        for(j=i;j<view.byteLength;j++){
            view.setUint8(j,toview.getUint8(to++));
        }
        return view;


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

    DataView.prototype.printBytes = function(){
        var bytes = [];
        for(var i=0;i<this.byteLength;i++){
            bytes.push(this.getUint8(i));
        }
        bytes.push(-1000);
        console.log(bytes.join('\n'));

    };

    DataView.prototype.getString = function(offset,length){
        var self = this,bitArray = [], firstByte, highSurrogate, lowSurrogate, codePoint;
        length = length || self.byteLength;

         /* utf8 format ref: http://www.fileformat.info/info/unicode/utf8.htm */

         while( length > 0  ) {
            firstByte = self.getUint8(offset);
            if(self.getUint8(offset) <= 127) {
              bitArray.push(self.getUint8(offset++));
              length--;
            }
            else if(self.getUint8(offset) >= 128 && self.getUint8(offset) <= 223) {

              bitArray.push(((self.getUint8(offset++) & 0x1F) << 6) | (self.getUint8(offset++) & 0x3F));
              length -=2;
            }
            else if(self.getUint8(offset) >= 224 && self.getUint8(offset) <= 239) {
              bitArray.push(((self.getUint8(offset++) & 0x1F) << 12) | ((self.getUint8(offset++) & 0x3F) << 6 | (self.getUint8(offset++) & 0x3F)));
              length -=3;
            }
            else {
               /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint */
               codePoint = ((self.getUint8(offset++) & 0x07) << 18) | (((self.getUint8(offset++) & 0x3F) << 12) | ((self.getUint8(offset++) & 0x3F) << 6 | (self.getUint8(offset++) & 0x3F)));
               codePoint -= 0x10000;
               highSurrogate = (codePoint >> 10) + 0xD800;
               lowSurrogate = (codePoint % 0x400) + 0xDC00;
               bitArray.push(highSurrogate, lowSurrogate);
               length -=4;
            }
        }

        //var func =  new Function("function(){ return String.fromCharCode("+bitArray.join(",")+");}");
        return String.fromCharCode.apply(null,bitArray);
        //return bitArray.length ? :'';
    };


	DataView.prototype.getStringUtf16 = function(length, offset, bom) {
		offset = offset | 0;
		length = length || (this.byteLength - offset);
		var littleEndian = false,
			str = '',
			useBuffer = false;

		if (typeof Buffer !== 'undefined') {
			str = [];
			useBuffer = true;
		}
		if (length < 0) {
			length += this.byteLength;
		}
		if (bom) {
			var bomInt = this.getUint16(offset);
			if (bomInt === 0xFFFE) {
				littleEndian = true;
			}
			offset += 2;
			length -= 2;
		}

		for(var i = offset; i < (offset + length); i += 2) {
			var ch = this.getUint16(i, littleEndian);
			if((ch >= 0 && ch <= 0xD7FF) || (ch >= 0xE000 && ch <= 0xFFFF)) {
				if (useBuffer) {
					str.push(ch);
				} else {
					str += String.fromCharCode(ch);
				}
			} else if(ch >= 0x10000 && ch <= 0x10FFFF) {
				ch -= 0x10000;
				if (useBuffer) {
					str.push(((0xFFC00 & ch) >> 10) + 0xD800);
					str.push((0x3FF & ch) + 0xDC00);
				} else {
					str += String.fromCharCode(((0xFFC00 & ch) >> 10) + 0xD800) + String.fromCharCode((0x3FF & ch) + 0xDC00);
				}
			}
		}
		if (useBuffer) {
			return str.toString();
		} else {
			return decodeURIComponent(escape(str));
		}
	}


    DataView.prototype.getIntByByte = function(offset,length){
        var self = this;
        switch (length){
            case 1:
                return self.getUint8(offset);
            case 2:
                return self.getUint16(offset);
            case 4:
                return self.getUint32(offset);
            case 6:
            case 8://javascript doesn't support 64-bit integer so we assuming first two byte in our system is not used. so we cropping it
                var str="", i,tempInt;
                for(i=offset;i<offset+length;i++){
                    tempInt = self.getUint8(i).toString(2);
                    str += tempInt.length < 8 ? "0".repeat(8-tempInt.length)+tempInt:tempInt;
                }
                return parseInt(str,2);
           default : return self.getUint8(offset);
        }
    };

    DataView.prototype.getSynch = function(num) {
        var out = 0,
        mask = 0x7f000000;
        while(mask) {
            out >>= 1;
            out |= num & mask;
            mask >>= 8;
        }
        return out;
    }

    //function isInt(value) {
    //    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
    //}
    //if(!Number.prototype.isInteger){
    //    Number.prototype.isInteger = function(){
    //        return !isNaN(value);
    //    };
    //};

    Number.isInteger = Number.isInteger || function(value) {
        return typeof value === "number" &&
            isFinite(value) &&
            Math.floor(value) === value;
    };
    /*ArrayBuffer.slice method polyfill for IE-10:starts: rabbi*/
    if (!ArrayBuffer.prototype.slice) {
        //Returns a new ArrayBuffer whose contents are a copy of this ArrayBuffer's
        //bytes from `begin`, inclusive, up to `end`, exclusive
        ArrayBuffer.prototype.slice = function (begin, end) {
            //If `begin` is unspecified, Chrome assumes 0, so we do the same
            if (begin === void 0) {
                begin = 0;
            }

            //If `end` is unspecified, the new ArrayBuffer contains all
            //bytes from `begin` to the end of this ArrayBuffer.
            if (end === void 0) {
                end = this.byteLength;
            }

            //Chrome converts the values to integers via flooring
            begin = Math.floor(begin);
            end = Math.floor(end);

            //If either `begin` or `end` is negative, it refers to an
            //index from the end of the array, as opposed to from the beginning.
            if (begin < 0) {
                begin += this.byteLength;
            }
            if (end < 0) {
                end += this.byteLength;
            }

            //The range specified by the `begin` and `end` values is clamped to the
            //valid index range for the current array.
            begin = Math.min(Math.max(0, begin), this.byteLength);
            end = Math.min(Math.max(0, end), this.byteLength);

            //If the computed length of the new ArrayBuffer would be negative, it
            //is clamped to zero.
            if (end - begin <= 0) {
                return new ArrayBuffer(0);
            }

            var result = new ArrayBuffer(end - begin);
            var resultBytes = new Uint8Array(result);
            var sourceBytes = new Uint8Array(this, begin, end - begin);

            resultBytes.set(sourceBytes);

            return result;
        };
    }
    /*ArrayBuffer.slice method polyfill for IE-10:ends: rabbi*/
    DataView.prototype.setUint64 = function(offset, value){
        var self = this;
        var binary = Number.isInteger(value) ? value.toString(2) : parseInt(value).toString(2);
        binary = binary.length < 64 ? "0".repeat(64-binary.length) + binary : binary;
        var binaryArray = binary.match(/.{1,32}/g);
        var intArray = binaryArray.map(function(binaryByte){
            return parseInt(binaryByte, 2);
        });
        // sorting won't be needed
        //intArray.sort(function(a, b) {
        // return a - b;
        //});//sorting in ascending order as we'll put byte in bigendian
        for(var i = 0; i< intArray.length; i++){
            self.setUint32(offset+i*4, intArray[i]);
        }
    };

    DataView.prototype.getBool = function(offset){ // length is always one byte
        return this.getUint8(offset) === 1;
    };
    /**
     * @description : ie can't sent dataview directly to socket. its sends Dataview.toString so its a pitfall for ie
     *    to send Uint8Array. note : ie can sent Uint8Array via socket
     */
    // DataView.prototype.toString = function(){
    //    return new Uint8Array(this.buffer).toString();
    // }

    
    /*Utilities DOM functions*/
    //matches polyfill
	window.Element && function(ElementPrototype) {
    	ElementPrototype.matches = ElementPrototype.matches ||
    	ElementPrototype.matchesSelector ||
   		ElementPrototype.webkitMatchesSelector ||
    	ElementPrototype.msMatchesSelector ||
    	function(selector) {
        	var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
        	while (nodes[++i] && nodes[i] != node);
        	return !!nodes[i];
    	}
	}(window.Element.prototype);

	// closest polyfill
	window.Element && function(ElementPrototype) {
    	ElementPrototype.closest = ElementPrototype.closest ||
    	function(selector) {
        	var el = this;
        	while (el.matches && !el.matches(selector)) el = el.parentNode;
        	return el.matches ? el : null;
    	}
	}(window.Element.prototype);
  
    window.requestAnimationFrame = window.requestAnimationFrame || 
                                    window.mozRequestAnimationFrame || 
                                    window.webkitRequestAnimationFrame ||
                                    window.msRequestAnimationFrame;


    DataView.prototype.getUint24 = function(offset, littleEndian) {
		if(littleEndian) {
			return this.getUint8(offset) + (this.getUint8(offset + 1) << 8) + (this.getUint8(offset + 2) << 16);
		}
		return this.getUint8(offset + 2) + (this.getUint8(offset + 1) << 8) + (this.getUint8(offset) << 16);
    };

    Math.easeIn = function (t, b, c, d) {

        t /= d/2;
        if (t < 1) {
            return c/2*t*t + b
        }
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };                                

    window.constant = function(key,value){
        Object.defineProperty(window,key,{
          enumerable: false,
          configurable: false,
          writable: false,
          value: value
        });

    }

    window.angular = {};
     angular.isObject = function (value) {
      // http://jsperf.com/isobject4
      return value !== null && typeof value === 'object';
    }
    angular.isDate = function (value) {
      return toString.call(value) === '[object Date]';
    }
    angular.isRegExp = function (value) {
      return toString.call(value) === '[object RegExp]';
    }
    angular.isFunction = function (value) {return typeof value === 'function';};
    angular.isDefined = function (value) {return typeof value === 'undefined';};
    angular.isArray = Array.isArray;

    angular.isElement = function (node) {
      return !!(node && node.nodeName);
    }
    angular.isString = function (value) {return typeof value === 'string';};
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

angular.extend = object_extend;
angular.fromJson = JSON.parse;
angular.toJson = JSON.stringify;
angular.noop = function(){};
angular.getUniqueID = function(prefix){
            if (!prefix){
                prefix = '';
            }

            return prefix + (window._cti|| "") + Math.floor(Math.random() * Date.now());
        };
angular.generateUUID = function() {
            var d = Date.now();
            if(window.performance && typeof window.performance.now === "function"){
                d += performance.now(); //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        };
})(window,DataView);

// date custom format extending
