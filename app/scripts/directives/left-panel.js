
'use strict';

angular.module('intranetApp').directive('leftPanel', [   
    '$rootScope',
     function($rootScope){
	return {
		restrict: 'A',
		scope: {},
		templateUrl: 'views/directives/left-panel.html',
		controller: function ($scope,$rootScope,UserService,$cookies) {
            //$rootScope.name1=$rootScope.name;
            $scope.$watch( function() {                
            	return $cookies.USER_INFO;                
            },  function( nUser ) {
            	var userInfo = UserService.getUserCookie( nUser );                    
                    $scope.userInfo = userInfo;
                    
                    
                }
            );
            //console.log($scope);
            
		}
    };
}]);
