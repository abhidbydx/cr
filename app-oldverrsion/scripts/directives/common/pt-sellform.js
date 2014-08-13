/**
 * Name : Sell Form Directive
 * Description: Sell Form Directive is used to display sell form
 * @author: [Hemendra Srivastava]
 * Date: Jan 10, 2014
 **/

'use strict';

angular.module('serviceApp').directive('ptSellform', ['$timeout', function($timeout){
    return {
	restrict : 'A',
	templateUrl : 'views/directives/common/pt-sellform.html',
	// replace : true,
	controller : ["$scope", "ProjectService", "CityService", "LocalityService", "UnitInfoService", "SellFormService", function ($scope, ProjectService, CityService, LocalityService, UnitInfoService, SellFormService) {
	    $scope.existingProject = false;
	    $scope.stage = "step1";
	    $scope.isSubmitted = false;
	    $scope.isSubmittedstep1 = false;

	    var isValid = function (stage) {
		var form = $scope.sellForm;
		if (stage === "step1") {
		    return form.fullname.$valid && form.email.$valid && form.country.$valid && form.mobile.$valid;
		}
		if (stage === "step2") {
		    return false;
		} 
		return false;		

	    };
	    
	    // UnitInfoService.getUnitInfo(projectId).then(function (data) {
	    // 	$scope.unitInfo = data;
	    // });
	    // $scope.$watch('unitInfo',function(newVal, oldVal){
	    // 	if(newVal !== oldVal){
	    // 	    $scope.listing.units = newVal.properties;
	    // 	    $scope.listing.builder = newVal.builderName;
	    // 	    $.each( newVal.properties, function( item, attr ) {
	    // 		if ( attr.propertyId === resp.propertyId ) {
	    // 		    $scope.listing.unit.listingSize = attr.size;
	    // 		    if ( !attr.size ) {
	    // 			attr.size = 'NA';
	    // 			attr.measure = '';
	    // 			$scope.listing.unit.listingSize = 'NA';
	    // 		    }
	    // 		    $scope.listing.unitDefault = attr;
	    // 		}
	    // 	    });
	    // 	}
	    // });


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
	    
	    $scope.$watch('formData.localityName', function (n) {
		if (n) {
		    var loc;
		    for (var lid in $scope.localityList) {
			loc = $scope.localityList[lid];
			if (loc.label === $scope.formData.localityName) {
			    $scope.formData.locality = loc;
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
				if (loc.id.toString() === $scope.formData.locality_id.toString()) {
				    $scope.formData.locality = loc;
				}
			    }
			}
		    });
		}
		else {
		    if (!newVal) {
			$scope.localityList = [];
		    }
		}
	    });

	    $scope.onProjectSelected = function(){
		if($scope.formData.project.label !== ''){
		    $scope.existingProject = true;
		    $scope.formData.localityName = $scope.formData.project.locality;
		    var unit = $scope.formData.project.id.split('TYPEAHEAD-PROJECT-').pop();
		    if(unit){
			UnitInfoService.getUnitInfo(unit).then(function (data) {
			    $scope.unitInfo = data;
			});
			$scope.$watch('unitInfo',function(newVal, oldVal){
			    if(newVal !== oldVal){
				$scope.formData.units = newVal.properties;
			    }
			});
		    }
		}
	    };

	    
	    $scope.projects = ProjectService.getProjects;
	    $scope.save = function (data) {
		$scope.isSubmitted = true;
		if ($scope.sellForm.$valid || data.sellerType == 'broker') {
			//GA/Mixpanel On Clicking Sell Property Submit		    
		    $scope.tracking('Step2');
		    SellFormService.sellProperty(data, setStage);
		}		
	    };

	    var setStage = function (resonse) {
		    $scope.stage = 'step4';
	    };

	    $scope.goToStep = function (stage) {
		$scope.isSubmittedstep1 = true;

		if($scope.formData.sellerType == 'broker') {
			$scope.save($scope.formData);
			$scope.stage = 'step4';
		} else {
			if (stage === "step2") {
			    if (isValid("step1") || !$scope.stage === 'step1') {
				$scope.stage = "step2";
				//GA/Mixpanel On Clicking Sell Property Continue
				$scope.tracking('Step1');
			    }
			}
			
			if (stage === "step1") {
			    $scope.stage = "step1";
			}
			if (stage === "step3") {
			    $scope.stage = "step3";
			}
		}
		
	    };
	    //GA/Mixpanel On Clicking Sell Property Continue/Submit Button
	    $scope.tracking = function (step){					
			$scope.TrackingService.sendGAEvent('sell', 'clicked', 'sellProperty-'+step+'-'+$scope.viewedFrom+'-'+$scope.CURRENT_ACTIVE_PAGE); 
			$scope.TrackingService.mixPanelTracking('Sell Property - '+step, {'Viewed From': $scope.viewedFrom, 'Page Name': $scope.CURRENT_ACTIVE_PAGE});			 			
		}
		
	}]
    };
}]);
