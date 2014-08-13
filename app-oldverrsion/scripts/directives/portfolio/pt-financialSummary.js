/**
 * Name: Portfolio Others Directive
 * Description: pt-propertylist is curently shown on portfolio page to show all property listings of user
 * in grid format.
 * @author: [Nakul Moudgil]
 * Date: Oct 25, 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptFinancialsummary', function () {
    return{
        restrict: 'A',
        templateUrl: 'views/directives/portfolio/pt-financialSummary.html',
        //replace : true,
        scope: {},
        controller: function ($scope, $rootScope, WidgetConfig, GraphParser, PropertyService, $stateParams, PortfolioHelper, LocalityService, Formatter) {
            var assesmentConf = WidgetConfig.FinancialSummary.PurchaseReturnCurrent.widgetData.displayInfo;
            var trendConf = WidgetConfig.FinancialSummary.PortfolioPriceTrend.widgetData.displayInfo;
            var propertyDataTemplate = ['changeAmount', 'totalPrice', 'currentPrice', 'name', 'localityId', 'unitType', 'locality', 'listingSize'];
            var tempAssessment = {}, tempTrend = {};
            $scope.tabChange = false;
            $scope.trendData = {
                propertyData: undefined
            };
            $scope.graphList = [
                {
                    name: 'Investment Overview',
                    active: false,
                    content: tempAssessment
                },
                {
                    name: 'Price Trend',
                    active: true,
                    content: tempTrend
                }
            ];

            $.extend(tempAssessment, WidgetConfig.FinancialSummary.PurchaseReturnCurrent);
            $.extend(tempTrend, WidgetConfig.FinancialSummary.PortfolioPriceTrend);

            $scope.toggle = function(graphName) {
                //Ga tracking
                $rootScope.TrackingService.sendGAEvent('portfolio', 'Viewed', graphName+'-'+$rootScope.CURRENT_ACTIVE_PAGE);                                
                $scope.tabChange = true;
                _.find($scope.graphList, function(obj){
                    obj.active = obj.name == graphName;
                });
            };

            var cleanPropertyData = function (data) {
                var cleanData = {};
                if (data.changeAmount > 0) {
                    cleanData.overallReturnType = 'GAIN';
                } else if (data.changeAmount < 0) {
                    cleanData.overallReturnType = 'DECLINE';
                } else {
                    cleanData.overallReturnType = 'NOCHANGE';
                }
                cleanData.overallReturnPer = Math.abs(data.changeAmount * 100 / data.totalPrice).toFixed(2);
                cleanData['Overall Return'] = Math.abs(data.changeAmount);
                cleanData['Purchase Price'] = data.totalPrice;
                cleanData['Current Price'] = data.currentPrice;
                return PortfolioHelper.cleanAssessmentData(cleanData);
            };

            var mergeTrendData = function(dataObj) {
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var tsMonths = [];
                var mergedMonths = _.union(dataObj.localityData.graphData.keys, dataObj.propertyData.xAxis);
                mergedMonths = _.map(mergedMonths, function(date) {
                    return new Date(date.split(' ')[1], months.indexOf(date.split(' ')[0])).getTime();
                });
                mergedMonths = mergedMonths.sort();
                mergedMonths = _.map(mergedMonths, function(date) {
                    return Formatter.epochToISTMonth(date, false);
                });
                return mergedMonths;
            };

            var addDataPadding = function(dataObj, monthTrend) {
                var newDataTrend = [], locTrend = {
                    data: [],
                    name: dataObj.localityData.name
                }, propTrend = {
                    data: [],
                    name: dataObj.propertyData.yAxis[0].name
                };
                for (var month in monthTrend) {
                    if (monthTrend.hasOwnProperty(month)) {
                        var currentMonth = monthTrend[month];
                        if (dataObj.localityData.graphData.keys.indexOf(currentMonth) > -1) {
                            locTrend.data.push(dataObj.localityData.graphData.data[dataObj.localityData.graphData.keys.indexOf(currentMonth)]);
                        } else {
                            locTrend.data.push(null);
                        }
                        if (dataObj.propertyData.xAxis.indexOf(currentMonth) > -1) {
                            propTrend.data.push(dataObj.propertyData.yAxis[0].data[dataObj.propertyData.xAxis.indexOf(currentMonth)]);
                        } else {
                            propTrend.data.push(null);
                        }
                    }
                }
                newDataTrend.push(propTrend, locTrend);
                return newDataTrend;
            };

            PropertyService.getProperty(propertyDataTemplate, $stateParams.propertyId).then(function (data) {
                if (data) {
                    LocalityService.getDominantPriceTrend( 'localityId', data.localityId, data.unitType, false, 9).then(function(priceData){
                        var parsedData = GraphParser.parseHithertoPriceTrend(priceData, true, true);
                        if (parsedData) {
                            $scope.trendData.localityData = {
                                graphData: {
                                    data: parsedData.avg.slice(3),
                                    keys: parsedData.keys.slice(3)
                                },
                                size: data.listingSize,
                                name: data.locality
                            };
                        } else {
                            $scope.trendData.localityData = {
                                graphData: {
                                    data: [],
                                    keys: []
                                },
                                size: data.listingSize,
                                name: data.locality
                            };
                        }
                    });
                    var tooltip = PortfolioHelper.makeToolTip(data);
                    if (tooltip) {
                        tempAssessment.widgetData.displayInfo.tooltip = tooltip;
                    }
                    var goalAmount = data.goalAmount;
                    var changeAmount = data.changeAmount;
                    var cleanData = cleanPropertyData(data);
                    var graphData = GraphParser.parse(assesmentConf, cleanData);
                    if (graphData) {
                        tempAssessment.widgetData.displayInfo.series = graphData;
                    }
                }
            });
            PropertyService.getPropertyPriceTrend($stateParams.propertyId).then(function (data) {
                if (data) {
                    $scope.trendData.propertyData = data;
                }
            });

            $scope.$watch('trendData', function (newVal, oldVal){
                if (newVal && newVal.localityData && newVal.propertyData) {
                    var priceTrendData = angular.copy(newVal.propertyData),
                        trendMonths = mergeTrendData(newVal),
                        paddedTrendData = addDataPadding(newVal, trendMonths);
                    priceTrendData.yAxis = paddedTrendData;
                    priceTrendData.yAxis[0].data = _.map(priceTrendData.yAxis[0].data, function (num){
                        return (num > 0) ? parseFloat((num / newVal.localityData.size).toFixed(2)) : null;
                    });
                    var graphData = GraphParser.parse(trendConf, priceTrendData);
                    tempTrend.widgetData.displayInfo.series = graphData.yAxis;
                    tempTrend.widgetData.displayInfo.xAxis.categories = trendMonths;
                }
            }, true);
        },
        link: function () {
        }
    }
});
