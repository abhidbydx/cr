'use strict';

angular.module('serviceApp')
    .controller("pageController", function ($scope, $rootScope, $http, $state, $stateParams, $compile, $location, GlobalService, $window, $timeout, Constants) {
		
    	$rootScope.showSearch = true;
    	$rootScope.showFilters = false;

		var switchTemplate = function (data) {
		    // This needs to be made conditional based on listings / maps etc as required
		    
		    if(data.pageType.indexOf('PROJECTDETAIL') > -1 || data.pageType.indexOf('PROPERTY') > -1){
				$state.templateUrl = 'views/controller/projectDetail.html';
		    }
		    else if(data.pageType.indexOf('SALE-LISTING') > -1){

		    	$state.go('listings');
		    	return;
				//$state.templateUrl = 'views/controller/listings.html';
		    }
		    else if(data.pageType.indexOf('LOCALITY') > -1 || data.pageType.indexOf('OVERVIEW') > -1 || data.pageType.indexOf('AMENITIES') > -1){
				$state.templateUrl = 'views/controller/overview.html';
		    }
		    else {
				$window.location.href = "404";
		    }
		    
		    if ($state.templateUrl) {
				var divscope = $scope.$new();
				$http.get($state.templateUrl).then(function (msg) {
			    	    $('#views').html($compile(msg.data)(divscope));
				});
				$scope.$on("$locationChangeStart", function (event, next, current) {
			    	    divscope.$destroy();
				});
		    }
		};

        var fetchUrlData = function () {

            return $http.get(GlobalService.getAPIURL('angularUrlService.php?url='+$location.path()))
            .then(function(response) {
                return response.data;
            });
        };

	var handleURLData = function (data) {

	    if (data.redirectUrl === '#') {
		$window.location.href = "404";
	    }
	    else if (data.redirectUrl && data.redirectUrl.toString() !== '-1') {
                $location.path(data.redirectUrl);                
	    }
	    else {		
		$rootScope.urlData = data;
		switchTemplate(data);
		
	    }
	};

	if($rootScope.preemptToListing){
		$state.go('listings');
	} else {
		fetchUrlData().then(handleURLData);	
	}
	
	(function(){
			$rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.LISTING;
	})();

});
