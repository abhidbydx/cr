/**
 * Name: Quicklinks Sidebar Widget Directive
 * Description: Quicklinks Sidebar Widget could be used to create Quicklinks Sidebar Widget in the sidebar.
 * @author: [Nimit Mangal]
 * Date: Sep 30, 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptQuicklinks',function(GAService){
    return{
	restrict : 'A',
	//replace : true,
	templateUrl : 'views/directives/common/pt-quicklinks.html',
	scope: {},
	controller: function($rootScope, $scope, $location){
            $scope.labels = $rootScope.labels;
            $scope.qlWidgetName = 'Quick Links';
            $scope.sendGAEvent = GAService.sendGAEvent;
	    $scope.checkActive = function (name) {
		if ($location.path().search(name) !== -1) {
		    return true;
		}
		return false;
	    };
	}
    };
});