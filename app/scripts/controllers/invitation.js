'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
  .controller('sendInvitation', function ($scope,$http,$rootScope,UserService,$cookies) {

    var loginData={};
    loginData.page = 'getAllProjects'; 
    var userData=UserService.getUserCookie($cookies.USER_INFO)  ;    
    loginData.user_id = userData.id;
    loginData.user = userData.user;
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

    $scope.invite = function(){
        var loginData={};
        loginData.page = 'checkEmail';
        loginData.email = $scope.email;
        loginData.projectIds = $scope.project_id;
        if(typeof(loginData.email)==='undefined'){
            $scope.valErrMsg = 'Please enter email';
            return false;
        }
        if(typeof(loginData.projectIds)==='undefined' || loginData.projectIds.length < 1){
            $scope.valErrMsg = 'Please select project';
            return false;
        }
        $scope.valErrMsg = '';
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
            if(res.status!=='Error'){
                $scope.valSucsMsg = res.message;
                $scope.valErrMsg = false;
            }else{
                $scope.valErrMsg = res.message;
                $scope.valSucsMsg = false;
                return false;
            }
        });   
    };  
  });