/**
   * Name: pt-alv-listitem-locality
   * Description: ALV locality list item
   * @author: [Yugal Jindle]
   * Date: Nov 18, 2013
**/

'use strict';

angular.module('serviceApp').directive('ptAlvListitemLocality', ['$parse', '$rootScope', function($parse, $rootScope) {
    return {
        restrict: 'EA',
        scope: {
            marker  :   '=',
            map     :   '='
        },
        templateUrl: 'views/directives/maps/pt-alv-listitem-locality.html',
        link    :   function(scope, element){
            scope.data  =   scope.marker.data;
            
            //add event on marker for actions on alv
            element.bind('mouseenter', function(){
                //add marker mouse enter event
                scope.marker.alvMouseEnter();
            });

            element.bind('mouseleave', function(){
                //add marker mouse out event
                scope.marker.alvMouseOut();
            });

            element.bind('click', function(){
                //zoom to locality level and fetch projects   
                scope.marker.alvClick();
            });

            element.bind('$destroy', function(){
                element.unbind('mouseenter');
                element.unbind('mouseleave');
                element.unbind('click');
                scope.$destroy();
            });
        }

   }
}]);
