'use strict';

angular.module('serviceApp')
    .factory('SeoService', ['GlobalService', '$http', 'Formatter', '$location',function(GlobalService, $http, Formatter, $location) {
        var getSeoTags = function (url, urlData) {
            var minBudget, maxBudget, param = {};            
            if (url.slice(0,1) === '/') { 
		      url = url.slice(1);
	        }
            var api_url = 'data/v1/seo-text';
    	    if (url.slice(-1) === "/") {
        		url = url.slice(0, -1);   
    	    }
            param['url']        = ( urlData.redirectUrl ) ? urlData.redirectUrl : url;
            param['templateId'] = (urlData.templateId) ? urlData.templateId : "";
            param['cityName']   = (urlData.city) ? urlData.city : "";        
            param['localityId'] = (urlData.localityId) ? urlData.localityId : "";
            param['projectId']  = (urlData.projectId) ? urlData.projectId : "";
            param['propertyId'] = (urlData.propertyId) ? urlData.propertyId : "";
            param['builderId']  = (urlData.builderId) ? urlData.builderId : "";
            param['suburbId']   = (urlData.suburbId) ? urlData.suburbId : "";
            param['bedrooms']   = urlData.bedroom;
            
            // this has been hacked in urldataservice.js as well to handle upper limit i.e. greater than 25 lacs etc.
            if (urlData.maxBudget == '100000') {
                param['maxBudget']  = Formatter.filterFormatValue('0');
            }
            else {
                param['maxBudget']  = Formatter.filterFormatValue(urlData.maxBudget);
            }
            param['minBudget']  = Formatter.filterFormatValue(urlData.minBudget);

            $.each( param, function( key, val ) {
                if ( param[ key ] === '' ) {
                    delete param[ key ];
                }
            });

            if($location.path() == '/'){
                param['url'] = "/";
            }
            return GlobalService.callApiAndRespond(api_url + '?urlDetails='+decodeURIComponent(JSON.stringify(param)));
        };

        var parseSeoTags = function (data) {
            if (data) {
                var meta = data.meta;
                var footer = data.footer;
            }
            if (meta) {
                return {
                    footertext: meta.description,
                    title: meta.title,
                    metatags: {
                        'description': meta.description,
                        'DC.title': meta['DC.title'],
                        'keywords': meta.keywords,
                        'viewport': meta.viewport,
                        'geo.placename': meta['geo.placename'],
                        'geo.region': meta['geo.region'],
                        'country': meta.country,
                        'Author': meta.Author,
                        'googlebot': meta.googlebot,
                        'geo.position': meta['geo.position'],
                        'ICBM': meta.ICBM,
                        'property': meta.property
                    },
                    h1: meta.h1,
                    h2: meta.h2,
                    footer: footer
                };
            } else {
                return {};
            }
        };
        
        return {
            getSeoTags : getSeoTags,
            parseSeoTags : parseSeoTags
        };
}]);
