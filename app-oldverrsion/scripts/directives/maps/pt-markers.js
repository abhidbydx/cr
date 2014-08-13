/**
   * Name: pt-markers
   * Description: Markers directives
   * @author: [Yugal Jindle]
   * Date: Dec 09, 2013
**/

"use strict";

// Locality marker
angular.module('serviceApp').directive('markerLocality', function() {
    return {
        restrict: 'A',
        scope: {
            data: '=',
            showType: '='
        },
        templateUrl: 'views/directives/maps/markerLocality.html',
        link: function(scope, element){
            element.bind('$destroy', function(){
                scope.$destroy();
            });
        }
    };
});


// Project marker
angular.module('serviceApp').directive('markerProject', ['LeadService', function(LeadService) {
    return {
        restrict: 'A',
        scope: {
            data: '=',
            showType: '='
        },
        templateUrl: 'views/directives/maps/markerProject.html',
        link: function(scope, element) {
            element.bind('$destroy', function(){
                scope.$destroy();
            });
            
            scope.openLeadForm = function( $event, type, formName ) {
                $event.stopPropagation();
                var leadData = {
                    type : type,
                    cityId : scope.data.cityId,
                    localityId : scope.data.localityId,
                    projectId : scope.data.projectId,
                    projectName : scope.data.name,
                    builderName : scope.data.builderName,
                    ui_php : 'mappage.php',
		    formlocationinfo : formName
                };
                LeadService.openLeadForm( leadData );
            };
       }
    };
}]);
