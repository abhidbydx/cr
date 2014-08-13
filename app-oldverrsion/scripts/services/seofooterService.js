/**
   * Name: Seofooter Service
   * Description: It will read footer label and urls 
   * available in seo footer json file.
   * @author: [Nakul Moudgil]
   * Date: Sep 11, 2013
**/
'use strict';
angular.module('serviceApp')
  .factory('SeofooterService', function ($http, $rootScope, Constants) {    
    
    var getPageFooter = function () {
      return $http.get('scripts/locale/seo_footer.json')
      .then(function(response){
      return response.data;
      });

    };
   
    return {
      getPageFooter       : getPageFooter     
    }
});