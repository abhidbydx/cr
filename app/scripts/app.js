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
  .module('intranetApp', ['ngRoute','ngGrid', 'ngSanitize','angularFileUpload', 
    'ngCookies',
    'ngResource'    
  ])
  .config(function ($routeProvider,$locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })      
      .when('/crlisting', {
        templateUrl: 'views/listing.html',
        controller: 'ListingCtrl'
      })
      .when('/sendInvitation', {
        templateUrl: 'views/sendInvitation.html',
        controller: 'sendInvitation'
      })
      .when('/showChangeRequests/:projectID', {
        templateUrl: 'views/showChangeRequest.html',
        controller: 'changeRequest'
      })
      .when('/addCr/:projectID', {
        templateUrl: 'views/addChangeRequest.html',
        controller: 'changeRequest'
      })
      .when('/registers/:param', {
        templateUrl: 'views/registration.html',
        controller: 'registration'
      })
      .when('/profile', {
        templateUrl: 'views/updateProfile.html',
        controller: 'updateProfile'
      })
      .when('/changePassword', {
        templateUrl: 'views/changePassword.html',
        controller: 'changePassword'
      })
      .when('/clients', {
        templateUrl: 'views/showClient.html',
        controller: 'showClient'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  
