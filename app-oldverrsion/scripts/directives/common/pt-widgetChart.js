/**
 * Name: Chart Directive
 * Description: Use this directive to show any chartin the application. It uses highcharts internally.
 * @author: [Nakul Moudgil]
 * Date: Sep 13, 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptWidgetchart', function() {
    return {
	restrict : 'A',
	template : '<div pt-chart class="chartStyle" chart-size="size" chart-config=config></div>',
	//replace : true,
	scope : {
            widgetData : '=widgetData',
        tabChange : '='
	},

	controller: function($scope, $element, $attrs, ChartConfig){
	    $scope.$watch("widgetData", function (newVal, oldVal) {
		if (newVal) {
    		    var chartConfig = {}, resetConfig = {}, tempDataConfig;
    		    var widgetData = $scope.widgetData.widgetData.displayInfo;
		    var chartType = '';

		    // Set Chart Type
		    if(widgetData)  {
			chartType = widgetData.subtype;
		    }
		    var chartData = {
			type: chartType,
			reflow: true
		    };
		    
		    /////////////////////////////////
		    
		    $.extend(true, chartConfig, ChartConfig[chartType]);
		    
		    /// Get Chart Data
		    if (chartConfig.chart) {
	    		chartData = chartConfig.chart;
		    }
		    
		    // Set Chart Title
		    if(chartConfig.title){
			$.extend(true, chartConfig.title, widgetData.title);
		    }
		    else{
			chartConfig.title = widgetData.title;
		    }
		    //////////////////////////////////
		    
		    // Set X-axis
		    if(chartConfig.xAxis){
			$.extend(true, chartConfig.xAxis, widgetData.xAxis);
		    }
		    else{
			chartConfig.xAxis = widgetData.xAxis;
		    }
		    /////////////////////////////////

		    // Set plotOptions
		    if(chartConfig.plotOptions){
			$.extend(true, chartConfig.plotOptions, widgetData.plotOptions);
		    }
		    else{
			chartConfig.plotOptions = widgetData.plotOptions;
		    }
		    /////////////////////////////////

		    //creating Y-axis Object
		    var metricList =  widgetData.seriesMeta.name;
		    if(metricList && metricList.length === 1){
			tempDataConfig = {
			    yAxis:{
				title:{
				    text: metricList[0],
				    style: {color: '#848484', fontSize:'11'}
				},
				labels: {
				    formatter: function () {
					if(this.value >= 10000000 || this.value <= -10000000){
					    return this.value/10000000 + ' Cr';
					}
					else if(this.value >= 100000 || this.value <= -100000){
					    return this.value/100000 + ' Lacs';
					}
					else{
					    return this.value;
					}
				    }
				}
			    },
			    chart: chartData,
			    tooltip : {
				formatter : function () {
				    var price;

				    if(this.y >= 10000000 || this.y <= -10000000){
					price = Math.round(this.y*100/10000000) / 100 + ' Cr';
				    }
				    else if(this.y >= 100000 || this.y <= -100000){
					price = Math.round(this.y * 100 /100000) / 100 + ' Lacs';
				    }
				    else {
					price = this.y;
				    }
				    return this.series.name + ": " + price;
				}
			    }
			};
		    }
		    else if(metricList && metricList.length > 1)  {
			var yaxis = [], seriesObj = [];
			angular.forEach(metricList, function(metric, i){
			    var axis = {
				title:{
				    text: metric,
				    style:{color: '#848484', fontSize:'11'}
				} ,
				opposite:  i%2 === 0 ? false :true,
				labels: {
				    formatter: function () {
					if(this.value >= 10000000 || this.value <= -10000000){
					    return this.value/10000000 + ' Cr';
					}
					else if(this.value >= 100000 || this.value <= -100000){
					    return this.value/100000 + ' Lacs';
					}
					else{
					    return this.value;
					}
				    }
				}
			    };
			    yaxis.push(axis);			  
			});
			tempDataConfig = {
			    chart:chartData, 
			    yAxis: yaxis,
			    tooltip : {
				formatter : function () {
				    var price;

				    if(this.y >= 10000000 || this.y <= -10000000){
					price = Math.round(this.y*100/10000000) / 100 + ' Cr';
				    }
				    else if(this.y >= 100000 || this.y <= -100000){
					price = Math.round(this.y * 100 /100000) / 100 + ' Lacs';
				    }
				    else {
					price = this.y;
				    }
				    return this.series.name + ": " + price;
				}
			    }
			};
		    }
		    ///////////////////////////////////////////////////
		    
		    // Set legend
		    if(chartConfig.legend){
			$.extend(true, chartConfig.legend, widgetData.legend);
		    }
		    else{
			chartConfig.legend = widgetData.legend;
		    }
		    //////////////////////////////////////////////////

		    // Set tooltip
		    if(chartConfig.tooltip){
			$.extend(true, chartConfig.tooltip, widgetData.tooltip);
		    }
		    else{
			chartConfig.tooltip = widgetData.tooltip;
		    }

		    if(chartConfig.yAxis){
			$.extend(true, chartConfig.yAxis, widgetData.yAxis);
		    }
		    else{
			chartConfig.yAxis = widgetData.yAxis;
		    }
		    /////////////////////////////////////////////////
		    
		    $.extend(true, resetConfig, chartConfig, tempDataConfig);
		    $scope.config = resetConfig;
            $scope.$watch('widgetData.widgetData.displayInfo.tooltip',function(newVal, oldVal){
                if(newVal){
                    $scope.config.tooltip = $scope.widgetData.widgetData.displayInfo.tooltip;
                }
            });
		    $scope.$watch('widgetData.widgetData.displayInfo.series',function(newVal, oldVal){
                if(newVal && newVal.length ){
                    $scope.config.series = $scope.widgetData.widgetData.displayInfo.series;
                }
		    }, true);
		    $scope.$watch('widgetData.widgetData.displayInfo.xAxis.categories',function(newVal, oldVal){
			if(newVal){
			    $scope.config.xAxis.categories = $scope.widgetData.widgetData.displayInfo.xAxis.categories;
			}
		    });
		    $scope.$watch('widgetData.widgetData.displayInfo.yAxis.plotLines',function(newVal, oldVal){
			if(newVal !== oldVal){
			    $scope.config.yAxis.plotLines = $scope.widgetData.widgetData.displayInfo.yAxis.plotLines;
			}
		    });

		    $scope.size = {};
		}
	    });
	},
	link : function(scope, element, attrs) {
	    if (scope.size) {
		scope.size.width = element.find('.chartStyle').parent().width();
		scope.$on("dashboardResize", function(event, toggle){
		    setTimeout(function(){
			scope.size.width = element.find('.chartStyle').parent().width();
		    }, 900);
		});
	    }
	}
    }
});