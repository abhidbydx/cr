/**
  * Name: Explore Neighborhood Directive
  * Description: Neighborhood widgit.
  * @author: [Swapnil Vaibhav]
  * Date: Jan 08, 2014
***/
'use strict';
angular.module('serviceApp').directive('ptNeighborhood', ['neighborhoodMapService', function(neighborhoodMapService) {
    return {
      restrict : 'A',
      scope: { 
        neighbor   : '=',
        mapurl     : '=',
        url        : '=',
        data       : '=',
        marker     : '=',
        markerType : '@',
        direction  : '='
      },
      templateUrl : 'views/directives/common/pt-neighborhood.html',
      controller : function( $scope, $rootScope ) {
		//GA/MIXPANEL - On clicking "SEARCH ON MAP" button
		$scope.tracking = function(){			
			$rootScope.TrackingService.sendGAEvent('searchMap', 'clicked', '-'+$rootScope.CURRENT_ACTIVE_PAGE); 
			$rootScope.TrackingService.mixPanelTracking('Search on Map Clicked', {'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});			 
			//End mixpanel
		}		
        if ( $scope.neighbor && _.keys( $scope.neighbor ).length ) {
          $scope.showNeighbor = true;
        }

        $scope.openNeighborhoodMapModal = neighborhoodMapService.openNeighborhoodMapModal;
      }
    };
}]);
