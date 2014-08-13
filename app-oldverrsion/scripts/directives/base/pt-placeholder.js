/**
 * Name: Placeholder Directive
 * Description: Placeholder directive. Since input placeholder attribute is not compatible with ie < 10
 * @author: [Hemendra Srivastava]
 * Date: Dec 9, 2013
 **/

'use strict';

angular.module('serviceApp').directive('ptPlaceholder', ['$rootScope', 'GlobalService', function($rootScope, GlobalService) {
    return {
	restrict: 'A',
	require: 'ngModel',
	link: function(scope, element, attr, ngModel) {
	    var watcher;
	    var getPlaceHolder;
	    var unplacehold;
	    var watcher = scope.$watch(function () {
		return $rootScope.labels;
	    }, function (n) {
		if (n) {
		    var value;
		    var isPassword = false;
		    var getPlaceholder = function (expr) {
			var placeholder = GlobalService.getObjectValuebyString($rootScope, expr);
			if (placeholder) {
			    return placeholder;
			}
			return expr;
		    };
	    	    
		    var unplacehold = function () {
			element.val('');
			element.removeClass("exampleonly");
			if (isPassword) {
			    element.attr('type', 'password');
			}
		    };

		    scope.$watch(attr.ngModel, function (val) {
			value = val || '';
		    });

                    scope.$watch(function () { return attr.ptPlaceholder; }, function (newVal) {
                        if (newVal && !value && (element[0] !== document.activeElement)) {
                            placehold();
		            value = '';
		            return getPlaceholder(attr.ptPlaceholder);
                        }
                    });

		    element.bind('focus', function () {
			if(value == '') {
			    unplacehold();
			}
		    });
		    
		    element.bind('blur', function () {
			if (element.val() == '') placehold();
		    });
		    
		    ngModel.$formatters.unshift(function (val) {
			if (!val && (element[0] !== document.activeElement)) {		    
			    placehold();
			    value = '';
			    return getPlaceholder(attr.ptPlaceholder);
			}
			return val;
		    });

		    var placehold = function () {
			element[0].value = getPlaceholder(attr.ptPlaceholder);
			element.addClass("exampleonly");
			if (element.attr('type') === 'password') {
			    element.attr('type', 'text');
			    isPassword = true;
			}
		    };

		    if (!element[0].value){
			placehold();
		    };

		    watcher();
		}
	    });	    
	}
    };
}]);
