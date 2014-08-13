'use strict';
angular.module('serviceApp').directive('ptPropertyListingsRow',function(){
    return {
		restrict: 'A',
		templateUrl: 'views/directives/common/pt-property-listings-row.html',
		scope:{
			property: '=',
			project: '=',
			showLeadForm: '=',
			showErrorForm: '=',
			floorplanimagelist: "=",
			showFloorPlanColumn: "=",
			page: "="
		},
        controller: function($scope, $rootScope, $location, FullScreenService) {
            var project = $scope.project, property = $scope.property;
            if ($rootScope.urlData.pageType == 'projectdetail') {
                $scope.followUrl = $scope.property.URL;;
                $scope['class'] = 'noBlueLink';
            } else {
                $scope.followUrl = $scope.property.URL;
                $scope['class'] = '';
            }

            $scope.openImageModal = function () {
                $scope.$emit('open_floor_plan', $scope.property.propertyId);
            };

            $scope.showGetFloorPlan = ($scope.property.bedrooms != 0 && !$scope.property.floorPlanImage);

            $scope.mergeColumns = !property.size && (project.isPrimary && !property.budget && !project.isSoldOut && project.projectStatus != 'On Hold') && (project.isResale && !property.resalePrice);

			if((project.isPrimary && !property.budget && !project.isSoldOut && project.projectStatus != 'On Hold')  || (project.isResale && !property.resalePrice)){
				project.hasPriceOnRequest = true;
			}
			$scope.propertyTracking = function(category, action, label, itemId, index){			
				var sublabel, clusterObj = {};
				sublabel = label+'-'+$rootScope.CURRENT_ACTIVE_PAGE;				
				clusterObj['Project ID']		= itemId
				clusterObj['Clicked On']		= label
				clusterObj['Listing Number']	= index
				clusterObj['Page Name']			= $rootScope.CURRENT_ACTIVE_PAGE
				$rootScope.TrackingService.sendGAEvent(category, action, sublabel); 
				$rootScope.TrackingService.mixPanelTracking('Clicked Listing', clusterObj);	
				
			}
        }
	};
});
