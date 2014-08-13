/**
  * Name: Overview Gallery
  * Description: This is controller for Overview gallery.
  * @author: [Swapnil Vaibhav]
  * Date: March 24, 2014
***/
'use strict';
angular.module( 'serviceApp' ).directive( 'ptOverviewgallery', function() {
    return {
        restrict : 'A',
        scope : {
            image : '=',
            moretext : '=',
            gallery : '='
        },
        templateUrl : 'views/directives/overview/overviewgallery.html',
        controller : function( $scope, FullScreenService ) {
            $scope.openGallery = function( imageData, imageSetting ) {
                FullScreenService.openGallery( imageData );
            };
        }
    };
});