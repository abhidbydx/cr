/**
   * Name: Full Screen View
   * Description: pt-commonfullscreen will be used to open image gallery in full screen.
   * 
   * @author: [Nakul Moudgil]
   * Date: Sep 27, 2013
**/
'use strict';
angular.module('serviceApp').controller('commonfullscreenctrl',function($scope, $rootScope, $modalInstance, images, index, unique){
	$scope.optionsFullView = {
				width: 1330,
				height: 800,
				imageWidth: 1040,
				imageHeight: 780,
				width100Proc: true,
				height100Proc: true,
				ptzoomControlVisible: true,
				thumbnailWidth : 100,
				thumbnailHeight : 50,
				thumbnailMargin : 5
			};
	$scope.images = images;
	$scope.index = index;	
	$scope.unique = unique;
	$scope.collapse = function(){
		$modalInstance.close($scope.index);
		//GA/mixpanel tracker when user closes the gallery
		var pageType = $rootScope.CURRENT_ACTIVE_PAGE;			
		$rootScope.TrackingService.sendGAEvent('gallery', 'clicked', 'closeGallery-'+pageType); 	 		
		$rootScope.TrackingService.mixPanelTracking('Gallery Close', {'Page Name': pageType});
                $rootScope.$broadcast('youtubeCollapse', 'collapse');
		//End tracking
	};
});
