'use strict';
angular.module('serviceApp').factory('Constants', function() {
	return {  		
      LISTINGS : {
  			SINGLE_QUERY_LOAD: 5,
  			AUTO_SCROLL_MULTIPLE: 6
  		},
  		COMPARE : {
  			MAX_PROJECTS: 4
  		},
  		DESCRIPTION : {
  			SHORT_LENGTH: 170
  		},
      GLOBAL : {
        PAGE_TYPES : {
		"LISTING" : 'listing', 
		"PROJECT" : 'project', 
		"MAP" : 'map', 
		"PROPERTY" : 'property',
		"COMPARE" : 'compare',
		"PORTFOLIO": 'portfolio',
		"PROJECTDETAIL": 'projectdetail',
    "HOME": 'home'
    },
        MAX_ZINDEX : 12
      },
      JAN2012 : 1325356200000,
      IMAGES : {
        THUMBNAIL : {
          "width": 130,
          "height": 100
        },
        SMALL : {
          "width": 360,
          "height": 270
        },
        MEDIUM : {
          "width": 520,
          "height": 400
        },
        LARGE : {
          "width": 1336,
          "height": 768
        },
        MOBILE_0 :{
          "width": 220,
          "height": 120
        },
        MOBILE_1 : {
          "width": 280,
          "height": 200
        },
        MOBILE_2 :{
          "width": 320,
          "height": 220
        },
        MOBILE_3 : {
          "width": 360,
          "height": 240
        },
        MOBILE_4 :{
          "width": 420,
          "height": 280
        },
        MOBILE_5 : {
          "width": 480,
          "height": 320
        },
        MOBILE_6 : {
          "width": 520,
          "height": 340
        },
        MOBILE_7 : {
          "width": 1040,
          "height": 780
        },
        MOBILE_8 : {
          "width": 380,
          "height": 280
        },
        MOBILE_9 : {
          "width": 940,
          "height": 720
        },
        MOBILE_10 : {
          "width": 680,
          "height": 580
        },
        MOBILE_11 : {
          "width": 800,
          "height": 620
        },
        MOBILE_12 : {
          "width": 940,
          "height": 720
        },
        MOBILE_13 : {
          "width": 520,
          "height": 400
        }
      },
      VALID_PROJECT_STATUS : ['Launching Soon', 'New Launch'],
      UNITTYPE_COUNT : 5
  	};
 });
