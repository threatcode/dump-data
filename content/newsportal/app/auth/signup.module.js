var signupModule = function(){
    var utils = portalUtils,
        getIds = {
            _sId : utils.StorageFactory.getCookie('sId'),
            _uId : utils.StorageFactory.getCookie('uId'),
            _utId : utils.StorageFactory.getCookie('utId'),
            _did :utils.generateUUID()
        };

    return {
        _init:function(){
            return RingHttp.get(settings.signupInit + 'did=' + getIds._did + '&time=' + new Date().getTime()) ;
        },
        credentials: {
            username: '', // only used for AutoFill login form. a placeholder for browser autofill to work properly
            authMethod: 'email',
            uId: '',
            lt: 2,
            email: 'princesust@gmail.com',
            ringid: '',
            password: '',
            remember: StorageFactory.getData('remember') ? true : false,
            mbl: '',
            mblDc: '+880',
            flagcode: '',
            isnp:true,
            nPslgn:'',
            did:getIds._did
        },
        getNewRingId:function(userData){
            // console.log('getRingId method called');
            var self = this;
            this.credentials.email = userData.portalEmail;
            this.credentials.password = userData.portalPassword;
            this.credentials.portalName = userData.portalName;
            this.credentials.mbl = userData.portalPhone;
            this.credentials.mblDc = userData.countryCode;
            this.credentials.nPslgn = userData.portalSlogan;
            // this.credentials.nPCatId = userData.portalCategory;
            this.credentials.callback = userData.callback;



            this._init().success(function(response) {
                if (response.success === true) {
                    console.log('ringID generation success response', response);
                    self.credentials.ringid = response.ringID;
                    self.credentials.uId = response.ringID;
                    utils.setCookies(response,30);
                    self.signupSendCode().then(function(json) {
                        self.credentials.callback(json);
                    }, function(errJson) {
                        RingLogger.print(errJson,RingLogger.tags.AUTH);
                    });

                } else {
                    alert('failed');
                }
            }).error(function() {
                RingLogger.alert('fetching new ringid failed', RingLogger.tags.AUTH);
                // defer.reject();
            });
        },

        recoverySendCode : function(obj, sendSms) {

            var payload = {
                actn: OPERATION_TYPES.SYSTEM.AUTH.PASSWORD_RECOVER_SEND_CODE,
                wk:  utils.getUniqueId()
            };

            if(sendSms) {
                payload.lt = 2;
                payload.rb = obj.mbl;
                payload.mbl = obj.mbl;
                payload.mblDc = obj.mblDc;
            } else {
                payload.lt = 3;
                payload.rb = obj.email;
                payload.el = obj.email.utf8Encode();
            }
            return $$connector.request(payload, OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION);
        },
        recoveryVerifyCode : function(obj) {

            var payload = {
                actn : OPERATION_TYPES.SYSTEM.AUTH.PASSWORD_RECOVER_VERIFY_CODE,
                uId : obj.uId,
                vc : obj.vc,
                wk : utils.getUniqueId(),
                lt : 1 // server dependency sendSms ? 2 : 3
            };

            return $$connector.request(payload, OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION);
        },

        resetPassword : function(obj) {
            var payload = {
                actn :OPERATION_TYPES.SYSTEM.AUTH.PASSWORD_RECOVER,
                uId : obj.uId,
                nPw : obj.password,
                wk : utils.getUniqueId(),
                lt : 1 // server dependency  sendSms ? 2 : 3
            };

            return $$connector.request(payload,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION);
        },

        signupSendCode : function() {
            var obj = this.credentials;
            var emailSignup= (obj.authMethod === 'email') ? true : false;
            var payload  = {
                actn : (emailSignup) ?
                    OPERATION_TYPES.SYSTEM.AUTH.SIGNUP_SEND_CODE_EMAIL : OPERATION_TYPES.SYSTEM.AUTH.SIGNUP_SEND_CODE_PHONE,
                wk : utils.getUniqueId(),
                uId: obj.uId,
                did: obj.did,
                lt: 1 // server dependency
            };
            if(emailSignup) {
                payload.el = obj.email.utf8Encode();
            }
            // else {
            //     payload.mbl = obj.mbl;
            //     payload.mblDc = obj.mblDc;
            // }

            return $$connector.request(payload, OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION);
        },
        signupVerifyCode : function(vc,pw) {
            var obj = signupModule.credentials;
            obj.vc = vc;

            var emailSignup= (obj.authMethod === 'email') ? true : false;
            var payload  = {
                actn : (emailSignup) ?
                    OPERATION_TYPES.SYSTEM.AUTH.SIGNUP_SEND_CODE_EMAIL :
                    OPERATION_TYPES.SYSTEM.AUTH.SIGNUP_SEND_CODE_PHONE,
                wk : utils.getUniqueId(),
                uId: obj.uId,
                did: obj.did,
                lt: 1 // server dependency
            };
            if(emailSignup) {
                payload.el = obj.email.utf8Encode();
                payload.evc = obj.vc;
            } else {
                payload.mbl = obj.mbl;
                payload.mblDc = obj.mblDc;
                payload.vc = obj.vc;
            }
            return $$connector.request(payload, OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION);
        },
        signup :function() {
            // alert('signup calling');
            var obj = this.credentials;
            var payload  = {
                actn : OPERATION_TYPES.SYSTEM.AUTH.SIGNUP_REGISTER,
                wk : utils.getUniqueId(),
                uId: obj.uId,
                did: obj.did,
                nm: obj.portalName.utf8Encode(),
                usrPw: obj.password,
                lt: 1, // server dependency
                // for all signup mobile no is required these are new params
                ispc: 0, // default for auth server
                mbl : obj.mbl,
                mblDc : obj.mblDc,
                isnp: obj.isnp,
                nPslgn: obj.nPslgn,
                nPCatId:obj.nPCatId
                // mbl : obj.mbl,
                // mblDc : obj.mblDc
            };



            switch(obj.authMethod) {
                case 'email':
                    payload.el = obj.email.utf8Encode();
                    payload.evc = obj.vc;
                    break;
                case 'facebook':
                    payload.fb = obj.id;
                    payload.it = obj.access_token;
                    payload.lt = 4;
                    break;
                case 'twitter':
                    payload.twtr = obj.id;
                    //var tokenObj = {
                    //url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
                    //qs: 'oauth_timestamp=' + obj.oauthParameters.oauth_timestamp + '&oauth_version=' + obj.oauthParameters.oauth_version + '&oauth_consumer_key=' + obj.oauthParameters.oauth_consumer_key +
                    //'&oauth_signature=' + obj.oauthParameters.oauth_signature + '&oauth_token=' + obj.access_token + '&oauth_nonce=' + obj.oauthParameters.oauth_nonce + '&oauth_signature_method=' + obj.oauthParameters.oauth_signature_method
                    //};
                    //payload.it = JSON.stringify(tokenObj);
                    //payload.it = 'oauth_token=' + obj.oauth_token +  '&verifier=' + obj.oauth_verifier;
                    payload.it = obj.access_token;
                    payload.lt = 5;
                    break;
                default:
                    // with mobile
                    payload.mbl = obj.mbl;
                    payload.mblDc = obj.mblDc;
                    payload.vc = obj.vc;
                //payload.lt = 1; // server dependency
            }
            console.log('payload for signup');
            console.log(payload);
            return $$connector.request(payload, OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION);
        },
         loginRequest:function(userId,password,callback) {
             // var callbackFunc = callback;
            var payload = {
                usrPw: password,
                actn: OPERATION_TYPES.SYSTEM.AUTH.TYPE_SIGN_IN,
                vsn: settings.apiVersion, // auth server version
                wk: utils.getUniqueId(),
                dvc: 5,
                tbid: window._cti,
                did: utils.generateUUID(),
                lt : 1,
                uId : "21"+userId
            };
             console.log('::::::::::::::::::::::::::payload for login request::::::::::::::::::::::',payload);
             RingLogger.print(payload,"LOGIN");
             $$connector.request(payload,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION).then(function (json) {
                 RingLogger.print(json,"LOGGED IN");
                 portalUtils.setCookies(json, 30);
                 $$connector.keepAlive();
                 callback(json);
             });
        },
        logout:function () {
            var payload = {
                actn: OPERATION_TYPES.SYSTEM.AUTH.TYPE_SIGN_OUT
            };
            $$connector.request(payload,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION).then(function (res) {
                // if(res.sucs) {
                //     utils.deleteCookie();
                // }

            });
            StorageFactory.removeCookie('sessionID');
            window.location.href = '/';
        }

    }

}();