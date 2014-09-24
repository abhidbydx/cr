'use strict';
angular.module('intranetApp').directive('clientInfo', [   
    '$rootScope',
     function($rootScope){
	return {
		restrict: 'A',
        templateUrl: 'views/directives/client-info.html',
		scope: {
            projectid:'='
        },
		controller: function($scope,$http,$rootScope) {
            var loginData={};
            loginData.page = 'getPrimaryClient';    
            loginData.project_id = $scope.projectid;
            $http({
              method : 'POST',
              url :  'functions/webservices.php',
              data : $.param( loginData ),    //  url encode ( kind of )
              headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
              }
            })
            .then( function( data ) {
              var res=data.data;
              if(res!=='Error'){          
                  $scope.client = res.details;   
                  $rootScope.secondary_email = res.details.secondary_email;  
                  $rootScope.clnt_email = res.details.email;   
              }else{
                  $scope.valErrMsg = 'Invalid credentials!!';
                  return false;
              }
            }); 
        }
    };
}]);