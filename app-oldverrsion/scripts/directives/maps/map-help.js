/**
 * Name: Map Help Directive
 * Description: To show different help messages.
 * @author: [Abhishek kumar]
 * Date: Apr 04, 2014
**/
'use strict';
angular.module('serviceApp').directive('mapHelp',['$rootScope' ,function($rootScope) {
    return {
        restrict : 'A',
        templateUrl : 'views/directives/maps/map-help.html',
        controller : function( $scope, $rootScope,$cookies,$timeout,$location ) {     
            
            if(typeof($cookies.MAP_HELP_SCREEN)!='undefined') {
                map_cookies_val=JSON.parse($cookies.MAP_HELP_SCREEN);
                help_cookies=map_cookies_val;
            }else{
                var help_cookies={};
                var map_cookies_val='';
            } 
            $scope.showHelp='false';
            $scope.showOverview='false';                        
            $scope.cardNumber='1';            
            $scope.$watch('CURRENT_ACTIVE_PAGE', function(newAlert, oldAlert) {
                if($location.path().indexOf('maps') === -1) {
                    $scope.showHelp='false';
                    $scope.showOverview='false';
                    return false;
                }
                $scope.pageType=newAlert;     
                $scope.showHelp='false';
                $scope.showOverview='false';
                $scope.cardNumber='1';               
                if ( newAlert ) {            
                    
                    if(typeof($cookies.MAP_HELP_SCREEN)!='undefined') {
                        map_cookies_val=JSON.parse($cookies.MAP_HELP_SCREEN);
                    }
                    
                    $scope.cookies_val=map_cookies_val;                                                                  
                    //check for map landing page
                    
                    if(map_cookies_val.map_help_close=='true'){                           
                        $( "#usehelp" ).removeClass( "active" );
                    }                          
                    //check usr click on X buuton                        
                    if(typeof map_cookies_val.map_home_close=='undefined' || (map_cookies_val.map_home_close && map_cookies_val.map_home_close!='true')){                 
                        $scope.showOverview='true';
                        $rootScope.TrackingService.sendGAEvent('map', 'viewed','MapOverviewScreen-'+$scope.pageType); 	 
                        //mix panel event
                        $rootScope.TrackingService.mixPanelTracking('Viewed Overview Screen', {
                            'Page Name':newAlert
                        });   
                    } 
                        
                    
                    //check for city page
                    if($scope.pageType=='map-sale-listing-city'){
                        //check card numder
                        if(typeof(map_cookies_val.city_card_number)=='undefined'){
                            //help_cookies['city_card_number']='1';
                            var city_card_number=1;
                        }else{
                            var city_card_number=parseInt(map_cookies_val.city_card_number);
                        }
                        //check usr click on X buuton
                        if(map_cookies_val.map_help_close=='true' || map_cookies_val.map_city_close=='true'){
                            $scope.showHelp='false';
                            
                        }else{
                            
                            $scope.showHelp='true';
                            $scope.cardNumber=city_card_number;
                            $rootScope.TrackingService.sendGAEvent('map', 'viewed', 'CityScreen-'+$scope.pageType); 	 
                            $rootScope.TrackingService.mixPanelTracking('Viewed Help Screen', {
                                'Help Screen Name':'CityScreen',
                                'Viewed From':'Direct',
                                'Page Name':$scope.pageType
                            });
                           
                            
                        }
                    }          
                    //check for locality page
                    if($scope.pageType=='map-sale-listing-city-locality'){                       
                        if(typeof(map_cookies_val.locality_card_number)=='undefined'){                            
                            var locality_card_number=1;
                        }else{
                            var locality_card_number=parseInt(map_cookies_val.locality_card_number);
                        }                            
                        //check usr click on X buuton
                        if(map_cookies_val.map_help_close=='true' || map_cookies_val.map_locality_close=='true'){
                            $scope.showHelp='false';
                        }else{
                            $scope.showHelp='true';  
                            $scope.cardNumber=locality_card_number; 
                            $rootScope.TrackingService.sendGAEvent('map', 'viewed','LocalityScreen-'+$scope.pageType); 	 
                            $rootScope.TrackingService.mixPanelTracking('Viewed Help Screen', {
                                'Help Screen Name':'LocalityScreen',
                                'Viewed From':'Direct',
                                'Page Name':$scope.pageType
                            });
                             
                        }
                    }
                    //check for project page
                    if($scope.pageType=='map-projectdetail'){                         
                        //check usr click on X buuton
                        if(map_cookies_val.map_help_close=='true' || map_cookies_val.map_project_close=='true'){
                            $scope.showHelp='false';
                        }else{
                            $scope.showHelp='true';
                            $rootScope.TrackingService.sendGAEvent('map', 'viewed','ProjectScreen-'+$scope.pageType); 	 
                            $rootScope.TrackingService.mixPanelTracking('Viewed Help Screen', {
                                'Help Screen Name':'ProjectScreen',
                                'Viewed From':'Direct',
                                'Page Name':$scope.pageType
                            });                            
                        }
                    }
                    if($scope.showOverview=='true'){
                        $scope.showHelp='false';                        
                    }
                    
                    // add in cookies
                    if(help_cookies && help_cookies.length > 0)
                        $cookies.MAP_HELP_SCREEN=JSON.stringify(help_cookies);         
                } 	    
            });
            
            
            //click on next and previous
            $scope.applyAction =function(option) {                
                if(typeof($cookies.MAP_HELP_SCREEN)!='undefined') {
                    map_cookies_val=JSON.parse($cookies.MAP_HELP_SCREEN);
                    help_cookies=map_cookies_val;
                }else{
                    var help_cookies={};  
                    map_cookies_val={};
                } 
                var labelName='';
                var screenName='';
                var card_number='1';
                var initial_card_number='1';
                if(option=='onPreviuos'){
                    labelName='Back';
                }
                if(option=='onNext'){
                    labelName='Next';
                }
                if(option=='onDone'){
                    labelName='Done';
                }                
                //check for city card number
                if($scope.pageType=='map-sale-listing-city'){
                    screenName='CityScreen';
                    if(typeof(map_cookies_val.city_card_number)=='undefined')map_cookies_val.city_card_number='1';
                    initial_card_number=map_cookies_val.city_card_number;
                    if(option=='onNext'){                        
                        help_cookies['city_card_number']=(parseInt(map_cookies_val.city_card_number)+1).toString();     
			
                    }
                    if(option=='onPreviuos'){                        
                        help_cookies['city_card_number']=(parseInt(map_cookies_val.city_card_number)-1).toString();                        
                    }
                    if(option=='onDone'){                        
                        help_cookies['map_city_close']='true';
                        help_cookies['city_card_number']='1';
                        $scope.showHelp='false';
                        if(map_cookies_val.map_project_close=='true' && map_cookies_val.map_locality_close=='true'){
                            help_cookies['map_help_close']='true';
                            $( "#usehelp" ).addClass( "glow-bulb" );
                            $timeout(function(){
                                $( "#usehelp" ).removeClass( "glow-bulb" );
                                $( "#usehelp" ).removeClass( "active" );
                            }, 3000);
                        }
                    }
                    card_number=help_cookies['city_card_number'];
                    
                    
                }
                //check for locality card number
                if($scope.pageType=='map-sale-listing-city-locality'){
                    screenName='LocalityScreen';
                    if(typeof(map_cookies_val.locality_card_number)=='undefined')map_cookies_val.locality_card_number='1';
                    initial_card_number=map_cookies_val.locality_card_number;
                    if(option=='onNext'){                        
                        help_cookies['locality_card_number']=(parseInt(map_cookies_val.locality_card_number)+1).toString();	
                    }
                    if(option=='onPreviuos'){					
                        help_cookies['locality_card_number']=(parseInt(map_cookies_val.locality_card_number)-1).toString();                        
                    }
                    if(option=='onDone'){                        
                        help_cookies['map_locality_close']='true';
                        help_cookies['locality_card_number']='1';
                        $scope.showHelp='false';
                        if(map_cookies_val.map_city_close=='true' && map_cookies_val.map_project_close=='true'){
                            help_cookies['map_help_close']='true';
                            $( "#usehelp" ).addClass( "glow-bulb" );
                            $timeout(function(){
                                $( "#usehelp" ).removeClass( "glow-bulb" );
                                $( "#usehelp" ).removeClass( "active" );
                            }, 3000);
                        }
                    }
                    card_number=help_cookies['locality_card_number']; 
                    
                }
                if($scope.pageType=='map-projectdetail'){
                    screenName='ProjectScreen';                    
                    if(option=='onDone'){                        
                        help_cookies['map_project_close']='true'; 
                        if(map_cookies_val.map_city_close=='true' && map_cookies_val.map_locality_close=='true'){
                            help_cookies['map_help_close']='true';
                            $( "#usehelp" ).addClass( "glow-bulb" );
                            $timeout(function(){
                                $( "#usehelp" ).removeClass( "glow-bulb" );
                                $( "#usehelp" ).removeClass( "active" );
                            }, 3000);
                        }
                        card_number='1';
                        $scope.showHelp='false';
                    }
                    
                }                
                $rootScope.TrackingService.sendGAEvent('map', 'clicked',screenName+'-'+labelName+'-'+initial_card_number+'-'+$scope.pageType); 	 
                $rootScope.TrackingService.mixPanelTracking(labelName+' Clicked', {
                    'Help Screen Name':screenName,
                    'Step Number':initial_card_number,
                    'Page Name':$scope.pageType
                });
                $scope.cardNumber=card_number;
                $cookies.MAP_HELP_SCREEN=JSON.stringify(help_cookies);		   
            }  
            $scope.ShowAgainMap=function(){                
                if(typeof($cookies.MAP_HELP_SCREEN)!='undefined') {
                    map_cookies_val=JSON.parse($cookies.MAP_HELP_SCREEN);
                    help_cookies=map_cookies_val;
                }else{
                    var help_cookies={};  
                    map_cookies_val={};
                }
                if($( "#usehelp" ).hasClass( "active" )){
                    $scope.showHelp='false';
                    $( "#usehelp" ).removeClass( "active" );
                    help_cookies['map_help_close']='true';
                    $cookies.MAP_HELP_SCREEN=JSON.stringify(help_cookies); 
                    return true;
                }else{
                    $( "#usehelp" ).addClass( "active" );
                    help_cookies['map_help_close']='false';  
                    help_cookies['map_city_close']='false';  
                    help_cookies['map_locality_close']='false';
                    help_cookies['map_project_close']='false';    
                }
                var card_number='1';
                var screenName='';
                if($scope.pageType=='map-sale-listing-city'){
                    screenName='CityScreen';
                    if(typeof(map_cookies_val.city_card_number)=='undefined'){
                        card_number='1';
                    }else{
                        card_number=parseInt(map_cookies_val.city_card_number);
                    }
                }
                if($scope.pageType=='map-sale-listing-city-locality'){
                    screenName='LocalityScreen';
                    if(typeof(map_cookies_val.locality_card_number)=='undefined'){
                        card_number='1';
                    }else{
                        card_number=parseInt(map_cookies_val.locality_card_number);
                    }
                }
                if($scope.pageType=='map-projectdetail'){   
                    screenName='ProjectScreen';
                }     
                $scope.showHelp='true';
                $rootScope.TrackingService.sendGAEvent('map', 'viewed',screenName+'-header-'+$scope.pageType); 	 
                $rootScope.TrackingService.mixPanelTracking('Viewed Help Screen', {
                    'Help Screen Name':screenName,
                    'Viewed From':'Header',
                    'Page Name':$scope.pageType
                });
                $scope.cardNumber=card_number;
                $cookies.MAP_HELP_SCREEN=JSON.stringify(help_cookies); 
            }
            
            $scope.closeHelp = function() {
                if(typeof($cookies.MAP_HELP_SCREEN)!='undefined') {
                    map_cookies_val=JSON.parse($cookies.MAP_HELP_SCREEN);
                    help_cookies=map_cookies_val;
                }else{
                    var help_cookies={};  
                    map_cookies_val={};
                }                              
                
                var screenName='';
                var card_number='1';
                if($scope.pageType=='map-sale-listing-city'){
                    screenName='CityScreen';
                    card_number=parseInt(map_cookies_val.city_card_number);
                }
                if($scope.pageType=='map-sale-listing-city-locality'){
                    screenName='LocalityScreen'; 
                    card_number=parseInt(map_cookies_val.locality_card_number);
                }
                if($scope.pageType=='map-projectdetail'){
                    screenName='ProjectScreen';  
                }
                if($scope.pageType=='map-sale-listing-city' || $scope.pageType=='map-sale-listing-city-locality' || $scope.pageType=='map-projectdetail'){
                    help_cookies['map_help_close']='true';
                    $rootScope.TrackingService.mixPanelTracking('Cancel Clicked', {
                        'Help Screen Name':screenName,
                        'Step Number':card_number,
                        'Page Name':$scope.pageType
                    });
                    $( "#usehelp" ).addClass( "glow-bulb" );
                    $timeout(function(){
                        $( "#usehelp" ).removeClass( "glow-bulb" );
                        $( "#usehelp" ).removeClass( "active" );
                    }, 3000);
                }
                $scope.showHelp='false';                
                $cookies.MAP_HELP_SCREEN=JSON.stringify(help_cookies); 
                
            };
            
            $scope.closeOverview = function(option) {
                if(typeof($cookies.MAP_HELP_SCREEN)!='undefined') {
                    map_cookies_val=JSON.parse($cookies.MAP_HELP_SCREEN);
                    help_cookies=map_cookies_val;
                }else{
                    var help_cookies={};  
                    map_cookies_val={};
                }
                if(option=='ok'){
                    $rootScope.TrackingService.sendGAEvent('map', 'clicked','MapOverview'+'-OKAY-'+$scope.pageType); 	 
                    $rootScope.TrackingService.mixPanelTracking('Button Clicked', {
                        'Button Name':'OKAY',
                        'Page Name':$scope.pageType
                    });
                    
                }
                if(option=='cancel'){
                    $rootScope.TrackingService.sendGAEvent('map', 'clicked','MapOverview'+'-CANCEL-'+$scope.pageType); 	 
                    $rootScope.TrackingService.mixPanelTracking('Button Clicked', {
                        'Button Name':'CANCEL',
                        'Page Name':$scope.pageType
                    });
                    
                }
                help_cookies['map_home_close']='true';                
                $scope.showOverview='false';  
                $scope.showHelp='true';                
                $cookies.MAP_HELP_SCREEN=JSON.stringify(help_cookies); 
                
            };
            
        }
    }
}]);
