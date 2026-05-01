/*
 * © Ipvision
 */

(function() {
    'use strict';

    angular
        .module('ringid.common.events_factory', [])
        .factory('SystemEvents', SystemEvents);


    SystemEvents.$inject = ['$rootScope'];
    function SystemEvents(){
        return {
            COMMON : {
                WINDOW_RESIZED : 'WINDOW_RESIZED',
                COLUMN_CHANGED : 'COLUMN_CHANGED',
                LOADING: 'LOADING'
            },
            CIRCLE : {
                MY_CIRCLE_LIST_FETCH_COMPLETE : 'MY_CIRCLE_LOAD_COMPLETE',
                MY_CIRCLE_LIST_PROCESS_COMPLETE : 'MY_CIRCLE_LIST_PROCESS_COMPLETE',

                MY_CIRCLE_MEMBER_LIST_FETCH_COMPLETE : 'MY_CIRCLE_MEMBER_LIST_FETCH_COMPLETE',
                MY_CIRCLE_MEMBER_LIST_PROCESS_COMPLETE : 'MY_CIRCLE_MEMBER_LIST_PROCESS_COMPLETE',

                MY_CIRCLE_MEMBER_LIST_UPDATE_COMPLETE : 'MY_CIRCLE_MEMBER_LIST_UPDATE_COMPLETE',

                MY_CIRCLE_MEMBER_REMOVED : 'MY_CIRCLE_MEMBER_REMOVED',

                MY_CIRCLE_REMOVED : 'MY_CIRCLE_REMOVED',
                MY_CIRCLE_UPDATE_MEMBER_COUNT : 'MY_CIRCLE_UPDATECOUNT',

            },

            FILE_UPLOAD : {
                PROGRESS_UPDATE : 'PROGRESS_UPDATE',
                QUEUE_START : 'QUEUE_START',
                QUEUE_COMPLETE : 'QUEUE_COMPLETE',
                UPLOADS_POSTED : 'UPLOADS_POSTED'
            },

            ALBUM : {
                PHOTOS_SELECTED : 'PHOTOS_SELECTED'
            },

            IMAGE : {
                DO_REPOSITION : 'DO_REPOSITION',
                RESIZE: 'RESIZE'
            },

            FEED : {

                UPDATED : 'UPDATED',
                CREATED : 'CREATED',
                DELETED : 'DELETED',
                RESET : 'RESET',
                HEIGHT : 'HEIGHT',
                BUSY : 'BUSY'

            },

            AUTH: {
                LOGIN : 'LOGIN'
            },

            CHAT : {
                CHAT_REGISTER : 'CHAT_REGISTER',
                MESSAGE_RECEIVED : 'MESSAGE_RECEIVED',
                MESSAGE_SUBMITTED : 'MESSAGE_SUBMITTED',

                TAB_SYNC : 'TAB_SYNC',
                TAB_SYNC_NEW_DATA : 'TAB_SYNC_NEW_DATA',

                UNREAD_MESSAGE_INFO_UPDATED : 'UNREAD_MESSAGE_INFO_UPDATED'
            }




        }

    }


})();
