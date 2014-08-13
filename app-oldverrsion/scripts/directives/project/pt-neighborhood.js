/**
 * Name: Project Overview Directive
 * Description: Use this directive to show overview on Project Page.
 * @author: [Nakul Moudgil]
 * Date: Dec 27, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptProjectneighborhood', function() {
  return {
    restrict : 'A',
    templateUrl : 'views/directives/project/neighborhood.html',
    controller : function($scope, $element, $attrs) {
    	$scope.showTopReview = true;
    }
  };
});
