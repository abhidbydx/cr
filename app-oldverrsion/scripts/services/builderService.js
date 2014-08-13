/**
   * Name: Search Service
   * Description: It will get bulder overlay data
   * @author: [Hardeep Singh]
**/
'use strict';
angular.module('serviceApp').config(function($httpProvider) {        
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
      }).factory('BuilderService', function (GlobalService, GetHttpService, $http ){

          var getBuilderCardInfo = function(builderId, callback){
            var baseUrl = "app/v1/builder-detail/"+builderId.toString();
            return $http({
		method  :   'GET',
		cache   :   true,
		url     :   GlobalService.getAPIURL(baseUrl)
	    }).then(function(response){
              GetHttpService.commonResponse(response);
              if(response.status === 200)
                  return callback(response.data.data);
            });
          };

          var getBuilder = function( cityId, callback ) {
            var url = GlobalService.getAPIURL('app/v1/project-listing?selector={"filters":{"and":[{"equal":{"cityId":["'+ cityId +'"]}}]}}&facets=builderLabel');
            return $http.get( url ).then( function( response ) {
              GetHttpService.commonResponse( response );
              if ( response.status === 200 ) {
                //  200OK
                callback( response.data.data.facets.builderLabel );
              }
            });
          };

          var getProjects = function(builderId, cityId, callback){
            var baseUrl = 'app/v1/project-listing?selector={"fields":["projectId","name","URL","address","imageURL","minResaleOrPrimaryPrice","maxResaleOrPrimaryPrice","locality","suburb","city","label"],"paging":{"start":0,"rows":4},"filters":{"and":[{"equal":{"builderId":'+builderId.toString()+'}}]}}';
            if ( cityId ) {
              baseUrl = 'app/v1/project-listing?selector={"fields":["projectId","name","URL","address","imageURL","minResaleOrPrimaryPrice","maxResaleOrPrimaryPrice","locality","suburb","city","label"],"paging":{"start":0,"rows":4},"filters":{"and":[{"equal":{"cityId":['+ cityId.toString() +']}},{"equal":{"builderId":['+ builderId.toString() +']}}]}}';
            }
            return $http.get(GlobalService.getAPIURL(baseUrl)).then(function(response){
              GetHttpService.commonResponse(response);
              if(response.status === 200)
                callback(response.data.data);
            });
          };

          var getAllBuilder = function( type, id, start, row, getOnlyUrl ) {
            if ( !start ) {
              start = 0;
            }
            if ( !row ) {
              row = 9999; //  too large to get all elements
            }
            var baseUrl = 'data/v1/entity/builder/top?selector={"filters":{"and":[{"equal":{"' + type + 'Id":["' + id + '"]}}]},"fields":["id","name","imageURL","url"],"paging":{"start":' + start + ',"rows":' + row + '}}';
            if ( getOnlyUrl ) {
              return baseUrl;
            }
            return GlobalService.callApiAndRespond( baseUrl );
          };

        return {
          getCard: getBuilderCardInfo,	
          getBuilder : getBuilder,
          getAllBuilder : getAllBuilder,
          getProjects : getProjects
        };
      });
