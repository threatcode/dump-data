        angular.module('ringid.language')
        .factory('languageConstant', function(){
            var languages = {
                    'default' :{
                        'add_friend'    : 'Add Friend',
                        'remove_friend' : 'Remove Friend',
                        'common_friend' : 'Common Friend',
                        'request_sent'  : 'Request Sent',
                        'unfriend'      : 'Unfriend',
                        'block'         : 'Block',
                        'unblock'       : 'UnBlock',
                        'edit'          : 'Edit',
                        'update'        : 'Update',
                        'delete'        : 'Delete',
                        'cancel'        : 'Cancel',
                        'save'          : 'Save',
                        'text_add'      : 'Add',
                        'accept'        : 'Accept',
                        'remove'        : 'Remove',
                        'change'        : 'Change',
                        'send'          : 'Send',
                        'verify'        : 'verify',
                        'add'           : 'Add'

                    }
            };


            return {

                set : function(lang){
                    languages[lang] = {};
                },
                get : function(key, lang){
                    key = key || 'default';
                    //if(!lang || !languages[lang])lang = config_lang;

                   //return (!!languages[lang][key] && languages[lang][key]) || key;

                    return languages[key];
                }

            };
        });


