'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {        
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).factory('ImageService', function (GlobalService, GetHttpService, $http) {   

    var getImages = function(objectType, objectId, imageType, callback){

    	//Change this code once data api is built for locality
    	var url = 'data/v1/entity/image?objectType='+objectType+'&objectId='+objectId;

      if(imageType){
        url = url+"&type="+imageType;
      }

      url = GlobalService.getAPIURL(url);
        return $http.get(url).then(function (response) {
              GetHttpService.commonResponse(response, '');
              if (response.status === 200) {
                callback(response.data.data);
              }
        });
    }

    return {
        getImages : getImages
    };

});