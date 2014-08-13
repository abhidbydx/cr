/**
   * Name: Global Service
   * Description: This service has the global variables which are used across application   
   * @author: [Nakul Moudgil]
   * Date: Oct 21, 2013
**/
'use strict';
angular.module('serviceApp')
  .factory('GlobalService', ['$location','$cookies', '$http', 'GetHttpService',  function ($location, $cookies, $http, GetHttpService) {
    var getHost = function(){
      return '/';
      //return '192.168.1.113:8080/';
    };

    var getUserId = function(){
      if ( typeof $cookies.FORUM_USER_ID !== 'undefined' && parseInt( $cookies.FORUM_USER_ID ) > 0 ) {
        return $cookies.FORUM_USER_ID;
      }
      else if($location.$$search.userId){
        return $location.$$search.userId;
      }
      else{
        // return 57594;
      }
    };

    var isLoggedIn = function() {
      //  wrapper function over UserId so that if we have to change the logic of
      //  isUserLoggedIn? then we'll modify this function leaving getUserId unaltered
      var userId = getUserId(), loggedIn = false;
      if ( userId ) {
        loggedIn = true;
      }
      return loggedIn;
    };

    var getAPIURL = function(Url){      
      if(Url.indexOf('{userId}') > -1){
        Url = Url.replace('{userId}', getUserId());
      }
      //var url = $location.$$protocol + '://' + getHost() + Url;
      var url = getHost() + Url;
      return url;
    };

    var getObjectValuebyString = function(o, s) {
      s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      s = s.replace(/^\./, '');           // strip a leading dot
      var a = s.split('.');
      while (a.length) {
          var n = a.shift();
          if (n in o) {
              o = o[n];
          } else {
              return;
          }
      }
      return o;
    };

    var getHomeCity = function() {
      if ( $cookies.HOME_CITY ) {
        var city = $cookies.HOME_CITY.split(','),
            homeCity = {};
        if ( city.length === 2 ) {
          homeCity = {
            id : city[0],
            label : city[1]
          };
        }
        return homeCity;
      }
    };

    var setHomeCity = function(id, label) {
      setCookie('HOME_CITY', id + ',' + label);
    };

    var setCookie = function( name, value ) {
      if ( name ) {
        $cookies[ name ] = value;
      }
    };

    var getCookie = function( name ) {
      var retVal = null;
      if ( $cookies[ name ] ) {
        retVal = $cookies[ name ];
      }
      return retVal;
    };

    var callApiAndRespond = function( baseUrl, fullData ) {
      return $http({
        cache  : true,
        method : 'GET',
        url    : getAPIURL( baseUrl ),
      })
      .then( function( response ) {
        GetHttpService.commonResponse( response, '' );
        if ( response.status === 200 ) {
          if ( fullData ) {
            return response.data;
          }
          return response.data.data;
        }
        else {
          return null;
        }
      });
    };

    var makeCompositeCall = function( arr ) {
      var retVal = false;
      if ( typeof arr === 'object' && arr.length ) {
        for( var count = 0; count < arr.length; count++ ) {
          //  to escape & and other special characters
          arr[ count ] = encodeURIComponent( arr[ count ] );
        }
        var str = arr.join( '&api=' );
        var baseUrl = 'app/v1/composite?api=' + str;
        retVal = callApiAndRespond( baseUrl );
      }
      return retVal;
    };

    var __getNearbyLocality = function( id ) {
      return 'data/v1/entity/locality/' + id + '/top-rated?selector={"fields":["localityId","label","url","overviewUrl","averageRating","priority","geoDistance"]}';
    };

    var __getTopRatedLocality = function( id, type ) {
      if ( type === 'locality' ) {
        return 'data/v1/entity/locality/' + id + '/top-rated?selector={"fields":["localityId","label","url","averageRating","numberOfUsersByRating","ratingsCount"]}'
      }
      return 'data/v1/entity/locality/top-rated?' + type + 'Id=' + id + '&selector={"fields":["localityId","label","url","averageRating","numberOfUsersByRating","ratingsCount"]}';
    };

    var __getPopularLocality = function( id, type ) {
      return 'data/v1/entity/locality/popular?' + type + 'Id=' + id + '&selector={"fields":["localityId","label","url"]}';
    };

    var __getHighestReturnLocality = function( id, type ) {
      return 'data/v1/entity/locality/highest-return?locationType=' + type + '&locationId=' + id + '&selector={"fields":["localityId","label","url","avgPriceRisePercentage","avgPriceRiseMonths"]}';
    };

    var __getTopBuilder = function( id, type ) {
      return 'data/v1/entity/builder/top?selector={"filters":{"and":[{"equal":{"' + type + 'Id":["' + id + '"]}}]},"fields":["id","name","imageURL","url","priority"]}}';
    };

    var __getPopularProject = function( id, type ) {
      return 'data/v1/entity/project/popular?selector={"filters":{"and":[{"equal":{"' + type + 'Id":' + id + '}}]},"fields":["projectId","address","name","minPrice","maxPrice","imageURL","URL","builder","locality","label"]}';
    };

    var __getRecentDiscussProject = function( id, type ) {
      return 'data/v1/entity/project/recently-discussed?locationType=' + type + '&locationId=' + id + '&selector={"fields":["projectId","name","minPrice","maxPrice","imageURL","URL","totalProjectDiscussion","address","builder"]}';
    };

    var __getMostDiscussProject = function( id, type ) {
      return 'data/v1/entity/project/most-discussed?locationType=' + type + '&locationId=' + id + '&selector={"fields":["projectId","address","name","minPrice","maxPrice","imageURL","URL","totalProjectDiscussion","builder","locality","label"]}';
    };

    var __getHighestReturnProject = function( id, type ) {
      return 'data/v1/entity/project/highest-return?locationType=' + type + '&locationId=' + id + '&selector={"fields":["projectId","address","name","minPrice","maxPrice","imageURL","URL","locality","label","avgPriceRisePercentage","avgPriceRiseMonths"]}';
    };

    var getServiceUrl = function( name, id, type ) {
      if ( !name ) {
        return '';
      }
      name = name.trim().toLowerCase();
      var retVal = '';
      switch( name ) {
        case 'mostdiscussproject':
        case 'most discuss project':
        case 'most_discuss_project':
          retVal = __getMostDiscussProject( id, type );
          break;
        case 'recentdiscussproject':
        case 'recentlydiscussproject':
        case 'recent discuss project':
        case 'recently discuss project':
        case 'recent_discuss_project':
        case 'recently_discuss_project':
          retVal = __getRecentDiscussProject( id, type );
          break;
        case 'popularproject':
        case 'popular project':
        case 'popular_project':
          retVal = __getPopularProject( id, type );
          break;
        case 'popularlocality':
        case 'popular locality':
        case 'popular_locality':
          retVal = __getPopularLocality( id, type );
          break;
        case 'topratedlocality':
        case 'top rated locality':
        case 'top_rated_locality':
          retVal = __getTopRatedLocality( id, type );
          break;
        case 'nearbylocality':
        case 'nearby locality':
        case 'nearby_locality':
          retVal = __getNearbyLocality( id, type );
          break;
        case 'highreturnlocality':
        case 'high return locality':
        case 'high_return_locality':
          retVal = __getHighestReturnLocality( id, type );
          break
        case 'topbuilder':
        case 'top builder':
        case 'top_builder':
          retVal = __getTopBuilder( id, type );
          break;
        case 'highreturnproject':
        case 'high return project':
        case 'High Return Project':
          retVal = __getHighestReturnProject( id, type );
          break;
      }
      return retVal;
    };

    return {
      getHost : getHost,
      getAPIURL : getAPIURL,
      getUserId : getUserId,
      getObjectValuebyString : getObjectValuebyString,
      getHomeCity : getHomeCity,
      setHomeCity : setHomeCity,
      isLoggedIn : isLoggedIn,
      setCookie  : setCookie,
      getCookie  : getCookie,
      getServiceUrl : getServiceUrl,
      makeCompositeCall : makeCompositeCall,
      callApiAndRespond : callApiAndRespond
    };
}]);
