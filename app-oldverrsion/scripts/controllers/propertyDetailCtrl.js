/**
   * Name: propertyDetailCtrl
   * Description: This is controller property deatil page.
   * @author: [Nakul Moudgil]
   * Date: Oct 9, 2013
**/
'use strict';
angular.module('serviceApp')
  .controller('propertyDetailCtrl', function ($scope, $rootScope, PortfolioService, WidgetConfig ,DashboardService,WidgetService,Constants) {
    if(!$rootScope.dashboards){
      DashboardService.getDashboards().then(function (data) {
        $rootScope.dashboards = data;
      });
    }
    if(!$rootScope.widgets){     
      WidgetService.then(function (data) {
        $rootScope.widgets = data;
      }); 
    }
    $scope.loaderHide = true;
    var widgetData = WidgetConfig.propertyList.widgetData;
    PortfolioService.getPropertyList(widgetData.displayInfo.metricList).then(function(data){
        $scope.properties = data;
        $rootScope.$broadcast('portfolio.properties',data);  
        
      });  
    (function(){
        //set page name
        $rootScope.CURRENT_ACTIVE_PAGE  = "Portfolio Property"; 
    })();
  });
