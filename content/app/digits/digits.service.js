
angular
    .module('ringid.digits')
    .service('digitsService', digitsService);

    digitsService.$inject = ['settings'];
    function digitsService(settings) {
            var initDigit = false;

            this.initialize = function() {
                if(!initDigit){
                    Digits.init({ consumerKey: settings.digitsConsumerKey });
                    initDigit = true;
                }
            };

    }
