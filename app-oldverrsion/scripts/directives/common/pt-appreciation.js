
'use strict';
angular.module('serviceApp').directive('ptAppreciation',function(){
	return {
		restrict: 'A',
		scope: { rate: '=', time: '=' },
		templateUrl: 'views/directives/common/pt-appreciation.html'
	}
});