/**
 * Name: Confirmation pop up Directive
 * Description: Use this directive to show any confirmation message in the application.
 * @author: [Nakul Moudgil]
 * Date: Sep 13, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptConfirmclick', function() {
  return {
  	restrict : 'A',
    //priority: 1,
    //terminal: true,
    scope: true,
    controller : function($rootScope, $scope, $element, $attrs, GlobalService){
      if($attrs.ptConfirmclick){
        $scope.msg = GlobalService.getObjectValuebyString($rootScope, $attrs.ptConfirmclick);// || "Are you sure?";
        $scope.clickAction = $attrs.ptClick;
      
      }
    },
    link: function (scope, element, attr) {
      element.bind('click',function () {
        if ( window.confirm(scope.msg) ) {
          scope.$eval(scope.clickAction)
        }
      });
    }
  };
});