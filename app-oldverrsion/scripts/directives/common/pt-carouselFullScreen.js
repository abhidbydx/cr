/**
 * Name: ptMaincarousel Directive
 * Description: pt-maincarousel display images in a gallery 
 *
 * @author: [Nakul Moudgil]
 * Date: Dec 12, 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptCarouselfullscreen', function() {
    return {
		restrict : 'A',
		scope : {
			images:'=',
			settings:'=',
			imagesfullview:'=',
			index:'=',
			unique:'='
		},
		template : '<div pt-imagecarousel unique="unique" settings="settings" index="index" images="images" imagesfullview="images"></div>',
		controller: function($scope, $element) {
			$scope.$on("$destroy",function() {
                $element.remove();
            });
		}
	}
});