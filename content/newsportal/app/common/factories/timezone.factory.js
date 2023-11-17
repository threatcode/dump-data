
(function(Date){
    "use strict";


     angular.module("ringid.timezone")
        .factory("TIMER",timezoneFactory);


    timezoneFactory.$inject = [];
    function timezoneFactory(){
        var returnOb,ServerTimezoneOffset,clientTimezoneOffset;


        returnOb = {

        };

        return returnOb;
    }
})(Date);