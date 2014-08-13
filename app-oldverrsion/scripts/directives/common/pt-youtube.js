angular.module('serviceApp').directive('ptYoutube', ['$rootScope', function( $rootScope) {
    return {
        restrict: 'A',
        scope	: {
            slideData: '=', 
            autoplay: '='
        },
        template: '<div id="player"></div>',
        link: function(scope, element, attrs){
            scope.start = false; 						
            scope.$watch(function(){
                return attrs.id;
            }, function(newVal){
                var videoId = newVal;						
                scope.player = scope.createPlayer(attrs);
            });
            scope.createPlayer = function(attrs){				
                if(scope.player) scope.player.destroy();
                var autoply = scope.autoplay ? 1:0;
                return new YT.Player('player', {
                    height: attrs.height,
                    width: attrs.width,
                    videoId: attrs.id,
                    playerVars: {
                        'autoplay': autoply, 
                        'controls': 1,
                        'frameborder':0,
                        'allowfullscreen':1
                    },
                    events: {
                        'onReady': scope.onPlayerReady,
                        'onStateChange': scope.onPlayerStateChange,
                        'onError': scope.onError
                    }
                });
            }					
				
            // When the player has been loaded and is ready to play
            scope.onPlayerReady = function(event){                   
                //GA/MIXPANEL On clicking video to view
                tracking('viewed', 'Video Viewed');						
                scope.start = true;
					
            }
            //Method to look for events such as the video Play/Paused/End
            scope.onPlayerStateChange = function(event){  
                if (event.data ==YT.PlayerState.PLAYING && !scope.start){							
                    //GA/MIXPANEL On playing video
                    tracking('play', 'Video Play');
                }
                if(scope.start){
                    tracking('start', 'Video Start'); 
                    scope.start = false;
                }
                if (event.data ==YT.PlayerState.PAUSED){							
                    //GA/MIXPANEL On Paused video
                    tracking('pause', 'Video Paused')
                }  
                if (event.data ==YT.PlayerState.ENDED)  {							
                    //GA/MIXPANEL On watching video till end
                    tracking('end', 'Video End');
                    tracking('played', 'Video Played', 100);
                }
					
					
            }	  
            //Method call when error while playing video
            scope.onError = function (event){
                console.log('Encountered and ERROR');
            }     
		
            //GA/Mixpanel video tracking		 
            var tracking = function (action, mixpanelEvent, value){
                var subLabel, mixpanelObj = {},objectId = '', videoType = '';
                if(scope.slideData && scope.slideData.objectId)	{
                    objectId = scope.slideData.objectId;
                }
                if(scope.slideData && scope.slideData.text) {
                    videoType = scope.slideData.text;
                }
                mixpanelObj['Project ID'] 		= objectId;				
                mixpanelObj['Video Type'] 		= videoType;
                mixpanelObj['Page Name'] 		= $rootScope.CURRENT_ACTIVE_PAGE;
                if(value){
                    mixpanelObj['Video Played'] = value;
                    subLabel = value+'-'+videoType+"-"+$rootScope.CURRENT_ACTIVE_PAGE
                }else{
                    subLabel = videoType+"-"+$rootScope.CURRENT_ACTIVE_PAGE
                }		
                //GA tracker
                $rootScope.TrackingService.sendGAEvent('gallery', action, subLabel); 	 
                //mixpanel tracker
                $rootScope.TrackingService.mixPanelTracking(mixpanelEvent, mixpanelObj); 				
            
        }
            //GA/MIXPANEL On playing video for certain %
            $rootScope.$on('youtubeCollapse', function() {   
                var pecentage =((scope.player.getCurrentTime()/scope.player.getDuration())*100).toFixed();                                    
                tracking('played', 'Video Played', pecentage);
                //destroying the listner
                $rootScope.$$listeners['youtubeCollapse'] = [];
            });
            
            
        }
    };
}]);
