'use strict';

Application.Controllers.controller('trivia', ['$scope', '$routeParams', '$location', 'socket', function($scope, $routeParams, $location, socket){
    $location.hash(null);
    
    /* ---------------------- Local functions ------------------------- */

    $scope.end = function () {
        socket.emit('setAnswers', $scope.game);
        $location.path('/results');
    };

    $scope.setResultClass = function () {
        if ($scope.game.players.length > 1) {
            return 'col-xs-6';
        } else {
            return 'col-xs-12';
        }
    };
    
    /* ---------------------- Start up functions ---------------------- */

    var setPlayerPointers = function (playerId) {
        var players = $scope.game.players;
        for (var i = 0; i < players.length; i++) {
            if (players[i].id === playerId) {
                $scope.thisPlayer = $scope.game.players[i];
            }
            else {
                $scope.opponent = $scope.game.players[i];
            }
        }
    };

    // Pupulate answers array with empty values
    var instantiateAnswers = function (player) {
        if (player.answers.length === 0 && $scope.game.questions) {
            for (var i = 0; i < $scope.game.questions.questions.length; i++) {
                player.answers.push('');
            }
        }
    };

    var setResults = function () {
        if ($scope.opponent) {
            var opponent = $scope.opponent;
            if (opponent.score === null) {
                $scope.result = 'wait';
            } else {
                var player = $scope.thisPlayer;
                if (player.score > opponent.score) {
                    $scope.result = 'win';
                } else if (player.score < opponent.score) {
                    $scope.result = 'loss';
                } else {
                    $scope.result = 'draw';
                }
            }
        } else {
            $scope.result = 'solo';
        }
    };

    /* ---------------------- Listeners ------------------------------- */

    socket.on('getGame', function (game) {
        if (!game) {
            $location.path('/');
            return false;
        }

        $scope.game = game;

        socket.emit('getId');
    });

    socket.on('getId', function (playerId) {
        setPlayerPointers(playerId);
        instantiateAnswers($scope.thisPlayer);
        setResults();
    });

    /* ---------------------- Init ------------------------------------ */
    socket.emit('getGame');

    /* ---------------------- Destroy Listeners ----------------------- */
    $scope.$on('$destroy', function () {
        socket.removeAllListeners();
    });
}]);