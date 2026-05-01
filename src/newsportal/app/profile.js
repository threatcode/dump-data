$(function () {

    var utils = portalUtils;

    // var changePassword = $('#changePassword');
    var changePasswordForm = $('#changePasswordForm');
    var editProfile = $('#editProfile');
    var editProfileForm = $('#editProfileForm');
    var basicInfoListing = $('#basicInfoListing');
    var resetPassWordForm = $('#resetPassWordForm');
    var resetEditForm = $('#resetEditForm');

    // var editPortalInfoForm = $('#editPortalInfoForm');


    var editPortalInfoForm = $('#editPortalInfoForm');
    var editPortalButton = $('#editPortalButton');
    var portalInfo = $('#portalInfo');

    var profileListingTab = $('#profileListingTab');

    profileListingTab.on('click','li',function () {

        $(this).parent().find('li.selected').removeClass("selected");
        $(this).addClass('selected');
        hideAllRightContent();
        var targetContent = $(this).data('content');
        $('.'+targetContent).show();
    });


    function hideAllRightContent() {
        $('.basic-content, .password-content, .portal-content').hide();
    }

    editPortalButton.on('click',function () {
        editPortalInfoForm.toggle();
        portalInfo.toggle();
    });
    editProfile.on('click',function () {
        // changePasswordForm.hide();
        basicInfoListing.toggle();
        editProfileForm.toggle();
    });

    // changePassword.on('click',function () {
    //     changePasswordForm.toggle();
    // });
    //
    //
    // function hideProfile() {
    //     basicInfoListing.hide();
    //     editProfileForm.hide();
    // }

    if(editPortalInfoForm.length) {
        var portalForm = editPortalInfoForm.validate({
            submitHandler: function(form) {
                changePortalInfoSubmit();
                swal({
                    title:'Portal Slogan',
                    text:'Please wait, while portal slogan and category changing',
                    type:'info',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                });
                swal.enableLoading();
                return false;
            },
            rules: {
                editSlogan: {required: true},
                portalCategory:{required:true}

            },
            messages: {
                editSlogan: {required: 'Please insert slogan'},
                portalCategory:{required:'Please insert portal category'}
            }
        });
    }


    //Form Validation for password reset.
    if (changePasswordForm.length) {

      var passwordForm =  changePasswordForm.validate({
            submitHandler: function(form) {
                changePasswordSubmit();
                swal({
                    title:'Password change!',
                    text:'Please wait, while password change complete',
                    type:'info',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                });
                swal.enableLoading();
                passwordForm.resetForm();
                return false;
            },
            rules: {
                currentPass: {
                    required: true
                },
                newPass:{required:true},
                confirmNewPass:{ equalTo: '#newPass'}
            },
            messages: {
                currentPass: {
                    required: 'Please insert current password'
                },
                newPass:{required:'Please insert new password'},
                confirmNewPass:{equalTo:'Password does not match the confirm password'}
            }
        });
    }

    resetPassWordForm.click(function () {
        passwordForm.resetForm();
    });


    function changePortalInfoSubmit() {
        var slogan = $('#editSlogan').val();
        var categoryId = $('#portalCategory').val();
        var catName = $("#portalCategory option:selected").text();



        var payload =  {
            pType: 3,
            npDTO: {
                nPCatId: categoryId,
                nPslgn: slogan
            },
            actn: 25,
            pckId:utils.getUniqueId(),
            sId:utils.StorageFactory.getCookie('sId')
        };

        // console.log('News Edit Data ::::::::::::', payload);
        $$connector.request(payload,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE).then(function (json) {
            // console.log('Edit Result !!!!!!!',json);

            utils.StorageFactory.setCookie('nPslgn',slogan);
            utils.StorageFactory.setCookie('nPCatId',categoryId);
            utils.StorageFactory.setCookie('nPCatName',catName);
            utils.setUserDetailsToUI();
            setUserProfileDetails();
            if(json.sucs) {
                swal({
                    type:'success',
                    title:'Updated Successfully',
                    text:'Your portal slogan and type changed successfully'
                });
            } else {
                swal({
                    type:'error',
                    title:'Error occurred!',
                    text:json.mg
                });
            }
        })
    }
    function changePasswordSubmit() {
        var cPass = $('#currentPass').val();
        var nPass = $('#newPass').val();
        var cnPass = $('#confirmNewPass').val();


        var passChange = {
            actn:OPERATION_TYPES.SYSTEM.PROFILE.CHANGE_PASSWORD,
            nPw:nPass,
            oPw:cPass,
            pckId:utils.getUniqueId(),
            sId:utils.StorageFactory.getCookie('sId')
        };

        console.log('News Edit Data ::::::::::::', passChange);
        $$connector.request(passChange,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE).then(function (json) {
            console.log('Edit Result !!!!!!!',json);
            if(json.sucs) {
                // changePassword.trigger('click');
                swal({
                    type:'success',
                    title:'Password changed',
                    text:'Your password changed successfully',
                    timer:2000
                });
            } else {
                swal({
                    type:'error',
                    title:'Error occurred!',
                    text:json.mg
                });
            }
        })
    }
    

    //Form Validation for Profile update .
    if (editProfileForm.length) {

        var editForm =  editProfileForm.validate({
            submitHandler: function(form) {
                changeProfileSubmit();
                swal({
                    type:'info',
                    title:'Profile change request!',
                    text:'Please wait, while profile change completed',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                });
                swal.enableLoading();
                return false;
            },
            rules: {
                fullName: {
                    required: true
                },
                aboutMe:{required:true},
                currentCity:{required:true}
            },
            messages: {
                fullName: {
                    required: 'Please insert full name'
                },
                aboutMe:{required:'Please insert about yourself'},
                currentCity:{required:'Please insert current city'}
            }
        });
    }

    resetEditForm.click(function () {
        editForm.resetForm();
    });

    function changeProfileSubmit() {
        var fullName = $('#fullName').val();
        var currentCity = $('#currentCity').val();
        var aboutMe = $('#aboutMe').val();


        var profileChange = {
            actn:OPERATION_TYPES.SYSTEM.NOTIFICATION.MSG_TYPE_YOU_HAVE_BEEN_TAGGED,
            am:aboutMe,
            cc:currentCity,
            fn:fullName,
            nOfHd:7,
            pType: 3,
            pckId:utils.getUniqueId(),
            sId:utils.StorageFactory.getCookie('sId')
        };
        console.log('profileChange Data ::::::::::::', profileChange);
        $$connector.request(profileChange,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE).then(function (json) {
            console.log('Edit Result !!!!!!!',json);
            if(json.sucs) {
                // populateUserDetails(fullName,currentCity,aboutMe);
                utils.StorageFactory.setCookie('cc',currentCity);
                utils.StorageFactory.setCookie('am',aboutMe);
                utils.StorageFactory.setCookie('fn',fullName);
                utils.setUserDetailsToUI();
                setUserProfileDetails();
                editProfile.trigger('click');
                swal({
                    type:'success',
                    title:'Profile changed',
                    text:'Your profile changed successfully'
                });
            } else {
                swal({
                    type:'error',
                    title:'Error occurred!',
                    text:json.mg
                });
            }
        })
    }
    
    function setUserProfileDetails() {
        var aboutMe = portalUtils.StorageFactory.getCookie('am');
        var fullName = portalUtils.StorageFactory.getCookie('fn');
        var currentCity = portalUtils.StorageFactory.getCookie('cc');

        var slogan = portalUtils.StorageFactory.getCookie('nPslgn');
        var categoryName = portalUtils.StorageFactory.getCookie('nPCatName');
        var categoryId = portalUtils.StorageFactory.getCookie('nPCatId') || 0;




        $('#npSlogan').text(slogan);
        $('#npCategory').text(categoryName);


        $('#editSlogan').val(slogan);
        $('#portalCategory').html(catModule.generateCategoryListSelectBox('portalCatList',categoryId));

        $('#uName').text(fullName);
        $('#uCity').text(currentCity);
        $('#uAbout').text(aboutMe);

        $('#fullName').val(fullName);
        $('#currentCity').val(currentCity);
        $('#aboutMe').val(aboutMe);

        // populateUserDetails(fullName,currentCity,aboutMe);

    }
    // function populateUserDetails(fullName,currentCity,aboutMe) {
    //     $('#uName').text(fullName);
    //     $('#uCity').text(currentCity);
    //     $('#uAbout').text(aboutMe);
    //
    //     $('#fullName').val(fullName);
    //     $('#currentCity').val(currentCity);
    //     $('#aboutMe').val(aboutMe);
    // }
    setUserProfileDetails();
    catModule.callTypeCategoryList();

});