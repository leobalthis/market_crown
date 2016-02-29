var log4js 				= require('log4js');
var log 				= log4js.getLogger('tracer.js');

var express 			= require('express');
var app 				= express();

app.get('/', function (req, res) {
	res.send('Hello World!');
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	log.info('TRACER listening on port [%s]!',port);
});