/**
 * Name: Project Header Bar Directive
 * Description: Use this directive to show header mified version in left bar on Project Page.
 * @author: [Nakul Moudgil]
 * Date: Dec 27, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptProjectheadersmall', function() {
  return {
    restrict : 'A',
    templateUrl : 'views/directives/project/headerSmall.html',
    controller : function($location, $scope, $element, $attrs, $rootScope, Formatter) {
        $scope.noOfYears = $rootScope.noOfInstallments / 12;
        $scope.$watch('project', function (n, o) {
        if (n) {
        $scope.projectDetails = n;
        if ( !$scope.thisLocalityName ) {
            $scope.thisLocalityName = $scope.project.locality.label;
        }
        if ( !$scope.thisCityName ) {
            $scope.thisCityName = $scope.project.locality.suburb.city.label;
        }
        if ($scope.projectDetails.localityCard && (($scope.projectDetails.localityCard.amenityTypeCount && _.keys($scope.projectDetails.localityCard.amenityTypeCount).length > 0) || $scope.projectDetails.localityCard.description)) {
            $scope.showCard = true;
        } else {
            $scope.showCard = false;
        }
        if (parseInt($scope.projectDetails.maxPrice) > 0 && parseInt($scope.projectDetails.minPrice) > 0) {
            $scope.priceRange = ($scope.projectDetails.maxPrice == $scope.projectDetails.minPrice) ? $scope.projectDetails.maxPrice : ($scope.projectDetails.minPrice + ' - ' + $scope.projectDetails.maxPrice);
        }
        
        }
        if ($scope.propList.length <= 2) {
        if (parseInt($scope.propList[0].value) > 0) {
                    $scope.priceRange = $scope.propList[0].value;
        } else {
                    $scope.priceRange = '';
        }
            }
    }, true);
    $scope.callerLocation = 'Left Panel';

        $scope.$watch('prop_selected',function(newVal, oldVal){
        if(newVal){
        $scope.property = newVal;
        }
    });

    $scope.update_prop = function(prop) {
        $location.path(prop.url);
	// Formatter.goToEl('prop_options');
    };
    },
    link : function(scope, element, attrs) {
    }
  }
});

