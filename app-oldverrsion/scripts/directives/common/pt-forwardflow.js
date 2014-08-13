/**
  * Name: Forward Flow Directive
  * Description: Forward flow forective for overview pages.
  * @author: [Swapnil Vaibhav]
  * Date: Feb 21, 2014
***/
'use strict';
angular.module( 'serviceApp' ).directive( 'ptForwardflow', function() {
    return {
        restrict : 'A',
        templateUrl : 'views/directives/common/forwardFlow.html',
        controller : function( $scope, $location, GlobalService, CommonLocationService, LocalityService, BuilderService, LocalityParser, BuilderParser, ProjectParser, Formatter, $rootScope ) {
            $scope.dataObject   = {},
            $scope.showingData = {
                locality : false,
                builder  : false,
                project  : false
            },
            $scope.featured = {
                locality : {},
                builder  : {},
                project  : {}
            },
            $scope.sameLevel = {
                locality : {},
                builder  : {},
                project  : {}
            },
            $scope.cName = {
                locality : {},
                builder  : {},
                project  : {}
            },
            $scope.displayOrder = {
                locality : [],
                builder  : [],
                project  : []
            };
            $scope.startBuilder = 0, $scope.bRow = 8, $scope.startLocality = 0, $scope.lRow = 8;
            $scope.allLocality = [], $scope.showLocality = false, $scope.allLocalityText = 'All Localities';
            $scope.allBuilder = [], $scope.showBuilder = false, $scope.allBuilderText = 'All Builders';
            $scope.showGrid = {};
            var compositeUrl = {}, urlArr = [], cnt = 0, shownBuilderId = [], shownLocalityId = [], loadMoreCount = 8, putOverviewUrl = false;

            $scope.$watch( 'areaInfo', function( n ) {
                if ( n ) {
                    if ( n.localityName ) {
                        $scope.areaInfo.alsoSee = Formatter.ucword( n.localityName );
                    }
                    else if ( n.cityName ) {
                        $scope.areaInfo.alsoSee = Formatter.ucword( n.cityName );
                    }

                    var showId = 0,
                        __hash = $location.hash().trim(),
                        __type = $scope.areaInfo.type,
                        __id   = $scope.areaInfo.id,
                        __hashFound = false;

                    if ( __type === 'locality' || __type === 'suburb' || __type === 'city' ) {
                        compositeUrl[ GlobalService.getServiceUrl( 'topbuilder', __id, __type ) ] = {
                            name : 'Popular Builders',
                            type : 'builder',
                            display : true,
                            id : 'pbuilder'
                        };
                        compositeUrl[ GlobalService.getServiceUrl( 'mostdiscussproject', __id, __type ) ] = {
                            name : 'Most Discussed Projects',
                            type : 'project',
                            display : true,
                            id : 'mdproject'
                        };
                        compositeUrl[ GlobalService.getServiceUrl( 'recentlydiscussproject', __id, __type ) ] = {
                            name : 'Recently Discussed Projects',
                            type : 'project',
                            display : true,
                            id : 'rdproject'
                        };
                        compositeUrl[ GlobalService.getServiceUrl( 'highreturnproject', __id, __type ) ] = {
                            name : 'Highest Return Projects',
                            type : 'project',
                            display : true,
                            id : 'hrproject'
                        };
                        compositeUrl[ GlobalService.getServiceUrl( 'popularproject', __id, __type ) ] = {
                            name : 'Popular Projects',
                            type : 'project',
                            featured : true,
                            display : true,
                            id : 'pproject'
                        };

                        //  add all projects link here
                        if ( $scope.areaInfo.url ) {
                            $scope.allProjectLink = $scope.areaInfo.url;
                        }
                    }

                    if ( __type === 'locality' ) {
                        putOverviewUrl = true;
                    }
                    else if ( __type === 'locality-listing' ) {
                        $scope.areaInfo.type = __type = 'locality';
                        putOverviewUrl = false;
                    }
                    else if ( __type === 'suburb' || __type === 'suburb-listing' || __type === 'city' || __type === 'city-listing' ) {
                        if ( __type === 'city-listing' ) {
                            $scope.areaInfo.type = __type = 'city';
                            $scope.hideViewMore = true;
                        }
                        else if ( __type === 'suburb-listing' ) {
                            $scope.areaInfo.type = __type = 'suburb';
                            $scope.hideViewMore = true;
                        }
                        compositeUrl[ GlobalService.getServiceUrl( 'popularlocality', __id, __type ) ] = {
                            name : 'Popular Localities',
                            type : 'locality',
                            featured : true,
                            display : true,
                            id : 'plocality'
                        };
                    }

                    //    common fields :
                    var __specialId, __specialType;
                    if ( __type === 'locality' ) {
                        __specialId   = $scope.areaInfo.cityId;
                        __specialType = 'city';
                    }
                    else {
                        __specialId   = __id;
                        __specialType = __type;
                    }
                    compositeUrl[ GlobalService.getServiceUrl( 'topratedlocality', __specialId, __specialType ) ] = {
                        name : 'Top Rated Localities',
                        type : 'locality',
                        display : true,
                        id : 'trlocality'
                    };
                    compositeUrl[ GlobalService.getServiceUrl( 'highreturnlocality', __specialId, __specialType ) ] = {
                        name : 'Highest Return Localities',
                        type : 'locality',
                        display : true,
                        id : 'hrlocality'
                    };

                    if ( __type === 'locality' ) {
                        CommonLocationService.getBasicInfo( 'locality', __id ).then( function( __locData ) {
                            if ( __locData.latitude && __locData.longitude ) {
                                compositeUrl[ LocalityService.getNearbyLocality( __locData.latitude, __locData.longitude, '', 0, 5, true ) ] = {
                                    name : 'Nearby Localities',
                                    type : 'locality',
                                    featured : true,
                                    display : true,
                                    id : 'nlocality'
                                };
                            }
                            $scope.makeCall = true;
                        });
                    }
                    else {
                        $scope.makeCall = true;
                    }


                    $scope.$watch( 'makeCall', function( __makeCall ) {
                        if ( __makeCall ) {

                            urlArr = _.keys( compositeUrl );

                            GlobalService.makeCompositeCall( urlArr ).then( function( data ) {
                                $.each( data, function( __url, __oneResp ) {
                                    if ( __oneResp.statusCode === '2XX' && __oneResp.data && ( __oneResp.data.length || _.keys( __oneResp.data ).length ) ) {
                                        var __tmp = getParsedData( __oneResp.data, compositeUrl[ __url ], 4 );
                                        if ( compositeUrl[ __url ].id === 'pbuilder' && __tmp ) {
                                            if ( __tmp.length < 4 ) {
                                                $scope.hideMoreBuilder = true;
                                            }
                                            $.each( __tmp, function( idx, d ) {
                                                if ( shownBuilderId.indexOf( d.id ) === -1 ) {
                                                    shownBuilderId.push( d.id );
                                                }
                                            });
                                        }
                                        if ( __tmp && __tmp.length > 1 ) {
                                            if ( compositeUrl[ __url ].featured ) {
                                                $scope.featured[ compositeUrl[ __url ].type ][ compositeUrl[ __url ].name ] = {
                                                    id   : compositeUrl[ __url ].id,
                                                    name : compositeUrl[ __url ].name,
                                                    data : __tmp
                                                };
                                            }
                                            else {
                                                if ( $scope.areaInfo.type === 'locality' && compositeUrl[ __url ].type === 'locality' ) {
                                                    if ( $scope.areaInfo.cityName ) {
                                                        compositeUrl[ __url ].name += ( ' in ' + Formatter.ucword( $scope.areaInfo.cityName ) );
                                                    }
                                                    else if( $scope.overviewCard && $scope.overviewCard.cityInfo ) {
                                                        compositeUrl[ __url ].name += ( ' in ' + Formatter.ucword( $scope.overviewCard.cityInfo.name ) );
                                                    }
                                                }
                                                $scope.sameLevel[ compositeUrl[ __url ].type ][ compositeUrl[ __url ].name ] = {
                                                    id   : compositeUrl[ __url ].id,
                                                    name : compositeUrl[ __url ].name,
                                                    data : __tmp
                                                };
                                                $scope.showGrid[ compositeUrl[ __url ].type ] = true;
                                            }
                                        }
                                    }
                                });
                                // console.log( $scope.showGrid );
                                // console.log( $scope.featured );
                                // console.log( $scope.sameLevel );

                                $.each( $scope.sameLevel, function( __t, __d ) {
                                    var noFeatured = false;
                                    if ( _.keys( $scope.featured[ __t ] ).length === 0 ) {
                                        noFeatured = true;
                                        $.each( __d, function( __tempName, __data ) {
                                            $scope.showData( __t, __tempName );
                                            return false;
                                        });
                                    }
                                    else {
                                        $scope.showGrid[ __t ] = true;
                                        $scope[ __t + 'FeaturedKey' ] = _.keys( $scope.featured[ __t ] )[0];
                                    }

                                    if ( $scope.areaInfo.type === 'city' || $scope.areaInfo.type === 'suburb' || __t === 'project' || noFeatured ) {
                                        var x = {}, showKey = {};
                                        $.each( $scope.featured[ __t ], function( name, data ) {
                                            x[ name ] = data;
                                            showKey[ __t ] = name;
                                        });
                                        $.each( $scope.sameLevel[ __t ], function( name, data ) {
                                            x[ name ] = data;
                                            if ( !showKey[ __t ] ) {
                                                //  if no featured data, open any tab(last)
                                                showKey[ __t ] = name;
                                            }
                                        });
                                        $scope.sameLevel[ __t ] = x;
                                        $scope[ __t + 'FeaturedKey' ] = false;
                                        $scope.showAlsoSee( __t, showKey[ __t ] );
                                    }
                                    $scope.displayOrder[ __t ] = _.keys( $scope.sameLevel[ __t ] );
                                });

                                //  if hash is present in the URL
                                if ( __hash !== '' ) {
                                    //  check if this hash exists in featured or sameLevel
                                    $.each( $scope.featured, function( __t, __d ) {
                                        if ( __hash === __d.id ) {
                                            $scope.showData( __t, __d.name );
                                            __hashFound = true;
                                            return false;
                                        }
                                    });
                                    if ( !__hashFound ) {
                                        $.each( $scope.sameLevel, function( __t, __data ) {
                                            $.each( __data, function( __name, __d ) {
                                                if ( __hash === __d.id ) {
                                                    $scope.showAlsoSee( __t, __name );
                                                    __hashFound = true;
                                                    return false;
                                                }
                                            });
                                            if ( __hashFound ) {
                                                return false;
                                            }
                                        });
                                    }
                                }
                            });
                        }   //  __makeCall ends here
                    });

                    $scope.showAlsoSee = function( type, hashId ) {
                        if ( hashId ) {
                            $scope.showingData[ type ] = true;
                            $scope.showData( type, hashId );
                        }
                    };

                    $scope.showData = function( type, hashId ) {
                        if ( type === 'locality' ) {
                            $scope.locKey = hashId;
                        }
                        else if ( type === 'builder' ) {
                            $scope.buiKey = hashId;
                        }
                        else if ( type === 'project' ) {
                            $scope.proKey = hashId;
                        }
                        $scope.cName[ type ] = [];
                        $scope.cName[ type ][ hashId ] = 'active';
                    };

                    $scope.getImagePath = function( url ) {
                        return Formatter.getImagePath( url, 'MOBILE_3' );
                    };

                    $scope.loadMore = function( type, start, end ) {
                        if ( type === 'locality' ) {
                            LocalityService.getAllLocality( $scope.areaInfo.type, $scope.areaInfo.id, start, end ).then( function( data ) {
                                updateLoadMore( data, 'Locality' );
                            });
                        }
                        else if ( type === 'builder' ) {
                            BuilderService.getAllBuilder( $scope.areaInfo.type, $scope.areaInfo.id, start, end ).then( function( data ) {
                                updateLoadMore( data, 'Builder' );
                            });
                        }
                    };

                    var updateLoadMore = function( data, type ) {
                        for ( var __c = 0; __c < data.length; __c++ ) {
                            $scope[ 'all' + type + 'Text' ] = 'View More';
                            if ( type === 'Builder' ) {
                                if ( shownBuilderId.indexOf( data[ __c ].id ) === -1 ) {
                                    data[ __c ].propertyId = data[ __c ].id;
                                    $scope.allBuilder.push( data[ __c ] );
                                    shownBuilderId.push( data[ __c ].id );
                                    $scope.showBuilder = true;
                                }
                            }
                            else if ( type === 'Locality' && shownLocalityId.indexOf( data[ __c ].localityId ) === -1 ) {
                                shownLocalityId.push( data[ __c ].localityId );
                                data[ __c ].propertyId = data[ __c ].localityId;
                                $scope.allLocality.push( data[ __c ] );
                                $scope.showLocality = true;
                            }
                        }

                        //  load more paging
                        if ( data.length < loadMoreCount ) {
                            //  hide the link if no more data remaining
                            $scope[ 'hideMore' + type ] = true;
                        }
                        else {
                            $scope[ 'start' + type ] += loadMoreCount;
                        }
                    };

                    var getParsedData = function( respData, dataProperty, count ) {
                        if ( !count ) {
                            count = 4;
                        }
                        else if ( dataProperty.id === 'pbuilder' ) {
                            return BuilderParser.parsePopular( respData, count );
                        }
                        else if ( dataProperty.id === 'nlocality' ) {
                            return LocalityParser.parseNearBy( respData, count, putOverviewUrl );
                        }
                        else if ( dataProperty.id === 'hrlocality' ) {
                            return LocalityParser.parseHighestReturn( respData, count );
                        }
                        else if ( dataProperty.id === 'trlocality' || dataProperty.id === 'plocality' ) {
                            if ( respData.length >= 3 ) {
                                return LocalityParser.parseTopRated( respData, count );
                            }
                            else {
                                return null;
                            }
                        }
                        else if ( dataProperty.id === 'mdproject' || dataProperty.id === 'rdproject' || dataProperty.id === 'pproject' || dataProperty.id === 'hrproject' ) {
                            return ProjectParser.parseDiscussed( respData, count );
                        }
                    };
                    //GA/MIXPANEL - when user clicked on any forward flow
                    $scope.forwardflowTracking = function (widgetName, propertyId, propertyName, linkName) {					
						var sublabel, clusterObj = {};
						sublabel = widgetName+'-'+$rootScope.CURRENT_ACTIVE_PAGE;
						propertyId = (typeof propertyId!= 'undefined') ? propertyId : 0
						clusterObj[propertyName+' ID']		= propertyId
						clusterObj['Widget Name']			= widgetName
						clusterObj['Link Name']				= linkName					
						clusterObj['Page Name']				= $rootScope.CURRENT_ACTIVE_PAGE
						$rootScope.TrackingService.sendGAEvent('panel', 'clicked', sublabel); 
						$rootScope.TrackingService.mixPanelTracking('Widget Clicked', clusterObj);	
					}
                    
                }
            });
        }
    };
});
