'use strict';

angular.module('serviceApp')
.factory('CompareStorage', ['$rootScope', 
							'$filter', 
							'CommonLocationService',
							'LocalityParser',
							'ProjectService',
							'ProjectParser',
							function($rootScope, 
							 		$filter, 
							 		CommonLocationService,
							 		LocalityParser,
							 		ProjectService,
									ProjectParser) {


	var projects, storedProjects,

	bucketProjects = $.jStorage.get('PT_CMP'),

	// Standard for adding to compare bucket   keys => projectId, imageURL, locality, locality.suburb.city.label, builder.name
	addToBucket = function(project){

		var existingProject = exist(project.projectId);

		 if(existingProject) {
		 	existingProject.selected = true;
		 	$rootScope.$broadcast('UpdateProjectSelection');
		 	return false;
		 }

		var bucketProject = {
			name: project.name,
			projectId : project.projectId,
			imageURL: project.imageURL,
			URL 	: project.URL,
			locality: project.locality.label,
			city: project.locality.suburb.city.label,
			builder: project.builder.name,
			selected: project.selected,
			url: project.URL
		};

		bucketProjects.push(bucketProject);
		$.jStorage.set('PT_CMP',bucketProjects);
		if(project.selected){
			$rootScope.$broadcast('UpdateProjectSelection');
		}
		
	},

	removeFromBucket = function(project, location){
		var project = exist(project.projectId),
		projIndex = bucketProjects.indexOf(project);	
		if(projIndex != -1){
			bucketProjects.splice(projIndex, 1);

			if(bucketProjects.length <= 4){
				_.each(bucketProjects, function(project){
					project.selected= undefined; 
				});
			}
			$.jStorage.set('PT_CMP',bucketProjects);	
			//GA/mixpanel On remove compare item
			tracking('Removed', location, project.projectId, 'Removed from Compare');		
		}
	},

	exist = function(projectId){
		return _.find(bucketProjects, function(bucketProject){
			return bucketProject.projectId === projectId;
		});
    },

	disable = function(){
    	return bucketProjects.length >=10;
    },

	toggle = function(project, location){
		if(exist(project.projectId)){
			removeFromBucket(project, location);			
		} else{
			addToBucket(project);
			//GA/mixpanel On add compare item
			tracking('Added', location, project.projectId, 'Added to Compare');
		}
	},	
	//GA/mixpanel tracker function
	tracking = function(action, location, projectId, mixpanelEvent){
		  $rootScope.TrackingService.sendGAEvent('compare', action, location+'-'+$rootScope.CURRENT_ACTIVE_PAGE); 	 
		  //mixpanel tracker 
		  var locationKey = action+' From';
		  var compObj = new Object;
		  compObj[locationKey] = location
		  compObj['Project ID'] = projectId
		  compObj['Page Name'] = $rootScope.CURRENT_ACTIVE_PAGE; 
		  $rootScope.TrackingService.mixPanelTracking(mixpanelEvent, compObj);  
	 };

	// broadcastUpdate = function(){
	// 	$rootScope.$broadcast('CompareStorage.update', projects);
	// },

	// updateSelection = function(){
	// 	broadcastUpdate();
	// };

	if(!bucketProjects){
		bucketProjects = [];
	}

	return {
		projects: bucketProjects,
		toggle: toggle, 
		removeFromBucket: removeFromBucket,
		addToBucket: addToBucket,
		exist: exist, 
		disable: disable,
	}; 
}]);
