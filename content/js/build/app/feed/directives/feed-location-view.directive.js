    var feedApp;

    try {
        feedApp = angular.module('ringid.feed');
    } catch (e) {
        console.warn("Feed Module Not Found");
    }

    feedApp.directive('feedLocationViewItem', feedLocationViewItem);
    function feedLocationViewItem(){
        return {
            restrict: 'E',
            scope: {
                onHover: '&',
                onSelect : '&',
                location : '='
            },
            templateUrl : 'templates/partials/feed_location/item.html',
            link : function(scope, element, attr){

                element.on("click",function(e){
                    e.stopPropagation();

                    if(!!scope.onSelect){
                        scope.onSelect({location: scope.location});
                    }
                });

                if(!!scope.onHover){
                    element.on('mouseover', function(event){
                        scope.onHover({location: scope.location})
                    });
                }

                scope.$on('$destroy',function(){
                    element.off("click");
                    element.off('mouseover');
                });

            }
        }
    }

    feedApp.directive('feedLocationView', feedLocationView);
    feedLocationView.$inject = ['Utils'];
    function feedLocationView(Utils){
        function eventStopPropogate(e){
            e.stopPropagation();
        }
        return {
            restrict: 'E',
            replace : true,
            templateUrl : 'templates/partials/feed_location/view.html',
            compile: function(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, controller) {
                        scope.initLocation(iElement);
                    },
                    post: function postLink(scope, iElement, iAttrs, controller) {
                        scope.$rgDigest();
                        iElement.on("click",eventStopPropogate);
                        scope.$on("$destroy",function(){
                            iElement.off("click",eventStopPropogate);
                        })
                    }
                }

            },

            controller : ['$scope',function($scope){

                $scope.keyword = '';

                $scope.showLocationMap = true;

                $scope.suggestedLocations = [];

                $scope.loadingData = false;

                $scope.selfLocation = {};

                //function getLocationText(placeId){
                //    var place = $scope.suggestedLocations[placeId];
                //
                //    var placeText = place.description || place.name;
                //    return placeText;
                //}

                $scope.onLocationItemSelect = function(selectedItem){
                    if(angular.isFunction($scope.onItemSelect)){
                        try{
                            var data = { description: selectedItem.terms[0].value };
                        }catch(e){
                            var data = { description: selectedItem.description };
                        }

                        data['lat'] = 9999;
                        data['lng'] = 9999;

                        if(!!selectedItem.geometry && !!selectedItem.geometry.location){
                            data['lat'] = selectedItem.geometry.location.lat();
                            data['lng'] = selectedItem.geometry.location.lng();
                        }

                        $scope.onItemSelect({location: data});
                        $scope.$parent.$rgDigest();
                        //mouseInside();
                    }
                    $scope.close();
                };

                $scope.shareUserLocation = function(){

                     Utils.getUserLocation().then(function(location){
                        if( location.sucs ){

                            $scope.onItemSelect({location: location});
                            $scope.$rgDigest();
                            $scope.close();


                        }else{

                            Ringalert.show({mg: 'Unable to detect user location'}, 'error');
                        }

                     })

                };

                $scope.onLocationItemHover = onLocationItemHover;

                var marker, map, placesService, AutoCompleteService, AutoComplete, searchInput;
                var placeInfos = {};

                $scope.initLocation = function(iElement){
                    searchInput = iElement.find('input')[0];

                    placesService = new google.maps.places.PlacesService(searchInput);
                    AutoCompleteService = new google.maps.places.AutocompleteService();
                    // AutoComplete = new google.maps.places.Autocomplete(searchInput);

                  //  $scope.mouseInside = false;

                 //   iElement.on('mouseover', onLocationViewHover);

                    //iElement.on('mouseleave', onLocationOptionMouseLeave);

                    //$scope.$watch("keyword", watchKeyword);

                    searchInput.focus();
                    Utils.getUserLocation(true).then(function(location){

                        $scope.selfLocation = location;

                        if( location.sucs ){
                            initMap({lat: location.lat, lng: location.lng, description : location.description });
                        }else{
                            initMap({lat: 23.772493, lng: 90.4098315, description : 'IPvision Ltd.'});
                        }
                    })

                    $scope.keyword = !!$scope.value ? $scope.value.description : '';

                };

                ////////////////////////

                // function onLocationViewHover(){
                //     //$scope.mouseInside = true;
                // }

                function onLocationItemHover(location){
                    //$scope.mouseInside = true;

                    try{
                        //var placeId = obj.target.attributes['data-place-id'].nodeValue;
                        updateMapPreviewByPlaceId(location.place_id);
                        showMapPreview();

                    }catch(e){

                    }
                }

                //// Private Functions

                function getPlaceInfo(placeId){
                    placesService.getDetails({ placeId: placeId }, function (place, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {

                            angular.extend(placeInfos[placeId], place);

                            placeInfos[placeId] = place;
                            // $scope.suggestedLocations[placeId] = angular.extend($scope.suggestedLocations[placeId], place);

                        }
                        updateSocpe()
                    });
                }

                var processPredictions = function(predictions, status) {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        console.warn(status);
                        hideLoader();
                        return;
                    }

                    resetPredictions()

                    angular.forEach(predictions, function(prediction){
                        var placeId = prediction.place_id;

                        if(!placeInfos[placeId]){
                            getPlaceInfo(placeId);
                            placeInfos[placeId] = prediction;

                        }else{
                            angular.extend(placeInfos[placeId], prediction);
                        }

                        $scope.suggestedLocations.push(placeInfos[placeId]);

                    });

                    if( $scope.suggestedLocations.length > 0){
                        hideLoader();
                    }
                    updateSocpe();

                };

                function showLoader(){ $scope.loadingData = true; }
                function hideLoader(){ $scope.loadingData = false; }
                function showMapPreview() { $scope.showLocationMap = true; }
                function hideMapPreview() { $scope.showLocationMap = false; }
                function getPredictions(){ return $scope.suggestedLocations; }
                function resetPredictions(){ $scope.suggestedLocations = []; }
                function setPredictions(newPredictions){ $scope.suggestedLocations = newPredictions; }
                function updateSocpe(){ $scope.$rgDigest(); }
                function getMapCenterLatLngPoint(location){
                    return new google.maps.LatLng(location.lat, location.lng);
                }
                function initMap(location){

                    var center = getMapCenterLatLngPoint( location );

                    map = new google.maps.Map(document.getElementById('feed-location-map'), {
                        center: center,
                        zoom: 13
                    });

                    if( !!location.description ){
                        AutoCompleteService.getPlacePredictions(
                            { input: location.description,
                              rankBy : google.maps.places.RankBy.DISTANCE
                            },
                            processPredictions
                        );
                    }

                }

                //// Scope Functions

                // function onLocationOptionMouseLeave(obj){
                //     $scope.mouseInside = false;
                // }

                function updateMapPreviewByPlaceId(placeId){
                    var place = placeInfos[placeId];
                    if(place){
                        if(marker)
                            marker.setMap(null);

                        map.setCenter(place.geometry.location);

                        marker = new google.maps.Marker({
                            map: map,
                            place: {
                                placeId: placeId,
                                location: place.geometry.location
                            }
                        });

                    }
                }

                function search(searchKey){
                    resetPredictions();
                    showLoader();
                    updateSocpe();

                    AutoCompleteService.getPlacePredictions({ input: searchKey }, processPredictions);

                }


                function watchKeyword(e){
                    var newValue = e.target.value;
                    if(!!newValue && newValue.length > 3){
                        search(newValue);
                    }else{
                        resetPredictions();
                        updateSocpe();
                    }
                    $scope.keyword = e.target.value;

                }


                $scope.processKeyup = Utils.debounce(watchKeyword,500);


            }]
        };

    }


    function feedLocationPreview(){
        return {
            replace : true,
            template : '<span ng-if="!!feed.getLocationInfo().lat" ><a ng-href="{{ ::feed.getLocationUrl() }}"  rg-ringbox="true" ringbox-type="remote" ringbox-target="templates/partials/google-map-preview.html" scope-data="{url : feed.getLocationEmbedUrl() }">  <img height="170px" width="100%" ng-src="{{ ::feed.getLocationStaticEmbedUrl() }}" alt="location-hover" /> </a>'
        }
    }
    feedApp.directive('feedLocationPreview', feedLocationPreview);


