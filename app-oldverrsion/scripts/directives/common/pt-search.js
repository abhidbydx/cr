'use strict';
angular.module('serviceApp').directive('ptSearch', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/directives/common/pt-search.html',
        controller: function($scope, $rootScope, $modal, $location) {
            $scope.validateInputClass = "";
            var formFillCheck = false;
            $scope.setDefaultSort = function() {
                $scope.validateInputClass = "";
                if ($scope.selValue === undefined || $scope.selValue == "") {
                    $scope.validateInputClass = "redBorder";
                }
                //Set GA tracking
                $scope.TrackingService.sendGAEvent('search', 'click', 'submit-'+$rootScope.CURRENT_ACTIVE_PAGE);
            }
            $scope.formFill = function() {
                if (formFillCheck == true) {
                    return;
                } else {
                    formFillCheck = true;
                    var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
                    if($scope.mode === undefined ){
                        $scope.mode = "";
                    }
                    //GA tracker
                    $rootScope.TrackingService.sendGAEvent('search', 'filled', $scope.mode+'-' + pageType);
                    //mixpanel tracker 
                    $rootScope.TrackingService.mixPanelTracking('Search Initiated', {
                        'Searched From' : $scope.mode,
                        'Page Name'     : pageType
                    });
                    //End Ga/mixpanel  
                }
            }
        }
    }
});