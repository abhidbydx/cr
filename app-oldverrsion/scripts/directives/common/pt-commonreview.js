'use strict';
angular.module('serviceApp').directive('ptCommonreview', function() {
    return {
        restrict : 'A',
        templateUrl : 'views/directives/common/pt-common-review.html',
        controller : function( $scope ) {
            $scope.LocalityNameForReview = $scope.project.locality.label;
            $scope.LocalityIdForReview = $scope.project.locality.localityId;
        }
    };
});