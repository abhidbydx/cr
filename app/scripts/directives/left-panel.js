
'use strict';

angular.module('intranetApp').directive('leftPanel', [   
    '$rootScope',
     function($rootScope){
	return {
		restrict: 'A',
		scope: {},
		templateUrl: 'views/directives/left-panel.html',
		controller: function ($scope,$rootScope,UserService,$cookies,$location) {
            //$rootScope.name1=$rootScope.name;
            $scope.$watch( function() {                
            	return $cookies.USER_INFO;                
            },  function( nUser ) {
            	var userInfo = UserService.getUserCookie( nUser );                    
                    $scope.userInfo = userInfo;                    
                    if(angular.equals({}, $scope.userInfo)){
                        $location.path('/');
                    } 
                }
            );  

            $scope.logout =function(){                
                $location.path('logout.php');
             };  
             $scope.show_listing =function(){ 
               $rootScope.$broadcast("showClientProfile", false);   
             };  
              
            
            
		}
    };
}]);
