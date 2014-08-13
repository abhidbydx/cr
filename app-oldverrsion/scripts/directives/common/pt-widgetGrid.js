/**
   * Name: ptWidgetgrid Directive
   * Description: pt-widgetgrid is common grid widget which will read configuation from WidgetConfig 
     and load the grid accordignly 
   * @author: [Nakul Moudgil]
   * Date: Sep 23, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptWidgetgrid', function($rootScope) {
  return {
  	restrict : 'A',
  	template : '<div><div class="gridStyle" ng-grid="gridOptions"></div></div>',
	  controller: function($scope, $element, $attrs){        
      $scope.$watch('pgData', function(newVal, oldVal){
        if(newVal){
         $scope.gridData = newVal;
        }
      });
      $scope.gridData = $scope.pgData;
      $scope.updateProperty = function(id) {
        $scope.editId = id;
        $scope.edit(id);
      };  
            
      $scope.callMixPanelEvent =  function(portfolioId, projectId){
         $rootScope.TrackingService.mixPanelTracking('Property Clicked', {'Property ID' : portfolioId, 'Project ID' : projectId, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});
       };
      var widgetOptions = $scope.pgOptions;
    	$scope.gridOptions = {
          data : 'gridData',
          multiSelect: false,
          rowHeight: widgetOptions.rowHeight,
          columnDefs : widgetOptions.columnDefs,
          enableSorting : widgetOptions.enableSorting,
          enablePaging : widgetOptions.enablePaging,
          showGroupPanel : widgetOptions.showGroupPanel,
          pagingOptions : {
            pageSizes : [10, 50,100],
            pageSize : 5,
            currentPage : 1
          },
          showFooter : widgetOptions.showFooter
      };
      $scope.$on("dashboardResize", function(event, toggle){
        //Following code will be required 
        //layoutPlugin.updateGridLayout();
      }); 
      
    
  }
  }
});