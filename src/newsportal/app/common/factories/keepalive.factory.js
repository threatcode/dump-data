
(function(){
    "use strict";


    var keepalive = angular.module("ringid.keepalive",['ringid.config'])
        .service("keepalive",['$interval','settings',function($interval,settings){
            var self =this;

            self.init = function() {};

            //self.init = function(){
            //
            //    //$interval(function(){
            //    //    //$http.get(settings.baseUrl + 'secure/APILoginCheck').success(function(){
            //    //       // console.log("Keep Alive");
            //    //    //});
            //    //},30000);
            //
            //};

        }]);
})();
