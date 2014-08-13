/**
 * Name: Project Overview Directive
 * Description: Use this directive to show overview on Project Page.
 * @author: [Nakul Moudgil]
 * Date: Dec 27, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptProjectoptions', function() {
  return {
    restrict : 'A',
    templateUrl : 'views/directives/project/propertyOption.html',
    controller : function($scope, $element, $modal, Formatter, FullScreenService, ErrorReportService, SellFormService, $rootScope) {
			$scope.isAllProperties = false;
            $scope.arrowState = 'down';
            $scope.noOfYears = $rootScope.noOfInstallments / 12;

            $scope.sellProperty = SellFormService.openSellForm;

			$scope.toggleAllProperties = function(){
				$scope.isAllProperties = !$scope.isAllProperties;
                if ($scope.arrowState == 'down') {
                    $scope.arrowState = 'up';
                } else {
                    $scope.arrowState = 'down';
                }
			}			
			$scope.update_prop = function(prop) {
				$scope.setProperty(prop);
				// Formatter.goToEl('prop_options');
			};
			
			$scope.$watch('prop_selected',function(newVal, oldVal){
				if(newVal){
					$scope.propOption = newVal;
					if ($scope.project) {
						for (var prop in $scope.project.properties) {
							if ($scope.project.properties.hasOwnProperty(prop)) {
								if ($scope.project.properties[prop].propertyId == $scope.propOption.id) {
									$scope.selected_property = $scope.project.properties[prop];
									for (var image in $scope.selected_property.images) {
										if ($scope.selected_property.images[image].imageType['type'] == 'floorPlan') {
											$scope.floorPlanImage = [];
											$scope.floorPlanImage.push({data: [$scope.selected_property.images[image]]});
											$scope.floorPlanImage[0].data[0].image = $scope.floorPlanImage[0].data[0].absolutePath;
											$scope.floorPlanImage[0].data[0].largeImage = $scope.floorPlanImage[0].data[0].absolutePath;
											$scope.floorPlanImage[0].data[0].text = $scope.floorPlanImage[0].data[0].title;
											$scope.floorPlanImage[0].data[0].thumbImage = Formatter.getImagePath($scope.floorPlanImage[0].data[0].image, 'THUMBNAIL');
											$scope.floorPlanImage[0].data[0].smallImage = Formatter.getImagePath($scope.floorPlanImage[0].data[0].image, 'SMALL');
										}
									}
									if ($scope.isPropertyPage)
										$scope.other_sim_props();
								}
							}
						}
					}
				}
			});

			$scope.other_sim_props = function() {
				$scope.other_sim_props_header = $scope.project.bhkInfo.slice(-4) == 'Plot' ? 'plot' : $scope.prop_selected.name.split(' (')[0];
				$scope.other_sim_props_list = [];
				for (var prop in $scope.propList) {
					if ((($scope.propList[prop].name.split(' ')[0] == $scope.prop_selected.name.split(' ')[0]) || ($scope.propList[prop].name.split('BHK')[0] == $scope.prop_selected.name.split('BHK')[0])) && $scope.propList[prop].id != $scope.prop_selected.id) {
						$scope.other_sim_props_list.push($scope.propList[prop]);
					}
				}
			};
/*
			$scope.$watch('floorPlanImages', function (newValue, oldValue) {
				if (newValue && newValue.length > 0) {
					$scope.floorPlanImageList = [];
					for (var imageIndex in newValue[0].data) {
						var image = newValue[0].data[imageIndex];
						$scope.floorPlanImageList.push({data: [image]});
					}
				}
			});*/
			$scope.$on('open_floor_plan', function (evt, data) {
				$scope.open_image_modal(data);
			});

			$scope.open_image_modal = function(propertyId){
				if (propertyId) {
					var id = propertyId;
				} else {
					var id = $scope.propOption.id;
				}
				var imageInitIndex = -1;
				var returned = false;
				$.each($scope.imageData, function(key, bucket) {
					if(bucket.index == 'Floor Plans'){
						$.each(bucket['data'], function(key, image){
							if(!returned){	
								imageInitIndex += 1;
							}
							if(image.objectId == id){								
								returned = true;								
							}
						});
						
					}
					else{
						if(!returned){
							imageInitIndex += bucket['data'].length;
						}
					}	
				});
				
				//$scope.$emit('showFloorPlan',imageInitIndex);
				//FullScreenService.openGallery($scope.imageData, imageInitIndex);
				var modalInstance = FullScreenService.openGallery($scope.imageData, imageInitIndex)
				//GA/Mixpanel When user opens the gallery Window  
				$scope.TrackingService.sendGAEvent('gallery', 'clicked', 'openGallery-'+$scope.CURRENT_ACTIVE_PAGE); 
				$scope.TrackingService.mixPanelTracking('Gallery Open', {'Project ID': $scope.propOption.id, 'Page Name': $scope.CURRENT_ACTIVE_PAGE});			 
				//End mixpanel				
			        modalInstance.result.then(function (index) {
				      //$scope.index = index;
				      //setCarousel();				      
				    }, function () {
			    	}
			    );
			};

			$scope.open_payment_plan_modal = function() {
				//GA/MIXPANEL On clicking "View Plan" Link                                  								
				var floorPlanName = ($scope.imageData[0].data[0].text) ? $scope.imageData[0].data[0].text : "";
				$scope.TrackingService.sendGAEvent('gallery', 'clicked', 'viewPaymentPlan-'+$scope.CURRENT_ACTIVE_PAGE); 
				$scope.TrackingService.mixPanelTracking('View Payment Plan', {'Floor Plan Name': floorPlanName, 'Project ID': $scope.propOption.id,'Page Name': $scope.CURRENT_ACTIVE_PAGE});					
					
				FullScreenService.openGallery($scope.paymentPlanImages);
			};	
    },
    link : function(scope, element, attrs) {
    }
  };
});
