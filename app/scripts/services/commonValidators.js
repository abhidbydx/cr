/**
   * Name: Common Validators
   * Description: It will have all validation methods used in UI project.
   * @author: [Abhishek kumar]
   * Date: sept 1, 2014
**/
'use strict';
angular.module('intranetApp')
.factory('CommonValidators', function () {
    
    var numericRegex = '^((\\d+\\.?\\d{1,2})|(\\.?\\d{1,2}))$';
    
    var integerRegex = '^\\d+$';
    
    var specialCharacterRegex = '[^A-Za-z0-9.-]';
    
    var negativeNumericRegex = '^-?\\d+\\.?\\d{0,2}$';
    
    var stringWithOutSpecialCharRegex = '^[^<>$%^;&\'\"]*$';
    
    var stringForTagsRegex = '^[^<>\'\"]*$';
    
    var alphanumericRegex = '^[a-zA-Z0-9]+$';


    var URLRegex = "^(http|https|ftp)\\://"
      + "?(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?" //user@ 
      + "(([0-9]{1,3}\\.){3}[0-9]{1,3}" // IP- 199.194.52.184 
      + "|" // allows either IP or domain 
      + "([0-9a-zA-Z_!~*'()-]+\\.)*" // tertiary domain(s)- www. 
      + "([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\\." // second level domain 
      + "[a-zA-Z]{2,6})" // first level domain- .com or .museum 
      + "(:[0-9]{1,4})?" // port number- :80 
      + "((/?)|" // a slash isn't required if there is no file name 
      + "(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$";

    var dateRegex = "^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$";
        
    var validate = function(value, regex){
      var rexp = new RegExp(regex);
      var isValid = rexp.test(value);
      return isValid;
    };

    var isInteger = function(value){
      return validate(value, integerRegex);
    };

    var isNumeric = function(value){
  		return validate(value, numericRegex);
  	};

  	var isAlphanumeric = function(value){
  		return validate(value, alphanumericRegex);
  	};

  	var isDate = function(value){
  		return validate(value, dateRegex);
  	};

    var haveSpecialCharacters = function(value){
      return validate(value, specialCharacterRegex);
    };

    var haveTags = function(value){
      return validate(value, stringForTagsRegex);
    };

    var getlengthRegex = function(length) {
        var lengthRegex = "^[^<>'\"]{1,dynamic}$";
        var regex = lengthRegex.replace('dynamic', length);
        return regex;
    };

    var isValidString = function( str ) {
      if ( str && str.trim().length > 0 ) {
        return true;
      }
      return false;
    };

    var isName = function( name ) {
      var nameRegex = /[a-zA-Z ]+/;   //  as we are already trimming
      if ( name && nameRegex.test( name.trim() ) ) {
        return true;
      }
      return false;
    };

    var isCountry = function( name ) {
      var nameRegex = /[a-zA-Z ]+/;   //  as we are already trimming      
      if ( name && nameRegex.test( name.trim() ) ) {
        return true;
      }
      return false;
    };

    var isMobile = function( mobile ) {
      if ( isInteger( mobile ) && mobile.trim().length === 10 ) {
        return true;
      }
      return false;
    };

    var isEmail = function( email ) {
      var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if ( email && emailRegex.test( email.trim() ) ) {
        return true;
      }
      return false;
    };

    return {
      isName    : isName,
      isDate    : isDate,
      isEmail   : isEmail,
      isMobile  : isMobile,
      haveTags  : haveTags,
      isInteger : isInteger,
      isNumeric : isNumeric,
      isValidString : isValidString,
      getlengthRegex : getlengthRegex,
      isAlphanumeric : isAlphanumeric,
      haveSpecialCharacters : haveSpecialCharacters,
      isCountry :isCountry
    };
});