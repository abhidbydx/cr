/**
  * Name: ptBreadcrum Directive
  * Description: pt-breadcrum is common breadcrum of the application 
  * @author: [Swapnil Vaibhav]
  * Date: Jan 02, 2014
***/
'use strict';
angular.module('serviceApp').directive('ptBreadcrum', ['Formatter', '$rootScope', function(Formatter, $rootScope){
  return {
    restrict : 'A',
    templateUrl : 'views/directives/common/pt-breadcrum.html',
    replace : true,
    scope : {
      seoData : '=',
      bCrum : '=',
      bCrumText : '=',
      lastUpdate : '='
    },
    controller : function( $scope, Formatter, $rootScope ) {
      $scope.$watch('lastUpdate', function( newVal, oldVal ) {
        if ( typeof $scope.bCrum === 'object' ) {
          $.each( $scope.bCrum, function( idx, obj ) {
            if ( obj.text === 'Home' ) {
              $scope.bCrum[ idx ].target = '_self';
            }
          });
        }
        if ( newVal ) {
          if ( parseInt( newVal ) ) {
            $scope.lastUpdateToDisplay = Formatter.epochToISTMonth( newVal, true );
          }
          else {
            $scope.lastUpdateToDisplay = newVal;
          }
        }
      });
      
      //GA-MIXPANEL - On Clicking Breadcrumb Link
      $scope.tracking = function ( text ){     
      $rootScope.TrackingService.sendGAEvent('breadcrumb', 'clicked', text+'-'+$rootScope.CURRENT_ACTIVE_PAGE); 
      $rootScope.TrackingService.mixPanelTracking('Breadcrumb Clicked', {'Breadcrumb Name': text, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});       
    };
    }
  }  
}]);
