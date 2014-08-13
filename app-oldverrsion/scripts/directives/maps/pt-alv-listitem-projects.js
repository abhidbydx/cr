/**
   * Name: pt-alv-listitem-projects
   * Description: ALV projects list item
   * @author: [Yugal Jindle]
   * Date: Nov 18, 2013
**/

'use strict';

angular.module('serviceApp').directive('ptAlvListitemProjects', ['$parse', '$rootScope', 'LeadService', 'FavoriteService', function($parse, $rootScope, LeadService, FavoriteService) {
    return {
        restrict: 'EA',
        scope: {
        	marker  : '='
        },
        templateUrl: 'views/directives/maps/pt-alv-listitem-projects.html',
        link    :   function(scope, element){
            scope.data				=   scope.marker.data;
            scope.callerLocation	=	'ALV';	
            
            scope.openLeadForm = function( $event, type, formName ) {
                $event.stopPropagation();
                var leadData = {
                    type : type,
                    cityId : scope.marker.data.cityId,
                    localityId : scope.marker.data.localityId,
                    projectId : scope.marker.data.projectId,
                    projectName : scope.marker.data.name,
                    builderName : scope.marker.data.builderName,
                    fromALV     : true,
		    ui_php : 'mappage.php',
		    formlocationinfo : formName
                };
                LeadService.openLeadForm( leadData );
            };

            element.bind('mouseenter', function(){
                //add marker mouse enter event   
                scope.marker.alvMouseEnter();
            });

            element.bind('mouseleave', function(){
                //add marker mouse out event    
                scope.marker.alvMouseOut();
            });

            element.bind('click', function(){
                //open detail card
                scope.marker.alvClick();
            });
 
            element.bind('$destroy', function(){
                element.unbind('mouseenter');
                element.unbind('mouseleave');
                element.unbind('click');
            });
        },
        controller  :   function($scope) {

            //if project is added as favorite to db, update the marker UI
            $scope.$on('favChanged', function(data) {

                var id = $scope.marker.data.projectId;
                var fav = FavoriteService.isFav(id);
                var marker = $('#project_'+id);
                var icon = $('.projFav_'+id);
                if(fav) {
                    marker.addClass('st-f');
                    icon.addClass('active');
                } else {
                    marker.removeClass('st-f');
                    icon.removeClass('active');
                }
            });

            //at time of signin update the markers on map
            $scope.$on('$signupRes',function() {
                var idx, len, marker, icon;
                FavoriteService.getMyFavorites().then(function(data) {
                    if(data && data.length) {
                        for(idx = 0, len = data.length; idx < len; idx++) {
                            marker = $('#project_'+data[idx].projectId);
                            marker.addClass('st-f');
                            icon = $('.projFav_'+data[idx].projectId);
                            icon.addClass('active');
                        }
                    }
                });
            });
        }
    };
}]);
