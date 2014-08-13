/**
  * Name: Overview
  * Description: This is controller for Overview pages.
  * @author: [Swapnil Vaibhav]
  * Date: Jan 02, 2014
***/
'use strict';
angular.module('serviceApp').controller( 'overviewCtrl', [ '$rootScope', '$scope', '$cookies', '$window', '$location', '$timeout', '$stateParams', '$modal', 'LocalityParser', 'Formatter', 'LeadService', 'CommonLocationService','LocalityService',
function( $rootScope, $scope, $cookies, $window, $location, $timeout, $stateParams, $modal, LocalityParser, Formatter, LeadService, CommonLocationService, LocalityService ) {
    $scope.isHeaderSmall = false;
    $scope.showTopReview = false;
    //Following piece of code is for redirecting user to Discussion
    if ($location.hash()) {
        $scope.loadLazy = true;     //  so that proper scrolling can be done
        var watcher = $scope.$watch(function () {
                var ele = angular.element("#" + $location.hash());
                if (ele && ele.offset() && ele.offset().top) {
                    return ele.offset().top;
                }
                return undefined;
            }, function (n, o) {
                if (n) {
                    $window.scrollTo($window.pageXOffset, n - 90);
                }
        });
        //This timer is for taking user to Discussion if he is coming from any other page and then off the timer
        $timeout(function () { watcher();}, 15000);
    }

    $scope.$on("scrolled", function (evt, data) {
        if (data) {
            var yoffset = data.yoffset;
            if (parseInt(yoffset) >= 100) {
                $scope.$apply(function(){
                    scrolled();
                    $scope.loadLazy = true;
                }); 
            }
            else{
                unscrolled(); 
            }
            if (parseInt(yoffset) >= 100) {
                $scope.$apply(function(){
                    setPosFixed();
                });
            }
            else{
                $scope.$apply(function(){
                    setPosAuto(); 
                });
            }
            if (yoffset >= ($(document).height() - ($('.searchBar').height() + $('.header').height() + $('.page-footer').height() + $('div[pt-leftwidgetcontainer]').height() + 250)))
            {
                $scope.$apply(function(){
                    setPosAuto();
                });
            }
        }
    });

    var scrolled = function(){
        $scope.isHeaderSmall = true;
        $scope.postLoad = true;
        $scope.navClass = 'navPosFixed';
    };

    var unscrolled = function(){
        $scope.isHeaderSmall = false;
        $scope.navClass = '';
    };

    var setPosFixed = function(){
        $scope.navClass = 'navPosFixed';
    };

    var setPosAuto = function(){
        $scope.navClass = '';
    };

    var leadObjects = {};
    
    $scope.$watch( 'urlData', function( newUrlParam, oldUrlParam ) {
        if ( newUrlParam ) {
            $scope.areaInfo = {
                id : null,
                type : null,
                data : null,
                url  : null,
                localityName : newUrlParam.locality,
                cityId : newUrlParam.cityId,
                cityName : newUrlParam.city
            };
            $scope.areaInfo.type = 'city';
            if ( newUrlParam.id !== 'undefined' ) {
                if ( newUrlParam.id > 50000 && newUrlParam.id < 100000 ) {
                    $scope.areaInfo.type = 'locality';
                    $scope.areaInfo.id = newUrlParam.localityId;
                    $rootScope.pageType = "locality";
                }
                else if ( newUrlParam.id > 10000 ) {
                    $scope.areaInfo.type = 'suburb';
                    $scope.areaInfo.id = newUrlParam.suburbId;
                    $rootScope.pageType = "suburb";
                }
                else {
                    $scope.areaInfo.id = newUrlParam.cityId;
                    $rootScope.pageType = "city";
                }

                var localityCard = function ( data ) {
                    $scope.areaInfo.url = data.url;
                    $scope.areaInfo.data = LocalityParser.getParsedAreaData( data, $scope.areaInfo.type );

                    //---- to do need to change the logic in locality parser ----
                    var key = "",existValue = [], lat_lon_obj = '';
                    if ( $scope.areaInfo.type === 'city' && data.centerLatitude && data.centerLongitude ) {
                        lat_lon_obj = {'lat':data.centerLatitude,'lng':data.centerLongitude};
                    }
                    else if ( $scope.areaInfo.type === 'locality' && data.latitude && data.longitude ) {
                        lat_lon_obj = {'lat':data.latitude,'lng':data.longitude};
                    }
                    if ( lat_lon_obj ) {
                        LocalityService.getNeighbourhood(lat_lon_obj,5,"",function(results){
                            if ( $scope.areaInfo.data.amenityTypeCount ) {
                                for(var i=0, len = $scope.areaInfo.data.amenityTypeCount.length; i<len; i++) {
                                    existValue[i] = angular.lowercase($scope.areaInfo.data.amenityTypeCount[i].name.replace(" ","_"));
                                    $scope.areaInfo.data.amenityTypeCount[i].count = 0;
                                }
                            }
                            for(var i=0, len = results.length; i<len; i++) {
                                if(existValue.indexOf(results[i].localityAmenityTypes.name) != -1){
                                    var key = existValue.indexOf(results[i].localityAmenityTypes.name);
                                      $scope.areaInfo.data.amenityTypeCount[key]['count'] += 1; 
                                  }
                            }
                        });
                    }
                    //-----------------------------------------------------------

                    if ( $scope.areaInfo.data.priceTrend ) {
                        $scope.areaInfo.data.priceTrend.pgType = 'overview';
                    }
                    $scope.overview = $scope.areaInfo.data;
                    $rootScope.cityInfo = {
                        id   : $scope.areaInfo.data.cityId,
                        name : $scope.areaInfo.data.cityName
                    };                    
                    makeBreadCrum( $scope.areaInfo.data );

                    var leadData = {
                        cityId      : $rootScope.cityInfo.id,
                        cityLabel   : $rootScope.cityInfo.name
                    };
                    if ( $scope.areaInfo.type === 'suburb' ) {
                        leadData.suburbId = $scope.areaInfo.data.locSubId;
                    }
                    else if ( $scope.areaInfo.type === 'locality' ) {
                        leadData.localityId = $scope.areaInfo.data.locSubId;
                    }
                    leadData.areaName = $scope.areaInfo.data.locSubName;
                    $scope.getLeadData = function (formName, formtype) {
                        if (!leadObjects[formName])
                            leadObjects[formName] = _.clone(leadData);
                        var newLeadData = leadObjects[formName];
                        newLeadData.formlocationinfo = formName;
                        newLeadData.type = formtype;
                        newLeadData.ui_php = 'overview.php';
                        return LeadService.updateLeadData (newLeadData);
                    };

                    $scope.openLeadForm = function( formLocation, type ) {
                        if ( formLocation ) {
                            leadData.formlocationinfo = formLocation;
                        }
                        if ( type ) {
                            leadData.type = type;
                        }
                        leadData.ui_php = 'overview.php';
                        LeadService.openLeadForm( leadData );
                    };
                };

                CommonLocationService.getBasicInfo( $scope.areaInfo.type, $scope.areaInfo.id, localityCard);
            }
            else {
                //  TODO : City Level Page
            }

         var makeBreadCrum = function( data ) {
                var bCrum = [],
                    __bCrum = {};
                __bCrum = {
                    text    : 'Home',
                    link    : '/',
                    target  : '_self'
                };
                
                bCrum.push( __bCrum );                 
                if ( data.locSubName ) {
                    __bCrum = {
                        text : data.locSubName +" "+data.cityName + " real estate",
                        //link : data.locSubUrl
                    };
                    bCrum.push( __bCrum );
                }else if(data.cityName){
                    __bCrum = {
                        text : data.cityName + " real estate",
                        //link : data.cityUrl
                    };
                    bCrum.push( __bCrum );
                }

                /*if ( newUrlParam.pageType ) {
                    var pSplit = newUrlParam.pageType.split('-');
                    if ( pSplit.length > 0 ) {
                        __bCrum = {
                            text : Formatter.ucword( pSplit.pop() )
                        };
                        bCrum.push( __bCrum );
                    }
                }*/
                $scope.bCrum = bCrum; 

                //  dummy values
                $scope.bCrumText = 'YOU ARE HERE';
                // $scope.lastUpdate = 'June 2013';
            };

            //$scope.getBlogData( 0, 10 );
        } 
            

        var nav = {
            'Overview': 'overview',
            'Real Estate Trends': 'ptrend',
            'Projects': 'projects'
        };
        if ( $scope.areaInfo && $scope.areaInfo.type === 'locality' ) {
            nav[ 'Rating' ] = 'rating';
        }
        nav[ 'Reviews' ] = 'review';
        nav[ 'Blog' ] = 'blog';
        nav[ 'News' ] = 'news';

        $scope.$on( 'delete_nav', function( evt, __type ) {
            delete nav[ __type ];
        });

        $scope.projectSectionsHash = nav;
        (function(){
            $rootScope.CURRENT_ACTIVE_PAGE = $scope.urlData.pageType;
            //set page name
            //-- page viewed call for overview page--
            var overObj = {};
            overObj['Page Name'] = $rootScope.CURRENT_ACTIVE_PAGE;
            overObj['Page URL'] = $location.absUrl();
            var label = ($rootScope.CURRENT_ACTIVE_PAGE == "locality-overview") ? "Locality" : "City";
            overObj[label+' ID'] = $scope.urlData.id;
            $rootScope.TrackingService.mixPanelTracking('Page Viewed', overObj);
            //When new content loaded execute GA event
            if($cookies.FORUM_USER_ID && typeof($cookies.FORUM_USER_ID) != 'undefined'){
                $window._gaq.push(["_setCustomVar", 2, "Member", $cookies.FORUM_USER_ID, 2]);
            }else{
                $window._gaq.push(["_setCustomVar", 2, "Visitor", $cookies.visitorID, 2]);
            }
            $window._gaq.push(['_setCustomVar', 1, 'expandedPageName', $rootScope.CURRENT_ACTIVE_PAGE.toUpperCase(), 3]);
            $window._gaq.push(['_trackPageview']);
            //End ga code*/

        })();
    }, true );

}]);
