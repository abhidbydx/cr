'use strict';

angular.module('serviceApp')
.factory('FilterService', ['pageSettings', '$location', 'ProjectService', '$timeout',
							function(pageSettings, $location, ProjectService, $timeout) {

	var Filters  =   {};

    var paging      =   {
        'start' :   0,
        'rows'  :   9999    //random high value to fetch all items
    };

    Filters['cityid'] = {
        'key'       :   'cityId',    
        'type'      :   'equal',
        'selected'  :   []    
    };
    
    Filters['maxDistance'] = {
        'key'       :   'maxDistance',    
        'type'      :   'equal',
        'selected'  :   []    
    };
    
    Filters['localityid'] = {
        'key'       :   'localityId',    
        'type'      :   'equal',
        'selected'  :   []
    };

    Filters['bed'] = {
        'key'       :   'bedrooms',
        'selection' :   {},
        'selected'  :   [],
        'type'      :   'equal',
        'data'      :   {'1':'1', '2':'2', '3':'3', '4':'4', '5+':['5','6','7','8','9']},
        'reset'     :   function(fltr){
            fltr.selection = {};
            fltr.selected = [];
        }
    };

    Filters['bath'] = {
        'key'       :   'bathrooms',
        'selection' :   {},
        'selected'  :   [],
        'type'      :   'equal',
        'data'      :   {'1':'1', '2':'2', '3+':['3','4','5']},
        'reset'     :   function(fltr){
            fltr.selection = {};
            fltr.selected = [];
        }
    };

    Filters['propertyType'] = {
        'key'       :   'unitType',
        'selection' :   {},
        'selected'  :   [],
        'type'      :   'equal',
        'data'      :   {'Apartment':'Apartment', 'Villa':'Villa', 'Plot':'Plot'},
        'reset'     :   function(fltr){
            fltr.selection = {};
            fltr.selected = [];
        }
    };
                                              
    Filters['listingType'] = {
        'key'       :   'isResale',
        'selection' :   {},
        'selected'  :   [],
        'type'      :   'equal',
        'data'      :   {'New':'false', 'Resale':'true'},
        'reset'     :   function(fltr){
            fltr.selection = {};
            fltr.selected = [];
        }
    };

    //not used in maps
    Filters['launchDate'] = {
        'key'       :   'launchDate',
        'selected'  :   {},
        'selection' :   {},
        'type'      :   'range',
        'data'      :   {'Week':{'from':-7,'to':0}, 'Month':{'from':-30,'to':0}, '3 Months':{'from':-90,'to':0}, '6 Months':{'from':-180,'to':0}, '1 Year':{'from':-365, 'to':0}}
    };

    Filters['completionDate'] = {
        'key'       :   'possessionDate',
        'selected'  :   [],
        'selection' :   {'item' :   ''},
        'type'      :   'range',
        'data'      :   {'3 mo':{'from':0,'to':90}, '6 mo':{'from':0,'to':180}, '1 yr':{'from':0,'to':365}, '2+ yrs':{'from':0,'to':730}},
        'reset'     :   function(fltr){
            fltr.selection = {item: ""};
            fltr.selected = [];
        }
    };

    Filters['projectStatus'] = {
        'key'       :   'projectStatus',
        'selection' :   {},
        'selected'  :   [],
        'type'      :   'equal',
        'data'      :   {'Launching Soon':['not launched', 'pre launch'], 'New Launch':['launch'], 'Under Construction':['under construction'], 'Ready to Move In':['ready for possession', 'occupied']},
        'reset'     :   function(fltr){
            fltr.selection = {};
            fltr.selected = [];
        } 
    };

    Filters['builder'] = {
        'key'           :   'builderLabel',
        'selecteditem'  :   undefined,
        'selection'     :   {},
        'selected'      :   [],
        'type'          :   'equal',
        'data'          :   [],
        'recommendedCount': 5,
        'recommended'   :   [],
        'reset'         :   function(fltr){
            $.each( fltr.recommended, function( cnt, obj ) {
                obj.notVisible = false;
            });
            fltr.selection = {};
            fltr.selected = [];
        },
        hide: false
    };

    Filters['locality'] = {
        'key'           :   'localityOrSuburbLabel',
        'selecteditem'  :   undefined,
        'selection'     :   {},
        'selected'      :   [],
        'type'          :   'equal',
        'data'          :   [],
        'recommendedCount': 5,
        'recommended'   :   [],
        'reset'         :   function(fltr){            
            $.each( fltr.recommended, function( cnt, obj ) {
                obj.notVisible = false;
            });
            fltr.selection = {};
            fltr.selected = [];
        },
        hide: false
    };

    Filters['suburb'] = {
        'key'           :   'suburbLabel',
        'selecteditem'  :   undefined,
        'selection'     :   {},
        'selected'      :   [],
        'type'          :   'equal',
        'data'          :   [],
        'recommendedCount': 5,
        'recommended'   :   [],
        'reset'         :   function(fltr){
            $.each( fltr.recommended, function( cnt, obj ) {
                obj.notVisible = false;
            });
            fltr.selection = {};
            fltr.selected = [];
        },
        hide: false
    };

    Filters['budget'] = {
        'key'           :   'primaryOrResaleBudget',
        'type'          :   'range',
        'data'          :   [0,9000000],
        'selection'     :   [],
        'reset'         :   function(fltr){
            fltr.selection = [fltr.data[0], fltr.data[1]]; 
            fltr.selected = {};
        }
    };

    Filters['size'] = {
        'key'           :   'size',
        'type'          :   'range',
        'data'          :   [0,5000],
        'selection'     :   [],
        'reset'         :   function(fltr){
            fltr.selection = [fltr.data[0], fltr.data[1]];
            fltr.selected = {};
        }
    };

    Filters['geo'] = {
        'key'           :   'geo',
        'type'          :   'geoDistance',
        'selected'      :   {},
        'reset' : function(fltr){
            fltr.selected = {};
        }
	};

    var inMoreFilter = ['propertyType', 'bath', 'listingType', 'projectStatus', 'completionDate', 'size', 'builder', 'locality'];

    var otherFilter = ['bed', 'budget'];

    var skipFilters = ["cityId", "localityId", "cityid", "localityid"];

    var displaySettings  =   pageSettings.displaySettings;

    var fetchStats = function(query){
        // query.fields = ["projectId"];   //  to make this call light
        ProjectService.getStats( query, function( resp ) {
        
            if(resp){
                $timeout(function() {
                    if(resp.stats && resp.stats.budget){

                        var budget = resp.stats.budget, budgetfltr = Filters.budget, budgetFromURL = $location.search().budget;
                        budgetfltr.data = [budget.min, budget.max];
                        
                        //In case budget was fetched from URL, set that as selection
                        if( !budgetFromURL || !budgetFromURL.length){
                            budgetfltr.selection = [budget.min, budget.max];    
                        }                    
                    }
                    if(resp.stats && resp.stats.size){
                        var size = resp.stats.size, sizefltr = Filters.size, sizeFromURL = $location.search().size;
                        sizefltr.data = [size.min, size.max];

                        if(!sizeFromURL || !sizeFromURL.length){
                            sizefltr.selection = [size.min, size.max];
                        }
                    }
                }, 0);

                $.each( ['locality', 'builder', 'suburb'], function( __c, __filterType ) {
                    $timeout(function() {                        
                        if(resp.facets && resp.facets[ __filterType + 'LabelPriority' ] ){
                            var b , rec = [], maxPos = -1, maxVal = 10000;
                            Filters[ __filterType ].recommended = []; Filters[ __filterType ].data = [];
                            $.each( resp.facets[ __filterType + 'LabelPriority' ], function( cnt, __filterName ) {
                                var namePriority = _.keys( __filterName )[0].split( ':' );
                                var __priority = parseInt( namePriority[1], 10 )
                                var __tmpFilterType = __filterType;
                                b = { 'label' : namePriority[0] };
                                //Merged suburb data in locality filter list
                                if(__tmpFilterType == 'suburb')
                                    __tmpFilterType = 'locality';
                                Filters[ __tmpFilterType ].data.push( b );                                

                                if ( cnt < Filters[ __filterType ].recommendedCount ) {
                                    rec[ cnt ] = {
                                        name : b,
                                        value: __priority
                                    };
                                    if ( __priority < maxVal ) {
                                        //  do nothing
                                    }
                                    else {
                                        maxVal = __priority;
                                        maxPos = cnt;
                                    }
                                }
                                //  at this stage we have rec array of desired length
                                else {
                                    //  in here we'll keep replacing that element which does not stays in top recomendations
                                    var getMax = function(){
                                        var val = rec[0].value, pos = 0, arr = [];
                                        for( var idx = 0; idx < rec.length; idx++ ) {
                                            arr.push( rec[ idx ] );
                                            if ( val < rec[ idx ].value ) {
                                                pos = idx;
                                                val = rec[ idx ].value;
                                            }
                                        }
                                        return pos;
                                    };
                                    if ( __priority < maxVal ) {
                                        rec[ maxPos ] = {
                                            name : b,
                                            value: __priority
                                        };
                                        //  find max and update it
                                        maxPos = getMax();
                                        maxVal = rec[ maxPos ].value;
                                    }
                                }
                            });
                           
                            $.each( rec, function( recCnt, recData ) {
                                //Suburb recommended data in locality key
                                if(__filterType == 'builder' || __filterType == 'suburb'){
                                    var __filterKey = (__filterType == 'suburb') ? 'locality' : __filterType;
                                    Filters[ __filterKey ].recommended.push( recData.name );
                                }
                            });
                        }
                    }, 0);
                });
            }   
        });
    };

    var makeArrayObject = function (obj) {
        var array = [];
        if (obj.length > 0) {
            obj.forEach(function(item, index) {             
                if(typeof item.label  != 'undefined' ){                                   
                   array.push( item.label ); 
                }else if(typeof item  != 'undefined'){
                    array.push( item ); 
                }
            });
        }        
        return array;
    }

    var createSearchQuery   =   function(){   
        //create search filters
        var key, fltr, value = {}, filterArr = {'and' : []}, query = {};
        displaySettings.appliedMoreFilter = 0;
        displaySettings.appliedFilter = 0;
        for(key in Filters){
            fltr = Filters[key];
            if(fltr.selected && _.keys(fltr.selected).length){
                //Convert json into array selected ngInputTags for builder/locality 
                if(key == 'builder' || key == 'locality'){
                   fltr.selected = makeArrayObject(fltr.selected)
                }
                value[fltr.type] = {};
                value[fltr.type][fltr.key] = fltr.selected;
                filterArr['and'].push(value);
                if(inMoreFilter.indexOf(key) > -1){
                    displaySettings.appliedMoreFilter++;
                    displaySettings.appliedFilter++; 
                }
                if(otherFilter.indexOf(key) > -1){
                    displaySettings.appliedFilter++;     
                }
            }
            value = {};
        }
       
        if(filterArr.and.length === 0)
            return null;
        
        query['filters'] = filterArr;

        //set default paging to fetch all items
        query['paging'] = paging;

        if(displaySettings.requestType === 'locality'){
            query['fields'] = pageSettings.localityListData;
        } else {
            query['fields'] = pageSettings.projectListData;
        }
        //set requested field list
        return decodeURIComponent(JSON.stringify(query));
    };    

    
    var beautifyURL = function(){
		var filter,key,queryObject = {};
        for(key in Filters){
            filter = Filters[key];
            if(filter){
                var entityType = filter.type,
                    entityName = key;

                if(entityName && entityType && skipFilters.indexOf(entityName) === -1){

                    if(filter.selected && _.keys(filter.selected).length){

                        var baseValue = filter.selected,
                        label, valueArr;
                        
                        if(baseValue){

                            if(entityType == "range") {
                                valueArr = [baseValue.from, baseValue.to];
                            }
                            else if(entityType == "equal"){
                                valueArr = baseValue; 
                            }
                            else if(entityType == "geoDistance"){
                                
                                var geoObj = filter.selected;
                                if(!_.isEmpty(geoObj))
                                    valueArr = [geoObj.distance, geoObj.lat, geoObj.lon];
                            }

                            if(valueArr){
                                queryObject[entityName] = valueArr.join();
                            }    
                        }
                    }
                }
            }

        };       
        return queryObject;
    }

    var trimSetFilterKeys = function(selectionObj, setLength){
        var convergedObj = {};
        if(_.has(selectionObj, setLength)){
            var filterd_keys = _.filter(_.keys(selectionObj), function(key){
                return key < setLength;
            });
            _.each(filterd_keys, function(key){
                convergedObj[key] = true;
            });
            setLength = setLength+'+'
            convergedObj[setLength] = true;
        } else {
            convergedObj = selectionObj
        }
        return convergedObj;
    }

    // Updates all filters based on the URL
    var updateFilters = function(){
        var filters = $location.search(), filter, key, baseValue, selectionObj;
        for(key in Filters){
            if(_.has(filters, key)){

                filter = Filters[key];

                baseValue = filters[key].split(",");

                selectionObj = {};

                for (var i=0; i < baseValue.length; i++) {
                    selectionObj[baseValue[i]] = true;
                }
            }
            else{
                baseValue = [];
                selectionObj = {}; 
                //Reset locality/builder recommendation                  
                if(key == 'builder' || key == 'locality'){  
                    Filters[key].reset(Filters[key])                    
                }
                
            }

            switch(key) {

                case 'bed':
                    // Case when selectionObj has 5+  bedrooms
                    selectionObj = trimSetFilterKeys(selectionObj, 5);
                    break;
                case 'bath':
                    // Case when selectionObj has 3+ bathrooms
                    selectionObj = trimSetFilterKeys(selectionObj, 3);
                    break;                 
                 case 'listingType':
                    selectionObj = {New:false, Resale:false};
                    var selected = []
                    if(baseValue.length === 1) {
                        var boolVal = baseValue[0] === 'false' ? false : true;
                        selectionObj.New =  !boolVal;
                        selectionObj.Resale = boolVal;
                        selected = [boolVal];
                    }
                    else if( baseValue.length === 2) {
                        selectionObj.Resale = true;
                        selectionObj.New = true;
                        selected = ["true", "false"]
                    }
                    baseValue = selected;
                    break;
                case 'completionDate':
                    if(baseValue.length === 2){
                        var years=1000*60*60*24*365;
                        selectionObj = {item: ''};
                        var diff = (baseValue[1] -baseValue[0])/years;
                        diff = Math.round(diff * 10) / 10;
                        switch(diff) {
                            case 1 :
                                selectionObj = {item: "1 yr" };
                                break;
                            case 2 :
                                selectionObj = {item: "2+ yrs"};
                                break;
                            case 0.2 :
                                selectionObj = {item: "3 mo"};
                                break;
                            case 0.5 :
                                selectionObj = {item: "6 mo"};
                                break;
                        }
                        
                        baseValue = {from: parseInt(baseValue[0]), to: parseInt(baseValue[1])};   
                    }
                    break;
                case 'size':
                    if(baseValue && baseValue.length){
                        selectionObj = [baseValue[0], baseValue[1]];    
                    } else {
                        selectionObj = Filters.size.data;
                        break;
                    }
                    
                    baseValue = {from: selectionObj[0], to: selectionObj[1]}
                    break;
                case 'projectStatus':
                    selectionObj = {};
                    if($.inArray('ready for possession', baseValue) !== -1) {
                        selectionObj['Ready to Move In'] = true;
                    }
                    if($.inArray('launch', baseValue) !== -1){
                        selectionObj['New Launch'] = true;
                    }
                    if($.inArray('under construction', baseValue) !== -1){
                        selectionObj['Under Construction'] = true;
                    }
                    if($.inArray('not launched', baseValue)  !== -1){
                        selectionObj['Launching Soon'] = true;                                      
                    }   
                    break;
                case 'builder':
                    
                    selectionObj = {};
                    _.each(baseValue, function(builderLabel){                      
                        selectionObj[builderLabel] = builderLabel;
                    }); 
                    break;

                case 'locality':
                    selectionObj = {};
                    _.each(baseValue, function(localityLabel){
                        selectionObj[localityLabel] = localityLabel;
                    }); 
                    break;                
                case 'geo':
                    
                    if(baseValue && baseValue.length){
                        selectionObj = {distance: baseValue[0], lat: baseValue[1], lon: baseValue[2]};
                    } else {
                        break;
                    }
                    baseValue = selectionObj;

                 case 'budget':
                    if(baseValue && baseValue.length){
                        selectionObj = [baseValue[0], baseValue[1]];    
                    } else {
                        selectionObj = Filters.budget.data;
                        break;
                    }
                    
                    baseValue = {from: selectionObj[0], to: selectionObj[1]}
                    break;
                default :
                    break
            }

            if(!_.isEqual(Filters[key].selection, selectionObj)){
                Filters[key].selection = selectionObj;
                Filters[key].selected = baseValue;
            }
        }
    };
   
       updateFilters();

    return {
    	filters: Filters, 
    	createSearchQuery : createSearchQuery,
    	beautifyURL: beautifyURL,
    	skipFilters : skipFilters,
    	fetchStats : fetchStats,
        updateFilters : updateFilters
    }
}]);
