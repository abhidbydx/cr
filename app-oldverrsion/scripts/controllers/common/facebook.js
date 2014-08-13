/**
  * Name: Facebook Controller
  * Description: pt-facebook to be used for facebook login/logout 
  * @author: [Swapnil Vaibhav]
  * Date: Jan 09, 2014
***/
'use strict';
angular.module( 'serviceApp')
  .controller( 'fbController', [
    '$scope',
    '$rootScope',
    '$timeout',
    'Facebook',
    'UserService',
    'SignupService',
    'GlobalService',
    function( $scope, $rootScope, $timeout, Facebook, UserService, SignupService, GlobalService ) {
      
      // Define user empty data :/
      $scope.user = {};
      
      // Defining user logged status
      $scope.logged = false;
      
      // And some fancy flags to display messages upon user status change
      $scope.byebye = false;
      $scope.salutation = false;
      
      /**
       * Watch for Facebook to be ready.
       * There's also the event that could be used
       */
      $scope.$watch(
        function() {
          return Facebook.isReady();
        },
        function(newVal) {
          if (newVal)
            $scope.facebookReady = true;
        }
      );
      
      /**
       * IntentLogin
       */
      $scope.IntentLogin = function() {
        Facebook.getLoginStatus(function(response) {
          if (response.status == 'connected') {
            $scope.logged = true;
            $scope.me(); 
          }
          else
            $scope.login();
        });
      };
      
      /**
       * Login
       */
       $scope.login = function() {
         Facebook.login(function(response) {
          if (response.status == 'connected') {
            $scope.logged = true;
            $scope.me();
            //GA tracker On signing by Facebook
			var pageType = $rootScope.CURRENT_ACTIVE_PAGE;			
			$rootScope.TrackingService.sendGAEvent('signIn', 'submit', 'facebook-'+pageType); 	 
			//mixpanel tracker
			$rootScope.TrackingService.mixPanelTracking('SignIn Successful', {'SignIn Type': 'facebook', 'Page Name': pageType});  
				
          }
        
        }, {scope: 'email'});
       };
       
       /**
        * me 
        */
        $scope.me = function() {
          Facebook.api('/me', function(response) {
            /**
             * Using $scope.$apply since this happens outside angular framework.
             */
            $scope.$apply(function() {
              $scope.user = response;              
            });
            
          });
        };
      
      /**
       * Logout
       */
      $scope.logout = function() {
        Facebook.logout(function() {
          $scope.$apply(function() {
            $scope.user   = {};
            $scope.logged = false;  
          });
        });
      }
      
      /**
       * Taking approach of Events :D
       */
      $scope.$on('Facebook:statusChange', function(ev, data) {
        console.log('Status: ', data);
        if (data.status == 'connected') {
          $scope.$apply(function() {
            $scope.salutation = true;
            $scope.byebye     = false;    
          });
        } else {
          $scope.$apply(function() {
            $scope.salutation = false;
            $scope.byebye     = true;
            
            // Dismiss byebye message after two seconds
            $timeout(function() {
              $scope.byebye = false;
            }, 2000)
          });
        }
      });


      //  Watch on user data
      $scope.$watch( 'user', function( nUser, oUser ) {
        if ( nUser && nUser.id ) {
          //console.log( 'New User :', nUser );
          var obj = {
            id : nUser.id,
            email : nUser.email,
            name  : nUser.name,
            provider : 'Facebook'
          };         
          UserService.checkUser( obj.id, obj.email, obj.name, obj.provider, '' ).then(function(data){
            $rootScope.loggedIn = GlobalService.isLoggedIn();
            SignupService.closeSignUp( obj );
          });
        }
      });

    }
  ]);
