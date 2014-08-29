'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
  .controller('ListingCtrl', function ($scope,$http,$rootScope,UserService,$cookies) {
  	var loginData={};
  	loginData.page = 'getAllProjects'; 
    var userData=UserService.getUserCookie($cookies.USER_INFO)  ;    
  	loginData.user_id = userData.id;
    loginData.user = userData.user;
    $scope.loginUser = userData.user;
    $scope.hideClientProfile = true;
    $scope.showClientProfile = false;
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
        }
      });  

      $scope.view_client_profile = function(client_id){
          $scope.showClientProfile = true;
          var loginData={};
          loginData.page = 'getUserInfo'; 
          loginData.user_id = client_id;
          loginData.user    = 'cr';
          $http({
              method : 'POST',
              url :  'functions/webservices.php',
              data : $.param( loginData ),
              headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
              }
          })
          .then( function( data ) {
              var res=data.data;
              if(res!=='Error'){
                  $scope.first_name = res.details.first_name;
                  $scope.last_name = res.details.last_name;
                  $scope.email = res.details.email;
                  $scope.mobile_no = res.details.mobile_no;
              }
          }); 
      };  

      $scope.close = function(){
          $scope.showClientProfile = false;
      }; 
  });
