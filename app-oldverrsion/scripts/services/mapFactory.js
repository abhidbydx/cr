/**
   * Name: mapFactory
   * Description: Maps API
   * @author: [Yugal Jindle]
   * Date: Nov 21, 2013
**/

/* global google */
'use strict';

angular.module('serviceApp').factory('mapFactory', ['mapOverlay', 'mapFilter', 'mapDirection', '$window', '$rootScope', 'lazyLoadFactory', function(mapOverlay, mapFilter, mapDirection, $window, $rootScope, lazyLoadFactory) {
    var factory = {};

    // =========================================
    // Include Google Maps JS asynchronously
    // =========================================
    factory.includeJS = function(callback) {
        if(!$window.google) {
            var url,
                baseUrl = 'http://maps.googleapis.com/maps/api/js',
                params = [],
                config = {
                    v: '3',
                    region: 'in',
                    sensor: false,
                    language: 'en',
                    libraries: ['places'],
                    callback: 'googleCallback',
                    key: 'AIzaSyBTrqqnHWF8jIxxi0XP7DHtkJAMOgGOw3E'
                };
            $.each(config, function(key, value) {
                value = (value instanceof Array)? value.join():value;
                params.push(key+'='+value);
            });
            url = baseUrl+'?'+params.join('&');
            
            $window.googleCallback = callback;
            lazyLoadFactory.loadScript(url);
        } else {
            callback();
        }
    };

    // =========================================
    // Initialize the map
    // =========================================
    factory.initialize = function(state, elementId) {
        var map,
            options = {
                zoom: state.zoom,
                zoomControl: state.zoomControl || false,
                zoomControlOptions: state.zoomControlOptions || undefined,
                minZoom:   5,
                panControl: false,
                streetViewControl: false,
                mapTypeControl: state.mapTypeControl || false,
                mapTypeId:   google.maps.MapTypeId.ROADMAP,
                scaleControl: state.scaleControl && true,
                scaleControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT
                },
                center: new google.maps.LatLng(state.center.lat, state.center.lng),
                styles: [
                    {
                        featureType: 'all',
                        stylers: [
                            { saturation: -90 },
                            { hue: '#0066ff' },
                            { gamma: 1 }
                        ]
                    },
                    {
                        featureType: 'water',
                        stylers: [
                            { gamma: 0.63 },
                            { hue: '#0091ff' },
                            { saturation: 51 }
                        ]
                    },{
                        featureType: 'poi.business',
                        stylers: [
                            { visibility: 'off' }
                        ]
                    }
                ]
            };
        map = new google.maps.Map(document.getElementById(elementId), options);
        
        $window.Overlay = mapOverlay.getOverlayClass();
        $window.Filter = mapFilter.getFilterClass();
        mapDirection.initialize(map);
        return map;
    };

    // =========================================
    // Map Actions
    // =========================================
    factory.action = {
        zoom: function(map, zoom) {
            zoom = parseInt(zoom)? parseInt(zoom):10;
            map.setZoom(zoom);
        },
        zoomLevel: function(map, zoomMin, zoomMax) {
            zoomMin = parseInt(zoomMin)? parseInt(zoomMin):10;
            zoomMax = parseInt(zoomMax)? parseInt(zoomMax):22;
            var options = {
                minZoom: zoomMin,
                maxZoom: zoomMax
            };
            map.setOptions(options);
        },
        center: function(map, center) {
            var lat, lng, c;
            lat = parseFloat(center.lat)? parseFloat(center.lat):0;
            lng = parseFloat(center.lng)? parseFloat(center.lng):0;
            c = new google.maps.LatLng(lat, lng);
            map.setCenter(c);
        },
        markers: {
            add: function(map, markers) {
                if(!markers || !markers.length) {
                    return;
                }
                for (var i=0; i<markers.length; i++) {
                    markers[i].init(map);
                }
            },
            simple: function(map, dataList) {
                var data;
                for(var i=0; i<dataList.length; i++) {
                    data = dataList[i];
                    new google.maps.Marker({
                        position: new google.maps.LatLng(data.latitude,data.longitude),
                        map: map,
                        title: data.title
                    });
                }
            }
        },
        filter: {
            create: function(map, config) {
                return new Filter(map, config);
            },
            setVisibility: function(filter, visible) {
                filter.set('visible', visible);
            },
            updateMapFilter: function(filter, state) {
                filter.updateMapFilter(state);
            }
        },
        direction: {
            create: mapDirection.create,
            remove: mapDirection.remove
        },
        bounds: function(map, markerList, otherBounds) {
            var pos,
                bounds = new google.maps.LatLngBounds();
            if(otherBounds) {
                bounds.extend(otherBounds.getCenter());
                bounds.extend(otherBounds.getNorthEast());
                bounds.extend(otherBounds.getSouthWest());
            }
            for (var i = 0; i < markerList.length; i++) {
                pos = new google.maps.LatLng(markerList[i].data.latitude, markerList[i].data.longitude);
                bounds.extend(pos);
            }
            map.fitBounds(bounds);
        }
    };

    // =========================================
    // Map Bindings
    // =========================================
    factory.bind = {
        zoom: function(map, callback) {
            google.maps.event.addListener(map, 'zoom_changed', function() {
                callback(map.getZoom());
            }); 
        },
        center: function(map, callback) {
            google.maps.event.addListener(map, 'center_changed', function() {
                var c = map.getCenter(),
                    center = {
                        lat: c.lat(),
                        lng: c.lng()
                    };
                callback(center);
            }); 
        },
        filter: function(filter, callback) {
            filter.addListener('state_changed', function() {
                var position = filter.get('position'),
                    distance = filter.get('distance');
                callback(position.lat(), position.lng(), distance);
            });
        }
    };

    return factory;
}]);