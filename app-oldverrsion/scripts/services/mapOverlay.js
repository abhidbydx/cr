/**
   * Name: mapOverlay
   * Description: Map overlay
   * @author: [Yugal Jindle]
   * Date: Dec 06, 2013
**/

'use strict';

angular.module('serviceApp').factory('mapOverlay', function($rootScope) {
    var factory = {};

    factory.getOverlayClass = function() {
        // Contructor
        var overlay = function(markers, map) {
            // Private properties
            this._map = map;
            this._markers = markers;
            // Setting properties
            this.map = map? map:null;
            this.shift = {x : 6, y: 0}; // Shift correction
            // Creating document fragment to hold all markers html
            var docfrag = document.createDocumentFragment();
            for(var i = 0; i < this._markers.length; i++) {
                var m = this._markers[i];
                m.markerEvents = [];

                // Draw overlay only for the mapped items. 
                if (!isItemMapped(m.data)) {
                    continue;
                }

                m.position = new google.maps.LatLng(m.data.latitude, m.data.longitude);
                var div = document.createElement('div');
                div.style.borderStyle = 'none';
                div.style.borderWidth = '0px';
                div.style.position = 'absolute';
                m.div = div;
                var el = angular.element(div);
                el.html(m.template);
                docfrag.appendChild(div);
            }
            this.div =  docfrag;
        };

        var isItemMapped = function (item) {
            if (item.latitude && item.longitude) {
                return true;
            }
            return false;
        };

        // Inherit from google OverlayView
        overlay.prototype = new google.maps.OverlayView();
        // Update height
        overlay.prototype.updateHeight = function(m) {
            m.divHeight = $(m.div).height();
        };
        // Attach events
        overlay.prototype.attachEvents = function(m) {
            var self = this;
            if(m.markerEvents.length === 0) {
                var mouseenter, mouseout, click;
                // HOVER Event
                mouseenter = google.maps.event.addDomListener(m.div, 'mouseover', function(){
                    m.mouseEnter(); // Fire mouseEnter
                });
                mouseout = google.maps.event.addDomListener(m.div, 'mouseout', function(){
                    m.mouseOut(); // Fire mouseOut
                });
                m.markerEvents.push(mouseenter);
                m.markerEvents.push(mouseout);
                // CLICK Event
                m.click(function(){
                    self.panToCenter(m);
                });
                click = google.maps.event.addDomListener(m.div, 'click', function(){
                    m.click(); 
                });
                m.markerEvents.push(click);
            }
        };
        // Pan to center
        overlay.prototype.panToCenter = function(m){
            var p = this.getProjection(),
                pixel = p.fromLatLngToContainerPixel(m.position),
                map = $('.map_canvas_wrap'),
                detail = $('.proj-card-wrap'),
                offset = map.offset();
            //bounds for no panning
            this.limit = this.limit || {
                    left : offset.left + detail.width() + 50,
                    right : offset.left + map.width() - 100,
                    top :  map.height() - 100,
                    bottom : 100
                };

            if(pixel.x < this.limit.left || pixel.x > this.limit.right || pixel.y < this.limit.bottom || pixel.y > this.limit.top) {
                this.map.panTo(m.position);
            }
        };
        // Detach from pane
        overlay.prototype.detachFromPane = function() {
            this.div = $(this.div).detach()[0];
        };
        // Attach to pane
        overlay.prototype.attachToPane = function() {
            var panes = this.getPanes();
            panes.overlayMouseTarget.appendChild(this.div);
        };
        // Remove events
        overlay.prototype.removeEvents = function() {
            var i, len , m,
                removeGoogleListener = function(idx, evnt) {
                    google.maps.event.removeListener(evnt);
                };
            for(i = 0, len = this._markers.length; i < len; i++){
                m = this._markers[i];
                $.each(m.markerEvents, removeGoogleListener);
                m.markerEvents = [];
           }
        };
        // Destroy
        overlay.prototype.destroy = function() {
            this.setMap(null);
            this.removeEvents();
            this.map = undefined;
            this._map = undefined;
            this._markers = [];
       };

        // ================ Override methods ===============
        // `onAdd` : Called when map is set (i.e. show)
        overlay.prototype.onAdd = function() {
            var i, len, m;
            for(i = 0, len = this._markers.length; i < len; i++){
                m = this._markers[i];
                // Draw overlay only for the mapped items. 
                if (!isItemMapped(m.data)) {
                    continue;
                }
                this.attachEvents(m);
            }

            // check for interested in map

			$rootScope.$broadcast('mapMarkerAdd', {data: 'add'});

            this.attachToPane();
        };

        // `draw` : Called after onAdd to plot overlay on map
        overlay.prototype.draw = function() {
            var p = this.getProjection(),
                pixel, m, i, len,
                // For simplicity (Only 2 types of markers)
                markerHeight = (this._markers[0].type === 'locality')? 29:20;
            this.detachFromPane();
            for(i = 0, len = this._markers.length; i < len; i++) {
                m = this._markers[i];
                // Draw overlay only for the mapped items. 
                if (!isItemMapped(m.data)) {
                    continue;
                }
                pixel = p.fromLatLngToDivPixel(m.position);
                m.div.style.left = (pixel.x - this.shift.x) + 'px';
                m.div.style.top = (pixel.y - markerHeight - this.shift.y) + 'px';
            }
            this.attachToPane();
        };
        // `onRemove` : Called when map is set null (i.e. hide)
        overlay.prototype.onRemove = function() {
            var i, len, m;
            for(i = 0, len = this._markers.length; i < len; i++){
                m = this._markers[i];
                // Draw overlay only for the mapped items. 
                if (!isItemMapped(m.data)) {
                    continue;
                }
                m.div.parentNode.removeChild(m.div); 
                m.div = null;
                m.destroy();
                m = undefined; 
            }
            this.div = null;
        };
        // =================================================

        return overlay;
    };

    return factory;
});
