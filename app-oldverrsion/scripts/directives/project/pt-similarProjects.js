/**
 * Name: Similar Projects Directive
 * Description: Use this directive to show similar projects.
 * @author: [Nakul Moudgil]
 * Date: Jan 6, 2014
**/
'use strict';
angular.module('serviceApp').directive('ptSimilarprojects',['Formatter', function(Formatter) {
  return {
    restrict : 'A',
    templateUrl : 'views/directives/project/similarProjects.html',
    controller : function($scope, $element, $attrs, ProjectService, PropertyService,$rootScope) {
      var projectTypes = ['Similar Projects','Nearby Projects'];
      if ( !( $scope.project.latitude && $scope.project.longitude ) ) {
      	$scope.hideNearBy = true;
      }
      $scope.currentIndex = 0;
			$scope.classIndex = ['active', ''];
			$scope.current_header = 'Similar Projects';

			$scope.$watch('project', function (newValue, oldValue) {
				if (newValue) {
					getProjects(newValue.projectId);
					setTitles();
				}
			});

			$scope.$watch('isPropertyPage', function(newVal, oldVal){
				if (newVal) {
					$scope.current_header = 'Similar Properties';
					getProjects($scope.prop_selected.id);
				} else {
					$scope.current_header = 'Similar Projects';
					getProjects($scope.project.projectId);
				}
			});

      var setTitles = function(){
        if($scope.currentIndex === 0){
          $scope.currentProjectType = projectTypes[0];
          $scope.otherProjectType = projectTypes[1];      
        }
        else{
          $scope.currentProjectType = projectTypes[1];
          $scope.otherProjectType = projectTypes[0];
        }
      }

      var getProjects = function(id){
        if($scope.currentIndex === 0){
          //Call Similar projects API
					if ($scope.isPropertyPage) {
						PropertyService.getSimilarProperties(id, $scope.populateSimilarProjects);
					} else {
						ProjectService.getSimilarProjects(id, $scope.populateSimilarProjects);
					}
        }
        else{
          //Call Nearby projects API
					var projectObj = {'lat': $scope.project.latitude, 'long': $scope.project.longitude, 'id': $scope.project.projectId};
          ProjectService.getNearbyProjects(projectObj, $scope.populateSimilarProjects);
        }
      };

      $scope.changeProjectType = function(index){
				if($scope.currentIndex !== index){
					$scope.currentIndex = index;
					$scope.classIndex[$scope.currentIndex] = 'active';
					$scope.classIndex[1 - $scope.currentIndex] = '';
					if ($scope.isPropertyPage) {
						getProjects($scope.prop_selected.id);
					} else {
						getProjects($scope.project.projectId);
					}
					setTitles();
				}
      }

      $scope.populateSimilarProjects = function(data){
				if (data) {
					$.each(data, function(item, attr){
						var prop_image = attr.project ? attr.project.imageURL : attr.imageURL;
						attr.smallImage = Formatter.getImagePath(prop_image,'SMALL');
					});
					$scope.projects = data;
				}
      }
      
      $scope.widgetTracking = function(index,projectid,cityid){
				var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
				var label = "";
					if(index == "active")
					  label = "Similar Projects";
					else
					  label = "Nearby Projects";
				//Send GA/Mixpanel tracker event request when graph clicked
				 var subLabel = label+"-"+pageType;   
				 $rootScope.TrackingService.sendGAEvent("panel", "clicked", subLabel);
				 $rootScope.TrackingService.mixPanelTracking("Widget Clicked",{"Widget Name":label,"Project Id":projectid,"City Id":cityid,"Page Name":pageType}); 
 
				
			} 
    }
  }
}]);
