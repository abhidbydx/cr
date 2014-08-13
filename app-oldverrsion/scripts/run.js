/**
   * Name: Run.js
   * Description: Services mentioned in this file are made instatiated on app start and made avialable globally.
   * This way we can access services in templates.
   * @author: [Nakul Moudgil]
   * Date: Sep 9, 2013
**/
'use strict';

angular.module('serviceApp')
  .run(['$timeout', '$rootScope', 'TrackingService', 'LangService', 'SearchService', 'SeoService', '$location', 'Formatter', function($timeout, $rootScope, TrackingService, LangService, SearchService, SeoService, $location, Formatter) {
    $rootScope.$on('$locationChangeSuccess', function () {
      if($location.path()!='/'){
            $rootScope.fullView = "";
      }
    });
    LangService.then(function(data) {
      $rootScope.labels = data;
    });
    $rootScope.seoData = {};
      $rootScope.$watch("urlData", function(n) {
        if(n){
          if ( $location.path().indexOf( '/maps' ) === -1 ) {   //  dissabling call for maps urls
            SeoService.getSeoTags($location.path(), n).then(function (data) {
              $rootScope.seoData = SeoService.parseSeoTags(data);
              if ($rootScope.seoData.title) {
                angular.element("title").html($rootScope.seoData.title);
              }
            });
          }
        }
      }, true);
    //Added TrackingService for GA/MIXPANEl event to access globaly
    $rootScope.TrackingService = TrackingService;
    $rootScope.interestRate = 11;
    $rootScope.noOfInstallments = 240;
    $rootScope.downPaymentPercentage = 20;
    $rootScope.$watch('PARSED_URL_DATA', function(newVal, oldVal){
      if(newVal && newVal.VIEW_TYPE !== -1 && SearchService.searchController){
        SearchService.searchController(newVal, oldVal);
      }
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'base.project.property') {
        $timeout(function () {Formatter.goToEl('prop_options')});
      }
    });
  }]);
