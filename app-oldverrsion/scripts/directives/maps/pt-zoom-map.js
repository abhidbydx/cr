

"use strict";
angular.module('serviceApp').directive('ptZoomMap', function(){

    return {
        restrict    :   'A',
        scope       :   {
            backToCity  :   '=',
            cityName    :   '=',
            back        :   '&'
        },
        templateUrl :   'views/directives/maps/pt-zoom-map.html',
        link        :   function(scope, element){
            
        },
        controller  :   function($scope, $element){
            
        }
    };
});
