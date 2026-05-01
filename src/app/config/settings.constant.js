/*
 * ?? Ipvision
 */


        //var server = 'dev.ringid.com',
        var server = location.href.split("/")[2],

        protocol = 'http://';

        var baseUrl = location.protocol + '//' + location.host; // + '/';

        var setting_default = {

            "ac":"http://devauth.ringid.com/rac/",//devdevrac server
            "ims":"http://devimages.ringid.com/", //devdev image server upload
            "imsres":"http://devimagesres.ringid.com/",//devdev image server fetch resource
            "stmapi":"http://devsticker.ringid.com/",//devdevsticker fetch detail api server
            "stmres":"http://devstickerres.ringid.com/",//devdev sticker fetch resource server
            "vodapi":"http://devmediacloudapi.ringid.com/",//devdev media content upload server
            "vodres":"http://devmediacloud.ringid.com/",//devdevmedia content resource server

            "apiVersion":140
        };

        var settings = {
            apiVersion: setting_default.apiVersion,
            constantServer : 'http://auth.ringid.com/cnstnts?pf=5&v='+setting_default.apiVersion+'&apt=1',
            socketProtocol: 'ws://',
            secure:false,//true while server have ssl installed
            analytics:true,
            debugEnabled:true,
            httpsUrl : 'https://'+server,
            siteUrl: server,
            baseUrl: baseUrl,
            base : location.host,
            chatImBase: protocol+'image.ringid.com/chatContens/',
            chatVideoBase: protocol+'image.ringid.com/chatContens/', // save as above might not be needed
            chatAudioBase: protocol+'image.ringid.com/chatContens/', // save as above might not be needed
            tagChatImBase: protocol+'image.ringid.com/groupContents/',

            chatHeartBeatUrl : baseUrl + '/images/ping.jpg',

            emotionServer : setting_default.imsres + '/emoticon/d5/',
            emoticonBase: protocol+ server +'/images/emoticon/',

            stickerBase: setting_default.stmres + 'stickermarket/d5/',
            stickerApi: setting_default.stmapi +'ringmarket/StickerHandler/?pf=5&v=' + setting_default.apiVersion + '&',
            imMediaBase : protocol + 'image.ringid.com/ringmarket/ChatImageHandler',

            digitsServiceUrl: 'https://dev.ringid.com/DigitsService',
            digitsConsumerKey: 'wnZ1SukFsxdnr22U4PLiS3T9J',
            twitterApiURL: 'http://api.twitter.com/1.1/account/verify_credentials.json',
            ogServiceUrl : protocol+ server+'/OGService',
            // end api servers
            sessionTimeout: 21600000, // 6 hours in miliseconds
			FEED_LIMIT : 6,
		    FEED_TEXT_LIMIT : 65335,// in byte

            LEFT_BAR_WIDTH : 200,
            RIGHT_BAR_WIDTH : 200,
            CELL_MARGIN : 10,

            //Third Party

            //GOOGLE_MAP_KEY : 'AIzaSyDwFgSnjLgWcHLEXS5E1dC8GgWLtxsH0zM'
            GOOGLE_MAP_KEY : 'AIzaSyCHl88HAklaOu6Q0TSfX5N5eA0vjdlBNuE'

		};

        function setUrlBase(ob){
                        // api servers
            settings.signupInit = ob.ac + 'ringid?pf=5&v=' + settings.apiVersion + '&'; // append did 15/32 character long string
            settings.signupSocialInit = ob.ac + 'comports?pf=5&v=' + settings.apiVersion + '&'; // append platform = twtr/fb id and lt=4/5
            settings.imBase = ob.imsres; // for production use:  'http://images.ringid.com/uploaded/'
            settings.imServer = ob.ims+'ringmarket/'; // for production use:  'http://image.ringid.com/ringmarket/'
            settings.mediaServer = ob.vodapi + '/stream/';
            settings.mediaBase = ob.vodres;

            settings.stickerBase = ob.stmres +'stickermarket/d5/';  // protocol+'image.ringid.com/ringmarket/StickerHandler/',
            settings.stickerApi = ob.stmapi + 'ringmarket/StickerHandler/?pf=5&v=' + settings.apiVersion + '&';  // protocol+'image.ringid.com/ringmarket/StickerHandler/',
        }
        settings.updateUrlBase = setUrlBase;
        settings.updateUrlBase(setting_default);

        var PLATFORM = {
            DESKTOP : 1,
            ANDROID : 2,
            IPHONE : 3,
            WINDOWS : 4,
            WEB : 5
        };

        var RING_ROUTES = {
            HOME : '/',
            USER_PROFILE : '/profile/:uId/:subpage?/:albumId?',
            CIRCLE_HOME : '/circle/:circleId/:subpage?',
            CIRCLE : '/circle',
            WHO_SHARED_FEED : '/feed_shares/:feedId/:commentId?',
            SINGLE_FEED : '/feed/:feedId/:commentId?/:shared?',
            SINGLE_IMAGE : '/image/:imageId/:commentId?',
            SINGLE_MEDIA : '/media/:mediaId/:commentId?',
            MEDIA_FEEDS:'/medias',
            LOGIN_SOCIAL: '/social/:operation/:platform/:token',
            SIGNUP_SOCIAL: '/social/:operation/:platform/:token',

		    MEDIA_CLOUD : '/media',
            MEDIA_POST: '/media/upload',
		    MEDIA_CLOUD_MYALBUM : '/media/myalbums',
		    MEDIA_CLOUD_ALBUM : '/media/:albumtype',
		    MEDIA_CLOUD_SEARCH : '/media/:stype/:sk?',
	        MEDIA_CLOUD_USERMEDIA   :    '/media/:albumtype/:utid/:albumid',
            FAQ : '/faq',
            /*** only for dev build ***/
            API_DASHBOARD : '/apidashboard' /*** ***/
        };

     var DEFAULTS_TITLE = 'ringID: Free Video Calls, Secret Chats, Feeds, Stickers & more';
     var PAGE_TITLES = {
          DEFAULT : DEFAULTS_TITLE
     };
	 PAGE_TITLES[RING_ROUTES['HOME']] = DEFAULTS_TITLE;
	 PAGE_TITLES[RING_ROUTES['CIRCLE_HOME']] = "ringID Circle";
	 PAGE_TITLES[RING_ROUTES['CIRCLE']] = "ringID Circle";
     PAGE_TITLES[RING_ROUTES['SINGLE_FEED']] = DEFAULTS_TITLE;
     PAGE_TITLES[RING_ROUTES['MEDIA_FEEDS']] = "Media Feeds";
     PAGE_TITLES[RING_ROUTES['MEDIA_CLOUD']] = "Media Cloud";
     PAGE_TITLES[RING_ROUTES['MEDIA_POST']] = "Media Cloud";
     PAGE_TITLES[RING_ROUTES['MEDIA_CLOUD_MYALBUM']] = "Media Cloud";
     PAGE_TITLES[RING_ROUTES['MEDIA_CLOUD_ALBUM']] = "Media Cloud";
     PAGE_TITLES[RING_ROUTES['MEDIA_CLOUD_SEARCH']] = "Media Cloud";
     PAGE_TITLES[RING_ROUTES['MEDIA_CLOUD_USERMEDIA']] = "Media Cloud";

    angular
        .module('ringid.config')
        .constant('settings', settings)
        .constant('PLATFORM', PLATFORM)
        .constant('RING_ROUTES', RING_ROUTES)
        .constant('PAGE_TITLES', PAGE_TITLES)
        .constant("MIN_TIMESTAMP",15976308080961);// the first timestamp when the project started

