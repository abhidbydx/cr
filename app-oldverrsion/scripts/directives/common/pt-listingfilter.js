/**
   * Name: ptHeader Directive
   * Description: pt-header is common header of the application 
   *
   * @author: [Nakul Moudgil]
   * Date: Sep 24, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptListingfilter', function() {
  return {
    restrict : 'E',
    replace : true,  
    templateUrl : 'views/directives/common/pt-listingfilter.html',
    controller : function( $scope, $rootScope, $location, $modal, GlobalService, SearchService, NotificationService, CommonValidators, SignupService, Flags, $timeout, $element) {

      var typeaheadQuery = '';

      $scope.cityMapSupport = Flags.get('cityMapSupport');

      $scope.builderPlaceHolder = 'Please enter a builder name';
      $scope.localityPlaceHolder = 'Please enter a locality name';
      $scope.validateInputClass = "";

      $rootScope.$on('cityMapSupportMessage', function(event, param){
        $scope.cityMapSupport = Flags.get('cityMapSupport');        
      });

      $rootScope.VIEW_TYPES = {
        "PROJECT" : 1,
        "LISTING" : 2,
        "MAP" : 3,
        "NONE" : -1
      };
      
      var saveSearchModal,
          VIEW_TYPES =  $rootScope.VIEW_TYPES,
          VALID_TYPES = [
            'builder',
            'city', 
            'city-locality',  
            'city-suburb'
          ];

      $scope.searchSuggestions = function(text, mode){
        typeaheadQuery = text; 
		 return SearchService.getSearchSuggestions(text).then(function(response){
          if(mode == 'map'){
            var data = [];
            angular.forEach(response.data.data, function(value, key) {
              if((value.type != 'BUILDER') && (value.type != 'SUBURB') && (value.type != 'CITY')){
                data.push(value);
              }
            });
            return data;
          }
          return response.data.data;
        });
      };
      
      //TODO Handle it for project pages as well.
      //TODO Best to move this code to some helper
      var getViewType = function (pageType) {
        if($location.path().indexOf("maps") != -1) {
          return VIEW_TYPES.MAP;
        } else {
          if (pageType) {
            if(pageType == "builder" || pageType == "city"){
              return VIEW_TYPES.LISTING;
            } else if (pageType == "project") {
              return VIEW_TYPES.PROJECT;
            }
          }
        }
        // If non is returned then ideally it shoudl land to 404 page. 
        return VIEW_TYPES.NONE;
      };


      $scope.searchOptionSelected = function(item, model, label, mode){	
		//GA/Mixpanel tracking when user clicked on any auto suggest result
		var pageType = $rootScope.CURRENT_ACTIVE_PAGE, searchedFrom;
    searchedFrom = (typeof mode !=undefined) ? mode : "";    
    if(searchedFrom){
      $rootScope.TrackingService.sendGAEvent('search', 'autoSuggest', searchedFrom+'-'+item.type+'-'+pageType); 
    }else{
      $rootScope.TrackingService.sendGAEvent('search', 'autoSuggest', item.type+'-'+pageType); 
    }		
		$rootScope.TrackingService.mixPanelTracking('Auto Search', {'Query Keyword': typeaheadQuery,'Search Keyword': label, 'Search Type': item.type, 'Searched From': searchedFrom,'Page Name': pageType});
		mixpanel.people.increment("Auto Search");			
	  $scope.selValue = '';

	  $timeout(function () {$element.find("input").blur(); });
        if (getViewType() == VIEW_TYPES.MAP) {

            $rootScope.searchHandler(item);

        } else {
          if(mode == "map"){
            if(item.type == 'PROJECT'){
              var p_url = "/maps/"+item.localityURL;
              $location.path(p_url);
              $location.hash("projectId="+item.id.split('-')[2]);
            }
            else{
               $location.path("/maps/"+item.redirectUrl).search({});
             }
        }
        else{
          $location.path("/"+item.redirectUrl).search({});
        }
        }
      };

      //TORO 
      $rootScope.$watch('urlData', function(newValue, oldValue){
          if(newValue && newValue != oldValue){
            $scope.initialize = false;
            if(newValue.pageType){
              newValue.pageType = newValue.pageType.toLowerCase();
              //TODO newValue.builder hardcoding needs to be removed. 
              $rootScope["PARSED_URL_DATA"] = {"TYPE" : newValue.pageType, "BASE" : newValue.builder, "VIEW_TYPE" : getViewType(newValue.pageType), "SEARCH_OBJ" : newValue};              
            } else {
              console.log("ERROR GOT EMPTY PAGETYPE FOR THIS URL");
            }

          }
          else{
            $rootScope["PARSED_URL_DATA"] = undefined;
          }
      });


      //  Save Search functionality starts here   //
      $scope.saveSearchClicked = function() {
        saveSearchModal = $modal.open({
          templateUrl: 'views/modal/saveSearch.html'
        });
        
         
		//Send GA/Mixpanel tracker event request When user clicked on Save Search Button
		var searchObj = {}; 
		var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
		var subLabel = "-"+pageType;  
		 
		//GA tracker
		$rootScope.TrackingService.sendGAEvent('saveSearch', 'saveAttempt', subLabel); 	 
		//mixpanel tracker
		$rootScope.TrackingService.mixPanelTracking('Save Search Attempt', {'Page Name': pageType}); 
		//End Ga/mixpanel   
				
      };

      $scope.dismiss = function() {
        //  close the modal
        $scope.errMsg = '';
        saveSearchModal.dismiss();
      };

      var isMaps = function(){
        var curURL = $location.path();
        return curURL.indexOf('maps') != -1;
      }

      $scope.isMaps = isMaps;

      $scope.toggleMapList = function(takeToMaps){
        var curURL = $location.path();
        if(isMaps() &&  !takeToMaps){
	      viewTypeTracking('List');	
          $location.path(curURL.replace('/maps', ''));
          $rootScope.updateFilter('geo', 'true', {});  
        } 

        if(!isMaps() && takeToMaps){
		  viewTypeTracking('Map');	
          $location.path("/maps"+curURL);          
        }
      }
      //Ga/mixpanel tracker when view type change
	  var viewTypeTracking = function(viewType){ 		
		$rootScope.TrackingService.sendGAEvent('header', 'clicked', viewType+'-'+$rootScope.CURRENT_ACTIVE_PAGE); 	 	
		$rootScope.TrackingService.mixPanelTracking('View Type Change', {'View Type Name': viewType,'Page Name': $rootScope.CURRENT_ACTIVE_PAGE}); 	
	  }
	  
      $scope.saveSearch = function( saveText ) {
        //  TODO : check for input String, if fine make API call
        if ( CommonValidators.isValidString( saveText ) ) {
          saveSearchModal.close();
          if ( GlobalService.isLoggedIn() ) {
            var resp = SearchService.saveSearch( saveText );  //  returns true/false   
            if ( resp ) {
              //  close the modal and push notification
              $scope.errMsg = '';
            }
          }
          else {
            //  set the save Search cookie and open login box
            var url = $location.url();           
            if ( $location.hash() && $location.hash().length > 0 ) {
              url = $location.url() + '#' + $location.hash();
            }
            var saveSearchCookie = saveText + '#_#_#' + url.trim();
            //  set cookie and open modal window
            GlobalService.setCookie( 'save_search', saveSearchCookie );
            SignupService.openSignUp();
          }
        }
        else {
          //  update the error message
          $scope.errMsg = 'Please enter a valid string';
        }
      };
      //  Save Search functionality ends here   //
      

      $scope.setDefaultSort = function(){
          $scope.validateInputClass = "";
		  if($scope.selValue === undefined || $scope.selValue == ""){
			  $scope.validateInputClass = "redBorder";
			}
	  }


      
       //Send GA/Mixpanel tracker event request When user start typing in any of the form field 
		var formFillCheck = false; 
        $scope.formFill = function(){   
			if (formFillCheck == true) {
				return;
			} else {
				formFillCheck = true;  
				var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
				//GA tracker
				$rootScope.TrackingService.sendGAEvent('search', 'filled', 'filled-'+pageType); 	 
				//mixpanel tracker 
				$rootScope.TrackingService.mixPanelTracking('Search Initiated', {'Page Name': pageType}); 
				//End Ga/mixpanel  
			} 
		}
		


    }
  }  
});
