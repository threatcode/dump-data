/*
 * © Ipvision
 */


	angular
		.module('ringid.social')
        .constant('socialConfig', {
            providers: {
                facebook: {
                    name: 'facebook',
                    url: '/auth/facebook',
                    clientId:  '477404429103451',  // ringid
                    authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
                    redirectUri: window.location.origin + '/static-index.html',
                    requiredUrlParams: ['access_code'],
                    scope: ['email'],
                    scopeDelimiter: ',',
                    display: 'popup',
                    type: '2.0',
                    popupOptions: { width: 680, height: 500 }
                },
                twitter: {
                    twitterApiURL: 'https://api.twitter.com/1.1/account/verify_credentials.json',
                    name: 'twitter',
                    url: '/auth/twitter',
                    authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
                    redirectUri: window.location.origin + '/static-index.html',
                    //function(whatFor) {
                        //return encodeURIComponent(window.location.origin + '/#/' + whatFor + '/twitter/' );
                    //},
                    type: '1.0',
                    //serverUrl: window.location.protocol + '//' + window.location.hostname+ ':9090/TwiteerLoginService',
                    serverUrl: window.location.origin + '/TwiteerLoginService',

                    popupOptions: { width: 595, height: 745 }
                },
            }
        });

