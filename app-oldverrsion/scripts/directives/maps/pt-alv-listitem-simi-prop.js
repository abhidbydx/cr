/**
   * Name: pt-alv-listitem-similar-properties
   * Description: ALV similar Properties list item
   * @author: [Nimit Mangal]
   * Date: Dec 03, 2013
**/

'use strict';

angular.module('serviceApp').directive('ptAlvListitemSimiProp', ['$parse', function($parse) {
    return {
        restrict: 'EA',
        scope: {
        	data: '=data',
            clicked :   '&',
            hover   :   '&'
        },
        templateUrl: 'views/directives/maps/pt-alv-listitem-simi-prop.html',
    }
}]);
