/***
 * Name: Report Error Service
 * Description: To open and submit error report from property options
 * @author: [Swapnil Vaibhav]
 * Date: Jan 22, 2014
 ***/
'use strict';

angular.module( 'serviceApp' )
    .factory('ErrorReportService', ["$modal", "GlobalService", "$rootScope", function( $modal, GlobalService, $rootScope ) {
        
        var updateFormData = function( formData ) {
            var a = $rootScope.userInfo;
            if (a && a.EMAIL) {
                formData.email = a.EMAIL;
            }
            formData.error="rate";
            return formData;
        };

        var openErrorForm = function( projId, propId ) { 
            $modal.open({
                templateUrl: 'views/modal/errorform.html',
                controller : ["$scope", "$modalInstance", function ($scope, $modalInstance) {
					//GA/Mixpanel When user Clicking "Report Error" Link
					$scope.TrackingService.sendGAEvent('error', 'open', 'report-'+$scope.CURRENT_ACTIVE_PAGE); 
					$scope.TrackingService.mixPanelTracking('Viewed Report Error Form', {'Page Name': $scope.CURRENT_ACTIVE_PAGE});			 
					//End mixpanel					
                    $scope.formData = updateFormData({});
                    $scope.projectId = projId;
                    $scope.propId = propId;
                    $scope.cancel = function () {
                        $modalInstance.dismiss( 'cancel' );
                    };
                    $scope.$on("errorsaved", function (evt) {
                        evt.stopPropagation();
                        $scope.cancel();
                    });
                }]
            });
        };

        return {
            openErrorForm : openErrorForm
        };
    }]);
