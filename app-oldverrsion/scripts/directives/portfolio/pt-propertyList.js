/**
   * Name: Property List Directive
   * Description: pt-propertylist is curently shown on portfolio page to show all property listings of user
   * in grid format.
   * @author: [Nakul Moudgil]
   * Date: Sep 11, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptPropertylist',function(){
    return{
      restrict : 'A',
      templateUrl : 'views/directives/portfolio/pt-propertyList.html',
      //replace : true,
      controller: function($q, $rootScope, $scope, WidgetConfig, $modal, PortfolioService, PropertyService, ProjectService, LoadingService, GAService, Formatter,$location, Constants){
        var widgetData = WidgetConfig.propertyList.widgetData;
        $scope.propDetailWidgetName = $rootScope.labels.portfolio.label.MY_PROPERTIES;
        $scope.isNewUser = false;
        $scope.pgOptions = widgetData.displayInfo.gridOptions;
        $scope.$watch('portfolio_data.properties', function(newVal, oldVal){
			$scope.propertyCnt = undefined;
          if(newVal && newVal.length > 0){
              for (var prop in newVal) {
                  if (newVal.hasOwnProperty(prop)) {
                      calcPriceChange(newVal[prop]);
                  }
              }
            $scope.pgData = newVal;
            $scope.isNewUser = false;
            $scope.propertyCnt = $scope.portfolio_data.properties.length;
          }
          else if (newVal !== undefined) {
            $scope.pgData = newVal;
            $scope.isNewUser = true;
            $scope.propertyCnt = 0;
          }          
          
          if($scope.propertyCnt != undefined){
            var mixpanelObj = {};   
            mixpanelObj['Page Name'] = Constants.GLOBAL.PAGE_TYPES.PORTFOLIO;            
            mixpanelObj['Portfolio Count'] = $scope.propertyCnt;            
            $rootScope.TrackingService.pageViewedCall(mixpanelObj); 
          }

        });

        var calcPriceChange = function (property) {
              var change, changeType, duration, curr_date = new Date(), purchase_date = new Date(property.purchaseDate);
              change = property.currentPrice - property.totalPrice;
              changeType = change > 0 ? 'gain' : 'decline';
              property.changeAmount = Formatter.formatPrice(Math.abs(change));
              property.changePercent = Math.abs((change * 100 / property.totalPrice).toFixed(2));
              property.changeType = changeType;
              duration = (curr_date.getYear() - purchase_date.getYear()) * 12 + Math.abs(curr_date.getMonth() - purchase_date.getMonth());
              property.durationText = duration > 12 ? 'in the last 1 yr 6 months' : '';
          };

        $scope.addProperty = function () {
          var modalInstance = $modal.open({
            templateUrl: 'views/controller/addProperty.html',
            controller: 'addpropertyCtrl',
            keyboard: false,
            backdrop: 'static',
            scope: $scope,
            resolve: {
              services: function () {
               return $scope.services;
              }
            }
          });
          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            if(selectedItem.city && selectedItem.project){
              if(selectedItem.propertyName){
                $scope.saveProperty(selectedItem);
                GAService.sendGAEvent('portfolio', 'clicked', 'addProperty-step3');
              }
              else{
                $scope.requestNewProject(selectedItem);
                GAService.sendGAEvent('portfolio', 'clicked', 'addProperty-step4');
              }              
            }
          }, function () {
          });
          
          GAService.sendGAEvent('portfolio', 'clicked', 'addProperty');
        };
        
        $scope.delProperty = function(propertyId, projectId){
          $scope.deleteProperty(propertyId);
          $rootScope.TrackingService.mixPanelTracking('Property deleted', {'Property ID' : propertyId, 'Project ID' : projectId, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});
          GAService.sendGAEvent('portfolio', 'clicked', 'delete');
        };

        $scope.editProperty = function(listingId){
          if ( parseInt(listingId) > 0) {
            listingId = parseInt(listingId);
            $rootScope.updatePropertyId = listingId;
            var modalInstance = $modal.open({
              templateUrl: 'views/controller/addProperty.html',
              controller: 'addpropertyCtrl',
              keyboard: false,
              scope: $scope,
              backdrop: 'static',
              resolve: {
                services: function () {
                  return $scope.services;
                }
              }
            });
            modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
              $scope.updateProperty(selectedItem, listingId);
              GAService.sendGAEvent('portfolio', 'clicked', 'edit-step2');
            }, function () {
              //$log.info('Modal dismissed at: ' + new Date());
            });
          }
          GAService.sendGAEvent('portfolio', 'clicked', 'edit');
        }

        $scope.formatRs = Formatter.formatRs;
          $scope.formatPrice = Formatter.formatPrice;
          $scope.abs = Math.abs;
      },
      link : function(scope, element, attrs){
      }
    }
});
