/**
 * Name: ptHeader Directive
 * Description: pt-header is common header of the application 
 *
 * @author: [Nakul Moudgil]
 * Date: Sep 24, 2013
 **/
'use strict';

angular.module('serviceApp').directive('ptHeader',['ENV', function(ENV) {
    return {
        restrict : 'EA',
        replace : true,  
        templateUrl : 'views/directives/common/pt-header.html',
        controller: function($scope, $location, $cookies, $rootScope, GlobalService, CityService, GAService, UserService, SignupService, $window, FilterService, SellFormService, BuylinkService) {
        CityService.getMainCities().then( function( data ) {
            $scope.cityList = data.data;
        });

        $scope.buylinks = BuylinkService.getBuyLinks({});
        $scope.buyEntity = BuylinkService.getEntity({});
        $scope.curPath = BuylinkService.getBaseUrl({});
        $rootScope.cityChangeForFilter = -1;       //  first time
        $scope.$watch( 'urlData' , function (n) {
            if (n) {     
                $scope.buylinks = BuylinkService.getBuyLinks($scope.urlData);
                $scope.buyEntity = BuylinkService.getEntity($scope.urlData);
                $scope.curPath = BuylinkService.getBaseUrl($scope.urlData);
            }
        });

        $scope.$watch( 'CURRENT_ACTIVE_PAGE' , function (newVal) {
                if($location.path().indexOf('maps') !== -1) {
                    $rootScope.linkType='maps/';
                }else{
                    $rootScope.linkType='';
                } 
                $scope.buylinks = BuylinkService.getBuyLinks($scope.urlData);
                $scope.buyEntity = BuylinkService.getEntity($scope.urlData);
                $scope.curPath = BuylinkService.getBaseUrl($scope.urlData);  
        });
        $scope.sellProperty = SellFormService.openSellForm;
            $rootScope.loggedIn = GlobalService.isLoggedIn();   //  returns true/false

            $scope.$watch('labels', function(newVal){
                if(newVal){
                    var phones = $scope.labels.common.phone;
                    $scope.headerPhone = [];
                    $scope.defHeaderPhone = {};
                    $.each(phones, function(index, attr){
                        var __ph = {
                            'name': index,
                            'number': attr,
                            'class': 'icons-'+index.toLowerCase()+'-icon'
                        };
                        if ( index == 'IND' ) {
                            $scope.defHeaderPhone = __ph;
                            $scope.phoneChecked = __ph.name;
                        }
                        $scope.headerPhone.push( __ph );
                    });
                    $scope.$watch(function () { return $location.path();}, function (n, o) {
                        if (n) {
                            if (n === "/") {
                                $scope.headerPhone[0].number = $rootScope.labels.homepage.phone.IND;
                            }
                            else {
                                $scope.headerPhone[0].number = $rootScope.labels.common.phone.IND;
                            }
                        }
                    });
                    var defaultCity = GlobalService.getHomeCity();
                    if ( defaultCity && defaultCity.label ) {
                        $scope.defaultCity = defaultCity.label;
                    }
                    else {
                        $scope.defaultCity = 'Gurgaon';
                    }
                }
            });

            $scope.$watch( function() {
                return $cookies.PT_USER_INFO;
            },  function( nUser ) {
                    var userInfo = UserService.getUserCookie( nUser );
                    $rootScope.loggedIn = GlobalService.isLoggedIn();   //  returns true/false
                    $rootScope.userInfo = userInfo;
                    var enquiry_info = ( $cookies.enquiry_info ) ? JSON.parse( GlobalService.getCookie( 'enquiry_info' ) ) : {};
                    if ( userInfo.USERNAME ) {
                        userInfo.USERNAME = userInfo.USERNAME.trim();
                        enquiry_info.name = userInfo.USERNAME;
                        var spacePos = userInfo.USERNAME.indexOf( ' ' );
                        if ( spacePos && spacePos !== -1 ) {
                            $scope.nameToShow = userInfo.USERNAME.substring( 0, spacePos );
                        }
                        else {
                            $scope.nameToShow = userInfo.USERNAME;
                        }
                    }
                    if ( userInfo.EMAIL ) {
                        enquiry_info.email = userInfo.EMAIL;
                    }
                    if ( userInfo.PHONE ) {
                        enquiry_info.phone = userInfo.PHONE;
                    }
                    if ( userInfo.COUNTRY ) {
                        enquiry_info.country = userInfo.COUNTRY;
                    }
                    GlobalService.setCookie( 'enquiry_info', JSON.stringify( enquiry_info ) );
                }
            );

            $scope.updateHeaderPhone = function( __ph ) {
                $scope.phoneChecked = __ph.name;
                $scope.defHeaderPhone = __ph; 
				//Send GA/Mixpanel tracker event request on selecting/changing City
				var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
				var phoneObj = {};   
				var subLabel = __ph.name+"-"+pageType;  
				phoneObj['Country'] = __ph.name;
				phoneObj['Page Name'] = pageType;
				 
				//GA tracker
				$scope.TrackingService.sendGAEvent('phoneNumber', 'selected', subLabel);
				//mixpanel tracker
				$scope.TrackingService.mixPanelTracking('Changed Phone Number', phoneObj); 
				//End Ga/mixpanel   
                
            };

            $scope.cityChanged = function( cityLabel, cityId) {
                var url = cityLabel.toLowerCase()+"-real-estate", cityObj = {}, pageType = $rootScope.CURRENT_ACTIVE_PAGE, subLabel = cityLabel+"-"+pageType;
                if($location.path().indexOf('maps') !== -1) {
                    url = "/maps/"+url;
                }
                $location.path(url).search({});
                //Send GA/Mixpanel tracker event request on selecting/changing City
				cityObj['Çity ID'] = cityId;
				cityObj['Çity Name'] = cityLabel
				cityObj['Page Name'] = pageType;				 
				//GA tracker
				$scope.TrackingService.sendGAEvent('changeCity', 'changed', subLabel); 	 
				//mixpanel tracker
				$scope.TrackingService.mixPanelTracking('Header Dropdown', cityObj); 
				//End Ga/mixpanel   
            };

            var waitUpdateCity = function(cityLabel, callback, args){
                var city;
                if($rootScope.cityList){
                    city = updateCity(cityLabel, $rootScope.cityList);
                    if (callback) {
                        if(args){
                            callback(args);
                        }
                        else{
                            callback(city);    
                        }
                    }
                }
                else{
                    $scope.$watch('cityList', function(newCities){
                        if(newCities){
                            city = updateCity(cityLabel, $rootScope.cityList);

                            if (callback && city) {
                                if(args){
                                    callback(args);
                                }
                                else{
                                    callback(city);
                                }
                            }
                        }
                    });
                }
            };

            var updateCity = function(cityLabel, newCities){
                var selCity, statsQuery;
                if(cityLabel){
                    selCity = _.find(newCities, function(city){
                        return city.label.toLowerCase() == cityLabel.toLowerCase();
                    });
                    var displaycities = [];
                    angular.forEach($scope.cityList, function(value, key){
                        if(value.displayPriority < 3){
                             displaycities.push(value.label);
                        }
                    });
                    if(selCity && (displaycities.indexOf(selCity.label) > -1)){    
                        $scope.cityToShow = selCity.label;
                        $rootScope.selectedCity = selCity;
                        GlobalService.setHomeCity(selCity.id, selCity.label);
                    } else {
                        if(selCity){
                            GlobalService.setHomeCity(selCity.id, selCity.label);
                        }
                        $rootScope.selectedCity = undefined;
                        $scope.cityToShow = false;
                    }
                }
                else {
                    $scope.cityToShow = false;
                }
                return selCity;
            };

            $scope.$watch("PARSED_URL_DATA", function(urlData, oldData){
                if(urlData && urlData.TYPE ){
                    if(!$rootScope.selectedCity || ($rootScope.selectedCity && urlData.SEARCH_OBJ.cityId && $rootScope.selectedCity.id != urlData.SEARCH_OBJ.cityId)) {
                        $rootScope.waitUpdateCity(urlData.SEARCH_OBJ.city);    
                    }
                }
            });

            $scope.$on( 'citychanged', function( evt, cityLabel ) {
                if ( cityLabel ) {
                    $scope.cityChanged( cityLabel );
                }
                else {
                    $scope.cityToShow = false;
                }
            });

            $rootScope.waitUpdateCity = waitUpdateCity;
            
            $scope.openSignIn = function( redUrl ) {
                SignupService.openSignUp( redUrl );
            };

            $scope.logout = function() {
                //  $location not nowing here !
                $window.location.replace('/forum/logout.php');
            };
            
            $scope.headerTracking = function(cat, action, value, mixpanelEvent){
				var pageType = $rootScope.CURRENT_ACTIVE_PAGE, subLabel;
				//Send GA/Mixpanel tracker event request when other links clicked
				if(mixpanelEvent){
					$scope.TrackingService.mixPanelTracking(mixpanelEvent, {'Page Name': pageType}); 
					subLabel = value+"-"+pageType;
				}else{
					$scope.TrackingService.mixPanelTracking('Header Clicked', {'Link Name':value ,'Page Name': pageType});
					subLabel = cat+'-'+value+"-"+pageType;
				}
				//End Ga/mixpanel

				//GA tracker
				$scope.TrackingService.sendGAEvent('header', action, subLabel); 	 
			}		
            $scope.sendGAEvent = GAService.sendGAEvent;

            $scope.$on('avatarColor', function (evt, data) {
                $scope.nameAvatarColor = data;
            });

            $scope.setBgColor = function () {
                $rootScope.$broadcast('setBgColor');
            };

            $scope.unSetBgColor = function () {
                $scope.nameAvatarColor = {};
                $rootScope.$broadcast('unSetBgColor');
            };
        }
    }
}]);  
