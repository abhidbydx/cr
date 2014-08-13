/**
  * Name: Area Overview Directive
  * Description: Overview widgit.
  * @author: [Swapnil Vaibhav]
  * Date: Jan 07, 2014
***/
'use strict';
angular.module('serviceApp').directive('ptAreaoverview', function() {
    return {
        restrict : 'A',
        templateUrl : 'views/directives/common/pt-areaoverview.html',
        controller : function( $scope, $rootScope, FullScreenService, Formatter ) {
            var gallery = '',
                noReviews = {
                    review: 'No Reviews',
                    username: ''
                };
            //localityId = $scope.PARSED_URL_DATA.SEARCH_OBJ.localityId;
            
            $scope.isReadonly = false;
            $scope.toggleDesc = function( moreOrLess ) {
                if ( moreOrLess == 'more' ) {
                    if ( $scope.urlData.pageType === 'projectdetail' ) {
                        $scope.showSemi = true;
                    }
                    else {
                        $scope.showLess = true;
                    }
                    $scope.hideMore = true;
                }
                else {
                    $scope.hideMore = false;
                    $scope.showLess = false;
                }
                if ( $scope.urlData.pageType !== 'projectdetail' ) {
                    Formatter.goToEl( 'overview' );
                }
            };

            $scope.$on('userLoggedIn', $scope.rateLocality);
        }
    };
});
