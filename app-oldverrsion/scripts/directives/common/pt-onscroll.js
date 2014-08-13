angular.module('serviceApp').directive("ptOnscroll", ['$rootScope', '$window', function ($rootScope, $window) {
    return function(scope, element, attrs) {
		var windowElement = $(window);
		var scrollHandler = windowElement.scroll(function () {		    			
			var yOffset = getScrollOffsets();						
		    $rootScope.$broadcast("scrolled", {yoffset:yOffset.y, height:this.innerHeight});
		});
		
		scope.$on('$destroy', function(){           
	        $(window).unbind('scroll', scrollHandler);
	    });

	    var getScrollOffsets = function () {
		    // This works for all browsers except IE versions 8 and before
		    if ( window.pageXOffset != null ) 
		       return {
		           x: window.pageXOffset, 
		           y: window.pageYOffset
		       };

		    // For browsers in Standards mode
		    var doc = window.document;
		    if ( document.compatMode === "CSS1Compat" ) {
		        return {
		            x: doc.documentElement.scrollLeft, 
		            y: doc.documentElement.scrollTop
		        };
		    }

		    // For browsers in Quirks mode
		    return { 
		        x: doc.body.scrollLeft, 
		        y: doc.body.scrollTop 
		    }; 
		}
    };
}]);