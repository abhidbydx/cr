'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:updateProfile
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
    .controller('updateProfile', function ($scope,$http,UserService,$cookies,CommonValidators) {
        var userData   = UserService.getUserCookie($cookies.USER_INFO)  ;
        var loginData={};
        $scope.viewProfile  = true;
        loginData.page      = 'getUserInfo'; 
        loginData.user_id   = userData.id;
        loginData.user      = userData.user;
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
            $scope.viewProfile      = '';
            $scope.updateProfile    = true;
            var loginData={};
            loginData.page      = 'getUserInfo'; 
            loginData.user_id   = userData.id;
            loginData.user      = userData.user;
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
                    $scope.first_name  = res.details.first_name;
                    $scope.last_name   = res.details.last_name;
                    $scope.email       = res.details.email;
                    $scope.mobile_no   = res.details.mobile_no;
                }
            }); 
        };  
        $scope.profile_submit = function(){
            var loginData={};
            loginData.page          = 'updateUserInfo'; 
            loginData.user_id       = userData.id;
            loginData.user          = userData.user;
            loginData.first_name    = $scope.first_name;
            loginData.last_name     = $scope.last_name;
            loginData.mobile_no     = $scope.mobile_no;
            if(!CommonValidators.isValidString($scope.first_name)){      
                $scope.valErrMsg = 'Please Enter First Name';
                return false;
            }
            if(!CommonValidators.isValidString($scope.last_name)){      
                $scope.valErrMsg = 'Please Enter Last Name';
                return false;
            }
            if(CommonValidators.isValidString($scope.mobile_no)){      
                if(!CommonValidators.isMobile($scope.mobile_no)){      
                    $scope.valErrMsg = 'Please Enter Valid Mobile No.';
                    return false;
                }
            }
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
                    $scope.userDetails   = res.details;
                    $scope.viewProfile   = true;
                    $scope.valErrMsg     = '';
                    $scope.updateProfile = false;
                }
            }); 
        };  
  });