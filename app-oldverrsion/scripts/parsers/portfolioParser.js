/**
   * Name: Portfolio Parser
   * Description: It will convert portfolio service response into format required by ui.    
   * @author: [Nakul Moudgil]
   * Date: Oct 06, 2013
**/
'use strict';
angular.module('serviceApp')
    .factory('PortfolioParser', function (Formatter) {
        return {
            parsePortfolio: function(res){
                var portfolio = {};
                portfolio['Purchase Price'] = res.data.originalValue;
                portfolio['Current Price'] = res.data.currentValue;
                if(res.data.returnType === 'DECLINE'){
                    portfolio['Overall Return'] = -res.data.changeAmount;
                }
                else{
                    portfolio['Overall Return'] = res.data.changeAmount;  
                }
                portfolio.overallReturnPer = res.data.changePercent;
                portfolio.overallReturnType = res.data.returnType;
                return portfolio;
            },
            parseTrendForGraph: function(response){
                var getPriceFromDate = function( __obj, date ) {
                    for( var __cnt = 0; __cnt < __obj.length; __cnt++ ) {
                        if ( __obj[ __cnt ].effectiveDate == date ) {
                            return __obj[ __cnt ].price;
                        }
                    }
                    return null;
                };
                var obj = {}, allDateEpoch = [], allDate = [], cnt;
                if( response ) {
                    $.each( response, function( item, attr ) {
                        if( attr.prices ) {
                            $.each( attr.prices, function( __item, __attr ){
                                var __thisDate = __attr.effectiveDate;
                                if ( allDateEpoch.indexOf( __thisDate ) === -1 ) {
                                    allDateEpoch.push( __thisDate );
                                }
                            });
                        }
                    });
                    allDateEpoch = allDateEpoch.sort();
                    for( cnt = 0; cnt < allDateEpoch.length; cnt++ ) {
                        allDate[ cnt ] = Formatter.getDateMonth( allDateEpoch[ cnt ] ) + ' ' + Formatter.getDateYear( allDateEpoch[ cnt ] );
                    }
                    obj.yAxis = [];
                    $.each( response, function( item, attr ) {
                        var __data = {};
                        if( attr.prices ) {
                            var __tmpObj = attr.prices;
                            __data.name = attr.listingName;
                            __data.data = [];
                            for( cnt = 0; cnt < allDateEpoch.length; cnt++ ) {
                                __data.data.push( getPriceFromDate( attr.prices, allDateEpoch[ cnt ] ) );
                            }
                            obj.yAxis.push( __data );
                        }
                    });
                }
                obj.xAxis = allDate;
                return obj;
            },

            parseProperty: function(reqColumns, response){
                var propertyList = [],
                assignFunc = function(item, attr) {
                    if(reqColumns.indexOf(item) > -1){
                        if ( item == 'projectStatus' ) {
                            if ( attr ) {
                                propertyTemp[item] = Formatter.getProjectStatusKey(attr);
                                
                            }
                        }else{
                            propertyTemp[item] = attr;
                        }
                    }
                };
                if ( response ) {
                    for(var i = 0; i < response.length; i++){
                        var property = response[i], 
                        propertyTemp = {};
                        $.each(property, assignFunc);
                        propertyList.push(propertyTemp);
                    }
                }
                return propertyList;
            }
        };
    });
