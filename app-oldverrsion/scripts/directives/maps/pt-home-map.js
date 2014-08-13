'use strict';
angular.module('serviceApp').directive('ptHomeMap', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/directives/maps/pt-home-map.html',
        controller: function($scope, mapFactory, markerFactory, $rootScope) {
            var cityDetail = [{
				office: "Head Office",
				branchoffice: "Sales Office",
                address: "D-12, Ist Floor, Sector 3, Noida 201301 (U.P.)",
				branchaddress: "A-4, Ist Floor, Sector 4, Noida 201301 (U.P.)",
                contact: "Help Desk: +91 9555-606060",
				workingHours : "Working Hours : 9:00 AM to 7:30 PM"
            }, {
				office: "Branch Office",
                address: "SCO-11 & 12, 1st Floor, Near Om Sweets, Sector-31, Gurgaon - 122001.",
                contact: "Help Desk: +91 9555-606060",
				workingHours : "Working Hours : 9:00 AM to 7:30 PM"
            }, {
				office: "Branch Office",
                address: "1st Floor, Runwal Chambers, Opp - BMC Office, Near - Chembur Railway Station, Chembur - East, Mumbai - 400071",
                contact: "Help Desk: +91 9555-606060",
				workingHours : "Working Hours : 9:00 AM to 7:30 PM"
            }, {
				office: "Branch Office",
                address: "No.16 KMC Arcade, 100 feet inner ring road Ejipura,Koramangala, Bangalore 560047 (Karnataka)",
                contact: "Help Desk: +91 9555-606060",
				workingHours : "Working Hours : 9:00 AM to 7:30 PM"
            }, {
				office: "Branch Office",
                address: "1B/2, B3, Cerbrum IT Park, Kalyani Nagar, Pune - 411014",
                contact: "Help Desk: +91 9555-606060",
				workingHours : "Working Hours : 9:00 AM to 7:30 PM"
            }, {
				office: "Branch Office",
                address: "C-53, 1st floor, Karthika Industries, Guindy Industrial Estate, Chennai- 600032",
                contact: "Help Desk: +91 9555-606060",
				workingHours : "Working Hours : 9:00 AM to 7:30 PM"
            }, {
				office: "Branch Office",
                address: "86/B/2 Topsia Road, Gajraj Chambers, 3rd Floor, Suite # 3 B, Kolkata - 700046",
                contact: "Help Desk: +91 9555-606060",
				workingHours : "Working Hours : 9:00 AM to 7:30 PM"
            }, {
				office: "Branch Office",
                address: "A-803, Infinity, Beside Hotel Ramada, Corporate Road, Near Prahlad Nagar Garden, Ahmedabad- 15.",
                contact: "Help Desk: +91 9555-606060",
				workingHours : "Working Hours : 9:00 AM to 7:30 PM"
            }];
            var imageClasses = ["noidaMap", "gurgaonMap", "mumbaiMap", "bangaloreMap", "puneMap", "chennaiMap", "kolkataMap", "ahmedabadMap"];
            $scope.imageClass = imageClasses[0];
            $scope.currentIndex = 0;
            $scope.$watch('selectedCity', function (n, o){
                if (n) {
                    var index = imageClasses.indexOf(_.find(imageClasses, function(className) {
                        return n.label.toLowerCase() + 'Map' == className;
                    }));
                    if (index != -1)
                        $scope.changeCity(index);
                }
            });
            $scope.office = cityDetail[0].office;
			$scope.branchoffice = cityDetail[0].branchoffice;
			$scope.branchaddress = cityDetail[0].branchaddress;
			$scope.address = cityDetail[0].address;
            $scope.contact = cityDetail[0].contact;
			$scope.workingHours = cityDetail[0].workingHours;
            $scope.classIndex = ['active', '', '', '', '', '', '', ''];
            $scope.changeCity = function(idx) {
                if ($scope.currentIndex !== idx) {
                    $scope.currentIndex = idx;
                    for (var i = 0; i < $scope.classIndex.length; i++) {
                        $scope.classIndex[i] = '';
                    }
					if (idx == 0) {
						$scope.branchoffice = cityDetail[idx].branchoffice;
						$scope.branchaddress = cityDetail[idx].branchaddress;
					}
					else {
						$scope.branchoffice = null;
						$scope.branchaddress = null;
					}
                    $scope.address = cityDetail[idx].address;
					$scope.office = cityDetail[idx].office;
                    $scope.contact = cityDetail[idx].contact;
					$scope.workingHours = cityDetail[idx].workingHours;
                    $scope.classIndex[$scope.currentIndex] = 'active';
                    $scope.imageClass = imageClasses[idx];
                }
            }
        }
    }
});
