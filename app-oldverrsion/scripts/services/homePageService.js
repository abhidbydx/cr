'use strict';

angular.module('serviceApp').config(function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).factory('homePageService', function($http, GlobalService) {

    var getHomePageDetail = function() {
        var url = GlobalService.getAPIURL('app/v1/homepage');
        return $http.get(url).then(function(response) {
            if (response.status === 200) {
                return response.data.data;
            }
        });
    }

    return {
        getHomePageDetail: getHomePageDetail
    };

});
