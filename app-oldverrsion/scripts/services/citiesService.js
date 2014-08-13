/**
   * Name: City Service
   * Description: It will get cities from server   
   * @author: [Nakul Moudgil]
   * Date: Sep 27, 2013
**/
'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {        
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
    .factory('CityService', function ($resource, $http, GlobalService, GetHttpService, CityParser) {    
    var url = GlobalService.getAPIURL('data/v1/entity/city?selector={"sort":[{"field":"displayPriority","sortOrder":"ASC"},{"field":"displayOrder","sortOrder":"ASC"}],"paging":{"start":0,"rows":10000},"fields":["id","displayOrder","displayPriority","label","centerLatitude","centerLongitude","minZoomLevel","maxZoomLevel","amenities","latitude","longitude","localityAmenityTypes","name"]}');
    var headers = {
        'Content-Type' : 'application/x-www-form-urlencoded'
    };
    var cache = true;
    var cityData = $http({
        method: 'GET',
        url: url,
        cache: cache,
        headers:headers
    });
    var getMainCities = function (){ 
        var finalData = {
            data : ''
        };
        var API = {
            citiesData : function(){
                return cityData.then(function(data) {
                    finalData.data = CityParser.parse(data.data);
                    return finalData;
                });
            }
        };
        return API.citiesData();
    };

    var getBlogOrNews = function( cityId, from, count, news, callback) {
        if ( !from ) {
            from = 0;
        }
        if ( !count ) {
            count = 10;
        }
        if ( cityId ) {
            var baseUrl = 'data/v1/entity/city/' + cityId + '/blog?selector={"paging":{"start":0,"rows":' + count + '}}';
            if ( news === 1 ) {
                baseUrl = 'data/v1/entity/city/' + cityId + '/news?selector={"paging":{"start":0,"rows":' + count + '}}';
            }
            return $http({
                method : 'GET',
                cache : true,
                url    : GlobalService.getAPIURL( baseUrl )
            }).then( function( response ) {
                GetHttpService.commonResponse( response, '' );
                if ( response.status === 200 ) {
                    //  200OK
                    if (callback) {
                        callback(response.data.data);
                    }else{
                        return response.data;    
                    }
                }
            });
        }
        else {

        }
    };


    var getCountry = function() {
        return $http({
            method : 'GET',
            cache  : cache,
            url    : '/ajax/selectCountryDropDown.php?type=json'
        })
        .then( function( data ) {
            return CityParser.parseCountry( data.data );
        });
    };

    var getDemand = function( cityId, getOnlyUrl ) {
        var baseUrl = 'data/v1/trend/hitherto?filters=cityId==' + cityId + '&monthDuration=3&fields=sumCustomerDemand,localityName&group=localityId';
        if ( getOnlyUrl ) {
            return baseUrl;
        }
        return GlobalService.callApiAndRespond( baseUrl );
    };

    var getSuburbLocality = function( id ) {
        return getLocality( id, 'suburb' );
    };

    var getLocality = function( id, type, getOnlyUrl ) {
        var baseUrl = 'data/v1/entity/locality?selector={"filters":{"and":[{"equal":{"' + type + 'Id":["' + id + '"]}}]},"fields":["localityId","label","url"],"paging":{"start":0,"rows":5}}';
        if ( getOnlyUrl ) {
            return baseUrl;
        }
        return GlobalService.callApiAndRespond( baseUrl );
    };

    var getPopularSuburbs = function ( cityid, getOnlyUrl ) {
      var url = 'data/v1/entity/suburb?selector={"filters":{"and":[{"equal":{"cityId":' + cityid.toString() + '}}]},"fields":["id","label","url"]}';
      if ( getOnlyUrl ) {
        return url;
      }
      return GlobalService.callApiAndRespond( url );
    };

    var getReview = function( id, type, start, row ) {
        if ( !id || !type ) {
            return false;
        }
        if ( !start && start !== 0 ) {
            start = 0
        }
        if ( !row ) {
            row = 4
        }
        var baseUrl = 'data/v1/entity/' + type + '/' + id + '/locality-review?start=' + start + '&rows=' + row;
        return GlobalService.callApiAndRespond( baseUrl, true );
    };

    var getCitiesForHomePage = function(){
         var url = GlobalService.getAPIURL('data/v1/entity/city?selector={"sort":[{"field":"displayPriority","sortOrder":"ASC"},{"field":"displayOrder","sortOrder":"ASC"}],"paging":{"start":0,"rows":10000},"fields":["label"]}');
            return $http.get(url).then(function(response) {
               if (response.status === 200) {
                    return response.data;
               }
         });
    };

    return {
        getMainCities : getMainCities,
        getLocality: getLocality,
        getPopularSuburbs : getPopularSuburbs,
        getSuburbLocality : getSuburbLocality,
        citiesData : cityData,
        getBlogOrNews : getBlogOrNews,
        getCountry : getCountry,
        getReview  : getReview,
        getDemand  : getDemand,
        getCitiesForHomePage : getCitiesForHomePage
    };
});
