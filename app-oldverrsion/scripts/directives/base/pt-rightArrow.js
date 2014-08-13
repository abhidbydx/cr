/**
 * Name: Keyboard Right Arrow Handling Directive
 * Description: Use this directive to get anything done on right arrow click.
 * @author: [Nakul Moudgil]
 * Date: Feb 8, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptRightarrow', function ($document) {
    return function (scope, element, attrs) {
        $document.on("keydown", function (event) {
            if(event.which === 39) {
                scope.$apply(function (){
                    scope.$eval(attrs.ptRightarrow);
                });

                event.preventDefault();
            }
        });

/*        // When the scope is destroyed, clean up.
        scope.$on(
            "$destroy",
            function() { 
                $document.off( "keydown" ); 
            }
        );*/
    };
});