/**
   * Name: careersCtrl
   * Description: This is controller of Careers page.
   * @author: [Nakul Moudgil]
   * Date: Mar 12, 2014
**/
'use strict';

angular.module('serviceApp')
    .controller('testCtrl', ['$scope','$rootScope', '$location', '$stateParams', 'SeoService','ProjectService', function ($scope,$rootScope, $location, $stateParams, SeoService,ProjectService) {         
	//set page name and templateId
	var templateId,createBCrum;
	
	    $rootScope.CURRENT_ACTIVE_PAGE = 'check-seo';
	    templateId = 'ABOUT_US';
	    
	
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
       ProjectService.getProjectDetail('650929').then(function (data) {                
	    $scope.data = data.data;
                    
    });  
		
    }]);

