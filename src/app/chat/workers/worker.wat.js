;(function(self){

    if (typeof Object.assign != 'function') {
        (function () {
            Object.assign = function (target) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var output = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (var nextKey in source) {
                            if (source.hasOwnProperty(nextKey)) {
                                output[nextKey] = source[nextKey];
                            }
                        }
                    }
                }
                return output;
            };
        })();
    }

    if( !self.isObject){
        self.isObject = function(value) {
            return !!value && typeof value == 'object';
        }
    }

    if (!Array.isArray) {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
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

    Number.isInteger = Number.isInteger || function(value) {
        return typeof value === "number" &&
            isFinite(value) &&
            Math.floor(value) === value;
    };

    if (typeof Promise != 'function') {

        (function (root) {

          // Store setTimeout reference so promise-polyfill will be unaffected by
          // other code modifying setTimeout (like sinon.useFakeTimers())
          var setTimeoutFunc = setTimeout;

          function noop() {
          }

          // Use polyfill for setImmediate for performance gains
          var asap = (typeof setImmediate === 'function' && setImmediate) ||
            function (fn) {
              setTimeoutFunc(fn, 1);
            };

          var onUnhandledRejection = function onUnhandledRejection(err) {
            if (typeof console !== 'undefined' && console) {
              //console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
            }
          };

          // Polyfill for Function.prototype.bind
          function bind(fn, thisArg) {
            return function () {
              fn.apply(thisArg, arguments);
            };
          }

          var isArray = Array.isArray || function (value) {
            return Object.prototype.toString.call(value) === '[object Array]';
          };

          function Promise(fn) {
            if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
            if (typeof fn !== 'function') throw new TypeError('not a function');
            this._state = 0;
            this._handled = false;
            this._value = undefined;
            this._deferreds = [];

            doResolve(fn, this);
          }

          function handle(self, deferred) {
            while (self._state === 3) {
              self = self._value;
            }
            if (self._state === 0) {
              self._deferreds.push(deferred);
              return;
            }
            self._handled = true;
            asap(function () {
              var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
              if (cb === null) {
                (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                return;
              }
              var ret;
              try {
                ret = cb(self._value);
              } catch (e) {
                reject(deferred.promise, e);
                return;
              }
              resolve(deferred.promise, ret);
            });
          }

          function resolve(self, newValue) {
            try {
              // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
              if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
              if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                var then = newValue.then;
                if (newValue instanceof Promise) {
                  self._state = 3;
                  self._value = newValue;
                  finale(self);
                  return;
                } else if (typeof then === 'function') {
                  doResolve(bind(then, newValue), self);
                  return;
                }
              }
              self._state = 1;
              self._value = newValue;
              finale(self);
            } catch (e) {
              reject(self, e);
            }
          }

          function reject(self, newValue) {
            self._state = 2;
            self._value = newValue;
            finale(self);
          }

          function finale(self) {
            if (self._state === 2 && self._deferreds.length === 0) {
              setTimeout(function() {
                if (!self._handled) {
                  onUnhandledRejection(self._value);
                }
              }, 1);
            }

            for (var i = 0, len = self._deferreds.length; i < len; i++) {
              handle(self, self._deferreds[i]);
            }
            self._deferreds = null;
          }

          function Handler(onFulfilled, onRejected, promise) {
            this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
            this.onRejected = typeof onRejected === 'function' ? onRejected : null;
            this.promise = promise;
          }

          /**
           * Take a potentially misbehaving resolver function and make sure
           * onFulfilled and onRejected are only called once.
           *
           * Makes no guarantees about asynchrony.
           */
          function doResolve(fn, self) {
            var done = false;
            try {
              fn(function (value) {
                if (done) return;
                done = true;
                resolve(self, value);
              }, function (reason) {
                if (done) return;
                done = true;
                reject(self, reason);
              });
            } catch (ex) {
              if (done) return;
              done = true;
              reject(self, ex);
            }
          }

          Promise.prototype['catch'] = function (onRejected) {
            return this.then(null, onRejected);
          };

          Promise.prototype.then = function (onFulfilled, onRejected) {
            var prom = new Promise(noop);
            handle(this, new Handler(onFulfilled, onRejected, prom));
            return prom;
          };

          Promise.all = function () {
            var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);

            return new Promise(function (resolve, reject) {
              if (args.length === 0) return resolve([]);
              var remaining = args.length;

              function res(i, val) {
                try {
                  if (val && (typeof val === 'object' || typeof val === 'function')) {
                    var then = val.then;
                    if (typeof then === 'function') {
                      then.call(val, function (val) {
                        res(i, val);
                      }, reject);
                      return;
                    }
                  }
                  args[i] = val;
                  if (--remaining === 0) {
                    resolve(args);
                  }
                } catch (ex) {
                  reject(ex);
                }
              }

              for (var i = 0; i < args.length; i++) {
                res(i, args[i]);
              }
            });
          };

          Promise.resolve = function (value) {
            if (value && typeof value === 'object' && value.constructor === Promise) {
              return value;
            }

            return new Promise(function (resolve) {
              resolve(value);
            });
          };

          Promise.reject = function (value) {
            return new Promise(function (resolve, reject) {
              reject(value);
            });
          };

          Promise.race = function (values) {
            return new Promise(function (resolve, reject) {
              for (var i = 0, len = values.length; i < len; i++) {
                values[i].then(resolve, reject);
              }
            });
          };

          /**
           * Set the immediate function to execute callbacks
           * @param fn {function} Function to execute
           * @private
           */
          Promise._setImmediateFn = function _setImmediateFn(fn) {
            asap = fn;
          };

          Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
            onUnhandledRejection = fn;
          };

          if (typeof module !== 'undefined' && module.exports) {
            module.exports = Promise;
          } else if (!root.Promise) {
            root.Promise = Promise;
          }

    })(this);





    }


})(self);
