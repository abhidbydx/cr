'use strict';

/**
 * @ngdoc overview
 * @name intranetApp
 * @description
 * # intranetApp
 *
 * Main module of the application.
 */
angular
  .module('intranetApp', ['ngRoute',
    'ngCookies',
    'ngResource'    
  ])
  .config(function ($routeProvider,$locationProvider) {
    //$locationProvider.html5Mode(true).hashPrefix('!');
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })      
      .when('/crlisting', {
        templateUrl: 'views/listing.html',
        controller: 'ListingCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  
