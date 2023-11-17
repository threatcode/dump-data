var portalUtils = {
    StorageFactory:StorageFactory,
    convertTimestamp: function (timestamp) {
        var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
            yyyy = d.getFullYear(),

            mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
            dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
            ampm = 'AM',
            time;
        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh == 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
        return time;
    },
    setCookies:function (loginData, days) {
        this.StorageFactory.setCookie('uId', loginData.uId || '', days);
        this.StorageFactory.setCookie('sId', loginData.sId || '', days);
        this.StorageFactory.setCookie('utId', loginData.utId || '', days);
        this.StorageFactory.setCookie('userName', loginData.fn || '', days);
        this.StorageFactory.setCookie('prIm', loginData.prIm || '', days);
        // from login request
        if (days) {
            this.StorageFactory.setCookie('la', Date.now(), days);
        }

        if (loginData.authServer) {
            this.StorageFactory.setCookie('authServer', loginData.authServer || '', days);
        }
        if (loginData.comPort) {
            this.StorageFactory.setCookie('comPort', loginData.comPort || '', days);
        }
    },
    generateUUID:function () {
        var d = new Date().getTime();
        if(window.performance && typeof window.performance.now === "function"){
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    },
    getUniqueId :function(prefix){
        if (!prefix){
            prefix = '';
        }

        return prefix + (window._cti|| "") + window.Math.floor(window.Math.random() * (new window.Date()).getTime());
    },
    deleteCookie:function() {
        this.StorageFactory.removeCookie('uId');
        this.StorageFactory.removeCookie('sId');
        this.StorageFactory.removeCookie('utId');
        this.StorageFactory.removeCookie('la');
        this.StorageFactory.removeCookie('authServer');
        this.StorageFactory.removeCookie('comPort');
        this.StorageFactory.removeCookie('cIm');
        this.StorageFactory.removeCookie('prIm');
        this.StorageFactory.removeCookie('nPslgn');
        this.StorageFactory.removeCookie('nPCatName');
        this.StorageFactory.removeCookie('nPCatId');
        this.StorageFactory.removeCookie('fn');
        this.StorageFactory.removeCookie('el');
        this.StorageFactory.removeCookie('cc');
        this.StorageFactory.removeCookie('am');
    },
    verbalDate : function(timestamp,fromTimeStamp){
        var date,diff,day_diff,Math = window.Math,today = new Date();

        fromTimeStamp = fromTimeStamp || Date.now();

        if(isNaN(timestamp)){
            date = new Date((timestamp || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
                timestamp = date.getTime();
        }else{
            date = new Date(timestamp);
        }
        diff = ((fromTimeStamp - timestamp) / 1000);//diff in second
        day_diff = Math.floor(diff / 86400);// 1 day = 86400 second// its calculate diff in day
        // if ( isNaN(day_diff) || day_diff < 0 )
        if (isNaN(day_diff))
            return "";
        switch (true){
            case day_diff < 1: // time is equal from date
                switch(true){
                    case diff < 60:
                        return "just now";
                    case diff < 120 :
                        return "1 minute ago";
                    case diff < 3600 : // within a hour
                        return Math.floor( diff / 60 ) + " minutes ago";
                    case diff < 7200 :
                        return "1 hour ago";
                    case diff < 86400 : //within a day show as minute
                        return Math.floor( diff / 3600 ) + " hours ago";
                    default :
                        return dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
                }
                break;
            case day_diff === 1 : // 1 day before from date
                return "yesterday at "+ dateFormat(date, "h:MM:ss TT");
            default :
                return dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
        }
    },
    postArticleFormInputsId:function () {
        return {
            title:'postTitle',
            url:'postUrl',
            catId:'categoryPost',
            longDescription:'longDescription',
            shortDescription:'shortDescription'

        }
    },
    clearPostNewsForm:function() {
        var elem = portalUtils.postArticleFormInputsId();
        $('#' + elem.title).val('');
        $('#' + elem.url).val('');
        $('#' + elem.catId).val('');
        $('#' + elem.longDescription).val('');
        $('#' + elem.shortDescription).val('');
        $('#postImages').html('');
        $('#postImageBoxWithNav').hide();
    },
    getArticleFormData:function() {
        var postElementsIds = this.postArticleFormInputsId();
        var feed = {};
        feed.title = $('#' + postElementsIds.title).val();
        feed.url = $('#' + postElementsIds.url).val();
        feed.catId = $('#' + postElementsIds.catId).val();
        feed.longDescription = $('#' + postElementsIds.longDescription).val();
        feed.shortDescription = $('#' + postElementsIds.shortDescription).val();
        return feed;
    },
    loadCountryListJSON:function (callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'resources/countries.json', true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    },
    avatar:  function (size,src){
        var imageLink = src || "";
        if (size === 'iurl') {
            return imageLink;
        }

        if (size === 'original') {
            return settings.imBase + imageLink;
        }

        // default image
        if (imageLink.indexOf('prof.png') > 0) {
            return imageLink;
        }

        imageLink =  imageLink.replace('profileimages/','');
        if(size === 'original') {
            size = '';
        } else if(!size){
            size = 'crp';
        }
        // add progressive prefix
        size = (/\/uploaded\//.test(imageLink) ? '': 'p') + size;

        var position = imageLink.lastIndexOf('/') + 1;
        imageLink = [settings.imBase, imageLink.slice(0, position), size,  imageLink.slice(position)].join('');

        return imageLink.indexOf('prof.png') > 0 ? src : imageLink ;
    },

    setUserBasicInfoToCookie:function (json) {
        var cIm = json.cIm ? json.cIm : '';
        var prIm = json.prIm ? json.prIm : '';

        this.StorageFactory.setCookie('cIm',cIm,30);
        this.StorageFactory.setCookie('prIm',prIm,30);
        this.StorageFactory.setCookie('am',json.am || '',30);
        this.StorageFactory.setCookie('cc',json.cc || '',30);
        this.StorageFactory.setCookie('el',json.el || '',30);
        var npDetails = json.npDTO;
        if(npDetails) {
            this.StorageFactory.setCookie('fn',npDetails.fn || '',30);
            this.StorageFactory.setCookie('nPslgn',npDetails.nPslgn || '',30);
            this.StorageFactory.setCookie('nPCatName',npDetails.nPCatName || '',30);
            this.StorageFactory.setCookie('nPCatId',npDetails.nPCatId || '',30);
        }

    },

     setUserDetailsToUI:function() {
        var cIm = StorageFactory.getCookie('cIm');
        if(cIm) {
            var coverImg = this.avatar(600,cIm);
            $('.cover-photo').css('background-image','url('+coverImg+')');
        }
        $('#userRingId, #userRingIdLeft').text(this.getRingNumber(StorageFactory.getCookie('uId')));
        $('#userProfileName, #userProfileNameLeft').text(StorageFactory.getCookie('fn'));
        var prIm = StorageFactory.getCookie('prIm');
        if(prIm) {
            var profileImg = this.avatar('thumb',prIm);
            $('.profile-pic, .p-img').css('background-image','url('+profileImg+')');
            $('.pro-header-image').attr('src',profileImg);
        }
        // profile-pic
    },
     imageSlider:function() {
            $('#postImages').imageSlider({
                numberOfImageToShow: 5,
                identifier: 'postImages',
                navLeftId: 'leftArrow',
                navRightId: 'rightArrow'
            });
        
        },

    getUserProfileDetails:function() {
        console.log('user basic request ::::::::::::::::');
        if(!StorageFactory.getCookie('cIm') || !StorageFactory.getCookie('prIm')) {
            var payload = {
                // actn : OPERATION_TYPES.SYSTEM.PROFILE.TYPE_ACTION_GET_USER_DETAILS,
                actn : OPERATION_TYPES.SYSTEM.PROFILE.TYPE_ACTION_OTHER_USER_BASICINFO,
                uId :  this.StorageFactory.getCookie('uId'),
                utId :  this.StorageFactory.getCookie('utId'),
                dvc : 5,
                pckId : this.getUniqueId(),
                isnp  : true,
                sId :  this.StorageFactory.getCookie('sId')
            };
            return $$connector.request(payload,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.REQUEST).then(function (json) {
                console.log(':::::::::::::::::::user details response response!!!!!!!',json);
                if(json.sucs) {
                    var userDetails = json.userDetails;
                    if(userDetails) {
                        portalUtils.setUserBasicInfoToCookie(userDetails);
                        portalUtils.setUserDetailsToUI();
                    }
                }
            })
        }
    },

    errorMsgDialog:function (msg) {
        this.StorageFactory.deleteData('catList');
        this.StorageFactory.deleteData('typeList');
        this.StorageFactory.deleteData('portalCatList');
        this.deleteCookie();

        swal({
            title: msg.title,
            text: msg.msg,
            type: 'error',
            timer: msg.timer
        }).then(function () {
            window.location.href = '/';
        });
    },

    checkLogin:function(){
        try {
            var utId = this.StorageFactory.getCookie('utId');
            var sId = this.StorageFactory.getCookie('sId');
            // var sessionID = this.StorageFactory.getCookie('sessionID');
            if(!utId || !sId) throw 'Invalid utId or sId';
            var payload = {
                actn : OPERATION_TYPES.SYSTEM.AUTH.TYPE_SESSION_VALIDATION,
                dvcc : 5,
                did  : this.generateUUID(),
                utId : this.StorageFactory.getCookie('utId')+1
            };
            return $$connector.request(payload,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION).then(function (json) {

                console.log('::::::::::::::::::::::::::::::::::::::::::Login check response!!!!!!!',json);
                if(!json.sucs) {
                    var msg = json.mg ? json.mg : 'Something went wrong, you need to login';
                    var dialogFields = {
                        msg:msg,
                        title:'Error occurred!',
                        timer:2000
                    };
                    portalUtils.errorMsgDialog(dialogFields);
                }
            })
        } catch(e){
            var dialogFields = {
                msg:e.toString(),
                title:'Error occurred!',
                timer:2000
            };
            portalUtils.errorMsgDialog(dialogFields);
        }
    },

    addFeedDetailsFake:function() {
    var feed = this.getArticleFormData();
    var newsObj =   {
        'newsDetails': feed.longDescription,
        'shortDescription': feed.shortDescription,
        'userFirstName': StorageFactory.getCookie('userName'),
        'profileImage': StorageFactory.getCookie('prIm'),
        'likeCount':0,
        'commentCount':0,
        'shareCount':0,
        'imageList': imageProcessing.imageList,
        'timeStamp': Date.now(),
        'newsTitle' : feed.title,
        'newsUrl' : feed.url,
        'newsCatId' : feed.catId
    };
    return newsObj;
},
    replaceBrByNewLine:function (str) {
        return str.replace(/<br\s*\/?>/mg,"\r\n");
    },
    replaceNewLineByBr:function (str) {
       return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    },
    getRingNumber: function (ringID) {
        return  (ringID.replace(/(\d{2})(\d{4})(\d+?)/,"$2 $3"));
        // return ringID.substring(2);
    }




};