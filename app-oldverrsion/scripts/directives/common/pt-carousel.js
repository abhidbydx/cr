/**
 * Name: ptMaincarousel Directive
 * Description: pt-maincarousel display images in a gallery 
 *
 * @author: [Nakul Moudgil]
 * Date: Dec 12, 2013
 **/
'use strict';
angular.module('serviceApp').directive('ptImagecarousel', ['$location', function($location) {
    return {
		restrict : 'A',
		scope : {
			images:'=',
			settings:'=',
			imagesfullview:'=',
			index:'=',
			focus:'@',
			unique: '='
		},
		templateUrl : 'views/directives/common/pt-carousel.html',
		link:function(scope, element){
		    	var addFocus = true;
			if(scope.focus){
				addFocus = scope.focus;
			}
			if ((addFocus == true) && ($location.hash() === "")) {
			    setTimeout(function(){
				$(element[0].children[0]).focus();	
			    },1000);					
			}
		},
		controller: function($scope, $rootScope, $element, $attrs, ProjectService, $timeout, FullScreenService, Constants) {
			var prevIndex, currentCarouselStep, noOfThumbs;
			var perfImage;
			var currentObject = null;
			var initialHeight, initialWidth;
			var bgprocess	= false; 

		    var initializeCarousel = function(){
		    $scope.totalImages = 0;
			$scope.carouselSteps = 0, currentCarouselStep = 0, noOfThumbs = 0; 
			$scope.carouselWidth = 0;
			$scope.carouselWidth = 0;			    
		    };	    

			$scope.options = {
				skin: '',
				width: 1150,
				height: 300,
				imageWidth: 320,
				imageHeight: 240,
				width100Proc: false,
				height100Proc: false,
				fadeSlides: true,
				responsive: true,				
				responsiveRelativeToBrowser: true,
				numberOfThumbsPerScreen: 0,
				showBottomNav: true,
				ptzoomControlVisible: false,
				thumbnailWidth : 60,
				thumbnailHeight : 40,
				thumbnailMargin : 5		
			};

			var initializeZoom = function(){
				var dimensions = getImageActualHeight();
				$scope.calHeight = dimensions.height;
				$scope.calWidth = dimensions.width;
				initialWidth = dimensions.width;
				initialHeight = dimensions.height;
				$scope.zoomLevel = 1;
				$scope.calLeft = 'inherit';
				$scope.calTop = 'inherit';
				$element.find('.image-info').css('top','inherit');
				$element.find('.image-info').css('left','inherit');
				$scope.isZoomIn = '';
				$scope.isZoomOut = 'disabled';
				$scope.isZoomReset = 'disabled';
			};

			//This function calculates the actual height width of Image
			var getImageActualHeight = function(){
				var r1, r2, ratio, actualHeight, actualWidth;
				var newHeight, newWidth;
				if(currentObject){
					r1 = parseInt(Constants.IMAGES.LARGE.width)/parseInt(currentObject.width);
					r2 = parseInt(Constants.IMAGES.LARGE.height)/parseInt(currentObject.height);
					ratio = (r1 < r2) ? r1 : r2;					
					actualHeight = currentObject.height * ratio;
					actualWidth = currentObject.width * ratio;
					//Calculating required height width according to container height width
					r1 = parseInt($scope.options.height)/parseInt(actualHeight);
					r2 = parseInt($scope.options.width)/parseInt(actualWidth);
					ratio = (r1 < r2) ? r1 : r2;					
					newHeight = actualHeight * ratio;
					newWidth = actualWidth * ratio;
				}
				var dimensions = {};
				if((actualHeight < newHeight) || (currentObject.height < newHeight) ){
					if(actualHeight > currentObject.height){
						dimensions.height = parseInt(currentObject.height);
					}
					else{
						dimensions.height = parseInt(actualHeight);
					}
				}
				else{					
					dimensions.height = parseInt(newHeight);
				}
				if((actualWidth < newWidth) || (currentObject.width < newWidth)){
					if(actualWidth > currentObject.width){
						dimensions.width = parseInt(currentObject.width);
					}
					else{
						dimensions.width = parseInt(actualWidth);
					}
				}
				else{
					dimensions.width = parseInt(newWidth);
				}
				
				return dimensions;
			}

			$scope.ZoomIn = function(){
				if($scope.zoomLevel < 4){
					$scope.zoomLevel++;
					calculateZoom();
					//GA/Mixpanel When user zoomin
					tracking('zoomInGallery', 'Gallery Photos Zoomed', true);//(label, mixpanelEvent, viewedFrom, location) 
				}
			};

			$scope.ZoomOut = function(){				
				if($scope.zoomLevel > 2){
					$scope.zoomLevel--;	
					calculateZoom();
				}
				else{
					initializeZoom();
				}
			}

			var calculateZoom = function(){
				var width, height, left, top;
				width =  Math.round((initialWidth) * $scope.zoomLevel * 0.55); 
				height = Math.round((initialHeight) * $scope.zoomLevel * 0.55); 
				if($scope.calLeft == 'inherit'){
					left = ($scope.calWidth - (width  / 2));
					top  = ($scope.calHeight - (height / 2));
				}
				else{
					var ratio = (width / $scope.calWidth);
					var div_half_width = $scope.calWidth/2;
					var div_half_height = $scope.calHeight/2;
					left = (div_half_width - (div_half_width * ratio));
					top  = (div_half_height - (div_half_height * ratio));
				}
				$scope.calWidth = width;
				$scope.calHeight = height;
				$scope.calLeft = left + 'px';
				$scope.calTop = top + 'px';				
				if($scope.zoomLevel > 0){
					$scope.isZoomOut = '';
					$scope.isZoomReset = '';
				}
				if($scope.zoomLevel > 3){
					$scope.isZoomIn = 'disabled';					
				}
				else if ($scope.zoomLevel <= 0){
					$scope.isZoomIn = '';
					$scope.isZoomOut = 'disabled';
					$scope.isZoomReset = 'disabled';
				}
			}


			$scope.ZoomReset = function(){
				initializeZoom();
				//GA/Mixpanel When user zoom reset
				tracking('resetGallery', 'Gallery Zoom Reset', true);//(label, mixpanelEvent, viewedFrom, location) 
			}

			//This method is called when user selects right arrow
			$scope.Next = function(){ 
				prevIndex = $scope.currentIndex;
				if($scope.currentIndex < $scope.totalImages-1){
					$scope.currentIndex++;
				}
				else{
					$scope.currentIndex = 0;
				}				
				setCurrentCarouselStep();
				if($scope.ptslides[$scope.currentIndex]){
					setCurrentObject($scope.ptslides[$scope.currentIndex], 1);
				}
				if($scope.ptslides[prevIndex]){
					makeDefaultObject($scope.ptslides[prevIndex]);
				}
				publishImageChange();   
				//GA/Mixpanel When user view photo
				if($scope.isloadervisible){
					tracking('photoViewed', 'Project Photos Viewed', true);//(label, mixpanelEvent, viewedFrom, location) 
				}
			}

			//This method is called when user clicks on left arrow
			$scope.Previous = function(){
				prevIndex = $scope.currentIndex;
				if($scope.currentIndex > 0){
					$scope.currentIndex--;
				}
				else{
					$scope.currentIndex = $scope.totalImages-1;
				}				
				setCurrentCarouselStep();
				if($scope.ptslides[$scope.currentIndex]){
					setCurrentObject($scope.ptslides[$scope.currentIndex], -1);
				}
				if($scope.ptslides[prevIndex]){
					makeDefaultObject($scope.ptslides[prevIndex]);
		        }
		        publishImageChange();
		        //GA/Mixpanel When user view photo
		        if($scope.isloadervisible){
					tracking('photoViewed', 'Project Photos Viewed', true);//(label, mixpanelEvent, viewedFrom, location) 
				}
			}

			var publishImageChange = function(){
				if($scope.options.height100Proc){
	            	$rootScope.$broadcast('imageChange', {'id': $scope.unique, 'index': $scope.currentIndex});
	            }
	            if(!currentObject.video){
	            	$scope.isloadervisible = true;
	            }else{
	            	$scope.isloadervisible = false;
	            }
			}

			$scope.$on('imageChange', function(evt, attrs){
				bgprocess = true; 
				if(attrs.id == $scope.unique){
	    			$scope.SetImage(attrs.index);
	    		}
	    	});

			//This method is called when user selects image from thumbnail bar
			$scope.SetImage = function(index, delay){				
				if($scope.currentIndex != index){
					var direction;
					if(index > $scope.currentIndex){
						direction = 1;
					}
					else{
						direction = -1;
					}
					prevIndex = $scope.currentIndex;
					if(index >= 0 && index < $scope.totalImages){
						$scope.currentIndex = index;
						setCurrentCarouselStep(delay);
					}
					if($scope.ptslides[$scope.currentIndex]){						
						setCurrentObject($scope.ptslides[$scope.currentIndex], direction);
					}
					if($scope.ptslides[prevIndex]){
						makeDefaultObject($scope.ptslides[prevIndex]);
			        }
			       
			        publishImageChange();
			        //GA/MIXPANE If click on photo only			         
			        if($scope.isloadervisible){
						tracking('photoViewed', 'Project Photos Viewed', true, 'Carousel');//(label, mixpanelEvent, viewedFrom, location)
					}
				}
			}

			$scope.keypress = function(event){
				if(event.which === 37) {
	                $scope.Previous()
	                event.preventDefault();
            	}
            	else if(event.which === 39) {
	                $scope.Next();
	                event.preventDefault();
	            } 
			}


			//It activates the image once it is selected
			var setCurrentObject = function(currentObj, direction){
                            if (currentObj) {
				currentObject = currentObj;
				currentObj.visible = true;
				currentObj.thumbClass = 'thumbsHolder_ThumbOFF thumbsHolder_ThumbON';
				currentObj.imageClass = 'currentImage';
				if(direction == -1){					
					currentObject.slideClass = 'carouselSlideInLeft';
				}
				else{
					currentObject.slideClass = 'carouselSlideInRight';
				}
                            }
				//set bucket
				$.each($scope.buckets, function(item, attr){
					if($scope.currentIndex >= attr.minRange && $scope.currentIndex <= attr.maxRange){
						attr['class'] = 'selected';
						$scope.type = attr.name;//Get selected bucket name						
					}
					else{
						attr['class'] = '';
					}
				});
				initializeZoom();				
			}

			// It inactivates the image once it is unselected

			var makeDefaultObject = function(currentObj){
				for(var index = 0; index < $scope.ptslides.length; index++){
					if(index != $scope.currentIndex){
						$scope.ptslides[index].visible = false; 
						$scope.ptslides[index].thumbClass = 'thumbsHolder_ThumbOFF';
						$scope.ptslides[index].imageClass = '';
					}
				}
			}

			//Calculates the thumbnail step for scrolling the bar
			var setCurrentCarouselStep = function(delay){
				if($scope.currentIndex >= (currentCarouselStep * noOfThumbs)){
					currentCarouselStep = currentCarouselStep + 1;
					setCurrentCarouselStep();
					if(delay){
						$timeout(function(){
							scrollThumbnails();
						},1500);
					}
					else{
						scrollThumbnails();
					}					
				}
				else if($scope.currentIndex < (currentCarouselStep * noOfThumbs - noOfThumbs)){
					currentCarouselStep = currentCarouselStep - 1;
					setCurrentCarouselStep();
					if(delay){
						$timeout(function(){
							scrollThumbnails();
						},1500);
					}
					else{
						scrollThumbnails();
					}
				}
			}


		    $scope.scrollThumbnailsLeft = function(){		    	
		    	if(currentCarouselStep >= $scope.carouselSteps){
		    		//$scope.rightScrollClass = 'carouselRightNavDisabled';//disable right arrows
		    	}
		    	else{
		    		currentCarouselStep = currentCarouselStep + 1;
		    		scrollThumbnails();		    		
		    	}
		    }

		    $scope.scrollThumbnailsRight = function(){
		    	if(currentCarouselStep <= 1){
		    		//$scope.leftScrollClass = 'carouselLeftNavDisabled';//disable left arrows
		    	}
		    	else{
		    		currentCarouselStep = currentCarouselStep - 1;
			    	scrollThumbnails();			    		
		    	}
		    }

			//Scrolls thumbnail bar according to selection
		    var scrollThumbnails = function(){      
		      	var moveLeft = (-1) * ($scope.carouselVisibleWidth * (currentCarouselStep - 1));
		        var cssunit = 'px';
		        var lpx = moveLeft + cssunit;
		        $($element).find('.carouselIndicators').animate({
		            left: lpx
		        }, 800);
	    		$scope.rightScrollClass = '';
	    		$scope.leftScrollClass = '';
		        if(currentCarouselStep <= 1){
		    		$scope.leftScrollClass = 'carouselLeftNavDisabled';//disable left arrows
		    	}
		    	else if(currentCarouselStep >= $scope.carouselSteps){
		    		$scope.rightScrollClass = 'carouselRightNavDisabled';//disable right arrows
		    	}
		    }

			//Scrolls thumbnail bar according to selection
		    var defaultScrollThumbnails = function(){      
		      	var cssunit = 'px';
		        var lpx = 0 + cssunit;
		        
		      	$($element).find('.carouselIndicators').animate({
		            left: lpx
		        }, 800);
		    }		    

		    //Calculate thumbnail bar width and number of thumbnails which helps in scrolling the bar
		    var arrangeThumbs = function(){
		    	var stepsInt, stepsFloat;
		    	noOfThumbs = parseInt($scope.options.width/($scope.options.thumbnailWidth + $scope.options.thumbnailMargin));
		    	$scope.carouselSteps = $scope.totalImages/noOfThumbs;
		    	stepsFloat = $scope.totalImages/noOfThumbs;
		    	stepsInt = parseInt(stepsFloat);
		    	if(stepsFloat > stepsInt){
		    		stepsInt = stepsInt + 1;
		    	}
		    	$scope.carouselSteps = stepsInt;
		    	$scope.carouselWidth = $scope.totalImages * ($scope.options.thumbnailWidth + 2*$scope.options.thumbnailMargin);
		    	$scope.carouselVisibleWidth = noOfThumbs * ($scope.options.thumbnailWidth + $scope.options.thumbnailMargin) + $scope.options.thumbnailMargin;
		    }

		    var createBuckets = function(){
		    	$scope.buckets = [];
		    	var i, median = 0;
		    	for(i = 0; i < $scope.currentImageObject.length; i++){
        	    	$scope.buckets[i] = {};
        	    	$scope.buckets[i]['name'] = $scope.currentImageObject[i].index;
        	    	$scope.buckets[i].minRange = median;
        	    	$scope.buckets[i]['class'] = '';
        	    	median = median + $scope.currentImageObject[i].data.length;
        	    	$scope.buckets[i].maxRange = median -1;        	    	
        	    };
		    }

		    $scope.expand = function(){		    	
				var modalInstance = FullScreenService.openGallery($scope.images, $scope.currentIndex, $scope.unique)
					//GA/Mixpanel When user opens the gallery Window  
					tracking('openGallery', 'Gallery Open');	
			        modalInstance.result.then(function (index) {
				       $($element[0].children[0]).focus();				      
				    }, function () {
				       $($element[0].children[0]).focus();	
			    	}
			    );
		    };

		    $scope.closeFullView = function(){
		    	if($scope.height100Proc){
		    		$scope.collapse();
		    	}
		    }
		  
		    if($scope.options.height100Proc){
		     $(window).bind("resize", function(){//Adjusts image when browser resized
			 	$scope.$apply(function() {
			 		setCarousel();
			 	});
			 });
		 	}

		    var setCarousel = function(){
		    	initializeCarousel();
				createBuckets();
				
        	    if($scope.settings){
			        $scope.options = $.extend($scope.options, $scope.settings);
				}
				if ($scope.options.responsiveRelativeToBrowser) {
						var responsiveWidth=$(window).width();
						var responsiveHeight=$(window).height();
				}
				if ($scope.options.width100Proc){
					$scope.options.width = responsiveWidth;	
				} 
				if ($scope.options.height100Proc) {
					$scope.options.height = responsiveHeight - $scope.options.thumbnailHeight - 40;
					$scope.options.divHeight = responsiveHeight - $scope.options.thumbnailHeight - 40;
				}
				else{
					$scope.options.divHeight = $scope.calHeight + 10;
				}
				if($scope.calWidth == 'inherit'){
				$scope.options.divWidth = $scope.width + 10;	
				}
				$scope.options.divWidth = $scope.calWidth + 10;
            	//initializeZoom();
            	prevIndex = 0;
            	currentCarouselStep = 1;
            	$scope.leftScrollClass = 'carouselLeftNavDisabled';
            	$scope.totalImages = $scope.ptslides.length;
            	setCurrentObject($scope.ptslides[$scope.currentIndex]);
            	arrangeThumbs();
            	makeDefaultObject();
            	if($scope.index && $scope.index > 0){
            		//$timeout(function() {
            			$scope.SetImage($scope.index, true);
            		//}, 2000);
            		
            	}
		    }

            $scope.imageLoaded = function() { 
                $scope.isloadervisible = false; 
            };
            //GA/Mixpanel tracking function for gallery events
            var tracking = function(label, mixpanelEvent, viewedFrom, location){
				var sublabel, pageType = $rootScope.CURRENT_ACTIVE_PAGE, galleryObj = {};
				//If image viewed from Next/Previous button
				if(typeof location === "undefined"){ 				
					location = ($scope.options.height100Proc == true) ? 'Gallery' : 'Project';
				}else{//If image viewed from Carousel
					location = ($scope.options.height100Proc == true) ? 'Gallery Carousel' : 'Project Carousel';
				} 						 
				if(viewedFrom){
					galleryObj['Photo Name']		= $scope.type+'-'+$scope.ptslides[$scope.currentIndex].text;
					galleryObj['Photo Viewed From'] = location;			
					sublabel = label+'-'+$scope.type+'-'+location+'-'+pageType;					
				}else{
					sublabel = label+'-'+pageType;
				}				
				galleryObj['Project ID']		= $scope.ptslides[$scope.currentIndex].objectId;
				galleryObj['Page Name']			= pageType;
				if( (bgprocess && $scope.options.height100Proc) || (bgprocess == false && $scope.options.height100Proc == false) ){
					$rootScope.TrackingService.sendGAEvent('gallery', 'clicked', sublabel); 
					$rootScope.TrackingService.mixPanelTracking(mixpanelEvent, galleryObj);	
					bgprocess = false;
				}			
			} 

			$scope.$watch('images', function(newVal, oldVal){
				$scope.isloadervisible = true;
				if(newVal) {
					$scope.instanceData = angular.copy(newVal);
					perfImage = [];
				    var parsedVal = $scope.instanceData;
				    if ( parsedVal.length > 0 ) {
						$scope.currentImageObject = parsedVal;
						$.each($scope.currentImageObject, function(item, attr){
		        	    	$.each(attr.data, function(i,a){
		        	    		perfImage.push(a);
		        	    	});
		        	    });
		        	    $scope.ptslides = perfImage;
		            	$scope.totalImages = perfImage.length;
		            	$scope.currentIndex = 0;
		            	prevIndex = 0,            	
		            	setCarousel();		            	
		            }
				    else {
						$scope.ptslides = [];
						$scope.showImage = false;
						$scope.noImage = true;
						$scope.noImageText = 'No Images for this project !';
				    }
				}
				else{
		    	    $scope.ptslides = [];
		            $scope.showImage = false;
		            $scope.noImage = true;
				}
	        });
		}
	}
}]);


