/**
   * Name:Enquired Property Directive
   * Description: Enquired Property directive is used to show users data for enquired properties.
   * @author: [Swapnil Vaibhav]
   * Date: Oct 28, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptMyfavorites',function($timeout){
  return{
    restrict : 'A',
    templateUrl : 'views/directives/common/pt-myfavorites.html',
    scope : {},
    controller : function($scope, $rootScope, WidgetConfig, FavoriteService, Formatter,Constants){
      var widgetData = WidgetConfig.myFavorites.widgetData;
      $scope.myFavWidgetName = 'My Favorites';
      $scope.errorMessage = 'Currently no favorites are saved by you';
      $scope.pgOptions = widgetData.displayInfo.gridOptions;
      FavoriteService.getMyFavorites(widgetData.displayInfo.metricList).then( function( data ) {
        assignData( data );
      });

      var assignData = function( wishList ) {
        for( var cnt = 0; cnt < wishList.length; cnt++ ) {
          wishList[ cnt ].projectName = wishList[ cnt ].builderName + ' ' + wishList[ cnt ].projectName
        }
        $scope.pgData = wishList;
      };

      $scope.noFavourite = true;
      $scope.$watch('pgData', function(newVal, oldVal) {
        if ( newVal && typeof newVal !== 'undefined' ) {
          if ( newVal.length == 0 ) {
            $scope.showGrid = false;
            $scope.noFavourite = true;
            $scope.countFav = 0;
          }
          else {
            $scope.showGrid = true;
            $scope.noFavourite = false;
            $scope.countFav = $scope.pgData.length;
          }
          var mixpanelObj = {}; 
          mixpanelObj['Page Name'] = "My Favorite Homes";        
          mixpanelObj['Favorite Count'] = $scope.countFav;         
          $rootScope.TrackingService.pageViewedCall(mixpanelObj); 
        }
      });

      $scope.formatDate = function( dt ) {
        return Formatter.formatDate( Formatter.getYYYYMMDD( dt ), true );
      };

      $scope.$on( 'favChanged', function( event, nVal ) {
        if ( nVal ) {
          assignData( nVal );
        }
      });

      $scope.del = function( wId ) {
        FavoriteService.removeFromFavorites( wId );
      };
    }
  }
});
