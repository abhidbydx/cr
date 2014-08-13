/* Name   : Price On Request Directive
 * Author : Satyajeet Parida
 * Date   : April 09, 2014
 */
'use strict';
angular.module('serviceApp').directive('ptPriceonrequest', function () {
    return {
        restrict: 'A',
        templateUrl: 'views/directives/common/pt-priceonrequest.html',
    }
})
