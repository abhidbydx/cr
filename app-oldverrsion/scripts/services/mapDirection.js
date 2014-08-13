/**
   * Name: mapDirection
   * Description: Map direction
   * @author: [Yugal Jindle]
   * Date: Jan 10, 2014
**/

'use strict';

angular.module('serviceApp').factory('mapDirection', function() {
    var factory = {}, mapObject, service, renderer;

    // Initialize
    factory.initialize = function(map) {
        mapObject = map;
        service = new google.maps.DirectionsService();
        renderer = new google.maps.DirectionsRenderer({
            hideRouteList: true,
            suppressMarkers: true,
            preserveViewport: true,
            suppressInfoWindows: true
        });
        renderer.setMap(map);
    };

    // Create direction
    factory.create = function(points, callback) {
        var source = points.source,
            dest   = points.destination,
            request = {
                origin: new google.maps.LatLng(source.lat, source.lng),
                destination: new google.maps.LatLng(dest.lat, dest.lng),
                travelMode: google.maps.TravelMode.DRIVING
            };
        // Route
        renderer.setMap(null); // hide 
        service.route(request, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                renderer.setDirections(response);
                renderer.setMap(mapObject); // show 
                callback('OK', {
                    mode: 'DRIVING',
                    distance: response.routes[0].legs[0].distance.text,
                    duration: response.routes[0].legs[0].duration.text
                });
            } else {
                callback('ERROR', {msg: 'Error calculating direction'});
            }
        });
    };

    // Remove direction
    factory.remove = function() {
        renderer.setMap(null); // hide
    };

    return factory;
});
