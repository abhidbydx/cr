'use strict';

var mdl = angular.module('utilityfilters', []);

mdl.filter('joinArray', function(){
    return function(list, count){
        if(!list || !list.length) return '';
    
        var l = list;
        if(count)
            list.splice(1, count);

        return list.join(',');
    };
});

mdl.filter('priceFormatHomePage', function(){
    return function(price, d, c, l, k) {

        // Return if already parsed
        if(typeof price === 'string' && (price.indexOf('Lacs')!==-1 || price.indexOf('k')!==-1 || price.indexOf('Cr')!==-1)) {
            return price;
        }
        // Handling corner cases
        if(typeof price === 'string') {
            price = price.replace(/,/g,'');
        }

        d = (typeof d == 'undefined') ? 'NA' : d;
        if(!price || price === 0) return d;

        var p = parseInt(price), lac, cr, s;
        k = (k || k==='') ? k : 'k';
        l = (l || l==='') ? l : ' Lacs';
        c = (c || c==='')? c : ' Cr';

        if(p < 10000) {
            if(p > 999) {
                s = p.toString();
                s = s.substring(0, s.length-3) + ',' + s.substring(s.length-3);
                return s;
            } else {
                return p;
            }
        }
        // k = -1 case : ex - return value 11,100 instead of 11.1k 
        if(k === -1){
          if(p < 100000){
             s = p.toString();
             s = s.substring(0, s.length-3) + ',' + s.substring(s.length-3);
                return s;
          }
        }else{
          if(p < 100000) return (price/1000).toFixed(1) + k;
        }
        lac = (p/100000).toFixed(1);
        lac = (lac == parseInt(lac)) ? parseInt(lac) : lac;
        cr = (lac > 100) ? (lac/100).toFixed(1) + c : lac + l;
        cr = (cr == parseInt(cr)) ? parseInt(cr) : cr;

        return cr.toString().split('.')[0]+"+ Crores";
    };
});

mdl.filter('priceFormat', function(){
    return function(price, d, c, l, k) {

        // Return if already parsed
        if(typeof price === 'string' && (price.indexOf('Lacs')!==-1 || price.indexOf('k')!==-1 || price.indexOf('Cr')!==-1)) {
            return price;
        }
        // Handling corner cases
        if(typeof price === 'string') {
            price = price.replace(/,/g,'');
        }

        d = (typeof d == 'undefined') ? 'NA' : d;
        if(!price || price === 0) return d;

        var p = parseInt(price), lac, cr, s;
        k = (k || k==='') ? k : 'k';
        l = (l || l==='') ? l : ' Lacs';
        c = (c || c==='')? c : ' Cr';

        if(p < 10000) {
            if(p > 999) {
                s = p.toString();
                s = s.substring(0, s.length-3) + ',' + s.substring(s.length-3);
                return s;
            } else {
                return p;
            }
        }
        // k = -1 case : ex - return value 11,100 instead of 11.1k 
        if(k === -1){
		  if(p < 100000){
			 s = p.toString();
             s = s.substring(0, s.length-3) + ',' + s.substring(s.length-3);
                return s;
          }
		}else{
          if(p < 100000) return (price/1000).toFixed(1) + k;
	    }
        lac = (p/100000).toFixed(1);
        lac = (lac == parseInt(lac)) ? parseInt(lac) : lac;
        cr = (lac > 100) ? (lac/100).toFixed(1) + c : lac + l;
        cr = (cr == parseInt(cr)) ? parseInt(cr) : cr;

        return cr;
    };
});

mdl.filter('_lessCaps',function(){
    return function( __n ) {
        return __n.trim().toUpperCase().replace( '_', ' ' );
    };
});

mdl.filter('roundSingleDecimal', function(){
    return function(value){
            return Math.round(value*10) / 10;
        };
});

mdl.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});


//Need to understand above code and will then choose one of these two
//Formatting prices to go from numbers to lacs/crores 

mdl.filter('formatPrice', function($filter){
     return function(price){
        var round_single_decimal = $filter('roundSingleDecimal');
        var LAC_LABEL = 'Lacs';
        var LAC_STRING_LEN = 6;

        var CRORE_LABEL = 'Cr';
        var CRORE_STRING_LEN = 8;

        if(price) {
            var strPrice = price.toString().split(".")[0];
            var newPrice;
            if(strPrice.length >= LAC_STRING_LEN  && strPrice.length < CRORE_STRING_LEN) {
                newPrice =  round_single_decimal(price/Math.pow(10, (LAC_STRING_LEN - 1)));
                return newPrice.toString()+" "+LAC_LABEL;
            }
            if(strPrice.length >= CRORE_STRING_LEN){
                newPrice = round_single_decimal(price/Math.pow(10, (CRORE_STRING_LEN - 1)));
                return newPrice.toString()+" "+CRORE_LABEL;
            }
        }
        else
            return '';   
    };
});

mdl.filter('dateFormat', function($filter){

    var ngDateFilter = $filter('date');
    return function(date, format) {
        
        if(!date || date === '') return '';
        format = format ? format : "MMM `yy";

        return ngDateFilter(date, format);
    };
});

mdl.filter('stringReplace', function() {
    return function(orig_str, pattern, replaceWith){
        return String(orig_str).replace(pattern, replaceWith);
    };    
});


/**
 * Filter to calculate rate color (0 to 100)
 * @return (0 to 100)
 */
mdl.filter('rateColor', function() {
    return function(rate, minRate, maxRate) {
        var color = 'na';
        rate = parseInt(rate);
        if(rate && minRate && minRate === maxRate) {
            color = 0;
        } else if(rate) {
            color = ((rate-minRate)*100.0)/(maxRate-minRate);
            color = parseInt(color);
        }
        return String(color);
    };
});


/**
 * Filter to calculate date color (0 to 100)
 * @return (0 to 100)
 */
mdl.filter('dateColor', function() {
    return function(date, minDate, maxDate) {
        var color = 'na';
        date = parseInt(date);
        if(date && minDate && minDate === maxDate) {
            color = 0;
        } else if(date) {
            //if possession date if before dec 11 then show in different color
            if(date < 1325356200000) {
                color = "till"; 
            } else {
                color = ((date-minDate)*100.0)/(maxDate-minDate);
                color = parseInt(color);
            }
        }
        return String(color);
    };
});


/**
 * Filter to remove prefix (if exists)
 * @return String without prefix
 */
mdl.filter('removePrefix', function() {
    return function(string, prefix) {
        var regex = new RegExp('^'+prefix, 'g');
        return String(string).replace(regex, '');
    };
});


mdl.filter('rateFMT', function(){
    return function(val){
      return parseInt(val) + " /sq ft";
    }
});


mdl.filter('areaFMT', function(){
    return function(val){
        return parseInt(val.trim()) + " " + "sq ft";
    }
});

mdl.filter('monthFMT', function(){
    return function(val){
        return val + " " + "mo";
    }
});

mdl.filter('yearsFMT', function(){
    return function(val){
        return val + " " + "yrs";
    }
});

mdl.filter('distanceFMT', function(){
    return function(val){
        return val + " " + "km";
    }
});

mdl.filter('figureFMT', function(){
    return function(val){
        if(val){
            return val.toLocaleString();     
        } else {
            return val;
        }
       
    }
})


