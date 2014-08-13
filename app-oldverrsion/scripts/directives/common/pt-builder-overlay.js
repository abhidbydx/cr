
'use strict';
angular.module('serviceApp').directive('ptBuilderOverlay',function(){
	return {
		restrict: 'A',
		scope: { card: '='},
		templateUrl: 'views/directives/common/pt-builder-overlay.html'
	}
});