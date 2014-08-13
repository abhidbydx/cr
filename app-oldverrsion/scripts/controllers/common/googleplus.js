/**
  * Name: Googleplus Controller
  * Description: pt-googleplus to be used for googleplus login/logout 
  * @author: [Swapnil Vaibhav]
  * Date: Jan 10, 2014
***/
'use strict';
angular.module( 'serviceApp')
  .controller( 'googlePlusController', [
    '$scope',
    '$rootScope',
    'GooglePlus',
    'UserService',
    'SignupService',
    'GlobalService',
    function( $scope, $rootScope, GooglePlus, UserService, SignupService, GlobalService ) {
      
      $scope.login = function () {
        GooglePlus.login().then(function (data) {			
			$scope.user = data;          
			//GA tracker On signing by googlePlus
			var pageType = $rootScope.CURRENT_ACTIVE_PAGE;			
			$rootScope.TrackingService.sendGAEvent('signIn', 'submit', 'googlePlus-'+pageType); 	 
			//mixpanel tracker
			$rootScope.TrackingService.mixPanelTracking('SignIn Successful', {'SignIn Type': 'googlePlus', 'Page Name': pageType}); 
			
        }, function (err) {
			console.log('err :', err);
        });
      };

      $scope.$watch( 'user', function( nUser, oUser ) {
        if ( nUser && nUser.uid ) {
          var obj = {
            id : nUser.uid,
            email : nUser.email,
            name  : nUser.name,
            provider : 'Google'
          };
          UserService.checkUser( obj.id, obj.email, obj.name, obj.provider, '' ).then(function(data){
            $rootScope.loggedIn = GlobalService.isLoggedIn();
            SignupService.closeSignUp( obj );
            // $scope.signInModal.close( obj );
          });
        }
      });
    }
  ])
