/*
 * Md. Ibrahim Rashid
 * © Ipvision
 */


        var TAG_CHAT_LANG = {

            STATUS_MESSAGES : {

                SELF_ADD_MEMBER                                 : 'You added {new_member_name} as Group {new_member_type}.',
                SELF_ADD_MULTIPLE_MEMBER                        : 'You added {new_member_name} and {rest_count} as Group {new_member_type}.',

                SELF_REMOVE_MEMBER                              : 'You removed {old_member_name} from the group.',
                SELF_REMOVE_MULTIPLE_MEMBER                     : 'You removed {old_member_name} and {rest_count} from the group.',

                OTHER_ADD_MEMBER                                : '{member_name} added {new_member_name} as Group {new_member_type}.',
                OTHER_ADD_MULTIPLE_MEMBER                       : '{member_name} added {new_member_name} and {rest_count} as Group {new_member_type}.',

                OTHER_REMOVE_MEMBER                             : '{member_name} removed {old_member_name} from the group.',
                OTHER_REMOVE_MULTIPLE_MEMBER                    : '{member_name} removed {old_member_name} and {rest_count} from the group.',

                SELF_LEAVE_GROUP                                : 'You left this conversation.',
                OTHER_LEAVE_GROUP                               : '{member_name} left this conservation.',

                SELF_RENAME_GROUP                               : 'You named the group {group_name}.',
                OTHER_RENAME_GROUP                              : '{member_name} named the group {group_name}.',

                SELF_CHANGE_GROUP_PIC                           : 'You changed the group photo.',
                OTHER_CHANGE_GROUP_PIC                          : '{member_name} changed the group photo.',

                SELF_UPDATE_GROUP_INFO                          : 'You named the group {group_name} and changed the group photo.',
                OTHER_UPDATE_GROUP_INFO                         : '{member_name} named the group {group_name} and changed the group photo.',

                SELF_MEMBER_CHANGE_TO_ADMIN                     : 'You made {old_member_name} Group Admin.',
                OTHER_MEMBER_CHANGE_TO_ADMIN                    : '{member_name} made {old_member_name} as Admin.',

                SELF_MULTIPLE_MEMBER_CHANGE_TO_ADMIN            : 'You made {old_member_name} and {rest_count} as Group admin.',
                OTHER_MULTIPLE_MEMBER_CHANGE_TO_ADMIN           : '{member_name} made {old_member_name} and {rest_count} as Group admin.',


                SELF_ADMIN_CHANGE_TO_MEMBER                     : 'You removed {old_admin_name} from Admin.',
                OTHER_ADMIN_CHANGE_TO_MEMBER                    : '{admin_name} removed {old_admin_name} from Group Admin.',

                SELF_MULTIPLE_ADMIN_CHANGE_TO_MEMBER            : 'You removed {old_admin_name} and {rest_count} as Group admin.',
                OTHER_MULTIPLE_ADMIN_CHANGE_TO_MEMBER           : '{admin_name} removed {old_admin_name} and {rest_count} from Group Admin.',

                SELF_REMOVED_FROM_ADMIN_BY_SELF                 : 'You removed yourself from Admin',

                OTHER_REMOVED_FROM_ADMIN_BY_SELF                : '{admin_name} removed himself/herself from Admin',

                SELF_USER_ADDED_AS_OWNER                        : '{member_name} made you owner.',
                OTHER_USER_ADDED_AS_OWNER                       : '{member_name} made {admin_name} Owner. ',

                SELF_NOT_GROUP_MEMBER                           : 'You are no longer member of this group'

            },

            DEFAULT_FAILURE_MESSAGE : 'Request has not been processed successfully. Please try again',
            DEFAULT_SUCCESS_MESSAGE : 'Request has been processed successfully.'

        };

        var CHAT_LANG = {

            MESSAGE_DELETE_TEXT : 'This message has been deleted'
        };


        var ChatApp = angular.module('ringid.chat');
        ChatApp.constant('CHAT_LANG', {
            'TAG' : TAG_CHAT_LANG,
            'CHAT' : CHAT_LANG
        });


