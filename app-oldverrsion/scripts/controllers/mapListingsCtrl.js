/**
* Name: mapListingsCtrl
* Description: This is controller for Map Listings page.
* @author: [Nimit Mangal, Amit Sagar, Yugal Jindle]
* Date: Oct 09, 2013
**/

'use strict';
angular.module('serviceApp')
  .controller('mapListingsCtrl', ['$rootScope', '$scope', 'pageSettings', 
                                    'markerFactory', 'ProjectService', 'LocalityService',
                                    'NotificationService', '$timeout', 'ProjectParser', 
                                    'LocalityParser', 'SearchService', 'Constants', '$location', 
                                    '$stateParams', 'FavoriteService', 'FilterService', 'Flags','UserService',
                                    function($rootScope, $scope, pageSettings,
                                            markerFactory, ProjectService, LocalityService,
                                            NotificationService, $timeout, ProjectParser, 
                                            LocalityParser, SearchService, Constants, $location, 
                                            $stateParams, FavoriteService, FilterService, Flags,UserService) {


    var refreshProjectsList, refreshLocalityList;
    //Explicitely Hiding Footer for maps

    $scope.pageSetting = pageSettings.defaultSettings;

    $scope.displaySettings  =   pageSettings.displaySettings;
    $scope.displaySettings.showpriceposs = true;
	
	//project information in detail
    $scope.projectDetail    =   {};

    //all visited project map
    $scope.visitedProjects = {};
    
    

    //------------------------TODO----------------
    //this type need to be in rootscope for now
    $rootScope.markerSettings = {
        displayType : 'type'
    };
            
    $scope.switchMappedProject = function(){
        var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
        var action = '';
        if($scope.displaySettings.showUnMapped){
            $scope.displaySettings.showUnMapped = false;
            //show all marker
            $('.sqm_project').show();
            action = 'Mapped';
            _updateMapFilter({ visible:true });
        } else {
            $scope.displaySettings.showUnMapped = true;
            //hide all markers
            $('.sqm_project').hide();
            action = 'Unmapped';
            $('.legends-dd ul li .sqm_project').show();

        }
        $scope.closeProjectDetailCard(false, true);
        
        //GA tracker On clicking Unmapped/mapped Projects
$rootScope.TrackingService.sendGAEvent('map', 'clicked', action+'-'+pageType);
//mixpanel tracker
$rootScope.TrackingService.mixPanelTracking(action+' Project', {'Project Count':$scope.pageSetting.unMappedCount, 'Locality ID':$rootScope.currentLocality.localityId, 'Page Name': pageType});

    };

    //convert all title into bootstrap tooltips
    var _tooltip = function(){
        $(document.body).tooltip({ selector: '[title]' });
    };

    var _removeWatch = function(idx, stopWatch) {
        if(stopWatch) {
            stopWatch();
        }
    };

    var _removeWatches = function(){
        $.each($scope.pageSetting.mapCtrlWatchList, _removeWatch);
    };

    $scope.$on('$destroy', function iVeBeenDismissed() {
        NotificationService.removeNotification();
        _removeWatches();
    });

    var _updateMap = function(data){
        var map = $scope.map.state;

        map.zoom = data.zoom ? data.zoom : map.zoom;
        map.center = data.center ? data.center : map.center;
    };

    var _updateMapFilter = function(data) {
        var fltr = $scope.map.state.filter, state = fltr.state;
        fltr.visible = (typeof data.visible !== 'undefined') ? data.visible : fltr.visible;
        fltr.action = data.action ? data.action : null;
        state.distance = state.lastDistance = data.distance ? data.distance : state.distance;
        state.position = data.position ? data.position : state.position;
    };

    var _localityClick = function(loc, callerLocation){

        $scope.displaySettings.requestType = 'project';
        $rootScope.currentLocality = loc;
        var locURL = loc.url, curURL = $location.path();

        if(curURL.indexOf('filters') != -1){
            locURL += '/filters';
        }

        $location.path("/maps/"+locURL);
        $timeout(function(){
            $scope.$digest();
        }, 10);
        //tracking code for locality click
        alvMarkerTracking('clicked', 'Locality Clicked', callerLocation, 'locality', loc);
    }
    
    var _localityHover = function(loc, callerLocation){	
//tracking code for locality hover
alvMarkerTracking('hover', 'Locality Hovered', callerLocation, 'locality', loc);	
}

var _projectHover = function(proj, callerLocation){	
//tracking code for project hover
alvMarkerTracking('hover', 'Project Hovered', callerLocation, 'project', proj);	
}

//GA/Mixpanel event On hovering/click on locality/project
var alvMarkerTracking = function (action, mixpanelEvent, callerLocation, listType, eventInfo){	
var pageType = $rootScope.CURRENT_ACTIVE_PAGE, mixpanelObj = {}, sublabel;	
if(listType == 'locality'){
sublabel	= listType+'-'+callerLocation+'-'+pageType
mixpanelObj['Locality ID'] = eventInfo.localityId
mixpanelObj['Çity ID'] = eventInfo.cityId
//mixpanelObj['Locality Ranking'] = ""
}else{
sublabel	=	listType+'-'+$rootScope.markerSettings.displayType+'-'+callerLocation+'-'+pageType
mixpanelObj['Project ID'] = eventInfo.projectId
mixpanelObj['View Type'] = $rootScope.markerSettings.displayType	
//mixpanelObj['Project Ranking'] = ""
}
$rootScope.TrackingService.sendGAEvent('map', action, sublabel);
//Mixpanel event call only for clicked event for now
if(action == 'clicked'){
mixpanelObj['Clicked From'] = callerLocation
mixpanelObj['Page Name'] = pageType	
$rootScope.TrackingService.mixPanelTracking(mixpanelEvent, mixpanelObj);
mixpanel.people.increment(mixpanelEvent);
}
}

    var activateLocality = function(loc){

        var center, data = {}, filter = {}, geo,
            state = $scope.map.state.filter.state,
            urlParams = $location.search(), hasURLGeo = urlParams && urlParams.geo;
            
            if(hasURLGeo){
                var geoParams = urlParams.geo.split(',');
                geo = {distance : geoParams[0], lat : geoParams[1], lon : geoParams[2]};
                filter.distance = parseFloat(geo.distance);
            } else {
                geo = {
                    'lat': loc.latitude,
                    'lon': loc.longitude
                };
            }
        
        $scope.localityClick = true;

        // Set zoom levels
        $scope.map.services.zoomLevel($rootScope.selectedCity.maxZoomLevel-2, $scope.map.state.maxZoom);

        //fetch projects from server for selected locality
        $scope.displaySettings.requestType = 'project';
        if(!loc.maxRadius) {
            geo.distance = state.minDistance;
            filter.distance = state.minDistance;
        } else if (loc.maxRadius > state.maxDistance) {
            geo.distance = state.maxDistance;
            filter.distance = state.maxDistance;
            $rootScope.updateFilter('geo', 'false', geo);
        } else {
            if(!hasURLGeo){
                filter.distance = loc.maxRadius;
                geo.distance = loc.maxRadius;
            }
        }

        $rootScope.updateFilter('cityid', 'false', [loc.cityId]);
        $rootScope.updateFilter('localityid', 'false', [loc.localityId]);

        $('#myLoader, .loader_image').show();
         if(FilterService.filters.maxDistance.selected.length > 0){
				  FilterService.filters.geo.selected = geo;
			}
			ProjectService.getProjectList(FilterService.createSearchQuery(), 'pricePerUnitArea,possessionDate', function(resp, status) {
			//hide loader
			$('#myLoader, .loader_image').hide();
			refreshProjectsList({data: resp, status: status});
         });


        //hide other markers
        $('.sqm_locality').hide();
        $('#locality_'+loc.localityId).show();

        $scope.localityCenter = loc.label;

        //focus map to this locality
        data.center = {lat: geo.lat, lng: geo.lon};
        data.zoom = $rootScope.selectedCity.maxZoomLevel;
        _updateMap(data);

        //create circle in invisible mode
        filter.visible = false;filter.position = data.center;
        _updateMapFilter(filter);
        $scope.$on('mapMarkerAdd', function() {   
			$('#myLoader, .loader_image').hide();
			UserService.getRecentlyViewed('',10000).then( function( data ) {
			if(data && data.length) {
                    for(var idx = 0, len = data.length; idx < len; idx++) {
						$('#project_'+data[idx].projectId).addClass('st-v');
					}
                }
        });
        $scope.updateFavoriteProjects();
        });
        
        

   };

    $scope.projectClick = function(proj, callerLocation) {

        var id = $scope.map.state.activeProjectId;        
        if(id && id == proj.projectId) {
            $scope.closeProjectDetailCard(true, true);
        } else {
            $scope.closeProjectDetailCard(false, true);
            $scope.openProjectDetailCard(proj.projectId, function() {
                //add visited to clicked item
                $('#project_'+proj.projectId).addClass('st-c');
                $scope.map.state.activeProjectId = proj.projectId;
            });
        }
        $('#gallery a').click();
        //add the project to visited projects map as well
        $location.hash("projectId="+proj.projectId);
        $scope.visitedProjects[proj.projectId] = 'st-v';

        $timeout(function(){$scope.$apply();}, 10);
        //tracking code for project item click
        alvMarkerTracking('clicked', 'Project Clicked', callerLocation, 'project', proj);
    };


    var onFilterChange = $scope.$on('FiltersUpdate', function(event, params){

        if(params.to.indexOf('filters') != -1){
           //show loader
            $('#myLoader, .loader_image').show();
            
            var query = params.query;

            if($scope.displaySettings.requestType === 'locality') {
                LocalityService.getLocalityList(query, function(resp, status) {
                    //hide loader
                    $('#myLoader, .loader_image').hide();
                    refreshLocalityList({data: resp, status: status});
                });
            } else {
                ProjectService.getProjectList(query, 'pricePerUnitArea,possessionDate', function(resp, status) {
                    //hide loader
                    $('#myLoader, .loader_image').hide();
                    refreshProjectsList({data: resp, status: status});
                });
            }
        }
    });

    $scope.pageSetting.mapCtrlWatchList.push(onFilterChange);

    var _updateDisplayOptions = function(type, markers) {
        var settings = $scope.displaySettings, map = $scope.map;
        settings.alvDisplayType = type;
        map.state.markers[type] = markers;
        map.services.drawMarkers();
        
        if(type === 'project'){
            settings.neighbourhood = true;
            settings.showUnMapped = false;
        } else {
            $rootScope.markerSettings.displayType = 'type';
            settings.neighbourhood = false;
        }

        _tooltip();


        $('.map-zoomin').removeClass('disabled');
        $('.map-zoomout').removeClass('disabled');
   };

    var _updateLocalityNeighbourhood = function(visibility){
        if(visibility) {
            $('.neighbour-icons').show();
        }
        else {
            $('.neighbour-icons').hide();
        }
    };

    var _visitProject = function(key, flag){
		var selector = '#project_'+key;
        $(selector).addClass('st-v');
    };
    var _updateVisitedProjects = function(){
        //hack as we dont know when marker are drawn on map
        $timeout(function(){
            $.each($scope.visitedProjects, _visitProject);
        }, 1000);
    };

    $scope.updateFavoriteProjects = function(){
        //hack as we dont know when marker are drawn on map
        $timeout(function() {
            var idx, len, marker, icon;
            FavoriteService.getMyFavorites().then(function(data) {
                if(data && data.length) {
                    for(idx = 0, len = data.length; idx < len; idx++) {
						marker = $('#project_'+data[idx].projectId);
                        marker.addClass('st-f');
                        icon = $('.projFav_'+data[idx].projectId);
                        icon.addClass('active');
                    }
                }
            });
        }, 1000);
    };

    var handleEmptyURL = function(){
        if($rootScope.cityList){
            $rootScope.showCitiesModal = true;
        }
        else{
            $rootScope.$watch("cityList", function(newCities){
                if(newCities){
                        $rootScope.showCitiesModal = true;
                    }
            });
        }
    }

    var activateCity = function (newCity) {
        var fltr = {}, center, data = {}, getCityData = true;

        var pageType = $rootScope.PARSED_URL_DATA.SEARCH_OBJ.pageType.replace("sale-listing-", '');
        getCityData = !( pageType == "city-locality" || pageType == "projectdetail");

        if(getCityData){
            if($scope.displaySettings.showCityChangeMessage) {
                NotificationService.setNotification({
                    msg : 'Icons on map represent localities. Explore a locality by clicking on its icon.',
                    type: 'info',
                    confirmText : 'OK',
                    onYes : function() {
                        $scope.displaySettings.showCityChangeMessage = false;
                    }
                });
            }
 
            //hide all markers
            $('.sq_marker').hide();

            // Update zoom levels
            $scope.map.services.zoomLevel($scope.map.state.minZoom, newCity.maxZoomLevel);

            center = {
                lat : newCity.centerLatitude,
                lng : newCity.centerLongitude
            };

            //set circle invisible
            fltr.visible = false;
            _updateMapFilter(fltr);
 
            //reposition map to new city
            data.center = center;data.zoom = newCity.minZoomLevel;
            _updateMap(data);
 
            //remove if any neighbourhood is opened
            $scope.removeNeighbourhood(null, 'locality', _inactiveLocalityNeighbourhood);

            $scope.map.zoomincounter = 0;
            $scope.map.zoomoutcounter = 0;

            //Updating filter data based on new City
            $rootScope.selValue = '';
            // reset request type
            $scope.displaySettings.requestType = 'locality';

            //fetch locality of this city
            $rootScope.updateFilter('geo', 'false', {});
            $rootScope.updateFilter('localityid', 'false', []);
            $rootScope.updateFilter('cityid', 'false', [newCity.id]); // we need to send cityId as an array

            $('#myLoader, .loader_image').show();

			LocalityService.getLocalityList(FilterService.createSearchQuery() , function(resp, status) {
                //hide loader
                $('#myLoader, .loader_image').hide();
                refreshLocalityList({data: resp, status: status});
            });
            
        }
    }

    var mapSearchController = function(parsedUrlData){

        var searchedData, settings, cityId, locId, subId, expandedPageName, gakey;
        if(parsedUrlData && parsedUrlData.TYPE && parsedUrlData.VIEW_TYPE == $rootScope.VIEW_TYPES.MAP) {
            //
            // 1. First check the type of the item.
            // 2. Then get the details of that item.
            // 3. If the item is in the current locality, then don't do anything.
            // 4. Then check if it is in the same city or, not. If not in the same city then ask for city change.
            // 5. Get the locality/city detail and draw the marker.

            searchedData = parsedUrlData.SEARCH_OBJ;
            settings = $scope.displaySettings;
            $rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.MAP+'-'+parsedUrlData.TYPE;


            parsedUrlData.TYPE = parsedUrlData.TYPE.replace('sale-listing-', '');
	    
            if(parsedUrlData.TYPE === "empty"){
                handleEmptyURL();
            }
            else if (parsedUrlData.TYPE === 'projectdetail') {
                settings.requestType = 'project';
                locId = searchedData.localityId;
                $scope.searchProjectId = searchedData.projectId;
                _findLocality(locId, function(curLoc) {
                    if(curLoc){
                        $rootScope.waitUpdateCity(searchedData.city, activateLocality, curLoc);
                    }
                });

                //no handling for project here, handling it at time of typeahead selection
            } else if (parsedUrlData.TYPE === 'builder') {
                console.log('implement builder search for maps');
            } else {
                cityId = searchedData.cityId;
                switch(parsedUrlData.TYPE){
                    case 'city' :
                        settings.requestType = 'locality';
                        $rootScope.waitUpdateCity(searchedData.city, activateCity);
                        break;
                    case 'city-locality' :
                        // Get the project detail.
                        settings.requestType = 'project';
                        locId = searchedData.localityId;
                        _findLocality(locId, function(curLoc) {
                            if(curLoc){
                                $rootScope.waitUpdateCity(searchedData.city, activateLocality, curLoc);
                            }
                        });
						$scope.$on('projectListingCallBack', function() {
					    if($location.hash().split("=")[0] == "projectId") {
								var objPro = {};
								objPro['projectId'] = $location.hash().split("=")[1];
								$scope.projectClick(objPro);
							}
						});
                        
                       break;
                    case 'city-suburb' :
                        // Suburb is not supported in maps for now, hence not writing logic for URL
                        settings.requestType = 'project';
                        subId = searchedData.suburbId;
                        break;
                    default :
                        console.log('IMPLEMENT SEARCH ON MAPS FOR '+parsedUrlData.TYPE);
                }
            } 
        }
    };

    var onSelectedCity = $scope.$watch("selectedCity" , function(city, oldData){
        if(city && city != oldData){
            var statsQuery = {"filters":{"and":[{"equal":{'cityLabel':city.label}}]}};
            FilterService.fetchStats(statsQuery);
            Flags.set('cityMapSupport', city);
            Flags.broadcast('cityMapSupport');
        }
    });

    $scope.pageSetting.mapCtrlWatchList.push(onSelectedCity);

    if($scope.urlData) {
        mapSearchController($scope.urlData);
    }
    SearchService.searchController = mapSearchController;

    $rootScope.searchHandler = function(item){
        $scope.displaySettings.requestType = 'project';
        $rootScope.markerSettings.displayType = 'type';
        $scope.displaySettings.neighbourhood = true;
        $scope.displaySettings.showUnMapped = false;
        $scope.removeNeighbourhood(null, 'locality', _inactiveLocalityNeighbourhood);
        if(item.city != $rootScope.selectedCity.label){
            switch(item.type){
                case "LOCALITY" :
                    NotificationService.setNotification({
                        msg : '"'+item.locality.charAt(0).toUpperCase() + item.locality.slice(1)+'" is in ' + item.city.toUpperCase()+'. Want to go there?',
                 type: 'alert',
                 isConfirm : true,
                        onYes : function() {
                            $location.path("/maps/"+item.redirectUrl).search({});
                        },
                        onNo : function() {
                        }
                    });
                    break;
                case "PROJECT" :
                    NotificationService.setNotification({
                        msg: 'Searched project is in '+item.city.toUpperCase()+'. Want to go there?',
                 type: 'alert',
                 isconfirm: true,
                        onYes : function() {
// Get the project detail.
                            $scope.displaySettings.requestType = 'project';
                            _handleProjectSearch(item);
                        },
                        onNo : function() {
                        }
                    });
                    break;
            }
        } else {
             switch(item.type){
                case "LOCALITY" :
                    $location.path("/maps/"+item.redirectUrl).search({});
                    break;
                case "PROJECT" :	
                    $scope.displaySettings.requestType = 'project';
                    _handleProjectSearch(item);
                    break;
            }
        }
    };

    var _handleProjectSearch = function(searchedData){
        var path = $location.path(),
            newPath = '/maps/'+searchedData.localityURL;
        $scope.searchProjectId = searchedData.id.replace("TYPEAHEAD-PROJECT-", '');

        if(path === newPath) {
            $location.search({});
            _fetchProjectDetail($scope.searchProjectId, function(project){
                $('#project_'+project.projectId).addClass('st-c');
                $scope.map.state.activeProjectId = project.projectId;
                $scope.searchProjectId = undefined;
            });
        } else {
            $location.path(newPath).search({});
        }
    };

    var _fetchProjectDetail = function(projId, callback){
        $scope.closeProjectDetailCard(false, true);
        $scope.openProjectDetailCard(projId, callback);
    };

    var _fetchProjectList = function(cityId, localityId) {
        var map = {}, fltr = {}, city;

        if (cityId) {
            city = _findCity(cityId);
        } else {
            cityId = $rootScope.selectedCity.id;
            city = _findCity(cityId);
        }
        //change the location on map
        var center = {
            lat : city.centerLatitude,
            lng : city.centerLongitude
        };

        //make the map filter invisible
        fltr.visible = false;
        if(localityId){
            _findLocality(localityId, function(curLoc) {
                if (curLoc) {
                    fltr.visible = true;
                    center = {
                        lat : curLoc.latitude,
                        lng : curLoc.longitude};
                    fltr.position = center;
                    fltr.distance = curLoc.maxRadius;
                    _updateMapFilter(fltr);
                    $scope.localityCenter = curLoc.label;
                }
 
                //reposition map to new city
                map.center = center;map.zoom = city.minZoomLevel;
                _updateMap(map);
            });
        } else {
             _updateMapFilter(fltr);
 
            //reposition map to new city
            map.center = center;map.zoom = city.minZoomLevel;
            _updateMap(map);
        }

        //hide all markers
        $('.sq_marker').hide();
        $('.legends-dd ul li .sqm_project').show();
        
        $rootScope.updateFilter('geo', 'false', {});
        if(localityId) {
            $rootScope.updateFilter('localityid', 'false', [localityId]);
        }
        $rootScope.updateFilter('cityid', 'true', [cityId]);
    };
    
    var _findCity = function(cityId){
        var cityList = $rootScope.cityList, i , len;
        for(i = 0, len = cityList.length; i < len; i++){
            if(cityId == cityList[i].id) {
                return cityList[i];
            }
        }
    };

    var _findLocality = function(locId, callback){
        if($rootScope.currentLocality && $rootScope.currentLocality.localityId == locId){
            callback($rootScope.currentLocality);
            return;
        }
        LocalityService.getLocalityById([locId], function(resp){
            if (!resp) {
                return;
            }
            $rootScope.currentLocality = resp[0];
            callback(resp[0]);
        });
    };

    var _handleError = function(status, list){
        if(status === 200) {
            $scope.displaySettings.showErrorMsg = false;

            if(!list || !list.totalCount || !_.keys(list).length || !list.data) {
                $scope.displaySettings.showErrorMsg = true;
                $('.sq_marker').hide();
                $('.legends-dd ul li .sqm_project').show();
                return false;
            }

            if($scope.localityClick){
                NotificationService.setNotification({
                    msg : 'Showing projects around '+$scope.map.state.filter.state.distance.toFixed(1)+' kms of '+$scope.localityCenter,
                    type: 'info',
                    confirmText : 'OK',
                    onYes: function() {
                    }
                });
                $scope.localityClick = false;
            }
 
            return true;
        }

        if(status === 500) {
            NotificationService.setNotification({
                msg : 'Oops! Something went wrong. Revive the map ?',
                type: 'error',
                onYes : function() {
                    $scope.backToCity();
                },
                onNo : function() {
                }
            });
        }

        return false;
    };


    refreshLocalityList = function(response) {
        var locality = response.data, status = response.status, cityMixpanelObj = {}, cityId;
$rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.MAP+'-sale-listing-city';
        //close project detail card
        $scope.closeProjectDetailCard(false, true);
        // On successful response
        if(_handleError(status, locality)) {
            var markerList = [], idx = 0, loc = {}, m = null, len = 0,
                pageSetting = $scope.pageSetting;
            
            pageSetting.reset();

            // Adding locality markers
            for( idx = 0, len = locality.data.length; idx < len; idx++) {
                loc = locality.data[idx];
                cityId = locality.data[idx].cityId;
                LocalityParser.parseLocalityList(loc);

                loc.markerWidth = (loc.projectCount).toString().length;

                m = new markerFactory.marker('locality', loc);
                markerList.push(m);

                if(idx < pageSetting.perPageCount) {
                    pageSetting.alvVisibleList.push(m);
                } else {
                    pageSetting.alvHiddenList.push(m);
                }

                m.click(_localityClick);
                m.alvClick(_localityClick);
                m.mouseEnter(_localityHover);
                m.alvMouseEnter(_localityHover);

                pageSetting.projectCount += loc.projectCount;
            }
            pageSetting.localityCount = len;
            _updateDisplayOptions('locality', markerList);
            
            //GA/Mixpanel City page view tracking                        
            cityMixpanelObj['City ID']			= cityId
            cityMixpanelObj['Locality Count']	= $scope.pageSetting.localityCount 
            cityMixpanelObj['Project Count']	= $scope.pageSetting.projectCount            
            $rootScope.TrackingService.pageViewedCall(cityMixpanelObj);
            //End Mixpanel 
        }
    };

    refreshProjectsList = function(response) {
        var projects = response.data, status = response.status, localityMixpanelObj = {};
        $rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.MAP+'-sale-listing-city-locality'
        // Trigger project listing
        $('.body_map').trigger('project-listing');

        //close project detail card
        $scope.closeProjectDetailCard(true, true);
 
        // On successful response
        if(_handleError(status, projects)) {
            var markerList = [], idx = 0, proj, m = null, len = 0, fltr = {}, project,
                pageSetting = $scope.pageSetting, mapFltr = $scope.map.state.filter,
                stats, rateRange, dateRange, maxRate = 0, maxDate = 0,minRate = 0, minDate = 0;

            pageSetting.reset();

            // ######################## Gradient ranges ######################## //
            if(projects.data.stats){
            rateRange = projects.data.stats.pricePerUnitArea;
            dateRange = projects.data.stats.possessionDate;
            minRate = projects.data.items[0].minPricePerUnitArea;
            minDate = projects.data.items[0].possessionDate;
            // Calculate resultant maxRate,maxDate,minRate,minDate
            for(idx=0, len=projects.data.items.length; idx<len; idx++) {
                proj = projects.data.items[idx];
                if(typeof proj.minPricePerUnitArea === 'number' && maxRate < proj.minPricePerUnitArea && proj.latitude) {
                    maxRate = proj.minPricePerUnitArea;
                }
                if(typeof proj.possessionDate === 'number' && maxDate < proj.possessionDate && proj.latitude) {
                    maxDate = proj.possessionDate;
                }
                if(typeof proj.minPricePerUnitArea === 'number' && minRate > proj.minPricePerUnitArea && proj.latitude) {
                    minRate = proj.minPricePerUnitArea;
                }
                if(typeof proj.possessionDate === 'number' && minDate > proj.possessionDate && proj.latitude) {
                    minDate = proj.possessionDate;
                }
                //if possession date is less than dec 11 then min is jan 12
                if(proj.possessionDate < Constants.JAN2012) {
                    dateRange.min = Constants.JAN2012;
                }
            }
            if(rateRange) {
                rateRange.max = maxRate;
            }
            if(dateRange) {
                dateRange.max = maxDate;
            }
            $scope.gradientRanges = {
                rateRange: (rateRange)? [rateRange.min, rateRange.max]:[],
                dateRange: (dateRange)? [dateRange.min, dateRange.max]:[]
            };
            }
            // #################################################################### //

            fltr.visible = true;
            fltr.action = mapFltr.action;
            _updateMapFilter(fltr);

            // Adding project markers
            for( idx = 0, len = projects.data.items.length; idx < len; idx++) {
                proj = projects.data.items[idx];

                project = ProjectParser.parseProject(proj, false, projects.data.stats);

                m = new markerFactory.marker('project', project);
                markerList.push(m);

                // if project lat lng is missing
                if (!proj.latitude || !proj.longitude) {
                    pageSetting.unMappedCount++;
                    pageSetting.unMappedProjects.push(m);
                } else {
                    if(idx < pageSetting.perPageCount) {
                        pageSetting.alvVisibleList.push(m);
                    } else {
                        pageSetting.alvHiddenList.push(m);
                    }
                }

                //attach some events on marker
                m.click($scope.projectClick);
                m.alvClick($scope.projectClick);
                m.mouseEnter(_projectHover);
                m.alvMouseEnter(_projectHover);

            }

            _updateDisplayOptions('project', markerList);

            //update visited project css
            _updateVisitedProjects();


            if($scope.searchProjectId){
                _fetchProjectDetail($scope.searchProjectId, function(project){
                    $('#project_'+project.projectId).addClass('st-c');
                    $scope.map.state.activeProjectId = project.projectId;
                    $scope.searchProjectId = undefined;
                });
            }
            //Mixpanel Locality page view tracking
            localityMixpanelObj['Locality ID']		= $rootScope.currentLocality.localityId
            localityMixpanelObj['City ID']			= $rootScope.currentLocality.cityId        
            localityMixpanelObj['Project Count']	= response.data.totalCount
            $rootScope.TrackingService.pageViewedCall(localityMixpanelObj);
            //End Mixpanel 

        }
    };

    $scope.openProjectDetailCard = function(projId, callback) {

var projectMixpanelObj = {};
        $scope.projectDetail = {};
        //show loader
        $('#projectLoader, .pro_loader_image').show();
        //fetch project detail from server
        ProjectService.getProjectDetail(projId, function(resp) {
            //hide loader

$('#projectLoader, .pro_loader_image').hide();
            $('#gallery a').click();
if(!resp || !resp.data) {
                return;
            }
 
$('.proj-card-wrap').animate({ height: '+=365px' }, 500, 'easeInOutSine');
$scope.displaySettings.projectDetail++;

            $scope.projectDetail = ProjectParser.parseProject(resp.data, true);

            //hide gallery if no images
            if(!resp.data.images || !resp.data.images.length){
                $('.projectDetailsTabs #gallery').hide();
            }
            //GA/Mixpanel Project page view tracking
            projectMixpanelObj['Page Name']			= Constants.GLOBAL.PAGE_TYPES.MAP+'-'+Constants.GLOBAL.PAGE_TYPES.PROJECTDETAIL            
            projectMixpanelObj['Project ID']		= $scope.projectDetail.projectId
            projectMixpanelObj['Image Available']	= $scope.projectDetail.images.length
            projectMixpanelObj['Comments']			= 0
            projectMixpanelObj['User Participation']= 0 
            projectMixpanelObj['Video Count']		= 0            
            $rootScope.TrackingService.pageViewedCall(projectMixpanelObj); 
			//End Mixpanel

            //hide locality neighbourhood
            $scope.displaySettings.neighbourhood = false;

            if(callback) {
                callback($scope.projectDetail);
            }
        });

        //hide neighbourhood
        _updateLocalityNeighbourhood(false);
    };

    var _inactiveLocalityNeighbourhood = function(){
        var elem = $('.neighbourhood-dd-wrap');
        if(elem.hasClass('active-neighbour')) {
            elem.removeClass('active-neighbour');
            elem.find('li').removeClass('active-neighbour');
        }
    };

    var _inactiveProjectNeighbourhood = function(){
        var elem =$('.proj-card-wrap .neighbour-col');
        elem.find('li a').removeClass('active-neighbour');

        elem =$('.proj-card-wrap .connectivity-col');
        elem.find('li a').removeClass('active-neighbour');
    };

    $scope.closeProjectDetailCard = function(showNeighbourhood, closeCard) {
        //remove if any neighbourhood is opened
        $scope.removeNeighbourhood(null, 'project', _inactiveProjectNeighbourhood);

        //show locality neighbourhood
        $scope.displaySettings.neighbourhood = showNeighbourhood;

        //show hidden localtiy neighbourhood
        _updateLocalityNeighbourhood(showNeighbourhood);

        //reset filter state
        $scope.map.services.state.reset();
        if(closeCard) {
            $scope.displaySettings.projectDetail = 0;
$('.proj-card-wrap').animate({
         opacity:'1',
        height:'0px'
   });
        }

        //show all project markers
        if(!$scope.displaySettings.showUnMapped) {
            $('.sqm_project').show();
        }
        // Trigger close project detail card
        $('.body_map').trigger('project-detail-close');

        //set active marker null if any
        if($scope.map.state.activeProjectId) {
            var selector = $("#project_"+$scope.map.state.activeProjectId);
            if(selector.hasClass('st-c')) {
                selector.removeClass('st-c');
                selector.addClass('st-v');
            }
        }
        $scope.map.state.activeProjectId = null;
    };

    // ========== Map State ==========
    $scope.map = {
        state: {
            zoom : 5,
            center: {
                lat: 21.0000,
                lng: 78.0000
            },
            minZoom : 9,
            maxZoom : 22,
            filter: {
                visible: false,
                action : null,
                state: {
                    distance: 2,
                    minDistance: 2,
					maxDistance: 7,
                    lastDistance: 2,	
                    position: {
                        lat: 21.0000,
                        lng: 78.0000
                    }
                }
            },
            libraries : {},
            markers : {},
            neighbourhood : {
                'locality' : {},
                'project' : {}
            },
            activeProjectId : null
        },
        events: {
            resize: false,
            zoomin: false,
            zoomout: false
        },
        services: {
            zoomLevel: undefined, // function(minZoom, maxZoom)
            direction: {
                create: undefined, // function(x1, y1, x2, y2)
                remove: undefined // function()
            },
            bounds: undefined,
            drawMarkers: undefined,
            state: {
                save: function(mapState) {
                    window.__mapState = window.__mapState || {};
                    // Copying all primitives
                    window.__mapState = {
                        zoom: mapState.zoom,
                        center: {
                            lat: mapState.center.lat,
                            lng: mapState.center.lng
                        },
                        filter: {
                            visible: mapState.filter.visible,
                            state: {
                                distance: mapState.filter.state.distance,
                                position: {
                                    lat: mapState.filter.state.position.lat,
                                    lng: mapState.filter.state.position.lng
                                }
                            }
                        }
                    };
                },
                restore: function(mapState) {
                    var backup = window.__mapState;
                    if(backup) {
                        mapState.zoom = backup.zoom;
                        mapState.center = {
                            lat: backup.center.lat,
                            lng: backup.center.lng
                        };
                        mapState.filter.visible = backup.filter.visible;
                        mapState.filter.state.distance = backup.filter.state.distance;
                        mapState.filter.state.position = {
                            lat: backup.filter.state.position.lat,
                            lng: backup.filter.state.position.lng
                        };
                    }
                    $scope.map.services.state.reset();
                },
                reset: function(){
                    window.__mapState = null;
                }
            }
        },
        zoomincounter : 0,
        zoomoutcounter : 0
    };
    
    var mapState = $scope.$watch('map.state.filter.state', function(nState, oState) {

        if(nState && $scope.map.state.filter.action === 'drag' ) {

            $scope.localityCenter = 'locality center';
            $rootScope.updateFilter('localityid', 'false', []);
            var c = {
                distance : nState.distance.toFixed(2)/1,
                lat : nState.position.lat.toFixed(4)/1,
                lon : nState.position.lng.toFixed(4)/1
            };
            $rootScope.updateFilter('geo', 'true', c);
        }
    }, true);
    $scope.pageSetting.mapCtrlWatchList.push(mapState);

    // ========== Zoom Control ==========
    $('body').delegate('.map-zoomin', 'click', function() {
//GA/Mixpanel event On Zooming In by button click
if($scope.map.state.zoom+2 <= $scope.map.state.maxZoom) {
var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
$rootScope.TrackingService.sendGAEvent('map', 'clicked', 'zoomIn-Button-'+$scope.map.state.zoom+1+'-'+pageType);
$rootScope.TrackingService.mixPanelTracking('Map Zoom In', {'ZoomIn Type': 'Button', 'Zoom Level': $scope.map.state.zoom+1, 'Page Name': pageType});
}	
        $scope.map.events.zoomin = true;
        $timeout(function(){$scope.$apply();}, 10);	
        if($scope.displaySettings.alvDisplayType === 'locality' && $rootScope.selectedCity.maxZoomLevel === $scope.map.state.zoom) {
            NotificationService.setNotification({
                msg : 'Explore a locality by clicking on its icon.',
                type: 'info',
                confirmText : 'OK',
                onYes : function() {
                }
            });
        }
    });
    $('body').delegate('.map-zoomout', 'click', function() {
//GA/Mixpanel event On zoomout In by button click
if($scope.map.state.zoom-2 >= $scope.map.state.minZoom) {
var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
$rootScope.TrackingService.sendGAEvent('map', 'clicked', 'zoomOut-Button-'+$scope.map.state.zoom-1+'-'+pageType);
$rootScope.TrackingService.mixPanelTracking('Map Zoom Out', {'ZoomIn Type': 'Button', 'Zoom Level': $scope.map.state.zoom-1, 'Page Name': pageType});
}
        $scope.map.events.zoomout = true;
        $timeout(function(){$scope.$apply();}, 10);

        if($scope.displaySettings.alvDisplayType === 'project' && $rootScope.selectedCity.maxZoomLevel-2 === $scope.map.state.zoom) {
            NotificationService.setNotification({
                msg : ( $rootScope.selectedCity ) ? 'Take me to '+$rootScope.selectedCity.label.toUpperCase()+' view.' : 'Take me to city view.',
                type: 'alert',
                isConfirm: true,
                onYes : function() {
                    $scope.backToCity();
                },
                onNo : function() {
                }
            });
        }
    });
    // ===================================

    // ========== Alv ==========
    $scope.alvState = true;
    // Resize map when ALV closes
    var alvState = $scope.$watch('alvState', function(alvState) {
        if(!alvState) {
            $scope.map.events.resize = true;
        }
    });
    $scope.pageSetting.mapCtrlWatchList.push(alvState);
    // =========================

    $rootScope.updateMapFilter = function(filter){
       var fltr = $scope.map.state.filter.state;
       fltr.distance = parseFloat(filter.distance);
       fltr.position = {lat : parseFloat(filter.lat), lng : parseFloat(filter.lon)};
    };
    var mapZoom = $scope.$watch('map.state.zoom', function(current, last) {
        var settings = $scope.displaySettings, zoomin = $('.map-zoomin'),
            zoomout = $('.map-zoomout');
        
        if(!current) {
            return;
        }
        
        if(settings.requestType === 'locality') {
            if(current === $scope.map.state.minZoom){
                zoomout.addClass('disabled');
            } else {
                zoomout.removeClass('disabled');
            }

            if($rootScope.selectedCity && current === $rootScope.selectedCity.maxZoomLevel) {
                zoomin.addClass('disabled');
            } else {
                zoomin.removeClass('disabled');
            }
        } else {
            if($rootScope.selectedCity && current === $rootScope.selectedCity.maxZoomLevel-2){
                zoomout.addClass('disabled');
            } else {
                zoomout.removeClass('disabled');
            }

            if(current === $scope.map.state.maxZoom) {
                zoomin.addClass('disabled');
            } else {
                zoomin.removeClass('disabled');
            }
        }

        if(current > last) {
            $scope.map.zoomincounter++;
            $scope.map.zoomoutcounter = 0;
        } else {
            $scope.map.zoomincounter = 0;
            $scope.map.zoomoutcounter++;
        }

        if ( $scope.map.zoomoutcounter >= 2 && settings.requestType === 'project') {
            //$('#backToCity').addClass('backtocity');
        }
    });
    $scope.pageSetting.mapCtrlWatchList.push(mapZoom);
    
    $scope.backToCity = function() {

        $scope.displaySettings.requestType = 'locality';
        var cityURL = $rootScope.selectedCity.label.toLowerCase() + '-real-estate',
            curURL = $location.path();

        delete($location.search().geo);

        if(curURL.indexOf('filters') != -1){
            cityURL += '/filters';
        }

        $location.path("/maps/"+cityURL);

        $timeout(function(){
            $scope.$digest();
        }, 10);
         
        //GA/Mixpanel event On clicking Back to City
        var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
        $rootScope.TrackingService.sendGAEvent('map', 'clicked', 'backToCity');
$rootScope.TrackingService.mixPanelTracking('Back to City', {'City ID': $rootScope.selectedCity.id, 'Page Name': pageType});


    };

    $scope.addNeighbourhood = function(type, level, position, radius, direction) {
        var i = 0, data = null, obj, m, len, markerList = [];
        position = position || $scope.map.state.filter.state.position;
        radius = radius || $scope.map.state.filter.state.distance;
        direction = direction || false;
		//show loader
        $("#neighbourhoodLoaderProject").show();
	    LocalityService.getNeighbourhood(position,radius,type[0], function(results) {
                //hide loader
                $("#neighbourhoodLoaderProject").hide();
                for(i=0, len = results.length; i<len; i++) {
                    data = results[i];
                    
                    // Add direction info
                    data['__direction__'] = direction;
                    if(!direction) {
                        data['__tooltip__'] = data.name;
                    }
                    m = new markerFactory.marker(type, data);
                    markerList.push(m);
                }
                // With marker list
                $scope.map.state.neighbourhood[level][type] = markerList;
                $scope.map.services.drawNeighbourhoodMarkers({'type':type, 'level':level, 'project':position, 'direction':direction});
            });
       
    };

    var removeNeighbourhood = function(type, level){
        $timeout(function(){
            $scope.map.services.drawNeighbourhoodMarkers({'type':type, 'level':level});
        }, 10);
    };

    $scope.removeNeighbourhood = function(types, level, callback) {
        var i = 0, len;
        types = types || _.keys($scope.map.state.neighbourhood[level]);
        for(i = 0, len = types.length; i < len; i++) {
            removeNeighbourhood(types[i], level);
        }

        if(callback) {
            callback();
        }
    };

   $scope.neighbourhoodItems   =   function(radius,position) {
	            position = position || $scope.map.state.filter.state.position;
                radius = radius || $scope.map.state.filter.state.distance;
                var data = "";
                $scope.neighbourhoodValue = {
		               'school':0,
		               'restaurant':0,
		               'hospital':0,
		               'gas_station':0,
		               'bank':0,
		               'airport':0,
		               'train_station':0,
		               'bus_station':0
		               };
                $("#neighbourhoodLoader").show();
                $("#neighbourhoodLoaderProject").show();
                LocalityService.getNeighbourhood(position,radius,'', function(results) {
			    if(results !== ""){
					for(var i=0, len = results.length; i<len; i++) {
						data = results[i];
						$scope.neighbourhoodValue[data.localityAmenityTypes['name']] += 1;
					}
				}
				    $("#neighbourhoodLoader").hide();
					$("#neighbourhoodLoaderProject").hide();
				});
            };

    //pagination
    $scope.loadMore = function() {
        var pageSetting = $scope.pageSetting;
        if(!pageSetting.alvHiddenList || !pageSetting.alvHiddenList.length) {
            return;
        }

        var ary = pageSetting.alvHiddenList.splice(0, pageSetting.perPageCount);
        pageSetting.alvVisibleList = pageSetting.alvVisibleList.concat(ary);
    };
    
    $scope.$on('$viewContentLoaded', function readyToTrick() {
        // say hello to your new content here
        // BUT NEVER TOUCHES THE DOM FROM A CONTROLLER
    });
   
            (function(){
                //  set circle visible
                $scope.map.state.filter.visible = false;
                //  reset request type
                $scope.displaySettings.requestType = 'locality';
                //set page name
                $rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.MAP;               
            })();


}]);
