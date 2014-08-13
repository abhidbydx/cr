/***
 * Name: Neighborhood Map Service
 * Description: To open and show neighborhood map service
 * @author: [Yugal Jindle]
 * Date: Apr 14, 2014
 ***/

'use strict';

angular.module('serviceApp')
    .factory('neighborhoodMapService', ['$modal', function($modal) {

        var openNeighborhoodMapModal = function(data, marker, markerType, radius, mapUrl, direction) {
            $modal.open({
                templateUrl: 'views/modal/neighborhoodMap.html',
                windowClass:'modalGallery',
                controller : ['$scope', '$modalInstance', '$rootScope','$timeout', function ($scope, $modalInstance, $rootScope,$timeout) {
                    $scope.data = data;
                    $scope.marker = marker;
                    $scope.markerType = markerType;
                    $scope.radius = radius;
                    $scope.mapUrl = mapUrl;
                    $scope.mapId = 'map_'+data.projectId;
                    $scope.direction = direction;
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    //GA/MIXPANEL Tracking
					$scope.tracking = function (label, action, mixpanelEvent){
						$rootScope.TrackingService.sendGAEvent(label, action, '-'+$rootScope.CURRENT_ACTIVE_PAGE); 
						$rootScope.TrackingService.mixPanelTracking(mixpanelEvent, {'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});
					}
					//GA/Mixpanel tracking when user click on Explore on PropTiger Maps
					$scope.exploreTracking = function(){
						$rootScope.TrackingService.sendGAEvent("popup", "clicked", "exploremaps-"+$rootScope.CURRENT_ACTIVE_PAGE); 
						$rootScope.TrackingService.mixPanelTracking("Explore PT Maps Clicked", {'Page Name':$rootScope.CURRENT_ACTIVE_PAGE});	
					}
					//GA/MIXPANEL - On clicking "EXPLORE ON MAP" button
					$scope.tracking('searchMap', 'clicked', 'Search on Map Clicked');
					
					
                }]
            });
        };

        return {
            openNeighborhoodMapModal : openNeighborhoodMapModal
        };
    }]);
