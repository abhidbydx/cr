
'use strict';
angular.module('serviceApp').directive('ptWidgetlinkcontainer',function(){
    return{
      restrict : 'A',
      templateUrl : 'views/directives/common/pt-widgetLinkContainer.html',
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
		  		element.find('#anchorArrow').addClass('fa-chevron-up').removeClass('fa-chevron-down');
				$(element.children()[0].children[1]).slideDown();
				}
			else{
				scope.isCollapsed = !scope.isCollapsed;
				element.find('#anchorArrow').addClass('fa-chevron-down').removeClass('fa-chevron-up');
				$(element.children()[0].children[1]).slideUp();
				}	
        }
		scope.toggle();
      }
    }
});