/**
   * Name:Enquired Property Directive
   * Description: Enquired Property directive is used to show users data for enquired properties.
   * @author: [Swapnil Vaibhav]
   * Date: Oct 28, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptEnquiredproperty',function($timeout){
    return{
      restrict : 'A',
      templateUrl : 'views/directives/common/pt-enquiredproperty.html',
      //replace : true,
      scope : {},
      controller : function($scope, $rootScope, WidgetConfig, UserService,Constants){
        var widgetData = WidgetConfig.enquiredProperty.widgetData;
        $scope.epWidgetName = 'Enquired Properties';
        $scope.errorMessage = 'Currently there are no enquired properties by you';
        $scope.pgOptions = widgetData.displayInfo.gridOptions;
        UserService.getEnquiredProperty(widgetData.displayInfo.metricList).then( function( data ) {
          $scope.pgData = data;  
        });
        $scope.$watch('pgData', function(newVal, oldVal) {
          if ( newVal !== oldVal ) {
            if ( newVal !== null && typeof newVal !== 'undefined' ) {
              if ( newVal.length == 0 ) {
                $scope.showGrid = false;
                $scope.noSavedSearch = true;
                $scope.countEnq = 0;
              }
              else {
                $scope.showGrid = true;
                $scope.noSavedSearch = false;
                $scope.countEnq = $scope.pgData.length;
              }
            }
            var mixpanelObj = {}; 
            mixpanelObj['Page Name'] = "My Enquired Properties";           
            mixpanelObj['Enquired Count'] = $scope.countEnq;
            $rootScope.TrackingService.pageViewedCall(mixpanelObj); 
          }
        });
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
