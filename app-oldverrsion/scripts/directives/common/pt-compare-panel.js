
'use strict';
angular.module('serviceApp').directive('ptComparePanel',function(){
	return {
		restrict: 'A',
		scope: { 
			project: '=',
			remove: '='
		},
		templateUrl: 'views/directives/common/pt-compare-panel.html',
		controller : function($scope,LeadService){
				  $scope.openLeadForm = function( $event, type, formName, property ) {
					$event.stopPropagation();
					var leadData = {
						type : type,
						cityId : $scope.project.locality.cityId,
						localityId : $scope.project.localityId,
						projectId : $scope.project.projectId,
						projectName : $scope.project.name,
						builderName : $scope.project.builder.name,
						fromALV     : false,
						ui_php : 'compare.php',
						formlocationinfo : formName
					};
				if (property) {
				leadData['propertyDetail'] = {
					unitName: property.unitName,
					measure: property.measure,
					size: property.size
				};
				}
				LeadService.openLeadForm( leadData );
			}; 
		}	
	}
	
	
});
