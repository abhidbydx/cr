/**
   * Name: filterCtrl
   * Description: This is controller for Filters.
   * @author: [Nimit Mangal]
   * Date: Nov 18, 2013
**/


'use strict';
angular.module('serviceApp')
  .controller('filterCtrl', ['$rootScope', 
                            '$scope', 
                            'pageSettings', 
                            'ProjectService', 
                            'LocalityService', 
                            'BuilderService', '$window', '$location','$state', '$timeout', '$stateParams', 'FilterService', 'Flags',
                            function ($rootScope, 
                                    $scope, 
                                    pageSettings, 
                                    ProjectService, 
                                    LocalityService, 
                                    BuilderService, $window, $location, $state, $timeout, $stateParams, FilterService, Flags) {


    $scope.filters = FilterService.filters;
    $scope.displaySettings  =   pageSettings.displaySettings;

    var inMoreFilter = ['propertyType', 'bath', 'listingType', 'projectStatus', 'completionDate', 'size', 'builder'];

    var otherFilter = ['bed', 'budget'];
    
    $scope.clearAll =   function(){
		//GA/mixpanel tracker when reset filter	
		if($scope.displaySettings.appliedFilter >= 1){			
			$rootScope.TrackingService.sendGAEvent('filter', 'clicked', 'resetFilter-'+$rootScope.CURRENT_ACTIVE_PAGE);	 
			$rootScope.TrackingService.mixPanelTracking('Filter Reset', {'Page Name': $rootScope.CURRENT_ACTIVE_PAGE}); 
		}
		$location.path($location.path().replace('/filters','')).search({});        
			
    };
    
    $scope.clearBed = function() {
        var urlFltr = $location.search(),
            curURL = $location.path(),
            fltr = $scope.filters.bed;
        if(fltr.reset) fltr.reset(fltr);
        delete urlFltr[fltr.key];

        if(_.keys(urlFltr).length === 0) {
            $scope.clearAll();
        } else {
            $location.search(urlFltr);
            //hack: if called from clear bedrooms
            $rootScope.updateFilter(null, 'true', {});
        }
    };

    $scope.add      =   function($item, $model, $label, filter){
        if ( filter === 'builder' ) {
            //  reseting typeahead
            $scope.filters.builder.selecteditem = '';
        }

        var fltr    =   $scope.filters[filter]['selection'], data = [], pageType = $rootScope.CURRENT_ACTIVE_PAGE;

        //Extra hack to stop add builder/locality if aldeady added 6
        if($scope.filters[filter]['selected'].length >= 6){
            return false;
        }
        
        if ( fltr[$item.label] === $item.label ) {
            delete fltr[$item.label];
        }
        else {
            fltr[$item.label] = $item.label;
        }    
       
        $.each( fltr, function(idx, val){
            data.push( val );                                                                                                                 
        }); 
        $rootScope.updateFilter(filter, 'true', data);        
		//Send GA/Mixpanel tracker event request on applying filter 				
		$rootScope.TrackingService.sendGAEvent('filter', 'filtered', filter+":"+$item.label+"-"+pageType); 	 
		//mixpanel tracker 
		$rootScope.TrackingService.mixPanelTracking('Filter Used', {'Filter Name': filter, 'Filter Value': $item.label, 'Page Name': pageType});   

        updateRecommended( filter, $item.label );
    };

    $scope.remove   =   function(filter, label){
        var fltr    =   $scope.filters[filter]['selection'], data = [];
        delete fltr[label];
 
        $.each( fltr, function(idx, val){
            data.push( val );                                                                                                                 
        }); 
        $rootScope.updateFilter(filter, 'true', data);  

       updateRecommended( filter, label );
    };
            
    var updateRecommended = function(filter, label){
        var recommended = $scope.filters[filter].recommended;
        $.each( recommended, function( cnt, obj ) {
            if ( obj.label === label ) {
                obj.notVisible = !obj.notVisible;
            }
        });
    }; 

    // Updates a single filter on click
    $rootScope.updateFilter =   function(filter, fetch, data){
        var query, loc, settings = $scope.displaySettings, result = {};
		//update data
        if(filter)
            $scope.filters[filter]['selected'] = data;
		//if fetch true and city selected then fetch data from server        
        if(fetch === 'true') {
			
            query = FilterService.createSearchQuery();

            var obj = query ? FilterService.beautifyURL(JSON.parse(query).filters) : {};

            if(FilterService.skipFilters.indexOf(filter) == -1) {
                var curURL = $location.path();
                if(!_.isEmpty(obj)){

                    if(filter == 'locality'){
                        var pageType = $rootScope.urlData.pageType.replace('sale-listing-', '').replace('city-', '');

                        if(pageType == 'locality'){
                            curURL = $rootScope.urlData.city + '-real-estate';
                        }
                    }

                    if(curURL.indexOf('filters') == -1){
                        curURL += '/filters';
                    }                    
                } else {
                    curURL = curURL.replace('/filters', '');
                }                       

                $location.path(curURL).search(obj);
			} else {
                $rootScope.$broadcast('FiltersUpdate', {query: FilterService.createSearchQuery(), to: $location.path(), from: $location.path()});         
            }
        } 
       
    };

    $scope.getAppliedFilters = function(filter){
        var selected = $scope.filters[filter]['selection'];
        var keys = [], key;
        
        if(selected instanceof Object){
            for(key in selected){
                if(selected[key]){
                    keys.push(key);    
                }
            }
        }
        return keys.join();
    };

    $scope.filters.builder.hide = Flags.get('listingType') == 'builder';
    $scope.filters.locality.hide = Flags.get('listingType') == 'builder';
    var onListingChange = $rootScope.$on('listingTypeMessage', function(event, params){
        $scope.filters.builder.hide = params.value == 'builder';
        $scope.filters.locality.hide = params.value == 'builder';
    }),

    onURLChange = $rootScope.$on('$locationChangeSuccess', function (event, to, from) {
	   FilterService.updateFilters();
       $rootScope.$broadcast('FiltersUpdate', {query: FilterService.createSearchQuery(), to: to, from: from});
    });

    $scope.$on('$destroy', function(){
        onURLChange();
        onListingChange();
    })

    //Load builder data for tagInput filter
    $scope.loadBuilderData = function(query) {    
        return $scope.filters.builder.data;      
    };

    //Load locality data for tagInput filter
    $scope.loadLocalityData = function(query) {    
        return $scope.filters.locality.data;      
    };



}]);
