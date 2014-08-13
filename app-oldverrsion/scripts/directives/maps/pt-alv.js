/**
   * Name: pt-alv
   * Description: ALV Sidebar
   * @author: [Yugal Jindle]
   * Date: Nov 18, 2013
**/

'use strict';

angular.module('serviceApp').directive('ptAlv', ['$rootScope', function($rootScope) {
    return {
        restrict: 'EAC',
        scope: {
            state: '='
        },
        transclude: true,
        templateUrl: 'views/directives/maps/pt-alv.html',
        link: function(scope, element) {
            scope.state = true;
            scope.toggleSideBar = function() {
				var action = '';
                if (scope.state) {
					action = 'Hide';
                    $('.map_canvas_wrap').animate({right : '0px'}, 1000, '', function(){
                        setTimeout(function() {
                            scope.state = false;
                            scope.$apply();
                        });
                    });
                    $('#alvSidebar', element).removeClass('open').animate({right: '-330px'}, 1000);
                    $('.fa.fa-angle-double-right', element).addClass('fa-angle-double-left').removeClass('fa-angle-double-right');
                }
                else {
					action = 'Show';
                    $('.map_canvas_wrap').animate({right : '330px'}, 1000, '', function(){
                        setTimeout(function() {
                            scope.state = true;
                            scope.$apply();
                        });
                    });
                    $('#alvSidebar', element).addClass('open').animate({right: '0px'}, 1000);
                    $('.fa.fa-angle-double-left', element).addClass('fa-angle-double-right').removeClass('fa-angle-double-left');
                }
                
                //GA tracker On clicking ALV show/hide 
				var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
				$rootScope.TrackingService.sendGAEvent('map', action, 'legend-'+pageType); 	 
				//mixpanel tracker
			    $rootScope.TrackingService.mixPanelTracking('ALV '+action, {'ALV Type':action, 'Page Name': pageType});  
		
            }
        },
    }
}]);

