/**
   * Name: Widget Container Directive
   * Description: pt-widgetcontainer could be used to create container of widget. An code related to container of widget
   * should go here. It will make look all widgets consistent and they will have same functionality.
   * @author: [Nakul Moudgil]
   * Date: Sep 12, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptWidgetcontainer',function(){
    return{
      restrict : 'A',
      templateUrl : 'views/directives/common/pt-widgetContainer.html',
      //replace : true,
      transclude: true,
      scope : {nameParam : '=nameParam'},
      controller : function($scope){
        $scope.$watch('nameParam', function(newVal, oldVal){
          if(newVal){
            $scope.name = newVal;
        }
	    
        });
      },
      link : function(scope, element, attrs){        
        scope.isCollapsed = false;
        scope.toggle = function(){
			if(scope.isCollapsed){
				scope.isCollapsed = !scope.isCollapsed;
		  		element.find('#widgetArrow').addClass('fa-chevron-up').removeClass('fa-chevron-down');
				$(element.children()[0].children[1]).slideDown();
				}
			else{
				scope.isCollapsed = !scope.isCollapsed;
				element.find('#widgetArrow').addClass('fa-chevron-down').removeClass('fa-chevron-up');
				$(element.children()[0].children[1]).slideUp();
				}	
        }
      }
    }
});