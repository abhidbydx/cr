'use strict';
/**
 * @ngdoc function
 * @name intranetApp.controller:changePassword
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
    .controller('changePassword', function ($scope,$http,UserService,$cookies,CommonValidators) {
        var userData   = UserService.getUserCookie($cookies.USER_INFO)  ;
        $scope.change_pwd = function(){
            var loginData={};
            loginData.page      = 'changePassword'; 
            loginData.user_id   = userData.id;
            loginData.user      = userData.user;
            if(!CommonValidators.isValidString($scope.current_password)){
                $scope.valErrMsg = 'Please enter current password';
                return false;
            }
            if(!CommonValidators.isValidString($scope.new_password)){
                $scope.valErrMsg = 'Please enter new password';
                return false;
            }
            console.log($scope.confirm_password);
            if(!CommonValidators.isValidString($scope.confirm_password)){
                $scope.valErrMsg = 'Please confirm new password';
                return false;
            }
            if($scope.confirm_password!==$scope.new_password){
                $scope.valErrMsg = 'Passwords do not match';
                return false;
            }
            $scope.valErrMsg = '';
            loginData.current_passowrd    = $scope.current_password;
            loginData.new_passowrd     = $scope.new_password;
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
                console.log(res);
                if(res.status!=='Error'){
                    $scope.valSuccsMsg = res.message; 
                    delete $scope.valErrMsg; 
                } else {
                    $scope.valErrMsg = res.message; 
                    delete $scope.valSuccsMsg; 
                }
            }); 
        }; 
  });