/**
   * Name: careersCtrl
   * Description: This is controller of Careers page.
   * @author: [Nakul Moudgil]
   * Date: Mar 12, 2014
**/
'use strict';
angular.module('serviceApp')
  .controller('testimonialCtrl', ['$scope', '$rootScope', 'TestimonialService', function ($scope, $rootScope, TestimonialService) {
      TestimonialService.getTestimonials().then(function (data) {
        $scope.testimonials = data;
        /*$.each($scope.testimonials, function(item,attr){
          attr.uiLabel = attr.jobTitle;
          if(attr.noOfPosition){
            attr.uiLabel = attr.uiLabel.concat(' -' + attr.noOfPosition + ' ')
          }
          if(attr.location){
            attr.uiLabel = attr.uiLabel.concat(' (' + attr.location + ')')
          }
        })*/
      });
      //set page name
      $rootScope.CURRENT_ACTIVE_PAGE = 'Testimonial';
      //Page view call for GA/MIXPANEL
      $rootScope.TrackingService.pageViewedCall();
  }]);
