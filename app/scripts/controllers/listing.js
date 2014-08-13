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
  	loginData.page = 'checkEmail';
  	loginData.email = 'soumya.pandey@kelltontech.com';
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
            //$rootScope.name=res.name;
        }else{
            $scope.valErrMsg = 'Invalid credentials!!';
            return false;
        }
      });       
  });
