

angular
    .module('ringid.digits')
    .directive('rgVerifyPhone', rgVerifyPhone);

    rgVerifyPhone.$inject = ['$ringhttp', 'settings', '$http', 'Auth', 'Ringalert', 'MESSAGES', 'digitsService', 'Storage', '$compile'];
    function rgVerifyPhone($ringhttp, settings, $http, Auth, Ringalert, MESSAGES, digitsService, Storage, $compile) {

        function linkFunc(scope, element) {
            var template,
                activated = false;

            function onFail(response) {
                
            }
            function onSuccess(response) {
                
                // set iframe height to 100 %
                var iFrame = template.find('iframe');
                if (iFrame) {
                    iFrame[0].style.height = '100%';
                }

                var oAuthHeaders = response.oauth_echo_headers,
                verifyData = {
                    authHeader: oAuthHeaders['X-Verify-Credentials-Authorization'],
                    apiUrl: oAuthHeaders['X-Auth-Service-Provider']
                };

                //$http.post('https://dev.ringid.com:7777/DigitsService', verifyData).then(function(response) {
                $http.post(settings.digitsServiceUrl, verifyData).then(function(response) {
                    if (response.data.phoneNumber && response.data.phoneNumber.length > 1) {
                        var phoneNo = {
                                mbl: '',
                                mblDc: ''
                            },
                            countryCode,
                            digitResponseNo = response.data.phoneNumber,
                            countryList = Auth.getCountryList();

                        

                        for(var k=0;k<countryList.length;k++){
                            countryCode = digitResponseNo.substr(0, countryList[k].code.length);
                            if (countryList[k].code === countryCode){
                                phoneNo.mblDc = countryList[k].code;
                                phoneNo.mbl = digitResponseNo.substr(countryList[k].code.length);
                                break;
                            }
                        }
                        
                        scope.verify()(phoneNo);
                    } else {
                         Ringalert.show(MESSAGES['REQUEST_FAILED']);
                    }
                });

            }



            function activate() {
                activated = true;
                template = $compile('<div class="verify-phone"></div>')(scope);
                element.after(template);

                var countryCode = '',
                    country = Storage.getData('country');
                if (country && country.hasOwnProperty('code')) {
                    countryCode = country.code;
                }

                digitsService.initialize();
                /* Theme the Digits widget. */
                Digits.embed({
                  container: '.verify-phone',
                  phoneNumber: countryCode,
                  theme: {
                    accent: 'F47727',       // Buttons & Links
                    //background: '002747',   // Transparent by defaul
                    //label: 'FFF',           // Titles and text
                    //border: '324F67'        // Input fields borders
                  }
                })
                //Digits.logIn()
                .done(onSuccess)
                .fail(onFail);

                scope.$rgDigest();
            }

            function deactivate() {
                activated = false;
                if (template) {
                    template.remove();
                }
            }


            scope.$watch('enabled', function(newVal){
                if (newVal && !activated) {
                    activate();
                } else if (!newVal && activated){
                    deactivate();
                }
            });
        }

        return {
            restrict: 'E',
            scope: {
                verify: '&',
                enabled: '='
            },
            link: linkFunc
        };
    }
