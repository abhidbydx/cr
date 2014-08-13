/**
 * Name: Project Overview Directive
 * Description: Use this directive to show overview on Project Page.
 * @author: [Nakul Moudgil]
 * Date: Dec 27, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptProjectspecification', function() {
  return {
    restrict : 'A',
    templateUrl : 'views/directives/project/specification.html',
    controller : function($scope, $element, $attrs) {
        $scope.val = $scope.project;
        $scope.checkObject = function(obj) {
            if (typeof obj === 'object') {
                return true;
            }
            return false;
        }        
        $scope.isSpecCollapsed = true;
        $scope.arrowSpecState = 'down';
        var specElement = $('div#specs');
        $(specElement.children()).slideUp();
        $scope.specToggle = function(){
            if($scope.isSpecCollapsed){
                $scope.isSpecCollapsed = !$scope.isSpecCollapsed;
                $scope.arrowSpecState = 'up';
                $(specElement.children()).slideDown();
            }
            else{
                $scope.isSpecCollapsed = !$scope.isSpecCollapsed;
                $scope.arrowSpecState = 'down';
                $(specElement.children()).slideUp();
            }
        };
    },
    link : function(scope, element, attrs) {
    }
  }
});