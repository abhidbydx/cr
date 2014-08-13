
'use strict';
angular.module('serviceApp').directive('ptLoadingBlock',function(){
	return {
		restrict: 'A',
		scope: { 
			loadingObject: '='
		},
		templateUrl: 'views/directives/common/pt-loading-block.html'
	}
});