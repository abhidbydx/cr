'use strict';
angular.module('serviceApp').directive('ptLocalityOverlay',function(){
	return {
		restrict: 'A',
		scope: { card: '=' },
		templateUrl: 'views/directives/common/pt-locality-overlay.html',
		controller: function($scope, $rootScope) {
			$scope.isEmpty = _.isEmpty;
			$scope.$on( 'ratingChanged', function( evt, data ) {
				$scope.card.ratings.averageRating = data.averageRating;
				$scope.card.ratings.ratingsCount  = data.ratingsCount;
				$scope.card.averageRating = data.averageRating;
			});
			//project page event tracking
			$scope.projectCustomTracking = function(cat, action, value, mixpanelEvent, type, id, linkName){
				var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
				//Send GA/Mixpanel tracker event request when other links clicked 
				var subLabel = value+"-"+pageType;
				//GA tracker
				$rootScope.TrackingService.sendGAEvent(cat, action, subLabel);
				//mixpanel tracker
				var obj = new Object();
				obj["Link Name"] = linkName;
				obj[type+" Id"] = id;
				obj["Card Type"] = 'Locality Card';
				obj["Page Name"] = pageType;
				$rootScope.TrackingService.mixPanelTracking(mixpanelEvent,obj);
				//End Ga/mixpanel
			}
		}
	}
});
