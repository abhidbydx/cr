/**
   * Name: Portfolio Others Directive
   * Description: pt-propertylist is curently shown on portfolio page to show all property listings of user
   * in grid format.
   * @author: [Nakul Moudgil]
   * Date: Oct 25, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptPortfoliorelated',function(){
  return{
    restrict : 'A',
    templateUrl : 'views/directives/portfolio/pt-portfolioRelated.html',
    //replace : true,
    controller : function( $scope, $rootScope, PortfolioService) {
      var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
      $scope.sendGAEvent = $rootScope.TrackingService.sendGAEvent;
      $scope.mixPanelTracking = $rootScope.TrackingService.mixPanelTracking;
      $scope.pageType = pageType;
      $scope.relatedWidgetName = $rootScope.labels.portfolio.label.RELATED;
      $scope.$watch('property', function( newProp, oldProp ) {
        if ( newProp ) {
          $scope.projectName = newProp.builderName + ' ' + newProp.projectName;
          $scope.areaName = newProp.locality + ' - ' + newProp.cityName;
          $scope.projectId =  newProp.projectId;
          $scope.localityId = newProp.localityId;
          PortfolioService.getRelatedProjectUrl( newProp.projectId, newProp.localityId ).then( function( newUrl ) {
            if ( newUrl ) {
              $scope.relatedUrl = newUrl;
            }
          });
        }
      });
    },
    link: function(){
    }
  }
});