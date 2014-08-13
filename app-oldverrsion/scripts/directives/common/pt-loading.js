/**
 * Name: Loading Directive
 * Description: To show different loading message during server calls.
 * @author: [Nakul Moudgil]
 * Date: Nov 23, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptLoading',['LoadingService',function( LoadingService) {
	return {
		restrict : 'A',
		//replace: true,
		templateUrl : 'views/directives/common/pt-loading.html',
		controller : function( $scope, LoadingService ) {
			$scope.loadingFlag = {};
			$scope.loadingFlag = LoadingService.getLoadingFlag();
			$scope.$watch('loadingFlag.flag', function(newVal, oldVal) {
				if (newVal !== oldVal) {
					$scope.loadingFlag = newVal;					
				}
			});
		}
	}
}]);