'use strict';
angular.module('serviceApp').directive('ptDropdown', ['$document', function($document) {
  
    return {
      restrict: 'A',      
      transclude: true,
      scope: {
        classmenu: '@',
        classlink: '@',
        linktext: '@',
        classtextli: '@',
        citytoshow: '='
      },
      template:  '<a ng-if="!citytoshow" ng-class="classlink" href="javascript:void(0);">{{linktext}}<i class="{{classtextli}}"></i></a>' +
                  '<a ng-if="citytoshow" ng-class="classlink" href="javascript:void(0);">{{citytoshow}}<i class="{{classtextli}}"></i></a>' +
                  '<span ng-show="isShowMenu" ng-mouseenter="isShowMenu = true" ng-class="classmenu" ng-style="menuStyle" ng-transclude></span>'
      ,
      link: function(scope, elm, attrs) {
        scope.menuStyle = '';//{ 'position': 'absolute' };
        scope.isShowMenu = false;  

        elm.bind('mouseenter', function() {            
            scope.isShowMenu = true;
            scope.$apply();
        });

        $document.bind('mouseenter', function(e) { 
          scope.isShowMenu = true;
          scope.$apply();
        });

        $document.bind('click', function(e) {
          scope.isShowMenu = !scope.isShowMenu;
          scope.$apply();
        });
      }
    };
  }]);