'use strict';
angular.module('serviceApp').directive('ptProjectemi', function () {
	return {
		restrict: 'A',
		templateUrl: 'views/directives/project/emi.html',
		controller: function ($scope, Formatter, $location, $rootScope,LeadService) {
			$scope.total_cost = '0 lac';
			$scope.emi_10_amount = 0;
			$scope.emi_20_amount = 0;
			$scope.emi_30_amount = 0;
			$scope.down_payment = $rootScope.downPaymentPercentage;
			$scope.interest_rate = $rootScope.interestRate;
			$scope.state = 'hidden';
			$scope.emi_prop_list = [{name: 'Custom', value: '0'}];
			$scope.item = $scope.emi_prop_list[0];
			$scope.setAmounts = function ($event) {
				var suffix = '';
				if ($event && $event.type == 'keyup') {
					if ($event.keyCode == 8) {
						if ($scope.item.name != 'Custom')
							$scope.total_cost = '';
					}
					$scope.item = $scope.emi_prop_list.slice(-1)[0];
				}
				if (isNaN($scope.total_cost)) {
					$scope.total_cost = '';
				}
				$scope.total_cost = convertShortToLong($scope.total_cost);
				$scope.updatePrice($scope.total_cost, $scope.item);
			};

			var convertShortToLong = function (price) {
				var mult = 0, fullPrice = 0;
				if (price && typeof price == 'string') {
					var priceSplit = price.split(' ');
					if (priceSplit && priceSplit[1]) {
						if (priceSplit[1].toLowerCase().slice(0, 3) == 'lac') {
							mult = 100000;
						} else {
							mult = 10000000;
						}
						fullPrice = parseFloat(priceSplit[0]) * mult;
						return fullPrice;
					}
				}
				return price;
			};

			$scope.$watch('propList', function (newValue, oldValue) {
				if (newValue) {
					if (newValue.length <= 2 && newValue[0].id == 0) {
						newValue = newValue.slice(1);
					}
                    var temp_list = angular.copy(newValue);
                    if (temp_list.length > 1 && temp_list[0].id == 0) {
                        temp_list = temp_list.slice(1);
                    }
                    if (temp_list.length > 1 && temp_list[0].id == -1) {
                        temp_list = temp_list.slice(1);
                    }
					$scope.emi_prop_list = [];
                    for (var bhk in temp_list) {
                    	if (temp_list.hasOwnProperty(bhk)) {
	                        if (temp_list[bhk].value && parseInt(temp_list[bhk].value) != 0) {
	                            $scope.emi_prop_list.push(temp_list[bhk]);
	                        }
	                    }
                    }
					$scope.emi_prop_list.push({name: 'Custom', value: '0'});
					$scope.item = $scope.emi_prop_list[0];
					$scope.total_cost = convertShortToLong($scope.item.value);
					$scope.updatePrice($scope.total_cost, $scope.item);
				}
			});

			$scope.$watch('prop_selected',function(newVal, oldVal){
				if(newVal != oldVal){
					for (var bhk_prop in $scope.emi_prop_list) {
						if ($scope.prop_selected.id == $scope.emi_prop_list[bhk_prop].id) {
							$scope.item = $scope.emi_prop_list[bhk_prop];
						} else if ($scope.prop_selected.id == 0) {
							$scope.item = $scope.emi_prop_list[0];
						}
					}
					$scope.total_cost = convertShortToLong($scope.item.value);
					$scope.updatePrice($scope.total_cost, $scope.item);
				}
			});

			$scope.loan_eligibility_check = false;
			$scope.income_range = [120000, 6000000];
			$scope.annual_income = 600000;
			$scope.rate_monthly = $scope.interest_rate / (12 * 100);
			$scope.monthly_saving = 0.5 * $scope.annual_income / 12;

			$scope.showCalc = function () {
				if ($scope.loan_eligibility_check) {
					$('.income_slide').hide();
					for (var loan_class in $scope.class_loan) {
						$scope.class_loan[loan_class] = '';
					}
				} else {
					$('.income_slide').show();
					$scope.eligibility_calc();
				}
			};

			$scope.eligibility_calc = function () {
				$scope.monthly_saving = 0.5 * $scope.annual_income / 12;
				$scope.max_loan = {
					'max_loan_10': 0,
					'max_loan_20': 0,
					'max_loan_30': 0
				};
				$scope.class_loan = {
					'class_loan_10': '',
					'class_loan_20': '',
					'class_loan_30': ''
				};
				var time_list = [10, 20, 30];
				if ($('.income_slide').css('display') != 'none') {
					for (var time in time_list) {
						var loan_list = $scope.calc_max_loan($scope.monthly_saving, $scope.rate_monthly, time_list[time] * 12);
						$scope.max_loan['max_loan_' + time_list[time]] = loan_list[0];
						$scope.class_loan['class_loan_' + time_list[time]] = loan_list[1];
					}
				}
			};

			$scope.calc_max_loan = function (monthly_saving, rate_monthly, tenure) {
				var max_loan = monthly_saving * (Math.pow((1 + rate_monthly), tenure) - 1) / (rate_monthly * Math.pow((1 + rate_monthly), tenure));
				var class_loan = max_loan >= $scope.loan_amount_complete ? 'check' : 'exclamation';
				return [max_loan, class_loan];
			};

			$scope.updatePrice = function (custom_amount, property) {
				$scope.item = property;
				for (var prop in $scope.emi_prop_list) {
					if ($scope.item.id == $scope.emi_prop_list[prop].id) {
						$scope.emi_prop_list[prop].display = 'font-weight';
					} else {
						$scope.emi_prop_list[prop].display = '';
					}
				}
				var tot_cost = '';

				if (!custom_amount) {
					if ($scope.item.name == 'Custom') {
						$scope.total_cost = '';
					}
                    tot_cost = convertShortToLong($scope.item.value);
				} else {
					tot_cost = convertShortToLong(custom_amount);
				}
				$scope.set_amounts(tot_cost, $scope.down_payment, $scope.interest_rate);
				$scope.eligibility_calc();
			};

			$scope.set_interest_rate = function(interest_rate) {
                if (interest_rate < 10) {
                    interest_rate = 10;
                }
                $scope.interest_rate = interest_rate;
                $scope.set_amounts($scope.total_cost, $scope.down_payment, $scope.interest_rate);
            };

            $scope.set_amounts = function (total_cost, down_payment, interest_rate) {
				if ($scope.item.name != 'Custom') {
					$scope.total_cost = convertShortToLong($scope.item.value);
				}

				if (interest_rate.toString().split('.').length > 1 && interest_rate.toString().split('.')[1].length > 1 ) {
					interest_rate = parseFloat(+(Math.round(interest_rate * 10) / 10).toFixed(1));
				}

				if (parseFloat(interest_rate.toString().split('.')[0]) > 20) {
					interest_rate = 20;
				}

				if (parseFloat(interest_rate.toString().split('.')[0]) < 0) {
					interest_rate = 0;
				}

				$scope.interest_rate = interest_rate;
				$rootScope.interestRate = interest_rate;
				$rootScope.$broadcast('interestRateChanged', interest_rate);

                if (down_payment.toString().split('.')[1] && down_payment.toString().split('.')[1].length > 1) {
                    down_payment = Math.round(down_payment * 10) / 10;
                }
                if (down_payment > 100) {
                	down_payment = 100;
                }
				$scope.down_payment = down_payment;
				$rootScope.downPaymentPercentage = down_payment;
				$rootScope.$broadcast('downPaymentChanged', down_payment);
				if (total_cost) {
					$scope.total_cost_complete_display = Formatter.formatPrice(total_cost);
					$scope.down_payment_complete = parseInt(total_cost) * down_payment / 100;
					$scope.down_payment_complete_display = Formatter.formatPrice($scope.down_payment_complete);
					$scope.loan_amount_complete = total_cost - $scope.down_payment_complete;
					$scope.loan_amount_complete_display = Formatter.formatPrice($scope.loan_amount_complete);
					$scope.emi_10_amount = Formatter.formatRs($scope.emi_calc($scope.total_cost_complete_display, 120));
					$scope.emi_20_amount = Formatter.formatRs($scope.emi_calc($scope.total_cost_complete_display, 240));
					$scope.emi_30_amount = Formatter.formatRs($scope.emi_calc($scope.total_cost_complete_display, 360));
				}
			};
			$scope.emi_calc = function (loan_amount, noOfInstallments) {
				return Formatter.getEMI(loan_amount, noOfInstallments);
			}
		}
	};
});
