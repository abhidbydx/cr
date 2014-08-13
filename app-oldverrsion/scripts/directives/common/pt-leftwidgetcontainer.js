/**
   * Name: Left Widget Container Directive
   * Description: pt-leftwidgetcontainer could be used to create container of left nav widgets. An code related to container of widget
   * should go here. It will make look all left nav widgets consistent and they will have same functionality.
   * @author: [Nakul Moudgil]
   * Date: Sep 12, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptLeftwidgetcontainer',function(){
    return{
      restrict : 'A',
      templateUrl : 'views/directives/common/pt-leftwidgetcontainer.html',
      scope : {
        nameParam : '=nameParam'
      },
      transclude : true      
    }
});