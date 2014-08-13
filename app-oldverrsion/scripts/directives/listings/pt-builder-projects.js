angular.module('serviceApp').directive('ptBuilderProjects', function(){
	return {
		restrict: 'A',
		scope: {projects: '='},
		templateUrl: 'views/directives/listings/pt-builder-projects.html',
		controller: function($scope, $location, $cookies, $rootScope, GlobalService, CityService, GAService, UserService, SignupService, $window, FilterService, SellFormService, BuylinkService, TrackingService) {
        //project page event tracking
        $scope.projectCustomTracking = function(cat, action, value, mixpanelEvent, type, id, linkName){
			var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
			//Send GA/Mixpanel tracker event request when other links clicked 
			var subLabel = value+"-"+pageType;   
			//GA tracker
			$rootScope.TrackingService.sendGAEvent(cat, action, subLabel); 	 
			//mixpanel tracker				
			var obj = {}
			obj["Link Name"] = linkName;
			obj[type+" Id"] = id;
			obj["Card Type"] = "Builder Card";
			obj["Page Name"] = pageType;
			TrackingService.mixPanelTracking(mixpanelEvent,obj); 			  
			//End Ga/mixpanel   				
		} 
	  }
	};
});
