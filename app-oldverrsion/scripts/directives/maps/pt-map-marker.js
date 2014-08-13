/**
   * Name: pt-map-marker
   * Description: Proptiger Map Marker
   * @author: [Yugal Jindle]
   * Date: Apr 12, 2014
**/

/* global google */
'use strict';

angular.module('serviceApp').directive('ptMapMarker', ['mapFactory','$rootScope', function(mapFactory,$rootScope) {
    return {
        restrict: 'EAC',
        scope: {
            lat: '=',
            lng: '=',
            title: '=',
            zoom: '='
        },
        template: '<div></div>',
        link: function(scope, element, attrs) {
            var mapState = {
                zoom : scope.zoom || 12,
                zoomControl: false,
                mapTypeControl: true,
                scaleControl: false,
                center: {
                    lat: scope.lat,
                    lng: scope.lng
                }
            };

            function onMapLoad() {
                var elementId, map;
                elementId = attrs.id;
                map = mapFactory.initialize(mapState, elementId);
                mapFactory.action.markers.simple(map, [{latitude: scope.lat, longitude:scope.lng, title:scope.title}]);
                google.maps.event.addListener(map, 'idle', function() {
                    google.maps.event.trigger(map, 'resize');
                    mapFactory.action.center(map, {lat: scope.lat, lng: scope.lng});
                });
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
            mapFactory.includeJS(onMapLoad);
        }
    };
}]);
