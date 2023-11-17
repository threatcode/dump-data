

    angular.module('ringid.feed')
    .directive('feedTimeoutSelect', feedTimeoutSelect)
    .directive('feedTimoutOption', feedTimoutOption)
    .directive('feedTimeoutMenu', feedTimeoutMenu);


    function feedTimoutOption(){

        return {
            restrict: 'E',
            replace : true,
            templateUrl : 'templates/partials/feed-timeout-option.html',
            link : function(scope){
                    scope.$rgDigest();
            },
            controller : ['$scope',function($scope){

                $scope.rows = [1,9,17];
                $scope.cols = [0,1,2,3,4,5,6,7];
                $scope.lastCols = [25,26,27,28,29,30];

                $scope.select = function(v){
                    if(angular.isFunction($scope.onSelect)){
                        $scope.onSelect({item:v});

                    }
                    $scope.close();
                    $scope.$parent.$rgDigest();
                }

            }]
        };

    };

    function feedTimeoutSelect(){

        return function(scope,element,attr){

            element.on("click",function(e){
                e.stopPropagation();
                scope.select(attr['feedTimeoutSelect']);
            });

            scope.$on('$destroy',function(){
                element.off("click");
            });
        };


    };

    feedTimeoutMenu.$inject = ['$document','$compile'];
    function feedTimeoutMenu($document,$compile) {
        return {
            restrict : 'A',
            scope : {
                onSelect : '&ringOnOptionSelect',
                value : '=selectedValue'
            },
            link : function(scope,element,attr){

                var menuDom, isOpen = false;

                scope.close = function(){
                    if(menuDom) menuDom.remove();
                    menuDom = null;
                    isOpen = false;
                    $document.off("click", checkClickedOnElement);
                };
                scope.$watch('value',function(newval,oldval){
                            if(parseInt(newval) > -1){
                                element.addClass('active');
                            }else{
                                element.removeClass('active');
                            }
                });

                function checkClickedOnElement(e){

                    if(e.target != element[0] && e.target.parentNode != element[0] && e.target.parentNode.parentNode != element[0] && e.target.className !='pt-top') {
                        scope.close();
                    }
                }

                element.on("click",function(event){
                        if(isOpen) {
                          scope.close();
                          return '';
                        }
                    	if(!menuDom){
                        	menuDom = $compile(angular.element('<feed-timout-option></feed-timout-option>'))(scope);
                    	}
                    	element.after(menuDom);
                    	isOpen = true;


                        $document.on("click", checkClickedOnElement);



                });

                scope.$on('$destroy', function(){
                    element.off('click');
                    $document.off("click", checkClickedOnElement);

                });
            }
        };
    }
