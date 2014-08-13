/**
   * Name: Saved Searches Directive
   * Description: Saved Searches directive is used to show user's saved searches.
   * @author: [Swapnil Vaibhav]
   * Date: Oct 28, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptSavedsearches',function($timeout){
    return{
      restrict : 'A',
      templateUrl : 'views/directives/common/pt-savedsearches.html',
      //replace : true,
      scope : {},
      controller : function($scope, $rootScope, WidgetConfig, UserService, Formatter,Constants){
        var widgetData = WidgetConfig.savedSearches.widgetData;
        $scope.ssWidgetName = 'Saved Searches';
        $scope.errorMessage = 'Currently there are no saved searches by you';
        $scope.pgOptions = widgetData.displayInfo.gridOptions;
        UserService.getSavedSearches(widgetData.displayInfo.metricList).then( function( data ) {
          $scope.pgData = data;
        });
        $scope.$watch('pgData', function(newVal, oldVal) {
          if ( newVal !== oldVal ) {
            if ( newVal !== null && typeof newVal !== 'undefined' ) {
              if ( newVal.length == 0 ) {
                $scope.showGrid = false;
                $scope.noSavedSearch = true;
                $scope.countSaved = 0;
              }
              else {
                $scope.showGrid = true;
                $scope.noSavedSearch = false;
                $scope.countSaved = $scope.pgData.length;
              }
            }
            var mixpanelObj = {}; 
            mixpanelObj['Page Name'] = "My Saved Searches";         
            mixpanelObj['Saved Search Count'] = $scope.countSaved;          
            $rootScope.TrackingService.pageViewedCall(mixpanelObj); 
          }
        });

        $scope.formatDate = function( dt ) {
          return Formatter.formatDate( Formatter.getYYYYMMDD( dt ), true );
        };

        $scope.del = function( id ) {
          UserService.delSavedSearch( id ).then( function( data ) {
            if ( data ) {
              $scope.pgData = data;
            }
          });
        };
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
