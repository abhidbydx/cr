
'use strict';

angular.module('intranetApp').directive('leftPanel', [   
    '$rootScope',
     function($rootScope){
	return {
		restrict: 'A',
		scope: {},
		templateUrl: 'views/directives/left-panel.html',
		controller: function ($scope,$rootScope) {
            $scope.name=$rootScope.name;
            
		}
    };
}]);
