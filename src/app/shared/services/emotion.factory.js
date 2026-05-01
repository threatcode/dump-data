
    angular
        .module('ringid.shared')
        .factory('EmotionFactory', ['$$connector', 'settings', 'OPERATION_TYPES', function ($$connector, settings, OPERATION_TYPES) {
            var emotions = {}, OTYPES = OPERATION_TYPES.SYSTEM,count=0,SCOPES={};

            function createEmotion(ob) {
                return {
                    id: ob.id,
                    title: ob.nm,
                    nm: ob.nm,
                    url: settings.emotionServer + ob.url,
                    cat: ob.cat
                };
            }

            function process(message) {
                var i;
                if (message.sucs && message.mdLst.length) {
                    for (i = 0; i < message.mdLst.length; i++) {
                        emotions[message.mdLst[i].id] = createEmotion(message.mdLst[i]);
                        count++;
                    }
                }

                safeDigest();

            }

            var subKey = $$connector.subscribe(process, {
                action: OTYPES.FETCH_EMOTION_LIST
            });

            function getEmotions() {
                var arr = [];
                for(var key in emotions){
                    if(emotions.hasOwnProperty(key)){
                        arr.push(emotions[key]);
                    }
                }
                return arr;
            }
            function safeDigest(){
                var digestScope;
                for(var key in SCOPES){
                    digestScope = SCOPES[key];
                    if(digestScope && digestScope.$id && !digestScope.$$destroyed){
                        digestScope.setEmotion.call(digestScope,getEmotions());
                    }
                }

            }
            function init() {
                if (!count) {
                    $$connector.send({
                        actn: OTYPES.FETCH_EMOTION_LIST
                    }, OTYPES.REQUEST_TYPE.REQUEST);
                }else{
                    safeDigest();
                }

            }

           // init();
            return {
                init: init,
                getEmotions: getEmotions,
                getLength: function () {
                    return count;
                },
                getEmotion: function (ob, createIfNotExist) {
                    var id = angular.isObject(ob) ? ob.id : ob;
                    if (!createIfNotExist)return emotions[id] || false;
                    if (!!emotions[id])return emotions[id];
                    if (angular.isObject(ob))return createEmotion(ob);
                    return false;
                },
                setScopeForDigest : function(scope){
                    SCOPES[scope.$id] = scope;
                },
                removeScope : function(scope){
                    if(SCOPES[scope.$id]){
                        SCOPES[scope.$id] = null;
                    }
                }
            }
        }])


