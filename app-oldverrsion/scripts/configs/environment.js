'use strict';
angular.module('environment',[]).factory('ENV', function () {
	/**
	* configuration templates
	*/
	return {
		development: false,
		production: true
	}
});
