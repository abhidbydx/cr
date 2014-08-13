/**
   * Name: pt-map
   * Description: Proptiger Map
   * @author: [Yugal Jindle]
   * Date: Nov 21, 2013
**/

'use strict';

angular.module('serviceApp').directive('ptMap', ['$rootScope', 'pageSettings', 'mapFactory', function($rootScope, pageSettings, mapFactory) {
    return {
        restrict: 'EAC',
        scope: {
            state  : '=',
            events  : '=',
            services : '='
        },
        template: '<div></div>',
        link: function(scope, element, attrs) {
            var map, selectionId, project, points, curr, filter;
            scope.displaySettings = pageSettings.displaySettings;

            // Neighbourhood markers
            scope.neighbourhoodOverlay = {
                'locality'  :   {},
                'project'   :   {}
            };

            // waitForMap
            var waitForMap = function(func) {
                return function() {
                    var self = this;
                    if(!map) {
                        $('.body_map').bind('map-loaded', function() {
                           func.apply(self, arguments);
                        });
                    } else {
                        func.apply(self, arguments);
                    }
                };
            };

            // Zoom Level
            scope.services.zoomLevel = function(minZoom, maxZoom) {
                if(!map) return;    
                mapFactory.action.zoomLevel(map, minZoom, maxZoom);
            };
            scope.services.zoomLevel = waitForMap(scope.services.zoomLevel);
                 
            // Direction
            scope.services.direction.create = mapFactory.action.direction.create;
            scope.services.direction.remove = mapFactory.action.direction.remove;
            
            scope.services.drawMarkers = function() {
				if (!map) return;
                curr = scope.state.markers[scope.displaySettings.alvDisplayType];
                mapFactory.action.markers.add(map, curr);
                if(scope.markerOverlay) {
                    scope.markerOverlay.destroy();
                    delete scope.markerOverlay;
                    if(scope.displaySettings.alvDisplayType === 'project') {
                        scope.state.markers.locality = undefined;
                    } else {
                        scope.state.markers.project = undefined;
                    }
                }
                scope.markerOverlay = new Overlay(curr, map);
                scope.markerOverlay.setMap(map);
            };
            scope.services.drawMarkers = waitForMap(scope.services.drawMarkers);

            var _directionHtml =  function(status, details) {
                var $selection = $('#'+selectionId).find('.waiting');
                if(status === 'OK' && !$selection.hasClass('completed')) {
                    $selection.addClass('completed');
                    $selection.html('<span class="dstnc_wrap"><i class="fa fa-road"></i> ' + details.distance + '</span><span class="time_car_wrap"><i class="fa fa-truck"></i> ' + details.duration + '</span>');
                }
            };

            var _drawDirection = function(data){
                selectionId = String(data.latitude).replace('.', '') + '-' + String(data.longitude).replace('.', '');
                points = {
                    source: {
                        lat: project.lat,
                        lng: project.lng
                    },
                    destination: {
                        lat: data.latitude,
                        lng: data.longitude
                    }
                };

                mapFactory.action.direction.create(points, _directionHtml);
            };

            var _direction = function(idx, mrkr) {
                mrkr.mouseEnter(_drawDirection);
            };

            scope.services.drawNeighbourhoodMarkers = function(config) {
                var list, olay, type = config.type, 
                    level = config.level, neighbourhood = scope.state.neighbourhood;
                    project = config.direction ? config.project : null;
                if(neighbourhood[level][type]) {
                    //check if marker for this neighbourhood exists
                    olay = scope.neighbourhoodOverlay[level][type];
                    if(olay) {
                        olay.destroy();
                        neighbourhood[level][type] = [];
                        delete scope.neighbourhoodOverlay[level][type];
                        mapFactory.action.direction.remove();
                    }

                    //create new markers for this neighbourhood
                    list = scope.state.neighbourhood[level][type];
                    if(!list || !list.length) {
                        return;
                    }

                    mapFactory.action.markers.add(map, list);
                    olay = new Overlay(list, map);
                    olay.setMap(map);
                    scope.neighbourhoodOverlay[level][type] = olay;
                    if(config.direction) {
                        $.each(list, _direction);
                    }
                    // Fit markers
                    mapFactory.action.bounds(map, list, filter.bounds);
                }
            };

            scope.services.bounds = function(list) {
                mapFactory.action.bounds(map, list, filter.bounds);    
            };

            var proceed = function() {
                var elementId   =   attrs['id'];
                map = mapFactory.initialize(scope.state, elementId);
                filter = mapFactory.action.filter.create(map, scope.state.filter.state); 
                mapFactory.action.markers.add(map, scope.state.markers[scope.displaySettings.alvDisplayType]);
                // =================== Map Events ===================
                scope.$watch('events.resize', function(resize) {
                    if(resize) {
                        google.maps.event.trigger(map, 'resize');
                        scope.events.resize = false;
                    }
                });
                scope.$watch('events.zoomin', function(zoomin) {
                    if(zoomin) {
                        map.setZoom(map.getZoom() + 1);
                        scope.events.zoomin = false;
                    }
                });
                scope.$watch('events.zoomout', function(zoomout) {
                    if(zoomout) {
                        map.setZoom(map.getZoom() - 1);
                        scope.events.zoomout = false;
                    }
                });
    
                // =============== Map State Bindings ===============
                // Zoom
                scope.$watch('state.zoom', function(current, old) {
                    if(current){
                        mapFactory.action.zoom(map, current);
                    }
                });
                mapFactory.bind.zoom(map, function(zoom) {
                    scope.state.zoom = zoom;
                    setTimeout(function() {$rootScope.$apply();}, 0);
                });

                // Center
                scope.$watch('state.center', function(current) {
                    if(current) {
                        mapFactory.action.center(map, current);
                    }
                }, true);
                mapFactory.bind.center(map, function(center) {
                    scope.state.center = center;
                    setTimeout(function() {$rootScope.$apply();}, 0);
                });

                // Map filter
                scope.$watch('state.filter.visible', function(visible) {
                    mapFactory.action.filter.setVisibility(filter, visible);
                });
                // Project listing (Fix for repeating same locality twice)
                $('.body_map').bind('project-listing', function() {
                    mapFactory.action.bounds(map, [], filter.bounds);
                });
                scope.$watch('state.filter.state', function(newState, oldState) {
                    if(oldState !== newState) {
                        mapFactory.action.filter.updateMapFilter(filter, newState);
                    }
                }, true);
                mapFactory.bind.filter(filter, function(lat, lng, distance) {
                    scope.state.filter.state.position.lat = lat;
                    scope.state.filter.state.position.lng = lng;
                    scope.state.filter.state.distance = distance;
                    scope.state.filter.action = 'drag';
                    setTimeout(function() {$rootScope.$apply();}, 0);
                });

                //init map places library
                scope.state.libraries.places = new google.maps.places.PlacesService(map);

                // Trigger MAP LOAD
                $('.body_map').trigger('map-loaded');
                
                //GA/Mixpanel tracking On dragging/Changed radius locality circle
				filter.addListener('state_changed', function(actionObj) { 
					var pageType = $rootScope.CURRENT_ACTIVE_PAGE, sublabel, newRadius, oldRadius, mixpanelEvent, mixpanelObj = {};					
					newRadius = Math.floor(scope.state.filter.state.distance*1000)+' mtrs';
					oldRadius = Math.floor(scope.state.filter.state.lastDistance*1000)+' mtrs';// Will use later					
					if(actionObj.action == 'dragged'){
						sublabel	= 'circle-'+pageType;
						mixpanelEvent = 'Circle Dragged';
						mixpanelObj['Radius'] = newRadius
					}else{
						sublabel	= oldRadius+'-'+newRadius+'-'+pageType;
						mixpanelEvent = 'Circle Radius Changed';
						mixpanelObj['Radius'] = oldRadius
						mixpanelObj['Changed Radius'] = newRadius
					} 
					$rootScope.TrackingService.sendGAEvent('map', actionObj.action, sublabel); 
					//Mixpanel event					 
					mixpanelObj['Locality ID'] = $rootScope.currentLocality.localityId					
					mixpanelObj['Page Name'] = pageType					
					$rootScope.TrackingService.mixPanelTracking(mixpanelEvent, mixpanelObj); 
					 
					 scope.state.filter.state.lastDistance = scope.state.filter.state.distance;
				});
            
            };
            // Proceed when included
            mapFactory.includeJS(proceed);
        }
    };
}]);
