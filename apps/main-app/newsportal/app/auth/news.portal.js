/*
 * © Ipvision
 */

(function(window,document) {
    'use strict';

    var loginButton = document.getElementById("login");
    var logOutButton = document.getElementById('logout');
    var feedButton = document.getElementById('feed');
    var postNewsButton = document.getElementById('postNews');
    function setCookies(loginData, days) {
        StorageFactory.setCookie('uId', loginData.uId || '', days);
        StorageFactory.setCookie('sId', loginData.sId || '', days);
        StorageFactory.setCookie('utId', loginData.utId || '', days);
        StorageFactory.setCookie('userName', loginData.fn || '', days);

        // from login request
        if (days) {
            StorageFactory.setCookie('la', Date.now(), days);
        }

        if (loginData.authServer) {
            StorageFactory.setCookie('authServer', loginData.authServer || '', days);
        }
        if (loginData.comPort) {
            StorageFactory.setCookie('comPort', loginData.comPort || '', days);
        }
    }
    function deleteCookie() {
        StorageFactory.removeCookie('uId');
        StorageFactory.removeCookie('sId');
        StorageFactory.removeCookie('utId');
        StorageFactory.removeCookie('la');
        StorageFactory.removeCookie('authServer');
        StorageFactory.removeCookie('comPort');
        // StorageFactory.removeCookie('sessionID');
    }
    if(feedButton){
        feedButton.addEventListener('click',function (e) {
            e.preventDefault();
            var requestType = OPERATION_TYPES.SYSTEM.REQUEST_TYPE.REQUEST;
            var payload = {
                actn: OPERATION_TYPES.SYSTEM.TYPE_NEWS_FEED,
                lmt:10
            };
           var subsKey = $$connector.subscribe(manageFeedData,{
                action:OPERATION_TYPES.SYSTEM.TYPE_NEWS_FEED
            });
            $$connector.send(payload,requestType);
        })
    }
function manageFeedData(data) {
    console.log(data);
    var newsFeedList = data.newsFeedList;
    var feed = [];
    // console.log(newsFeedList);
    // return false;
    if(data.sucs && newsFeedList) {
        var newsFeedLength = newsFeedList.length;
        // console.log(newsFeedList)
        // console.log('len = '+newsFeedLength);
        // return false;
        if(newsFeedLength>0){
            for(var i=0;i<newsFeedLength;i++){
               // console.log(newsFeedList[i].prIm);
                formatFeed(newsFeedList[i],feed);
                // console.log(feed);
                // feed.push({'statusText':newsFeedList[i].sts,'userFirstName':newsFeedList[i].fn,'profileImage':newsFeedList[i].prIm})
            }
            showFeed(feed);
        }
    }
}
    var feedContainer = document.getElementById('feedDiv');
    function showFeed(feed) {
        for(var i=0;i<feed.length;i++){
            var status = document.createElement('p');
            status.setAttribute('class','bg-primary');
            var text = 'Status : '+feed[i].statusText+' Posted By : '+feed[i].userFirstName +' Profile Image : '+settings.imBase+feed[i].profileImage;
            status.appendChild(document.createTextNode(text));
            feedContainer.appendChild(status);

        }
    }
    function formatFeed(fData,feed) {
        feed.push({'statusText':fData.sts,'userFirstName':fData.fn,'profileImage':fData.prIm})
    }
    if(postNewsButton){
        var newFeedData = {};
        postNewsButton.addEventListener('click',function (e) {
            e.preventDefault();

            newFeedData.vldt =  "-1";// set validity for timout status // implement it while implementing timout status
            newFeedData.lng =  9999;
            newFeedData.lat =  9999;
            newFeedData.sts = 'abcd'.utf8Encode();//ob.text.utf8Encode(); // setting the feed text
            newFeedData.fpvc = 2;
            newFeedData.actn = 177;

            // var payload = {
            //     actn: OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE
            //     //request_type: REQTYPE.AUTHENTICATION
            // };
            return $$connector.request(newFeedData,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE).then(function (json) {
                console.log(json);
            })
        })
    }

    if(logOutButton){
        logOutButton.addEventListener('click',function (e) {
            e.preventDefault();
            var payload = {
                actn: OPERATION_TYPES.SYSTEM.AUTH.TYPE_SIGN_OUT
                //request_type: REQTYPE.AUTHENTICATION
            };
            $$connector.request(payload,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION);
            deleteCookie();
        })
    }

    var image = document.getElementById('imageUpload');
    if(image){
        image.addEventListener('change',function (e) {
            // alert('Hello');
            console.log(image.files[0]);
            var upload = UploadFile('chatimage', image.files[0]);
            upload.initUpload(uploadProgress).then(function(response) {
                console.log(response);
            });
        })
    }
    function uploadProgress(res){
        console.log('progress: ' + res +'%');
    }
    if(loginButton) {
        loginButton.addEventListener("click",function(e){
            e.preventDefault();
            RingLogger.print("login button clicked","LOGIN");
            var userId = document.getElementById("ringid").value;
            var password = document.getElementById("password").value;
            var payload = {
                usrPw: password,
                actn: OPERATION_TYPES.SYSTEM.AUTH.TYPE_SIGN_IN,
                vsn: settings.apiVersion, // auth server version
                wk: angular.getUniqueID(),
                dvc: 5,
                tbid: window._cti,
                did: angular.generateUUID(),
                lt : 1,
                uId : "21" + userId
            };
            RingLogger.print(payload,"LOGIN");
            $$connector.request(payload,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.AUTHENTICATION).then(handleLogin);

        });
    }
    function handleLogin(json){
        RingLogger.print(json,"LOGGED IN");
        setCookies(json, 30);
        $$connector.keepAlive();
        setUserDetails();

        // callTypeCategoryList();
         catModule.callTypeCategoryList();
    }
    function setUserDetails() {
        $('#userRingId, #userRingIdLeft').text(StorageFactory.getCookie('uId'));
        $('#userProfileName, #userProfileNameLeft').text(StorageFactory.getCookie('userName'));
    }
    setUserDetails();
})(window,document);

