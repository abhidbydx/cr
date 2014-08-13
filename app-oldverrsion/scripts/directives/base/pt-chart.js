/**
 * Name: Chart Directive
 * Description: Use this directive to show any chartin the application. It uses highcharts internally.
 * @author: [Nakul Moudgil]
 * Date: Sep 13, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptChart', function($timeout) {
  return {
    restrict : 'A',
    template : '<div></div>',
    //replace : true,    
    scope : {
        chartOptions : '=chartConfig',
        // expects the syn-chart-size to be an object like {width: 100, height: 50}
        size : '=chartSize'
    },
      link : function(scope, element, attrs) {
	  var highchartObj, // the main highchartObj object
          chartSettings; // the setting generated till now.
          
          // lets set the default configuration.
          chartSettings = {
              chart : {
		  renderTo : element[0], // element is jQuery element, we need to pass the HTMLElement
		  height : (scope.size && !isNaN(scope.size.height)) ? scope.size.height : null,
		  width : (scope.size && !isNaN(scope.size.width)) ? scope.size.width : null
              }
          };
	  /**
	   * This destroys the current highchart and creates a new instance
	   * this is good if you are refreshing the data or if you initializing the widget.
	   * 
	   */
	  function renderChart(chartOptions) {
              // if there is no config we are not changing anything!
              if (!chartOptions) {
		  return;
              }
              var deepCopy = true;
              var newSettings = {};
	         
              $.extend(deepCopy, newSettings, chartSettings, chartOptions);
	      
              if(highchartObj){
		  highchartObj.destroy();
              }
	   
	      highchartObj = new Highcharts.Chart(newSettings);
	      $timeout(function(){
	      changeDimension();
	      });
	  }

	  /**
	   * called everytime the dimension of the chart changes, dont re-render
	   * the chart, instead call the highchart internal API.
	   * 
	   * @returns
	   */
	  var changeDimension = function(size) {
              //if (scope.size && !isNaN(scope.size.width) && !isNaN(scope.size.height) && highchartObj && highchartObj.setSize) {
	      if (size) {
		  if (highchartObj){
	 	      highchartObj.setSize(size.width, size.height, true);
		  }
	      }
	      else {
		  // var el = element;
		  // if (highchartObj){
		  //     highchartObj.setSize(el.width(), el.height(), true);
		  // }
		  $(window).resize();
	      }
              //}
	  }
	  // Update when charts data changes
	  scope.$watch('chartOptions', renderChart, true);      
	  // Update when the chart container size changes.
	  scope.$watch('size', changeDimension, true);
      }
  };
});