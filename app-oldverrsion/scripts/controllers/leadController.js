//TODO Why  is item and urlData having different data structures?

'use strict';

angular.module('serviceApp').controller('leadController', ['$scope', 'LeadService', '$location', function ($scope, LeadService, $location) {
    var leadData = {};
    if ($location.path() === "/contactus") {
        leadData.type = "contactus";
    }
    $scope.myData = LeadService.updateLeadData(leadData);
    $scope.cEnabled=true;
    $scope.lEnabled=false;
    $scope.$on("leadpushed", function (evt) {
	evt.stopPropagation();        
    });
}]);
