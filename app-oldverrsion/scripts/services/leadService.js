/***
  * Name: Lead Service
  * Description: To open and submit lead form across website
  * @author: [Swapnil Vaibhav]
  * Date: Jan 22, 2014
***/
'use strict';
angular.module( 'serviceApp' )
.factory('LeadService', ["$rootScope", "$modal", "GlobalService", function($rootScope, $modal, GlobalService) {
    var addQueryData = function( leadData, isModal ) {	
	leadData.title = "Interested in this project?";	
        if ( leadData.projectName ) {
            leadData.interested = 'Thanks for showing your interest in <span class="font-weight">' + leadData.projectName + '</span>.';
            if (isModal) {
                leadData.title = 'Interested in <span class="font-weight">' + leadData.projectName + '</span>'+'?';
            }
        }
        else if ( leadData.areaName ) {
            leadData.interested = 'Thanks for showing your interest in <span class="font-weight">' + leadData.areaName + '</span>.';
             if (isModal) {
                 leadData.title = 'Interested in <span class="font-weight">' + leadData.areaName + '</span>'+'?';
             }
        }
        else if ( leadData.cityLabel ) {
            leadData.interested = 'Thanks for showing your interest in <span class="font-weight">' + leadData.cityLabel + '</span>.';
            if (isModal) {
                leadData.title = 'Interested in <span class="font-weight">' + leadData.cityLabel + '</span>'+'?';
            }
        }
        else {
            leadData.interested = 'Thanks for showing your interest';
            if (leadData.homePage) {
                leadData.title = "Interested in buying a property?";
            }
        }
	// Overriding based on hitesh's bug
	leadData.interested = "Please fill in your details below and we will get in touch with you shortly";

        if ( leadData.type  ) {
            var unitName = '';
	    var unitSize = '';
            if ( leadData.propertyDetail ) {
                unitName = leadData.propertyDetail.unitName ? leadData.propertyDetail.unitName + ', ' : '';
		unitSize = leadData.propertyDetail.size ? leadData.propertyDetail.size + ' ' + leadData.propertyDetail.measure + ', ' : '';
            }
            if ( leadData.type === 'floorPlan' ) {
                leadData.query = 'Please send me floor plan of ' + unitName + leadData.builderName+ ', ' + leadData.projectName;
                if (isModal) {
		leadData.title = "Interested in floor plan of " + unitName +"?";
                }
            }
            else if ( leadData.type === 'size' ) {
                leadData.query = 'Please arrange callback for me about ' + unitName + unitSize + leadData.builderName + ', ' + leadData.projectName;
		leadData.title = "Interested in the size of this project?";
            }
            else if ( leadData.type === 'newPrice' || leadData.type === 'resalePrice' ) {
                leadData.query = 'Please send me price list of ' + unitName + unitSize + leadData.builderName+ ', ' + leadData.projectName;
		leadData.title = "Interested in this price list?";		
            }
	    else if ( leadData.type === 'homeloan') {
		leadData.title = "Interested in taking a homeloan?";
		leadData.homeloan_flag = "true";
		leadData.query = 'I am interested in taking a homeloan for '+ unitName + leadData.builderName + ', ' + leadData.projectName;
	    }
	    else if (leadData.type === 'locality-city') {
            if (!isModal) {
                leadData.title = "Interested in this area?";
                leadData.query = 'I am interested in {locality}, {city}. Please arrange a callback for me.';
            }
	    }
            else if (leadData.type === 'home-page') {
                leadData.title = "Interested in buying a property?";
                leadData.query = 'I am interested in {locality}, {city}. Please arrange a callback for me.';
            }
            else if (leadData.type === 'contactus') {
                leadData.title = "Want a call back?";
		leadData.query = 'I am interested in {locality}, {city}. Please arrange a callback for me.';	
            }

            else if (leadData.type === 'promise-project') {
                leadData.title = "Let us help you";
                leadData.interested = "Leave your contact details below and receive a call back at the earliest"
                leadData.query = 'I am interested in {locality}, {city}. Please arrange a callback for me.';    
            }

            else if (leadData.type === 'promise-listing') {
                leadData.title = "Let’s save some time";
                leadData.interested = "Just tell us where to reach you and we shall take care of the rest";
                leadData.query = 'I am interested in {locality}, {city}. Please arrange a callback for me.';    
            }

            else if (leadData.type === 'promise-overview') {
                leadData.title = "Let’s save some time";
                leadData.interested = "Just tell us where to reach you and we shall take care of the rest";
                leadData.query = 'I am interested in {locality}, {city}. Please arrange a callback for me.';    
            }
        }
        else if ( leadData.projectName ) {
	    var unitName = '';
            if ( leadData.propertyDetail ) {
                unitName = leadData.propertyDetail.unitName ? leadData.propertyDetail.unitName + ', ' : '';
            }

            leadData.query = 'Please arrange callback for me about ' + unitName + leadData.builderName + ', ' + leadData.projectName;
        }
        else if ( leadData.areaName ) {
	    leadData.title = "Interested in this area?";
            leadData.query = 'I am interested in ' + leadData.areaName + '. Please arrange a callback for me.';
        }

        //  override computed value if service has the value already
        // if ( leadData.formLocation ) {
        //     leadData.formlocationinfo = leadData.formLocation;
        // }

        // //  override params if from AVL
        // if ( leadData.fromALV ) {
        //     leadData.formlocationinfo = 'hidden-enquiry-listing';
        // }
        return leadData;	
    };
    var updateLeadData = function( leadData,isModal) {
        var cData = JSON.parse( GlobalService.getCookie( 'enquiry_info' ) );
        var cookieFields = ['name', 'email', 'phone', 'country'];
        if ( leadData && cData ) {
            $.each( cookieFields, function( cnt, objName ) {
                if ( !leadData[ objName ] && cData[ objName ] ) {
                    leadData[ objName ] = decodeURIComponent(cData[ objName ]);
                }
            });
        }
        leadData = addQueryData( leadData,isModal );
        return leadData;
    };
    
    var openLeadForm = function( leadObject, cityEnabled, localityEnabled ) {
        //leadObject = updateLeadData( leadObject );        
        $modal.open({
            templateUrl: 'views/modal/leadForm.html',
            controller : ["$scope", "$rootScope", "$modalInstance", function( $scope, $rootScope, $modalInstance ) {
                $scope.cityEnabled = cityEnabled ? true : false;
                $scope.localityEnabled = localityEnabled ? true : false;
                $scope.myData = leadObject;
                $scope.isModal=true;
                $scope.cancel = function () {
                    $modalInstance.dismiss( 'cancel' );
                };
                $scope.$on('leadpushed', function (evt, data) {
                    $scope.cancel();
                    evt.stopPropagation();
                });
            }]
        });
        //Call GA/MIXpanel When user open Enquire form
		enquiryTracking(leadObject, 'show', 'Opened');
    };
    //Send GA/Mixpanel tracker event request
	var enquiryTracking  = function(leadObject, action, mixpanelEvent){
		var leadObject = updateLeadData(leadObject), enquiryObj = {}, pageName = '', autofill = ''; 		
		autofill = (leadObject.email) ? "yes" : "no";			
		enquiryObj['Form Name'] = autofill+'-'+leadObject.formlocationinfo;
		enquiryObj['Page Name'] = $rootScope.CURRENT_ACTIVE_PAGE 
		//GA tracker
		$rootScope.TrackingService.sendGAEvent('enquiry', action, leadObject.formlocationinfo+'-'+$rootScope.CURRENT_ACTIVE_PAGE); 	 
		//mixpanel tracker
		$rootScope.TrackingService.mixPanelTracking('Enquiry '+mixpanelEvent, enquiryObj);  
	}
	//End Ga/mixpanel   
	
    return {
	updateLeadData : updateLeadData,
        openLeadForm : openLeadForm,
        enquiryTracking: enquiryTracking
    };
 
}]);

