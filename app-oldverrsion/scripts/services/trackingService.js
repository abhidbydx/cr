/**
   * Name: Tracking Service
   * Description: This service is used to send all GA and mixpanel request
   * @author: [Zafar Khan]
   * Date: 12th feb, 2014
**/
'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {        
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .factory('TrackingService', function ($http, $rootScope, $window, $location, GlobalService, GetHttpService) {
    var headers = {
     'Content-Type' : 'application/x-www-form-urlencoded'
    };  
    
    //Function to send GA event request
    var sendGAEvent = function (category, action, label, value, non_int){  
	 
	  label = category + '-' + label;
	  label = label.toUpperCase()  	
	  if(value !== undefined) {
        if(non_int !== undefined) {
          _gaq.push( [ '_trackEvent', category, action, label, value, non_int ] );
        } else {
          _gaq.push( [ '_trackEvent', category, action, label, value ] );
        }
      }
      else {
        _gaq.push( [ '_trackEvent', category, action, label ] );
      }
      
     
    };
    
    //Function to send mixpanel request
    var mixPanelTracking = function (eventName, jsObj){
		//Common mixpanel tracking
		if(typeof jsObj['Page Name'] != 'undefined'){
			jsObj['Page Name'] = jsObj['Page Name'].toUpperCase();
		}else{
			jsObj['Page Name'] = 'HOME';
		}
		mixpanel.track(eventName, jsObj);		
		//Script to track Site Visited minxpanel event	
		var site_visit_mixpanel = GlobalService.getCookie('site_visit_mixpanel');
        if(!site_visit_mixpanel) return;
		var mixpanel_cookie_parse_json = $.parseJSON(site_visit_mixpanel);
        var mixpanel_visited = mixpanel_cookie_parse_json.visitedflag;		
		if(mixpanel_visited && mixpanel_visited == 1) {
			mixpanel.track('Site Visited', {'Landing Page Name' : jsObj['Page Name'], 'Landing Page URL' : $location.absUrl()});
			mixpanel.people.increment("Site Visited");
			var  siteVisitedObj = {'visitedflag': 0, 'pagename': jsObj['Page Name'], 'pageurl': 'proptiger.com'};	
			setcookie('site_visit_mixpanel', JSON.stringify(siteVisitedObj))
		}
		//End Site Visited minxpanel event
	
    };    
    //capitalize the first character of a string
    var capitaliseFirstLetter	= function ( str ){
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	// Javascript function to set cookies with path
	var setcookie = function(cname, cvalue){
		document.cookie = cname + "=" + cvalue + ";path=/";
	};
	
	/*
	 * This function is used to page view call for GA and mixpanel
	 * @param pageViewObj: type Object
	 * */
	var pageViewedCall = function (pageViewObj){		
		//When new content loaded execute GA event		
		var pageName = $rootScope.CURRENT_ACTIVE_PAGE.toUpperCase();
		if(typeof(pageViewObj) == 'undefined' || typeof(pageViewObj) != 'object'){
			pageViewObj = {}
		}		
		//Assign page name
		if(typeof pageViewObj['Page Name'] == 'undefined'){
			pageViewObj['Page Name']	= $rootScope.CURRENT_ACTIVE_PAGE;	
			pageName	= $rootScope.CURRENT_ACTIVE_PAGE.toUpperCase();
		}else{
			pageName = pageViewObj['Page Name'].toUpperCase();
		}
		 
		var FORUM_USER_ID = GlobalService.getCookie('FORUM_USER_ID');
		var visitorID = GlobalService.getCookie('visitorID');
		
		if(FORUM_USER_ID && typeof(FORUM_USER_ID) != 'undefined'){
			$window._gaq.push(["_setCustomVar", 2, "Member", FORUM_USER_ID, 2]);
		}else{
			$window._gaq.push(["_setCustomVar", 2, "Visitor", visitorID, 2]);
		}	
		$window._gaq.push(['_setCustomVar', 1, 'expandedPageName', pageName, 3]);
		$window._gaq.push(['_trackPageview']);	
		//End GA
		
		//-- mixpanel page viewed call for static page--				
		pageViewObj['Page Url']		= $location.absUrl();
		//-- mixpanel page viewed call for static page--
		mixPanelTracking('Page Viewed', pageViewObj);
		//End Mixpanel				
	}    
      
    return {
	  sendGAEvent 			: sendGAEvent,	
      mixPanelTracking 		: mixPanelTracking,
      capitaliseFirstLetter	: capitaliseFirstLetter,
      pageViewedCall		: pageViewedCall
    };
});
