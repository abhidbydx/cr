'use strict';
angular.module('serviceApp').controller('compareBucket', 
	['$rootScope', 
	'$scope', 
	'CompareStorage',
	'$window',
	'$filter',
	'ENV',
	function ($rootScope, $scope, CompareStorage, $window, $filter, ENV) {

		var selectedProjects, projects;

		$scope.projects = CompareStorage.projects;


		$scope.updateSelection = function(){
			$scope.selectedProjects = $filter('filter')($scope.projects, function(proj){
				return proj.selected === true;
			});

			if($scope.projects && $scope.projects.length <= 4){
				_.each($scope.projects, function(project){
					project.selected = false;
				});
			}
			$.jStorage.set('PT_CMP', $scope.projects);
		};

		$scope.updateSelection();

		projects = $scope.projects;
		selectedProjects = $scope.selectedProjects;

		$scope.removeFromCompare = CompareStorage.toggle;

		$scope.compare = function () {
			if($scope.enableCompare){
				$window.open('compare');
				//GA/mixpanel On compared item
				var compObj = {}, pageType = $rootScope.CURRENT_ACTIVE_PAGE;
				$rootScope.TrackingService.sendGAEvent('compared', 'compare', 'Header'+'-'+pageType); 	 
				//mixpanel tracker  				
				compObj['Compared from'] = 'Header'				
				compObj['Page Name'] = pageType; 
				$rootScope.TrackingService.mixPanelTracking('Compared', compObj);  
				mixpanel.people.increment("Compared");		
			}
		};

		$scope.toggleCompareBucket = function(){
			if($("#compare_bucket>ul").css('display') == "none"){
				$("#compare_bucket>ul").slideDown();	
			} else {
				$("#compare_bucket>ul").slideUp();	
			}
		}

		$scope.$on('UpdateProjectSelection', function(){
			$scope.updateSelection();
		});

		$scope.$watch("selectedProjects.length", function(newLen){

			if(projects && projects.length > 4){
				if(!newLen || newLen < 2 ){
					$scope.compareButtonTitle = "Mark atleast two projects for comparison"
					$scope.enableCompare = false;
				}
				else{
					$scope.compareButtonTitle = ""
					$scope.enableCompare = true;	
				}
			}
		});

		$scope.$watch("projects.length", function(newLen){
			if(newLen && newLen < 2){
				$scope.compareButtonLabel = "Compare";
				$scope.compareButtonTitle = "Select atleast 2 projects";
				$scope.enableCompare = false;
			}
			else if(newLen > 1 && newLen <= 4){
				$scope.compareButtonTitle = "";	
				$scope.compareButtonLabel = "Compare";
				$scope.enableCompare = true;
			}
			else if( newLen && newLen > 4){
				$scope.compareButtonLabel = "Compare Selected"

				if(!selectedProjects.length || selectedProjects.length < 2){
					$scope.compareButtonTitle = "Mark atleast two projects for comparison"
					$scope.enableCompare = false;
				}
			}
		});
	}
]);
