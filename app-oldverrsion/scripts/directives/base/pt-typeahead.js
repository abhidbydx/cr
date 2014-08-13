

'use strict';
angular.module('serviceApp').directive('ptTypeahead', function(){

    return {
        restrict    :   'A',
        transclude  :   true,
        scope       :   {
            'add'       :   '&',
            'data'      :   '=',
            'selected'  :   '=',
            'selecteditem'  :   '=',
            'pholder'  :   '=',
            'updateFilter'  :   '&'
        },
        templateUrl    :  'views/directives/base/pt-typeahead.html', 
        link        :   function(scope, element, attr){
        },
        controller  :   function($scope, $element){
            if ( !$scope.pholder ) {
                $scope.pholder = 'Please enter something';
            }
        }
    };
});
