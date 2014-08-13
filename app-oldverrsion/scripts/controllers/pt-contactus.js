/**
  * Name: Contact Us Directive
  * Description: Contact Us Directive
  * @author: [Nimit Mangal]
  * Date: Mar 04, 2014
  ***/
  'use strict';
  angular.module('serviceApp').controller('contactUsCtrl', function ( $scope, $rootScope ) {

    $scope.fsWidgetName = new Array(4);
    $scope.fsWidgetName[0] = 'Headquarters';
    $scope.fsWidgetName[1] = 'North Zone';			
    $scope.fsWidgetName[2] = 'East Zone';			
    $scope.fsWidgetName[3] = 'West Zone';			
    $scope.fsWidgetName[4] = 'South Zone'; 
	//set page name
	$rootScope.CURRENT_ACTIVE_PAGE = $rootScope.staticPageName;
	//Page view call for GA/MIXPANEL			
	$rootScope.TrackingService.pageViewedCall();

  });
