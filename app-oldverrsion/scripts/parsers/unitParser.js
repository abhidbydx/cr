/**
   * Name: Unit Parser
   * Description: It will convert unit option service response into format required by ui.    
   * @author: [Nakul Moudgil]
   * Date: Oct 18, 2013
**/
'use strict';
angular.module('serviceApp')
.factory('UnitParser', function () {
    return {
    	parse: function(response){
    		var unitRes = {};
        unitRes.properties = [];
        $.each(response.data, function(counter, attr){
          if ( attr.size == null ) {
            attr.sizeMeasure = '';
          }
          else {
            attr.sizeMeasure = '(' + attr.size + ' ' + attr.measure + ')';
          }
          unitRes.properties.push(attr);
        });
        unitRes.builderName = response.data[0].project.builder.name;
        unitRes.builderId = response.data[0].project.builder.id;
        return unitRes;
    	}
    };
});