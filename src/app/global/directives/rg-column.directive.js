/*
 * © Ipvision
 */

angular.module('ringid.global_directives')
.directive('rgColumn', ['$document','Storage','Utils',
    function ($document,Storage,Utils) {
        return {
            restrict: "A",
            controller : ['Utils','$scope','SystemEvents','$rootScope',
            function(Utils,$scope,SystemEvents,$rootScope){
                $scope.spans = Utils.feedColumn();
                $scope.defaultSpan = Utils.getDefaultColumn();
                $scope.choose = function(val){

                    Utils.resetScroll();
                    Utils.animateScroll();

                    Utils.setFeedColumn(val);
                    $scope.spans = val;
                    $rootScope.$broadcast(SystemEvents.COMMON.COLUMN_CHANGED, val);
                };
                $scope.$watch(Utils.feedColumn, function(newValue) {
                    $scope.spans = newValue;
                    $rootScope.$broadcast(SystemEvents.COMMON.COLUMN_CHANGED, newValue);
                });
                $scope.$on(SystemEvents.COMMON.WINDOW_RESIZED,function(){
                    $scope.defaultSpan = Utils.getDefaultColumn();
                });
            }],//l-act
            template : '<span></span>\
                        <span></span>\
                        <span></span>\
                        <div class="col-area">\
                        <div class="col-area-wrapper">\
                            <div class="list-ico width-26 top-l" data-tool="3 Column" ng-click="choose(3)"  ng-if="defaultSpan > 2" ng-class="{\'list-act\' : spans == 3 }">\
                                <span></span>\
                                <span></span>\
                                <span></span>\
                            </div>\
                            <div class="list-ico width-17 top-l" data-tool="2 Column" ng-click="choose(2)"  ng-if="defaultSpan > 1" ng-class="{\'list-act\' : spans == 2 }">\
                                <span></span>\
                                <span></span>\
                            </div>\
                            <div  class="list-ico width-9 top-l" data-tool="1 Column" ng-click="choose(1)" ng-class="{\'list-act\' : spans == 1 }">\
                                <span></span>\
                            </div>\
                            </div>\
                        </div>',
            link: function (scope, element, attrs, ctrls) {
                var dropEl;


                function bindFn(event) {
                    event.preventDefault();
                    if(!dropEl){
                        dropEl = angular.element(element.find('div')[0]);
                        $document.on("click", bindDocumentClicktoControlClose);
                    }
                    dropEl.toggleClass('colshow');
                }
                function bindDocumentClicktoControlClose (e) {
                    var checkEl = element.parent().parent()[0];
                    if (e.target != checkEl && e.target.parentNode != checkEl && e.target.parentNode !=null && e.target.parentNode.parentNode != checkEl && e.target.className != 'pt-top') {
                        closeColumnSelector(e);
                    }

                }
                element.parent().parent().on("click", bindFn);

                function closeColumnSelector (event) {
                    dropEl.removeClass('colshow');
                }

                scope.$on("$destroy", function() {
                    element.off("click",bindFn);
                    $document.off("click",bindDocumentClicktoControlClose);
                    dropEl = undefined;
                });

            }
        };
    }
]);
