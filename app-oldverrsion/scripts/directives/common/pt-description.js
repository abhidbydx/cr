
'use strict';
angular.module('serviceApp').directive('ptDescription',['Constants', '$rootScope',function(Constants, $rootScope){
	return {
		restrict: 'A',
		scope: {description : '=', shortLength : '=?', largeLength: '=?', link : '=?', label : '=?', descModal : '=?', callerid: '=', callertype: '@'},
		templateUrl: 'views/directives/common/pt-description.html',
		controller: function($scope, $rootScope) {
			if(!$scope.shortLength){
				$scope.shortLength = Constants.DESCRIPTION.SHORT_LENGTH;
			}
			$scope.$watch('description', function(newDescription,oldDescription){  

	            if(newDescription){ 
	                $scope.description = newDescription ? newDescription.trim() : "";
			
					$scope.mDescription = newDescription.substr(0, $scope.shortLength);

					$scope.$on('CardReduced', function(){
               			 $scope.mDescription = newDescription.substr(0, $scope.shortLength);	
            		});

		            $scope.$on('CardExpanded', function(){
		                $scope.mDescription = newDescription.substr(0, $scope.largeLength);	
		            });
	            }
        	})
			
            
            //Send GA/Mixpanel tracker event request when clicked on more description
            $scope.projectCustomTracking = function(cat, action, type, id, linkName){
				var descObj = {}, subLabel;				
				subLabel = 'more'+type+"-"+$rootScope.CURRENT_ACTIVE_PAGE;   
				//GA tracker
				$rootScope.TrackingService.sendGAEvent(cat, action, subLabel); 	 
				//mixpanel tracker					
				descObj["Link Name"] 	= linkName;
				descObj["Card Type"] 	= type+' Card';
				type = (type == 'Main') ? 'City' : type;			
				descObj[type+" Id"] 	= id;				
				descObj["Page Name"] 	= $rootScope.CURRENT_ACTIVE_PAGE;
				$rootScope.TrackingService.mixPanelTracking('Link Clicked',descObj); 			
				//End Ga/mixpanel   				
			}
			
			$scope.showMore = function(){
				$scope.$emit('DescExpand');
				if($scope.largeLength){
					$scope.mDescription = $scope.description.substr(0, $scope.largeLength);	
				}
			}
		}
	}
}]);
