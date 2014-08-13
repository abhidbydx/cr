/**
   * Name: City Parser
   * Description: It will convert cities service response into format required by ui.    
   * @author: [Nakul Moudgil]
   * Date: Oct 06, 2013
**/
'use strict';
angular.module('serviceApp')
.factory('CityParser', function () {

    var parse = function(res){
        return res.data;
    };

    var parseCountry = function( cList ) {
        var nList = [];
        $.each( cList, function( idx, name ) {
            nList.push({
                id : idx,
                name : name
            });
        });
        return nList;
    };

    return {
        parse : parse,
        parseCountry : parseCountry
    };
});