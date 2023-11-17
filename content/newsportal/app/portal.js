$(function () {

    var utils = portalUtils;
    utils.checkLogin();
    var categoryPost = $('#categoryPost');
    var categorySearch = $('#categorySearch');
    var postImages = $('#postImages');
    var logOutButton = $('#logOutButton');
    var postArticle = $('#postArticle');


    categoryPost.html(catModule.generateCategoryListSelectBox('catList'));
    categorySearch.html(catModule.generateCategoryListSelectBox('catList'));


    $('#report').click(function () {
        swal({
            title: 'Report',
            text: 'Coming soon',
            type: 'info',
            timer:3000
        });
    });

    $(document).on('click','.set-ico, .profileLogout,.dr-ico',function (e) {
        // e.stopPropagation();
        $(this).parent().find('.drop-box').toggle();
    });


    $(document).on('click','.lcs_button',function (e) {
        e.stopPropagation();
        $(this).parent().find('.top-dropbox').toggle();
    });

    $('body').click(function () {
        $('.drop-box').hide();
        $('.top-dropbox').hide();
    });


    //Form Validation for Article post
    if (postArticle.length) {

       var postArticleForm =  postArticle.validate({
            submitHandler: function(form) {
                feedModule.postFeed(utils.getArticleFormData(), imageProcessing.imageList).then(function (json) {
                    if (json.sucs) {
                        swal({
                            title: 'Successful',
                            type: 'success',
                            text: 'News posted successfully'
                        }).then(function () {
                            // var newsFeedList = json.newsFeedList;
                            var formatedFeed = feedModule.formatFeed(json);
                            feedModule.showFeed(formatedFeed, 1);
                            portalUtils.clearPostNewsForm();
                        })
                    } else {
                        var mg = json.mg ? json.mg : 'Something wrong, Please try again';
                        swal({
                            title: 'Error',
                            type: 'error',
                            text: mg
                        });
                    }
                });
                imageProcessing.imageList = [];
                imageProcessing.imageMetaList = [];
                swal({
                    type:'info',
                    title:'News Posting',
                    text:'Please wait, while news posting completed...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                });
                swal.enableLoading();
            },
            rules: {
                // longDescription: { required: true},
                shortDescription: { required: true},
                categoryPost:{required:true},
                postTitle:{required:true},
                postUrl:{url:true}
            },
            messages: {
                shortDescription: { required: 'Please insert short details' },
                longDescription: { required: 'Please insert long details' },
                categoryPost:{required:'Please select a category or create category from manage category section'},
                postTitle:{required:'Please insert post title'},
                postUrl:{url:'Please insert a valid url'}
            }
        });
    }

    $('#postArticleReset').click(function () {
        postArticleForm.resetForm();

        utils.clearPostNewsForm();

    });


    // $('ul')


    $('.articleImage').change(function () {
        var fileList = $(this).prop('files');
        imageProcessing.init(fileList,'image',utils.imageSlider);
    });
    postImages.on('click', '.imageUploadCancel', function () {
        var imageName = $(this).data('imageName');
        $(this).closest('div.status-i').remove();

       utils.imageSlider();

        removeImageFromList(imageName,imageProcessing.imageList);
        removeImageFromList(imageName,imageProcessing.imageMetaList);

        console.log('after::::::',imageProcessing.imageList);
    });
    if (logOutButton) {
        logOutButton.click(function (e) {
            e.preventDefault();
            console.log('logout button clicked');
            swal({
                title: 'Are you sure to Logout?',
                text: 'You will will be redirected to home page',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, logout!',
                cancelButtonText: 'No, stay here'
            }).then(function(isConfirm) {
                if (isConfirm === true) {
                    StorageFactory.deleteData('catList');
                    StorageFactory.deleteData('typeList');
                    StorageFactory.deleteData('portalCatList');
                    utils.deleteCookie();

                    signupModule.logout();
                }
            });
        })
    }

    function removeImageFromList(imageName,imgList){
        var imageList = imgList;
        console.log('before::',imageList);
        var len  = imageList.length;
        for(var i=0;i<len;i++) {
            // console.log('image name saved in list ',imageList[i].imageName);
            if(imageList[i].name == imageName) {
                imageList.splice(i,1);
                return;
            }
        }
    }

    function handleInvalidLogin(res) {
        console.log('handle Invalid login', res);
        if(res.mg == 'Please login first!') {
            var msg = {
                title:'Error',
                msg:res.mg,
                type:'error',
                timer:1000
            };
            utils.errorMsgDialog(msg);
        }
    }

    $$connector.keepAlive();
    $$connector.subscribe(handleInvalidLogin, {action: OPERATION_TYPES.SYSTEM.AUTH.TYPE_INVALID_LOGIN_SESSION});
    $$connector.subscribe(handleInvalidLogin, {action: OPERATION_TYPES.SYSTEM.AUTH.TYPE_SESSION_VALIDATION});
    $$connector.subscribe(handleInvalidLogin, {action: OPERATION_TYPES.SYSTEM.AUTH.TYPE_MULTIPLE_SESSION});

   utils.setUserDetailsToUI();
});
var postImages = $('#postImages');
var imageProcessing = {
    imageList : [],
    imageMetaList : [],
    callBack:'',
    len:0,
    init: function (fileList,type,callBack) {
        if(callBack) {
            this.callBack = callBack;
        }

        this.imageList = [];
        this.imageMetaList = [];
        var upload = [];
        var fileListLength = fileList.length;
        this.len = fileListLength;
        for (var i = 0; i < fileListLength; i++) {
            console.log(fileList[i]);
            upload[i] = UploadFile(type, fileList[i]);
            // upload[i].fetchMeta.bind(this);
            upload[i].fetchMeta(this.initUpload, upload[i]);
        }
    },
    initUpload: function (res, upObj) {
        var self = imageProcessing;
        console.log('inside initUpload function : ', res);
        console.log('image names:::::::::::', upObj.getName());
        var meta = {
            'name': upObj.getName(),
            'previewUrl': upObj.getPreview(),
            'id': portalUtils.getUniqueId('uploadProgress')
        };
        self.imageMetaList.push(meta);
        self.generatePreview(meta);
        console.log('image meta::::::', upObj.getMeta());


        if(self.imageMetaList.length == self.len && self.callBack) {
            self.callBack();
        }

        upObj.initUpload(self.uploadProgress).then(function (response) {
            console.log('upload response');
            console.log(response);
            if (response.sucs) {
                response.name = upObj.getName();
                self.imageList.push(response)
            }
        });
    },
    generatePreview: function (meta) {
        $('#postImageBoxWithNav').show();
        var div = '<div class="status-i">' +
            '<img  class="news-image" src="' + meta.previewUrl + '" alt="' + meta.name + '" height="150px" width="150px" /> ' +
            '<div class="progressBar" id="' + meta.id + '"><div></div></div>' +
            '<a data-image-name="'+meta.name+'" class="cl-ico imageUploadCancel"><img src="images/close.png"></a>' +
            '</div>';
        postImages.append(div);
    },

    uploadProgress: function (progress, fileName) {
        var self = imageProcessing;
        for (var i = 0; i < self.imageMetaList.length; i++) {
            console.log(self.imageMetaList[i].name, fileName, progress);
            if (self.imageMetaList[i].name == fileName) {
                var element = $('#' + self.imageMetaList[i].id);
                self.progressBar(progress, element);
            }
        }
    },

    progressBar: function (percent, $element) {
        var progressBarWidth = percent * $element.width() / 100;
        $element.find('div').animate({width: progressBarWidth}, 500).html(percent + "% ");
    }
};

