
'use strict';
angular.module('serviceApp').directive('ptMoreNewButton',function(){
	return {
		restrict: 'A',
		templateUrl: 'views/directives/common/pt-more-new-button.html',
		scope : {
			 showLeadForm:'=', 
			 showErrorForm:'='
			},
		controller:function($scope, CompareStorage, $timeout, BlockingInfo){
			
		}
	}
});
