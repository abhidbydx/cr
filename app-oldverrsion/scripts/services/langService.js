/**
   * Name: Language Service
   * Description: It will read language files in locale folder according to language passed and provide data
   * available in language file.
   * @author: [Nakul Moudgil]
   * Date: Sep 11, 2013
**/
'use strict';
angular.module('serviceApp')
  .factory('LangService', function ($http) {    
    return $http.get('scripts/locale/lang_en_IN.json')
    .then(function(response){
      return response.data;
    });
});