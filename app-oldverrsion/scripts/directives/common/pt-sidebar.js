/**
   * Name: Quicklinks Sidebar Widget Directive
   * Description: Quicklinks Sidebar Widget could be used to create Quicklinks Sidebar Widget in the sidebar.
   * @author: [Nimit Mangal]
   * Date: Sep 30, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptSidebar',['$timeout', function($timeout){
    return{
      restrict : 'A',
      templateUrl : 'views/directives/common/pt-sidebar.html',
      //replace : true,
      transclude: true,
	  link:function(scope, element){
	  	scope.toggle = "open";
		scope.toggleSideBar = function(){
			if(scope.toggle == "open"){
				scope.toggle = "close";
				$timeout(function() { 
		           $('#sidebarCon',element).addClass('open').animate({ left:'-23%'},1000);				
				   $('.left-arrow',element).addClass('fa-chevron-right').removeClass('fa-chevron-left');
		        }, 0);
			}
			else{
				scope.toggle = "open";
				$timeout(function() { 
		           $('#sidebarCon',element).animate({ left:'0%'},1000);
				   setTimeout(function(){
					   $('#sidebarCon',element).removeClass('open');
					   }, 1000);
		           $('.left-arrow',element).addClass('fa-chevron-left').removeClass('fa-chevron-right');
		        }, 0);
			}
			scope.$broadcast("leftNavToggle", {
              toggle: scope.toggle
            });
		}
	  },
	  controller: function($scope, $element){
	  	
	  }
    }
}]);