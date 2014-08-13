/**
 * Name: Project Overview Directive
 * Description: Use this directive to show overview on Project Page.
 * @author: [Nakul Moudgil]
 * Date: Dec 27, 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptProjectoverview', function() {
    return {
	restrict : 'A',
	templateUrl : 'views/directives/project/overview.html',
	controller : function($scope, $element, $attrs, Constants, $rootScope) {
	    $scope.$watch('project', function (n, o) {
		if (n) {
		    $scope.val = $scope.project;
		    if ($scope.val.possessionDateTstamp && new Date($scope.val.possessionDateTstamp) < new Date()) {
			$scope.possessionString = "COMPLETED";
		    } else {
			$scope.possessionString = "POSSESSION";
		    }
		    var neighborhood = [];
		    for (var item in $scope.val.neighborhood) {
			if ($scope.val.neighborhood[item].count > 0) {
			    neighborhood.push($scope.val.neighborhood[item]);
			}
		    }
		    $scope.val.neighborhood = neighborhood;
		    $scope.moreFlag = false;           
		    $scope.showStatusRibbon = false;
		    $scope.updateFlag = function(flag){
			$scope.moreFlag = flag;
		    };
		    $scope.expandAmenities = function(){
			$rootScope.$broadcast('expand_amenities');
		    };
		    if(Constants.VALID_PROJECT_STATUS.indexOf($scope.val.projectStatus) > -1){
			$scope.showStatusRibbon = true;
		    }
		    if($scope.project.amenities && $scope.project.amenities.length > 0){
			$scope.amenityLength = $scope.project.amenities ? $scope.project.amenities.slice(0, -1).length + $scope.project.amenities.slice(-1)[0].amenityDisplayName.split(', ').length : 0 ;
			$scope.amenitiesAvailable = $scope.project.amenities.slice(0, -1);
			$scope.amenitiesAvailableDisplay = $scope.amenitiesAvailable.slice(0, 4);  
		    }
		    else{
			$scope.amenityLength = 0;        
		    }
		    $scope.showNeighborhood = _.keys($scope.val.neighborhood).length > 0;
		    if ($scope.val.projectStatus == 'On Hold') {
			$scope.availability = 'None';
		    } else if ($scope.val.isSoldOut) {
			$scope.availability = 'Yes (Resale Homes Only)';
		    } else if ($scope.val.isPrimary && $scope.val.isResale) {
			$scope.availability = 'Yes (Both New & Resale)';
		    } else if ($scope.val.isPrimary && !$scope.val.isResale) {
			$scope.availability = 'Yes (New Homes Only)';
		    } else if (!$scope.val.isPrimary && $scope.val.isResale) {
			$scope.availability = 'Yes (Resale Homes Only)';
		    }
		}
	    }, true);
	},
	link : function(scope, element, attrs) {
	}
    }
});
