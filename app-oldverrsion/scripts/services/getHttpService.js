/**
 * Name: Get HTTP Service
 * Description: It will act as a wrapper on all HTTP.get calls
 * @author: [Swapnil Vaibhav]
 * Date: Nov 06, 2013
**/
'use strict';
angular.module('serviceApp')
.factory('GetHttpService', function( NotificationService ) {
  var success = function( data, customMessage ) {
    var pushNoti = false, noti = {};
    if ( data.statusCode !== '2XX' ) {
      noti = {
        type: 'error',
        msg : 'Something went wrong !!'
      };
    }
    else {
      noti = {
        type: 'success',
        msg : ( typeof customMessage !== 'undefined' && customMessage.trim() !== '' ) ? customMessage : ''
      };
      if ( noti.msg !== '' ) {
        pushNoti = true;
      }
    }
    if ( pushNoti ) {
      NotificationService.setNotification( noti );
    }
  };

  var error = function( errorMessage ) {
    //  http call failed, server error etc
    var noti = {
      type: 'error',
      msg : ( typeof errorMessage !== 'undefined' && errorMessage.trim() !== '' ) ? errorMessage : 'Server call failed !!'
    };
    NotificationService.setNotification( noti );
  };

  var commonResponseData = function( response, successToShow, checkZeroResult ) {
    if(response.statusCode === '2XX')
    {
      if ( checkZeroResult ) {
        if ( response.totalCount === 0 ) {
          error( 'No data found for the filters applied, please update some filters for better results' );
        }
      }
      else {
        if ( typeof successToShow === 'undefined' || successToShow.trim() === '' ) {
          successToShow = '';
        }
        success( response, successToShow );
      }
      return true;
    } 
    else{
      //TODO we do not want to show error message in every case, please update this when you specifically want to show error message.
      //error( response.error.msg );
      return false;
    }
  };

  var commonResponse = function( response, successToShow, checkZeroResult ) {
    if ( response.status === 200 || response.status === 202 ) {
      if ( response.data && response.data.error ) {
        error( response.data.error.msg );
      }
      else {
        return commonResponseData( response.data, successToShow, checkZeroResult );
      }
    }
    else {
      error();
    }
  };

  return {
    commonResponse : commonResponse,
    commonResponseData : commonResponseData
  };
});
