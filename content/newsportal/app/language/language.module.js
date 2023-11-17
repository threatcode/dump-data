/*
 * © Ipvision
 */

(function(window) {
    'use strict';
        window.languageConstant = function(){
//config_lang,default_lang
            var languages = {
                'default' :DF_KEY_VALUES
            };


            return {

                set : function(lang){

                    languages[lang] = {}
                },
                get : function(key,lang){
                    key = key || 'default';
                    //if(!lang || !languages[lang])lang = config_lang;

                   //return (!!languages[lang][key] && languages[lang][key]) || key;

                    return languages[key];
                }

            }
        }();


})(window);
