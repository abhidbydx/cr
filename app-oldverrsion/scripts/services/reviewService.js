/**
   * Name: Review Service
   * Description: Service for write a review modal
   * @author: [Hemendra Srivastava]
   * Date: Mar 3, 2014
**/
'use strict';
angular.module('serviceApp')
.factory('ReviewService', function ($http, GlobalService, GetHttpService, NotificationService, $modal) {
	
	var showReviewModal = function (localityId, projectId, ratingObject) {
		var reviewModal = $modal.open({
			templateUrl: 'views/modal/reviewForm.html',
			controller : ['$scope', '$rootScope', '$modalInstance', function( $scope, $rootScope, $modalInstance ) {
				$scope.localityId = localityId;
				$scope.projectId = projectId;
				$scope.ratingObject = ratingObject;
				$scope.cancel = function () {
					$rootScope.$broadcast( 'reviewClosed' );
					$modalInstance.dismiss( 'cancel' );
				};
				$scope.close = function (data) {
					$rootScope.$broadcast( 'reviewClosed' );
					$modalInstance.close(data);
				};
				$scope.$on("reviewSaved", function (evt, data) {
					if ( data.statusCode === '2XX' ) {
						NotificationService.setNotification({
							msg : $rootScope.labels.common.message.REVIEW_SUBMITTED,
							type: 'success'
						});
					}
				evt.stopPropagation();
				$scope.close(data);
				});
			}]
		});
		return reviewModal;
	};

	var saveReview = function (reviewlabel, review, localityId, projectId) {
		if (localityId) {
			var url = GlobalService.getAPIURL('data/v1/entity/user/locality/{localityId}/review');
			url = url.replace('{localityId}', localityId.toString());
			var data = {
				localityId: localityId,
				reviewLabel: reviewlabel,
				review: review
			};
			if (projectId) {
				data.projectId = projectId;
			}
			return $http ({
				method : 'POST',
				url : url,
				data: data
			}).then(function (resp) {
				GetHttpService.commonResponse(resp, '', false);
				if (resp.status === 200) {
					return resp.data;
				}
			});
		}
	};

	var getReview = function( type, id, start, row ) {
		if ( !start ) {
			start = 0;
		}
		if ( !row ) {
			row = 4;
		}
		var url = '';
		if ( type === 'locality' ) {
			url = 'data/v1/entity/locality/review?filters=localityId==' + id + '&rows=' + row + '&start=' + start + '&sort=-localityRatings.overallRating';
		}
		else if ( type === 'suburb' ) {
			url = 'data/v1/entity/locality/review?filters=locality.suburb.id==' + id + '&rows=' + row + '&start=' + start + '&sort=-localityRatings.overallRating'
		}
		else if ( type === 'city' ) {
			url = 'data/v1/entity/locality/review?filters=locality.suburb.cityId==' + id + '&rows=' + row + '&start=' + start + '&sort=-localityRatings.overallRating';
		}

		return GlobalService.callApiAndRespond( url, true );
	};

	return {
		getReview  : getReview,
		saveReview : saveReview,
		showReviewModal : showReviewModal
	};
});