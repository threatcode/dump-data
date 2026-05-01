/*
 * © Ipvision
 */

(function() {
	'use strict';

	angular
		.module('ringid.auth')
		.service('authHttpService', authHttpService);

	authHttpService.$inject = ['$$connector', '$ringhttp', 'settings', 'utilsFactory', 'OPERATION_TYPES'];
	function authHttpService ($$connector, $ringhttp,  settings, utilsFactory, OPERATION_TYPES) { //jshint ignore:line
		/*jshint validthis: true */
		var self = this,
            REQTYPE = OPERATION_TYPES.SYSTEM.REQUEST_TYPE,
            OTYPES = OPERATION_TYPES.SYSTEM,
			OTYPES_AUTH = OPERATION_TYPES.SYSTEM.AUTH;

            /**
            * @api {request} /APIREQUEST/20 Login
            * @apiVersion 0.1.0
            * @apiDescription Login User
            * @apiName Login
            * @apiGroup Auth
            *
            *
            * @apiParam {Number=20} actn AUTH.TYPE_SIGN_IN
            * @apiParam {Number} [dvc=5] Login Device. for Web it's 5
            * @apiParam {Number=1,2} lt Login Type i.e. 1 is Ringid and 2 is Country Code
            * @apiParam {Number} ringID Ring Id
            * @apiParam {Number} ringId Ring Id
            * @apiParam {Number} tbid Browser Tab Id
            * @apiParam {Number} uId Ring Id
            * @apiParam {Number=1015} vsn Version
            * @apiParam {Number} wk Undefined
            *
            * @apiParamExample {json} Request-Example:
            *   {
            *       actn: 20
            *       dvc: 5
            *       lt: 1
            *       ringID: "2110010091"
            *       ringId: "2110010091"
            *       tbid: 1
            *       uId: "2110010091"
            *       usrPw: "aaaaaa"
            *       vsn: 1015
            *       wk: "1177453575210"
            *   }
            *
            *
            * @apiSuccess {Number=20} actn AUTH.TYPE_SIGN_IN
            * @apiSuccess {String} authServer Auth Server Ip Address
            * @apiSuccess {Number} comPort Auth Server Port Number
            * @apiSuccess {String} el User Email Address
            * @apiSuccess {Number} emVsn Undefined
            * @apiSuccess {String} fn First Name
            * @apiSuccess {Number} iev Undefined
            * @apiSuccess {Number} lsts Undefined
            * @apiSuccess {String} mbl Mobile No
            * @apiSuccess {String} mblDc Country code
            * @apiSuccess {Number} mood Mood of User
            * @apiSuccess {String} oIP Undefined
            * @apiSuccess {Number} oPrt Undefined
            * @apiSuccess {String} prIm Profile Image Url
            * @apiSuccess {Number} prImId Profile Image Id
            * @apiSuccess {Boolean} pstd Undefined
            * @apiSuccess {String} sid Auth Session Id
            * @apiSuccess {Boolean} sucs Success or Failure
            * @apiSuccess {Number} uId User Id/ Ring Id
            * @apiSuccess {Number} utId  User Table Id
            *
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 20
            *       authServer: "38.127.68.50"
            *       comPort: 30091
            *       el: ""
            *       emVsn: 1
            *       fn: "showone"
            *       headerLength: 62
            *       iev: 0
            *       imnv: 0
            *       lsts: 2
            *       mbl: ""
            *       mblDc: ""
            *       mood: 1
            *       oIP: "38.127.68.55"
            *       oPrt: 0
            *       pckId: "1036450626207"
            *       prIm: ""
            *       prImId: 0
            *       pstd: true
            *       sId: "10438420939453842110010091"
            *       sucs: true
            *       uId: "2110010091"
            *       utId: 75
            *     }
            *
            * @apiError Album has no Image
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 200 Not Found
            *     {
            *       "sucs": false
            *     }
            */

		self.login = function(obj){

            if (obj.hasOwnProperty('silent') && obj.silent === true) {
                obj.actn = OTYPES.AUTH.TYPE_SIGN_IN;
                obj.vsn = settings.apiVersion;
                obj.wk = utilsFactory.getUniqueID(); // default for auth server
                obj.dvc = 5;
                obj.tbid = utilsFactory.tabId;

                return $$connector.request(obj, REQTYPE.AUTHENTICATION);
            } else {
                var payload = {
                        usrPw: obj.password,
                        actn: OTYPES.AUTH.TYPE_SIGN_IN,
                        lt: 1,
                        vsn: settings.apiVersion, // auth server version
                        wk: utilsFactory.getUniqueID(),
                        dvc: 5,
                        tbid: utilsFactory.tabId,
                        did: obj.did,
                    };



                switch(obj.authMethod) {
                    //case '+878': // ringid login
                    case 'ringid': // ringid login
                        payload.lt = 1;
                        payload.uId = !obj.remember ? '21' + obj.ringid : obj.ringid;
                        break;
                    case 'email': // email login
                        payload.lt = 3;
                        payload.el = obj.email.utf8Encode();
                        break;
                    case 'facebook':
                        payload.uId = obj.uId;
                        payload.pen = 1;
                        payload.lt = 4;
                        payload.apt = 1;
                        payload.smid = obj.id;
                        payload.it = obj.access_token;
                        delete payload.usrPw;
                        break;
                    case 'twitter':
                        payload.uId = obj.uId;
                        delete payload.usrPw;

                        payload.smid = obj.id;
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
                    default: // phone login
                        payload.lt = 2;
                        payload.mbl = obj.mbl;
                        payload.mblDc = obj.mblDc;
                }

                /* Remember Me Salt and Previous sID */
                if( !!obj.salt && !!obj.sId ){
                    payload.salt = obj.salt;
                    payload.sId = obj.sId;
                }

                return $$connector.request(payload, REQTYPE.AUTHENTICATION);

    		}
        };


        self.recoverySendCode = function(obj, sendSms) {
            var payload = {
				actn: OTYPES_AUTH.PASSWORD_RECOVER_SEND_CODE,
				wk: utilsFactory.getUniqueID(),
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

			return $$connector.request(payload, REQTYPE.AUTHENTICATION);
        };

        self.recoveryVerifyCode = function(obj) {
            var payload = {
				actn : OTYPES_AUTH.PASSWORD_RECOVER_VERIFY_CODE,
				uId : obj.uId,
				vc : obj.vc,
				wk : utilsFactory.getUniqueID(),
                lt : 1 // server dependency sendSms ? 2 : 3
            };

			return $$connector.request(payload, REQTYPE.AUTHENTICATION);
        };

        self.resetPassword = function(obj) {
            var payload = {
				actn : OTYPES_AUTH.PASSWORD_RECOVER,
				uId : obj.uId,
                nPw : obj.password,
				wk : utilsFactory.getUniqueID(),
                lt : 1 // server dependency  sendSms ? 2 : 3
            };

			return $$connector.request(payload, REQTYPE.AUTHENTICATION);
        };

            /**
            * @api {request} /APIREQUEST/21 Logout
            * @apiVersion 0.1.0
            * @apiDescription Logout User
            * @apiName Logout
            * @apiGroup Auth
            *
            *
            * @apiParam {Number=21} actn TYPE_SIGN_OUT
            *
            * @apiParamExample {json} Request-Example:
            *   {
            *       actn: 21
            *   }
            *
            *
            * @apiSuccess {Number=21} actn TYPE_SIGN_OUT
            * @apiSuccess {Number} id Undefined
            * @apiSuccess {Number} rc Undefined
            * @apiSuccess {Boolean} sucs Success or Failure
            * @apiSuccess {Number} uId User Id/ Ring Id
            *
            *
            * @apiSuccessExample Success-Response:
            *     HTTP/1.1 200 OK
            *     {
            *       actn: 22
            *       headerLength: 55
            *       id: 75
            *       pckId: "1409303629847"
            *       rc: 0
            *       sucs: true
            *       uId: "2110010091"
            *     }
            *
            * @apiError Album has no Image
            *
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 200 Not Found
            *     {
            *       "sucs": false
            *     }
            */


		self.logout = function() {
			var payload = {
				actn: OTYPES_AUTH.TYPE_SIGN_OUT
				//request_type: REQTYPE.AUTHENTICATION
			};
			return $$connector.request(payload,REQTYPE.AUTHENTICATION);
		};

		self.isValidSession = function(obj){
			return $$connector.request({
				actn : OTYPES_AUTH.TYPE_SESSION_VALIDATION,
                dvcc: 5,
				utId : obj.utId,
                did: obj.did
			}, REQTYPE.AUTHENTICATION);
		};

		self.signupInit = function(did) {
			return $ringhttp.get(settings.signupInit + 'did=' + did + '&time=' + new Date().getTime()) ;
		};

        self.signupSendCode = function(obj) {
            var emailSignup= (obj.authMethod === 'email') ? true : false;
            var payload  = {
				actn : (emailSignup) ? OTYPES_AUTH.SIGNUP_SEND_CODE_EMAIL : OTYPES_AUTH.SIGNUP_SEND_CODE_PHONE,
				wk : utilsFactory.getUniqueID(),
				uId: obj.uId,
                did: obj.did,
                lt: 1 // server dependency
            };
            if(emailSignup) {
                payload.el = obj.email.utf8Encode();
            } else {
                payload.mbl = obj.mbl;
                payload.mblDc = obj.mblDc;
            }

			return $$connector.request(payload, REQTYPE.AUTHENTICATION);
        };

        self.signupVerifyCode = function(obj) {
            var emailSignup= (obj.authMethod === 'email') ? true : false;
            var payload  = {
				actn : (emailSignup) ? OTYPES_AUTH.SIGNUP_SEND_CODE_EMAIL : OTYPES_AUTH.SIGNUP_SEND_CODE_PHONE,
				wk : utilsFactory.getUniqueID(),
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
			return $$connector.request(payload, REQTYPE.AUTHENTICATION);
        };


		self.signup = function(obj) {
            var payload  = {
                actn : OTYPES_AUTH.SIGNUP_REGISTER,
                wk : utilsFactory.getUniqueID(),
                uId: obj.uId,
                did: obj.did,
                nm: obj.name.utf8Encode(),
                usrPw: obj.password,
                lt: 1, // server dependency
                // for all signup mobile no is required these are new params
                ispc: 0, // default for auth server
                mbl : obj.mbl,
                mblDc : obj.mblDc
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

            return $$connector.request(payload, REQTYPE.AUTHENTICATION);

		};


        self.validMobileNo = function(obj) {
            return $ringhttp.get(settings.signupSocialInit + 'lt=' + obj.lt + '&mblDc=' + obj.mblDc + '&mbl=' + obj.mbl + '&apt=1&t' + new Date().getTime() );
            //lt={0}&mblDc={1}&mbl={2}&apt={3}&t={4}
        };

        // social signup and authentication part
		self.validSocialId = function(obj) {
            var url;
            if (obj.platform === 'facebook') {
                url = settings.signupSocialInit + 'fb=' + obj.id + '&lt=4';
            } else if (obj.platform === 'twitter') {
                url = settings.signupSocialInit + 'twtr=' + obj.id + '&lt=5';
            }

            return $ringhttp.get(url + '&time=' + new Date().getTime());
		};


	}

})();
