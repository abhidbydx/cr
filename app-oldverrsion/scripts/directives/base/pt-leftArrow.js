/**
 * Name: Keyboard Left Arrow Handling Directive
 * Description: Use this directive to get anything done on left arrow click.
 * @author: [Nakul Moudgil]
 * Date: Feb 8, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptLeftarrow', function ($document) {
    return function (scope, element, attrs) {
        $document.on("keydown", function (event) {
            if(event.which === 37) {
                scope.$apply(function (){
                    scope.$eval(attrs.ptLeftarrow);
                });
                event.preventDefault();
            }
            else if(event.which === 27) {
                scope.$apply(function (){
                    scope.$eval(attrs.ptClose);
                });
                event.preventDefault();
            }
        });
        /* // When the scope is destroyed, clean up.
        scope.$on(
            "$destroy",
            function() { 
                $document.off( "keydown" ); 
            }
        );*/
    };
});