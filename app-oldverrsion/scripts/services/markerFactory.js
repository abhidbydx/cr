/**
   * Name: markerFactory
   * Description: marker factory
   * @author: [Yugal Jindle]
   * Date: Nov 26, 2013
**/

'use strict';

angular.module('serviceApp').factory('markerFactory', ['$rootScope', '$compile', function($rootScope, $compile) {
    var factory = {};

    // =========================================
    // Marker Class
    // =========================================
    factory.marker = function(type, data) {
        this.type = type;
        this.data = data;
        // Callbacks
        this._callbacks = {
            mouseEnter: [],
            mouseOut: [],
            click: [],
            resume: [],
            alvMouseEnter: [],
            alvMouseOut: [],
            alvClick: []
        };
    };

    // Templates
    factory.marker.prototype.templates = {
        locality      :   '<div marker-locality data="data" show-type="markerSettings.displayType"><p class="sq_marker">Locality</p></div>',
        project       :   '<div marker-project data="data" show-type="markerSettings.displayType"><p class="sq_marker">Project</p></div>',
        school        :   '<div tooltip="{{ data.__tooltip__ }}" class="neighbour-icons school" id="{{ data.latitude | stringReplace:\'.\':\'\' }}-{{ data.longitude | stringReplace:\'.\':\'\' }}"><i class="fs0 icon-school"></i><div class="on-hov" ng-show="data.__direction__"><span class="name" once-title="data.name">{{ data.name }}</span><span class="waiting"><span class="dstnc_wrap"><i class="fa fa-road"></i> <i class="fa fa-cog fa-spin"></i></span><span class="time_car_wrap"><i class="fa fa-truck"></i> <i class="fa fa-cog fa-spin"></i></span></span></div></div>',
        restaurant    :   '<div tooltip="{{ data.__tooltip__ }}" class="neighbour-icons restaurant" id="{{ data.latitude | stringReplace:\'.\':\'\' }}-{{ data.longitude | stringReplace:\'.\':\'\' }}"><i class="fs0 icon-restaurant"></i><div class="on-hov" ng-show="data.__direction__"><span class="name" once-title="data.name">{{ data.name }}</span><span class="waiting"><span class="dstnc_wrap"><i class="fa fa-road"></i> <i class="fa fa-cog fa-spin"></i></span><span class="time_car_wrap"><i class="fa fa-truck"></i> <i class="fa fa-cog fa-spin"></i></span></span></div></div>',
        hospital      :   '<div tooltip="{{ data.__tooltip__ }}" class="neighbour-icons hospital" id="{{ data.latitude | stringReplace:\'.\':\'\' }}-{{ data.longitude | stringReplace:\'.\':\'\' }}"><i class="fs0 icon-hospital"></i><div class="on-hov" ng-show="data.__direction__"><span class="name" once-title="data.name">{{ data.name }}</span><span class="waiting"><span class="dstnc_wrap"><i class="fa fa-road"></i> <i class="fa fa-cog fa-spin"></i></span><span class="time_car_wrap"><i class="fa fa-truck"></i> <i class="fa fa-cog fa-spin"></i></span></span></div></div>',
        gas_station   :   '<div tooltip="{{ data.__tooltip__ }}" class="neighbour-icons gas" id="{{ data.latitude | stringReplace:\'.\':\'\' }}-{{ data.longitude | stringReplace:\'.\':\'\' }}"><i class="fs0 icon-petrol-station"></i><div class="on-hov" ng-show="data.__direction__"><span class="name" once-title="data.name">{{ data.name }}</span><span class="waiting"><span class="dstnc_wrap"><i class="fa fa-road"></i> <i class="fa fa-cog fa-spin"></i></span><span class="time_car_wrap"><i class="fa fa-truck"></i> <i class="fa fa-cog fa-spin"></i></span></span></div></div>',
        bank          :   '<div tooltip="{{ data.__tooltip__ }}" class="neighbour-icons bank" id="{{ data.latitude | stringReplace:\'.\':\'\' }}-{{ data.longitude | stringReplace:\'.\':\'\' }}"><i class="fs0 icon-bank"></i><div class="on-hov" ng-show="data.__direction__"><span class="name" once-title="data.name">{{ data.name }}</span><span class="waiting"><span class="dstnc_wrap"><i class="fa fa-road"></i> <i class="fa fa-cog fa-spin"></i></span><span class="time_car_wrap"><i class="fa fa-truck"></i> <i class="fa fa-cog fa-spin"></i></span></span></div></div>',
        airport       :   '<div tooltip="{{ data.__tooltip__ }}" class="neighbour-icons airport" id="{{ data.latitude | stringReplace:\'.\':\'\' }}-{{ data.longitude | stringReplace:\'.\':\'\' }}"><i class="fs0 icon-airport"></i><div class="on-hov" ng-show="data.__direction__"><span class="name" once-title="data.name">{{ data.name }}</span><span class="waiting"><span class="dstnc_wrap"><i class="fa fa-road"></i> <i class="fa fa-cog fa-spin"></i></span><span class="time_car_wrap"><i class="fa fa-truck"></i> <i class="fa fa-cog fa-spin"></i></span></span></div></div>',
        bus_station   :   '<div tooltip="{{ data.__tooltip__ }}" class="neighbour-icons bus-stop" id="{{ data.latitude | stringReplace:\'.\':\'\' }}-{{ data.longitude | stringReplace:\'.\':\'\' }}"><i class="fs0 icon-bus-stop"></i><div class="on-hov" ng-show="data.__direction__"><span class="name" once-title="data.name">{{ data.name }}</span><span class="waiting"><span class="dstnc_wrap"><i class="fa fa-road"></i> <i class="fa fa-cog fa-spin"></i></span><span class="time_car_wrap"><i class="fa fa-truck"></i> <i class="fa fa-cog fa-spin"></i></span></span></div></div>',
        train_station :   '<div tooltip="{{ data.__tooltip__ }}" class="neighbour-icons train-station" id="{{ data.latitude | stringReplace:\'.\':\'\' }}-{{ data.longitude | stringReplace:\'.\':\'\' }}"><i class="fs0 icon-train-station"></i><div class="on-hov" ng-show="data.__direction__"><span class="name" once-title="data.name">{{ data.name }}</span><span class="waiting"><span class="dstnc_wrap"><i class="fa fa-road"></i> <i class="fa fa-cog fa-spin"></i></span><span class="time_car_wrap"><i class="fa fa-truck"></i> <i class="fa fa-cog fa-spin"></i></span></span></div></div>' 
    };
    
    // =============== Initiate marker ============== //
    factory.marker.prototype.init = function(map) {
        var self = this, id = self.type+'Id',
            selector = '#'+self.type+'_'+self.data[id];
            
        self.elem = null;

        // Compile Template
        self.compileTemplate();

        // Marker Events
        self.mouseEnter(function(){
			if(!self.elem) self.elem = $(selector);
            self.elem.addClass('st-h');
        });

        self.mouseOut(function() {
            self.elem.removeClass('st-h');
        });

        // Project Marker events for gradient
        if(self.type === 'project') {
            var showGradient = function() {
                    $('.body_map').trigger('gradient-show', self.data);
                },
                hideGradient = function() {
                    $('.body_map').trigger('gradient-hide');
                };
            self.mouseEnter(showGradient);
            self.alvMouseEnter(showGradient);
            self.mouseOut(hideGradient);
            self.alvMouseOut(hideGradient);
        }

        self.click(function() {
        });

        // Alv Events
        self.alvMouseEnter(function() {
			if(!self.elem) self.elem = $(selector);
            self.elem.addClass('st-alv-h');
        });

        self.alvMouseOut(function() {
            self.elem.removeClass('st-alv-h');
        });

        self.alvClick(function() {
        });

        // Resume Event
        self.resume(function() {
            var hasClass = self.elem.hasClass('st-c');
            if(hasClass) {
                self.elem.removeClass('st-c');
                self.elem.addClass('st-v');
            }
        });
    };
    // ============================================== //
    factory.marker.prototype.destroy = function(){
        for(var cb in this._callbacks) {
            this._callbacks[cb] = [];
        }
        this._callbacks = {};
        this.template = undefined;
        this.scope.$destroy();
        this.scope = undefined;
        this.data = undefined;
    };
 
    // =============== Events Handler =============== //
    // Add event callback
    factory.marker.prototype.addCallback = function(name, callback) {
		if(!_.has(this._callbacks, name)) {
            this._callbacks[name] = [];
        }
        this._callbacks[name].push(callback);
        return this;
    };

    // Trigger event callback
    factory.marker.prototype.triggerEvent = function(name, page) {
        var self = this;
        $.each(this._callbacks[name], function(idx, func) {
            setTimeout(function() {
                func(self.data, page);
            }, 0);
        });
        return this;
    };
    // ============================================== //

    factory.marker.prototype.compileTemplate = function() {
        // Composed Overlay
        var self = this;
        this.scope = $rootScope.$new();
        this.scope.data = this.data;
        setTimeout(function() {
            self.scope.$apply();
        }, 0);
        this.template = $compile(this.templates[this.type])(this.scope);
    };

    // =============== Predefined Events =============== //
    // mouseEnter
    // mouseEnter() => To trigger mouseEnter
    // mouseEnter(callback) => To add callback
    factory.marker.prototype.mouseEnter = function(callback) {
        var args = _.toArray(arguments);
        if(_.isEmpty(args)) {
            this.triggerEvent('mouseEnter', 'MAP');
        } else {
            this.addCallback('mouseEnter', callback);
        }
        return this;
    };

    // mouseOut
    // mouseOut() => To trigger mouseOut
    // mouseOut(callback) => To add callback
    factory.marker.prototype.mouseOut = function(callback) {
        var args = _.toArray(arguments);
        if(_.isEmpty(args)) {
            this.triggerEvent('mouseOut', 'MAP');
        } else {
            this.addCallback('mouseOut', callback);
        }
        return this;
    };

    // click
    // click() => To trigger click
    // click(callback) => To add callback
    factory.marker.prototype.click = function(callback) {
        var args = _.toArray(arguments);
        if(_.isEmpty(args)) {
            this.triggerEvent('click', 'MAP');
        } else {
            this.addCallback('click', callback);
        }
        return this;
    };

    // resume
    // resume() => To trigger resume
    // resume(callback) => To add callback
    factory.marker.prototype.resume = function(callback) {
        var args = _.toArray(arguments);
        if(_.isEmpty(args)) {
            this.triggerEvent('resume');
        } else {
            this.addCallback('resume', callback);
        }
        return this;
    };

    // alvMouseEnter
    // alvMouseEnter() => To trigger alvMouseEnter
    // alvMouseEnter(callback) => To add callback
    factory.marker.prototype.alvMouseEnter = function(callback) {
        var args = _.toArray(arguments);
        if(_.isEmpty(args)) {
            this.triggerEvent('alvMouseEnter', 'ALV');
        } else {
            this.addCallback('alvMouseEnter', callback);
        }
        return this;
    };

    // alvMouseOut
    // alvMouseOut() => To trigger alvMouseOut
    // alvMouseOut(callback) => To add callback
    factory.marker.prototype.alvMouseOut = function(callback) {
        var args = _.toArray(arguments);
        if(_.isEmpty(args)) {
            this.triggerEvent('alvMouseOut', 'ALV');
        } else {
            this.addCallback('alvMouseOut', callback);
        }
        return this;
    };

    // alvClick
    // alvClick() => To trigger alvClick
    // alvClick(callback) => To add callback
    factory.marker.prototype.alvClick = function(callback) {
        var args = _.toArray(arguments);
        if(_.isEmpty(args)) {
            this.triggerEvent('alvClick', 'ALV');
        } else {
            this.addCallback('alvClick', callback);
        }
        return this;
    };

    // ================================================= //

    return factory;
}]);
