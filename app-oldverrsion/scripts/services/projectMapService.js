/***
 * Name: Project Map Service
 * Description: To open and show project map service
 * @author: [Yugal Jindle]
 * Date: Apr 12, 2014
 ***/
'use strict';

angular.module( 'serviceApp' )
    .factory('projectMapService', ['$modal', function($modal) {

        var openProjectMapModal = function(lat, lng, title, mapUrl, projectId) {
            $modal.open({
                templateUrl: 'views/modal/projectMap.html',
				windowClass:'modalGallery',
                controller : ['$scope', '$modalInstance','$rootScope', function ($scope, $modalInstance,$rootScope) {
                    $scope.lat = lat;
                    $scope.lng = lng;
                    $scope.title = title;
                    $scope.mapUrl = mapUrl;
                    $scope.projectId = projectId;                    
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    //GA/Mixpanel tracking when user click on Explore on PropTiger Maps
					$scope.exploreTracking = function(){
						$rootScope.TrackingService.sendGAEvent("popup", "clicked", "exploremaps-"+$rootScope.CURRENT_ACTIVE_PAGE); 
						$rootScope.TrackingService.mixPanelTracking("Explore PT Maps Clicked", {'Page Name':$rootScope.CURRENT_ACTIVE_PAGE});	
					}
                }]
            });
        };

        return {
            openProjectMapModal : openProjectMapModal
        };
    }]);
