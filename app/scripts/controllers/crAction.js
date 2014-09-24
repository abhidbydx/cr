'use strict';

/**
 * @ngdoc function
 * @name intranetApp.controller:registration
 * @description
 * # approve/reject CR
 * Controller of the intranetApp
 */
angular.module('intranetApp')
   .controller('crAction', function ($scope,$http,$routeParams,$location,UserService) {
        var paramData = unserialize(base64_decode(urldecode($routeParams.actionParam)));
        $scope.cr_id = paramData.cr_id;
        if(paramData.action=='approve') {
            $scope.action = 'Approved';
        }
        if(paramData.action=='reject') {
            $scope.action = 'Rejected';
        }
        var postData = {};
        postData.page = 'updateCrAction';
        postData.cr_id = paramData.cr_id;
        postData.client_id = paramData.client_id;
        postData.action = paramData.action;
        $http({
            method : 'POST',
            url :  'functions/webservices.php',
            data : $.param(postData),    //  url encode ( kind of )
            headers: {
              'Content-Type' : 'application/x-www-form-urlencoded'
            }
        })
        .then( function( data ) {
            
        });
   });