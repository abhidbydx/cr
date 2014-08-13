/**
   * Name: Property Service
   * Description: pt-propertylist is curently shown on portfolio page to show all property listings of user
   * in grid format.
   * @author: [Nakul Moudgil]
   * Date: Sep 11, 2013
**/
'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {        
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
  .factory('PortfolioService', function ($resource, $http, GlobalService, PropertyParser, PortfolioParser, GetHttpService, $rootScope) {    
    
    var getPortfolio = function (){
      return $http.get(
          GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/')
        )
      .then(function(response) {
        GetHttpService.commonResponse( response, '' );
        if ( response.status === 200 ) {
          //  200OK
          return PortfolioParser.parsePortfolio(response.data);
        }
      });
    };

    var getPropertyList = function (reqColumns){ 
      return $http.get(
          GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/listing')
        )
      .then(function(response) {
        GetHttpService.commonResponse( response, '' );
        if ( response.status === 200 ) {
          //  200OK
          var listings = response.data.data;
          return PortfolioParser.parseProperty(reqColumns, listings);
        }
      });
    };

    var getPortfolioPriceTrend = function (){ 
      return $http.get(
          GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/price-trend?months=9')
        )
      .then(function(response) {
        GetHttpService.commonResponse( response, '' );
        if ( response.status === 200 ) {
          //  200OK\
          return PortfolioParser.parseTrendForGraph(response.data.data);   
        }
      });
    };

    var getPropertyPriceTrend = function (propertyId){ 
      return $http.get(
          GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/listing/' + propertyId + '/price-trend')
        )
      .then(function(response) {
        GetHttpService.commonResponse( response, '' );
        if ( response.status === 200 ) {
          //  200OK
          return PortfolioParser.parseTrendForGraph(response.data);
        }
      });
    };

    var getRelatedProjectUrl = function( projectId, localityId ) {
      if ( projectId != null && localityId != null ) {
        var url = GlobalService.getAPIURL('lib/getPortfolioUrl.php?projectId='+projectId+'&localityId='+localityId);
        //var url = 'http://git.proptiger.com/lib/getPortfolioUrl.php?projectId='+projectId+'&localityId='+localityId;
        return $http.get(url)
        .then( function( response ) {
          GetHttpService.commonResponse( response, '' );
          if ( response.status === 200 ) {
            //  200 OK
            return response.data.data;
          }
          else {
            return [];
          }
        });
      }
      else {
        return [];
      }
    };

    return {
      getPortfolio : getPortfolio,
      getPropertyList : getPropertyList,
      getPortfolioPriceTrend: getPortfolioPriceTrend,
      getRelatedProjectUrl: getRelatedProjectUrl
    };
});
