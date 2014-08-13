
'use strict';
angular.module('serviceApp').directive('textBlock', function() {
	return {
		restrict: 'A',
		scope: {
			text: '=',			
			classname: '@'			
		},
		template: '<div ng-class="classname"><span>{{text}}</span></div>',	
		link: function(scope, element, attrs) {
			
		}
	};
});
