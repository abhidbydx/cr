/***
  * Name: Report Error Service
  * Description: To open and submit error report from property options
  * @author: [Swapnil Vaibhav]
  * Date: Jan 22, 2014
***/
'use strict';

angular.module( 'serviceApp' )
.factory('SellFormService', ["$modal", "GlobalService", "$rootScope", "GetHttpService", "$http", function( $modal, GlobalService, $rootScope, GetHttpService, $http ) {
    
    var updateFormData = function( formData ) {
	var a = $rootScope.userInfo;        
	if (a) {
	    if (a.EMAIL) {
		formData.email = a.EMAIL;
	    }
	    if (a.USERNAME) {
		formData.name = a.USERNAME;
	    }
            if (a.COUNTRY_ID) {
		formData.country_id = a.COUNTRY_ID;
	    }
            if (a.CONTACT && a.CONTACT!=0) {
		formData.mobile = a.CONTACT;
	    }
	}
    var city = GlobalService.getHomeCity();
    if (city) {
        formData.city_id = city.id;
    }
    formData.country = formData.country || {};
    var user_enquiry_info = JSON.parse(GlobalService.getCookie('enquiry_info'));
    if (user_enquiry_info.country) {
        formData.country_id = user_enquiry_info.country;
    }
    if (user_enquiry_info.phone) {
        formData.mobile = user_enquiry_info.phone;
    }
	formData.sellerType="owner";
        return formData;
    };

    var openSellForm = function( viewedFrom ) {
        $modal.open({
            templateUrl: 'views/modal/sellform.html',
            controller : ["$scope", "$modalInstance", function ($scope, $modalInstance) {
			//GA/Mixpanel On Clicking Sell Property button or Link
			$scope.TrackingService.sendGAEvent('sell', 'clicked', 'sellProperty-'+viewedFrom+'-'+$scope.CURRENT_ACTIVE_PAGE); 
			$scope.TrackingService.mixPanelTracking('Viewed Sell Property Form', {'Viewed From': viewedFrom, 'Page Name': $scope.CURRENT_ACTIVE_PAGE});			 
			//End mixpanel
			$scope.viewedFrom = viewedFrom;
				
		$scope.formData = updateFormData({});
		$scope.cancel = function () {
                    $modalInstance.dismiss( 'cancel' );
                };
		$scope.close = function () {
                    $modalInstance.close( $scope.formData );
                };
	    }]
        });
    };

    var sellProperty = function (data, callback) {
        var baseUrl = '', apiUrl = '', postObj = {};
        if (GlobalService.isLoggedIn()) {
            baseUrl = 'data/v1/entity/user/property/sell-property';
        } else {
            baseUrl = 'data/v1/entity/property/sell-property';
        }
        apiUrl = GlobalService.getAPIURL(baseUrl);
        postObj = {
            "leadUser": data.name,
            "leadEmail": data.email,
            "leadContact": data.mobile,
            "leadCountryId": data.country.id,
            "isBroker": (data.sellerType == 'owner' ? false : true)
        };

        if (!postObj.isBroker) {
            postObj.projectid = data.project.id ? data.project.id.split('-').slice(-1)[0] : '';
            postObj.projectName = data.project.label;
            postObj.name = 'property'
            postObj.typeId = data.unitDefault.propertyId;
            postObj.localityId = data.locality.id;
            postObj.locality = data.localityName;
            postObj.cityId = data.city.id;
            postObj.cityName = data.city.label;
        }

        return $http({
            url: apiUrl,
            method: 'POST',
            data: postObj
        }).then(function (response) {
            GetHttpService.commonResponse(response, '');
            if (response.status == 200 && response.data.statusCode == '2XX') {
                callback(response.data.data);
            } else {
                return null;
            }
        })
    };

    return {
        sellProperty : sellProperty,
        openSellForm : openSellForm
    };
}]);
