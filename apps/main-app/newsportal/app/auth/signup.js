// For checeking email already exists with this mail address
// http://devauth.ringid.com/rac/comports?el=sirat74%40yopmail.com&lt=3&t=1465895167884

$(function() {

    var loginSignupSelection = $('.loginSignupSelection');
    var loginSignupSelectionTop = $('#loginSignupSelectionTop');
    var signupSubmitButton = $('#signupSubmitButton');
    var verifyCodeButton = $('#verifyCodeButton');
    var loginSubmitButton = $('#loginSubmitButton');
    var logOutButton = $('#logOutButton');
    var countryListContainer = $('#countrylist');
    var singleFlag = $('#singleFlag');
    var searchCountry = $('#searchCountry');
    var signupForm = $('#signupForm');
    var loginForm = $('#loginForm');
    var recoverSendCodeForm = $('#recoverSendCodeForm');
    // var countryCode = $('#countryCode');
    // var verifyCode = $('#verifyCode');


    var forgetPassword = $('#forgetPassword');
    var verifySendCodeForm = $('#verifySendCodeForm');
    var resetPasswordForm = $('#resetPasswordForm');

    var resendVerificationCode = $('#resendVerificationCode');

     var portalEmail = $('#portalEmail');
     var portalPassword = $('#portalPassword');
    
    
    if(loginSignupSelectionTop.length) {
        loginSignupSelectionTop.click(function () {
            hideAllForm();
            var text = $(this).text().trim().toLowerCase();

            switch (text) {
                case 'signup':
                    $(this).text('Login');
                    signupForm.show();
                    break;
                case 'login' :
                    $(this).text('Signup');
                    loginForm.show();
                    break;
            }
        });
    }


    // if(loginSignupSelection.length) {
        loginSignupSelection.click(function () {
            var text = $(this).text().trim().toLowerCase();
            console.log('text::',text);
            hideAllForm();
            if(text=='login') {
                loginForm.show();
                loginSignupSelectionTop.text('Signup');
            } else if(text == 'signup') {
                signupForm.show();
                loginSignupSelectionTop.text('Login');
            }

           
        });
    // }

    if(resendVerificationCode.length) {
        resendVerificationCode.click(function () {
            swal({
                type:'info',
                title:'Resend code',
                text:'Please wait, verification code is resending',
                allowEscapeKey:false,
                allowOutsideClick:false
            });
            swal.enableLoading();

            signupModule.signupSendCode().then(function(json) {
                console.log('signup resend code status',json);
                if(json.sucs) {
                    swal({
                        type:'success',
                        title:'Code sent success',
                        text:'Verification code sent successfully'
                    });
                } else {
                    swal({
                        type:'error',
                        title:'Error',
                        text:json.mg
                    });
                }
            }, function(errJson) {
                RingLogger.print(errJson,RingLogger.tags.AUTH);
                // swal({
                //     type:'error',
                //     title:'Error',
                //     text:errJson.mg
                // });
            });
        });
    }

    // if(signupSubmitButton.length){
    //     signupSubmitButton.click(function () {
    function submitSignupForm() {
            var signupCredentials = {
                'portalEmail' : portalEmail.val(),
                'portalName' : $('#portalName').val(),
                'portalPassword' : portalPassword.val(),
                'portalPhone' : $('#portalPhone').val(),
                'countryCode' : $('#countryCode').text(),
                'portalSlogan': $('#portalSlogan').val(),
                // 'portalCategory': $('#portalCategory').val(),
                'callback':processSignup
            };
            console.log('signup details',signupCredentials);
            swal({
                title: 'Signup process going on....',
                type: 'info',
                html:'Please wait, An email verification code will be sent to your email ',
                allowEscapeKey:false,
                allowOutsideClick:false
            });
            swal.enableLoading();
            signupModule.getNewRingId(signupCredentials);
    }
    //     });
    // }

    function processSignup(res){
        if(res.sucs){
            hideAllForm();
            $('.toggle').hide();
            $('#emailVerifyMsg').text(res.mg);
            $('#emailVerifyCodeForm').show();
            swal.close();
        } else {
            var msg = res.mg ? res.mg : 'Something wrong';
            swal({
                title:'Error',
                text:msg,
                type:'error'
            });
        }
    }

    function hideAllForm() {
        signupForm.hide();
        loginForm.hide();
        recoverSendCodeForm.hide();
        verifySendCodeForm.hide();
        resetPasswordForm.hide();
        $('#emailVerifyCodeForm').hide();
    }
    function handleLoginResponse(json) {
        if(json.sucs) {
             swal.close();
            window.location.href = '/dashboard.html';
        } else {
            //show error message
            var errorMsg = json.mg?json.mg:'Something went wrong, Please try again after some time';
            console.log('login error::::::::',errorMsg);
            swal({
                title: 'Error',
                text: errorMsg,
                type: 'error'
            });
        }
    }

    // if(verifyCodeButton) {
    //     verifyCodeButton.click(function () {
    function submitVerifyCodeForm() {
        var verifyCode = $('#verifyCode').val();
        swal({
            title: 'Email verification...',
            type: 'info',
            html: 'Please wait, Email verification process is going on',
            allowEscapeKey:false,
            allowOutsideClick:false
        });
        swal.enableLoading();
        signupModule.signupVerifyCode(verifyCode).then(function (response) {
            console.log('verifyCode response');
            console.log(response);
            if(response.sucs) {
                signup();
            } else {
                var msg = response.mg ? response.mg : 'Something wrong';
                swal({
                    title:'Error',
                    type:'error',
                    text:msg
                });
            }

        })
    }
    function signup() {
        signupModule.signup().then(function (response) {
            if (response.sucs) {
                var loginId = response.uId.substring(2) ;
                signupModule.loginRequest(loginId, response.usrPw,function(res){
                    if(res.sucs){
                        swal({
                            title: 'Congratulation!',
                            text: 'Your Id is : '+loginId+' , Please keep it safely and it will be needed for login',
                            type: 'success'
                        }).then(function () {
                            window.location.href = '/dashboard.html';
                        })
                    } else {
                        console.log('login error::::::::::',res.mg);
                    }

                });
            } else {
                var msg = response.mg ? response.mg : 'Something wrong, Please try again';
                swal({
                    title: 'Error',
                    text: msg,
                    type: 'error'
                })
            }
        });
    }



    $("#_emailVerifyCodeForm").validate({
        submitHandler: function(form) {
            submitVerifyCodeForm();
        },
        rules: {
            verifyCode: {
                required: true
            }
        },
        messages: {
            verifyCode: {
                required: 'Verify code is required'
            }
        }
    });
    // if(loginSubmitButton) {
    //     loginSubmitButton.click(function () {
    function submitLoginForm() {

        var portalUserPassword = $('#portalUserPassword').val();
        var portalUserId = $('#portalUserId').val().replace(/\s/g, '');
        swal({
            title: 'Login, Please Wait',
            type: 'info',
            html: 'Please wait while Login....',
            allowEscapeKey:false,
            allowOutsideClick:false
        });
        swal.enableLoading();
        signupModule.loginRequest(portalUserId, portalUserPassword, handleLoginResponse);
        // signupModule.loginRequest(portalUserId, portalUserPassword, function(res){
        //     if(res.sucs){
        //         swal({
        //             title: 'Congratulation!',
        //             text: 'Your Id is : '+portalUserId+' , Please keep it safely and it will be needed for login',
        //             type: 'success'
        //         }).then(function () {
        //             window.location.href = '/dashboard.html';
        //         })
        //     } else {
        //         console.log('login error::::::::::',res.mg);
        //     }
        //
        // });

    }
    //     });
    // }

        $('#_signupForm').validate({
            submitHandler: function(form) {
                submitSignupForm();
            },
            rules: {
                portalEmail: {
                    required: true,
                    email:true
                },
                portalName:{
                    required:true
                },
                portalPassword:{
                    required:true
                },
                portalConfirmPassword:{
                    equalTo: '#portalPassword'
                },
                portalPhone:{
                    required:true
                },
                // portalCategory:{
                //     required:true
                // },
                portalSlogan:{
                    required:true
                }
            },
            messages: {
                portalEmail: {
                    required: 'Email is required',
                    email:'Please enter a valid email address'
                },
                portalName:{
                    required:'Portal name is required'
                },
                portalPassword:{
                    required:'Password is required'
                },
                portalConfirmPassword:{
                    equalTo: 'Password does not match the confirm password'
                },
                portalPhone:{
                    required:'Mobile number is required'
                },
                // portalCategory:{
                //     required:'Portal category is required'
                // },
                portalSlogan:{
                    required:'Slogan is required'
                }
            }
        });

        $("#_loginForm").validate({
            submitHandler: function(form) {
              submitLoginForm();
            },
            rules: {
                portalUserId: {
                    required: true
                },
                portalUserPassword:{
                    required:true
                }
            },
            messages: {
                portalUserId: {
                    required: 'User Id is required'
                },
                portalUserPassword:{
                    required:'Password is required'
                }
            }
        });

    if(countryListContainer.length) {
        portalUtils.loadCountryListJSON(function (res) {
            var countryList = JSON.parse(res);
            // console.log('Country list ::::::::::',countryList);
            if(countryList.length>0) {
                var li = '',len=countryList.length;
                for(var i=0;i<len;i++) {
                    li +='<a><li data-code="'+countryList[i].code+'" class="flag '+countryList[i].flagcode+'"><span>'+countryList[i].country+'</span></li></a>'
                }
                countryListContainer.append(li);
                // var options = {
                //     valueNames: ['countryName']
                // };

                // var userList = new List('countryListContainer', ['countryName']);
            }
        });
        countryListContainer.on('click','.flag',function () {
            var code = $(this).data('code');
            var cls = 'float-left '+$(this).attr('class');

            singleFlag.removeClass();
            singleFlag.addClass(cls);
            singleFlag.find('span').html(code);
            countryListContainer.hide();
            searchCountry.val('');
            countryListContainer.find('a').show();
        });
    }

    singleFlag.click(function () {
        countryListContainer.fadeIn('slow');
    });
    searchCountry.on('keyup', function () {
        var value = this.value.toLowerCase();
        countryListContainer.find('a').hide().each(function () {
            var liText = $(this).text().toLowerCase();
            if (liText.search(value) > -1) {
                $(this).show();
            }
        });
    });


    // if(logOutButton){
    //     logOutButton.addEventListener('click',function (e) {
    //         e.preventDefault();
    //         signupModule.logout();
    //     })
    // }



    var forgetPasswordCredentials = {};
    if(forgetPassword.length) {
        forgetPassword.click(function() {
            hideAllForm();
            recoverSendCodeForm.show();
        });
    }


    $("#_recoverSendCodeForm").validate({
        submitHandler: function(form) {
            swal({
                type:'info',
                title:'Sending verification code',
                text:'Please wait, verification code is sending',
                allowEscapeKey:false,
                allowOutsideClick:false
            });
            swal.enableLoading();
            forgetPasswordCredentials.email = $('#verifyEmail').val();
            signupModule.recoverySendCode(forgetPasswordCredentials, false).then(function(response) {
                console.log('Recover send code response ::::::::: ',response);
                swal.close();
                if(response.sucs) {
                    swal({
                        type:'success',
                        title:'Code sent success',
                        text:'Verification code sent successfully'
                    });
                    forgetPasswordCredentials.uId = response.uId;
                    hideAllForm();
                    verifySendCodeForm.show();
                } else {
                    swal({
                        type:'error',
                        title:'Error',
                        text:response.mg
                    });
                }
            });
        },
        rules: {
            verifyEmail: {
                required: true
            }
        },
        messages: {
            verifyEmail: {
                required: 'Email Id is required'
            }
        }
    });





    $('#_verifySendCodeForm').validate({
        submitHandler:function() {
            swal({
                type:'info',
                title:'Verify recovery code',
                text:'Please wait, recovery code verification is ongoing',
                allowEscapeKey:false,
                allowOutsideClick:false
            });
            swal.enableLoading();
            forgetPasswordCredentials.vc = $('#recoverVerifyCode').val();
            signupModule.recoveryVerifyCode(forgetPasswordCredentials).then(function(response) {
                console.log('Recovery verify code :::::::: ', response);
                swal.close();
                if(response.sucs) {
                    swal({
                        type:'success',
                        title:'Code verification success',
                        text:'Code verified successfully'
                    });
                    hideAllForm();
                    resetPasswordForm.show();
                } else {
                    swal({
                        type:'error',
                        title:'Error',
                        text:response.mg
                    });
                }
            });
        },

        rules: {
            recoverVerifyCode: {
                required: true
            }
        },
        messages: {
            recoverVerifyCode: {
                required: 'Recovery code is required'
            }
        }

    });





    $('#_resetPasswordForm').validate({
        submitHandler:function() {
            swal({
                type:'info',
                title:'Change Password',
                text:'Changing password',
                allowEscapeKey:false,
                allowOutsideClick:false
            });
            swal.enableLoading();
            forgetPasswordCredentials.password = $('#resetPass').val();
            signupModule.resetPassword(forgetPasswordCredentials).then(function(response) {
                console.log('Reset Password Response :::::::: ', response);
                swal.close();
                if(response.sucs) {
                    swal({
                        type:'success',
                        title:'Pass reset success',
                        text:'Password reset successfully'
                    });
                    hideAllForm();
                    loginForm.show();
                } else {
                    swal({
                        type:'error',
                        title:'Error',
                        text:response.mg
                    });
                }
            });
        },
        rules: {
            resetPass: {
                required: true
            },

            confirmResetPass: {
                equalTo: '#resetPass'
            }
        },
        messages: {
            resetPass: {
                required: 'Password field is required'
            },
            confirmResetPass: {
                equalTo: 'Pass and confirm pass field did not match'
            }
        }
    });




});
