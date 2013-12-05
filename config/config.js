/*
 * trivia
 * http://www.ryannel.co.za
 *
 * Copyright (c) 2013 Ryan Nel
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {
    // Server port
    port: process.env.PORT || 3000,

    // IMDB URL to be scraped
    url: 'http://www.imdb.com/chart/top?ref_=nb_mv_3_chttp',

    requestHeader: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Accept-Charset' : 'utf-8',
        'Accept-Language' : 'en-US'
    },

    // Static movie listing for fallback (JSON)
    static: __dirname + '/../data/movies.json',

    // Number of questions per round
    gameLength: 8,

    /*
     * Point allocation
     */
    wrong: -3,
    right: +5,
    noAnswer: 0
};