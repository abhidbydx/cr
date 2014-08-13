'use strict';
angular.module('serviceApp') .config(function ( $httpProvider) {        
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).factory('CommonLocationService', function ( GlobalService, GetHttpService, $http ) {   

    var getBasicInfo = function(type, typeId, callback){

    	//Change this code once data api is built for locality
    	var url;
        if(type === "locality")
            url = GlobalService.getAPIURL('app/v1/'+type+'/'+typeId.toString());
        else
            url = GlobalService.getAPIURL('data/v1/entity/'+type+'/'+typeId.toString());

        return $http({
            cache : true,
            method : 'GET',
            url : url
        }).then(function (response) {
            GetHttpService.commonResponse(response, '');
            if (response.status === 200) {
                if ( callback ) {
                    callback(response.data.data);
                }
                else {
                    return response.data.data;
                }
            }
        });        
    };

    var getTopBuilders = function(type, typeId, callback){
        var url = GlobalService.getAPIURL('data/v1/entity/builder/top?selector={"fields":["name","url","imageURL"],"filters":{"and":[{"equal":{"'+type+'Id":["'+typeId+'"]}}]}}');
        
        return $http.get(url).then(function (response) {
            GetHttpService.commonResponse(response, '');
            if (response.status === 200) {
                callback(response.data.data);
            }
        });
    };

    var getTopLocalities = function(type, typeId, callback){
        var url = GlobalService.getAPIURL('data/v1/entity/locality/top-rated?'+type+'Id='+typeId+'&selector={"fields":["label","url","numberOfUsersByRating"],"paging":{"start":0,"rows":4}}');
        
        return $http.get(url).then(function(response) {
            GetHttpService.commonResponse(response, '');
            if (response.status === 200) {
                callback(response.data.data);
            }
        });
    };

    var getImages = function( type, id ) {
        var url = 'data/v1/entity/image?objectType=' + type + '&objectId=' + id;
        return GlobalService.callApiAndRespond( url );
    };

    return {
        getImages : getImages,
        getTopLocalities : getTopLocalities,
        getTopBuilders : getTopBuilders,
        getBasicInfo : getBasicInfo
    };

});
