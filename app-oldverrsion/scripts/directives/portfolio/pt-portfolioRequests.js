/**
   * Name: Portfolio Others Directive
   * Description: pt-propertylist is curently shown on portfolio page to show all property listings of user
   * in grid format.
   * @author: [Nakul Moudgil]
   * Date: Oct 25, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptPortfoliorequest', [ 'PropertyService', 'GAService', 'LoadingService', function( PropertyService, GAService, LoadingService ){
    return{
      restrict : 'A',
      templateUrl : 'views/directives/portfolio/pt-portfolioRequests.html',
      //replace : true,      
	controller:function($scope, $rootScope, $stateParams, PropertyService, LoadingService){
        $scope.requestedToSell = false;
        $scope.showLoanBtn = true;
        $scope.requestWidgetName = $rootScope.labels.portfolio.label.REQUESTS;
        $scope.disableLoandBtn = false;
        $scope.disableSellBtn = false; 
        /*
        $scope.$watch('property.loanStatus', function(newStatus, oldStatus){
          if (newStatus && newStatus == 'NOT_AVAILED'){
            $scope.showLoanBtn = true;
          }
          else {
            $scope.showLoanBtn = false;
          }
        });*/

        $scope.sell = function(){
          $scope.sellResponse = PropertyService.sellProperty($stateParams.propertyId);           
          LoadingService.showLoader(); 
          $scope.sellResponse.then( function( data ){            
            if(data){
               $scope.disableSellBtn = true; 
               LoadingService.hideLoader();
            }       
          });
          $rootScope.TrackingService.sendGAEvent('portfolio', 'clicked', 'sellproperty');
          $rootScope.TrackingService.sendGAEvent('enquiry', 'submit', 'hidden-sellproperty-bottom');
          $rootScope.TrackingService.mixPanelTracking('Sell Request', {'Property ID' : $stateParams.propertyId, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});    
        };

        $scope.request = function(){
          $scope.askedForHomeLoan = PropertyService.requestedForHomeLoan($stateParams.propertyId); 
          LoadingService.showLoader(); 
          $scope.askedForHomeLoan.then( function( data ){            
            if(data){
              $scope.disableLoandBtn = true; 
              LoadingService.hideLoader();
            }       
          });
          $rootScope.TrackingService.sendGAEvent('portfolio', 'clicked', 'homeloan');
          $rootScope.TrackingService.mixPanelTracking('Home Loan Request', {'Property ID' : $stateParams.propertyId, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});
        };
      
      }
    }
}]);
