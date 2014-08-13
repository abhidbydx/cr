/**
 * Name: Project Header Bar Directive
 * Description: Use this directive header bar on Project Page.
 * @author: [Nakul Moudgil]
 * Date: Dec 26, 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptProjectheaderbar', function() {
	return {
		restrict : 'A',
		templateUrl : 'views/directives/project/headerBar.html',
		controller : function($scope, $element, $attrs, $location, Formatter) {
			$scope.callerLocation = 'Top';
            $scope.$watch('project.localityCard', function (newVal) {
                if (newVal) {
                    if ($scope.project.localityCard && (($scope.project.localityCard.amenityTypeCount && _.keys($scope.project.localityCard.amenityTypeCount).length > 0) || $scope.project.localityCard.description)) {
                        $scope.showCard = true;
                    } else {
                        $scope.showCard = false;
                    }
                }
            })
			$scope.$watch('prop_selected',function(newVal, oldVal){
				if(newVal){
					$scope.property = newVal;	
				}
			});			

			$scope.update_prop = function(prop) {
			    $location.path(prop.url);
			    // Formatter.goToEl('prop_options');
			};

            if (parseInt($scope.project.maxPrice) > 0 && parseInt($scope.project.minPrice) > 0) {
                $scope.priceRange = ($scope.project.maxPrice == $scope.project.minPrice) ? $scope.project.maxPrice : ($scope.project.minPrice + ' - ' + $scope.project.maxPrice);
            }

            if ($scope.propList && $scope.propList.length <= 2) {
                if ($scope.propList[0] && parseInt($scope.propList[0].value) > 0) {
                    $scope.priceRange = $scope.propList[0].value;
                } else {
                    $scope.priceRange = '';
                }
            }
		},
		link : function(scope, element, attrs) {
		}
	}
});
