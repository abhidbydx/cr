/**
 * Name: Chart Configuration File
 * Description: It contains default and chart specific configurations.
 * @author: [Nakul Moudgil]
 * Date: Sep 13, 2013
**/
'use strict';
angular.module('ChartConfig',['ngResource'])
    .factory('ChartConfig', function () {
	/**
	 * configuration templates
	 */
	return {
	    'default' : {
		colors: [ '#0095b8', '#f39c10', '#983366', '#00b763', '#0095de', '#00c39f','#f6c700', '#007ebc', '#e54400', '#9e21ad', '#7c8d8e'],
		chart : {
		    backgroundColor: 'none',
		    type: 'line',
		    reflow:true
		},
		credits: {
		    enabled : false
		},
		series: {
		    negativeColor: '#df2034'
		},
		yAxis:[{
		    title: {style: {color: '#848484',fontSize:'11'}}
		},
		       {
			   title: {style: {color: '#848484',fontSize:'11'}
				  },      
			   opposite:true
		       }],
		legend : {
		    layout : 'horizontal',
		    align : 'left',
		    verticalAlign : 'bottom',
		    borderWidth:'0'
		}
	    },
	    /*************************************/
		'bar' : {
			colors: ['#0095b8', '#f39c10', '#983366', '#00b763', '#0095de', '#00c39f','#f6c700', '#007ebc', '#e54400', '#9e21ad', '#7c8d8e'],
			yAxis: {
				title: {
				style: {color: '#505050',
					fontFamily: 'arial',
					fontSize: 12,
					fontWeight: 'bold'
					}
				}
			},
			xAxis: {
				title: {
				style: {color: '#505050',
					fontFamily: 'arial',
					fontSize: 12,
					fontWeight: 'bold'
					}
				}
			},
			title :{
				style: {
				fontFamily: 'arial',
				fontSize: 16,
				fontWeight: 'normal',
				color: '#505050'
				},
				margin: 30
			},
			legend : {
				layout : 'horizontal',
				align : 'center',
				verticalAlign : 'bottom',
				borderWidth:'0',
				itemStyle: {
				color: '#505050',
				fontSize: '11'
				}
				},
			credits: {
				enabled : false
			},
		},
	    'bar-line' : {
		colors: [ '#0095b8', '#f39c10', '#983366', '#00b763', '#0095de', '#00c39f','#f6c700', '#007ebc', '#e54400', '#9e21ad', '#7c8d8e'],
		chart : {
		    reflow:true
		},
		yAxis: {
		    title: {
			style: {color: '#848484'}
		    }
		},
		legend : {
		    layout : 'horizontal',
		    align : 'center',
		    verticalAlign : 'bottom',
		    borderWidth:'0',
		    itemStyle: {
			color: '#505050',
			fontSize: '11'
		    }
    		},
		credits: {
		    enabled : false
		},
		series:[
		    {type: 'column'},
		    {type: 'spline'},
			{negativeColor: '#df2034'}
		]
	    },
	    /*************************************/
	    'column' : {
		colors: [ '#0095b8', '#f39c10', '#983366', '#00b763', '#0095de', '#00c39f','#f6c700', '#007ebc', '#e54400', '#9e21ad', '#7c8d8e'],
		chart : {
		    type: 'column',
		    reflow:true
		},
		credits: {
		    enabled : false
		},
		series: {
		    negativeColor: '#df2034'
		},
		yAxis: {
		    title: {
			style: {color: '#505050',
			    fontFamily: 'arial',
			    fontSize: 12,
			    fontWeight: 'bold'
				}
		    }
		},
		title :{
	  	    style: {
			fontFamily: 'arial',
			fontSize: 16,
			fontWeight: 'normal',
			color: '#505050'
		    },
			margin: 30
		},		
		legend : {
		    layout : 'horizontal',
		    align : 'center',
		    verticalAlign : 'bottom',
		    borderWidth:'0',
		    itemStyle: {
			color: '#505050',
			fontSize: '11'
		    }
    		}
	    },
	    /*************************************/
	    'column-stacked' : {
		colors: [ '#0095b8', '#f39c10', '#983366', '#00b763', '#0095de', '#00c39f','#f6c700', '#007ebc', '#e54400', '#9e21ad', '#7c8d8e'],
		chart : {
		    type: 'column',
		    reflow:true
		},
		credits: {
		    enabled : false
		},
		title :{
	  	    style: {
			fontFamily: 'arial',
			fontSize: 16,
			fontWeight: 'normal',
			color: '#505050'
		    },
			margin: 30
		},
		yAxis: {
		    title: {
			style: {color: '#848484'}
		    }
		},
		plotOptions : {
            column: {
				stacking: 'normal',
				dataLabels: 
				{
                    enabled: false,
                    color: 'white'
				},
				events: {
         		   legendItemClick: function () {
                		return false; 
            		}
        		}
            }
		},
		legend : {
		    layout : 'horizontal',
		    align : 'center',
		    verticalAlign : 'bottom',
		    borderWidth:'0',
		    itemStyle: {
			color: '#505050',
			fontSize: '11'
		    }
    		}
	    },
	    /*************************************/
	    'area' : {
		colors: [ '#0095b8', '#f39c10', '#983366', '#00b763', '#0095de', '#00c39f','#f6c700', '#007ebc', '#e54400', '#9e21ad', '#7c8d8e'],
		chart : {
		    type: 'area',
		    reflow:true
		},
		credits: {
		    enabled : false
		},
		series: {
            negativeColor: '#df2034'
		},
		yAxis: {
		    title: {
			style: {color: '#505050',
			    fontFamily: 'arial',
			    fontSize: 12,
			    fontWeight: 'bold'
				}
		    }
		},
		legend : {
		    layout : 'horizontal',
		    align : 'center',
		    verticalAlign : 'bottom',
		    borderWidth:'0',
		    itemStyle: {
			color: '#505050',
			fontSize: '11'
		    }
    		}
	    },
	    /*************************************/
	    'line' : {
		colors: [ '#0095b8', '#f39c10', '#983366', '#00b763', '#0095de', '#00c39f','#f6c700', '#007ebc', '#e54400', '#9e21ad', '#7c8d8e'],
		chart : {
		    type: 'line',
		    reflow:true
		},
		credits: {
		    enabled : false
		},
		title :{
	  	    style: {
			fontFamily: 'arial',
			fontSize: 16,
			fontWeight: 'normal',
			color: '#505050'
		    },
			margin: 30
		},
		series: {
            negativeColor: '#df2034'
		},
		yAxis: {
		    title: {
			style: {
			    color: '#505050',
			    fontFamily: 'arial',
			    fontSize: 12,
			    fontWeight: 'bold'
			}
		    }
		},
		legend : {
		    layout : 'horizontal',
		    align : 'center',
		    verticalAlign : 'bottom',
		    borderWidth:'0',
		    itemStyle: {
			color: '#505050',
			fontSize: '11'
		    }
    		}
	    },
	    /*************************************/
	    'pie' : {
		colors: [ '#0095b8', '#f39c10', '#983366', '#00b763', '#0095de', '#00c39f','#f6c700', '#007ebc', '#e54400', '#9e21ad', '#7c8d8e'],
		chart : {
		    type: 'pie',
		    plotBackgroundColor: null,
		    plotBorderWidth: null,
		    plotShadow: false,
		    reflow:true
		},
		title :{
	  	    style: {
			fontFamily: 'arial',
			fontSize: 16,
			fontWeight: 'normal',
			color: '#505050'			
		    },
			margin: 30
		},
		credits: {
		    enabled : false
		},
		plotOptions: {
		    pie: {
			allowPointSelect: true,
			slicedOffset: 5,
			cursor: 'pointer',
			dataLabels: {
			    enabled: true,
			    distance: 15,
			    color: '#000000',
			    connectorColor: '#000000',
			    format: '<b>{point.name}</b>: {point.percentage:.1f} Lacs'
			}
		    }
		}
	    } ,
	    /*************************************/
	    'funnel' : {
		chart : {
		    type: 'funnel',
		    reflow:true
		},
		plotOptions: {
		    series: {
			dataLabels: {
			    enabled: true,
			    format: '<b>{point.name}</b> ({point.y:,.0f})',
			    color: 'black',
			    softConnector: true
			},
			neckWidth: '25%',
			neckHeight: '25%'
		    }
		}
	    },
        'waterfall': {
            colors: [ '#0095b8', '#f39c10', '#983366', '#00b763', '#0095de', '#00c39f', '#f6c700', '#007ebc', '#e54400', '#9e21ad', '#7c8d8e'],
            chart: {
                type: 'waterfall',
                reflow: true
            },
            credits: {
                enabled: false
            },
            series: {
                negativeColor: '#df2034'
            },
            yAxis: {
                title: {
                    style: {color: '#505050',
                        fontFamily: 'arial',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                }
            },
            title: {
                style: {
                    fontFamily: 'arial',
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#505050'
                },
                margin: 30
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: '0',
                itemStyle: {
                    color: '#505050',
                    fontSize: '11'
                }
            }
        }
	};
    });
