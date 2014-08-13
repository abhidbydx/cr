/**
 * Created by shatyajeet on 10/6/14.
 */
'use strict';
angular.module('serviceApp').directive('ptPortfoliodemandgraph', function (){
    return {
        restrict: 'A',
        templateUrl: 'views/directives/portfolio/pt-portfolioDemandGraph.html',
        controller: function($scope, LocalityService, GraphParser) {
            $scope.demandGraphData = {
                property: undefined,
                localityId: undefined
            };

            $scope.$watch('localityId', function(newVal, oldVal){
                if (newVal) {
                    $scope.demandGraphData.localityId = newVal;
                }
            });

            $scope.$watch('property', function(newVal, oldVal){
                if (newVal) {
                    $scope.demandGraphData.property = newVal;
                }
            });

            $scope.$watch('demandGraphData', function (newValue, oldValue) {
                if (newValue && newValue.property && newValue.localityId) {
                    LocalityService.getDominantPriceTrend( 'localityId', $scope.localityId, $scope.property.unitType, false).then(function(data){
                        console.log(GraphParser.parseHithertoPriceTrend(data));
                    });
                }
            }, true);
        }
    };
});