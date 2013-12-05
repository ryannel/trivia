'use strict';

/**
* The application file bootstraps the angular app by  initializing the main module and 
* creating namespaces and modules for controllers, filters, services, and directives. 
*/

var Application = Application || {};

Application.Constants = angular.module('application.constants', []);
Application.Services = angular.module('application.services', []);
Application.Controllers = angular.module('application.controllers', []);
Application.Filters = angular.module('application.filters', []);
Application.Directives = angular.module('application.directives', []);

angular.module('application', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'application.filters',
  'application.services',
  'application.directives',
  'application.constants',
  'application.controllers'
])
  .config(function($routeProvider) {
    
    $routeProvider
      .when('/', {
          templateUrl: 'trivia/partial/menu-partial.html',
      })
      .when('/create', {
          templateUrl: 'trivia/partial/create-partial.html',
      })
      .when('/join', {
          templateUrl: 'trivia/partial/join-partial.html',
      })
      .when('/trivia', {
          templateUrl: 'trivia/partial/trivia-partial.html',
      })
      .when('/results', {
          templateUrl: 'trivia/partial/results-partial.html',
      })
      .otherwise({
          redirectTo: '/'
      });
  });
