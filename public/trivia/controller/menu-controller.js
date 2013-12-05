'use strict';

Application.Controllers.controller('menu', ['$scope', '$routeParams', '$location', 'socket', function($scope, $routeParams, $location, socket){
    $location.hash(null);

    socket.on('available', function (data) {
        $scope.available = data;
    });

    socket.emit('menu');

    $scope.$on('$destroy', function () {
        socket.removeAllListeners();
    });

    $scope.notAvailable = function () {
        if ($scope.available === 0) {
            return true;
        } else {
            return false;
        }
    }
}]);