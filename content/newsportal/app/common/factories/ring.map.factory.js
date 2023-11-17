(function () {
    "use strict";
    angular
        .module('ringid.common.stacked_map', [])
        .factory('$$stackedMap', function () {
            return {
                createNew: function (dosort, order) {
                    var stack = [], self = this;
                    var sortedKeys = [];
                    var valueMap = {};

                    dosort = dosort || false;
                    order = order || "desc";

                    //function sortIt(){
                    //    stack.sort(function(a,b){
                    //        return (order === 'desc')? b.value['sortBy']() - a.value['sortBy']():a.value['sortBy']() - b.value['sortBy']();
                    //    });
                    //}
                    function sortIt(prop_index) {
                        prop_index = prop_index || 'sortBy';
                        var gt = -1, lt = 1;
                        if (order === 'desc') {
                            gt = 1;
                            lt = -1;
                        }
                        stack.sort(function (a, b) {
                            if (b.value[prop_index]() > a.value[prop_index]())
                                return gt;
                            if (a.value[prop_index]() > b.value[prop_index]())
                                return lt;
                            return 0;
//                                return (order === 'desc') ? b.value[prop_index]() > a.value[prop_index]() : a.value[prop_index]() > b.value[prop_index]();
                        });
                    }
                    function getIndex(key) {
                        if( !valueMap[key]){
                            return -1;
                        }else{
                            return valueMap[key].index;
                        }
                    }

                    function navigateNext(key) {
                        var index = getIndex(key);
                        if (index === -1 || index === (stack.length - 1))
                            return false;

                        return stack[index + 1].value;

                    }

                    function navigatePrevious(key) {
                        var index = getIndex(key);
                        if (index === -1 || index === 0)
                            return false;

                        return stack[index - 1].value;

                    }


                     return {
                        concat:  function(stackedMap) {
                            stack = stack.concat(stackedMap);

                        },
                        reset: function () {
                            stack.length = 0;
                        },
                        all: function () {
                            return stack;
                        },
                        setStack: function (st) {
                            stack = st;
                        },
                        add: function (key, value) {
                            /*** Legacy Support ***/

                            stack.push({
                                key: key,
                                value: value
                            });

                            if(!valueMap[key]){
                                valueMap[key] = {};
                            }

                            valueMap[key].index = stack.length - 1;
                            valueMap[key].value = value;


                            if (dosort !== false) {
                                sortIt();
                            }
                            return false;
                        },
                        next: function (key) {
                            return navigateNext(key);
                        },
                        previous: function (key) {
                            return navigatePrevious(key);
                        },
                        getIndex: function (key) {
                            return getIndex(key);
                        },
                        get: function (key) {
                            var i = getIndex(key);
                            return i >= 0 ? stack[i].value : !1;
                        },
                        save: function (key, value) {
                            var idx;
                            idx = getIndex(key);
                            if (idx === -1) {
                                this.add(key, value);//pushing if not existing index
                            } else {
                                stack[idx] = {key: key, value: value};//saving if existing index
                            }
                            if (dosort !== false) {
                                sortIt();
                            }
                        },
                        sort: function (type, prop_index) {
                            if (type)
                                order = type;
                            sortIt(prop_index);

                        },

                        keys: function () {
                            var keys = [];
                            for (var i = 0; i < stack.length; i++) {
                                keys.push(stack[i].key);
                            }
                            return keys;
                        },
                        top: function (withIndex) {
                            if(!stack.length)return false;
                            withIndex = !!withIndex;//
                            return (withIndex) ?stack[stack.length - 1] : stack[stack.length - 1].value;
                        },
                        bottom: function(withIndex) {
                            if(!stack.length)return false;
                            withIndex = !!withIndex;//
                            return (withIndex) ?stack[0] : stack[0].value;
                        },
                        sliceBy: function (length, starting_index) {
                            //if(!length)return stack;
                            if (!starting_index)starting_index = 0;
                            if (length > stack.length || !length)length = stack.length;
                            return stack.slice(starting_index, length);
                        },


                        remove: function (key) {
                            var idx = getIndex(key);
                            return idx > -1 ? stack.splice(idx, 1)[0]:[];
                        },
                        removeTop: function () {
                            return stack.splice(stack.length - 1, 1)[0];
                        },
                        length: function () {
                            return stack.length;
                        },
                        nonClosedLength: function(){
                            var count = 0;
                            //var boxesArray = boxes.all();
                            angular.forEach(stack, function(box, key){
                                count += box.closedBox ? 1 : 0;
                            });
                            return count;
                        },
                        copy: function () { // shallow copy pushing just into a new stack but the value reference is same
                            var ob = self.createNew(dosort, order);
                            for (var i = 0; i < stack.length; i++) {
                                ob.add(stack[i].key, stack[i].value);
                            }
                            return ob;
                        },
                        doForAll : function(fn){ // looping through all and process a function
                            for (var i = 0; i < stack.length; i++) {
                               fn.call(null,stack[i].value);
                            }
                        }
                    };
                }
            };
        });
})();
//{"dvc":5,"lot":1429161670578,"actn":175,"rc":0,"chIp":"38.127.68.55","sucs":true,"fndId":"2000003519","pckId":"20000045691429161692648","psnc":2,"chRp":1500,"pckFs":172412}
//{"dvc":5,"lot":1429161692821,"actn":175,"rc":0,"chIp":"38.127.68.55","sucs":true,"fndId":"2000004569","psnc":2,"chRp":1500,"pckFs":172412}
