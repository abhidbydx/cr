/**
 * Name: Notification Directive
 * Description: To show different error/success messages.
 * @author: [Swapnil Vaibhav]
 * Date: Nov 07, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptNotification',['$rootScope', 'NotificationService',function($rootScope, NotificationService) {
  return {
    restrict : 'A',
    //replace: true,
    templateUrl : 'views/directives/common/pt-notification.html',
    controller : function( $scope, $rootScope, NotificationService, $timeout, $location ) {
      $scope.showAlert = 'false';
      $scope.fadeOut = NotificationService.removeNotification;
      $scope.alert = NotificationService.getNotification();
      if($location.$$url.indexOf('/maps') > -1){
        $scope.notiClass = '';
      }
      else{
        $scope.notiClass = 'xyz';
      }      
      $scope.$watch('alert.msg', function(newAlert, oldAlert) {
        if ( newAlert && newAlert != oldAlert) {
          if($scope.timer){
              $timeout.cancel($scope.timer);
          }
          $scope.showAlert = 'true';
          //GA tracker When a message is displyed to user
		  var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
		  $rootScope.TrackingService.sendGAEvent('map', 'message', 'displayed-'+pageType); 	 
		  //mixpanel tracker
		  $rootScope.TrackingService.mixPanelTracking('Message Displayed', {'Message Type':$scope.alert.type, 'Page Name': pageType});
          var notiWidth = newAlert.length * 6.5 + 150;
  		    $('#notification').fadeIn('4000').animate({
				'top': "95px", 'z-index': "2", 'width': notiWidth + 'px', 'margin-left': - notiWidth/2 + 'px'}, 
				{duration: '5000'}, function(){
  			  		// Animation complete.
			});
          if ( newAlert == 'Authentication error' ) {
            window.location.href = '/property-portfolio-tracker.php';
          } else if ( !$scope.alert.isConfirm ) {
            $scope.timer = $timeout(function(){
            	$scope.showAlert = 'false';
            	$scope.alert.msg = '';
            }, 10000);
          }
        } else {
		      $scope.fadeOut();
        }
      });

      $scope.actionTaken = function( option ) {
        if ( $scope.alert[option] ) {
			$scope.alert[option]();			
			//GA tracker When a message is displyed to user
			var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
			var eventText = (option == 'onYes') ? $scope.alert.confirmText : $scope.alert.cancelText; 			
			$rootScope.TrackingService.sendGAEvent('map', 'message', eventText+'-'+pageType); 	 
			//mixpanel tracker
			$rootScope.TrackingService.mixPanelTracking('Message Clicked '+eventText, {'Message Type':$scope.alert.type, 'Page Name': pageType});  
		  
			$scope.fadeOut();
        }else {
			$scope.showAlert = 'false';
		}
 
      };
      $scope.closeNoti = function() {
	 	    $scope.fadeOut();
      };
    }
  }
}]);
