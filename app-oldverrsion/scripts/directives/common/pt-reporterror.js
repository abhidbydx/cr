'use strict';

angular.module('serviceApp').directive('ptReporterror', ['$timeout', function($timeout) {
    return {
	restrict : 'A',
	templateUrl : 'views/directives/common/pt-reporterror.html',
	// replace : true,
	scope : {formData:'=', projectId:'=', propId:'='},
	controller : ["$scope", "$location", "$http", "GlobalService", '$rootScope', function($scope, $location, $http, GlobalService, $rootScope) {
	    $scope.step="step1";
	    $scope.detailsError = "";
	    $scope.save = function(data) {			
	    	$scope.detailsError = "";
	    	$scope.emailError = "";
	    	if (data.email) {
		    	var emailAtPos = data.email.trim().indexOf('@');
		    	var emailDotPos = data.email.trim().lastIndexOf('.');
		    	if (emailAtPos < 1 || emailDotPos < (emailAtPos + 2) || emailDotPos + 2 >= data.email.trim().length) {
		    		$scope.emailError = "Invalid Email Address";
	    			return false;
		    	}
		    }
	    	if (!data.txtcomment) {
	    		$scope.detailsError = "Details about the error is necessary";
	    		return false;
	    	}
		var post_data = {
		    errorType: data.error,
		    details: data.txtcomment,
		    email: data.email,
		    url: $location.absUrl()
		};
		$scope.step="step2";
		var url;
		if ($scope.propId) {
		    url = "data/v1/entity/property/" + $scope.propId.toString() + "/report-error";
		} else {
		    url = "data/v1/entity/project/"+$scope.projectId.toString()+"/report-error";
		}
		
		$http({
		    method : 'POST',
		    url : GlobalService.getAPIURL( url ),
		    data : post_data,
		}).then(function (data) {
		    $timeout(function () {$scope.$emit("errorsaved", data); }, 2000);
		    //GA/Mixpanel When user submit "Report"
			$rootScope.TrackingService.sendGAEvent('error', 'clicked', 'report-'+post_data.errorType+'-'+$rootScope.CURRENT_ACTIVE_PAGE); 
			$rootScope.TrackingService.mixPanelTracking('Report Error Submitted', {'Option Name': post_data.errorType, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});			 
			//End mixpanel							
		});
	    };
	    //GA/Mixpanel When user change error report options
	    $scope.optionChange = function( optionName ){
			$rootScope.TrackingService.sendGAEvent('error', 'selected', optionName+'-'+$rootScope.CURRENT_ACTIVE_PAGE); 
		}
	}]
    };
}]);
