/**
   * Name: Banks Service
   * Description: It will get list of banks from server   
   * @author: [Nakul Moudgil]
   * Date: Oct 17, 2013
**/
'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {        
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .factory('BanksService', function ($http, GlobalService, GetHttpService) {
    var headers = {
     'Content-Type' : 'application/x-www-form-urlencoded'
    };  
    var getBanksList = function (){
    var url = GlobalService.getAPIURL('data/v1/entity/bank');
      return $http({method:'GET', 
        url: url,
        headers: headers})
      .then(function(response){
        GetHttpService.commonResponse( response, '' );
        if ( response.status === 200 ) {
          //  200OK
          return response.data.data;
        }
      });
    };
    return {
      getBanksList : getBanksList
    };
});