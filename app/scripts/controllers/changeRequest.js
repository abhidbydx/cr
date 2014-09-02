'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the intranetApp
 */
angular.module('intranetApp')
  .controller('changeRequest', function ($scope,$http,$rootScope,$routeParams,$location,UserService,$cookies,$upload,CommonValidators) {
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
    cr.user=userData.user;
    cr.page= 'addCR';    
    if(!CommonValidators.isValidString($scope.cr_title)){      
      $scope.valErrMsg = 'Please Enter Title';
      return false;
    }
     if(!CommonValidators.isValidString($scope.cr_description)){      
      $scope.valErrMsg = 'Please Enter Description';
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
                                  $scope.showNoti=true;
                                  $scope.addCR=false;
                                  $scope.viewCR  =false;
                                  $scope.msg='Added Succsfully';                                 
                                  $scope.allCRs = res.cr;
                                  $scope.cr_title=null;
                                  $scope.cr_description=null;
                                  delete $rootScope.selectedFile;
                              }else{
                                  $scope.valErrMsg = 'error in addition!!';
                                  return false;
                              }
                      });  
              });
      
            } }else{
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
                                  $scope.showNoti=true;
                                  $scope.msg='Added Successfully';                               
                                  $scope.allCRs = res.cr;
                                  $scope.cr_title=null;
                                  $scope.cr_description=null;
                                  $scope.addCR=false;
                                  $scope.viewCR  =false;
                                  delete $rootScope.selectedFile;
                              }else{
                                  $scope.valErrMsg = 'error in addition!!';
                                  return false;
                              }
                      });  
            }
          
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
        cr.user = userData.user; 
        cr.modified_by = userData.id; 
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
         $scope.showNoti=true;
         $scope.msg='Deleted Successfully';
        $scope.allCRs = res.cr;
        $scope.addCR   =false;
        $scope.editCR  =false;
        $scope.viewCR  =false;        
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
    cr.crreason     = $scope.cr_reason; 
    cr.cr_date      = new Date();
    cr.created_by   = userData.id;   
    cr.user = userData.user; 
    cr.page= 'editCR';    
    if(!CommonValidators.isValidString($scope.cr_title)){      
      $scope.valErrMsg = 'Please Enter Title';
      return false;
    }
     if(!CommonValidators.isValidString($scope.cr_description)){      
      $scope.valErrMsg = 'Please Enter Description';
      return false;
    } 
    if(!CommonValidators.isValidString($scope.cr_reason) && ($scope.cr_status==3)){      
      $scope.valErrMsg = 'Please Enter Reason';
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
                data: {cr_id:cr_id},
                file: file,
              }).progress(function(evt) {       
              }).success(function(data, status, headers, config) {
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
                                  $scope.showNoti=true;
                                  $scope.msg='Updated Successfully';                               
                                  $scope.allCRs = res.cr;
                                  $scope.cr_title=null;
                                  $scope.cr_description=null;
                                  $scope.editCR=false;
                                  delete $rootScope.selectedFile;
                              }else{
                                  $scope.valErrMsg = 'error in addition!!';
                                  return false;
                              }
                      });  
              });
      
            } }
            else{ $http({
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
                                  $scope.showNoti=true;
                                  $scope.msg='Updated Successfully';                                
                                  $scope.allCRs = res.cr;
                                  $scope.cr_title=null;
                                  $scope.cr_description=null;
                                  $scope.editCR=false;
                                  $scope.viewCR  =false;
                                  delete $rootScope.selectedFile;
                              }else{
                                  $scope.valErrMsg = 'error in addition!!';
                                  return false;
                              }
                      });  }
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
    $scope.viewCR  =false;
    $scope.showNoti=false;
    $scope.cr_title = null;
    $scope.cr_description = null;
    $scope.valErrMsg=null;
   }; 

    //show cr edit form
    $scope.showEdit = function(cr_id){
    $scope.addCR   =false;
    $scope.editCR  =true;
    $scope.viewCR  =false;
    $scope.showNoti=false;
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
              $scope.cr_title        = res.cr.title;
              $scope.cr_description  = res.cr.description;
              $scope.cr_status       = res.cr.status;
              $scope.file_name       =  res.cr.file_name;
              $scope.cr_date         =  res.cr.cr_date;
          }else{
              $scope.valErrMsg = 'error in updation!!';
              return false;
          }
        });  

  };

   //show cr edit form
    $scope.showCR = function(cr_id){
    $scope.addCR   =false;
    $scope.editCR  =false;
    $scope.viewCR  =true;
    $scope.showNoti=false;
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
              $scope.cr_id           = res.cr.id;
              $scope.cr_title        = res.cr.title;
              $scope.cr_description  = res.cr.description;
              $scope.cr_status       = res.cr.status;
              $scope.file_name       =  res.cr.file_name;
              $scope.cr_date         =  res.cr.cr_date;
              $scope.cr_reason       =  res.cr.reason;
          }else{
              return false;
          }
        });  

  };

   //show cr edit form
    $scope.close = function(div_id){
     if(div_id==='addCR') {
        $scope.addCR   = false;
      }
     else if(div_id==='editCR') {
        $scope.editCR   = false;
      }
     else if(div_id==='viewCR') {
        $scope.viewCR   = false;
      }
    };

    //show cr edit form
    $scope.show_reason_box = function(){
      $scope.showreason  = false;
      if($scope.cr_status==3){
          $scope.showreason=true;
       }
    };

     



  });
