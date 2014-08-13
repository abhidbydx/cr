/**
   * Name: Testimonial Service
   * Description: It will get employee testimonials   
   * @author: [Nakul Moudgil]
   * Date: Mar 12, 2014
**/
'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {        
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .factory('TestimonialService', function ($http, GlobalService, GetHttpService) {
    var headers = {
     'Content-Type' : 'application/x-www-form-urlencoded'
    };  
    var getTestimonials = function (){
    var url = GlobalService.getAPIURL('data/v1/entity/testimonial');
      return $http({method:'GET', 
        url: url,
        headers: headers})
      .then(function(response){
        GetHttpService.commonResponse( response, '' );
        if ( response.status === 200 ) {
          //  200OK
          return response.data.data;
        }
      });
    };
    return {
      getTestimonials : getTestimonials
    };
});