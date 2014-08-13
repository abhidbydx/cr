/**
   * Name: Recently Viewed Directive
   * Description: Recently Viewed directive is used to show users recently viewed properties.
   * @author: [Nimit Mangal]
   * Date: Sep 30, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptRecentlyviewed',function($timeout){
    return{
    restrict : 'A',
    templateUrl : 'views/directives/common/pt-recentlyviewed.html',
    //replace : true,
    controller : function($scope, $rootScope, WidgetConfig, UserService,Constants){
        var widgetData = WidgetConfig.recentlyViewed.widgetData;
        $scope.rvWidgetName = $rootScope.labels.common.label.RECENTLY_VIEWED_PROP;
        $scope.pgOptions = widgetData.displayInfo.gridOptions;
        UserService.getRecentlyViewed(widgetData.displayInfo.metricList,widgetData.displayInfo.pageLimit).then( function( data ) {
                $scope.pgData = data;            
                if ( data && data.length ) {
                    $scope.noRecentView = false;
		      $scope.countRecent = $scope.pgData.length;
                }else{
                    $scope.noRecentView = true; 
	            $scope.countRecent = 0;
                }
    		var mixpanelObj = {}; 
    		mixpanelObj['Page Name'] = "My Recenlty Viewed";    		 
    		mixpanelObj['Recently Viewed Count'] = $scope.countRecent;    		
            $rootScope.TrackingService.pageViewedCall(mixpanelObj); 
        });
        $scope.errorMessage = $rootScope.labels.common.message.NO_RECENTLY_VIEWED;
    },
    link : function(scope, element){
        scope.$on("leftNavToggle", function(event, toggle){
            if(toggle.toggle == 'close'){
                $timeout(function() { 
                $('.ContentContainer',element).animate({width:'100%'},1000);
                }, 0);
            }
            else{
                $timeout(function() { 
                $('.ContentContainer',element).animate({width:'77%'},1000);
                }, 0);
            }
        });
    }
    }
});
