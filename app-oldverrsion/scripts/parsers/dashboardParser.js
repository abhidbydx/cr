/**
   * Name: Dashboard Parser
   * Description: It will convert dashboard service response into format required by ui.    
   * @author: [Nakul Moudgil]
   * Date: Oct 10, 2013
**/
'use strict';
angular.module('serviceApp')
  .factory('DashboardParser', function () {
    return {
      parse: function(res){
        var data = {};
        if ( res ) {
          $.each(res,function(index, value){
              data[value.name] = value;
          });
        }
        return data;
      }
    };
  });