'use strict';

angular.module('serviceApp').directive('ptIncomeslider', function () {
	return {
		restrict: 'A',
		scope: {
			income: '&',
			range: '='
		},
		link: function (scope, element) {
			element.slider({
				range: 'min',
				value: scope.$parent.annual_income,
				min: scope.range[0],
				max: scope.range[1],
				slide: function (event, ui) {
					scope.$parent.annual_income = ui.value;
					scope.$apply(function(){
						scope.$parent.eligibility_calc();
					});
				}
			})
		}
	};
})