/**
 * Name: Routes
 * Description: It containes routes mapping to controller and view template.
 * @author: [Nakul Moudgil]
 * Date: Sep 9, 2013
 **/
'use strict';

angular.module('serviceApp', ['ngTagsInput', 'environment', 'ui.slider','ui.router', 'ChartConfig','WidgetConfig','angularTreeview','ngGrid','$strap.directives', 'ui.bootstrap', 'ngCookies', 'utilityfilters', 'once', 'facebook', 'googleplus', 'ngSanitize'])
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'FacebookProvider', 'GooglePlusProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, FacebookProvider, GooglePlusProvider) {
	var fb_key = $('#app_keys #fb_key').html(),
        g_cid  = $('#app_keys #g_cid').html();

	// appends trailing slash if missing, all routes must be defined with trailing /
	// removes trailing slash if present

	$urlRouterProvider.rule(function($injector, $location) {
	    var path = $location.path()
            // Note: misnomer. This returns a query object, not a search string
            , search = $location.search()
            , params
            ;

	    // check to see if the path does not end in '/'
	    if (path[path.length - 1] !== '/') {
		return;
	    }

	    // If there was no search string / query params, return with a `/`
	    if (Object.keys(search).length === 0) {
		return path.slice(0, -1);
	    }

	    // Otherwise build the search string and return a `/?` prefix
	    params = [];
	    angular.forEach(search, function(v, k){
		params.push(k + '=' + v);
	    });
	    return path.slice(0, -1) + '?' + params.join('&');
	});


	// default url
	$urlRouterProvider.otherwise('/404');

	FacebookProvider.init( fb_key );
	GooglePlusProvider.init({
            clientId: g_cid
	});


	// general listing route
	
	var getListingRoute = function (url, statename) {
 	    return {
		url : url,
		templateUrl: 'views/controller/listings.html',
		controller: 'listings',
		resolve: {
		    urlData : ['$state', '$stateParams', 'UrlDataService', '$rootScope', function ($state, $stateParams, UrlDataService, $rootScope) {
			return UrlDataService.getUrlData($stateParams, statename).then(function (data) {		
			    $rootScope.urlData = data;
			    return data;
			}, function (reason) { $state.go('base.static', {staticPage:'404'})});               
		    }]
		}
	    };
	}
	

	// general maps route
	var getMapsRoute = function (url, statename) {
	    return {
 		url : url,
		onEnter: function($rootScope, $stateParams, $http, $window){
		    $rootScope.filterQuery = $stateParams;
		    $rootScope.showCitiesModal = false;
		}, 
		resolve: {
		    urlData : ['$state', '$stateParams', 'UrlDataService', '$rootScope', function ($state, $stateParams, UrlDataService, $rootScope) {
			return UrlDataService.getUrlData($stateParams, statename).then(function (data) {		
			    $rootScope.urlData = data;
			    return data;
			}, function (reason) { $state.go('base.static', {staticPage:'404'})});               
		    }]
		}
	    };
	}
	
	$locationProvider.html5Mode(true).hashPrefix('!');
	$stateProvider
	// abstract base state for langservice injection
	    .state('base', {
	    	url : '/',
	    	abstract : true,
		template : '<div ui-view> </div>',
	    	resolve : {
	    	    labels : ['LangService', '$rootScope',  function (LangService, $rootScope) { 
	    		return LangService.then(function (data) {
	    		    $rootScope.labels = data;
	    		    return data;
	    		}); 
	    	    }]
	    	}
	    })
	// portfolio abstract base state
	    .state('base.portfolio', {
		url: 'portfolio/',
		abstract : true,
		templateUrl: 'views/controller/portfolioIndex.html',
		controller:'portfolioIndexCtrl'
	    })
	// portfolio
	    .state('base.portfolio.visibleModule', {
		url: ':visibleModule',
		templateUrl: 'views/controller/portfolio.html',
		controller: 'portfolioCtrl'
	    })
	    .state('base.portfolio.propertyDetail', {
		url: 'property/:propertyId',
		templateUrl: 'views/controller/property-detail.html',
		controller: 'propertyDetailCtrl'
	    })
	    .state('base.home', {
		url: '',
		templateUrl: 'views/controller/home.html',
		controller: 'homeCtrl',
		onEnter: function($rootScope){
			$rootScope.hideSearch = true;
		}, 
		onExit: function($rootScope){
			$rootScope.hideSearch = false;
		},
		resolve: {
		    urlData : ['$state', '$stateParams', 'UrlDataService', '$rootScope', function ($state, $stateParams, UrlDataService, $rootScope) {
			return UrlDataService.getUrlData($stateParams, 'base.home').then(function (data) {		
			    $rootScope.urlData = data;
			    return data;
			}, function (reason) {$state.go('base.static', {staticPage : '404'})});               
		    }]			  	
		}
	    })
	// static pages in on route
	    .state('base.static', {
		url: '{staticPage:nri|aboutus|vaastu|homeloan|documents|faqs|builderpartner|ourservices|management-team|proptiger-media|privacy-policy|user-agreement|careers|sitemap|contactus|emi|disclaimer|404|server-error}',
		templateUrl: function (stateParams) {
		    var templatepath = '';
		    switch(stateParams.staticPage) {
		    case 'aboutus':
			templatepath = 'views/directives/static/pt-about.html';
			break;
		    case 'documents':
			templatepath = 'views/directives/static/pt-required-documents.html';
			break;
		    case '404':
			templatepath = 'views/directives/static/pt-404-error.html';
			break;
		    default : 
			// default case matches most, if something different add to above case statement
			templatepath = 'views/directives/static/pt-'+stateParams.staticPage + '.html';
		    }
		    return templatepath;
		},
		controller : 'staticPageCtrl'
	    })
		//	testimonial page
		.state( 'base.testimonial', {
			url : 'testimonials',
			templateUrl : 'views/directives/static/pt-testimonials.html',
			controller : 'testimonialCtrl'
		})
		// seo testing page
	    .state('base.check-seo', {
		    url: 'check-seo',
			templateUrl: 'views/directives/static/check-seo.html',
			controller:'testCtrl'
	    })
	// compare state
	    .state('base.compare', {
	    	url: 'compare',
	    	templateUrl: 'views/controller/compare.html',
	    	controller: 'compare',
                onEnter: function($rootScope){
	    	    $rootScope.showFilters = false;
	    	    $rootScope.searchTypeAheadType = "(project or locality or builder or city or suburb)";
	    	},
	    	onExit: function($rootScope){
	    	    $rootScope.searchTypeAheadType = undefined;	
	    	}
	    })
	// listing base abstract state for on enter and on exit calls, loading template and controller here fails
	    .state('base.listing', {
		url : '',
		template : '<div ui-view> </div>',
		abstract : true,
		onEnter: function($rootScope, $stateParams, CardService){
	    	    $rootScope.showFilters = true;
	    	    $rootScope.searchTypeAheadType = "(project or locality or builder or city or suburb)";
	    	    if(!$rootScope.preemptToListing){
	    		CardService.setCard(undefined);	
	    	    }
		    
		},
		onExit: function($rootScope, $state){
	    	    $rootScope.showFilters = false;
	    	    $rootScope.preemptToListing = false;
		},
	    })


        // NEW LISTING ROUTES
            .state('base.listing.cityResale', getListingRoute('{cityName:[^-/]+}/{listingType:resale}-{propType:flats|apartments|property|projects}{filters:(?:/filters)?}', 'base.listing.cityResale'))

            .state('base.listing.cityStatus', getListingRoute('{cityName:[^-/]+}/{projectStatus:upcoming|ongoing|ready-to-move|under-construction|new}-{propType:flats|apartments|property|projects}{filters:(?:/filters)?}', 'base.listing.cityStatus'))

            .state('base.listing.cityBudgetPtype', getListingRoute('{cityName:[^-/]+}/{budgetType:luxury|low-budget|affordable}-{propType:flats|apartments|property|projects}{filters:(?:/filters)?}', 'base.listing.cityBudgetPtype'))

            .state('base.listing.cityStatusPtype', getListingRoute('{cityName:[^-/]+}/{listingType:resale}-{propType:flats|apartments|property|projects}-in-{entityName:[^/]+}-{entityId:[0-9]{5}}{filters:(?:/filters)?}', 'base.listing.cityStatusPtype'))

            .state('base.listing.cityLocalityStatusptype', getListingRoute('{cityName:[^-/]+}/{projectStatus:upcoming|ongoing|ready-to-move|under-construction|new}-{propType:flats|apartments|property|projects}-in-{entityName:[^/]+}-{entityId:[0-9]{5}}{filters:(?:/filters)?}', 'base.listing.cityLocalityStatusptype'))
            .state('base.listing.cityLocalityResale', getListingRoute('{cityName:[^-/]+}/{listingType:resale}-{propType:flats|apartments|property|projects}-in-{entityName:[^/]+}-{entityId:[0-9]{5}}{filters:(?:/filters)?}', 'base.listing.cityLocalityResale'))

            .state('base.listing.cityLocalityBudgetPtype', getListingRoute('{cityName:[^-/]+}/{budgetType:luxury|low-budget|affordable}-{propType:flats|apartments|property|projects}-in-{entityName:[^/]+}-{entityId:[0-9]{5}}{filters:(?:/filters)?}', 'base.listing.cityLocalityBudgetPtype'))

            .state('base.listing.citySociety', getListingRoute('{cityName:[^-/]+}/society-{propType:flats|apartments}{filters:(?:/filters)?}', 'base.listing.citySociety'))
            .state('base.listing.localitySociety', getListingRoute('{cityName:[^-/]+}/society-{propType:flats|apartments}-in-{entityName:[^/]+}-{entityId:[0-9]{5}}{filters:(?:/filters)?}', 'base.listing.cityLocalitySociety'))

            .state('base.listing.indiaResale', getListingRoute('{listingType:resale}-{propType:projects|flats|apartments|property}-in-india{filters:(?:/filters)?}', 'name'))
            .state('base.listing.indiaPtype', getListingRoute('all-{propType:projects|flats|apartments|property}{filters:(?:/filters)?}', 'base.listing.indiaPtype'))
            .state('base.listing.indiaStatusPtype', getListingRoute('{projectStatus:new|upcoming|ongoing|ready-to-move|under-construction|new-launch|completed}-{propType:flats|apartments|property|projects}-in-india{filters:(?:/filters)?}', 'base.listing.indiaStatusPtype'))

            //  Builder Urls
            .state('base.listing.builderResale', getListingRoute('{listingType:resale}-{propType:flats|villas|plots|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.listing.builderResale'))
            .state('base.listing.builderCityResale', getListingRoute('{cityName:[^-/]+}/{listingType:resale}-{propType:flats|villas|plots|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.listing.builderCityResale'))

            .state('base.listing.builderPtype', getListingRoute('{propType:villas|plots|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.listing.builderPtype'))
            .state('base.listing.builderCityPtype', getListingRoute('{cityName:[^-/]+}/{propType:villas|plots|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.listing.builderCityPtype'))

            .state('base.listing.builderStatusPtype', getListingRoute('{projectStatus:upcoming|ongoing|ready-to-move|under-construction|new}-{propType:flats|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.listing.builderStatusPtype'))
            .state('base.listing.builderCityStatusPtype', getListingRoute('{cityName:[^-/]+}/{projectStatus:upcoming|ongoing|ready-to-move|under-construction|new}-{propType:flats|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.listing.builderCityStatusPtype'))

            .state('base.listing.builderBudgetPtype', getListingRoute('{budgetType:luxury|low-budget|affordable}-{propType:flats|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.listing.builderBudgetPtype'))
            .state('base.listing.builderCityBudgetPtype', getListingRoute('{cityName:[^-/]+}/{budgetType:luxury|low-budget|affordable}-{propType:flats|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.listing.builderCityBudgetPtype'))

        // listing city
	    .state('base.listing.City', getListingRoute('{cityName:[^-/]+}-real-estate{filters:(?:/filters)?}', 'base.listing.City'))
	// listing prop type - bhk
	    .state('base.listing.PtypeBhk', getListingRoute('{propType:apartments\-flats|property|house|villas|sites\-plots}-sale{bhkinfo:(?:/[1-5]*bhk)?}{filters:(?:/filters)?}', 'base.listing.PtypeBhk'))
	// listing - city -proptype - locality / suburb - bhk - budget
	    .state('base.listing.CityPtype', getListingRoute('{cityName:[^-/]+}/{propType:apartments\-flats|property|house|villas|sites\-plots}-sale{locinfo:(?:\-[a-zA-Z0-9\-]+[^-]\-[0-9]{5})?}{bhkinfo:(?:/[1-5]*bhk)?}{budgetFilter:(?:/[0-9]*\-[0-9]*\-lacs)?|(?:/(?:above|below)-[0-9]+-(?:lacs|crores))?}{filters:(?:/filters)?}', 'base.listing.CityPtype'))
	// listing - builder
	    .state('base.listing.Builder', getListingRoute('{entityname:[^/]+}-{entityId:[0-9]{6,10}}{bhkinfo:(?:/[1-5]*bhk)?}{filters:(?:/filters)?}', 'base.listing.Builder'))
	// listing builder - city
	    .state('base.listing.BuilderCity', getListingRoute('{cityName:[^/-]+}/{entityname:.+}-{entityId:[1-4][0-9]{5}}{bhkinfo:(?:/[1-5]*bhk)?}{filters:(?:/filters)?}', 'base.listing.BuilderCity'))
   

	
	    .state('base.project', {
		url : '',
		templateUrl: 'views/controller/projectDetail.html',
		abstract : true,
		onExit: function($rootScope){
			$rootScope.urlData.showAppLink = false;
		},
		controller: 'projectDetailCtrl',
	    })    
	// project detail
	    .state('base.project.detail', {
		url : '{cityName:[^-/]+}/{entityname:.+}-{entityId:[5-9][0-9]{5}}',
		templateUrl : 'views/controller/projectdetailview.html',
		resolve: {
		    urlData : ['$state', '$stateParams', 'UrlDataService', '$rootScope', function ($state, $stateParams, UrlDataService, $rootScope) {
			return UrlDataService.getUrlData($stateParams, 'base.project.detail').then(function (data) {		
			    $rootScope.urlData = data;
			    $rootScope.urlData.showAppLink = true;
			    return data;
			}, function (reason) {$state.go('base.static', {staticPage : '404'})});               
		    }]			  	
		}
	    })
	// property detail
	    .state('base.project.property', {
		url : '{cityName:[^-/]+}/{entityname:.+}-{entityId:[5-9][0-9]{6,10}}{bhkinfo:(?:/[1-9]*bhk)?}',
		templateUrl : 'views/controller/propertydetailview.html',
		resolve: {
		    urlData : ['$state', '$stateParams', 'UrlDataService', '$rootScope', function ($state, $stateParams, UrlDataService, $rootScope) {
			return UrlDataService.getUrlData($stateParams, 'base.project.property').then(function (data) {		
			    $rootScope.urlData = data;
			    $rootScope.urlData.showAppLink = false;
			    return data;
			}, function (reason) {$state.go('base.static', {staticPage : '404'})});               
		    }]			  	
		}
	    })
	// overview abstract base state
	    .state('base.overview', {
	    	url : '{cityName:[^-/]+}-real-estate/',
	    	abstract : true,
		template : '<div ui-view> </div>'
	    })
	// city overview
	    .state('base.overview.City', {
		url : '{amenity:overview}',
		templateUrl: 'views/controller/overview.html',
		controller: 'overviewCtrl',
		resolve: {
		    urlData : ['$state', '$stateParams', 'UrlDataService', '$rootScope', function ($state, $stateParams, UrlDataService, $rootScope) {
			return UrlDataService.getUrlData($stateParams, 'base.overview.City').then(function (data) {		
			    $rootScope.urlData = data;
			    return data;
			}, function (reason) {$state.go('base.static', {staticPage : '404'})});               
		    }]			  	
		}
	    })
	// other overview
	    .state('base.overview.Others', {
		url : '{dataName:.*}-{entityId:[0-9]*}/{amenity:overview}',
		templateUrl: 'views/controller/overview.html',
		controller: 'overviewCtrl',
		resolve: {
		    urlData : ['$state', '$stateParams', 'UrlDataService', '$rootScope', function ($state, $stateParams, UrlDataService, $rootScope) {
			return UrlDataService.getUrlData($stateParams, 'base.overview.Others').then(function (data) {		
			    $rootScope.urlData = data;
			    return data;
			}, function (reason) {$state.go('base.static', {staticPage : '404'})});               
		    }]			  
		}
	    })
	// maps base state
	    .state('base.maps', {
		url : 'maps',
		templateUrl: 'views/controller/map-listings.html',
		controller : 'mapListingsCtrl',
		onEnter:function($rootScope, $location){
		    $rootScope.showFilters = true;
		    $rootScope.hideFooter = true;
		    $rootScope.searchTypeAheadType = '(project or locality)';
		    if ($location.path() === '/maps') {
			$rootScope.urlData = {pageType : 'empty'};
			$rootScope.showCitiesModal = true;
		    }
		},
		onExit: function($rootScope){
		    $rootScope.hideFooter = false;
		    $rootScope.searchTypeAheadType = undefined;
		    $rootScope.showFilters = false;
		    $rootScope.showCitiesModal = false;
		}
	    })
		.state('base.maps.maplisting', {
			url : '/',
			abstract : true,
		template : '<div ui-view> </div>'
		})


            .state('base.maps.maplisting.cityResale', getMapsRoute('{cityName:[^-/]+}/{listingType:resale}-{propType:flats|apartments|property|projects}{filters:(?:/filters)?}', 'base.maps.cityResale'))

            .state('base.maps.maplisting.cityStatus', getMapsRoute('{cityName:[^-/]+}/{projectStatus:upcoming|ongoing|ready-to-move|under-construction|new}-{propType:flats|apartments|property|projects}{filters:(?:/filters)?}', 'base.maps.cityStatus'))

            .state('base.maps.maplisting.cityBudgetPtype', getMapsRoute('{cityName:[^-/]+}/{budgetType:luxury|low-budget|affordable}-{propType:flats|apartments|property|projects}{filters:(?:/filters)?}', 'base.maps.cityBudgetPtype'))

            .state('base.maps.maplisting.cityStatusPtype', getMapsRoute('{cityName:[^-/]+}/{listingType:resale}-{propType:flats|apartments|property|projects}-in-{entityName:[^/]+}-{entityId:[0-9]{5}}{filters:(?:/filters)?}', 'base.maps.cityStatusPtype'))

            .state('base.maps.maplisting.cityLocalityStatusptype', getMapsRoute('{cityName:[^-/]+}/{projectStatus:upcoming|ongoing|ready-to-move|under-construction|new}-{propType:flats|apartments|property|projects}-in-{entityName:[^/]+}-{entityId:[0-9]{5}}{filters:(?:/filters)?}', 'base.maps.cityLocalityStatusptype'))
            .state('base.maps.maplisting.cityLocalityResale', getListingRoute('{cityName:[^-/]+}/{listingType:resale}-{propType:flats|apartments|property|projects}-in-{entityName:[^/]+}-{entityId:[0-9]{5}}{filters:(?:/filters)?}', 'base.maps.cityLocalityResale'))

            .state('base.maps.maplisting.cityLocalityBudgetPtype', getMapsRoute('{cityName:[^-/]+}/{budgetType:luxury|low-budget|affordable}-{propType:flats|apartments|property|projects}-in-{entityName:[^/]+}-{entityId:[0-9]{5}}{filters:(?:/filters)?}', 'base.maps.cityLocalityBudgetPtype'))
            .state('base.maps.maplisting.citySociety', getMapsRoute('{cityName:[^-/]+}/society-{propType:flats|apartments}{filters:(?:/filters)?}', 'base.maps.citySociety'))
            .state('base.maps.maplisting.localitySociety', getMapsRoute('{cityName:[^-/]+}/society-{propType:flats|apartments}-in-{entityName:[^/]+}-{entityId:[0-9]{5}}{filters:(?:/filters)?}', 'base.maps.cityLocalitySociety'))

            .state('base.maps.maplisting.indiaResale', getMapsRoute('{listingType:resale}-{propType:projects|flats|apartments|property}-in-india{filters:(?:/filters)?}', 'name'))
            .state('base.maps.maplisting.indiaPtype', getMapsRoute('all-{propType:projects|flats|apartments|property}{filters:(?:/filters)?}', 'base.maps.indiaPtype'))
            .state('base.maps.maplisting.indiaStatusPtype', getMapsRoute('{projectStatus:new|upcoming|ongoing|ready-to-move|under-construction|new-launch|completed}-{propType:flats|apartments|property|projects}-in-india{filters:(?:/filters)?}', 'base.maps.indiaStatusPtype'))

            //	Builder Urls
            .state('base.maps.maplisting.builderResale', getMapsRoute('{listingType:resale}-{propType:flats|villas|plots|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.maps.builderResale'))
            .state('base.maps.maplisting.builderCityResale', getMapsRoute('{cityName:[^-/]+}/{listingType:resale}-{propType:flats|villas|plots|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.maps.builderCityResale'))

            .state('base.maps.maplisting.builderPtype', getMapsRoute('{propType:villas|plots|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.maps.builderPtype'))
            .state('base.maps.maplisting.builderCityPtype', getMapsRoute('{cityName:[^-/]+}/{propType:villas|plots|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.maps.builderCityPtype'))

            .state('base.maps.maplisting.builderStatusPtype', getMapsRoute('{projectStatus:upcoming|ongoing|ready-to-move|under-construction|new}-{propType:flats|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.maps.builderStatusPtype'))
            .state('base.maps.builderCityStatusPtype', getMapsRoute('{cityName:[^-/]+}/{projectStatus:upcoming|ongoing|ready-to-move|under-construction|new}-{propType:flats|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.maps.builderCityStatusPtype'))

            .state('base.maps.maplisting.builderBudgetPtype', getMapsRoute('{budgetType:luxury|low-budget|affordable}-{propType:flats|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.maps.builderBudgetPtype'))
            .state('base.maps.maplisting.builderCityBudgetPtype', getMapsRoute('{cityName:[^-/]+}/{budgetType:luxury|low-budget|affordable}-{propType:flats|apartments|property|projects}-by-{entityName:[^/]+}-{entityId:[1-4][0-9]{5}}{filters:(?:/filters)?}', 'base.maps.builderCityBudgetPtype'))
            

	// maps city
	    .state('base.maps.maplisting.City', getMapsRoute('{cityName:[^-/]+}-real-estate{filters:(?:/filters)?}', 'base.maps.City'))
	// maps prop type - bhk
	    .state('base.maps.maplisting.PtypeBhk', getMapsRoute('{propType:apartments\-flats|property|house|villas|sites\-plots}-sale{bhkinfo:(?:/[1-5]*bhk)?}{filters:(?:/filters)?}', 'base.maps.PtypeBhk'))
	// maps - city -proptype - locality / suburb - bhk - budget
	    .state('base.maps.maplisting.CityPtype', getMapsRoute('{cityName:[^-/]+}/{propType:apartments\-flats|property|house|villas|sites\-plots}-sale{locinfo:(?:\-[a-zA-Z0-9\-]+[^-]\-[0-9]{5})?}{bhkinfo:(?:/[1-5]*bhk)?}{budgetFilter:(?:/[0-9]*\-[0-9]*\-lacs)?|(?:/(?:above|below)-[0-9]+-(?:lacs|crores))?}{filters:(?:/filters)?}', 'base.maps.CityPtype'))
	// maps - builder
	    .state('base.maps.maplisting.Builder', getMapsRoute('{entityname:[^/]+}-{entityId:[0-9]{6,10}}{bhkinfo:(?:/[1-5]*bhk)?}{filters:(?:/filters)?}', 'base.maps.Builder'))
	// maps builder - city
	    .state('base.maps.maplisting.BuilderCity', getMapsRoute('{cityName:[^/-]+}/{entityname:.+}-{entityId:[1-4][0-9]{5}}{bhkinfo:(?:/[1-5]*bhk)?}{filters:(?:/filters)?}', 'base.maps.BuilderCity'))
    }]);
