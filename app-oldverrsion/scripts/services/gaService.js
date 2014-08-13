/**
   * Name: Google Analytics Service
   * Description: To fire GA events to track user activity
   * @author: [Swapnil Vaibhav]
   * Date: Dec 02, 2013
**/
'use strict';
angular.module('serviceApp') .config( function ( $httpProvider ) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
  .factory('GAService', [ '$location', function ( $location ) {
    var sendGAEvent = function ( category, action, label, value, non_int ) {
      label = category + '-' + label + '-' + 'PORTFOLIO'; 
      
      //console.log('event -- c:' + category + ', a:' + action + ', l:' + label + ', v:' + value + ', i:' + non_int);
      //*
      if(value !== undefined) {
        if(non_int !== undefined) {
          _gaq.push( [ '_trackEvent', category, action, label, value, non_int ] );
        } else {
          _gaq.push( [ '_trackEvent', category, action, label, value ] );
        }
      }
      else {
        _gaq.push( [ '_trackEvent', category, action, label ] );
      }
      //*/
    };
    return {
      sendGAEvent : sendGAEvent
    };
  }]);