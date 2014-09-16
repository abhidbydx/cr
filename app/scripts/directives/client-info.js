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
		controller: function($scope,$http) {
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
              }else{
                  $scope.valErrMsg = 'Invalid credentials!!';
                  return false;
              }
            }); 
        }
    };
}]);