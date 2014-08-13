
'use strict';
angular.module('serviceApp').directive('ptDiscussions',function(){
	return {
		restrict: 'A',
		scope: { discussions: '='},
		templateUrl: 'views/directives/common/pt-discussions.html',
	        controller: ["$scope", "$rootScope", function ($scope, $rootScope) {
		    $scope.checkPageName = function () {
			return $rootScope.urlData.pageType === "projectdetail";
		    };
		}]
	};
});