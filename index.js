var log4js 				= require('log4js');
var log 				= log4js.getLogger('index.js');

var express 			= require('express');
var app 				= express();

var naked 				= require('./routes/naked.js');
var authed 				= require('./routes/authed.js');


var prefix = '/api/v1';

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//app.use(bodyParser.json())

app.use('/', express.static(__dirname + '/static'));
app.use(prefix+'/naked',naked);
app.use(prefix+'/authed',authed);

var port = process.env.PORT || 3000;
app.listen(port, function () {
	log.info('Example app listening on port [%s]!',port);
});