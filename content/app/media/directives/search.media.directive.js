/**
 * Created by User on 23-Jan-16.
 */
/**
 * © Ipvision
 */

    angular
        .module('ringid.media')
        .directive('rgMediaSearchDirective', rgMediaSearchDirective);

    rgMediaSearchDirective.$inject = [ '$document', 'Media' ];
    function rgMediaSearchDirective( $document, Media ) { // jshint ignore:line

        searchDirectiveController.$inject = ['$rootScope','OPERATION_TYPES', '$scope', 'Media','$location','rgScrollbarService','GlobalEvents' ];
        function searchDirectiveController ($rootScope,OPERATION_TYPES, $scope, Media,$location,rgScrollbarService,GlobalEvents ) { //jshint ignore:line

            var OTYPES = OPERATION_TYPES.SYSTEM.MEDIA;

            var self = this;

            $scope.showDropdown = false;
            $scope.stoploader = false;
            $scope.showTrending = false;

            $scope.searchResult = [];
            $scope.trendingArr = [];

            $scope.doSearch = function () {
                $scope.searchResult = [];
                $scope.stoploader = false;

                if( !$scope.searchParam ) {
                    $scope.showDropdown = false;
                    $scope.showTrending = true;
                }else{
                    $scope.showTrending = false;
                    //Media.fetchSearchResult( $scope.searchParam );
                    Media.fetchSearchResult( $scope.searchParam ).then(mediaSearchResultProcess);
                    $scope.showDropdown = true;
                }
                // GlobalEvents.bindHandler('document', 'click', self.closeDropdown);
            };

            $scope.doContentSearch = function ( obj ) {
                var searchurl;
                $scope.showDropdown = false;
                switch ( obj.sugt ) {
                    case 1 :
                        searchurl = '/media/songs/'+obj.sk;
                        $location.path(encodeURI(searchurl));
                        $rootScope.$rgDigest();
                        break;
                    case 2 :
                        searchurl = '/media/albums/'+obj.sk;
                        $location.path(encodeURI(searchurl));
                        $rootScope.$rgDigest();
                        break;
                    case 3 :
                        searchurl = '/media/tags/'+obj.sk;
                        $location.path(encodeURI(searchurl));
                        $rootScope.$rgDigest();
                        break;
                }

            };

            $scope.fetchTrendingKeyword = function(){
                $scope.showDropdown = true;
                if($scope.trendingArr.length > 0){
                    // $scope.showDropdown = true;
                    $scope.showTrending = true;
                    $scope.$rgDigest();
                   return;
                }


                Media.getSearchTrends().then(function(data){
                    if ( data.sucs === true ) {
                        for(var i = 0; i < data.sgstn.length; i++) {
                            console.log(data.sgstn[i]);
                            switch (data.sgstn[i].sugt){
                                case 1 :
                                    data.sgstn[i].searchtype = 'songs';
                                    break;
                                case 2 :
                                    data.sgstn[i].searchtype = 'albums';
                                    break;
                                case 3 :
                                    data.sgstn[i].searchtype = 'tags';
                                    break;
                            }
                            $scope.trendingArr.push(data.sgstn[i]);
                        }

                        $scope.showTrending = true;
                    }

                    $scope.$rgDigest();
                });
            };

            $scope.hideDropdown = function(){
                $scope.showDropdown = false;
                $scope.showTrending = false;
                $scope.searchParam  = '';
                $scope.searchResult = [];
                // $scope.trendingArr = [];
            };

            $scope.$on('$destroy', function() {
                $scope.trendingArr = [];
                $scope.searchResult = [];
            });

            // self.closeDropdown = function() {
            //     // close dropdown
            //     $scope.searchParam = '';
            //     $scope.showDropdown = false;
            //     GlobalEvents.unbindHandler('document', 'click', self.closeDropdown);
            //     $scope.$rgDigest();
            // };



            function mediaSearchResultProcess(data){
                var i;
                switch (data.actn) {

                    case OTYPES.ACTION_MEDIA_SEARCH_RESULT :
                        if ( data.sucs === true ) {
                            $scope.showDropdown = true;
                            for(i=0;i<data.sgstn.length;i++){
                                //console.log(data.sgstn[i]);
                                $scope.searchResult.push(data.sgstn[i]);
                            }
                            //console.log($scope.searchResult);
                            //rgScrollbarService.recalculate();
                        }else{
                            $scope.stoploader = true;
                        }
                        rgScrollbarService.recalculate($scope);
                        break;
                    default :
                        break;

                }
                $scope.$rgDigest();

            }

        }

        var linkFunc = function(scope,element) {
            element.bind('click',function(){
                //console.log(scope.medias.all());
            });

            var input = element.find('input');
            scope.activeId = 0;
            scope.setActiveId = function(i){
              scope.activeId = i;
            }


            input.on('keydown',function(event){

                if(event.keyCode===13){
                    if(scope.searchParam){
                        scope.doContentSearch({sk: scope.searchParam, sugt: 1});
                    }
                }

            })



            element.on('keydown',function(event){
                if(event.keyCode === 13) {
                    if(scope.searchResult.length){
                        var result = scope.searchResult[scope.activeId];
                        scope.doContentSearch({sk: result.sk, sugt: result.sugt});
                    }
                }else if(event.keyCode === 38) {
                    scope.activeId = Math.max(scope.activeId - 1,0);
                    scope.$rgDigest();
                }else if(event.keyCode === 40){
                    scope.activeId = Math.min(scope.activeId+1,scope.searchResult.length-1);
                    scope.$rgDigest();
                }
            })

        };

        return {
            restrict: 'E',
            controller: searchDirectiveController,
            link: linkFunc,
            templateUrl: 'templates/mediasearch/media-search-directive.html'
        };
    }

