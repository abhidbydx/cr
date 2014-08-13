'use strict';
angular.module('serviceApp').controller('compare', ['$rootScope', 
	'$scope', 		
	'CompareStorage',	
	'$filter',
	'SearchService',
	'ProjectService',
	'ProjectParser',
	'Constants',
	'CommonLocationService',
	'LocalityParser',
	function($rootScope, 
			$scope, 					
			CompareStorage, 			
			$filter, 
			SearchService, 
			ProjectService, 
			ProjectParser, 
			Constants,
			CommonLocationService,
			LocalityParser) {
		
		var MAX_PROJECTS = Constants.COMPARE.MAX_PROJECTS,

		projects = [],

		bucketProjects = CompareStorage.projects,

		updateSelection = function (allProjects) {
			if (allProjects){
				if(allProjects.length > MAX_PROJECTS){
					return $filter('filter') (allProjects, function(project) {
						return project.selected === true;
					});
				} else {
					return allProjects;	
				}
			} else {
				return [];
			}
		},

		handleProjectDetail = function(rawProject, cmpProject) {
		
			var project = ProjectParser.parseProject(rawProject.data, true);
			project.selected = true;
			if(project.properties && project.properties.length){
				project.minBathrooms = project.properties[0].bathrooms;
				project.maxBathrooms = project.properties[project.properties.length - 1].bathrooms;
				project.minSize = project.properties[0].size;
		 		project.maxSize = project.properties[project.properties.length-1].size;
		 	}

		 	var localityData = function(locality) {	
				project.locality = LocalityParser.minimalLocality(locality);

				CompareStorage.addToBucket(project);
			};
			
			CommonLocationService.getBasicInfo("locality", project.locality.localityId, localityData);

			cmpProject.PROJECT = project;
		},


		add = function(projectId){
			
			var cmpProject = {};

			projects.push(cmpProject);
			
			ProjectService.getProjectDetail(projectId, handleProjectDetail, cmpProject);

			return cmpProject;
		},

		remove = function(projectId){
			var project = _.find(projects, function(project){
				return project.PROJECT.projectId === projectId;
			}),
			projIndex = projects.indexOf(project);

			if(projIndex != -1){
				projects.splice(projIndex,1);
				CompareStorage.removeFromBucket(project.PROJECT);	
			}
			
		};
		

		bucketProjects = updateSelection(bucketProjects);

		$scope.projects = projects;
		$scope.remove = remove;

		_.each(bucketProjects, function(project){	
			add(project.projectId);	
		});

		// $scope.addProjectError = 'Project already Added';

		// updateSelection(CompareStorage.projects);

		// $scope.$on('CompareStorage.update', function(event, projects) {
		// 	updateSelection(projects);
		// });

		$scope.projectSuggestions = function(text){
			return SearchService.getProjectSuggestions(text).then(function(response){
            	return response.data.data;
        	});
		};
		
		$scope.projectSelected = function(item){
			var addedProject = add(item.id.replace('TYPEAHEAD-PROJECT-',''));
			if(addedProject){
				addedProject.selected = true;
				$scope.addFailed = false;
			}
			else{
				$scope.addFailed = true;
			}
				
		};		
		//set page name
		$rootScope.CURRENT_ACTIVE_PAGE = 'Compare';
		//Page view call for GA/MIXPANEL			
		$rootScope.TrackingService.pageViewedCall();
    
	}
]);
