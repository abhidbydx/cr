'use strict';
angular.module('intranetApp').directive('clientInfo', [   
    '$rootScope',
     function($rootScope){
	return {
		restrict: 'A',
		scope: {
            projectId:'='
        },
		templateUrl: 'views/directives/client-info.html',
		link: function(scope, elm, attrs) {
            alert(scope.projectId);
            $rootScope.projectId = scope.projectId;
        }
    };
}]);