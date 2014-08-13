/**
 * Name : Enquiry Form Directive
 * Description: Enquire Form Directive is used to display enquiry form
 * @author: [Hemendra Srivastava]
 * Date: Jan 10, 2014
 **/

'use strict';

angular.module('serviceApp').directive('ptEnquireform', ['$timeout', function($timeout){
    return {
	restrict : 'A',
	templateUrl : 'views/directives/common/pt-enquireForm.html',
	// replace : true,
	// scope : {initial:'=', cityEnabled:'=', localityEnabled:'=', redirectTo:'='},
	scope : {initial:'=', localityEnabled: '=', cityEnabled:'=', redirectTo:'=',isModal:'='},
	controller : ["$scope", "$http", "$document", "$window", "$compile", "GlobalService", "LeadService", "SignupService", function($scope, $http, $document, $window, $compile, GlobalService, LeadService, SignupService) {
		if ( GlobalService.isLoggedIn() ) {
			$scope.loggedIn = true;
		}
           
	    $scope.localityEnabled = false;
	    var checkEnquired = function (projectId) {
			var chkUrl = GlobalService.getAPIURL('data/v1/entity/user/enquired?projectId='+projectId.toString());
			return $http({method : 'GET', url : chkUrl}).then(function (response) {
			    if (response.data.statusCode === "2XX") {
				return response.data.data.hasValidEnquiry;
			    }			    
			    return false;
			});	
			
	    };
	    var redirectRed = function (ppc, link, timeout) {
		var redir = $scope.redirectTo || $document[0].URL;
		
		if (ppc === 'TRUE') {
		    var url = '/publisher/red.php?link=' + link + '&pg=' + redir;
		    $timeout(function () {
			$window.location.href = url;
		    }, timeout);
		    return true;
		}
		return false;
	    };
	    
	    var showLeadForm = function () {
		$scope.stage = 'step1';
		$scope.$on("leadposted", function (evt, data) {
		    if (data) {
			$scope.stage = 'step2';
			evt.stopPropagation();
			var vizuryhtml = "<iframe src='http://www.vizury.com/analyze/analyze.php?account_id=VIZVRM949&param=e500&orderid="+data.enquiryid.toString()+"&currency=&section=1&level=1' scrolling='no' width='1' height='1' marginheight='0' marginwidth='0' frameborder='0'></iframe>";
			
			$("#vizuryframe").html($compile(vizuryhtml)({}));
			if (!redirectRed(data.ppc, "projectdetailwithhash", 2000)) {
			    $timeout(function () {
				$scope.$emit("leadpushed", data);
			    }, 3000);
			}
		    }
		});
	    };

	    $scope.showLeadForm = showLeadForm;

	    $scope.$watch("initial", function (n) {
		if (n) {
		    $scope.initial = LeadService.updateLeadData( n, $scope.isModal );
		    
		    if (n.projectId && GlobalService.isLoggedIn()){			
				checkEnquired(n.projectId).then(function (data) {
				    if (data) {
					$scope.stage = 'step3';
				    }
				    else {
					showLeadForm();
				    }
				});
		    } else {
		    	showLeadForm();
		    }
		}
		else if (n !== undefined) {
		    showLeadForm();
		}
	    });

        $scope.openSignIn = function() {
            SignupService.openSignUp( '/portfolio/index' );
        };
        }]
    };
}]);
