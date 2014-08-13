/**
 *  Name : Signup Service
 *  Description : Signup service to for login/register
 *  @author : Swapnil Vaibhav
 *  Date : Jan 17, 2014
**/
'use strict';

angular.module( 'serviceApp' ) .config( function ( $httpProvider ) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
.factory('SignupService', function( $rootScope, $modal, GlobalService, SearchService ) {

    var signInModal = '';
    var openSignUp = function( redirectUrl ) {
        if ( !redirectUrl ) {
            redirectUrl = '';
        }
        $rootScope.redirectUrl = redirectUrl;
        signInModal = $modal.open({
            templateUrl: 'views/modal/signInRegister.html',
            controller : 'signUpCtrl'
        });		
		//Send GA/Mixpanel tracker event request when SignIn Box opened 		
		$rootScope.TrackingService.sendGAEvent('signIn', 'open', "open-"+$rootScope.CURRENT_ACTIVE_PAGE); 	 		
		$rootScope.TrackingService.mixPanelTracking('Viewed Sign In Form', {'Page Name': $rootScope.CURRENT_ACTIVE_PAGE}); 
		//End Ga/mixpanel				
        return signInModal;
        // signInModal.result.then( function( obj ) {
        //     console.log( obj );
        // });
    };

    var closeSignUp = function() {
        //  signInModal will not be found if user logged in via lead form.
        if ( signInModal.close ) {
            signInModal.close();
        }
    };

    $rootScope.$watch( GlobalService.isLoggedIn, function( n, o ) {
        if ( n && n !== o ) {
            SearchService.saveSearchAfterLogin();
            closeSignUp();
        }
        if ( n ) {
            $rootScope.$broadcast('$signupRes');
            $rootScope.loggedIn = true;
        }
        else {
            $rootScope.loggedIn = false;
        }
    });

    return {
        openSignUp  : openSignUp,
        closeSignUp : closeSignUp
    };
});
