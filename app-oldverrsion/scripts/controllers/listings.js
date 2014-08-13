/**
   * Name: listings
   * Description: This is controller for Listings page.
   * @author: [Hardeep Singh]
   * Date: Dec 04, 2013
**/

'use strict';
angular.module('serviceApp').controller('listings', [ '$rootScope',
    '$scope',
    'ProjectService',
    '$location',
    'Constants',
    'FilterService',
    '$stateParams',
    '$state',
    '$timeout',
    'Flags',
    'CommonLocationService',
    'Formatter',
    function ($rootScope,
            $scope,
            ProjectService,
            $location,
            Constants,
            FilterService,
            $stateParams,
            $state,
            $timeout,            
            Flags,
            CommonLocationService,
            Formatter) {        
        //Configuration Values
        var singleQueryLoad = Constants.LISTINGS.SINGLE_QUERY_LOAD,
            autoScrollLimit = singleQueryLoad * Constants.LISTINGS.AUTO_SCROLL_MULTIPLE,
            handleAutoScroll, getResults, handleResults, loadMoreResults, createBCrum,
            pageType, handleUrlData, handleFilterQuery, overviewCard, waitForUrlData, trashResults, cityWatcher,
            urlDataWatcher, paginationTracking, scrollHandler, onCityList,
        valid_statuses = ['Not Launched', 'Pre Launch', 'Launch'],
        valid_statuses_map = {'Not Launched': 'Launching Soon', 'Pre Launch': 'Launching Soon', 'Launch' : 'New Launch'},
        // Query from filters        
        filterQuery = FilterService.createSearchQuery(),
        // Query specific to listings
        query = {filters : {and : []}},
        // Query merged from filters and specific to listings
        cumulativeQuery = {},

        checkExistingFilter = function(filterLabel, type){
            var _filterQuery = JSON.parse(filterQuery);
            if(_filterQuery && _filterQuery.filters && _filterQuery.filters.and){
                return _.some([_filterQuery.filters.and], function(item){
                    if(item[0][type]){
                        return _.has(item[0][type], filterLabel);
                    } else {
                        return false;
                    }
                });
            } else {
                return false;
            }

        },

        handleExistingFilter = function(filterLabel, cQuery){
            if(checkExistingFilter(filterLabel, 'equal')) {
                cQuery.filters.and = _.reject(cQuery.filters.and, function(item){
                    if ( item.equal ) {
                        return _.has(item.equal, filterLabel);
                    }
                    else {
                        return false;
                    }
                });
            }
            return cQuery;
        },
        
        curFilters = FilterService.Filters,

        urlAdapter = {
            'propertyType': 'unitType',
            'bedroom': 'bedrooms',
            'listingType' : 'isResale',
            'projectStatus' : 'projectStatus'
        };

        $scope.$watch('overviewCard', function (newValue, oldValue) {
            if (newValue) {
                $scope.overviewCard.listHeading = newValue.typeName;
            }
        }, true);

        $scope.leadData = {
	    type: 'promise-listing',
            cityId : undefined,
            localityId : undefined,
            builderName : undefined,
            ui_php : 'list.php',
            formlocationinfo : 'open-requirement-mid'
        };

        $scope.price_sort_by = "ASC";        
        $rootScope.CURRENT_ACTIVE_PAGE = Constants.GLOBAL.PAGE_TYPES.LISTING;
        if(filterQuery){
            $scope.filtersApplied = true;
        }

        $scope.keys = function(obj){
            return _.keys(obj);
        }

        $scope.sortFilter = {
            'selected' : 'relevance' ,
            'data' : {'relevance' : 'Relevance', 'minResaleOrPrimaryPrice': {'ASC' : 'Price (Low to High)', 'DESC' : 'Price (High to Low)'} , 'possessionDate': 'Possession Date'}
        }

        $scope.autoScrollLimit = autoScrollLimit;

        trashResults = function(){
            $scope.listing = [];
        }

        var removePossession = function() {
            cumulativeQuery.filters.and = _.reject( cumulativeQuery.filters.and, function( item ) {
                if ( item.range && item.range.possessionDate ) {
                    return true;
                }
                else {
                    return false;
                }
            });
        };

        $scope.sort = function(sortBy){                
            //Set extraCard value as default while sort.   
            $scope.extraCard = 0;            

            // check if this parameter is already set or not, if already set do nothing, else fetch new results            
            if(sortBy === "minResaleOrPrimaryPrice"){
                if($scope.sortFilter.selected == sortBy){
                    if($scope.price_sort_by == 'ASC'){   
                        $scope.price_sort_by = "DESC";
                    } else {
                        $scope.price_sort_by = "ASC";
                    }
                }
                removePossession();
                cumulativeQuery.sort = {field: sortBy, sortOrder: $scope.price_sort_by};
            }
            else {
                if($scope.sortFilter.selected != sortBy){
                    if(sortBy === "relevance"){
                        delete(cumulativeQuery.sort);
                        removePossession();
                    } else {
                        if(!checkExistingFilter('possessionDate', 'range')){
                            var currentDate = new Date();
                            cumulativeQuery.filters.and.push({range : {'possessionDate' : {'from': currentDate.setFullYear(currentDate.getFullYear() - 2)}}});
                        }
                        else {
                            removePossession();
                        }
                        cumulativeQuery.sort = {field: sortBy, sortOrder: 'ASC'};    
                    }
                } else {
                    return;
                }                  
            }			
			//GA/MIXPANEL - when user clicks on any sort type
			$rootScope.TrackingService.sendGAEvent('sortTypeChange', 'sort', sortBy+'-'+$rootScope.CURRENT_ACTIVE_PAGE); 
			$rootScope.TrackingService.mixPanelTracking('Sort Type Change', {'Sort Type Name': sortBy, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});	
						
            $scope.sortFilter.selected = sortBy;
            trashResults();       
            loadMoreResults();

            // Scroll to top of page
            $('body').scrollTop(0)
        };

	

        waitForUrlData = function(){    
            urlDataWatcher = $scope.$watch('urlData', function(urlData, oldVal){
                if(urlData){
                    var watcher = $rootScope.$watch('updateFilter', function (n) {
                        if (n) {
                            handleUrlData(urlData);
                            watcher();
                        }
                    });
                            
                }
		if(urlData && ($rootScope.cityChangeForFilter === -1) ) {
                    $rootScope.cityChangeForFilter = true;
                    var statsQuery = {"filters":{"and":[{"equal":{'cityLabel':urlData.city}}]}};
                    FilterService.fetchStats(statsQuery);
		}
            }, true);    
        }
        
        // To load more results if there are existing results we get more else we fetch first 10 results
        loadMoreResults = function () {             
            //setting params for forward flow
            if ( pageType && pageType !== 'builder' ) {                            
                $scope.areaInfo = {
                    type : pageType + '-listing',
                    id   : $scope.urlData.id,
                    localityName : $scope.urlData.locality,
                    cityName : $scope.urlData.city,
                    cityId : $scope.urlData.cityId
                };
            }            
            //Setting paging params
            var start = ( $scope.listing && $scope.listing.length ) ? $scope.listing.length - $scope.extraCard : 0, pageNumber;
            cumulativeQuery.paging =  {'start': start, 'rows': singleQueryLoad};            
            //GA/MIXPANEL - when user clicked on "Load More" button see more projects
            if(start > autoScrollLimit){
				pageNumber = Math.round(start/singleQueryLoad);
				paginationTracking(pageNumber, 'loadMore');
			}
            getResults();
        };
        //GA/MIXPANEL - when user scroll or click load more to see more projects
        paginationTracking = function (pageNumber, paginationType) {
			var pageNumber = pageNumber + 1;
			$rootScope.TrackingService.sendGAEvent('cluster', 'paginated', paginationType+'-'+pageNumber+'-'+$rootScope.CURRENT_ACTIVE_PAGE); 
			$rootScope.TrackingService.mixPanelTracking('Next Page Viewed', {'Pagination Type': paginationType, 'Page Number': pageNumber, 'Page Name': $rootScope.CURRENT_ACTIVE_PAGE});	
		}        

        $scope.loadMoreResults = loadMoreResults;

        // Handler for autoscroll, will be called everytime a a scroll happens to stop continuous queries we make query
        // only when results are not pending
        handleAutoScroll = function(){
            // Jquery elements for AUTO SCROLL
            var docElement = $(document),
                bodyElement = $('body'),
                windowElement = $(window),
                bodyBottom, bodyScrollHeight, pageNumber;

            // Logic for infinite scroll, when the bottom touches window bottom then we get more data
            scrollHandler = windowElement.scroll(function () {
                var footerHeight = $('#appFooter').height() + 500;
                bodyBottom = bodyElement.innerHeight() + docElement.scrollTop(),
                bodyScrollHeight = bodyElement[0].scrollHeight;
                
                if ($scope.listing && !$scope.$$destroyed) {     
                    if (bodyScrollHeight - bodyBottom <= footerHeight && !$scope.resultsPending && $scope.listing.length < autoScrollLimit && bodyBottom > 350) {
                        if ($scope.listing.length < $scope.totalResultsCount) {
							//GA/MIXPANEL - when user scroll the page and new page loaded
							pageNumber = Math.round($scope.listing.length/singleQueryLoad);
							paginationTracking(pageNumber, 'autoScroll');						
                            loadMoreResults();
                        }
                    }
                }
            });                
        };

        createBCrum = function( data ){
            var propertyType, bCrum = [], bhkLabel = {}, appendLink,
            __bCrum = {};
            
            __bCrum = {
                text    : 'Home',
                link    : '/',
                target  : '_self'
            };

            bCrum.push( __bCrum );
            //BHK page
            if($scope.urlData.bedroom >= 1 && data){
                appendLink = data.url
                bhkLabel = {
                        text : $scope.urlData.bedroom+'BHK in '+data.label
                    };
            } 
            switch (pageType) {

                case 'all':
                    propertyType = ($scope.urlData.propertyType) ? $scope.urlData.propertyType : "Property";
                    __bCrum = {
                        text :  propertyType + " for sale"
                    };
                    bCrum.push( __bCrum );
                    break;
                case 'city':
                    __bCrum = {
                        text : $scope.urlData.city+ " real estate",
                        link: data.overviewUrl
                    }; 
                    bCrum.push( __bCrum ); 

                    __bCrum = {
                        text : "Properties in "+data.label,
                        link: appendLink
                    };                    

                    bCrum.push( __bCrum );            
                    break;
                case 'locality':
                    __bCrum = {
                        text : $scope.urlData.city+ " real estate",
                        link: data.suburb.city.overviewUrl
                    };  
                    bCrum.push( __bCrum );   

                    __bCrum = {
                        text : "Properties in "+data.label,
                        link: appendLink
                    };                    

                    bCrum.push( __bCrum );   
                    
                    break;   

                case 'suburb':
                    __bCrum = {
                        text : $scope.urlData.city+ " real estate",
                        link: data.city.overviewUrl
                    };  
                    bCrum.push( __bCrum );   
                    __bCrum = {
                        text : "Properties in "+data.label,
                        link: appendLink
                    };
                    bCrum.push( __bCrum ); 
                    break;

                case 'builder':
                    var lastText = $scope.urlData.builder;
                    if($scope.urlData.city){
                        __bCrum = {
                            text : $scope.urlData.city+" real estate",
                            link: $scope.urlData.city+"-real-estate"
                        };                    

                        bCrum.push( __bCrum );
                    }
                    //Builder BHK page
                    if($scope.urlData.bedroom >= 1){
                        lastText =  $scope.urlData.bedroom+'BHK apartments by '+ $scope.urlData.builder
                        __bCrum = {
                            text : $scope.urlData.builder,
                            link : $scope.urlData.redirectUrl
                        };
                        bCrum.push( __bCrum );
                    }
                    
                    __bCrum = {
                        text : lastText
                    };
                    bCrum.push( __bCrum );
                    break;
            }
            //Append bhk text if landing in bhk page            
            bCrum.push( bhkLabel );
                        
            $scope.bCrum = bCrum;
            //  dummy values
            $scope.bCrumText = 'YOU ARE HERE';
        }

        $rootScope.$watch( 'urlData' , function( urlData, oldData ){
            if ( urlData && ( !oldData || $rootScope.cityChangeForFilter === -1 || urlData.id != oldData.id ) ) {
                $rootScope.cityChangeForFilter = true;
                var statsQuery = {"filters":{"and":[{"equal":{'cityLabel':urlData.city}}]}};
                FilterService.fetchStats(statsQuery);                
            }
        }, true);

        // Logic for handling URL data 
        handleUrlData = function (urlData) {
            if (urlData && urlData.pageType) {

                var searchObj = urlData, cityId, equalObj = function(){ this.equal = {};};

                searchObj.pageType = searchObj.pageType.toLowerCase();
                //Check if data is for listings page or not
                if (searchObj.pageType.indexOf('sale-listing-') !== -1) {
      
                    var filterObj, valid_pages = ['city', 'locality', 'suburb', 'builder'], AND = query.filters.and;;

                    // Replace 'sale-listing-' from    sale-listing-city, sale-listing-builder etc.
                    // Replace 'city-' from  city-suburb, city-locality etc.
                    pageType = searchObj.pageType.replace('sale-listing-', '').replace('city-', '');
                    //Delete localityId from filter if return from map and change city 
                    if(!urlData.localityId){
                        $rootScope.updateFilter('localityid', 'false', []);                       
                    }
                    if(urlData.city && (pageType == "city" || pageType == "locality")){
                         var handleToggle = function(city){
                            Flags.set('cityMapSupport', city);
                            Flags.broadcast('cityMapSupport');         
                         }
                         $rootScope.waitUpdateCity(urlData.city, handleToggle);
                    } else {
                        Flags.set('cityMapSupport', undefined);
                        Flags.broadcast('cityMapSupport');          
                    }


                    //Support for city bhk pages
                    if(pageType == 'bhk' || pageType == 'bhk-price'){
                        pageType = 'city';
                    }

                    //Support for locality bhk pages
                    if(pageType == 'locality-bhk'){
                        pageType = 'locality';   
                    }
                    //Support for locality bhk price pages
                    if(pageType == 'locality-bhk-price'){
                        pageType = 'locality';
                    }
                    //Support for locality bhk price pages
                    if(pageType == 'locality-price'){
                        pageType = 'locality';
                    }

                    //Support for suburb bhk pages
                    if(pageType == 'suburb-bhk'){
                        pageType = 'suburb';   
                    }
                    //Support for suburb bhk pages
                    if(pageType == 'suburb-bhk-price'){
                        pageType = 'suburb';
                    }
                    //Support for locality bhk price pages
                    if(pageType == 'suburb-price'){
                        pageType = 'suburb';
                    }
                    
                    // Support for builder city pages
                    if(pageType == 'buildercity'){
                        pageType = 'builder';
                        filterObj = new equalObj();
                        filterObj.equal['cityLabel'] = urlData.city;
                        $rootScope.waitUpdateCity(urlData.city);
                        AND.push(filterObj);
                    }

                    Flags.set('listingType', pageType);

                    Flags.broadcast('listingType');

                    angular.forEach(valid_pages, function(page){
                        var keyId = page + 'Id';
                        if(urlData[keyId]){
                            filterObj = new equalObj();
                            filterObj.equal[keyId] = urlData[keyId];
                            AND.push(filterObj);
                        }
                    });

                    // Support for SEO Apartment/Plot/Villa URLs
                    for (var key in urlAdapter){
                        if(searchObj[key]){
                            filterObj = new equalObj();
                            filterObj.equal[urlAdapter[key]] = searchObj[key];
                            AND.push(filterObj);
                        }
                    }

     

                    // Support for budget SEO URLs                  
                    if(urlData.minBudget && urlData.maxBudget){  
                        var minBudget, maxBudget;
                        minBudget = Formatter.filterFormatValue(urlData.minBudget);
                        maxBudget = Formatter.filterFormatValue(urlData.maxBudget);                                            
                        AND.push({range : {'primaryOrResaleBudget' : {'from': minBudget, 'to': maxBudget}}});
                    }

                    // Support for conditional filters
                    if(pageType == 'builder' || pageType == 'all' || pageType == 'buildercity'){
                        FilterService.fetchStats(query);    
                    }

                    if(_.isEmpty($location.search())){
                        cumulativeQuery = query;
                        loadMoreResults();
                    } else {
                        handleFilterQuery(filterQuery);
                    }
                    
                    $rootScope.currentURL = $location.path();                        

                    // Use this flag to show different types of overview cards
                    $scope[pageType.toUpperCase() + '_LISTINGS_PAGE'] = true;

                    if(urlData.cityId){
                        $scope.leadData.cityId = urlData.cityId;
                    } else {
                        if($scope.selectedCity){
                            $scope.leadData.cityId = $scope.selectedCity.id;
                        } else {
                           var globalCityWatcher = $scope.$watch('selectedCity', function(city){
                                if(city){
                                    $scope.leadData.cityId = city.id;    
                                    globalCityWatcher();
                                }
                            });
                        }
                    }
                    
					if (urlData.localityId) {
						$scope.leadData.localityId = urlData.localityId;
					}

                    $scope.leadData.builderName = urlData.builder;

                    // Add information about the overview card to be displayed
                    if( urlData.id ){
			$scope.overviewCard = {cardType: pageType, typeId: urlData.id, typeName: urlData[pageType]};
                        
			if ( urlData.cityId && urlData.city ) {
                            $scope.overviewCard.cityInfo = {
                                id : urlData.cityId,
                                name : urlData.city
                            };
                        }
                    } 
                    if ( !urlData.id && urlData.city ){
                        $state.go('base.static', {staticPage:'404'})                        
                    } 

                    //Handle title globally
                    if(pageType == 'all'){
                        $scope.searchedFor = urlData.propertyType + ' For Sale';
                    }
                    //Set page name for ga/mixpanel
                    $rootScope.CURRENT_ACTIVE_PAGE = searchObj.pageType;
                    // Get page info

                    // Create breadcrum
                    if(pageType == 'builder' || !urlData.id){ 
                        createBCrum();
                    }else{
                        CommonLocationService.getBasicInfo( pageType, urlData.id, createBCrum);    
                    }
                    

				}
            }
        };

        // handle the listing results here
        handleResults = function (response) {
                    
            var results = response.data.items, i, projectListArr = [], pageTypeUcFirst;
            
            $scope.totalResultsCount = response.totalCount;
            $scope.resultsPending = false; 

            for (i = 0; i < results.length; i = i + 1) {
				//Project ID with their Ranking			
				projectListArr.push(i+1+'-'+results[i].projectId)
				
                //handle Possession Date
                if(results[i].possessionDate && new Date(results[i].possessionDate) < new Date()){
                    results[i].pastPossessionDate = true;
                }
                
                //handle banner
                if(valid_statuses.indexOf(results[i].projectStatus) != -1){
                    results[i].projectStatus = valid_statuses_map[results[i].projectStatus];
                    results[i].showStatus = true;
                }

                results[i].discussions = results[i].totalProjectDiscussion;

                results[i].type = 'project';
                
                if(!$scope.listing){
                    $scope.listing = [];
                }
                
                if(!$scope.extraCard){
                    $scope.extraCard = 0;
                }

                $scope.listing.push(results[i]);

                if(($scope.totalResultsCount < 30 && $scope.listing.length == $scope.totalResultsCount) || $scope.listing.length == 30){
                    var promise_result = {type: 'promise'};
                    $scope.listing.push(promise_result);
                    $scope.extraCard++;
                } 

                if(($scope.totalResultsCount < 8 && $scope.listing.length == $scope.totalResultsCount) || $scope.listing.length == 8){
                    var forward_result = {type: 'forward'};                   
                    $scope.listing.push(forward_result);
                    $scope.extraCard++;
                    
                }   
            }

            $scope.searched = true;
            //capitalize the first character
			pageTypeUcFirst = $rootScope.TrackingService.capitaliseFirstLetter(pageType);
            //Mixpanel page view call			
			var pageObj = {};								
			pageObj[pageTypeUcFirst+' ID']		= $scope.urlData.id;			
			pageObj['Project Count']			= $scope.totalResultsCount
			pageObj['Project List']				= projectListArr.join(",");						
			//Page view call for GA/MIXPANEL			
			$rootScope.TrackingService.pageViewedCall(pageObj);
        };

        // Actual function which fetches the data and makes respective locality and builder queries
        getResults = function () {
            
            // Set this flag to show a loading on interface
            $scope.resultsPending = true;            
            // Call for data
            ProjectService.getProjectList(decodeURIComponent(JSON.stringify(cumulativeQuery)), undefined, handleResults);                    
            
        };

        //  Handling filters set/unset, the filters query created by filter controller is handled here 
        //  and combined with listings data to make a final query to backend
        //  Beware of the case when state change happens, do not make a call at that time as the new instance of this controll will handle that
        //  This method will only be used if user stays in same state, that is listingFilters
        var onFilterUpdate = $scope.$on('FiltersUpdate', function(event, params){
            // INSANE CODE , hack because ui router does not work the way it is supposed to be
            if(params.to.indexOf('filters') != -1 && params.from.indexOf('filters') != -1 && $location.path() === $rootScope.currentURL){
                trashResults();
                handleFilterQuery(params.query);
            }
        });

        $scope.$on('$destroy', function(){
            // Deregister the watcher
            onFilterUpdate();
            if(urlDataWatcher){
                urlDataWatcher();
            }
            $(window).unbind('scroll', scrollHandler);
            onCityList();
        });

        // In case of refresh, there is a race between filters setting and angular url data, to prevent the race condition,
        // we check if url data is present or not, in case url data is not present don't make a query just based on the filters as
        // It will not fetch the correct results
        handleFilterQuery = function (bcQuery){
            if(bcQuery && $scope.urlData){
                $scope.sortFilter.selected = 'relevance';
                bcQuery = JSON.parse(bcQuery);
                delete(bcQuery.fields);
                delete(bcQuery.paging);
                delete(cumulativeQuery.sort);
                angular.copy(query, cumulativeQuery);

                //bcQuery = handleExistingFilter('bedrooms', bcQuery);

                bcQuery = handleExistingFilter('possessionDate', bcQuery);
                bcQuery = handleExistingFilter('cityId', bcQuery);
                // bcQuery = handleExistingFilter('isResale', bcQuery);
                // bcQuery = handleExistingFilter('projectStatus', bcQuery);
                
                cumulativeQuery.filters.and = query.filters.and.concat(bcQuery.filters.and);
                loadMoreResults();

                // Scroll to top of page on filter update
                $('body').scrollTop(0);
            }
        }; 

        onCityList = $scope.$watch('cityList', function(newCities){
            
            if(newCities && newCities.length && !$scope.mapSupport){
                $scope.mapSupport = function(projCity){
                    return _.find(newCities, function(city){
                        return city.label.toLowerCase() == projCity.label.toLowerCase();
                    });
                };
            }
        })

        handleAutoScroll();
        
        waitForUrlData();

        // $scope.$watch( 'overviewCard', function( n ) {
        //     if ( n && n.cardType === 'builder' ) {
        //         $scope.bCrum[ $scope.bCrum.length - 1 ].text = n.listHeading;
        //     }
        // }, true);
    }]);
