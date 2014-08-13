/**
 *  Name : Signup Controller
 *  Description : To control actions in signup/register model
 *  @author : Swapnil Vaibhav
 *  Date : Jan 17, 2014
**/
'use strict';
angular.module( 'serviceApp' )
.controller( 'signUpCtrl', [ '$scope', '$rootScope', '$timeout', 'dateFilter', 'UserService', 'CommonValidators' , 'CityService', "$modalInstance",
    function( $scope, $rootScope, $timeout, dateFilter, UserService, CommonValidators, CityService, $modalInstance ) {
        CityService.getCountry().then( function( data ) {
            $scope.countryList = data;
        });		
		$scope.formFillCheck = false;
        $scope.signupform = true;
        $scope.regform = false;
        $scope.fpass = false;

        $scope.loginErrorText = $rootScope.labels.common.error.AUTH_FAIL;
        $scope.registerErrorText = $rootScope.labels.common.error.REGISTRATION_FAIL;
        $scope.currentDate = dateFilter(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.switchForm = function() {
            resetErrorMsg();

            $scope.signupform = !$scope.signupform;
            $scope.regform = !$scope.regform;
            $scope.fpass = false;
            $scope.formFillCheck = false;
            var subLabel, pageType = $rootScope.CURRENT_ACTIVE_PAGE;
            
            //Send GA/Mixpanel tracker event request when SignIn Box opened 
            if($scope.regform){   
				subLabel = "open-"+pageType;   
				//GA tracker
				$rootScope.TrackingService.sendGAEvent('register', 'open', subLabel); 	 
				//mixpanel tracker
				$rootScope.TrackingService.mixPanelTracking('Viewed Register Form', {'Page Name': pageType}); 
				//End Ga/mixpanel   
			}  
        };

        var resetErrorMsg = function() {
            $scope.loginError = '';
            $scope.usernameClass = '';
            $scope.usernameError = '';
            $scope.passwordClass = '';
            $scope.passwordError = '';

            $scope.regErrName = '';
            $scope.regErrNameClass = '';
            $scope.regErrEmail = '';
            $scope.regErrEmailClass = '';
            $scope.regErrMobile = '';
            $scope.regErrMobileClass = '';
            $scope.regErrPassword = '';
            $scope.regErrPasswordClass = '';
            $scope.regErrCountry = '';
            $scope.regErrCountryClass = '';

            $scope.fPassErr = '';
            $scope.fPassErrClass = '';
            $scope.fPassMsg = '';
        };

        $scope.showFPass = function() {
            resetErrorMsg();
            $scope.signupform = false;
            $scope.regform = false;
            $scope.fpass = true;
        };

        $scope.showSignIn = function() {
            resetErrorMsg();
            $scope.signupform = true;
            $scope.regform = false;
            $scope.fpass = false;
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.resetPass = function( femail ) {
            var callRPassApi = true;
            if ( !CommonValidators.isEmail( femail ) ) {
                $scope.fPassErr = $rootScope.labels.common.error.INVALID_EMAIL;
                callRPassApi = false;
                $scope.fPassErrClass = 'error';                
            }
            else {
                femail = femail.trim();
                $scope.fPassErr = '';
                $scope.fPassErrClass = '';
            }
            if ( callRPassApi ) {
                UserService.resetPassword( femail ).then( function( data ) {				
                    $scope.fPassMsg = '';
                    if ( data === 'Send' ) {
                        $scope.fPassMsg = $rootScope.labels.common.message.RESET_PASSWORD_MAIL_SENT.replace( '[[email]]', femail );
                        $timeout( function() {
                            $scope.cancel();
                        }, 6000 );
                    }
                    else if ( data === 'error' ) {
                        $scope.fPassErrClass = 'error';
                        $scope.fPassErr = $rootScope.labels.common.error.EMAIL_NOT_FOUND;                        
                    }
                    else {
                        $scope.fPassErrClass = 'error';
                        $scope.fPassErr = 'Some error occurred';
                    }
                });
            }
        };

        $scope.signInSubmit = function( username, password ) {
            //  check email and password            
            if ( !username ) {
                username = $('#login-id').val();
            }
            if ( !password ) {
                password = $('#login-pass').val();
            }
            $scope.loginError = '';
            if ( CommonValidators.isEmail( username ) ) {
                $scope.usernameError = '';
                $scope.usernameClass = '';
                if ( password && password.length > 0 ) {
                    //  login API call
                    $scope.passwordError = '';
                    $scope.passwordClass = '';
                    $scope.loginUser = '';
                    $rootScope.whyLoginMessage = '';
                    UserService.userLogin( username, password ).then( function( data ) { 
                        $scope.loginUser = data;                                                                                                 
						if(data == 'error'){
							//GA/MIXPANEL tracking on login error
							$scope.formProcessTracking('signIn', 'submitFailed', 'SignIn Errors');						
						}else{
							//Create alias logic for mixpanel at the time login							
							var mixpanel_distinct_id = mixpanel.get_distinct_id(); 
							if ( !CommonValidators.isEmail( mixpanel_distinct_id ) ) {
								mixpanel.alias(data.EMAIL);																				 
								mixpanel.register({"distinct_id": data.EMAIL})
							}else{
								mixpanel.identify(data.EMAIL)	
							}										 
							mixpanel.people.set({
							 "USER ID": data.USERID, "Mobile": data.MOBILE, '$name': data.USERNAME, '$email': data.EMAIL, '$created': data.CREATED_DATE, '$last_login': $scope.currentDate
							});
							//GA/MIXPANEL tracking on success login
							$scope.formProcessTracking('signIn', 'submit', 'SignIn Successful');
							mixpanel.people.increment("SignIn Successful");
						}
                    
                    });
                }
                else {
                    //  Please enter password
                    $scope.passwordError = $rootScope.labels.common.error.NO_PASSWORD;
                    $scope.passwordClass = 'error';
                    //GA/MIXPANEL tracking
                    $scope.formProcessTracking('signIn', 'submitErr', 'SignIn Errors');
                     
                }
            }
            else {
                //  Please enter a valid email-id
                $scope.passwordError = '';
                $scope.passwordClass = '';
                $scope.usernameError = $rootScope.labels.common.error.INVALID_EMAIL;
                $scope.usernameClass = 'error';
                //GA/MIXPANEL tracking
                $scope.formProcessTracking('signIn', 'submitErr', 'SignIn Errors');
               
            }
            
        };

        $scope.register = function( uname, email, mobile, password, country ) {
            $scope.loginError = '';
            var callRegApi = true,
                countryId = ( country ) ? parseInt( country.id, 10 ) : 0;

            if ( !CommonValidators.isName( uname ) ) {
                $scope.regErrName = $rootScope.labels.common.error.INVALID_NAME;
                callRegApi = false;
                $scope.regErrNameClass = 'error';
            }
            else {
                uname = uname.trim();
                $scope.regErrName = '';
                $scope.regErrNameClass = '';
            }

            if ( !CommonValidators.isEmail( email ) ) {
                $scope.regErrEmail = $rootScope.labels.common.error.INVALID_EMAIL;
                callRegApi = false;
                $scope.regErrEmailClass = 'error';
            }
            else {
                email = email.trim();
                $scope.regErrEmail = '';
                $scope.regErrEmailClass = '';
            }

            if ( !CommonValidators.isMobile( mobile ) ) {
                $scope.regErrMobile = $rootScope.labels.common.error.INVALID_PHONE;
                callRegApi = false;
                $scope.regErrMobileClass = 'error';
            }
            else {
                mobile = mobile.trim();
                $scope.regErrMobile = '';
                $scope.regErrMobileClass = '';
            }

            if ( !CommonValidators.isValidString( password ) ) {
                $scope.regErrPassword = $rootScope.labels.common.error.NO_PASSWORD;
                callRegApi = false;
                $scope.regErrPasswordClass = 'error';
            }
            else {
                $scope.regErrPassword = '';
                $scope.regErrPasswordClass = '';
            }

            if ( !countryId || countryId === 8 ) {
                $scope.regErrCountry = $rootScope.labels.common.error.SELECT_COUNTRY;
                callRegApi = false;
                $scope.regErrCountryClass = 'error';
            }
            else {
                $scope.regErrCountry = '';
                $scope.regErrCountryClass = '';
            }

            //  check for non Indian phone
            if ( $scope.regErrCountry === '' && countryId !== 1 && mobile ) {
                mobile = mobile.trim();
                if ( mobile.length >=6 && mobile.length <= 15 && CommonValidators.isInteger( mobile ) ) {
                    $scope.regErrMobile = '';
                    $scope.regErrMobileClass = '';
                }
                else {
                    $scope.regErrMobile = $rootScope.labels.common.error.INVALID_PHONE_NON_INDIA;
                    callRegApi = false;
                    $scope.regErrMobileClass = 'error';
                }
            } 

            if ( callRegApi ) {
                //  make API call now
                UserService.userRegister( uname, email, mobile, password, countryId ).then( function( data ) {
                    $scope.loginUser = data;
                    if(data == 'error'){
						//GA/MIXPANEL tracking
						$scope.formProcessTracking('register', 'submitErr', 'Registration Errors');
					}else{
						//MIXPANEL alias on Registration Successful
						var mixpanel_distinct_id = mixpanel.get_distinct_id(); 
						if ( !CommonValidators.isEmail( mixpanel_distinct_id ) ) {
							mixpanel.alias(data.EMAIL);																				 
							mixpanel.register({"distinct_id": data.EMAIL})
						}else{
							mixpanel.identify(data.EMAIL)	
						}
						mixpanel.people.set({"USER ID": data.USERID, "Mobile": data.MOBILE, '$name': data.USERNAME, '$email': data.EMAIL, '$created': data.CREATED_DATE, '$last_login': $scope.currentDate});
						//GA/MIXPANEL tracking on Registration Successful
						$scope.formProcessTracking('register', 'submit', 'Registration Successful');                  
					}
                });
            }else{
				//GA/MIXPANEL tracking
                $scope.formProcessTracking('register', 'submitErr', 'Registration Errors');
			}
        };

        $scope.$watch( 'loginUser', function( newVal, oldVal ) {
            if ( newVal ) {
                if ( newVal !== 'error' ) {
                    //  USER IS LOGGED-IN
                    $scope.loginError = '';
                    $scope.regErrEmailClass = '';
                    UserService.userInfo();
                }
                else {
                    $scope.loginError = true;
                    $scope.regErrEmailClass = 'error';                    
                }
                $scope.loginUser = '';
            }            
            
        });        
        //Send GA/Mixpanel tracker event request When user start typing in any of the form field 
        $scope.formFill = function(type){ 			
			if ($scope.formFillCheck == true) {
				return;
			} else {
				$scope.formFillCheck = true; 			
				var pageType = $rootScope.CURRENT_ACTIVE_PAGE;
				var subLabel = "filled-"+pageType;  
				//GA tracker
				$rootScope.TrackingService.sendGAEvent(type, 'filled', subLabel); 	 
				//mixpanel tracker
				type = (type == 'register') ? 'Registration' : 'SignIn';		
				$rootScope.TrackingService.mixPanelTracking(type+' Initiated', {'Page Name': pageType}); 
				//End Ga/mixpanel  
			}
		}
		
		//Send GA/Mixpanel tracker event request when user get any validation error
        $scope.formProcessTracking = function(type, action, mixpanelEvent){  			
			var pageType = $rootScope.CURRENT_ACTIVE_PAGE, subLabel = action+"-"+pageType, signinObj = {};			
			$rootScope.TrackingService.sendGAEvent(type, action, subLabel); 	 
			//mixpanel tracker
			if(type == 'signIn' && action == 'submit'){
				signinObj['SignIn Type']	= 'Proptiger';
			}			
			signinObj['Page Name']	= pageType
			$rootScope.TrackingService.mixPanelTracking(mixpanelEvent, signinObj); 
			//End Ga/mixpanel   
		} 
    }]);