angular.module('serviceApp').directive(
            "bnLoad",
            function() {
 
                // I bind the DOM events to the scope.
                function link( $scope, element, attributes ) { 
                    // I evaluate the expression in the currently
                    // executing $digest - as such, there is no need
                    // to call $apply().
                    function handleLoadSync() { 
                        $scope.$eval( attributes.bnLoad ); 
                    } 
 
                    // I evaluate the expression and trigger a
                    // subsequent $digest in order to let AngularJS
                    // know that a change has taken place.
                    function handleLoadAsync() { 
                        $scope.$apply(
                            function() { 
                                handleLoadSync(); 
                            }
                        ); 
                    }
 
  
                    // Check to see if the image has already loaded.
                    // If the image was pulled out of the browser
                    // cache; or, it was loaded as a Data URI,
                    // then there will be no delay before complete.
                    if ( element[ 0 ].src && element[ 0 ].complete ) { 
                        handleLoadSync(); 
                    // The image will be loaded at some point in the
                    // future (ie. asynchronous to link function).
                    } else { 
                        element.on( "load.bnLoad", handleLoadAsync ); 
                    }
 
 
                    // When the scope is destroyed, clean up.
                    $scope.$on(
                        "$destroy",
                        function() { 
                            element.off( "load.bnLoad" ); 
                        }
                    );
 
                }
 
                // Return the directive configuration.
                return({
                    link: link,
                    restrict: "A"
                }); 
            }
        );
