'use strict';
angular.module('serviceApp').directive('ptRating',function(){
	return {
		restrict: 'A',
		scope: { ratings: '='},
		templateUrl: 'views/directives/common/pt-rating.html',
		controller: function($scope){

			$scope.$on( 'ratingChanged', function( evt, data ) {
				$scope.ratings = data;
			});

			$scope.$watch( 'ratings', function( nRating ) {

				var totalRatingCount = 0;

				if($scope.ratings && $scope.ratings.numberOfUsersByRating){

					var ratingBreak = {
						0.0: 	0,
						0.5: 	0, 
						1.0: 	0, 
						1.5: 	0, 
						2.0: 	0, 
						2.5: 	0, 
						3.0: 	0, 
						3.5: 	0, 
						4.0: 	0, 
						4.5: 	0, 
						5.0: 	0
					},
					rBreak;

					for (rBreak in ratingBreak) {
						var nUsers = $scope.ratings.numberOfUsersByRating[parseFloat(rBreak).toFixed(1)];
						if (nUsers) {
							totalRatingCount += nUsers;
							ratingBreak[rBreak] = nUsers;
						}
					}

					$scope.excellent = ratingBreak[4.5] + ratingBreak[5.0];

					$scope.good = ratingBreak[3.5]+ratingBreak[4.0];

					$scope.average = ratingBreak[2.5] + ratingBreak[3.0];

					$scope.poor = ratingBreak[0.0] + ratingBreak[0.5] + ratingBreak[1.0] + ratingBreak[1.5] + ratingBreak[2.0];
				}
				
				_.each(["excellent", "good", "average", "poor"], function(item){
					if($scope[item] && totalRatingCount){
						$scope[item+"Percent"] = $scope[item]*100/totalRatingCount;	
					}
					else {
						$scope[item] = 0;
						$scope[item+"Percent"] = 0;
					}
					
					//Scaling on the scale of 10 and taking ceil so that even .5 can evaluate to 1 hence display something on rating
					$scope[item+"Percent"] = Math.ceil($scope[item+"Percent"]/10);
				});

				if($scope.ratings && $scope.ratings.averageRating){

					var avgRatingLabel = 0;

					switch(Math.ceil($scope.ratings.averageRating)){

						case 5 :
							avgRatingLabel = "excellent";
							break;
						case 4 :
							avgRatingLabel = "good";	
							break						
						case 3 :
							avgRatingLabel = "average";
							break;
						case 2 :
							avgRatingLabel = "average"
							break;
						case 1 :
							avgRatingLabel = "poor"
							break;
						case 0 :
							avgRatingLabel = "poor"
							break;
					}

					$scope.avgRatingLabel = avgRatingLabel;
					if(!$scope.ratings.ratingsCount)
						$scope.ratings.ratingsCount = totalRatingCount;
				}
				else{
					$scope.avgRatingLabel = "poor";
					if($scope.ratings){
						$scope.ratings.averageRating = 0;
					}
				}

			});
			$scope.max = 10;
		}
	}
});