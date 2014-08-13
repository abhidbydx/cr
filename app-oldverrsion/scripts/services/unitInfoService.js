/**
   * Name: Project Service
   * Description: It will get projects from server   
   * @author: [Nakul Moudgil]
   * Date: Sep 30, 2013
**/
'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {        
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .factory('UnitInfoService', function ($http, GlobalService, UnitParser, GetHttpService) {
    var headers = {
     'Content-Type' : 'application/x-www-form-urlencoded'
    };  
    var getUnitInfo = function (projectId){
    var url = GlobalService.getAPIURL('data/v1/entity/property?selector={"paging":{"start":0,"rows":20},"filters":{"and":[{"equal":{"projectId":' + projectId + '}}]}}');//'http://portfolio.proptiger-ws.com/data/v1/entity/property?selector={"paging":{"start":0,"rows":20},"filters":{"and":[{"equal":{"projectId":' + projectId + '}}]}}';//
      return $http({method:'GET',
        url: url,
        headers: headers})
      .then(function(response){
        if ( response.status === 200 ) {
          return UnitParser.parse(response.data);
        }
        else {
          GetHttpService.error();
          return {};
        }
      });
    };
    return {
      getUnitInfo : getUnitInfo
    };
});