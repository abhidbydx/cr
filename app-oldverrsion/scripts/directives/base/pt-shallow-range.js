'use strict';
angular.module('serviceApp').directive('ptShallowRange',['$filter', function($filter){
	return {
		restrict: 'A',
		scope: {
			baseObject: '=', 
			propertyName: '=', 
			unit: '=', 
			type: '@',
			staticUnit: '@',
			openLeadForm: '='
		},
		templateUrl: 'views/directives/base/pt-shallow-range.html',
		link: function (scope, element, attrs) {

			if(!scope.unit){
				scope.unit = scope.staticUnit;
			}

			scope.propertyName = attrs.propertyName;
			scope.min = scope.baseObject["min"+scope.propertyName];
			scope.max = scope.baseObject["max"+scope.propertyName];

			if(scope.type == 'price'){
				scope.min  = $filter('formatPrice')(scope.min);
				scope.max  = $filter('formatPrice')(scope.max);
			}
		}
	}
}]);
