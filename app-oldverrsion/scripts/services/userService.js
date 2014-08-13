/**
   * Name: User Service
   * Description: It will get user data from server   
   * @author: [Nakul Moudgil]
   * Date: Oct 28, 2013
**/
'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .factory('UserService', function (GlobalService, $http, GridParser, Formatter, $cookies, RecentlyViewedParser, $q, NotificationService, $rootScope, $location) {
    //var url = '';
    var recentlyViewed = '';

    var setRecentlyViewed = function( projectId, propertyId ) {
      if ( !projectId ) {
        return;
      }
      if ( !propertyId ) {
        propertyId = 0;
      }
      var newCVal = projectId + ',' + propertyId;
      if ( $cookies.RECENTLY_VIEWED_2 ) {
        var rv = $cookies.RECENTLY_VIEWED_2.split( '-' );
        var rvIdx = rv.indexOf( newCVal );
        if ( rvIdx === -1 ) {
          rv.unshift( newCVal );
        }
        else {
          rv = [ newCVal ].concat( rv.slice( 0, rvIdx - 2 ) ).concat( rv.slice( rvIdx - 1 ) );
        }
        rv = rv.slice( 0, 20 );
        newCVal = rv.join( '-' );
      }
      GlobalService.setCookie( 'RECENTLY_VIEWED_2', newCVal );
    };

    var getRecentlyViewed = function (reqColumns,pagelimit){
      var typeIds = [];
      if ($cookies.RECENTLY_VIEWED_2) {
        recentlyViewed = _.map($cookies.RECENTLY_VIEWED_2.split('-'), function (val) {
          val = val.split(',');
          typeIds[val[0]] = val[1];
          return val[0];
        }).filter(function (val) {
          return val.toString().trim();
        });
      }
      // else {
      //     var recentlyViewed = ["140850", "140512", "140792"];
      //     var typeIds = {"140850":"0", "140512":"51365", "140792":"0"};
      // }
      if (recentlyViewed) {
        var url = 'data/v1/entity/project?selector={"filters":{"and":[{"equal":{"projectId":['+recentlyViewed.join(',')+']}}]},"fields":["projectId","localityId","name","builder","address","URL","minPrice","maxPrice","minPricePerUnitArea","maxPricePerUnitArea"]}';
        return $http.get(GlobalService.getAPIURL(url))
        .then(function(response){
          var data = RecentlyViewedParser.parse(response.data.data, recentlyViewed,pagelimit);
          data = _.map(data, function (val) {
            if (typeIds[val.projectId]) {
              val.typeId = typeIds[val.projectId];
            }
            else {
              val.typeId = 0;
            }
            return val;
          });
          if(reqColumns){
           return GridParser.parse(reqColumns, data);
		 }
          else{
           return data; 
	     }
        });
      }
      else {
        var deferred = $q.defer();        
        deferred.resolve( [] ); //  return an empty array !!
        return deferred.promise;
      }
    };
    var getSavedSearches = function (reqColumns) {
      return $http.get(GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/saved-searches'))
      .then(function(response){
        $.each( response.data.data, function( index, attr ) {
          response.data.data[ index ].searchText = Formatter.getSearchText( attr.searchQuery );
          response.data.data[ index ].url = attr.searchQuery;
        });
        return GridParser.parse(reqColumns, response.data.data);
      });
    };

    var delSavedSearch = function( id ) {
      var url = GlobalService.getAPIURL('data/v1/entity/user/{userId}/saved-searches/') + id;
      var config = {
        method: 'DELETE',
        url: url
      };
      return $http(config).
       then(function(response){
        if(response){
        $.each( response.data.data, function( index, attr ) {
          response.data.data[ index ].searchText = Formatter.getSearchText( attr.searchQuery );
          response.data.data[ index ].url = attr.searchQuery;
        });
          return response.data.data;
        }
      });
      return false;
    };

    var getEnquiredProperty = function (reqColumns) {
      return $http.get(GlobalService.getAPIURL('data/v1/entity/user/{userId}/enquired-property'))
      .then(function(response){
        $.each( response.data.data, function( index, attr ) {
          response.data.data[ index ].url = '/'+attr.projectUrl;
          response.data.data[ index ].name = 'Visit';
          if (attr.cityName && !attr.projectName) {
            response.data.data[ index ].url = attr.cityName.replace(' ', '-').toLowerCase() + '-real-estate';
            response.data.data[ index ].projectName = 'NA';
          }
        });
        return GridParser.parse(reqColumns, response.data.data);
      });
    };

    var userLogin = function( username, password ) {
      var obj = {
        eid : username.trim(),
        pwd : password
      };
      return $http({
        method : 'POST',
        url : GlobalService.getAPIURL( 'forum/userLogin.php' ),
        data : $.param( obj ),    //  url encode ( kind of )
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      })
      .then( function( data ) {
        return returnUserResp( data );
      });
    };

    var userRegister = function( name, email, phone, password, countryId ) {
      var obj = {
        uname : name.trim(),
        eid : email,
        pwd : password,
        cpwd: password,
        phn : phone,
        country : countryId
      };
      return $http({
        method : 'POST',
        url : GlobalService.getAPIURL( 'forum/register.php' ),
        data : $.param( obj ),    //  url encode ( kind of )
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      })
      .then( function( data ) {
        return returnUserResp( data );
      });
    };
    
    var resetPassword = function( femail ) {
      var obj = {
        feid : femail
      };

      return $http({
        method : 'POST',
        url : GlobalService.getAPIURL( 'forum/forgotpass.php' ),
        data : $.param( obj ),    //  url encode ( kind of )
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      })
      .then( function( data ) {
        return returnUserResp( data );
      });
    };

    var checkUser = function( id, email, name, provider, picture ) {
      var str = 'id=' + id + '&email=' + email + '&name=' + name + '&provider=' + provider + '&picture=' + picture;
      return $http.get( GlobalService.getAPIURL( 'forum/checkuser.php?' + str ) )
      .then( function( data ) {
        userInfo()
        .then( function( res ) {
          return returnUserResp( res );
        });
      });
    };

    var returnUserResp = function( data ) {
      var retval = '';
        if ( data.status === 200 ) {
          if ( typeof data.data === 'string' ) {
            retval = data.data.trim();
          }
          else {
            retval = data.data;
          }
        }
        else {
          retval = false;
        }
        return retval;
    };

    var makeUserCookie = function( userInfo ) {
      var str = "";
      $.each( userInfo, function( key, val ) {
        str += '@@@@' + key + '####' + val;
      });
      return str;
    };

    var getUserCookie = function( str ) {
      if ( !str ) {
        str = GlobalService.getCookie( 'PT_USER_INFO' );
      }
      var cook = {};
      if ( str && typeof str === 'string' ) {
        var bSplit = str.split( '@@@@' );
        if ( bSplit.length > 0 ) {
          for( var cnt = 0; cnt < bSplit.length; cnt++ ) {
            var sSplit = bSplit[ cnt ].split( '####' );
            if ( sSplit.length === 2 ) {
              cook[ sSplit[0] ] = sSplit[1];
            }
          }
        }
      }
      return cook;
    };

    var userInfo = function() {
      //return $http.get( '/who-am-i.php' )
      return $http.get( GlobalService.getAPIURL( 'who-am-i.php' ) )
      .then( function( data ) {
        var resp = null;
        if ( data.status === 200 ) {
          var userInfo = data.data;
          if ( userInfo && userInfo !== 'User not logged in!' && userInfo.USERNAME ) {
            var msg = 'Hi ' + userInfo.USERNAME + '! You have logged in successfully.';
            $rootScope.$broadcast('userLoggedIn');
            NotificationService.setNotification({
              msg : msg,
              type: 'info'
            });
            if ( userInfo ) {
              GlobalService.setCookie( 'PT_USER_INFO', makeUserCookie( userInfo ) );
            }
            resp = returnUserResp( userInfo );
          }
        }
        if ( $rootScope.redirectUrl ) {
          var __tUrl = $rootScope.redirectUrl;
          $rootScope.redirectUrl = '';
          $location.path( __tUrl );
        }
        return resp;
      });
    };
    
    //Check user register with us or not by email address
    var isRegister = function( email ) {
      var str = 'email=' + email;        
      return $http({
        method: 'GET',
        url: GlobalService.getAPIURL('data/v1/registered?' + str)
      }).then(function(response) {     
        if (response.status === 200) {
          //  200OK
          return response.data.data;
        }
      });
    };

    return {
      userLogin           : userLogin,
      userRegister        : userRegister,
      resetPassword       : resetPassword,
      userInfo            : userInfo,
      checkUser           : checkUser,
      getRecentlyViewed   : getRecentlyViewed,
      setRecentlyViewed   : setRecentlyViewed,
      getSavedSearches    : getSavedSearches,
      delSavedSearch      : delSavedSearch,
      getEnquiredProperty : getEnquiredProperty,
      getUserCookie       : getUserCookie,
      isRegister		  :	isRegister	
    };
});
