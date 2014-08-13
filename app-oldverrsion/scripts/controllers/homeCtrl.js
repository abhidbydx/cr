'use strict';
angular.module('serviceApp')
    .controller('homeCtrl', ['Constants', '$rootScope', '$scope', 'TestimonialService', 'homePageService', 'LeadService', 'GlobalService', 'CityService', 'SignupService', '$location',
        function(Constants, $rootScope, $scope, TestimonialService, homePageService, LeadService, GlobalService, CityService, SignupService, $location) {
            var city = GlobalService.getHomeCity();
            if (city && city.label)
                $rootScope.waitUpdateCity(city.label);
            $scope.videos = ["yV-nnWnC0HA", "7m4YUySzCTE", "L2E2zogDrH4", "itZRz_tNEhI", "gZSlNvOn9ig"];
            $scope.videoId = "yV-nnWnC0HA";
            $rootScope.loggedIn = GlobalService.isLoggedIn();
            $scope.placeholder = "Enter a locality, builder or project";
            $scope.mode = 'list';
            $scope.classidx = ['active', ''];
            $scope.upActive = "disable";
            $scope.dnActive = "";
            $scope.autoplay = false;
            $scope.cities = [];
            var xcities = [];
            $scope.toTopButtonHide = true;

            var leadData = {};
            leadData['EMAIL'] = $rootScope.userInfo.EMAIL ? $rootScope.userInfo.EMAIL : '';
            leadData['USERNAME'] = $rootScope.userInfo.USERNAME ? $rootScope.userInfo.USERNAME : '';
            leadData['CONTACT'] = $rootScope.userInfo.CONTACT ? $rootScope.userInfo.CONTACT : '';
            leadData.type = 'home-page';
            if (city && city.label)
                leadData.cityId = city.id;
            leadData.formlocationinfo = 'hidden-enquiry-mid';
            leadData.ui_php = 'index.php';
            $scope.testimonials = [];
            $scope.noOfAgents = '';
            $scope.noOfCustomers = '';
            $scope.worthOfProperties = '';
            var totalClicks = 0;
            var currentClick = 0;
            $scope.top = angular.element("#videolist").height();
            $rootScope.fullView = "fullMainContainer";
            //Set page name
            $rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.HOME;
            //Page view call for GA/MIXPANEL            
            $rootScope.TrackingService.pageViewedCall();

            CityService.getCitiesForHomePage().then(function(data) {
                var obj = {};
                for (var i = 0; i < 5; i++) {
                    obj['img'] = data.data[i].label.toLowerCase() + ".jpg";
                    obj['city'] = data.data[i].label;
                    obj['btntxt'] = "View Projects";
                    obj['hrf'] = data.data[i].label.toLowerCase() + "-real-estate";
                    obj['alt'] = "Property in "+data.data[i].label;
                    $scope.cities.push(obj);
                    obj = {};
                }
                obj['img'] = "morecities.jpg";
                obj['city'] = "more cities";
                obj['btntxt'] = "View More";
                obj['hrf'] = "";
                obj['alt'] = "";
                $scope.cities.push(obj);
                for (var i = 6; i < 12; i++) {
                    obj = {};
                    obj['img'] = data.data[i].label.toLowerCase() + ".jpg";
                    obj['city'] = data.data[i].label;
                    obj['btntxt'] = "View Projects";
                    obj['hrf'] = data.data[i].label.toLowerCase() + "-real-estate";
                    obj['alt'] = "Property in "+data.data[i].label;
                    xcities.push(obj);
                }
            });

            $scope.openLeadForm = function($event) {
                var newLeadData = _.clone(leadData);
                $event.stopPropagation();
                LeadService.openLeadForm(newLeadData, true);
            };

            var getTestimonials = function() {
                if (!$scope.loadTestimonials) {
                    $scope.loadTestimonials = true;
                    TestimonialService.getTestimonials().then(function(data) {
                        $scope.testimonials = data;
                    });
                }
            }

            homePageService.getHomePageDetail().then(function(data) {
                $scope.noOfAgents = data.noOfAgents;
                $scope.noOfCustomers = data.noOfCustomers;
                $scope.worthOfProperties = data.worthOfProperties;
                $scope.properties = data.noOfProperties;
            });

            $scope.changeMode = function(idx) {
                $scope.validateInputClass = "";
                if ($scope.currentidx !== idx) {
                    $scope.currentidx = idx;
                    $scope.classidx[$scope.currentidx] = 'active';
                    $scope.classidx[1 - $scope.currentidx] = '';
                    if (idx == 0) {
                        $scope.mode = 'list';
                        $scope.placeholder = "Enter a locality, builder or project";
                    } else {
                        $scope.mode = 'map';
                        $scope.placeholder = "Enter a locality or project";
                    }
                    //GA tracker
                    $scope.tracking('search','clicked', $scope.mode);                    
                }
            }

            $scope.changeVideo = function(idx) {
                $scope.videoId = idx;
                $scope.autoplay = true;
            }

            $scope.down = function() {
                totalClicks = Math.floor(angular.element("#videoThumb").height() / angular.element("#videolist").height());
                if (currentClick < totalClicks) {
                    currentClick = currentClick + 1;
                    angular.element(".scrollThumb").animate({
                        top: "-" + currentClick * angular.element("#videolist").height() + "px"
                    }, 800);
                }
                if (currentClick == totalClicks) {
                    $scope.upActive = "";
                    $scope.dnActive = "disable";
                } else {
                    $scope.upActive = "";
                }
            }

            $scope.up = function() {
                totalClicks = Math.floor(angular.element("#videoThumb").height() / angular.element("#videolist").height());
                if (currentClick != 0 && totalClicks > 0) {
                    currentClick = currentClick - 1;
                    angular.element(".scrollThumb").animate({
                        top: "-" + currentClick * angular.element("#videolist").height() + "px"
                    }, 800);
                }
                if (currentClick == 0) {
                    $scope.upActive = "disable";
                    $scope.dnActive = "";
                } else {
                    $scope.dnActive = "";
                }
            }
            $scope.prevslide = function() {
                angular.element('#testimonials-carousal').carousel('prev');
            }
            $scope.nextslide = function() {
                angular.element('#testimonials-carousal').carousel('next');
            }
            $scope.pp_prevslide = function() {
                angular.element('#product-portfolio-carousal').carousel('prev');
            }
            $scope.pp_nextslide = function() {
                angular.element('#product-portfolio-carousal').carousel('next');
            }
            $scope.moreCities = function(idx) {
                if (idx == 5 && ($scope.cities[idx].city == "more cities")) {
					 $scope.cities[idx].img = "chennai.jpg"
                    $scope.cities[idx].city = "Chennai";
                    $scope.cities[idx].hrf = "chennai-real-estate";
                    $scope.cities[idx].btntxt = "View Projects";
                    $scope.cities[idx].alt = "Property in Chennai";
                    $scope.cities = $scope.cities.concat(xcities)
                    $scope.tracking('changeCity','clicked', 'moreCities');                    
                } else {
                    $scope.tracking('changeCity','changed', $scope.cities[idx].city+'-exploreBox');                    
                    $location.path($scope.cities[idx].hrf);
                }
            }
            $scope.tracking = function (category, action, label){                
                $scope.TrackingService.sendGAEvent(category, action, label+'-'+$rootScope.CURRENT_ACTIVE_PAGE);
            }

            $scope.postLoad = false;
            $scope.loadComparison = false;
            $scope.loadRealStateGuide = false;
            $scope.loadMapVideo = false;
            $scope.loadFoldThree = false;
            $scope.loadFoldFour = false;
            $scope.loadFoldFive = false;
            $scope.loadFoldSix = false;
            $scope.loadFoldSeven = false;
            $scope.$watch("urlData", function(newVal) {
                if (newVal) {
                    $scope.loadTestimonials = false;
                }
            });
            $scope.$on("scrolled", function(evt, data) {
                if (data) {
                    var yoffset = parseInt(data.yoffset);
                    if (yoffset >= 100) {
                        $scope.$apply(function() {
                            scrolled();
                        });
                    } else {
                        unscrolled();
                    }
                    if (yoffset >= 120) {
                        if (!$scope.loadTestimonials) {                            
                            $scope.$apply(function() {
                                getTestimonials();
                            });

                        }
                    }
                    if (yoffset >= 550) {
                        if (!$scope.loadRealStateGuide) {
                            $scope.tracking('scroll','scrolled', 'fold-'+1);
                            $scope.$apply(function() {
                                $scope.loadRealStateGuide = true;
                            });
                        }
                    }
                    if (yoffset >= 1000) {
                        if (!$scope.loadMapVideo) {
                            $scope.tracking('scroll','scrolled', 'fold-'+2);
                            $scope.$apply(function() {
                                $scope.loadMapVideo = true;
                            });
                        }
                    }
                    if (yoffset >= 1500) {
                        if (!$scope.loadFoldThree) {
                            $scope.tracking('scroll','scrolled', 'fold-'+3);
                            $scope.$apply(function() {
                                $scope.loadFoldThree = true;
                            });
                        }
                    }
                    if (yoffset >= 2000) {
                        if (!$scope.loadFoldFour) {
                            $scope.tracking('scroll','scrolled', 'fold-'+4);
                            $scope.$apply(function() {
                                $scope.loadFoldFour = true;
                            });
                        }
                    }
                    if (yoffset >= 2500) {
                        if (!$scope.loadFoldFive) {
                            $scope.tracking('scroll','scrolled', 'fold-'+5);
                            $scope.$apply(function() {
                                $scope.loadFoldFive = true;
                            });
                        }
                    }
                    if (yoffset >= 3000) {
                        if (!$scope.loadFoldSix) {
                            $scope.tracking('scroll','scrolled', 'fold-'+6);
                            $scope.$apply(function() {
                                $scope.loadFoldSix = true;
                            });
                        }
                    }
                    if (yoffset >= 3800) {
                        if (!$scope.loadFoldSeven) {
                            $scope.tracking('scroll','scrolled', 'fold-'+7);
                            $scope.$apply(function() {
                                $scope.loadFoldSeven = true;
                            });
                        }
                    }
                    
                }
            });

            var scrolled = function() {
                $scope.loadComparison = true;
                $scope.postLoad = true;
            };

            var unscrolled = function() {
                $scope.loadComparison = false;
            };

            $scope.showSkyScrapper = function() {
                $scope.tracking('scroll','clicked', 'arrow');
                angular.element('html,body').animate({
                    scrollTop: 600,
                    duration: 1000
                });
            }
            $scope.$on('scrolled', function(evt, data){
                if (data && data.yoffset)
                    if (data.yoffset > 800 && data.yoffset < ($(document).height() - $('body').height() - 100)) {
                        $scope.$apply($scope.toTopButtonHide = false);
                        $scope.$apply($scope.pageEnd = false);
                    } else if (data.yoffset < 800) {
                        $scope.$apply($scope.toTopButtonHide = true);
                    } else if (data.yoffset >= ($(document).height() - $('body').height() - 100)) {
                        $scope.$apply($scope.pageEnd = true);
                    } else {
                        $scope.$apply($scope.pageEnd = false);
                    }
            });

            $scope.scrollToTop = function() {
                $('html, body').animate({
                    scrollTop: 0
                }, 1000);
            };

            $scope.openSignIn = function(redUrl) {
                $scope.tracking('myPortfolio', 'clicked', 'portfolioSignInButton');
                if (!$rootScope.loggedIn) {
                    window.location.href = "/property-portfolio-tracker.php";
                } else {
                    $location.path(redUrl);
                }
            };
        }
    ]);
