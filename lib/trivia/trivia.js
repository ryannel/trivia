/*
 * trivia
 * http://www.ryannel.co.za
 *
 * Copyright (c) 2013 Ryan Nel
 * Licensed under the MIT license.
 */

'use strict';

var Trivia = function () {
    this.data = require('../data');
    this.lib = require('../lib');
    this.config = require('../../config/config');

    this.games = {};
    this.players = {};

    /*
     * Configuration Variables
     */
    this.gameLength = this.config.gameLength;

    //Point allocation
    this.right = this.config.right;
    this.wrong = this.config.wrong;
    this.noAnswer = this.config.noAnswer;

    this.createGame = function (client) {
        if (typeof this.players[client] === 'undefined') {
            var game = {
                players: [{
                    id: client,
                    answers: [],
                    score: null,
                }], 
                status: false
            };
            this.games[client] = game;
            this.players[client] = client;
        }
    };

    this.joinGame = function (client) {
        var game = this.getAvailable()[0];

        if (typeof game !== 'undefined' && this.games[game].players.length < 2) {
            this.games[game].players.push({
                id: client,
                answers: [],
                score: null,
            });
            this.players[client] = game;
            return game;
        }
        return false;
    };

    this.startGame = function (gameId) {
        var game = this.games[gameId];
        game.status = true;

        var questions = this.getQuestions();
        game.questions = questions;
    };

    this.removePlayer = function (client) {
        var game = this.players[client];
        if (typeof game !== 'undefined') {
            delete this.players[client];

            for (var i = 0; i < this.games[game].players.length; i++) {
                if (this.games[game].players[i].id === client) {
                    this.games[game].players.splice(i, 1);
                }
            }
            if ( ! this.games[game].players.length) {
                delete this.games[game];
            }
        }
    };

    this.setAnswers = function (results, client) {
        var gameId = this.getPlayerGameId(client);
        var game = this.getGame(gameId);

        // Get pointer to play objects
        var resultsPlayer = this.getPlayerPointer(results, client);
        var player = this.getPlayerPointer(game, client);
        player.answers = resultsPlayer.answers;

        this.calculateScore(gameId);
    };

    this.calculateScore = function (gameId) {
        var game = this.getGame(gameId);

        if ( ! game) {
            return false;
        }
        var answers = game.questions.answers;

        // Loop over players
        for (var i = 0; i < game.players.length; i++) {
            var playerAnswers = game.players[i].answers;
            var score = 0;

            // Loop over player answers
            if (playerAnswers.length > 0) {
                for (var inc = 0; inc < playerAnswers.length; inc++) {
                    if (playerAnswers[inc] === "") {
                        score += this.noAnswer;
                    } else if (playerAnswers[inc] === answers[inc]) {
                        score += this.right;
                    } else {
                        score += this.wrong;
                    }
                }
                game.players[i].score = score;
            }
        }
    };

    this.getAvailable = function () {
        var available = [];

        var keys = Object.keys(this.games);
        for (var key in keys) {
            var game = this.games[keys[key]];

            if ( ! game.status && game.players.length < 2) {
                available.push(keys[key]);                
            }
        }
        return available;
    };

    this.getQuestions = function () {
        var questions = [];
        var answers = [];
        var movies = this.data.movies;

        console.log(movies);

        // Shuffel movies and fetch the selected number of questions
        movies = this.lib.shuffel(movies).splice(0, this.gameLength);

        // Create question and answer arrays
        for (var key in movies) {
            questions.push(movies[key].title);
            answers.push(movies[key].date);
        }
        var result = {
            questions: questions, 
            answers: answers
        };
        return result;
    };

    this.getGame = function (gameId) {
        var game = this.games[gameId];
        if (typeof game !== 'undefined') {
            return game;
        }
        return false;
    };

    this.getPlayerGame = function (gameId) {
        var game = this.getGame(gameId);

        if (game) {
            // Break reference
            game = this.lib.clone(game);
            if (game.questions) {
                // Remove answers before sending
                delete game.questions.answers;
            }
            return game;
        } else {
            return false;
        }
    };

    this.getPlayerGameId = function (client) {
        return this.players[client];
    };

    this.getPlayerPointer = function (game, player) {
        for (var i = 0; i < game.players.length; i++) {
            if (game.players[i]['id'] === player) {
                return game.players[i];
            }
        }
    };
};

module.exports = Trivia;