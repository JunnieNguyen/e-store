﻿// Dependencies
var express = require('express');
var http = require('http');

var path = require("path");
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var auth = require('./config/auth');
var errorHelper = require('./config/errorHelper');

// Express
var server = express();
var router = express.Router();
server.use(morgan('dev'));  // log every request to the console
server.use(cookieParser()); // read cookies (needed for auth)
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());


/* ----------- Setup Server -----------*/
auth.setup(server);
//server.set('port', process.env.PORT || 3000);
server.set('port', 3000);


/* ----------- Register API -----------*/
server.use('/api', require('./routes/api'));
server.use('/api/brand', require('./routes/brand'));
server.use('/api/product', require('./routes/product'));
server.use('/api/account', require('./routes/account'));
server.use('/api/user', require('./routes/user'));
server.use('/api/review', require('./routes/review'));

/* ----------- Error Handling -----------*/
server.use(function (error, request, response, next) {
	response.status(500);
	response.json(errorHelper.errorHandler(error));
});


/* ----------- Register Angular serverlication -----------*/
server.use('/app', express.static(path.join(__dirname, 'client/app')));
server.use('/img', express.static(path.join(__dirname, 'client/img')));
server.use('/libs', express.static(path.join(__dirname, 'client/libs')));


// Render page at Client Side
server.get('/', function (request, response) {
	response.sendFile(path.join(__dirname + '/client/index.html'));	
});

// export
module.exports = server;