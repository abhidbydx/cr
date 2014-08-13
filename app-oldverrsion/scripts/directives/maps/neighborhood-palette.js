/**
   * Name: neighborhood-palette
   * Description: Neighborhood Palette
   * @author: [Yugal Jindle]
   * Date: Apr 14, 2014
**/

'use strict';

angular.module('serviceApp').directive('neighborhoodPalette', ['LocalityService','$rootScope',function(LocalityService,$rootScope) {
    return {
        restrict: 'EAC',
        scope: {
			radius : "=",
            data   : "=",
            activate  : '&',
            deactivate: '&'
             },
        templateUrl : 'views/directives/maps/neighborhood-palette.html',
        link: function(scope) {
			scope.places = {
                nearby: [
                    {key: 'school', displayText: 'School', iconKey: 'school'},
                    {key: 'restaurant', displayText: 'Restaurant', iconKey: 'restaurant'},
                    {key: 'hospital', displayText: 'Hospital', iconKey: 'hospital'},
                    {key: 'gas_station', displayText: 'Petrol Pump', iconKey: 'petrol-station'},
                    {key: 'bank', displayText: 'Atm/Banks', iconKey: 'bank'}
                ],
                connectivity: [
                    {key: 'bus_station', displayText: 'Bus Stop', iconKey: 'bus-stop'},
                    {key: 'train_station', displayText: 'Train Station', iconKey: 'train-station'},
                    {key: 'airport', displayText: 'Airport', iconKey: 'airport'}
                ]
            };
            
            scope.activeKey = "school";
            scope.action = function(key,type) {
                if(scope.activeKey !== undefined) {
                    scope.deactivate({'key': scope.activeKey});
                }
                if(scope.activeKey !== key) {
                    scope.activate({'key': key});
                    scope.activeKey = key;
                } else {
                    scope.activeKey = undefined;
                }
				var obj = {};
				obj["Project "+type+" Name"] = key;
				obj["Project Id"] = (scope.data.projectId) ? scope.data.projectId : undefined;
				obj["Page Name"] = $rootScope.CURRENT_ACTIVE_PAGE;
				$rootScope.TrackingService.sendGAEvent("popup", "clicked", "Project"+type+"-"+key+"-"+$rootScope.CURRENT_ACTIVE_PAGE); 
				$rootScope.TrackingService.mixPanelTracking("Project "+type+" Clicked",obj);	
				
            };
            scope.neighbourhoodItems   =   function(r,p) {
	            var dataNew = "";
	            var neighbourhoodValue = {
		               'school':0,
		               'restaurant':0,
		               'hospital':0,
		               'gas_station':0,
		               'bank':0,
		               'airport':0,
		               'train_station':0,
		               'bus_station':0
		               };
                LocalityService.getNeighbourhood(p,r,'', function(results) {
					for(var i=0, len = results.length; i<len; i++) {
						dataNew = results[i];
						neighbourhoodValue[dataNew.localityAmenityTypes['name']] += 1;
					}
					for(var i=0;i<scope.places.nearby.length;i++){
						scope.places.nearby[i].value = neighbourhoodValue[scope.places.nearby[i].key];
					}
					for(var i=0;i<scope.places.connectivity.length;i++){
						 scope.places.connectivity[i].value = neighbourhoodValue[scope.places.connectivity[i].key];
					}
				});
            };
            var position = {};
                position['lat'] = scope.data.latitude;
                position['lng'] = scope.data.longitude;
                
            scope.neighbourhoodItems(scope.radius,position);
            
        }
    };
}]);
