    
    angular
            .module('ringid.global_services')        
            .service('userService', userService);


            userService.$inject = ["userFactory", "Utils"];
            function userService(userFactory, Utils){

                var self = this;
                var _callbacks = {};
                var _callbackMaps = {};
                var _requestMap = {};  

                var running = false;              

                self.register = function(uId, func, contex, autoUnregister){
                    if( typeof autoUnregister == 'undefined' ) autoUnregister = true;

                    if( !uId ){
                        
                        return;
                    }

                    var args = arguments;
                    var that = self;

                    if( !_callbacks[uId] ){
                        _callbacks[uId] = []
                    }

                    var key = Utils.getUniqueID('us');

                    _callbackMaps[key] = function(){
                        func.call(contex, args);
                        if( autoUnregister ) that.unregister(key);
                    }

                    _callbacks[uId].push(key);

                    self.start();

                    return key;

                };

                self.trigger = function(uId){

                    if(!_callbacks[uId]) return;

                    var _newCallbacks = [];
                
                    _callbacks[uId].forEach(function(aCallbackKey){                        

                        if( !_callbackMaps[aCallbackKey] ) return;

                        _callbackMaps[aCallbackKey].call(null);

                        if( !!_callbackMaps[aCallbackKey] ){ 
                            _newCallbacks.push(aCallbackKey); 
                        }

                    });                    

                    _callbacks[uId] = _newCallbacks;

                };

                self.unregister = function(key){                    
                    if( !_callbackMaps[key] ) return;
                    delete _callbackMaps[key];                
                    
                };

                self.fetchUser = function(anId){

                    if( !!_requestMap[anId] ) return;

                    _requestMap[anId] = true;

                    userFactory.createByUId(anId, function(response){
                        delete _requestMap[anId];                        
                        
                        self.start();

                    });

                    self.start();

                }


                self.start = function(){
                    
                    if( !!running ) return;

                    running = true;

                    setTimeout(function(){

                        var idsList = Object.keys(_callbacks);

                        for(var index = 0; index < idsList.length; index++ ){
                            var anId = idsList[index];
                            
                            var user = userFactory.getUser(anId);
                            if( !user || !user.hasDetails() ){                        
                                self.fetchUser(anId);                                            
                            }else{
                                self.trigger(anId);    
                            }
                        }

                        running = false;

                    });
                                        

                };

            }


