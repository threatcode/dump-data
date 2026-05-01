/*
 * © Ipvision
 */

(function() {
	'use strict';

	angular
		.module('ringid.filters', ['ringid.config'])
		.filter('validProfileImage', validProfileImage)
		.filter('friendListFilter', friendListFilter) // filter by a regex
		.filter('mapListFilter', mapListFilter) // filter friend map list by another user map list
		.filter('stackMapFilter', stackMapFilter)
		.filter('ymdDateFilter', ymdDateFilter)
		.filter('mediaFilter', mediaFilter)
		.filter('mapFilter', mapFilter)
		.filter('objectFilter', objectFilter);

		validProfileImage.$inject = ['settings'];
		function validProfileImage (settings) {
			return function(item) {
				return item.indexOf('prof.png') > 0 ? item : settings.imBase + item;
			};
		}

		function stackMapFilter() {
			return function(items, filterItems) {
				if (items) {
					for (var i = 0; i < items.length; i++) {
						if (filterItems.get(items[i].key)) {
							console.log('got a matching item:' + items[i].key);
						}
					}
					return items;
				}
			};
		}

        friendListFilter.$inject = ['APP_CONSTANTS'];
		function friendListFilter(APP_CONSTANTS) {
			return function(items, obj) {
				if (items) {
					var filtered = [];
                    //var nameMatch = new RegExp(obj.name, 'ig');
                    var nameMatch = obj.name.toLowerCase();
					for (var i = 0; i < items.length; i++) {
                        if(obj.showMutual && items[i].value.friendshipStatus() !== APP_CONSTANTS.FRIEND) {
                            continue;
                        }
                        //if ( nameMatch.test(items[i].value.getName())) {
                        if (nameMatch.length === 0 || items[i].value.getName().toLowerCase().indexOf(nameMatch) > -1) {
                            filtered.push(items[i]);
                        }
					}
					return filtered;
				}
			};
		}


		function mapListFilter() {
			return function(items, filterList) {
				if (items) {
					var filtered = [];
					for(var i = 0; i < items.length; i++) {
						if( ! filterList.get( items[i].value.getKey() ) ) {
							filtered.push(items[i]);
						}
					}
					return filtered;
				}
			};

		}

		function ymdDateFilter() {
			return function(date) {
				var d = new Date(date),
					month = '' + (d.getMonth() + 1),
					day = '' + d.getDate(),
					year = d.getFullYear();

				if (month.length < 2) {
                    month = '0' + month;
                }
				if (day.length < 2) {
                    day = '0' + day;
                }

				return [year, month, day].join('-');
			};
		}


		function mediaFilter() {
			return function(items, mediaType) {
				if (items) {
					var filtered = [];
					for(var i = 0; i < items.length; i++) {
						if( items[i].value.getType() === mediaType ) {
							filtered.push(items[i]);
						}
					}
					return filtered;
				}
			};

		}

        // generic Map Filter
		function mapFilter() {
			return function(items, obj) {
				if (items) {
					var filtered = [],
						nameToMatch = obj.value ? obj.value.toLowerCase(): '';
						//regEx;
					for(var i = 0; i < items.length; i++) {

						//nameMatch = items[i].value[obj.mapApi]().toLowerCase();
						//if ( nameMatch.test(items[i].value.getName())) {
						if (items[i].value[obj.mapApi]().toLowerCase().indexOf(nameToMatch) > -1) {
							filtered.push(items[i]);
						}

						//if(obj.hasOwnProperty('compare') && obj.compare === 'regex') {
					     //   regEx = new RegExp(obj.value || '', 'ig');
                         //   if (regEx.test( items[i].value[obj.mapApi]() )) {
						//	    filtered.push(items[i]);
                         //   }
                        //
						//} else if (items[i].value[obj.mapApi]() === obj.value) { // default is just plain equal compare
						//	filtered.push(items[i]);
						//}
					}
					return filtered;
				}
			};

		}


        function objectFilter() {
            function compareString(compareTo, compareThis) {
                return compareTo.indexOf(compareThis) > -1;
            }

            function compareDefault(compareTo, compareThis) {
                return compareThis === compareTo;
            }

            return function(items, obj) {
                var compareFunc, filtered = [];
                if (items && items.length > 0) {
                    switch(obj.compare) {
                        case 'string':
                            compareFunc = compareString;
                            break;
                        default:
                            compareFunc = compareDefault;
                    }

                    for(var i = 0; i < items.length; i++) {
                        if (compareFunc(items[i][obj.prop], obj.value)) {
                            filtered.push(items[i]);
                        }
                    }
                    return filtered;
                }
            };
        }
})();
