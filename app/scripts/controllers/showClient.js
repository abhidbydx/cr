'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:updateProfile
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
    .controller('showClient', function ($scope,$http,UserService,$cookies,CommonValidators) {
        var loginData={};
        loginData.page = 'getAllClients'; 
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
            if(res.status==='Success'){
                $scope.clients = res.details;
            }else{ 
                $scope.message = res.message;          
            }
        }); 

        $scope.editClient = function(project_id){
            $scope.addClientDiv   =false;
            $scope.editClientDiv  =true;
            var clientData={};
            clientData.page = 'getPrimaryClient'; 
            clientData.project_id   =  project_id;
            $scope.valErrMsg=null;
            $http({
                  method : 'POST',
                  url :  'functions/webservices.php',
                  data : $.param( clientData ),    //  url encode ( kind of )
                  headers: {
                 'Content-Type' : 'application/x-www-form-urlencoded'
            }
            })
            .then( function( data ) {
              var res=data.data;    
              if(res.status==='Success'){ 
                  $scope.first_name  = res.details.first_name;
                  $scope.last_name  = res.details.last_name;
                  $scope.email  = res.details.email;
                  $scope.secondary_email = res.details.secondary_email;
                  $scope.phone_no  = res.details.phone_no;
                  $scope.project_id  = res.details.project_id;
                  $scope.client_id  = res.details.id;
              }else{
                  $scope.valErrMsg = 'error in updation!!';
                  return false;
              }
            });  
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
        }; 
        $scope.client_edit = function(client_id){
            $scope.addClientDiv   =false;
            $scope.editClientDiv  =false;
            var clientData={};
            clientData.page = 'updateClientDetail'; 
            clientData.project_id   =  $scope.project_id;
            clientData.client_id   =  client_id;
            clientData.first_name   =  $scope.first_name;
            clientData.last_name   =  $scope.last_name;
            clientData.email   =  $scope.email;
            clientData.secondary_email   =  $scope.secondary_email;
            clientData.phone_no   =  $scope.phone_no;
            clientData.user_id = userData.id;
            $scope.valErrMsg=null;
            $http({
                  method : 'POST',
                  url :  'functions/webservices.php',
                  data : $.param( clientData ),    //  url encode ( kind of )
                  headers: {
                 'Content-Type' : 'application/x-www-form-urlencoded'
            }
            })
            .then( function( data ) { 
                var res=data.data;
                if(res.status==='Success'){
                    $scope.clients = res.details;
                    $scope.message = '';
                }else{ 
                    $scope.message = res.message;
                    $scope.editClientDiv = true;  
                    $scope.first_name  = clientData.first_name;
                    $scope.last_name  = clientData.last_name;
                    $scope.email  = clientData.email;
                    $scope.phone_no  = clientData.phone_no;
                    $scope.project_id  = clientData.project_id;
                    $scope.secondary_email = clientData.secondary_email;        
                }
            });  
        }; 
        $scope.addClient = function(){
            $scope.addClientDiv   =true;
            $scope.editClientDiv  =false;
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
        }; 
        $scope.client_add = function(){
            $scope.addClientDiv   =false;
            $scope.editClientDiv  =false;
            var clientData={};
            clientData.page = 'saveClientDetail'; 
            clientData.project_id   =  $scope.project_id;
            clientData.first_name   =  $scope.first_name;
            clientData.last_name   =  $scope.last_name;
            clientData.email   =  $scope.email;
            clientData.secondary_email   =  $scope.secondary_email;
            clientData.phone_no   =  $scope.phone_no;
            clientData.user_id = userData.id;
            $scope.valErrMsg=null;
            $http({
                  method : 'POST',
                  url :  'functions/webservices.php',
                  data : $.param( clientData ),    //  url encode ( kind of )
                  headers: {
                 'Content-Type' : 'application/x-www-form-urlencoded'
            }
            })
            .then( function( data ) { 
                var res=data.data;
                if(res.status==='Success'){
                    $scope.clients = res.details;
                    $scope.message = '';
                }else{ 
                    $scope.message = res.message;
                    $scope.addClientDiv = true;  
                    $scope.first_name  = clientData.first_name;
                    $scope.last_name  = clientData.last_name;
                    $scope.email  = clientData.email;
                    $scope.phone_no  = clientData.phone_no;
                    $scope.project_id  = clientData.project_id;
                    $scope.secondary_email = clientData.secondary_email;        
                }
            });  
        }; 
        $scope.close = function(div_id){
            if(div_id==='addClientDiv') {
                $scope.addClientDiv   = false;
            }
            else if(div_id==='editClientDiv') {
                $scope.editClientDiv   = false;
            }
        };
    });