/**
   * Name: Project Parser
   * Description: It will convert project service response into format required by ui.    
   * @author: [Nakul Moudgil]
   * Date: Dec 27, 2013
**/

'use strict';

angular.module('serviceApp')
.factory('ProjectParser',['$filter', 'Formatter', function ($filter, Formatter) {
	// data formatting functions
    var removePrefix = $filter('removePrefix'),
        priceFormat = $filter('priceFormat'),
        dateFormat = $filter('dateFormat'),
        rateColor = $filter('rateColor'),
        dateColor = $filter('dateColor');

    return {
        mergePriceTrendData : function( projectObj, localityObj ) {
            var retObj = {};
            if ( localityObj && (projectObj.keys && projectObj.keys.length > 2) ) {
                retObj = {
                    keys : projectObj.keys,
                    projectAvg : projectObj.avg,
                    avg : []
                };
                $.each( projectObj.keys, function( __idx, __date ) {
                    var __index = localityObj.keys.indexOf( __date );
                    if ( __index === -1 ) {
                        retObj.avg.push( null );
                    }
                    else {
                        retObj.avg.push( localityObj.avg[ __index ] );
                    }
                });
            }
            return retObj;
        },

        parseNeighborhood: function(value){
            var neighborhoodTypes = {};
            $.each(value, function(item, attr){
                if(!neighborhoodTypes[attr.localityAmenityTypes.name]) {
                    neighborhoodTypes[attr.localityAmenityTypes.name] = {};
                    neighborhoodTypes[attr.localityAmenityTypes.name].count = 1;
                    neighborhoodTypes[attr.localityAmenityTypes.name].displayName = attr.localityAmenityTypes.description;
                }
                else{
                    neighborhoodTypes[attr.localityAmenityTypes.name].count++;
                }
            });
            return neighborhoodTypes;
        },

	
    	parseSpecifications: function(value){
    		var specTypes = {'doors':{}, 'fittingsAndFixtures':{}, 'flooring':{}, 'walls':{}};
    		if(value){
	    		$.each(value, function(item, attr){
	    			if(specTypes.hasOwnProperty(item)){
	    				$.each(attr, function(index, val){
	    					if(val){
	    						specTypes[item][index] = val;    				
	    					}
	    				});
	    			} else {
                        specTypes[item] = attr;
                    }
	    		});

	    		$.each(specTypes, function(item, attr){
	    			if(typeof specTypes[item] === 'object' && $.isEmptyObject(specTypes[item]) || specTypes[item].length == 0){
	    				delete specTypes[item];
	    			}
	    		});
    		}
    		return specTypes;
    	},

    	parseAmenities: function(amenities){
 			//merge all other amenities into one
			var list = [], text=[], other;

            if(amenities && amenities.length) {
			    for (var i = 0, len = amenities.length; i < len; i++) {
					var amenity = amenities[i];
					if(amenity.amenityMaster.abbreviation === 'Oth') {
					    text.push(amenity.amenityDisplayName);
						other = amenity;
					} else {
						list.push(amenity);
					}
				}
				if(text.length) {
					other.amenityDisplayName = text.join(', ');
					list.push(other);
				}
            }
    		
    		return list;
    	},
            
        parseProjectRating : function(rating){
            var rating;
            switch(rating){
                case 1: 
                    rating = 'Terrible';
                    break;
                case 2: 
                    rating = 'Poor';
                    break;
                case 3: 
                    rating = 'Average';
                    break;
                case 4: 
                    rating = 'Good';
                    break;
                case 5: 
                    rating = 'Excellent';
                    break;
                default : 
                    rating = '';
            }
            return rating;
        },

        //parse the deep object of project object obtained from projectDetail API
    	parseProject: function(res, processProperties, stats) {
    	    var project = {};
    	    project.projectId = res.projectId;
            project.cityId = res.locality.suburb.city.id;
            project.localityId = res.locality.localityId;
            project.selector = 'project_'+res.projectId;
            project.discussions = res.totalProjectDiscussion;
            project.name = res.name;
            project.builderName = res.builder.name;
            project.imageURL = res.imageURL;
            project.projectStatus = Formatter.getProjectStatusKey(res.projectStatus);
            project.address = res.address;
            project.supply = res.supply ? res.supply : 'NA';
            project.offer = res.offer;
            project.builder = res.builder;
            project.locality = res.locality;
            if(res.livabilityScore){
                project.livabilityScore = res.livabilityScore.toFixed( 1 );
            }
            if(res.safetyScore){
                project.safetyScore = res.safetyScore.toFixed( 1 );
            }
            project.dominantUnitType = res.dominantUnitType;
            project.locality.ratings = { averageRating: project.locality.averageRating,
                                         ratingsCount: project.locality.ratingsCount,
                                         numberOfUsersByRating: project.locality.numberOfUsersByRating};
            project.latitude = res.latitude;
            project.longitude = res.longitude;
            project.fullName = res.builder.name + ' ' + project.name;
            if(res.propertyUnitTypes && res.propertyUnitTypes.length > 0){
                project.projectType = res.propertyUnitTypes[0].toLowerCase();
            }
            project.propertyUnitTypes = res.propertyUnitTypes;
            project.minPrice = priceFormat(res.minPrice, 0);
            project.maxPrice = priceFormat(res.maxPrice, 0);
            project.launchDate = dateFormat(res.launchDate);
            project.distinctBedrooms = res.distinctBedrooms;
            project.propertySizeMeasure = res.propertySizeMeasure;
            project.URL = res.URL;
            project.minResalePrice = priceFormat(res.minResalePrice, 0);
            project.maxResalePrice = priceFormat(res.maxResalePrice, 0);
            project.minPricePerUnitArea = priceFormat(res.minPricePerUnitArea,undefined,undefined,undefined,-1);
            project.maxPricePerUnitArea = priceFormat(res.maxPricePerUnitArea);
            project.maxResaleOrPrimaryPrice = res.maxResaleOrPrimaryPrice;
            project.minResaleOrPrimaryPrice = res.minResaleOrPrimaryPrice;
            project.isResale = res.isResale;
            project.isPrimary = res.isPrimary;
            project.isSoldOut = res.isSoldOut;
            project.possessionDate = dateFormat(res.possessionDate);
            project.possessionDateTstamp = res.possessionDate;
            project.avgPriceRiseMonths = res.avgPriceRiseMonths;
            project.avgPriceRiseMonthsHtml = 'in past '+res.avgPriceRiseMonths+' months';
            project.avgPriceRisePercentage = res.avgPriceRisePercentage;
            project.projectRating = this.parseProjectRating(parseInt(res.locality.averageRating));
            project.imageThumbUrl = Formatter.getImagePath(res.imageURL, 'THUMBNAIL');
          
project.bCrum = [
              {
                text    : 'Home',
                link    : '/',
                target  : '_self'
              },
              {                
                text: project.locality.suburb.city.label+' Real Estate',
                link: project.locality.suburb.city.overviewUrl
              },
              {                
                text: 'Properties in '+project.locality.label,
                link: project.locality.url
              },              
              {
                label: 'project',
                text: project.builderName+" "+project.name
              }
            ];

            project.bCrumText = "YOU ARE HERE";
            project.lastUpdatedAt = res.lastUpdatedDate;

            if(stats !== undefined) {
                var rateRange = stats.pricePerUnitArea,
                    dateRange = stats.possessionDate;
                // Rate Range
                if(rateRange) {
                    project._rateColor = rateColor(res.minPricePerUnitArea, rateRange.min, rateRange.max);
                } else {
                    project._rateColor = rateColor(res.minPricePerUnitArea, undefined, undefined);
                }
                // Date Range
                if(dateRange) {
                    project._dateColor = dateColor(res.possessionDate, dateRange.min, dateRange.max);
                } else {
                    project._dateColor = dateColor(res.possessionDate, undefined, undefined);
                }
            }
            
            if(res.images) {
                project.images = res.images;    
            }
            if(res.projectAmenities) {
        	    project.amenities = this.parseAmenities(res.projectAmenities); 
            }
            if(res.neighborhood) {
    	        project.neighborhood = this.parseNeighborhood(res.neighborhood);
            }
            if(res.specifications) {
    	        project.specifications = this.parseSpecifications(res.specifications);
            }
            if(res.description && res.description.length > 500) {
                project.projectDescriptionFull = res.description;
                project.projectDescriptionSmall = res.description.substring(0, 300) + '... ';
            }
            else {
                project.projectDescriptionSmall = res.description;
            }

            if (res.loanProviderBanks) {
                project.loanProviderBanks = res.loanProviderBanks;
            }

            project.projectSize = res.sizeInAcres ? res.sizeInAcres + ' Acres': 'NA';

            var propTypes = res.propertyUnitTypes;
            if(propTypes && propTypes.length == 1 && propTypes[0] == "Plot"){
                project.hasOnlyPlots = true;
            }

            project.hasResaleProperty = false;
            project.properties = res.properties;
            if(processProperties && res.properties){
                _.each(project.properties, function(property){
                    var variableLabel =    property.size ? "(" + property.size + " " + property.measure+ ")"  : '' ;
                    property.compareLabel = project.hasOnlyPlots ? "Plot " + variableLabel : property.bedrooms + "BHK  " + variableLabel;
                    property.compareBathroomsLabel = project.hasOnlyPlots ? "NA" : property.bathrooms;  
                    property.size = priceFormat(property.size);
                    property.pricePerUnitArea = priceFormat(property.pricePerUnitArea);
                    property.resalePricePerUnitArea = priceFormat(property.resalePricePerUnitArea);
                    project.hasResaleProperty = (project.hasResaleProperty || property.resalePrice) ? true : false;
                });
            }

            if(res.offers){
                project.offers = res.offers;
            }

            if(res.minSize){
                project.minSize = priceFormat(res.minSize);    
            }

            if(res.maxSize){
                project.maxSize = priceFormat(res.maxSize);       
            }            

    	    if(res.maxPrice && res.minPrice){
    	    	project.minMaxPrice = res.minPrice + ' - ' + res.maxPrice; 
    	    }
    	    else{
    	    	project.minMaxPrice = 'Not specified';
    	    }
    	    if(res.maxSize && res.minSize){
    	    	project.minMaxSize = project.minSize + ' - ' + project.maxSize; 
    	    } else {
    	    	project.minMaxSize = 'Not specified';
    	    } 

            var idx = project.distinctBedrooms.indexOf(0);
            if(idx >= 0){
                project.distinctBedrooms.splice(idx, 1);
            }
            project.bhkInfo = '';
            if(project.distinctBedrooms.length){
                project.bhkInfo += project.distinctBedrooms.join(',')+' BHK ';
            }
            project.bhkInfo += project.propertyUnitTypes.join(',');

            project.newPriceHtml = 'Price On Request';
            if(project.minPrice && project.maxPrice){
                project.newPriceHtml = '<i class="fa fa-inr"></i><span>'+project.minPrice+'</span> - <i class="fa fa-inr"></i><span>'+project.maxPrice+'</span>' ;
            }
            if(project.minResalePrice && project.maxResalePrice){
                project.resalePriceHtml = '<i class="fa fa-inr"></i><span>'+project.minResalePrice+'</span> - <i class="fa fa-inr"></i><span>'+project.maxResalePrice+'</span>';
            }
            project.sizeHtml = 'Size On Request';
            var propertySizeMeasure = project.propertySizeMeasure ? project.propertySizeMeasure : 'sq ft';
            if(res.minSize && res.maxSize){
                if (res.minSize != res.maxSize) {
                    project.sizeHtml = project.minSize+' '+propertySizeMeasure+' - '+
                        project.maxSize+' '+propertySizeMeasure;
                } else {
                    project.sizeHtml = project.maxSize + ' ' + propertySizeMeasure;
                }
            }
            if(!res.minPricePerUnitArea || project.minPricePerUnitArea === 'NA') {
				project.displayPriceClass = 'rna';
                project.displayPriceHtml = '';
            } else {
                project.displayPriceHtml = '<i class="fa fa-inr"></i><span>'+project.minPricePerUnitArea+'</span>';
            }

			project.possessionDateHtml = project.possessionDate;
			if(!res.possessionDate || project.possessionDate === 'NA') {
                project.possessionDateClass = 'dna';
                project.possessionDateHtml = '';
            }
            project.URL = res.URL;
			project.builderNameHtml = 'Builder: <span style="padding-left:2px;">'+project.builderName+'</span>';

            return project;
        },

        parseDiscussed : function( data, count ) {
            if ( !count ) {
                count = 4;
            }
            var retObj = [];
            for( var counter = 0; counter < data.length && counter < count; counter++ ) {
                retObj.push({
                    projectId: data[ counter ].projectId,
                    url      : data[ counter ].URL,
                    name     : ( ( data[ counter ].builder ) ? data[ counter ].builder.name + ' ' : '' ) + data[ counter ].name,
                    minprice : ( data[ counter ].minPrice ) ? Formatter.formatPrice( data[ counter ].minPrice ) : '',
                    maxprice : ( data[ counter ].maxPrice ) ? Formatter.formatPrice( data[ counter ].maxPrice ) : '',
                    subName  : ( data[ counter ].totalProjectDiscussion ) ? data[ counter ].totalProjectDiscussion : '',
                    subSubName: data[ counter ].address,
                    avgPriceRisePercentage : ( data[ counter ].avgPriceRisePercentage ) ? parseFloat( data[ counter ].avgPriceRisePercentage ).toFixed( 1 ) : 0,
                    avgPriceRiseMonths : data[ counter ].avgPriceRiseMonths,
                    propertyId: data[ counter ].projectId,  //  for the sake to keep GA/mixpannel events consistent
                    imageUrl : data[ counter ].imageURL
                });
            }
            return retObj;
        }
    };
}]);
