/**
   * Name: discussionService
   * Description: Service to work with discussions API
   * @author: [Hemendra Srivastava]
   * Date: Feb 5, 2014
**/

'use strict';

angular.module('serviceApp').factory('DiscussionService', ['$rootScope','DiscussionParser', 'GlobalService', '$http', function($rootScope, DiscussionParser, GlobalService, $http) {
    var getDiscussions = function (projectId, page) {
	var pgstr = '{"start":0,"rows":5}';
	if (page && page > 0) {
	    pgstr = '{"start":'+(page*5).toString()+', "rows":5}';
	}
	var url = GlobalService.getAPIURL('data/v2/entity/project/' + projectId.toString() + '/discussions?selector={"paging":'+pgstr+'}');
	var headers = {
	    'Content-Type' : 'application/json'
	};

	var discussionData = $http({method :  'GET', url :  url, headers : headers}).then(function (response) {
	    return DiscussionParser.parse(response);
	});
	return discussionData;
    };

    var saveDiscussion = function (projectId, comment, parentId) {
	var url = GlobalService.getAPIURL('data/v1/entity/user/projectComments');
	var post_data = {
	    projectId : projectId,
	    comment : comment
	};
	if (parentId) {
	    post_data.parentId = parentId;
	}

	$rootScope.TrackingService.sendGAEvent('review', "clicked", "project-"+$rootScope.CURRENT_ACTIVE_PAGE); 	
	$rootScope.TrackingService.mixPanelTracking('Discussion Submitted',{'Project ID': projectId, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE}); 
	
	return $http({method :  'POST',  url :  url, data :  post_data});
    };

    var saveLike = function (id) {
	var url = GlobalService.getAPIURL('data/v1/entity/user/projectComments/'+id+'/likes');
	return $http({method :  'POST',  url :  url}).then(function (response) {
	    return response.data;
	});
    };
    
    return {
	getDiscussions : getDiscussions,
	saveDiscussion : saveDiscussion,
	saveLike : saveLike
    };
}]);
