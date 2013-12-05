/*
 * trivia
 * http://www.ryannel.co.za
 *
 * Copyright (c) 2013 Ryan Nel
 * Licensed under the MIT license.
 */

'use strict';

var Trivia = require('./trivia');

var trivia = new Trivia();

module.exports = function (socket) {

    function updateGameData (game) {
        if (!game) {
            socket.emit('getGame', false);
            return false;
        } 

        for (var i = 0; i < game.players.length; i++) {
            var socketId = game.players[i].id;
            var thisSocket = socket.namespace.sockets[socketId];
            if (thisSocket) {
                thisSocket.emit('getGame', game);
            }
        } 
    }

    function broadcastAvailable () {
        socket.emit('available', trivia.getAvailable().length); 
        socket.broadcast.emit('available', trivia.getAvailable().length);
    }

    function broadcastJoin (gameId) {
        if (gameId) {
            var game = trivia.getGame(gameId);
            for (var i = 0; i < game.players.length; i++) {
                var socketId = game.players[i].id;
                var thisSocket = socket.namespace.sockets[socketId];
                thisSocket.emit('join', gameId);
            }
        } else {
            socket.emit('join', false);
        }
    }

    function disconnect () {
        trivia.removePlayer(this.id);
        broadcastAvailable();
    }

    socket.on('getId', function () {
        socket.emit('getId', this.id);
    });

    socket.on('create', function () {
        trivia.removePlayer(this.id);
        trivia.createGame(this.id);
        broadcastAvailable();
    });

    socket.on('join', function () {
        trivia.removePlayer(this.id);
        broadcastJoin(trivia.joinGame(this.id));
        broadcastAvailable();
    });

    socket.on('start', function () {
        var game = trivia.getPlayerGameId(this.id);
        trivia.startGame(game);
        broadcastAvailable();
    });

    socket.on('getGame', function () {
        var game = trivia.getPlayerGameId(this.id);
        game = trivia.getPlayerGame(game);
        updateGameData(game);
    });

    socket.on('setAnswers', function (game) {
        trivia.setAnswers(game, this.id);
    });

    socket.on('menu', function () {
        disconnect.call(this);
    });

    socket.on('disconnect', function () {
        disconnect.call(this);
    });
};