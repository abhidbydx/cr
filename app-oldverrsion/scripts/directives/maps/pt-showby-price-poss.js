

"use strict";
angular.module('serviceApp').directive('ptShowbyPricePoss', function($rootScope){

    return {
        restrict    :   'A',
        scope       :   {
            showType  :   '=',
            ranges    :   '='
        },
        templateUrl :   'views/directives/maps/pt-showby-price-poss.html',
        link        :   function(scope, element){ 
    
			 //Send GA/Mixpanel tracker event request on changing view Type
			 scope.tracking = function(type) {
				var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
				$rootScope.TrackingService.sendGAEvent('map', 'clicked', type+'-'+pageType);
				var viewTypeObj = {};
				viewTypeObj['View Type'] = type;
				viewTypeObj['Page Name'] = pageType;
				$rootScope.TrackingService.mixPanelTracking('View Type Change', viewTypeObj);
				
			};
		}
			
    };
});
