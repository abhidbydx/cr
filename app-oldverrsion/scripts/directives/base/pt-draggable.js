/**
   * Name: Draggable Directive
   * Description: pt-draggable could be used as an attribute on any html element to make it draggable.
   * @author: [Nakul Moudgil]
   * Date: Sep 13, 2013 
**/
'use strict';
angular.module('serviceApp').directive('ptDraggable',function(){
    return{
      restrict : 'A',
      scope: true,
  	  replace : true,
      link : function(scope, element, attrs){        
        if(attrs.ptDraggable == "true"){
          element.draggable({
          	cursor: "move"
        	});
        }
      }
    }
});