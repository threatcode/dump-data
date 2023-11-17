/*
* © Ipvision
*/

(function() {
    'use strict';
    angular
        .module('ringid.common.factories', [
            'ringid.common.global_events_factory',
            'ringid.common.storage_factory',
            'ringid.common.events_factory',
            'ringid.common.user_factory',
            'ringid.common.stacked_map',
		    'ringid.common.imagemap_factory',
            'ringid.common.album_factory',
		    'ringid.common.comment_factory',
            'ringid.common.emotion_factory',
            'ringid.common.invite_factory'
        ]);
})();
