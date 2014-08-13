/**
   * Name: Portfolio Others Directive
   * Description: pt-propertylist is curently shown on portfolio page to show all property listings of user
   * in grid format.
   * @author: [Nakul Moudgil]
   * Date: Oct 25, 2013
**/
'use strict';
angular.module('serviceApp').directive('ptConstructionupdate',function(){
    return{
      restrict : 'A',
      templateUrl : 'views/directives/portfolio/pt-constructionUpdate.html',
      //replace : true,
      controller: function($scope, $rootScope, ProjectService, ImageParser){
        $scope.cuWidgetName = $rootScope.labels.portfolio.label.PHOTO_GALLERY;
        $scope.portfolioCarouselSettings = {          
          skin: 'black',
          width: 839,
          height: 350,
          imageWidth: 520,
          imageHeight: 400,
        };
        $scope.$watch('property.projectId', function( newPropId, oldPropId ) {
          if ( typeof newPropId !== 'undefined' ) {            
            ProjectService.getImages('project', newPropId ).then(function(data){              
              var imageData = {};
              imageData.images = data;
                $scope.imageData = ImageParser.getProjectImage( imageData, 'type', 'construction' );
            });
          }
        });
      }
    }
  });
