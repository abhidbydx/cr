/**
   * Name: Property List Directive
   * Description: pt-propertylist is curently shown on portfolio page to show all property listings of user
   * in grid format.
   * @author: [Nakul Moudgil]
   * Date: Oct 9, 2013
**/

'use strict';
angular.module('serviceApp').directive('ptPropertydetail',function(){
    return{
      restrict : 'A',
      templateUrl : 'views/directives/portfolio/pt-propertyDetail.html',
      //replace : true,
      link: function(){
      },
      controller: function($scope, $rootScope, PropertyService, WidgetConfig, $stateParams,Constants){
        $scope.propDetailWidgetName = $rootScope.labels.portfolio.label.PROP_DETAILS;
          PropertyService.getProperty(WidgetConfig.propertyDetails.widgetData.metricList, $stateParams.propertyId).then(function (data) {
	      $scope.propertyRes = data;
	  });
        $scope.$watch('propertyRes', function(newVal, oldVal){
          if(newVal){
            $scope.property = newVal;
          if(!$scope.property.completionDate){
                $scope.property.completionDate = 'NA';
              }
	   if($scope.property.unitNo || $scope.property.floorNo || $scope.property.tower){
              if(!$scope.property.unitNo){
                $scope.property.unitNo = 'NA';
              }
              if(!$scope.property.floorNo){
                $scope.property.floorNo = 'NA';
              }
              if(!$scope.property.tower){
                $scope.property.tower = 'NA';
              }
	      $scope.unit = '# ' + $scope.property.unitNo + ', ' + $rootScope.labels.common.items.FLOOR + ' - ' + $scope.property.floorNo + ', ' + $rootScope.labels.common.items.TOWER + ' - ' + $scope.property.tower;
            }
            else{
              $scope.unit = 'Not Specified';
            }
            var mixpanelObj = {}; 
            mixpanelObj['Project ID'] = $scope.propertyRes.projectId;
            mixpanelObj['Portfolio ID'] = $stateParams.propertyId;
            mixpanelObj['Image Available'] = $scope.propertyRes.propertyImages.length; 
            $rootScope.TrackingService.pageViewedCall(mixpanelObj); 
          }
        });
        $rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.PORTFOLIO+"-"+Constants.GLOBAL.PAGE_TYPES.PROPERTY;
      }
    }
});
