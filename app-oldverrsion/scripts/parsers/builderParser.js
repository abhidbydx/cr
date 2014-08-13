'use strict';
angular.module('serviceApp')
.factory('BuilderParser',function () {

    var parseBuilder = function(response){
        var detail = response,
        NOT_ONGOING_PROJECTS = ["on hold", "cancelled", "not launched", "occupied", "ready for possession"];
        
        detail.onGoingProjects = 0;
        detail.totalProjects = 0;
        detail.experience = 0;
        
        if(detail.establishedDate){
            var est = new Date(detail.establishedDate),
                now = new Date();
                detail.experience = now.getFullYear() - est.getFullYear();
        }

        if (detail.projectStatusCount) {
            for (var status in detail.projectStatusCount) {
                if (detail.projectStatusCount[status]) {
                    if(NOT_ONGOING_PROJECTS.indexOf(status) === -1){
                        detail.onGoingProjects += detail.projectStatusCount[status];    
                    }
                    detail.totalProjects += detail.projectStatusCount[status];
                }
            }    
        }

        return detail;                  
    };

    var parsePopular = function( data, count ) {
        if ( !count ) {
            count = 4;
        }
        var retObj = [];
        for( var counter = 0; counter < data.length && counter < count; counter++ ) {
            retObj.push({
                id       : data[ counter ].id,
                propertyId: data[ counter ].id,
                name     : data[ counter ].name,
                url      : data[ counter ].url,
                imageUrl : data[ counter ].imageURL
            });
        }
        return retObj;
    };

    return {
        parsePopular : parsePopular,
        parseBuilder : parseBuilder
    }
});


