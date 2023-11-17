describe("Filters", Function() {

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

        describe("validProfileImage", function() {
            var validProfileImage;
            beforeEach(inject(function($filter) {
                validProfileImage = $filter('validProfileImage', {});
            }));

            it("should check if profile image default image or user defined", function() {

            });
        });
});
