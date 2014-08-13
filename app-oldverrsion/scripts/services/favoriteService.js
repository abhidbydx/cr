/**
   * Name: Favorite Service
   * Description: It will get user favorite data from server   
   * @author: [Nakul Moudgil]
   * Date: Jan 03, 2013
**/
'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .factory('FavoriteService', function (GlobalService, $http, $q, $rootScope) {
    var favorites = [];
      
    var getMyFavorites = function () {
      if(favorites && favorites.length > 0){
        var deferred = $q.defer();
        deferred.resolve(favorites);
        return deferred.promise;
      }
      else{
         var config = {
            method: 'GET',
            url: GlobalService.getAPIURL('data/v1/entity/user/{userId}/portfolio/wish-list/project'),
            cache:true
          };
        return $http(config)
        .then(function(response){
          favorites = response.data.data;
          return favorites;
        });
      }  
    };

    var broadcastChange = function(favorites){
      $rootScope.$broadcast('favChanged', favorites);
    };


    var isFav = function(projectId){
        var favFlag = false;
        if(favorites && favorites.length > 0){
          for(var index = 0; index < favorites.length; index++){
            if(favorites && favorites[index].projectId == projectId){
              favFlag = favorites[index].wishListId;
              return favFlag;
            }
          }
        }
        return favFlag;
    };

    var addToFavorites = function (projectId) {
      var postParam = {};
      postParam.projectId = projectId;
      return $http.post(GlobalService.getAPIURL('data/v1/entity/user/{userId}/wish-list'),postParam)
      .then(function(response){
        if(response){
          favorites = response.data.data;          
        }
        broadcastChange(favorites);
      });
    };

    var removeFromFavorites = function (favId) {
      var url = GlobalService.getAPIURL('data/v1/entity/user/{userId}/wish-list/') + favId;
      var config = {
        method: 'DELETE',
        url: url
      };
      return $http(config).
       then(function(response){
        if(response){
          favorites = response.data.data;
        }
        broadcastChange(favorites);
      });
    };

    return {
      getMyFavorites : getMyFavorites,
      addToFavorites : addToFavorites,
      removeFromFavorites : removeFromFavorites,
      isFav : isFav
    };
});
