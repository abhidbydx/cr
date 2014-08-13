/**
  * Name: City Blog Directive
  * Description: City blog widgit.
  * @author: [Swapnil Vaibhav]
  * Date: Jan 03, 2014
***/
'use strict';
angular.module('serviceApp').directive('ptBlog', function() {
    return {
        restrict : 'A',
        scope : {
            count : '=',
            card  : '=',
            news  : '=',
            cityid: '=',
            cityname: '='
        },
        templateUrl : 'views/directives/common/pt-blog.html',
        controller : function( $scope, $rootScope, CityService, Formatter ) {
            $scope.cityName = Formatter.ucword( $scope.cityname );
            var bCounter = $scope.count ? $scope.count : 3;
            var news = $scope.news ? 1 : 0;
            if ( $scope.news === 1 ) {
                $scope.type = 'news';
                $scope.title = 'News';
            }
            else {
                $scope.type = 'blog';
                $scope.title = 'Blog';
            }


            CityService.getBlogOrNews( $scope.cityid, 0, bCounter, news ).then( function( blogData ) {
                if ( blogData.statusCode === '2XX' ) {	
                    var __tmp = [], counter = 0;
                    $.each( blogData.data, function( cnt, __data ) {
                        counter++;
                        if ( counter <= bCounter ) {
                            __data.postDate = Formatter.formatDate( __data.postDate );
                            __tmp.push( __data );
                        }
                    });
                    if ( counter === 0 ) {
                        var emitEvent = '';
                        if ( $scope.news === 1 ) {
                            emitEvent = 'News';
                        }
                        else {
                            emitEvent = 'Blog';
                        }
                        $scope.$emit( 'delete_nav', emitEvent );
                    }
                    else {
                        $scope.blogData = __tmp;
                    }
                }
            });
            
            $scope.widgetTracking = function(label,projectid,id,link){
				var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
				//Send GA/Mixpanel tracker event request when graph clicked
				var subLabel = label+"-"+pageType;   
				var dynamicId = (pageType == "locality-overview") ? "City" : "City"; //Will be change
				var obj = {};
				obj['Widget Name'] = label;
				obj[label+" Id"] = projectid;
				obj[dynamicId+' Id'] = id;
				obj['Link Name'] = link;
				obj['Page Name'] = pageType;
				$rootScope.TrackingService.sendGAEvent("panel", "clicked", subLabel);
				$rootScope.TrackingService.mixPanelTracking("Widget Clicked",obj); 
 
				
			} 

        }
 
    };
});
