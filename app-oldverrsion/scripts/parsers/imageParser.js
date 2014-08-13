/**
 * Name: Image Parser
 * Description: Parser to format image service data to save it in date wise clusterred format    
 * @author: [Swapnil Vaibhav]
 * Date: Oct 30, 2013
**/
'use strict';
angular.module('serviceApp')
.factory('ImageParser', ['Formatter', '$sce', function ( Formatter, $sce ) {
    var createImageList = function(imageIndexMap, value, groupBy, sortOrder, mergeList, title){
        if ( groupBy === 'date' ) {
            groupBy = 'createdAt';
        }
        else {
            groupBy = 'type';
        }
        var imageDateClusteredData = {},
            hasVideo = false,
            totalImageCount = 0,
            totalVideoCount = 0,
            firstVideoIndex = -1;
            
        $.each(value, function(item, attr){            
            if(attr.videoUrl){				
                var tmpData = {                    
                    video:true,
                    text : attr.category,
                    image : 'http://img.youtube.com/vi/' + attr.videoUrl + '/0.jpg',
                    mediumImage: 'http://img.youtube.com/vi/' + attr.videoUrl + '/0.jpg',
                    thumbImage: 'http://img.youtube.com/vi/' + attr.videoUrl + '/1.jpg',
                    largeImage: 'http://img.youtube.com/vi/' + attr.videoUrl + '/0.jpg',
                    videoId : attr.videoUrl
                    
                };
                attr.imageType = {};
                attr.imageType['type'] = 'videos';
            }
            else{             
                var tmpData = {
                    image: attr.absolutePath,
                    mediumImage: Formatter.getImagePath(attr.absolutePath,'MEDIUM'),
                    thumbImage: Formatter.getImagePath(attr.absolutePath,'THUMBNAIL'),
                    largeImage: Formatter.getImagePath(attr.absolutePath,'LARGE'),
                    text : attr.altText,
                    height: attr.height,
                    width: attr.width,
                    takenAt: attr.takenAt
                };   
            }            
            if(attr.objectId){
                tmpData.objectId =  attr.objectId;
            }
            if(title){
               tmpData.mainTitle = title; 
            }
            var indexKey = '',
            indexKeyDisplay = null;
            if ( groupBy === 'date' ) {
                indexKey = Formatter.getDateMonth( attr.createdAt )+'-'+Formatter.getDateYear( attr.createdAt );
                indexKeyDisplay = indexKey;
            }
            else {
                indexKey = attr.imageType['type'];
                if ( typeof imageIndexMap[ indexKey ] !== 'undefined' ) {
                    indexKeyDisplay = imageIndexMap[indexKey];
                }
                else {
                    indexKeyDisplay = '';
                }
            }
            
            if ( indexKeyDisplay && typeof imageDateClusteredData[ indexKeyDisplay ] !== 'object' ) {
                imageDateClusteredData[ indexKeyDisplay ] = [];
            }
            if ( indexKeyDisplay !== '' ) {
                imageDateClusteredData[ indexKeyDisplay ].push( tmpData );
            }
        });

        if ( mergeList ) {
            $.each( mergeList, function( from, to ) {
                if ( imageDateClusteredData[ from ] && imageDateClusteredData[ from ].length ) {
                    if ( from === 'Videos' ) {
                        totalVideoCount += imageDateClusteredData[ from ].length;
                        hasVideo = true;
                    }
                    if ( !imageDateClusteredData[ to ] ) {
                        imageDateClusteredData[ to ] = [];
                    }
                    for( var imgCnt = 0; imgCnt < imageDateClusteredData[ from ].length; imgCnt++ ) {
                        if ( from === 'Videos' && firstVideoIndex === -1 ) {
                            firstVideoIndex = imageDateClusteredData[ to ].length;
                        }
                        imageDateClusteredData[ to ].push( imageDateClusteredData[ from ][ imgCnt ] );
                    }
                    delete imageDateClusteredData[ from ];
                }
            });
        }

        var newObj = [];
        if ( typeof sortOrder === 'object' ) {
            $.each( sortOrder, function ( item, attr ) {
                if ( imageDateClusteredData[ attr ] ) {
                    newObj.push({
                        index : attr,
                        data : imageDateClusteredData[ attr ]
                    });
                    delete imageDateClusteredData[ attr ];
                }
            });
        }

        // push the remaining at the end
        $.each( imageDateClusteredData, function( idx, imgObj ) {
            newObj.push({
                index : idx,
                data  : imgObj
            });
        });

        for( var typeCnt = 0; typeCnt < newObj.length; typeCnt++ ) {
            if ( hasVideo && newObj[ typeCnt ].index === 'Photos' ) {
                newObj[ typeCnt ].index = 'Photos & Videos';
            }
            totalImageCount += newObj[ typeCnt ].data.length;
        }
        totalImageCount -= totalVideoCount;
        // console.log( 'Total Image Count', totalImageCount, 'Total Video Count', totalVideoCount, 'First Video Index', firstVideoIndex );
        return {
            imageCount : totalImageCount,
            videoCount : totalVideoCount,
            videoIndex : firstVideoIndex,
            data       : newObj
        }
        // return newObj;
    };

    var getAllImage = function( value ) {
        var imageList = getProjectImage( value, 'type' ),
            newData = [], finalList = [];
        $.each( imageList, function( cnt, data ) {
            if ( data.data ) {
                $.each( data.data, function( __cnt, __data ) {
                    newData.push( __data );
                });
            }
        });
        if ( newData.length ) {
            finalList = [{
                index : 'Project',
                data  : newData
            }];
        }

        return finalList;
    };

    var getAllImageUnsorted = function( value ) {
        if ( !value || !value.images) {
            return [];
        }
        
        var rawImgList = value.images,
            imageList  = [],
            finalList  = [];

        $.each( rawImgList, function( cnt, __data ) {
            var tmpData = {
                image: __data.absolutePath,
                text : __data.title
            };
            imageList.push( tmpData );
        });

        if ( imageList.length ) {
            finalList.push({
                index : 'Project',
                data  : imageList
            });
        }

        return finalList;
    };

    var getProjectImage = function(value, groupBy,orderByconstruction) {
        if ( !value || !value.images) {
            return [];
        }
        var imageList = value.images;
        if(value.properties && value.properties.length > 0){
            $.each(value.properties, function(item,attr){
                if(attr.images && attr.images.length > 0){
                    imageList.push(attr.images[0]);
                }
            });   
        }
        if(value.videoUrls){
            imageList = imageList.concat(value.videoUrls);    
        }
        if(value.builder){
            value.fullName = value.builder.name + ' ' + value.name;
        }
        var imageIndexMap = {
            // applicationForm : 'Application',
            clusterPlan : 'Cluster Plan',
            constructionStatus : 'Construction',
            layoutPlan : 'Layout Plan',
            locationPlan : 'Location Plan',
            floorPlan : 'Floor Plans',
            main : 'Photos',
            masterPlan : 'Master Plan',
            sitePlan : 'Site Plan',
            videos: 'Videos'
            // specification : 'Specification',              
            // logo : 'Logo',
            // hospital : 'Hospital',
            // mall : 'Mall',
            // other : 'Others',
            // road : 'Road',
            // school : 'School'
        };
        if(orderByconstruction==='construction'){
           var sortOrder = [
            'Construction',
            'Photos',
            'Videos',
            'Project Plans',
            'Master Plan',
            'Site Plan',
            'Layout Plan',
            'Floor Plans',
            'Cluster Plan',
            'Location Plan'
            
        ]; 
        }else{
        var sortOrder = [
            'Photos',
            'Videos',
            'Project Plans',
            'Master Plan',
            'Site Plan',
            'Layout Plan',
            'Floor Plans',
            'Cluster Plan',
            'Location Plan',
            'Construction'
        ];
        }
        var mergeList = {
            'Master Plan':'Project Plans',
            'Site Plan':'Project Plans',
            'Layout Plan':'Project Plans',            
            'Location Plan':'Project Plans',
            'Cluster Plan':'Floor Plans',
            'Videos':'Photos'
        };

        return createImageList(imageIndexMap, imageList, groupBy, sortOrder, mergeList, value.fullName);
    };

    var getClusteredImage = function( value, groupBy ) {
        if ( !value ) {
            return [];
        }
        var imageIndexMap = {
            // applicationForm : 'Application',
            // clusterPlan : 'Cluster Plan',
            constructionStatus : 'Construction',
            layoutPlan : 'Project Plans',
            locationPlan : 'Location Plan',
            floorPlan : 'Floor Plans'
            // main : 'Project',
            // masterPlan : 'Master Plan',
            // paymentPlan : 'Payment Plan',
            // sitePlan : 'Site Plan',
            // specification : 'Specification',              
            // logo : 'Logo',
            // hospital : 'Hospital',
            // mall : 'Mall',
            // other : 'Others',
            // road : 'Road',
            // school : 'School'
        };
        var sortOrder = [
            'Construction',
            'Project Plans',
            'Location Plan',
            'Floor Plans'
        ];

        return createImageList(imageIndexMap, value, groupBy, sortOrder);
    };

    var getLocalityImage = function( value, groupBy ) {
        var imageIndexMap = {
            mall : 'Mall',
            hospital : 'Hospital',
            school : 'School',
            road : 'Road',
            other : 'Others',
        };
        return createImageList( imageIndexMap, value, groupBy );
    };
    
    var getConstructionImages = function(value){
		var data,i=-1,finalList = [],finalData = [];
		$.each(value, function(k,v){
			if(v.index == "Construction"){
			  data = v.data;
		    }
		});
        if (data) {
            $.each(data, function (k, v) {
                var index_value = (typeof v.takenAt == "undefined") ? "Before Oct 2013" : Formatter.getDateMonth(v.takenAt) + "'" + Formatter.getDateYear(v.takenAt);
                var idx = finalList.indexOf(index_value);
                if (idx === -1) {
                    i++;
                    finalList[i] = index_value;
                }
                if (typeof finalData[i] == "undefined") {
                    finalData[i] = {};
                    finalData[i]['data'] = [];
                    finalData[i]['index'] = index_value;
                }
                finalData[i]['data'].push(v);
            });
        }
		return finalData;
	}  
    return {
        getAllImage : getAllImage,
        getProjectImage : getProjectImage,
        getLocalityImage  : getLocalityImage,
        getClusteredImage : getClusteredImage,
        getAllImageUnsorted : getAllImageUnsorted,
        getConstructionImages : getConstructionImages
    };
}]);
