    angular.module('ringid.profile')
        .directive('rgRelocateTemplate', function() {
            return {
                restrict: 'E',
                template: '<ng-include src="template"></ng-include>',
                link: function(scope, elem, attr) {
                    var twocol = attr.twocol;
                    var threecol = attr.threecol;
                    scope.template = threecol;


                    if (window.innerWidth > 1800 || window.innerWidth <1200 && scope.template != threecol) {
                        scope.template = threecol;
                    }
                    else if (window.innerWidth > 1200 && window.innerWidth <1800 && scope.template != twocol) {
                        scope.template = twocol;
                    }

                    window.onresize = function() {
                        if (window.innerWidth > 1800 || window.innerWidth <1200 && scope.template != threecol) {
                            scope.template = threecol;
                            scope.$apply();
                        }
                        else if (window.innerWidth > 1200 && window.innerWidth <1800 && scope.template != twocol) {
                            scope.template = twocol;
                            scope.$apply();
                        }
                    }
                }
            }
        });

