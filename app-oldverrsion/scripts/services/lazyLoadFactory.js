/**
   * Name: Lazy Load
   * Description: Lazy loading helper
   * @author: [Yugal Jindle]
   * Date: Nov 21, 2013
**/

'use strict';

angular.module('serviceApp').factory('lazyLoadFactory', ['$window', '$q', function($window, $q) {

    var loadScript = function(url) {
        var deferred = $q.defer(),
            load = function() {
                var s = document.createElement('script');
                s.src = url;
                s.type = 'text/javascript';
                s.async = 'true';
                document.body.appendChild(s);
                deferred.resolve();
            };
        if(document.readyState === 'complete') {
            load();
        } else {
            window[addEventListener?'addEventListener':'attachEvent'](addEventListener?'load':'onload', load);
        }
        return deferred.promise;
    };

    return {
        loadScript  :   loadScript
    };
}]);
