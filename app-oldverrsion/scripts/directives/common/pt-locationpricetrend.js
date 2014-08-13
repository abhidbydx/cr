/**
  * Name: Location Price Trend Directive
  * Description: Price Trend Directive.
  * @author: [Swapnil Vaibhav]
  * Date: Jan 29, 2014
***/
'use strict';
angular.module('serviceApp').directive('ptLocationpricetrend', function() {
    return {
        restrict : 'A',
        scope : { areainfo : '=' },
        templateUrl: 'views/directives/common/pt-locationpricetrend.html',
        controller : function( $scope, $rootScope, $timeout, LocalityService, CityService, CommonLocationService, GlobalService, WidgetConfig, GraphParser, ProjectParser, LocalityParser, Formatter ) {
            var projectFullData = {},
                localityData = {},
                barData = {},
                countSize = {},
                intervalString = '2000,3000,4000,5000,6000,7000',
                // intervalString = '1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000',
                cityId = '',
                composityUrlArr = [],
                composityObj = {},
                dominantLocalityType = '',
                dominantProjectType = '',
                locById = {},   //  needed for comparision graph
                gNameArr = [ 'singleTrend', 'showCountSize', 'showBedPrice', 'showComparision', 'showCountStatus', 'showDemandBarGraph' ];
            $scope.keyList = {
                'Apartment' : false,
                'Plot'      : false,
                'Villa'     : false
            };
            $scope.showLink = {};
            $scope.singleTrend = false;
            // $scope.localityCheck = false;
            $scope.fsWidgetName = 'Real Estate Trends ';
            $scope.trend = WidgetConfig.FinancialSummary.PriceTrend;
            $scope.barTrend = WidgetConfig.FinancialSummary.Comparision;
            if($rootScope.pageType == "suburb" || $rootScope.pageType == "city"){
				 $scope.barTrend.widgetData.displayInfo.title.text = "Price comparison of popular localities";
		    }
            $scope.bedPrice = WidgetConfig.FinancialSummary.PropertyPrice;
            $scope.countSize = WidgetConfig.FinancialSummary.RateBucket;
            $scope.countStatus = WidgetConfig.FinancialSummary.StatusCount;
            $scope.demandBarGraph = WidgetConfig.FinancialSummary.DemandBar;
            
            if ( $scope.areainfo.cityInfo && $scope.areainfo.cityInfo.name ) {
				if($rootScope.pageType == "suburb" || $rootScope.pageType == "city"){
				 $scope.demandBarGraph.widgetData.displayInfo.title.text = "Demand comparison of popular localities";
		        }
				$scope.demandBarGraph.widgetData.displayInfo.title.text += ( ' in ' + $scope.areainfo.cityInfo.name );
            }

            var updateCompositeArr = function( thisUrl, varName ) {
                if ( thisUrl && typeof thisUrl === 'string' ) {
                    composityUrlArr.push( thisUrl );
                    composityObj[ thisUrl ] = varName;
                }
            };

            $scope.$watch( 'areainfo', function( newInfo, oldInfo ) {
                $scope.showWidget = false;
                if ( newInfo ) {
                    if ( newInfo.name ) {
                        $scope.fsWidgetName += newInfo.name;
                    }
                    if ( newInfo.cityInfo ) {
                        cityId = newInfo.cityInfo.id;
                    }


                    if ( newInfo.type === 'city' ) {
                        cityId = newInfo.id;
                        updateCompositeArr( LocalityService.getHithertoPriceTrend( 'cityId', newInfo.id, true ), 'priceTrend' );

                        updateCompositeArr( LocalityService.getPriceByBed( 'cityId', newInfo.id, true ), 'priceBed' );


                        CommonLocationService.getBasicInfo( 'city', newInfo.id ).then( function( data ) {
                            if ( data.projectStatusCount ) {
                                $scope.statusCount = data.projectStatusCount;
                            }
                        });
                        CityService.getLocality( newInfo.id, 'city' ).then( function( data ) {
                            $scope.compareLocality = data;
                        });

                        $scope.fieldType = {
                            id   : newInfo.id,
                            type : 'cityId'
                        };
                    }
                    else if ( newInfo.type === 'suburb' ) {
                        updateCompositeArr( LocalityService.getHithertoPriceTrend( 'suburbId', newInfo.id, true ), 'priceTrend' );

                        updateCompositeArr( LocalityService.getPriceByBed( 'suburbId', newInfo.id, true ), 'priceBed' );


                        CommonLocationService.getBasicInfo( 'suburb', newInfo.id ).then( function( data ) {
                            if ( data.projectStatusCount ) {
                                $scope.statusCount = data.projectStatusCount;
                            }
                        });
                        CityService.getSuburbLocality( newInfo.id ).then( function( data ) {
                            $scope.compareLocality = data;
                        });

                        $scope.fieldType = {
                            id   : newInfo.id,
                            type : 'suburbId'
                        };
                    }
                    else if ( newInfo.type === 'locality' ) {
                        if ( newInfo.projectInfo ) {
                            updateCompositeArr( LocalityService.getHithertoPriceTrend( 'projectId', newInfo.projectInfo.id, true ), 'projectTrend' );
                            updateCompositeArr( LocalityService.getDominantPriceTrend( 'localityId', newInfo.id, newInfo.projectInfo.unitType, true ), 'priceTrend' );
                            if ( newInfo.projectInfo.unitType ) {
                                //  update graph title
                                $scope.trend.widgetData.displayInfo.title.text = newInfo.projectInfo.unitType + ' Prices';
                            }
                        }
                        else {
                            updateCompositeArr( LocalityService.getHithertoPriceTrend( 'localityId', newInfo.id, true ), 'priceTrend' );
                        }

                        updateCompositeArr( LocalityService.getPriceByBed( 'localityId', newInfo.id, true ), 'priceBed' );

                        CommonLocationService.getBasicInfo( 'locality', newInfo.id ).then( function( data ) {
                            if ( data.dominantUnitType ) {
                                if ( !newInfo.projectInfo ) {
                                    $scope.trend.widgetData.displayInfo.title.text = data.dominantUnitType + ' Prices';
                                }
                                dominantLocalityType = data.dominantUnitType;
                            }
                            if ( data.projectStatusCount ) {
                                $scope.statusCount = data.projectStatusCount;
                            }
                            $scope.compareLocality = {
                                label: data.label,
                                lat  : data.latitude,
                                lon  : data.longitude,
                                price: parseInt( data.avgPricePerUnitArea, 10 ),
                                url  : data.url,
                                ourl : data.overviewUrl
                            };
                        });

                        $scope.fieldType = {
                            id   : newInfo.id,
                            type : 'localityId'
                        };
                    }

                    if ( newInfo.type === 'locality' ) {
                        updateCompositeArr( LocalityService.getProjectCountBySize( 'localityId', newInfo.id, intervalString, true ), 'projectCountSize' );
                    }
                    else if ( newInfo.type === 'suburb' ) {
                        updateCompositeArr( LocalityService.getProjectCountBySize( 'suburbId', newInfo.id, intervalString, true ), 'projectCountSize' );
                    }
                    else {
                        updateCompositeArr( LocalityService.getProjectCountBySize( 'cityId', cityId, intervalString, true ), 'projectCountSize' );
                    }

                    updateCompositeArr( CityService.getDemand( newInfo.cityInfo.id, true ), 'cityDemand' );
                    showGraphOverview();
                }
            });

            $scope.$watch( 'compareLocality', function( compLoc ) {
                if ( compLoc ) {
                    // console.log( 'in here !!!!', compLoc );
                    if ( $scope.areainfo.type === 'locality' ) {
                        updateCompositeArr( LocalityService.getNearbyLocality( compLoc.lat, compLoc.lon, 10, 0, 5, true ), 'rateComparisionLocality' );
                    }
                    else {
                        locById = LocalityParser.makeObjectById( compLoc );
                        var resp = {}, featured = '', xAxis = [], yAxis = [];
                        if ( _.keys( locById ).length > 1 ) {
                            updateCompositeArr( LocalityService.getLocalityComparission( _.keys( locById ), dominantLocalityType, true ), 'rateComparision' );
                        }
                    }
                    //  make composite call here to make price trends
                    composityUrlArr = _.unique( composityUrlArr );
                    GlobalService.makeCompositeCall( composityUrlArr ).then( function( bigData ) {
                        $.each( bigData, function( __url, __data ) {
                            if ( __data.statusCode === '2XX' ) {
                                $scope[ composityObj[ ( decodeURIComponent( __url ) ) ] ] = __data.data;
                            }
                        })
                    });
                    composityUrlArr = [];
                }

                showGraphOverview();
            });

            $scope.$watch( 'priceTrend', function( nT, oT ) {
                if ( nT ) {
                    $scope.singleTrend = GraphParser.parseHithertoPriceTrend( nT );
                }
            });

            $scope.$watch( 'cityDemand', function( data ) {
                if ( data ) {
                    var featuredLocalityId = '';
                    if ( $scope.areainfo.type === 'locality' ) {
                        featuredLocalityId = $scope.areainfo.id;
                    }
                    $scope.demand = GraphParser.parseDemand( data, featuredLocalityId, 6 );
                }
            });

            $scope.$watch( 'statusCount', function( nStatus ) {
                $scope.showCountStatus = false;
                if ( nStatus ) {
                    var statusData = GraphParser.parseStatusCount( nStatus );
                    if ( statusData ) {
                        var statusCountValue = _.values( statusData );
                        statusCountValue = GraphParser.showCountOnBar( statusCountValue );
                        $scope.showCountStatus = true;
                        $scope.countStatus.widgetData.displayInfo.xAxis.categories = _.keys( statusData );
                        $scope.countStatus.widgetData.displayInfo.series = [];
                        $scope.countStatus.widgetData.displayInfo.series.push({
                            name : 'Number of Projects',
                            showInLegend: false,
                            data : statusCountValue,
                            type : 'column'
                        });
                    }
                    showGraphOverview();
                }
            });

            $scope.$watch( 'projectTrend', function( nPTrend, oPTrend ) {
                $scope.projectPage = false;
                if ( nPTrend ) {
                    var allowedMonth = _.keys( nPTrend ), localityTrend = {};
                    $scope.$watch( 'priceTrend', function( nLTrend, oLTrend ) {
                        if ( nLTrend ) {
                            $scope.projectPage = true;
                            for ( var i = 0; i < allowedMonth.length; i++ ) {
                                if ( nLTrend[ allowedMonth[ i ] ] ) {
                                    localityTrend[ allowedMonth[ i ] ] = nLTrend[ allowedMonth[ i ] ];
                                }
                                else {
                                    //  just to be on the safer side
                                    delete nPTrend[ allowedMonth[ i ] ];
                                }
                            }
                            projectFullData = GraphParser.parseHithertoPriceTrend( nPTrend );
                            localityData = GraphParser.parseHithertoPriceTrend( localityTrend );
                            $scope.singleTrend = ProjectParser.mergePriceTrendData( projectFullData, localityData );
                        }
                    });
                    showGraphOverview();
                }
            });

            $scope.$watch( 'projectCountSize', function( nCount, oCount ) {
                $scope.showCountSize = false;
                if ( nCount ) {
                    countSize = GraphParser.getCountBySize( nCount, cityId, intervalString );
                    if ( countSize.range && countSize.range.length ) {
                        $scope.showWidget = true;
                        $scope.showCountSize = true;
                        $scope.countSize.widgetData.displayInfo.series[0].data = countSize.pieData;
                    }
                    showGraphOverview();
                }
            });

            $scope.$watch( 'demand', function( nDemand, oDemand ) {
                $scope.showDemandBarGraph = false;
                if ( nDemand ) {
                    if ( nDemand.xAxis.length > 0 ) {
                        $scope.showDemandBarGraph = true;
                        $scope.showWidget = true;
                        $scope.demandBarGraph.widgetData.displayInfo.series = [];
                        $scope.demandBarGraph.widgetData.displayInfo.series.push({
                            name : 'Customer demand',
                            showInLegend: false,
                            data : nDemand.yAxis
                        });
                        $scope.demandBarGraph.widgetData.displayInfo.xAxis.categories = nDemand.xAxis;
                        $scope.showDemadGraph = true;
                    }
                    showGraphOverview();
                }
            });

            $scope.$watch( 'priceBed', function( nBPrice, oBPrice ) {
                $scope.singlePriceBed = false;
                if ( nBPrice ) {
                    $scope.singlePriceBed = GraphParser.parseBedPrice( nBPrice );
                    showGraphOverview();
                }
            });

            $scope.$watch( 'rateComparisionLocality', function( compareData ) {
                if( compareData && compareData.length ) {
                    var xAxis = [], yAxis = [], __barData = {};
                    $.each( compareData, function( idx, __data ) {
                        if ( __data.avgPricePerUnitArea ) {
                            xAxis.push( __data.label );
                            if ( __data.label === $scope.compareLocality.label ) {
                                __barData = {
                                    y : parseInt( __data.avgPricePerUnitArea, 10 ),
                                    url : __data.url,
                                    color : '#0095b8'
                                };
                            }
                            else {
                                __barData = {
                                    y : parseInt( __data.avgPricePerUnitArea, 10 ),
                                    url : __data.url
                                };
                            }
                            yAxis.push( __barData );
                        }
                    });
                    if ( xAxis.length > 1 ) {
                        $scope.singleBar = {
                            xAxis : xAxis,
                            yAxis : yAxis
                        };
                    }
                }
            });

            $scope.$watch( 'rateComparision', function( compareData ) {
                if ( compareData ) {
                    var resp = {}, featured = '', xAxis = [], yAxis = [];
                    resp = GraphParser.parseLocalityComparision( compareData );
                    if ( _.keys( resp ).length ) {
                        var __idx = resp.xAxis.indexOf( $scope.areainfo.id.toString() );
                        for( var i = 0; i < resp.xAxis.length; i++ ) {
                            if ( i !== __idx && resp.yAxis[ i ] !== null ) {
                                xAxis.push( locById[ resp.xAxis[ i ] ].label );
                                yAxis.push({ y : resp.yAxis[ i ], url: locById[ resp.xAxis[ i ] ].url });
                            }
                        }
                    }
                    $scope.singleBar = {
                        xAxis : xAxis,
                        yAxis : yAxis
                    };
                }
            });

            $scope.$watch( 'singleTrend', function( data ) {
                $scope.trend.widgetData.displayInfo.seriesMeta = [];
                if ( data ) {
                    $scope.localityData = [
                        {
                            name : 'Price',
                            data : data.avg,
                            showInLegend: false,
                        },
                    ];
                    if ( $scope.projectPage ) {
                        if ( _.keys( data ).length ) {
                            $scope.projectData = [
                                {
                                    data : data.projectAvg,
                                    name : $scope.areainfo.projectInfo.label
                                },
                                {
                                    data : data.avg,
                                    name : $scope.areainfo.data.locSubName
                                }
                            ];
                        }
                        else {
                            $scope.singleTrend = false;
                        }
                    }
                    $scope.trend.widgetData.displayInfo.series = [];
                    if ( $scope.singleTrend ) {
                        if ( $scope.projectPage ) {
                            $scope.trend.widgetData.displayInfo.series = mergerTwoArr( [], $scope.projectData );
                        }
                        else {
                            $scope.trend.widgetData.displayInfo.series = mergerTwoArr( [], $scope.localityData );
                        }
                        $scope.trend.widgetData.displayInfo.xAxis.categories = data.keys;
                    }
                    if ( $scope.areainfo.projectInfo ) {
                        hideGraph();
                    }
                    showGraphOverview();
                }
                else if ( $scope.singleTrend === false && $scope.areainfo && $scope.areainfo.projectInfo ) {
                    //  project page and price trend not available
                    showBottomGraph();
                }
            });

            $scope.$watch( 'singlePriceBed', function( data ) {
                $scope.showBedPrice = false;
                if ( data ) {
                    $scope.showBedPrice = true;
                    $scope.bedPrice.widgetData.displayInfo.series = [];
                    $scope.bedPrice.widgetData.displayInfo.xAxis.categories = [];
                    $scope.bedPrice.widgetData.displayInfo.xAxis.categories = data.bed;
                    $scope.bedPrice.widgetData.displayInfo.series.push({
                        name : 'Minimum Budget',
                        data : data.min,
                        visible : false,
                        type : 'column'
                    });
                    $scope.bedPrice.widgetData.displayInfo.series.push({
                        name : 'Average Budget',
                        data : data.mean,
                        type : 'column'
                    });
                    $scope.bedPrice.widgetData.displayInfo.series.push({
                        name : 'Maximum Budget',
                        data : data.max,
                        visible : false,
                        type : 'column'
                    });
                }
            });

            $scope.$watch( 'singleBar', function( data ) {
                $scope.showComparision = false;
                if ( data ) {
                    if ( data.xAxis.length ) {
                        $scope.showWidget = true;
                        $scope.showComparision = true;
                        $scope.barTrend.widgetData.displayInfo.xAxis.categories = data.xAxis;
                        $scope.barTrend.widgetData.displayInfo.series = [];
                        $scope.barTrend.widgetData.displayInfo.series.push({
                            showInLegend: false,
                            name : 'Average Price',
                            data : data.yAxis,
                            type : 'column',
                            color: '#ABD8F4'
                        });
                    }
                }
            });

            var resetKeyList = function() {
                $.each( $scope.keyList, function( __k, __bool ) {
                    $scope.keyList[ __k ] = false;
                });
            };

            var addToKeyList = function( newKey ) {
                if ( $scope.keyList[ newKey ] === false ) {
                    $scope.keyList[ newKey ] = true;
                }
            };

            var mergerTwoArr = function( a, b ) {
                for( var j = 0; j < b.length; j++ ) {
                    a.push( b[ j ] );
                }
                return a;
            };

            $scope.showGraph = function( gName, label) {
                if ( $scope[ gName ] ) {
                    hideGraph();
                    $scope.showLink.global = true;
                    $scope.showLink[ gName ] = true;
                    $scope.showLink[ gName + 'Class' ] = 'active';
                    if(label){
                        //Send GA/Mixpanel tracker event request when graph clicked
                        $rootScope.TrackingService.sendGAEvent("graph", "clicked", label+"-"+$rootScope.CURRENT_ACTIVE_PAGE); 
                        $rootScope.TrackingService.mixPanelTracking("Graph Viewed",{'Graph Name':label,'Page Name':$rootScope.CURRENT_ACTIVE_PAGE}); 
                    }
                }
            };

            $scope.focusG = function() {
                //  adding delay so that element gets created if it not there
                $timeout( function() {
                    Formatter.goToEl( 'subgraph' );
                }, 300);
            };

            var hideGraph = function() {
                for( var cnt = 0; cnt < gNameArr.length; cnt++ ) {
                    $scope.showLink[ gNameArr[ cnt ] ] = false;
                    $scope.showLink[ gNameArr[ cnt ] + 'Class' ] = '';
                }
            };

            var showGraphOverview = function() {
                if ( $scope.areainfo && $scope.areainfo.pgType === 'overview' ) {
                    showBottomGraph();
                }
            };

            var showBottomGraph = function() {
                for( var __c = gNameArr.length - 1; __c > 0; __c-- ) {
                    $scope.showGraph( gNameArr[ __c ] );
                }
            };
            var watcher = $rootScope.$watch('PARSED_URL_DATA', function (n, o) {
                if (n) {
                    if ( $rootScope.PARSED_URL_DATA.TYPE.indexOf( 'overview' ) !== -1 ) {
                        //  overview page, open the below graph by default
                        for ( var gCnt = 0; gCnt < gNameArr.length; gCnt++ ) {
                            if  ( $scope[ gNameArr[ gCnt ] ]  && gNameArr[ gCnt ] !== 'trend' ) {
                                $scope.showGraph( gNameArr[ gCnt ] );
                                break;
                            }
                        }
                    }
                    watcher();
                }
            });            
        }
    };
});
