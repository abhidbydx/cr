/**
   * Name: ptFavorite Directive
   * Description: pt-favorite directive can be used to add project as favorite 
   *
   * @author: [Nakul Moudgil]
   * Date: Jan 2, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptFavorite', ['$timeout','$rootScope', 'FavoriteService', 'GlobalService', 'SignupService', 'NotificationService', function($timeout, $rootScope, FavoriteService, GlobalService, SignupService, NotificationService){
  return {
  	restrict : 'A',
  	templateUrl : 'views/directives/common/pt-favorite.html',
    scope: {
      projectId:'=',
      caller:'='
    },
    controller: function($scope, $element, $rootScope, $cookies, FavoriteService, GlobalService){
      $scope.favFlag = FavoriteService.isFav($scope.projectId);   
      $scope.favorites = null;
      var addRemoveAction = false;          
      $scope.$watch('projectId',function(newVal, oldVal){          
        if(newVal){
          if($scope.favorites && $scope.favorites.length > 0){
            isFav();   
            changeHTML();
          }
          else if ( GlobalService.isLoggedIn() ) {
            FavoriteService.getMyFavorites().then(function(data){
              $scope.favorites = data;
              isFav();
              changeHTML();
            });
          }
        }
      });
	  
      $scope.$on('favChanged', function(event, data){
        $scope.favorites = data;
        isFav();
        changeHTML();
      });

      function isFav(){
        $scope.favFlag = FavoriteService.isFav($scope.projectId);
      }

      function changeHTML(){
        if($scope.favFlag){
          $element.find('i').addClass('active'); 
		  $element.addClass('active');
        }
        else{
          $element.find('i').removeClass('active');
		  $element.removeClass('active');
        }
      }
	  /* title autoupdate title */
	  $scope.$watch('favFlag', function(){
		  $scope.title = $scope.favFlag ? "Remove from favorites" : $scope.title = "Add to favorites";
	  });

		
      $scope.$on('$signupRes',function(){
        if(!$scope.favorites){
          FavoriteService.getMyFavorites().then(function(data){
            $scope.favorites = data;
            isFav();
            changeHTML();
            if(addRemoveAction){
              addRemoveAction = false;
              if(!$scope.favFlag){
                addToFav();
              }
            }
          }); 
        }       
      });

      function addToFav(){
        FavoriteService.addToFavorites($scope.projectId).then(function(data){ 
			//GA/mixpanel When project successfully added to Favorites
			$scope.tracking('added', $scope.caller, 'Favorite Added');
			NotificationService.setNotification({'msg':'Project has been added into favorites.','type':'info'});
        });
      }

      function removeFromFav(){
        FavoriteService.removeFromFavorites($scope.favFlag).then(function(data){
          NotificationService.setNotification({'msg':'Project has been removed from favorites.','type':'info'});
        });
      }

      $scope.toggle = function($event){ 		
        if(GlobalService.isLoggedIn()){ 		  
          if(!$scope.favFlag){
			//GA/mixpanel On clicking(attempt) favorite icon
			$scope.tracking('attempt', $scope.caller, 'Favorite Attempt');
            addToFav();            
          }
          else{
            removeFromFav();
            //GA/mixpanel When project successfully removed from Favorites
            $scope.tracking('removed', $scope.caller, 'Favorite Removed');
          }
        }
        else{
			//GA/mixpanel On clicking(attempt) favorite icon
			$scope.tracking('attempt', $scope.caller, 'Favorite Attempt');
			SignupService.openSignUp();
			addRemoveAction = true;
        }
        $event.stopPropagation();
      }      
      //GA/mixpanel tracker function
      $scope.tracking = function(action, location, mixpanelEvent){		 
		  var pageType = $rootScope.CURRENT_ACTIVE_PAGE;	
		  var locationKey = action+' from';
		  var favObj = new Object;		  
		  $rootScope.TrackingService.sendGAEvent('favorite', action, location+'-'+pageType); 	 
		  //mixpanel tracker 		 
		  favObj[locationKey] = location
		  favObj['Project ID'] = $scope.projectId
		  favObj['Page Name'] = pageType; 
		  $rootScope.TrackingService.mixPanelTracking(mixpanelEvent, favObj);  
		  if(action == 'added'){
			  mixpanel.people.increment("Favorite Added");
		  }
	  }
	  
    }
	}
}]);
