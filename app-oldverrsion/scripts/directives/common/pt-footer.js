/**
 * Name: ptFooter Directive
 * Description: pt-footer is common header of the application 
 *
 * @author: [Nakul Moudgil]
 * Date: Sep 24, 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptFooter', ['$timeout', function($timeout){
    return {
	restrict : 'EA',
	templateUrl : 'views/directives/common/pt-footer.html',
	//replace : true,
	controller: [ '$scope', '$rootScope', '$location', 'GlobalService', 'Formatter', 'SeofooterService', function( $scope, $rootScope, $location, GlobalService, Formatter, SeofooterService ) {
	    $scope.nonIndiaLevel=true;
        $scope.propertyTypeRoot="property-sale";

	    $scope.footer = {};
        $scope.isListing = false;
	    $scope.isOverview = false;
	    $scope.isBuilder = false;
	    $scope.isBuilderCity = false;
	    $scope.isProjectDetail = false;
	    $scope.isProperty = false;
	    $scope.entity 	= 'India'; 
	    $scope.entityUrl = '';



	    $scope.$watch("urlData", function(n) {	     
		if (n) {				
			var pageType = n.pageType.replace("sale-listing-", '');

	        if (n.pageType.toLowerCase().search("listing") !==  -1) {
	            $scope.isListing = true;
	            $scope.showSeoFooter = true;
	            if ( n.pageType.toLowerCase().indexOf( 'buildercity' ) !== -1 ) {	                
	                $scope.isBuilderCity = true;
	            }else if ( n.pageType.toLowerCase().indexOf( 'builder' ) !== -1 ) {                        		                
	                $scope.isBuilder = true;
	            }
	        }
	        else {
	        	$scope.isListing = true;
	            $scope.showSeoFooter = false;
	        }
                    
			if (n.pageType.toLowerCase().search("overview") !==  -1) {
				$scope.isOverview = true;
			}
			else {
				$scope.isOverview = false;
			}
			if (n.pageType.toLowerCase().indexOf("projectdetail") !==  -1) {
				$scope.isProjectDetail = true;
				$scope.showSeoFooter = true;
			}
			if (n.pageType.toLowerCase().indexOf("property") !==  -1) {
				$scope.isProperty = true;				
			}

		    $scope.leadData = {
			type : 'locality-city',
			ui_php : 'footer.php',
			formlocationinfo : 'open-requirement-footergo'
		    };

                    
            if (n.pageType.toUpperCase() === "SALE-LISTING-ALL") {
                $scope.nonIndiaLevel=false;
                $scope.propertyTypeRoot=$location.path().slice(1);
                if (n.propertyType === "") {
                    $scope.propertyTypeLabel = "Properties";
                }
                else {
                    $scope.propertyTypeLabel= n.propertyType + "s";
                }                        
            } else {
                $scope.nonIndiaLevel=true;
            }                    

		    $scope.cEnabled = true;
		    $scope.lEnabled = false;
		    $scope.pageType = n.pageType;
		    $scope.builderId = n.builderId;
		    $scope.Builder 	= Formatter.ucword( n.builder ); 
		    $scope.Locality = Formatter.ucword( n.locality ); 		    
		    if (n.cityId) {
				$scope.leadData.cityId = n.cityId;
				$scope.city 	= n.city;
				$scope.City 	= Formatter.ucword( n.city ); 
				$scope.entity 	= Formatter.ucword( n.city ); 
				$scope.entityUrl= n.city;
		    }
            $scope.site_map_label = $scope.City + ' Site Map';
            if ($scope.city) {
                var prop_city = 'PROP_IN_' + $scope.city.toUpperCase();
                $scope.site_map_link = $scope.city + '-real-estate' + '/' + $scope.city + '-sitemap.php';

                $scope.resale_label = 'Resale property in ' + $scope.City;
                $scope.resale_link = '/' + $scope.city + '/property-sale/filters?listingType=true';
            }
		}
	    }, true);	    
	    // mix panel and gaevent for expand/collapse and more/less propeties
        $scope.footersTracking = function(cat, action, value,type){
			var pageType = (typeof $scope.pageType != 'undefined') ? $scope.pageType : '404';				
			//Send GA/Mixpanel tracker event request when other links clicked 
			var subLabel = value+"-"+pageType;   
			//GA tracker
			$rootScope.TrackingService.sendGAEvent(cat, action, subLabel); 	 
			//mixpanel tracker
			if(type == "social"){
			    $scope.TrackingService.mixPanelTracking("Social Links",{"'Social Link Name":value,"Page Name":pageType}); 
			}else{
			    $scope.TrackingService.mixPanelTracking("Clicked Footer Links",{"Footer Name":value,"Page Name":pageType}); 
			}			   
			//End Ga/mixpanel   				
	    } 
	}]		
    };  
}]);