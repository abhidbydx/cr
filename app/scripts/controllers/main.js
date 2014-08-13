'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
  .controller('MainCtrl', function ($scope,$location,$http,$rootScope) {
    $scope.check_login = function(){
    var loginData={};
    $scope.valErrMsg=null;
    loginData.username=$scope.username;
    loginData.password=$scope.password;
    if(typeof(loginData.username)==='undefined'){
    	$scope.valErrMsg = 'Please enter username';
    	return false;
    }
    if(typeof(loginData.password)==='undefined'){
    	$scope.valErrMsg = 'Please enter password';
    	return false;
    }
    $http({
        method : 'POST',
        url :  'functions/checklogin.php',
        data : $.param( loginData ),    //  url encode ( kind of )
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      })
      .then( function( data ) {
        var res=data.data;
        if(res!=='error'){
            $rootScope.name=res.name;
            $location.path('/crlisting'); 
        }else{
            $scope.valErrMsg = 'Invalid credentials!!';
            return false;
        }
      });       

  };
  });
