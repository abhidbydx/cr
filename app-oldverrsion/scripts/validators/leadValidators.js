'use strict';

angular.module('serviceApp')
    .directive('ptMobilevalid', function() {
	return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
		
		var validatePhone = function (phno, ctry) {
                    var phone_re = /^\+{0,1}[0-9- ]+$/;
                    if (!phone_re.test(phno)) {
			return false;
                    }
                    var prefix = phno[0];
                    phno = phno.match(/[0-9]+?/g).join('');
                    phno = phno.replace(/^[0]+/g, '');
                    // if (prefix == "+")
                    //     $(ph).val(prefix + phno);
                    // else
                    //     $(ph).val(phno);
                    if (ctry.trim().toLowerCase() === 'india') {
			if (phno.substring(0, 2) === '91' && phno.length === 12) {
                            // $(ph).val(phno.substring(2, 12));
                            return phno.substring(2,12);
			}
			else if (phno.length == 10 && prefix != '+') {
                            return phno;
			}
			else {
			    return false;
			}
                    }
                    else {
			if ((phno.length < 6 || phno.length > 15) && prefix == '+') {
                            return false;
			}
			else if (phno.length < 6 || ((phno.length > 12) && (prefix !== '+'))) {
                            return false;
			}
			else {
                            if (prefix === '+') {
				return prefix + phno;
                            }
                            else {
				return phno;
                            }
			}
                    }
		};
		
		ctrl.$parsers.unshift(function(viewValue) {
                    var newph = validatePhone(viewValue, attrs.country);
                    if (newph) {
			ctrl.$setValidity('mobile', true);
			return newph && newph.trim();
                    } else {
			ctrl.$setValidity('mobile', false);
			return viewValue && viewValue.trim();
                    }
		});
            }
	};
    });


angular.module('serviceApp')
    .directive('ptEmailvalid', function( CommonValidators ) {
	return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
		ctrl.$parsers.unshift(function(viewValue) {
                    if (CommonValidators.isEmail(viewValue)) {
			ctrl.$setValidity('email', true);
			return viewValue && viewValue.trim();
                    }  
                    else {
			ctrl.$setValidity('email', false);
			return viewValue && viewValue.trim();
                    }
		});
            }
	};
    });

angular.module('serviceApp')
    .directive('ptNamevalid', function( CommonValidators ) {
	return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
		ctrl.$parsers.unshift(function(viewValue) {		    
                    if (CommonValidators.isName(viewValue)) {
			ctrl.$setValidity('name', true);
			return viewValue && viewValue.trim();
                    }  
                    else {
			ctrl.$setValidity('name', false);
			return viewValue && viewValue.trim();
                    }
		});
            }
	};
    });

angular.module('serviceApp')
    .directive('ptIntegervalid', function( CommonValidators ) {
	return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
		ctrl.$parsers.unshift(function(viewValue) {
                    if (CommonValidators.isInteger(viewValue)) {
			ctrl.$setValidity('integer', true);
			return parseInt(viewValue);
                    } else {
			ctrl.$setValidity('integer', false);
			return viewValue;
                    }
		});
            }
	};
    });

angular.module('serviceApp')
    .directive('ptRequired', function( CommonValidators ) {
	return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
		scope.$watch(attrs.ngModel, function (viewValue) {
		    if (viewValue && typeof(viewValue) === "string" && viewValue.trim()) {
			ctrl.$setValidity('required', true);
		    } else if (viewValue && typeof(viewValue) !== "string") {
			ctrl.$setValidity('required', true);
		    } else {
			ctrl.$setValidity('required', false);
		    }
		});
            }
	};
    });

    angular.module('serviceApp')
    .directive('ptCountryvalid', function( CommonValidators ) {
	return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
		ctrl.$parsers.unshift(function(viewValue) {			
                    if (viewValue && CommonValidators.isCountry(viewValue.name)) {
			ctrl.$setValidity('country', true);			
			return viewValue;
                    }  
                    else {
			ctrl.$setValidity('country', false);			
			return viewValue;
                    }
		});
            }
	};
    });