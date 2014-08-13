/**
  * Name: ptDiscussionboard Directive
  * Description: pt-discussionboard is common discussion board directive.
  * It internally uses jquery.easy-comments.js  
  * @author: [Nakul Moudgil]
  * Date: Jan 08, 2014
***/
'use strict';

angular.module('serviceApp').directive('ptDiscussionboard', [ function(){
    return {
	restrict : 'A',
	scope : { 
		projectid : '=' 
	},
	templateUrl : 'views/directives/common/pt-discussionboard.html',	    
	controller : function( $scope, $rootScope, GlobalService, DiscussionService, NotificationService, SignupService, $timeout, $window ) {
	    $scope.pg = {"from":0, "to":5, pageno:0};
	    $scope.$watch("projectid", function (newVal) {
			if(newVal){
				DiscussionService.getDiscussions(newVal).then(function (data) {
				    $scope.discussions = data;
				    $scope.pg.from = $scope.pg.pageno*5;
				    if ($scope.discussions.count < ($scope.pg.pageno+1)*5) {
						$scope.pg.to = $scope.discussions.count;
				    }
				    else {
						$scope.pg.to = ($scope.pg.pageno+1)*5;
				    }
				});
			}
	    });
	    var notiObj = {};
	    $scope.replyActiveId = '';
	    $scope.replyComment = '';
	    $scope.postComment = '';
	    var liked = [];
	    
	    var saveLike = function (id) {
		function updateLike(idx, data){
		    var data_new = _.map(data, function (val) {
			if (val.id === idx) {
			    val.numLikes += 1;
			}
			else {
			    if (val.replies) {
				val.replies = updateLike(id, val.replies);
			    }
			}
			return val;
		    });
		    return data_new;
		}
		if (GlobalService.isLoggedIn ()) {
		    DiscussionService.saveLike(id).then(function (data) {
			if (data && data.statusCode && data.statusCode.toString() === "499") {
			    notiObj = {
				msg : $rootScope.labels.common.error.ALREADY_LIKED || 'Already Liked',
				type: 'error'
	    		    };
	    		    NotificationService.setNotification( notiObj );
			}
			else {
			    $scope.discussions.data = updateLike(id, $scope.discussions.data);
			    liked[id] = true;
			}
		    });
		    return true;
		}
		return false;
	    };

	    $scope.Like = function (id) {
		if (!saveLike(id)) {
		    SignupService.openSignUp().result.then(function (data) {
			saveLike(id);
		    });
		}
	    };
	    
	    $scope.Reply = function(parentId){
		$scope.replyActiveId = parentId;
	    };

	    var saveComment = function (newComment, parent) {
		if (GlobalService.isLoggedIn ()) {
		    if(parent && parent.id){
			DiscussionService.saveDiscussion($scope.projectid, newComment, parent.parentId).then(function (data) {
			    notiObj = {
				msg : $rootScope.labels.common.message.SAVE_COMMENT,
				type: 'success'
			    };
			    NotificationService.setNotification( notiObj );
			});
		    }
		    else{
			DiscussionService.saveDiscussion($scope.projectid, newComment).then(function (data) {
			    notiObj = {
				msg : $rootScope.labels.common.message.SAVE_COMMENT,
				type: 'success'
			    };
			    NotificationService.setNotification( notiObj );
			});
			$scope.postComment = '';
		    }
		    return true;
		}
		return false;
	    };
	    
	    $scope.Submit = function(newComment, parent) {
			$scope.errorValidate = '';
			newComment = newComment.trim();
			if (newComment == '') {
				$scope.errorValidate = $rootScope.labels.common.error.INVALID_COMMENT;
				return false;
			}
			if (saveComment(newComment, parent)) {
			    $scope.Close();		    
			}
			else {
			    SignupService.openSignUp().result.then(function (dat) {
				saveComment(newComment, parent);
				$scope.postComment = '';
				$scope.Close();
			    }, function (err) {
				$scope.Close();
			    });
			}
	    };

	    $scope.Close = function(){
		$scope.replyActiveId = '';
	    };

	    $scope.nextPage = function () {
		$scope.fetching=true;
		//Send Mixpanel tracker event request when read review	
		$rootScope.TrackingService.sendGAEvent("review", "read", "project-"+$rootScope.CURRENT_ACTIVE_PAGE); 
		$rootScope.TrackingService.mixPanelTracking("Discussion Read", {'Page Name': $rootScope.CURRENT_ACTIVE_PAGE}); 
		
		DiscussionService.getDiscussions($scope.projectid, $scope.pg.pageno+1).then(function (data) {	
		    $scope.fetching=false;
		    $scope.pg.pageno = $scope.pg.pageno+1;
		    $scope.discussions=data;
		});		 
		
	    };
	    $scope.prevPage = function () {
		$scope.fetching=true;
		DiscussionService.getDiscussions($scope.projectid, $scope.pg.pageno-1).then(function (data) {
		    $scope.fetching=false;
		    $scope.pg.pageno = $scope.pg.pageno-1;
		    $scope.discussions=data;
		});
	    };
	}
    };
}]);
