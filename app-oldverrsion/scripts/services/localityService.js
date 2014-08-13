/**
   * Name: Locality Service
   * Description: It will get localities from server   
   * @author: [Nakul Moudgil, Hardeep Singh]
   * Date: Sep 30, 2013
**/

'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {        
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .factory('LocalityService', function(LocalityParser, GlobalService, $http, GetHttpService, $q, $rootScope, Formatter) {      
    var activeRequest;

    var getLocalities = function (city, text){
      var url = GlobalService.getAPIURL('app/v1/typeahead?typeAheadType=LOCALITY&query=' + text);
      if(city){
        url = GlobalService.getAPIURL('app/v1/typeahead?typeAheadType=LOCALITY&query=' + text +'&city=' + city);
      }
      return GlobalService.callApiAndRespond( url );
    };

    var getPopularLocalities = function ( id, type, getOnlyUrl ) {
      // type can be 'city' or 'suburb'
      var url;
      if (type === 'city') {
        url = 'data/v1/entity/locality/top?cityId=' + id.toString() + '&selector={"fields":["localityId","label","url"]}';
      }
      else if (type === 'suburb') {
        url = 'data/v1/entity/locality/top?suburbId=' + id.toString();
      }
      if ( getOnlyUrl ) {
        return url;
      }
      return GlobalService.callApiAndRespond( url );
    };

    var getLocalityList =   function(url, callback){
        var baseUrl =   'app/v1/locality?selector=';
        //if any active request exists the abort it and start a new one
        if(activeRequest) {
          activeRequest.resolve();
        }

        activeRequest   =   $q.defer();
        return  $http({
            method  :   'GET',
            url     :   GlobalService.getAPIURL(baseUrl+url),
            timeout :   activeRequest.promise   })
        .success(function(response){
            var checkZeroResult = false;
            GetHttpService.commonResponseData( response, '', checkZeroResult );
              if(callback && response.statusCode && response.statusCode.substring(0,1) === '2') {
                callback(response, 200);
              }
        }).error(function(response) {
            if (callback && response && (!response.statusCode || response.statusCode.substring(0,1) === '5'))  {
                callback(undefined, 500);
            }
        });
    };

    var getNeighbourhood    =   function(position,radius,type, callback) {
	  var optionalAppend = "";
	  if(type){
		   optionalAppend = '&amenityName='+type;
		}
	  var baseUrl = 'app/v1/amenity?latitude='+position.lat+'&longitude='+position.lng+'&distance='+radius+optionalAppend+'&start=0&rows=999';
	  $http({
            method : 'GET',
            url    : GlobalService.getAPIURL( baseUrl )
        }).then( function( response ) {
			GetHttpService.commonResponse(response, '');
            if ( response.status === 200 ) {
                callback(response.data.data);
            }
            else {
                return null;
            }
        });
    };
    
    var getTopLocality = function( type, id, start, row, getOnlyUrl ){
      if ( !start ) {
        start = 0;
      }
      if ( !row ) {
        row = 9999; //  too large to get all elements
      }
      var baseUrl = 'data/v1/entity/locality/top-rated?'+type+'Id='+id+'&selector={"fields":["label","url","numberOfUsersByRating","averageRating","ratingsCount","numberOfUserRating"],"paging":{"start":' + start + ',"rows":' + row + '}}';
      if ( getOnlyUrl ) {
        return baseUrl;
      }
      return $http({
        method : 'GET',
        url    : GlobalService.getAPIURL( baseUrl )
      }).then( function( response ) {
        GetHttpService.commonResponse(response, '');
        if ( response.status === 200 ) {
          return response.data.data;
        }
        else {
          return null;
        }
      });
    };

    var postLocalityRating = function (localityId, ratingsHash, callback) {
      var baseUrl = '';
      if ( GlobalService.isLoggedIn() ) {
        baseUrl = 'data/v1/entity/user/locality/' + localityId + '/rating';
      }
      else {
        //  save to cookie
        return null;
        baseUrl = 'data/v1/entity/locality/' + localityId + '/rating';
      }

      $http({
        method: 'POST',
        url: GlobalService.getAPIURL( baseUrl ),
        data: ratingsHash
      }).then( function (response) {
        GetHttpService.commonResponse(response, '');
        if ( response.status === 200 && response.data.statusCode == '2XX' ) {
          //ga event
          $rootScope.TrackingService.sendGAEvent("rating", "submit", "locality-"+$rootScope.CURRENT_ACTIVE_PAGE); 
          //mixpanel tracker
          $rootScope.TrackingService.mixPanelTracking("Locality Rating Submitted",{"Rating":ratingsHash.overallRating,"Page Name":$rootScope.CURRENT_ACTIVE_PAGE}); 
          callback(response.data.data);
        }
        else {
          return null;
        }
      });
    };

    var getLeadFormList = function (cityId) {
      // gets all localities and suburbs of a given city id
      var baseUrl='app/v1/locality?selector={"filters":{"and":[{"equal":{"cityId":'+cityId+'}}]},"fields":["id","localityId","suburb","label"],"paging":{"start":"0","rows":"500"}}';
    
      if(activeRequest){
        activeRequest.resolve();
      }

      activeRequest   =   $q.defer();
      return  $http({
        method  :   'GET',
        cache   :   true,
        url     :   GlobalService.getAPIURL(baseUrl),
        timeout :   activeRequest.promise
      })
      .then(function(response){
        GetHttpService.commonResponse( response, '' );
        if ( response.status === 200 ) {
          //  200OK
          return LocalityParser.parseLeadFormData(response.data);
        }
      });
    };

    var getCirleRadius = function(localityId, callback){
      var baseUrl = 'data/v1/entity/locality/'+localityId.join(',')+'/radius';
      $http({
          method : 'GET',
          url    : GlobalService.getAPIURL( baseUrl ),
      }).then( function( response ) {
          GetHttpService.commonResponse( response, '' );
          if ( response.status === 200 ) {
              callback(response.data);
          }
          else {
              return null;
          }
      });
    };

    var getLocality = function (localityId) {
      localityId = parseInt( localityId );
      var baseUrl = 'app/v1/locality/' + localityId;
      return GlobalService.callApiAndRespond( baseUrl );
    };

    var getLocalityById = function(localityId, callback){
	var baseUrl = 'app/v1/locality?selector={"filters":{"and":[{"equal":{"localityId":'+localityId+'}}]}}';
	return $http({
	    cache : true,
            method : 'GET',
            url    : GlobalService.getAPIURL( baseUrl )
	}).then( function( response ) {
            GetHttpService.commonResponse( response, '' );
            if ( response.status === 200 ) {
              return callback(response.data.data);
            }
            else {
		return callback(null);
            }
	});
    };

    var getNearbyLocality = function( localityLatitude, localityLongitude, distance, start, row, getOnlyUrl ) {
      if ( !row ) {
        row = 5;
      }
      if ( !start && start !== 0 ) {
        start = 0;
      }
      if ( !distance ) {
        distance = 9999;
      }
      var baseUrl = 'data/v1/entity/locality?selector={"filters":{"and":[{"geoDistance":{"geo":{"distance":' + distance + ',"lat":' + localityLatitude + ',"lon":' + localityLongitude + '}}}]},"fields":["localityId","label","geoDistance","avgPricePerUnitArea","overviewUrl","url"],"sort":[{"field":"geoDistance","sortOrder":"ASC"}],"paging":{"start":' + start + ',"rows":' + row + '}}';
      if ( getOnlyUrl ) {
        return baseUrl;
      }
      return GlobalService.callApiAndRespond( baseUrl );
    };

    var getLocalityComparission = function( locIdArr, dominantType, getOnlyUrl ) {
      var arr = [];
      for( var __c = 0; __c < locIdArr.length; __c++ ) {
        arr.push( 'localityId==' + locIdArr[ __c ] );
      }
      var filter = 'filters=(' + arr.join( ',' ) + ')';
      if ( dominantType ) {
        filter += ';unitType==' + dominantType;
      }
      var baseUrl = 'data/v1/trend/current?' + filter + '&fields=wavgPricePerUnitAreaOnSupply,localityName&group=localityId';
      if ( getOnlyUrl ) {
        return baseUrl;
      }
      return GlobalService.callApiAndRespond( baseUrl );
    };

    var getProjectCountData = function( fieldType, id ) {
      var baseUrl = 'data/v1/trend?filters=' + fieldType + '==' + id + '&fields=countDistinctProjectId&group=constructionStatus';
      return GlobalService.callApiAndRespond( baseUrl );
    };

    var getProjectCountBySize = function( fieldType, id, intervalString, getOnlyUrl ) {
      if ( !intervalString ) {
        intervalString = '1000,2000,3000,4000,5000';
      }
      var baseUrl = 'data/v1/price-trend/current?filters=' + fieldType + '==' + id + '&fields=countDistinctProjectId&group=cityId&rangeField=pricePerUnitArea&rangeValue=' + intervalString;
      if ( getOnlyUrl ) {
        return baseUrl;
      }
      return GlobalService.callApiAndRespond( baseUrl );
    };

    var getPriceByBed = function( fieldType, fieldId, getOnlyUrl ) {
      var baseUrl = 'data/v1/trend/current?filters=' + fieldType + '==' + fieldId + '&fields=avgBudget,minBudget,maxBudget&group=bedrooms';
      if ( getOnlyUrl ) {
        return baseUrl;
      }
      return GlobalService.callApiAndRespond( baseUrl );
    };

    var getHithertoPriceTrend = function( locationTypeId, id, getOnlyUrl, monthDuration ) {
      var baseUrl;
        if (monthDuration) {
            baseUrl = 'data/v1/price-trend/hitherto?filters=' + locationTypeId + '==' + id + '&fields=wavgPricePerUnitAreaOnSupply&group=month&monthDuration=' + monthDuration;
        } else {
            baseUrl = 'data/v1/price-trend/hitherto?filters=' + locationTypeId + '==' + id + '&fields=wavgPricePerUnitAreaOnSupply&group=month';
        }

      if ( getOnlyUrl ) {
        return baseUrl;
      }
      return GlobalService.callApiAndRespond( baseUrl );
    };

    var getDominantPriceTrend = function( locationTypeId, id, unitType, getOnlyUrl, monthDuration ) {
      var baseUrl;
      if ( unitType ) {
        baseUrl = 'data/v1/trend/hitherto?filters=' + locationTypeId + '==' + id + ';unitType==' + unitType + '&fields=wavgPricePerUnitAreaOnSupply&group=month';
          if (monthDuration) {
              baseUrl += '&monthDuration=' + monthDuration;
          }
      }
      else {
        baseUrl = getHithertoPriceTrend( locationTypeId, id, true, monthDuration );
      }
      if ( getOnlyUrl ) {
        return baseUrl;
      }
      return GlobalService.callApiAndRespond( baseUrl );
    };

    var getAllLocality = function( type, id, start, row ) {
      if ( !start ) {
        start = 0;
      }
      if ( !row ) {
        row = 9999; //  too large to get all elements
      }
      // var baseUrl = 'data/v1/entity/locality?selector={"filters":{"and":[{"equal":{"' + type + 'Id":' + id + '}}]},"fields":["localityId","label","url","averageRating","ratingsCount","numberOfUsersByRating"],"paging":{"start":' + start + ',"rows":' + row + '}}'
      var baseUrl = 'data/v1/entity/locality?selector={"filters":{"and":[{"equal":{"' + type + 'Id":' + id + '}}]},"fields":["localityId","label","url"],"paging":{"start":' + start + ',"rows":' + row + '}}'
      return GlobalService.callApiAndRespond( baseUrl );
    };

    var getRatingOnly = function( localityId ) {
      var baseUrl = 'app/v1/locality/' + localityId + '?selector={"fields":["averageRating","ratingsCount","avgRatingsByCategory","overallRating","location","safety","pubTrans","restShop","numberOfUsersByRating"]}';
      return $http({
          method : 'GET',
          url    : GlobalService.getAPIURL( baseUrl )
        }).then( function( response ) {
            GetHttpService.commonResponse( response, '' );
            if ( response.status === 200 ) {
                return response.data.data;
            }
            else {
                return null;
            }
        });
    };

    var getUserRating = function(localityId) {
        var baseUrl = 'data/v1/entity/user/locality/' + localityId + '/rating';
        return $http({
          method : 'GET',
          url    : GlobalService.getAPIURL( baseUrl )
        }).then( function( response ) {
            GetHttpService.commonResponse( response, '' );
            if ( response.status === 200 ) {
                return response.data.data;
            }
            else {
                return null;
            }
        });
        // return GlobalService.callApiAndRespond( baseUrl );
    };

    return {
      getLocalities         :   getLocalities,
      getAllLocality        :   getAllLocality,
      getLocalityList       :   getLocalityList,
      getNeighbourhood      :   getNeighbourhood,
      getLeadFormList       :   getLeadFormList,
      getCirleRadius        :   getCirleRadius,
      getLocalityById       :   getLocalityById,
      getTopLocality        :   getTopLocality,
      getLocality           :   getLocality,
      postLocalityRating    :   postLocalityRating,
      getLocalityComparission : getLocalityComparission,
      getPriceByBed         :   getPriceByBed,
      getRatingOnly         :   getRatingOnly,
      getProjectCountBySize :   getProjectCountBySize,
      getHithertoPriceTrend :   getHithertoPriceTrend,
      getDominantPriceTrend :   getDominantPriceTrend,
      getNearbyLocality     :   getNearbyLocality,
      getProjectCountData   :   getProjectCountData,
      getPopularLocalities  :   getPopularLocalities,
      getUserRating         :   getUserRating
    };
});
