'use strict';
angular.module('serviceApp')
.factory('queryParser', function () {
    return {
    	parse: function(res){


    		var data = {};
    		$.each(res,function(index, value){
    			data[value.name] = value;
    		});
    		return data;


    		
    	}
    };
});