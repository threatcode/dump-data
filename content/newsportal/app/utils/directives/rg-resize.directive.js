/**
 * Created by USER on 09-Sep-15.
 */
(function () {
    'use strict';
    var app;
    app = angular.module('ringid.utils');
    app.directive('rgResize',rgResize);
    rgResize.$inject = ['utilsFactory','$window','$rootScope','SystemEvents'];
    function rgResize (utilsFactory,$window,$rootScope,SystemEvents) {
        return function (scope,element,attr) {

            //scope.windowHeight = utilsFactory.viewport.y;
            //scope.windowWidth = utilsFactory.viewport.x;

             var wEl = angular.element($window);

             wEl.bind('resize', function () {

                    requestAnimationFrame(function() {
                      
                          var newValue =utilsFactory.viewportsize();

                          $rootScope.windowHeight = newValue.y;
                          $rootScope.windowWidth = newValue.x;
                          utilsFactory.viewport.x = newValue.x;
                          utilsFactory.viewport.y = newValue.y;
                          utilsFactory.viewport.yo = newValue.yo;
                          utilsFactory.setFeedCellWidth();

                          $rootScope.$broadcast(SystemEvents.COMMON.WINDOW_RESIZED,utilsFactory.viewport);

                    });
                  
              });   
        }
    };

})();
