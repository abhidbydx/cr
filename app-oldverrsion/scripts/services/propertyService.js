'use strict';

angular.module('serviceApp') .config(function ( $httpProvider) {        
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).factory('PropertyService', function ($rootScope, $resource, $http, GlobalService, PortfolioParser, PropertyParser, GetHttpService) {
	
    var getPropertyPriceTrend = function (propertyId){ 
      return $http.get(
          GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/listing/' + propertyId + '/price-trend?months=9')
        )
      .then(function(response) {
          return PortfolioParser.parseTrendForGraph(response.data);
      });
    };

    var getProperty = function (reqColumns, propertyId){
      return $http.get(
        GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/listing/' + propertyId))
      .then(function(response) {
        GetHttpService.commonResponse( response, '' );
        if ( response.status === 200 ) {
            //  200
	    return PropertyParser.parse(reqColumns, response.data);
        }
      });
    };

    var deleteProperty = function (propertyId){ 
      return $http({method:'DELETE',url:GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/listing/' + propertyId)})
      .then(function(response) {
        //  it will auto handle return statement
        return GetHttpService.commonResponse( response, $rootScope.labels.common.message.PROPERTY_DELETED );
      });
    };

    var updateProperty = function( property, id ) {
      var putObj = PropertyParser.createPostObject( property );
      return $http.put( 
        GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/listing/'+id), putObj )
        .then( function( response ) {
          return GetHttpService.commonResponse( response, $rootScope.labels.common.message.PROPERTY_UPDATED );
        });
    };

    var saveProperty = function(property){
      var postObj = PropertyParser.createPostObject(property);
      return $http.post(
        GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/listing/'), postObj)
        .then(function(response) {
          return GetHttpService.commonResponse( response, $rootScope.labels.common.message.PROPERTY_ADDED );
        });
    };

    var sellProperty = function (propertyId){ 
      return $http.put(
        GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/listing/' + propertyId + '/interested-to-sell?interestedToSell=true'))
      .then(function(response) {
        //  it will auto handle return statement
        return GetHttpService.commonResponse( response, $rootScope.labels.common.message.INTERESTED_IN_SELLING );
      },
      function(reason) {
        GetHttpService.commonResponse(reason)
        return false;
      })
    };

    var requestedForHomeLoan = function (propertyId){ 
      return $http.put(
        GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/listing/' + propertyId + '/loan-request?loan=true'))
      .then(function(response) {
        //  it will auto handle return statement
        return GetHttpService.commonResponse( response, $rootScope.labels.common.message.HOME_LOAN );
      },
      function(reason) {
        GetHttpService.commonResponse(reason)
        return false;
      })
    };

		var getSimilarProperties = function (propertyId, callback){
			var url = GlobalService.getAPIURL('data/v1/recommendation?type=similar&propertyId=' + propertyId + '&limit=4');
			return $http.get(url).then(function(response) {
				if (response.status === 200) {
					if (callback) {
						callback(response.data.data);
						return;
					}
					return response.data.data;
				}
			});
		}

    var getPropertyDetail = function (propertyId, callback){
      var url = GlobalService.getAPIURL('data/v1/entity/property?selector={"filters":{"and":[{"equal":{"propertyId":' + propertyId + '}}]}}');
      return $http.get(url).then(function(response) {
        if (response.status === 200) {
          if (callback) {
            callback(response.data.data[0]);
          }
          return response.data.data[0];
        }
      });
    }

    return {
      getPropertyPriceTrend: getPropertyPriceTrend,
      getProperty : getProperty,
      saveProperty : saveProperty,
      deleteProperty: deleteProperty,
      updateProperty: updateProperty,
      requestedForHomeLoan : requestedForHomeLoan,
      sellProperty : sellProperty,
			getSimilarProperties : getSimilarProperties,
      getPropertyDetail : getPropertyDetail
    };

});
