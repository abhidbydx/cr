
/**
   * Name: Dashboard Service
   * Description: This service for saving and fetching dashboard details   
   * @author: [Nakul Moudgil]
   * Date: Oct 9, 2013
**/
'use strict';
angular.module('serviceApp')
    .factory('DashboardService', function ($http, GlobalService, DashboardParser, LoadingService) {    

    	var url = GlobalService.getAPIURL('data/v1/entity/user/{userId}/dashboard');
    	
      var getDashboards = function (){
        LoadingService.showLoader();
        if(GlobalService.getUserId()){
          return $http.get(url).then(function(response){
            LoadingService.hideLoader();
              return DashboardParser.parse(response.data.data);
          });
        }
        else{
          if(window.location.pathname==='/portfolio/index/'){
               window.location.href = '/property-portfolio-tracker.php';
        }else{
               window.location.href = '/'; 
        }

        }
      };

  	var saveDashboard = function(dashboardId, data){
  	  return $http.post(url,data)
  		.then(function(response){
  		    return response.data;
  		});
  	};

	var updateDashboardWidget = function(dashboardId, widgetId, data){
	    var url_upd = url + "/" + dashboardId + "/widget/" + widgetId;
  	  return $http.put(url_upd,data)
  		.then(function(response){
  		    return response.data;
  		});
  	};

	var updateDashboard = function(dashboardId, data){
	    var url_upd = url + "/" + dashboardId;
  	    return $http.put(url_upd,data)
  		.then(function(response){
  		    return response.data;
  		});
  	};
	
	
	return {
	    getDashboards: getDashboards,
	    saveDahsboard: saveDashboard,
	    updateDashboardWidget: updateDashboardWidget,
	    updateDashboard: updateDashboard
	};
});