'use strict';

angular.module('serviceApp')
.factory('Flags', function($rootScope) {

	var flags = {},

	set = function(flag, value){
		flags[flag] = value;
	},

	get = function(flag){
		return flags[flag];
	},

	broadcast = function(flag, extra){
		$rootScope.$broadcast(flag+'Message', {value: flags[flag], extra: extra});
	};

	return {
		set: set,
		get: get,
		broadcast: broadcast
	};

});
