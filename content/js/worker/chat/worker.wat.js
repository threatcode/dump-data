(function workerWatIIFE(self) {
    if (typeof Object.assign !== 'function') {
        (function objectAssignIIFE() {
            Object.assign = function objectAssign(target) {
                var output,
                    source,
                    index,
                    nextKey;

                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                output = Object(target);
                for (index = 1; index < arguments.length; index++) {
                    source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (nextKey in source) {
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

    if (!self.isObject) {
        self.isObject = function isObject(value) {
            return !!value && typeof value === 'object';
        };
    }

    if (!Array.isArray) {
        Array.isArray = function isArray(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }

    if (!String.prototype.format) {
        String.prototype.format = function stringFormat() {
            var args = Object.prototype.toString.call(arguments[0]) === '[object Array]' ? arguments[0] : arguments;
            return this.replace(/{(\d+)}/g, function regxMatchHandler(match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        };
    }

    /* ArrayBuffer.slice method polyfill for IE-10:ends: rabbi*/
    DataView.prototype.setUint64 = function setUint64(offset, value) {
        var _self = this,
            binary,
            binaryArray,
            i,
            intArray;

        binary = Number.isInteger(value) ? value.toString(2) : parseInt(value, 10).toString(2);
        binary = binary.length < 64 ? '0'.repeat(64 - binary.length) + binary : binary;
        binaryArray = binary.match(/.{1,32}/g);
        intArray = binaryArray.map(function aBinaryArrayHandler(binaryByte) {
            return parseInt(binaryByte, 2);
        });
        // sorting won't be needed
        // intArray.sort(function(a, b) {
        // return a - b;
        // });//sorting in ascending order as we'll put byte in bigendian
        for (i = 0; i < intArray.length; i++) {
            _self.setUint32(offset + (i * 4), intArray[i]);
        }
    };

    Number.isInteger = Number.isInteger || function isInteger(value) {
        return typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value;
    };

    if (typeof Promise !== 'function') {
        (function PromiseWatFall(root) {
            // Store setTimeout reference so promise-polyfill will be unaffected by
            // other code modifying setTimeout (like sinon.useFakeTimers())
            var setTimeoutFunc = setTimeout,
                isArray,
                asap,
                onUnhandledRejection;

            function noop() {}

            // Use polyfill for setImmediate for performance gains
            /* eslint-disable */
            if (!(typeof setImmediate === 'function' && setImmediate)) {
                asap = function asapWrapper(fn) {
                    setTimeoutFunc(fn, 1);
                };
            } else {
                asap = setImmediate;
            }
            /* eslint-enable */

            onUnhandledRejection = function _onUnhandledRejection() {
                if (typeof console !== 'undefined' && console) {
                    // console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
                }
            };

            // Polyfill for Function.prototype.bind
            function bind(fn, thisArg) {
                return function bindWrapper() {
                    fn.apply(thisArg, arguments);
                };
            }

            isArray = Array.isArray || function _isArray(value) {
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

            function handle(__self, deferred) {
                var _self = __self;
                while (_self._state === 3) {
                    _self = _self._value;
                }
                if (_self._state === 0) {
                    _self._deferreds.push(deferred);
                    return;
                }

                _self._handled = true;
                asap(function warapperAsap() {
                    var cb = _self._state === 1 ? deferred.onFulfilled : deferred.onRejected,
                        ret;

                    if (cb === null) {
                        (_self._state === 1 ? resolve : reject)(deferred.promise, _self._value);
                        return;
                    }
                    try {
                        ret = cb(_self._value);
                    } catch (e) {
                        reject(deferred.promise, e);
                        return;
                    }
                    resolve(deferred.promise, ret);
                });
            }

            function resolve(__self, newValue) {
                var _self = __self,
                    then;

                try {
                    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
                    if (newValue === _self) throw new TypeError('A promise cannot be resolved with it_self.');
                    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                        then = newValue.then;
                        if (newValue instanceof Promise) {
                            _self._state = 3;
                            _self._value = newValue;
                            finale(_self);
                            return;
                        } else if (typeof then === 'function') {
                            doResolve(bind(then, newValue), _self);
                            return;
                        }
                    }
                    _self._state = 1;
                    _self._value = newValue;
                    finale(_self);
                } catch (e) {
                    reject(_self, e);
                }
            }

            function reject(__self, newValue) {
                var _self = __self;
                _self._state = 2;
                _self._value = newValue;
                finale(_self);
            }

            function finale(__self) {
                var _self = __self,
                    len,
                    i;

                if (_self._state === 2 && _self._deferreds.length === 0) {
                    setTimeout(function setTimeoutHandler() {
                        if (!_self._handled) {
                            onUnhandledRejection(_self._value);
                        }
                    }, 1);
                }

                for (i = 0, len = _self._deferreds.length; i < len; i++) {
                    handle(_self, _self._deferreds[i]);
                }
                _self._deferreds = null;
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
            function doResolve(fn, __self) {
                var done = false,
                    _self = __self;
                try {
                    fn(function fnSuccessWrapper(value) {
                        if (done) return;
                        done = true;
                        resolve(_self, value);
                    }, function fnFailureWrapper(reason) {
                        if (done) return;
                        done = true;
                        reject(_self, reason);
                    });
                } catch (ex) {
                    if (done) return;
                    done = true;
                    reject(_self, ex);
                }
            }

            Promise.prototype.catch = function onCatch(onRejected) {
                return this.then(null, onRejected);
            };

            Promise.prototype.then = function onSuccess(onFulfilled, onRejected) {
                var prom = new Promise(noop);
                handle(this, new Handler(onFulfilled, onRejected, prom));
                return prom;
            };

            Promise.all = function promiseAll() {
                var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);

                return new Promise(function PromiseHandler(promiseResolve, promiseReject) {
                    var remaining,
                        then,
                        index;

                    if (args.length === 0) return promiseResolve([]);
                    remaining = args.length;

                    function res(i, val) {
                        try {
                            if (val && (typeof val === 'object' || typeof val === 'function')) {
                                then = val.then;
                                if (typeof then === 'function') {
                                    then.call(val, function _then(value) {
                                        res(i, value);
                                    }, promiseReject);
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

                    for (index; index < args.length; index++) {
                        res(index, args[index]);
                    }
                });
            };

            Promise.resolve = function onResolve(value) {
                if (value && typeof value === 'object' && value.constructor === Promise) {
                    return value;
                }

                return new Promise(function __promiseWrapper(_resolve) {
                    _resolve(value);
                });
            };

            Promise.reject = function _reject(value) {
                return new Promise(function rejectWraper(_resolve, promiseReject) {
                    promiseReject(value);
                });
            };

            Promise.race = function race(values) {
                return new Promise(function promiseHandler(promiseResolve, promiseReject) {
                    var i,
                        len;

                    for (i = 0, len = values.length; i < len; i++) {
                        values[i].then(promiseResolve, promiseReject);
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

    if (typeof rgPromise !== 'function') {
        (function RgPromiseWrapper(root) {
            function RgPromise(fn) {
                var that = this,
                    _promise = new Promise(function promiseHandler(resolve, reject) {
                        that.resolve = resolve;
                        that.reject = reject;
                        fn(resolve, reject);
                    });

                _promise.resolve = that.resolve;
                _promise.reject = that.reject;

                return _promise;
            }

            root.RgPromise = RgPromise;
        })(this);
    }
})(self);
