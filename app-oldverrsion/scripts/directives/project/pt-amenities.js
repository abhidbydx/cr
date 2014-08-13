/**
 * Name: Project Overview Directive
 * Description: Use this directive to show overview on Project Page.
 * @author: [Nakul Moudgil]
 * Date: Dec 27, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptProjectamenities', function() {
  return {
    restrict : 'A',
    templateUrl : 'views/directives/project/amenities.html',
    controller : function($scope, $element, $attrs) {
       $scope.val = $scope.project;
			$scope.amenitiesFullList = [
				{
					amenityDisplayName: "24X 7 Security System",
					amenityMaster: {
						abbreviation: 'Sec',
						amenityName: '24 X 7 Security'
					}
				},
				{
					amenityDisplayName: "Gymnasium",
					amenityMaster: {
						abbreviation: 'Gym',
						amenityName: 'Gymnasium'
					}
				},
				{
					amenityDisplayName: "Swimming Pool",
					amenityMaster: {
						abbreviation: 'Swi',
						amenityName: 'Swimming Pool'
					}
				},
				{
					amenityDisplayName: "Power Backup",
					amenityMaster: {
						abbreviation: 'Pow',
						amenityName: 'Power Backup'
					}
				},
				{
					amenityDisplayName: "Sports Facility",
					amenityMaster: {
						abbreviation: 'Spo',
						amenityName: 'Sports Facility'
					}
				},
				{
					amenityDisplayName: "Landscaped Gardens",
					amenityMaster: {
						abbreviation: 'Lan',
						amenityName: 'Landscaped Gardens'
					}
				},
				{
					amenityDisplayName: "Children's play area",
					amenityMaster: {
						abbreviation: 'Chi',
						amenityName: "Children's play area"
					}
				},
				{
					amenityDisplayName: "Indoor Games",
					amenityMaster: {
						abbreviation: 'Ind',
						amenityName: 'Indoor Games'
					}
				},
				{
					amenityDisplayName: "Club house",
					amenityMaster: {
						abbreviation: 'Clu',
						amenityName: 'Club house'
					}
				},
				{
					amenityDisplayName: "Cafeteria",
					amenityMaster: {
						abbreviation: 'Caf',
						amenityName: 'Cafeteria'
					}
				},
				{
					amenityDisplayName: "Jogging Track",
					amenityMaster: {
						abbreviation: 'Jog',
						amenityName: 'Jogging Track'
					}
				},
				{
					amenityDisplayName: "Multipurpose Room",
					amenityMaster: {
						abbreviation: 'Mul',
						amenityName: 'Multipurpose Room'
					}
				},
				{
					amenityDisplayName: "Rain Water Harvesting",
					amenityMaster: {
						abbreviation: 'Rai',
						amenityName: 'Rain Water Harvesting'
					}
				},
				{
					amenityDisplayName: "Golf Course",
					amenityMaster: {
						abbreviation: 'Gol',
						amenityName: 'Golf Course'
					}
				},
				{
					amenityDisplayName: "Intercom Facility",
					amenityMaster: {
						abbreviation: 'Int',
						amenityName: 'Intercom'
					}
				},
				{
					amenityDisplayName: "Maintenance Staff",
					amenityMaster: {
						abbreviation: 'Mai',
						amenityName: 'Maintenance Staff'
					}
				}
			];
			if($scope.project.amenities && $scope.project.amenities.length > 0){
				$scope.amenitiesUnavailable = [];			
				$scope.amenitiesAvailable = $scope.project.amenities.slice(0, -1);
				$scope.amenitiesAvailableDisplay = $scope.amenitiesAvailable.slice(0, 4);
				$scope.customAmenities = $scope.project.amenities.slice(-1)[0];
				$scope.customAmenitiesList = $scope.customAmenities.amenityDisplayName.split(', ');

				for (var amenity in $scope.amenitiesFullList) {
					var currAmenity = $scope.amenitiesFullList[amenity];
					if (typeof currAmenity != 'object')
						break;
					var avFlag = false;
					for (var avAmenity in $scope.amenitiesAvailable) {
						var currAvAmenity = $scope.amenitiesAvailable[avAmenity];
						if (typeof currAvAmenity != 'object')
							break;
						if (currAmenity.amenityMaster && (currAmenity.amenityMaster.amenityName == currAvAmenity.amenityMaster.amenityName)) {
							avFlag = true;
						}
					}
					var othAmenitiesList = $scope.project.amenities.slice(-1)[0].amenityDisplayName.split(', ');
					for (var othAmenity in othAmenitiesList) {
						if (currAmenity.amenityMaster && (currAmenity.amenityMaster.amenityName == othAmenitiesList[othAmenity])) {
							avFlag = true;
						}
					}
					if (!avFlag) {
						currAmenity.cName = 'disabled';
						$scope.amenitiesUnavailable.push(currAmenity);
					}
				}
				$scope.totalAmenities = $scope.amenitiesAvailable.concat($scope.amenitiesUnavailable);
			}
			$scope.isCollapsed = true;
			$scope.arrowState = 'down';
			var element = $('div#amenities');
			$(element.children()).slideUp();
			$scope.toggle = function(){
				if($scope.isCollapsed){
					$scope.isCollapsed = !$scope.isCollapsed;
					$scope.arrowState = 'up';
					$(element.children()).slideDown();
				}
				else{
					$scope.isCollapsed = !$scope.isCollapsed;
					$scope.arrowState = 'down';
					$(element.children()).slideUp();
				}
			}
			$scope.$on('expand_amenities', function (evt, data) {
				$scope.isCollapsed = true;
				$scope.toggle();
			});
			
    },
    link : function(scope, element, attrs) {
    }
  }
});