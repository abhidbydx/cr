'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
    .controller('updateProfile', function ($scope,$http,UserService,$cookies) {
        var userData   = UserService.getUserCookie($cookies.USER_INFO)  ;
        var loginData={};
        $scope.viewProfile = true;
        $scope.updateProfile = false;
        loginData.page = 'getUserInfo'; 
        loginData.user_id = userData.id;
        loginData.user    = userData.user;
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
                $scope.userDetails = res.details;
            }
        });    
        $scope.edit_profile = function(){
            $scope.viewProfile = false;
            $scope.updateProfile = true;
            loginData.page = 'getUserInfo'; 
            loginData.user_id = userData.id;
            loginData.user    = userData.user;
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
                    console.log(res.details);
                    $scope.userDetails = res.details;
                }
            });    





            var loginData={};
            loginData.page = 'updateUserProfile';
            loginData.email = $scope.email;
            loginData.projectIds = $scope.project_id;
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
                var errorRes = '';
                var successRes = '';
                $.each( res, function( key, value ) {
                    if(value.status!=='Error') {
                        successRes = successRes+"<span class='heading1'>"+key+"</span>" + ": " + value.message+"<br />";
                    } else {
                        errorRes = errorRes+"<span class='heading1'>"+key+"</span>" + ": " + value.message+"<br />";
                    }
                });
                $scope.valSucsMsg = successRes;
                $scope.valErrMsg = errorRes;
            });   
        };  
  });