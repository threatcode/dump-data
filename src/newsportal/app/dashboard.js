$(function () {

    var utils = portalUtils;
    // var serverUrl = 'http://localhost/webArticleExtractor/';
    // var serverUrl = 'http://192.168.1.122:8080/webArticleExtractor/';
    var serverUrl = 'http://www.aedlbd.com/webArticleExtractor/';

    var urlRegx = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    var inputFromUrl = $('#inputFromUrl');
    var url = $('#postUrl');
    var postArticleForm = portalUtils.postArticleFormInputsId();
    var showPostPreview = $('#showPostPreview');

    var postPreviewContainer = $('#postPreviewContainer');
    var titleContainer = $('.titleContainer');
    var descriptionContainer = $('.descriptionContainer');
    var imageContainer = $('.imageContainer');

    var postImages = $('#postImages');
    var manualSelect = $('#manualSelect');
    var manualSelectionBox = $('.manualSelectionBox');
    var hiddenDiv = $('#hiddenDiv');

    var search = $('#searchNews');


    var imagesFromManualSelection = [];


    manualSelectionBox.bind( "mouseup", function() {
        var html  = $.parseHTML(getSelectionHtml());
        hiddenDiv.html(html);


        $("#hiddenDiv img").each(function(){
            imagesFromManualSelection.push($(this).attr('src'));
            $(this).remove();
        });

        // console.log(imgSrcs);
        console.log('hidden html',$('#hiddenDiv').html());
    });

    $('#postDescription').bind("paste", function(e){
        // alert('paste event occured!!!!!!!!!!!!!!');
        handleManualSelectionImage(imagesFromManualSelection);
        manualSelectionBox.hide();
        // var pastedData = e.originalEvent.clipboardData.getData('text');
    } );


    if(manualSelect.length) {
        manualSelect.click(function () {
            postImages.html('');
            var postUrl = url.val();
            if(urlRegx.test(postUrl)){
                var data = {
                    method:'GET',
                    url:serverUrl,
                    data:{
                        url:postUrl,
                        type:'body'
                    },
                    dataType:'jsonp',
                    crossDomain: true,
                    success:httpRequest.manageBodyForUrl,
                    fail:httpRequest.fail,
                    always:httpRequest.always
                    // always:httpRequest.always
                };
                httpRequest.request(data);
                swal({
                    title: 'Please wait...',
                    type: 'info',
                    html:'<img style="margin:0 auto; display: block;" src="../images/ripple.gif">Please wait while fetching newspaper data.',
                    allowOutsideClick:false,
                    allowEscapeKey:true,
                    showCancelButton:true,
                    showConfirmButton:false
                });
            } else {
                swal(
                    'Invalid Url',
                    'Please Enter a valid url ',
                    'error'
                );
            }
        });
    }
    function getSelectionHtml() {
        var html = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                html = document.selection.createRange().htmlText;
            }
        }
        // alert(html);
        console.log(html);
        return html;
    }
    // External Image operation END
    if(showPostPreview.length) {
        showPostPreview.click(function () {
            var feedObj = utils.addFeedDetailsFake();
            // var title = $('#'+postArticleForm.title).val();
            // var description = getImagesFromPost()+'<div style="padding-top: 20px; text-align: left!important;">'+$('#'+postArticleForm.description).val()+'</div>';
            if(feedObj.newsTitle!='' && feedObj.newsDetails !='' && feedObj.newsCatId!='') {
                // var formatedFeed = feedModule.formatFeed(feedObj);
                var html = feedModule.showFeed(feedObj,'',1);
                swal({
                    title: '',
                    html: html,
                    width:1200,
                    confirmButtonText:'Close'
                })
            } else {
                swal(
                    'Title, Description or category empty',
                    'Please Enter Title, Description and category ',
                    'error'
                );
            }


        });
    }
    if(inputFromUrl.length){
        inputFromUrl.click(function () {
            postImages.html('');
            var postUrl = url.val();
            if(urlRegx.test(postUrl)){
                var data = {
                    method:'GET',
                    url:serverUrl,
                    data:{
                        url:postUrl,
                        type:'content'
                    },
                    dataType:'jsonp',
                    crossDomain: true,
                    success:httpRequest.manageJsonForUrl,
                    fail:httpRequest.fail,
                    always:httpRequest.always
                    // always:httpRequest.always
                };
                httpRequest.request(data);
                swal({
                    title: 'Please wait...',
                    type: 'info',
                    html:'Please wait while fetching newspaper data.',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                });
                swal.enableLoading();
            } else {
                swal(
                    'Invalid Url',
                    'Please Enter a valid url ',
                    'error'
                );
            }

        });
    }

    function getImagesFromPost() {
        var imgList = imageProcessing.imageMetaList;
        var div = '';
        for (var i = 0; i < imgList.length; i++) {
            div += '<div class="status-i">' +
                '<img src="' + imgList[i].previewUrl + '" alt="' + imgList[i].name + '" height="200px" width="200px"> ' +
                '</div>';
        }
        return '<div style="overflow: hidden;" class="img-all">'+div+'</div>';
    }
    var httpRequest = {
        request:function (userData) {
            // Using the core $.ajax() method
            $.ajax({
                type: userData.method,
                url: userData.url,
                data: userData.data,
                dataType: userData.dataType,
                crossDomain: userData.crossDomain
            }).done(function(response){
                userData.success(response);
            }).fail(function(error){
                userData.fail(error);
            }).always(function () {
                userData.always()
            })
        },
        manageJsonForUrl:function (res) {
            console.log('success response:::::::',res);
            if(res.isSuccess){
                var description = utils.replaceBrByNewLine(res.result.text);
                var title = res.result.title;
                $('#'+postArticleForm.title).val(title);
                $('#'+postArticleForm.longDescription).val(description);
                handleImageUrls(res);
                swal.close();
                // $("#postArticle").validate().form();
            } else {
                $('.swal2-content').html(res.result);
                swal({
                        title: 'Parsing error',
                        type: 'error',
                        html:res.result,
                        allowOutsideClick:true,
                        allowEscapeKey:true,
                        showConfirmButton:true,
                        timer:5000
                    }
                );
            }
        },
        manageBodyForUrl:function (res) {
            console.log('body of requested url::::::',res);
            if(res.isSuccess) {
                swal.close();
                manualSelectionBox.html($.parseHTML(res.result.head));
                manualSelectionBox.append($.parseHTML(res.result.body));
                manualSelectionBox.show();
            }
        },
        fail:function (res) {
            console.log('error response:::::::',res);
            swal.close();
        },
        always:function (res) {

        }
    };

    function handleImageUrls(res) {
        var fileList = [];
        var arImg = res.result.articleImages;
        var topImg = res.result.topImage;
        var arImgLen = arImg.length;
        if(arImgLen>0){
            for(var i=0; i<arImgLen; i++) {
               fileList.push(formatUrl(arImg[i]));
            }
        } else if(topImg) {
            fileList.push(formatUrl(topImg));
        } else return;
        imageProcessing.init(fileList,'image',utils.imageSlider);
    }
    function handleManualSelectionImage(images) {
        if(images.length>0) {
            var fileList = [];
            for(var i=0; i<images.length; i++) {
                fileList.push(formatUrl(images[i]));
            }
            imageProcessing.init(fileList,'image');
        }
    }
    function formatUrl(url) {
        var newUrl =  url.replace(/.*?:\/\//g, "");
        var proxyUrl = 'https://dev.ringid.com/ImageProxy.png?';
        return proxyUrl+'url='+newUrl;
    }



    new Pikaday({
        field: document.getElementById('from_date')
    });

    new Pikaday({
        field: document.getElementById('to_date')
    });

    search.click(function () {

        $("#searchNews").validate({
            submitHandler: function() {
                var searchData = {
                    utid:StorageFactory.getCookie('uId'),
                    // sId:StorageFactory.getCookie('sId'),
                    scl:2,
                    tm:Date.parse($('#from_date').val()),
                    toTm:Date.parse($('#to_date').val()),
                    lmt:10,
                    // npCatType:2,
                    npCat:$('#categorySearch').val(),
                    actn:OPERATION_TYPES.SYSTEM.TYPE_MY_NEWS_FEED,
                    pckId:portalUtils.getUniqueId()
                };

                console.log('search data::::::::::::::',searchData);
                $$connector.request(searchData,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.REQUEST).then(function (json) {

                    console.log('Search result !!!!!!!',json);
                    // console.log(json);
                    var feedContainer = $('#feedContainer');
                    feedContainer.html('');

                    feedModule.manageFeedData(json);
                })

                return false;
            },
            rules: {
                category: {required:true}
                // from_date:{required:true},
                // to_date:{required:true}
            },
            messages: {
                category: {required: 'Please Select a category'}
                // from_date:{required:'Please select date range (from date)'},
                // to_date:{required:'Please select date range (to date)'}
            }
        });
    });
});




$('.coverImage').on('change', function() {

    var coverPhotoUploadParams = {
        type: 'cover',
        settingElement: 'setting',
        saveOrCancelElement: 'save-or-cancel',
        draggableElement: 'draggable-element-cover',
        thisContext: this
    };
    coverOrProfilePicUpload(coverPhotoUploadParams);
});



$('.profileImage').on('change', function() {

    var profilePhotoUploadParams = {
        type: 'profile',
        settingElement: 'setting',
        saveOrCancelElement: 'save-or-cancel-profile',
        draggableElement: 'draggable-element-profile',
        thisContext: this
    };
    coverOrProfilePicUpload(profilePhotoUploadParams);
});

$$connector.keepAlive();























