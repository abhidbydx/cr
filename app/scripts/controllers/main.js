'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
  .controller('MainCtrl', function ($scope,$location,$http,$rootScope,UserService,CommonValidators) {
    $scope.check_login = function(){
    var loginData={};
    $scope.valErrMsg=null;
    loginData.username=$scope.username;
    loginData.password=$scope.password;
    loginData.page= 'checkLogin';
    if(!CommonValidators.isValidString($scope.username)){      
      $scope.valErrMsg = 'Please Enter UserName';
      return false;
    }
     if(!CommonValidators.isValidString($scope.password)){      
      $scope.valErrMsg = 'Please Enter Password';
      return false;
    } 
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
        if(res.status!=='Error'){
            UserService.setCookie( 'USER_INFO', UserService.makeUserCookie( res ) );            
            $rootScope.user_id=res.id;
            $location.path('/crlisting/'); 
        }else{
            $scope.valErrMsg = res.message;
            return false;
        }
      });       

  };
  });
