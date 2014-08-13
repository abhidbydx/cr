'use strict';
angular.module('serviceApp').directive('ptProjectnavigator', function() {
    return {
	restrict: 'A',
	templateUrl: 'views/directives/project/navigator.html',
	controller: function($scope, $location, $anchorScroll, $window, $timeout, $rootScope, Formatter) {
	    $scope.yoffset = 0;
	    $scope.$on("scrolled", function (evt, data) {
		if (data) {
		    $scope.yoffset = data.yoffset;
		    $scope.height = data.height;
		    $scope.mid = $scope.yoffset + $scope.height / 2 ;
		}
	    });
	    $scope.eleTop = {};

	    var getMax = function (obj, val) {
		var max;
		for (var p in obj) {
		    if (obj[p] && obj[p] > val) {
			if (!max || obj[p] < max) {
			    max = obj[p];
			}
		    };
		}
		return max;
	    };

	    $scope.checkBounds = function (ele) {
		var top = $scope.eleTop[ele];
		if (top) {
		    var next = getMax($scope.eleTop, top);
		    if ($scope.mid >= top && (!next || $scope.mid < next) ) {
			return true;
		    }
		}
		return false;
	    };

            $scope.checkHeight = function ( ele ) {
                if ($("#"+ele) && $("#"+ele).height() > 0) {
                    return true;
                }
                else {
                    return false;
                }
            };

	    angular.forEach($scope.projectSectionsHash, function (value, key) {
		$scope.$watch(function () {
		    var ele = angular.element("#"+value);
		    if (ele && ele.offset() && ele.offset().top) {
			return ele.offset().top;
		    }
		    return undefined;
		}, function (n) {
		    $scope.eleTop[value] = n;
		});
	    });

	    if ( typeof $scope.projectSectionsHash === 'object' ) {
		$scope.sections = _.keys($scope.projectSectionsHash);
	    }

	    $scope.goToEl = Formatter.goToEl;
	}
    };
});
