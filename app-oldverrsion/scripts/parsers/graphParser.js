/**
   * Name: City Parser
   * Description: It will convert cities service response into format required by ui.
   * @author: [Nakul Moudgil]
   * Date: Oct 06, 2013
**/
'use strict';
angular.module('serviceApp')
	.factory('GraphParser', function( Formatter ) {
	var parseColumnObject = function(config, response){
		var dataArr = [];

		$.each(response, function(item, attr){
		var data = {};
		var index = config.seriesMeta.properties.indexOf(item); 
		if(index > -1){
			data.name = config.seriesMeta.name[index];//item;
			data.data = [attr];
			dataArr.push(data);
		}
		});
		return dataArr;
	};

	var parseStackedColumnObject = function(config, response){
		var dataArr = [];

		$.each(response, function(item, attr){
		var data = {};
		var index = config.seriesMeta.properties.field.indexOf(item); 
		if(index > -1){
			data.name = config.seriesMeta.properties.name[index];//item;
			if (typeof attr !== "object") {
				data.data = [attr];
			}
			else {
				data.data = attr.data;
				if (attr.color) {
					data.color = attr.color;
				}
				if (attr.legendIndex) {
					data.legendIndex = attr.legendIndex;
				}
				if (attr.type) {
					data.type = attr.type;
				}
				if (attr.marker) {
					data.marker = attr.marker;
				}
			}
			dataArr.push(data);
		}		
		});

		return dataArr;
	};

	/*Response parameter for this method should be in format {xAxis:[''],yAxis:[{name,data}]}*/
	var parseAreaObject = function(config, response){
		return response;
	};

        var parseWaterFallObject = function(config, response) {
            var dataArr = [], tempArr = [], dataObj = {
                name: 'Initial Investment<br/>(\u20B9 ' + Formatter.formatPrice(response['Initial Investment'].data) + ')',
                color: '#0CC4E5',
                data: []
            };
            dataArr.push(dataObj);

            dataArr.push({
                name: 'Overall Return',
                color: '#88D116',
                data: [
                    {y: 0},
                    {y: 0}
                ]
            });
            dataArr.push({
                name: 'Current Value<br/>(\u20B9 ' + Formatter.formatPrice(Math.abs(response['Current Value'].data)) + ')',
                color: '#2166E3',
                data: [
                    {y: 0},
                    {y: 0}
                ]
            });

            tempArr.push({name : 'Initial Investment', data : response['Initial Investment']});
            tempArr.push({name : 'Overall Return', data :response['Overall Return']});
            tempArr.push({name : 'Current Value', data :response['Current Value']});


            _.each(tempArr, function(base){
                var item = base.name, attr = base.data;


                var data = {};
                var index = config.seriesMeta.properties.field.indexOf(item);
                if(index > -1){
                    data.name = config.seriesMeta.properties.name[index];//item;
                    if (data.name == 'Overall Return') {
                        if (attr.data < 0) {
                            data.name = 'Overall Decline';
                            dataArr[1].name = 'Overall Decline<br/>(\u20B9 ' + Formatter.formatPrice(Math.abs(attr.data)) + ')';
                            dataArr[1].color = '#f84000';
                        } else {
                            data.name = 'Overall Gain';
                            dataArr[1].name = 'Overall Gain<br/>(\u20B9 ' + Formatter.formatPrice(Math.abs(attr.data)) + ')';
                            dataArr[1].color = '#88D116';
                        }
                    }
                    if (typeof attr !== "object") {
                        data.y = [attr];
                    }
                    else {
                        data.y = attr.data;
                        if (attr.color) {
                            data.color = attr.color;
                        }
                        if (attr.legendIndex.toString().length > 0) {
                            data.legendIndex = attr.legendIndex;
                        }
                        if (attr.type) {
                            data.type = attr.type;
                        }
                        if (attr.marker) {
                            data.marker = attr.marker;
                        }
                    }
                    dataArr[0].data.push(data);
                }
            });
            return dataArr;
        };
	
	var parse = function(config, response){
		var call = '';
		switch(config.subtype){
		case 'column':
		call = parseColumnObject;
		break;
		case 'column-stacked':
		call = parseStackedColumnObject;
		break;
		case 'line':
		call = parseAreaObject;
		break;
		case 'area':
		call = parseAreaObject;
		break;
            case 'waterfall':
                call = parseWaterFallObject;
                break;
		}
		return call(config, response);
	};

	var __mainLocationFirst = function( myObject, mainKey ) {
		var newObj = [], tmp = {};
		if ( myObject[ mainKey ] ) {
			tmp[ mainKey ] = myObject[ mainKey ];
			newObj.push( tmp );
		}
		$.each( myObject, function( __key, __data ) {
			tmp = {};
			if ( __key !== mainKey ) {
				tmp[ __key ] = myObject[ __key ];
				newObj.push( tmp );
			}
		});
		return newObj;
	};

	var parseLocalityComparision = function( data, featured ) {
		var xAxis = [], yAxis = [];
		$.each( data, function( localityId, __data ) {
			if ( __data[0].extraAttributes.wavgPricePerUnitAreaOnSupply ) {
				xAxis.push( localityId );
				yAxis.push( parseInt( __data[0].extraAttributes.wavgPricePerUnitAreaOnSupply ) );
			}
		});
		return {
			xAxis : xAxis,
			yAxis : yAxis
		};
	};

	var parseBedPrice = function( data ) {
		var bedCount = 0,
			retObj = {
				bed : [],
				min : [],
				max : [],
				mean: []
			};
		$.each( data, function( bed, values ) {
			if ( values[0].extraAttributes.minBudget && values[0].extraAttributes.maxBudget && values[0].extraAttributes.avgBudget ) {
				bedCount++;
				if ( bed === '0' || bed === 0 ) {
					retObj.bed.push( 'Plot' );
				}
				else {
					retObj.bed.push( bed + ' BHK' );
				}
				retObj.min.push( values[0].extraAttributes.minBudget );
				retObj.max.push( values[0].extraAttributes.maxBudget );
				retObj.mean.push( values[0].extraAttributes.avgBudget );
			}
		});
		if ( bedCount === 0 ) {
			retObj = false;
		}
		return retObj;
	};

	var getCountBySize = function( data, cityId, intervalStr ) {
		var count = [], range = [], pieData = [], unit = ' per sq ft',
			__keys = ( intervalStr ) ? __getKeysFromIntervalString( intervalStr ) : _.keys( data );
		if ( data && _.keys( data ).length ) {
			for ( var i = 0; i < __keys.length; i++ ) {
				if ( data[ __keys[ i ] ][ cityId ] ) {
					count.push( data[ __keys[ i ] ][ cityId ][0].extraAttributes.countDistinctProjectId );
					if ( __keys[ i ].indexOf( '-' ) === 0 ) {
						range.push( '< ' + __keys[ i ].substr( 1, __keys[ i ].length ) + unit );
					}
					else if ( __keys[ i ].indexOf( '-' ) === __keys[ i ].length - 1 ) {
						range.push( __keys[ i ].substr( 0, __keys[ i ].length - 1 ) + '+' + unit );
					}
					else {
						range.push( __keys[ i ] + unit );
					}
				}
			}
		}
		for( var counter = 0; counter < range.length; counter++ ) {
			pieData.push([ range[ counter ], count[ counter ] ]);
		}
		return {
			range : range,
			pieData: pieData,
			count : count
		};
	};

	var __getKeysFromIntervalString = function( intervalStr ) {
		var __keys = [], pre = '', post = '', tmp = '';
		if ( intervalStr ) {
			var arr = intervalStr.split(',');
			for( var i = 0; i < arr.length; i++ ) {
				post = arr[ i ];
				tmp = pre + '-' + post;
				__keys.push( tmp );
				pre = post;
			}
			if ( post ) {
				__keys.push( post + '-' );
			}
		}
		return __keys;
	};

	var parseHithertoPriceTrend = function( data, fullYear, portParse ) {
		var sortedMonth = _.keys( data ).sort(),
			counter = 0,
			__month = '',
			__subObj = {},
			retVal = {
				'avg' : [],
				'keys': []
			};

		for ( var j = 0; j < sortedMonth.length; j++ ) {
			__subObj = data[ sortedMonth[ j ] ];
			__month = parseInt( sortedMonth[ j ], 10 );
			if ( __subObj && __subObj[0].extraAttributes.wavgPricePerUnitAreaOnSupply ) {
				retVal.avg.push( parseInt( __subObj[0].extraAttributes.wavgPricePerUnitAreaOnSupply ) );
				retVal.keys.push( Formatter.epochToISTMonth( __month, !(!!fullYear)) );
				counter++;
			} else if (__subObj && portParse) {
                retVal.avg.push(null);
                retVal.keys.push( Formatter.epochToISTMonth( __month, !(!!fullYear)) );
                counter++;
            }
		}

		if ( counter === 0 ) {
			retVal = false;
		}
		return retVal;
	};

	var parseDemand = function( data, localityId, count ) {
        if ( !count || parseInt( count, 10 ) <= 2 ) {
            count = 5;
        }
        var retObj = [],
            xAxis = [], yAxis = [],
            featuredObj = {},
            __percentage = 0,
            localityName = '', maxKey = '',
            customer = {}, customerMin = '',
            thisCustomer = 0, customerSum  = 0,
            customerRev  = 0;

        if ( localityId && data[ localityId ] ) {
            featuredObj = data[ localityId ];
            delete data[ localityId ];
            count--;
        }
        $.each( data, function( locId, __data ) {
            thisCustomer = __data[0].extraAttributes.sumCustomerDemand;
            customerSum += thisCustomer;
            if ( !customerMin ) {
                customerMin = locId;
            }
            if ( _.keys( customer ).length < count ) {
                customer[ locId ] = thisCustomer;
                if ( thisCustomer < customer[ customerMin ] ) {
                    customerMin = locId;
                }
            }
            else {
                if ( thisCustomer > customer[ customerMin ] ) {
                    customer[ locId ] = thisCustomer;
                    delete customer[ customerMin ];
                    customerMin = minMaxKeyValue( customer, 'min' );
                }
            }
        });

        //  add the locality info in starting
        if ( _.keys( featuredObj ).length && customerSum !== 0 ) {
            localityName = featuredObj[0].localityName;
            thisCustomer = featuredObj[0].extraAttributes.sumCustomerDemand;
            customerSum += thisCustomer;
            customerRev = parseFloat( ( thisCustomer / customerSum ) * 100 );
            xAxis.push( localityName );
            yAxis.push( {y : customerRev, color : '#c4f1ff'} );
        }

        if ( customerSum !== 0 ) {
            while( _.keys( customer ).length > 0 ) {
                maxKey = minMaxKeyValue( customer, 'max' );
                __percentage = parseFloat( ( customer[ maxKey ] / customerSum ) * 100 );
                customerRev += __percentage;
                xAxis.push( data[ maxKey ][0].localityName );
                yAxis.push( __percentage );
                delete customer[ maxKey ];
            }

            // to get "Others" uncomment the following code
            // xAxis.push( 'Others' );
            // yAxis.push( 100 - customerRev );
            // retObj.push( [ 'Others', 100 - customerRev ] );
        }

        return {
            xAxis : xAxis,
            yAxis : yAxis
        };
    };

    var minMaxKeyValue = function( myObj, minMax ) {
        var mainKey = '', mainVal = 0;
        $.each( myObj, function( key, val ) {
            if ( !mainKey ) {
                mainKey = key;
                mainVal = val;
            }
            if ( minMax === 'min' ) {
                if ( val < mainVal ) {
                    mainKey = key;
                    mainVal = val;
                }
            }
            else {
                if ( val > mainVal ) {
                    mainKey = key;
                    mainVal = val;
                }
            }
        });
        return mainKey;
    };

	var parseStatusCount = function( data ) {
		var retObj = {
			'Launching Soon' 	: 0,
			'New Launch'		: 0,
			'Under Construction': 0,
			'Ready to Move In'	: 0,
			'On Hold'			: 0
		},
		__type = '',
		showGraph = 0;

		$.each( data, function( type, __data ) {
			__type = Formatter.getProjectStatusKey( type );
			if ( __type !== 'NA' && __type in retObj ) {
				retObj[ __type ] += __data;
				showGraph++;
			}
		});
		//	check if more than one non zero entries available
		if ( showGraph === 0 ) {
			retObj = false;
		}
		return retObj;
	};

	var showCountOnBar = function( valArr ) {
		var retObj = [];
		for( var cnt = 0; cnt < valArr.length; cnt++ ) {
			retObj.push({
				y : valArr[ cnt ],
				t : valArr[ cnt ].toString()
			});
		}
		return retObj;
	};

	return {
		parse : parse,
		parseDemand    : parseDemand,
		getCountBySize : getCountBySize,
		parseBedPrice  : parseBedPrice,
		showCountOnBar : showCountOnBar,
		parseStatusCount : parseStatusCount,
		parseHithertoPriceTrend : parseHithertoPriceTrend,
		parseLocalityComparision : parseLocalityComparision
	};
});
