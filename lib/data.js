/*
 * trivia
 * http://www.ryannel.co.za
 *
 * Copyright (c) 2013 Ryan Nel
 * Licensed under the MIT license.
 */

'use strict';

var config = require('../config/config'),
    lib = require('./lib'),
    cheerio = require('cheerio'),
    request = require('request'),
    fs = require('fs');

var url = config.url,
    fallback = config.static;

var movies = [];

function parse (response) {
    var $ = cheerio.load(response);
    var titles = $('.chart .titleColumn');

    titles.each(function() {
        var movie = {};

        $(this).find('a').each(function() {
            movie.title = this.text();
        });
        $(this).find('span').each(function() {
            movie.date = this.text().replace(/\D/g,'');
        });
        movies.push(movie);
    });
    console.log(movies.length + ' movies scraped from ' + url + '.');
}

function loadStatic () {
    try {
        var data = fs.readFileSync(fallback);
        data = JSON.parse(data);
        lib.pushArray(movies, data);
        console.log(movies.length + ' movies loaded from ' + fallback);
    }
    catch (err) {
        throw err;
    }
}

exports.load = function (callback) {
    request({url: url, headers: config.requestHeader} , function(err, resp, body) {
        if (err) {
            loadStatic();
            console.log('Failed to connect to ' + url);
        } else {
            parse(body);
        }
        callback.call(this);
    });
};

exports.movies = movies;