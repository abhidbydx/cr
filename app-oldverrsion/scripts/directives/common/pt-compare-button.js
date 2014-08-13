
'use strict';
angular.module('serviceApp').directive('ptCompareButton',function(){
	return {
		restrict: 'A',
		templateUrl: 'views/directives/common/pt-compare-button.html',
		scope:{
			project : '=',
			caller	: '='
		},
		controller:function($scope, CompareStorage, $timeout, BlockingInfo){
			$scope.callerLocation	= 'ALV';
			$scope.toggleCompare = function($event){

				if(!$scope.isDisabled()){
					if(!$.jStorage.get('PT_CMP_USED')){
						if(!$.jStorage.get('PT_CMP_USED')){
							$.jStorage.set('PT_CMP_USED',true);
						}
						var fElements = []
						fElements.push($("#compare_bucket"));
						fElements.push($("#compare_bucket>ul"));

						BlockingInfo.invoke(fElements);

						$("#compare_bucket>ul").slideDown();
						$('#compare_help_text').show();
						$timeout(function(){
							BlockingInfo.dismiss();
							$("#compare_bucket>ul").slideUp();
							$('#compare_help_text').hide();
						}, 3000);
						$($('#blocking-info').children()[0]).show();
					} else {
						$('#compare_count').effect('bounce', {times:3}, 'slow');
					}
					CompareStorage.toggle($scope.project, $scope.caller);	
				}
				
			}

			$scope.isDisabled = function(){
				var disabled = CompareStorage.disable() && !$scope.exist();
				if(disabled){
					$scope.title = 'You can add maximum 10 project to compare'
				} else {
					$scope.title = $scope.addedToCompare ? "Remove from compare" : $scope.title = "Add to compare";
				}
				return disabled;

			}

			$scope.exist = function(){
				$scope.addedToCompare = CompareStorage.exist($scope.project.projectId);
				return $scope.addedToCompare;
			}

			$scope.$watch('addedToCompare', function(){
				$scope.title = $scope.addedToCompare ? "Remove from compare" : $scope.title = "Add to compare";
			});
		}
	}
});
