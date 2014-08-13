/**
 * Name: My Portfolio- At a Glance Directive
 * Description: pt-propertylist is curently shown on portfolio page to show all property listings of user
 * in grid format.
 * @author: [Nakul Moudgil]
 * Date: Sep 11, 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptPortfolioatglance', function () {
    return{
        restrict: 'A',
        templateUrl: 'views/directives/portfolio/pt-portfolioAtGlance.html',
        controller: function ($scope, $rootScope, WidgetConfig, GraphParser, PortfolioHelper) {
            var tempAssesment = {}, tempTrend = {}, current_property;
            var assesmentConf = WidgetConfig.portfolioAtGlance.PurchaseReturnCurrent.widgetData.displayInfo;
            var trendConf = WidgetConfig.portfolioAtGlance.PortfolioPriceTrend.widgetData.displayInfo;

            $scope.tabChange = false;
            $scope.assessment = {};
            $scope.trend = {};
            $scope.orig_data = {
                properties: undefined
            };

            $.extend($scope.assessment, WidgetConfig.portfolioAtGlance.PurchaseReturnCurrent);
            $.extend($scope.trend, WidgetConfig.portfolioAtGlance.PortfolioPriceTrend);

            $scope.graphList = [
                {
                    name: 'Portfolio Overview',
                    active: true,
                    content: $scope.assessment,
                    setData: true
                },
                {
                    name: 'Price Trends',
                    active: false,
                    content: $scope.trend,
                    setData: false
                }
            ];

            $scope.toggle = function(graphName) {
                //GA Tracking

                $rootScope.TrackingService.sendGAEvent('portfolio', 'Viewed', graphName+'-'+$rootScope.CURRENT_ACTIVE_PAGE);                
                $scope.tabChange = true;
                _.find($scope.graphList, function(obj){
                    obj.active = (obj.name == graphName);
                    if (obj.setData) {
                        $scope.setAssessmentData($scope.orig_data.properties);
                    }
                });
            };

            $scope.setAssessmentData = function (prop) {
                var data_prop = {};
                if (prop.length && prop.length > 0) {
                    data_prop = $scope.orig_data;
                } else {
                    data_prop = {
                        'assessmentData': {
                            'Current Price': prop.currentPrice,
                            'Purchase Price': prop.totalPrice,
                            'Overall Return': Math.abs(prop.totalPrice - prop.currentPrice),
                            'overallReturnPer': ((Math.abs(prop.totalPrice - prop.currentPrice) * 100) / prop.totalPrice).toFixed(1),
                            'overallReturnType': (prop.totalPrice > prop.currentPrice) ? 'DECLINE' : 'GAIN'
                        },
                        properties: {
                            name: prop.name,
                            totalPrice: prop.totalPrice,
                            changeAmount: prop.currentPrice - prop.totalPrice,
                            currentPrice: prop.currentPrice
                        }
                    };
                }
                makeAssessmentChart(data_prop);
            };

            var makeAssessmentChart = function (data) {
                var chartData = PortfolioHelper.cleanAssessmentData(data.assessmentData);
                var tooltip = PortfolioHelper.makeToolTip(data.properties);
                if (tooltip) {
                    $scope.assessment.widgetData.displayInfo.tooltip = tooltip;
                }
                var seriesData = GraphParser.parse(assesmentConf, chartData);
                if (seriesData) {
                    $scope.assessment.widgetData.displayInfo.series = seriesData;
                }
            };

            var makeTrendChart = function (data) {
                if (data && data.trendData) {
                    var tData = GraphParser.parse(trendConf, data.trendData);
                    if (tData) {
                        $scope.trend.widgetData.displayInfo.series = tData.yAxis;
                        $scope.trend.widgetData.displayInfo.xAxis.categories = tData.xAxis;
                    }
                }
            };

            var curVal = {};
            $scope.$watch('portfolio_data', function (newVal, oldVal) {
                if (newVal && newVal.properties && newVal.properties.length && newVal.assessmentData && newVal.trendData) {
                    curVal = newVal;
                    $scope.newUser = false;
                    $scope.orig_data = newVal;
                    makeAssessmentChart(newVal);
                    makeTrendChart(newVal);
                } else {
                    if (newVal.properties == undefined) {
                        $scope.newUser = true;
                    }
                }
            }, true);
        },
        link: function (scope, element, attrs) {
        }
    }
});
