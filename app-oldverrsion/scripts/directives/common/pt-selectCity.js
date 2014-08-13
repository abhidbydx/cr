'use strict';
angular.module('serviceApp').directive('ptSelectCity', function() {
  return {
    restrict : 'A',
    scope   :   {
        'selectedCity'  :   '='
    },
    templateUrl : '',
    controller : function($scope, $rootScope, $modal, $location) {

        $modal.open({
				backdrop: 'static',
				keyboard: false,
                templateUrl: 'views/modal/pt-select-city.html',
                controller: function($scope, $modalInstance, $location){
				var modalOpened = true;
				$scope.setSelected   =   function(city){
					$location.path("/maps/"+city.label.toLowerCase()+"-real-estate");                        
					//Send GA/Mixpanel tracker event request from City of Interest Box
					var cityObj = {}, pageType = $rootScope.CURRENT_ACTIVE_PAGE; 
					cityObj['Çity Name'] = city.label
					cityObj['Page Name'] = 'map-home';						
					//GA tracker
					$rootScope.TrackingService.sendGAEvent('exploreBox', 'changed', city.label+"-"+pageType); 	 
					//mixpanel tracker
					$rootScope.TrackingService.mixPanelTracking('Explore Box', cityObj); 
					//End Ga/mixpanel    
				};

				//This code is creating error in console. not breaking anything, but need to be cleared, may be due to synchronization issues
				$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
					if(toState.name != "maps" && modalOpened){

						$modalInstance.close($modalInstance);
						$rootScope.showCitiesModal = false;
						modalOpened =false;
					}
				});
			}
        });
    }
  }  
});
