'use strict';
angular.module('serviceApp').directive('ptProjectdetail', ['$modal', '$rootScope', '$location', 'ImageParser', 'LeadService', 'NotificationService', 'FavoriteService','FullScreenService', 'UserService', 'Constants',  function($modal, $rootScope, $location, ImageParser, LeadService, NotificationService, FavoriteService, FullScreenService, UserService, Constants) {
    return {
        restrict:   'A',
        scope:  {
                data                :   '=',
                map                 :   '=',
                closeProjectDetail  :   '&',
                addNeighbourhood    :   '&',
                removeNeighbourhood :   '&',
                showUnMapped        :   '=',
                displaySet          :   '=',
                neighbourhoodItems :   '&',
                neighbourhoodValue :   '='
            },
        templateUrl :   'views/directives/maps/pt-projectdetail.html',
        link        :   function(scope, element) {
            scope.gallerySettings = {
                width: 350,
                height: 240,
			    imageWidth: 360,
			    imageHeight: 270,
                showBottomNav: false                
            };
            scope.callerLocation	= 'Project';
            scope.pageType			= Constants.GLOBAL.PAGE_TYPES.MAP+'-'+Constants.GLOBAL.PAGE_TYPES.PROJECTDETAIL
            scope.close = function() {

				$rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.MAP+'-sale-listing-city-locality';
                scope.displaySet.showpriceposs = true;
                scope.map.state.filter.visible = true;

                // Save the map filter state
                scope.map.services.state.restore(scope.map.state);
                scope.closeProjectDetail({showNeighbourhood: true, closeCard: true});
            };

            //toggle dispaly of price per unit area in project detail card
            scope.togglePriceArea  =   function(e) {
                var elem    =   angular.element(e.currentTarget);
                var table   =   elem.parent().siblings('table');
                if(table.hasClass('show-sizes')) {
                    table.removeClass('show-sizes');
                } else {
                    table.addClass('show-sizes');
                }
            };

            scope.$watch('data', function (newVal) {
				if (newVal && newVal.projectId) {
                    UserService.setRecentlyViewed( newVal.projectId, 0 );
                    scope.tabSwitch('gallery', 'autoOpen');
                    var parsedImages = ImageParser.getProjectImage( newVal, 'type' );
                        //newImages = ImageParser.getAllImage( newVal );
                    scope.imageData = parsedImages.data;
                    scope.imageDataFullView = parsedImages.data;

               }
            }); 


            scope.tabSwitch  =   function(type, autoOpen) {
                if(!scope.data.projectId) {
                   return;    
                }
                var pos     =   {   lat :   scope.data.latitude, 
                                    lng :   scope.data.longitude };
                $rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.MAP+'-'+Constants.GLOBAL.PAGE_TYPES.PROJECTDETAIL;                
                //GA tracker On clicking Tabs exist in Project Info window 
                if(typeof autoOpen === 'undefined'){					
					$rootScope.TrackingService.sendGAEvent('map', 'clicked', 'tab-'+type+'-'+scope.pageType); 	 
					//mixpanel tracker
					$rootScope.TrackingService.mixPanelTracking('Tab Clicked', {'Tab Name':type, 'Project ID': scope.data.projectId, 'Page Name': scope.pageType});  
				}	
                if(type !== 'neighbourhood') {
					scope.displaySet.showpriceposs = true;
                    scope.removeNeighbourhood({'type':null, 'level':'project', 'callback': function() {
                        $('.proj-card-wrap .neighbour-col').find('li a').removeClass('active-neighbour');
                    } });
                    //show all project markers
                    if(scope.data.latitude && scope.data.longitude) {
                        $('.sqm_project').show();
                        // Restore map filter state
                        scope.map.services.state.restore(scope.map.state);
                        scope.map.state.filter.visible = true;
                     } else {
                        $('.sqm_project').hide();   
                        $('.legends-dd ul li .sqm_project').show();
                    }
                } else {
					scope.displaySet.showpriceposs = false;
					//hide all project markers
                    $('.sqm_project').hide();
                    $('.legends-dd ul li .sqm_project').show();
                    var selector = '#project_'+scope.data.projectId;
                    $(selector).show(function() {
                        // Select first-neighborhood by default
                        $('.neighbour-col a.first').click();
                        // Save map filter state
                        scope.map.services.state.save(scope.map.state);
                        scope.map.state.filter.visible = false;
                    });
                    scope.neighbourhoodItems({
                        radius: 5,
                        position:  pos
                    });
                }
            };


            scope.itemClicked   =   function(e, type, category) {
				var pos     =   {   lat :   scope.data.latitude, 
                                    lng :   scope.data.longitude };
                var direction = true, radius = 5;
                var elem    =   angular.element(e.currentTarget);
                var elemObj = "";

                if(elem.hasClass('active-neighbour')) {
                    scope.removeNeighbourhood({'type':type.split(','), 'level':'project', 'callback': function() {
                        elem.removeClass('active-neighbour');    
                    }});
                } else {
					$(".active-neighbour").each(function(key,element){
						elemObj = $(this);
						scope.removeNeighbourhood({'type':elemObj.attr("data-type").split(','), 'level':'project', 'callback': function() {
							 elemObj.removeClass('active-neighbour');    
                        }});
					});
				    elem.addClass('active-neighbour');
                    scope.addNeighbourhood({
                        type:      type.split(','),
                        level:     'project',
                        position:  pos,
                        radius:    radius,
                        direction: direction
                    });
                }
                
                //Send GA/Mixpanel tracker event request on clicking any neighborhood type                
                var neighbourItem = [];
                var connectivityArr = ['bus_station', 'train_station', 'airport'];
                var connectivityItem = [];
                var itemsActive = '';
               
                
                var liElement = element.find('a.active-neighbour'); 
                for (var j=0; j<liElement.length;j++){  
					 if( ~$.inArray(liElement[j].name, connectivityArr) && category == 'Connectivity'){ 
						 connectivityItem.push(liElement[j].name);
					 }else if($.inArray(liElement[j].name, connectivityArr) == -1 ){ 
						 neighbourItem.push(liElement[j].name); 
					 } 
				} 
				 
				if(connectivityItem.length > 0 ){
					itemsActive = connectivityItem.join(",") 
				}else{
					itemsActive = neighbourItem.join(",") 
				}         
               
                if(itemsActive){					
					$rootScope.TrackingService.sendGAEvent('map', 'clicked', 'project'+category+'-'+itemsActive+'-'+scope.pageType);
					var neighborhoodObj = {};
					neighborhoodObj['Project '+category+ ' Name'] = itemsActive;
					neighborhoodObj['Project ID'] = scope.data.projectId, 
					neighborhoodObj['Page Name'] = scope.pageType; 
					$rootScope.TrackingService.mixPanelTracking('Project '+category+ ' Clicked', neighborhoodObj);
				}
                
                
            };

            scope.openLeadForm = function(type, propertyDetail, formName) {
                var leadData = {
                    type : type,
                    cityId : scope.data.cityId,
                    localityId : scope.data.localityId,
                    projectId : scope.data.projectId,
                    projectName : scope.data.name,
                    builderName : scope.data.builder.name,
                    ui_php : 'mappage.php',
                    formlocationinfo : formName
                };
                if ( propertyDetail ) {
                    leadData.propertyDetail = propertyDetail;
                }
                LeadService.openLeadForm( leadData );
            };

            scope.openGallery = function( propertyObj ) {
                if ( propertyObj.images && propertyObj.images.length ) {
                    scope.images = ImageParser.getClusteredImage( propertyObj.images, 'type' );
                    //GA/MIXPANEL On clicking "View Plan" Link                                  
					var floorPlanName = (scope.images.data[0].data[0].text) ? scope.images.data[0].data[0].text : "";
					$rootScope.TrackingService.sendGAEvent('map', 'clicked', 'viewPlan-'+scope.pageType); 
					$rootScope.TrackingService.mixPanelTracking('Project Floor Plan Viewed', {'Floor Plan Name': floorPlanName, 'Project ID': propertyObj.projectId,'Page Name': scope.pageType});					
                    FullScreenService.openGallery(scope.images.data);
                }
                else {
                    NotificationService.setNotification({
                        msg : 'Floor plan unavailable' + ' #' + propertyObj.propertyId,
                        type: 'info'
                    });
                }
            };
            
            //GA/mixpanel tracker On clicking "Project Detail" Link
            scope.projectLinkTracking = function(){	 
				var projectLink = "http://"+$location.host()+"/"+scope.data.URL
				$rootScope.TrackingService.sendGAEvent('map', 'clicked', 'projectLink-'+scope.pageType); 	 
				//mixpanel tracker
				$rootScope.TrackingService.mixPanelTracking('Go to Project', {'Clicked on':projectLink, 'Project ID': scope.data.projectId, 'Page Name': scope.pageType});  
				
			}

        },
        controller  :   function($scope) {
            //if project is added as favorite to db, update the marker UI
            $scope.$on('favChanged', function(data) {

                var id = $scope.data.projectId;
                var fav = FavoriteService.isFav(id);
                var marker = $('#project_'+id);
                var icon = $('.projFav_'+id);
                if(fav) {
                    marker.addClass('st-f');
                    icon.addClass('active');
                } else {
                    marker.removeClass('st-f');
                    icon.removeClass('active');
                }
            });
        }
    };
}]);
