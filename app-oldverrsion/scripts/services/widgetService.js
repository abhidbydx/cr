/**
   * Name: Dashboard Service
   * Description: This service for saving and fetching dashboard details   
   * @author: [Nakul Moudgil]
   * Date: Oct 9, 2013
**/
'use strict';
angular.module('serviceApp')
  .factory('WidgetService', function ($http, GlobalService, WidgetParser) {    
	return $http.get(GlobalService.getAPIURL('data/v1/entity/widget'))
	  .then(function(response){
	    return WidgetParser.parse(response.data.data);
	  });
});