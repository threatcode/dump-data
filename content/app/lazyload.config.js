
angular
    .module('ringid')
    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            modules: [{
                name: 'ringid.digits',
                files: [
                    'https://cdn.digits.com/1/sdk.js',
                    'js/build/modules/ringid.digits.module.js',
                    'js/build/app/digits/ringid.digits.module.js'
                ]
            }]
        });

    }]);
