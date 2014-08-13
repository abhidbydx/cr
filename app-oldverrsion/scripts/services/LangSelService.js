/**
   * Name: Language Selection Service
   * Description: This service is used for saving user settings   
   * @author: [Nakul Moudgil]
   * Date: Oct 9, 2013
**/
'use strict';
angular.module('serviceApp')
  .factory('LangSelService', function() {
    var API;
      API = {
      options: {
         'lang_en_IN': {'name':'English', 'code':'lang_en_IN'},
         'lang_hi_IN':{'name':'हिन्दी','code':'lang_hi_IN'}        
      },
      defaultLang: 'lang_en_IN',
      langCode:'lang_en_IN',
      langName:'English',

      init: function () {        /*
        if (localStorageService.get('languageCode')) {
          this.langName = this.options[localStorageService.get('languageCode')].name;
          this.langCode = this.options[localStorageService.get('languageCode')].code;
        } */
      },


      setLangCode: function (data) {
        if(data === 'English'){data = 'lang_en_IN';}
        else if(data === 'हिन्दी'){data = 'lang_hi_IN';}
        if(this.options.hasOwnProperty(data)){
        //  localStorageService.add('languageCode', data);
          this.langCode = this.options[data].code;
          this.langName = this.options[data].name;
        }
      },

      getAllOptions: function () {
        return this.options;
      },

      getLangCode:function(){
        return this.langCode;
      },

      getLanguageName: function () {        
        return this.langName;
      }
    };
    API.init();
    return API;
  });
