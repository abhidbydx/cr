/**
 * Name : Enquiry Form Directive
 * Description: Enquire Form Directive is used to display enquiry form
 * @author: [Hemendra Srivastava]
 * Date: Jan 10, 2014
 **/

 'use strict';

 angular.module('serviceApp').directive('ptWritereview', function(){
 	return {
 		restrict: 'A',
 		templateUrl: 'views/directives/common/pt-writereview.html',
 		scope: {localityId:'=', projectId:'=', ratingObject: '='},
 		controller: ["$scope", "$rootScope", "ReviewService", "GlobalService", "LocalityService", "$timeout", function ($scope, $rootScope, ReviewService, GlobalService, LocalityService, $timeout) {
            var showPopover = true;
            $scope.ovrRating = function(value) {
                $scope.ratingObject.ratingsHash['overallRating'] = value;
            };

            $scope.locRating = function(value) {
                $scope.ratingObject.ratingsHash['location'] = value;
            };

            $scope.safRating = function(value) {
                $scope.ratingObject.ratingsHash['safety'] = value;
            };

            $scope.transRating = function(value) {
                $scope.ratingObject.ratingsHash['pubTrans'] = value;
            };

            $scope.restSRating = function(value) {
                $scope.ratingObject.ratingsHash['restShop'] = value;
            };

            var fetchUserRatings = function(){
                LocalityService.getUserRating($scope.ratingObject.thisLocalityId).then(function (resp){
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
            };

            $scope.rateOverall = function() {
                $timeout( function() {
                    $('#overallRating').click();
                });
                $scope.rateOther = true;
            };

            fetchUserRatings();

 			$scope.isSubmitted = false;
 			$scope.totalTitleChars = 80;
 			$scope.totalReviewChars = 2000;

 			$scope.titleStatus = 'left';
 			$scope.reviewStatus = 'left';

 			$scope.titleCharDiff = $scope.totalTitleChars;
 			$scope.reviewCharDiff = $scope.totalReviewChars;
                
            $scope.error = {};

 			$scope.updateTitle = function() {
                $scope.error.title = '';
 				$scope.titleCharDiff = Math.abs($scope.totalTitleChars - $scope.formData.title.length);
 				if ($scope.totalTitleChars < $scope.formData.title.length) {
 					$scope.titleStatus = 'extra';
 				} else {
 					$scope.titleStatus = 'left';
 				}
 			};

 			$scope.updateReview = function() {
                $scope.error.review = '';
 				$scope.reviewCharDiff = $scope.formData.review ? Math.abs($scope.totalReviewChars - $scope.formData.review.length) : Math.abs( $scope.totalReviewChars );
 				if ( $scope.formData.review && $scope.totalReviewChars < $scope.formData.review.length ) {
 					$scope.reviewStatus = 'extra';
 				} else {
 					$scope.reviewStatus = 'left';
 				}
 			};

 			$scope.save = function (data) {
                if ( $scope.rateOther ) {
                    $scope.error = {};
     				$scope.isSubmitted = true;
     				if ($scope.reviewForm.$valid) {
                        if ($scope.formData.review.length > 2000 || $scope.formData.title.length > 80) {
         					if ($scope.formData.review.length > 2000) {
         						$scope.error.review = "Only 2000 characters allowed.";
         						$scope.isSubmitted = false;
         					}
                            if ($scope.formData.title.length > 80) {
         						$scope.error.title = "Only 80 characters for the title allowed.";
         						$scope.isSubmitted = false;
                            }
     					} else {
     						$scope.isSaving = true;
     						ReviewService.saveReview(data.title, data.review, $scope.localityId, $scope.projectId)
     						.then( function (data) {
     							$scope.isSaving = false;
     							$scope.$emit("reviewSaved", data);
     						}, function () {
     							$scope.isSaving = false;
     						});
     					}
     				} else {
                        for (var errorIndex in $scope.reviewForm.$error.required) {
                            if ($scope.reviewForm.$error.required.hasOwnProperty(errorIndex)) {
                                $scope.error[$scope.reviewForm.$error.required[errorIndex].$name] = $rootScope.labels.common.error["INVALID_" + $scope.reviewForm.$error.required[errorIndex].$name.toUpperCase()];
                            }
                        }
     					$scope.isSubmitted = false;
     				}
                }
                else {
                    if ( showPopover ) {
                        showPopover = false;
                        $timeout( function(){
                            $('#overallRating').click();
                            $('#overallRating').addClass('rating-focus');
                            $timeout( function(){
                                $('#overallRating').click();
                                $('#overallRating').removeClass('rating-focus');
                                showPopover = true;
                            }, 2000 );
                        }, 0 );
                    }
                }
 			};	    
 		}]
 	};
 });