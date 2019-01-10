'use strict';
/**
 * This web server is only intended for local testing.
 * index.js intended to be deployed as a cloud lambda function.
 **/


const express  = require('express');
const helmet   = require('helmet');

//var http = require('http');
const app      = express();
//var path     = require('path');
const bodyParser = require('body-parser');
//require('dotenv').config({silent:true}) // Switch to Env loading of config?

// Require Route Modules
const index     = require(__dirname + '/index.js');

const PORT = 8080;

app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Load Routes
//app.use('/auth', auth);
//app.use('/api/v1', index);
//app.use('/v1', chat);
//app.use('/', index);

app.get('/images/:imageID', function(req, res) {
	index.images(req, res);
});

app.put('/images/:imageID', function(req, res) {
	index.images(req, res);
});

app.post('/images', function(req, res) {
	index.images(req, res);
});

app.put('/images', function(req, res) {
	index.images(req, res);
});

app.get('*', function(req, res) {
	res.sendStatus(404);
});


//http.createServer(app);
// Launch Server
if(require.main === module) {
	app.listen(PORT, function(){
		console.log('Express listening on port ' + PORT);
	});
}
else exports.app = app;
