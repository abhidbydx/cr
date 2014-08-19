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
      return $http.get( 'who-am-i.php')
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
               setCookie( 'PT_USER_INFO', makeUserCookie( userInfo ) );
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
    
    
    return {      
      userInfo            : userInfo,      
      getUserCookie       : getUserCookie, 
      makeUserCookie      : makeUserCookie,
      setCookie           : setCookie,
      getCookie           : getCookie     
    };
});
