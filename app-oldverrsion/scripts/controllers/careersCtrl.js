/**
   * Name: careersCtrl
   * Description: This is controller of Careers page.
   * @author: [Nakul Moudgil]
   * Date: Mar 12, 2014
**/
'use strict';
angular.module('serviceApp')
  .controller('careersCtrl', ['$scope', 'CareerService', function ($scope, CareerService) {
      CareerService.getOpenPositions().then(function (data) {
        $scope.openPositions = data;
        $.each($scope.openPositions, function(item,attr){
          attr.uiLabel = attr.jobTitle;
          if(attr.noOfPosition){
            attr.uiLabel = attr.uiLabel.concat(' -' + attr.noOfPosition + ' ')
          }
          if(attr.location){
            attr.uiLabel = attr.uiLabel.concat(' (' + attr.location + ')')
          }
        });
      });
  }]);
