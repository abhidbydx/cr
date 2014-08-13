/**
   * Name: portfolioCtrl
   * Description: This is controller portfolio page.
   * @author: [Nakul Moudgil]
   * Date: Sep 10, 2013
**/
'use strict';
angular.module('serviceApp')
    .controller('portfolioCtrl', function ($scope, $rootScope, $stateParams, $window, $cookies, Constants, PortfolioService,PropertyService, ProjectService, WidgetConfig, LoadingService, DashboardService, WidgetService) {
    //  following line will reset the city dropdown in the header to : Select City
    $scope.$emit( 'citychanged', false );
        $scope.portfolio_data = {
            properties: undefined,
            assessmentData: undefined,
            trendData: undefined
        };
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
    $scope.visibleModule = $stateParams.visibleModule;
    var widgetData = WidgetConfig.propertyList.widgetData;
    $scope.getPropertyList = function(){      
      PortfolioService.getPropertyList(widgetData.displayInfo.metricList).then(function(data){
        $scope.portfolio_data.properties = data;
        $rootScope.$broadcast('portfolio.properties',data);        
      });
    };
    
    $scope.getPortfolio = function(){
      PortfolioService.getPortfolio().then(function (data) {
        $scope.portfolio_data.assessmentData = data;
        $scope.loaderHide = true;
      });
    };
    
    $scope.getPropertyPriceTrend = function(){     
      PortfolioService.getPortfolioPriceTrend().then(function (data) {
        $scope.portfolio_data.trendData = data;
      }); 
    };

    $scope.requestNewProject = function(property){
	ProjectService.requestNewProject(property).then(function (data) {
	    $scope.newProjectResponse = data;
	});  
    };

    $scope.saveProperty = function(property){
    	PropertyService.saveProperty(property).then(function (data) {
    	    $scope.saveResponse = data;
          $scope.getPropertyList();
          $scope.getPortfolio();
          $scope.getPropertyPriceTrend();
          LoadingService.hideLoader();
    	});
      LoadingService.showLoader();
    };

    $scope.updateProperty = function(property, propertyId){
    	PropertyService.updateProperty(property, propertyId).then(function (data) {
    	    $scope.editResponse = data;
          $scope.getPropertyList();
          $scope.getPortfolio();
          $scope.getPropertyPriceTrend();
          LoadingService.hideLoader();        
    	});
      LoadingService.showLoader();     
    };

    $scope.deleteProperty = function(propertyId){
    	PropertyService.deleteProperty(propertyId).then(function (data) {
    	    //$scope.delResponse = data;
          $scope.getPropertyList();
          $scope.getPortfolio();
          $scope.getPropertyPriceTrend();
          LoadingService.hideLoader();          
    	});
      LoadingService.showLoader();
    };

    $scope.getPropertyList();
    $scope.getPortfolio();
    $scope.getPropertyPriceTrend();
    $rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.PORTFOLIO.toUpperCase();  
});
