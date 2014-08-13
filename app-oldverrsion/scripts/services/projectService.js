/**
 * Name: Project Service
 * Description: It will get projects from server   
 * @author: [Nakul Moudgil]
 * Date: Sep 30, 2013
 **/
'use strict';
angular.module('serviceApp').config(function($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).factory('ProjectService', function($q, GlobalService, $http, ImageParser, GetHttpService, LocalityService,$rootScope) {
  var activeRequest;

  var getProjectList = function(url, stats, callback) {
      var baseUrl;
      if(stats){
        baseUrl = 'app/v1/project-listing?stats='+stats+'&selector=';
      } else {
        baseUrl = 'app/v1/project-listing?selector=';
      }
      
      //if any active request exists the abort it and start a new one
      if (activeRequest) activeRequest.resolve();

      activeRequest = $q.defer();
      return $http({
        method: 'GET',
        url: GlobalService.getAPIURL(baseUrl + url),
        timeout: activeRequest.promise
      }).success(function(response) {
        var checkZeroResult = false;
        GetHttpService.commonResponseData(response, '', checkZeroResult);
          if (callback && response.statusCode && response.statusCode.substring(0,1) === '2')  {
			$rootScope.$broadcast('projectListingCallBack', {data: 'add'});
            callback(response, 200);
          }
      }).error(function(response) {
          if (response && callback && response.statusCode && response.statusCode.substring(0,1) === '5')  {
            callback(undefined, 500);
          }
      });
    };

  var getProjectPriceTrend = function(projectId, localityName, projectName) {
      return LocalityService.getHithertoPriceTrend( 'projectId', projectId );
      return {
        'project': {
          'minPrice': {
            xaxis: [
              "Sep 2013", "Oct 2013", "Nov 2013", "Dec 2013"
            ],
            yaxis: {
              name: projectName,
              data: [
                16944000, 16734000, 16564000, 16584000
              ]
            }
          },
          'maxPrice': {
            xaxis: [
              "Sep 2013", "Oct 2013", "Nov 2013", "Dec 2013"
            ],
            yaxis: {
              name: projectName,
              data: [
                19844000, 19644000, 18744000, 19644000
              ]
            }
          },
          'avgPrice': {
            xaxis: [
              "Sep 2013", "Oct 2013", "Nov 2013", "Dec 2013"
            ],
            yaxis: {
              name: projectName,
              data: [
                17844000, 17544000, 17644000, 17444000
              ]
            }
          }
        },
        'locality': {
          'minPrice': {
            xaxis: [
              "Sep 2013", "Oct 2013", "Nov 2013", "Dec 2013"
            ],
            yaxis: {
              name: localityName,
              data: [
                14344000, 14534000, 14564000, 14284000
              ]
            }
          },
          'maxPrice': {
            xaxis: [
              "Sep 2013", "Oct 2013", "Nov 2013", "Dec 2013"
            ],
            yaxis: {
              name: localityName, 
              data: [
                17444000, 17644000, 17344000, 17144000
              ]
            }
          }
        }
      };
    };

  var getProjectDetail = function(id, callback, args) {
      var baseUrl = 'app/v3/project-detail/';
      //if any active request exists the abort it and start a new one
      return $http({
	cache : true,
        method: 'GET',
        url: GlobalService.getAPIURL(baseUrl + id)
      }).then(function(response) {
        GetHttpService.commonResponse(response, '');
        if (response.status === 200) {
          //  200OK
          if (callback) callback(response.data, args);

          return response.data;
        }
      });
    };

  var getProjects = function(city, text) {
      var url = GlobalService.getAPIURL('app/v1/typeahead?typeAheadType=PROJECT&query=' + text);
      if (city) {
        url = GlobalService.getAPIURL('app/v1/typeahead?typeAheadType=PROJECT&query=' + text + '&city=' + city);
      }
      return $http.get(url).then(function(response) {
        GetHttpService.commonResponse(response, '');
        if (response.status === 200) {
          //  200OK
          return response.data.data;
        }
      });
    };

  var requestNewProject = function(project) {
      var url = GlobalService.getAPIURL('data/v1/entity/user/{userId}/unmatched-project');
      var postObj = {
        "projectName": project.project,
        "projectCity": project.city.label,
        "locality": project.locality.label
      };
      return $http.post(url, postObj).then(function(response) {
        GetHttpService.commonResponse(response, 'Your request has been submitted successfully.');
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      });
    };

  var getImages = function(type, id) {
      if (type !== null && id !== null) {
        var url = GlobalService.getAPIURL('data/v1/entity/image?objectType=' + type + '&objectId=' + id);
        return $http.get(url).then(function(response) {
          GetHttpService.commonResponse(response, '');
          if (response.status === 200) {
            //  200 OK
            return response.data.data;
          } else {
            return [];
          }
        });
      } else {
        return [];
      }
    };

  var getStats = function(query, callback) {
    query.paging = {
      start : 0,
      rows  : 5
    };

    var facets = ['builderLabelPriority', 'localityLabelPriority', 'suburbLabelPriority'], stats = ['size','budget'], obj = JSON.stringify(query),

    url = GlobalService.getAPIURL('app/v1/project-listing?selector=' + obj + '&facets=' + facets.join(',') + '&stats=' + stats.join(','));

    return $http.get(url).then(function(response) {
      if (response.status === 200) {
        //  200OK
        if (callback) {
          callback(response.data.data);
          return;
        }
        return response.data.data.facets;
      }
    });
  };

  var getSimilarProjects = function(projectId, callback) {
      var url = GlobalService.getAPIURL('data/v1/recommendation?projectId=' + projectId + '&type=similar&limit=4');
      return $http.get(url).then(function(response) {
        if (response.status === 200) {
          if (callback) {
            callback(response.data.data);
            return;
          }
          return response.data.data;
        }
      });
    };

		var getNearbyProjects = function(projectObj, callback) {
			var url = GlobalService.getAPIURL('app/v1/project-listing?selector={"filters":{"and":[{"notEqual":{"projectId":' + projectObj['id'] + '}},{"geoDistance":{"geo":{"distance":5,"lat":' + projectObj['lat'] + ',"lon":' + projectObj['long'] + '}}}]},"sort":{"field":"geoDistance","sortOrder":"ASC"},"paging":{"start":0,"rows":4}}');
			return $http.get(url).then(function(response) {
				if (response.status === 200) {
					if (callback) {
						callback(response.data.data.items);
						return;
					}
					return response.data.data;
				}
			});
		}

  return {
    getProjects: getProjects,
    getImages: getImages,
    getProjectList: getProjectList,
    getProjectPriceTrend: getProjectPriceTrend,
    requestNewProject: requestNewProject,
    getProjectDetail: getProjectDetail,
    getStats: getStats,
    getSimilarProjects: getSimilarProjects,
		getNearbyProjects: getNearbyProjects
  };
});
