/**
 * Name: Url Data Service
 * Description: Insanity, thy name is, urldata   
 * @author: [Hemendra Srivastava]
 * Date: Apr 30, 2014
 **/

'use strict';
angular.module( 'serviceApp' )
    .factory('UrlDataService', ['CityService', 'ProjectService', 'UnitInfoService', 'LocalityService', 'CommonLocationService', 'BuilderService', 'GlobalService', 'PropertyService', '$location', '$q', function(CityService, ProjectService, UnitInfoService, LocalityService, CommonLocationService, BuilderService, GlobalService, PropertyService, $location, $q) {

	var getPageType = function (params, statename) {

	    var suffix;
	    var routeType, template = '';
	    if (statename && statename.search('base.listing') > -1) {
		suffix = statename.split('base.listing.')[1];
		routeType = 'listing';
	    }
	    else if (statename && statename.search('base.maps') > -1) {
		routeType = 'maps';
		suffix = statename.split('base.maps.')[1];
	    }
	    if (suffix === 'City') {
		return ["SALE-LISTING-CITY", "CITY_LISTING_PAGE"];
	    }
	    // property type - bhk
		else if (suffix === 'PtypeBhk') {
			template = 'HOME_PAGE';
			if ( params.propType ) {
				template = params.propType + '_IN_INDIA';
			}
			template = template.replace(/-/g, '_');
			return ['SALE-LISTING-ALL', template.toUpperCase()];
		}
	    else if (suffix === 'CityPtype') {
		var pgname = 'SALE-LISTING-CITY';
		if (params.locinfo) {
		    var locData = params.locinfo.split('-');
		    var id = parseInt(locData.splice(-1));
		    var pageType = getPageTypeById(id);
			if (pageType == 'locality') {
				pgname = pgname + '-LOCALITY';
				template = 'LOCALITY_LISTING_PAGE';
			} else if (pageType == 'suburb') {
				pgname = pgname + '-SUBURB';
				template = 'SUBURB_LISTING_PAGE';
			}
			if ( params.propType != 'property' || ( pageType == 'property' && ( params.bhkinfo || params.budgetFilter ) ) ) {
				template = params.propType + '_SALE_' + pageType;
			}
		}
		else {
			template = 'CITY_LISTING_PAGE';
			if ( params.propType ) {
				template = params.propType + '_SALE_CITY';
			}
		}
		if (params.bhkinfo) {
			pgname = pgname + '-BHK';
			template = template + '-BHK';
		}
		if (params.budgetFilter) {
			pgname = pgname + '-PRICE';
			template = template + '-PRICE';
		}

		template = template.replace(/-/g, '_');

		return [pgname, template.toUpperCase()];
	    }
	    else if (suffix === 'Builder') {
		return ['SALE-LISTING-BUILDER', 'BUILDER_PAGE'];
	    } 
	    else if (suffix === 'BuilderCity') {
		return ['SALE-LISTING-BUILDERCITY', 'CITY_BUILDER_PAGE'];
	    } 
	    else if (statename === 'base.project.detail') {
		return ['PROJECTDETAIL', 'PROJECT_PAGE'];
	    }
	    else if (statename === 'base.project.property') {
		return ['PROPERTY', 'PROJECT_PROPERTY_PAGE'];
	    } 
	    else if (statename === 'base.overview.City') {
		return ['CITY-OVERVIEW', 'CITY_OVERVIEW_PAGE'];
	    }
	    else if (statename === 'base.home') {
		return ['HOME-PAGE', 'HOME_PAGE'];
	    }
	    else if (statename === 'base.overview.Others') {
		var pageType = getPageTypeById(params.entityId);
		if (pageType == 'locality') {
		    return ['LOCALITY-OVERVIEW', 'LOCALITY_OVERVIEW_PAGE'];
		} else if (pageType == 'suburb') {
		    return ['SUBURB-OVERVIEW', 'SUBURB_OVERVIEW_PAGE'];
		}
		}

		var new_page_type = '', type = '';
		if ( !params.entityId ) {
			type = 'CITY';
			new_page_type = 'SALE-LISTING-CITY';
			template = 'CITY_LISTING_PAGE';
			if (statename === 'base.listing.citySociety') {
				template = 'SOCIETY-FLATS-CITY';
			}
			else if ( params.listingType == 'resale' ) {
				template = 'RESALE-PROPERTY-CITY';
			}
		}
		else {
			type = getPageTypeById( params.entityId ).toUpperCase();
			if ( type == 'LOCALITY' || type == 'SUBURB' ) {
				template = type + '_LISTING_PAGE';
			}
			if ( type === 'BUILDER' ) {
				if ( params.cityName ) {
					type += 'CITY';
					template = 'CITY_BUILDER_PAGE';
				}
				else {
					template = 'BUILDER_PAGE';
				}
			}
		}
		if ( type == 'CITY' || type == 'LOCALITY' || type == 'SUBURB' || type == 'BUILDER' ) {
			//	I havent used if-ELSE for a reason
			//	do not put ELSE in following conditions
			if ( params.projectStatus && params.propType ) {
				template = params.projectStatus + '-' + params.propType + '-' + type;
			}
			if ( params.listingType == 'resale' ) {
				template = 'RESALE-PROPERTY-' + type;
				if ( params.propType ) {
					template = 'RESALE-' + params.propType + '-' + type;
				}
			}
			if ( params.budgetType ) {
				template = params.budgetType + '-PROJECTS-' + type;
				if ( params.propType ) {
					template = params.budgetType + '-' + params.propType + '-' + type;
				}
			}
			if (statename === 'base.listing.localitySociety') {
				new_page_type = 'SALE-LISTING-' + type;
				template = 'SOCIETY-FLATS-' + type;
			}
		}
		new_page_type = 'SALE-LISTING-' + type;

		template = template.replace(/-/g, '_');
		return [new_page_type, template.toUpperCase()];
	}

	var getPageTypeById = function (id) {
	    if (id && id > 0) {
		if (id < 1000) {
		    return 'city';
		} else if (id > 10000 && id < 50000) {
		    return 'suburb';
		} else if (id > 50000 && id < 100000) {
		    return 'locality';
		} else if (id > 100000 && id < 500000) {
		    return 'builder';
		} else if (id > 500000 && id < 1000000) {
		    return 'project';
		} else if (id > 5000000 && id < 10000000) {
		    return 'property';
		} else {
		    return '';
		}
	    }
	    else {
		return '';
	    }
	}
	
	var getPropType = function(value){
	    var type = '';
            if (value == 'apartments-flats') {
		type = 'Apartment';
	    }
            else if (value == 'apartments') {
		type = 'Apartment';
	    } 
            else if (value == 'flats') {
		type = 'Apartment';
	    }
            else if (value == 'property') {
		type = '';
	    }
            else if (value == 'projects') {
		type = 'Apartment';
	    }
	    else if (value == 'house') {
		type = 'House';
	    }
	    else if (value == 'sites-plots') {
		type ='Plot';
	    }
	    else if (value == 'villas') {
		type = 'Villa';
	    }	
	    return type;
	}

        var getProjectStatus = function (value) {
            var pstatus = undefined;

            if (value === 'new') {
                pstatus = ['new launch', 'pre launch'];
            } else if (value === 'upcoming') {
                pstatus = ['pre launch'];
            } else if (value === 'ongoing') {
                pstatus = ['under construction'];
            } else if (value === 'ready-to-move') {
                pstatus = ['ready for possession', 'occupied'];
            } else if (value === 'under-construction') {
                pstatus = ['under construction'];
            } else if (value === 'new-launch') {
                pstatus = ['launch']
            } else if (value === 'completed') {
                pstatus = ['ready for possession', 'occupied'];
            }
            return pstatus;
        }

	var getBHKInfo = function(value){
            if (value) {
		var data = value.replace('bhk', '').replace(/\//g, '');
		return data ? parseInt(data) : 0;
	    }
	    return 0;
	}

	var getBudgetInfo = function(value){
	    var budgetInfo = {
		maxBudget : '0',
		minBudget : '0'
	    };
	    if (!value) {
		return budgetInfo;
	    }
	    var budgetData = value.replace('/','').split("-");
	    if (budgetData[0] == 'above') {
		if (budgetData.splice(-1)[0] == 'crores') {
		    budgetInfo['minBudget'] = budgetData[1] + '00';
		} else {
		    budgetInfo['minBudget'] = budgetData[1];
		}
	    }
	    else if (budgetData[0] == 'below') {
		if (budgetData.splice(-1)[0] == 'crores') {
		    budgetInfo['maxBudget'] = budgetData[1] + '00';
		} else {
		    budgetInfo['maxBudget'] = budgetData[1];
		}		    
	    }
	    else {
		budgetInfo['minBudget'] = budgetData[0];
		budgetInfo['maxBudget'] = budgetData[1];
	    }
	    return budgetInfo;
	}

        var getBudgetFromParams = function(value){
	    var budgetInfo = {
		maxBudget : '0',
		minBudget : '0'
	    };
	    if (value === 'luxury') {
                budgetInfo['minBudget'] = '100';
                budgetInfo['maxBudget'] = '100000'; // arbitrarily high value (1000 Cr);
            } else if (value === 'low-budget') {
                budgetInfo['maxBudget'] = '40';
            } else if (value === 'affordable') {
                budgetInfo['maxBudget'] = '40';
            }
            return budgetInfo;
	}


	var getUrlData = function (params, statename) {
		var deferred = $q.defer();
		var urlData = {
		id:undefined,
		bedroom:0,
		minBudget:0,
		maxBudget:0,
		city:undefined,
		locality:undefined,
		builder:undefined,
		baseUrl:undefined,
		propertyType:undefined,
		propertyTab:undefined,
		status:undefined,
		amenity:undefined,
		pageType:undefined,
		listingType:undefined,
		projectStatus:undefined,
		redirectUrl:undefined,
		oldId:undefined,
		cityId:undefined,
		localityId:undefined,
		suburbId:undefined,
		projectId:undefined,
		propertyId:undefined,
		suburb:undefined,
		builderId:undefined
		}
            
	    var calls = [];
	    urlData.city = params.cityName?params.cityName:undefined;
	    if (params.cityName) {
		calls.push(CityService.getMainCities().then(function (data) {		
		    if( data ){
			angular.forEach(data.data, function (val) {
			    if (val.label.toLowerCase().trim() == urlData.city.toLowerCase()) {
			    	if ( !urlData.redirectUrl ) {
		    			urlData.redirectUrl = params.cityName + '-real-estate';
			    	}
				urlData.cityId = val.id;
				if (!urlData.id) {
				    urlData.id = val.id;
				}
			    }
			});	
		    }else{
			deferred.reject('failed');	
		    }
		}));                
	    }
	    
	    if (params.propType) {
	    	urlData.propertyType = getPropType(params.propType);
            }
            if (params.listingType) {
                if (params.listingType == 'resale') {
                    urlData.listingType = ['true'];
                }
            }

            if (params.projectStatus) {
                urlData.projectStatus = getProjectStatus(params.projectStatus);
            }

	    if (params.bhkinfo) {
	        urlData.bedroom = getBHKInfo(params.bhkinfo);
	    }
	    
	    if (params.budgetFilter) {
		var budgetInfo = getBudgetInfo(params.budgetFilter);
		urlData.minBudget = budgetInfo.minBudget;
		urlData.maxBudget = budgetInfo.maxBudget;
	    } else if (params.budgetType) {
                var budgetInfo = getBudgetFromParams(params.budgetType);
                urlData.minBudget = budgetInfo.minBudget;
		urlData.maxBudget = budgetInfo.maxBudget;
            }

	    if (params.locinfo) {
		var locData = params.locinfo.split('-');
		var id = parseInt(locData.splice(-1));
		var locInfo = locData.join(' ').trim();
		if (getPageTypeById(id) == "locality") {
			urlData.id = id;
			urlData.localityId = id;
			calls.push(CommonLocationService.getBasicInfo('locality', id).then(function (data) {
				if( data ){
					urlData.locality = data.label.toLowerCase();
					urlData.suburb = data.suburb.label;
					urlData.suburbId = data.suburb.id;
					urlData.redirectUrl = data.url;
				} else {
					deferred.reject('failed');
				}
			}));
		} else if (getPageTypeById(id) == "suburb") {
		    urlData.id = id;
		    urlData.suburbId = id;	
		    calls.push( CommonLocationService.getBasicInfo( 'suburb', id ).then(function (data) {
		    	if (data) {
		    	    urlData.suburb = data.label.toLowerCase();
		    	    urlData.redirectUrl = data.url;
		    	}else{
		    	    deferred.reject('failed');
		    	}
		    }));
		}
	    }
	    if (params.entityId) {
		var pgType = getPageTypeById(parseInt(params.entityId));
		if (pgType == 'builder') {
		    urlData.id = params.entityId;
		    urlData.builderId = params.entityId;
		    calls.push(BuilderService.getCard(params.entityId, function (data) {
		    	return data;
		    }).then(function(data) {
		    	if (data) {
		    	    urlData.id = data.id;
		    	    urlData.builderId = data.id;
		    	    urlData.builder = data.builder;
				    urlData.redirectUrl = ( params.cityName ) ? params.cityName + '/' + data.url : data.url;
		    	}else {
		    	    deferred.reject('failed');
		    	}
		    }));
		} else if (pgType == 'locality') {
			urlData.id = params.entityId;
			urlData.localityId = params.entityId;
			calls.push(CommonLocationService.getBasicInfo('locality', params.entityId).then(function (data) {
				if( data ){
					urlData.locality = data.label.toLowerCase();
					urlData.suburb = data.suburb.label;
					urlData.suburbId = data.suburb.id;
					urlData.redirectUrl = data.url;
				} else {
					deferred.reject('failed');
				}
			}));
		} else if (pgType == 'suburb') {
		    urlData.id = params.entityId;
		    urlData.suburbId = params.entityId;
		    
		    calls.push( CommonLocationService.getBasicInfo( 'suburb', params.entityId ).then(function (data) {
		    	if (data) {
		    	    urlData.id = params.entityId;
		    	    urlData.suburbId = params.entityId;
		    	    urlData.suburb = data.label.toLowerCase();
		    	    urlData.redirectUrl = data.url;
		    	}else{
		    	    deferred.reject('failed');
		    	}
		    }));
		} else if (pgType == 'project') {
		    urlData.id = params.entityId;
		    urlData.projectId = params.entityId;
		    calls.push(ProjectService.getProjectDetail(params.entityId).then(function(data) {
		    	if( data.data ){
			    var projData = data.data;
			    urlData.id = projData.projectId;
			    urlData.projectId = projData.projectId;
			    urlData.locality = projData.locality.label;
			    urlData.localityId = projData.localityId;
			    urlData.suburb = projData.locality.suburb.label;
			    urlData.suburbId = projData.locality.suburbId;
			    urlData.builder = projData.builder.name;
			    urlData.builderId = projData.builderId;
			    urlData.redirectUrl = projData.URL;
		    	}else{
		    	    deferred.reject('failed');
		    	}
		    }));
		} else if (pgType == 'property') {
		    urlData.id = params.entityId;
		    urlData.propertyId = params.entityId;
		    calls.push(PropertyService.getPropertyDetail(params.entityId).then(function(data) {		    	
		    	if( data ){
			    var propData = data;
			    urlData.id = params.entityId;
			    urlData.projectId = propData.projectId;
			    urlData.locality = propData.project.locality.label;
			    urlData.localityId = propData.project.locality.localityId;
			    urlData.suburb = propData.project.locality.suburb.label;
			    urlData.suburbId = propData.project.locality.suburb.id;
			    urlData.builder = propData.project.builder.name;
			    urlData.builderId = propData.project.builderId;
			    urlData.redirectUrl = propData.URL;
		     	}else{
		     	    deferred.reject('failed');
		     	}
		    }));
		}
	    }

		$q.all(calls).then(function () {
			var arr = getPageType(params, statename);
			urlData.pageType = arr[0];
			urlData.templateId = arr[1];
			// var oldUrl = $location.path();
			// var urlParts = oldUrl.split( '/filters' );
			// if ( ( '/' + urlData.redirectUrl != urlParts[0] ) && ( '/maps/' + urlData.redirectUrl != urlParts[0] ) && ( urlData.pageType.toLowerCase().indexOf( 'overview' ) === -1 ) ) {
			// 	var newRedirectUrl = urlData.redirectUrl;
			// 	if ( urlParts.length > 1 ) {
			// 		newRedirectUrl = newRedirectUrl + '/filters' + urlParts[1];
			// 	}
			// 	if ( urlParts[0].indexOf( '/maps' ) == 0 ) {
			// 		newRedirectUrl = '/maps/' + newRedirectUrl;
			// 	}
			// 	$location.path( newRedirectUrl );
			// }
			deferred.resolve(urlData);
			return urlData;
	    });
	    
	    return deferred.promise;
	};

	return {
	    getUrlData : getUrlData,
	    getPageTypeById : getPageTypeById,
	    getPropType : getPropType,
	    getBudgetInfo : getBudgetInfo,
	    getBHKInfo : getBHKInfo,
	    getPageType : getPageType
	};
    }]);
