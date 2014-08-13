/**
   * Name: Buy Header Service
   * Description: Provides links for buy header
   * @author: [Hemendra Srivastava]
   * Date: Sep 11, 2013
**/
'use strict';
angular.module('serviceApp')
    .factory('BuylinkService', [ 'Formatter','$rootScope', function( Formatter,$rootScope ) {
	var getBuyLinks = function (urldata) {
	    var obj = {}, areaName = ''; 
            var linkType=$rootScope.linkType;
            if(typeof($rootScope.linkType)=='undefined'){
                linkType='';
            } 
         if (urldata && urldata.projectId && urldata.city && urldata.locality) {
	    areaName = Formatter.ucword( urldata.locality );
		obj.apartment = {
		    text : "Apartments for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "apartments-flats-sale-" + urldata.locality.replace(/ /g, "-") + "-" +urldata.localityId
		};
		obj.villas = {
		    text : "Villas for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "villas-sale-" + urldata.locality.replace(/ /g, "-") + "-" +urldata.localityId
		};
		obj.plots = {
		    text : "Plots for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "sites-plots-sale-" + urldata.locality.replace(/ /g, "-") + "-" +urldata.localityId
		};
	    }
	    else if (urldata && urldata.localityId && urldata.city && urldata.locality) {
	    areaName = Formatter.ucword( urldata.locality );
		obj.apartment = {
		    text : "Apartments for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "apartments-flats-sale-" + urldata.locality.replace(/ /g, "-") + "-" +urldata.id
		};
		obj.villas = {
		    text : "Villas for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "villas-sale-" + urldata.locality.replace(/ /g, "-") + "-" +urldata.id
		};
		obj.plots = {
		    text : "Plots for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "sites-plots-sale-" + urldata.locality.replace(/ /g, "-") + "-" +urldata.id
		};
	    }
	     

	    else if (urldata && urldata.suburbId && urldata.city && urldata.suburb) {
		areaName = Formatter.ucword( urldata.suburb );
		obj.apartment = {
		    text : "Apartments for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "apartments-flats-sale-" + urldata.suburb.replace(/ /g, "-") + "-" +urldata.id
		};
		obj.villas = {
		    text : "Villas for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "villas-sale-" + urldata.suburb.replace(/ /g, "-") + "-" +urldata.id
		};
		obj.plots = {
		    text : "Plots for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "sites-plots-sale-" + urldata.suburb.replace(/ /g, "-") + "-" +urldata.id
		};
	    }
	    else if (urldata && urldata.cityId) {
	    areaName = Formatter.ucword( urldata.city );
		obj.apartment = {
		    text : "Apartments for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "apartments-flats-sale"
		};
		obj.villas = {
		    text : "Villas for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "villas-sale"
		};
		obj.plots = {
		    text : "Plots for sale in " + areaName,
		    link: linkType+urldata.city + "/" + "sites-plots-sale"
		};
	    }
	    else {
		obj.apartment = {
		    text : "Apartments for sale",
		    link: linkType+"apartments-flats-sale"
		};
		obj.villas = {
		    text : "Villas for sale",
		    link: linkType+"villas-sale"
		};
		obj.plots = {
		    text : "Plots for sale",
		    link: linkType+"sites-plots-sale"
		};

	    }
	    return obj;
	};

	var getEntity = function (urldata) {
	    
	    var entity;
	    
	    if (urldata && urldata.projectId && urldata.city && urldata.locality) {
		entity = "in " + Formatter.ucword( urldata.locality );
	    }
	    else if (urldata && urldata.localityId && urldata.city && urldata.locality) {
		entity = "in " + Formatter.ucword( urldata.locality );
	    }	    
	    else if (urldata && urldata.suburbId && urldata.city && urldata.suburb) {
		entity = "in " + Formatter.ucword( urldata.suburb );
	    }
	    else if (urldata && urldata.cityId) {
		entity = "in " + Formatter.ucword( urldata.city );
	    }
	    else {
		entity = "";
	    }

	    return entity;
	};

	var getBaseUrl = function (urldata) {
	    var baseUrl; 
            var linkType=$rootScope.linkType;
            if(typeof($rootScope.linkType)=='undefined'){
                linkType='';
            }
	    if (urldata && urldata.projectId && urldata.city && urldata.locality) {
		baseUrl = urldata.city + "/" + "property-sale-" + urldata.locality.replace(/ /g, "-") + "-" +urldata.localityId;
	    }
	    else if (urldata && urldata.localityId && urldata.city && urldata.locality) {
		baseUrl = urldata.city + "/" + "property-sale-" + urldata.locality.replace(/ /g, "-") + "-" +urldata.id;
	    }	    
	    else if (urldata && urldata.suburbId && urldata.city && urldata.suburb) {
		baseUrl = urldata.city + "/" + "property-sale-" + urldata.suburb.replace(/ /g, "-") + "-" +urldata.id;
	    }
	    else if (urldata && urldata.cityId) {
		baseUrl = urldata.city + "/" + "property-sale";
	    }
	    else {
		baseUrl = "property-sale";
	    }
	    return linkType+baseUrl;
	};  
       
			      
	return {
	    getBuyLinks : getBuyLinks,
	    getEntity : getEntity,
	    getBaseUrl : getBaseUrl
	};
    }]);
