

"use strict";
angular.module('serviceApp').directive('ptScroll', ['$rootScope', function($rootScope){
    return {
        scope   :   {
            loadMore    :   '&',
			refresh : '='  
        },        
        link    :   function(scope, elem, attr){
            var raw = elem[0];
			
			elem.perfectScrollbar({
			  wheelSpeed: 30,
			  wheelPropagation: false,
			  minScrollbarLength:100,
			  useBothWheelAxes:true
			});
			
            scope.$watch('refresh', function(newNames, oldNames) {
    	     	setTimeout(function() { elem.scrollTop(0);elem.perfectScrollbar('update'); }, 10);
        	});
			
            elem.bind('scroll', function() {
                
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 1){
					//GA tracker On clicking ALV Scroll
					var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
					$rootScope.TrackingService.sendGAEvent('map', 'scroll', 'ALV-'+pageType); 	 
					//mixpanel tracker
					$rootScope.TrackingService.mixPanelTracking('ALV Scroll', {'ALV Type':'Scroll', 'Page Name': pageType});   
                    scope.$apply(function(){
                        scope.loadMore();
                    });
                }
            });
        } 

    }
}]);
