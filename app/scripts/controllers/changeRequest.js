'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
  .controller('changeRequest', function ($scope,$http,$rootScope,$routeParams,$location,UserService,$cookies) {
      var loginData={};
      var userData=UserService.getUserCookie($cookies.USER_INFO); 
      $scope.valErrMsg=null;
      loginData.page= 'getAllCr';      
      loginData.projectId= $routeParams.projectID;      
      loginData.user_id = userData.id;
      $scope.projectId=loginData.projectId;
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
       //add cr
    $scope.add_cr = function(project_id){
    var cr={};
    $scope.valErrMsg=null;
    cr.crtitle      = $scope.cr_title;
    cr.crdesc       = $scope.cr_description;
    cr.cr_date      = new Date();
    cr.created_by   = userData.id;
    
    cr.project_id=project_id;
    cr.page= 'addCR';    
    if(typeof(cr.crtitle)==='undefined'){
      $scope.valErrMsg = 'Please enter title';
      return false;
    }
    if(typeof(cr.crdesc)==='undefined'){
      $scope.valErrMsg = 'Please enter description';
      return false;
    }    
    $http({
        method : 'POST',
        url :  'functions/webservices.php',
        data : $.param( cr ),    //  url encode ( kind of )
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      })
      .then( function( data ) {       
        var res=data.data;
        if(res.status!=='Error'){            
            $location.path('/showChangeRequests/'+project_id); 
        }else{
            $scope.valErrMsg = res.message;
            return false;
        }
      });       

  };    
  });