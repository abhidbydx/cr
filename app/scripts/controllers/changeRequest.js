'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
  .controller('changeRequest', function ($scope,$http,$rootScope,$routeParams) {
      var loginData={};
      $scope.valErrMsg=null;
      loginData.page= 'getAllCr';
      loginData.projectId= $routeParams.projectID;
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
              $scope.allCRs = res.cr;
          }else{
              $scope.valErrMsg = 'Invalid credentials!!';
              return false;
          }
        });    
  });
