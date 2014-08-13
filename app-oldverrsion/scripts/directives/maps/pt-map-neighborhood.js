/**
   * Name: pt-map-neighborhood
   * Description: Proptiger Map Neighborhood
   * @author: [Yugal Jindle]
   * Date: Apr 14, 2014
**/

/* global Overlay */
/* global google */
'use strict';

angular.module('serviceApp').directive('ptMapNeighborhood', ['mapFactory', 'markerFactory', 'ProjectParser', '$rootScope', 'LocalityService', function(mapFactory, markerFactory, ProjectParser, $rootScope, LocalityService) {
    return {
        restrict: 'EAC',
        scope: {
            mapId: '=',
            data: '=',
            marker: '=',
            markerType: '=',
            radius: '=',
            direction: '='
        },
        template: '<div id="{{mapId}}" class="map_container"></div>'+
                  '<div neighborhood-palette activate="activate(key)" radius="radius" data="data" deactivate="deactivate(key)" class="nearby-palette"></div>',
        controller: function($scope) {
			// Rootscope
            $rootScope.markerSettings = {
                displayType: 'type'
            };
            // Direction
            var _drawDirection = function(data) {
                var selectionId = String(data.latitude).replace('.', '') + '-' + String(data.longitude).replace('.', ''),
                    points = {
                        source: {
                            lat: $scope.data.latitude,
                            lng: $scope.data.longitude
                        },
                        destination: {
                            lat: data.latitude,
                            lng: data.longitude
                        }
                    },
                    _directionHtml =  function(status, details) {
                        var $selection = $('#'+selectionId).find('.waiting');
                        if(status === 'OK' && !$selection.hasClass('completed')) {
                            $selection.addClass('completed');
                            $selection.html('<span class="dstnc_wrap"><i class="fa fa-road"></i> ' + details.distance + '</span><span class="time_car_wrap"><i class="fa fa-truck"></i> ' + details.duration + '</span>');
                        }
                    };
                mapFactory.action.direction.create(points, _directionHtml);
            };
            function drawMarkers(map, overlay, markerList, bounds) {
                // Drawing markers with markerList
                if(markerList.length !== 0) {
                    mapFactory.action.markers.add(map, markerList);
                    overlay = new Overlay(markerList, map);
                    overlay.setMap(map);
                    // Fit markers
                    mapFactory.action.bounds(map, markerList, bounds);
                    return overlay;
                }
                // Re-calibrate
                google.maps.event.addListener(map, 'idle', function() {
                    google.maps.event.trigger(map, 'resize');
                    mapFactory.action.bounds(map, markerList, bounds);
                });
            }

            // Neighborhood
            function neighborhood(map, position) {

                var overlay, currentKey;

                $scope.activate = function(key) {
                    // Current key
                    if(currentKey !== undefined && key !== currentKey) {
                        $scope.deactivate(key);
                    } else {
                        currentKey = key;
                    }

                    var bounds = new google.maps.LatLngBounds(),
                        loc = new google.maps.LatLng(position.lat, position.lng),
                        radius = $scope.radius,
                        markerList = [];
                    bounds.extend(loc);
					LocalityService.getNeighbourhood(position,radius,key, function(amenities) {
                                if(amenities.length) {
                                    for (var i = 0; i < amenities.length; i++) {
                                            // Add direction info
                                            amenities[i].__direction__ = $scope.direction;
                                            var m = new markerFactory.marker(key, amenities[i]);
                                            if(!amenities[i].__direction__) {
                                                amenities[i].__tooltip__ = amenities[i].name;
                                            }
                                            if($scope.direction) {
                                                m.mouseEnter(_drawDirection);
                                            }
                                            markerList.push(m);
                                        
                                    }

								$scope.deactivate(key);
								overlay = drawMarkers(map, overlay, markerList, bounds);
                              }
                            });
                };
                $scope.deactivate = function(key) {
                    if(overlay) {
                        overlay.destroy();
                        overlay = undefined;
                        mapFactory.action.direction.remove();
                    }
                };
            }

            function onMapLoad() {
                var elementId, map, markerData, m, markerOverlay,
                    mapState = {
                        zoom : 12,
                        zoomControl: false,
                        zoomControlOptions: {
                            style: google.maps.ZoomControlStyle.LARGE,
                            position: google.maps.ControlPosition.RIGHT_TOP
                        },
                        mapTypeControl: true,
                        scaleControl: false,
                        center: {
                            lat: $scope.data.latitude,
                            lng: $scope.data.longitude
                        }
                    };
                elementId = $scope.mapId;
                map = mapFactory.initialize(mapState, elementId);
                // Create marker
                if($scope.marker === true && $scope.markerType === 'normal') {
                    $scope.data.neighborhood = undefined;
                    markerData = ProjectParser.parseProject($scope.data, false);
                    m = new markerFactory.marker('project', markerData);
                    mapFactory.action.markers.add(map, [m]);
                    markerOverlay = new Overlay([m], map);
                    markerOverlay.setMap(map);
                    google.maps.event.addListener(map, 'idle', function() {
                        $('#project_'+$scope.data.projectId).addClass('st-c');
                    });
                }
                if($scope.marker === true && $scope.markerType === 'simple') {
                    mapFactory.action.markers.simple(map, [{latitude:$scope.data.latitude, longitude:$scope.data.longitude, title:$scope.data.fullName}]);
                }
                neighborhood(map, {lat: $scope.data.latitude, lng: $scope.data.longitude});
                $scope.activate('school');
                // ========== Zoom Control ==========
				$('body').delegate('.map-zoomin', 'click', function() {
                      var zoom = map.getZoom() + 1;
                      map.setZoom(zoom);
                      $rootScope.TrackingService.sendGAEvent('map', 'clicked', 'zoomIn-Button-'+zoom+'-'+$rootScope.CURRENT_ACTIVE_PAGE);
					  $rootScope.TrackingService.mixPanelTracking('Map Zoom In', {'ZoomIn Type': 'Button', 'Zoom Level': zoom, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});

				});
				$('body').delegate('.map-zoomout', 'click', function() {
			          var zoom = map.getZoom() - 1;
                      map.setZoom(zoom);
			          $rootScope.TrackingService.sendGAEvent('map', 'clicked', 'zoomOut-Button-'+zoom+'-'+$rootScope.CURRENT_ACTIVE_PAGE);
					  $rootScope.TrackingService.mixPanelTracking('Map Zoom Out', {'ZoomOut Type': 'Button', 'Zoom Level': zoom, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});
				});
				// ===================================
            }
            // Proceed when included
            function wait() {
                setTimeout(onMapLoad);
            }
            mapFactory.includeJS(wait);
        }
    };
}]);
