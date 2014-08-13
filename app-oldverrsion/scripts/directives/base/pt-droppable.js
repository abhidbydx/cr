/**
   * Name: Draggable Directive
   * Description: pt-droppable could be used as an attribute on any html element to make it droppable.
   * @author: [Nakul Moudgil]
   * Date: Sep 13, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptDroppable',function(){
    return{
	    restrict : 'A',
	    scope: true,
		replace : true,
	    controller:function($scope){},
	    link : function(scope, element, attrs){
	        element.droppable({
		        hoverClass: "drop-hover"
	      });
      }
    }
});