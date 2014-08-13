/**
 * Name: About Us Sidebar Widget Links Directive
 * Description: About link Sidebar Widget in the sidebar.
 * @author: [Sanjeev Verma]
 * Date: 5 Feb 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptAboutlinks',function(GAService){
    return{
	restrict : 'A',
	//replace : true,
	templateUrl : 'views/directives/common/pt-aboutlinks.html',
	scope: {},
	controller: function($rootScope, $scope, $location){
            $scope.labels = $rootScope.labels;
            $scope.qlWidgetName = $rootScope.labels.common.label.ABOUT_US;
	    $scope.checkActive = function (name) {
		if ($location.path().search(name) !== -1) {
		    return true;
		}
		return false;
	    };
	}
    };
});