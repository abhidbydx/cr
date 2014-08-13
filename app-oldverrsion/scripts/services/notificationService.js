/**
 * Name: Notification Service
 * Description: It will act to push error/success notification messages
 * @author: [Swapnil Vaibhav]
 * Date: Nov 07, 2013
**/
'use strict';
angular.module('serviceApp')
.factory('NotificationService', function() {
	var noti = {};
	var setNotification = function( thisNoti ) {
		noti.msg = thisNoti.msg;
		noti.type = thisNoti.type;
        noti.isConfirm = thisNoti.isConfirm ? true : false;
        noti.showYes = thisNoti.onYes ? true : false;
		noti.onYes = thisNoti.onYes ? thisNoti.onYes : false;
        noti.showNo = thisNoti.onNo ? true : false;
		noti.onNo = thisNoti.onNo ? thisNoti.onNo : false;
        noti.confirmText = thisNoti.confirmText ? thisNoti.confirmText : 'Yes';
        noti.cancelText = thisNoti.cancelText ? thisNoti.cancelText : 'No';
	};

	var getNotification = function() {
		return noti;
	};

	var removeNotification = function(){
		$('#notification').animate({
			'top': "-40px",'z-index': "-1"
			}, {duration: '3000'}, function() {
				$scope.showAlert = 'false';
				$scope.alert.msg = '';

				// Animation complete.
		}).fadeOut('slow');	
	};
	
	return {
		getNotification : getNotification,
		setNotification : setNotification,
		removeNotification: removeNotification
	};
});
