/**
   * Name: Formatter
   * Description: This file contains all formatter that are used by this application
   * in grid format.
   * @author: [Swapnil Vaibhav]
   * Date: Oct 30, 2013
**/
'use strict';
angular.module('serviceApp')
.factory('Formatter', ['Constants', '$rootScope', '$timeout', function (Constants, $rootScope, $timeout) {
    var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        filterNames = [ 'bed', 'bedrooms', 'bath', 'bathrooms', 'budget', 'unitType', 'projectStatus',
                        'primaryOrResaleBudget', 'locality[]', 'area', 'size', 'start' ],
        ucword = function(str) {
          return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
              return $1.toUpperCase();
          });
        },
        updatedFilterToDisplay = function( fName, fValue ) {
          switch( fName ) {
            case 'locality[]':
              fName = 'Locality';
              fValue = fValue.replace('+', ' ');
              break;
            case 'start':
              fName = 'Page';
              fValue = parseInt( fValue, 10 );
              if ( fValue <= 1 ) {
                fValue = null;
              }
              break;
            case 'budget':
            case 'primaryOrResaleBudget':
            case 'area':
            case 'size':
              var arr = [], unit = '';
              if ( fName === 'budget' || fName === 'primaryOrResaleBudget' ) {
                arr = fValue.split(',');
                if ( fName === 'budget' ) {
                  unit = 'lacs';
                }
                else if ( fName === 'primaryOrResaleBudget' ) {
                  arr[0] = arr[0]/100000;
                  if ( arr[1] ) {
                    arr[1] = arr[1]/100000;
                  }
                  unit = 'lacs';
                }
              }
              else {
                fName = 'Size';
                if ( fValue.indexOf(';') ) {
                  arr = fValue.split(';');
                }
                else {
                  arr = fValue.split(',');
                }
                unit = 'sq ft';
              }
              if ( arr.length === 2 ) {
                if ( fName === 'budget' ) {
                  if ( arr[0] === 0 && arr[1] === 0 ) {
                    fValue = null;
                  }
                  else if ( arr[0] === 0 ) {
                    fValue = 'Upto '+parseInt(arr[1], 10)+' '+unit;
                  }
                  else if ( arr[1] === 0 ) {
                    fValue = parseInt(arr[0], 10)+' '+unit+' onwards';
                  }
                  else {
                    fValue = parseInt(arr[0], 10)+'-'+parseInt(arr[1], 10)+' '+unit;
                  }
                }
                else {
                  for( var i = 0; i < arr.length; i++ ) {
                    if ( parseFloat( arr[i] ).toFixed(2) - parseInt( arr[i], 10 ) < 0.01 ) {
                      arr[i] = parseInt( arr[i], 10 );
                    }
                    else {
                      arr[i] = parseFloat( arr[i] ).toFixed(2);
                    }
                  }
                  fValue = arr[0]+'-'+arr[1]+' '+unit;
                }
              }
              else {
                fValue = null;
              }
              fName = 'Budget';
              break;
            case 'bed':
            case 'bedrooms':
            case 'bath':
            case 'bathrooms':
              if ( fName === 'bed' || fName === 'bedrooms' ) {
                fName = 'Bed';
              }
              else {
                fName = 'Bath';
              }
              // fValue = parseInt( fValue, 10 );
              // if ( fValue === 0 || isNaN( fValue ) ) {
              //   fValue = null;
              // }
              break;
            case 'unitType':
              fName = 'Type';
              break;
            case 'projectStatus':
              fName = 'Status';
              fValue = fValue.replace( ',', ' OR ' );
              fValue = decodeURI( fValue );
              break;
          }
          return [fName, fValue];
        };

    var getDateMonth = function( value ) {
      return monthNames[new Date(value).getMonth()];
    };

    var getDateYear = function( value ) {
      return new Date(value).getFullYear();
    };

    var getDDMMYYYY = function( value, seperator ) {
      if ( !seperator ) {
        seperator = '/';
      }
      var __date = new Date(value);
      return __date.getDate() + seperator + ( __date.getMonth() + 1 ) + seperator + __date.getFullYear();
    };

    var getYYYYMMDD = function( value, seperator ) {
      if ( !seperator ) {
        seperator = '/';
      }
      var __date = new Date(value);
      return __date.getFullYear() + seperator + ( __date.getMonth() + 1 ) + seperator + __date.getDate();
    }

    var getSearchText = function( searchQuery ) {
      var retVal = '-NA-';
      if ( searchQuery && searchQuery.trim().length !== 0 ) {
        searchQuery = searchQuery.trim();
        var hash = [];
        if ( searchQuery.indexOf( '#' ) !== -1 ) {
          hash = searchQuery.split('#');
        }
        else if ( searchQuery.indexOf( '?' ) !== -1 ) {
          hash = searchQuery.split('?');
        }
        if ( hash.length > 1 ) {
          //  hash exists
          hash = hash[1].split('&');
          var str = [];
          $.each( hash, function( count, filter ) {
            var filterNameVal = filter.split('=');
            if ( filterNames.indexOf( filterNameVal[0] ) !== -1 ) {
              var filterToDisplay = updatedFilterToDisplay( filterNameVal[0], filterNameVal[1] );
              if ( filterToDisplay[1] !== null ) {
                str.push( filterToDisplay[0] + ' : ' + filterToDisplay[1] );
              }
            }
          });
          if ( str.length > 0 ) {
            retVal = str.join('; ');
          }
        }
        else {
          //  nothing after hash
        }
      }
      return retVal;
    };

    var convertToIST = function( str ) {
      var date = new Date(str),
      mnth = ('0' + (date.getMonth()+1)).slice(-2),
      day  = ('0' + date.getDate()).slice(-2);
      return [ day, mnth, date.getFullYear() ].join('/');
    };

    var epochToISTMonth = function( d, smallYear ) {
      if ( !d ) {
        return false;
      }
      var retVal = '',
          date = new Date( d );
      if ( smallYear ) {
        var sYear = date.getFullYear() % 100;
        retVal = monthNames[ date.getMonth() ] + ' \'' + sYear;
      }
      else {
        retVal = monthNames[ date.getMonth() ] + ' ' + date.getFullYear();
      }
      return retVal;
    };

    var stripHtml = function (html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        var text = div.textContent || div.innerText || "";
        return text;
    };

    var formatRs = function( num ) {
      num = parseInt( num, 10 );
      var numOrig = num.toString();
      var numString = numOrig.slice(0,-3);

      var acc = '';
      var numList = numString.split('').reverse();
      for (var i in numList) {
        if (numList.hasOwnProperty(i)) {
          var num = numList[i];
          if (i && !(i % 2)) {
            acc = num + ',' + acc;
          } else {
            acc = num + '' + acc;
          }
        }
      }

      var formatStr = acc;
      if (formatStr == '') {
        return numOrig;
      } else {
        return formatStr + numOrig.slice(-3);
      }
    };

    var roundSingleDecimal = function(value){
       return Math.round(value*10) / 10;
    };

    //Formatting prices to go from numbers to lacs/crores
    var formatPrice = function(price){
      var LAC_LABEL = 'Lacs';
      var LAC_STRING_LEN = 6;

      var CRORE_LABEL = 'Cr';
      var CRORE_STRING_LEN = 8;

      if(price) {
          var strPrice = price.toString().split('.')[0];
          var newPrice;
          if(strPrice.length >= LAC_STRING_LEN  && strPrice.length < CRORE_STRING_LEN) {
              newPrice = roundSingleDecimal(price/Math.pow(10, (LAC_STRING_LEN - 1)));

              return newPrice.toString()+' '+LAC_LABEL;
          }
          if(strPrice.length >= CRORE_STRING_LEN){
              newPrice = roundSingleDecimal(price/Math.pow(10, (CRORE_STRING_LEN-1)));
              return newPrice.toString()+' '+CRORE_LABEL;
          } else {

            return strPrice;
          }
      }
      else {
        return '0';
      }
    };

    var formatDate = function( d, monthFirst ) {
      //  2013-11-12 => 12 Nov, 2013
      var dArr = [];
      if ( d.indexOf( '-' ) >= 0 ) {
        dArr = d.split( '-' );
      }
      else if ( d.indexOf( '/' ) >= 0 ) {
        dArr = d.split( '/' );
      }
      else {
        return d;
      }
      var retStr = '',
          day = parseInt( dArr[2], 10 ),
          month = monthNames[ parseInt( dArr[1], 10 ) - 1 ],
          year = dArr[0];
      if ( !isNaN( day ) ) {
        retStr = day;
      }
      if ( month && monthFirst ) {
        retStr = month + ' ' + retStr;
      }
      else {
        retStr += ' ' + month;
      }
      if ( year > 0 ) {
        if ( retStr ) {
          retStr += ', ' + year;
        }
        else {
          retStr = year;
        }
      }
      return retStr;
    };

    var timeSince = function( date ) {
      var seconds = Math.floor( ( new Date() - date ) / 1000 );
      var interval = Math.floor( seconds / 31536000 );

      if ( interval > 1 ) {
          return interval + ' years ago';
      }
      interval = Math.floor( seconds / 2592000 );
      if ( interval > 1 ) {
          return interval + ' months ago';
      }
      interval = Math.floor( seconds / 86400 );
      if ( interval > 1 ) {
          return interval + ' days ago';
      }
      interval = Math.floor( seconds / 3600 );
      if ( interval > 1 ) {
          return interval + ' hours ago';
      }
      interval = Math.floor( seconds / 60 );
      if ( interval > 1 ) {
          return interval + ' minutes ago';
      }
      return Math.floor( seconds ) + ' seconds ago';
    };

    var getImagePath = function(imageURL, size){
      var size, url, ext, newImageURL;
      if(size && Constants.IMAGES[size]) {  
        size = Constants.IMAGES[size];
        //url = imageURL.substring(0, imageURL.lastIndexOf("."));
        //ext = imageURL.substring(imageURL.lastIndexOf("."), imageURL.length);
        //newImageURL = url + '-' + size.width + '-' + size.height + ext;
        newImageURL = imageURL + '?width=' + size.width + '&height=' + size.height;
        return newImageURL;
      }
      return imageURL;
    };

    var getProjectStatusKey = function( status ) {
      var stat = '';
      status = status.toLowerCase();
      switch( status ) {
        case 'launch' :
          stat = 'New Launch';
          break;
        case 'on hold' :
          stat = 'On Hold';
          break;
        case 'under construction' :
          stat = 'Under Construction';
          break;
        case 'not launched' :
        case 'pre launch' :
          stat = 'Launching Soon';
          break;
        case 'ready for possession' :
        case 'occupied' :
          stat = 'Ready to Move In';
          break;
        default :
        stat = 'NA';
      };
      return stat;
    };

    var getEMI = function(total_cost, n) {
      var multiplier = 0;
      var emi = 0;
      if(total_cost){
          if (total_cost && (total_cost.split(' ')[1] && total_cost.split(' ')[1].toLowerCase().slice(0, 3) == 'lac')) {
            multiplier = 100000;
          } else if (total_cost && (total_cost.split(' ')[1] && total_cost.split(' ')[1].toLowerCase().slice(0, 2) == 'cr')){
            multiplier = 10000000;          
          } else {
            multiplier = 1;
          }
          var total_cost_complete = Math.round(total_cost.split(' ')[0] * multiplier);
          var down_payment_complete = parseInt(total_cost_complete) * $rootScope.downPaymentPercentage / 100;
          var loan_amount_complete = total_cost_complete - down_payment_complete;          
          var rate = $rootScope.interestRate / (12 * 100);     
          var emi = (loan_amount_complete * rate * Math.pow((1 + rate), n) / (Math.pow((1 + rate), n) - 1)).toFixed(2);
      }
        
      if(emi == 'NaN'){
        emi = 0;
      }
      return emi;
    };

    var getClassByAmenity = function( name ) {
      var cName = '';
      switch( name.trim().toLowerCase() ) {
        case 'atm':
        case 'bank':
          cName = 'bank';
          break;
        case 'bus-stop':
        case 'bus_stop':
        case 'bus stop':
        case 'busstop':
        case 'bus':
          cName = 'bus-stop';
          break;
        case 'hospital':
          cName = 'hospital';
          break;
        case 'petrol-pump':
        case 'petrol_pump':
        case 'petrolpump':
        case 'petrol':
          cName = 'petrol-station';
          break;
        case 'restaurant':
          cName = 'restaurant';
          break;
        case 'school':
        case 'play-school':
        case 'play_school':
        case 'play school':
        case 'playschool':
        case 'higher-education':
        case 'higher_education':
        case 'higher education':
        case 'highereducation':
          cName = 'school';
          break;
        case 'train-station':
        case 'train_station':
        case 'train station':
        case 'trainstation':
        case 'train':
          cName = 'train-station';
          break;
        case 'metro-station':
        case 'metro_station':
        case 'metro station':
        case 'metrostation':
        case 'metro':
          cName = 'metrostation';
          break;
      }
      cName = 'icon-' + cName;
      return cName;
    };

    var goToEl = function (id,label,type) {
      if ($('#' + id).length == 1) {
        $('html, body').animate({
          scrollTop: $('#' + id).position().top - 140,
          duration: 1000
        });
      }
		//GA/MIXPANEL - when user click on go to links
		if(typeof label!= 'undefined' ){
			var ga, mix;
			if(type == "sidebar"){
				ga = "sidebar";
				mix = "Sidebar Clicked";
			}else{
				ga = "goto";
				mix = "GOTO Link Clicked";
			}
			$rootScope.TrackingService.sendGAEvent(ga, "clicked", label+"-"+$rootScope.CURRENT_ACTIVE_PAGE); 
			$rootScope.TrackingService.mixPanelTracking(mix,{'Link Name':label,'Page Name':$rootScope.CURRENT_ACTIVE_PAGE}); 
		}
		//End mixpanel
    }; 

    var filterFormatValue = function (value) {
      return value * 100000;
    }

    return {
      ucword       : ucword,
      getDateMonth : getDateMonth,
      getDateYear  : getDateYear,
      getDDMMYYYY  : getDDMMYYYY,
      getYYYYMMDD  : getYYYYMMDD,
      getSearchText: getSearchText,
      convertToIST : convertToIST,
      formatRs     : formatRs,
      formatPrice  : formatPrice,
      formatDate   : formatDate,
      timeSince    : timeSince,
      epochToISTMonth : epochToISTMonth,
      getClassByAmenity  : getClassByAmenity,
      roundSingleDecimal : roundSingleDecimal,
      getProjectStatusKey: getProjectStatusKey,
      getImagePath : getImagePath,
      getEMI       : getEMI,
      goToEl       : goToEl,
      filterFormatValue : filterFormatValue,
        stripHtml  : stripHtml
    };
}]);
