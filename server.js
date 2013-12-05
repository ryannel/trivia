/*
 * trivia
 * http://www.ryannel.co.za
 *
 * Copyright (c) 2013 Ryan Nel
 * Licensed under the MIT license.
 */

// Module dependencies
var express = require('express'),
    config = require('./config/config'),
    data = require('./lib/data'),
    socket = require('./lib/trivia/socket');

var port = config.port;

var app = module.exports = express();
var server = require('http').createServer(app);

data.load(function () {
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', socket);
});

app.use(express.static('public'));
app.use( app.router );
app.use(function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

server.listen(port, function () {
  console.log('Trivia app started on port ' + port);
});