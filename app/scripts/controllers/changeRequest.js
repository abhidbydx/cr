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
      $scope.cr_billable = '1';
      loginData.page= 'getAllCr';      
      loginData.projectId= unserialize(base64_decode(urldecode($routeParams.projectID)));      
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
              $scope.project_name = res.project;              
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
    cr.creffort     = $scope.cr_effort;
    cr.crbillable   = $scope.cr_billable;
    if(CommonValidators.isValidString($scope.billable_reason)){      
        cr.billable_reason = $scope.billable_reason;
    } 
    cr.actual_cost_currency = $scope.actual_cost_currency;
    cr.actual_cost = $scope.actual_cost;
    cr.billed_cost_currency  = $scope.billed_cost_currency;
    cr.billed_cost  = $scope.billed_cost;
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
    if($scope.client_scndry_email) {
        cr.client_secondary_email = $rootScope.secondary_email;
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
        res = res.response;
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
            }
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
        } else{
            $scope.valErrMsg = res.message;
            return false;
        }
    }); 
  }  

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
    var cr={}, msgText='';
    cr.id           = cr_id;
    cr.crtitle      = $scope.cr_title;
    cr.crdesc       = $scope.cr_description;   
    cr.crstatus     = $scope.cr_status; 
    cr.crreason     = $scope.cr_reason; 
    cr.creffort     = $scope.cr_effort;
    cr.crbillable   = $scope.cr_billable;
    if(CommonValidators.isValidString($scope.billable_reason)){      
        cr.billable_reason = $scope.billable_reason;
    } 
    cr.actual_cost_currency = $scope.actual_cost_currency;
    cr.actual_cost = $scope.actual_cost;
    cr.billed_cost_currency  = $scope.billed_cost_currency;
    cr.billed_cost  = $scope.billed_cost;
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
    if($scope.client_scndry_email) {
        cr.client_secondary_email = $rootScope.secondary_email;
    }
    if($scope.cr_status==3) {
      msgText='Approve';
    }
    else if($scope.cr_status==4) {
      msgText='Reject';
    }
    if(msgText!==''){
      cr.action_taken_on  = new Date();
      var x = confirm("Are you sure you want to "+msgText+ " CR. You can't undone the status further.");
    }else{
      x=true;
    }
    if(x) { 
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
                  });
              } 
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
        }else{
            $scope.valErrMsg = res.message;
            return false;
        }
      });       
     }
  };  

      //show cr add form
    $scope.showadd = function(projectId){
        $scope.addCR   =true;
        $scope.editCR  =false;
        $scope.viewCR  =false;
        $scope.showNoti=false;
        $scope.cr_title = null;
        $scope.cr_description = null;
        $scope.cr_effort = null;
        $scope.is_billable = null;
        $scope.billable_reason = null;
        $scope.actual_cost_currency = '';
        $scope.actual_cost = null;
        $scope.billed_cost_currency = '';
        $scope.billed_cost = null;
        $scope.valErrMsg=null; 
        $scope.is_secondary_email = $rootScope.secondary_email;
    }; 

    //show cr edit form
    $scope.showEdit = function(cr_id){
    $scope.addCR   =false;
    $scope.editCR  =true;
    $scope.viewCR  =false;
    $scope.showNoti=false;
    $scope.is_secondary_email = $rootScope.secondary_email;
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
              $scope.cr_effort       =  res.cr.effort;
              $scope.cr_billable     =  res.cr.is_billable;
              $scope.billable_reason =  res.cr.is_not_billable_reason;
              $scope.actual_cost_currency =  res.cr.actual_cost_currency;
              $scope.actual_cost         =  res.cr.actual_cost;
              $scope.billed_cost_currency  =  res.cr.billed_cost_currency;
              $scope.billed_cost         =  res.cr.billed_cost;
              $scope.client_scndry_email =  res.cr.send_on_secondary_email;
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
              $scope.cr_effort       =  res.cr.effort;
              $scope.cr_billable     =  res.cr.is_billable;
              $scope.billable_reason =  res.cr.is_not_billable_reason;
              $scope.actual_cost_currency =  res.cr.actual_cost_currency;
              $scope.actual_cost         =  res.cr.actual_cost;
              $scope.billed_cost_currency  =  res.cr.billed_cost_currency;
              $scope.billed_cost         =  res.cr.billed_cost;
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

    //show cr edit form
    $scope.show_billable_reason_box = function(){ 
      $scope.showbillablereason  = false;
      if($scope.cr_billable==="0"){
          $scope.showbillablereason=true;
       }
    };

    $scope.add_publish_cr = function(project_id){
        var cr={};    
        $scope.valErrMsg=null;
        cr.crtitle      = $scope.cr_title;
        cr.cameFrom      = 'publish';
        cr.crdesc       = $scope.cr_description;
        cr.creffort     = $scope.cr_effort;
        cr.crbillable   = $scope.cr_billable;
        if(CommonValidators.isValidString($scope.billable_reason)){      
            cr.billable_reason = $scope.billable_reason;
        } 
        cr.actual_cost_currency = $scope.actual_cost_currency;
        cr.actual_cost = $scope.actual_cost;
        cr.billed_cost_currency  = $scope.billed_cost_currency;
        cr.billed_cost  = $scope.billed_cost;
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
        cr.client_email = $rootScope.clnt_email;
        if($scope.client_scndry_email) {
            cr.client_secondary_email = $rootScope.secondary_email;
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
            var res = data.data;
            res = res.response;
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
                    }
                }
                var postData = {};
                postData.page = 'sendMailToClient';
                postData.user_id = loginData.user_id;
                postData.projectId = loginData.projectId;
                postData.response = res;
                $http({
                    method : 'POST',
                    url :  'functions/webservices.php',
                    data : $.param(postData),    //  url encode ( kind of )
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
            } else {
                $scope.valErrMsg = res.message;
                return false;
            }

        });  
     };

     $scope.cr_publish = function(cr_id){
        var postData  = {};
        var x = confirm("Are you sure you want to publish?");
        if(x) {
            postData.cr_id = cr_id;
            postData.page = 'publishCR';
            postData.modified_by = userData.id; 
            postData.projectId = loginData.projectId;  
            $http({
                method : 'POST',
                url :  'functions/webservices.php',
                data : $.param( postData ),    //  url encode ( kind of )
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
        }       
     };      
  });
