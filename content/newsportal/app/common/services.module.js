/*
 * © Ipvision
 */

(function() {
	'use strict';

	angular
		.module('ringid.common.services', [
            'ringid.common.media_metadata_service',
            'ringid.common.file_upload_service',
            'ringid.common.image_quality_service',
			'ringid.config',
			'ngWebSocket'
			//'ngCookies'
			])
		.factory('countryListService', countryListService)
        // get list of countries with code from a json file
		countryListService.$inject = ['$ringhttp', 'settings'];
		function countryListService($ringhttp, settings) {
			return {
					getList: function(forSignup) {
						return $ringhttp.get( settings.baseUrl + '/resources/countries.json');
					}
			};
		}
})();
