/**
 * Name: Project Overview Directive
 * Description: Use this directive to show overview on Project Page.
 * @author: [Nakul Moudgil]
 * Date: Dec 27, 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptCommonratinglocality', function() {
    return {
	restrict : 'A',
	templateUrl : 'views/directives/common/pt-common-rating-locality.html',
	controller : function($scope, $rootScope, $cookies, $location, $element, LocalityService, ReviewService, GlobalService, SignupService, Formatter) {
	    $scope.$watch('urlData', function (n, o) {
		if (n) {
		    $scope.pageType = $rootScope.urlData.pageType;
		    if ( $rootScope.urlData.localityId ) {
			$scope.thisLocalityId = $rootScope.urlData.localityId;
		    }
		    
		    $scope.showSubRatingOverlay = false;
		    $scope.rate = 0;
		    $scope.close = false;
		    $scope.locRate = 0;
		    $scope.safRate = 0;
		    $scope.transRate = 0;
		    $scope.restSRate = 0;
		    $scope.max = 5;
		    $scope.userLoggedIn = false;
		    $scope.rateOther = false;

		    $scope.updateFlag = true;

		    $scope.ratingsHash = {
			"overallRating": null,
			"location": null,
			"safety": null,
			"pubTrans": null,
			"restShop": null
		    };

		    var overlayRatingVal =  {};

		    if ( $cookies.FORUM_USER_ID ) {
			$scope.userLoggedIn = true;
		    }

		    $scope.$on( 'userLoggedIn', function( evt ) {
			$scope.userLoggedIn = true;
			if ( $scope.ratingsHash.overallRating && $scope.thisLocalityId ) {
			    LocalityService.postLocalityRating($scope.thisLocalityId, { overallRating : $scope.ratingsHash.overallRating }, subRatingOverlay);
			}
			fetchUserRatings();
		    });

		    var fetchUserRatings = function(){
			if ($scope.thisLocalityId) {
			    LocalityService.getUserRating($scope.thisLocalityId).then(function (resp){
				if (resp) {
				    $scope.rate = resp.overallRating ? resp.overallRating : 0;
				    $scope.locRate = resp.location ? resp.location : 0;
				    $scope.safRate = resp.safety ? resp.safety : 0;
				    $scope.transRate = resp.pubTrans ? resp.pubTrans : 0;
				    $scope.restSRate = resp.restShop ? resp.restShop : 0;
				    if ( $scope.rate ) {
					$scope.rateOther = true;
				    }
				}
			    });
			}
		    };

		    if ( GlobalService.isLoggedIn() ) {
			fetchUserRatings();
		    }

		    if ( $rootScope.urlData.pageType == 'projectdetail' ) {
			ReviewService.getReview( 'locality', $scope.thisLocalityId, 0, 1 ).then( function( rev ) {
			    if ( rev && rev.data && rev.data.length ) {
				$scope.totalReviews = rev.totalCount;
				$scope.randReviewContent = ( rev.data[ 0 ].review.length > 320 ) ? ( rev.data[ 0 ].review.substring(0, 300) + '... ' ) : rev.data[ 0 ].review;
				$scope.randReviewer = Formatter.ucword( rev.data[ 0 ].forumUser.username );
			    }
			    else {
				$scope.totalReviews = 0;
				delete $scope.randReviewContent;
				delete $scope.randReviewer;
			    }
			});
		    }


		    var getLocalityRate = function() {
			LocalityService.getLocality( $scope.thisLocalityId ).then( function( locality ) {
			    $scope.localityRatings = {};
			    $scope.locationRating = 'Not rated';
			    $scope.safetyRating = 'Not rated';
			    $scope.transportRating = 'Not rated';
			    $scope.restRating = 'Not rated';
			    $scope.localityRatingsLength = 0;
			    if ( locality ) {
				if ( _.keys( locality.avgRatingsByCategory ).length > 0) {

				    if ( locality.numberOfUsersByRating || locality.averageRating || locality.ratingsCount ) {
					$scope.localityRatings = {
					    'numberOfUsersByRating': locality.numberOfUsersByRating,
					    'averageRating': locality.averageRating,
					    'ratingsCount': locality.ratingsCount
					};
				    }
				    $scope.localityRatingsLength = _.keys( $scope.localityRatings ).length;
				    updateSubRating( locality.avgRatingsByCategory );
				}
			    }
			});
		    };

		    var updateSubRating = function( subRating ) {
			$scope.locationRating = ( subRating.location ) ? subRating.location.toFixed( 1 ) : $scope.locationRating;
			$scope.safetyRating = ( subRating.safety ) ? subRating.safety.toFixed( 1 ) : $scope.safetyRating;
			$scope.transportRating = ( subRating.pubTrans ) ? subRating.pubTrans.toFixed( 1 ) : $scope.transportRating;
			$scope.restRating = ( subRating.restShop ) ? subRating.restShop.toFixed( 1 ) : $scope.restRating;
		    };

		    var getRatingOnly = function() {
			LocalityService.getRatingOnly( $scope.thisLocalityId ).then( function( __rating ) {
			    updateSubRating( __rating.avgRatingsByCategory );
			    $scope.localityRatingsLength = 3;
			    $rootScope.$broadcast( 'ratingChanged', __rating );
			});
		    };

		    getLocalityRate();
		    $scope.ovrRating = function(value) {
			if ( GlobalService.isLoggedIn() ) {
			    $scope.ratingsHash['overallRating'] = value;
			}
		    };

		    $scope.overlayRating = function( type, value ) {
			overlayRatingVal[ type ] = value;
		    };

		    $scope.locRating = function(value) {
			$scope.ratingsHash['location'] = value;
		    };

		    $scope.safRating = function(value) {
			$scope.ratingsHash['safety'] = value;
		    };

		    $scope.transRating = function(value) {
			$scope.ratingsHash['pubTrans'] = value;
		    };

		    $scope.restSRating = function(value) {
			$scope.ratingsHash['restShop'] = value;
		    };

		    $scope.rateLoc = function() {
			LocalityService.postLocalityRating($scope.thisLocalityId, {location: $scope.ratingsHash['location']}, subRatingOverlay);
		    };

		    $scope.rateSafe = function() {
			LocalityService.postLocalityRating($scope.thisLocalityId, {safety: $scope.ratingsHash['safety']}, subRatingOverlay);
		    };

		    $scope.rateTrans = function() {
			LocalityService.postLocalityRating($scope.thisLocalityId, {pubTrans: $scope.ratingsHash['pubTrans']}, subRatingOverlay);
		    };

		    $scope.rateRest = function() {
			LocalityService.postLocalityRating($scope.thisLocalityId, {restShop: $scope.ratingsHash['restShop']}, subRatingOverlay);
		    };

		    var subRatingOverlay = function(resp) {
			if (!$scope.close) {
			    $scope.showSubRatingOverlay = true;
			}
			getRatingOnly();
			// fetchUserRatings();
			if (resp) {
			    $scope.rate = resp.overallRating ? resp.overallRating : 0;
			    $scope.locRate = resp.location ? resp.location : 0;
			    $scope.safRate = resp.safety ? resp.safety : 0;
			    $scope.transRate = resp.pubTrans ? resp.pubTrans : 0;
			    $scope.restSRate = resp.restShop ? resp.restShop : 0;
			    if ( $scope.rate ) {
				$scope.rateOther = true;
			    }
			}
		    };

		    $scope.hideOverlay = function() {
			$scope.showSubRatingOverlay = false;
		    };

		    $scope.rateLocality = function (close, submitSub, fromPopup) {
			if (GlobalService.isLoggedIn()) {
			    $scope.rateOther = true;
			    fetchUserRatings();
			    $scope.close = false;
			    if (close) {
				$scope.close = true;
			    }
			    var __tmpHash = {};
			    if (submitSub) {
				__tmpHash = overlayRatingVal;
			    } else {
				__tmpHash.overallRating = $scope.ratingsHash.overallRating;
			    }
			    LocalityService.postLocalityRating($scope.thisLocalityId, __tmpHash, subRatingOverlay);
			} else {
			    $scope.ratingsHash.overallRating = close;
			    SignupService.openSignUp();
			}
		    };

		    $scope.writeReview = function ( projectId ) {
			if ( GlobalService.isLoggedIn() ) {
			    var ratingObject = {
				thisLocalityId: $scope.thisLocalityId,
				max: $scope.max,
				ratingsHash: $scope.ratingsHash,
				rateLocality: $scope.rateLocality,
				rateOther: $scope.rateOther,
				postRate: {
				    rateLoc: $scope.rateLoc,
				    rateSafe: $scope.rateSafe,
				    rateTrans: $scope.rateTrans,
				    rateRest: $scope.rateRest
				}
			    };
			    $scope.updateFlag = false;
			    var reviewModal = ReviewService.showReviewModal( $scope.thisLocalityId, projectId, ratingObject );
			    reviewModal.result.then( function () {
				$rootScope.$broadcast( 'reviewClosed' );
			    }, function () {
				$rootScope.$broadcast( 'reviewClosed' );
			    });
			    //Send Mixpanel tracker event request when review box open
			    var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
			    $rootScope.TrackingService.sendGAEvent('review','open','locality-'+pageType);
			    $rootScope.TrackingService.mixPanelTracking("Locality Review Box Open",{"Page Name":pageType});
			    //end mixpanel
			}
			else {
			    SignupService.openSignUp().result.then(function () {
				$scope.writeReview();
			    });
			}
		    };

		    $scope.$on( 'reviewClosed', function() {
			$scope.updateFlag = true;
		    });
		}
	    }, true);

	}
    }
});
