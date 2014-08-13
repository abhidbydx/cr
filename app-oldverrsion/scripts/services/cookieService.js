/**
   * Name: cookieService
   * Description: Service to work with cookies
   * @author: [Yugal Jindle]
   * Date: Jan 28, 2014
**/

'use strict';

angular.module('serviceApp').factory('cookieService', function() {
    var factory = {};

    /**
     * Function to add a project/property to recently viewed
     *     Eg:
     *         To  add a project  ~ addRecentlyViewed(1234);
     *         To  add a property ~ addRecentlyViewed(1234, 2);
     * @param {Number} projectId
     * @param {Number} typeId    (Optional)
     */
    factory.addRecentlyViewed = function(projectId, typeId) {
        typeId = typeId || 0;
    };

    /**
     * Function to get list of all recently viewed project ids.
     * @return {Array}            List of project ids
     */
    factory.getRecentlyViewed = function() {
        return [];
    };

    return factory;
});