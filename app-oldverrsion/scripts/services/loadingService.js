/**
 * Name: Loading Service
 * Description: It will act to push flag to show hide loading message.
 * @author: [Nakul Moudgil]
 * Date: Nov 23, 2013
**/
'use strict';
angular.module('serviceApp')
.factory('LoadingService', function() {
	var loading = {};
	loading.flag = false;

	var getLoadingFlag = function(){
		return loading;
	};
	
	var showLoader = function() {
		loading.flag = true;
	};

	var hideLoader = function() {
		loading.flag = false;
	};

	return {
		showLoader : showLoader,
		hideLoader : hideLoader,
		getLoadingFlag : getLoadingFlag
	};
});