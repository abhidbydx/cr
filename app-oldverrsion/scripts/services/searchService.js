/**
   * Name: Search Service
   * Description: It will get projects from server   
   * @author: [Nakul Moudgil, Hardeep Singh]
   * Date: Oct 08, 2013
**/
'use strict';
angular.module('serviceApp') .config(function ( $httpProvider ) {        
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
  .factory('SearchService', function (GlobalService, $http, $location, NotificationService, GetHttpService, $rootScope) {
    var searchController = null;

    var getSearchSuggestions = function (text){
      var url = $rootScope.searchTypeAheadType ? text + "&typeAheadType=" + $rootScope.searchTypeAheadType : text;
      return $http.get(GlobalService.getAPIURL('app/v1/typeahead?query=' + url));
    };

    var getProjectSuggestions = function (text){
      var url = text + "&typeAheadType=" + "(project)";
      return $http.get(GlobalService.getAPIURL('app/v1/typeahead?query=' + url));
    };

    var getSearchResults = function(query, callback){

      var custom_url = "app/v1/project-listing?selector=";
      query = decodeURIComponent(JSON.stringify(query));
      $http.get(GlobalService.getAPIURL(custom_url+query)).then(function(response){
        callback(response.data);
      });
    };

    var saveSearch = function( saveText, url ) {
      if ( !saveText || saveText.trim().length == 0 ) {
        return false;
      }
      if ( !url ) {
        if ( $location.hash() && $location.hash().length > 0 ) {
          url = $location.url() + '#' + $location.hash();
        }
        else {
          url = $location.url();
        }
      }
      var saveObj = {
        name : saveText,
        searchQuery : url
      };

      //  TODO : call save search api here
      makeSaveCall( saveObj ).then( function( resp ) {
        if ( resp ) {
          NotificationService.setNotification({
            msg : $rootScope.labels.common.error.SEARCH_SAVED.replace('[[saveText]]', saveText),
            type: 'success'
          });
          
          //call GA/Mixpanel tracker 
		  searchTracking(saveText, $location.absUrl());
        }
        return resp;
      });
    };

    var makeSaveCall = function( saveObj ) {
      return $http({
        method : 'POST',
        url : GlobalService.getAPIURL( 'data/v1/entity/user/{userId}/saved-searches' ),
        data : saveObj
      }).then( function( response ) {
        GetHttpService.commonResponse( response, '', false );
        var resp, errorMsg = $rootScope.labels.common.error.SEARCH_SAVED_ERROR;
        if ( response.status === 200 ) {
          //  200OK
          resp = response.data;
          if ( resp.statusCode === '2XX' ) {
            return true;
          }
          else if ( resp.statusCode === '499' ) {
            //  Name already exists
            errorMsg = $rootScope.labels.common.error.SEARCH_SAVED_NAME_ERROR;
          }
          else if ( resp.statusCode === '498' ) {
            //  Search query already exists
            //  now check if name also already exists
            if ( resp.data.name === saveObj.name ) {
              //  if both fields are same, we simply fake the output as SUCCESS :D
              errorMsg = '';
              return true;
            }
            errorMsg = $rootScope.labels.common.error.SEARCH_SAVED_QUERY_ERROR.replace('[[saveText]]', resp.data.name);
          }
          else {
            errorMsg = ( resp.error.msg ) ? resp.error.msg : $rootScope.labels.common.error.SEARCH_SAVED_ERROR;
          }
        }
        NotificationService.setNotification({
          msg : errorMsg,
          type: 'error'
        });
        return false;
      });
    };

    var saveSearchAfterLogin = function() {
      var result = false;
      var __cookie = GlobalService.getCookie( 'save_search' );
      if ( __cookie && __cookie.indexOf( '#_#_#' ) !== -1 ) {
        var cSplit = __cookie.split( '#_#_#' );
        result = saveSearch( cSplit[0], cSplit[1] );
        GlobalService.setCookie( 'save_search', '' );
      }
      return result;
    };
    
    //Send GA/Mixpanel tracker event request when user successfully saved a search
    var searchTracking = function(searchName, searchQuery){ 
		var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
		var subLabel = "-"+pageType;   
		//GA tracker
		$rootScope.TrackingService.sendGAEvent('saveSearch', 'saved', subLabel); 	 
		//mixpanel tracker
		$rootScope.TrackingService.mixPanelTracking('Save Search Saved', {'Save Search Name':searchName , 'Save Search Query':searchQuery, 'Page Name': pageType}); 
		mixpanel.people.increment("Save Search Saved");
		//End Ga/mixpanel   
	}

    return {
      getSearchSuggestions: getSearchSuggestions,
      getProjectSuggestions: getProjectSuggestions,
      getSearchResults: getSearchResults,
      saveSearch : saveSearch,
      searchController : searchController,
      saveSearchAfterLogin : saveSearchAfterLogin
    };
});

