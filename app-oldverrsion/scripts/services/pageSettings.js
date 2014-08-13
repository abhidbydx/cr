'use strict';

var settings = angular.module('serviceApp').factory('pageSettings', function() {

    var localityListData = ['label',
        'avgPricePerUnitArea',
        'avgPriceRisePercentage',
        'avgPriceRiseMonths',
        'projectCount',
        'projectStatusCount',
        'latitude',
        'longitude',
        'localityId',
        'cityId',
        'minResalePrice',
        'maxResalePrice',
        'maxRadius',
        'url'];

    var projectListData = ['name',
        'avgPriceRisePercentage',
        'avgPriceRiseMonths',
        'imageURL',
        'projectStatus',
        'address',
        'distinctBedrooms',
        'propertyUnitTypes',
        'minPrice',
        'maxPrice',
        'offer',
        'minResalePrice',
        'maxResalePrice',
        'possessionDate',
        'minPricePerUnitArea',
        'propertySizeMeasure',
        'minSize',
        'maxSize',
        'latitude',
        'longitude',
        'projectId',
        'localityId',
        'locality',
        'cityId',
        'builder',
        'URL'];

    var projectDetailData = ['projectId',
        'projectName',
        'avgPriceRisePercentage',
        'avgPriceRiseMonths',
        'projectUrl',
        'label',
        'averageRating',
        'ratingCount',
        'images',
        'unitName',
        'size',
        'measure',
        'budget',
        'resalePrice',
        'resalePricePerUnitArea',
        'launchDate',
        'noOfFlates',
        'projectSize',
        'distinctBedrooms',
        'propertyUnitTypes',
        'projectStatus',
        'promisedCompletionDate',
        'projectAmenity',
        'offerDesc'];

    var displaySettings    =   {
            //option to decide whether to show locality or project list in alv
            'alvDisplayType'    :   'locality',
            //option to decide whether to fetch locality or project data
            'requestType'       :   'locality',
            //neighbourhood at the top left in map for locality level
            'neighbourhood'     :   false,
            //project detail card
            'projectDetail'     :   0,
            //data in project marker(type|price|date)
            'projectMarkerData' :   'type',
            //whether to show unmapped project link in project alv
            'showUnMapped'    : false,  
            //show msg in alv if no item fetched
            'showErrorMsg'      :   false,
            //show message on city change
            'showCityChangeMessage' : true
    };

    var defaultSettings = {
            //default count of loc/proj visible in alv
            'perPageCount'    : 20,
            //list of loc/proj currently visible in alv
            'alvVisibleList'  : [],
            //list of loc/proj hidden in alv to be shown in infinite scroll
            'alvHiddenList'   : [],
            //list of all unmapped projects
            'unMappedProjects': [],
            //count of locality shown in locality alv
            'localityCount'   : '',
            //count of project shown in locality alv
            'projectCount'    : '',
            //count of project with undefined lat lng
            'unMappedCount'   : 0,
            //locality selected on clicking a locality marker, card in alv
            'currentLocality': {},
            //current city in view
            'currentCity'   : {},
            //list of all watchers for this controller
            'mapCtrlWatchList': [],
            //count of applied filter in more filter window
            'appliedMoreFilter' : 0,
            //count of applied filters
            'appliedFilter' : 0,
            //flag to reset scroll in alv
			'resetScroll' : 0,
            'reset' : function() {
                defaultSettings.alvVisibleList = [];
                defaultSettings.alvHiddenList = [];
                defaultSettings.unMappedProjects = [];
                defaultSettings.localityCount = 0;
                defaultSettings.projectCount = 0;
                defaultSettings.unMappedCount = 0;
				defaultSettings.resetScroll++;
            }
    };
    
    return {
        displaySettings : displaySettings,
        defaultSettings : defaultSettings,
        localityListData: localityListData,
        projectListData : projectListData,
        projectDetailData: projectDetailData
    };
});
