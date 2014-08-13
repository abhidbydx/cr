/**
   * Name: Career Service
   * Description: It will get list of open positions in Proptiger   
   * @author: [Nakul Moudgil]
   * Date: Mar 12, 2014
**/
'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {        
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .factory('CareerService', function ($http, GlobalService, GetHttpService) {
    var headers = {
     'Content-Type' : 'application/x-www-form-urlencoded'
    };  
    var getOpenPositions = function (){
    var url = GlobalService.getAPIURL('data/v1/current-openings');
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
      getOpenPositions : getOpenPositions
    };
});