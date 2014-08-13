/**
   * Name: mapFilter
   * Description: Map filter
   * @author: [Yugal Jindle]
   * Date: Dec 12, 2013
**/

'use strict';

angular.module('serviceApp').factory('mapFilter', function() {
    var factory = {};

    /**
     * Returns a google.maps.LatLng object
     *
     * @lat ~ float
     * @lng ~ float
     */
    function latlng(lat, lng) {
        return new google.maps.LatLng(lat, lng);
    }

    // Box containing India 
    function indiaBoxPoints() {
        return [
            latlng(5, 65),
            latlng(40, 65),
            latlng(40, 100),
            latlng(5, 100)
        ];
    }

    /* Function circlePoints
     * Description: Returns a list of google.maps.LatLng objects representing a circle.
     * @center     ~ instanceof google.maps.LatLng
     * @radius     ~ integer (kms)
     * @direction  ~ integer (+1 for clockwise & -1 for anti-clockwise)
     *
     * @return     ~ { plot: Array(google.maps.LatLng), bounds: LatLngBounds }
     * */
    function circlePoints(center, radius, direction) {
        // Configs
        var points = 48,
            skipCount = 7,    // Points to skip on both sides around 90 & 270 degree for bounds
            d2r = Math.PI/180, // degrees to radians 
            r2d = 180/Math.PI, // radians to degrees 
            earthsradius = 6371; // radius of the earth in kms

        var skipRadians = (Math.PI/2)*(skipCount/(points/4)), // Randians to skip around 90 & 270 degree for bounds
            skipRange1  = [(Math.PI/2)-skipRadians, (Math.PI/2)+skipRadians],
            skipRange2  = [(3*Math.PI/2)-skipRadians, (3*Math.PI/2)+skipRadians];

        // Find the raidus in lat/lon 
        var rlat = (radius / earthsradius) * r2d,
            rlng = rlat / Math.cos(center.lat() * d2r);

        // One extra point to complete the loop
        var circle = {
                plot: [],
                bounds: new google.maps.LatLngBounds()
            },
            start = (direction === 1)? 0:points+1,
            end = (direction === 1)? points+1:0;

        // Caculate points
        for (var i = start; (direction === 1 ? i<end: i>end); i=i+direction) {
            var theta = Math.PI * (i/(points/2)),
                ey = center.lng() + (rlng * Math.cos(theta)), // center a + radius x * cos(theta) 
                ex = center.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta) 
            circle.plot.push(latlng(ex, ey));
            // Points to skip in bounds
            if((theta<skipRange1[0] || theta>skipRange1[1]) && (theta<skipRange2[0] || theta>skipRange2[1])) {
                // Add to bounds
                circle.bounds.extend(circle.plot[circle.plot.length - 1]);
            }
        }

        return circle;
    }

    /**
    * Calculates the distance between two latlng locations in km.
    *
    * @pointA   ~  instanceof google.maps.LatLng
    * @pointB   ~  instanceof google.maps.LatLng
    *
    * @return   ~  Distance between the two points in km.
    */
    function distanceBetweenPoints(pointA, pointB) {
        if (!pointA || !pointB) {
            return 0;
        }
        var R = 6371; // Radius of the Earth in km
        var dLat = (pointB.lat() - pointA.lat()) * Math.PI / 180;
        var dLon = (pointB.lng() - pointA.lng()) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(pointA.lat() * Math.PI / 180) * Math.cos(pointB.lat() * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    /**
    * Converts google.maps.LatLng object to pixel
    *
    * @map     ~  instanceof google.maps.Map
    * @pos     ~  instanceof google.maps.LatLng
    *
    * @return  ~ instanceof google.maps.Point 
    */
    function fromLatLngToPixel(map, pos) {
        var scale = Math.pow(2, map.getZoom());
        var proj = map.getProjection();
        var bounds = map.getBounds();

        var nw = proj.fromLatLngToPoint(
        new google.maps.LatLng(
        bounds.getNorthEast().lat(),
        bounds.getSouthWest().lng()
        ));
        var point = proj.fromLatLngToPoint(pos);

        return new google.maps.Point(
        Math.floor((point.x - nw.x) * scale),
        Math.floor((point.y - nw.y) * scale)); 
    }

    /**
    * Returns the filter class (Function)
    * i.e. Function used to create filter object
    *
    * Eg:
    *   f = new getFilterClass();
    */
    factory.getFilterClass = function() {
        function widget(map, state) {
            // Initial
            var self = this,
                defaultPosition = (state.lat && state.lng)? latlng(state.lat, state.lng):map.getCenter();
            self.set('position', defaultPosition);
            self.set('distance', state.distance);
            self.set('visible', false);

            // ========== Center ==========
            var centerDimensions = {x: 24, y: 24},
                center = new google.maps.Marker({
                map: map,
                flat: true,
                cursor: 'move',
                draggable: true,
                raiseOnDrag: false,
                zIndex: 10,
				fillOpacity: 0.80,
                position: self.position,
                title: 'Drag to change center',
                icon: {
                    url: 'images/center.png',
                    size: new google.maps.Size(centerDimensions.x, centerDimensions.y),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(centerDimensions.x/2, centerDimensions.y/2)
                }
            });
            center.bindTo('visible', self);
            center.bindTo('position', self);

            // ========== Polygon ==========
            var boxPoints = indiaBoxPoints(),
                polygonPlot = circlePoints(self.position, self.distance, 1),
                pathsArray = [boxPoints, polygonPlot.plot],
                // Plot
                polygon = new google.maps.Polygon({
                    map: map,
                    paths: pathsArray,
                    fillColor: '#fff',
                    fillOpacity: 0.45,
                    strokeWeight: 0,
                    strokePosition: google.maps.StrokePosition.OUTSIDE
                });
            self.bounds = polygonPlot.bounds;
            polygon.bindTo('visible', self);

            // ========== Sizer ==========
            var sizerDimensions = {x: 20, y: 20},
                sizer = new google.maps.Marker({
                map: map,
                flat: true,
                draggable: true,
                raiseOnDrag: false,
                cursor: 'col-resize',
                zIndex: 10,
                // /*title: 'Drag to extend/contract',*/
                icon: {
                    url: 'images/resize.png',
                    size: new google.maps.Size(sizerDimensions.x, sizerDimensions.y),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(sizerDimensions.x/2, sizerDimensions.y/2)
                }
            });
            sizer.bindTo('visible', self);
            sizer.bindTo('position', self, 'sizer_position');

            // ========== Sizer div ==========
            var sizerDiv = $('<div class="sizer-div circle-tooltip"></div>')
                .append('<div>Showing projects within <span class="sizer-div-radius"></span> mtrs</div><div>Drag to extend/contract</div>'),
                updateSizerDiv = function() {
                    var radius = Math.floor(self.get('distance')*1000),
                        pos = new google.maps.LatLng(center.getPosition().lat(), sizer.getPosition().lng()),
                        pixel = fromLatLngToPixel(map, pos),
                        $sizerDiv = $('.sizer-div'),
                        width = $sizerDiv.width(),
                        height = $sizerDiv.height();
                    $sizerDiv.css('top', pixel.y - height - 19);
                    $sizerDiv.css('left', pixel.x - 0.55*width);
                    $('.sizer-div-radius').html(radius);
                },
                sizerDivMouse = false;
            $('.map_canvas_wrap').append(sizerDiv);
            // Sizer div events
            google.maps.event.addListener(sizer, 'drag', updateSizerDiv);
            google.maps.event.addListener(sizer, 'mouseover', function() {
                updateSizerDiv();
                $('.sizer-div').css('display', 'block');
            });
            google.maps.event.addListener(sizer, 'mousedown', function() {
                sizerDivMouse = true;
            });
            google.maps.event.addListener(sizer, 'mouseup', function() {
                sizerDivMouse = false;
                $('.sizer-div').css('display', 'none');
            });
            google.maps.event.addListener(sizer, 'mouseout', function() {
                if(!sizerDivMouse) {
                    $('.sizer-div').css('display', 'none');
                }
            });

            // ========== Making it Work ==========
            // Emulating the hole
            var circle = new google.maps.Circle({
                    map: map,
                    center: self.position,
                    radius: self.distance * 1000,
                    fillOpacity: 0,
                    strokeWeight: 1,
                    strokeOpacity: 0.8,
                    strokeColor: '#2691ec',
					cursor:'url("http://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default',
                    strokePosition: google.maps.StrokePosition.OUTSIDE
                });
            circle.bindTo('visible', self);
            circle.bindTo('center', self, 'position');
            self.distance_changed = function() {
               circle.setRadius(self.get('distance')*1000);
            };

            // Calculate sizer position
            function sizerPosition(bounds, rightSide) {
                var lat, lng;
                bounds = (bounds)? bounds:self.bounds;
                lat = center.getPosition().lat();
                // Calculate lng
                var left = bounds.getSouthWest(),
                    right = bounds.getNorthEast(),
                    sizerPos = sizer.getPosition(),
                    leftDistance = distanceBetweenPoints(sizerPos, left),
                    rightDistance = distanceBetweenPoints(sizerPos, right),
                    pos = (rightSide || rightDistance<=leftDistance)? right:left;
                lng = pos.lng(); // Extracted lng from `bounds`
                return latlng(lat, lng);
            }
            self.set('sizer_position', sizerPosition());

            // Move Circle
            function moveCircle() {
                var circleBounds = circle.getBounds();
                self.set('position', center.getPosition());
                self.set('sizer_position', sizerPosition(circleBounds));
            }

            // Move polygon
            function movePolygon() {
                var c = center.getPosition();
                polygonPlot = circlePoints(c, self.distance, 1);
                pathsArray[1] = polygonPlot.plot;
                self.bounds = polygonPlot.bounds;
                polygon.setPaths(pathsArray);
            }

            // Resize polygon
            function resizeCircle() {
                var c = center.getPosition(),
                    r = sizer.getPosition(),
                    dis = distanceBetweenPoints(c, r);
                dis = (dis <= state.maxDistance)? dis:state.maxDistance;
                self.set('distance', dis);
                var circleBounds = circle.getBounds();
                self.set('sizer_position', sizerPosition(circleBounds));
            }

            // Resize polygon
            function resizePolygon() {
                var c = center.getPosition(),
                    dis = self.get('distance');
                polygonPlot = circlePoints(c, dis, 1);
                pathsArray[1] = polygonPlot.plot;
                self.bounds = polygonPlot.bounds;
                polygon.setPaths(pathsArray);
                self.set('sizer_position', sizerPosition());
            }

            // Move & Resize with center & sizer
            var getDis = self.get('distance');
            google.maps.event.addListener(center, 'drag', moveCircle);
            google.maps.event.addListener(center, 'dragend', function() {
                movePolygon();
                google.maps.event.trigger(self, 'state_changed', {'action': 'dragged',  'distance': getDis});
            });
            google.maps.event.addListener(sizer, 'drag', resizeCircle);
            google.maps.event.addListener(sizer, 'dragend', function() {
                resizePolygon();
                google.maps.event.trigger(self, 'state_changed', {'action': 'changeRadius',  'distance': getDis});
            });

            // ========== Updating filter ==========
            self.updateMapFilter = function(state) {
                var pos = latlng(state.position.lat, state.position.lng);
                // Emulate center movement 
                // Center follows self.position
                self.set('position', pos);
                moveCircle();
                movePolygon();
                // Emulate resize
                // Circle automatically resizes
                self.set('distance', state.distance);
                resizePolygon();
                self.set('sizer_position', sizerPosition(self.bounds, true));
                google.maps.event.trigger(map, 'resize'); // Fix for resizing map
                map.fitBounds(self.bounds);
                map.setCenter(pos);
            };

        }
        widget.prototype = new google.maps.MVCObject();

        return widget;
    };

    return factory;
});

