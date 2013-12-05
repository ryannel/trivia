'use strict';

Application.Controllers.controller('create', ['$scope', '$routeParams', '$location', 'socket', function($scope, $routeParams, $location, socket){
    $location.hash(null);
    socket.emit('create');
    
    socket.on('join', function (sucess) {
        if (sucess) {
            $location.path('/trivia');
        }
    });

    $scope.start = function () {
        socket.emit('start');
        $location.path( '/trivia' );
    };

    $scope.$on('$destroy', function () {
        socket.removeAllListeners();
    });
}]);