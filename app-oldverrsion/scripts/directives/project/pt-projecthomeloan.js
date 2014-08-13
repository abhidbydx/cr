'use strict';
angular.module('serviceApp').directive('ptProjecthomeloan', function () {
	return {
		restrict: 'A',
		scope: { loanproviderbanks: "=", openLeadForm: "=leadform" },
		templateUrl: 'views/directives/project/homeloan.html',
		controller: function ($scope) {
			$scope.$watch('loanproviderbanks', function (newVal, oldVal) {
				$scope.loanProviderBankDetails = newVal;
			});
		}
	};
});