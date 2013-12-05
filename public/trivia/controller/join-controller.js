'use strict';

Application.Controllers.controller('join', ['$scope', '$routeParams', '$location', 'socket', function($scope, $routeParams, $location, socket){
    $location.hash(null);
    socket.emit('join');

    $scope.joining = true;
    socket.on('join', function (sucess) {
        $scope.joining = sucess;
        
        if (sucess) {
            socket.emit('start');
            $location.path('/trivia');
        }
    });

    $scope.$on('$destroy', function () {
        socket.removeAllListeners();
    });
}]);