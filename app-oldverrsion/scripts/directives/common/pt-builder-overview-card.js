
'use strict';
angular.module('serviceApp').directive('ptBuilderOverviewCard',function(){
	return {
		restrict: 'A',
		templateUrl: 'views/directives/common/pt-builder-overview-card.html',
        scope: {
            card : '=',
            hideLink: '=?',
			largeLength: '=?',
            descModal: '=?'
        },
        controller: function($scope, $rootScope) {
	    $scope.$watch(function () {
		if ($rootScope.urlData) {
		    return $rootScope.urlData.pageType;
		} else {
		    return '';
		}
	    }, function (n, o) {
		$scope.pageType = $rootScope.urlData.pageType;
	    });
        //project page event tracking
        $scope.projectCustomTracking = function(cat, action, value, mixpanelEvent, type, id, linkName){
			//Send GA/Mixpanel tracker event request when other links clicked 
			var subLabel = value+"-"+$scope.pageType;
			//GA tracker
			$rootScope.TrackingService.sendGAEvent(cat, action, subLabel);
			//mixpanel tracker		
			var obj = {};
			obj["Link Name"] = linkName;
			obj[type+" Id"] = id;
			obj["Card Type"] = 'Builder Card';
			obj["Page Name"] = $scope.pageType;
			$rootScope.TrackingService.mixPanelTracking(mixpanelEvent,obj);
			//End Ga/mixpanel
		} 
	  }

	}
});
