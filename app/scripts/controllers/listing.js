'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
  .controller('ListingCtrl', function ($scope,$http,$rootScope) {
  	var loginData={};
  	loginData.page = 'getAllProjects';
  	loginData.user_id = $rootScope.user_id;
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
        if(res!=='error'){
            $scope.projects = res.projects;
        }else{
           // $scope.valErrMsg = 'Invalid credentials!!';
            //return false;
        }
      });       
  });
