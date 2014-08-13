/**
 * Name : Enquiry Form Directive
 * Description: Enquire Form Directive is used to display enquiry form
 * @author: [Hemendra Srivastava]
 * Date: Jan 10, 2014
 **/

'use strict';

angular.module('serviceApp').filter('getName', function () {
    return function (input) {
        if (input) {
            return input.name;
        }
        return '';
    };
});
angular.module('serviceApp').directive('ptLead', ['LocalityService', 'CityService', 'GlobalService', 'UserService', 'NotificationService', 'LeadService', 'CommonValidators', '$http', '$timeout', function(LocalityService, CityService, GlobalService, UserService, NotificationService, LeadService, CommonValidators, $http, $timeout){
    return{
	restrict : 'A',
	templateUrl : 'views/directives/common/pt-lead.html',
	// replace : true,
	scope : {initial:'=', cityEnabled:'=', localityEnabled:'=', redirectTo:'=', isModal:'='},
	controller : ["$scope", "$rootScope", "$location", "$cookies", "dateFilter", function($scope, $rootScope, $location, $cookies, dateFilter) {
            $scope.isSubmitted=false;
	    
            var leadFields = ['name', 'email', 'phone', 'country', 'query', 'projectId', 'projectName', 'cityId', 'cityName', 'localityId', 'ui_flag', 'ui_page', 'ui_php', 'ui_source', 'budget_flag', 'city', 'homeloan_flag', 'buy_howlong', 'locality', 'multiplePid', 'extra_bedrooms', 'extra_propertyType', 'ui_typeid', 'formlocationinfo', 'buy_sell', 'suburbId', 'interested'];
	    var checkloc = false;
            var initialNew = {};
            $scope.currentDate = dateFilter(new Date(), 'yyyy-MM-dd HH:mm:ss');    
	    $scope.$watch('initial', function (n) {
		if (n) {                    
		    if (n.title) {
			$scope.formTitle = n.title;
		    }                    
		    if (n.type && (n.type === 'locality-city' || n.type === 'home-page' || n.type.split('-')[0].toLowerCase() === 'promise')) {
			checkloc = true;
		    }
		    _.map(leadFields, function (data) {
			initialNew[data] = $scope.initial[data] || '';
		    });
		    
		    if ($rootScope.urlData && $rootScope.urlData.pageType && !initialNew["ui_page"]) {
			if ($location.path().search("maps") !== -1) {
			    initialNew["ui_page"] = "MAP-" + $rootScope.urlData.pageType.toUpperCase();
			}
			else {
			    initialNew["ui_page"] = $rootScope.urlData.pageType;
			}
		    }
		    else {
			if (!initialNew["ui_page"]) {
			    initialNew["ui_page"] = "MAP-SALE-LISTING-CITY";
			}
		    }

		    $scope.formData = {
			'name' : initialNew.name.replace( /\+/g, ' ' ) || '',
			'email' : initialNew.email || '',
			'country_id' : initialNew.country || '0',
			'city' : initialNew.city || '',
			'city_id' : initialNew.cityId || '',
			'locality' : initialNew.locality || '',
			'locality_id' : initialNew.localityId || '',
			'suburb_id' : initialNew.suburbId || '',
			'mobile' : initialNew.phone || '',
			'project_id' : initialNew.projectId || '',
			'query' : initialNew.query || '',
			'interested' : initialNew.interested || ''
		    };
		    
		    $scope.localityList = [];
		    
		    $scope.$watch('formData.city_id', function (newVal) {
			if (newVal) {
			    if ($scope.cityList) {
				var selected;
				angular.forEach($scope.cityList, function (cityData) {
				    if (parseInt(cityData.id, 10) == parseInt(newVal, 10)) {
					selected = cityData;
				    }
				});
				if (selected) {
				    $scope.formData.city = selected;
				}
			    }
			}
		    });

		    CityService.getMainCities().then(function (data) {
			$scope.cityList = data.data;
			if ($scope.formData.city_id) {
			    var selected ;
			    angular.forEach($scope.cityList, function(cityData) {
				if (parseInt(cityData.id, 10) == parseInt($scope.formData.city_id, 10)) {
				    selected = cityData;
				}
			    });
			    
			    if (selected) {
				$scope.formData.city = selected;
			    }
			}
		    });

		    CityService.getCountry().then(function (data) {
			var cid;
			$scope.countryList = data;
			// $scope.formData.country = data[0];
			if ($scope.formData.country_id && parseInt($scope.formData.country_id, 10)) {
			    var ctry;
			    for (cid in $scope.countryList) {
				ctry = $scope.countryList[cid];
				if (parseInt(ctry.id, 10) === parseInt($scope.formData.country_id, 10) ) {
				    $scope.formData.country = ctry;
				}
			    }
			}
		    });

		    $scope.$watch('formData.city', function(newVal) {
			if (newVal && newVal.id) {
			    var lid, loc;
			    LocalityService.getLeadFormList(newVal.id).then(function (localityList) {
				$scope.localityList = localityList;
				if ($scope.formData.locality_id) {
				    for (lid in $scope.localityList) {
					loc = $scope.localityList[lid];
					if(typeof loc == 'object') {
						if (loc.id.toString() === $scope.formData.locality_id.toString()) {
						    $scope.formData.locality = loc;
						}
					}
				    }
				}
				// else if ($scope.formData.suburb_id) {
				//     for (lid in $scope.localityList) {
				// 	loc = $scope.localityList[lid];
				// 	if (loc.type === 'Suburb' && loc.id.toString() === $scope.formData.suburb_id.toString()) {
				// 	    $scope.formData.locality = loc;
				// 	}
				//     }
				// }
			    });
			}
			else {
			    if (!newVal) {
				$scope.localityList = [];
			    }
			}
		    });
		    
		    $scope.save = function (data) {
			// data is the same as form data
			if ($scope.enqForm.$valid) {
			    var post_data = {};
			    _.map(leadFields, function (data) {
				if (initialNew[data]) {
				    post_data['lead_'+data] = initialNew[data];
				}
			    });
			    
			    post_data['lead_name'] = data.name;
			    post_data['lead_email'] = data.email;
			    post_data['lead_cityName'] = data.city.label;
			    post_data['lead_cityId'] = data.city.id;
			    post_data['lead_locality'] = data.locality.label;
			    post_data['lead_localityId'] = data.locality.id;
			    post_data['lead_phone'] = data.mobile;
			    post_data['lead_country'] = data.country.id;
			    post_data['formlocationinfo'] = initialNew['formlocationinfo'];
			    
			    if (checkloc) {
				if(post_data['lead_query'].indexOf('{locality}') > -1){
				    var locname = post_data.lead_locality || "";
                                    if (locname) {
                                        post_data['lead_query'] = post_data['lead_query'].replace('{locality}', locname);
                                    }
				    else {
                                        post_data['lead_query'] = post_data['lead_query'].replace('{locality}, ', locname);
                                    }
				}
				if(post_data['lead_query'].indexOf('{city}') > -1){
				    post_data['lead_query'] = post_data['lead_query'].replace('{city}', post_data['lead_cityName']);
				}
			    }
			    var isLoggedIn = GlobalService.isLoggedIn();
			    $scope.isSaving = true;
			    $http({
				method : 'POST',
				url : GlobalService.getAPIURL( 'lead.php' ),
				data : $.param( post_data ),    //  url encode ( kind of )
				headers: {
				    'Content-Type' : 'application/x-www-form-urlencoded'
				}
			    }).then(function (data) {
				//Call GA/MIXpanel When user enquiry submitted successfully	
				var response = data.data;				
					if(response.status == 'success'){ 
						//Get user id from cookie 
						var USER_EMAIL = (isLoggedIn) ? $rootScope.userInfo.EMAIL : post_data['lead_email']; 
						var USER_ID = (typeof $cookies.FORUM_USER_ID != 'undefined') ? $cookies.FORUM_USER_ID : "";   					
						var mixpanel_distinct_id = mixpanel.get_distinct_id(); 
						if ( !CommonValidators.isEmail( mixpanel_distinct_id ) ) {
							mixpanel.alias(USER_EMAIL);																				 
							mixpanel.register({"distinct_id": USER_EMAIL})	
						}else{
							mixpanel.identify(USER_EMAIL)	
						}						
						mixpanel.people.set({
							"USER ID": USER_ID, "Mobile": post_data['lead_phone'], '$name': post_data['lead_name'], '$email': USER_EMAIL, '$last_login': $scope.currentDate
						});						 						
						LeadService.enquiryTracking(initialNew, 'submit', 'Submitted');	
						mixpanel.people.increment("Enquiry Submitted");			
					}
				var enquiry_info = {
				    name : post_data['lead_name'],
				    email: post_data['lead_email'],
				    phone: post_data['lead_phone'],
				    country: post_data['lead_country']
				};
				$scope.isSaving = false;
				GlobalService.setCookie( 'enquiry_info', JSON.stringify( enquiry_info ) );
				if ( !isLoggedIn ) {
				    UserService.userInfo();
				}
				
				$scope.$emit('leadposted', data.data);
			    }, function (reason) {
				$scope.$emit('leadposted', reason);
			    });
			}
			else {
				$scope.isSubmitted = true;
				//Call GA/MIXpanel When validation fails after pressing submit button
				LeadService.enquiryTracking(initialNew, 'submitErr', 'Errors');
			}
		 }
     
     //Call GA/MIXpanel When user start typing in any of the form field
     var enqformFillCheck = false;
     $scope.enqformFill = function (){
		 if(enqformFillCheck == true){
			 return;
		 }else{
			enqformFillCheck = true;
			LeadService.enquiryTracking(initialNew, 'filled', 'Initiated');
		 }
	 }       
            
	};
        });        
    }]
    };
}]);
