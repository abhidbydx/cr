'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
  .controller('sendInvitation', function ($scope,$http,$rootScope,UserService,$cookies,CommonValidators) {

    var loginData={};
    loginData.page = 'getAllProjects'; 
    var userData=UserService.getUserCookie($cookies.USER_INFO)  ;    
    loginData.user_id = userData.id;
    loginData.user    = userData.user;
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
        }
      });    

    $scope.invite = function(){
        var loginData={};
        loginData.page  = 'checkEmail';
        loginData.email = $scope.email;
        loginData.projectIds = $scope.project_id;
        if(!CommonValidators.isValidString($scope.email)){      
          $scope.valErrMsg = 'Please Enter Email';
          return false;
        }
        if(!CommonValidators.isEmail($scope.email)){      
          $scope.valErrMsg = 'Please Enter Valid Email';
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
            var errorRes   = '';
            var successRes = '';
            $.each( res, function( key, value ) {
                if(value.status!=='Error') {
                    successRes = successRes+"<span class='heading1'>"+key+"</span>" + ": " + value.message+"<br />";
                } else {
                    errorRes   = errorRes+"<span class='heading1'>"+key+"</span>" + ": " + value.message+"<br />";
                }
            });
            $scope.valSucsMsg = successRes;
            $scope.valErrMsg  = errorRes;
        });   
    };  
  });