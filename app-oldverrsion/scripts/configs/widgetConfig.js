
/**
 * Name: Widdget Configuration File
 * Description: It contains widget specific data.
 * @author: [Nakul Moudgil]
 * Date: Sep 19, 2013
 **/
'use strict';
angular.module('WidgetConfig',['ngResource'])
    .factory('WidgetConfig', function () {
	/**
	 * configuration templates
	 */
	return {
	    'portfolioAtGlance' : {
            'PurchaseReturnCurrent' : {
                name : 'Actual VS Current Price',
                tag : '',
                type : 'graph',
                widgetData : {
                    displayInfo : {
                        title : {
                            text : ''
                        },
                        subtype : 'waterfall',
                        plotOptions: {
                            series: {
                                events: {
                                    legendItemClick: function (event) {
                                        return false;
                                    }
                                }
                            }
                        },
                        legend : {
                            align: 'right',
                            verticalAlign: 'top',
                            layout: 'vertical',
                            itemMarginBottom: 20,
                            x: 0,
                            y: 70
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis : {
                            min : 0
                        },
                        seriesMeta : {
                            properties : {
                                field : ['Initial Investment', 'Overall Return', 'Current Value'],
                                name : ['Initial Investment', 'Overall Return', 'Current Value']
                            },
                            name:['Price (Rs)'],
                            data:'Price'
                        },
                        series : []
                    }
                }
            },
            'PortfolioPriceTrend' : {
                name : 'Price Trend',
                title : {
                    text : 'Price Trend'
                },
                tag : '',
                type : 'graph',
                widgetData :{
                    displayInfo : {
                        title : {
                            text : ''
                        },
                        subtype : 'line',
                        yAxis : {
                            min : 0
                        },
                        xAxis: {
                            categories: [],
                            tickmarkPlacement: 'on',
                            title: {
                                enabled: false
                            }
                        },
                        seriesMeta : {name:['Price (Rs per sq ft)'],data:'price'},
                        series : []
                    },
                    entities : ['price','effectiveDate']
                }
            },
		'ActualvsCurrent' : {
		    name : 'Actual VS Current Price',
		    tag : '',
		    type : 'graph',
		    widgetData : {          
			displayInfo : {
			    subtype : 'column-stacked',
			    title : {
				text : 'Purchase vs Current Price'
			    },
			    xAxis: {
				categories: ['Purchase Price', 'Current Price']
			    },
			    yAxis : {
				min : 0
			    },
			    seriesMeta : {
				properties : {
				    field : ['Purchase Price', 'Current Price', 'Overall Return', 'Goal Amount'],
				    name : ['Purchase Price', 'Current Price', 'Overall Return', 'Goal Amount']
				}, 
				name:['Price'], 
				data:'Price'
			    },
			    series : []
			}
		    }
		},

		'PriceTrend' : {
		    name : 'Price Trend',
		    title : {
			text : 'Price Trend'
		    },
		    tag : '',
		    type : 'graph',        
		    widgetData :{
			displayInfo : {
    			    title : {
				text : 'Portfolio Price Trend'
			    },
			    subtype : 'line',
			    yAxis : {
				min : 0
			    },
			    xAxis: {
				categories: [],
				tickmarkPlacement: 'on',
				title: {
				    enabled: false
				}
			    },
			    plotOptions: {					
					line:{
						events: {
		         		   legendItemClick: function () {
		                		return false; 
		            		}
		        		}
					}
			    },
			    seriesMeta : {name:['Price'],data:'price'},
			    series : []
			},
			entities : ['price','effectiveDate']
  		    }
  		}
	    },

	    'FinancialSummary' : {
            'PurchaseReturnCurrent' : {
                name : 'Purchase VS Current Price',
                tag : '',
                type : 'graph',
                widgetData : {
                    displayInfo : {
                        title : {
                            text : ''
                        },
                        subtype : 'waterfall',
                        plotOptions: {
                            series: {
                                events: {
                                    legendItemClick: function (event) {
                                        return false;
                                    }
                                }
                            }
                        },
                        legend : {
                            align: 'right',
                            verticalAlign: 'top',
                            layout: 'vertical',
                            itemMarginBottom: 5,
                            x: 0,
                            y: 100
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis : {
                            min : 0
                        },
                        seriesMeta : {
                            properties : {
                                field : ['Initial Investment', 'Overall Return', 'Current Value'],
                                name : ['Initial Investment', 'Overall Return', 'Current Value']
                            },
                            name:['Price (Rs)'],
                            data:'Price'
                        },
                        series : []
                    }
                }
            },
            'PortfolioPriceTrend' : {
                name : 'Price Trend',
                title : {
                    text : 'Price Trend'
                },
                tag : '',
                type : 'graph',
                widgetData :{
                    displayInfo : {
                        title : {
                            text : ''
                        },
                        subtype : 'line',
                        yAxis : {
                            min : 0
                        },
                        xAxis: {
                            categories: [],
                            tickmarkPlacement: 'on',
                            title: {
                                enabled: false
                            }
                        },
                        seriesMeta : {name:['Price (Rs per sq ft)'],data:'price'},
                        series : []
                    },
                    entities : ['price','effectiveDate']
                }
            },
		'ActualvsCurrent' : {
		    name : 'Purchase VS Current Price',
		    tag : '',
		    type : 'graph',
		    widgetData : {          
			displayInfo : {
			    subtype : 'column-stacked',
			    title : {
					text : 'Purchase vs Current Price'
			    },            
			    xAxis: {
					categories: ['Purchase Price', 'Current Price']
			    },
			    yAxis : {
				min : 0
			    },
			    seriesMeta : {
				name : ['Price'], 
				properties : {
				    field : ['totalPrice','currentPrice','changeAmount', 'goalAmount'],
				    name : ['Purchase Price', 'Current Price', 'Overall Return', 'Goal Amount']
				},
				data:'Price'
			    },
			    series : [],
			    //entities : ['totalPrice','currentPrice','changeAmount']
			}
		    }
		},

		'DemandBar' : {
			name : 'Customer Demand',
			title : {
				text : 'Demand'
			},
			type : 'column',
			widgetData : {
				displayInfo : {
					title : {
						text : 'Demand comparison with popular localities'
					},
					subtype : 'column',
					tooltip : {
						pointFormat: '{series.name}: <b>{point.y:.2f}</b>%',
					},
					xAxis : {
						categories : []
					},
					yAxis : {
						labels: {
							format: '{value}%'
						},
						title : {
							text : 'Demand'
						}
					},
					plotOptions: {
						series: {
							dataLabels: {
								enabled: true,
								formatter:function() {
									return this.point.y ? '<strong>'+this.point.y.toFixed( 2 )+'%</strong>' : '';
								}
							}
						}
					},
					seriesMeta : {},
					series : []
				}
			}
		},

		'RateBucket' : {
			name : 'Rate Bucket',
			type : 'pie',
			widgetData : {
				displayInfo : {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false
					},
					title: {
						text: 'Project distribution in various price ranges'
					},
					subtype : 'pie',
					tooltip: {
						useHTML: true,
						pointFormat: '{series.name}: <b>{point.y}</b>'
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							showInLegend: true,
							dataLabels: {
								useHTML: true,
								enabled: true,
								color: '#000000',
								connectorColor: '#000000',
								format: '<b>{point.percentage:.2f}</b>%'
							}
						}
					},
					legend : {
						enabled : true,
						layout: 'vertical',
						align: 'right',
						verticalAlign: 'middle',
						useHTML: true
					},
					seriesMeta : {
					},
					series: [{
						type: 'pie',
						name: 'Project Count',
						data: []
					}]
				}
			}
		},

		'Comparision' : {
			name : 'Comparision',
			title : {
				text : 'Comparison'
			},
			type : 'column',
			widgetData : {
				displayInfo : {
					title : {
						text : 'Price comparison with nearby localities'
					},
					subtype : 'column',
					xAxis : {},
					yAxis : {
						labels: {
							format: '{value}'
						},
						title : {
							text : 'Average Price (Rs per sq ft)'
						}
					},
					plotOptions: {
						series: {
							cursor: 'pointer',
							point: {
								events: {
									click: function() {
										location.href = this.options.url;
									}
								}
							}
						}
					},
					seriesMeta : {},
					series : []
				}
			}
		},

		'PropertyPrice' : {
			name : 'Property Price',
			title : {
				text : 'Property Price'
			},
			type : 'column',
			widgetData : {
				displayInfo : {
					title : {
						text : 'Average Budget'
					},
					subtype : 'column',
					xAxis : {},
					yAxis : {},
					seriesMeta : {
						name : ['Budget (Rs)'],
					},
					series : []
				}
			}
		},

		'StatusCount' : {
			name : 'Status Count',
			title : {
				text : 'Status Count'
			},
			type : 'column',
			widgetData : {
				displayInfo : {
					title : {
						text : 'Project distribution by construction status'
					},
					subtype : 'column',
					xAxis : {},
					yAxis : {
						title: {
							text: 'Number of Projects',
						},
					},
					plotOptions: {
						series: {
							dataLabels: {
								enabled: true,
								formatter:function() {
									return this.point.t ? '<strong>'+this.point.t+'</strong>' : '';
								}
							}
						}
					},
					seriesMeta : {
					},
					series : []
				}
			}
		},

		'ProjectCount' : {
			name : 'Project Count',
			title : {
				text : 'Project Count'
			},
			type : 'bar',
			widgetData : {
				displayInfo : {
					title : {
						text : 'Project count in various Rates Buckets'
					},
					subtype : 'bar',
					xAxis : {
						title : {
							text : 'Rate Bucket (sq ft)'
						},
						labels : {
							rotation : -45
						}
					},
					yAxis : {
						allowDecimals : false
					},
					seriesMeta : {
						name : ['']
					},
					legend: {
						enabled: false
					},
					plotOptions : {
						series: {
							marker: {
								enabled: false
							}
						}
					}
				}
			}
		},
		
		'PriceTrend' : {
		    name : 'Price Trend',
		    title : {
			text : 'Price Trend'
		    },
		    tag : '',
		    type : 'graph',        
		    widgetData :{
			displayInfo : {
			    title : {
				text : 'Property Price Trend'
			    },
			    subtype : 'line',
			    xAxis: {
				categories: [],
				tickmarkPlacement: 'on',
				title: {
				    enabled: false
				}
			    },
				yAxis : {
					title : {
						text : 'Price (Rs per sq ft)'
					},
					labels: {
						format: '{value}'
					},
					min : 0
				},
			    plotOptions: {
				line:{
				    events: {
		         		legendItemClick: function () {
						    return true;
						}
					}
				}
			    },
			    seriesMeta : {name:['Price'],data:'price'},
			    series : []
			},
			entities : ['price','effectiveDate']
		    }
		}
	    },
	    
	    'propertyList' : {
		name : 'Property List',
		tag : '',
		type : 'grid',
		widgetData :{
		    dataView : {
			type : 'By Time',
			interval : 'None',
			segment : 'null'
		    },
		    dateRange : {
			startDate : '',
			endDate : '',
			grain : 'Last Year'
		    },
		    displayInfo : {
			metricList : ['name','projectName','locality','listingId','unitNo','size','listingMeasure','unitName','unitType','tower',
				      'purchaseDate','unitName','builderName','projectName','projectStatus','localityId',
				      'completionDate', 'totalPrice', 'currentPrice', 'listingSize', 'projectId'],
			gridOptions : {
			    enableSorting : false,
			    enablePaging : false,
			    showGroupPanel : false,
			    showFooter : false,
			    rowHeight: 30,
			    columnDefs: [
				{displayName: 'Property', cellTemplate: 'views/directives/portfolio/propLinkTemplate.html'},
				{field:'unitType', displayName:'Type'},
				{displayName:'Config/ Size', cellTemplate:'<div ng-cell-text ng-class="col.colIndex()" title="{{gridData[ row.rowIndex ].unitName}}, {{gridData[ row.rowIndex ].listingSize}} {{gridData[ row.rowIndex ].listingMeasure}}" class="ngCellText">{{gridData[ row.rowIndex ].unitName}}, {{gridData[ row.rowIndex ].listingSize}} {{gridData[ row.rowIndex ].listingMeasure}}</div>'},
				{displayName:'Purchase Price', cellTemplate:'<div ng-cell-text ng-class="col.colIndex()" class="ngCellText"><span class="fa fa-inr"> {{formatPrice( gridData[ row.rowIndex ].totalPrice )}}</span></div>'},
				{displayName:'Current Value', cellTemplate:'<div ng-cell-text ng-class="col.colIndex()" class="ngCellText"><span class="fa fa-inr"> {{formatPrice( gridData[ row.rowIndex ].currentPrice )}}</span></div>'},
                    {displayName:'Change', cellTemplate:'<div ng-cell-text ng-class="col.colIndex() + \' \' + gridData[ row.rowIndex ].changeType + \'-class\'" class="ngCellText" title="{{gridData[ row.rowIndex ].changeAmount}} ({{gridData[ row.rowIndex ].changePercent}}%) {{gridData[ row.rowIndex ].durationText}}"><span class="fa fa-inr"></span> {{gridData[ row.rowIndex ].changeAmount}} ({{gridData[ row.rowIndex ].changePercent}}%) {{gridData[ row.rowIndex ].durationText}}</div>'},
				{field:'projectStatus', displayName:'Status', cellTemplate:'<div ng-cell-text ng-class="col.colIndex()" title="{{gridData[ row.rowIndex ].projectStatus}}" class="ngCellText">{{gridData[ row.rowIndex ].projectStatus}}</div>'},
				{displayName:'Actions', cellTemplate: 'views/directives/common/propUpdateTemplate.html'}
			    ]
			}
		    }
		}
	    },
	    
	    'recentlyViewed' : {
		name : 'RecentlyViewed',
		tag : '',
		type : 'grid',
		widgetData :{
		    dataView : {
			type : 'By Time',
			interval : 'None',
			segment : 'null'
		    },
		    dateRange : {
			startDate : '',
			endDate : '',
			grain : 'Last Year'
		    },
		    displayInfo : {
			metricList : ['projectId','projectName','projectUrl', 'projectLocation','pricePerSqft','price'],
			pageLimit:15,	
			gridOptions : {
			    enableSorting : false,
			    enablePaging : false,
			    showGroupPanel : false,
			    rowHeight: 30,
			    showFooter : false,
			    columnDefs: [
				{field:'projectId', displayName:'projectId', visible:false},
				{field: 'projectName', displayName: 'Name', cellTemplate: 'views/directives/portfolio/rViewedLinkTemplate.html'},
				{field:'projectUrl', displayName:'projectUrl', visible:false},
				{field:'typeId', displayName:'typeId', visible:false},
				{field:'projectLocation', displayName:'Location'},
				{field:'pricePerSqft', displayName:'Rate per Sq ft.'},
				{field:'price', displayName:'Price'}
			    ]			  
			}
		    }
		}
	    },

	    'savedSearches' : {
		name : 'SavedSearches',
		tag : '',
		type : 'grid',
		widgetData :{
		    dataView : {
			type : 'By Time',
			interval : 'None',
			segment : 'null'
		    },
		    dateRange : {
			startDate : '',
			endDate : '',
			grain : 'Last Year'
		    },
		    displayInfo : {
			metricList : ['id','name','url', 'searchText', 'createdDate'],
			gridOptions : {
			    enableSorting : false,
			    enablePaging : false,
			    showGroupPanel : false,
			    rowHeight: 30,
			    showFooter : false,
			    columnDefs: [
				{field: 'name', displayName:'Name', cellTemplate: 'views/directives/common/linktemplate.html'},
				{field: 'searchText', displayName: 'Search Criteria'},
				{field: 'searchText', displayName: 'Date Added', cellTemplate: '<div ng-cell-text ng-class="col.colIndex()" class="ngCellText">{{formatDate( gridData[ row.rowIndex ].createdDate )}}</div>'},
				{displayName:'Action', cellTemplate:'<div class="ngCellText text-center" ng-class="col.colIndex()"><a class="editLink" pt-confirmclick="labels.common.message.CONFIRM_DELETE_GLOBAL" pt-click="del( gridData[ row.rowIndex ].id )"><i class="fa fa-times"></i> Delete</a></div>'}
			    ]
			}
		    }
		}
	    },

	'enquiredProperty' : {
		widgetData : {
		    displayInfo : {
			metricList : ['projectName','name','url','cityName'],
			gridOptions : {
			    enableSorting : false,
			    enablePaging : false,
			    showGroupPanel : false,
			    rowHeight: 30,
			    showFooter : false,
			    columnDefs: [
            {field: 'projectName', displayName: 'Project Name'},
            {field: 'cityName', displayName: 'City'},
            {field: 'name', displayName:'Link', cellTemplate: 'views/directives/common/linktemplate.html'}
            ]
          }
        }
      }
    },

    'myFavorites' : {
		widgetData : {
		    displayInfo : {
			metricList : ['projectId','projectName','projectUrl','cityLabel','builderName'],
			gridOptions : {
			    enableSorting : false,
			    enablePaging : false,
			    showGroupPanel : false,
			    rowHeight: 30,
			    showFooter : false,
			    columnDefs: [
				{field: 'projectName', displayName: 'Name', cellTemplate: 'views/directives/portfolio/rViewedLinkTemplate.html'},
				{field:'cityLabel', displayName:'City'},
				{field:'datetime', displayName:'Added On', cellTemplate:'<div ng-cell-text ng-class="col.colIndex()" class="ngCellText">{{formatDate( gridData[ row.rowIndex ].datetime )}}</div>'},
				{displayName:'Action', cellTemplate:'<div class="ngCellText text-center" ng-class="col.colIndex()"><a class="editLink" pt-confirmclick="labels.common.message.CONFIRM_DELETE" pt-click="del( gridData[ row.rowIndex ].wishListId )"><i class="fa fa-times"></i> Delete</a></div>'}
			    ]
			}
        }
      }
    },

    'propertyDetails' : {
      name : 'Property Details',
      tag : '',
      type : 'pt-propertyDetail',
      widgetData :{                
          metricList : ['name','projectName','locality','listingId','unitNo','size','measure','unitName','unitType','tower',
                        'purchaseDate','unitName','builderName','projectName','projectStatus','localityId', 'loanStatus', 'goalAmount',
                        'completionDate', 'totalPrice', 'currentPrice','projectId', 'typeId', 'cityName', 'listingSize','floorNo','propertyImages']
      }
    },

    'MyPortfolio' : {
      name : 'My Portfolio',
      tag : '',
      type : 'pt-myAccount',
      widgetData :{                
          metricList : ['listingId', 'name']
      }
    }
  };
});
