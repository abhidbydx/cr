/**
   * Name: Grid Parser
   * Description: It will service response into format required by grid.    
   * @author: [Nakul Moudgil]
   * Date: Oct 06, 2013
**/
'use strict';
angular.module('serviceApp')
.factory('GridParser', function () {
	return {
		parse: function(reqColumns, response){
			var itemList = [],
				assignVal = function(index, attr) {
					if(reqColumns.indexOf(index) > -1) {
						itemTemp[index] = attr;
					}
				};
			for(var i = 0; i < response.length; i++) {
				var item = response[i],
				    itemTemp =	{};
				$.each(item, assignVal);
				itemList.push(itemTemp);
			}
			return itemList;
		}
	};
});