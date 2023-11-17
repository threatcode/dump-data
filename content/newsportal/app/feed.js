var feedModule = {
    feedContainer: '',
    timeStamp: 0,
    utils: portalUtils,
    fetchFeed: function (con) {
        this.feedContainer = con;
        var requestType = OPERATION_TYPES.SYSTEM.REQUEST_TYPE.REQUEST;
        var utId = StorageFactory.getCookie('utId');
        if (!utId) {
            this.utils.errorMsgDialog({title: 'Error', msg: 'Invalid utId', timer: 2000});
            return false;
        }
        var payload = {
            actn: OPERATION_TYPES.SYSTEM.TYPE_MY_NEWS_FEED,
            lmt: 10,
            tm: this.timeStamp,
            scl: 2,
            pType:3,
            utId: StorageFactory.getCookie('utId')
        };
        // console.log('payload!!!!!!!!!!!!!!!!!!');
        console.log(payload);
        // console.log('payload::::::::::::::::::::::');
        $$connector.send(payload, requestType);
    },
    postFeed: function (feedData, imageList) {
        // console.log(feedModule.avatar('600',imageList[0].iurl));
        var newsFeedData = {};
        newsFeedData.vldt = "-1";// set validity for timout status // implement it while implementing timout status
        newsFeedData.lng = 9999;
        newsFeedData.lat = 9999;
        newsFeedData.sts = '';
        newsFeedData.fpvc = 2;
        newsFeedData.actn = 177;
        newsFeedData.type = 7;
        newsFeedData.pType = 3;
        // newsFeedData.fc = 3;
        newsFeedData.pckId = portalUtils.getUniqueId();

        newsFeedData.npFeedInfo = {
            nUrl: feedData.url.utf8Encode(),
            nTtl: feedData.title.utf8Encode(),
            nCatId: feedData.catId,
            nDctn: feedData.longDescription.utf8Encode(),
            nSDctn: feedData.shortDescription.utf8Encode(),
            exUrlOp: false,
            npFeedType: 2,
            wt: 1
        };

        if (imageList.length > 0) {
            this.generatePayloadForImage(newsFeedData, imageList);
        }
        return $$connector.request(newsFeedData, OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE);
    },
    editFeed: function (data) {
        // "{"actn":178,"nfId":27101,"sts":"asdasdasdasdasdasdasdasdasd","lctn":"DOHS Baridhara","lat":23.812561,"lng":90.41311,"lnkDmn":"","lnkDsc":"","lnkTtl":"","lnkURL":"","lnlImgURL":"","mdIds":[1],"pckId":"241088311379394","sId":"280780716787353292110010130","tbid":24,"dvc":5}"
        var payload = {
            actn: OPERATION_TYPES.SYSTEM.TYPE_EDIT_STATUS,
            nfId: data.newsId,
            npFeedInfo: {
                id: data.newsId,
                nUrl: data.url.utf8Encode(),
                nTtl: data.title.utf8Encode(),
                nCatId: data.catId,
                nDctn: data.description.utf8Encode(),
                nSDctn: data.shortDescription.utf8Encode(),
                exUrlOp: true
            },
            sts: '',
            sId: StorageFactory.getCookie('sId'),
            pckId: portalUtils.getUniqueId()
        };
        console.log('payload for update status::::::::::::::::', payload);
        return $$connector.request(payload, OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE);
    },
    deleteFeed: function (feedId) {

        var payload = {
            actn: OPERATION_TYPES.SYSTEM.TYPE_DELETE_STATUS,
            nfId: feedId,
            pckId: portalUtils.getUniqueId()
        };

        return $$connector.request(payload, OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE);
    },
    generatePayloadForImage: function (obj, imageList) {
        var imgListLen = imageList.length;
        obj.imgId = 0;
        if (imgListLen == 1) {
            // obj.type = 1;
            obj.ih = imageList[0].ih;
            obj.iw = imageList[0].iw;
            obj.iurl = imageList[0].iurl;
            obj.npFeedInfo.npFeedType = 1;
        } else if (imgListLen > 1) {
            var multiImageList = [];
            obj.actn = 117;
            obj.npFeedInfo.npFeedType = 3;
            // obj.type = 3;
            for (var i = 0; i < imgListLen; i++) {
                multiImageList.push({
                    'cptn': '',
                    'iurl': imageList[i].iurl,
                    'ih': imageList[1].ih,
                    'iw': imageList[0].iw
                });
            }
            obj.imageList = multiImageList;
        }
        return true;

    },
    manageFeedData: function (data) {
        console.log('new feed came through socket:::::::::::::::::::::::::::', data);
        // if(!data.sucs && data.mg == 'Please login first!') {
        //     this.errorMsgDialog({mg:data.mg});
        //     return false;
        // }
        var newsFeedList = data.newsFeedList;
        if (data.sucs && newsFeedList) {
            var newsFeedLength = newsFeedList.length;
            if (newsFeedLength > 0) {
                for (var i = 0; i < newsFeedLength; i++) {
                    var formatedFeed = this.formatFeed(newsFeedList[i]);
                    this.showFeed(formatedFeed);
                    this.setTimeStamp(formatedFeed.timeStamp);
                }
            }
        } else if (!data.sucs && data.mg) {
            $('#feedLoadMore').hide();
            $('#noMorePostToShow').show();
            // swal({
            //     title: 'No more news',
            //     type: 'warning',
            //     text: 'There is no more news to show.',
            //     timer: 3000
            // })
        }
    },
    setTimeStamp: function (tm) {
        if (this.timeStamp != 0) {
            if (this.timeStamp > tm) {
                this.timeStamp = tm;
            }
        } else {
            this.timeStamp = tm;
        }
    },
    formatFeed: function (fData) {
        // console.log('format feed');
        var imgList = '';
        if (fData.imc) {
            imgList = fData.imageList
        }  else if(fData.iurl) {
            imgList = [{iurl: fData.iurl,iw:fData.iw,ih:fData.ih}];
        }



        var newsObj = {
            'status': fData.sts,
            'userFirstName': fData.fn,
            'profileImage': fData.prIm,
            'likeCount': fData.nl,
            'commentCount': fData.nc,
            'shareCount': fData.ns,
            'imageList': imgList,
            'timeStamp': fData.tm,
            'newsId': fData.nfId
        };
        var newsInfo = fData.npFeedInfo;
        if (newsInfo) {
            newsObj.shortDescription = newsInfo.nSDctn;
            newsObj.newsDetails = newsInfo.nDctn;
            newsObj.newsTitle = newsInfo.nTtl;
            newsObj.newsUrl = newsInfo.nUrl;
            // newsObj.newsId = newsInfo.id || fData.nfId;
            newsObj.openExternalUrl = newsInfo.exUrlOp;
            newsObj.newsCatId = newsInfo.nCatId;
            newsObj.weight = newsInfo.wt;
        }
        return newsObj;
    },
    showFeed: function (feed, flag, rawHtml) {
        // console.log(feed);
        var status = document.createElement('p');
        status.setAttribute('class', 'bg-primary');

        // var text = 'Status : ' + feed.statusText + ' Posted By : ' + feed.userFirstName + ' Profile Image : ' + this.avatar('thumb',feed.profileImage);
        var wrapper = '<div class="newsfeed-row">';
        var top = this.newsFeedTopTemplate(feed);
        var middle = this.newsFeedMiddleTemplate(feed, rawHtml);
        var bottom = this.newsFeedBottomTemplate(feed);
        var cls = '<div class="clear"></div>';
        var wrapperEnd = '</div>';
        var html = wrapper + top + middle + bottom + cls + wrapperEnd;
        if (rawHtml) {
            return wrapper + top + middle + cls + wrapperEnd;
        }
        if (flag) {
            this.feedContainer.prepend(html);
        } else {
            this.feedContainer.append(html);
        }
    },
    newsFeedTopTemplate: function (feed) {
        var humanizeTime = portalUtils.verbalDate(feed.timeStamp);
        var src = this.utils.avatar('thumb', feed.profileImage ? feed.profileImage : 'images/prof.png');
        var wrapper = '<div class="newsfeed-top">';
        var img = '<div class="float-left"><a><img class="border_radious" width="40px" height="40px" src="' + src + '" alt=""> </a></div>';
        var postTimeWrap = '<div class="top-r-feed">';
        var postedBy = ' <p> <b>' + feed.userFirstName + '</b></p>';
        var catId = feed.newsCatId ? feed.newsCatId : 0;
        var catName = '';
        if (catId) {
            catName = catModule.getCategoryNameById(catId);
        }
        var time = '<span class="time"> ' + humanizeTime + ' in <b data-id="' + catId + '" class="categoryId">' + catName + '</b></span>';
        var postTimeWrapEnd = '</div>';
        // var feedAction = '<div class="feed-action">' +
        //     '<div class="dr-ico"></div>' +
        //     '<div class="drop-box r-0  t-25 min-w-100">' +
        //     '<a class="editFeed" data-news-id="'+feed.newsId+'">Edit</a><a class="deleteFeed" data-news-id="'+feed.newsId+'">Delete</a></div>' +
        //     '</div>';
        var wrapperEnd = '</div>';

        return wrapper + img + postTimeWrap + postedBy + time + postTimeWrapEnd + wrapperEnd;

    },
    newsFeedMiddleTemplate: function (feed, flag) {
        var ogLeft = '';

        var newsFeedSms = '<div class="newsfeed-sms">';
        var perview = ' <div class="og-preview-container">';
        var ogArea = ' <div class="og_area" >';
        var cls = ' <div class="clear"></div>';
        if (feed.imageList.length > 0) {
            // img = this.avatar('600',feed.imageList[0].iurl);
            var img = this.generateImageContainer(feed.imageList);
            ogLeft = '' +
                '<div class="og-info-left-container">' +
                '<div class="og-image-container">' +
                img +
                '</div>' +
                '</div>';
            ogLeft = ogLeft + cls;
        }

        var description = '';
        if (flag) {
            description = this.utils.replaceNewLineByBr(feed.newsDetails);
        } else {
            // description = this.truncateContent(this.utils.replaceNewLineByBr(feed.newsDetails));
            description = feed.shortDescription;


        }

        var newsUrl = feed.newsUrl ? feed.newsUrl : '';
        var newsTitle = feed.newsTitle ? feed.newsTitle : '';

        var titleTmpl = '<a alt="" target="_blank">' + newsTitle + '</a>';
        var descriptionTmpl = '<div class="og-description" >' + description + '</div>';

        var urlTmpl = '<span  class="og-url hiddenUrl">' +
            newsUrl +
            '</span>';
        var ogRight = '' +
            '<div class="og-info-right-container">' +
            '<div  class="og-title">' +
            titleTmpl + urlTmpl +
            '</div>' +
            descriptionTmpl +
            '</div>';
        var ogAreaEnd = '</div>';
        var perviewEnd = '</div>';
        var newsFeedSmsEnd = '</div>';
        return newsFeedSms + perview + ogArea + ogLeft + ogRight + ogAreaEnd + cls + perviewEnd + newsFeedSmsEnd;
    },

    newsFeedMiddleEditableTemplate: function (feed) {
        var ogLeft = '';
        //
        // var newsFeedSms = '<div class="newsfeed-sms">';
        // var perview = ' <div class="og-preview-container">';
        var ogArea = ' <div class="og_area" >';
        var cls = ' <div class="clear"></div>';
        if (feed.imageList.length > 0) {
            // img = this.avatar('600',feed.imageList[0].iurl);
            var img = this.generateImageContainer(feed.imageList);
            ogLeft = '' +
                '<div class="og-info-left-container">' +
                '<div class="og-image-container">' +
                img +
                '</div>' +
                '</div>';
            ogLeft = ogLeft + cls;
        }

        // var description = this.truncateContent(feed.newsDetails);
        // var description = feed.newsDetails;

        var url = feed.newsUrl ? feed.newsUrl : '';
        var urlTmpl = '<div class="og-url">' +
            '<input  type="text"  placeholder="News url" class="og-updated-url text contentEditable" value="' + url + '" />' +
            '</div>';
        var catTmpl = '';
        var catId = feed.newsCatId ? feed.newsCatId : '';
        catTmpl += '<div class="contentEditable"> <select class="text categoryIdUpdate">' +
            catModule.generateCategoryListSelectBox('catList', catId) +
            '</select></div>';

        var ogRight = '' +
            '<div class="og-info-right-container">' +
            '<div class="input-box">' +
            '<input type="text"  class="og-title text contentEditable" placeholder="News title" value="' + feed.newsTitle + '" />' +
            '<textarea style="overflow: auto; line-height: 25px; padding: 10px; min-height: 70px;" placeholder="News short details" class="og-description shortDescription text contentEditable" >' +
             feed.shortDescription +
            '</textarea>' +

            '<textarea style="overflow: auto; line-height: 25px; padding: 10px;" placeholder="News long details" class="og-description longDescription text contentEditable" >' +
            feed.newsDetails +
            '</textarea>' +

            catTmpl +
            urlTmpl +
            '</div>' +
            '</div>';
        var ogAreaEnd = '</div>';
        var UpdateButton = '<input data-news-id="' + feed.newsId + '" class="btn_h float-left editSubmitButton" type="button" value="Update">';
        var cancelButton = '<input class="btn_h float-left editCancelButton" type="button" value="Cancel">';
        return ogArea + ogLeft + ogRight + UpdateButton + cancelButton + ogAreaEnd + cls;
    },
    newsFeedBottomTemplate: function (feed) {
        var wrapper = ' <div class="newsfeed-bottom"><ul class="feed_lcs_menu">';
        var stat = this.generateLiforNewsFeedBottom('', 'icon-stat', 'Statistics', feed, 1);
        var edit = this.generateLiforNewsFeedBottom('editFeed', 'icon-edit', 'Edit', feed);
        var remove = this.generateLiforNewsFeedBottom('deleteFeed', 'icon-delete', 'Delete', feed);
        var preview = this.generateLiforNewsFeedBottom('newsPreview', 'icon-preview', 'Preview', feed);
        var wrapperEnd = '</ul></div>';
        return wrapper + stat + edit + remove + preview + wrapperEnd;
    },
    generateStatCount: function (feed) {
        return '<div class="top-dropbox p-ab b-30">' +
            '<span>' +
            '<i class="lc-ico icon-like"></i>' +
            '<b>Like </b> ' + feed.likeCount +
            '</span>' +
            '<span>' +
            '<i class="lc-ico icon-comments-str"></i>' +
            '<b>&nbsp;Comments</b> ' + feed.commentCount +
            '</span>' +
            '<span>' +
            '<i class="lc-ico icon-share"></i>' +
            '<b>Share</b> ' + feed.shareCount +
            '</span>' +
            '</div>'
    },
    generateLiforNewsFeedBottom: function (cls1, cls2, txt, feed, flag) {
        var li = '';
        var div = '';
        if (flag) {
            div += this.generateStatCount(feed);
        }
        li += ' <li>' + div +
            '<a class="lcs_button  cursor-pointer ' + cls1 + '" data-news-id="' + feed.newsId + '">' +
            '<i class="news-portal ' + cls2 + ' h-17 w-23 v-a-b"></i>' +
            '<b>' + txt + '</b>' +
            '</a>' +
            '</li>';
        return li;
    },
    generateImageContainer: function (imageList) {
        var len = imageList.length;
        var div = '', img1, img2, img3;
        if (len == 1) {
            img1 = this.utils.avatar('400', imageList[0].iurl);
            div = '<div class="img1 pic4" style="background-image: url(' + this.utils.avatar('600', imageList[0].iurl) + ')"></div>';

        } else if (len == 2) {
            img2 = this.utils.avatar('400', imageList[1].iurl);
            div = '<div class="grid"><div class="img1 pic4" style="background-image: url(' + this.utils.avatar('600', imageList[0].iurl) + ')"></div></div>' +
                '<div class="grid"><div class="img1 pic4" style="background-image: url(' + this.utils.avatar('600', imageList[1].iurl) + ')"></div></div>';

        } else if (len > 2) {
            img2 = this.utils.avatar('400', imageList[1].iurl);
            div = '<div class="grid"><div class="img1 pic4" style="background-image: url(' + this.utils.avatar('600', imageList[0].iurl) + ')"></div></div>' +
                '<div class="grid">' +
                '<div class="img2  pic2" style="background-image: url(' + this.utils.avatar('600', imageList[1].iurl) + ')"></div>' +
                '<div class="img3  pic3" style="background-image: url(' + this.utils.avatar('600', imageList[2].iurl) + ')"></div>' +
                '</div>';
        }

        return '<div class="img-layout-0">' + div + '</div>';
    },
    truncateContent: function (txt) {
        var limit = 300;
        // var text = txt.replace(/((<br>|<br \/>)\s*)+$/,'');
        var text = txt.replace(/^(\ ?<br( \/)?>\ ?)+|(\ ?<br( \/)?>\ ?)+$/, '');
        // console.log('text after replacing::',text);
        var txtLength = text.length;

        if (txtLength > limit) {
            var firstSub = '<span class="newsShortForm">' + text.substring(0, limit) + '...</span>';
            var secondSub = '<span class="newsFullForm">' + text + '</span>';
            var span = '&nbsp;&nbsp;&nbsp;<span class="showFullNews btn_h">More</span>';
            return firstSub + secondSub + span;

        }
        return text;
    },
    errorMsgDialog: function (msg) {
        swal({
            title: 'Error',
            text: msg.msg,
            type: 'error',
            timer: 2000
        }).then(function () {
            window.location.href = '/';
        });
    }
};

