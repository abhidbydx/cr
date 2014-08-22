/**
   * Name: User Service
   * Description: It will get user data from server   
   * @author: [Abhishek]
**/
'use strict';
angular.module('intranetApp') .config(function ( $httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .factory('UserService', function ($http,  $cookies, $rootScope, $location) {
    //var url = '';
    
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
        str = getCookie( 'USER_INFO' );
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

    
    
    return {         
      getUserCookie       : getUserCookie, 
      makeUserCookie      : makeUserCookie,
      setCookie           : setCookie,
      getCookie           : getCookie     
    };
});
