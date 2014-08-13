/**
 * Name: Locality Parser
 * Description: Parser to format locality service data ( mainly to trim out unused data )
 * @author: [Swapnil Vaibhav]
 * Date: Jan 02, 2014
**/
'use strict';
angular.module( 'serviceApp' ).factory( 'LocalityParser', ['$filter', 'ImageParser', 'GraphParser', 'Formatter', function ($filter, ImageParser, GraphParser, Formatter) {

    // data formatting functions
    var priceFormat = $filter('priceFormat');
    var dateFormat = $filter('dateFormat');

    var getParsedAreaData = function( data, type ) {
        var retVal = {};
        if ( type === 'locality' || type === 'Locality' ) {
            retVal = getParsedLocality( data );
        }
        else if ( type === 'suburb' || type === 'Suburb' ) {
            retVal = getParsedSuburb( data );
        }
        else if ( type === 'city' || type === 'City' ) {
            retVal = getParsedCity( data );
        }
        return retVal;
    };

    var __getRating = function( averageRating, ratingsCount, totalReviews, numberOfUsersByRating ) {
        var rating = {};
        //    leading '+' sign will make it return a number instead of string
        rating.averageRating = +parseFloat( averageRating ).toFixed(2);
        if ( averageRating > 0 ) {
            rating.ratingsCount = ratingsCount;
            rating.totalReviews = ( totalReviews ) ? parseInt( totalReviews, 10 ) : 0;
            if ( numberOfUsersByRating ) {
                rating.numberOfUsersByRating = numberOfUsersByRating;
            }
        }
        return rating;
    };

    var __getTrend = function( avgPriceRisePercentage, avgPriceRiseMonths, livabilityScore, safetyScore ) {
        //    price trend
        var trend = {};
        if ( avgPriceRisePercentage ) {
            trend.avgPriceRisePercentage = +parseFloat( avgPriceRisePercentage ).toFixed(2);
            trend.avgPriceRiseMonths = avgPriceRiseMonths;
        }
        if(livabilityScore){
            trend.livabilityScore = livabilityScore.toFixed( 1 );
        }
        if(safetyScore){
            trend.safetyScore = safetyScore.toFixed( 1 );
        }
        return trend;
    };

    var __getPriceTrendInfo = function( id, type, name, url ) {
        var pTrend = {};
        if ( id && type && name ) {
            pTrend = {
                id : id,
                type : type,
                name : name,
                url  : url
            };
        }
        return pTrend;
    };

    var __makeStatusObject = function( mainObj, key, count ) {
        if ( mainObj[ key ] ) {
            mainObj[ key ] += count;
        }
        else {
            mainObj[ key ] = count;
        }
        return mainObj;
    };

    var __getOverview = function( data ) {
        var overview = {};
        overview.title = 'Overview';
        overview.projectCount = 0;
        overview.projectStatusCount = [];
        var psc = GraphParser.parseStatusCount( data.projectStatusCount );
        $.each( psc, function( __status, __count ) {
            if ( __count !== 0 ) {
                overview.projectStatusCount.push({
                    type : __status,
                    projectCount : __count
                });
                overview.projectCount += __count;
            }
        });

        if ( data.description ) {
            overview.fullDescription = data.description;
        }
        else if ( data.suburb && data.suburb.city && data.suburb.city.description ) {
            overview.fullDescription = data.suburb.city.description;
        }
        else if ( data.city ) {
            //  suburb case
            overview.fullDescription = data.city.description;
        }

        if ( overview.fullDescription ) {
            var smallLength = 500;
            if ( overview.fullDescription.length > smallLength - 10 ) {
                var strippedFullDesc = Formatter.stripHtml(overview.fullDescription);
                overview.smallDescription = strippedFullDesc.substring( 0, smallLength ) + '... ';
                if ( overview.fullDescription.length > smallLength + 350 ) {
                    overview.semiDescription = strippedFullDesc.substring( 0, smallLength + 300 ) + '... ';
                }
                else {
                    overview.semiDescription = overview.fullDescription;
                }
                overview.showLessMore = true;
            }
            else {
                overview.smallDescription = overview.fullDescription;
                overview.showLessMore = false;
            }
        }

        if ( data.images ) {
            var __img = [];
            for ( var i = 0; i < data.images.length; i++ ) {
                if ( i === 2 ) {
                    //    only 2 images needed for now
                    break;
                }
                var __tmp = {
                    id : data.images[i].id,
                    title : data.images[i].title,
                    description : data.images[i].description,
                    absolutePath : data.images[i].absolutePath,
                    smallPath: Formatter.getImagePath(data.images[i].absolutePath, 'SMALL')
                };
                __img.push( __tmp );
            }
            if ( __img.length > 0 ) {
                overview.images = __img;
            }
            overview.gallery = ImageParser.getLocalityImage( data.images, 'type' );
            var imgCount = overview.gallery.imageCount;
            if ( imgCount > 2 ) {
                overview.moreImageCount = ( imgCount - 2 ) + ' more photo(s)';    //    index starts with 0 ( zero )
            }
        }

        if ( data.avgBHKPricePerUnitArea !== undefined ) {
            var intRegex = /^\d+$/, priceObj = [], total = 0, counter = 0;
            __tmp = {};
            $.each( data.avgBHKPricePerUnitArea, function( idx, avgPrice ) {
                if( intRegex.test( idx, 10 ) && parseInt( idx, 10 ) > 0 ) {
                    var intPrice = parseInt( avgPrice, 10 );
                    __tmp = {
                        bhk : idx + 'BHK',
                        price : intPrice
                    };
                    priceObj.push( __tmp );
                    total += intPrice;
                    counter++;
                }
            });
            if ( counter > 0 ) {
                overview.avgBHKPricePerUnitArea = priceObj;
                overview.overAllAvgPrice = parseInt( data.avgPricePerUnitArea, 10 );
            }
        }

        return overview;
    };

    var __getStaticMapUrl = function( latitude, longitude ) {
        return    'http://maps.googleapis.com/maps/api/staticmap?'+
                'sensor=true&markers=color:orange|'+ latitude +','+ longitude +'&'+
                'zoom=13&key=AIzaSyDbRuLAZT21GhEr4t_jByWYQ-VwFt_zHhg&'+
                'size=640x200&scale=1&style=saturation:-80';
    };

    var __getAmenities = function( amenityTypeCount ) {
        var amenity = [],
            allowed = [
                'school',
                'hospital',
                'bank',
                'atm',
                'restaurant',
                'gas_station',
                'bus_station',
                'train_station',
                'airport',
                //'play_school',
                //'higher_education'
            ];
        if ( amenityTypeCount && (_.keys( amenityTypeCount ).length !== 0) ) {
            $.each( amenityTypeCount, function( __name, __cnt ) {
                if(allowed.indexOf(__name) !== -1) {
                    amenity.push({
                        'name' : getCleanName( __name ),
                        'count': __cnt,
                        'class': Formatter.getClassByAmenity( __name )
                    });
                }
            });
        }
        return amenity;
    };

    var __getCityObject = function( id, name ) {
        var obj = {};
        if ( id ) {
            obj.id = id;
        }
        if ( name ) {
            obj.name = name;
        }
        return obj;
    };

    var minimalLocality = function(locality, amenities){
        if (locality) {
            if(amenities){
                locality.amenityTypeCount = _.pick(locality.amenityTypeCount, amenities);    
            }
            
            locality.ratings = __getRatingFromLocality( locality );
        }
        return locality;
    };

    var __getRatingFromLocality = function( locality ) {
        return {
            averageRating : locality.averageRating,
            ratingsCount: locality.ratingsCount,
            numberOfUsersByRating: locality.numberOfUsersByRating
        };
    };

    var getParsedCity = function( data ) {
        var areaData = {};
        areaData.cityId = data.id;
        areaData.cityName = data.label;

        areaData.exploreUrl = data.url;
        areaData.cityUrl = data.url;

        areaData.trend = __getTrend( data.avgPriceRisePercentage, data.avgPriceRiseMonths, data.livabilityScore, data.safetyScore );
        
        if ( data.centerLatitude && data.centerLongitude ) {
            areaData.mapUrl = __getStaticMapUrl( data.centerLatitude, data.centerLongitude );
            areaData.position = {
                fullName: data.label,
                latitude : data.centerLatitude,
                longitude: data.centerLongitude
            };
        }

        areaData.overview = __getOverview( data );

        areaData.priceTrend = __getPriceTrendInfo( data.id, 'city', data.label, data.url );
        areaData.priceTrend.cityInfo = __getCityObject( areaData.cityId, areaData.cityName );

        return areaData;
    };

    var getParsedSuburb = function( data ) {
        var areaData = {};
        areaData.cityId = data.cityId;
        areaData.cityName = data.city.label;
        areaData.cityUrl = data.city.url;

        areaData.locSubId = data.id;
        areaData.locSubName = data.label;
        areaData.locSubUrl = data.url;

        areaData.exploreUrl = data.url;

        areaData.trend = __getTrend( data.avgPriceRisePercentage, data.avgPriceRiseMonths, data.livabilityScore, data.safetyScore );

        //    neighborhood map
        if ( data.city.centerLatitude && data.city.centerLongitude ) {
            areaData.mapUrl = __getStaticMapUrl( data.city.centerLatitude, data.city.centerLongitude );
            areaData.position = {
                fullName: data.label,
                latitude : data.city.centerLatitude,
                longitude: data.city.centerLongitude
            };
        }

        areaData.overview = __getOverview( data );

        areaData.priceTrend = __getPriceTrendInfo( data.id, 'suburb', data.label, data.url );
        areaData.priceTrend.cityInfo = __getCityObject( areaData.cityId, areaData.cityName );

        return areaData;
    };

    var getParsedLocality = function( data ) {
        var areaData = {};
        areaData.cityId = data.cityId;
        areaData.cityName = data.suburb.city.label;
        areaData.cityUrl = data.suburb.city.url;

        areaData.locSubId = data.localityId;
        areaData.locSubName = data.label;
        areaData.locSubUrl = data.url;

        areaData.exploreUrl = data.url;
        if ( data.overviewUrl ) {
            areaData.overviewUrl = data.overviewUrl;
        }

        //    check because sometimes it returns empty object
        areaData.amenityTypeCount = __getAmenities( data.amenityTypeCount );

        areaData.rating = __getRating( data.averageRating, data.ratingsCount, data.totalReviews, data.numberOfUsersByRating );

        areaData.trend = __getTrend( data.avgPriceRisePercentage, data.avgPriceRiseMonths, data.livabilityScore, data.safetyScore);

        //    neighborhood map
        if ( data.latitude && data.longitude ) {
            areaData.mapUrl = __getStaticMapUrl( data.latitude, data.longitude );
            areaData.position = {
                fullName: data.label,
                latitude : data.latitude,
                longitude: data.longitude
            };
        }
        else if ( data.suburb.city.centerLatitude && data.suburb.city.centerLongitude ) {
            //    if not locality then send city coordinates
            areaData.mapUrl = __getStaticMapUrl( data.suburb.city.centerLatitude, data.suburb.city.centerLongitude );
            areaData.position = {
                fullName: data.suburb.city.label,
                latitude : data.suburb.city.centerLatitude,
                longitude: data.suburb.city.centerLongitude
            };
        }

        areaData.overview = __getOverview( data );

        areaData.priceTrend = __getPriceTrendInfo( data.localityId, 'locality', data.label, data.url );
        areaData.priceTrend.cityInfo = __getCityObject( areaData.cityId, areaData.cityName );
        return areaData;
    };

    //parse the shallow object of locality
    var parseLocalityList = function(loc){
		var proj = ' projects ';
        var cnt = loc.projectStatusCount['Launch'];
        loc.selector = 'locality_'+loc.localityId;
        loc.avgPricePerUnitArea = priceFormat(loc.avgPricePerUnitArea);
        loc.avgPriceRisePercentage = loc.avgPriceRisePercentage ? Math.round(loc.avgPriceRisePercentage).toFixed(0) : 0;
        if(loc.projectCount === 1){
            proj = ' project ';
        }
        loc.projectCountTitle = 'Total '+loc.projectCount+proj+'in '+loc.label;
        if( cnt ){
            loc.newLaunchProjectCountTitle = cnt+' out of '+loc.projectCount+proj+'newly launched';
            loc.prelaunch = cnt;
            loc.prelaunchHtml = '| <span class="proj-status">'+cnt+'</span> New Launch';
        }
        loc.projectCountText = loc.projectCount+proj;
        //setting html to avoid watch in html
        loc.priceRiseHtml = '';
        if( loc.avgPriceRisePercentage > 0) {
            loc.priceRiseHtml = 'In past <span>'+loc.avgPriceRiseMonths+'</span> months : <span class="green"><strong>'+loc.avgPriceRisePercentage+'%</strong> <i class="fa fa-arrow-up"></i></span><br/>';
        } else if( loc.avgPriceRisePercentage < 0 ) {
			loc.avgPriceRisePercentage = loc.avgPriceRisePercentage.replace(/^-/, '');
            loc.priceRiseHtml = 'In past <span>'+loc.avgPriceRiseMonths+'</span> months : <span class="grey"><strong>'+loc.avgPriceRisePercentage+'%</strong> <i class="fa fa-arrow-down"></i></span><br/>';
        }
        if( loc.avgPricePerUnitArea !== 'NA') {
            loc.unitPriceHtml = 'Avg. Rate: <i class="fa fa-inr"></i><span>'+loc.avgPricePerUnitArea+'</span> /sq ft';
        }

        return loc;
    };

    var parseLeadFormData = function (response) {
    var locality = {};
    var suburb = {};

    for (var locality_id in response.data) {
        var locality_obj = response.data[locality_id];
        locality[locality_obj.localityId] = locality_obj.label;
        if (locality_obj.suburb)
        suburb[locality_obj.suburb.id] = locality_obj.suburb.label;
    };
    
    var locData = [];
    // for (var sid in suburb) {
    //     locData.push({"id":sid, "label":suburb[sid], "type":"Suburb"});
    // }
    for (var locid in locality) {
        locData.push({"id":locid, "label":locality[locid]});
    }
    
    return locData;
    };

    var parseLocality = function(response){
        var locality = {};
        locality = response.data;

        //handle amenities
        locality.amenityList = [];
        var derAmenity = locality.amenityTypeCount;
        for(var amenity in derAmenity){
            var obj = {name: amenity.replace("_", " ").toUpperCase(), count: derAmenity[amenity]};
             locality.amenityList.push(obj);
        }

        locality.ratings = {averageRating : locality.averageRating, ratingsCount: locality.ratingsCount};

        return locality;
    };

    var getCleanName = function( __n ) {
        return __n.trim().toUpperCase().replace( '_', ' ' );
    };

    var parseNearBy = function( data, count, returnOverviewUrl ) {
        if ( !count ) {
            count = 4;
        }
        var retObj = [], mainCounter = 0;
        for( var counter = 0; counter < data.length && mainCounter < count; counter++ ) {
            if( !data[ counter ].geoDistance ) {
                continue;
            }
            var __tmp = {
                name : data[ counter ].label
            };
            if ( data[ counter ].localityId ) {
                __tmp.localityId = data[ counter ].localityId;
                __tmp.propertyId = data[ counter ].localityId;
            }
            if ( returnOverviewUrl &&  data[ counter ].overviewUrl ) {
                __tmp.url = data[ counter ].overviewUrl;
            }
            else if ( data[ counter ].url ) {
                __tmp.url = data[ counter ].url;
            }
            __tmp.subName = parseFloat( data[ counter ].geoDistance ).toFixed( 2 ) + ' km';
            retObj.push( __tmp );
            mainCounter++;
        }
        return retObj;
    };

    var parseTopRated = function( data, count ) {
        if ( !count ) {
            count = 4;
        }
        var retObj = [];
        for( var counter = 0; counter < data.length && counter < count; counter++ ) {
            var __tmp = {
                name : data[ counter ].label
            };
            if ( data[ counter ].localityId ) {
                __tmp.propertyId = data[ counter ].localityId;
                __tmp.localityId = data[ counter ].localityId;
            }
            if ( data[ counter ].avgPriceRisePercentage && data[ counter ].avgPriceRiseMonths ) {
                __tmp.percentRise = {
                    avgPriceRisePercentage  : data[ counter ].avgPriceRisePercentage,
                    avgPriceRiseMonths      : data[ counter ].avgPriceRiseMonths
                };
            }
            if ( data[ counter ].overviewUrl ) {
                __tmp.url = data[ counter ].overviewUrl;
            }
            else if (  data[ counter ].url ) {
                __tmp.url = data[ counter ].url;
            }
            if ( data[ counter ].numberOfUsersByRating ) {
                __tmp.ratings = __getRatingFromLocality( data[ counter ] );
            }
            retObj.push( __tmp );
        }
        return retObj;
    };

    var parseHighestReturn = function( data, count ) {
        //  just a wrapper function in case we change the
        //  definition/structure/implementation in future
        var retObj = parseTopRated( data, count );
        return retObj;
    };

    var makeObjectById = function( locArr ) {
        var list = {};
        for( var __c = 0; __c < locArr.length; __c++ ) {
            list[ locArr[ __c ].localityId ] = locArr[ __c ];
        }
        return list;
    };

    return {
        parseNearBy       : parseNearBy,
        parseTopRated     : parseTopRated,
        makeObjectById    : makeObjectById,
        getParsedAreaData : getParsedAreaData,
        parseLeadFormData : parseLeadFormData,
        parseLocalityList : parseLocalityList,
        parseHighestReturn: parseHighestReturn,
        parseLocality     : parseLocality,
        minimalLocality   : minimalLocality
    };
}]);
