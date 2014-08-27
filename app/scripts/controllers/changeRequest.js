'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
  .controller('changeRequest', function ($scope,$http,$rootScope,$routeParams,$location,UserService,$cookies,$upload) {
      var loginData={};
      var userData=UserService.getUserCookie($cookies.USER_INFO); 
      $scope.valErrMsg=null;
      loginData.page= 'getAllCr';      
      loginData.projectId= $routeParams.projectID;      
      loginData.user_id = userData.id;
      $scope.userType = userData.user;
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

    $scope.onFileSelect = function($files) {
         var selectedFile=[];
         $rootScope.selectedFile = $files ;
         
    };    
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
    if(typeof(cr.crtitle)==='undefined' || cr.crtitle===null){
      $scope.valErrMsg = 'Please enter title';
      return false;
    }
    if(typeof(cr.crdesc)==='undefined' || cr.crdesc===null){
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
          if(typeof($rootScope.selectedFile)!=='undefined') {         
            for (var i = 0; i < $rootScope.selectedFile.length; i++) {
              var file = $rootScope.selectedFile[i];
              $scope.upload = $upload.upload({
                url: 'functions/fileupload.php', 
                data: {cr_id:res.last_id},
                file: file,
              }).progress(function(evt) {       
              }).success(function(data, status, headers, config) {
                   
              });
      
            } }

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
              $scope.cr_title=null;
              $scope.cr_description=null;
              delete $rootScope.selectedFile;
          }else{
              $scope.valErrMsg = 'error in deletion!!';
              return false;
          }
        }); 
        }else{
            $scope.valErrMsg = res.message;
            return false;
        }
      });       

  };   

    $scope.cr_delete = function(cr_id){
        var x = confirm("Are you sure you want to delete?");
        if(x) {
        var cr={};
        cr.id=cr_id;
        cr.page= 'deleteCR';
        $http({
        method : 'POST',
        url : 'functions/webservices.php',
        data : $.param( cr ), // url encode ( kind of )
        headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
        }
        })
        .then( function( data ) {
        var res=data.data;        
        if(res.status!=='Error'){
        $http({
        method : 'POST',
        url : 'functions/webservices.php',
        data : $.param( loginData ), // url encode ( kind of )
        headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
        }
        })
        .then( function( data ) {
          res=data.data;       
        if(res!=='Error'){
        $scope.allCRs = res.cr;
        }else{
        $scope.valErrMsg = 'error in deletion!!';
        return false;
        }
        });
        }else{
        $scope.valErrMsg = res.message;
        return false;
        }
        });
        }else{
        return false;
        }
        }; 

    $scope.cr_edit = function(cr_id){
    var cr={};
    cr.id           = cr_id;
    cr.crtitle      = $scope.cr_title;
    cr.crdesc       = $scope.cr_description;   
    cr.crstatus     = $scope.cr_status; 
    cr.cr_date      = new Date();
    cr.created_by   = userData.id;    
    cr.page= 'editCR';    
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
          if(res!=='Error'){
              $scope.allCRs = res.cr;
              $scope.cr_title=null;
              $scope.cr_description=null;
              $scope.cr_status=null;
              $scope.editCR  =false;
          }else{
              $scope.valErrMsg = 'error in deletion!!';
              return false;
          }
        });  
        }else{
            $scope.valErrMsg = res.message;
            return false;
        }
      });       

  };  

      //show cr add form
    $scope.showadd = function(){
    $scope.addCR   =true;
    $scope.editCR  =false;
    $scope.cr_title = null;
    $scope.cr_description = null;
   }; 

    //show cr edit form
    $scope.showEdit = function(cr_id){
    $scope.addCR   =false;
    $scope.editCR  =true;
    var cr={};
    cr.page = 'getCRById'; 
    cr.id   =  cr_id;
    $scope.valErrMsg=null;
    $scope.cr_id=cr_id;
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
          if(res!=='error'){
              $scope.cr_title = res.cr.title;
              $scope.cr_description = res.cr.description;
              $scope.cr_status = res.cr.status;
          }else{
              $scope.valErrMsg = 'error in updation!!';
              return false;
          }
        });  

  };

     



  });
