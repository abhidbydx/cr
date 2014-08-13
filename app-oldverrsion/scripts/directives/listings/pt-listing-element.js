
'use strict';

angular.module('serviceApp').directive('ptListingElement', [
    'LeadService', 
    'ImageService', 
    'ImageParser', 
    'FullScreenService', 
    'CommonLocationService',
    'LocalityParser',
    'BuilderService',
    'BuilderParser',
    'ProjectService',
    '$rootScope',
    'CompareStorage',
    'projectMapService',
     function(LeadService, 
            ImageService, 
            ImageParser, 
            FullScreenService, 
            CommonLocationService,
            LocalityParser,
            BuilderService,
            BuilderParser,
            ProjectService,
            $rootScope,
            CompareStorage,
            projectMapService){
	return {
		restrict: 'A',
		scope: {project: '=', isBuilder: '=', mapSupport: '='},
		templateUrl: 'views/directives/listings/pt-listing-element.html',
		controller: function ($scope) {
            
            var disableClick, parsedGalleryData;

			$scope.truncatedDeal = "No Deals";
            $scope.deals = $scope.project.offers;
            $scope.callerLocation	=	'LISTING';	

            if ($scope.deals) {
                $scope.truncatedDeal = $scope.deals[0];
            } else {
                $scope.truncatedDeal = {
                    offer: "",
                    offerHeading: "No Deals",
                    offerDesc: "No Deals"
                };
            }

            $scope.getLocalityData = function(){

                if(!$scope.locOverlayCalled) {
                    //handle locality overlays
                    var localityCard = function (response) {
                        $scope.project.localityCard = LocalityParser.minimalLocality(response, ['hospital', 'restaurant', 'school']);
                        $scope.locOverlayFetched = true;
                    };

                    CommonLocationService.getBasicInfo("locality", $scope.project.localityId, localityCard);
                    $scope.locOverlayCalled = true;
                    //GA - when user hovered on Locality Overlay and overlay opened
					$rootScope.TrackingService.sendGAEvent('overlay', 'hovered', 'localityOverlay-'+$rootScope.CURRENT_ACTIVE_PAGE); 
                }
            }

            $scope.getBuilderData = function(){	
                //handle builder overlays                
                if (!$scope.isBuilder && !$scope.builOverlayCalled) {
                    
                    var card = {}, projectsHandler, detailHandler;

                    $scope.project.builderCard = card;
                    
                    $scope.builOverlayCalled = true

                    //Get information for this builder
                    detailHandler = function (response) {
                        var detail = BuilderParser.parseBuilder(response);
                        card.detail = detail;
                        $scope.builOverlayFetched = true;
                    };
                    BuilderService.getCard($scope.project.builderId, detailHandler);

                    //Get projects for this builder
                    projectsHandler = function (response) {
                        response.items = _.filter(response.items, function(project){
                            return project.projectId != $scope.project.projectId;
                        });
                        
                        card.projects = response.items.slice(0,3);
                    };
                    BuilderService.getProjects($scope.project.builderId, '', projectsHandler);
                    //GA - when user hovered on Builder Overlay and overlay opened
					$rootScope.TrackingService.sendGAEvent('overlay', 'hovered', 'builderOverlay-'+$rootScope.CURRENT_ACTIVE_PAGE); 
                }
            }

            $scope.openGallery = function(galleryType){
                var modaInstance, videoIndex, openModal;
                if(!disableClick){
					//GA/Mixpanel When user opens the gallery Window  
					$rootScope.TrackingService.sendGAEvent('gallery', 'clicked', 'openGallery-'+$rootScope.CURRENT_ACTIVE_PAGE); 
					$rootScope.TrackingService.mixPanelTracking('Gallery Open', {'Project ID': $scope.project.projectId, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});			 
					//End mixpanel
                    disableClick = true;
                    FullScreenService.initGallery();

                    openModal = function() {
                        videoIndex = galleryType == 'video' ? parsedGalleryData.videoIndex : undefined;
                        modaInstance = FullScreenService.openGallery(parsedGalleryData, videoIndex);    
                        if(modaInstance && modaInstance.result){
                            modaInstance.result.then(function(){
                                disableClick = false;
                            }, function () {
                                disableClick = false;
                            });
                        }
                    }

                    if(!parsedGalleryData){
                        ProjectService.getProjectDetail($scope.project.projectId).then(function(res) {       
                            parsedGalleryData = ImageParser.getProjectImage( res.data, 'type');
                            openModal();               
                        });                        
                    } else {
                        openModal();
                    }
                }
            }

            $scope.isAddedToCompare = function(){
                return CompareStorage.exist($scope.project.projectId);
            }

            $scope.openProjectMapModal = projectMapService.openProjectMapModal;

            $scope.openProjectMapModalMap = function( __project ) {                
                projectMapService.openProjectMapModal( __project.latitude, __project.longitude, __project.builder.name + " " + __project.name, "maps/"+__project.locality.url, __project.projectId);
            };

            $scope.$watch('project', function (n) {
            if (n) {
                $scope.openLeadForm = function( $event, type, formName, property ) {
                $event.stopPropagation();
                var leadData = {
                    type : type,
                    cityId : $scope.project.locality.cityId,
                    localityId : $scope.project.localityId,
                    projectId : $scope.project.projectId,
                    projectName : $scope.project.name,
                    builderName : $scope.project.builder.name,
                    fromALV     : true,
                    ui_php : 'list.php',
                    formlocationinfo : formName
                };
		    if (property) {
			leadData['propertyDetail'] = {
			    unitName: property.unitName,
                            measure: property.measure,
                            size: property.size
			};
		    }
                    LeadService.openLeadForm( leadData );
                };
            }
            });
            //GA/Mixpanel tracking when user click on Cluster(card) links
            $scope.clusterTracking = function(category, action, label, itemId, index, mixpanelEvent){
				var sublabel, clusterObj = {};
				sublabel = label+'-'+$rootScope.CURRENT_ACTIVE_PAGE;
				mixpanelEvent = (typeof mixpanelEvent!= 'undefined') ? mixpanelEvent : 'Clicked Listing'
				clusterObj['Project ID']		= itemId
				clusterObj['Clicked On']		= label
				clusterObj['Listing Number']	= index
				clusterObj['Page Name']			= $rootScope.CURRENT_ACTIVE_PAGE
				$rootScope.TrackingService.sendGAEvent(category, action, sublabel); 
				$rootScope.TrackingService.mixPanelTracking(mixpanelEvent, clusterObj);
			};

            $scope.clusterTrackingMap = function( __project ) {
                $scope.clusterTracking( "cluster", "clicked", "projectOnMap", __project.projectId, $scope.$parent.$index +1, "Project Map View Clicked" );
            };
		}
    };
}]);
