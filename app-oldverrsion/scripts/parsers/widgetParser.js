/**
   * Name: Widget Parser
   * Description: It will convert widget service response into format required by ui.    
   * @author: [Nakul Moudgil]
   * Date: Oct 10, 2013
**/
'use strict';
angular.module('serviceApp')
.factory('WidgetParser', function () {
    return {
    	parse: function(res){
    		var data = {};
    		$.each(res,function(index, value){
    			data[value.id] = value;
    		});
    		return data;
    	}
    };
});