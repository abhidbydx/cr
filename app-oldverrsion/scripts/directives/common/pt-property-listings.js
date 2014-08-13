
'use strict';
angular.module('serviceApp').directive('ptPropertyListings',function(){
    return {
	restrict: 'A',
	templateUrl: 'views/directives/common/pt-property-listings.html',
	scope:{m_properties: '=properties', openLeadForm:'=', showErrorForm:'=', floorplanimagelist: "=", page: "@", project: '='},
	link : function (scope, element, attrs) {
	    scope.pagename = attrs.pageType;
	},
	controller: function($rootScope, $scope, PropertyParser, FullScreenService, $location, Formatter, FilterService){
            $scope.$watch('m_properties', function (n, o) {
                if (n) {
                    // Variable labels for grid cells
	            $scope.UNAVAILABLE_PRICE_LABEL = 'on request';
	            $scope.REQUEST_PRICE_LABEL = 'Request Price';
	            $scope.UNAVAILABLE_PROP_LABEL = 'Details On Request';
	            $scope.REQUEST_PROP_LABEL = 'Request Property Details';

	            // Check to see if all properties are plots
	            $scope.showFloorPlanColumn = false;
	            if ($scope.page == 'projectDetail') {
		        for (var prop in $scope.project.properties) {
		            if ($scope.project.properties.hasOwnProperty(prop)) {
		    	        if ($scope.project.properties[prop].unitType != 'Plot') {
		    	            $scope.showFloorPlanColumn = true;
		    	            break;
		    	        }
		            }
		        }
	            }
	            
	            $scope.showLeadForm = function (evt, formtype, property) {
		        if ($scope.pagename === "listings") {
		            if (formtype === "newPrice" || formtype === "resalePrice") {
			        $scope.openLeadForm(evt, formtype, "hidden-pricerequest-listing", property);			
		            } else if (formtype === "size") {
			        $scope.openLeadForm(evt, formtype, "hidden-sizerequest-listing", property);
		            } else if (formtype === "floorPlan") {
			        $scope.openLeadForm(evt, formtype, "hidden-floorrequest-listing", property);
		            }
		        } else if ($scope.pagename === "project-property") {
		            if (formtype === "newPrice" || formtype === "resalePrice") {
			        $scope.openLeadForm(evt, formtype, "hidden-pricerequest-mid", property);			
		            } else if (formtype === "size") {
			        $scope.openLeadForm(evt, formtype, "hidden-sizerequest-mid", property);
		            } else if (formtype === "floorPlan") {
			        $scope.openLeadForm(evt, formtype, "hidden-floorrequest-mid", property);
		            }
		        }		
	            };

	            if ($scope.page == 'projectDetail') {
                        for (var prop in $scope.m_properties) {
            	            var property = $scope.m_properties[prop];
            	            for (var image in property.images) {
                                if (property.images.hasOwnProperty(image)) {
                                    if (property.images[image].imageType['type'] == 'floorPlan') {
                                        var floorPlanImage = [];
    				        floorPlanImage.push({data: [property.images[image]]});
    				        floorPlanImage[0].data[0].image = floorPlanImage[0].data[0].absolutePath;
    				        floorPlanImage[0].data[0].largeImage = floorPlanImage[0].data[0].absolutePath;
    				        floorPlanImage[0].data[0].text = floorPlanImage[0].data[0].title;
    				        floorPlanImage[0].data[0].thumbImage = Formatter.getImagePath(floorPlanImage[0].data[0].image, 'THUMBNAIL');
    				        floorPlanImage[0].data[0].smallImage = Formatter.getImagePath(floorPlanImage[0].data[0].image, 'SMALL');
    				        $scope.m_properties[prop].floorPlanImage = floorPlanImage;                        
                                    }
                                }
                            }
                        }
	            }
	            
	            $scope.properties = PropertyParser.groupProperties($scope.m_properties);	

	            // Logic for showing more properties of a project, default is to show 3
	            $scope.toggleMore = function(){
        	        if($scope.showingMore){
		            for(var i = 0;i<$scope.properties.length;i++){
			        $scope.properties[i].showProps = false;
		            }
		            $scope.properties.splice(3, $scope.properties.length - 3);
        	            $scope.projectListingCluster('cluster','clicked','expandMoreProperties','Less');
        	        }            	    
        	        else{
        	            $scope.properties = $scope.properties.concat($scope.extraProps);
        	            $scope.projectListingCluster('cluster','clicked','expandMoreProperties','More');
        	        }            	
        	        $scope.showingMore = !$scope.showingMore;
	            };

	            if($scope.properties.length === 1 && $scope.properties[0].isComposite){
	    	        $scope.properties = $scope.properties[0].properties;
	            }
	            
	            if($scope.properties.length > 3){
                        $scope.extraProps = $scope.properties.splice(3, $scope.properties.length - 3);
                    }
                    // mix panel and gaevent for expand/collapse and more/less propeties
                    $scope.projectListingCluster = function(cat, action, value, type){
		        var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
		        //Send GA/Mixpanel tracker event request when other links clicked 
		        var subLabel = value+"-"+pageType;   
		        //GA tracker
		        $rootScope.TrackingService.sendGAEvent(cat, action, subLabel); 	 
		        //mixpanel tracker
		        if(type == "Expand" || type == "Collapse"){
		            var firstEvent = type + " Properties";
		            $rootScope.TrackingService.mixPanelTracking(firstEvent,{"Page Name":pageType}); 
		        }else if(type == "More" || type == "Less"){
		            var firstEvent = "Clicked "+type + " Properties";
		            $rootScope.TrackingService.mixPanelTracking(firstEvent,{"Page Name":pageType}); 
		        }
		        //End Ga/mixpanel
	            } 
                }
            }, true);
	}
    };
});
