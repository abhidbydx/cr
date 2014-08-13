/**
 * Name: projectDetailCtrl
 * Description: This is controller for Project deatil page.
 * @author: [Nakul Moudgil]
 * Date: Oct 9, 2013
 **/
'use strict';

angular.module('serviceApp').controller('projectDetailCtrl', function ($scope, $rootScope, ProjectService, ProjectParser, LocalityParser, ImageParser, LeadService, NotificationService, CommonLocationService, BuilderParser, BuilderService, UserService, Formatter, $location, $timeout, $anchorScroll, $window, Constants, LocalityService, ErrorReportService) {   
    var leadData;
    var leadObjects = {};    
    $scope.loadDiscussions = false;
    //Following piece of code is for redirecting user to Discussion
    if ($location.hash()) {
		var watcher = $scope.$watch(function () { 
			    var ele = angular.element("#" + $location.hash());
			    if (ele && ele.offset() && ele.offset().top) {
					return ele.offset().top;
			    }
			    return undefined;	  
			}, function (n, o) {
			    if (n) {
					$window.scrollTo($window.pageXOffset, n - 90);
			    }	    
		});
		//This timer is for taking user to Discussion if he is coming from any other page and then off the timer
		$timeout(function () { watcher();}, 5000);
    }
    ////////////////
    $scope.selected_emi = 0;
	$scope.isHeaderSmall = false;
	$scope.postLoad = false;
	$scope.prop_selected = {};
	$scope.propList = [];
	$scope.isPropertyPage = false;	
	$scope.setProperty = function(currProperty){
		$scope.prop_selected = currProperty;
		// Formatter.goToEl('prop_options');
		for (var prop in $scope.propList) {
			if ($scope.propList.hasOwnProperty(prop)) {
				if ($scope.prop_selected.id == $scope.propList[prop].id) {
					$scope.propList[prop].display = 'font-weight';
				} else {
					$scope.propList[prop].display = '';
				}
			}
		}
		if($scope.propList.length > 2 && currProperty.show){			
			var propertyBcrum = [];			
			$scope.isPropertyPage = true;
			if ($scope.project.bCrum.slice(-1)[0].label == 'project') {
				$scope.project.bCrum.slice(-1)[0].link = $scope.project.URL;
				$scope.project.bCrum.push({text: $scope.prop_selected.orig_name + ' apartment'});
			} else {
				$scope.project.bCrum.slice(-1)[0].text = $scope.prop_selected.orig_name + ' apartment';
			}
			propertyBcrum[0] = $scope.project.bCrum[0]
			propertyBcrum[1] = $scope.project.bCrum[3]
			propertyBcrum[2] = $scope.project.bCrum[4]

			$scope.project.bCrum = propertyBcrum

		}
		else{			
			$scope.isPropertyPage = false;
			if ($scope.project.bCrum.slice(-1)[0].label != 'project') {
				$scope.project.bCrum.pop();
				$scope.project.bCrum.slice(-1)[0].link = '';
			}
		}
		setEMI();
		changePropertyOptions();
	};

	$scope.$on('interestRateChanged', function(){
		setEMI();
	});

	$scope.$on('downPaymentChanged', function(){
		setEMI();
	});

	$scope.$on('projectpage', function () {
		$scope.setProperty($scope.proj_page_selection);
	});

	var setEMI = function(){
		var total_cost = $scope.prop_selected.value;
		var emi = Formatter.getEMI(total_cost, $rootScope.noOfInstallments);
		$scope.emi = Formatter.formatRs(emi);
	}

	var changePropertyOptions = function(){
		if ($scope.propList) {
			if ($scope.isPropertyPage) {
				if ($scope.propList.length > 2)
					if ($scope.propList[0].name != 'All Options') {
						$scope.propList.splice(0, 1);
						$scope.propList.splice(0, 0, {id: -1, name: 'All Options', show: false, url: $scope.project.URL});
					}
			} 
			else {
				if ($scope.propList[0].name == 'All Options') {
					$scope.propList.splice(0, 1);
					$scope.propList.splice(0, 0, $scope.proj_page_selection);
					$scope.setProperty($scope.propList[0]);
				}
			}
		}
	}

	$scope.$on("scrolled", function (evt, data) {
       	if (data) {
     	    var yoffset = parseInt(data.yoffset);
			if (yoffset >= 100) {
                $scope.$apply(function(){
                	scrolled();                	
                }); 
            }
        	else{
    		    unscrolled(); 
            }
            if (yoffset >= 120) {
                if(!$scope.loadLazyWidgets){
		    if ($scope.project) {
	                $scope.$apply(function(){
	                	poplulateLazyWidgets();
	                }); 
		    }
            	}
            }
			if (yoffset >= 550) {
				$scope.$apply(function(){
					setPosFixed();
				});
				if(!$scope.loadDiscussions){
					if (yoffset >= 1000) {
						$scope.$apply(function(){
							$scope.loadDiscussions = true;
						});
					}	
				}				
			}
			else{
				$scope.$apply(function(){
					setPosAuto(); 
				});
			}
			if (yoffset >= ($(document).height() - ($('.searchBar').height() + $('.header').height() + $('.page-footer').height() + $('div[pt-leftwidgetcontainer]').height() + 10 + 250))) 
			{
				$scope.$apply(function(){
					setPosAuto();
				});
			}
		}
	});

	var scrolled = function(){
		$scope.isHeaderSmall = true;
		$scope.postLoad = true;
		$scope.navClass = true;
	};

	var unscrolled = function(){
		$scope.isHeaderSmall = false;
		$scope.navClass = false;
	};

	var setPosFixed = function(){
		$scope.navClass = true;
	};

	var setPosAuto = function(){
		$scope.navClass = false;
	};

	$scope.projectCarouselSettings = {
	    skin: 'black',
	    responsive:true,
	    width: 871,
	    height: 380,
	    imageWidth: 520,
	    imageHeight: 400
	};
        
    $scope.projectConstructionCarouselSettings = {
	    skin: 'black',
	    responsive:true,
	    width: 791,
	    height: 380,
	    imageWidth: 520,
	    imageHeight: 400
	};


	var card = function (response) {
        var detail = BuilderParser.parseBuilder(response);
        $scope.project.builderCard.detail = detail;
    };
          
	var projects = function (response) {
	    $scope.project.builderCard.projects = [];
	    var count = 0;
	    $.each( response.items, function( cnt, __proj ) {
	    	if ( __proj.projectId != $scope.urlData.id ) {
	    		$scope.project.builderCard.projects.push( __proj );
	    		count++;
	    		if ( count == 3 ) {
	    			return false;
	    		}
	    	}
	    });
	};

	var getCradInfoCallback = function(resp){
		if(resp){
			$scope.areaInfoForGraph.data = LocalityParser.getParsedAreaData( resp, $scope.areaInfoForGraph.type );
			//---- to do need to change the logic in locality parser ----
			var key = "",existValue = [];
			if ( $scope.project.latitude && $scope.project.longitude ) {
				LocalityService.getNeighbourhood({'lat':$scope.project.latitude,'lng':$scope.project.longitude},5,"",function(results){
					for(var i=0, len = $scope.areaInfoForGraph.data.amenityTypeCount.length; i<len; i++) {
						existValue[i] = angular.lowercase($scope.areaInfoForGraph.data.amenityTypeCount[i].name.replace(" ","_"));
						$scope.areaInfoForGraph.data.amenityTypeCount[i].count = 0;
					}
					for(var i=0, len = results.length; i<len; i++) {
						if(existValue.indexOf(results[i].localityAmenityTypes.name) != -1){
							var key = existValue.indexOf(results[i].localityAmenityTypes.name);
							$scope.areaInfoForGraph.data.amenityTypeCount[key]['count'] += 1; 
						}
					}
				});
			}
			//-----------------------------------------------------------
			$scope.project.localityCard = LocalityParser.minimalLocality(resp, ['hospital', 'restaurant', 'school']);
			if ($scope.project.localityCard.images) {
				$scope.project.locality.imageURL = Formatter.getImagePath($scope.project.localityCard.images[0].absolutePath, 'SMALL');
			}
		}
	};

    var tempData = {}, tempForm = {};
	$scope.getLeadData = function (formName, formtype) {
        return tempData;
	};

    $scope.openLeadForm = function ($event, type, formName, property) {};

	$scope.cEnabled=false;
	$scope.lEnabled=false;
	
	$scope.$on("leadpushed", function (evt, data) {
	    evt.stopPropagation();
	});
	$scope.pop_header_selection = function () {
		var header_bhk_selection = $scope.project.bhkInfo.slice(-4) != 'Plot' ? [{id: 0, name: $scope.project.bhkInfo.slice(0, $scope.project.bhkInfo.indexOf('BHK') + 3), show: false, orig_name: $scope.project.bhkInfo, value:$scope.project.minPrice}] : [{id: 0, name: 'Plot', show: false, orig_name: $scope.project.bhkInfo, value: $scope.project.minPrice == $scope.project.maxPrice ? $scope.project.minPrice : $scope.project.minPrice + ' - ' + $scope.project.maxPrice}];
		$scope.proj_page_selection = header_bhk_selection[0];
		var props = $scope.project.properties;
		for (var prop in props) {
			if (props.hasOwnProperty(prop)) {
				var current_prop = props[parseInt(prop)];
				if(current_prop){
					if (current_prop.bedrooms) {
						var property = current_prop.bedrooms + 'BHK';
					} else {
						if (current_prop.unitType.toLowerCase() == 'plot')
							var property = 'Plot';
						else 
							var property = current_prop.unitType;
					}
					var price = current_prop.budget ? current_prop.budget : current_prop.resalePrice;
					header_bhk_selection.push({
						id: current_prop.propertyId,
						url: current_prop.URL,
						name: property + ( ( current_prop.size ) ? ( ' (' + current_prop.size + ' ' + current_prop.measure + ')' ) : '' ),
						show: true,
						orig_name: current_prop.unitName,
				        orig_size: current_prop.size,
				        orig_measure: current_prop.measure,
						value: Formatter.formatPrice(price),
						display: '',
					});
				}
			}
		}
		$scope.propList = header_bhk_selection;
	}
	$scope.showErrorForm = function (var1, var2) {
	    if ($scope.isPropertyPage) {
		ErrorReportService.openErrorForm($scope.project.projectId, $scope.prop_selected.id)
	    } else {
		ErrorReportService.openErrorForm($scope.project.projectId)
	    }	    
	};	
	var populateSections = function(){           
		$scope.isSpecVisible = $scope.project.specifications && !angular.equals($scope.project.specifications, {});
		$scope.isAmenityVisible = ($scope.project.amenities && ($scope.project.amenities.length != 0));
        $scope.projectSectionsHash = {};
		$scope.projectSectionsHash['Overview'] = 'overview';
		$scope.projectSectionsHash['Project Details'] = 'proj_specs';
		$scope.projectSectionsHash['Real Estate Trends'] = 'price_trends';
        if($scope.construction && $scope.construction.length>0){
            $scope.projectSectionsHash['Construction Updates'] = 'construction_update';
        }
		$scope.projectSectionsHash['Neighborhood'] = 'loc_overview';
		$scope.projectSectionsHash['Home Loan & EMI'] = 'home_loan';
		$scope.projectSectionsHash['Discussions'] = 'discuss';	    
	}

	var poplulateLazyWidgets = function(){
		var newVal = $scope.urlData;
		if(!$scope.loadLazyWidgets){
			$scope.loadLazyWidgets = true;
			$scope.project.builderCard = {};          
		    BuilderService.getCard($scope.project.builder.id, card);
		    BuilderService.getProjects($scope.project.builder.id, $scope.urlData.cityId, projects);
		}		
	}
    	$scope.$watch("urlData", function(newVal){
	    if(newVal){
	    $scope.loadLazyWidgets = false;	
		if (newVal.pageType == 'property') {
		    $scope.focus = false;		    
		}
		var proObj = {}, videoCount = 0, imageCount = 0;  
		ProjectService.getProjectDetail(newVal.projectId).then(function(res) {
		    var project = ProjectParser.parseProject(res.data);
		    if (project && (!newVal.locality || !newVal.suburb || !newVal.builder)) {
			newVal.locality = project.locality.label;
			newVal.suburb = project.locality.suburb.label;
			newVal.localityId = project.locality.localityId;
			newVal.suburbId = project.locality.suburb.id;
			newVal.builder = project.builder.name;
			newVal.builderId = project.builder.id;
			$rootScope.urlData = newVal;
		    }
		    $scope.project = project;
		    	$scope.areaInfoForGraph = {
			    type : 'locality',
			    id   : $scope.project.locality.localityId,
			    cityInfo : {
					id : newVal.cityId,
					label : newVal.city
			    },
			    projectInfo : {
					id : $scope.project.projectId,
					label : $scope.project.name,
					unitType : $scope.project.dominantUnitType
			    }
			};
			CommonLocationService.getBasicInfo( $scope.areaInfoForGraph.type, $scope.areaInfoForGraph.id, getCradInfoCallback);
			
		    	    
			$scope.pop_header_selection();
			var prop_selected = $scope.propList[0];
			for (var prop in $scope.propList) {
				if ($scope.propList.hasOwnProperty(prop)) {
				    if (newVal.propertyId == $scope.propList[prop].id) {
						prop_selected = $scope.propList[prop];
				    }
				}
			}
			$scope.setProperty(prop_selected);
			if ( $scope.isPropertyPage && newVal.propertyId ) {
				UserService.setRecentlyViewed( newVal.projectId, newVal.propertyId );
			}
			else {
				UserService.setRecentlyViewed( newVal.projectId, 0 );
			}
            leadData = {
                cityId : $scope.project.cityId,
                localityId : $scope.project.localityId,
                projectId : $scope.project.projectId,
                projectName : $scope.project.name,
                builderName : $scope.project.builderName,
                ui_php : 'projects.php',
                formlocationinfo : 'NA'
            };

            $scope.getLeadData = function (formName, formtype) {
                if (!leadObjects[formName])
                    leadObjects[formName] = _.clone(leadData);
                var newLeadData = leadObjects[formName];
                newLeadData.formlocationinfo = formName;
                newLeadData.type = formtype;
                if ($scope.isPropertyPage) {
                    newLeadData.propertyDetail = {
                        unitName : $scope.prop_selected.orig_name,
                        size : $scope.prop_selected.orig_size,
                        measure : $scope.prop_selected.orig_measure,
                        ui_page : "property"
                    };
                    newLeadData.ui_php = "property.php";
                }
                return LeadService.updateLeadData (newLeadData);
            };

            $scope.openLeadForm = function( $event, type, formName, property ) {
                var newLeadData = _.clone(leadData);
                $event.stopPropagation();
                if (formName) {
                    newLeadData.formlocationinfo = formName;
                }
                if (type) {
                    newLeadData['type'] = type;
                }
                if (property) {
                    newLeadData.propertyDetail = property;
                }
                if ($scope.isPropertyPage) {
                    newLeadData.propertyDetail = {
                        unitName : $scope.prop_selected.name,
                        size : $scope.prop_selected.orig_size,
                        measure : $scope.prop_selected.orig_measure,
                        ui_page : "property"
                    };
                    newLeadData.ui_php = "property.php";
                }
                LeadService.openLeadForm( newLeadData );
            };
		    var imageData = res.data;
		    var parsedImages = ImageParser.getProjectImage( imageData, 'type' );
		    $scope.imageData = parsedImages.data;
		    $scope.uniqueProjectImagesId = 'projectImages'; 
		    var construction = ImageParser.getConstructionImages($scope.imageData);
		    $scope.construction = construction;
		    $scope.uniqueConImagesId = 'constructionImages';
		    $scope.projectLocality = LocalityParser.getParsedAreaData( $scope.project.locality, 'locality' );
			$scope.overview = $scope.projectLocality;						
			/*$scope.floorPlanImages = parsedImages.filter(function (element) {
			    return element.index === "Floor Plans";
			});
		    }*/
            
                        populateSections();	
                       
			$scope.paymentPlanImages = [{data: []}];
		    for (var image in $scope.project.images) {				
				($scope.project.images[image].video == true && typeof $scope.project.images[image].video != 'undefined') ? videoCount++ : imageCount++;		   
		    	var currImage = $scope.project.images[image];
		    	if (currImage && currImage.imageType && currImage.imageType['type'] == 'paymentPlan') {
		    		currImage.thumbImage = Formatter.getImagePath(currImage.absolutePath, 'THUMB');
		    		currImage.largeImage = Formatter.getImagePath(currImage.absolutePath, 'LARGE');
		    		currImage.text = "Payment Plan";
		    		$scope.paymentPlanImages[0].data.push(currImage);
		    	}

			}
			//set page name
			if(newVal.propertyId){
				$rootScope.CURRENT_ACTIVE_PAGE 	= Constants.GLOBAL.PAGE_TYPES.PROPERTY; 
				proObj['Property ID'] 			= newVal.propertyId;
			}else{
				$rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.PROJECTDETAIL; 
			}
			
			//-- ga/mixpanel page viewed call for project page--								
			proObj['Project ID'] 		= $scope.project.projectId;
			proObj['Image Available'] 	= imageCount;
			proObj['Video Count'] 		= videoCount;	
			proObj['User Participation'] = 0;
			proObj['Comments'] 			=  (typeof $scope.project.discussions != 'undefined')? $scope.project.discussions : 0;
			$rootScope.TrackingService.pageViewedCall(proObj);

/*			$timeout(function(){
				if ($location.hash() === "") {
					$window.scrollTo($window.pageXOffset,100);
				}
			},2000);*/
			
	    });
	}	

    }, true);
});
