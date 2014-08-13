/**
  * Name: Locality Review Display Directive
  * Description: Locality Review Display.
  * @author: [Swapnil Vaibhav]
  * Date: Feb 10, 2014
***/
'use strict';
angular.module( 'serviceApp' ).directive( 'ptReview', function() {
	return {
		restrict : 'A',
		scope    : {
			areatype   : '=',
			areaid     : '='
		},
		templateUrl : 'views/directives/common/pt-review.html',
		controller : function( $scope, ReviewService, Formatter ) {
			$scope.locality = {};
			$scope.reviewprev = 2;
			$scope.moreSize = 10;
			var typeIdText = '', typeId = '';

			$scope.$watch( 'areatype', function( __type ) {
				if ( __type ) {
					ReviewService.getReview( __type, $scope.areaid, 0, $scope.reviewprev ).then( function( response ) {
						$scope.reviewCount = response.totalCount;
						makeReview( response.data );
					});
				}
			});

			var makeReview = function( response ) {
				$scope.moreStart = $scope.reviewprev;
				if ( $scope.reviewCount > response.length ) {
					$scope.showMore = true;
				}
				if ( $scope.reviewCount ) {
					$scope.review = [];
					for( var i = 0; i < response.length; i++ ) {
						response[ i ].overallRating = ( response[ i ].localityRatings && response[ i ].localityRatings.overallRating ) ? parseFloat( response[ i ].localityRatings.overallRating ) : 0;
						response[ i ].user = {};
						if ( response[ i ].forumUser ) {
						response[ i ].user.AVATAR = response[ i ].forumUser.fbImageUrl || '';
							response[ i ].user.USERNAME = response[ i ].forumUser.username || 'Anonymous';
						}
						$scope.review.push( response[ i ] );
					}
				}
				else {
					$scope.$emit( 'delete_nav', 'Reviews' );
				}
			};

			$scope.formatDate = function( val ) {
				return Formatter.timeSince( val );
			};

			$scope.getMore = function() {
				ReviewService.getReview( $scope.areatype, $scope.areaid, $scope.moreStart, $scope.moreSize ).then( function( __revList ) {
					__updateReviewList( __revList );
				});
			};

			var __addAvatarAndRating = function( reviewList ) {
				for( var revCnt = 0; revCnt < reviewList.length; revCnt++ ) {
					reviewList[ revCnt ].user = {};
					if ( reviewList[ revCnt ].forumUser ) {
						reviewList[ revCnt ].user.AVATAR = reviewList[ revCnt ].forumUser.fbImageUrl || '';
						reviewList[ revCnt ].user.USERNAME = reviewList[ revCnt ].forumUser.username || 'Anonymous';
					}

					if ( reviewList[ revCnt ].localityRatings && reviewList[ revCnt ].localityRatings.overallRating ) {
						reviewList[ revCnt ].overallRating = reviewList[ revCnt ].localityRatings.overallRating;
					}
					else {
						reviewList[ revCnt ].overallRating = 0;
					}

					if ( !reviewList[ revCnt ].forumUser ) {
						reviewList[ revCnt ].forumUser = {
							username : 'Anonymous'
						};
					}
				}
				return reviewList;
			};

			var __updateReviewList = function( __revList ) {
				if ( $scope.moreStart + $scope.moreSize >= $scope.reviewCount ) {
					$scope.showMore = false;
				}
				$scope.moreStart += $scope.moreSize;
				var reviewList = __addAvatarAndRating( __revList.data );
				for( var i = 0; i < reviewList.length; i++ ) {
					$scope.review.push( reviewList[ i ] );
				}
			};
		}
	};
});
