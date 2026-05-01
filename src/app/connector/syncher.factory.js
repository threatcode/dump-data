
    angular
        .module('ringid.connector')
        .factory('$$rgsyncher',rgSynchar);

        rgSynchar.$inject = ['$$stackedMap','$rootScope', 'Utils']; // injecting rootscope to digest changes

        function rgSynchar($$stackedMap,$rootScope, Utils){
            /*
            * rgSynchar
            *
            *
            * */

            var syncfns = $$stackedMap.createNew();

            var _synch = function(){//to manually fire focus event
                if(syncfns.length() > 0)
                    process();
            };

            var process = function(){
                var scopeToDigest;
                syncfns.doForAll(function(fn){
                    scopeToDigest = fn.call(null); // fn should return scope to digest if any changes occurs
                    if(!!scopeToDigest && !scopeToDigest.$$phase){
                        scopeToDigest.$digest();//safe digesting the current scope
                    }
                });
            };

            $rootScope.$on('ringActive', _synch);

            return {
                add : function(fn){
                    var key = Utils.getUniqueID();
                    syncfns.add(key,fn);
                    return key
                },
                remove : function(key){
                    return syncfns.remove(key);
                },
                synch : _synch
            };
        }


