'use strict';

Application.Directives
    .directive('counter', function($compile, $http, $timeout) {

        return {
            restrict : 'E',
            replace : true,
            template : '<p class="counter">{{counter}}</p>',
            scope: {},
            link : function(scope) {
                scope.counter = 0;
                scope.onTimeout = function(){
                    scope.counter++;
                    mytimeout = $timeout(scope.onTimeout,1000);
                };
                var mytimeout = $timeout(scope.onTimeout,1000);
            },
        };
    });