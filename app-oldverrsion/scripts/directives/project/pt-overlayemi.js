/**
 * Created by shatyajeet on 13/2/14.
 */

'use strict';
angular.module('serviceApp').directive('ptOverlayemi', function(){
  return {
    restrict: 'A',
    templateUrl: 'views/directives/project/overlayemi.html',
    controller: function($scope, $location, $anchorScroll) {
    }
  };
});
