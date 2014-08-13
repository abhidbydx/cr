/**
   * Name: Dashboard Directive
   * Description: pt-dashboard directive can be used as conainer for widgets. Widgets contained in 
   * dashboard directive could be dragged or sorted. User customization will be saved in database.
   * @author: [Nakul Moudgil]
   * Date: Sep 13, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptDashboard',function($timeout, $compile, DashboardService, $rootScope) {
    return {
	restrict : 'A',
	templateUrl : "views/directives/base/pt-dashboard.html",
	//replace : true,
	link : function(scope, element, attrs) {
        var getTwitter = function () {
            !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
        };
        getTwitter();
	    var renderDashboard = function (widgets, widgetData) {
		for (var i = 0; i <= widgets.length; i++){
            $.each(widgets, function(index, widget){
              if(widget.widgetRowPosition == (i + 1)){
                var widgetDOM = $compile('<div ' + widgetData[widget.widgetId].tag + ' class="propSortable" id="' + widget.widgetId + '" ></div>')(scope);
			    element.find(".widgetContentContainer").append(widgetDOM);
              }
            });
          }
	    }

        //GA event for share options
        var shareButton = element.find(".dropdown-menu li");
        shareButton.bind('click',function(event){
            var label = event.currentTarget.className;
            $rootScope.TrackingService.sendGAEvent('portfolio', 'Shared', label+'-'+$rootScope.CURRENT_ACTIVE_PAGE);
        });

        /*
                if (scope.dashboards) {
                    if (scope.widgets) {
                        var widgetData = scope.widgets;
                        var dbData = scope.dashboards[attrs.id];
                        var widgets = (typeof dbData !== 'undefined') ? dbData.widgets : {};
                        renderDashboard(widgets, widgetData);
                    }
                }
                */
	    scope.$watch('widgets', function(newWidgetValue, oldWidgetValue){
		if (newWidgetValue){
		    scope.$watch('dashboards', function(newValue, oldValue){
			if (newValue){			    
			    var dbData = newValue[attrs.id];
			    var widgetData = newWidgetValue;
			    var widgets = (typeof dbData !== 'undefined') ? dbData.widgets : {};
			    renderDashboard(widgets, widgetData);
			}
		    });
		}
	    });

	    var findWidget = function (widgets, widgetId) {
		var widgetData;
		$.each(widgets, function (idx, val) {
		    if (val.widgetId == widgetId)
			widgetData = [idx, val];
		});
		return widgetData;
	    }

            scope.$on("sortable", function(event, itemIndexList){
		var dbData = scope.dashboards[attrs.id];
		
		$.each(itemIndexList, function(idx, val) {
		    var dt = val.split("=");
		    var widget_id = dt[0].trim();
		    var widget_info = findWidget(dbData.widgets, widget_id);
		    var old_idx = widget_info[0];
		    var widget_obj = widget_info[1];
		    var new_idx = parseInt(dt[1]);
		    var tmp = dbData.widgets[old_idx];
		    
		    dbData.widgets[old_idx] = dbData.widgets[new_idx];
		    dbData.widgets[new_idx] = tmp;
		});
		
		var dashboardId = dbData.id;
		$.each(dbData.widgets, function(idx, val) {
		    val.widgetRowPosition = idx+1;
		    dbData.widgets[idx] = val;
		});
		DashboardService.updateDashboard(dashboardId, dbData).then(function (resp) {
		    scope.dashboards[attrs.id] = dbData;
		});
            });

            scope.$on("leftNavToggle", function(event, toggle){
		if(toggle.toggle == 'close'){
		    $timeout(function() { 
			$('.ContentContainer',element).animate({width:'100%'},1000);               
		    }, 0);
		}
		else{
		    $timeout(function() { 
			$('.ContentContainer',element).animate({width:'77%'},1000);               
		    }, 0);
		}
		scope.$broadcast("dashboardResize", {
		    toggle: toggle
		});
            });
	}
    }
});
