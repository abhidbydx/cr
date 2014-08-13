//TODO Why  is item and urlData having different data structures?
//

'use strict';
angular.module('serviceApp').controller('searchFilter', function ($scope, $stateParams, $rootScope, $location, SearchService) {

     var VALID_TYPES = [ 'builder',
                        'city', 
                        'city-locality',  
                        'city-suburb'];

    // TODO : This needs to be moved out of rootscope. 
    $rootScope.VIEW_TYPES = {
    	'PROJECT' : 1,
    	'LISTING' : 2,
    	'MAP' : 3,
    	'NONE' : -1
    };

    var VIEW_TYPES =  $rootScope.VIEW_TYPES;

/**
	$scope.searchSuggestions = function(text){
        return SearchService.getSearchSuggestions(text).then(function(response){
            return response.data.data;
        });
    };
    */

    //TODO Handle it for project pages as well.
    var getViewType = function (pageType) {
    	if($location.path().indexOf('maps') !== -1) {
    		return VIEW_TYPES.MAP;
    	} else {
    		if (pageType) {
    			if(pageType === 'builder' || pageType === 'city') {
		          	return VIEW_TYPES.LISTING;
		    	} else if (pageType === 'project') {
		    		return VIEW_TYPES.PROJECT;
		    	}
		
    		}
    	}
    	// If non is returned then ideally it shoudl land to 404 page. 
    	return VIEW_TYPES.NONE;
    };


    $scope.searchOptionSelected = function(item, model, label) {
    	if (getViewType() == VIEW_TYPES.MAP) {
    		$location.path('/maps/' + item.redirectUrl);
    	} else {
    		$location.path('/'+item.redirectUrl);
    	}
        
    };

    //TORO 
    $rootScope.$watch('urlData', function(newValue, oldValue){
        if(newValue && newValue != oldValue){
            $scope.initialize = false;
            if(newValue.pageType) {
                //TODO why SALE-LISTING- is coming in page type
                newValue.pageType = newValue.pageType.replace('SALE-LISTING-', '');
                newValue.pageType = newValue.pageType.toLowerCase();
                //TODO newValue.builder hardcoding needs to be removed. 
                $rootScope.PARSED_URL_DATA = {'TYPE' : newValue.pageType, 'BASE' : newValue.builder, 'VIEW_TYPE' : getViewType(newValue.pageType), 'SEARCH_OBJ' : newValue};
            }
        }
    });
  
 });