$(function () {

    // try{

    var feedContainer = $('#feedContainer');
    var deleteFeed = $('#deleteFeed');
    catModule.callTypeCategoryList();
    portalUtils.getUserProfileDetails();
    $('#feedLoadMore').click(function () {
        feedModule.fetchFeed(feedContainer);
    });

    feedContainer.on('click', '.showFullNews', function () {
        var spanText = $(this).html();
        if (spanText == 'More') {
            $(this).html('Less');
            $(this).parent().find('.newsFullForm').fadeIn('slow');
            $(this).parent().find('.newsShortForm').hide();
        } else if (spanText == 'Less') {
            $(this).html('More');
            $(this).parent().find('.newsFullForm').hide();
            $(this).parent().find('.newsShortForm').fadeIn('slow');
        }
    });

    feedContainer.on('click', '.img1,.img2,.img3', function () {
        var bg = $(this).css('background-image');
        bg = bg.replace('url(', '').replace(')', '');
        // alert(bg);
        // swal({
        //     title: 'Sweet!',
        //     text: 'Image or News details will be shown here',
        //     timer: 2000
        // })
    });
    feedContainer.on('click', '.deleteFeed', function () {
        var feedId = $(this).data('news-id');
        var container = $(this).closest('.newsfeed-row');
        console.log('news feed container', container);
        if (feedId) {
            swal({
                title: 'Are you sure?',
                text: 'You will not be able to recover this',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it'
            }).then(function (isConfirm) {
                if (isConfirm === true) {
                    feedModule.deleteFeed(feedId).then(function (json) {
                        if(json.sucs) {
                            container.css("background-color", "#E8E8E8");
                            container.fadeOut(400, function () {
                                container.remove();
                                swal('Deleted!', 'News has been deleted.', 'success');
                            });
                        } else {
                            var mg = json.mg || 'Something wrong, please try later';
                            swal('Error',mg,'error');
                        }
                    });

                } else if (isConfirm === false) {
                    swal('Cancelled', 'Your news is safe :)', 'error');
                }
            });
        }
    });
    feedContainer.on('click', '.editFeed', function () {
        var feedId = $(this).data('news-id');
        var container = $(this).closest('.newsfeed-row');

        var ogPreview = container.find('.og-preview-container');
        var ogArea = container.find('.og_area');

        swal({
            title: 'News Details',
            type: 'info',
            text: 'Loading news details, Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false
        });
        swal.enableLoading();
        var singleNewsFeed = {
            "nfId": feedId,
            "imgId": 0,
            "actn": OPERATION_TYPES.SYSTEM.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS,
            "pckId": portalUtils.getUniqueId(),
            sId: StorageFactory.getCookie('sId')
        };


        $$connector.request(singleNewsFeed, OPERATION_TYPES.SYSTEM.REQUEST_TYPE.REQUEST).then(function (data) {
            var newsFeedList = data.newsFeedList;
            if (data.sucs && newsFeedList) {
                var formatedFeed = feedModule.formatFeed(newsFeedList[0]);
                var template = feedModule.newsFeedMiddleEditableTemplate(formatedFeed);
                ogArea.hide();
                ogPreview.append(template);
                swal.close();
            } else if (!data.sucs && data.mg && data.rc == 0) {
                swal({
                    title: 'Something wrong',
                    type: 'warning',
                    text: data.mg,
                    timer: 3000
                })
            }
        });
        container.focus();
    });
    feedContainer.on('click', '.newsPreview', function () {
        var feedId = $(this).data('news-id');
        swal({
            title: 'News preview',
            type: 'info',
            text: 'Loading news preview, Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false
        });
        swal.enableLoading();
        var singleNewsFeed = {
            "nfId": feedId,
            "imgId": 0,
            "actn": OPERATION_TYPES.SYSTEM.TYPE_SINGLE_STATUS_NOTIFICATION_OR_SHARE_DETAILS,
            "pckId": portalUtils.getUniqueId(),
            sId: StorageFactory.getCookie('sId')
        };

        $$connector.request(singleNewsFeed, OPERATION_TYPES.SYSTEM.REQUEST_TYPE.REQUEST).then(function (data) {
            var newsFeedList = data.newsFeedList;
            if (data.sucs && newsFeedList) {
                var newsFeedLength = newsFeedList.length;
                if (newsFeedLength > 0) {
                    for (var i = 0; i < newsFeedLength; i++) {
                        var formatedFeed = feedModule.formatFeed(newsFeedList[i]);
                        var html = feedModule.showFeed(formatedFeed, '', 1);
                        swal({
                            title: '',
                            html: html,
                            width: 1200,
                            confirmButtonText: 'Close'
                        })
                    }
                }
            } else if (!data.sucs && data.mg && data.rc == 0) {
                swal({
                    title: 'Something wrong',
                    type: 'warning',
                    text: data.mg,
                    timer: 3000
                })
            }
        })


    });

    feedContainer.on('click', '.editSubmitButton', function () {

        var con = $(this).closest('.og_area');
        var newsId = $(this).data('news-id');
        var longDescription = con.find('.longDescription').val();
        var shortDescription = con.find('.shortDescription').val();
        var title = con.find('.og-title').val();
        var url = con.find('.og-updated-url').val();
        var catId = con.find('.categoryIdUpdate').val();
        var updateData = {
            title: title,
            description: longDescription,
            shortDescription: shortDescription,
            url: url,
            newsId: newsId,
            catId: catId
        };
        swal({
            title: 'Updating news',
            type: 'info',
            text: 'Please wait... while updating news',
            allowEscapeKey: false,
            allowOutsideClick: false
        });
        swal.enableLoading();

        feedModule.editFeed(updateData).then(function (json) {
            if(json.sucs) {
                swal({
                    title:'Success',
                    type:'success',
                    text:'News updated successfully'
                }).then(function () {
                    var catName = catModule.getCategoryNameById(catId);

                    var catNode = con.closest('.newsfeed-row').find('.categoryId');
                    catNode.data('id', catId);
                    catNode.text(catName);

                    var prev = con.closest('.og-preview-container').find('.og_area');
                    prev.find('.og-description').text(shortDescription);
                    prev.find('.og-title > a').text(title);
                    prev.find('.og-url').text(url);
                    prev.fadeIn();
                    con.remove();
                });
            } else {
                var mg = json.mg ? json.mg : 'Something wrong, Please try later';
                swal({
                    title:'Error',
                    type:'error',
                    text:mg
                });
            }
        });

    });

    feedContainer.on('click', '.editCancelButton', function () {
        var con = $(this).closest('.og_area');
        var prev = con.closest('.og-preview-container').find('.og_area');
        prev.fadeIn();
        con.remove();
    });


    $$connector.keepAlive();
    feedModule.fetchFeed(feedContainer);
    var subsKey = $$connector.subscribe(feedModule.manageFeedData.bind(feedModule), {
        action: OPERATION_TYPES.SYSTEM.TYPE_MY_NEWS_FEED
    });
});
$$connector.keepAlive();





