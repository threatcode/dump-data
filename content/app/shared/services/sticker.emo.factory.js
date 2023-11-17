/**
 * © Ipvision
 */

    angular
        .module('ringid.shared')
        .service('StickerEmoticonService', StickerEmoticonService)
        .factory('StickerEmoticonFactory', StickerEmoticonFactory);

    StickerEmoticonService.$inject = [ 'STICKER_IMAGE_TYPE', 'settings' ];
    function StickerEmoticonService(STICKER_IMAGE_TYPE, settings){
        var self = this;

        /*var emoPattern = /\(laugh\-with\-tears\)|:\)|:\(|:D|\(cool\)|:O|;\)|;\(|\(:|:l|:P|:\$|\|\-\)|\|\-\(|\(in\-love\)|\(evil\-grin\)|\(yn\)|\(yawn\)|\(puke\)|\(doh\)|\(angry\)|\(angry2\)|\(wasntme\)|\(party\)|\(devil\)|\(angel\)|\(worry\)|\(nerd\)|\(zipping\-his\-mouth\)|\(facepalm\)|\(envy\)|\(wait\)|\(rofl\)|\(dap\)|\(shake\)|\(an\-happy\)|\(shame\)|\(sta\)|\(nice\)|\(ms\-of\)|\(tness\)|\(e\-smile\)|\(trouble\)|\(over\)|\(amour\)|\(minus\)|\(unex\)|\(forgotten\)|\(flashed\)|\(head\-hot\)|\(re\-sad\)|\(creative\-man\)|\(regretted\-borne\-crying\)|\(extreme\-crying\)|\(pointing\-an\-accusing\-finger\)|\(with\-headphones\)|\(furious\)|\(exhausted\)|\(shouting\)|\(panic\)|:x|\(reading\-a\-newspaper\)|\(happy\-birthday\)|\(run\)|:\*\(girl\)|:\*\(boy\)|\(cartoon\-alarm\-clock1\)|\(cartoon\-alarm\-clock2\)|\(brokenheart\)|<3|\(fire\)|\(flower\)|\(gift\)|\(kiss\)|\(pinkheart\)|\(redkiss\)|\(\*\)|\(sun\)/g;
        */var emoMap = {
            ':D' : 'awesome.png',
            ':<3' : 'loved.png',
            '*D*' : 'excited.png',
            ':)' : 'happy.png',
            ':\-(' : 'alone.png',
            '(cool)' : 'cool.png',
            'x=(' : 'angry.png',
            'o_\-' : 'fresh.png',
            ':>s' : 'sick.png',
            ':?' : 'confused.png',
            ';|' : 'thoughtful.png',
            ':*' : 'fantastic.png',
            ':=(' : 'upset.png',
            '>u<' : 'blah.png',
            '(amused)' : 'amused.png',
            '(hot)' : 'hot.png',
            '(\-_^)' : 'motivated.png',
            '(^_^)' : 'satisfied.png',
            '>=<' : 'hurt.png',
            ':(s' : 'ill.png',
            '(cute)' : 'cute.png',
            'I=)' : 'relived.png',
            ':O' : 'shoked.png',
            '(beautiful)' : 'beautiful.png',
            ':|p' : 'hyper.png',
            '(pumped)' : 'pumped.png',
            '%)' : 'drunk.png',
            'o(' : 'impatient.png',
            '(restless)' : 'restless.png',
            ':-)' : 'emotional.png',
            '(hungry)' : 'hungry.png',
            '(nostalgic)' : 'nostalgic.png',
            '(blessed)' : 'blessed.png',
            '</3' : 'heartboken.png',
            '(naughty)' : 'naughty.png',
            '(entertained)' : 'entertained.png',
            '(broken)' : 'broken.png',
            '(cold)' : 'cold.png',
            '(down)' : 'down.png',
            '(sorry)' : 'sorry.png',
            '(frustrated)' : 'frustrated.png',
            ':\-s' : 'scared.png',
            ':@' : 'fuming.png',
            'NN' : 'run.png',
            ':\'q' : 'crying.png',
            ':\'D' : 'laughing.png',
            ':\'(' : 'soreness.png',
            '(boiling)' : 'boiling.png',
            ':x' : 'xmode.png',
            ':p' : 'cheeky.png',
            ':=0' : 'laughing-inside.png',
            '|\-O' : 'yawn.png',
            ':6' : 'devil.png',
            ':\-#' : 'zipped-lip.png',
            '(clap)' : 'clap.png',
            '<3' : 'heart.png',
            '(pink\-heart)' : 'pink-heart.png',
            '(k)' : 'pink-lip.png',
            '(#)' : 'sun.png',
            '(*)' : 'star.png',
            '(g)' : 'gift.png',
            '(K)' : 'red-lip.png',
            '(f)' : 'rose.png'

        },// duplicate glu for htmlentityencode
        largeEmoMap = angular.extend({
                                         ':\&lt;3' : 'loved.png',
                                         '\&lt;\/3' : 'heartboken.png',
                                         '\&gt;=\&lt;' : 'hurt.png',
                                         '\&gt;u\&lt;' : 'blah.png',
                                         ':\&gt;s' : 'sick.png',
                                         '\&lt;3' : 'heart.png'

                                         // ':\&lt;3' : 'loved.png',
                                         // '\&lt;\/3' : 'heartboken.png',
                                         // '\&gt;=\&lt;' : 'hurt.png',
                                         // '\&gt;u\&lt;' : 'blah.png',
                                         // ':\&gt;s' : 'sick.png',
                                         // '\&lt;3' : 'heart.png',

                                     }, emoMap);
                    //emo map converting function
         function escapeRegExp(str) {
              return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
         }
         var retstr = [];
         for(var key in largeEmoMap){
            if(largeEmoMap.hasOwnProperty(key)){
               retstr.push(escapeRegExp(key));
            }
         }
         // for


        var emoPattern = new RegExp(retstr.join("|"),'g');

        self.getEmoImageName = function(symbolKey){
            try{

                return emoMap[symbolKey]

            }catch(e){
                return 'default.png'
            }
        };


        self.getAllEmoticons = function(){
            var allEmoticons = { type : STICKER_IMAGE_TYPE.EMOTICON, imageList: []},i=0;
            angular.forEach(emoMap, function(anEmoImageName, emoSymbol){
                //console.log(anEmoImageName,emoSymbol,i++);
                allEmoticons['imageList'].push({
                    name : anEmoImageName,
                    symbol : emoSymbol,
                    type: STICKER_IMAGE_TYPE.EMOTICON

                });
            });

            return allEmoticons;
        };

        self.getEmoticonUrlMap = function(){
            var emoticonUrlMap = {}
            angular.forEach(emoMap, function(anEmoImageName, emoSymbol){
                emoticonUrlMap[emoSymbol] = settings.emoticonBase + anEmoImageName;
            });
            return emoticonUrlMap;
        };
        self.getEmoticonUrlMapWithHtmlEncode = function(){
            var emoticonUrlMap = {}
            angular.forEach(largeEmoMap, function(anEmoImageName, emoSymbol){
                emoticonUrlMap[emoSymbol] = settings.emoticonBase + anEmoImageName;
            });
            return emoticonUrlMap;
        };

        self.getEmoticonPattern = function(){
            return emoPattern;
        };

        self.getEmoticonMap = function(){
            return largeEmoMap;
        };
    }


    StickerEmoticonFactory.$inject = ['StickerEmoticonService'];
    function StickerEmoticonFactory(StickerEmoticonService){


        function getAllEmoticons(){
            return StickerEmoticonService.getAllEmoticons()
        }

        function getEmoImageName(symbolKey){
            return StickerEmoticonService.getEmoImageName(symbolKey);
        }

        function getStickerImageUrl(collectionId, categoryId, imageName){
            var url = settings.stickerBase + collectionId + '/' + categoryId + '/' + imageName;
            return url;
        }

        return {

            getAllEmoticons : getAllEmoticons,
            getEmoImageName: getEmoImageName,
            getStickerImageUrl: getStickerImageUrl,
            getEmoticonUrlMap : StickerEmoticonService.getEmoticonUrlMap,
            getEmoticonUrlMapWithHtmlEncode : StickerEmoticonService.getEmoticonUrlMapWithHtmlEncode,
            getEmoticonPattern : StickerEmoticonService.getEmoticonPattern

        }

    }
    /**
     //emo map converting function
     function escapeRegExp(str) {
          return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
     }
     var retstr = [];
     for(var key in map){
        if(map.hasOwnProperty(key)){
           retstr.push(escapeRegExp(key));
        }
     }
    retstr.join("|");
     */
