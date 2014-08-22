'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:registration
 * @description
 * # registration
 * Controller of the intranetApp
 */
angular.module('intranetApp')
  .controller('registration', function ($scope,$http,$routeParams,$location,UserService) {
    var paramData = unserialize(base64_decode(urldecode($routeParams.param)));
    var postData = {};
    postData.email = paramData.email;
    postData.page = 'checkRegistration';  
    $http({
        method : 'POST',
        url :  'functions/webservices.php',
        data : $.param( postData ),    
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
    })
    .then( function( data ) {
        var res=data.data;        
            $scope.status = res.status;        
    });   
    $scope.register_user = function(){
        var loginData={};
        loginData.page = 'register';
        loginData.email = paramData.email;
        loginData.projectIds = paramData.projectIds;
        loginData.first_name = $scope.first_name;
        loginData.last_name = $scope.last_name;
        loginData.password = $scope.password;
        if(typeof(loginData.first_name)==='undefined'){
            $scope.valErrMsg = 'Please enter first name';
            return false;
        }
        if(typeof(loginData.last_name)==='undefined'){
            $scope.valErrMsg = 'Please enter last name';
            return false;
        }
        if(typeof(loginData.password)==='undefined'){
            $scope.valErrMsg = 'Please enter password';
            return false;
        }
        if(typeof($scope.confirm_password)==='undefined'){
            $scope.valErrMsg = 'Please enter password';
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
                UserService.setCookie( 'USER_INFO', UserService.makeUserCookie( res ) );  
                $location.path('/crlisting/'); 
            }else{
                $scope.valErrMsg = res.message;
                return false;
            }
        });   
    }; 
    
  });