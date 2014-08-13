/**
   * Name: careersCtrl
   * Description: This is controller of Careers page.
   * @author: [Nakul Moudgil]
   * Date: Mar 12, 2014
**/
'use strict';

angular.module('serviceApp')
    .controller('staticPageCtrl', ['$scope','$rootScope', '$location', '$stateParams', 'SeoService', function ($scope,$rootScope, $location, $stateParams, SeoService) {         
	//set page name and templateId
	var templateId,createBCrum;
	switch($stateParams.staticPage) {
	case 'aboutus':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'About Us';
	    templateId = 'ABOUT_US';
	    break;
	case 'nri' : 
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Nri'
	    templateId = 'NRI_SERVICES';
	    break;
	case 'vaastu':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Vaastu';
	    templateId = 'VAASTU_TIPS';
	    break;
	case 'homeloan':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Home Loan';
	    templateId = 'HOME_LOAN';
	    break;
	case 'documents':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Required Documents';
	    templateId = 'DOCUMENTS';
	    break;
	case 'faqs':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Faqs';
	    templateId = 'FAQ';
	    break;
	case 'builderpartner':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Builder Partner';
	    templateId = 'BUILDER_PARTNERS';
	    break;
	case 'ourservices':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Our Services';
	    templateId = 'OUR_SERVICES';
	    break;
	case 'management-team':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Management Team';
	    templateId = 'MANAGEMENT_TEAM';
	    break;
	case 'proptiger-media':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Proptiger Media';
	    templateId = 'PROPTIGER_IN_MEDIA';
	    break;
	case 'privacy-policy':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Privacy Policy';
	    templateId = 'PRIVACY_POLICY';
	    break;
	case 'user-agreement':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'User Agreement';
	    templateId = 'USER_AGREEMENT';
	    break;
	case 'careers':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Careers';
	    templateId = 'CAREERS';
	    break;
	case 'sitemap':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Sitemap';
	    templateId = 'SITEMAP';
	    break;
	case 'contactus':
		$rootScope.fsWidgetNameContact = new Array(4);
		$rootScope.fsWidgetNameContact[0] = 'Headquarters';
		$rootScope.fsWidgetNameContact[1] = 'North Zone';
		$rootScope.fsWidgetNameContact[2] = 'East Zone';
		$rootScope.fsWidgetNameContact[3] = 'West Zone';
		$rootScope.fsWidgetNameContact[4] = 'South Zone'; 
		$rootScope.CURRENT_ACTIVE_PAGE = 'Contact Us';
		templateId = 'CONTACT_US';
		break;
	case 'testimonials':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Testimonials';
	    templateId = 'TESTIMONIALS';
	    break;
	case 'emi':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Emi';
	    templateId = 'EMI';
	    break;
	case 'disclaimer':
	    $rootScope.CURRENT_ACTIVE_PAGE = 'Disclaimer';
	    templateId = 'DISCLAIMER';
	    break;
	case '404':
	    $rootScope.CURRENT_ACTIVE_PAGE = '404';
	    templateId = '404';
	    break;
	case 'server-error':
	    $rootScope.CURRENT_ACTIVE_PAGE = '500';
	    templateId = '500';
	    break;
	}
	
	createBCrum = function(pageType){
		
            var  bCrum = [],
            __bCrum = {};
            
            __bCrum = {
                text    : 'Home',
                link    : '/',
                target  : '_self'
            };

            bCrum.push( __bCrum );
            __bCrum = {
                        text :  pageType
                    };
            bCrum.push( __bCrum );
            $scope.bCrum = bCrum;           
            $scope.bCrumText = 'YOU ARE HERE';
        }
    createBCrum($rootScope.CURRENT_ACTIVE_PAGE);    
	// Get Seo data
	SeoService.getSeoTags($location.path(), {'templateId': templateId}).then(function (data) {                
	    $rootScope.seoData = SeoService.parseSeoTags(data);	   
	    if ($rootScope.seoData.title) {
	        angular.element("title").html($rootScope.seoData.title);	       
	    }
                    
    });
	
	//Page view call for GA/MIXPANEL			
	$rootScope.TrackingService.pageViewedCall();	
    }]);
